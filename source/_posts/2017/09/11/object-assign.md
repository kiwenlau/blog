---

title: ES6之Object.assign()详解

date: 2017-09-11 10:00:00

tags: [JavaScript, 翻译]

---

**译者按: ** 这篇博客将介绍ES6新增的Object.assign()方法。

<!-- more -->


- 原文: [ECMAScript 6: merging objects via Object.assign()](http://2ality.com/2014/01/object-assign.html)
- 译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译。另外，本文版权归原作者所有，翻译仅用于学习。**

将A对象的属性复制给B对象，这是JavaScript编程中很常见的操作。这篇博客将介绍**ES6**的**Object.assign()**属性，可以用于对象复制。

在JavaScript生态系统中，对象复制有另外一个术语: **extend**。下面是两个JS库提供的**extend**接口：

- Prototype: [Object.extend(destination, source)](http://prototypejs.org/doc/latest/language/Object/extend/)
- Underscore.js: [_.extend(destination, *sources)](http://underscorejs.org/#extend)

### Object.assign()介绍

**ES6**提供了**Object.assign()**，用于合并/复制对象的属性。

```javascript
Object.assign(target, source_1, ..., source_n)
```

它会修改**target**对象，然后将它返回：先将**source_1**对象的所有可枚举属性复制给**target**，然后依次复制**source_1**等的属性。

#### 1. 属性名可以为字符串或者Symbol

在**ES6**中，对象的属性名可以是字符串或者Symbol。因为Symbol值具有唯一性，这就意味着Symbol作为对象的属性名时，可以保证不会出现同名的属性。对象属性名为字符串或者Symbol时，**Object.assign()**都支持。

#### 2. 属性复制通过赋值实现

**target**对象的属性是通过复制来创建的，这就意味着，如果**target**有**setters**方法时，它们将会被调用。

另一种方案是通过**定义**来实现，这样将会创建新的自有属性，不会调用**setters**方法。其实，另一个版本的**Object.assign()**的提案正是采用这种方法。不过，这个提议在ES6中被拒绝了，也许之后的版本会再考虑。

### Object.assign()使用示例

#### 1. 初始化对象属性

构造器正是为了初始化对象的属性，通常，我们不得不多次重复属性的名字。示例代码的**constructor**中，**x**与**y**均重复了两次：

```javascript
class Point
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
}
```

如果可以的话，个人偏爱将所有冗余都省去。(事实上，**CoffeeScript**与**TypeScript**都有语法解决构造器中属性名重复的问题。)：

```javascript
class Point
{
    constructor(this.x, this.y){}
}
```

至少，**Object.assign()**可以帮助我们减少一些重复：

```javascript
class Point
{
    constructor(x, y)
    {
        Object.assign(this, { x, y });
    }
}
```

 在**ES6**中, `{ x, y }`为`{ x: x, y: y }`的缩写。

#### 2. 为对象添加方法

ECMAScript 5, you use a function expression to add a method to an object:

在**ES5**中，需要使用**function**关键字定义对象的新增方法：

```javascript
MyClass.prototype.foo = function(arg1, arg2)
{
    //...
};
```

在**ES6**中，对象方法的定义更加简洁，不需要使用**function**关键字。这时，可以使用**Object.assign()**为对象新增方法：

```javascript
Object.assign(MyClass.prototype,
{
    foo(arg1, arg2)
    {
        //...
    }
});
```

#### 3. 复制对象

使用**Object.assign()**深度复制对象，包括其**prototype**

```javascript
var Point = function(x)
{
    this.x = x;
}

Point.prototype.y = 2;

var obj = new Point(1);

var copy = Object.assign({ __proto__: obj.__proto__ }, obj); // 输出{x:1,y:2} 

console.log(copy) // 输出{x:1,y:2} 
```

仅复制自身属性：

```javascript
var Point = function(x)
{
    this.x = x;
}

Point.prototype.y = 2;

var obj = new Point(1);

var copy = Object.assign({}, obj); 

console.log(copy) // 输出{x:1} 
```

### 参考

- [Object properties in JavaScript](http://2ality.com/2012/10/javascript-properties.html)
- [Properties in JavaScript: definition versus assignment](http://2ality.com/2012/08/property-definition-assignment.html)
- [Callable entities in ECMAScript 6](http://2ality.com/2013/08/es6-callables.html)
