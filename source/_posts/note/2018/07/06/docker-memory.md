---

title: 允许docker使用无权限验证的docker registry

date: 2018-07-06 10:00:00

tags: [Docker,笔记]

keywords: docker

description: 允许docker使用无权限验证的docker registry

---

**摘要：** 配置insecure-registries，docker才能使用无权限验证的docker registry。

<!-- more -->

默认情况下，docker不能使用没有配置权限验证的**docker registry**，会出现如下报错：

```bash
docker pull 192.168.59.100:5000/ubuntu
Error response from daemon: Get https://192.168.59.100:5000/v2/: http: server gave HTTP response to HTTPS client
```

这时需要修改docker配置文件，将"192.168.59.100:5000"添加到insecure-registries中：

```bash
vim /etc/docker/daemon.json
{  "insecure-registries" : ["192.168.59.100:5000"]}
```

然后重启Docker

```bash
sudo systemctl restart docker // ubuntu 16.04
sudo restart docker // ubuntu 14.04
```

### 参考

- [Docker文档: Deploy a plain HTTP registry](https://docs.docker.com/registry/insecure/#deploy-a-plain-http-registry)



