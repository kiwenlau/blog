---

title: Ubuntu彻底卸载Docker

date: 2018-07-10 10:00:00

tags: [Docker,笔记]

keywords: docker

description: Ubuntu彻底卸载Docker

---

**摘要：** 卸载Docker，同时删除Docker镜像、容器、数据卷等文件。

<!-- more -->

Docker自17.03版本开始分为两个版本Docker CE和Docker EE：

- Docker CE：Docker Community Edition，即Docker社区版
- Docker EE：即Docker Enterprise Edition，即Docker企业版。

卸载Docker的命令如下：

```bash
# 卸载Docker CE
sudo apt-get purge docker-ce
# 卸载Docker EE
sudo apt-get purge docker-ee
# 删除Docker镜像、容器、数据卷等文件
sudo rm -rf /var/lib/docker
```

### 参考
- [Docker文档：Uninstall Docker CE](https://docs.docker.com/install/linux/docker-ce/ubuntu/#uninstall-docker-ce)
- [Docker文档：Uninstall Docker EE](https://docs.docker.com/install/linux/docker-ee/ubuntu/#uninstall-docker-ee)
- [Docker博客：ANNOUNCING DOCKER ENTERPRISE EDITION](https://blog.docker.com/2017/03/docker-enterprise-edition/)


