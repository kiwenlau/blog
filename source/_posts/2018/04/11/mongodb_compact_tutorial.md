---

title: MongoDB之compact操作详解

date: 2018-04-11 10:00:00

tags: [MongoDB]

---

**摘要：** compact操作步骤很多，但是可以有效减少磁盘使用量。


<!-- more -->


<div style="text-align: center;">
<img style="width:60%;" src="mongodb_compact_tutorial/mongodb.jpg" />
</div>


### MongoDB与磁盘 

当[Fundebug](https://www.fundebug.com/)处理的数据越来越多，这导致MongoDB的磁盘使用量越来越多，增长也越来越快。于是，我开始定时删除过期数据，优化算法减少冗余数据。但是，我发现，**单纯删除文档不能减少MongoDB磁盘使用量**。这是为什么呢？下面是官方文档的解释：

对于WiredTiger存储引擎(mongodb 3.2之后默认使用)：[How do I reclaim disk space in WiredTiger?](https://docs.mongodb.com/manual/faq/storage/#how-do-i-reclaim-disk-space-in-wiredtiger)

> The WiredTiger storage engine maintains lists of empty records in data files as it deletes documents. This space can be reused by WiredTiger, but will not be returned to the operating system unless under very specific circumstances.

也就是说，**被删除的文档所占用的磁盘空间仍然由MongoDB保留**，不会释放。对于旧版MongoDB的MMAPv1存储引擎，这一点也是一样的。这样做无可厚非，因为数据库将会不断存储新的文档，它们可以利用之前保留的磁盘空间。

但是，如果你删除了很多文档，需要MongoDB释放磁盘空间，应该如何做呢？正如文档所述，对于WiredTiger存储引擎，我们可以使用[compact](https://docs.mongodb.com/manual/reference/command/compact/)操作来实现。

> To allow the WiredTiger storage engine to release this empty space to the operating system, you can de-fragment your data file. This can be achieved using the compact command. 

### 关于compact操作

[compact](https://docs.mongodb.com/manual/reference/command/compact/)操作会重新整理碎片化的磁盘，释放多余的空间。

> Rewrites and defragments all data and indexes in a collection. On WiredTiger databases, this command will release unneeded disk space to the operating system.

关于compact操作，我列了几个简单的Q&A。

- compact是否会阻塞数据库读写？会！因此不能在高峰期进行compact操作；对于复制集，应该对每个节点依次进行compact操作。
- compact是否可以释放磁盘空间？对于WiredTiger，是可以的；但是对于WiredTiger存储引擎，并不会，多余的磁盘空间仍然会保留给MongoDB。
- compact操作是否会占用额外的磁盘空间？根据我的观察，基本上不会。
- paddingFactor应该设为多少？我设置的值是1.1，这样可以为每个文档留一些多余空间，提高修改性能。这个值可以根据实际需要进行设置。
- compact操作需要多少时间？一个400G的复制集节点，我花了不到1个小时。这样时间应该与数据量大小有关。
- compact操作效果怎么样？减少了接近50%的磁盘空间，这个大小应该与被删除的文档数量有关。

### compact操作步骤

由于compact操作会阻塞MongoDB的读写操作，因此应该对每个节点依次进行操作。另外，MongoDB复制集的标准维护流程是将Secodary节点暂定，使用单独的端口启动独立的mongo实例进行操作，这样可以复制集完全隔离。

我们[Fundebug](https://www.fundebug.com/)的MongoDB集群运行在Docker中，因此操作步骤稍微简单一些，可以为大家提供参考。

#### Secondary节点

- 关闭mongodb容器

```bash	
sudo docker stop mongo
```
	
- 启动独立的临时mongodb容器

```bash	
sudo docker run -it -d -p 37017:27017 -v /data/db:/data/db --name mongo_tmp mongo:3.2
```


- 执行compact命令

```bash
mongo 127.0.0.1:37017
db.runCommand( { compact : 'events',paddingFactor: 1.1 } )
```
	
- 重启mongodb节点

```	
sudo docker rm -f mongo_tmp
sudo docker start mongo
```
	
#### Primary节点
	
- 将Primary节点变为Secondary节点

```	
rs.stepDown()
```
	
- 按照secondary节点进行操作


### 参考

- [MongoDB文档：compact](https://docs.mongodb.com/manual/reference/command/compact/)
- [MongoDB文档：Perform Maintenance on Replica Set Members](https://docs.mongodb.com/manual/tutorial/perform-maintence-on-replica-set-members/)

