title: 基于Docker搭建Hadoop集群之升级版

date: 2016-06-12 10:00

tags: [Docker, Hadoop]

---

**摘要:** [kiwenlau/hadoop-cluster-docker](https://github.com/kiwenlau/hadoop-cluster-docker)是去年参加[Docker巨好玩](http://www.alauda.cn/2015/04/28/docker-great/)比赛开发的，得了[二等奖](http://www.alauda.cn/2015/06/11/presentation/)并赢了一块苹果手表，目前这个项目已经在GitHub上获得了236个Star，DockerHub的镜像下载次数2000+。总之，项目还算很受欢迎吧，这篇博客将介绍项目的升级版。

<!-- more -->

- 作者: [KiwenLau](http://kiwenlau.com/)
- 日期: [2016-06-12](http://kiwenlau.com/2016/06/12/160612-hadoop-cluster-docker-update/)

## 一. 项目介绍

将[Hadoop](http://hadoop.apache.org/)打包到[Docker](https://www.docker.com/)镜像中，就可以快速地在单个机器上搭建Hadoop集群，这样可以方便新手测试和学习。

如下图所示，Hadoop的master和slave分别运行在不同的Docker容器中，其中hadoop-master容器中运行NameNode和ResourceManager，hadoop-slave容器中运行DataNode和NodeManager。NameNode和DataNode是Hadoop分布式文件系统HDFS的组件，负责储存输入以及输出数据，而ResourceManager和NodeManager是Hadoop集群资源管理系统YARN的组件，负责CPU和内存资源的调度。

<img src="160612-hadoop-cluster-docker-update/hadoop-cluster-docker.png" width = "500"/>

之前的版本使用serf/dnsmasq为Hadoop集群提供DNS服务，由于Docker网络功能更新，现在并不需要了。更新的版本中，使用以下命令为Hadoop集群创建单独的网络:

```
sudo docker network create --driver=bridge hadoop
```

然后在运行Hadoop容器时，使用"--net=hadoop"选项，这时所有容器将运行在hadoop网络中，它们可以通过容器名称进行通信。

**项目更新要点：**

- 去除serf/dnsmasq
- 合并Master和Slave镜像
- 使用[kiwenlau/compile-hadoop](https://github.com/kiwenlau/compile-hadoop)项目编译的Hadoo进行安装
- 优化Hadoop配置

## 二. 3节点Hadoop集群搭建步骤

#### **1. 下载Docker镜像**

```
sudo docker pull kiwenlau/hadoop:1.0
```

#### **2. 下载GitHub仓库**

```
git clone https://github.com/kiwenlau/hadoop-cluster-docker
```

#### **3. 创建Hadoop网络**

```
sudo docker network create --driver=bridge hadoop
```

#### **4. 运行Docker容器**

```
cd hadoop-cluster-docker
./start-container.sh
```

**运行结果**

```
start hadoop-master container...
start hadoop-slave1 container...
start hadoop-slave2 container...
root@hadoop-master:~# 
```

- 启动了3个容器，1个master, 2个slave
- 运行后就进入了hadoop-master容器的/root目录

#### **5. 启动hadoop**

```
./start-hadoop.sh
```

#### **6. 运行wordcount**

```
./run-wordcount.sh
```

**运行结果**

```
input file1.txt:
Hello Hadoop
input file2.txt:
Hello Docker
wordcount output:
Docker	1
Hadoop	1
Hello	2
```

Hadoop网页管理地址:

- NameNode: [http://192.168.59.1:50070/](http://192.168.59.1:50070/)
- ResourceManager: [http://192.168.59.1:8088/](http://192.168.59.1:8088/)

192.168.59.1为运行容器的主机的IP。

## 三. N节点Hadoop集群搭建步骤

#### **1. 准备**

- 参考第二部分1~3：下载Docker镜像，下载GitHub仓库，以及创建Hadoop网络

#### **2. 重新构建Docker镜像**

```
./resize-cluster.sh 5
```
- 可以指定任意N(N>1)

#### **3. 启动Docker容器**

```
./start-container.sh 5
```
- 与第2步中的N保持一致。

#### **4. 运行Hadoop**

- 参考第二部分5~6：启动Hadoop，并运行wordcount。

## 参考

1. [基于Docker搭建多节点Hadoop集群](http://kiwenlau.com/2015/06/08/150608-hadoop-cluster-docker/)
2. [How to Install Hadoop on Ubuntu 13.10](https://www.digitalocean.com/community/tutorials/how-to-install-hadoop-on-ubuntu-13-10)

