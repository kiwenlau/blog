---

title: docker network命令

date: 2018-07-08 10:00:00

tags: [Docker,笔记]

keywords: docker

description: docker network命令

---

**摘要：** docker network命令用于管理Docker网络。

<!-- more -->

```bash
# 创建网络
docker network create

# 列出网络
docker network ls

# 连接网络
docker network connect

# 断开网络
docker network disconnect

# 查看网络详情
docker network inspect

# 删除网络
docker network rm

# 删除所有未使用的网络
docker prune
```

使用**docker network --help**可以查看所有docker network命令：

```bash
connect     Connect a container to a network
create      Create a network
disconnect  Disconnect a container from a network
inspect     Display detailed information on one or more networks
ls          List networks
prune       Remove all unused networks
rm          Remove one or more networks
```

### 参考

- [Docker文档：Use bridge networks](https://docs.docker.com/network/bridge/)

