---
title: 谁用光了磁盘？Docker System命令详解

date: 2017-04-18 21:00:00

tags: [Docker, 翻译]

---

**译者按:** Docker镜像，容器，数据卷以及网络都会占用主机的磁盘空间，这样的话，磁盘很容易就会被用完。这篇博客介绍了一个简单的解决方案 - **Docker System命令**。

<!-- more -->

原文: [What’s eating my disk? Docker System Commands explained](https://cntnr.io/whats-eating-my-disk-docker-system-commands-explained-d778178f96f1)

译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译。**

用了一段时间Docker后，会发现它占用了不少硬盘空间。还好[Docker 1.13](https://blog.docker.com/2017/01/whats-new-in-docker-1-13/)引入了解决方法，它提供了简单的命令来查看/清理Docker使用的磁盘空间。

本文通过一个简单的示例，可以证明Docker能够很快地将磁盘占满。该示例通过[play-with-docker.com](https://cntnr.io/building-a-0-docker-swarm-in-seconds-80bf13a4d0a7)运行。点击**Add new instance**即可创建新的实例，该实例安装了最新版的Docker 17.03。这篇博客主要讨论磁盘空间，那么不妨使用df命令查看磁盘的初始状态:

```bash
$ df -h
Filesystem           Size       Used Available Use% Mounted on
/dev/mapper/...      10.0G    443.3M      9.6G   4% /
tmpfs                60.0G         0     60.0G   0% /dev
tmpfs                60.0G         0     60.0G   0% /sys/fs/cgroup
/dev/xvda1           49.1G      3.7G     43.3G   8% /etc/resolv.conf
/dev/xvda1           49.1G      3.7G     43.3G   8% /etc/hostname
/dev/xvda1           49.1G      3.7G     43.3G   8% /etc/hosts
shm                  64.0M         0     64.0M   0% /dev/shm
/dev/mapper/...      10.0G    443.3M      9.6G   4% /graph/overlay2
```

可知，在新创建的[play-with-docker.com](http://labs.play-with-docker.com/)实例，一共有10GB磁盘空间，其中接近500MB已被占用。

接下来编写Dockerfile来创建一个镜像。这个镜像基于**Alpine镜像**；镜像将写入3个随机的文件，每个文件1GB，文件由**dd**命令生成；因为这个镜像并没有实际作用，因此**CMD**设为**/bin/true**。

```dockerfile
FROM alpine
RUN dd if=/dev/zero of=1g1.img bs=1G count=1
RUN dd if=/dev/zero of=1g2.img bs=1G count=1
RUN dd if=/dev/zero of=1g3.img bs=1G count=1
CMD /bin/true
```

运行**docker build -t test .**即可创建镜像，执行完成后将生成一个3GB的镜像。

```bash
$ docker image ls
REPOSITORY          TAG                CREATED             SIZE
test                latest             38 seconds ago      3.23GB
alpine              latest             5 weeks ago         3.99MB
```

不难理解，该镜像占用了相应大小的磁盘空间。

```bash
$ df -h
Filesystem        Size       Used Available Use% Mounted on
/dev/mapper/...   10.0G      3.4G      6.5G  34% /
```

若只写入2个随机文件，则需要修改Dockerfile，删掉一行。为了避免[构建镜像时使用缓存](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/#build-cache)，我在dd命令之前添加了一行echo命令。

```bash
FROM alpine
RUN echo foo
RUN dd if=/dev/zero of=1g1.img bs=1G count=1
RUN dd if=/dev/zero of=1g2.img bs=1G count=1
# RUN dd if=/dev/zero of=1g3.img bs=1G count=1
CMD /bin/true
```

本来以为这样可以节省1GB磁盘空间，然而实际情况更加糟糕！

```bash
$ df -h
Filesystem        Size       Used Available Use% Mounted on
/dev/mapper/...   10.0G      5.4G      4.5G  54% /
```

旧的Docker镜像一直存在，最终磁盘空间会很快被用完。Docker 1.13引入了**docker system df**命令，类似于Linux上的df命令，用于查看Docker的磁盘使用情况。

```bash
$ docker system df
TYPE                TOTAL     ACTIVE    SIZE          RECLAIMABLE
Images              3         0         5.373GB       5.373GB (100%)
Containers          0         0         0B            0B
Local Volumes       0         0         0B            0B
```

可知，实例上一共有3个Docker镜像: apline镜像，包含3个1GB随机文件的镜像以及包含2个1GB随机文件的镜像。这些镜像占用了超过5GB磁盘空间。由于我们并没有基于这些镜像运行容器，所以它们都可以被删除，所以可回收的(RECLAIMABLE)磁盘空间为100%。使用**docker run test**运行test镜像再查看:

```bash
$ docker system df
TYPE                TOTAL     ACTIVE    SIZE          RECLAIMABLE
Images              3         1         5.373GB       3.225GB (60%)
Containers          1         0         0B            0B
Local Volumes       0         0         0B            0B
```

现在情况就不同了，我运行了一个容器，它执行**/bin/true**之后就很快退出了。这个容器绑定了test镜像，test镜像被标记为活跃(active)因而不能被删除，这导致可回收的磁盘空间变少了。

现在来清理一下磁盘空间。Docker提供了**docker system prune**，可以用于清理dangling镜像(参考[What are Docker <none>:<none> images?](http://www.projectatomic.io/blog/2015/07/what-are-docker-none-none-images/))和容器，以及失效的数据卷和网络。

```bash
$ docker system prune
WARNING! This will remove:
        - all stopped containers
        - all volumes not used by at least one container
        - all networks not used by at least one container
        - all dangling images
Are you sure you want to continue? [y/N] y
Deleted Containers:
1cdf866157b4a97e151125af3c2a7f186a59b6f63807e2014ce1a00d68f44e1d
Deleted Images:
deleted: sha256:f59bb277...
deleted: sha256:695b8e70...
deleted: sha256:93b1cceb...
deleted: sha256:c74d6bcd...
deleted: sha256:df8b9bb1...
deleted: sha256:dfe8340f...
deleted: sha256:ce1ee654...
Total reclaimed space: 3.221GB
```

根据警告信息可知，这个命令会删除所有关闭的容器以及dangling镜像。示例中，含有3个1GB随机文件的镜像的名称被占用了，名称为<none>:<none>，为dangling镜像，因此会被删除。同时，所有的中间镜像也会被删除。这样的话，一共3GB的磁盘空间被回收了! 

更进一步，使用**-a**选项可以做深度清理。这时我们会看到更加严重的WARNING信息:

```bash
$ docker system prune -a
WARNING! This will remove:
        - all stopped containers
        - all volumes not used by at least one container
        - all networks not used by at least one container
        - all images without at least one container associated to them
Are you sure you want to continue? [y/N] y
Deleted Images:
untagged: test:latest
deleted: sha256:c515ebfa2...
deleted: sha256:07302c011...
deleted: sha256:37c0c6474...
deleted: sha256:5cc2b6bc4...
deleted: sha256:b283b9c35...
deleted: sha256:8a8b9bd8b...
untagged: alpine:latest
untagged: alpine@sha256:58e1a1bb75db1...
deleted: sha256:4a415e366...
deleted: sha256:23b9c7b43...
Total reclaimed space: 2.151GB
```

这个命令将清理整个系统，并且只会保留真正在使用的镜像，容器，数据卷以及网络，因此需要格外谨慎。比如，我们不能在生产环境中运行**prune -a**命令，因为一些备用镜像(用于备份，回滚等)有时候需要用到，如果这些镜像被删除了，则运行容器时需要重新下载。

此时，所有未绑定容器的镜像将会被删除。由于第一次**prune**命令删除了所有容器，因此所有镜像(它们没有绑定任何容器)都会被删除。

```bash
$ df -h
Filesystem          Size      Used Available Use% Mounted on
/dev/mapper/...    10.0G    442.5M      9.6G   4% /
```

现在，已使用的磁盘空间又变成了4%。本文的示例只是冰山一角，因为一旦我们运行了真正的容器，并且使用了Docker数据卷和Docker网络，则磁盘空间将会更快用完。感兴趣的话，可以查看博客最后的视频(不要忘了订阅！)。在视频中，我介绍一个简单的WordPress应用，它由数个容器，数据卷以及网络构成。这个应用可以很快地消耗掉磁盘空间，我将介绍如何处理这个问题。

视频: [What's eating my disk?!Clean up your Docker System](https://youtu.be/G308610YNU4)

欢迎加入[我们Fundebug](https://fundebug.com/)的**Docker技术交流群: 305097057**。

<div style="text-align: center;">
<img style="width:20%;" src="docker-system-explain/docker.JPG" />
</div>















