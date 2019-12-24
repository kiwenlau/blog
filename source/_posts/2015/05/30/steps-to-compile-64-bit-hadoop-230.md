title: Steps to compile 64-bit Hadoop 2.3.0 under Ubuntu 14.04

date: 2015-05-30 09:00:00

tags: [Hadoop, Ubuntu]

---

**摘要:** compile 64-bit Hadoop

<!-- more -->

hadoop-2.3.0.tar.gz provided by Hadoop official website is compiled under 32 bit machine，you will get some trouble if you use it under 64 bit machine, for example:

WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable

So, you have to compile hadoop source code by your self. I compiled hadoop-2.3.0 under 64 bit ubuntu 14.04 and run wordcount program successfully, you can download it from this: http://1drv.ms/1HZ1TSV


### 1. update package lists

```bash
apt-get update
```

### 2. install dependencies

```bash
apt-get install -y openjdk-7-jdk libprotobuf-dev protobuf-compiler maven cmake build-essential pkg-config libssl-dev zlib1g-dev llvm-gcc automake autoconf make
```

### 3. download hadoop source file

```bash
wget http://archive.apache.org/dist/hadoop/core/hadoop-2.3.0/hadoop-2.3.0-src.tar.gz
```

### 4. extract hadoop source file

```bash
tar -xzvf hadoop-2.3.0-src.tar.gz
```

### 5. enter hadoop directory

```bash
cd hadoop-2.3.0-src
```

### 6. compile hadoop 2.3.0

```bash
mvn package -Pdist,native -DskipTests -Dtar
```

output when it success

```bash
[INFO] ------------------------------------------------------------------------
[INFO] Reactor Summary:
[INFO]
[INFO] Apache Hadoop Main ................................ SUCCESS [1:11.968s]
[INFO] Apache Hadoop Project POM ......................... SUCCESS [30.393s]
[INFO] Apache Hadoop Annotations ......................... SUCCESS [18.398s]
[INFO] Apache Hadoop Assemblies .......................... SUCCESS [0.246s]
[INFO] Apache Hadoop Project Dist POM .................... SUCCESS [20.372s]
[INFO] Apache Hadoop Maven Plugins ....................... SUCCESS [23.721s]
[INFO] Apache Hadoop MiniKDC ............................. SUCCESS [1:41.836s]
[INFO] Apache Hadoop Auth ................................ SUCCESS [22.303s]
[INFO] Apache Hadoop Auth Examples ....................... SUCCESS [7.052s]
[INFO] Apache Hadoop Common .............................. SUCCESS [2:29.466s]
[INFO] Apache Hadoop NFS ................................. SUCCESS [11.604s]
[INFO] Apache Hadoop Common Project ...................... SUCCESS [0.073s]
[INFO] Apache Hadoop HDFS ................................ SUCCESS [1:30.230s]
[INFO] Apache Hadoop HttpFS .............................. SUCCESS [17.976s]
[INFO] Apache Hadoop HDFS BookKeeper Journal ............. SUCCESS [19.927s]
[INFO] Apache Hadoop HDFS-NFS ............................ SUCCESS [3.304s]
[INFO] Apache Hadoop HDFS Project ........................ SUCCESS [0.032s]
[INFO] hadoop-yarn ....................................... SUCCESS [0.033s]
[INFO] hadoop-yarn-api ................................... SUCCESS [36.284s]
[INFO] hadoop-yarn-common ................................ SUCCESS [33.912s]
[INFO] hadoop-yarn-server ................................ SUCCESS [0.213s]
[INFO] hadoop-yarn-server-common ......................... SUCCESS [8.193s]
[INFO] hadoop-yarn-server-nodemanager .................... SUCCESS [41.181s]
[INFO] hadoop-yarn-server-web-proxy ...................... SUCCESS [2.768s]
[INFO] hadoop-yarn-server-resourcemanager ................ SUCCESS [13.923s]
[INFO] hadoop-yarn-server-tests .......................... SUCCESS [0.904s]
[INFO] hadoop-yarn-client ................................ SUCCESS [4.363s]
[INFO] hadoop-yarn-applications .......................... SUCCESS [0.120s]
[INFO] hadoop-yarn-applications-distributedshell ......... SUCCESS [2.262s]
[INFO] hadoop-yarn-applications-unmanaged-am-launcher .... SUCCESS [1.615s]
[INFO] hadoop-yarn-site .................................. SUCCESS [0.086s]
[INFO] hadoop-yarn-project ............................... SUCCESS [2.703s]
[INFO] hadoop-mapreduce-client ........................... SUCCESS [0.132s]
[INFO] hadoop-mapreduce-client-core ...................... SUCCESS [18.951s]
[INFO] hadoop-mapreduce-client-common .................... SUCCESS [14.320s]
[INFO] hadoop-mapreduce-client-shuffle ................... SUCCESS [3.330s]
[INFO] hadoop-mapreduce-client-app ....................... SUCCESS [9.664s]
[INFO] hadoop-mapreduce-client-hs ........................ SUCCESS [7.678s]
[INFO] hadoop-mapreduce-client-jobclient ................. SUCCESS [9.263s]
[INFO] hadoop-mapreduce-client-hs-plugins ................ SUCCESS [1.549s]
[INFO] Apache Hadoop MapReduce Examples .................. SUCCESS [5.748s]
[INFO] hadoop-mapreduce .................................. SUCCESS [2.880s]
[INFO] Apache Hadoop MapReduce Streaming ................. SUCCESS [7.080s]
[INFO] Apache Hadoop Distributed Copy .................... SUCCESS [14.648s]
[INFO] Apache Hadoop Archives ............................ SUCCESS [2.602s]
[INFO] Apache Hadoop Rumen ............................... SUCCESS [5.706s]
[INFO] Apache Hadoop Gridmix ............................. SUCCESS [3.649s]
[INFO] Apache Hadoop Data Join ........................... SUCCESS [2.483s]
[INFO] Apache Hadoop Extras .............................. SUCCESS [2.678s]
[INFO] Apache Hadoop Pipes ............................... SUCCESS [6.359s]
[INFO] Apache Hadoop OpenStack support ................... SUCCESS [5.088s]
[INFO] Apache Hadoop Client .............................. SUCCESS [4.534s]
[INFO] Apache Hadoop Mini-Cluster ........................ SUCCESS [0.433s]
[INFO] Apache Hadoop Scheduler Load Simulator ............ SUCCESS [7.757s]
[INFO] Apache Hadoop Tools Dist .......................... SUCCESS [4.099s]
[INFO] Apache Hadoop Tools ............................... SUCCESS [0.428s]
[INFO] Apache Hadoop Distribution ........................ SUCCESS [18.045s]
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 14:59.240s
[INFO] Finished at: Thu Jan 15 18:51:59 JST 2015
[INFO] Final Memory: 168M/435M
[INFO] ------------------------------------------------------------------------
```

you can get the compiled hadoop-2.3.0 under this directory:

```bash
hadoop-2.3.0-src/hadoop-dist/target/hadoop-2.3.0.tar.gz
```

The methods is the same when you want to compile hadoop-2.5.2, hadoop-2.6.0 and hadoop-2.7.0