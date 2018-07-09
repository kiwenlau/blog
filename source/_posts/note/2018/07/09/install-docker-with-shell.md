---

title: 使用shell脚本安装Docker

date: 2018-07-09 10:00:00

tags: [Docker,笔记]

keywords: docker

description: 使用shell脚本安装Docker

---

**摘要：** 安装Docker最便捷的方式。

<!-- more -->

Linux上安装Docker，最方便的莫过于使用Docker提供的shell脚本了，一条命令搞定。不过这种方式不安全，不推荐在生产环境中使用。

#### 使用Docker官方源：

```bash
curl -fLsS https://get.docker.com/ | sh
```

Docker官方源在国内访问不太稳定。

#### 使用[DaoCloud](https://download.daocloud.io/Docker_Mirror/Docker)源：

```bash
curl -sSL https://get.daocloud.io/docker | sh
```

### 参考

- [Docker文档 - Install using the convenience script](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-using-the-convenience-script)


