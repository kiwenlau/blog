---

title: 从JS引擎理解Await b()与Promise.then(b)的堆栈处理

date: 2018-07-18 10:00:00

tags: [JavaScript, 翻译]

keywords: async,await,promise,javascript,堆栈

description: 从JS引擎理解Await b()与Promise.then(b)的堆栈处理，Async/Await绝不仅仅只是语法糖。

---

**译者按：** Async/Await真的只是简单的语法糖吗？No！

<!-- more -->

- **原文**：[Asynchronous stack traces: why await beats .then()](https://mathiasbynens.be/notes/async-stack-traces)
- **作者**: [Mathias Bynens](https://github.com/mathiasbynens): Google V8引擎开发者
- **译者**：[Fundebug](https://www.fundebug.com/)

**为了保证可读性，本文采用意译而非直译。另外，本文版权归原作者所有，翻译仅用于学习。**

与直接使用Promise相比，使用[Async/Await](https://developers.google.com/web/fundamentals/primers/async-functions)不仅可以提高代码的可读性，同时也可以优化JavaScript引擎的执行方式。这篇博客将介绍Async/Await是如何优化JavaScript引擎对堆栈信息的处理。

Async/Await与Promise最大区别在于：await b()会暂停所在的async函数的执行；而Promise.then(b)将b函数加入回调链中之后，会继续执行当前函数。对于堆栈来说，这个不同点非常关键。

当一个Promise链抛出一个未处理的错误时，无论我们使用await b()还是Promise.then(b)，JavaScript引擎都需要打印错误信息及其堆栈。对于JavaScript引擎来说，两者获取堆栈的方式是不同的。

### Promise.then(b)

示例代码中，函数c()会在异步函数b()成功resolve之后执行：

```javascript
const a = () => {
	b().then(() => c());
};
```

当调用a()函数时，这些事情同步发生：

- b()函数被调用，它会返回一个Promise，这个Promise会在未来的某个时刻resolve。
- .then()回调函数(实际调用了c()函数)被添加到回调链。

这样，a()函数内的代码就执行完了。a()函数不会被暂停，因此在异步函数b()resolve时，a()函数的作用域已经不存在了。假设b()或者c()抛出了一个错误，则堆栈信息中应该包含a()函数，因为它们都是在a()函数内被调用。对a()函数的任何引用都不存在了，要如何生成包含a()的堆栈信息呢？

为了解决这个问题，JavaScript引擎需要做一些额外的工作：它会及时记录并且保存堆栈信息。对于V8引擎来说，堆栈信息附加在了b()函数所返回的Promise并在Promise链中传递，这样c()函数也能在需要的时候获取堆栈信息。

记录堆栈信息需要时间，这样会降低性能；而保存堆栈信息需要占用额外的内存。

*使用[Fundebug](https://www.fundebug.com/), 可以实时监控线上应用的错误，并获取完整的堆栈信息。*

### Await b()

我们可以使用Async/Await实现同样的代码，同步函数c()会等到异步函数b()执行结束之后再执行：

```javascript
const a = async () => {
	await b();
	c();
};
```

使用await时，无需存储当前的堆栈信息，因为存储b()到a()的指针就足够了。当等待b()函数执行时，a()函数被暂停了，因此a()函数的作用域还在内存可以访问。如果b()函数抛出一个错误，堆栈信息可以通过指针迅速生成。如果c()函数抛出一个错误，堆栈信息也可以像同步函数一样生成，因为c()函数是在a()函数中执行的。不论是b()还是c()，我们都不需要去存储堆栈信息，因为堆栈信息可以在需要的时候立即生成。而存储指针，显然比存储堆栈更加节省内存。

### 建议

很多ECMAScript语法特性看起来都只是语法糖，其实并非如此，至少Async/Await绝不仅仅只是语法糖。

为了让JavaScript引擎处理堆栈的方式性能更高并且更加节省内存，请遵循这些建议：

- 使用Async/Await，而不是直接使用Promise
- 使用[babel-preset-env](https://github.com/babel/babel-preset-env)，避免Babel不必要地转换Async/Await

尽管V8引擎还没有实现这些优化，请遵循这些建议。当我们为V8实现这些优化的时候，你的程序可以保证最佳的性能。(作者是V8引擎的开发者)

一般来说，尽量不要去使用Babel转码器。[所有支持Service Workers的浏览器](https://caniuse.com/#feat=serviceworkers)都支持Async/Await，因此没有必要去对Async/Await转码。这一点对于[JavaScript modules via script tag](https://caniuse.com/#feat=es6-module)同样适用。关于这一点，大家可以参考[Deploying ES2015+ Code in Production Today](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/)。


### 关于Fundebug

[Fundebug](https://www.fundebug.com)专注于JavaScript、微信小程序、微信小游戏，Node.js和Java实时BUG监控。
自从2016年双十一正式上线，Fundebug累计处理了5亿+错误事件，得到了众多知名用户的认可。欢迎免费试用！

<div style="text-align: center;">
<img style="width:30%;" src="https://blog.fundebug.com/images/qq_bug.JPG" />
</div>

