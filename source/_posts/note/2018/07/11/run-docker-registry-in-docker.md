---

title: 基于Docker运行Docker Registry

date: 2018-07-11 10:00:00

tags: [Docker,笔记]

keywords: docker

description: 基于Docker运行Docker Registry

---

**摘要：** Docker可以用来运行任何应用，包括Docker Registry。

<!-- more -->


```bash
# 在Docker容器中运行Docker Registry
sudo docker run -d --name registry -p 5000:5000 registry:2.6.2

# 测试docker push
sudo docker pull hello-world
sudo docker tag hello-world localhost:5000/hello-world
sudo docker push localhost:5000/hello-world

# 测试docker pull
sudo docker image remove hello-world localhost:5000/hello-world
sudo docker pull localhost:5000/hello-world
```

如果希望Docker Registry能够给其他节点服务，则需要配置权限验证。或者[允许Docker使用无权限验证的Docker Registry](https://kiwenlau.com/note/2018/07/06/docker-memory/), 但是这样不安全。

### 参考
- [Docker文档: Deploy a registry server](https://docs.docker.com/registry/deploying/)


