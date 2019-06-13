---
title:  Node.js官方文档：到底什么是阻塞(Blocking)与非阻塞(Non-Blocking)？

date: 2019-06-12 10:00:00

tags: [Node.js]

keywords: Node.js, 阻塞, 非阻塞, 同步, 异步

description: 到底什么是Node.js阻塞(Blocking)与非阻塞(Non-Blocking)？
---

**译者按：** Node.js文档阅读系列之一。

<!-- more -->

-   原文: [Overview of Blocking vs Non-Blocking](https://nodejs.org/en/docs/guides/blocking-vs-non-blocking/)
-   译者: [Fundebug](https://www.fundebug.com/)

**为了保证可读性，本文采用意译而非直译。**

这篇博客将介绍Node.js的阻塞(Blocking)与非阻塞(Non-Blocking)。我会提到Event Loop与libuv，但是不了解它们也不会影响阅读。读者只需要有一定的JavaScript基础，理解Node.js的回调函数([callback pattern](https://nodejs.org/en/knowledge/getting-started/control-flow/what-are-callbacks/))就可以了。

博客中提到了很多次**I/O**，它主要指的是**使用[libuv](http://libuv.org/)与系统的磁盘与网络进行交互。**


### 阻塞（Blocking）

**阻塞**指的是一部分Node.js代码需要等到一些非Node.js代码执行完成之后才能继续执行。这是因为当阻塞发生时，Event Loop无法继续执行。

对于Node.js来说，由于CPU密集的操作导致代码性能很差时，不能称为阻塞。当需要等待非Node.js代码执行时，才能称为阻塞。Node.js中依赖于libuv的同步方法(以Sync结尾)导致阻塞，是最常见的情况。当然，一些不依赖于libuv的原生Node.js方法有些也能导致阻塞。

Node.js中所有与I/O相关的方法都提供了异步版本，它们是**非阻塞**的，可以指定回调函数，例如[fs.readFile](https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback)。其中一些方法也有对应的**阻塞**版本，它们的函数名以**Sync**结尾，例如[fs.readFileSync](https://nodejs.org/api/fs.html#fs_fs_readfilesync_path_options)。

### 代码示例

阻塞的方法是同步执行的，而非阻塞的方法是异步执行。

以读文件为例，下面是同步执行的代码：

```js
const fs = require('fs');
const data = fs.readFileSync('/file.md'); // 文件读取完成之前，代码会阻塞，不会执行后面的代码
console.log("Hello, Fundebug!"); // 文件读取完成之后才会打印
```

对应的异步代码如下：

```js
const fs = require('fs');
fs.readFile('/file.md', (err, data) => {
  if (err) throw err;
}); // 代码不会因为读文件阻塞，会继续执行后面的代码
console.log("Hello, Fundebug!"); // 文件读完之前就会打印
```

第一个示例代码看起来要简单很多，但是它的缺点是会阻塞代码执行，后面的代码需要等到整个文件读取完成之后才能继续执行。

在同步代码中，如果读取文件出错了，则错误需要使用try...catch处理，否则进程会崩溃。对于异步代码，是否处理回调函数的错误则取决于开发者。

我们可以将示例代码稍微修改一下，下面是同步代码：

```js
const fs = require('fs');
const data = fs.readFileSync('/file.md'); 
console.log(data);
moreWork(); // console.log之后再执行
```

异步代码如下：

```js
const fs = require('fs');
fs.readFile('/file.md', (err, data) => {
  if (err) throw err;
  console.log(data);
});
moreWork(); // 先于console.log执行
```

在第一个示例中，`console.log`将会先于`moreWork()`执行。在第二个示例中，由于`fs.readFile()`是非阻塞的，代码可以继续执行，因此`moreWork()`会先于`console.log`执行。

`moreWork()`不用等待读取整个文件，可以继续执行，这是Node.js可以增加吞吐量的关键。

### 并发与吞吐量


Node.js中JS代码执行是单线程的，因此并发指的是Event Loop可以在执行其他代码之后再去执行回调函数。如果希望代码可以并发执行，则所有非JavaScript代码比如I/O执行时，必须保证Event Loop继续运行。

举个例子，假设Web服务器的每个请求需要50ms完成，其中45ms是数据库的I/O操作。如果使用非阻塞的异步方式执行数据库I/O的话，则可以节省45ms来处理其他请求，这可以极大地提高系统的吞吐量。

Event Loop这种方式与其他许多语言都不一样，通常它们会创建新的线程来处理并发。

### 混用阻塞与非阻塞代码会出问题

当我们处理I/O时，应该避免以下代码：

```js
const fs = require('fs');
fs.readFile('/file.md', (err, data) => {
  if (err) throw err;
  console.log(data);
});
fs.unlinkSync('/file.md');
```

上面的示例中，`fs.unlinkSync()`很可能在`fs.readFile()`之前执行，也就是说，我们在读取`file.md`之前，这个文件就已经被删掉了。

为了避免这种情况，我们应该是要非阻塞方式，来保证它们按照正确的顺序执行。

```js
const fs = require('fs');
fs.readFile('/file.md', (readFileErr, data) => {
  if (readFileErr) throw readFileErr;
  console.log(data);
  fs.unlink('/file.md', (unlinkErr) => {
    if (unlinkErr) throw unlinkErr;
  });
});
```

上面的示例中，我们把非阻塞的`fs.unlink()`放在`fs.readFile()`的回调函数中。

### 参考

- [libuv](http://libuv.org/)
- [About Node.js](https://nodejs.org/en/about/)
