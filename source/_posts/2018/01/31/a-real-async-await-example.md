---

title: 一个真实的Async/Await示例

date: 2018-01-31 10:00:00

tags: [JavaScript, 翻译, Node.js]

---

**译者按：** 通过真实的代码示例感受Async/Await的力量。

<!-- more -->


- 原文: [Async/await - A thorough example](https://kostasbariotis.com/async-await-a-thorough-example/)
- 译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译。另外，本文版权归原作者所有，翻译仅用于学习。**


既然Node.js 8已经LTS了，我想大家是时候试一试[Async/Await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)特性了，真的很好用！它可以帮助我们用同步的方式写异步代码，极大地提高了代码的可读性。在过去的2年时间里，[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)给我们带来了不少便利，同时也让我们有一些失望。

这边博客，我将介绍一个真实的代码示例，它是一个REST API的controller。通过展示我们如何从Promise切换到async/await，你讲能够体会到Async/Await的神奇之处！

### Promise示例

下面是我的工作项目中真实的Controller代码：

```javascript
const BPromise = require('bluebird');

const { WrongCredentialsError, DBConnectionError, EmailError } = require('./../errors');

/**
 * Emulate an Express.js route call as an example
 */
loginController({}, { json: response => console.log(response) }, null)

function loginController (req, res, err) {
  const { email, password } = req;

  let user;

  BPromise.try(() => validateUserInput(req))
    .then(() => fetchUserByEmail(email))
    .then(fetchedUser => user = fetchedUser)
    .then(() => comparePasswords(req.password, user.password))
    .then(() => markLoggedInTimestamp(user.userId))
    .then(() => sendEmail(user.userId))
    .then(() => generateJWT(user))
    .then(token => res.json({ success: true, token }))
    .catch(WrongCredentialsError, () => res.json({ success: false, error: 'Invalid email and/or password' }))
    .catch(EmailError, DBConnectionError, () => res.json({ success: false, error: 'Unexpected error, please try again' }))
    .catch(() => res.json({ success: false }))
}

/**
 * Validate input from Request
 *
 * @param {Object} input
 * @throws {WrongCredentialsError}
 * @returns {Void}
 */
function validateUserInput(input) {
  if (!input.email || !input.password) {
    throw new WrongCredentialsError();
  }
}

/**
 * Fetch a User from the DB by Email
 *
 * @throws WrongCredentialsError
 * @throws DBConnectionError
 * @returns {BPromise}
 */
function fetchUserByEmail(email) {
  const user = {
    userId: 'DUMMY_ID',
    email: 'konmpar@gmail.com',
    password: 'DUMMY_PASSWORD_HASH'
  }
  return new BPromise(resolve => resolve(user));
}

/**
 * Compare two password
 *
 * @param {String} inputPwd
 * @param {String} storedPwd
 * @throws {WrongCredentialsError}
 * @returns {Void}
 */
function comparePasswords(inputPwd, storedPwd) {
  if (hashPassword(inputPwd) !== storedPwd) {
    throw new WrongCredentialsError();
  }
}

/**
 * Hash password
 *
 * @param {String} password
 * @returns {String}
 */
function hashPassword(password) {
  return password;
}

/**
 * Mark a user's logged in timestamp
 *
 * @param {String} userId
 * @throws DBConnectionError
 * @returns {BPromise}
 */
function markLoggedInTimestamp(userId) {
  return new BPromise(resolve => resolve());
}

/**
 * Send a follow up email
 *
 * @param {String} userId
 * @throws EmailError
 * @returns {BPromise}
 */
function sendEmail(userId) {
  return new BPromise(resolve => resolve());
}

/**
 * Generate a JWT token to send to the client
 *
 * @param {Object} user
 * @returns {BPromise<String>}
 */
function generateJWT(user) {
  const token = 'DUMMY_JWT_TOKEN';

  return new BPromise(resolve => resolve(token));
}

```

一些值得注意的要点：

#### 多余的外层变量

```javascript
let user;

/* ... */
  .then(fetchedUser => user = fetchedUser)
  /* ... */
  .then(() => sendEmail(user.userId))
  /* ... */

```

可知，user是一个全局变量，因为我需要在Promise链中使用它。如果不希望定义多余的外层变量，则需要在Promise链中的每一个函数中都返回user变量，这样做显然更加糟糕。

#### 烦人的Promise链

```javascript
/* ... */
BPromise.try(() => validateUserInput(req))
/* ... */

```

一个Promise链必须从Promise开始，但是**validateUserInput**函数并没有返回Promise，这时需要使用**Bluebird**。我也知道这样写比较奇怪...

#### 讨厌的Bluebird

我在很多地方都使用了Bluebird，如果不用它的话，代码会更加臃肿。所谓DRY，即Don't repeat yourself，我们可以使用Bluebird去尽量简化代码。但是，Bluebird是一个第三方依赖，如果出问题了怎么办？去掉Bluebird应该更好！

*JavaScript太灵(gui)活(yi)了，出了BUG你也不知道，不妨接入[Fundebug](https://fundebug.com)线上实时监控*。

### Async/Await示例

当我放弃Promise，使用Async/Await之后，代码是这样的：

```javascript
const { WrongCredentialsError, DBConnectionError, EmailError } = require('./../errors');

/**
 * Emulate an Express.js route call as an example
 */
loginController({}, { json: response => console.log(response) }, null)

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} err
 * @returns {Void}
 */
async function loginController(req, res, err) {
  const { email, password } = req.email;

  try {
    if (!email || !password) {
      throw new WrongCredentialsError();
    }

    const user = await fetchUserByEmail(email);

    if (user.password !== hashPassword(req.password)) {
      throw new WrongCredentialsError();
    }

    await markLoggedInTimestamp(user.userId);
    await sendEmail(user.userId);

    const token = await generateJWT(user);

    res.json({ success: true, token });

  } catch (err) {
    if (err instanceof WrongCredentialsError) {
      res.json({ success: false, error: 'Invalid email and/or password' })
    } else if (err instanceof DBConnectionError || err instanceof EmailError) {
      res.json({ success: false, error: 'Unexpected error, please try again' });
    } else {
      res.json({ success: false })
    }
  }
}

/**
 * Fetch a User from the DB by Email
 *
 * @throws WrongCredentialsError
 * @throws DBConnectionError
 * @returns {Promise}
 */
function fetchUserByEmail(email) {
  const user = {
    userId: 'DUMMY_ID',
    email: 'konmpar@gmail.com',
    password: 'DUMMY_PASSWORD_HASH'
  }
  return new Promise(resolve => resolve(user));
}

/**
 * Hash password
 *
 * @param {String} password
 * @returns {String}
 */
function hashPassword(password) {
  return password;
}

/**
 * Mark a user's logged in timestamp
 *
 * @param {String} userId
 * @throws DBConnectionError
 * @returns {Promise}
 */
function markLoggedInTimestamp(userId) {
  return new Promise(resolve => resolve());
}

/**
 * Send a follow up email
 *
 * @param {String} userId
 * @throws EmailError
 * @returns {Promise}
 */
function sendEmail(userId) {
  return new Promise(resolve => resolve());
}

/**
 * Generate a JWT token to send to the client
 *
 * @param {Object} user
 * @returns {Promise<String>}
 */
function generateJWT(user) {
  const token = 'DUMMY_JWT_TOKEN';

  return new Promise(resolve => resolve(token));
}

```

哈哈！！！

#### 没有外层变量

现在，所有函数都在同一个作用域中调用，不再需要**.then**函数。因此，我们不再需要定义多余的全局变量，也不需要做多余的变量赋值。

#### 没有多余的函数

Promise示例中的同步函数**validateInput**和**comparePasswords**的代码可以与异步函数写在一起，因此可以不再需要定义单独的函数，代码更少。

#### 可读性更高

异步代码采用同步方式来写，同时减少了代码量，可读性大大提高。

#### 不再需要Bluebird

原生的Promise可以替代Bluebird，且不再需要Bluebird的try方法了。

### 结论

作为程序员，我们应该努力完善代码。Async/Await可以带来很大好处，帮助我们写出可读性更高的代码。如果你坚持使用Promise，不妨看看[如何在Promise链中共享变量？](https://blog.fundebug.com/2017/09/04/promise-share-variable/)。

如果你对Async/Await感兴趣的话，可以看看这些博客：

- [重构：从Promise到Async/Await](https://blog.fundebug.com/2017/12/13/reconstruct-from-promise-to-async-await/)
- [Async/Await替代Promise的6个理由](https://blog.fundebug.com/2017/04/04/nodejs-async-await/)
- [Async/Await是这样简化JavaScript代码的](https://blog.fundebug.com/2017/10/16/async-await-simplify-javascript/)
