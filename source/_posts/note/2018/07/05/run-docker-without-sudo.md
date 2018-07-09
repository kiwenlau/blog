---

title: 免sudo运行docker命令

date: 2018-07-05 10:00:00

tags: [Docker,笔记]

keywords: docker

description: 免sudo运行docker命令

---

**摘要：** 不要使用sudo，直接运行docker命令更加方便。

<!-- more -->

默认情况下，非root用户在ubuntu上运行docker命令必须使用sudo，否则会报错：

```bash
docker version
Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get http://%2Fvar%2Frun%2Fdocker.sock/v1.29/version: dial unix /var/run/docker.sock: connect: permission denied
```


这时，将当前用户添加到docker用户组中即可：

```bash
sudo usermod -aG docker $(whoami)
```

重新登录一下，就可以免sudo运行docker命令啦！这样做存在安全风险，不建议在生产环境中使用。


### 参考

- [Docker文档: Manage Docker as a non-root user](https://docs.docker.com/install/linux/linux-postinstall/#manage-docker-as-a-non-root-user)


