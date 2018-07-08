---

title: docker容器默认没有内存限制

date: 2018-07-07 10:00:00

tags: [Docker,笔记]

keywords: docker

description: docker容器默认没有内存限制

---

**摘要：** 默认情况下，docker容器可以使用主机的所有内存。

<!-- more -->

启动docker容器时，若没有设置**memory**和**memory-swap**选项，则该容器可以使用主机的所有内存，没有限制。

```bash
docker run -it ubuntu:14.04 /bin/bash
```

[Docker文档](https://docs.docker.com/engine/reference/run/#user-memory-constraints)：

> We set nothing about memory, this means the processes in the container can use as much memory and swap memory as they need.

### 参考

- [Docker 文档：Docker run reference - User memory constraints](https://docs.docker.com/engine/reference/run/#user-memory-constraints)

