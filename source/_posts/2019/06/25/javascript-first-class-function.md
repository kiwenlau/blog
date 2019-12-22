---
title: JavaScript深入浅出第2课：函数是一等公民是什么意思呢？

date: 2019-06-25 10:00:00

tags: [JavaScript, JavaScript深入浅出]

keywords: JavaScript, 一等公民, 函数式编程

description: JavaScript深入浅出第2课：函数是一等公民是什么意思呢？
---

**摘要：** 听起来很炫酷的一等公民是啥？

<!-- more -->

**《[JavaScript深入浅出](https://blog.fundebug.com/tags/JavaScript%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA/)》系列**：

- [JavaScript深入浅出第1课：箭头函数中的this究竟是什么鬼？](https://kiwenlau.com/2019/06/18/arrow-function-this/)
- [JavaScript深入浅出第2课：函数是一等公民是什么意思呢？](https://kiwenlau.com/2019/06/25/javascript-first-class-function/)
- [JavaScript深入浅出第3课：什么是垃圾回收算法？](https://kiwenlau.com/2019/07/03/javascript-garbage-collection/)
- [JavaScript深入浅出第4课：V8是如何工作的？](https://kiwenlau.com/2019/07/16/how-does-v8-work/)
- [JavaScript深入浅出第5课：Chrome是如何成功的？](https://kiwenlau.com/2019/08/08/how-does-chrome-succeed/)

看到一篇讲 JavaScript 历史的[文章](http://www.ruanyifeng.com/blog/2011/06/birth_of_javascript.html)里面提到：**JavaScript 借鉴 Scheme 语言，将函数提升到"一等公民"（first class citizen）的地位**。

**一等公民**这个名字听起来很高大上，但是也相当晦涩，这个与翻译也没什么关系，因为**first class citizen**很多人包括我也不知所云。

JavaScript 函数是一等公民，是什么意思呢？我来与大家探讨一下，抛砖引玉。

### 一等公民的定义

根据维基百科，编程语言中一等公民的概念是由英国计算机学家[Christopher Strachey](https://en.wikipedia.org/wiki/Christopher_Strachey)提出来的，时间则早在上个世纪 60 年代，那个时候还没有个人电脑，没有互联网，没有浏览器，也没有 JavaScript。

大概很多人和我一样，没听说过 Christopher Strachey，并且他也只是提出了一等公民的概念，没有给出严格的定义。

关于一等公民，我找到一个权威的定义，来自于一本书[《Programming Language Pragmatics》](http://www.cs.rochester.edu/~scott/pragmatics/)，这本书是很多大学的程序语言设计的教材。

> In general, a value in a programming language is said to have ﬁrst-class status if it can be passed as a parameter, returned from a subroutine, or assigned into a variable.

也就是说，在编程语言中，**一等公民可以作为函数参数，可以作为函数返回值，也可以赋值给变量**。

例如，字符串在几乎所有编程语言中都是一等公民，字符串可以做为函数参数，字符串可以作为函数返回值，字符串也可以赋值给变量。

对于各种编程语言来说，函数就不一定是一等公民了，比如[Java 8 之前的版本](https://www.youtube.com/watch?v=Rd-sqHjmfB0)。

对于 JavaScript 来说，函数可以赋值给变量，也可以作为函数参数，还可以作为函数返回值，因此 JavaScript 中函数是一等公民。

### 函数作为函数参数

回调函数（callback）是 JavaScript 异步编程的基础，其实就是把函数作为函数参数。例如，大家常用的 setTimeout 函数的第一个参数就是函数：

```javascript
setTimeout(function() {
    console.log("Hello, Fundebug!");
}, 1000);
```

JavaScript 函数作为函数参数，或者说回调函数，作为实现异步的一种方式，大家都写得多了，其实它还有其他应用场景。

[Array.prototype.sort()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)在对一些复杂数据结构进行排序时，可以使用**自定义的比较函数**作为参数：

```javascript
var employees = [
    { name: "Liu", age: 21 },
    { name: "Zhang", age: 37 },
    { name: "Wang", age: 45 },
    { name: "Li", age: 30 },
    { name: "zan", age: 55 },
    { name: "Xi", age: 37 }
];

// 员工按照年龄排序
employees.sort(function(a, b) {
    return a.age - b.age;
});

// 员工按照名字排序
employees.sort(function(a, b) {
    var nameA = a.name;
    var nameB = b.name;
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
});
```

这样写看起来没什么大不了的，但是对于 JavaScript 引擎来说就省事多了，因为它不需要为每一种数据类型去实现一个排序 API，它只需要实现一个排序 API 就够了，至于数组元素大小怎么比较，交给用户去定义，用户如果非得说 2 大于 1，那也不是不可以。

换句话说，如果 Array.prototype.sort()只能实现简单数据（比如 Number 与 String）的排序的话，那它就太弱了，正因为可以使用函数作为参数，使它的功能强大了很多。

顺便提一下，实现一个 Array.prototype.sort()，可不是什么简单的事情，大家可以看看[V8 是怎样实现数组排序的](https://v8.dev/blog/array-sort)。

### 将函数赋值给变量

JavaScript 是可以定义匿名函数的，当我们定义有名字的函数时，通常是这样写的：

```javascript
function hello() {
    console.log("Hello, Fundebug!");
}
```

当然，也可以将函数赋值给变量：

```javascript
var hello = function() {
    console.log("Hello, Fundebug!");
};

console.log(typeof hello); // 打印 function
```

可知，hello 变量的类型是"function"。

在其他的一些[First-class function](https://en.wikipedia.org/wiki/First-class_function)的定义中，还要求函数可以保存到其他数据结构，比如数组和对象中，这一点 JavaScript 也是支持的。

> In computer science, a programming language is said to have first-class functions if it treats functions as first-class citizens. This means the language supports passing functions as arguments to other functions, returning them as the values from other functions, and assigning them to variables or storing them in data structures.

函数可以保存到 Object 中，就意味着函数成为了 Object 的方法。我在[《JavaScript 深入浅出第 1 课：箭头函数中的 this 究竟是什么鬼？》](https://blog.fundebug.com/2019/06/18/arrow-function-this/)中提过，当函数作为 Object 的方法被调用时，它的 this 值就是该 Object，这 1 点与 Java 等面向对象语言是一致的。因此 JavaScript 在没有[Class](http://es6.ruanyifeng.com/#docs/class)之前，就在一定程度上是支持面向对象编程的，当然比较弱。

```javascript
var person = {
    name: "Wang Lei",
    age: 40,
    greeting: function() {
        console.log(`Hello! My Name is ${this.name}.`);
    }
};

console.log(person.age); // 打印 40
person.greeting(); // 打印 Hello! My Name is Wang Lei.
```

### 函数作为函数返回值

通常来讲，函数的返回值比较简单，比如数字、字符串、布尔值或者 Object。由于 JavaScript 函数是第一公民，因此我们也可以在函数中返回函数。

```javascript
function sayHello(message) {
    return function() {
        console.log(`Hello, ${message}`);
    };
}

var sayHelloToFundebug = sayHello("Fundebug!");
var sayHelloToGoogle = sayHello("Google!");

sayHelloToFundebug(); // 打印Hello, Fundebug!
sayHelloToGoogle(); // 打印Hello, Google!
```

当我们调用 sayHello 函数时，它返回值 sayHelloToFundebug 实际是一个函数，我们需要调用所返回的 sayHelloToFundebug 函数，它才会执行，打印对应的信息："Hello, Fundebug!"。

我猜这个地方有人会抬杠，因为示例代码没有必要这么写，因为有更简单的写法：

```javascript
function sayHello(message) {
    console.log(`Hello, ${message}`);
}

sayHello("Fundebug!"); // 打印Hello, Fundebug!
sayHello("Google!"); // 打印Hello, Google!
```

但是这只是一个简单的示例，在一些复杂的实际场景中，在函数返回函数还是很有用的。下面给大家一个简单的示例。

我们 Fundebug 在[微信小程序 BUG 监控插件](https://docs.fundebug.com/notifier/wxjs/version.html)的时候，把不同[API](https://docs.fundebug.com/notifier/wxjs/api/)的定义拆分在不同的文件，但是这些 API 需要共享一些全局属性，比如用户的[个性化配置](https://docs.fundebug.com/notifier/wxjs/customize/)。微信小程序是没有全局变量 window 的，就算是网页端有 window 其实最好也不要用，会污染全局作用域。这时候该怎么办？给大家看看定义[fundebug.test()](https://docs.fundebug.com/notifier/wxjs/api/test.html)是怎样定义的吧：

```bash
function defineTestApi(config) {
    function testApi(name, message) {
        const event = {
            type: "test",
            apikey: config.apikey,
            name: name || "Test",
            message: message || "Hello, Fundebug!"
        };
        sendToFundebug(event);
    }
    return testApi;
}
```

我们使用了一个外层函数 defineTestApi 来共享全局配置对象 config，函数中定义的 testApi 函数则通过 return 返回。

这里其实也用到了**闭包**，因为 defineTestApi 函数执行结束之后，testApi 函数仍然可以使用 config 变量，因此 config 变量的生命周期超越了 defineTestApi 函数。关于闭包的详细介绍，我会在这个系列的后续文章中介绍。

因此，**在函数中返回函数，还是很有用的**。

开发者对待每一个技术点，比如闭包，应该保持谦卑，不要觉得这个也没有用，那个也没有用，其实只是你还没遇到使用场景而已。关于这一点，大家可以看看我的博客[《聊聊我的第一篇 10 万+，同时反驳某些评论》](https://blog.fundebug.com/2019/05/20/the-first-blog-over-100-thousand-pv/)。

### 函数为第一公民是函数式编程的基础

函数为第一公民的 3 个特性我都介绍了，它们确实让 JavaScript 更加强大，然后呢？JavaScript 的骚操作大家见得多了，也不会觉得有什么神奇之处。

其实，函数是第一公民，与大家都听过的**函数式编程**有着密切的关系。

> First-class functions are a necessity for the functional programming style, in which the use of higher-order functions is a standard practice.

也就是说，**函数为第一公民是函数式编程的必要条件**。higher-order functions，即高阶函数，就是使用函数作为参数的函数，它在函数式编程中很常见。

至于什么是函数式编程，不是我一句话能讲清楚的，这可以一直聊到计算机的开山鼻祖图灵。要知后事如何，请听下回分解。

关于 JS，我打算开始写一个系列的博客，大家还有啥不太清楚的地方？不妨留言一下，我可以研究一下，然后再与大家分享一下。也大家欢迎添加我的个人微信(KiwenLau)，我是[Fundebug](https://www.fundebug.com/)的技术负责人，一个对 JS 又爱又恨的程序员。

### 参考

-   [Javascript 诞生记](http://www.ruanyifeng.com/blog/2011/06/birth_of_javascript.html)
-   [Is JavaScript a (true) OOP language?](https://medium.com/@andrea.chiarelli/is-javascript-a-true-oop-language-c87c5b48bdf0)
-   [First-class functions in Java 8](https://www.youtube.com/watch?v=Rd-sqHjmfB0)
-   [《聊聊我的第一篇 10 万+，同时反驳某些评论》](https://blog.fundebug.com/2019/05/20/the-first-blog-over-100-thousand-pv/)
