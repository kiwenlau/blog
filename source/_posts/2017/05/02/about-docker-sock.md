---
title: Docker多步构建更小的Java镜像

date: 2017-05-02 10:00:00

tags: [Docker, 翻译]

---

**译者按:** 最新版Docker将支持多步构建(Multi-stage build)，这样使用单个Dockerfile就可以定义多个中间镜像用于构建，测试以及发布等多个步骤，并且有效减小最终镜像的大小。

<!-- more -->

原文: [Creating Smaller Java Image using Docker Multi-stage Build](http://blog.arungupta.me/smaller-java-image-docker-multi-stage-build/)

译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译。**

**Github仓库:** [arun-gupta/docker-java-multistage](https://github.com/arun-gupta/docker-java-multistage)

[DockerCon 2017](http://2017.dockercon.com/)中与Java开发者直接相关的内容有:

- Docker多步构建(Docker Multi-stage build)
- [Oracle JRE in Docker Store](https://blogs.oracle.com/developers/official-docker-image-for-oracle-java-and-the-openjdk-roadmap-for-containers)

这篇博客介绍了为什么需要**Docker多步构建(Docker Multi-stage build)**，并且通过一个示例展示了如何构建更小的Java镜像。


### 为什么需要多步构建?

为Java应用构建Docker镜像意味着编译源代码以及打包目标代码。开发者通常会使用Maven或者Gradle来构建JAR或WAR文件。若使用Maven镜像作为基础镜像来构建Java应用，则需要下载所有Maven依赖。下载的JAR包数目由`pm.xml`决定，有可能会非常多。这样的话，生成的Docker镜像中将留下太多多余的文件。

下面为示例Dockerfile:

```dockerfile
FROM maven:3.5-jdk-8
 
COPY src /usr/src/myapp/src
COPY pom.xml /usr/src/myapp
RUN mvn -f /usr/src/myapp/pom.xml clean package
 
ENV WILDFLY_VERSION 10.1.0.Final
ENV WILDFLY_HOME /usr
 
RUN cd $WILDFLY_HOME && curl http://download.jboss.org/wildfly/$WILDFLY_VERSION/wildfly-$WILDFLY_VERSION.tar.gz | tar zx && mv $WILDFLY_HOME/wildfly-$WILDFLY_VERSION $WILDFLY_HOME/wildfly
 
RUN cp /usr/src/myapp/target/people-1.0-SNAPSHOT.war $WILDFLY_HOME/wildfly/standalone/deployments/people.war
 
EXPOSE 8080
 
CMD ["/usr/wildfly/bin/standalone.sh", "-b", "0.0.0.0"]
 
```

由Dockerfile可知:

- `maven:3.5-jdk-8` 是基础镜像
- 将源代码拷贝到镜像中
- Maven用于构建应用
- 下载并安装WildFly
- 将生成的.war文件拷贝到WildFly的`deployments`目录
- 启动WildFly

这个Dockefile存在这些问题：

- 使用`Maven`作为基础镜像的话，还需要安装和配置WildFly。
- 构建应用时需要下载很多Maven依赖，它们会继续留在镜像中，但是运行应用时并不需要它们。这导致了镜像过大。
- 修改WildFly版本则需要修改Dockerfile，并重新构建镜像。如果直接使用WildFly镜像作为基础镜像，情况会简单很多。
- 打包应用之前，需要进行单元测试，那么，测试的依赖也需要留在生成的镜像中，这其实是没必要的。

当然，也可以采用其他方式构建Docker镜像。比如，可以将Dockerfile拆分为两个。第一个Dockerfile以Maven镜像为基础镜像，用于构建应用，并将构建好的.war文件通过数据卷(volume)复制到共享的目录；第二个Dockerfile以WildFly镜像作为基础镜像，从数据卷将.war文件拷贝出来就好了。这个方法也是有问题的，因为需要维护多个Dockerfile，并且通过数据卷拷贝文件也不方便。

### 什么是Docker多步构建？

多步构建(multi-stage build)允许在Dockerfile中使用多个`FROM`指令。两个`FROM`指令之间的所有指令会生产一个中间镜像，最后一个`FROM`指令之后的指令将生成最终镜像。中间镜像中的文件可以通过`COPY --from=<image-number>`指令拷贝，其中image-number为镜像编号，0为第一个基础镜像。没有被拷贝的文件都不会存在于最终生成的镜像，这样可以减小镜像大小。

`FROM`指令可以使用`as <stage-name>`来指定步骤名称(stage name):

```Dockerfile
FROM maven:3.5-jdk-8 as BUILD
```

这样的话，COPY指令的`--from`选项可以使用步骤名称代替镜像编号。

下面为示例Dockerfile:

```Dockerfile
FROM maven:3.5-jdk-8 as BUILD
 
COPY src /usr/src/myapp/src
COPY pom.xml /usr/src/myapp
RUN mvn -f /usr/src/myapp/pom.xml clean package
 
FROM jboss/wildfly:10.1.0.Final
 
COPY --from=BUILD /usr/src/myapp/target/people-1.0-SNAPSHOT.war /opt/jboss/wildfly/standalone/deployments/people.war
```

由Dockerfile可知:

- 一共有两个`FROM`指令，因此为两步构建。
- `maven:3.5-jdk-8` 是第一步构建的基础镜像。这一步用于构建应用的WAR文件。这一步的名称为`build`。
- `jboss/wildfly:10.1.0.Final` 是第二步构建的基础镜像。第一步构建的WAR文件通过`COPY --from`指令拷贝到WildFly的`deloyments`目录。

### Docker多步构建有什么好处？

- 仅需要一个Dockerfile来定义整个构建过程。这样，不需要定义多个Dockerfile，也不需要使用数据卷来拷贝文件。
- 可以为最终镜像选择合适的基础镜像，来满足生产环境的需求，这样可以有效减小最终镜像的大小。另外，构建步骤的多余文件都被丢弃了。
- 使用官方的WildFly镜像作为生产镜像的基础镜像，而不是手动安装和配置WildFly。这样，WildFly升级时将非常方便。

**注：**Docker多步构建正在开发中，还没有正式发布。可以通过 `curl -fsSL https://test.docker.com/ | sh`命令安装最新的测试版Docker试用多步构建。

使用第一个Dockerfile构建的镜像为816MB，而使用多步构建的话，镜像只有584MB。

```shell
docker-java-multistage $ docker images
REPOSITORY                          TAG                 IMAGE ID            CREATED             SIZE
people                              multistage          d36a4b82ad87        59 seconds ago      584MB
people                              singlestage         13dbcf8f54f6        5 minutes ago       816MB
```

可知，使用多步构建可以有效减小镜像大小。

查看[PR #31257](https://github.com/moby/moby/pull/31257)，有更加详细的讨论。

欢迎加入[我们Fundebug](https://fundebug.com/)的**Docker技术交流群: 305097057**。

<div style="text-align: center;">
<img style="width:30%;" src="http://opu5mq5tf.bkt.clouddn.com/qq_docker.JPG" />
</div>















