title: 基于Docker编译Hadoop

date: 2016-06-05 10:00

tags: [Docker, Hadoop]

---

**摘要:** 将编译Hadoop所需要的依赖软件安装到Docker镜像中，然后在Docker容器中编译Hadoop，可以提高编译效率，同时避免污染主机。编译其他软件时，也可以参考这篇博客的方法。

**GitHub地址:**
- [kiwenlau/compile-hadoop](https://github.com/kiwenlau/compile-hadoop)

<!-- more -->

- 作者: [KiwenLau](http://kiwenlau.com/)
- 日期: [2016-06-05](http://kiwenlau.com/2016/06/05/160605-compile-hadoop-docker/)

<img src="160605-compile-hadoop-docker/hadoop-docker.png" width = "300"/>

在前一篇博客中，我介绍了[64位Ubuntu中编译Hadoop的步骤](http://kiwenlau.com/2016/05/29/160529-compile-hadoop-ubuntu/)。这篇博客将介绍基于Docker编译Hadoop的方法。

## 一. 编译步骤

#### **1. 下载Docker镜像**

```
sudo docker pull kiwenlau/compile-hadoop
```

或者自行构建Docker镜像

```
sudo docker build -t kiwenlau/compile-hadoop .
```


#### **2. 下载并解压[Hadoop源文件](http://archive.apache.org/dist/hadoop/core/)**

```
export VERSION=2.7.2
wget http://archive.apache.org/dist/hadoop/core/hadoop-$VERSION/hadoop-$VERSION-src.tar.gz
tar -xzvf hadoop-$VERSION-src.tar.gz
```

#### **3. 运行Docker容器，在容器中编译Hadoop**

```
sudo docker run -v $(pwd)/hadoop-$VERSION-src:/hadoop-$VERSION-src kiwenlau/compile-hadoop /root/compile.sh $VERSION
```

这一步比较耗时，大概需要15~30分钟。 

正确执行的结果如下:

```
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 23:46.056s
[INFO] Finished at: Tue May 31 16:40:53 UTC 2016
[INFO] Final Memory: 210M/915M
[INFO] ------------------------------------------------------------------------


comile hadoop 2.7.2 success!
```

编译好的二进制文件包位于

```
hadoop-2.7.2-src/hadoop-dist/target/hadoop-2.7.2.tar.gz
```

编译其他版本的Hadoop的步骤一致，仅需改变VERSION的值。

可以使用wget命令直接下载GitHub上的Hadoop二进制包:

```
wget https://github.com/kiwenlau/compile-hadoop/releases/download/$VERSION/hadoop-VERSION.tar.gz
```

## 二. 方法总结

编译其他软件时，也可以参考本文介绍的方法，具体细节可以参考源码[kiwenlau/compile-hadoop](https://github.com/kiwenlau/compile-hadoop)

#### **1. 构建编译所需的Docker镜像**

编译软件往往需要安装很多依赖，而编译不同的软件有时需要不同版本的依赖，如果直接在主机上安装这些依赖会污染主机，而且也不易重复。

#### **2. 下载软件源码**

源码不放在Docker镜像里面，可以方便编译不同版本的软件，也可以提高构建Docker镜像的效率。

#### **3. 运行Docker容器编译软件**

软件源码以数据卷(volume)的形式挂载的容器内，编译所得的可执行文件也将位于数据卷内。

