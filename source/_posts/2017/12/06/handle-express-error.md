---

title: 如何处理Express异常？

date: 2017-12-06 10:00:00

tags: [Node.js, 翻译]

---

**译者按：**根据墨菲定律：“有可能出错的事情，就会出错”。那么，既然代码必然会出错，我们就应该处理好异常。

<!-- more -->


- 原文: [How to handle errors in Express](https://nemethgergely.com/error-handling-express-async-await/)
- 译者：[Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译。另外，本文版权归原作者所有，翻译仅用于学习。**


处理异常是编程非常重要的一点。我们的程序依赖于第三方服务、数据库以及我们的用户，**一切都不可预料**。数据库可能会宕机，第三方服务可能会崩溃，用户可能会使用错误的参数调用我们的接口。

为了处理各种复杂的情况，我们必须处理好代码异常，下面是代码示例：

```javascript
app.get('/users/:id', (req, res) => {
  const userId = req.params.id
  if (!userId) {
    return res.sendStatus(400).json({
      error: 'Missing id'
    })
  }

  Users.get(userId, (err, user) => {
    if (err) {
      return res.sendStatus(500).json(err)
    }

    res.send(users)
  })
})
```

代码中处理了异常，但是存在问题：

- 在多处代码处理异常
- 没有使用Express的异常处理模块来统一处理异常

接下来，我们来一步步优化代码异常处理。

### Express异常处理中间件

所有Express的路由处理函数都有第三个参数**next**，它可以用来调用下一个中间件，也可以将错误传递给错误处理中间件：

```javascript
app.get('/users/:id', (req, res, next) => {
  const userId = req.params.id
  if (!userId) {
    const error = new Error('missing id')
    error.httpStatusCode = 400
    return next(error)
  }

  Users.get(userId, (err, user) => {
    if (err) {
      err.httpStatusCode = 500
      return next(err)
    }

    res.send(users)
  })
})
```

使用**next(err)**，Express就知道出错了，并把这个错误传递给错误处理模块。为了处理这些错误，需要添加一个中间件，它有4个参数：

```javascript
app.use((err, req, res, next) => {
  // log the error...
  res.sendStatus(err.httpStatusCode).json(err)
})
```

这样，我们就可以使用中间件统一处理错误了。但是，现在的代码有些重复：创建错误，指定HTTP状态码，使用next(err)...

*[Fundebug](https://fundebug.com)是全栈JavaScript错误监控平台，支持各种前端和后端框架，可以帮助您第一时间发现BUG！*

### boom

[boom](https://www.npmjs.com/package/boom)是一个兼容HTTP的错误对象，他提供了一些标准的HTTP错误，比如400(参数错误)等。

```javascript
const boom = require('boom')
app.get('/users/:id', (req, res, next) => {
  const userId = req.params.id
  if (!userId) {
    return next(boom.badRequest('missing id'))
  }

  Users.get(userId, (err, user) => {
    if (err) {
      return next(boom.badImplementation(err))
    }

    res.send(users)
  })
})
```

错误处理中间件需要稍作修改：

```javascript
app.use((err, req, res, next) => {
  if (err.isServer) {
    // log the error...
    // probably you don't want to log unauthorized access
    // or do you?
  }
  return res.status(err.output.statusCode).json(err.output.payload);
})
```

### Async/Await错误处理

使用Async/Await之后，可以这样处理Express异常：

- 将中间件使用Promise封装起来，使用catch统一处理异常
- 在中间件中，直接抛出异常就可以了

```javascript
const boom = require('boom');
// wrapper for our async route handlers
// probably you want to move it to a new file
const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    if (!err.isBoom) {
      return next(boom.badImplementation(err));
    }
    next(err);
  });
};
// the async route handler
app.get('/users/:id', asyncMiddleware(async (req, res) => {
  const userId = req.params.id
  if (!userId) {
    throw boom.badRequest('missing id')
  }

  const user = await Users.get(userId)
  res.json(user)
}))
```

### 参考

- 验证HTTP请求参数可以使用[joi](https://www.npmjs.com/package/joi)模块
- 打印日志可以使用[winston](https://www.npmjs.com/package/winston)或者[pino](https://www.npmjs.com/package/pino)模块


<div style="text-align: center;">
<img style="width:30%;" src="https://blog.fundebug.com/images/qq_bug.JPG" />
</div>