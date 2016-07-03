title: 使用Vagrant创建多节点虚拟机集群

date: 2016-07-03 10:00

tags: [Vagrant]

---

**摘要:** 在前一篇博客中，我介绍了[使用Vagrant快速创建虚拟机](http://kiwenlau.com/2016/06/19/160619-vagrant-virtual-machine/)，但是所创建的只是单个虚拟机。这篇博客将介绍[使用Vagrant创建多节点虚拟机集群](http://kiwenlau.com/2016/07/03/vagrant-vm-cluster/)，可以作为[Hadoop](http://hadoop.apache.org/)，[Spark](http://spark.apache.org/)以及[Storm](http://storm.apache.org/)等分布式系统的运行环境。

<!-- more -->

- 作者: [KiwenLau](http://kiwenlau.com/)
- 日期: [2016-07-03](http://kiwenlau.com/2016/07/03/vagrant-vm-cluster/)

<img src="vagrant-vm-cluster/vagrant-vm-cluster.png" width = "500"/>

本文所有操作是在MacBook上进行的，Windows上的操作大部分一致，但是可能会有一些小问题。

## 一. 集群创建

#### **1. 安装[VirtualBox](https://www.virtualbox.org/wiki/Downloads)**

#### **2. 安装[Vagrant](https://www.vagrantup.com/downloads.html)**

#### **3. 下载Box**

```
vagrant box add ubuntu/trusty64
```

**Box**相当于虚拟机所依赖的镜像文件。

#### **4. 编辑Vagrantfile**

```
mkdir vagrant-cluster
cd vagrant-cluster
vim Vagrantfile
```

Vagrantfile如下，可以通过注释理解每个自定义配置的含义：

```
Vagrant.configure("2") do |config|

	(1..3).each do |i|

		config.vm.define "node#{i}" do |node|

		# 设置虚拟机的Box
		node.vm.box = "ubuntu/trusty64"

		# 设置虚拟机的主机名
		node.vm.hostname="node#{i}"

		# 设置虚拟机的IP
		node.vm.network "private_network", ip: "192.168.59.#{i}"

		# 设置主机与虚拟机的共享目录
		node.vm.synced_folder "~/Desktop/share", "/home/vagrant/share"

		# VirtaulBox相关配置
		node.vm.provider "virtualbox" do |v|

			# 设置虚拟机的名称
			v.name = "node#{i}"

			# 设置虚拟机的内存大小  
			v.memory = 2048

			# 设置虚拟机的CPU个数
			v.cpus = 1
		end
  
		# 使用shell脚本进行软件安装和配置
		node.vm.provision "shell", inline: <<-SHELL

			# 安装docker 1.11.0
			wget -qO- https://get.docker.com/ | sed 's/docker-engine/docker-engine=1.11.0-0~trusty/' | sh
			usermod -aG docker vagrant
			
		SHELL

		end
	end
end
```

与创建单个虚拟机相比，创建多个虚拟机时多了一层循环，而变量i可以用于设置节点的名称与IP，使用**#{i}**取值：

```
(1..3).each do |i|

end
```

可知，一共创建了3个虚拟机。

#### **5. 在桌面上创建share目录**

桌面上的share目录将与虚拟机内的/home/vagrant/share目录内容实时同步

```
mkdir ~/Desktop/share
```

#### **6. 创建虚拟机**

```
vagrant up
```

创建3个虚拟机大概需要15分钟，当然这和机器性能还有网速相关。安装Docker可能会比较慢，不需要的话删除下面几行就可以了：

```
# 使用shell脚本进行软件安装和配置
node.vm.provision "shell", inline: <<-SHELL

	# 安装docker 1.11.0
	wget -qO- https://get.docker.com/ | sed 's/docker-engine/docker-engine=1.11.0-0~trusty/' | sh
	usermod -aG docker vagrant

SHELL
```

下面是Vagrant虚拟机的配置，可以根据需要进行更改:

- 用户/密码: vagrant/vagrant
- 共享目录: 桌面上的share目录将与虚拟机内的/home/vagrant/share目录内容实时同步
- 内存：2GB
- CPU: 1


## 二. 集群管理

#### **1. 常用命令**

下面是一些常用的Vagrant管理命令，操作特定虚拟机时仅需指定虚拟机的名称。

- **vagrant ssh:** SSH登陆虚拟机
- **vagrant halt:** 关闭虚拟机
- **vagrant destroy:** 删除虚拟机
- **vagrant ssh-config** 查看虚拟机SSH配置

**启动单个虚拟机：**

```
vagrant up node1
```

**启动多个虚拟机：**

```
vagrant up node1 node3
```

**启动所有虚拟机：**

```
vagrant up
```

#### **2. SSH免密码登陆**

使用**vagrant ssh**命令登陆虚拟机必须切换到Vagrantfile所在的目录，而直接使用虚拟机IP登陆虚拟机则更为方便:

```
ssh vagrant@192.168.59.2
```

此时SSH登陆需要输入虚拟机vagrant用户的密码，即**vagrant**

将主机的公钥复制到虚拟机的authorized_keys文件中即可实现SSH免密码登陆:

```
cat $HOME/.ssh/id_rsa.pub | ssh vagrant@192.168.59.2 'cat >> $HOME/.ssh/authorized_keys'
```

#### **3. 重新安装软件**

Vagrant中有下面一段内容：

```
# 使用shell脚本进行软件安装和配置
node.vm.provision "shell", inline: <<-SHELL

	# 安装docker 1.11.0
	wget -qO- https://get.docker.com/ | sed 's/docker-engine/docker-engine=1.11.0-0~trusty/' | sh
	usermod -aG docker vagrant
SHELL
```

其实就是嵌入了一段Shell脚本进行软件的安装和配置，这里我安装了[Docker](https://www.docker.com/)，当然也可以安装其他所需要的软件。修改此段内容之后，重新创建虚拟机需要使用"--provision"选项。

```
vagrant halt
vagrant up --provision
```

#### **4. 共享目录挂载出错**

VirtualBox设置共享目录时需要在虚拟机中安装VirtualBox Guest Additions，这个Vagrant会自动安装。但是，VirtualBox Guest Additions是内核模块，当虚拟机的内核升级之后，VirtualBox Guest Additions会失效，导致共享目录挂载失败，出错信息如下:

```
Failed to mount folders in Linux guest. This is usually because
the "vboxsf" file system is not available. Please verify that
the guest additions are properly installed in the guest and
can work properly. The command attempted was:

mount -t vboxsf -o uid=`id -u vagrant`,gid=`getent group vagrant | cut -d: -f3` vagrant /vagrant
mount -t vboxsf -o uid=`id -u vagrant`,gid=`id -g vagrant` vagrant /vagrant

The error output from the last command was:

stdin: is not a tty
/sbin/mount.vboxsf: mounting failed with the error: No such device
```

安装Vagrant插件[vagrant-vbguest](https://github.com/dotless-de/vagrant-vbguest)可以解决这个问题，因为该插件会在虚拟机内核升级之后重新安装VirtualBox Guest Additions。

```
vagrant plugin install vagrant-vbguest
```