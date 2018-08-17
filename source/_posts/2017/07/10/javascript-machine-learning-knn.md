---
title: JavaScript机器学习之KNN算法

date: 2017-07-10 10:00:00

tags: [JavaScript, 翻译]

---

**译者按:** 机器学习原来很简单啊，不妨动手试试！

<!-- more -->

原文: [Machine Learning with JavaScript : Part 2](https://hackernoon.com/machine-learning-with-javascript-part-2-da994c17d483)

译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译。另外，本文版权归原作者所有，翻译仅用于学习。另外，我们修正了原文代码中的错误**

<div style="text-align: center;">
<img style="width:81.8%;" src="javascript-machine-learning-knn/knn.png" />
</div>

上图使用[plot.ly](http://plot.ly/)所画。

上次我们用JavaScript实现了[线性规划](https://blog.fundebug.com/2017/07/03/javascript-machine-learning-regression/)，这次我们来聊聊KNN算法。

KNN是**k-Nearest-Neighbours**的缩写，它是一种监督学习算法。KNN算法可以用来做分类，也可以用来解决回归问题。

GitHub仓库： [machine-learning-with-js](https://github.com/abhisheksoni27/machine-learning-with-js)

#### KNN算法简介

简单地说，**KNN算法由那离自己最近的K个点来投票决定待分类数据归为哪一类**。

如果待分类的数据有这些邻近数据，*NY*: **7**, *NJ*: **0**, *IN*: **4**，即它有7个**NY**邻居，0个**NJ**邻居，4个**IN**邻居，则这个数据应该归类为**NY**。

假设你在邮局工作，你的任务是为邮递员分配信件，目标是最小化到各个社区的投递旅程。不妨假设一共有7个街区。这就是一个实际的分类问题。你需要将这些信件分类，决定它属于哪个社区，比如**上东城**、**曼哈顿下城**等。

最坏的方案是随意分配信件分配给邮递员，这样每个邮递员会拿到各个社区的信件。

最佳的方案是根据信件地址进行分类，这样每个邮递员只需要负责邻近社区的信件。

也许你是这样想的："将邻近3个街区的信件分配给同一个邮递员"。这时，邻近街区的个数就是**k**。你可以不断增加**k**，直到获得最佳的分配方案。这个**k**就是分类问题的最佳值。

### KNN代码实现

像[上次](https://blog.fundebug.com/2017/07/03/javascript-machine-learning-regression/)一样，我们将使用[mljs](https://github.com/mljs)的**KNN**模块[ml-knn](https://github.com/mljs/knn)来实现。

每一个机器学习算法都需要数据，这次我将使用**IRIS数据集**。其数据集包含了150个样本，都属于[鸢尾属](https://zh.wikipedia.org/wiki/%E9%B8%A2%E5%B0%BE%E5%B1%9E)下的三个亚属，分别是[山鸢尾](https://zh.wikipedia.org/wiki/%E5%B1%B1%E9%B8%A2%E5%B0%BE)、[变色鸢尾](https://zh.wikipedia.org/wiki/%E5%8F%98%E8%89%B2%E9%B8%A2%E5%B0%BE)和[维吉尼亚鸢尾](https://zh.wikipedia.org/w/index.php?title=%E7%BB%B4%E5%90%89%E5%B0%BC%E4%BA%9A%E9%B8%A2%E5%B0%BE&action=edit&redlink=1)。四个特征被用作样本的定量分析，它们分别是[花萼](https://zh.wikipedia.org/wiki/%E8%8A%B1%E8%90%BC)和[花瓣](https://zh.wikipedia.org/wiki/%E8%8A%B1%E7%93%A3)的长度和宽度。

### 1. 安装模块

```
$ npm install ml-knn@2.0.0 csvtojson prompt
```

[ml-knn](https://github.com/mljs/knn): **k-Nearest-Neighbours**模块，不同版本的接口可能不同，这篇博客使用了2.0.0

[csvtojson](https://github.com/Keyang/node-csvtojson): 用于将CSV数据转换为JSON

[prompt](https://github.com/flatiron/prompt): 在控制台输入输出数据

### 2. 初始化并导入数据

**[IRIS数据集](https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data)**由加州大学欧文分校提供。

```bash
curl https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data > iris.csv
```

假设你已经初始化了一个NPM项目，请在**index.js**中输入以下内容：

```javascript
const KNN = require('ml-knn');
const csv = require('csvtojson');
const prompt = require('prompt');

var knn;

const csvFilePath = 'iris.csv'; // 数据集
const names = ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth', 'type'];

let seperationSize; // 分割训练和测试数据

let data = [],
    X = [],
    y = [];

let trainingSetX = [],
    trainingSetY = [],
    testSetX = [],
    testSetY = [];
```

- **seperationSize**用于分割数据和测试数据

使用csvtojson模块的fromFile方法加载数据：

```javascript
csv(
    {
        noheader: true,
        headers: names
    })
    .fromFile(csvFilePath)
    .on('json', (jsonObj) =>
    {
        data.push(jsonObj); // 将数据集转换为JS对象数组
    })
    .on('done', (error) =>
    {
        seperationSize = 0.7 * data.length;
        data = shuffleArray(data);
        dressData();
    });
```

我们将**seperationSize**设为样本数目的0.7倍。注意，如果训练数据集太小的话，分类效果将变差。

由于数据集是根据种类排序的，所以需要使用**shuffleArray**函数对数据进行混淆，这样才能方便分割出训练数据。这个函数的定义请参考StackOverflow的提问[How to randomize (shuffle) a JavaScript array?](https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array):

```javascript
function shuffleArray(array)
{
    for (var i = array.length - 1; i > 0; i--)
    {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
```

### 3. 转换数据

数据集中每一条数据可以转换为一个JS对象：

```
{
 sepalLength: ‘5.1’,
 sepalWidth: ‘3.5’,
 petalLength: ‘1.4’,
 petalWidth: ‘0.2’,
 type: ‘Iris-setosa’ 
}
```

在使用**KNN**算法训练数据之前，需要对数据进行这些处理：

1. 将属性(sepalLength, sepalWidth,petalLength,petalWidth)由字符串转换为浮点数. (**parseFloat**)
2. 将分类 (type)用数字表示

```javascript
function dressData()
{
    let types = new Set(); 
    data.forEach((row) =>
    {
        types.add(row.type);
    });
    let typesArray = [...types]; 

    data.forEach((row) =>
    {
        let rowArray, typeNumber;
        rowArray = Object.keys(row).map(key => parseFloat(row[key])).slice(0, 4);
        typeNumber = typesArray.indexOf(row.type); // Convert type(String) to type(Number)

        X.push(rowArray);
        y.push(typeNumber);
    });

    trainingSetX = X.slice(0, seperationSize);
    trainingSetY = y.slice(0, seperationSize);
    testSetX = X.slice(seperationSize);
    testSetY = y.slice(seperationSize);

    train();
}
```

### 4. 训练数据并测试

```javascript
function train()
{
    knn = new KNN(trainingSetX, trainingSetY,
    {
        k: 7
    });
    test();
}
```

**train**方法需要2个必须的参数: 输入数据，即[花萼](https://zh.wikipedia.org/wiki/%E8%8A%B1%E8%90%BC)和[花瓣](https://zh.wikipedia.org/wiki/%E8%8A%B1%E7%93%A3)的长度和宽度；实际分类，即[山鸢尾](https://zh.wikipedia.org/wiki/%E5%B1%B1%E9%B8%A2%E5%B0%BE)、[变色鸢尾](https://zh.wikipedia.org/wiki/%E5%8F%98%E8%89%B2%E9%B8%A2%E5%B0%BE)和[维吉尼亚鸢尾](https://zh.wikipedia.org/w/index.php?title=%E7%BB%B4%E5%90%89%E5%B0%BC%E4%BA%9A%E9%B8%A2%E5%B0%BE&action=edit&redlink=1)。另外，第三个参数是可选的，用于提供调整**KNN**算法的内部参数。我将**k**参数设为7，其默认值为5。

训练好模型之后，就可以使用测试数据来检查准确性了。我们主要对预测出错的个数比较感兴趣。

```javascript
function test()
{
    const result = knn.predict(testSetX);
    const testSetLength = testSetX.length;
    const predictionError = error(result, testSetY);
    console.log(`Test Set Size = ${testSetLength} and number of Misclassifications = ${predictionError}`);
    predict();
}
```

比较预测值与真实值，就可以得到出错个数：

```javascript
function error(predicted, expected)
{
    let misclassifications = 0;
    for (var index = 0; index < predicted.length; index++)
    {
        if (predicted[index] !== expected[index])
        {
            misclassifications++;
        }
    }
    return misclassifications;
}
```

### 5. 进行预测(可选)

任意输入属性值，就可以得到预测值

```javascript
function predict()
{
    let temp = [];
    prompt.start();
    prompt.get(['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'], function(err, result)
    {
        if (!err)
        {
            for (var key in result)
            {
                temp.push(parseFloat(result[key]));
            }
            console.log(`With ${temp} -- type =  ${knn.predict(temp)}`);
        }
    });
}
```

### 6. 完整程序

完整的程序**index.js**是这样的：

```javascript
const KNN = require('ml-knn');
const csv = require('csvtojson');
const prompt = require('prompt');

var knn;

const csvFilePath = 'iris.csv'; // 数据集
const names = ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth', 'type'];

let seperationSize; // 分割训练和测试数据

let data = [],
    X = [],
    y = [];

let trainingSetX = [],
    trainingSetY = [],
    testSetX = [],
    testSetY = [];


csv(
    {
        noheader: true,
        headers: names
    })
    .fromFile(csvFilePath)
    .on('json', (jsonObj) =>
    {
        data.push(jsonObj); // 将数据集转换为JS对象数组
    })
    .on('done', (error) =>
    {
        seperationSize = 0.7 * data.length;
        data = shuffleArray(data);
        dressData();
    });

function dressData()
{
    let types = new Set(); 
    data.forEach((row) =>
    {
        types.add(row.type);
    });
    let typesArray = [...types]; 

    data.forEach((row) =>
    {
        let rowArray, typeNumber;
        rowArray = Object.keys(row).map(key => parseFloat(row[key])).slice(0, 4);
        typeNumber = typesArray.indexOf(row.type); // Convert type(String) to type(Number)

        X.push(rowArray);
        y.push(typeNumber);
    });

    trainingSetX = X.slice(0, seperationSize);
    trainingSetY = y.slice(0, seperationSize);
    testSetX = X.slice(seperationSize);
    testSetY = y.slice(seperationSize);

    train();
}


// 使用KNN算法训练数据
function train()
{
    knn = new KNN(trainingSetX, trainingSetY,
    {
        k: 7
    });
    test();
}


// 测试训练的模型
function test()
{
    const result = knn.predict(testSetX);
    const testSetLength = testSetX.length;
    const predictionError = error(result, testSetY);
    console.log(`Test Set Size = ${testSetLength} and number of Misclassifications = ${predictionError}`);
    predict();
}


// 计算出错个数
function error(predicted, expected)
{
    let misclassifications = 0;
    for (var index = 0; index < predicted.length; index++)
    {
        if (predicted[index] !== expected[index])
        {
            misclassifications++;
        }
    }
    return misclassifications;
}


// 根据输入预测结果
function predict()
{
    let temp = [];
    prompt.start();
    prompt.get(['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'], function(err, result)
    {
        if (!err)
        {
            for (var key in result)
            {
                temp.push(parseFloat(result[key]));
            }
            console.log(`With ${temp} -- type =  ${knn.predict(temp)}`);
        }
    });
}


// 混淆数据集的顺序
function shuffleArray(array)
{
    for (var i = array.length - 1; i > 0; i--)
    {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
```

在控制台执行**node index.js**

```
$ node index.js
```

输出如下：

```
Test Set Size = 45 and number of Misclassifications = 2
prompt: Sepal Length:  1.7
prompt: Sepal Width:  2.5
prompt: Petal Length:  0.5
prompt: Petal Width:  3.4
With 1.7,2.5,0.5,3.4 -- type =  2
```

### 参考链接

- [K NEAREST NEIGHBOR 算法](http://coolshell.cn/articles/8052.html)
- [安德森鸢尾花卉数据集](https://zh.wikipedia.org/wiki/%E5%AE%89%E5%BE%B7%E6%A3%AE%E9%B8%A2%E5%B0%BE%E8%8A%B1%E5%8D%89%E6%95%B0%E6%8D%AE%E9%9B%86)