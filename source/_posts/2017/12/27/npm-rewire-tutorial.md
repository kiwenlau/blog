---

title: NPM测试模块之rewire教程

date: 2017-12-27 10:00:00

tags: [Fundebug]

---

**摘要**：有了rewire模块，再也不用担心测试私有函数了。

<!-- more -->

在[玩转Node.js单元测试](https://blog.fundebug.com/2017/03/20/nodejs-unit-test/)，我介绍了3个用于编写测试代码的NPM模块：[Mocha](https://mochajs.org/), [Should](https://shouldjs.github.io/)以及[SuperTest](https://blog.fundebug.com/2017/03/20/nodejs-unit-test/)。为了[怂恿大家写单元测试](https://blog.fundebug.com/2017/12/20/rethinking-unit-test/)，我再介绍一款神奇的NPM测试模块：[rewire](https://github.com/jhnns/rewire)。

- **GitHub仓库:** [Fundebug/rewire-tutorial](https://github.com/Fundebug/rewire-tutorial)

#### rewire原理

对于技术，知其然，也应该知其所以然。

对于rewire，它的基本功能与require相同，都是用于导入模块，只是，它会为导入的模块添加两个特殊的函数：**\_\_get\_\_**与**\_\_set\_\_**。顾名思义，这两个函数可以分别用于获取和修改模块中的变量/函数。测试的时候，当我们需要获取或者重写私有变量/函数，rewire非常有用。


#### \_\_get\_\_: 获取私有变量/函数

下面是需要测试的代码[示例1](https://github.com/Fundebug/rewire-tutorial/blob/master/test1.js)：

```javascript
// 公有函数add
function add(a, b)
{
    return a + b;
}

// 私有函数sub
function sub(a, b)
{
	return a - b;
}

exports.add = add;
```

可知，add为公有函数，而sub为私有函数。

测试公有函数add时，非常方便，require之后可以直接获取：

```javascript
// 测试公有函数add
var assert  = require("assert");
var add = require("../test1.js").add;

it("1加1等于2", function()
{
    var result = add(1, 1);
    assert.equal(result, 2);
});
```

但是，测试私有函数sub时，使用require是无法获取的。这时，可以使用rewire导入模块，然后使用其提供的**\_\_get\_\_**方法获取私有函数：

```javascript
// 测试私有函数sub
var assert  = require("assert");
var rewire = require("rewire");
var sub = rewire("../test1.js").__get__("sub");

it("2减1等于1", function()
{
    var result = sub(2, 1);
    assert.equal(result, 1);
});
```

在编写模块的时候，难免存在一些私有变量或者函数，有了**rewire**，我们就可以方便地获取，然后进行测试。

*[Fundebug](https://fundebug.com)是全栈JavaScript错误监控平台，支持各种前端和后端框架，可以帮助您第一时间发现BUG！*

#### \_\_set\_\_: 重写私有变量/函数

下面是需要测试代码[示例2](https://github.com/Fundebug/rewire-tutorial/blob/master/test2.js)：

```javascript
var fs = require("fs")

function add(a, b)
{
    let result = a + b;
    fs.writeFileSync("result.txt", result);
    return result;
}

exports.add = add;
```

可知，如果直接测试的话，add函数的计算结果会写入**result.txt**文件：

```javascript
var assert = require("assert");
var add = require("../test2.js").add;

it("1加1等于2", function()
{
    let result = add(1, 2);
    assert.equal(result, 3);
});
```

但是，当我们测试时，并不希望去写磁盘，因为当内容很多时，这样比较浪费时间。这时，我们可以使用rewire导入模块，然后使用其提供的**\_\_set\_\_**来重写fs模块，避免真的去写磁盘：


```javascript
var assert = require("assert");
var rewire = require("rewire");
var myModule = rewire("../test2.js")
var add = myModule.add;

var fsMock = {
    writeFileSync: function(file, data, option) { /* 啥也不干 */ }
};

myModule.__set__("fs", fsMock);

it("1加1等于2", function()
{
    let result = add(1, 2);
    assert.equal(result, 3);
});
```

在实践中，为了简化测试和节省时间，我们通常需要去重写函数调用的外部函数，这时可以选择使用rewire模块实现。

另外，rewire模块还提供了**\_\_with\_\_**接口，可以用于一次性重写私有变量/函数。不过这个功能通常可以使用mocha的**before**/**after**以及**beforeEach/afterEach**来实现，更为直观，因此本文不再介绍。

#### 参考

- [Fundebug: 玩转Node.js单元测试](https://blog.fundebug.com/2017/03/20/nodejs-unit-test/)
- [Fundebug: 重新思考单元测试](https://blog.fundebug.com/2017/12/20/rethinking-unit-test/)
