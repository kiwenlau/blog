---
title: Fundebug计费标准解释：事件数是如何定义的？

date: 2019-02-28 10:00:00

tags: [Fundebug]

keywords: Fundebug, 收费

description: Fundebug计费标准解释：事件数是如何定义的？
---

**摘要：** 一个事件指上报一次报错数据，同一个错误重复上报将重复计算事件数。

<!-- more -->

一些新用户对于[Fundebug](https://www.fundebug.com/)的计费标准有所疑惑，这里给大家解释一下。

### Fundebug付费套餐

[Fundebug](https://www.fundebug.com/)提供了多个不同档位的付费套餐，其主要收费标准是按照**事件数**来确定的。当前[Fundebug](https://www.fundebug.com/)各个付费套餐每月的事件数及其价格如下表：

| **事件数** | **价格** |
| ---------- | -------- |
| 0.3w       | 0        |
| 5w         | 59       |
| 15w        | 159      |
| 45w        | 359      |
| 150w       | 859      |
| 450w       | 2559     |
| 1500w      | 6559     |

例如，月费用为359的付费套餐每个月的事件数额度为45万。

### 事件数是什么？

简单地说，**一个事件指的是上报一次报错数据**。以前端应用为例，每次调用[fundebug.test()](https://docs.fundebug.com/notifier/javascript/api/test.html)都会上报一次错误数据，则算作一个事件。

另外，**同一个错误重复上报将会重复计算事件数**。同一处代码BUG，在不同设备、不同浏览器、不同页面的报错事件的数据细节会有所不同，[Fundebug](https://www.fundebug.com/)可以将这些事件智能聚合为同一个错误。但是，我们是按照事件数而不是错误数计费的。例如，当某个错误重复出现了1000次时，则事件数则为1000。

### 事件数超量了怎么办？

如果您的事件数超量了，[Fundebug](https://www.fundebug.com/)将不再存储新上报的报错事件，这意味着您无法看到最新的报错，影响您对产品质量的把控。这时，建议您及时升级付费套餐。

另外，您也可以通过配置过滤器filters来过滤掉无需上报的错误，或者通过配置sampleRate进行采样，这样可以有效减少上报数据量。

最后，感谢所有用户对[Fundebug](https://www.fundebug.com/)支持。