---

title: 玩转Node.js单元测试

date: 2017-03-20 21:00:00

tags: [Node.js, 原创]

---


代码部署之前，进行一定的单元测试是十分必要的，这样能够有效并且持续保证代码质量。而实践表明，高质量的单元测试还可以帮助我们完善自己的代码。这篇博客将通过一些简单的测试案例，介绍几款Node.js测试模块: [Mocha](https://mochajs.org/)和[Should](https://shouldjs.github.io/)，[SuperTest](https://github.com/visionmedia/supertest)。本文侧重于解释**原理**，各个模块的详细使用案例以后单独再聊。

<!-- more -->

<div style="text-align: center;">
<img style="width:80%;" src="nodejs-unit-test/nodejs-unit-test.jpg" />
</div>


### 为啥需要单元测试？

所谓单元测试，就是对某个函数或者API进行正确性验证。来看个简单的例子**[add1.js](https://github.com/Fundebug/nodejs-unit-test/blob/master/add1.js)**:

```js
function add(a, b)
{
    return a + b;
}
```

没错，我写了一个加法函数。**这有啥好测的呢？**不妨用node执行一下:

```js
> add = function(a, b){return a + b}
[Function: add]
> add(4)
NaN
```

当add函数仅给定一个参数4的时候，a为4，b为undefined，两者相加为NaN。

- 你考虑过只有一个参数的场景吗？
- 给定一个参数时，NaN是你想要的结果吗？
- 如果参数不是整数怎么办？ 

这时，就需要单元测试来验证各种可能的场景了。

如果我把add函数定义为**两个整数相加**，而其他输入则返回undefined，那么正确的代码**[add2.js](https://github.com/Fundebug/nodejs-unit-test/blob/master/add2.js)**应该是这样的:

```js
function add(a, b)
{
    if (typeof a === "number" && typeof b === "number")
    {
        return a + b;
    }
    else
    {
        return undefined;
    }

}
```

发现一个有趣的现象，我们写代码的时候很容易陷入思维漏洞，而写测试的时候往往会考虑各种情况，这就是所谓的TDD（Test-Driven-Development: 测试驱动开发）的神奇之处。因此，**进行一定的单元测试是十分必要的**:

- 验证代码的正确性
- 避免修改代码时出错
- 避免其他团队成员修改代码时出错
- 便于自动化测试与部署

### 测试框架 - [Mocha](https://mochajs.org/)

下面的测试代码**[test2.js](https://github.com/Fundebug/nodejs-unit-test/blob/master/test/test2.js)**用于测试**[add2.js](https://github.com/Fundebug/nodejs-unit-test/blob/master/add2.js)**。这里使用了测试框架[Mocha](https://mochajs.org/)以及Node.js自带的断言库[Assert](https://nodejs.org/api/assert.html)。

```js
var add = require("../add2.js");
var assert  = require("assert");


// 当2个参数均为整数时
it("should return 3", function()
{
    var sum = add(1, 2);
    assert.equal(sum, 3);
});

// 当第2个参数为String时
it("should return undefined", function()
{
    var sum = add(1, "2");
    assert.equal(sum, undefined);
});

// 当只有1个参数时
it("should return undefined", function()
{
    var sum = add(1);
    assert.equal(sum, undefined);
});
```

测试代码中使用了测试框架[Mocha](https://mochajs.org/)提供的it函数，3个it函数分别测试了3种不同的案例(test case)。it函数的第1个参数为字符串，用于描述测试，一般会写期望得到的结果，例如"should return 3"; 而第2个参数为函数，用于编写测试代码，一般是先调用被测试的函数或者API，获取结果之后，使用断言库判断执行结果是否正确。

测试代码中使用了Node.js自带的断言库[Assert](https://nodejs.org/api/assert.html)的[assert.equal](https://nodejs.org/api/assert.html#assert_assert_equal_actual_expected_message)函数，用于判定add函数返回的结果是否正确。assert.equal成功时不会发生什么，而失败时会抛出一个AssertionError。不妨使用node测试一下:

```bash
> assert  = require("assert");
> assert.equal(1, 1);
undefined
> assert.equal(1, 2);
AssertionError: 1 == 2
    at repl:1:8
    at sigintHandlersWrap (vm.js:22:35)
    at sigintHandlersWrap (vm.js:96:12)
    at ContextifyScript.Script.runInThisContext (vm.js:21:12)
    at REPLServer.defaultEval (repl.js:313:29)
    at bound (domain.js:280:14)
    at REPLServer.runBound [as eval] (domain.js:293:12)
    at REPLServer.<anonymous> (repl.js:513:10)
    at emitOne (events.js:101:20)
    at REPLServer.emit (events.js:188:7)
```

#### 原理: 

> 我们按照Mocha的it函数编写一个个测试案例，然后Mocha负责执行这些案例；当assert.equal断言成功时，则测试案例通过；当assert.equal断言失败时，抛出AssertionError，Mocha能够捕获到这些异常，然后对应的测试案例失败。


使用mocha执行test2.js:

```bash
mocha test/test2.js
```

下面为输出，表示测试案例全部通过

```bash
✓ should return 3
✓ should return undefined
✓ should return undefined

3 passing
```

而当我们使用**[test1.js](https://github.com/Fundebug/nodejs-unit-test/blob/master/test/test1.js)**测试**[add1.js](https://github.com/Fundebug/nodejs-unit-test/blob/master/add1.js)**时，则后面2个测试案例失败:

```bash
✓ should return 3
  1) should return undefined
  2) should return undefined

  1 passing (14ms)
  2 failing

  1)  should return undefined:
     AssertionError: '12' == undefined
      at Context.<anonymous> (test/test1.js:18:12)

  2)  should return undefined:
     AssertionError: NaN == undefined
      at Context.<anonymous> (test/test1.js:25:12)
```

### 断言库 - [Should](https://shouldjs.github.io/)

Node.js自带的断言库[Assert](https://nodejs.org/api/assert.html)提供的函数有限，在实际工作中，[Should](https://shouldjs.github.io/)等第三方断言库则更加强大和实用。

我写了一个merge函数**[merge.js](https://github.com/Fundebug/nodejs-unit-test/blob/master/merge.js)**，实现了类似于[_.extend()](http://underscorejs.org/#extend)与[Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)的功能，用于合并两个Object的属性。

```js
function merge(a, b)
{
    if (typeof a === "object" && typeof b === "object")
    {
        for (var property in b)
        {
            a[property] = b[property];
        }
        return a;
    }
    else
    {
        return undefined;
    }
}
```

然后我使用[Should](https://shouldjs.github.io/)写了对应的测试代码**[test3.js](https://github.com/Fundebug/nodejs-unit-test/blob/master/test/test3.js)**:

```js
require("should");
var merge = require("../merge.js");


// 当2个参数均为对象时
it("should success", function()
{
    var a = {
        name: "Fundebug",
        type: "SaaS"
    };

    var b = {
        service: "Real time bug monitoring",
        product:
        {
            frontend: "JavaScript",
            backend: "Node.js",
            mobile: "微信小程序"
        }
    };

    var c = merge(a, b);

    c.should.have.property("name", "Fundebug");
    c.should.have.propertyByPath("product", "frontend").equal("JavaScript");
});

// 当只有1个参数时
it("should return undefined", function()
{
    var a = {
        name: "Fundebug",
        type: "SaaS"
    };

    var c = merge(a);

    (typeof c).should.equal("undefined");
});
```

测试代码稍微有点长，但是使用Should的只有三处:

```js
c.should.have.property("name", "Fundebug");
c.should.have.propertyByPath("product", "frontend").equal("JavaScript");
(typeof c).should.equal("undefined");
```

可知Should能够:

- 验证对象是否存在某属性，并验证其取值
- 验证对象是否存在某个嵌套属性，并使用链式方式验证其取值

那么Should为什么不能直接验证c的取值为undefined呢？比如这样写:

```js
c.should.equal(undefined); // 这样写是错误的
```

#### 原理: 

> Should会为每个对象添加should属性，然后通过该属性提供各种断言函数，我们可以使用这些函数验证对象的取值。对于undefined，Should无法为其添加属性，因此失败。

通过node验证发现，导入Should之后，空对象a增加了一个should属性。

```bash
> a = {}
> typeof a.should
'undefined'
> require("should")
> typeof a.should
'object'
```

### 测试HTTP接口 - [SuperTest](https://github.com/visionmedia/supertest)

Node.js是用于后端开发的语言，而后端开发其实很大程度上等价于编写HTTP接口，为前端提供服务。那么，Node.js单元测试则少不了对HTTP接口进行测试。

我用Node.js自带的[HTTP](https://nodejs.org/api/http.html)模块写了一个简单的HTTP接口**[server.js](https://github.com/Fundebug/nodejs-unit-test/blob/master/server.js)**

```js
var http = require("http");

var server = http.createServer((req, res) =>
{
    res.writeHead(200,
    {
        "Content-Type": "text/plain"
    });

    res.end("Hello Fundebug");
});


server.listen(8000);
```

按照Mocha的原理，测试HTTP接口并不难: 访问接口; 获取返回数据; 验证返回结果。使用Node.js原生的http与assert模块就可以了**[test4.js](https://github.com/Fundebug/nodejs-unit-test/blob/master/test/test4.js)**:

```js
require("../server.js");
var http = require("http");
var assert = require("assert");


it("should return hello fundebug", function(done)
{
    http.get("http://localhost:8000", function(res)
    {
        res.setEncoding("utf8");
        res.on("data", function(text)
        {
            assert.equal(res.statusCode, 200);
            assert.equal(text, "Hello Fundebug");
            done();
        });
    });
});
```

值得稍微注意的一点是，http.get访问HTTP接口是一个异步操作。**Mocha在测试异步代码是需要为it函数添加回调函数done**，在断言结束的地方调用done，这样Mocha才能知道什么时候结束这个测试。

既然Node.js自带的模块就能够测试HTTP接口了，为什么还需要[SuperTest](https://github.com/visionmedia/supertest)呢？不妨先看一下测试代码**[test5.js](https://github.com/Fundebug/nodejs-unit-test/blob/master/test/test5.js)**:

```js
var request = require("supertest");
var server = require("../server.js");
var assert = require("assert");


it("should return hello fundebug", function(done)
{
    request(server)
        .get("/")
        .expect(200)
        .expect(function(res)
        {
            assert.equal(res.text, "Hello Fundebug");
        })
        .end(done);
});
```

对比两个测试代码，会发现后者简洁很多。

#### 原理

> SuperTest封装了发送HTTP请求的接口，并且提供了简单的expect断言来判定接口返回结果。对于POST接口，使用SuperTest的优势将更加明显，因为使用Node.js的http模块发送POST请求是很麻烦的。

### 要做多少单元测试？

本文所写的单元测试案例，都很简单。然而，在实际工作中，单元测试是一个很头痛的事情。修改了代码有时意味着必须修改单元测试，写了新的函数或者API就得写新的单元测试。如果较真起来，单元测试可以没完没了地写，但这是没有意义的。而根据二八原理，20%的测试可以解决80%的问题。剩下的20%问题，事实上我们是力不从心的。换句话说，想通过测试消除所有BUG，是不现实的。

因此，对生产代码进行实时错误监测是非常有必要的，这也是我们[Fundebug](https://fundebug.com/)努力在做的事情:) 欢迎大家加入我们的**Node.js技术交流群**:

<div style="text-align: center;">
<img style="width:20%;" src="http://opu5mq5tf.bkt.clouddn.com/qq_nodejs.JPG" />
</div>

### 参考链接

- [测试框架 Mocha 实例教程 - 阮一峰](http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html)
- [单元测试要做多细 - 酷壳](http://coolshell.cn/articles/8209.html)
- [测试的道理 -王垠](http://www.yinwang.org/blog-cn/2016/09/14/tests)
- [Pareto principle](https://en.wikipedia.org/wiki/Pareto_principle)
