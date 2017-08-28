---
title: 聊聊ES7与ES8特性

date: 2017-08-28 10:00:00

tags: [JavaScript, 翻译]

---

**译者按:** 转眼**ES6**发布2年了，是时候了解一下**ES7**与**ES8**特性了！

<!-- more -->

- 原文: [ES7 and ES8 Features](https://node.university/blog/498412/es7-es8)

- 译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译，并且对源代码进行了大量修改。另外，本文版权归原作者所有，翻译仅用于学习。**

我曾写过一篇关于**ES6**博客[《10个最佳ES6特性》](https://blog.fundebug.com/2017/08/21/10-best-es6-feature/)，这次我打算聊聊**ES7**和**ES8**特性。

**ES7**只有2个特性:

- [includes()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)
- 指数操作符

**ES8**尚未发布(2017年1月)，下面是它已经完成起草的一些特性：

- [Object.values()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values)
- [Object.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
- [padStart()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart)
- [padEnd()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd)
- [Object.getOwnPropertyDescriptors()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors)
- 函数参数列表结尾允许逗号
- Async/Await

### Array.prototype.includes()

#### 不使用ES7

使用[indexOf()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)验证数组中是否存在某个元素，这时需要根据返回值是否为**-1**来判断：

```javascript
let arr = ['react', 'angular', 'vue'];

if (arr.indexOf('react') !== -1)
{
    console.log('React存在');
}
```

#### 使用ES7

使用[includes()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)验证数组中是否存在某个元素，这样更加直观简单：

```javascript
let arr = ['react', 'angular', 'vue'];

if (arr.includes('react'))
{
    console.log('React存在');
}
```

### 指数操作符

#### 不使用ES7

使用自定义的递归函数**calculateExponent**或者[Math.pow()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow)进行指数运算：

```javascript
function calculateExponent(base, exponent)
{
    if (exponent === 1)
    {
        return base;
    }
    else
    {
        return base * calculateExponent(base, exponent - 1);
    }
}

console.log(calculateExponent(7, 3)); // 输出343
console.log(Math.pow(7, 3)); // 输出343
```

#### 使用ES7

使用指数运算符******，就像**+**、**-**等操作符一样：

```javascript
console.log(7**3);
```

### Object.values()

#### 不使用ES8

使用[Object.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)遍历对象的属性值，需要通过属性名**key**去获取属性值：

```javascript
let obj = {a: 1, b: 2, c: 3};

Object.keys(obj).forEach((key) =>
{
    console.log(obj[key]); // 输出1, 2, 3
});
```

#### 使用ES8

使用[Object.values()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values)遍历对象的属性值，无需使用使用属性名：

```javascript
let obj = {a: 1, b: 2, c: 3};

Object.values(obj).forEach(value =>
{
    console.log(value); // 输出1, 2, 3
});
```

### Object.entries()

#### 不使用ES8

使用[Object.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)遍历对象的属性名和属性值：

```javascript
let obj = {a: 1, b: 2, c: 3};

Object.keys(obj).forEach((key) =>
{
    console.log(key + ": " + obj[key]); // 输出a: 1, b: 2, c: 3
})
```

#### 使用ES8

使用[Object.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)遍历对象的属性名和属性值：

```javascript
let obj = {a: 1, b: 2, c: 3};

Object.entries(obj).forEach(([key, value]) =>
{
    console.log(key + ": " + value); // 输出a: 1, b: 2, c: 3
})
```

### padStart()

#### 不使用ES8

```javascript
console.log('0.00')         	
console.log('10,000.00')    
console.log('250,000.00')  
```

输出结果如下：

```
0.00
10,000.00
250,000.00
```

#### 使用ES8

使用[padStart()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart)可以在字符串前面填充指定的字符串：

```javascript
console.log('0.00'.padStart(20))         	
console.log('10,000.00'.padStart(20))    
console.log('250,000.00'.padStart(20))    
```

输出结果如下：

```
                0.00
           10,000.00
          250,000.00
```

### padEnd()

#### 不使用ES8

```javascript
console.log('0.00 ' + '0.00' )         	
console.log('10,000.00 ' + '10,000.00' )    
console.log('250,000.00 ' + '250,000.00')  
```

输出如下：

```javascript
0.00 0.00
10,000.00 10,000.00
250,000.00 250,000.00
```

#### 使用ES8

使用[padEnd()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd)可以在字符串后面填充指定的字符串：

```javascript
console.log('0.00'.padEnd(20) + '0.00' )         	
console.log('10,000.00'.padEnd(20) + '10,000.00' )    
console.log('250,000.00'.padEnd(20) + '250,000.00')  
```

输出如下：

```
0.00                0.00
10,000.00           10,000.00
250,000.00          250,000.00
```

### Object.getOwnPropertyDescriptors()

**azatsBooks**对象的定义如下：

```javascript
let azatsBooks = {
    books: ['React Quickly'],
    get latest()
    {
        let numberOfBooks = this.books.length;
        if (numberOfBooks == 0) return undefined;
        return this.books[numberOfBooks - 1];
    }
};
```

#### 不使用ES8

使用[Object.getOwnPropertyDescriptor()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)获取单个属性的属性描述符。

获取**azatsBooks**对象的**books**属性的属性描述符：

```javascript
console.log(Object.getOwnPropertyDescriptor(azatsBooks, 'books'));

/** 输出books属性的属性描述
[object Object] {
  configurable: true,
  enumerable: true,
  value: ["React Quickly"],
  writable: true
}
**/
```

获取**azatsBooks**对象的**lastest**方法的属性描述符：

```javascript
console.log(Object.getOwnPropertyDescriptor(azatsBooks, 'latest'));

/** 输出lastest方法的属性描述
[object Object] {
  configurable: true,
  enumerable: true,
  get: function get latest() {
    let numberOfBooks = this.books.length
    if (numberOfBooks == 0) return undefined
    return this.books[numberOfBooks - 1]
  },
  set: undefined
}
**/
```

#### 使用ES8

[Object.getOwnPropertyDescriptors()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors)相当于[Object.getOwnPropertyDescriptor()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)的复数形式，可以获取对象的所有自身属性的描述符：

```javascript
console.log(Object.getOwnPropertyDescriptors(azatsBooks))

/** 输出azatsBooks对象所有自身属性的属性描述
[object Object] {
  books: [object Object] {
    configurable: true,
    enumerable: true,
    value: ["React Quickly"],
    writable: true
  },
  latest: [object Object] {
    configurable: true,
    enumerable: true,
    get: function get latest() {
      let numberOfBooks = this.books.length
      if (numberOfBooks == 0) return undefined
      return this.books[numberOfBooks - 1]
    },
    set: undefined
  }
}
**/
```

### 函数参数列表结尾允许逗号

#### 不使用ES8

```javascript
var f = function(a,
  b,
  c,
  d // d之后不能带逗号
   ) { 
  console.log(d)
}
```

#### 使用ES8

```javascript
var f = function(a,
  b,
  c,
  d, // d之后允许带逗号
) { 
  console.log(d)
}
```

允许逗号之后，可以避免一些不必要的报错。(如果你希望实时监控JavaScript应用的错误，欢迎免费使用[Fundebug](https://fundebug.com/))

### Async/Await

#### 使用Promise

使用**Promise**写异步代码，会比较麻烦：

```javascript
axios.get(`/q?query=${query}`)
    .then(response => response.data)
    .then(data =>
    {
        this.props.processfetchedData(data);
    })
    .catch(error => console.log(error));
```

#### 使用Async/Await

**Async/Await**使得异步代码看起来像同步代码，这正是它的魔力所在：

```javascript
async fetchData(query) =>
{
    try
    {
        const response = await axios.get(`/q?query=${query}`);
        const data = response.data;
        return data;
    }
    catch (error)
    {
        console.log(error)
    }
}

fetchData(query).then(data =>
{
    this.props.processfetchedData(data)
})
```

Async/Await是写异步代码的新方式，以前的方法有**回调函数**和**Promise**。相比于**Promise**，它更加简洁，并且处理错误、条件语句、中间值都更加方便，因此有望替代**Promise**，成为新一代的一步代码编写方式。对细节感兴趣的话，可以查看[Fundebug]()翻译的[《Async/Await替代Promise的6个理由》](https://blog.fundebug.com/2017/04/04/nodejs-async-await/)。

<div style="text-align: center;">
<img style="width:30%;" src="https://blog.fundebug.com/images/qq_bug.JPG" />
</div>