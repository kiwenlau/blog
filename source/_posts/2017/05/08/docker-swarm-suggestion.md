---
title: 生产环境中使用Docker Swarm的一些建议

date: 2017-05-08 09:00:00

tags: [Docker, Swarm, 翻译]

---

**译者按:** 实践中会发现，生产环境中使用单个Docker节点是远远不够的，搭建Docker集群势在必行。然而，面对Kubernetes, Mesos以及Swarm等众多容器集群系统，我们该如何选择呢？它们之中，Swarm是Docker原生的，同时也是最简单，最易学，最节省资源的，至少值得我们多了解一下。本文将介绍一些非常实用的建议。

<!-- more -->

原文: [Tips for using Docker Swarm mode in production](https://rock-it.pl/tips-for-using-docker-swarm-mode-in-production)

译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译。另外，本文版权归原作者所有，翻译仅用于学习**。

如果你在单个生产节点上用过Docker，然后发现单个节点的资源不够用，那么你会怎么做呢？我也遇到过这种情况! 关于在生产环境中使用Docker Swarm，我会为你提供一些建议，也许能够帮到你。这些都是我一年来积累的一些经验。

另外，如果你对Docker Swam不熟悉的话，可以参考我之前的博客[My experience with Docker Swarm - when you may need it?](https://rock-it.pl/my-experience-with-docker-swarm-when-you-need-it/)

### 1. 阅读官方文档

我并不打算重复[官方文档](https://docs.docker.com/engine/swarm/swarm-tutorial/)。尽管文档非常短，但是通过它可以了解Swarm的基本知识。另外，我也不会写如何搭建Swarm集群，这方面的资料太多了，你可以查看 [Digital Ocean](https://www.digitalocean.com/community/tutorials/how-to-create-a-cluster-of-docker-containers-with-docker-swarm-and-digitalocean-on-ubuntu-16-04)或者自己谷歌。PS: 我是使用Ansible搭建Swarm集群的。

### 2. Docker Swarm要点

**Swarm的负载非常低**。据我观察，Swarm进行调度和通信的CPU负载非常低。因此，Swarm的管理节点(Manager)可以同时作为工作节点(Worker)。如果你需要搭建一个非常大的集群(1000+ 节点)，管理节点需要更多资源，但是对于中小型集群来说，管理节点需要的资源可以忽略不计。另外，[这篇博客](https://sematext.com/blog/2016/11/14/docker-swarm-lessons-from-swarm3k/)介绍了Swarm3k（一个4700节点的Swarm集群的实验），不妨了解一下。

**Swarm集群的网络通信(服务发现，负载均衡以及容器间通信)非常可靠。**当你开启一个服务的端口之后，在Swarm集群中的任何一个节点都可以访问它。负载均衡也是由Swarm提供的。后文会提到一些之前遇到的问题，但是**Docker 1.13**之后，这些问题都解决了。

**使用Swarm只需要掌握少量命令。**下面是我每天需要用到的所有命令:

```bash
# 创建服务
docker service create \  
  --image nginx \
  --replicas 2 \
  nginx 

# 更新服务
docker service update \  
  --image nginx:alpine \
  nginx 

# 删除服务
docker service rm nginx

# 减少服务实例(这比直接删除服务要好)
docker service scale nginx=0

# 增加服务实例
docker service scale nginx=5

# 查看所有服务
docker service ls

# 查看服务的容器状态
docker service ps nginx

# 查看服务的详细信息。
docker service inspect nginx  
```

**实现零宕机部署也非常简单。**这样也可以方便地实现持续部署:

```bash
# 构建新镜像
docker build -t hub.docker.com/image . 

# 将新镜像上传到Docker仓库
docker push hub.docker.com/image

# 更新服务的镜像
docker service update --image hub.docker.com/image service  
```

**Swarm非常容易入门**。分布式系统通常是非常复杂的。与其他容器集群系统(Mesos, Kubernetes)相比，Swarm的学习曲线最低。在没有任何Swarm知识的情况下，我只花了**一周时间**，就把服务从单个Docker主机迁移到20个节点的Docker集群上。

**更新服务要慎重**。 你的容器同时运行在多个主机上。更新服务时，只需要更新Docker镜像。合理的测试和部署流程是保证成功的关键。

### 3. 决定哪些容器部署在Swarm集群

**并非所有服务都应该部署在Swarm集群内**。数据库以及其他有状态服务就不适合部署在Swarm集群内。理论上，你可以通过使用labels将容器部署到特定节点上，但是这样的话，Swarm集群外的节点就很难访问它们了(Docker 1.12没有很好的方法，但是1.13之后可以使用*attachable* network)。如果你允许集群外的节点访问数据库，则所有节点都可以访问它，这显然不符合你的需求。另外，Docker Swarm的跨节点数据卷(cross-host mounted volumes)并不可靠，一个简单的文件上传都可能引起问题。

无状态的容器就非常适合部署在Swarm集群中，它们可以由环境变量进行配置(使用ENV指令)。建议为开源工具构建镜像，例如，可以将Nginx的配置文件放到Docker镜像中。

下面是我部署在Swarm集群中的服务:

- Django channels (网页应用)
- Nginx(代理)
- Celery(周期性任务)
- Sensu(监控)

下面是我部署在Swarm集群之外的容器:

- Postgres(数据库)
- Redis(缓存)

由于一个获取真正IP的[问题](https://github.com/moby/moby/issues/25526)，我很可能会将Nginx运行在Swarm集群之外，或者采用host模式。

### 4. 配置Docker仓库

Docker仓库，你值得拥有！你可以自己搭建一个，或者使用Docker仓库服务，比如[DockerHub](https://hub.docker.com/)或者[GitLab Container Registry](http://docs.gitlab.com/ce/user/project/container_registry.html)。不要在服务器上直接构建Docker镜像，因为你有多个节点(在每个节点上构建镜像非常麻烦)，而且在创建服务的时候你需要指定镜像(这个镜像所有节点都应该可以下载)。如果你配置了私有Docker仓库，则需要指定`--with-registry-auth`，否则这些节点将无法下载镜像。

另外，你应该为Docker镜像设置版本，这样更加易于回滚。

### 5. 将半无状态的服务变得完全无状态

所谓**半无状态服务**，就是容器需要依赖一些不太重要的外部文件。你可以使用数据卷(volume)，但是更好的选择是使用S3或者其他云存储服务。记住，想要获得扩展性，云是最好的选择。

例如，我不得不构建Nginx镜像，将配置文件放到镜像中。使用数据卷挂载Nginx配置文件不是很方便。

### 6. 配置日志收集服务

使用分布式系统时，集中管理日志是非常必要的。我们有很多方案，包括开源工具或者SaaS服务，比如ELK，Grafana, Graylog...自己搭建完整的系统是非常复杂的，所以我建议搭建先使用SaaS服务(比如[Loggly](http://loggly.com/), [Logentries ](http://logentries.com/))，当费用太高时，则自己搭建一个系统。ELK可以这样配置:

```bash
docker service update \  
  --log-driver gelf \
  --log-opt gelf-address=udp://monitoring.example.com:12201 \
  --log-opt tag=example-tag \
  example-service
```

### 7. 创建attachable network

attachable network是一个非常重要的特性。你最好使用它，否则`docker run`创建的容器将无法接入Swarm集群的网络。这是Docker 1.13之后的版本才有的功能，也许你需要升级。

创建attachable network的命令如下:

```bash
docker network create --driver=overlay --attachable core  
```

### 8. 先使用环境变量，再考虑Secrets API

如果你按照[How to write excellent Dockerfiles](https://rock-it.pl/how-to-write-excellent-dockerfiles/)构建Docker镜像，你很可能会使用环境变量去配置很多东西。如果你这样做的话，则迁移到Swarm集群时问题会少很多。示例命令如下:

```bash
# 创建服务时指定环境变量
docker service create \  
  --env VAR=VALUE \
  --env-file FILENAME \
  ...

# 增加、删除环境变量
docker service update \  
  --env-add VAR=NEW_VALUE \
  --env-rm VAR \
  ..
```

下一步是使用[Secrets API ](https://docs.docker.com/engine/swarm/secrets/)。简单地说，你可以将私密数据(比如密码，SSL证书等)以文件的形式挂载到容器中。虽然我还没有用过Secrets API，但是我觉得值得尝试一下。

### 9. 设置合理的服务容器个数以及并行更新的容器个数

一方面，你需要保证足够多的容器数来处理负载以及作为灾备，另一方面，太多的容器会导致CPU和内存资源不足。因此，你需要配置合理的服务容器个数，也就是说，某个服务，需要运行合理个数的容器。

另外，默认的`update-parallelism` 值是1，这就意味着更新服务时，每次只更新1个容器。通常，这个值太小了。我的建议是将它设为 `服务容器数 / 2`.。

相关命令

```bash
# 将同时更新的容器数设为10
docker service update \  
  --update-parallelism 10 \
  webapp

# 同时增加多个服务的容器数
docker service scale redis=1 nginx=4 webapp=20

# 查看服务状态
docker service ls

# 查看服务的详情(排除关闭的容器) 
docker service ps webapp | grep -v "Shutdown"  
```

### 10. 将Swarm配置代码化

最佳方式是使用[Docker Compose v3](https://docs.docker.com/compose/compose-file/#deploy) 语法，这样可以将服务的所有配置选项代码化。我将 `docker-compose.yml`用于开发环境， `docker-compose.prod.yml`用于生产环境。使用docker-compose文件部署服务的话，需要使用 `docker stack deploy` 命令(参考[docker stack](https://docs.docker.com/engine/reference/commandline/stack/)

**docker-compose文件示例**

```
# docker-compose.prod.yml
version: '3'  
services:  
  webapp:
    image: registry.example.com/webapp
    networks:
      - ingress
    deploy:
      replicas: ${WEBAPP_REPLICAS}
      mode: replicated
      restart_policy:
        condition: on-failure

  proxy:
    image: registry.example.com/webapp-nginx-proxy
    networks:
      - ingress
    ports:
      - 80:80
      - 443:443
    deploy:
      replicas: ${NGINX_REPLICAS}
      mode: replicated
      restart_policy:
        condition: on-failure

networks:  
  ingress:
    external: true
```

**部署命令:**

```
export NGINX_REPLICAS=2 WEBAPP_REPLICAS=5

docker login registry.example.com  
docker stack deploy \  
  -c docker-compose.prod.yml\
  --with-registry-auth \
  frontend
```

另外，docker-compse文件支持环境变量(${VARIABLE})，这样你可以动态地调整配置。

### 11. 设置资源限制

根据我的经验，你需要限制所有服务的CPU使用。这样可以防止单个容器占用主机的所有的CPU资源。

`reserve-cpu` 选项也非常有用。当我希望平均地将所有容器部署到各个主机时，我会使用`reserve-cpu` ，它可以保证每个容器都有足够地资源。示例：

```bash
# 限制服务占用的CPU资源
docker service update  
  --limit-cpu 0.25
  --reserve-cpu 0.1
  webapp
```

### 13. 监控网络连接

我遇到过Swarm网络方面的问题。有时候所有的请求都被转发到某一个容器，然而还有9个其他容器正在运行。这时，可以尝试减少/增加实例个数，或者改变路由类型(使用`--endpoint-mode`选项)

如果没有监控日志的话，这样的问题很难被发现。因此，搭建监控系统是非常必要的。
