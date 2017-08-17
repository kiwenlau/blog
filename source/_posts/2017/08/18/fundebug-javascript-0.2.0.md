---
title: Fundebug的JS插件支持过滤BUG

date: 2017-08-18 10:00:00

tags: [Fundebug]

---

**摘要：**[Fundebug](https://fundebug.com/)的JavaScript监控插件更新至**0.2.0**，支持过滤功能，用户可以根据需要配置[filters](https://docs.fundebug.com/notifier/javascript/customize/filters.html)属性，这样Fundebug将不会捕获过滤掉的错误。

<!-- more -->

如果你想监控前端JavaScript应用的错误，[接入Fundebug监控插件](https://docs.fundebug.com/notifier/javascript/integration/)是非常简单的。

```javascript
<script src="https://og6593g2z.qnssl.com/fundebug.0.2.0.min.js" apikey="API-KEY"></script>
```

通过配置**filters**属性，用户可以过滤掉一些不需要捕获的错误，例如烦人的[Script error.](https://docs.fundebug.com/notifier/javascript/other/script_error.html)

filters只能在JavasScript中配置:

```javascript
fundebug.filters = [
{
    message: /^Script error\.$/
}]
```

### 配置规则

filters属性有以下特点：

- 它是一个数组，数组中的元素为**过滤规则**，当错误符合数组中任意一条过滤规则时，则会被过滤
- **过滤规则**是JavaScript对象，该对象的Key为错误的属性名，Value为正则表达式；
- 当错误的属性匹配对应正则表达式时，则会被过滤；


### 配置示例

##### 示例1：过滤name为ReferenceError的错误

```javascript
fundebug.filters = [
{
    name: /^ReferenceError$/
}]
```

##### 示例2：过滤name为ReferenceError，且message中含aler的错误

```javascript
fundebug.filters = [
{
    name: /^ReferenceError$/,
    message: /aler/
}]
```

##### 示例3：过滤method为GET，且status为401的错误

```javascript
fundebug.filters = [
{
    req:
    {
        method: /^GET$/
    },
    res:
    {
        status: /^401$/
    }
}]
```

##### 示例4：配置多条过滤规则

```javascript
fundebug.filters = [
{
    message: /^Script error\.$/
},
{
    req:
    {
        method: /^GET$/
    },
    res:
    {
        status: /^401$/
    }
}]
```

Fundebug可以监控3种不同类型的前端BUG：**JavaScript执行错误**、**资源加载错误**、**HTTP请求错误**，而不同[类型](https://docs.fundebug.com/notifier/javascript/type/)的错误的属性略有不同，具体可以查看[JavaScript执行错误](https://docs.fundebug.com/notifier/javascript/type/javascript.html)、[资源加载错误](https://docs.fundebug.com/notifier/javascript/type/resource.html)以及[HTTP请求错误](https://docs.fundebug.com/notifier/javascript/type/http.html)。