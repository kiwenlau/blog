---

title: Fundebug：JavaScript插件支持过滤特定属性不存在的错误

date: 2018-05-10 10:00:00

tags: [JavaScript, Fundebug]

---

**摘要：** [Fundebug](https://www.fundebug.com/)的JavaScript错误监控插件更新至[0.4.0](https://js.fundebug.cn/fundebug.0.4.0.min.js)，支持过滤特定属性不存在的错误。

<!-- more -->

<div style="text-align: center;">
<img style="width:50%;" src="./fundebug-javascript-0-4-0/update.jpeg" />
</div>

通过配置[filters](https://docs.fundebug.com/notifier/javascript/customize/filters.html)属性，用户可以过滤掉一些不需要捕获的错误，比如[Script error.](../other/script_error.md)

filters只能在JavasScript中配置:

```javascript
fundebug.filters = [
{
    message: /^Script error\.$/
}]
```

之前，filters中的过滤规则仅支持正则表达式，现在可以通过配置"inexistence"值来过滤特定属性不存在的错误。


#### 示例1：过滤status不存在的图片加载错误

```javascript
fundebug.filters = [
{
    target:
    {
        tagName: /^IMG$/,
        status: "inexistence"
    }
}]
```

#### 示例2：过滤status不存在的GET请求错误

```javascript
fundebug.filters = [
{
    req:
    {
    	method: /^GET$/
    },
    res:
    {
        status: "inexistence"
    }
}]
```

另外，0.4.0的插件还支持[错误采样](https://blog.fundebug.com/2018/05/09/fundebug-javascript-0-4-0/)
