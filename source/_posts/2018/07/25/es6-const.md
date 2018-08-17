---

title: 万万没想到！ES6的const并非一定为常量

date: 2018-07-25 10:00:00

tags: [翻译, JavaScript]

keywords: ES6, const

description: const定义的变量一定为常量吗？No!

---

**摘要：** const定义的变量一定为常量吗？No!

<!-- more -->

- **原文**：[ES2015 const is not about immutability](https://mathiasbynens.be/notes/es6-const)
- **作者**: [Mathias Bynens](https://github.com/mathiasbynens): Google V8引擎开发者
- **译者**：[Fundebug](https://www.fundebug.com/)

对于ES6的const变量，大家一直存在误会，这篇博客将试着解开真相。

### const的本质

**const定义的变量并非常量，并非不可变**。使用const定义的对象或者数组，其实是可变的。下面的代码并不会报错：

```javascript
const foo = {};
foo.name = "Fundebug";
console.log(foo.name); // 打印"Fundebug"
```

为什么会这样？下面引用大神阮一峰的[ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/let#%E6%9C%AC%E8%B4%A8)

> const实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，const只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了。因此，将一个对象声明为常量必须非常小心。

因此，当我们使用[赋值运算符](https://tc39.github.io/ecma262/#sec-assignment-operators), [一元运算符](https://tc39.github.io/ecma262/#sec-unary-operators)以及[后缀运算符](https://tc39.github.io/ecma262/#sec-postfix-increment-operator)对const变量进行修改时，会出现**"TypeError：Assignment to constant variable"**报错：

```javascript
const foo = 27;

// 下面任意一个表达式都会报错：TypeError: Assignment to constant variable.
foo = 42; 
foo *= 42;
foo /= 42;
foo %= 42;
foo += 42;
foo -= 42;
foo <<= 0b101010;
foo >>= 0b101010;
foo >>>= 0b101010;
foo &= 0b101010;
foo ^= 0b101010;
foo |= 0b101010;


--foo;
++foo;


foo--;
foo++;
```

*如果你需要监控线上应用的BUG的话，欢迎免费试用[Fundebug](https://www.fundebug.com/)。*

### 如何定义常量？

对于数值、字符串和布尔值变量，使用const定义的话是不可变的：

```javascript
const name = "Fundebug";
name = "云麒"; // 报错：TypeError: Assignment to constant variable.
```

使用[Object.freeze()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)可以让对象不可变，这个API从ES5开始就有了。

```javascript
const foo = Object.freeze(
{
    'name': "Fundebug"
});

foo.name = "云麒"; // 严格模式("use strict")下报错：Uncaught TypeError: Cannot assign to read only property 'bar' of object '#<Object>'

console.log(foo.name); // 非严格模式下打印"Fundebug"
```

注意，Object.freeze()是有局限性的，对象中嵌套对象仍然可以被修改。MDN提供了一下[deepFreeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)示例代码，是利用Object.freeze()实现的，可以让嵌套对象也不可变。

另外，Object.freeze()仅对键值对有效。对于Date, Map和Set，目前还没有相应方法。因此有人[提议](https://github.com/sebmarkbage/ecmascript-immutable-data-structures)在ECMAScript标准中添加不可变的Map和Set等数据类型。


### const和let如何选择？

const和let的唯一区别在于，const可以让数值、字符串和布尔变量不可变。

以上所说的内容都是事实，下面我想表达一下自己的观点。

const可以提高代码的可读性，因为const定义的数值、字符串和布尔变量是不可变的，而const定义的对象始终指向同一个对象。而使用let时，不能保证这些。因此，对于let和const，我们应该这样选择：

- 默认使用const
- 仅当变量需要修改时使用let
- 不要使用var

你是否同意我的观点呢？欢迎大家交流讨论~


### 参考

- [阮一峰 - ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/let#%E6%9C%AC%E8%B4%A8)

