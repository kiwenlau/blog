---
title: 用GitHub Issue取代多说，是不是很厉害？

date: 2017-06-16 10:00:00

tags: [Hexo, 原创]

---

**摘要:** 别了，多说，拥抱[Gitment](https://github.com/imsun/gitment)。

<!-- more -->

2017年6月1日，多说正式下线，这多少让人感觉有些遗憾。在比较了多个博客评论系统，我最终选择了[Gitment](https://github.com/imsun/gitment)作为本站的博客评论系统：

- UI简洁，适合我的博客风格
- 使用GitHub账号登陆，适合技术博客
- 使用GitHub Issues写评论，符合程序员的习惯

### 1. [注册OAuth Application](https://github.com/settings/applications/new)

因为Gitment使用了GitHub的服务，因此需要注册OAuth application。其中，**Authorization callback URL**必须填写博客的域名(我填的是[http://kiwenlau.com/](http://kiwenlau.com/))。注册成功之后将获取**Client ID**与**Client Secret**，后面将会用到。

### 2. 加载Gitment的CSS与JS文件

下载[gitment.css](https://imsun.github.io/gitment/style/default.css)与[gitment.js](https://imsun.github.io/gitment/dist/gitment.browser.js)，分别放入主题目录的**source/css**与**source/js**目录中

在**layout/partial/head.ejs**中添加

```html
<!-- 加载gitment的css和js文件 -->
<link rel="stylesheet" href="/css/gitment.css"> 
<script src="/js/gitment.js"></script> 
```

### 3. 配置Gitment

添加**layout/partial/gitment.ejs**

```html
<div id="gitment"></div>

<!-- 主页不要加载gitment -->
<% if (!index){ %>

<script>
var gitment = new Gitment({
  owner: 'kiwenlau',
  repo: 'blog',
  oauth: {
    client_id: '619731e02d908157a502',
    client_secret: '79d021512d492496a0729177b9acd807c579b1b6',
  },
})
gitment.render('gitment')
</script>
 
<% } %>
```

- **client_id**与**client_secret**为第1步注册OAuth Application所获取的**Client ID**与**Client Secret**
- **owner**为你的GitHub账户名
- **repo**为你保存评论的GitHub仓库名称，所有的评论将保存在该仓库的Issues

在**layout/partial/article.ejs**中添加:

```html
<%- partial('gitment') %>
```

### 4. 初始化Gitment

部署之后，就可以在博客页面的下方看到评论框。登陆GitHub账号之后，就可以对评论进行初始化，这样就可以开始写评论了。

每一篇博客的评论，对应于GitHub仓库一个issue。但是这些issue是不存在的，因此需要通过初始化Gitment去创建issue。这一点比较麻烦，因为对于每一篇博客都需要进行初始化。

实现细节可以参考我的博客源码[blog](https://github.com/kiwenlau/blog)，我们博客评论保存在这个仓库的[Issues](https://github.com/kiwenlau/blog/issues)


### 参考链接

[Gitment：使用 GitHub Issues 搭建评论系统](https://imsun.net/posts/gitment-introduction/)



