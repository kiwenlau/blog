---

title: 使用Vagrant创建ubuntu xenial 16.04虚拟机

date: 2018-07-14 10:00:00

tags: [Vagrant,笔记]

keywords: vagrant

description: 使用Vagrant创建ubuntu xenial 16.04虚拟机

---

**摘要:** 使用Vagrant可以快速在MacBook上创建Linux虚拟机，用于开发。

<!-- more -->


所使用的Vagrant版本是2.0.1：

```bash
vagrant --version
Vagrant 2.0.1
```

新建Vagrant配置文件Vagrantfile

```bash
vim Vagrantfile
```

Vagrantfile内容如下：

```ruby
Vagrant.configure("2") do |config|

  config.vm.define "xenial1" do |node|
    node.vm.box = "ubuntu/xenial64"
    node.vm.hostname="xenial1"
    node.vm.network "private_network", ip: "192.168.59.11"

    # 共享目录
    node.vm.synced_folder "~/Desktop/ubuntu", "/home/vagrant/macbook"
    node.vm.synced_folder "~/Desktop/Fundebug", "/home/vagrant/Fundebug"

    node.vm.provider "virtualbox" do |v|
      v.name = "xenial1"
      v.memory = 6144
      v.cpus = 2
      v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    end

  end

end
```

创建虚拟机：

```bash
vagrant up
```

SSH登陆虚拟机：

```bash
vagrant ssh
```


