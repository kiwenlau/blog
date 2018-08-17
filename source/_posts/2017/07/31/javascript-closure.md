---
title: 解密JavaScript闭包

date: 2017-07-31 10:00:00

tags: [JavaScript, 翻译]

---


**译者按:** 从最简单的计数器开始，按照需求对代码一步步优化，我们可以领会闭包的神奇之处。

<!-- more -->

原文: [Closures are not magic](http://renderedtext.com/blog/2015/11/18/closures-are-not-magic/)

译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译。另外，本文版权归原作者所有，翻译仅用于学习。**

对于JavaScript新手来说，**闭包(Closures)**是一个很神奇的东西。这篇博客将通过一个非常浅显的代码示例来解释**闭包**。

### 计数器

我们的目标是实现一个计数器，它的效果如下：

```javascript
increment();  // Number of events: 1
increment();  // Number of events: 2
increment();  // Number of events: 3
```

可知，每次执行**increment()**都会输出**"Number of events: N"**，且**N**每次都会**加1**。

这个计数器最直观的实现方式如下：

```javascript
var counter = 0;

function increment() 
{
  counter = counter + 1;
  console.log("Number of events: " + counter);
}
```

### 多个计数器

以上的代码非常简单。但是，当我们需要第二个计数器时，就会遇到问题了。当然，我们可以实现两个重复的计数器：

```javascript
var counter1 = 0;

function incrementCounter1() 
{
  counter1 = counter1 + 1;
  console.log("Number of events: " + counter1);
}

var counter2 = 0;

function incrementCounter2() 
{
  counter2 = counter2 + 1;
  console.log("Number of events: " + counter2);
}

incrementCounter1();  // Number of events: 1
incrementCounter2();  // Number of events: 1
incrementCounter1();  // Number of events: 2
```

显然，以上的代码非常冗余，有待优化。当我们需要更多计数器时，使用这种方法将不太现实。这时，就需要神奇的**闭包**了。

### 使用闭包实现计数器

需要多个计数器，同时希望去除冗余代码的话，就可以使用**闭包**了：

```javascript
function createCounter() 
{
  var counter = 0;

  function increment() 
  {
    counter = counter + 1;
    console.log("Number of events: " + counter);
  }

  return increment;
}

var counter1 = createCounter();
var counter2 = createCounter();

counter1(); // Number of events: 1
counter1(); // Number of events: 2
counter2(); // Number of events: 1
counter1(); // Number of events: 3
```

在代码中，我们创建了两个独立的计数器**counter1**与**counter2**，分别进行计数，互不干挠。代码看着有点奇怪，我们不妨拆分起来分析。

首先，我们来看看**createCounter**：

- 创建了一个局部变量**counter**
- 创建了一个局部函数**increment()**，它可以对**counter**变量进行**加1**操作。
- 将局部函数**increment()**返回。注意，返回的是函数本身，而不是函数调用的结果。

看起来，**createCounter()**函数与我们最初定义的计数器非常相似。唯一的不同点在于：**createCounter()**将计数器封装在一个函数内，于是我们将它称作**闭包**。

难以理解的一点在于，当我们使用**createCounter()**函数创建计数器时，实际上创建了一个新的函数：

```javascript
// fancyNewCounter是一个新创建的函数
var fancyNewCounter = createCounter();
```

闭包的神奇之处在于。每次使用**createCounter()**函数创建计数器**increment**时，都会创建一个对应的**counter**变量。并且，返回的**increment**函数会始终**记住counter变量**。

更重要的是，这个**counter**变量是相互独立的。比如，当我们创建2个计数器时，每个计数器都会创建一个新的**counter**变量：

```javascript
// 每个计数器都会从1开始计数
var counter1 = createCounter();
counter1(); // Number of events: 1
counter1(); // Number of events: 2

// 第1个计数器不会影响第2个计数器
var counter2 = createCounter();
counter2(); // Number of events: 1

// 第2个计数器不会影响第1个计数器
counter1(); // Number of events: 3
```

### 为计数器命名 

多个计数器的输出信息都是**“Number of events: N”**，这样容易混淆。如果可以为每个计数器命名，则更加方便：

```javascript
var catCounter = createCounter("cats");
var dogCounter = createCounter("dogs");

catCounter(); // Number of cats: 1
catCounter(); // Number of cats: 2
dogCounter(); // Number of dogs: 1
```

通过给**createCounter**传递一个新的**counterName**参数，可以很容易地做到这一点：

```javascript
function createCounter(counterName) 
{
  var counter = 0;

  function increment() 
  {
    counter = counter + 1;
    console.log("Number of " + counterName + ": " + counter);
  }

  return increment;
}
```

这样，**createCounter()**函数返回的计数器将同时**记住**两个局部变量：**counterName**与**counter**。

### 优化计数器调用方式

按照之前的实现方式，我们通过调用**createCounter()**函数可以返回一个计数器，直接调用返回的计数器就可以**加1**，这样做并不直观。如果可以如下调用将更好：

```javascript
var dogCounter = createCounter("dogs");
dogCounter.increment(); // Number of dogs: 1
```

实现代码:

```javascript
function createCounter(counterName) 
{
  var counter = 0;

  function increment() 
  {
    counter = counter + 1;
    console.log("Number of " + counterName + ": " + counter);
  };

  return { increment : increment };
}
```

可知，以上的代码返回了一个对象，这个对象包含了一个**increment**方法。

### 添加decrement方法

现在，我们可以给计数器添加一个**decrement()**方法

```javascript
function createCounter(counterName) 
{
  var counter = 0;

  function increment() 
  {
    counter = counter + 1;
    console.log("Number of " + counterName + ": " + counter);
  };

  function decrement() 
  {
    counter = counter - 1;
    console.log("Number of " + counterName + ": " + counter);
  };

  return {
    increment : increment,
    decrement : decrement
  };
}

var dogsCounter = createCounter("dogs");

dogsCounter.increment(); // Number of dogs: 1
dogsCounter.increment(); // Number of dogs: 2
dogsCounter.decrement(); // Number of dogs: 1
```

### 添加私有方法

前面的代码有两行重复的代码，即**console.log**语句。因此，我们可以创建一个**display()**方法用于打印**counter**的值：

```javascript
function createCounter(counterName) 
{
  var counter = 0;

  function display() 
  {
    console.log("Number of " + counterName + ": " + counter);
  }

  function increment() 
  {
    counter = counter + 1;
    display();
  };

  function decrement() 
  {
    counter = counter - 1;
    display();
  };

  return {
    increment : increment,
    decrement : decrement
  };
}

var dogsCounter = createCounter("dogs");

dogsCounter.increment(); // Number of dogs: 1
dogsCounter.increment(); // Number of dogs: 2
dogsCounter.decrement(); // Number of dogs: 1
```

看起来，**display()**函数与**increment()**函数以及**decrement()**函数差不多，但是其实它们很不一样。我们并没有将**display()**函数添加到返回的对象中，这就意味着以下代码会出错：

```javascript
var dogsCounter = createCounter("dogs");
dogsCounter.display(); // ERROR !!!
```

这时，**display()**相当于一个私有方法，我们只能在**createCounter()**函数内使用它。

### 闭包与面向对象编程

如果你接触过**[面向对象编程(OOP)](https://en.wikipedia.org/wiki/Object-oriented_programming)**，则应该不难发现本文中所涉及的内容与OOP中的**类**、**对象**、**对象属性**、**共有方法**与**私有方法**等概念非常相似。

闭包，与**OOP**相似，就是把数据和操作数据的方法绑定起来。因此，在需要**OOP**的时候，就可以使用闭包来实现。


### 总结

**闭包(Closure)**是JavaScript一个非常棒的特性。掌握它，我们可以从容应对一些常见的编程需求。
