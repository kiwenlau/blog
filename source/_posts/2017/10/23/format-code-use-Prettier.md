---

title: 我为什么推荐Prettier来统一代码风格

date: 2017-10-23 10:00:00

tags: [JavaScript, 翻译]

---

**译者按: ** 关于代码风格，不同的人有不同的偏好，其实并没有什么绝对的对错。但是，有2条原则应该是对的： 少数服从多数；用工具统一风格。

<!-- more -->


- 原文: [Why robots should format our code for us](https://medium.freecodecamp.org/why-robots-should-format-our-code-159fd06d17f7)
- 译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译。另外，本文版权归原作者所有，翻译仅用于学习。**


我曾经以为，程序员有自己独特的代码风格挺好的。因为，一个成熟的程序员应该清楚，好的代码应该是怎样的。

我的大学教授告诉我，他的学生在用我的代码，因为我的代码风格不一样。我想了一下，也许是因为我的代码至少是有风格的，而其他人的代码一团糟。

### 一些示例

#### 示例1：

读了[The Programmers’ Stone](https://www.datapacrat.com/Opinion/Reciprocality/r0/index.html)之后，我把大括号这样写：

```javascript
if (food === 'pizza')
{
    alert('Pizza ;-)');  
}
else
{  
    alert('Not pizza ;-(');
}
```

但是，我意识到在前端社区里，也许只有我一个人这样写的。而其他人都是这样写的：

```javascript
if (food === 'pizza') {
    alert('Pizza ;-)');  
} else {
    alert('Not pizza ;-(');
}
```

或者这样：

```javascript
if (food === 'pizza') {
    alert('Pizza ;-)');  
}
else {  
    alert('Not pizza ;-(');
}
```

于是，我改变了风格，采用了最后一种写法。

#### 示例2

将多个方法链接起来时，我喜欢这样写：

```javascript
function foo(items) {
  return items
    .filter(item => item.checked)
    .map(item => item.value)
  ;
}
```

#### 示例3

读了[Why you should enforce Dangling Commas for Multiline Statements](https://medium.com/@nikgraf/why-you-should-enforce-dangling-commas-for-multiline-statements-d034c98e36f8)，我意识到了[trailing commas](https://medium.com/@nikgraf/why-you-should-enforce-dangling-commas-for-multiline-statements-d034c98e36f8)写法更加易于重构：

```javascript
const food = [
  'pizza',
  'burger',
  'pasta',
]
```

但是，这种写法非常少见。我审查过的代码中，没人这样写。于是，我只能放弃这种写法，向现实世界低头。

#### 示例4

我还有一个不合群的习惯。在行尾写代码注释之前，我习惯敲2个空格：

```javascript
const volume = 200;  // ml
```

我觉得这样写好看些。但是，这会导致代码不一致，因为其他人只敲一个空格。

### JavaScript开发者是怎样做的

很遗憾，JavaScript没有官方的代码风格。业界有一些[流行的代码风格](http://blog.sapegin.me/all/javascript-code-styles)，比如[Airbnb](http://airbnb.io/javascript/)和[Standard](https://standardjs.com/)。使用它们的话，团队成员之间的代码会更易读。

你也可以使用[ESLint ](https://eslint.org/)来统一风格。但是它并不能保证代码100%一致。比如，ESLint的Airbnb配置，只能统一**示例1**的代码风格，而不能统一后面两者。

### JavaScript开发者应该怎么做？

有一些语言有非常严格的代码风格，并且有工具可以用于统一风格。因此，开发者不需要浪费时间去争论代码风格的优劣。例如，Reason语言的[Refmt](https://reasonml.github.io/guide/what-and-why)，和Rust语言的[Rustfmt](https://github.com/rust-lang-nursery/rustfmt)。

现在，JavaScript终于有了一个[解决方案](http://jlongster.com/A-Prettier-Formatter)。有一个新工具，叫做[Prettier](https://github.com/prettier/prettier)，它运用自身的规则将你的的代码重新格式化。无论你之前的代码风格是怎样。

我们不妨[试用一下Prettier](https://prettier.io/playground)。

输入代码是这样的：

```javascript
if (food === 'pizza')
{
    alert('Pizza ;-)');  
}
else
{  
    alert('Not pizza ;-(');
}

function foo(items) {
  return items
    .filter(item => item.checked)
    .map(item => item.value)
  ;
}

const food = [
  'pizza',
  'burger',
  'pasta',
]
```

Prettier处理之后的代码是这样的：

```javascript
if (food === "pizza") {
  alert("Pizza ;-)");
} else {
  alert("Not pizza ;-(");
}

function foo(items) {
  return items.filter(item => item.checked).map(item => item.value);
}

const food = ["pizza", "burger", "pasta"];

```

也许，你并不喜欢这种风格。比如，我不喜欢else放在大括号后面，也不喜欢把链式方法全部写在同一行。但是，我发现使用**Prettier**有很多益处：

- 几乎不需要做决定，因为 Prettier的配置选项很少。
- 团队成员不需要为规则去争论。
- 开源代码开发者不需要去学习项目的代码风格。
- 不需要去修复ESLint报告的风格问题。
- 保存文件的时候可以自动统一风格。

### 结论

Prettier已经被一些[非常流行的项目](https://github.com/prettier/prettier/issues/1351)比如React和Babel采用了。对于我自己的项目，我已经开始从自己的[个性化风格](https://github.com/tamiadev/eslint-config-tamia)全部转为Prettier风格。相比于Airbnb代码风格，我更推荐Prettier。

刚开始，我会觉得Prettier风格非常差。但是，当我发现自己需要手动去调整代码风格时，我意识到Prettier真的非常好用。

Prettier可以在保存文件的时候可以自动统一风格：

![](https://cdn-images-1.medium.com/max/1600/0*spj1CsmHiP8l4C5h.gif)

感兴趣的话，可以按照这个教程[配置Prettier](https://survivejs.com/maintenance/code-quality/code-formatting/)。


<div style="text-align: center;">
<img style="width:30%;" src="https://blog.fundebug.com/images/qq_bug.JPG" />
</div>