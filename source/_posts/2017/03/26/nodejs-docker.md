---

title: 当Node.js遇见Docker

date: 2017-03-26 21:00:00

tags: [Node.js, Docker, 原创]

---


[Node.js Best Practices - How to Become a Better Developer in 2017](https://blog.risingstack.com/node-js-best-practices-2017/)提到的几点，[我们Fundebug](https://fundebug.com/)深有同感:

- 使用ES6
- 使用Promise
- 使用LTS
- 使用[Docker](https://www.docker.com/)
- ...

<!-- more -->

想必大家都知道ES6，Promise以及LTS，那[Docker](https://www.docker.com/)是啥玩意啊？翻遍[Node文档](https://nodejs.org/api/)也没见踪迹啊!

<div style="text-align: center;">
<img style="width:80%;" src="nodejs-docker/nodejs-docker.png" />
</div>

**GitHub仓库:** [Fundebug/nodejs-docker](https://github.com/Fundebug/nodejs-docker)

### 什么是Docker?

Docker是最流行的的容器工具，**没有之一**。本文并不打算深入介绍Docker，不过可以从几个简单的角度来理解Docker。

##### 从进程的角度理解Docker

在Linux中，所有的进程构成了一棵树。可以使用[pstree](http://man7.org/linux/man-pages/man1/pstree.1.html)命令进行查看:

```bash
pstree
init─┬─VBoxService───7*[{VBoxService}]
     ├─acpid
     ├─atd
     ├─cron
     ├─dbus-daemon
     ├─dhclient
     ├─dockerd─┬─docker-containe─┬─docker-containe─┬─redis-server───2*[{redis-server}]
     │         │                 │                 └─8*[{docker-containe}]
     │         │                 ├─docker-containe─┬─mongod───16*[{mongod}]
     │         │                 │                 └─8*[{docker-containe}]
     │         │                 └─11*[{docker-containe}]
     │         └─13*[{dockerd}]
     ├─6*[getty]
     ├─influxd───9*[{influxd}]
     ├─irqbalance
     ├─puppet───{puppet}
     ├─rpc.idmapd
     ├─rpc.statd
     ├─rpcbind
     ├─rsyslogd───3*[{rsyslogd}]
     ├─ruby───{ruby}
     ├─sshd─┬─sshd───sshd───zsh───pstree
     │      ├─sshd───sshd───zsh
     │      └─sshd───sshd───zsh───mongo───2*[{mongo}]
     ├─systemd-logind
     ├─systemd-udevd
     ├─upstart-file-br
     ├─upstart-socket-
     └─upstart-udev-br
```

可知，init进程为所有进程的根(root)，其PID为1。

Docker将不同应用的进程隔离了起来，这些被隔离的进程就是一个个容器。隔离是基于两个Linux内核机制实现的，Namesapce和Cgroups。

Namespace可以从UTD、IPC、PID、Mount，User和Network的角度隔离进程。比如，不同的进程将拥有不同PID空间，这样容器中的进程将看不到主机上的进程，也看不到其他容器中的进程。这与Node.js中模块化以隔离变量的命名空间的思想是异曲同工的。

通过Cgroups，可以限制进程对CPU，内存等资源的使用。简单地说，我们可以通过Cgroups指定容器只能使用1G内存。

从进程角度理解Docker，那**每一个Docker容器就是被隔离的进程及其子进程**。上文pstree的输出中可以分辨出2个容器: mongodb和redis。


##### 从文件的角度理解Docker

基于Namespace与Cgroups的容器工具其实早已存在，例如[Linux-VServer](http://linux-vserver.org/Welcome_to_Linux-VServer.org)，[OpenVZ](https://openvz.org/Main_Page)，[LXC](https://linuxcontainers.org/)。然而，真正引爆容器技术的却是后来者Docker。为什么呢？个人觉得是因为**Docker镜像**以及**Dockerfile**。

在Linux中，一切皆文件，进程的运行离不开各种各样的文件。跑一个简单的Node.js程序，传统的做法是手动安装各种依赖然后运行；而Docker则是将所有依赖（包括操作系统，Node，NPM模块，源代码）打包到一个**Docker镜像**中，然后基于这个镜像运行容器。

**Docker镜像**可以通过**Docker仓库**共享给其他人，这样他们只需要下载镜像即可运行程序。想象一下，当我们需要在另一台主机(比如生产服务器，新同事的机器)上运行一个Node.js应用，仅仅需要下载对应的Docker镜像就可以了，是不是很方便呢？

**Docker镜像**可以通过文本文件，即**Dockerfile**进行定义。不妨看一个简单的例子(由于不可抗力，这个Dockerfile构建大概会失败，仅作为参考):

```
# 基于Ubuntu
FROM ubuntu

# 安装Node.js与NPM
RUN apt-get update && apt-get -y install nodejs npm

# 安装NPM模块:Express
RUN npm install express

# 添加源代码
ADD app.js /
```

其中，**FROM**，**RUN**与**ADD**为Dockerfile命令。结合注释，该Dockerfile的含义非常直白。基于这个Dockerfile，使用**docker build**命令就可以构建对应的Docker镜像。基于这个Docker镜像，就可以运行Docker容器来执行app.js:

```js
var express = require("express");
var app = express();

app.get("/", function(req, res)
{
    res.send("Hello Fundebug!\n");
});

app.listen(3000);
```

Dockerfile实际上是将**Docker镜像代码化**了，另一方面也是将**安装依赖的过程代码化**了，于是我们就可以像管理源码一样使用git对Dockerfile进行版本管理。

### 为啥用Docker?

当你的系统越来越复杂的时候，你会发现Docker的价值。

##### 从应用架构角度理解Docker

刚开始，你只需要写一个Node.js程序，挂载一个静态网站；然后，你做了一个用户账号系统，这时需要数据库了，比如说MySQL; 后来，为了提升性能，你引入了Memcached缓存；终于有一天，你决定把前后端分离，这样可以提高开发效率；当用户越来越多，你又不得不使用Nginx做反向代理; 对了，随着功能越来越多，你的应用依赖也会越来越多...总之，你的应用架构只会越来越复杂。不同的组件的安装，配置与运行步骤各不相同，于是你不得不写一个很长的文档给新同事，只为了让他搭建一个**开发环境**。

使用Docker的话，你可以为不同的组件逐一编写Dockerfile，分别构建镜像，然后运行在各个容器中。这样做，将复杂的架构统一了，所有组件的安装和运行步骤统一为几个简单的命令: 

- 构建Docker镜像: docker build
- 上传Docker镜像: docker push
- 下载Docker镜像: docker pull
- 运行Docker容器: docker run

##### 从应用部署角度理解Docker

通常，你会有**开发**，**测试**和**生产**服务器，对于某些应用，还会需要进行**构建**。不同步骤的依赖会有一些不同，并且在不同的服务器上执行。如果手动地在不同的服务器上安装依赖，是件很麻烦的事情。比如说，当你需要为Node.js应用添加一个新的npm模块，或者升级一下Node.js，是不是得重复操作很多次？友情提示一下，手动敲命令是极易出错的，有些失误会导致致命的后果（参考最近Gitlab误删数据库与AWS的S3故障）。

如果使用Docker的话，**开发**、**构建**、**测试**、**生产**将全部在Docker容器中执行，你需要为不同步骤编写不同的Dockerfile。当依赖变化时，仅需要稍微修改Dockerfile即可。结合构建工具[Jenkins](https://jenkins.io/)，就可以将整个部署流程自动化。

另一方面，Dockerfile将Docker镜像描述得非常精准，能够保证很强的一致性。比如，操作系统的版本，Node.js的版本，NPM模块的版本等。这就意味着，在本地开发环境运行成功的镜像，在**构建**、**测试**、**生产**环境中也没有问题。还有，不同的Docker容器是依赖于不同的Docker镜像，这样他们互不干扰。比如，两个Node.js应用可以分别使用不同版本的Node.js。

##### 从集群管理角度理解Docker

架构规模越来越大的时候，你有必要引入集群了。这就意味着，服务器由1台变成了多台，同一个应用需要运行多个备份来分担负载。当然，你可以手动对集群的功能进行划分: Nginx服务器，Node.js服务器，MySQL服务器，测试服务器，生产服务器...这样做的好处是简单粗暴；也可以说财大气粗，因为资源闲置会非常严重。还有一点，每次新增节点的时候，你就不得不花大量时间进行安装与配置，这其实是一种低效的重复劳动。

下载Docker镜像之后，Docker容器可以运行在集群的任何一个节点。一方面，各个组件可以共享主机，且互不干扰；另一方面，也不需要在集群的节点上安装和配置任何组件。至于整个Docker集群的管理，业界有很多成熟的解决方案，例如[Mesos](http://mesos.apache.org/)，[Kubernetes](https://kubernetes.io/)与[Docker Swarm](https://github.com/docker/swarm)。这些集群系统提供了**调度**，**服务发现**，**负载均衡**等功能，让整个集群变成一个整体。

### 如何用Docker?

##### 编写Dockerfile

正确的[Dockerfile](https://github.com/Fundebug/nodejs-docker/blob/master/Dockerfile)是这样的:

```
# 使用DaoCloud的Ubuntu镜像
FROM daocloud.io/library/ubuntu:14.04

# 设置镜像作者
MAINTAINER Fundebug <help@fundebug.com>

# 设置时区
RUN sudo sh -c "echo 'Asia/Shanghai' > /etc/timezone" && \
    sudo dpkg-reconfigure -f noninteractive tzdata

# 使用阿里云的Ubuntu镜像
RUN echo '\n\
deb http://mirrors.aliyun.com/ubuntu/ trusty main restricted universe multiverse\n\
deb http://mirrors.aliyun.com/ubuntu/ trusty-security main restricted universe multiverse\n\
deb http://mirrors.aliyun.com/ubuntu/ trusty-updates main restricted universe multiverse\n\
deb http://mirrors.aliyun.com/ubuntu/ trusty-proposed main restricted universe multiverse\n\
deb http://mirrors.aliyun.com/ubuntu/ trusty-backports main restricted universe multiverse\n\
deb-src http://mirrors.aliyun.com/ubuntu/ trusty main restricted universe multiverse\n\
deb-src http://mirrors.aliyun.com/ubuntu/ trusty-security main restricted universe multiverse\n\
deb-src http://mirrors.aliyun.com/ubuntu/ trusty-updates main restricted universe multiverse\n\
deb-src http://mirrors.aliyun.com/ubuntu/ trusty-proposed main restricted universe multiverse\n\
deb-src http://mirrors.aliyun.com/ubuntu/ trusty-backports main restricted universe multiverse\n'\
> /etc/apt/sources.list

# 安装node v6.10.1
RUN sudo apt-get update && sudo apt-get install -y wget

# 使用淘宝镜像安装Node.js v6.10.1
RUN wget https://npm.taobao.org/mirrors/node/v6.10.1/node-v6.10.1-linux-x64.tar.gz && \
    tar -C /usr/local --strip-components 1 -xzf node-v6.10.1-linux-x64.tar.gz && \
    rm node-v6.10.1-linux-x64.tar.gz 

WORKDIR /app

# 安装npm模块
ADD package.json /app/package.json

# 使用淘宝的npm镜像
RUN npm install --production -d --registry=https://registry.npm.taobao.org

# 添加源代码
ADD . /app

# 运行app.js
CMD ["node", "/app/app.js"]
```

有几点值得注意的地方：

- 使用国内[DaoCloud](https://www.daocloud.io/)的Docker仓库，阿里云的ubuntu镜像以及淘宝的npm镜像，否则会出事情的;
- 将时区设为Asia/Shanghai，否则日志的时间会不大对劲;
- 使用.dockerignore忽略不需要添加到Docker镜像的文件和目录，其语法与.gitigore一致;

更重要的一点是，**package.json需要单独添加**。Docker在构建镜像的时候，是一层一层构建的，仅当这一层有变化时，重新构建对应的层。如果package.json和源代码一起添加到镜像，则每次修改源码都需要重新安装npm模块，这样木有必要。所以，正确的顺序是: 添加package.json；安装npm模块；添加源代码。

##### 构建Docker镜像

使用**docker build**命令构建Docker镜像

```bash
sudo docker build -t fundebug/nodejs .
```

其中，-t选项用于指定镜像的名称。

使用**docker images**命令查看Docker镜像

```bash
sudo docker images
REPOSITORY                    TAG                 IMAGE ID            CREATED             SIZE
fundebug/nodejs               latest              64530ce811a1        32 minutes ago      266.4 MB
daocloud.io/library/ubuntu    14.04               b969ab9f929b        9 weeks ago         188 MB
```

可知，fundebug/nodejs镜像的大小为266.4MB，在ubuntu镜像的基础上增加了80MB左右。

##### 运行Docker容器

使用**docker run**命令运行Docker容器

```bash
sudo docker run -d --net=host --name=hello-fundebug fundebug/nodejs
```

其中，-d选项表示容器在后台运行；--net选项指定容器的网络模式，host表示与主机共享网络；--name指定了容器的名称。

使用**docker ps**命令查看Docker容器

```bash
sudo docker ps
CONTAINER ID        IMAGE                             COMMAND                  CREATED             STATUS              PORTS               NAMES
e8eb5473970c        fundebug/nodejs                   "node /app/app.js"       37 minutes ago      Up 37 minutes                           hello-
```

可知，COMMAND为"node /app/app.js"，表示容器中运行的命令。这是我们再Dockerfile中使用CMD指定的。不妨使用**docker exec**命令在容器内执行ps命令**查看容器内的进程**：

```bash
sudo docker exec hello-fundebug ps -f
UID        PID  PPID  C STIME TTY          TIME CMD
root         1     0  0 15:14 ?        00:00:00 node /app/app.js
```

可知，容器内的1号进程即为node进程**node /app/app.js**。在Linux中，PID为1进程按说是唯一的，即init进程。但是，容器使用了内核的Namespace机制，为容器创建了独立的PID空间，因此容器中也有1号进程。

##### 测试

使用curl命令访问:

```bash
curl localhost:3000
Hello Fundebug!
```

### 是否用Docker？

一方面，使用Docker能够带来很大益处；另一方面，引入Docker必然会有很多挑战，需要熟悉Docker才能应对自如。**想必这是一个艰难的决定**。如果从长远的角度来看，Docker正在成为应用开发，部署，发布的标准技术，也许我们不得不用开放的心态对待它。

作为Node.js开发者，真正理解Docker可能需要一些时间，但是它可以给你带来很多便利。欢迎加入[我们Fundebug](https://fundebug.com/)的**Node.js技术交流群**，老司机带你玩转酷炫的Docker技术。

<div style="text-align: center;">
<img style="width:30%;" src="http://opu5mq5tf.bkt.clouddn.com/qq_docker.JPG" />
</div>


### 参考链接

- [DOCKER基础技术：LINUX NAMESPACE（上）](http://coolshell.cn/articles/17010.html)
- [DOCKER基础技术：LINUX NAMESPACE（下）](http://coolshell.cn/articles/17029.html)
- [DOCKER基础技术：LINUX CGROUP](http://coolshell.cn/articles/17049.html)
- [从GITLAB误删除数据库想到的](http://coolshell.cn/articles/17680.html)
- [AWS 的 S3 故障回顾和思考](http://coolshell.cn/articles/17737.html)









