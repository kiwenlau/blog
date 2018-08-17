---
title: JavaScript函数重载

date: 2017-07-24 10:00:00

tags: [JavaScript, 翻译]

---

**译者按:** jQuery之父John Resig巧妙地利用了闭包，实现了JavaScript**函数重载**。

<!-- more -->

原文: [JavaScript Method Overloading](https://johnresig.com/blog/javascript-method-overloading/)

译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译。另外，本文版权归原作者所有，翻译仅用于学习。**

在一个业余项目中，我写了一个简单的**addMethod**函数，用于实现**函数重载(Method Overloading)**。而所谓**函数重载**，就是函数名称一样，但是输入输出不一样。或者说，允许某个函数有各种不同输入，根据不同的输入，调用不同的函数，然后返回不同的结果。

**addMethod**函数如下:

```js
// addMethod - By John Resig (MIT Licensed)
function addMethod(object, name, fn){
    var old = object[ name ];
    object[ name ] = function(){
        if ( fn.length == arguments.length )
            return fn.apply( this, arguments );
        else if ( typeof old == 'function' )
            return old.apply( this, arguments );
    };
}
```

所谓**addMethod**函数，简单的理解，就是给某个**object**，添加一个指定**name**的函数**fn**。它利用了**闭包**，可以通过**old**变量将先后绑定的函数链接起来。

你可以这样使用**addMethod**函数，将**find**函数直接添加到每个对象实例：

```js
function Users(){
  addMethod(this, "find", function(){
    // Find all users...
  });
  addMethod(this, "find", function(name){
    // Find a user by name
  });
  addMethod(this, "find", function(first, last){
    // Find a user by first and last name
  });
}
```

你也可以将**find**函数添加到对象的**prototype**，这样所有对象实例将共享**find**函数:

```js
function Users(){
    addMethod(Users.prototype, "find", function(){
      // Find all users...
    });
    addMethod(Users.prototype, "find", function(name){
      // Find a user by name
    });
    addMethod(Users.prototype, "find", function(first, last){
      // Find a user by first and last name
    });
}
```

**users**对象的**find**方法成功实现了重载，可以根据不同的输入调用不同的函数：

```js
var users = new Users();
users.find(); // Finds all
users.find("John"); // Finds users by name
users.find("John", "Resig"); // Finds users by first and last name
users.find("John", "E", "Resig"); // Does nothing
```

这种方法有一些明显的缺陷:

- 重载只能处理输入参数个数不同的情况，它不能区分参数的类型、名称等其他要素。(ECMAScript 4计划支持这一特性，称作Multimethods，然而该版本已被放弃)。
- 重载过的函数将会有一些额外的负载，对于性能要求比较高的应用，使用这个方法要慎重考虑。

**addMethod**函数的秘诀之一在于**fn.length**。或许很多人并不清楚，所有函数都有一个**length**属性，它的值等于定义函数时的参数个数。比如，当你定义的函数只有1个参数时，其**length**属性为1：

```js
(function(foo){}).length == 1
```

我做了一下测试，发现这个实现**函数重载**的方法适用于所有浏览器，如果有问题的话请与我联系。

如果你担心只绑定单个函数时的性能问题，你可以使用如下**addMethod**函数：

```js
// addMethod - By John Resig (MIT Licensed)
function addMethod(object, name, fn){
    var old = object[ name ];
    if ( old )
        object[ name ] = function(){
            if ( fn.length == arguments.length )
                return fn.apply( this, arguments );
            else if ( typeof old == 'function' )
                return old.apply( this, arguments );
        };
    else
        object[ name ] = fn;
}
```

这样绑定第一个函数时，将不会有额外的操作，既简单又快速。当绑定更多函数时，则与原**addMethod**函数一样，会有额外的性能损失。

这样做还有一个额外的好处：对于那些参数个数不符合要求的函数调用，将统一又第一个绑定的函数处理。这时调用**find**方法的输出如下：

```js
var users = new Users();
users.find(); // Finds all
users.find("John"); // Finds users by name
users.find("John", "Resig"); // Finds users by first and last name
users.find("John", "E", "Resig"); // Finds all
```

本文介绍的方法不能改变世界，但是它很代码量很少、很简单，巧妙地使用了JavaScript的特性。因此，我在我的书《Secrets of the JavaScript Ninja》也介绍了这个方法。

### 完整示例

根据原文介绍的方法，译者实现了一个完整的示例代码：

```javascript
function addMethod(object, name, fn)
{
    var old = object[name];
    object[name] = function()
    {
        if (fn.length == arguments.length)
            return fn.apply(this, arguments);
        else if (typeof old == 'function')
            return old.apply(this, arguments);
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


function Users()
{
    addMethod(Users.prototype, "find", find0);
    addMethod(Users.prototype, "find", find1);
    addMethod(Users.prototype, "find", find2);
}


var users = new Users();
users.names = ["John Resig", "John Russell", "Dean Tom"];


console.log(users.find()); // 输出[ 'John Resig', 'John Russell', 'Dean Tom' ]
console.log(users.find("John")); // 输出[ 'John Resig', 'John Russell' ]
console.log(users.find("John", "Resig")); // 输出[ 'John Resig' ]
console.log(users.find("John", "E", "Resig")); // 输出undefined
```

凭直觉，**函数重载**可以通过**if…else**或者**switch**实现，这就不去管它了。jQuery之父John Resig提出了一个非常巧(bian)妙(tai)的方法，利用了闭包。

从效果上来说，**users**对象的**find**方法允许3种不同的输入: 0个参数时，返回所有人名；1个参数时，根据firstName查找人名并返回；2个参数时，根据完整的名称查找人名并返回。

难点在于，**users.find**事实上只能绑定一个函数，那它为何可以处理3种不同的输入呢？它不可能同时绑定3个函数**find0**,**find1**与**find2**啊！这里的关键在于**old**属性。

由**addMethod**函数的调用顺序可知，**users.find**最终绑定的是**find2**函数。然而，在绑定**find2**时，**old**为**find1**；同理，绑定**find1**时，**old**为**find0**。3个函数**find0**,**find1**与**find2**就这样通过闭包链接起来了。

根据**addMethod**的逻辑，当**fn.length**与**arguments.length**不匹配时，就会去调用**old**，直到匹配为止。
