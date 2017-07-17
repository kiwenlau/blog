---
title: 10个JavaScript难点

date: 2017-07-17 10:00:00

tags: [JavaScript，翻译]

---

**译者按：**能够读懂这篇博客的JavaScript开发者，运气不会太差...

<!-- more -->

原文: [10 JavaScript concepts every Node.js programmer must master](http://www.infoworld.com/article/3196070/node-js/10-javascript-concepts-nodejs-programmers-must-master.html)

译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译，并且对示例代码进行了大量修改。另外，本文版权归原作者所有，翻译仅用于学习。**

### 1. 立即执行函数

**立即执行函数**，即Immediately Invoked Function Expression (IIFE)，正如它的名字，就是创建函数的同时立即执行。它没有绑定任何事件，也无需等待任何异步操作：

```javascript
(function() {
     // 代码
     // ...
})();
```

**function(){…}**是一个匿名函数，包围它的一对括号将其转换为一个表达式，紧跟其后的一对括号调用了这个函数。**立即执行函数**也可以理解为立即调用一个匿名函数。**立即执行函数**最常见的应用场景就是：将var变量的作用域限制于你们函数内，这样可以避免命名冲突。

### 2. 闭包

对于闭包(closure)，当外部函数返回之后，内部函数依然可以访问外部函数的变量。

```javascript
function f1()
{
    var N = 0; // N是f1函数的局部变量
    
    function f2() // f2是f1函数的内部函数，是闭包
    {
        N += 1; // 内部函数f2中使用了外部函数f1中的变量N
        console.log(N);
    }

    return f2;
}

var result = f1();

result(); // 输出1
result(); // 输出2
result(); // 输出3
```

代码中，外部函数**f1**只执行了一次，变量**N**设为**0**，并将内部函数**f2**赋值给了变量**result**。由于外部函数**f1**已经执行完毕，其内部变量**N**应该在内存中被清除，然而事实并不是这样：我们每次调用**result**的时候，发现变量**N**一直在内存中，并且在累加。为什么呢？这就是闭包的神奇之处了！

### 3. 使用闭包定义私有变量

通常，JavaScript开发者使用下划线作为私有变量的前缀。但是实际上，这些变量依然可以被访问和修改，并非真正的私有变量。这时，使用闭包可以定义真正的私有变量：

```javascript
function Product() {

	var name;

    this.setName = function(value) {
        name = value;
    };

    this.getName = function() {
        return name;
    };
}

var p = new Product();
p.setName("Fundebug");

console.log(p.name); // 输出undefined
console.log(p.getName()); // 输出Fundebug
```

代码中，对象**p**的的**name**属性为私有属性，使用**p.name**不能直接访问。

### 4. prototype

每个JavaScript构造函数都有一个**prototype**属性，用于设置所有实例对象需要共享的属性和方法。**prototype**属性不能枚举。JavaScript仅支持通过**prototype**属性进行继承属性和方法。

```javascript
function Rectangle(x, y)
{
    this._length = x;
    this._breadth = y;
}

Rectangle.prototype.getDimensions = function()
{
    return {
        length: this._length,
        breadth: this._breadth
    };
};

var x = new Rectangle(3, 4);
var y = new Rectangle(4, 3);

console.log(x.getDimensions()); // { length: 3, breadth: 4 }
console.log(y.getDimensions()); // { length: 4, breadth: 3 }
```

代码中，**x**和**y**都是构造函数**Rectangle**创建的对象实例，它们通过prototype继承了getDimensions方法。

### 5. 模块化

JavaScript并非模块化编程语言，至少ES6落地之前都不是。然而对于一个复杂的Web应用，模块化编程是一个最基本的要求。这时，可以使用**立即执行函数**来实现模块化，正如很多JS库比如[jQuery](https://github.com/jquery/jquery)以及我们[Fundebug](https://fundebug.com/)都是这样实现的。

```javascript
var module = (function() {
    var N = 5;

    function print(x) {
        console.log("The result is: " + x);
    }

    function add(a) {
        var x = a + N;
        print(x);
    }

    return {
        description: "This is description",
        add: add
    };
})();


console.log(module.description); // 输出"this is description" 

module.add(5); // 输出“The result is: 10”
```

所谓模块化，就是根据需要控制模块内属性与方法的可访问性，即私有或者公开。在代码中，module为一个独立的模块，**N**为其私有属性，**print**为其私有方法，**decription**为其公有属性，**add**为其共有方法。

### 6. 变量提升

JavaScript会将所有变量和函数声明移动到它的作用域的最前面，这就是所谓的**变量提升(Hoisting)**。也就是说，无论你在什么地方声明变量和函数，解释器都会将它们移动到作用域的最前面。因此我们可以先使用变量和函数，而后声明它们。

但是，仅仅是变量声明被提升了，而变量赋值不会被提升。如果你不明白这一点，有时则会出错：

```javascript
console.log(y);  // 输出undefined

y = 2; // 初始化y
```

上面的代码等价于下面的代码：

```javascript
var y;  // 声明y

console.log(y);  // 输出undefined

y = 2; // 初始化y
```

为了避免BUG，开发者应该在每个作用域开始时声明变量和函数。

### 7. 柯里化

柯里化，即**Currying**，可以是函数变得更加灵活。我们可以一次性传入多个参数调用它；也可以只传入一部分参数来调用它，让它返回一个函数去处理剩下的参数。

```javascript
var add = function(x) {
    return function(y) {
        return x + y;
    };
};

console.log(add(1)(1)); // 输出2

var add1 = add(1);
console.log(add1(1)); // 输出2

var add10 = add(10);
console.log(add10(1)); // 输出11
```

代码中，我们可以一次性传入2个1作为参数**add(1)(1)**，也可以传入1个参数之后获取**add1**与**add10**函数，这样使用起来非常灵活。

### 8. apply, call与bind方法

JavaScript开发者有必要理解**apply**、**call**与**bind**方法的不同点。它们的共同点是第一个参数都是**this**，即函数运行时依赖的上下文。

三者之中，**call**方法是最简单的，它等价于指定**this**值调用函数：

```javascript
var user = {
    name: "Rahul Mhatre",
    whatIsYourName: function() {
        console.log(this.name);
    }
};

user.whatIsYourName(); // 输出"Rahul Mhatre",

var user2 = {
    name: "Neha Sampat"
};

user.whatIsYourName.call(user2); // 输出"Neha Sampat"
```

**apply**方法与**call**方法类似。两者唯一的不同点在于，**apply**方法使用数组指定参数，而**call**方法每个参数单独需要指定：

- **apply(thisArg, [argsArray])**
- **call(thisArg, arg1, arg2, …)**

```javascript
var user = {
    greet: "Hello!",
    greetUser: function(userName) {
        console.log(this.greet + " " + userName);
    }
};

var greet1 = {
    greet: "Hola"
};

user.greetUser.call(greet1, "Rahul"); // 输出"Hola Rahul"
user.greetUser.apply(greet1, ["Rahul"]); // 输出"Hola Rahul"
```

使用**bind**方法，可以为函数绑定**this**值，然后作为一个新的函数返回：

```javascript
var user = {
     greet: "Hello!",
     greetUser: function(userName) {
     console.log(this.greet + " " + userName);
     }
};

var greetHola = user.greetUser.bind({greet: "Hola"});
var greetBonjour = user.greetUser.bind({greet: "Bonjour"});

greetHola("Rahul") // 输出"Hola Rahul"
greetBonjour("Rahul") // 输出"Bonjour Rahul"
```

### 9. Memoization

**Memoization**用于优化比较耗时的计算，通过将计算结果缓存到内存中，这样对于同样的输入值，下次只需要中内存中读取结果。

```javascript
function memoizeFunction(func)
{
    var cache = {};
    return function()
    {
        var key = arguments[0];
        if (cache[key])
        {
            return cache[key];
        }
        else
        {
            var val = func.apply(this, arguments);
            cache[key] = val;
            return val;
        }
    };
}


var fibonacci = memoizeFunction(function(n)
{
    return (n === 0 || n === 1) ? n : fibonacci(n - 1) + fibonacci(n - 2);
});

console.log(fibonacci(100)); // 输出354224848179262000000
console.log(fibonacci(100)); // 输出354224848179262000000
```

代码中，第2次计算**fibonacci(100)**则只需要在内存中直接读取结果。

### 10. 函数重载

所谓**函数重载(method overloading)**，就是函数名称一样，但是输入输出不一样。或者说，允许某个函数有各种不同输入，根据不同的输入，返回不同的结果。凭直觉，**函数重载**可以通过**if...else**或者**switch**实现，这就不去管它了。jQuery之父John Resig提出了一个非常巧(bian)妙(tai)的方法，利用了闭包。

从效果上来说，**people**对象的**find**方法允许3种不同的输入: 0个参数时，返回所有人名；1个参数时，根据firstName查找人名并返回；2个参数时，根据完整的名称查找人名并返回。

难点在于，**people.find**只能绑定一个函数，那它为何可以处理3种不同的输入呢？它不可能同时绑定3个函数**find0**,**find1**与**find2**啊！这里的关键在于**old**属性。

由**addMethod**函数的调用顺序可知，**people.find**最终绑定的是**find2**函数。然而，在绑定**find2**时，**old**为**find1**；同理，绑定**find1**时，**old**为**find0**。3个函数**find0**,**find1**与**find2**就这样通过闭包链接起来了。

根据**addMethod**的逻辑，当**f.length**与**arguments.length**不匹配时，就会去调用**old**，直到匹配为止。

```javascript
function addMethod(object, name, f)
{　　
    var old = object[name];　　
    object[name] = function()
    {
        // f.length为函数定义时的参数个数
        // arguments.length为函数调用时的参数个数　　　　
        if (f.length === arguments.length)
        {　　
            return f.apply(this, arguments);　　　　
        }
        else if (typeof old === "function")
        {
            return old.apply(this, arguments);　　　　
        }　　
    };
}


// 不传参数时，返回所有name
function find0()
{　　
    return this.names;
}


// 传一个参数时，返回firstName匹配的name
function find1(firstName)
{　　
    var result = [];　　
    for (var i = 0; i < this.names.length; i++)
    {　　　　
        if (this.names[i].indexOf(firstName) === 0)
        {　　　　　　
            result.push(this.names[i]);　　　　
        }　　
    }　　
    return result;
}


// 传两个参数时，返回firstName和lastName都匹配的name
function find2(firstName, lastName)
{　
    var result = [];　　
    for (var i = 0; i < this.names.length; i++)
    {　　　　
        if (this.names[i] === (firstName + " " + lastName))
        {　　　　　　
            result.push(this.names[i]);　　　　
        }　　
    }　　
    return result;
}


var people = {　　
    names: ["Dean Edwards", "Alex Russell", "Dean Tom"]
};


addMethod(people, "find", find0);
addMethod(people, "find", find1);
addMethod(people, "find", find2);


console.log(people.find()); // 输出["Dean Edwards", "Alex Russell", "Dean Tom"]
console.log(people.find("Dean")); // 输出["Dean Edwards", "Dean Tom"]
console.log(people.find("Dean", "Edwards")); // 输出["Dean Edwards"]
```

### 参考链接

- [闭包 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)
- [JavaScript闭包-块级作用域和私有变量](http://www.htmleaf.com/ziliaoku/qianduanjiaocheng/201512282961.html)
- [Javascript继承机制的设计思想 - 阮一峰](http://www.ruanyifeng.com/blog/2011/06/designing_ideas_of_inheritance_mechanism_in_javascript.html)
- [变量提升 - MDN](https://developer.mozilla.org/zh-CN/docs/Glossary/Hoisting)
- [JS函数式编程指南](https://www.gitbook.com/book/llh911001/mostly-adequate-guide-chinese/details)
- [浅谈JavaScript函数重载](http://www.cnblogs.com/yugege/p/5539020.html)

<div style="text-align: center;">
<img style="width:30%;" src="https://blog.fundebug.com/images/qq_bug.JPG" />
</div>





