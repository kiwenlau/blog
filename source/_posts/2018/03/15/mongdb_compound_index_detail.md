---

title: MongoDB复合索引详解

date: 2018-03-15 10:00:00

tags: [MongoDB]

---

**摘要：** 对于MongoDB的多键查询，创建复合索引可以有效提高性能。

<!-- more -->


<div style="text-align: center;">
<img style="width:60%;" src="mongdb_compound_index_detail/mongodb.jpg" />
</div>

### 什么是复合索引？

复合索引，即**Compound Index**，指的是将多个键组合到一起创建索引，这样可以加速匹配多个键的查询。不妨通过一个简单的示例理解复合索引。

students集合如下：

```json
db.students.find().pretty()
{
	"_id" : ObjectId("5aa7390ca5be7272a99b042a"),
	"name" : "zhang",
	"age" : "15"
}
{
	"_id" : ObjectId("5aa7393ba5be7272a99b042b"),
	"name" : "wang",
	"age" : "15"
}
{
	"_id" : ObjectId("5aa7393ba5be7272a99b042c"),
	"name" : "zhang",
	"age" : "14"
}
```

在name和age两个键分别创建了索引(_id自带索引)：

```json
db.students.getIndexes()
[
	{
		"v" : 1,
		"key" : {
			"name" : 1
		},
		"name" : "name_1",
		"ns" : "test.students"
	},
	{
		"v" : 1,
		"key" : {
			"age" : 1
		},
		"name" : "age_1",
		"ns" : "test.students"
	}
]
```

当进行多键查询时，可以通过[explian()](https://docs.mongodb.com/manual/reference/method/cursor.explain/)分析执行情况(结果仅保留winningPlan)：

```json
db.students.find({name:"zhang",age:"14"}).explain()
"winningPlan":
{
    "stage": "FETCH",
    "filter":
    {
        "name":
        {
            "$eq": "zhang"
        }
    },
    "inputStage":
    {
        "stage": "IXSCAN",
        "keyPattern":
        {
            "age": 1
        },
        "indexName": "age_1",
        "isMultiKey": false,
        "isUnique": false,
        "isSparse": false,
        "isPartial": false,
        "indexVersion": 1,
        "direction": "forward",
        "indexBounds":
        {
            "age": [
                "[\"14\", \"14\"]"
            ]
        }
    }
}
```

由winningPlan可知，这个查询依次分为**IXSCAN**和**FETCH**两个阶段。**IXSCAN**即索引扫描，使用的是age索引；**FETCH**即根据索引去查询文档，查询的时候需要使用name进行过滤。

为name和age创建复合索引：

```bash
db.students.createIndex({name:1,age:1})

db.students.getIndexes()
[
	{
		"v" : 1,
		"key" : {
			"name" : 1,
			"age" : 1
		},
		"name" : "name_1_age_1",
		"ns" : "test.students"
	}
]
```

有了复合索引之后，同一个查询的执行方式就不同了：

```json
db.students.find({name:"zhang",age:"14"}).explain()
"winningPlan":
{
    "stage": "FETCH",
    "inputStage":
    {
        "stage": "IXSCAN",
        "keyPattern":
        {
            "name": 1,
            "age": 1
        },
        "indexName": "name_1_age_1",
        "isMultiKey": false,
        "isUnique": false,
        "isSparse": false,
        "isPartial": false,
        "indexVersion": 1,
        "direction": "forward",
        "indexBounds":
        {
            "name": [
                "[\"zhang\", \"zhang\"]"
            ],
            "age": [
                "[\"14\", \"14\"]"
            ]
        }
    }
}
```

由winningPlan可知，这个查询的顺序没有变化，依次分为**IXSCAN**和**FETCH**两个阶段。但是，**IXSCAN**使用的是name与age的复合索引；**FETCH**即根据索引去查询文档，不需要过滤。

这个示例的数据量太小，并不能看出什么问题。但是实际上，当数据量很大，IXSCAN返回的索引比较多时，FETCH时进行过滤将非常耗时。接下来将介绍一个真实的案例。

### 定位MongoDB性能问题

随着接收的错误数据不断增加，我们[Fundebug](https://www.fundebug.com/)已经累计处理**3.5亿**错误事件，这给我们的服务不断带来性能方面的挑战，尤其对于MongoDB集群来说。

对于生产数据库，配置[profile](https://docs.mongodb.com/manual/reference/database-profiler/)，可以记录MongoDB的性能数据。执行以下命令，则所有超过**1s**的数据库读写操作都会被记录下来。

```bash
db.setProfilingLevel(1,1000)
```

查询profile所记录的数据，会发现events集合的某个查询非常慢：

```json
db.system.profile.find().pretty()
{
	"op" : "command",
	"ns" : "fundebug.events",
	"command" : {
		"count" : "events",
		"query" : {
			"createAt" : {
				"$lt" : ISODate("2018-02-05T20:30:00.073Z")
			},
			"projectId" : ObjectId("58211791ea2640000c7a3fe6")
		}
	},
	"keyUpdates" : 0,
	"writeConflicts" : 0,
	"numYield" : 1414,
	"locks" : {
		"Global" : {
			"acquireCount" : {
				"r" : NumberLong(2830)
			}
		},
		"Database" : {
			"acquireCount" : {
				"r" : NumberLong(1415)
			}
		},
		"Collection" : {
			"acquireCount" : {
				"r" : NumberLong(1415)
			}
		}
	},
	"responseLength" : 62,
	"protocol" : "op_query",
	"millis" : 28521,
	"execStats" : {

	},
	"ts" : ISODate("2018-03-07T20:30:59.440Z"),
	"client" : "192.168.59.226",
	"allUsers" : [ ],
	"user" : ""
}
```

events集合中有数亿个文档，因此count操作比较慢也不算太意外。根据profile数据，这个查询耗时**28.5s**，时间长得有点离谱。另外，**numYield**高达1414，这应该就是操作如此之慢的直接原因。根据MongoDB文档，[numYield](https://docs.mongodb.com/manual/reference/database-profiler/#system.profile.numYield)的含义是这样的：

> The number of times the operation yielded to allow other operations to complete. Typically, operations yield when they need access to data that MongoDB has not yet fully read into memory. This allows other operations that have data in memory to complete while MongoDB reads in data for the yielding operation. 

这就意味着大量时间消耗在读取硬盘上，且读了非常多次。可以推测，应该是索引的问题导致的。

不妨使用explian()来分析一下这个查询(仅保留executionStats)：

```json
db.events.explain("executionStats").count({"projectId" : ObjectId("58211791ea2640000c7a3fe6"),createAt:{"$lt" : ISODate("2018-02-05T20:30:00.073Z")}})
"executionStats":
{
    "executionSuccess": true,
    "nReturned": 20853,
    "executionTimeMillis": 28055,
    "totalKeysExamined": 28338,
    "totalDocsExamined": 28338,
    "executionStages":
    {
        "stage": "FETCH",
        "filter":
        {
            "createAt":
            {
                "$lt": ISODate("2018-02-05T20:30:00.073Z")
            }
        },
        "nReturned": 20853,
        "executionTimeMillisEstimate": 27815,
        "works": 28339,
        "advanced": 20853,
        "needTime": 7485,
        "needYield": 0,
        "saveState": 1387,
        "restoreState": 1387,
        "isEOF": 1,
        "invalidates": 0,
        "docsExamined": 28338,
        "alreadyHasObj": 0,
        "inputStage":
        {
            "stage": "IXSCAN",
            "nReturned": 28338,
            "executionTimeMillisEstimate": 30,
            "works": 28339,
            "advanced": 28338,
            "needTime": 0,
            "needYield": 0,
            "saveState": 1387,
            "restoreState": 1387,
            "isEOF": 1,
            "invalidates": 0,
            "keyPattern":
            {
                "projectId": 1
            },
            "indexName": "projectId_1",
            "isMultiKey": false,
            "isUnique": false,
            "isSparse": false,
            "isPartial": false,
            "indexVersion": 1,
            "direction": "forward",
            "indexBounds":
            {
                "projectId": [
                    "[ObjectId('58211791ea2640000c7a3fe6'), ObjectId('58211791ea2640000c7a3fe6')]"
                ]
            },
            "keysExamined": 28338,
            "dupsTested": 0,
            "dupsDropped": 0,
            "seenInvalidated": 0
        }
    }
}
```

可知，events集合并没有为projectId与createAt建立复合索引，因此IXSCAN阶段采用的是projectId索引，其nReturned为**28338**; FETCH阶段需要根据createAt进行过滤，其nReturned为**20853**，过滤掉了**7485**个文档；另外，IXSCAN与FETCH阶段的executionTimeMillisEstimate分别为**30ms**和**27815ms**，因此基本上所有时间都消耗在了FETCH阶段，这应该是读取硬盘导致的。


### 创建复合索引

没有为projectId和createAt创建复合索引是个尴尬的错误，赶紧补救一下：

```bash
db.events.createIndex({projectId:1,createTime:-1},{background: true})
```

在生产环境构建索引这种事最好是晚上做，这个命令一共花了大概7个小时吧！background设为true，指的是不要阻塞数据库的其他操作，保证数据库的可用性。但是，这个命令会一直占用着终端，这时不能使用**CTRL + C**，否则会终止索引构建过程。

复合索引创建成果之后，前文的查询就快了很多(仅保留executionStats)：

```leaf
db.javascriptevents.explain("executionStats").count({"projectId" : ObjectId("58211791ea2640000c7a3fe6"),createAt:{"$lt" : ISODate("2018-02-05T20:30:00.073Z")}})
"executionStats":
{
    "executionSuccess": true,
    "nReturned": 0,
    "executionTimeMillis": 47,
    "totalKeysExamined": 20854,
    "totalDocsExamined": 0,
    "executionStages":
    {
        "stage": "COUNT",
        "nReturned": 0,
        "executionTimeMillisEstimate": 50,
        "works": 20854,
        "advanced": 0,
        "needTime": 20853,
        "needYield": 0,
        "saveState": 162,
        "restoreState": 162,
        "isEOF": 1,
        "invalidates": 0,
        "nCounted": 20853,
        "nSkipped": 0,
        "inputStage":
        {
            "stage": "COUNT_SCAN",
            "nReturned": 20853,
            "executionTimeMillisEstimate": 50,
            "works": 20854,
            "advanced": 20853,
            "needTime": 0,
            "needYield": 0,
            "saveState": 162,
            "restoreState": 162,
            "isEOF": 1,
            "invalidates": 0,
            "keysExamined": 20854,
            "keyPattern":
            {
                "projectId": 1,
                "createAt": -1
            },
            "indexName": "projectId_1_createTime_-1",
            "isMultiKey": false,
            "isUnique": false,
            "isSparse": false,
            "isPartial": false,
            "indexVersion": 1
        }
    }
}
```

可知，count操作使用了projectId和createAt的复合索引，因此非常快，只花了**46ms**，性能提升了将近**600倍！！！**对比使用复合索引前后的结果，发现totalDocsExamined从28338降到了0,表示使用复合索引之后不再需要去查询文档，只需要扫描索引就好了，这样就不需要去访问磁盘了，自然快了很多。

### 参考

- [MongoDB 复合索引](http://blog.csdn.net/leshami/article/details/53542371)
- [MongoDB文档：Compound Indexes](https://docs.mongodb.com/manual/core/index-compound/)
