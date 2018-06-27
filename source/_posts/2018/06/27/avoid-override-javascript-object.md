---

title: 如何禁止JavaScript对象重写？

date: 2018-06-27 10:00:00

tags: [JavaScript, 翻译]

keywords: JavaScript, 错误监控

description: 使用Object.preventExtensions()、Object.seal()和Object.freeze()，可以禁止重写JavaScript对象。

---

**译者按：** 使用Object.preventExtensions()、Object.seal()和Object.freeze()，可以禁止重写JavaScript对象。

<!-- more -->

- 译者：[Fundebug](https://www.fundebug.com/)
- 原文：[Preventing modification of JavaScript objects](http://piotrwalat.net/preventing-javascript-object-modification/)


由于JavaScript的灵活性，我们可以轻易地**重写(override)**一些于其他人定义的**对象(object)**。换句话说，任何人都可以重写我们所定义的对象。这是一个非常强大的特性，许多开发者都有兴趣试试，来拓展或者修改某些对象的行为。例如，DOM方法[document.getElementById()](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById)都可以被重写。一般来讲，我们应该避免这样做，因为这会导致代码很难维护，并且会留下一些难于发现的[BUG](https://www.fundebug.com/)。ECMAScript 5引入了一些方法，允许开发者限制对象重写。如果你在开发一些工具库比如[jQuery](https://jquery.com/), [fundebug](https://www.fundebug.com/)等， 或者你的开发团队非常大，本文介绍的这些方法将非常有用。

### 不要重写他人的对象

不要重写他人的对象，这是JavaScript的黄金法则。比如，当你重写了一个方法，则很可能这会影响依赖于该方法的库，这会让其他开发者非常困惑。

```javascript
// 示例代码1
window.originalAlert = window.alert;  
window.alert = function(msg) {  
    if (typeof msg === "string") {
        return console.log(msg);
    }
    return window.originalAlert(msg);
};

alert('ooh so awesome'); // 参数为字符串时，打印到控制台 
alert(3.14); // 参数为其他类型时，弹出对话框
```

在**示例代码1**中，我修改了[windows.alert](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/alert)：参数为字符串时，打印到控制台；参数为其他类型时，弹出对话框。这样的修改显然会影响其他使用alert方法的开发者。如果你修改的是DOM对象比如getElementById()，这会导致非常严重的后果。

如果你只是为对象添加新的方法，这也会导致问题。

```javascript
// 示例代码2
Math.cube = function(n) {  
    return Math.pow(n, 3);
};
console.log(Math.cube(2)); // 8
```

这样做最大的问题是有可能在未来导致命名冲突。尽管Math对象目前并没有cube方法，下一个版本的JavaScript标准也许会增加cube方法(当然可能性不大)，这就意味着我们会把原生cube方法给替代了。有一个真实的案例，[Prototype](http://prototypejs.org/doc/1.6.0/element/getElementsByClassName.html)库定义了[document.getElementsByClassName()](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/getElementsByClassName)方法，而这个方法后来被加入了JavaScript标准。

不幸的是，我们无法阻止其他开发者重写我们定义的对象，这时我们就需要本文介绍的这些方法了：

首先，我们不妨通过一个表格对比一下Object.preventExtensions()、Object.seal()和Object.freeze()：

方法                       | 禁止增加属性 | 禁止删除属性 | 禁止修改属性
-------------------------- | ------------ | ------------ | ------------
Object.preventExtensions() | 是           | 否           | 否
Object.seal()              | 是           | 是           | 否
Object.freeze()            | 是           | 是           | 是

###  [Object.preventExtensions()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)

使用**Object.preventExtensions()**，可以禁止给对象添加新的方法或者属性。注意，修改或者删除对象已经存在的方法或者属性是没有问题的。使用[Object.isExtensible()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible)可以查看某个对象是否可以增加方法或者属性。

```javascript
// 示例代码3
var song = {  
    title: 'Hope Leaves',
    artist: 'Opeth'
};


console.log(Object.isExtensible(song)); //true  
Object.preventExtensions(song);  
console.log(Object.isExtensible(song)); //false  


song.album = 'Damnation';
console.log(song.album);  // undefined


song.play = function() {  
    console.log('ahh soo awesome');
};
song.play(); // TypeError: song.play is not a function
```

由**示例代码3**可知，执行Object.preventExtensions()之后，为song对象新增album以及play方法都失败了！

但是，当我们为song新增属性或者方法时，并没有报错。当我们使用了"use strict"采用严格模式时，情况就不一样了：

```
// 示例代码4
"use strict";

var song = {  
    title: 'Hope Leaves',
    artist: 'Opeth'
};

Object.preventExtensions(song);  

song.album = 'Damnation'; // Uncaught TypeError: Cannot add property album, object is not extensible
```

在严格模式下，给已经Object.preventExtensions的对象新增属性时，会立即报错。*广告：如果你希望实时监控应用中类似的错误，欢迎免费试用[Fundebug](https://www.fundebug.com/)*。

### [Object.seal()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)

使用**Object.seal()**，可以禁止给对象添加属性或者方法(这一点与Object.preventExtension()的作用一致)，同时禁止删除对象已经存在的属性或者方法。

```javascript
// 示例代码5
"use strict"
var song = {
    title: 'Hope Leaves',
    artist: 'Opeth'
};

Object.seal(song);
console.log(Object.isExtensible(song)); //false  
console.log(Object.isSealed(song)); //true  

song.album = 'Damnation'; // Uncaught TypeError: Cannot add property album, object is not extensible
delete song.artist; // Uncaught TypeError: Cannot delete property 'artist' of #<Object>
```

### [Object.freeze()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)

使用**Object.freeze()**，可以禁止为对象增加属性或者方法(这一点与Object.preventExtension()的作用一致)，同时禁止删除对象已经存在的属性或者方法（这一点与Object.seal()的作用一致），另外还禁止修改已经存在的属性或者方法。

```javascript
// 示例代码6
"use strict"
var song = {
    title: 'Hope Leaves',
    artist: 'Opeth',
    getLongTitle: function()
    {
        return this.artist + " - " + this.title;
    }
};

Object.freeze(song);

console.log(Object.isExtensible(song)); // false  
console.log(Object.isSealed(song)); // true  
console.log(Object.isFrozen(song)); // true  

song.album = 'Damnation'; // Uncaught TypeError: Cannot add property album, object is not extensible  
delete song.artist; // Uncaught TypeError: Cannot delete property 'artist' of #<Object> 
song.getLongTitle = function() // Uncaught TypeError: Cannot assign to read only property 'getLongTitle' of object '#<Object>'
{
    return "foobar";
};
```


主流浏览器的最新版本都支持这些方法：

-  IE 9+
-  Firefox 4+
-  Safari 5.1+
-  Chrome 7+
-  Opera 12+

<div style="text-align: center;">
<img style="width:30%;" src="https://blog.fundebug.com/images/qq_bug.JPG" />
</div>

