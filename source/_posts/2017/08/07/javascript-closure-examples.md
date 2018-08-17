---
title: 通过示例学习JavaScript闭包

date: 2017-08-07 10:00:00

tags: [JavaScript, 翻译]

---

**译者按: **在[上一篇博客](https://blog.fundebug.com/2017/07/31/javascript-closure/)，我们通过实现一个计数器，了解了如何使用**闭包(Closure)**，这篇博客将提供一些代码示例，帮助大家理解闭包。 

<!-- more -->


原文: [JavaScript Closures for Dummies](http://web.archive.org/web/20080209105120/http://blog.morrisjohns.com/javascript_closures_for_dummies)

译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译。另外，本文版权归原作者所有，翻译仅用于学习。**

### 闭包并不神奇

其实，只要你领会了闭包的关键概念，一切就非常简单了。作为JavaScript开发者，你应该可以理解以下代码：

#### Example 1

```javascript
function sayHello(name) 
{

  var text = 'Hello ' + name;

  var sayAlert = function() { console.log(text); }

  sayAlert();
}

sayHello("Bob") // 输出"Hello Bob"
```

在**sayHello()**函数中定义并调用了**sayAlert()**函数；**sayAlert()**作为**内层函数**，可以访问**外层函数sayHello()**中的**text**变量。理解这一点，你就可以继续阅读这篇博客了。

### 一个闭包示例

两句话总结闭包(注意，这个定义并不规范，但是有助于理解):

- 闭包就是函数的局部变量，这些变量在函数return之后仍然可以访问
- 闭包就是函数的内存堆栈，这个内存堆栈在函数return之后并没有被收回

#### Example 2

```javascript
function sayHello2(name) 
{
  var text = 'Hello ' + name; // 局部变量

  var sayAlert = function() { console.log(text); }

  return sayAlert;
}

var say2 = sayHello2("Jane");
say2(); // 输出"Hello Jane"
```

调用**sayHello2()**函数返回了**sayAlert**，它是一个引用变量，指向一个函数。相信大多数JavaScript程序员能够理解什么是引用变量，而C程序员则可以把**sayAlert**以及**say2**理解为指向函数的指针。

C指针与JavaScript引用变量并无实质区分。在JavaScript中，不妨这样理解，指向函数的引用变量不仅指向函数本身，还隐含地指向了一个闭包。

代码中匿名函数**function() { alert(text); }**是在另一个函数，即**sayHello2()**中定义的。在JavaScript中，如果你在函数中定义了一个函数，则创建了闭包。 

对于C语言，以及其他绝大多数语言：函数return之后，其局部变量将无法访问，因为内存中的堆栈会被销毁。

对于JavaScript，如果你在函数中定义函数的话，当外层函数return之后，其局部变量仍然可以访问。代码中已经证明了这一点：当**sayHello2()**函数return之后，我们调用了**say2()**函数，成功打印了**text**变量，而**text**变量正是**sayHello2()**函数的局部变量。

### 更多示例

如果只是从定义的角度去理解闭包，显然是非常困难。然而，如果通过代码示例去理解闭包，则简单很多。因此，强烈建议你认真地理解每一个示例，弄清楚它们是如何运行的，这样你会避免很多奇怪的BUG。

#### Example 3

**Example 3**中，**say667()**函数return后，**num**变量将仍然保留在内存中。并且，**sayNumba**函数中的**num**变量并非**复制**而是**引用**，因此它输出的是**667**而非**666**。

```javascript
function say667() {

  var num = 666; // say667()函数return后，num变量将仍然保留在内存中

  var sayAlert = function() { console.log(num); }

  num++;

  return sayAlert;

}

var sayNumba = say667();

sayNumba(); // 输出667
```

#### Example 4

**Example 4**中，3个全局函数**gAlertNumber，gIncreaseNumber，gSetNumber**指向了同一个闭包，因为它们是在同一次**setupSomeGlobals()**调用中声明的。它们所指向的闭包就是**setupSomeGlobals()**函数的局部变量，包括了**num**变量。也就是说，它们操作的是同一个**num**变量。

```javascript
function setupSomeGlobals() {

  var num = 666;

  gAlertNumber = function() { console.log(num); }

  gIncreaseNumber = function() { num++; }

  gSetNumber = function(x) { num = x; }

}

setupSomeGlobals();
gAlertNumber(); // 输出666

gIncreaseNumber();
gAlertNumber(); // 输出667

gSetNumber(5);
gAlertNumber(); // 输出5
```

### Example 5

**Example 5**的代码比较难，不少人都会犯同样的错误，因为它的执行结果很可能违背了你的直觉。

```javascript
function buildList(list) 
{
  var result = [];

  for (var i = 0; i < list.length; i++) 
  {
    var item = 'item' + list[i];
    result.push( function() { console.log(item + ' ' + list[i])} );
  }

  return result;
}

var fnlist = buildList([1,2,3]);

for (var j = 0; j < fnlist.length; j++) 
{
  fnlist[j](); // 连续输出3个"item3 undefined"
}
```

**result.push( function() {alert(item + ' ' + list[i])}**将指向匿名函数**function() {alert(item + ' ' + list[i])}**的引用变量加入了数组，其效果等价于：

```javascript
pointer = function() {alert(item + ' ' + list[i])};
result.push(pointer);
```

代码执行后，连续输出了3个"item3 undefined"，明显与直觉不同。

调用**buildList()**函数之后，我们得到了一个数组，数组中有3个函数，而这3个函数指向了同一个闭包。而闭包中的**item**变量值为**"item3"**，**i**变量值为**3**。如果理解了3个函数指向的是同一个闭包，则输出结果就不难理解了。

### Example 6

**Example 6**中，**alice**变量在**sayAlert**函数之后定义，这并未影响代码执行。因为返回函数**sayAlice2**所指向的闭包会包含**sayAlice()**函数中的所有局部变量，这自然包括了**alice**变量，因此可以正常打印"Hello Alice"。

```javascript
function sayAlice() 
{
  var sayAlert = function() { console.log(alice); }

  var alice = 'Hello Alice';

  return sayAlert;
}

var sayAlice2 = sayAlice();

sayAlice2(); // 输出"Hello Alice"
```

#### Example 7

由**Example 7**可知，每次调用**newClosure()**都会创建独立的闭包，它们的局部变量**num**与**ref**的值并不相同。

```javascript
function newClosure(someNum, someRef) 
{
  var anArray = [1,2,3];
  var num = someNum;
  var ref = someRef;

  return function(x) 
  {
      num += x;

      anArray.push(num);

      console.log('num: ' + num + "; " + 'anArray ' + anArray.toString() + "; " + 'ref.someVar ' + ref.someVar);
    }
}

closure1 = newClosure(40, {someVar: "closure 1"}); 
closure2 = newClosure(1000, {someVar: "closure 2"}); 

closure1(5); // 打印"num: 45; anArray 1,2,3,45; ref.someVar closure 1"
closure2(-10); // 打印"num: 990; anArray 1,2,3,990; ref.someVar closure 2"
```

### 总结

严格来讲，我对闭包的解释并不准确。不过，将闭包简单地看做局部变量，理解起来会更加简单。

### 参考链接

- [Private Members in JavaScript](http://web.archive.org/web/20080209105120/http://www.crockford.com/javascript/private.html)
- [Memory Leakage in Internet Explorer ](http://web.archive.org/web/20080209105120/http://www.codeproject.com/jscript/LeakPatterns.asp)
