title: 基于Docker搭建多节点Mesos/Marathon

date: 2016-07-10 10:00

tags: [Docker, Mesos, Marathon,原创]

---

**摘要:** 在之前的一篇博客中，我介绍了[基于Docker搭建单机版Mesos/Marathon](http://kiwenlau.com/2015/09/18/150918-single-mesos-docker/)，但是仅仅使用了单个节点。而在这篇博客中，我将介绍[基于Docker搭建多节点Mesos/Marathon](http://kiwenlau.com/2016/07/10/mesos-marathon-platform/)，开发者可以使用3个节点快速地搭建一个真正的分布式容器集群系统。**服务发现**和**负载均衡**是容器集群必不可少的功能，我选择了[Marathon LB](https://github.com/mesosphere/marathon-lb)来实现。

**GitHub地址:** [kiwenlau/mesos-marathon-platform](https://github.com/kiwenlau/mesos-marathon-platform)

<!-- more -->

- 作者: [KiwenLau](http://kiwenlau.com/)
- 日期: [2016-07-10](http://kiwenlau.com/2016/07/10/mesos-marathon-platform/)

<img src="mesos-marathon-platform/mesos-marathon-platform.png" width = "500"/>

## 一. Mesos/Marathon简介

#### **1. Mesos**

[Mesos](http://mesos.apache.org/)是**分布式集群资源管理系统**，负责调度集群内的CPU，内存以及磁盘等资源。Hadoop MapReduce, Spark以及Storm等**分布式计算框架**很流行，但是为每一个计算框架搭建单独的集群非常地浪费资源，也无法实现数据共享，而Mesos的设计初衷就是让不同的**分布式计算框架**能够共享一个集群。

Mesos资源调度算法分为两个层次: Mesos监控集群的空余资源，并将空余资源按照一定规则分配给各个计算框架；而各个计算框架会根据需要选择接受或者拒绝所分配的资源。这时，Mesos与各个计算框架都参与了资源的调度: Mesos负责分配资源; 而计算框架接受或者拒绝资源。因此，Mesos的责任非常清晰而且简单：分配集群资源。Mesos的双层调度算法提高了可扩展性，并且可以更方便地支持不同的计算框架。

目前主流的集群资源管理系统还有Hadoop YARN，Kubernetes以及Swarm。Hadoop YARN目前仅适合运行分布式计算框架例如Spark；Kubernetes与Swarm仅适合运行容器应用；而Mesos对分布式计算框架以及容器应用的支持都很成熟。并且，Kubernetes与Swarm可以作为计算框架运行在Mesos之上。Kubernetes的功能强大，但是有些过度设计导致复杂度很高，而Swarm的设计简单很多但是功能相对缺乏，大家可以根据需要选择。个人认为，**使用Mesos的话，最好选择Marathon作为容器编排系统**，架构非常简单，且功能丰富。

#### **2. Marathon**

[Marathon](https://mesosphere.github.io/marathon/)是容器编排系统，是运行于Mesos之上的众多计算框架之一。用户可以通过Marathon提交，监控并调度容器应用，然后Mesos负责运行容器。另外，[Aurora](http://aurora.apache.org/)与Marathon功能一致，同为容器编排系统。相比而言，Marathon的架构比Aurora更简单，没有从节点，且对[Docker](https://www.docker.com/)的支持更为完善。Marathon由Mesosphere公司负责开发，社区很活跃，文档也很完善。

Marathon具有**容错功能**：当容器由于节点崩溃等原因意外停止运行时，Marathon会自动将容器调度到其他节点。这一点类似进程管理工具例如[Supervisor](http://supervisord.org/)：当进程意外退出时，Supervisor会重启进程。然而，自动容错功能并不适合有状态服务，即带有数据卷(volume)的容器，例如MongoDB与MySQL。因为数据很难跨节点移动，目前的技术还不够成熟。因此，**Marathon目前仅适合运行无状态的服务，而数据库等有状态服务应该单独部署**。这样做也可以提高数据的安全性。

#### **3. Marathon LB**

[Marathon LB](https://github.com/mesosphere/marathon-lb)是Marathon的**服务发现**与**负载均衡**系统。Marathon LB通过使用[Haproxy](http://www.haproxy.org/)实现了代理服务器的功能。

当使用Marathon部署容器时，容器运行的节点(IP)与使用的端口(PORT)是Mesos/Marathon平台负责调度的，无法事先确定。这样的话，每次访问服务时，需要手动去查询容器运行的IP与PORT。并且，容器出错时会发生重新调度，IP与PORT会变化。因此，访问服务会非常不方便。通过使用Marathon LB可以配置服务的固定端口，而服务的IP就是运行Marathon LB的节点IP，这样每次部署服务时，IP与PORT是固定的，就方便很多了。Marathon LB会监听Marathon的调度事件，获取容器运行的IP与PORT，然后更新代理服务器Haproxy的配置文件。因此，当部署新的容器或者容器发生变化时，仍然可以通过固定的IP与PORT访问该容器。这就是所谓的**服务发现**。

同一个服务往往对应着多个容器副本，Marathon LB作为代理服务器，同时实现了**负载均衡**的功能。服务请求能够使用Round Robin方式发送给各个容器。
                           
## 二. 搭建步骤

#### **1. 创建虚拟机**

按照[使用Vagrant创建多节点虚拟机集群](http://kiwenlau.com/2016/07/03/vagrant-vm-cluster/)，可以快速地在单个机器上创建Mesos/Marathon平台运行所需要的3个虚拟机节点。

其中，node1为主机点(Master)，运行zookeeper, mesos_master, marathon以及marathon-lb容器; node2与node3为从节点(Slave)，运行mesos_slave容器；使用marathon部署nginx时，nginx容器运行在从节点上。如下表所示:

| 节点    | IP           | 运行的容器                                      |
|:------- |:-------------| :----------------------------------------------|
| node1  | 192.168.59.1 | zookeeper, mesos_master, marathon, marathon-lb |
| node2  | 192.168.59.2 | mesos_slave1, nginx                                   |
| node3  | 192.168.59.3 | mesos_slave2, nginx                                   |

#### **2. 开启Docker daemon的监听端口**

因为**start-containers.sh**使用了远程启动容器的方式，因此需要开启Docker daemon的TCP监听端口。提醒一下，**开启Docker daemon端口是不安全的**，生产环境中不能打开，或者做好防火墙配置。不希望开启Docker daemon的监听端口的话，可以使用start-containers.sh中的命令直接运行容器，只是稍微麻烦一点。

Master, Slave1和Slave2:

```
sudo vim /etc/default/docker
```

修改**DOCKER_OPTS**

```
DOCKER_OPTS="-H tcp://0.0.0.0:2375 -H unix:///var/run/docker.sock"
```

重启Docker

```
sudo restart docker
```

#### **3. 下载Docker镜像** 

Master:

```
sudo docker pull kiwenlau/zookeeper:3.4.8 
sudo docker pull kiwenlau/mesos:0.26.0 
sudo docker pull kiwenlau/marathon:1.1.1  
sudo docker pull kiwenlau/marathonlb:1.3.0
```

Slave1 和 Slave2:

```
sudo docker pull kiwenlau/mesos:0.26.0
```

#### **4. 下载GitHub仓库** 

Master:

```
git clone https://github.com/kiwenlau/mesos-marathon-platform
```


#### **5. 运行容器** 

Master:

```
cd mesos-marathon-platform
sudo ./start-containers.sh
```

网页管理:

- Mesos: [http://192.168.59.1:5050/](http://192.168.59.1:5050/)
- Marathon: [http://192.168.59.1:8080/](http://192.168.59.1:8080/)  


如果需要增加Slave节点，或者配置不同的节点IP，仅需修改start-contaniers.sh脚本中以下内容：

```
MASTER_IP=192.168.59.1
SLAVE_IP=(192.168.59.2 192.168.59.3)
```

#### **6. 运行Nginx:** 

下载nginx镜像(Slave1和Slave2):

```
sudo docker pull nginx:1.10
```

运行Nginx(Master):

```
sudo ./run-nginx.sh 
```

Nginx的的定义如下(nginx.json):

```
{
    "id": "nginx",
    "labels": {
        "HAPROXY_GROUP": "external"
    },
    "cpus": 0.2,
    "mem": 20.0,
    "instances": 2,
    "healthChecks": [{
        "path": "/"
    }],
    "container": {
        "type": "DOCKER",
        "docker": {
            "image": "nginx:1.10",
            "network": "BRIDGE",
            "portMappings": [{ "containerPort": 80, "hostPort": 0, "servicePort": 10000, "protocol": "tcp" }]
        }
    }
}
```

其中，servicePort表示nginx绑定的端口为**10000**，而marathon-lb容器运行的节点IP为**192.168.59.1**。因此nginx的访问地址为：

- [http://192.168.59.1:10000/](http://192.168.59.1:10000/)

而实际上，两个nginx容器运行在Slave节点上，且端口是随机分配的。


## 三. 参考

1. [Mesos: A Platform for Fine-Grained Resource Sharing in the Data Center](http://mesos.berkeley.edu/mesos_tech_report.pdf)
