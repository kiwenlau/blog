---

title: JavaScript机器学习之线性回归
date: 2017-07-03 10:00:00
tags: [JavaScript, 翻译, 人工智能]

---

**译者按:** AI时代，不会机器学习的JavaScript开发者不是好的前端工程师。

<!-- more -->

原文: [Machine Learning with JavaScript : Part 1](https://hackernoon.com/machine-learning-with-javascript-part-1-9b97f3ed4fe5)

译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译。另外，本文版权归原作者所有，翻译仅用于学习**

使用JavaScript做机器学习？不是应该用Python吗？是不是我疯了才用JavaScript做如此繁重的计算？难道我不用Python和R是为了装逼？[scikit-learn](http://scikit-learn.org/stable/)(Python机器学习库)不能使用Python吧？

嗯，我并没有开玩笑...

其实呢，类似于Python的[scikit-learn](http://scikit-learn.org/stable/)，JavaScript开发者也开发了一些机器学习库，我打算用一下它们。

### JavaScript不能用于机器学习？

1. 太慢（幻觉？）
2. 矩阵操作太难（有函数库啊，比如**math.js**）
3. JavaScript只能用于前端开发（Node.js开发者笑了）
4. 机器学习库都是Python（JS开发者）

### JavaScript机器学习库

1. [brain.js](https://github.com/harthur-org/brain.js) (神经网络)
2. [Synaptic](https://github.com/cazala/synaptic) (神经网络)
3. [Natural](https://github.com/NaturalNode/natural) (自然语言处理)
4. [ConvNetJS](http://cs.stanford.edu/people/karpathy/convnetjs/) (卷积神经网络)
5. [mljs](https://github.com/mljs) (一系列AI库)
6. [Neataptic](http://dnn%20execution%20framework%20o/) (神经网络)
7. [Webdnn](https://github.com/mil-tokyo/webdnn) (深度学习)

我们将使用[mljs](https://github.com/mljs)来实现线性回归，源代码在GitHub仓库： [machine-learning-with-js](https://github.com/abhisheksoni27/machine-learning-with-js)。下面是详细步骤：

### 1. 安装模块

```
$ yarn add ml-regression csvtojson
```

或者使用 `npm`

```
$ npm install ml-regression csvtojson
```

- [ml-regression](https://github.com/mljs/regression)模块提供了一些**回归算法**
- [csvtojson](https://github.com/Keyang/node-csvtojson)模块用于将CSV数据转换为JSON。

### 2. 初始化并导入数据

下载[.csv数据](http://www-bcf.usc.edu/~gareth/ISL/Advertising.csv)。

假设你已经初始化了一个NPM项目，请在**index.js**中输入以下内容：

```javascript
const ml = require("ml-regression");
const csv = require("csvtojson");
const SLR = ml.SLR; // 线性回归

const csvFilePath = "advertising.csv"; // 训练数据
let csvData = [], 
    X = [], 
    y = []; 

let regressionModel;
```

使用csvtojson模块的fromFile方法加载数据：

```javascript
csv()
    .fromFile(csvFilePath)
    .on("json", (jsonObj) => {
        csvData.push(jsonObj);
    })
    .on("done", () => {
        dressData(); 
        performRegression(); 
    });
```

### 3. 转换数据

导入的数据为json对象数组，我们需要使用**dressData**函数将其转化为两个数据向量**x**和**y**:

```javascript
// 将JSON数据转换为向量数据
function dressData() {
    /**
     * 原始数据中每一行为JSON对象
     * 因此需要将数据转换为向量数据，并将字符串解析为浮点数
     * {
     *   TV: "10",
     *   Radio: "100",
     *   Newspaper: "20",
     *   "Sales": "1000"
     * }
     */
    csvData.forEach((row) => {
        X.push(f(row.Radio));
        y.push(f(row.Sales));
    });
}


// 将字符串解析为浮点数
function f(s) {
    return parseFloat(s);
}
```

### 4. 训练数据并预测

编写**performRegression**函数：

```javascript
// 使用线性回归算法训练数据
function performRegression() {
    regressionModel = new SLR(X, y);
    console.log(regressionModel.toString(3));
    predictOutput();
}
```

**regressionModel**的**toString**方法可以指定参数的精确度。

**predictOutput**函数可以根据输入值输出预测值。

```javascript
// 接收输入数据，然后输出预测值
function predictOutput() {
    rl.question("请输入X用于预测(输入CTRL+C退出) : ", (answer) => {
        console.log(`当X = ${answer}时, 预测值y = ${regressionModel.predict(parseFloat(answer))}`);
        predictOutput();
    });
}
```

**predictOutput**函数使用了Node.js的[Readline](https://nodejs.org/api/readline.html)模块：

```javascript
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout
});
```

### 5. 完整程序

完整的程序**index.js**是这样的：

```javascript
const ml = require("ml-regression");
const csv = require("csvtojson");
const SLR = ml.SLR; // 线性回归

const csvFilePath = "advertising.csv"; // 训练数据
let csvData = [], 
    X = [], 
    y = []; 

let regressionModel;

const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout
});

csv()
    .fromFile(csvFilePath)
    .on("json", (jsonObj) => {
        csvData.push(jsonObj);
    })
    .on("done", () => {
        dressData(); 
        performRegression(); 
    });


// 使用线性回归算法训练数据
function performRegression() {
    regressionModel = new SLR(X, y);
    console.log(regressionModel.toString(3));
    predictOutput();
}


// 将JSON数据转换为向量数据
function dressData() {
    /**
     * 原始数据中每一行为JSON对象
     * 因此需要将数据转换为向量数据，并将字符串解析为浮点数
     * {
     *   TV: "10",
     *   Radio: "100",
     *   Newspaper: "20",
     *   "Sales": "1000"
     * }
     */
    csvData.forEach((row) => {
        X.push(f(row.Radio));
        y.push(f(row.Sales));
    });
}


// 将字符串解析为浮点数
function f(s) {
    return parseFloat(s);
}


// 接收输入数据，然后输出预测值
function predictOutput() {
    rl.question("请输入X用于预测(输入CTRL+C退出) : ", (answer) => {
        console.log(`当X = ${answer}时, 预测值y = ${regressionModel.predict(parseFloat(answer))}`);
        predictOutput();
    });
}
```

执行 `node index.js` ，则输出如下：

```bash
$ node index.js
```

```bash
f(x) = 0.202 * x + 9.31
请输入X用于预测(输入CTRL+C退出) : 151.5
当X = 151.5时, 预测值y =  39.98974927911285
请输入X用于预测(输入CTRL+C退出) :
```

恭喜！你已经使用JavaScript训练了一个线性回归模型，如下：

```bash
f(x) = 0.202 * x + 9.31
```

感兴趣的话，请持续关注 [machine-learning-with-js](https://github.com/abhisheksoni27/machine-learning-with-js)，我将使用JavaScript实现各种机器学习算法。


欢迎加入[我们Fundebug](https://fundebug.com/)的**全栈BUG监控交流群: 622902485**。

<div style="text-align: center;">
<img style="width:30%;" src="https://blog.fundebug.com/images/qq_bug.JPG" />
</div>
