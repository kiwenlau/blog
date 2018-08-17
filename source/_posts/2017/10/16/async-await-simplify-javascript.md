---

title: Async/Await是这样简化JavaScript代码的

date: 2017-10-16 10:00:00

tags: [JavaScript, 翻译]

---

**译者按：** 在[Async/Await替代Promise的6个理由](https://blog.fundebug.com/2017/04/04/nodejs-async-await/)中，我们比较了两种不同的异步编程方法：**Async/Await**和**Promise**，这篇博客将通过示例代码介绍**Async/Await**是如何简化JavaScript代码的。

<!-- more -->


- 原文: [ASYNC/AWAIT WILL MAKE YOUR CODE SIMPLER](https://blog.patricktriest.com/what-is-async-await-why-should-you-care/)
- 译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译。另外，本文版权归原作者所有，翻译仅用于学习。**

**Async/Await**是JavaScript的**ES7**新特性，来源于**.NET**和**C#**。它可以不用回调函数，像同步代码那些编写异步代码。这篇博客将通过一些代码示例，来说明**Async/Await**如何简化JavaScript代码。

### 1. 去除回调函数

> 运行本文的示例代码，并不需要额外的函数库。对于最新版的主流浏览器中，例如Chrome，Firefox, Safari以及Edge，它们都支持Async/Await语法。另外，Node.js 7.6+也支持了Async/Await语法。

我们编写了一些简单的API接口，用于模拟异步操作。这些接口都返回Promise，并在200ms后**resolve**一些数据。

```javascript
class Api {
  constructor () {
    this.user = { id: 1, name: 'test' }
    this.friends = [ this.user, this.user, this.user ]
    this.photo = 'not a real photo'
  }

  getUser () {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(this.user), 200)
    })
  }

  getFriends (userId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(this.friends.slice()), 200)
    })
  }

  getPhoto (userId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(this.photo), 200)
    })
  }

  throwError () {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('Intentional Error')), 200)
    })
  }
}
```

#### 嵌套Promise

```javascript
function callbackHell () {
  const api = new Api()
  let user, friends
  api.getUser().then(function (returnedUser) {
    user = returnedUser
    api.getFriends(user.id).then(function (returnedFriends) {
      friends = returnedFriends
      api.getPhoto(user.id).then(function (photo) {
        console.log('callbackHell', { user, friends, photo })
      })
    })
  })
}
```

曾经使用Promise编写回调函数的开发者一定不会陌生，这样一层层的嵌套代码通常是这样结尾的：

```javascript
      })
    })
  })
}
```

在回调函数中调用回调函数，一层层地嵌套，这就是所谓的“回调地狱”。在真实的代码中，这样的情况并不少见，通常更为复杂。

#### 链式Promise

```javascript
function promiseChain () {
  const api = new Api()
  let user, friends
  api.getUser()
    .then((returnedUser) => {
      user = returnedUser
      return api.getFriends(user.id)
    })
    .then((returnedFriends) => {
      friends = returnedFriends
      return api.getPhoto(user.id)
    })
    .then((photo) => {
      console.log('promiseChain', { user, friends, photo })
    })
}
```

Promise的最佳特性之一，就是可以在**then**回调函数中，return一个新的Promise，这样就可以将这些Promise链接起来，只有一层嵌套。**链式Promise**比**嵌套Promise**简单很多，但是还是很多冗余。

#### Async/Await

不使用回调函数可以吗？当然可以！使用**Async/Await**的话，7行代码就可以搞定。

```javascript
async function asyncAwaitIsYourNewBestFriend () {
  const api = new Api()
  const user = await api.getUser()
  const friends = await api.getFriends(user.id)
  const photo = await api.getPhoto(user.id)
  console.log('asyncAwaitIsYourNewBestFriend', { user, friends, photo })
}
```

使用**await**关键词时，赋值操作将等到异步操作结束时才进行。这样，看起来与同步代码无异，实际执行事实上是异步的。

### 2. 简化循环

**Async/Await**可以让一些复杂操作，比如循环变得简单。例如，当我们需要获取某个user的所有friends的friends列表，应该怎样操作呢？

#### 使用Promise

```javascript
function promiseLoops () {  
  const api = new Api()
  api.getUser()
    .then((user) => {
      return api.getFriends(user.id)
    })
    .then((returnedFriends) => {
      const getFriendsOfFriends = (friends) => {
        if (friends.length > 0) {
          let friend = friends.pop()
          return api.getFriends(friend.id)
            .then((moreFriends) => {
              console.log('promiseLoops', moreFriends)
              return getFriendsOfFriends(friends)
            })
        }
      }
      return getFriendsOfFriends(returnedFriends)
    })
}
```

我们使用了递归函数**getFriendsOfFriends**来获取**friends-of-friends**，知道**friends**数组为空。如此简单的任务，这样写显然过于复杂了。

> 使用**Promise.all()**来实现的话，则并非循环，而是并发执行。

#### 使用Async/Await

This could be so much easier.

```javascript
async function asyncAwaitLoops () {
  const api = new Api()
  const user = await api.getUser()
  const friends = await api.getFriends(user.id)

  for (let friend of friends) {
    let moreFriends = await api.getFriends(friend.id)
    console.log('asyncAwaitLoops', moreFriends)
  }
}
```

这时，可以直接使用for循环来实现，非常简单。

### 3. 简化并发

使用循环逐个获取**friends-of-friends**显然太慢，采用并发方式更为简单。

```javascript
async function asyncAwaitLoopsParallel () {
  const api = new Api()
  const user = await api.getUser()
  const friends = await api.getFriends(user.id)
  const friendPromises = friends.map(friend => api.getFriends(friend.id))
  const moreFriends = await Promise.all(friendPromises)
  console.log('asyncAwaitLoopsParallel', moreFriends)
}
```

为了实现并发，只需要将Promise数组作为**Promise.all()**的参数即可。这样，只需要**await**一个Promise，而这个Promise会在所有并发操作结束时**resolve**。

### 4. 简化错误处理

#### 使用回调函数处理Promise错误

```javascript
function callbackErrorHell () {
  const api = new Api()
  let user, friends
  api.getUser().then(function (returnedUser) {
    user = returnedUser
    api.getFriends(user.id).then(function (returnedFriends) {
      friends = returnedFriends
      api.throwError().then(function () {
        console.log('Error was not thrown')
        api.getPhoto(user.id).then(function (photo) {
          console.log('callbackErrorHell', { user, friends, photo })
        }, function (err) {
          console.error(err)
        })
      }, function (err) {
        console.error(err)
      })
    }, function (err) {
      console.error(err)
    })
  }, function (err) {
    console.error(err)
  })
}
```

这样做非常糟糕，代码非常冗余，可读性也很差。

#### 使用catch方法处理Promise错误

```javascript
function callbackErrorPromiseChain () {
  const api = new Api()
  let user, friends
  api.getUser()
    .then((returnedUser) => {
      user = returnedUser
      return api.getFriends(user.id)
    })
    .then((returnedFriends) => {
      friends = returnedFriends
      return api.throwError()
    })
    .then(() => {
      console.log('Error was not thrown')
      return api.getPhoto(user.id)
    })
    .then((photo) => {
      console.log('callbackErrorPromiseChain', { user, friends, photo })
    })
    .catch((err) => {
      console.error(err)
    })
}
```

这样处理好多了，仅仅需要在Promise链的最后，使用catch方法处理所有错误。

#### 使用Try/Catch处理Async/Await错误

```javascript
async function aysncAwaitTryCatch () {
  try {
    const api = new Api()
    const user = await api.getUser()
    const friends = await api.getFriends(user.id)

    await api.throwError()
    console.log('Error was not thrown')

    const photo = await api.getPhoto(user.id)
    console.log('async/await', { user, friends, photo })
  } catch (err) {
    console.error(err)
  }
}
```

对于**Async/Await**代码，使用**Try/Catch**即可处理，和同步代码一样，更加简单。

如何你需要监控线上JavaScript代码的错误时，可以免费使用[Fundebug](https://fundebug.com/)的实时错误监控服务，只需要一行代码就可以搞定！

### 5. 简化代码组织

使用**async**关键词定义的函数都会返回**Promise**，这样可以更方便地组织代码。

例如，在之前的示例中，我们可以将获取的user信息return，而不是直接打印；然后，我们可以通过返回的Promise来获取user信息。

```javascript
async function getUserInfo () {
  const api = new Api()
  const user = await api.getUser()
  const friends = await api.getFriends(user.id)
  const photo = await api.getPhoto(user.id)
  return { user, friends, photo }
}

function promiseUserInfo () {
  getUserInfo().then(({ user, friends, photo }) => {
    console.log('promiseUserInfo', { user, friends, photo })
  })
}
```

使用**Async/Await**语法，则更加简单：

```javascript
async function awaitUserInfo () {
  const { user, friends, photo } = await getUserInfo()
  console.log('awaitUserInfo', { user, friends, photo })
}
```

如何获取多个user的信息？

```javascript
async function getLotsOfUserData () {
  const users = []
  while (users.length < 10) {
    users.push(await getUserInfo())
  }
  console.log('getLotsOfUserData', users)
}
```

如何并发？如何处理错误？

```javascript
async function getLotsOfUserDataFaster () {
  try {
    const userPromises = Array(10).fill(getUserInfo())
    const users = await Promise.all(userPromises)
    console.log('getLotsOfUserDataFaster', users)
  } catch (err) {
    console.error(err)
  }
}
```
