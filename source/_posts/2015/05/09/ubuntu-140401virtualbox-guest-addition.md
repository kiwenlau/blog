title: Ubuntu 14.04.01中安装Virtualbox guest addition

date: 2015-05-09 09:00:00

tags: [Ubuntu]

---

**摘要:** 安装gust addition才能设置共享目录

<!-- more -->

### 1. 更新源

```bash
sudo apt-get update
```

### 2. 更新已安装的包

```bash
sudo apt-get -y upgrade
```

### 3. 安装所需的软件

```bash
sudo apt-get install -y build-essential module-assistant
```

### 4. 为编译安装驱动模块安装必须的各种软件包

```bash
sudo m-a prepare
```

### 5. 开启ubuntu虚拟机, 插入guest addition的CD

Devices > Insert Guest Additions CD image...

### 6. 挂载CD

```bash
sudo mount /dev/cdrom /media/cdrom
```

### 7. 安装guest addtion

```bash
sudo /media/cdrom/VBoxLinuxAdditions.run
```

### 8. 运行结果

```bash
# sudo /media/cdrom/VBoxLinuxAdditions.run
Verifying archive integrity... All good.
Uncompressing VirtualBox 4.3.26 Guest Additions for Linux............
VirtualBox Guest Additions installer
Copying additional installer modules ...
Installing additional modules ...
Removing existing VirtualBox non-DKMS kernel modules ...done.
Building the VirtualBox Guest Additions kernel modules
The headers for the current running kernel were not found. If the following
module compilation fails then this could be the reason.

Building the main Guest Additions module ...done.
Building the shared folder support module ...done.
Building the OpenGL support module ...done.
Doing non-kernel setup of the Guest Additions ...done.
Starting the VirtualBox Guest Additions ...done.
Installing the Window System drivers
Could not find the X.Org or XFree86 Window System, skipping.
```

运行结果含” Building the main Guest Additions module ...done”以及” Starting the VirtualBox Guest Additions ...done”表示安装成功

### 9. 可以用以下方法验证安装成功：

```bash
# lsmod | grep -io vboxguest
vboxguest
# modinfo vboxguest
filename:       /lib/modules/3.13.0-32-generic/misc/vboxguest.ko
version:        4.3.26
license:        GPL
description:    Oracle VM VirtualBox Guest Additions for Linux Module
author:         Oracle Corporation
srcversion:     3D54FF6D3C1923680BE85CB
alias:          pci:v000080EEd0000CAFEsv00000000sd00000000bc*sc*i*
depends:       
vermagic:       3.13.0-32-generic SMP mod_unload modversions
# lsmod | grep -io vboxguest | xargs modinfo | grep -iw version

version:        4.3.26
```

### 参考

- [Installing Guest Additions on Ubuntu](http://virtualboxes.org/doc/installing-guest-additions-on-ubuntu/)
- [How to install Virtualbox guest additions on Ubuntu 14.04](http://www.binarytides.com/vbox-guest-additions-ubuntu-14-04/)
