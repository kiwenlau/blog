title: MongoDB优化之倒排索引

date: 2016-09-11 10:00

tags: [MongoDB]

---

**摘要:** 为MongoDB中的数据构建倒排索引(Inverted Index)，然后缓存到内存中，可以大幅提升搜索性能。本文将介绍两种构建倒排索引的方法：MapReduce与Aggregation。

**GitHub地址:**
- [kiwenlau/mongodb-inverted-index](https://github.com/kiwenlau/mongodb-inverted-index)

<!-- more -->

- 作者: [KiwenLau](http://kiwenlau.com/)
- 日期: [2016-09-11](http://kiwenlau.com/2016/09/11/mongodb-inverted-index/)

<img src="mongodb-inverted-index/mongodb-inverted-index.png" width = "500"/>

## 一. 倒排索引

倒排索引(Inverted Index)，也称为方向索引，[维基百科](https://zh.wikipedia.org/wiki/%E5%80%92%E6%8E%92%E7%B4%A2%E5%BC%95)的定义是这样的:

> 是一种索引方法，被用来存储在全文搜索下某个单词在一个文档或者一组文档中的存储位置的映射。它是文档检索系统中最常用的数据结构。

这个定义比较学术，也就是比较反人类，忽略...

倒排索引是搜索引擎中的重要数据结构。搜索引擎的爬虫获取的网页数据可以视作很多键值对，其中Key是网页地址(url)，而Value是网页内容。网页的内容是由很多关键词(word)组成的，可以视作关键词数组。

```
<url1, [word2, word3]>
<url2, [word2]>
<url3, [word1, word2]>
```

但是，用户是通过关键词搜索的，直接使用原始数据进行查询的话则需要遍历所有键值对，效率是非常低的。

因此，用于搜索的数据结构应该以关键词(word)为Key，以网页地址(url)为Value:

```
<word1, [url3]>
<word2, [ur1, url2, url3]>
<word3, [url1]>
```

这样的话，查询关键词word2，立即能够获取结果: [ur1, url2, url3]。

简单地说，倒排索引就是把Key与Value对调之后的索引，构建倒排索引的目的是提升搜索性能。

## 二. 测试数据

[MongoDB](https://www.mongodb.com/)是文档型数据库，其数据有三个层级: 数据库(database)，集合(collection)和文档(document)，分别对应关系型数据库中的三个层级的: 数据库(database), 表(table)，行(row)。MongDB中每个的文档是一个JSON文件，例如，本文使用的movie集合中的一个文档如下所示:

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

- _id: 文档ID，由MongoDB自动生成。
- __v: 文档版本，由MongoDB的NodeJS接口Mongoose自动生成。
- movie: 电影名称。
- starList: 电影的演员列表。 

可知，这个文档表示电影[《傲慢与偏见》](https://movie.douban.com/subject/1418200/)，由女神[凯拉·奈特莉](https://movie.douban.com/celebrity/1054448/)主演。

忽略_id与__v，movie集合的数据如下:

```
{
    "movie": "Pride & Prejudice",
    "starList": ["Keira Knightley", "Matthew Macfadyen"]
},
{
    "movie": "Begin Again",
    "starList": ["Keira Knightley", "Mark Ruffalo"]
},
{
    "movie": "The Imitation Game",
    "starList": ["Keira Knightley", "Benedict Cumberbatch"]
}
```

其中Key为电影名称(movie)，而Value为



## 三 MapReduce

## 四. Aggregation

## 五. 参考


