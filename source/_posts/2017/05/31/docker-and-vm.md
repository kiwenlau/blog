---
title: 虚拟机与Docker有何不同？

date: 2017-05-31 09:00:00

tags: [Docker, 翻译]

---

**译者按:** 各种**虚拟机**技术开启了**云计算**时代；而**Docker**，作为下一代虚拟化技术，正在改变我们**开发、测试、部署**应用的方式。那**虚拟机**与**Docker**究竟有何不同呢?

<!-- more -->

原文: [Comparing Virtual Machines vs Docker Containers](https://diveintodocker.com/blog/comparing-virtual-machines-vs-docker-containers)

译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译。另外，本文版权归原作者所有，翻译仅用于学习**。

首先，大家需要明确一点，**Docker容器**不是**虚拟机**。

2014年，当我第一次接触Docker的时候，我把它比做一种轻量级的虚拟机。这样做无可厚非，因为Docker最初的成功秘诀，正是它比虚拟机更节省内存，启动更快。Docker不停地给大家宣传，"虚拟机需要数分钟启动，而Docker容器只需要50毫秒"。

然而，**Docker容器**并非**虚拟机**，我们不妨来比较一下它们。

### 理解虚拟机

使用**虚拟机**运行多个相互隔离的应用时，如下图:

<div style="text-align: center;">
<img style="width:60%;" src="docker-and-vm/vm.jpg" />
</div>

#### 从下到上理解上图:

- **基础设施(Infrastructure)**。它可以是你的**个人电脑**，数据中心的**服务器**，或者是**云主机**。
- **主操作系统(Host Operating System)**。你的个人电脑之上，运行的可能是**MacOS**，**Windows**或者某个**Linux**发行版。
- **虚拟机管理系统(Hypervisor)**。利用Hypervisor，可以在**主操作系统**之上运行多个不同的**从操作系统**。类型1的Hypervisor有支持MacOS的**HyperKit**，支持Windows的**Hyper-V**以及支持Linux的**KVM**。类型2的Hypervisor有VirtualBox和VMWare。
- **从操作系统(Guest Operating System)**。假设你需要运行3个相互隔离的应用，则需要使用Hypervisor启动3个**从操作系统**，也就是3个**虚拟机**。这些虚拟机都非常大，也许有700MB，这就意味着它们将占用2.1GB的磁盘空间。更糟糕的是，它们还会消耗很多CPU和内存。
- **各种依赖**。每一个**从操作系统**都需要安装许多依赖。如果你的的应用需要连接PostgreSQL的话，则需要安装**libpq-dev**；如果你使用Ruby的话，应该需要安装gems；如果使用其他编程语言，比如Python或者Node.js，都会需要安装对应的依赖库。
- **应用**。安装依赖之后，就可以在各个**从操作系统**分别运行应用了，这样各个应用就是相互隔离的。

### 理解Docker容器

使用**Docker容器**运行多个相互隔离的应用时，如下图:

<div style="text-align: center;">
<img style="width:60%;" src="docker-and-vm/docker.jpg" />
</div>

不难发现，相比于**虚拟机**，**Docker**要简洁很多。因为我们不需要运行一个臃肿的**从操作系统**了。

#### 从下到上理解上图:

- **基础设施(Infrastructure)**。
- **主操作系统(Host Operating System)**。所有主流的Linux发行版都可以运行Docker。对于MacOS和Windows，也有一些办法"运行"Docker。
- **Docker守护进程(Docker Daemon)**。Docker守护进程取代了Hypervisor，它是运行在操作系统之上的后台进程，负责管理Docker容器。
- **各种依赖**。对于Docker，应用的所有依赖都打包在**Docker镜像**中，**Docker容器**是基于**Docker镜像**创建的。
- **应用**。应用的源代码与它的依赖都打包在**Docker镜像**中，不同的应用需要不同的**Docker镜像**。不同的应用运行在不同的**Docker容器**中，它们是相互隔离的。

### 对比虚拟机与Docker

 **Docker守护进程**可以直接与**主操作系统**进行通信，为各个**Docker容器**分配资源；它还可以将容器与**主操作系统**隔离，并将各个容器互相隔离。**虚拟机**启动需要数分钟，而**Docker容器**可以在数毫秒内启动。由于没有臃肿的**从操作系统**，Docker可以节省大量的磁盘空间以及其他系统资源。

说了这么多Docker的优势，大家也没有必要完全否定**虚拟机**技术，因为两者有不同的使用场景。**虚拟机**更擅长于彻底隔离整个运行环境。例如，云服务提供商通常采用虚拟机技术隔离不同的用户。而**Docker**通常用于隔离不同的应用，例如**前端**，**后端**以及**数据库**。

如果你对Docker感兴趣的话，不妨学习一下[Dive Into Docker course](https://diveintodocker.com/courses/dive-into-docker)。


欢迎加入[我们Fundebug](https://fundebug.com/)的**Docker技术交流群: 305097057**。

<div style="text-align: center;">
<img style="width:30%;" src="http://opu5mq5tf.bkt.clouddn.com/qq_docker.JPG" />
</div>