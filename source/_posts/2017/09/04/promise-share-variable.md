---

title: 如何在Promise链中共享变量？

date: 2017-09-04 10:00:00

tags: [JavaScript, 翻译]

---

**译者按:** 使用**Promise**写过异步代码的话，会发现在**Promise**链中共享变量是一个非常头疼的问题，这也是**Async/Await**胜过**Promise**的一点，我们在[Async/Await替代Promise的6个理由](https://blog.fundebug.com/2017/04/04/nodejs-async-await/)有提过，这篇博客将有更详细的介绍。

<!-- more -->


- 原文: [Passing data between Promise callbacks](http://2ality.com/2017/08/promise-callback-data-flow.html)
- 译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译，并且对源代码进行了大量修改。另外，本文版权归原作者所有，翻译仅用于学习。**

基于Promise编写异步代码时，通常会使用多个**then**组成链式调用，每一个**then**都会有一个回调函数。因此，在Promise链中，会有很多回调函数，每个回调函数都有一个独立的变量作用域。那么，如何在这些回调函数之间共享变量呢？这篇博客将探讨这个问题。

### 问题

**connection**变量在**A**处定义，在**B**和**C**处都需要使用。但是，由于**A、B、C**处于各自独立的作用域，**connection**变量将不能在**B**和**C**处直接使用。

```javascript
db.open()
    .then(connection => // A
    { 
        return connection.select(
        {
            name: 'Fundebug'
        });
    })
    .then(result =>
    {
        connection.query(); // B
    })
    .catch(error =>
    {
        // ...
    })
    .finally(() =>
    {
        connection.close(); // C
    });
```

### 方法1：使用高阶作用域变量

在更高阶的作用域定义**connection**变量，在**D**处赋值，这样在**B**和**C**处直接使用了。

```javascript
let connection; // A
db.open()
    .then(conn =>
    {
        connection = conn; // D
        return connection.select(
        {
            name: 'Fundebug'
        });
    })
    .then(result =>
    {
        connection.query(); // B
    })
    .catch(error =>
    {
        // ...
    })
    .finally(() =>
    {
        connection.close(); // C
    });
```

**问题**：如果需要共享的变量过多(这是很常见的情况)，则需要在高阶作用域中定义很多变量，这样非常麻烦，代码也比较冗余。

### 方法2：嵌套作用域

将需要使用**connection**变量的Promise链内嵌到对应**then**回调函数中，这样在**B**和**C**处直接使用了。

```javascript
db.open()
    .then(connection => // A
        {
            return connection.select(
                {
                    name: 'Fundebug'
                })
                .then(result =>
                {
                    connection.query(); // B
                })
                .catch(error =>
                {
                    // ...
                })
                .finally(() =>
                {
                    connection.close(); // C
                });
        });
```

**问题：**之所以使用Promise，就是为了避免回调地域，将多层嵌套的回调函数转化为链式的then调用；如果为了共享变量采用嵌套写法，则要Promise有何用？

### 方法3：return多个值

**intermediate**变量在**A**处定义并赋值，而在**B**处需要使用；但是，由于**A**与**B**处于不同的作用域，**B**出并不能直接使用**intermediate**变量：

```javascript
return asyncFunc1()
    .then(result1 =>
    { 
        const intermediate = ··· ; // A
        return asyncFunc2();
    })
    .then(result2 =>
    { 
        console.log(intermediate); // B
    });
```

在**A**处使用**Promise.all**返回多个值，就可以将**intermediate**变量的值传递到**B**处：

```javascript
return asyncFunc1()
    .then(result1 =>
    {
        const intermediate = ···; 
        return Promise.all([asyncFunc2(), intermediate]); // A
    })
    .then(([result2, intermediate]) =>
    {
        console.log(intermediate); // B
    });
```

**问题:**  使用**Promise.all**用于传递共享变量，看似巧妙，但是有点大材小用，并不合理；不能将变量传递到**.catch()**与**finally()**中；当共享变量过多，或者需要跨过数个**.then()**，需要**return**的值会很多。

### 方法4: 使用Async/Await

**Async/Await**是写异步代码的新方式，可以替代**Promise**，它使得异步代码看起来像同步代码，可以将多个异步操作写在同一个作用域中，这样就不存在传递共享变量的问题了！！！

方法1中的示例可以改写为：

```javascript
try
{
	var connection = await db.open(); // A 
    const result = await connection.select(
    {
        name: 'Fundebug'
    });
    connection.query(); // B
}
catch (error)
{
    // ...
}
finally
{
    connection.close(); // C
}
```

方法3中的示例可以改写为：

```javascript
try
{
	result1 = await asyncFunc1();
	const intermediate = ··· ;
	result2 = await asyncFunc2();
	console.log(intermediate);
}
catch (error)
{
    // ...
}
```

毋庸赘言，**Async/Await**直接将问题消灭了，无疑是更好的方式！

### 参考

- [Promises for asynchronous programming](http://exploringjs.com/es6/ch_promises.html)
- [ES proposal: Promise.prototype.finally()](http://2ality.com/2017/07/promise-prototype-finally.html)
- [ES proposal: Promise.try()](http://2ality.com/2017/08/promise-try.html)
- [Async/Await替代Promise的6个理由](https://blog.fundebug.com/2017/04/04/nodejs-async-await/)

<div style="text-align: center;">
<img style="width:30%;" src="https://blog.fundebug.com/images/qq_bug.JPG" />
</div>