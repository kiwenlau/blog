---
title: JavaScript深入浅出第1课：箭头函数中的this究竟是什么鬼？

date: 2019-06-18 10:00:00

tags: [JavaScript, 箭头函数, this, JavaScript深入浅出]

keywords: JavaScript, 箭头函数, this

description: 箭头函数中的this是什么鬼？
---

**摘要：** 箭头函数极大地简化了 this 的取值规则。

<!-- more -->

**《JavaScript 深入浅出》系列**：

-   [JavaScript 深入浅出第 1 课：箭头函数中的 this 究竟是什么鬼？](https://blog.fundebug.com/2019/06/18/arrow-function-this/)
-   [JavaScript 深入浅出第 2 课：函数是一等公民是什么意思呢？](https://blog.fundebug.com/2019/06/25/javascript-first-class-function/)

### 普通函数与箭头函数

**[普通函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function)指的是用 function 定义的函数：**

```javascript
var hello = function() {
    console.log("Hello, Fundebug!");
};
```

**[箭头函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)指的是用=>定义的函数：**

```javascript
var hello = () => {
    console.log("Hello, Fundebug!");
};
```

JavaScript 箭头函数与普通函数不只是写法上的区别，它们还有一些微妙的不同点，其中一个不同点就是 this。

> 箭头函数没有自己的 this 值，箭头函数中所使用的 this 来自于函数作用域链。

这句话很简单，不过听着稍微有点莫名其妙，得从头说起。

### this 到底是什么？

关于 this 的文章也够多了，有时候越描越黑，我就不再添乱了，我只负责搬运一下 MDN 文档：[this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)，感兴趣的可以仔细阅读一下，我摘录一些最重要的话就好了。

> A function's this keyword behaves a little differently in JavaScript compared to other languages. It also has some differences between strict mode and non-strict mode.

JavaScript 是一门比较奇特的语言，它的 this 与其他语言不一样，并且它的取值还取决于代码是否为严格模式("use strict")。

**this 的值是什么？**

> The JavaScript context object in which the current code is executing.

this 就是代码执行时当前的 context object。

**Global context**

> In the global execution context (outside of any function), this refers to the global object whether in strict mode or not.

代码没有在任何函数中执行，而是在全局作用域中执行时，this 的值就是 global 对象，对于浏览器来说，this 就是 window。

这一条规则还是比较容易接受的。

**Function context**

> Inside a function, the value of this depends on how the function is called.

函数中的 this 值取决于这个函数是怎样被调用的，这一条规则就有点变态了，也是很容易出 BUG 的地方。

另外，this 的值还与函数是否为严格模式("use strict")有关，这就非常的丧心病狂了...

大家如果好奇的话，出门左转看 MDN 文档，我多说无益，只说明一种简单的情况。

**As an object method**

> When a function is called as a method of an object, its this is set to the object the method is called on.

当函数作为对象的方法被调用时，它的 this 值就是该对象。

```javascript
var circle = {
    radius: 10,
    getRadius() {
        console.log(this.radius);
    }
};

circle.getRadius(); // 打印 10
```

### self = this？

当我们需要在对象方法中嵌套一个内层函数时，this 就会给我们带来实际的困扰了，大家应该写过这样的代码：

```javascript
// 使用临时变量self
var circle = {
    radius: 10,
    outerDiameter() {
        var self = this;
        var innerDiameter = function() {
            console.log(2 * self.radius);
        };
        innerDiameter();
    }
};

circle.outerDiameter(); // 打印20
```

outerDiameter 函数是 circle 对象的方法，因此其 this 值就是 circle 对象。

那我们直接写`this.radius`多好啊，可惜不能这么写，因为内层函数 innerDiameter 并不会继承外层函数 outerDiameter 的 this 值。outerDiameter 函数的 this 值就是 circle 对象，this.radius 等于 10。

但是，**innerDiameter 函数的 this 值不是 circle 对象**，那它到底是啥？它是 innerDiameter 函数执行时当前的 context object，这个 context object 又是啥？其实我也晕了，所以不妨测试一下：

```javascript
// innerDiameter函数中的this是window
var circle = {
    radius: 10,
    outerDiameter() {
        var innerDiameter = function() {
            console.log(this === window);
        };
        innerDiameter();
    }
};

circle.outerDiameter(); // 打印true
```

innerDiameter 函数中的 this 是 window，为啥是 window 这个不去管它，反正不是 circle 对象。

因此，如果我们直接在 innerDiameter 函数中使用 this 的话，就出问题了：

```javascript
// 使用普通函数
var circle = {
    radius: 10,
    outerDiameter() {
        var innerDiameter = function() {
            console.log(2 * this.radius);
        };
        innerDiameter();
    }
};

circle.outerDiameter(); // 打印NaN
```

于是，我们不得不使用一个临时变量 self 将外层函数 outerDiameter 的 this 值搬运到内层函数 innerDiameter。

### .bind(this)

我们也可以使用`.bind(this)`来规避 this 变来变去的问题：

```javascript
// 使用.bind(this)
var circle = {
    radius: 10,
    outerDiameter() {
        var innerDiameter = function() {
            console.log(2 * this.radius);
        };
        innerDiameter = innerDiameter.bind(this);
        innerDiameter();
    }
};

circle.outerDiameter(); // 打印20
```

但是，无论是使用临时变量 self，还是使用.bind(this)，都不是什么很简洁的方式。

总之，普通函数的 this 取值多少有点奇怪，尤其当我们采用面向对象的方式编程时，很多时候都需要用到 this，大多数时候我们都不会去使用.bind(this)，而是使用临时变量 self 或者 that 来搬运 this 的取值，写起来当然不是很爽，而且一不小心就会写出 BUG 来。

正如[MDN 文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#No_separate_this)所说：

> Until arrow functions, every new function defined its own this value based on how the function was called。This proved to be less than ideal with an object-oriented style of programming.

### 箭头函数

箭头函数的 this 取值，规则非常简单，因为 this 在箭头函数中，可以看做一个普通变量。

> An arrow function does not have its own this. The this value of the enclosing lexical scope is used; arrow functions follow the normal variable lookup rules.

箭头函数没有自己的 this 值，箭头函数中所使用的 this 都是来自函数作用域链，它的取值遵循普通普通变量一样的规则，在函数作用域链中一层一层往上找。

有了箭头函数，我只要遵守下面的规则，this 的问题就可以基本上不用管了：

-   对于需要使用`object.method()`方式调用的函数，使用普通函数定义，不要使用箭头函数。对象方法中所使用的 this 值有确定的含义，指的就是 object 本身。
-   其他情况下，全部使用箭头函数。

```javascript
// 使用箭头函数
var circle = {
    radius: 10,
    outerDiameter() {
        var innerDiameter = () => {
            console.log(2 * this.radius);
        };
        innerDiameter();
    }
};

circle.outerDiameter(); // 打印20
```

对于内层函数 innerDiameter，它本身并没有 this 值，其使用的 this 来自作用域链，来自更高层函数的作用域。innerDiameter 的外层函数 outerDiameter 是普通函数，它是有 this 值的，它的 this 值就是 circle 对象。因此，innerDiameter 函数中所使用的 this 来自 outerDiameter 函数，其值为 circle 对象。

### 结论

JavaScript 是 Brendan Eich 花了 10 天时间设计出来的，因此各种莫名其妙的特性，this 也算是其中一个奇葩。好在这些年 ECMAScript 标准发展很快也很稳定，每年撸一个新的标准，多少可以弥补一下 JS 的先天不足。

箭头函数对于 this 取值规则的简化，其实也就是为了少给大家添乱，谁能记得住普通函数 this 取值的那么多条条框框啊。。。

另外，MDN 文档绝对是一个宝藏，大家可以多看看。

关于 JS，我打算开始写一个系列的博客，大家还有啥不太清楚的地方？不妨留言一下，我可以研究一下，然后再与大家分享一下。也大家欢迎添加我的个人微信(KiwenLau)，我是[Fundebug](https://www.fundebug.com/)的技术负责人，一个对 JS 又爱又恨的程序员。

### 参考

-   [ES6 In Depth: Arrow functions](https://hacks.mozilla.org/2015/06/es6-in-depth-arrow-functions/)
-   [MDN 文档 - this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this#As_an_object_method)
