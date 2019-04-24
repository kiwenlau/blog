---
title: JavaScript 新语法详解：Class 的私有属性与私有方法

date: 2019-04-23 10:00:00

tags: [JavaScript]

keywords: JavaScript, 私有属性, 私有方法, private field, private method, Class

description: JavaScript 新语法详解：Class 的私有属性与私有方法
---

**译者按：** 为什么偏要用**#**符号?

<!-- more -->

-   **原文**：[JavaScript's new #private class fields](https://jamie.build/javascripts-new-private-class-fields.html)
-   **译者**：[Fundebug](https://www.fundebug.com/)

**本文采用意译，版权归原作者所有**

[proposal-class-fields](https://github.com/tc39/proposal-class-fields)与[proposal-private-methods](https://github.com/tc39/proposal-private-methods)定义了 Class 的私有属性以及私有方法，这 2 个提案已经处于 Stage 3，这就意味着它们已经基本确定下来了，等待被加入到新的 ECMAScript 版本中。事实上，最新的 Chrome 已经支持了 Class 私有属性。

那么，对于 Class 的私有属性与私有方法，它们究竟是什么呢？它们是怎样工作的？为什么要使用**#**符号来定义呢？

Class 的私有属性语法如下：

```javascript
class Point {
    #x;
    #y;

    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }

    equals(point) {
        return this.#x === point.#x && this.#y === point.#y;
    }
}
```

我们可以将其语法理解为 2 个部分：

-   定义 Class 私有属性
-   引用 Class 私有属性

### 定义 Class 私有属性

私有属性与公共属性的定义方式几乎是一样的，只是需要在属性名称前面添加**#**符号：

```javascript
class Foo {
    publicFieldName = 1;
    #privateFieldName = 2;
}
```

定义私有属性的时候也可以不用赋值：

```javascript
class Foo {
    #privateFieldName;
}
```

### 引用 Class 私有属性

引用私有属性也只需要使用**#**就好了。

```javascript
class Foo {
    publicFieldName = 1;
    #privateFieldName = 2;
    add() {
        return this.publicFieldName + this.#privateFieldName;
    }
}
```

其中，**this.#**可以简化，去掉 this 也没问题，下面两种写法是等价的：

```javascript
method() {
  #privateFieldName;
}
```

```javascript
method() {
  this.#privateFieldName;
}
```

### 在 Class 定义中引用 Class 实例的私有属性

对于私有属性，我们是不可以直接通过 Class 实例来引用的，这也是私有属性的本来含义。但是有一种情况除外，在 Class 定义中，我们可以引用 Class 实例的私有属性：

```javascript
class Foo {
    #privateValue = 42;
    static getPrivateValue(foo) {
        return foo.#privateValue;
    }
}

Foo.getPrivateValue(new Foo()); // >> 42
```

其中，**foo**是**Foo**的实例，在 Class 定义中，我们可以通过 foo 来引用私有属性**#privateValue**。

### Class 的私有方法

Class 的私有属性是提案[proposal-class-fields](https://github.com/tc39/proposal-class-fields)的一部分，这个提案只关注 Class 的属性，它并没有对 Class 的方法进行任何修改。而 Class 的私有方法是提案[proposal-class-fields](https://github.com/tc39/proposal-class-fields)的一部分。

Class 的私有方法语法如下：

```javascript
class Foo {
    constructor() {
        this.#method();
    }
    #method() {
        // ...
    }
}
```

我们也可以将函数赋值给私有属性：

```javascript
class Foo {
    constructor() {
        this.#method();
    }

    #method = () => {
        // ...
    };
}
```

### 封装(隐藏)私有属性

我们不能直接通过 Class 实例引用私有属性，我们只能在 Class 定义中引用它们：

```javascript
class Foo {
  #bar;
  method() {
    this.#bar; // Works
  }
}
let foo = new Foo();
foo.#bar; // Invalid!
```

另外，要做到真正的**私有**的话，我们应该无法检测这个私有属性是否存在，因此，我们需要允许定义同名的公共属性：

```javascript
class Foo {
    bar = 1; // public bar
    #bar = 2; // private bar
}
```

如果我们不允许公共属性与私有属性同名，我们则可以通过给同名的公共属性复制监测该私有属性是否存在：

```javascript
foo.bar = 1; // Error: `bar` is private! (报错，说明私有属性存在)
```

不报错也行：

```javascript
foo.bar = 1;
foo.bar; // `undefined` (赋值失败，说明私有属性存在)
```

对于 subclass 应该同样如此，它也允许公共属性与私有属性同名：

```javascript
class Foo {
    #fieldName = 1;
}

class Bar extends Foo {
    fieldName = 2; // Works!
}
```

关于 Class 私有属性的封装，可以参考[Why is encapsulation a goal of this proposal?](https://github.com/tc39/proposal-private-fields/blob/master/FAQ.md#why-is-encapsulation-a-goal-of-this-proposal)。

### 为什么使用**#**符号？

很多人都有一个疑问，为什么 JS 不能学习其他语言，使用**private**来定义私有属性和私有方法？为什么要使用奇怪的**#**符号？

使用 private 的话，代码要舒服很多：

```javascript
class Foo {
  private value;

  equals(foo) {
    return this.value === foo.value;
  }
}
```

### 为什么不使用 private 来定义私有属性?

很多语言使用 private 来定义私用属性，如下：

```javascript
class EnterpriseFoo {
  public bar;
  private baz;
  method() {
    this.bar;
    this.baz;
  }
}
```

对于这些语言属性，私用属性和公共属性的引用方式是相同的，因此他们可以使用 private 来定义私有属性。

但是，对于 JavaScript 来说，我们不能使用 this.field 来引用私有属性（我接下来会解释原因），我们需要在语法层面上区分私有属性和公共属性。在定义和引用私有属性的时候，使用**#**符号，私有属性与公共属性可以很好地区分开来。

### 为什么引用私有属性的时候需要**#**符号?

引用私有属性的时候，我们需要**this.#field**，而不是**this.field**，原因如下：

-   因为我们需要封装私有属性，我们需要允许公共属性与私有属性同名，因此私有属性与公共属性的引用方式必须不一样。这一点我们在前文已经详述。

-   公共属性可以通过**this.field**以及**this['field']**来引用，但是私有属性不能支持**this['field']**这种方式，否则会破坏私有属性的隐私性，示例如下：

```javascript
class Dict extends null {
    #data = something_secret;
    add(key, value) {
        this[key] = value;
    }
    get(key) {
        return this[key];
    }
}

new Dict().get("#data"); // 返回私有属性
```

因此，私有属性与公共属性的引用方式必须不一样，否则会破坏**this['field']**语法。

-   私有属性与公共属性的引用方式一样的话，会导致我们每次都需要去检查属性是公共的还是私有的，这会造成严重的性能问题。

这篇文章遵循[Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/)。

### 参考

-   [Why is encapsulation a goal of this proposal?](https://github.com/tc39/proposal-private-fields/blob/master/FAQ.md#why-is-encapsulation-a-goal-of-this-proposal)
