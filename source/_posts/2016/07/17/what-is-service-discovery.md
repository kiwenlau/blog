title: 何为服务发现？

date: 2016-07-17 10:00

tags: [服务发现]

---

**摘要:** 将应用运行在容器中，然后部署到容器集群时，其服务地址，即**IP**和**端口**通常是集群调度器动态分配的。并且，单个服务对应的容器副本数量需要根据负载动态变化。那么，当我们需要访问某个服务时，如何确定它的地址呢？这时，就需要**服务发现**了。本文将以Nginx的部署为例，介绍服务发现的原理与实践。

<!-- more -->

- 作者: [KiwenLau](http://kiwenlau.com/)
- 日期: [2016-07-17](http://kiwenlau.com/2016/07/17/what-is-service-discovery/)

![](what-is-service-discovery/service-discovery.png)

## 一. 单机部署Nginx

[Nginx](https://nginx.org)作为网页服务器，功能与Apache一致。使用[Docker](https://www.docker.com/), 可以在Linux服务器中快速部署Nginx。

#### **1. 下载Nginx镜像**

```
sudo docker pull nginx:1.10
```

#### **2. 运行Nginx容器**

```
sudo docker run -d \
                -p 80:80 \
                nginx:1.10
```

其中，**-d**选项表示Nginx容器在后台运行，而**-p**选项表示容器的**80**端口映射为主机的**80**端口。

#### **3. 访问Nginx服务**

```
curl 192.168.59.1:80
```

返回结果为html文件:

```
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

其中，**192.168.59.1**是运行Nginx容器的主机的IP，而**80**是Nginx提供服务的端口。这时，Nginx服务的IP与端口相当于是静态分配的，因此很容易获取服务地址。

由Nginx的单机部署可知，将应用运行在容器中，然后部署到单个主机上时，服务的IP即为主机IP，而服务的端口由**-p**选项指定，这时服务地址相当于是静态分配的，因此不存在服务发现的问题。然而，当我们将服务部署到容器集群上呢？


## 二. Mesos/Marathon集群中部署Nginx

首先，可以按照[基于Docker搭建多节点Mesos/Marathon](http://kiwenlau.com/2016/07/10/mesos-marathon-platform/)介绍的方法，快速搭建3个节点的Mesos/Marathon集群。该博客中，我选择了[Marathon LB](https://github.com/mesosphere/marathon-lb)来实现服务发现，但是也可以在不使用服务发现的情况下部署nginx，这样可以体会服务发现的作用。

**1. 不使用服务发现**

Nginx定义(nginx.json):

```
{
    "id": "nginx",
    "cpus": 0.2,
    "mem": 20.0,
    "instances": 1,
    "healthChecks": [{
        "path": "/"
    }],
    "container": {
        "type": "DOCKER",
        "docker": {
            "image": "nginx:1.10",
            "network": "BRIDGE",
            "portMappings": [{ "containerPort": 80, "hostPort": 0, "protocol": "tcp" }]
        }
    }
}
```

其中，**instances**为1，表示仅部署单个Nginx容器; **hostPort**为0，表示Nginx容器绑定的主机端口由Marathon随机分配。

部署Nginx:

```
curl -Ss \
     -X POST \
     -H "Content-Type: application/json" \
     --data "@nginx.json" \
     http://127.0.0.1:8080/v2/apps | python2.7 -mjson.tool
```

这时，Nginx容器可能运行node2(192.168.59.2)上，也可能运行在node3(192.168.59.3)上，因此Nginx服务的IP是无法事先确定的。而Nginx容器绑定的主机端口由Marathon随机分配，更加不确定。其实，端口是通过**hostPort**事先指定的，那为什么不这样呢？因为指定服务的端口有可能会发生端口冲突，当集群中运行了众多不同的服务时，**采用静态方式分配端口是不太现实的，也限制了集群的灵活性与扩展性**。

在Slave节点上使用**docker ps**命令可以获取Nginx服务的IP与端口。

node2(192.168.59.2)

```
sudo docker ps | grep nginx
b863d407b880        nginx:1.10              "nginx -g 'daemon off"   15 minutes ago      Up 15 minutes       443/tcp, 0.0.0.0:31575->80/tcp   mesos-d34d0b5b-c3b1-4020-9bb2-bb8582252bf3-S0.d2de6d05-9751-4fbe-af10-d7e35e9e6c7b
```

node3(192.168.59.3)

```
sudo docker ps | grep nginx
```

可知Nginx服务的IP与端口分别为**192.168.59.2**和**31575**，即Nginx的服务地址为：[http://192.168.59.2:31575](http://192.168.59.2:31575)

每次重新部署Nginx时，Nginx服务的IP和端口很可能会发生变化，这就意味着每次都要手动查询服务地址，这显然是很不方便的。因为我们往往需要运行非常多不同的应用，这就意味着**服务发现**是容器集群系统的必备功能。


**2. 使用[Marathon LB](https://github.com/mesosphere/marathon-lb)做服务发现**

Nginx定义(nginx.json):

```
{
    "id": "nginx",
    "labels": {
        "HAPROXY_GROUP": "external"
    },
    "cpus": 0.2,
    "mem": 20.0,
    "instances": 1,
    "healthChecks": [{
        "path": "/"
    }],
    "container": {
        "type": "DOCKER",
        "docker": {
            "image": "nginx:1.10",
            "network": "BRIDGE",
            "portMappings": [{ "containerPort": 80, "hostPort": 0, "servicePort": 10000, "protocol": "tcp" }]
        }
    }
}
```

其中，nginx.json只有**HAPROXY_GROUP**与**servicePort**两处修改。**HAPROXY_GROUP**为external，表示Nginx将使用分组为external的**Marathon LB**做服务发现。**servicePort**为10000，表示Nginx将使用**Marathon LB**节点的10000端口提供服务。

部署Nginx:

```
curl -Ss \
     -X POST \
     -H "Content-Type: application/json" \
     --data "@nginx.json" \
     http://127.0.0.1:8080/v2/apps | python2.7 -mjson.tool
```

这时，Nginx服务的IP为运行Marathon LB的节点IP，即**192.168.59.1**，而Nginx服务的端口为**servicePort**指定的端口，即10000。因此，Nginx的服务地址为：[http://192.168.59.1:10000](http://192.168.59.1:10000)

