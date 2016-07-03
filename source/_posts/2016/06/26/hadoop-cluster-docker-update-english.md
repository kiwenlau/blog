title: Run Hadoop Cluster in Docker Update

date: 2016-06-26 10:00

tags: [Docker, Hadoop]

---

**Abstract:** Last year, I developed [kiwenlau/hadoop-cluster-docker](https://github.com/kiwenlau/hadoop-cluster-docker) project, which aims to help user quickly build [Hadoop](http://hadoop.apache.org/) cluster on local host using [Docker](https://www.docker.com/). The project is quite popular with 250+ stars on [GitHub](https://github.com/kiwenlau/hadoop-cluster-docker) and 2500+ pulls on [Docker Hub](https://hub.docker.com/r/kiwenlau/hadoop-master/). In this blog, I'd like to introduce the update version.

<!-- more -->

- Author: [KiwenLau](http://kiwenlau.com/)
- Date: [2016-06-26](http://kiwenlau.com/2016/06/26/hadoop-cluster-docker-update-english/)

## Introduction

By packaging [Hadoop](http://hadoop.apache.org/) into [Docker](https://www.docker.com/) image, we can easily build a Hadoop cluster within Docker containers on local host. This is very help for beginners, who want to learn:

- How to configure Hadoop cluster correctly?
- How to run word count application?
- How to manage HDFS?
- How to run test program on local host?

Following figure shows the architecture of [kiwenlau/hadoop-cluster-docker](https://github.com/kiwenlau/hadoop-cluster-docker) project. Hadoop master and slaves run within different Docker containers, NameNode and ResourceManager run within hadoop-master container while DataNode and NodeManager run within hadoop-slave container. NameNode and DataNode are the components of Hadoop Distributed File System(**HDFS**), while ResourceManager and NodeManager are the components of Hadoop cluster resource management system called Yet Another Resource Manager(**YARN**). HDFS is in charge of storing input and output data, while YARN is in charge of managing CPU and Memory resources. 

<img src="hadoop-cluster-docker-update-english/hadoop-cluster-docker.png" width = "500"/>

In the old version, I use [serf](https://www.serfdom.io/)/[dnsmasq](http://www.thekelleys.org.uk/dnsmasq/doc.html) to provide DNS service for Hadoop cluster, which is not an elegant solution because it requires extra installation/configuration and it will delay the cluster startup procedure. Thanks to the enhancement of Docker network function, we don't need to use [serf](https://www.serfdom.io/)/[dnsmasq](http://www.thekelleys.org.uk/dnsmasq/doc.html) any more. We can create a independent network for Hadoop cluster using following command:

```
sudo docker network create --driver=bridge hadoop
```

By using "--net=hadoop" option when we start Hadoop containers, these containers will attach to the "hadoop" network and they are able to communicate with container name.

**Key points of update：**

- eliminate [serf](https://www.serfdom.io/)/[dnsmasq](http://www.thekelleys.org.uk/dnsmasq/doc.html) 
- merge master and slave image
- install Hadoop using [kiwenlau/compile-hadoop](https://github.com/kiwenlau/compile-hadoop)
- simplify Hadoop configuration

## 3 Nodes Hadoop Cluster

#### **1. pull docker image**

```
sudo docker pull kiwenlau/hadoop:1.0
```

#### **2. clone github repository**

```
git clone https://github.com/kiwenlau/hadoop-cluster-docker
```

#### **3. create hadoop network**

```
sudo docker network create --driver=bridge hadoop
```

#### **4. start container**

```
cd hadoop-cluster-docker
sudo ./start-container.sh
```

**output:**

```
start hadoop-master container...
start hadoop-slave1 container...
start hadoop-slave2 container...
root@hadoop-master:~# 
```
- start 3 containers with 1 master and 2 slaves
- you will get into the /root directory of hadoop-master container

#### **5. start hadoop**

```
./start-hadoop.sh
```

#### **6. run wordcount**

```
./run-wordcount.sh
```

**output**

```
input file1.txt:
Hello Hadoop

input file2.txt:
Hello Docker

wordcount output:
Docker    1
Hadoop    1
Hello    2
```

## Arbitrary size Hadoop cluster

#### **1. pull docker images and clone github repository**

do 1~3 like previous section

#### **2. rebuild docker image**

```
sudo ./resize-cluster.sh 5
```
- specify parameter > 1: 2, 3..
- this script just rebuild hadoop image with different **slaves** file, which pecifies the name of all slave nodes


#### **3. start container**

```
cd hadoop-cluster-docker
sudo ./start-container.sh 5
```
- use the same parameter as the step 2

#### **4. run hadoop cluster** 

do 5~6 like previous section

## References

1. [Quickly build arbitrary size Hadoop Cluster based on Docker](http://kiwenlau.blogspot.jp/2015/05/quickly-build-arbitrary-size-hadoop.html)
2. [How to Install Hadoop on Ubuntu 13.10](https://www.digitalocean.com/community/tutorials/how-to-install-hadoop-on-ubuntu-13-10)

