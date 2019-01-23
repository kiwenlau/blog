---

title: 如何保证MongoDB的安全性？

date: 2019-01-21 10:00:00

tags: [MongoDB]

keywords: MongoDB, UFW

description: 如何保证MongoDB的安全性？

---

**摘要：** 简单有效的MongoDB安全配置方法。

<!-- more -->

上周写了个简短的新闻[《MongoDB裸奔，2亿国人求职简历泄漏！》](https://blog.fundebug.com/2019/01/12/200-million-resume-exposed-because-mongodb-is-not-protected/)：

> 根据安全站点HackenProof的[报告](https://blog.hackenproof.com/industry-news/202-million-private-resumes-exposed/)，由于MongoDB数据库没有采取任何安全保护措施，导致共计202,730,434份国人求职简历泄漏。

然后很多人[评论](https://www.oschina.net/news/103558/202-million-private-resumes-exposed)说MongoDB躺枪了。

MongoDB确实躺枪了，因为**这事的责任当然不在数据库，而在于使用数据库的人没有做必要的安全配置。**

那么我们应该如何保证MongoDB的安全性？下面我将介绍保护MongoDB的3个简单的方法：

- 绑定局域网IP，杜绝互联网访问
- 配置防火墙，保护27017端口
- 配置账号密码，对数据库进行访问控制

本教程所使用的系统配置如下：

- Ubuntu 16.04
- mongodb 4.0.5

**Ubuntu 16.04安装MongoDB**

参考MongoDB文档：[Install MongoDB Community Edition on Ubuntu](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

```bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org=4.0.5 mongodb-org-server=4.0.5 mongodb-org-shell=4.0.5 mongodb-org-mongos=4.0.5 mongodb-org-tools=4.0.5
sudo service mongod start
```

### 1. 绑定局域网IP，杜绝互联网访问

话说MongoDB被黑了这么多年，自身确实有一定的责任。版本3.6之前，MongoDB默认绑定的居然是**0.0.0.0**，这就意味着我们可以通过互联网访问MongoDB，那黑客当然也可以。这样的默认配置是一个很大的安全漏洞，很多MongoDB初学者都栽在这一点。关于这个问题，MongoDB的[文档](https://docs.mongodb.com/manual/release-notes/3.6/#bind-to-localhost)说得很委婉：

> Default Bind to Localhost
>
> Starting with MongoDB 3.6, MongoDB binaries, mongod and mongos, bind to localhost by default. From MongoDB versions 2.6 to 3.4, only the binaries from the official MongoDB RPM (Red Hat, CentOS, Fedora Linux, and derivatives) and DEB (Debian, Ubuntu, and derivatives) packages would bind to localhost by default.

也就是说，从3.6开始，MongoDB默认绑定localhost，这就意味着我们只能在本机访问MongoDB。至于2.6到3.4，只有从MongoDB RPM与DEB下载的安装包才默认绑定localhost，换句话说，其他方式下载的安装包则默认绑定0.0.0.0。因此，如果你使用的MongoDB是3.6之前的版本，就要特别注意这一点了。

在开发环境下，MongoDB绑定localhost没毛病。但是，在生产环境下，我们通常会有多个节点，这时需要修改MongoDB绑定的IP，通过配置[net.bindIp](https://docs.mongodb.com/manual/reference/configuration-options/#net.bindIp)可以实现。

如果为了省事，直接把[net.bindIp](https://docs.mongodb.com/manual/reference/configuration-options/#net.bindIp)配置为0.0.0.0，那就不太妙了。正确的做法应该是绑定局域网IP，这样只有局域网内的节点可以访问MongoDB。除非黑客端掉了你的服务器，否则他是没法访问你的MongoDB的。

哪些IP是局域网的呢？按照标准，有下面这些网段：

- 10.0.0.0 – 10.255.255.255
- 172.16.0.0 – 172.31.255.255
- 192.168.0.0 – 192.168.255.255

最常用的局域网网段就是192.168.0.0到192.168.255.255了。

**修改MongoDB的配置文件**

```bash
vim /etc/mongod.conf
```

将[net.bindIp](https://docs.mongodb.com/manual/reference/configuration-options/#net.bindIp)设为局域网IP地址**192.168.59.99**：

```
net:
  port: 27017
  bindIp: 192.168.59.99
```

**重启MongoDB**

```bash
sudo service mongod restart
```

### 2. 配置防火墙，保护27017端口

MongoDB默认使用的是27017端口，我们应该配置本地防火墙把这个端口保护起来，禁止外部IP访问。

在MongoDB绑定0.0.0.0，且没有配置防火墙的情况下，使用nmap命令远程扫描27017端口，结果如下：

```bash
nmap -p 27017 113.207.35.149

Starting Nmap 6.49BETA3 ( https://nmap.org ) at 2019-01-19 14:17 CST
Nmap scan report for 113.207.35.149
Host is up (0.042s latency).
PORT      STATE SERVICE
27017/tcp open  mongod

Nmap done: 1 IP address (1 host up) scanned in 14.34 seconds
```

可知，27017端口是"open"的，这就意味着我们可以远程访问MongoDB数据库。

#### 配置UFW防火墙

Ubuntu上默认的防火墙软件是[UFW](https://help.ubuntu.com/community/UFW)，配置起来非常简单。默认情况下，ufw并没有激活：

```bash
sudo ufw status
Status: inactive
```

执行以下命令，即可配置ufw规则，并启动防火墙：

```bash
sudo ufw default deny incoming // 默认禁止访问本机所有端口
sudo ufw default allow outgoing // 允许本机访问外部网络
sudo ufw allow 22/tcp // 允许SSH登陆
sudo ufw allow from 192.168.59.100 to any port 27017 // 仅允许局域网内IP为192.168.59.100的服务器访问mongodb
sudo ufw enable
```

我所配置的规则也非常容易理解，根据命令就能看出来。这时，再查看ufw的状态，可以发现防火墙已经激活了：

```bash
sudo ufw status
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
27017                      ALLOW       192.168.59.100
22/tcp (v6)                ALLOW       Anywhere (v6)
```

这时，再使用nmap命令远程扫描27017端口，结果如下：

```bash
nmap -p 27017 113.207.35.149

Starting Nmap 6.49BETA3 ( https://nmap.org ) at 2019-01-19 14:40 CST
Nmap scan report for 113.207.35.149
Host is up (0.053s latency).
PORT      STATE    SERVICE
27017/tcp filtered mongod

Nmap done: 1 IP address (1 host up) scanned in 13.68 seconds
```

可知，27017端口的状态为"filtered"，已经被防火墙保护起来了，更加安全。

Linux上常用的防火墙工具还有iptables，这里就不再赘述了。

另外，云服务器都支持配置防火墙，也有必要配置一下，它们与本机的防火墙是独立的，可以共同来保证数据库的安全。

### 3. 配置账号密码，对数据库进行访问控制

默认情况下，MongoDB并没有配置账号和密码，黑客只要登陆你的服务器之后可以直接查看数据库。给MongoDB[配置账号密码](https://docs.mongodb.com/manual/tutorial/enable-authentication/)，可以有效解决这个问题。

**连接mongodb**

```bash
mongo
```

**配置账号密码**

账号为"myUserAdmin"，密码为"abc123"。

```bash
use admin
db.createUser(
  {
    user: "myUserAdmin",
    pwd: "abc123",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
  }
)
```

**修改MongoDB的配置文件**

```bash
vim /etc/mongod.conf
```

将[security.authorization](https://docs.mongodb.com/manual/reference/configuration-options/#security.authorization)设为"enabled"：

```
security:
  authorization: enabled
```

**重启MongoDB**

```bash
sudo service mongod restart
```

**连接mongodb**

再次连接mongodb时，则需要指定账号与密码。

```txt
mongo -u "myUserAdmin" -p "abc123" --authenticationDatabase "admin"
```

如果不提供账号密码，则无法查看数据库，会出现如下这种错误：

```bash
show dbs
2019-01-20T22:13:53.477+0800 E QUERY    [js] Error: listDatabases failed:{
	"ok" : 0,
	"errmsg" : "command listDatabases requires authentication",
	"code" : 13,
	"codeName" : "Unauthorized"
}
```

另外，MongoDB还支持配置多个权限不同的账号，针对性地对特定数据库的读写权限进行配置。这样更加细致的访问控制可以增强安全性，举个不太恰当的例子，对于团队中的实习生，应该只给他们读权限，这样可以有效防止出现误操作导致删库等极端情况。


### 总结

可以发现，本文介绍的方法都非常简单，属于常识，但是都是必要的。作为数据库管理者，如果这些都没有配置，那显然是非常不专业的，责怪MongoDB也没有用，因为换个数据库也会有同样的问题。

根据MongoDB文档提供的[Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)，我们还可以使用TLS/SSL来加密MongoDB连接，这样做会在一定程度上牺牲性能，大家可以根据需要来配置。

另外，保证数据库的访问安全非常重要，同时也需要保证数据的安全性，做好必要的数据备份。关于如何保护数据的安全性，可以参考我们的博客《[Fundebug是这样备份数据的](https://blog.fundebug.com/2018/09/27/how-does-fundebug-backup-data/)》。

### 参考

- [MongoDB裸奔，2亿国人求职简历泄漏！](https://blog.fundebug.com/2019/01/12/200-million-resume-exposed-because-mongodb-is-not-protected/)
- [Fundebug是这样备份数据的](https://blog.fundebug.com/2018/09/27/how-does-fundebug-backup-data/)