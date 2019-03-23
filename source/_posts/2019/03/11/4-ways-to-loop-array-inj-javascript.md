---
title: JavaScript 的 4 种数组遍历方法： for VS forEach() VS for/in VS for/of

date: 2019-03-11 10:00:00

tags: [翻译, JavaScript]

keywords: JavaScript, for, forEach, for in, for of

description: JavaScript 的 4 种数组遍历方法： for VS forEach() VS for/in VS for/of
---

**译者按：** JS 骚操作。

<!-- more -->

-   原文：[For vs forEach() vs for/in vs for/of in JavaScript](http://thecodebarbarian.com/for-vs-for-each-vs-for-in-vs-for-of-in-javascript.html)
-   译者: [Fundebug](https://www.fundebug.com/)

**本文采用意译，版权归原作者所有**

我们有多种方法来遍历 JavaScript 的数组或者对象，而它们之间的区别非常让人[疑惑](https://stackoverflow.com/questions/9329446/for-each-over-an-array-in-javascript)。[Airbnb 编码风格](http://airbnb.io/javascript/#iterators--nope)禁止使用 for/in 与 for/of，你知道为什么吗？

这篇文章将详细介绍以下 4 种循环语法的区别：

-   `for (let i = 0; i < arr.length; ++i)`
-   `arr.forEach((v, i) => { /* ... */ })`
-   `for (let i in arr)`
-   `for (const v of arr)`

### 语法

使用`for`和`for/in`，我们可以访问数组的下标，而不是实际的数组元素值：

```javascript
for (let i = 0; i < arr.length; ++i) {
    console.log(arr[i]);
}

for (let i in arr) {
    console.log(arr[i]);
}
```

使用`for/of`，则可以直接访问数组的元素值：

```javascript
for (const v of arr) {
    console.log(v);
}
```

使用`forEach()`，则可以同时访问数组的下标与元素值：

```javascript
arr.forEach((v, i) => console.log(v));
```

### 非数字属性

JavaScript 的数组就是 Object，这就意味着我们可以给数组添加字符串属性：

```javascript
const arr = ["a", "b", "c"];

typeof arr; // 'object'

arr.test = "bad"; // 添加非数字属性

arr.test; // 'abc'
arr[1] === arr["1"]; // true, JavaScript数组只是特殊的Object
```

4 种循环语法，只有`for/in`不会忽略非数字属性：

```javascript
const arr = ["a", "b", "c"];
arr.test = "bad";

for (let i in arr) {
    console.log(arr[i]); // 打印"a, b, c, bad"
}
```

正因为如此，[使用`for/in`遍历数组并不好](https://stackoverflow.com/questions/500504/why-is-using-for-in-with-array-iteration-a-bad-idea)。

其他 3 种循环语法，都会忽略非数字属性：

```javascript
const arr = ["a", "b", "c"];
arr.test = "abc";

// 打印 "a, b, c"
for (let i = 0; i < arr.length; ++i) {
    console.log(arr[i]);
}

// 打印 "a, b, c"
arr.forEach((el, i) => console.log(i, el));

// 打印 "a, b, c"
for (const el of arr) {
    console.log(el);
}
```

**要点：** 避免使用`for/in`来遍历数组，除非你真的要想要遍历非数字属性。可以使用 ESLint 的[guard-for-in](https://eslint.org/docs/rules/guard-for-in)规则来禁止使用`for/in`。

### 数组的空元素

JavaScript 数组可以有[空元素](https://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript)。以下代码语法是正确的，且数组长度为 3：

```javascript
const arr = ["a", , "c"];

arr.length; // 3
```

让人更加不解的一点是，循环语句处理`['a',, 'c']`与`['a', undefined, 'c']`的方式并不相同。

对于`['a',, 'c']`，`for/in`与`forEach`会跳过空元素，而`for`与`for/of`则不会跳过。

```javascript
// 打印"a, undefined, c"
for (let i = 0; i < arr.length; ++i) {
    console.log(arr[i]);
}

// 打印"a, c"
arr.forEach(v => console.log(v));

// 打印"a, c"
for (let i in arr) {
    console.log(arr[i]);
}

// 打印"a, undefined, c"
for (const v of arr) {
    console.log(v);
}
```

对于`['a', undefined, 'c']`，4 种循环语法一致，打印的都是"a, undefined, c"。

还有一种添加空元素的方式：

```javascript
// 等价于`['a', 'b', 'c',, 'e']`
const arr = ["a", "b", "c"];
arr[5] = "e";
```

还有一点，JSON 也不支持空元素：

```javascript
JSON.parse('{"arr":["a","b","c"]}');
// { arr: [ 'a', 'b', 'c' ] }

JSON.parse('{"arr":["a",null,"c"]}');
// { arr: [ 'a', null, 'c' ] }

JSON.parse('{"arr":["a",,"c"]}');
// SyntaxError: Unexpected token , in JSON at position 12
```

**要点：** `for/in`与`forEach`会跳过空元素，数组中的空元素被称为["holes"](http://2ality.com/2013/07/array-iteration-holes.html)。如果你想避免这个问题，可以考虑禁用`forEach`:

```yml
parserOptions:
    ecmaVersion: 2018
rules:
    no-restricted-syntax:
        - error
        - selector: CallExpression[callee.property.name="forEach"]
          message: Do not use `forEach()`, use `for/of` instead
```

### 函数的 this

`for`，`for/in`与`for/of`会保留外部作用域的`this`。

对于`forEach`， 除非使用箭头函数，它的回调函数的 this 将会变化。

使用 Node v11.8.0 测试下面的代码，结果如下：

```javascript
"use strict";

const arr = ["a"];

arr.forEach(function() {
    console.log(this); // 打印undefined
});

arr.forEach(() => {
    console.log(this); // 打印{}
});
```

**要点：** 使用 ESLint 的[`no-arrow-callback`](https://eslint.org/docs/rules/prefer-arrow-callback)规则要求所有回调函数必须使用箭头函数。

### Async/Await 与 Generators

还有一点，`forEach()`不能与 Async/Await 及 Generators 很好的"合作"。

不能在`forEach`回调函数中使用 await：

```javascript
async function run() {
  const arr = ['a', 'b', 'c'];
  arr.forEach(el => {
    // SyntaxError
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(el);
  });
}
```

不能在`forEach`回调函数中使用 yield：

```javascript
function* run() {
  const arr = ['a', 'b', 'c'];
  arr.forEach(el => {
    // SyntaxError
    yield new Promise(resolve => setTimeout(resolve, 1000));
    console.log(el);
  });
}
```

对于`for/of`来说，则没有这个问题:

```javascript
async function asyncFn() {
    const arr = ["a", "b", "c"];
    for (const el of arr) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(el);
    }
}

function* generatorFn() {
    const arr = ["a", "b", "c"];
    for (const el of arr) {
        yield new Promise(resolve => setTimeout(resolve, 1000));
        console.log(el);
    }
}
```

当然，你如果将`forEach()`的回调函数定义为 async 函数就不会报错了，但是，如果你想让`forEach`[按照顺序执行](https://thecodebarbarian.com/basic-functional-programming-with-async-await.html)，则会比较头疼。

下面的代码会按照从大到小打印 0-9：

```javascript
async function print(n) {
    // 打印0之前等待1秒，打印1之前等待0.9秒
    await new Promise(resolve => setTimeout(() => resolve(), 1000 - n * 100));
    console.log(n);
}

async function test() {
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(print);
}

test();
```

**要点：** 尽量不要在`forEach`中使用 aysnc/await 以及 generators。

### 结论

简单地说，`for/of`是遍历数组最可靠的方式，它比`for`循环简洁，并且没有`for/in`和`forEach()`那么多奇怪的特例。`for/of`的缺点是我们取索引值不方便，而且不能这样链式调用`forEach()`. `forEach()`。

使用`for/of`获取数组索引，可以这样写：

```javascript
for (const [i, v] of arr.entries()) {
    console.log(i, v);
}
```

### 参考

-   [For-each over an array in JavaScript?](https://stackoverflow.com/questions/9329446/for-each-over-an-array-in-javascript)
-   [Why is using “for…in” with array iteration a bad idea?](https://stackoverflow.com/questions/500504/why-is-using-for-in-with-array-iteration-a-bad-idea)
-   [Array iteration and holes in JavaScript](http://2ality.com/2013/07/array-iteration-holes.html)
