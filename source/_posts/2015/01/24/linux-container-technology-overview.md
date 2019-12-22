title: Linux Container Technology Overview

date: 2015-01-24 09:00:00

tags: [Docker]

---

**摘要:** To understand the history of container technology.

<!-- more -->

Originally, I posted this blog on my [blogspot](http://kiwenlau.blogspot.com/2015/01/linux-container-technology-overview.html)

> http://kiwenlau.blogspot.com/2015/01/linux-container-technology-overview.html


In this article, I want to provider an overview of Linux Container Technology, which is a promising lightweight virtualization technology. I will call **L**inu**x** **C**ontainer technology as LXC technology for short in this article. In fact, LXC technology is not a new technology, but it recently attracts more and more interests because of the release of Docker, a popular Linux Container Tool. 

One thing that may confuse us is that LXC technology is not equal to a Linux Container tool called LXC hosted on [linuxcontainers.org](https://linuxcontainers.org/). Like VirtualBox and Virtual Machine technology, LXC is just a specific implementation tool of LXC technology. In fact, there are lots of other LXC tools: Linux-Vserver, Virtuozzo, OpenVZ, libvirt LXC driver, Warden, Docker, lmctfy and CoreOS Rocket. 

This article will be organized into 4 sections. 

- **Section 1:** I will present an introduction to LXC technology, to share the history, definition, benefits and problems of LXC technology. 
- **Section 2:** I will talk about underlying technical basis of LXC technology and concentrate on two Linux kernel features used by LXC Technology: Cgroups and Namespaces. 
- **Section 3:** I will briefly introduce almost all Linux Container tools that I can find and talk about Docker in detail. Like LXC technology, I will call Linux Container tools as LXC tools for short. 
- **Section 4:** I will make some conclusions about LXC technology 

## 1. **Introduction**

### History

In fact, LXC technology has at least over a decade history, if we tract it to Chroot**,** the story will begin at last century in 1979[[1\]](http://uds-web.blogspot.jp/2014/09/linux-containers-server-virtualization.html). As far as I’m concerned, I’d like to tell the story from 2001, when the first two LXC tools, Virtuozzo and Linux-Vserver, were born. However, it only becomes popular recently along with the release of Docker in 2013. Google said it “doing this for 10 years”[[2\]](https://speakerdeck.com/jbeda/containers-and-gcp) and released an open source version of its LXC tool called lmctfy in 2013. So, 2013 is a great year for LXC technology. Following table shows the history of LXC technology. 

| **Year** | **Events**                                      |
| -------- | ----------------------------------------------- |
| 2001     | Linux-Vserver and Virtuozzo was born            |
| 2002     | Mount Namespaces was adopted into kernel 2.4.19 |
| 2005     | OpenVZ was born                                 |
| 2008     | Cgroups was adopted into kernel 2.6.24          |
| 2008     | LXC and libvirt LXC driver was born             |
| 2009     | LXC was adopted into kernel 2.6.29              |
| 2011     | Warden was born                                 |
| 2013     | User Namespaces was adopted into kernel 3.8     |
| 2013     | Docker and lmctfy was born                      |
| 2014     | CoreOS Rocket was born                          |
*Table 1 – History of LXC technology*

In Table 1, there are 9 different LXC tools: Linux-Vserver, Virtuozzo, OpenVZ, LXC, libvirt LXC driver, Warden, Docker, lmctfy and CoreOS Rocket. I will talk about them in section 3. And I will talk about Cgroups and Namespaces in section 2. 

### What is LXC technology?

LXC technology is an Operating system level virtualization technology. Different with traditional hypervisor-based virtualization technology, it runs multiple isolated Linux Containers rather than Virtual Machines on the host OS. LXC technology is a lightweight virtualization technology because Linux Container is much more smaller and faster than Virtual Machine. Each Virtual Machine will run an independent OS inside it while Linux Container won’t. 

It is said that LXC Technology will be the next generation of virtualization technology. It is attractive to High Performance Computing and Cloud Computing because of its great performance improvement. According to a recent report, everything at Google including search and gmail run in containers, [they start over 2 billion containers per week](https://speakerdeck.com/jbeda/containers-at-scale) This can also show the importance of LXC technology. 

### What is Linux Container?

In fact, we can view Linux Container as a lightweight Virtual Machine without OS. Some people also call it Virtual Environment(VE) or Virtual Private Server(VPS). Almost all applications can run inside Linux Container and applications run inside Linux Container feel like only they own the whole physical machine. Linux Containers have many features that are different with Virtual Machine. Multiple isolated Linux Containers share the same linux kernel. A Linux container only consists of application and its dependences. More importantly, it is much more small and fast than VM. 

### Virtual Machine VS Linux container

![](https://image.fundebug.com/2019-12-22-virtual-machine-vs-linux-container.jpg)
*Picture 1 – Virtual Machine VS Linux Container*

Picture 1 shows the differences between Virtual Machine and Linux Container. Type 2 hypervisor(VirtualBox, VMware Workstation) run on Operating System while Type 1 Hypervisor(Xen, Microsoft Hype-V) run on Hardware. Linux Containers share the same OS while each Virtual machine has its own OS. So, Linux Container is significantly smaller and faster than Virtual Machine. These can bring a lot of benefits. 

### Benefits

Lots of researches have found that LXC technology has near-native performance, fast operation and high density. All these benefits make LXC technology an attractive option for us to get more performance at a lower cost. 

**Near-Native performance.**

Linux-Vserver, OpenVZ, LXC have near-native performance (CPU, Memory, disk, Network)[4]. Linux-Vserver provide up to 2x the performance of Xen for server-type workload[5]. Docker equals or exceeds KVM performance in every cases(CPU, Memory, Network…)[6]. Xen incurs higher overhead than OpenVZ does for all configurations and workload[7]. 

**Fast operation** 

Docker outperform KVM: 48X reboot, 1.5X boot, 1.62X snapshot[[8\]](http://www.slideshare.net/BodenRussell/kvm-and-docker-lxc-benchmarking-with-openstack) 

**High Density** 

Docker outperforms KVM: 3X memory savings, 26X CPU savings, 3.22X smaller images[[8\]](http://www.slideshare.net/BodenRussell/kvm-and-docker-lxc-benchmarking-with-openstack).Containers can support up to 3x density of hypervisors and more in the future[[9\]](http://events.linuxfoundation.org/sites/events/files/eeus13_bottomley.pdf). 

### Problems

However, LXC technology also has some problems. 

First, it has some kernel relevant issues. It cannot run other OS on Linux kernel using LXC technology. Table 2 shows some Container Tools for other operating systems. Moreover, LXC technology is based on Modern Linux Kernel features，so newer kernel is preferred, for example，Docker requires kernel 3.8 or above, LXC require kernel 2.6.32 or above and prefers 3.8, 3.12 or above. 

| **Operating System** | **Container Tools** |
| -------------------- | ------------------- |
| Windows              | Virtuozzo           |
| Solaris              | Solaris Zones       |
| FreeBSD              | FreeBSD Jail        |
| AIX                  | WPARS               |
| HPUX                 | HP-UX containers    |
*Table 2 – Container Tools for other OS*

Live migration is also a problem. As far as I know, only OpenVZ and Virtuozzo can support live migration. Using CRIU will be a choice, but it only supports LXC and Docker now. Moreover, a lot of problems still need to be fixed to use CRIU for live migration. 

More importantly, because Linux Containers share the same linux kernel, so it provides poor isolation, this will cause some security problem. Security is an important reason that Linux Container may not replace Virtual Machine now. 

## 2. **Underlying Technical Basis**

LXC technology is based on Modern Linux kernel features. There are two de factor standard for creating Linux Container: Cgroups and Namespaces. Cgroups is used for resource control while Namespaces is used for isolation. If you view a Linux container as a group of processes isolated with all other processes from the host and other Linux containers. Then Cgroups is used by LXC technology to control the resource usage of processes in a Linux Container and Namespaces is used for isolate processes inside a Linux Container from processes from the host and other Linux Containers. So resource control and isolation are key components for creating multiple isolated Linux Containers. As show in table 1, these two features are adopted into kernel in recent years. LXC technology has a long history, but it became popular recently, maybe it is because Linux kernel features like Cgroups and Namespaces become available now. There are also other features used byLXC technology, such as Chroot, AUFS, SELinux and so on. 

| **LXC Tools** **Kernel Features**                            | **Cgroups** | **Namespaces** |
| ------------------------------------------------------------ | ----------- | -------------- |
| Linux-Vserver[[10\]](http://linux-vserver.org/Welcome_to_Linux-VServer.org) | Yes         | NO             |
| Virtuozzo[[11\]](http://sp.parallels.com/products/pvc/)      | Maybe       | Maybe          |
| OpenVZ[[12\]](http://openvz.org/Main_Page)                   | Yes         | Yes            |
| LXC[[13\]](https://linuxcontainers.org/)                     | Yes         | Yes            |
| libvirt[[14\]](http://libvirt.org/)                          | Yes         | Yes            |
| Warden[[15\]](http://docs.cloudfoundry.org/concepts/architecture/warden.html) | Yes         | Yes            |
| Docker[[16\]](https://www.docker.com/)                       | Yes         | Yes            |
| lmctfy[[17\]](https://github.com/google/lmctfy)              | Yes         | NO, but will   |
| Rocket[[18\]](https://github.com/coreos/rocket)              | Yes         | Yes            |

*Table 3 – LXC Tools use Cgroups and Namespaces*

Table 3 shows whether these LXC tools use Cgroups and Namespaces or not. We can find that all most all tools use Cgroups and Namespaces, Virtuozzo is a commercial product, the official documents don’t specify whether it use Cgroups and Namespaces. So, Cgroups and Namespaces are de factor standard technical basis for LXC technology. 

Cgroups is the abbreviation of Control groups, it is used for resource management. Simply speaking, a “Cgroups” is a group of processes under resource control. As for LXC technology, you can create a “Cgroups” for each Linux Container and control its resource usage, such as CPU, Memory and so on. Cgroups was started by two Google engineers in 2006 and it was adopted into Linux kernel 2.6.24 in 2008. 

Cgroups has many subsystems, like mem, cpu, devices, blkio, cpuset, freezer and cpuacct, each subsystem can be used to control a specific resource. For example, by using memory subsystem, you can limit the memory available to a “Cgroups”; for the CPU subsystem, you can control the CPU time that a “Cgroups” can use. In this context, a “Cgroups” is corresponding to a Linux Container, so we can control the resource usage of a Linux Container by utilizing these subsystems of Cgroups. 

Another linux kernel feature used by LXC technology is Namespaces. It is used for isolation. There are currently six different kinds of namespaces: PID, Network, User, Mount, UTS and IPC. And each kind of namespaces applies to a specific resource. In fact, one of the overall goals of Namespaces is to support the implementation of LXC technology. By using Namespaces, each Linux Container can only see resources in its own namespace. Linux Namespaces has a long history, Mount namespaces was adopted into Linux kernel 2.4.19 in 2002 while user namespaces was adopted into kernel 3.8 in 2013. 

There are six kinds of Namespaces, each namespaces is corresponding to a specific resource. For example, PID namespaces is for process isolation. Each pid namespace has its own set of process number. Processes in a Linux Container cannot see and affect processes of the host OS or sibling Linux Containers. Network namespaces is for Network resources isolation. Each network namespace has its own IP address, port numbers and so on. So multiple web servers running in different Linux Containers on the same host all can listen to port 80. This is very useful! Other namespaces are also used by LXC technology. Currently, Docker uses all namespaces except User namespaces while LXC use all Namespaces. 

## 3. **Implementation Tools**

LXC Tools are tools for creating, running, deleting Linux Containers. Picture 2 shows a timeline of almost all LXC Tools that I can find. So, LXC Tools have over a decade history. Virtuozzo is a commercial product, while all others are open source projects. OpenVZ is the open source version of Virtuozzo. LXC is originated from OpenVZ. Early versions of Warden and Docker is based on LXC. So we can track the history of docker to Virtuozzo. It’s interesting that Docker is very hot in the industry now but its ancestors keep silent. 

![](https://image.fundebug.com/2019-12-22-lxc-tools.jpg)
*Picture 2 – Timeline of LXC Tools*

There are some take home messages about LXC Tools. Virtuozzo and Linux-Vserver are the oldest LXC tool. Almost all tools use Cgroups and Namespaces. All tools are open source projects, except Virtuozzo. LXC tool is merged to the Linux kernel since 2009. Google researched LXC technology for about 10 years and released lmctfy(Let Me Contain that For You) in 2013. Docker is the most popular now! So, I will introduce Docker in detail. 

![](https://image.fundebug.com/2019-12-22-google-trend-docker.png)
*Picture 3 – Google Trend of Docker since its release*

Picture 3 shows the Google Trend of Docker, we can find that it is becoming more and more popular since its release. More importantly, an ecosystem around Docker is growing rapidly[[6\]](http://research.gigaom.com/report/docker-and-the-current-linux-container-ecosystem/). Many players such as Cloud provider and OS provider in the industry show great interests to support Docker. This is very impressive and it seems that Docker activate LXC Technology. 

![](https://image.fundebug.com/2019-12-22-docker-achitecture.jpg)
*Picture 4 – Docker Achitecture*

However, Docker do have some magic parts. First, Docker is very easy to use. Picture 5 shows the relations between Container, Image and Registry. Once you master these 5 key commands, you can run applications in Container and ship it anywhere, it’s very easy. Docker also provide methods to package application and dependencies into a single image. This can solve “dependency hell” problem. Sometimes build an applications environment is very toughing and time consuming. By using Docker, we can package an application and all its dependencies into a image and rebuild application environment from the image easily. In addition, we can share and manage images through registry easily. For example, we can upload our images into Docker hub, which is a public registry, and then we can download the image from another place and rebuild our application environment. Other people can use your image, more importantly, you can also use other people’s images! I think all of these make Docker successful! 

![](https://image.fundebug.com/2019-12-22-docker-image-rgistry-and-container.jpg)
*Picture 5 – Docker Image, Registry and Container*

## 4. **Conclusion**

In conclusion, LXC technology is a promising lightweight technology. Its is ideal for Cloud Computing because it can provider better performance and more density, which mean profit for industry. Everyone like profit and people from industry to academia will try their best to solve problems of LXC technology, like live migration and security. LXC technology will be well developed in a few years and will be widely used. 

As a great LXC tool, Docker is going to be a standard LXC tool. It also has problems like live migration and security, but it will be fixed in the future I believe. For Docker, Dockfile optimization and Docker image optimization need to be further researched. Moreover, using Docker for some specific application like Docker-based Hadoop Cluster is a interesting topic and will be a feature direction for Docker research. 

## 5. **References**

- http://uds-web.blogspot.jp/2014/09/linux-containers-server-virtualization.html
- https://speakerdeck.com/jbeda/containers-and-gcp
- https://speakerdeck.com/jbeda/containers-at-scale
- Xavier, Miguel G., et al. "Performance evaluation of container-based virtualization for high performance computing environments." Parallel, Distributed and Network-Based Processing (PDP), 2013 21st Euromicro International Conference on. IEEE, 2013. 
- Soltesz, Stephen, et al. "Container-based operating system virtualization: a scalable, high-performance alternative to hypervisors." ACM SIGOPS Operating Systems Review. Vol. 41. No. 3. ACM, 2007. 
- Felter, Wes, et al. "An Updated Performance Comparison of Virtual Machines and Linux Containers." technology 28: 32. 
- Padala, Pradeep, et al. "Performance evaluation of virtualization technologies for server consolidation." HP Labs Tec. Report (2007). 
- http://www.slideshare.net/BodenRussell/kvm-and-docker-lxc-benchmarking-with-openstack
- http://events.linuxfoundation.org/sites/events/files/eeus13_bottomley.pdf
- http://linux-vserver.org/Welcome_to_Linux-VServer.org
- http://sp.parallels.com/products/pvc/
- http://openvz.org/Main_Page
- https://linuxcontainers.org/
- http://libvirt.org/
- http://docs.cloudfoundry.org/concepts/architecture/warden.html
- https://www.docker.com/
- https://github.com/google/lmctfy
- https://github.com/coreos/rocket
- http://research.gigaom.com/report/docker-and-the-current-linux-container-ecosystem/
