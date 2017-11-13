---

title: 试过不用循环语句撸代码吗？

date: 2017-11-13 10:00:00

tags: [JavaScript, 翻译]

---

**译者按：** 通过使用数组的[reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce?v=b)、[filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)以及[map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)方法来避免循环语句。

<!-- more -->


- 原文: [Coding Tip: Try to Code Without Loops](https://medium.com/@samerbuna/coding-tip-try-to-code-without-loops-18694cf06428)
- 译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译。另外，本文版权归原作者所有，翻译仅用于学习。**

在前一篇[博客](https://blog.fundebug.com/2017/11/06/write-javascript-without-if/)，我们介绍了，如果不使用if语句的话，如何解决一些简单的编程问题。那么，这次我们不妨试试，在不使用循环语句的情况下，如何编程呢？

### 示例1: 数组元素求和

数组如下:

```javascript
const arrayOfNumbers = [17, -4, 3.2, 8.9, -1.3, 0, Math.PI];
```

#### 使用循环语句

```javascript
let sum = 0;

arrayOfNumbers.forEach((number) => {
  sum += number;
});

console.log(sum);
```

可知，我们需要通过修改**sum**变量，来计算结果。

#### 不用循环语句

使用[reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce?v=b)方法时，就可以避免使用循环语句了：

```javascript
const sum = arrayOfNumbers.reduce((acc, number) =>
  acc + number
);

console.log(sum);
```

实现递归，同样可以避免使用循环语句：

```javascript
const sum = ([number, ...rest]) => {
  if (rest.length === 0) { 
    return number;
  }
  return number + sum(rest);
};

console.log(sum(arrayOfNumbers))
```

可知，代码中巧妙地使用了一个ES6语法 - [扩展运算符](http://es6.ruanyifeng.com/#docs/array#扩展运算符)。**rest**代表了除去第一个元素之后的剩余数组，它的元素个数会随着一层层递归而减小直至为0，这样就满足了递归结束的条件。这种写法非常机智，但是在我看来，可读性并没有使用reduce方法那么好。

### 示例2: 将数组中的字符串拼接成句子

数组如下，我们需要过滤掉非字符串元素：

```javascript
const dataArray = [0, 'H', {}, 'e', Math.PI, 'l', 'l', 2/9, 'o!'];
```

目标结果是“*Hello!*”.

#### 使用循环语句

```javascript
let string = '', i = 0;

while (dataArray[i] !== undefined) {
  if (typeof dataArray[i] === 'string') {
    string += dataArray[i];
  }
  i += 1;
}

console.log(string);
```

#### 不用循环语句

使用[filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)和[join](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)方法的话，可以避免使用循环语句：

```javascript
const string = dataArray.filter(e => typeof e === 'string').join('');

console.log(string);
```

可知，使用[filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)方法还帮助我们省掉了if语句。

**广而告之：** *如果你需要监控线上JavaScript代码的错误的话，欢迎免费使用[Fundebug](https://fundebug.com/)!*

### 示例3: 将数组元素变换为对象

数组元素为一些书名，需要将它们转换为对象，并为每一个对象添加ID：

```javascript
const booksArray = [
  'Clean Code',
  'Code Complete',
  'Introduction to Algorithms',
];
```

目标结果如下：

```javascript
newArray = [
  { id: 1, title: 'Clean Code' },
  { id: 2, title: 'Code Complete' },
  { id: 3, title: 'Introduction to Algorithms' },
];
```

### 使用循环语句

```javascript
const newArray = [];
let counter = 1;

for (let title of booksArray) {
  newArray.push({
    id: counter,
    title,
  });

  counter += 1;
}

console.log(newArray);
```

### 不用循环语句

使用[map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)方法的话，可以避免使用循环语句：

```javascript
const newArray = booksArray.map((title, index) => ({ 
  id: index + 1, 
  title 
}));

console.log(newArray);
```

### 总结

<div style="text-align: center;">
<img style="width:60%;" src="write-javascript-without-loop/01.jpg" />
</div>

不难发现，我是通过使用数组的[reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce?v=b)、[filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)以及[map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)方法来避免循环语句的，这是我的个人偏好。使用它们，可以帮助我们做很多有意思的事情。上面的图片来自[Steven Luscher](https://twitter.com/steveluscher)，它们形象的表现了这3个方法的功能。


<div style="text-align: center;">
<img style="width:30%;" src="https://blog.fundebug.com/images/qq_bug.JPG" />
</div>