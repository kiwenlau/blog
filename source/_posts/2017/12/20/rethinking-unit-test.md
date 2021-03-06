---

title: 重新思考单元测试

date: 2017-12-20 10:00:00

tags: [测试]

---

**摘要：** 单元测试应该是程序员的必备技能，而真正的编程高手应该善于把握单元测试的粒度。

<!-- more -->

<div style="text-align: center;">
<img style="width:80%;" src="rethinking-unit-test/unit-test.jpg" />
</div>

在[前一篇博客](https://blog.fundebug.com/2017/12/13/reconstruct-from-promise-to-async-await/)，我提及到了最近在对后端Node.js服务进行代码重构，将Promise替换成Async/Await。这是一件痛并快乐着的事。

当任务完成50%之后，我发现，与其说是**重构**，更准确的说法或许是**重写**。一方面，换用Async/Await本身就意味着需要修改每个异步函数，而后端绝大多数函数都是异步的；另一方面，作为一个有着强迫症的完美主义者，我写了大量**单元测试**对代码进行了一系列优化，同时修复了一些BUG，并且实现了一个新功能。

这里的关键词是**单元测试**，那么问题来了，重构代码就得了，写什么单元测试啊？这不是没事找事么，要知道单元测试似乎比功能代码更难写。

这是一个很有意思的话题。

### 什么是单元测试

在[《玩转Node.js单元测试》](https://blog.fundebug.com/2017/03/20/nodejs-unit-test/)中，我是这样定义单元测试的：

> 所谓单元测试，就是对某个函数或者API进行正确性验证。

这样的定义非常通俗易懂，但并不是很准确，严格来说应该是**错误**的。因为对API测试时，会涉及到多个函数，很多时候还会依赖于数据库、缓存以及第三方服务等外部资源。因此，API测试应该属于**集成测试**而非**单元测试**。

根据[《JavaScript有这几种测试分类》](https://blog.fundebug.com/2017/06/26/javascript-test-type/)，**集成测试**与**单元测试**应该是这样区分的：

> 单元测试指的是测试小的代码块，通常指的是独立测试单个函数。如果某个测试依赖于一些外部资源，比如网络或者数据库，那它就不是单元测试。

> 集成测试就是测试应用中不同模块如何集成，如何一起工作，这和它的名字一致。集成测试与单元测试相似，但是它们也有很大的不同：单元测试是测试每个独立的模块，而集成测试恰好相反。比如，当测试需要访问数据库的代码时，单元测试不会真的去访问数据库，而集成测试则会。

因此，对于单元测试，更加准确的理解应该是**对单个函数进行独立测试**。

但是，在实际操作中，测试单个函数时，很难保证所谓的**独立测试**。一些函数难免依赖于其他函数、数据库、函数以及第三方服务等外部资源，这个我们很难避免，甚至有时恰恰需要验证这些外部资源。比如，验证写入数据库或者缓存的数据是否符合预期；验证数据库或者缓存中的数据对函数行为的影响是否符合预期。

在我看来，对单个函数进行非独立的测试，不妨也可以视作**“单元测试”**。简单地说，本文所讨论的**单元测试**，就是对**单个函数进行测试**。


### 重构与单元测试

新功能的增加，代码复杂性的提高，优化代码的需要，或新技术的出现都会导致重构代码的需求。在没有写单元测试的情况下，对代码进行大规模修改，是一件不敢想象的事情，因为写错的概率实在太大了。

我一直在鼓励大家写单元测试，然而，有时难免偷懒。当我打算重构代码的时候，发现写的单元测试其实是不够的，这就比较尴尬了:(

那我到底是直接改代码；还是先写单元测试，然后再改代码呢？这是一个艰难的决定，因为前者很难保证正确性，后者貌似需要耗费大量时间。

有一种智慧叫做“摸着石头过河”：我尝试在修改函数代码之前，补写一些单元测试。这个过程并没有想象中那么痛苦，也许是因为做决定本身其实比做事情更痛苦，或者是因为我比较喜欢敲代码。

于是，我就可以开始大刀阔斧地进行重构了：换用Async/Await；优化代码组织；优化程序性能；写新功能...忙得不亦乐乎。

如果没写单元测试，我敢怎么做吗？当然不敢！出错了还得我来改啊。

如果没写单元测试，我会改得那么快吗？当然不会！大概每改一个函数都会想半天，改完然后祈祷它不会出错；修改某个函数并不是一蹴而就的事情，如果每次修改都去磨叽半天，大概我现在还在敲代码而不是在写博客。

正是因为有了单元测试做保证，改起来才会得心应手，效率更高。这样，既可以保证正确性，又可以节省时间。想象中单元测试会浪费不少时间，事实上似乎并非如此。

*[Fundebug](https://fundebug.com)是全栈JavaScript错误监控平台，支持各种前端和后端框架，可以帮助您第一时间发现BUG！*

### 单元测试的好处

也许大多数人没有我这么喜欢折腾，不会一直去重构代码，这种情况下，难道就不用写单元测试啦？

我想答案应该是否定的。因为单元测试有很多显而易见的好处：

- 验证代码的正确性
- 验证边界条件
- 避免BUG复现
- 避免修改代码时出错
- 避免其他团队成员修改代码时出错
- 便于自动化测试与部署

另外，单元测试能够提供另一个思考代码的角度，这对于编写高质量的代码是很有好处的。

本文聊的单元测试是针对每一个函数的，那么，你在写单元测试的时候，就会去考虑合理地拆分与合并函数。因为函数的功能区分不清楚的话，是不太好写单元测试的。

敲代码的时候，我们考虑的是函数实现，不管三七二十一，写好了就大功告成了。写测试的时候，我们跳出了函数，从输入输出的角度去思考函数的功能，这时候，你就会去想，这个函数真的需要吗？这个函数的功能是不是可以简化一下？这个函数考虑的情况似乎不够全面吧？这些思考，可以帮助我们写出更好的代码。

### 单元测试的粒度

如果你是编程高手，似乎可以少写一些单元测试。王垠大神在[《测试的道理》](http://www.yinwang.org/blog-cn/2016/09/14/tests)中是这样说的：

> 在我心目中，代码本身的地位大大的高于测试。我不忽视测试，但我不会本末倒置，过分强调测试，我并不推崇测试驱动开发（TDD）。我知道该测试什么，不该测试什么，什么时候该写测试，什么时候不该写，什么时候应该推迟测试，什么时候完全不需要测试。因为这个原因，再加上高强的编程能力，我多次完成别人认为在短时间不可能完成的任务，并且制造出质量非常高的代码。

那么问题来了，你是高手吗？根据二八原理，大部分开发者并非高手。在下自认为编程水平还不错，也选择尽量写单元测试。

假设你是高手，那你能保证你的团队都是高手吗？根据二八原理，一个团队里面只有少数人是高手。如果你不写足够的单元测试，他们乱改你的代码，是会出事情的。

所以说，**还是得尽量写单元测试，无论你是不是高手。**

当然，你也不能没完没了地写单元测试，否则就本末倒置了。

另外，单元测试写得越多，其边际收益是在不断降低，是得不偿失的。神奇的二八原理告诉我们，20%的测试可以覆盖80%的问题；而剩下20%的问题，你需要写80%的单元测试。换句话说，单元测试并不能消除所有问题。因此，对生产代码进行实时错误监控是非常有必要的，这也是我们[Fundebug](https://blog.fundebug.com/2017/03/20/nodejs-unit-test/)努力在做的事情。

在[《单元测试要做多细？》](https://coolshell.cn/articles/8209.html/comment-page-1)中，耗子哥告诉我们：

> UT的粒度是多少，这个不重要，重要的是你会不会自己思考你的软件应该怎么做，怎么测试。

这是每一个程序员都应该认真思考的问题，没有所谓的标准答案。从小接受**中庸之道**和**唯物主义辩证法**熏陶的我们，应该可以在实践当中思考合适的测试粒度。当你学会了思考，你才能成为真正的高手。

### 参考

- [Fundebug: 玩转Node.js单元测试](https://blog.fundebug.com/2017/03/20/nodejs-unit-test/)
- [Fundebug: JavaScript有这几种测试分类](https://blog.fundebug.com/2017/06/26/javascript-test-type/)
- [王垠：测试的道理](http://www.yinwang.org/blog-cn/2016/09/14/tests)
- [酷壳：单元测试要做多细？](https://coolshell.cn/articles/8209.html/comment-page-1)
