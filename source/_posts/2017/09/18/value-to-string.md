---
title: JS中将变量转为字符串

date: 2017-09-18 10:00:00

tags: [JavaScript, 翻译]

---

**译者按:** 语言的细枝末节了解一下就可以了，不需要太较真，不过如果一点也不知道的话，那就不太妙了。

<!-- more -->

- 原文: [Converting a value to string in JavaScript](http://2ality.com/2012/03/converting-to-string.html)
- 译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译。另外，本文版权归原作者所有，翻译仅用于学习。**

对于JavaScript，有3种不同方法可以将变量转换为字符串。这篇博客将详细介绍这些方法，并比较他们的优劣。

### 3种方法

将变量转换为字符串的3种方法如下：

1. `value.toString()`
2. `"" + value`
3. `String(value)`

当**value**为**null**或者**undefined**时，第1种方法就不行了。而方法2和方法3基本上是一样的。

- `""+value`: 将**value**与**空字符串**相加，即可将其转换为字符串。这种方法其实是一种稍微晦涩的技巧，可能会让别人难于理解开发者的意图。不过，这一点见仁见智，有些人偏爱这种方法。

- `String(value)`: 这种方法非常清晰：使用**String()**函数将**value**转换为字符串。不过，**String()**有两种不同用法，容易混淆，尤其对于**Java**开发者来说。当**String()**和运算符**new**一起作为构造函数使用时，它返回一个新创建的String对象；当不用**new**运算符调用**String()**时，它只把**value**转换成原始的字符串。这两者是非常不同的：

```javascript
> String("Fundebug") === new String("Fundebug")
false

> typeof String("Fundebug")
'string'
> String("Fundebug") instanceof String
false

> typeof new String("Fundebug")
'object'
> new String("Fundebug") instanceof String
true
```

  事实上，将**String()**作为构造函数使用并不常见，因此仅使用它来转换字符串就好了。

### ""+value与String(value)的细微差别

`""+value`与`String(value)`都可以将**value**转换为字符串，它们是如何做到的呢？事实上，它们虽然结果相同，但是方法稍有区别。

#### 将primitive基本类型转换为字符串

两种方法都使用内部函数**ToString()**将**primitive**基本类型转换为字符串。**ToString()**函数在**ECMAScript 5.1 (§9.8)**中定义了，但是并不能直接使用，因此称作内部函数。下面的表格显示了**ToString()**函数如何将**primitive**基本类型转换为字符串：

| 参数          | 结果                      |
| ----------- | ----------------------- |
| `undefined` | `"undefined"`           |
| `null`      | `"null"`                |
| Boolean     | `"true"`或者 `"false"`    |
| Number      | 将数字转换为字符串，例如： `"1.765"` |
| String      | 无需转换                    |

#### 将Object转换为字符串

转换为字符串之前，两种方法都会先将**Object**转换为**primitive**。不同的是，`""+value`使用内部函数**ToPrimitive(Number)**(除了**date**类型)，而`String(value)`使用内部函数**ToPrimitive(String)**。

- ToPrimitive(Number): 先调用**obj.valueOf**，若结果为**primitive**则返回；否则再调用**obj.toString()**，若结果为**primitive**则返回；否则返回**TypeError**。
- ToPrimitive(String): 与**ToPrimitive(Number)**类似，只是先调用**obj.toString()**，后调用**obj.valueOf()**。

可以通过以下示例了解区别，**obj**如下：

```javascript
var obj = {
    valueOf: function()
    {
        console.log("valueOf");
        return {};
    },
    toString: function()
    {
        console.log("toString");
        return {};
    }
};
```

调用结果:

```javascript
> "" + obj
valueOf
toString
TypeError: Cannot convert object to primitive value

> String(obj)
toString
valueOf
TypeError: Cannot convert object to primitive value
```

#### 它们的结果相同

`""+value`与`String(value)`虽然不同，但是我们很少能感觉到。因为，大多数object使用默认的**valueOf()**，它返回对象本身： 

```javascript
> var x = {}
> x.valueOf() === x
true
```

由于**valueOf()**返回值并非**primitive**，因此**ToPrimitive(Number)**会跳过**valueOf()**，而返回**toString()**的返回值。这样，与**ToPrimitive(String)**的返回值就一样了。

当**object**是**Boolean**、**Number**或者**String**实例时，**valueOf()**将返回**primitive**。这就意味着两者的计算过程是这样的：

- ToPrimitive(Number)：`valueOf()`返回**primitive**值，然后使用**ToString()**转换为字符串。
- ToPrimitive(String): `toString()`通过**ToString()**函数将**primitive**值转换为字符串。

可知，虽然计算过程不同，但是它们的结果是一样的。

### 结论

那么你该选择哪种方法呢？如果你可以确保**value**值不是**null**和**undefined**，那么不妨使用`value.toString() `。否则，你只能使用`""+value` 和`String(value)`，它们基本上是一样的。 

### 参考

1. [JavaScript values: not everything is an object](http://2ality.com/2011/03/javascript-values-not-everything-is.html)
2. [What is {} + {} in JavaScript?](http://2ality.com/2012/01/object-plus-object.html) 
3. [String concatenation in JavaScript](http://2ality.com/2011/10/string-concatenation.html) 
4. [JavaScript String 对象](http://www.w3school.com.cn/jsref/jsref_obj_string.asp)
