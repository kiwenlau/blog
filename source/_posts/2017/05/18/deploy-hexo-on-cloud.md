---
title: 将Hexo博客部署到云主机

date: 2017-05-18 09:00:00

tags: [Hexo, 原创]

---

**摘要:** 在云主机上搭建一个git裸仓库，然后使用nginx作为网页服务器，就可以轻松将Hexo博客通过git部署到云主机上。

<!-- more -->

### 这是一个忧伤的故事

我的博客[KiwenLau](http://kiwenlau.com/)之前部署在[Coding Pages](https://coding.net/help/doc/pages/)上，挺不错的，还可以一键启用HTTPS。作为一个喜欢折腾的人，我突然打算使用CDN加速一下访问速度，然而，国内的CDN服务要求网站必须备案。特意邮件问了Coding的客服，看来他们近期是不打算支持备案的，于是我就不得不考虑弄个云主机来玩玩了。

后来，[Coding Pages](https://coding.net/help/doc/pages/)忽然添加了[跳转页面](https://coding.net/u/coding/p/Coding-Feedback/topic/337715?page=2#comment-164435)，也就是说访问我的博客的话，会先弹出5秒钟的Coding广告页面。买个Coding年费199的会员就可以去掉，也不算贵，毕竟占着人家的资源。然而，我还琢磨着备案后用CND呢...

于是，我调研了一下各个云服务的价格，1核1G的云主机一年大概都是600+，比Coding会员贵了不少。不过[腾讯云](https://www.qcloud.com)最近在搞**采购节**，1核1G的云主机一年只要238，果断买了!

然而，备案这事貌似要折腾很久......此处省略1万字。

### 0. 准备工作

我的云主机的操作系统是**Ubuntu Server 16.04.1 LTS 64位**。不妨假设它的IP地址是**152.92.13.78**(我当然不会告诉你真实IP)，你需要做的第一步就是配置[SSH公钥登陆](http://www.ruanyifeng.com/blog/2011/12/ssh_remote_login.html)，这样Hexo通过git部署博客时就不需要输入密码了。

```shell
# SSH公钥登陆将不需要输入密码
ssh root@152.92.13.78
```

为了省事，我将直接使用root用户，这是**不符合安全规范**的。但是，一方面我只是为了部署博客，不担心黑客干坏事；另一方面，我也做了必要的安全防范，比如配置腾讯云安全组，禁止SSH密码登陆以及配置UFW防火墙。

这篇的博客参考了[利用 GIT HOOKS 部署 HEXO 到 VPS](https://munen.cc/tech/Hexo-in-VPS.html)，原文图文并茂。我做了一些优化，例如使用root用户，简化nginx配置文件，简化post-receive脚本，同时简单地介绍一下原理。

### 1. 安装git和nginx

```shell
apt-get update
apt-get install git-core nginx
```

### 2. 配置Nginx

#### **/var/www/blog**目录用于放置生成的静态文件

```
mkdir /var/www/blog
```

#### 编写nginx配置文件

```
vim /etc/nginx/conf.d/blog.conf
```

由于我的备案还没弄好，还不能使用80端口，所以暂时使用8080端口部署博客。

```
server
{
    listen 8080;
    root /var/www/blog;
}
```

#### 重启nginx

ubuntu 16.04的init系统换成了systemd，因此使用systemctl命令来重启nginx。

```
systemctl restart nginx
```

### 3. 配置Git Hooks

#### 创建Git裸仓库

**blog.git**作为远程Git仓库，Hexo在本地生成的博客静态文件可以通过push与其同步。

```
mkdir ~/blog.git && cd ~/blog.git
git init --bare
```

#### 配置Hooks脚本

**post-receive**脚本将在**blog.git**仓库接收到push时执行。

```
vim blog.git/hooks/post-receive
```

脚本非常简单，删除原有的**/var/www/blog**目录，然后从**blog.git**仓库clone新的博客静态文件。

```
#!/bin/bash

rm -rf /var/www/blog
git clone /root/blog.git /var/www/blog
```

给**post-receive**脚本执行权限

```
chmod +x blog.git/hooks/post-receive
```

### 4. 部署Hexo博客

#### 修改_config.yml

```yml
deploy:
  type: git
  repo: root@152.92.13.78:blog.git
```

#### 部署博客

hexo先生成新的博客静态文件，然后通过git将其同步到云主机的**blog.git**仓库。

```
hexo d
```

然后通过[http://152.92.13.78:8080/](http://152.92.13.78:8080/)即可访问博客。

备案之后，将ngnix端口改为80，把server_name设为域名，然后修改DNS解析到云主机就好了。

### 参考链接：

- [利用 GIT HOOKS 部署 HEXO 到 VPS](https://munen.cc/tech/Hexo-in-VPS.html)
