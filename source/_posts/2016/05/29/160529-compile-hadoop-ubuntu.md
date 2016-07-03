title: 64位Ubuntu中编译Hadoop的步骤

date: 2016-05-29 09:00

tags: [Hadoop]

---

**摘要:** 本文介绍了在64位Ubuntu 14.04中编译Hadoop的步骤。

Hadoop二进制包下载地址：[百度网盘](https://pan.baidu.com/s/1hrGLqlA) [GitHub](https://github.com/kiwenlau/compile-hadoop/releases)

<!-- more -->

- 作者: [KiwenLau](http://kiwenlau.com/)
- 日期: [2016-05-29](http://kiwenlau.com/2016/05/29/160529-compile-hadoop-ubuntu/)

<img src="160529-compile-hadoop-ubuntu/ubuntu-hadoop.png" width = "300"/>

Hadoop官网提供的二进制包是在32位系统上编译的，在64系统上运行会出错：

```
WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
```

这时需要自行编译Hadoop源码。以下为编译步骤:

#### **1. 安装依赖软件**

```
sudo apt-get update
sudo apt-get install -y openjdk-7-jdk libprotobuf-dev protobuf-compiler maven cmake build-essential pkg-config libssl-dev zlib1g-dev llvm-gcc automake autoconf make
```

#### **2. 下载并解压[Hadoop源文件](http://archive.apache.org/dist/hadoop/core/)**

```
wget http://archive.apache.org/dist/hadoop/core/hadoop-2.3.0/hadoop-2.3.0-src.tar.gz
tar -xzvf hadoop-2.3.0-src.tar.gz
```

#### **3. 编译Hadoop**

```
cd hadoop-2.3.0-src
mvn package -Pdist,native -DskipTests –Dtar
```

这一步比较耗时，大概需要15~30分钟。 

正确执行的结果如下:

```
[INFO] ------------------------------------------------------------------------

[INFO] BUILD SUCCESS

[INFO] ------------------------------------------------------------------------

[INFO] Total time: 14:59.240s

[INFO] Finished at: Thu Jan 15 18:51:59 JST 2015

[INFO] Final Memory: 168M/435M

[INFO] ------------------------------------------------------------------------
```

编译好的二进制文件包位于

```
hadoop-2.3.0-src/hadoop-dist/target/hadoop-2.3.0.tar.gz
```

编译其他版本的Hadoop的步骤一致，也可以直接下载我编译好的Hadoop:

- [百度网盘](https://pan.baidu.com/s/1hrGLqlA)
- [GitHub](https://github.com/kiwenlau/compile-hadoop/releases)

Linux终端用户可以使用wget命令直接下载GitHub上的Hadoop二进制包:

```
wget https://github.com/kiwenlau/compile-hadoop/releases/download/2.3.0/hadoop-2.3.0.tar.gz
wget https://github.com/kiwenlau/compile-hadoop/releases/download/2.4.0/hadoop-2.4.0.tar.gz
wget https://github.com/kiwenlau/compile-hadoop/releases/download/2.5.0/hadoop-2.5.0.tar.gz
wget https://github.com/kiwenlau/compile-hadoop/releases/download/2.6.0/hadoop-2.6.0.tar.gz
wget https://github.com/kiwenlau/compile-hadoop/releases/download/2.7.0/hadoop-2.7.0.tar.gz
wget https://github.com/kiwenlau/compile-hadoop/releases/download/2.7.2/hadoop-2.7.2.tar.gz
```

另外, 使用自行编译的Hadoop二进制包安装Hadoop时需要删除.bashrc文件与hadoop-env.sh文件中下面两行（默认不会有这两行，但是尝试解决报错时可能改写了）

```
export HADOOP_COMMON_LIB_NATIVE_DIR="~/hadoop/lib/"
export HADOOP_OPTS="$HADOOP_OPTS -Djava.library.path=~/hadoop/lib/"
```

