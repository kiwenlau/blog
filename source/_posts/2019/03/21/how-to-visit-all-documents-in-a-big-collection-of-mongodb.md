---
title: 如何高效地遍历 MongoDB 超大集合？

date: 2019-03-21 10:00:00

tags: [Nodejs, MongoDB]

keywords: Nodejs, MongoDB, mongoose, cursor

description: 如何高效地遍历 MongoDB 超大集合？
---

**摘要：** 给你 1000 万个文档，如何遍历？

![](https://image.fundebug.com/2019-03-21-mongodb.jpg)

<!-- more -->

-   GitHub 仓库：[Fundebug/loop-mongodb-big-collection](https://github.com/Fundebug/loop-mongodb-big-collection)

本文使用的编程语言是 Node.js，连接 MongoDB 的模块用的是[mongoose](https://mongoosejs.com/)。但是，本文介绍的方法适用于其他编程语言及其对应的 MongoDB 模块。

### 错误方法：find()

也许，在遍历 MongoDB 集合时，我们会这样写：

```javascript
const Promise = require("bluebird");

function findAllMembers() {
    return Member.find();
}

async function test() {
    const members = await findAllMembers();
    let N = 0;
    await Promise.mapSeries(members, member => {
        N++;
        console.log(`name of the ${N}th member: ${member.name}`);
    });
    console.log(`loop all ${N} members success`);
}

test();
```

注意，我们使用的是 Bluebird 的[mapSeries](http://bluebirdjs.com/docs/api/promise.mapseries.html)而非[map](http://bluebirdjs.com/docs/api/promise.map.html)，members 数组中的元素是一个一个处理的。这样就够了吗？

当 Member 集合中的 document 不多时，比如只有 1000 个时，那确实没有问题。但是当 Member 集合中有 1000 万个 document 时，会发生什么呢？如下：

```javascript
<--- Last few GCs --->
rt of marking 1770 ms) (average mu = 0.168, current mu = 0.025) finalize [5887:0x43127d0]    33672 ms: Mark-sweep 1398.3 (1425.2) -> 1398.0 (1425.7) MB, 1772.0 / 0.0 ms  (+ 0.1 ms in 12 steps since start of marking, biggest step 0.0 ms, walltime since start of marking 1775 ms) (average mu = 0.088, current mu = 0.002) finalize [5887:0x43127d0]    35172 ms: Mark-sweep 1398.5 (1425.7) -> 1398.4 (1428.7) MB, 1496.7 / 0.0 ms  (average mu = 0.049, current mu = 0.002) allocation failure scavenge might not succeed


<--- JS stacktrace --->

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
 1: 0x8c02c0 node::Abort() [node]
 2: 0x8c030c  [node]
 3: 0xad15de v8::Utils::ReportOOMFailure(v8::internal::Isolate*, char const*, bool) [node]
 4: 0xad1814 v8::internal::V8::FatalProcessOutOfMemory(v8::internal::Isolate*, char const*, bool) [node]
 5: 0xebe752  [node]
 6: 0xebe858 v8::internal::Heap::CheckIneffectiveMarkCompact(unsigned long, double) [node]
 7: 0xeca982 v8::internal::Heap::PerformGarbageCollection(v8::internal::GarbageCollector, v8::GCCallbackFlags) [node]
 8: 0xecb2b4 v8::internal::Heap::CollectGarbage(v8::internal::AllocationSpace, v8::internal::GarbageCollectionReason, v8::GCCallbackFlags) [node]
 9: 0xecba8a v8::internal::Heap::FinalizeIncrementalMarkingIfComplete(v8::internal::GarbageCollectionReason) [node]
10: 0xecf1b7 v8::internal::IncrementalMarkingJob::Task::RunInternal() [node]
11: 0xbc1796 v8::internal::CancelableTask::Run() [node]
12: 0x935018 node::PerIsolatePlatformData::FlushForegroundTasksInternal() [node]
13: 0x9fccff  [node]
14: 0xa0dbd8  [node]
15: 0x9fd63b uv_run [node]
16: 0x8ca6c5 node::Start(v8::Isolate*, node::IsolateData*, int, char const* const*, int, char const* const*) [node]
17: 0x8c945f node::Start(int, char**) [node]
18: 0x7f84b6263f45 __libc_start_main [/lib/x86_64-linux-gnu/libc.so.6]
19: 0x885c55  [node]
Aborted (core dumped)
```

可知，内存不足了。

打印[find()](https://mongoosejs.com/docs/api.html#model_Model.find)返回的 members 数组可知，集合中所有元素都返回了，**哪个数组放得下 1000 万个 Object?**

### 正确方法：find().cursor()与 eachAsync()

将整个集合 find()全部返回，这种操作应该避免，正确的方法应该是这样的：

```javascript
function findAllMembersCursor() {
    return Member.find().cursor();
}

async function test() {
    const membersCursor = await findAllMembersCursor();
    let N = 0;
    await membersCursor.eachAsync(member => {
        N++;
        console.log(`name of the ${N}th member: ${member.name}`);
    });
    console.log(`loop all ${N} members success`);
}

test();
```

使用[cursor()](https://mongoosejs.com/docs/api.html#query_Query-cursor)方法返回 QueryCursor，然后再使用[eachAsync()](https://mongoosejs.com/docs/api.html#querycursor_QueryCursor-eachAsync)就可以遍历整个集合了，而且不用担心内存不够。

[QueryCursor](https://mongoosejs.com/docs/api.html#QueryCursor)是什么呢？不妨看一下 mongoose 文档：

> A QueryCursor is a concurrency primitive for processing query results one document at a time. A QueryCursor fulfills the Node.js streams3 API, in addition to several other mechanisms for loading documents from MongoDB one at a time.

总之，QueryCursor 可以每次从 MongoDB 中取一个 document，这样显然极大地减少了内存使用。

### 如何测试？

这篇博客介绍的内容很简单，但是也很容易被忽视。如果大家测试一下，印象会更加深刻一些。

测试代码很简单，大家可以查看[Fundebug/loop-mongodb-big-collection](https://github.com/Fundebug/loop-mongodb-big-collection)。

我的测试环境是这样的：

-   ubuntu 14.04
-   mongodb 3.2
-   nodejs 10.9.0

**1. 使用 Docker 运行 MongoDB**

```bash
sudo docker run --net=host -d --name mongodb daocloud.io/library/mongo:3.2
```

**2. 使用[mgodatagen](https://github.com/feliixx/mgodatagen)生成测试数据**

使用 mgodatagen，1000 万个 document 可以在 1 分多钟生成！

下载 mgodatagen：[https://github.com/feliixx/mgodatagen/releases/download/0.7.3/mgodatagen_linux_x86_64.tar.gz](https://github.com/feliixx/mgodatagen/releases/download/0.7.3/mgodatagen_linux_x86_64.tar.gz)

解压之后，复制到/usr/local/bin 目录即可：

```bash
sudo mv mgodatagen /usr/local/bin
```

mgodatagen 的配置文件[mgodatagen-config.json](https://github.com/Fundebug/loop-mongodb-big-collection/blob/master/mgodatagen-config.json)如下：

```json
[
    {
        "database": "test",
        "collection": "members",
        "count": 10000000,
        "content": {
            "name": {
                "type": "string",
                "minLength": 2,
                "maxLength": 8
            },
            "city": {
                "type": "string",
                "minLength": 2,
                "maxLength": 8
            },
            "country": {
                "type": "string",
                "minLength": 2,
                "maxLength": 8
            },
            "company": {
                "type": "string",
                "minLength": 2,
                "maxLength": 8
            },
            "email": {
                "type": "string",
                "minLength": 2,
                "maxLength": 8
            }
        }
    }
]
```

执行`mgodatagen -f mgodatagen-config.json`命令，即可生成 10000 万测试数据。

```bash
mgodatagen -f mgodatagen-config.json
Connecting to mongodb://127.0.0.1:27017
MongoDB server version 3.2.13

collection members: done            [====================================================================] 100%

+------------+----------+-----------------+----------------+
| COLLECTION |  COUNT   | AVG OBJECT SIZE |    INDEXES     |
+------------+----------+-----------------+----------------+
| members    | 10000000 |             108 | _id_  95368 kB |
+------------+----------+-----------------+----------------+

run finished in 1m12.82s
```

查看 MongoDB，可知新生成的数据有 0.69GB，其实很小，但是使用 find()方法遍历会报错。

```bash
show dbs
local  0.000GB
test   0.690GB
```

**3. 执行测试代码**

两种不同遍历方法的代码分别位于[test1.js](https://github.com/Fundebug/loop-mongodb-big-collection/blob/master/test1.js)和[test2.js](https://github.com/Fundebug/loop-mongodb-big-collection/blob/master/test2.js)。

### 参考

-   [如何使用 mongoose 对一个 100 万+的 mongodb 的表进行遍历操作](https://cnodejs.org/topic/51508570604b3d512113f1b3)
-   [Cursors in Mongoose 4.5](https://thecodebarbarian.com/cursors-in-mongoose-45)
