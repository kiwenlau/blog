title: Underscore实例教程

date: 2016-09-18 10:00

tags: [Node.js]

---

**摘要:** [Underscore](http://underscorejs.org/)是一个轻量级的JavaScript库，提供了许多非常实用的函数。熟练使用Underscore可以更快地写出更简洁的代码。本文将通过一个简单的编程实例，介绍几个常用的Underscore函数。

**GitHub地址:**

- [kiwenlau/underscore-example](https://github.com/kiwenlau/underscore-example)

<!-- more -->

- 作者: [KiwenLau](http://kiwenlau.com/)
- 日期: [2016-09-18](http://kiwenlau.com/2016/09/18/underscore-example/)

<img src="underscore-example/underscore-example.png" width = "500"/>

## 一. 编程实例

输入数据是一个数组: 

```
["b", "d", "a", "d", "d", "b", "c", "c", "d", "c"];
```

其中，数组中存在重复的元素。例如，"c"重复了3次。

现在需要**根据元素在数组中的重复个数进行排序**。通过**观察**可知，"a"为1个，"b"为2个，"c"为3个，"d"为4个。

因此，输出结果是:

```
[ 'a', 'b', 'c', 'd' ]
```

当然，计算机暂时还没办法像人一样通过**观察**解决问题，所以得敲代码...

问题本身很容易理解，但是代码并不好写。不使用underscore的话，程序是这样的:

```
var X = ["b", "d", "a", "d", "d", "b", "c", "c", "d", "c"];


// 对数组元素进行计数
var A = {};

for (var i = 0; i < X.length; i++)
{
    var x = X[i];
    if (A.hasOwnProperty(X[i]))
    {
        A[x]++;
    }
    else
    {
        A[x] = 1;
    }
}


// 将对象转化为二维数组
var B = [];

for (var a in A)
{
    B.push([a, A[a]]);
}


// 根据二维数组的第2列元素进行排序
B.sort(
    function(a, b)
    {
        return a[1] - b[1];
    }
);


// 获取二维数组的第1列元素
var Y = [];

for (var i = 0; i < B.length; i++)
{
    Y.push(B[i][0]);
}


console.log(Y); // [ 'a', 'b', 'c', 'd' ]
```

虽然我在代码中使用了一些JavasScript自带的库函数例如sort，但是代码仍然比较冗长。

使用了Underscore之后，代码被极大地简化了:

```
var _ = require("underscore");

var X = ["b", "d", "a", "d", "d", "b", "c", "c", "d", "c"];

var Y = _.chain(X)
    .countBy() // 对数组元素进行计数
    .pairs()   // 将对象转化为二维数组
    .sortBy(1) // 根据二维数组的第2列元素进行排序
    .pluck(0)  // 获取二维数组的第1列元素
    .value();  // 获取计算结果

console.log(Y); // [ 'a', 'b', 'c', 'd' ]
```

可知，我使用了4个Underscore函数: [_.countBy](http://underscorejs.org/#countBy)，[_.pairs](http://underscorejs.org/#pairs)，[_.sortBy](http://underscorejs.org/#sortBy)和[_.pluck](http://underscorejs.org/#pluck)。并且通过[_.chain](http://underscorejs.org/#chain)将这4个函数依次链接起来，实现了前一段代码中完全相同的功能。

下面，我会依次介绍代码中所使用的Underscore函数。

## 二. 函数介绍

#### **1. [_.countBy](http://underscorejs.org/#countBy)**

功能: 

- 对数组中的元素进行计数

实例:

```
var X = ["b", "d", "a", "d", "d", "b", "c", "c", "d", "c"]; // 输入

var Y = _.countBy(X);

console.log(Y); // 输出: { b: 2, d: 4, a: 1, c: 3 }
```

#### **2. [_.pairs](http://underscorejs.org/#pairs)**

功能: 

- 将对象中的属性与属性值转化为键值对数组

实例:

```
var X = {
    b: 2,
    d: 4,
    a: 1,
    c: 3
}; // 输入

var Y = _.pairs(X);

console.log(Y); // 输出: [ [ 'b', 2 ], [ 'd', 4 ], [ 'a', 1 ], [ 'c', 3 ] ]
```

#### **3. [_.sortBy](http://underscorejs.org/#sortBy)**

功能: 

- 对数组中的元素进行排序；对于二维数组，可以根据某一列的元素值进行排序。

实例:

```
var X = [
    ['b', 2],
    ['d', 4],
    ['a', 1],
    ['c', 3]
]; // 输入

var Y = _.sortBy(X, 1); // 根据二维数组的第2列进行排序

console.log(Y); // 输出: [ [ 'a', 1 ], [ 'b', 2 ], [ 'c', 3 ], [ 'd', 4 ] ]
```

#### **4. [_.pluck](http://underscorejs.org/#pluck)**

功能: 

- 获取对象的某个属性的Value列表；或者获取二维数组中的某一列

实例:

```
var X = [
    ['a', 1],
    ['b', 2],
    ['c', 3],
    ['d', 4]
]; // 输入

var Y = _.pluck(X, 0); // 获取二维数组的第1列

console.log(Y); // 输出: [ 'a', 'b', 'c', 'd' ]
```

#### **5. [_.chain](http://underscorejs.org/#chain)**

功能: 

- 将多个Underscore函数链接起来完成计算任务

```
var X = ["b", "d", "a", "d", "d", "b", "c", "c", "d", "c"]; // 输入

var Y = _.chain(X)
    .countBy() // 对数组元素进行计数
    .pairs()   // 将对象转化为二维数组
    .sortBy(1) // 根据二维数组的第2列元素进行排序
    .pluck(0)  // 获取二维数组的第1列元素
    .value();  // 获取计算结果

console.log(Y); // 输出: [ 'a', 'b', 'c', 'd' ]
```

很多时候，需要使用多个Underscore函数来完成单个计算任务。类似于Linux中的管道，前一个函数的输出是后一个函数的输入，这时可以通过使用[_.chain](http://underscorejs.org/#chain)将多个函数链接起来，最后使用[_.value](http://underscorejs.org/#value)获取计算结果。