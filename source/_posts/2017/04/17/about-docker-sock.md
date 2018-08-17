---
title: 关于/var/run/docker.sock

date: 2017-04-17 12:00:00

tags: [Docker, 翻译]

---

**译者按:** 这篇博客介绍了什么是**/var/run/docker.sock**，以及如何使用**/var/run/docker.sock**与Docker守护进程通信，并且提供了两个简单的示例。理解这些，我们就可以运行一些**能够管理Docker的Docker容器**，比如Portainer、Kubernetes，是不是很神奇呢？

<!-- more -->

原文: [About /var/run/docker.sock](https://medium.com/lucjuggery/about-var-run-docker-sock-3bfd276e12fd)

译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译。**

运行过Docker Hub的Docker镜像的话，会发现其中一些容器时需要挂载**/var/run/docker.sock**文件。**这个文件是什么呢？为什么有些容器需要使用它？**简单地说，它是**Docker守护进程(Docker daemon)**默认监听的**Unix域套接字(Unix domain socket)**，容器中的进程可以通过它与Docker守护进程进行通信。

<div style="text-align: center;">
<img style="width:70%;" src="about-docker-sock/01.png" />
</div>

图片来源: [http://blog.honeybadger.io](http://blog.honeybadger.io/how-unicorn-talks-to-nginx-an-introduction-to-unix-sockets-in-ruby/)

### 举例

不妨看一下 [Portainer](http://portainer.io/)，它提供了图形化界面用于管理Docker主机和Swarm集群。如果使用Portainer管理本地Docker主机的话，需要绑定**/var/run/docker.sock**:

```bash
docker run -d -p 9000:9000 -v /var/run/docker.sock:/var/run/docker.sock portainer/portainer
```

访问9000端口可以查看图形化界面，可以管理容器(container)，镜像(image)，数据卷(volume)...

<div style="text-align: center;">
<img style="width:70%;" src="about-docker-sock/02.png" />
</div>

Portainer通过绑定的**/var/run/docker.sock**文件与**Docker守护进程**通信，执行各种管理操作。

### Docker守护进程的API

安装Docker之后，Docker守护进程会监听Unix域套接字：/var/run/docker.sock。这一点可以通过Docker daemon的配置选项看出来(在ubuntu上执行cat /etc/default/docker )：

```bash
-H unix:///var/run/docker.sock
```

注: 监听网络TCP套接字或者其他套接字需要配置相应的**-H**选项。

[Docker engine API v1.27](https://docs.docker.com/engine/api/v1.27) (最新版)定义的所有HTTP接口都可以通过/var/run/docker.sock调用。

### 运行容器

使用Portainer的UI，可以轻松创建容器。实际上，HTTP请求是通过docker.sock发送给Docker守护进程的。可以通过[*curl*](https://curl.haxx.se/)创建容器来说明这一点。使用HTTP接口运行容器需要两个步骤，先创建容器，然后启动容器。

#### 1. 创建nginx容器

curl命令通过Unix套接字发送**{“Image”:”nginx”}**到Docker守护进程的**/containers/create**接口，这个将会基于Nginx镜像创建容器并返回容器的ID。

```bash
curl -XPOST --unix-socket /var/run/docker.sock -d ‘{“Image”:”nginx”}’ -H ‘Content-Type: application/json’ http://localhost/containers/create
```

输出返回了容器ID:

```javascript
{“Id”:”fcb65c6147efb862d5ea3a2ef20e793c52f0fafa3eb04e4292cb4784c5777d65",”Warnings”:null}
```

#### 2. 启动nginx容器

使用返回的容器ID，调用**/containers/<ID>/start**接口，即可启动新创建的容器。

```bash
curl -XPOST --unix-socket /var/run/docker.sock http://localhost/containers/fcb6...7d65/start
```

查看已启动的容器:

```
docker ls
CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES
fcb65c6147ef nginx “nginx -g ‘daemon …” 5 minutes ago Up 5 seconds 80/tcp, 443/tcp ecstatic_kirch
...
```

可知，使用docker.sock运行容器其实非常简单。

### Docker守护进程的事件流

Docker的API提供了**/events**接口，可以用于获取Docker守护进程产生的所有事件流。负载均衡组件(load balancer)组件可以通过它获取容器的创建/删除事件，从而动态地更新配置。通过创建一个简单的容器，我们可以了解如何利用Docker守护进程的事件。

#### 1. 运行alpine容器

下面的命令用于运行容器，并采用交互模式(interactive mode，该模式下会直接进入容器内)，同时绑定docker.sock。

```bash
docker run -v /var/run/docker.sock:/var/run/docker.sock -ti alpine sh
```

#### 2. 监听Docker守护进程的事件流

在alpine容器内，可以通过Docker套接字发送HTTP请求到**/events**接口。这个命令会一直等待Docker daemon的事件。当新的事件发生时(例如创建了新的容器)，会看到输出信息。

```bash
curl --unix-socket /var/run/docker.sock http://localhost/events
```

#### 3. 观察事件

基于Nginx镜像运行容器之后，通过aplpine容器的标准输出可以观察到Docker daemon生成的事件。

```bash
docker run -p 8080:80 -d nginx
```

可以观察到3个事件：

- 创建容器
- 连接默认的桥接网络(bridge network)
- 启动容器

### 结论

希望这些简单的解释可以帮助大家理解**/var/run/docker.sock**文件，并且明白它绑定到容器时有何作用。显然，真正的应用会使用代码而不是curl命令给Docker守护进程发送HTTP请求。

注意: 绑定Docker套接字之后，容器的权限会很高，可以控制Docker守护进程。因此，这一点必须谨慎使用，只能用于足够信任的容器。
