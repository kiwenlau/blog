title: 基于Docker搭建单机版Mesos/Marathon

date: 2015-09-18 12:00:00

tags: [Docker,Mesos,Marathon]

---

**摘要:** 本文介绍了基于Docker搭建单机版Mesos/Marathon的方法，Mesos/Marathon的所有组件均运行于单个容器中。

**GitHub地址:**
- [kiwenlau/single-mesos-docker](https://github.com/kiwenlau/single-mesos-docker)

<!-- more -->

- 作者: [KiwenLau](http://kiwenlau.com/)
- 日期: [2015-09-18](http://kiwenlau.com/2015/09/18/150918-single-mesos-docker/)

## 一. 简介

[Mesos](http://mesos.apache.org)是集群资源管理系统，[Marathon](http://mesosphere.github.io/marathon)是运行在Mesos之上的集群计算架构。将Mesos和Marathon打包到[Docker](https://www.docker.com/)镜像中，开发者便可以在本机上快速搭建Mesos/Marathon集群，进行学习和测试。

**kiwenlau/single-mesos**镜像非常简单。Docker容器运行在Ubuntu主机之上，Mesos和Marathon运行在该容器之中。具体来讲，Docker容器中运行了一个Mesos Master和一个Mesos Slave，以及Marathon和[ZooKeeper](https://zookeeper.apache.org/)。集群架构如下图：

<img src="150918-single-mesos-docker/single-mesos-marathon.png" width = "500"/>


## 二. 搭建Mesos/Marathon集群

#### **1. 下载Docker镜像:**

```sh
sudo docker pull kiwenlau/single-mesos:3.0
```

#### **2. 运行Docker容器:**

```sh
sudo docker run -p 5050:5050 -p 8080:8080 --name mesos -it -w /root kiwenlau/single-mesos:3.0
```

docker run命令运行成功后即进入容器内部，以下为输出：

```bash
Start ZooKeeper...
Start Mesos master...
Start Mesos slave...
Start Marathon...
```


## 三. 测试Mesos/Marathon集群

#### **1. 通过curl命令调用Marathon的REST API, 创建一个hello程序：**

```sh
curl -v -H "Content-Type: application/json" -X POST --data "@hello.json" http://127.0.0.1:8080/v2/apps
```

下面为hello.json。由cmd可知，该程序每隔1秒往output.txt文件中写入hello。

```bash
{
  "id": "hello",
  "cmd": "while [ true ] ; do echo hello >> /root/output.txt; sleep 1; done",
  "cpus": 0.1,
  "mem": 10.0,
  "instances": 1
}
```

curl执行结果:

```bash
* Hostname was NOT found in DNS cache
*   Trying 127.0.0.1...
* Connected to 127.0.0.1 (127.0.0.1) port 8080 (#0)
> POST /v2/apps HTTP/1.1
> User-Agent: curl/7.35.0
> Host: 127.0.0.1:8080
> Accept: */*
> Content-Type: application/json
> Content-Length: 139
> 
* upload completely sent off: 139 out of 139 bytes
< HTTP/1.1 201 Created
< X-Marathon-Leader: http://ec054cabb9af:8080
< Cache-Control: no-cache, no-store, must-revalidate
< Pragma: no-cache
< Expires: 0
< Location: http://127.0.0.1:8080/v2/apps/hello
< Content-Type: application/json; qs=2
< Transfer-Encoding: chunked
* Server Jetty(8.y.z-SNAPSHOT) is not blacklisted
< Server: Jetty(8.y.z-SNAPSHOT)
< 
* Connection #0 to host 127.0.0.1 left intact
{"id":"/hello","cmd":"while [ true ] ; do echo hello >> /root/output.txt; sleep 1; done","args":null,"user":null,"env":{},"instances":1,"cpus":0.1,"mem":10.0,"disk":0.0,"executor":"","constraints":[],"uris":[],"storeUrls":[],"ports":[0],"requirePorts":false,"backoffFactor":1.15,"container":null,"healthChecks":[],"dependencies":[],"upgradeStrategy":{"minimumHealthCapacity":1.0,"maximumOverCapacity":1.0},"labels":{},"acceptedResourceRoles":null,"version":"2015-09-16T11:22:27.967Z","deployments":[{"id":"2cd2fdd4-e5f9-4088-895f-7976349b7a19"}],"tasks":[],"tasksStaged":0,"tasksRunning":0,"tasksHealthy":0,"tasksUnhealthy":0,"backoffSeconds":1,"maxLaunchDelaySeconds":3600}
```

#### **2. 查看hello程序的运行结果：**

```sh
tail -f output.txt
```
当你看到终端不断输出"hello"时说明运行成功。

#### **3. 使用浏览器查看Mesos和Marathon的网页管理界面**

**注意**将IP替换运行Docker容器的主机IP地址

Mesos网页管理界面地址：[http://192.168.59.10:5050](http://192.168.59.10:5050)

Mesos网页管理界面如图，可知hello程序正在运行：

<img src="150918-single-mesos-docker/Mesos.png" width = "500"/>

Marathon网页管理界面地址：[http://192.168.59.10:8080](http://192.168.59.10:8080)

Marathon网页管理界面如图，可知hello程序正在运行：

<img src="150918-single-mesos-docker/Marathon.png" width = "500"/>

#### **4. 通过Marathon网页管理界面创建测试程序**

在Marathon的网页管理界面上点击"New APP"，在弹框中配置测试程序。ID为"hello", Command为"echo hello >> /root/output.txt", 然后点击"Create"即可。如下图：

<img src="150918-single-mesos-docker/hello.png" width = "300"/>


## 四. 存在的问题

其实，参考[Setting up a Single Node Mesosphere Cluster](https://open.mesosphere.com/getting-started/developer/single-node-install/)，可以很快地在ubuntu主机上直接搭建一个单节点的Mesos/Marathon集群。但是，当我安装该教程的步骤将Mesos/Marathon集群打包到Docker镜像中时，遇到了一个比较奇怪的问题。

在Docker容器中使用**"sudo service mesos-master start"**和**"sudo service mesos-slave start"**命令启动Mesos Master和Mesos Slave时，出现**"mesos-master: unrecognized service"**和**"mesos-slave: unrecognized service"**错误。但是，我在ubuntu主机上安装Mesos/Marathon集群后，使用同样的命令启动Mesos并没有问题。后来，我是通过直接执行mesos-master和mesos-slave命令启动Mesos，命令如下：

```sh
/usr/sbin/mesos-master --zk=zk://127.0.0.1:2181/mesos --quorum=1 --work_dir=/var/lib/mesos --log_dir=/log/mesos  
```

```sh
/usr/sbin/mesos-slave --master=zk://127.0.0.1:2181/mesos --log_dir=/log/mesos
```

由这个问题可知，虽然在Docker容器几乎可以运行任意程序，似乎和Ubuntu主机没有区别。但是事实上，**Docker容器与ubuntu主机并非完全一致**，而且这些细节的不同点比较坑。这一点很值得探讨，可以让大家在使用Docker时少走些弯路。对于提到的问题，虽然是解决了，然而我仍然不清楚其中的原因:(


## 五. Docker镜像备份

我将Docker镜像上传到了灵雀云（Alaudo）的Docker仓库，可以通过以下命令下载和运行：

```sh
sudo docker pull index.alauda.cn/kiwenlau/single-mesos:3.0
```

```sh
sudo docker run -p 5050:5050 -p 8080:8080 --name mesos -it -w /root index.alauda.cn/kiwenlau/single-mesos:3.0
```

## 六. 参考

1. [Setting up a Single Node Mesosphere Cluster](https://open.mesosphere.com/getting-started/developer/single-node-install/)
2. [Setting up a Cluster on Mesos and Marathon](https://open.mesosphere.com/getting-started/datacenter/install/#master-setup)
3. [An Introduction to Mesosphere](https://www.digitalocean.com/community/tutorials/an-introduction-to-mesosphere)
4. [How To Configure a Production-Ready Mesosphere Cluster on Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-configure-a-production-ready-mesosphere-cluster-on-ubuntu-14-04)
5. [Deploy a Mesos Cluster with 7 Commands Using Docker](https://medium.com/@gargar454/deploy-a-mesos-cluster-with-7-commands-using-docker-57951e020586)
6. [sekka1/mesosphere-docker](https://github.com/sekka1/mesosphere-docker)
7. [Marathon: Application Basics](http://mesosphere.github.io/marathon/docs/application-basics.html)
8. [Marathon: REST API](http://mesosphere.github.io/marathon/docs/rest-api.html)

