---

title: JavaScript正则表达式进阶指南

date: 2018-05-02 10:00:00

tags: [JavaScript]

---

**摘要：**正则表达式是程序员的必备技能，想不想多学几招呢？


<!-- more -->


<div style="text-align: center;">
<img style="width:70%;" src="advanced_regular_expression/regular_expression.png" />
</div>

本文用JavaScript的[exec](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec)方法来测试正则表达式。

例如，正则表达式**/F.*g/**会匹配“以F开头，以g结尾的字符串”，因此可以匹配"Hello, Fundebug!"中的**[Fundebug](https://www.fundebug.com/)**，exec方法会返回一个数组，其第一个元素为所匹配的子字符串。

```javascript
/F.*g/.exec("Hello, Fundebug!")[0]
// 'Fundebug'
```

### 非贪婪匹配

默认情况下，正则表达式的量词***、+、？、{}**，都是进行贪婪匹配，即**匹配尽可能多的字符**。

例如，正则表达式**/.+\s/**匹配的是“以空格符结尾的字符串”，我们用它来匹配苹果公司创始人乔布斯在斯坦福大学演讲的名言“You time is limited, so don’t waste it living someone else’s life.”：

```javascript
/.+\s/.exec("You time is limited, so don’t waste it living someone else’s life.")[0]
// 'You time is limited, so don’t waste it living someone else’s '
```

**.**可以匹配任意字符，而**+**表示匹配1次或者多次，且是贪婪的，因此**/.+\s/**匹配到了最后一个空格符才结束。

当我们在量词***、+、？、{}**后面紧跟着一个**?**，就可以实现非贪婪匹配，即**匹配尽量少的字符**。

例如，正则表达式**/.+?\s/**匹配到第一个空格符就会结束：

```javascript
/.+?\s/.exec("You time is limited, so don’t waste it living someone else’s life.")[0]
// 'You '
```

### 正向肯定查找

使用正则表达式**[x(?=y)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions#special-lookahead)**，可以**匹配'x'仅仅当'x'后面跟着'y'**。这话有点绕，简单地说，就是**匹配后面是y的x**，这里的x和y都代表正则表达式。

例如，对于博客[RabbitMQ入门教程](https://blog.fundebug.com/2018/04/20/rabbitmq_tutorial/)的地址"https://blog.fundebug.com/2018/04/20/rabbitmq_tutorial/"，如果需要匹配出域名fundebug的话，可以使用**/[a-z]+(?=\.com)/**，匹配“在.com前面的英文单词”

```javascript
/[a-z]+(?=\.com)/.exec("https://blog.fundebug.com/2018/04/20/rabbitmq_tutorial/")[0]
// 'fundebug'
```

*广告：欢迎免费试用[Fundebug](https://www.fundebug.com/)，为您监控线上代码的BUG，提高用户体验~*

### 正向否定查找

与正向肯定查找所对应的是正向否定查找，使用正则表达式**[x(?!y)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions#special-negated-look-ahead)**，可以"匹配'x'仅仅当'x'后面不跟着'y'"。

例如，小学生都知道的圆周率是**3.1415926**，不会的同学可以这样记“山顶上有一座寺庙，寺庙里面有一壶酒，还有一块肉”。如何匹配小数点后面的数字呢？可以使用**/\d+(?!\\.)/**，匹配"后面没有小数点的数字"：

```javascript
/\d+(?!\.)/.exec("3.1415926")[0]
// '1415926'
```

而使用之前提到的正向肯定查找，就可以匹配小数点前面的数字：

```javascript
/\d+(?=\.)/.exec("3.1415926")[0]
// '3'
```

### 多行匹配

下面是鲍勃·迪伦的《Forever Young》歌词：

```tex
May God bless and keep you always,
may your wishes all come true,
may you always do for others
and let others do for you.
may you build a ladder to the stars
and climb on every rung,
may you stay forever young,
forever young, forever young,
May you stay forever young.
```

如何匹配以forever开头的那句歌词forever young, forever young呢？

这样写**/^forever.+/**是错误的：

```javascript
/^forever.+/.exec("May God bless and keep you always,\nmay your wishes all come true,\nmay you always do for others\nand let others do for you.\nmay you build a ladder to the stars\nand climb on every rung,\nmay you stay forever young,\nforever young, forever young,\nMay you stay forever young.")
// null
```

为什么错了？因为**^**匹配的整个字符串的开始，而是不是每一行的开始。

正则表达式指定**m**选项，即可支持多行匹配，这时**^**和**$**匹配的是每一行的开始和结束，因此正确的正则表达式是**/^forever.+/m**：

```javascript
/^forever.+/m.exec("May God bless and keep you always,\nmay your wishes all come true,\nmay you always do for others\nand let others do for you.\nmay you build a ladder to the stars\nand climb on every rung,\nmay you stay forever young,\nforever young, forever young,\nMay you stay forever young.")[0]
// 'forever young, forever young,'
```

### 捕获括号

在正则表达式中使用小括号()，可以提取出字符串中的特定子串。

例如，[Fundebug](https://www.fundebug.com/)是在2016年双11[正式上线](https://blog.fundebug.com/2016/11/11/fundebug-is-online/)的，时间是"2016-11-11"，如何提取其中的年、月、日呢？如下：

```javascript
/(\d{4})-(\d{2})-(\d{2})/.exec("2016-11-11")
// [ '2016-11-11', '2016', '11', '11', index: 0, input: '2016-11-11' ]
```

可知，3个小括号中的正则表达式分别匹配的是年月日，其结果依次为exec返回数组中的1到3号元素。



### 参考

- [MDN：正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)
