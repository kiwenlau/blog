title: MongoDB优化之倒排索引

date: 2016-09-11 10:00

tags: [MongoDB]

---

**摘要:** 为MongoDB中的数据构建倒排索引(Inverted Index)，然后缓存到内存中，可以大幅提升搜索性能。本文将介绍两种不同的方法：MapReduce与Aggregation，来构建倒排索引。

**GitHub地址:**
- [kiwenlau/mongodb-inverted-index](https://github.com/kiwenlau/mongodb-inverted-index)

<!-- more -->

- 作者: [KiwenLau](http://kiwenlau.com/)
- 日期: [2016-09-11](http://kiwenlau.com/2016/09/11/mongodb-inverted-index/)

<img src="mongodb-inverted-index/mongodb-inverted-index.png" width = "500"/>

## 一. 简介

[MongoDB](https://www.mongodb.com/)是文档型数据库，其数据有三个层级: 数据库(database)，集合(collection)和文档(document)，分别对应关系型数据库的: 数据库(database), 表(table)，行(row)。MongDB中每个文档为一个JSON文件，例如，本文使用的movie集合中的的一个文档如下所示:

```
{
	"_id" : ObjectId("57d02d60b128567fc130287d"),
	"movie" : "Pride & Prejudice",
	"starList" : [
		"Keira Knightley",
		"Matthew Macfadyen"
	],
	"__v" : 0
}
```

该文档一共有4个属性:

- "_id": 文档ID，由MongoDB生成。
- "__v": 文档版本，由MongoDB的NodeJS接口Mongoose生成。
- "movie": 电影名称。
- "starList": 电影的演员列表。 

#### **1. 下载Nginx镜像**

```
sudo docker pull nginx:1.10
```

## 二. MapReduce

## 三. Aggregation

## 四. 参考


