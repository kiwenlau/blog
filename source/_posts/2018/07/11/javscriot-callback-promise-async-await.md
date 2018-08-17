---

title: JavaScript异步编程史：回调函数到Promise到Async/Await

date: 2018-07-11 10:00:00

tags: [JavaScript, 翻译]

keywords: https

description: JavaScript异步编程史：回调函数到Promise到Async/Await

---

**摘要：** 异步编程时JavaScript以及Node.js的一大亮点，其中有什么心酸的黑历史呢？

<!-- more -->

- 原文: [Async programming basics every JS developer should know in 2018](https://dev.to/siwalik/async-programming-basics-every-js-developer-should-know-in-2018-a9c)
- 译者：[Fundebug](https://www.fundebug.com/)

**为了保证可读性，本文采用意译而非直译。另外，本文版权归原作者所有，翻译仅用于学习**

### 回调函数

简单地说，回调函数(callback function)就是给另外一个宿主函数做参数的函数。回调函数在宿主函数内执行，执行结果返回给宿主函数。

```javascript
// 给click方法做参数的匿名函数就是一个回调函数
$("body").click(function() {
    alert(`clicked on body`);
});
```

是不是很简单呢？

现在，我们来实现一个回调函数，模拟在游戏中得分升级。

```javascript
// levelOne()是宿主函数，它接收另外一个函数作为参数
// levelOne()的第二个参数callback是一个回调函数，它的名字可以任意取，通常命名为callback只是为了易于理解
function levelOne(value, callback)
{
    var newScore = value + 5;
    callback(newScore);
}

function startGame()
{
    var currentScore = 5;
    console.log('Game Started! Current score is ' + currentScore);
    
    // levelOne()的第二个参数为回调函数
    levelOne(currentScore, function(levelOneReturnedValue)
    {
        console.log('Level One reached! New score is ' + levelOneReturnedValue);
    });
}

startGame();
```

执行以上代码，控制台输出是这样的：

```
"Game Started! Current score is 5"
"Level One reached! New score is 10"
```

有输出可知，levelOne()内的代码(var newScore = value + 5;)执行之后，才会执行回调函数中的代码(console.log('Level One reached! New score is ' + levelOneReturnedValue);)。

可知，回调函数可以在特定代码执行完成之后再执行，这种执行机制在实际编程中非常有用。在执行一些比较耗时的代码时，比如读取文件，不需要阻塞整个代码去等待它完成，而可以继续执行其他代码；而当文件读取完成后，代码中所绑定给文件读取的回调函数会自动执行。

但是，当使用多个层级的的回调函数时，情况会变得非常糟糕...下面是代码示例：

```javascript
function levelOne(value, callback)
{
    var newScore = value + 5;
    callback(newScore);
}

function levelTwo(value, callback)
{
    var newScore = value + 10;
    callback(newScore);
}

function levelThree(value, callback)
{
    var newScore = value + 30;
    callback(newScore);
}

function startGame()
{
    var currentScore = 5;
    console.log('Game Started! Current score is ' + currentScore);
    levelOne(currentScore, function(levelOneReturnedValue)
    {
        console.log('Level One reached! New score is ' + levelOneReturnedValue);
        levelTwo(levelOneReturnedValue, function(levelTwoReturnedValue)
        {
            console.log('Level Two reached! New score is ' + levelTwoReturnedValue);
            levelThree(levelTwoReturnedValue, function(levelThreeReturnedValue)
            {
                console.log('Level Three reached! New score is ' + levelThreeReturnedValue);
            });
        });
    });

}

startGame();
```

执行以上代码，控制台输出是这样的：

```
"Game Started! Current score is 5"
"Level One reached! New score is 10"
"Level Two reached! New score is 20"
"Level Three reached! New score is 50"
```

levelThree()为levelTwo()的回调函数，而levelTwo()为levelOne()的回调函数。那么正确的执行顺序是：levelOne() > levelTwo() > levelThree()。

如果有10个回调函数嵌套起来呢？是不是看着就有点头疼了！这个问题就是所谓的**回调地狱(callback hell)**!有没有解法呢？请听下回分解！

### Promise

JavaScript从**ES6(即[ECMAScript 2015](https://www.ecma-international.org/ecma-262/6.0/))**开始支持Promise。简单地说，Promise是一个特殊的对象，它可以表示异步操作的成功或者失败，同时返回异步操作的执行结果。

使用[Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)构造函数来定义promise：

```javascript
// 当一切正常时，调用resolve函数；否则调用reject函数
var promise = new Promise(function(resolve, reject)
{
    if ( /* everything turned out fine */ )
    {
        resolve("Stuff worked!");
    }
    else
    {
        reject(Error("It broke"));
    }
});
```

我们将前文陷入回调地狱的例子使用Promise改写：

```javascript
function levelOne(value)
{
    var promise, newScore = value + 5;
    return promise = new Promise(function(resolve)
    {
        resolve(newScore);
    });
}

function levelTwo(value)
{
    var promise, newScore = value + 10;
    return promise = new Promise(function(resolve)
    {
        resolve(newScore);
    });
}

function levelThree(value)
{
    var promise, newScore = value + 30;
    return promise = new Promise(function(resolve)
    {
        resolve(newScore);
    });
}

var startGame = new Promise(function(resolve, reject)
{
    var currentScore = 5;
    console.log('Game Started! Current score is ' + currentScore);
    resolve(currentScore);
});

// startGame返回的结果传递给了then函数，然后传递给了levelOne函数
startGame.then(levelOne)
    .then(function(result)
    {
        // result为levelOne函数的返回值
        console.log('You have reached Level One! New score is ' + result);
        return result;
    })
    .then(levelTwo)
    .then(function(result)
    {
        console.log('You have reached Level Two! New score is ' + result);
        return result;
    })
    .then(levelThree)
    .then(function(result)
    {
        console.log('You have reached Level Three! New score is ' + result);
    });
```

执行以上代码，控制台输出还是这样的：

```
"Game Started! Current score is 5"
"Level One reached! New score is 10"
"Level Two reached! New score is 20"
"Level Three reached! New score is 50"
```

回调函数采用了嵌套的方式依次调用levelOne()、levelTwo() 和levelThree()，而Promise使用then将它们链接起来。

相比回调函数而言，Promise代码可读性更高，代码的执行顺序一目了然。

难道Promise就是JavaScript异步编程的终点吗？当然不是！

### Async/Await

JavaScript从**ES8(即[ECMAScript 2017](https://www.ecma-international.org/ecma-262/8.0/))**开始支持Async/Await。它让我们可以采用同步的方式调用Promise函数，提高异步代码的可读性。

本质上，Async/Await只是基于Promise的语法糖，它让我们可以使用同步的方式写异步代码。但是，不要因此小看Async/Await，**使用同步的方式写异步代码**其实非常强大。

在定义函数时，在其前面添加一个**async**关键字，就可以在函数内使用**await**了。当await一个Promise时，代码会采用非阻塞的方式继续执行下去。当Promise成功resolve了，await语句会正真执行结束，并获取resolve的值。当Promise失败reject了，await语句初会throw一个错误。

我们再来用async/await来改写之前的例子：

```javascript
function levelOne(value)
{
    var promise, newScore = value + 5;
    return promise = new Promise(function(resolve)
    {
        resolve(newScore);
    });
}

function levelTwo(value)
{
    var promise, newScore = value + 10;
    return promise = new Promise(function(resolve)
    {
        resolve(newScore);
    });
}

function levelThree(value)
{
    var promise, newScore = value + 30;
    return promise = new Promise(function(resolve)
    {
        resolve(newScore);
    });
}

// 只有aysnc函数内可以使用await语句
async function startGame()
{
    var currentScore = 5;
    console.log('Game Started! Current score is ' + currentScore);
    currentScore = await levelOne(currentScore);
    console.log('You have reached Level One! New score is ' + currentScore);
    currentScore = await levelTwo(currentScore);
    console.log('You have reached Level Two! New score is ' + currentScore);
    currentScore = await levelThree(currentScore);
    console.log('You have reached Level Three! New score is ' + currentScore);
}

startGame();
```

执行以上代码，控制台输出依然是这样的：

```
"Game Started! Current score is 5"
"Level One reached! New score is 10"
"Level Two reached! New score is 20"
"Level Three reached! New score is 50"
```

忽然之间，代码的可读性提高了非常多！当然，async/await的神奇之处不止于此。async/await的出错处理非常方便，因为我们可以把同步代码和异步代码写在同一个try...catch...语句中。async/await代码调试更加方便，使用Promise时，我们无法设置断点，而async/await代码可以像同步代码一样设置断点。

## 参考

- [重构：从Promise到Async/Await](https://blog.fundebug.com/2017/12/13/reconstruct-from-promise-to-async-await/)
- [Async/Await是这样简化JavaScript代码的](https://blog.fundebug.com/2017/10/16/async-await-simplify-javascript/)
- [Async/Await替代Promise的6个理由](https://blog.fundebug.com/2017/04/04/nodejs-async-await/)

