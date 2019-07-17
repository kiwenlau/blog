---
title: JavaScript深入浅出第3课：什么是垃圾回收算法？

date: 2019-07-03 10:00:00

tags: [JavaScript, 垃圾回收, 内存, JavaScript深入浅出]

keywords: JavaScript, 垃圾回收, 内存, Mark-and-Sweep

description: JavaScript深入浅出第3课：什么是垃圾回收算法？
---

**摘要：** JS是如何回收内存的？

<!-- more -->

**《[JavaScript深入浅出](https://blog.fundebug.com/tags/JavaScript%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA/)》系列**：
- [JavaScript深入浅出第1课：箭头函数中的this究竟是什么鬼？](https://blog.fundebug.com/2019/06/18/arrow-function-this/)
- [JavaScript深入浅出第2课：函数是一等公民是什么意思呢？](https://blog.fundebug.com/2019/06/25/javascript-first-class-function/)
- [JavaScript深入浅出第3课：什么是垃圾回收算法？](https://blog.fundebug.com/2019/07/03/javascript-garbage-collection/)
- [JavaScript深入浅出第4课：V8是如何工作的？](https://blog.fundebug.com/2019/07/16/how-does-v8-work/)

最近垃圾回收这个话题非常火，大家不能随随便便的扔垃圾了，还得先分类，这样方便对垃圾进行回收再利用。

其实，对于写代码来说，也有**垃圾回收(garbage collection)**这个问题，这里所说的垃圾，指的是**程序中不再需要的内存空间**，垃圾回收指的是回收这些不再需要的内存空间，让程序可以重新利用这些释放的内存空间。

### 手动管理内存

对于C这种底层语言来说，我们可以使用malloc()函数分配内存空间，当所分配的内存不再需要的时候，可以使用free()函数来释放内存空间。

```c
#include <stdio.h>
#include <stdlib.h>
#define TRUE 1

int main ()
{
  int *p, i, n, sum;

  while (TRUE)
  {
      printf ("请输入数组长度: ");
      scanf ("%d", &n);
      p = (int *) malloc (n * sizeof (int)); // 分配内存空间
      sum = 0;
      for (i = 0; i < n; ++i)
	  {
	    *(p + i) = i + 1;
	    sum += *(p + i);
	  }
      printf ("sum = %d\n", sum);
      free (p); // 释放内存空间
  }
  return 0;
}
```

示例代码很简单，输入一个整数n，程序计算**1、2、3...n**的和。大家可以在[Online C Compiler](https://www.onlinegdb.com/online_c_compiler)上运行这段代码。

```bash
请输入数组长度: 36                                                                                                                                                                                                           
sum = 666                                                                                                                                                                                                                    
请输入数组长度: 100                                                                                                                                                                                                          
sum = 5050 
```

如果我们不去调用free()函数释放内存的话，就会导致**内存泄漏(memory leak)**。每个while循环中，指针p都会指向新分配的内存空间。而p之前指向的内存空间虽然没用了，但是并不会被释放，除非程序退出。如果while循环一直执行下去的话，内存早晚不够用。

### 垃圾回收算法

如果让我们去手动管理内存，那不知道要写出多少BUG，内存分分钟用完。还好现代编程语言，比如Java, Python, Go以及JavaScript，都是支持自动垃圾回收的。也就是说，这些语言可以自动回收程序不再需要的内存空间，这样既减轻了开发者的负担，也有效避免了内存泄漏。

其实，早在C语言诞生之前的1960年，图灵奖得主[John McCarthy](https://amturing.acm.org/award_winners/mccarthy_1118322.cfm)就在Lisp语言中实现了自动垃圾回收算法。算法本身其实非常简单，标记那些程序访问不到的数据，回收它们的内存空间。但是，垃圾回收算法把程序员从硬件层(内存管理)解放出来了，这种理念还是很先进的。

对于垃圾回收算法来说，最困难的问题是**如何确定哪些内存空间是可以回收的，即哪些内存空间是程序不再需要的**，这是一个**不可判定问题([undecidable problem](https://en.wikipedia.org/wiki/Undecidable_problem))**。所谓不可判定，就是没有哪个垃圾回收算法可以确定程序中所有可以回收的内存空间。

McCarthy简化了判定数据是否需要的问题，将其简化为判断数据是否能够访问。如果程序已经不能访问某个数据了，那这个数据自然是不再需要了。但是，这个逻辑反过来是不成立的，一些可以访问的数据也有可能其实程序已经不再需要了。

McCarthy的垃圾回收算法现在通常被称作**Mark-and-Sweep**，它是现在很多语言(Java, JavaScript, Go)的垃圾回收算法的原型。

### JavaScript的垃圾回收算法

对于JavaScript来说，我们是不需要手动管理内存的，因为JavaScript引擎例如[V8](https://v8.dev/)与[SpiderMonkey](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey)都会自动分配并回收内存。

比较古老的浏览器，比如IE6和IE7使用的垃圾回收算法是**reference-counting**：确定对象是否被引用，没有被引用的对象则可以回收。这个算法无法回收Circular Object，有可能会因此造成内存泄漏：

```javascript
var div;
window.onload = function() {
  div = document.getElementById('myDivElement');
  div.circularReference = div;
  div.lotsOfData = new Array(10000).join('*');
};
```

div对象的circularReference属性指向div本身，因此div对象始终“被引用”。如果使用**reference-counting**垃圾回收算法的话，则div对象永远不会被回收。最新的浏览器很早就不再使用reference-counting，因此Circular Object无法回收的问题也就不存在了。

目前，主流的浏览器使用的垃圾回收算法都是基于**mark-and-sweep**：

- root对象包括全局对象以及程序当前的执行堆栈；
- 从root对象出发，遍历其所有子对象，能够通过遍历访问到的对象是可以访问的；
- 其他不能遍历对象是不可访问的，其内存空间可以回收；

算法思想并没有超越McCarthy半个世纪之前的设计，只是在实现细节上做了大量的优化，V8的垃圾回收模块Orinoco[大致是这样做的](https://v8.dev/blog/trash-talk)：

- 采用多线程的方式进行垃圾回收，尽量避免对JavaScript本身的代码执行造成暂停；
- 利用浏览器渲染页面的空闲时间进行垃圾回收；
- 根据[The Generational Hypothesis](https://people.cs.umass.edu/~emery/classes/cmpsci691s-fall2004/papers/p157-ungar.pdf)，大多数对象的生命周期非常短暂，因此可以将对象根据生命周期进行区分，生命周期短的对象与生命周期长的对象采用不同的方式进行垃圾回收；
- 对内存空间进行整理，消除内存碎片化，最大化利用释放的内存空间；

JS引擎的垃圾回收算法已经非常强大了，所以我们作为JavaScript开发者基本上感受不到它的存在。

### 观察JavaScript垃圾回收算法

我们通过Chrome开发者工具实际感受一下垃圾回收算法的效果。

**测试1：**

```javascript
var str = new Array(100000000).join("*");

setInterval(() => {
    console.log(str[0]);
}, 1000);
```

str是一个超长字符串，因此会占有不少的内存空间。代码里面写了一个setInterval，是为了让这段代码永远执行下去，程序不退出。这样的话，字符串str永远在使用中，永远是可以访问的，那它的内存空间就不会被回收。

我使用的是Chrome 75，在其开发者工具的Memory的Tab下，使用Take heap snapshot可以获取内存快照：

![](https://image.fundebug.com/2019-07-03-01.png)

可知，内存占用了97MB，且我们可以在其中找到str这个超长字符串。

**测试2**

```javascript
var str = new Array(100000000).join("*");

setInterval(() => {
    console.log(str[0]);
}, 1000);

setTimeout(() => {
    str = "******";
}, 10000);
```

在setTimeout的回调函数中，我们对str进行了重新赋值，这就意味着之前的超长字符串就不可访问了，那它的内存空间就会被回收。

在代码运行10s之后，即str重新赋值之后进行快照：

![](https://image.fundebug.com/2019-07-03-02.png)

可知，内存只占用了1.6MB，且我们可以在其中找到str字符串，它的长度只有6，因此占用的内存空间非常小。

想象一下，如果不再需要的内存空间不会被回收的话，1T的内存都不够用。

关于JS，我打算花1年时间写一个系列的博客**《[JavaScript深入浅出](https://blog.fundebug.com/tags/JavaScript%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA/)》**，大家还有啥不太清楚的地方？不妨留言一下，我可以研究一下，然后再与大家分享一下。欢迎添加我的个人微信(KiwenLau)，我是[Fundebug](https://www.fundebug.com/)的技术负责人，一个对JS又爱又恨的程序员。


### 参考

- [MDN：Memory Management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
- [为什么Lisp语言如此先进？](http://www.ruanyifeng.com/blog/2010/10/why_lisp_is_superior.html)
- [Recursive Functions of Symbolic Expressions Their Computation by Machine(Part I)](http://www-formal.stanford.edu/jmc/recursive.html)
- [Trash talk: the Orinoco garbage collector](https://v8.dev/blog/trash-talk)
- [Idle-Time Garbage-Collection Scheduling](https://queue.acm.org/detail.cfm?id=2977741)
