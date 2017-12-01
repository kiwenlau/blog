---

title: JavaScript开发工具简明历史

date: 2017-11-29 10:00:00

tags: [JavaScript, 翻译]

---

**译者按：** JavaScript开发要用到的工具越来越多，越来越复杂，为什么呢？你真的弄明白了吗？

<!-- more -->


- 原文: [Modern JavaScript Explained For Dinosaurs](https://medium.com/@peterxjang/modern-javascript-explained-for-dinosaurs-f695e9747b70)

**为了保证可读性，本文采用意译而非直译。另外，本文版权归原作者所有，翻译仅用于学习。**

如果你不是老司机，面对众多JavaScript开发工具，也许会有些搞不清楚状况。因为，JavaScript的生态系统在迅速的变化，新手很难理解这些工具的功能以及它们所解决的问题。对此，我深有体会。

我是1998开始编程的，但是我直到2014才开始学习JavaScript。当我第一次接触[Browserify](http://browserify.org/)时，有这样一句介绍：

> 通过将依赖打包，Browserify让你可以在浏览器中使用require(‘modules’)

当时，我完全无法理解这句话，也不知道Browserify到底有什么用。

这篇博客将从历史演进的角度，告诉大家今天的JavaScript开发工具是怎样发展而来，以及它们到底有什么作用。首先，我们将介绍一个非常简单的网页示例，它是由最原始的HTML与JavaScript写的。然后，我们会逐步介绍不同的工具，它们可以解决不同的问题。

### 原始的JavaScript使用方式

最原始的网页，是用HTML和JavaScript编写的，没有那么多幺蛾子。不过，我们需要手动下载并载入依赖的JavaScript文件。如下，**index.html**中载入1个JavaScript文件：

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>JavaScript Example</title>
  <script src="index.js"></script>
</head>
<body>
  <h1>Hello from HTML!</h1>
</body>
</html>
```

 `<script src="index.js"></script>` 载入了同目录的**index.js**文件：

```javascript
// index.js
console.log("Hello from JavaScript!");
```

这样，一个简单的网页就写好了！

现在，假设你需要使用一个第三方库比如[moment.js](http://momentjs.com/)，这个库可以帮助我们处理时间数据。比如：

```javascript
moment().startOf('day').fromNow();        // 20 hours ago
```

我们需要在的官网下载**moment.min.js**，放到同一个目录中，然后在**index.html**中载入：

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Example</title>
  <link rel="stylesheet" href="index.css">
  <script src="moment.min.js"></script>
  <script src="index.js"></script>
</head>
<body>
  <h1>Hello from HTML!</h1>
</body>
</html>
```

可知，**moment.min.js**先于**index.js**载入，这样我们就可以在**index.js**中调用moment了：

```javascript
// index.js
console.log("Hello from JavaScript!");
console.log(moment().startOf('day').fromNow());
```

**总结: ** 直接使用HTML和JavaScript库编写网页非常简单，也很容易理解；然而，当JavaScript库更新时，我们需要手动下载并载入新版本，这样确实很烦...

### npm：包管理工具

大概2010开始，数个JavaScript包管理工具诞生了，它们旨在通过一个中央仓库，使得下载和更新JavaScript库更加自动化。2013年时，[Bower](https://bower.io/)可能是最流行的；到了2015年， [npm](https://www.npmjs.com/)逐渐占据统治地位；而2016年，[yarn](https://yarnpkg.com/en/)开始逐渐引起关注，但是它的底层是基于npm的。还有一点，npm最初是为[node.js](https://nodejs.org/)开发的，并不是为了前端。因此，使用npm管理前端的依赖库显得有点奇怪。

现在，我们来看看如何使用npm安装moment.js吧。

如果你已经安装了nodejs，则npm也应该安装好了。这时，进入**index.html**所在目录，执行以下命令：

```shell
$ npm init
```

终端会出现数个问题，仅需使用enter键选择默认配置就好了。命令执行之后，会生成一个**package.json**文件，npm使用这个文件保存所有的项目信息。默认的**package.json**是这样的:

```javascript
{
  "name": "your-project-name",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

使用一下命令，即可安装moment.js:

```shell
$ npm install moment --save
```

这个命令会做两件事情：首先，它会下载moment.js，将其保存到**node_modules**目录中；然后，它会更新**package.json**，保存moment安装信息。

```javascript
{
  "name": "modern-javascript-example",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "moment": "^2.19.1"
  }
}
```

这样，当我们需要与其他人分享这个项目时，就不需要将**node_modules**发送给对方了，而只需要给它**package.json**文件，因为它可以使用`npm install`安装所有依赖库。

**moment.min.js**文件位于**node_modules/moment/min**目录中，因此我们可以在**index.html**中直接载入**moment.min.js**：

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>JavaScript Example</title>
  <script src="node_modules/moment/min/moment.min.js"></script>
  <script src="index.js"></script>
</head>
<body>
  <h1>Hello from HTML!</h1>
</body>
</html>
```

**总结：** 现在，我们不需要手动下载moment.js了，而可以通过npm自动下载以及更新，这样方便很多；但是，我们需要在**node_modules**中找到对应的JS文件，然后将它载入HTML，这样很不方便。

**顺便分享一个好东西： 如果你需要监控线上JavaScript代码的错误的话，欢迎免费使用[Fundebug](https://fundebug.com/)!**

### webpack - 打包工具

大多数编程语言都提供了模块管理功能，可以在一个文件中导入另一个文件的代码。然而，JavaScript最初并没有支持这种方式。很长时间以来，组织多个JavaScript文件的代码时，需要使用全局变量。我们在载入**moment.min.js**时，实际上也定义了一个**moment**全局变量，因此所有之后载入的JS文件，都可以使用它。

2009年，一个叫做CommenJS的项目出现了，它为JavaScript模块化定义了一个规范，从而允许JavaScript能够和其他编程语言一样在不同文件中引入模块。Node.js是支持CommenJS规范的，它可以使用require直接引用模块：

```javascript
// index.js
var moment = require('moment');

console.log("Hello from JavaScript!");
console.log(moment().startOf('day').fromNow());
```

这样写非常方便，然而，如果你在浏览器中执行上面的代码，则会收到报错，因为"require未定义"。

这时，我们就需要打包工具了，它们可以将源代码构建成为兼容浏览器的代码，来避免上面提到的问题。简单地说，打包工具可以找到所有**require**语句，然后将它们替代为各个JS文件中代码，最终生成的一个单独的JS文件。

[Browserify](http://browserify.org/)是2011年发布，曾经是最流行的打包工具；到了2015年， [webpack](https://webpack.github.io/)逐渐成为了最主流的打包工具。

现在，我们来看看如何让`require('moment')`可以在浏览器中执行。首先，我们需要安装webpack：

```shell
$ npm install webpack --save-dev
```

`--save-dev`选项表示webpack模块时开发环境中需要的依赖库，而生产环境中并不需要。**package.json**更新之后是这样的：

```javascript
{
  "name": "modern-javascript-example",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "moment": "^2.19.1"
  },
  "devDependencies": {
    "webpack": "^3.7.1"
  }
}
```

使用一下命令运行webpack：

```shell
$ ./node_modules/.bin/webpack index.js bundle.js
```

**bundle.js**为生成的打包文件，可以直接在浏览器中使用：

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>JavaScript Example</title>
  <script src="bundle.js"></script>
</head>
<body>
  <h1>Hello from HTML!</h1>
</body>
</html>
```

每次修改**index.js**之后，我们都需要执行webpack。webpack的命令比较长，这样很麻烦，尤其是我们需要使用一些高级选项时。这时，我们可以将webpack的配置选项写入**webpack.config.js**文件：

```javascript
// webpack.config.js
module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js'
  }
};
```

这样，我们直接运行wepack，而不需要指定任何配置选项，就可以进行打包了：

```shell
$ ./node_modules/.bin/webpack
```

**总结：** 使用打包工具之后，对于第三方JS库，我们不再需要在HTML中使用`<script>`载入，也不需要定义全局变量了，而是直接在JS代码中使用**require**语句。另外，将多个JS文件打包成为一个单独的文件也有利于提高网页性能。然而，每次更新代码时，我们都需要手动运行webpack，这很不方便。

### Babel - 新语法特性转码器

转码器可以将代码由一个语言转换为另一个语言，它对于前端开发来说非常重要。浏览器对于语言的新特性支持通常很慢，我们使用新语言特性编写的代码需要转换为兼容的代码才能正常运行。

对于CSS，转码器有[Sass](http://sass-lang.com/)，[Less](http://lesscss.org/)，以及[Stylus](http://stylus-lang.com/)。对于JavaScript，[CoffeeScript](http://coffeescript.org/) 曾经是最流行的，而现在用的最多的是[babel](https://babeljs.io/)和[TypeScript](http://www.typescriptlang.org/)。CoffeeScript是一门可以编译到JavaScript的语言，旨在优化JavaScript。Typescript也是一门语言，支持最新的ECMAScript，并且支持静态类型检查。而Babel并非一门语言，而只是一个转码器，可以将ES6以及更高版本的JavaScript代码转为ES5代码，从而兼容各个浏览器。很多人选择babel，因为它最接近原生的JavaScript。

现在，我们来看看如何使用Babel。

首先，我们需要安装babel：

```shell
$ npm install babel-core babel-preset-env babel-loader --save-dev
```

我们一共安装了3个模块：**babel-core**是Babel的核心部分；**babel-preset-env**定义了转码规则；**babel-loader**是Babel的webpack插件。

然后，在**webpack.config.js**中配置**babel-loader**即可：

```javascript
// webpack.config.js
module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  }
};
```

webpack的配置文件看着有点晕，大致含义是这样的：告诉webpack找到所有js文件(除了node_modules目录中的文件)，根据**babel-preset-env**中的转码规则，使用**babel-loader**进行转码。至于webpack配置的细节，可以查看[文档](http://webpack.github.io/docs/configuration.html)。

现在，我们可以开始使用ES2015特性编程了。**index.js**中使用了[模板字符串](https://babeljs.io/learn-es2015/#ecmascript-2015-features-template-strings)：

```javascript
// index.js
var moment = require('moment');

console.log("Hello from JavaScript!");
console.log(moment().startOf('day').fromNow());

var name = "Bob", time = "today";
console.log(`Hello ${name}, how are you ${time}?`);
```

我们也可以使用[import](https://babeljs.io/learn-es2015/#ecmascript-2015-features-modules)来代替**require** ：

```javascript
// index.js
import moment from 'moment';

console.log("Hello from JavaScript!");
console.log(moment().startOf('day').fromNow());

var name = "Bob", time = "today";
console.log(`Hello ${name}, how are you ${time}?`);
```

修改**index.js**之后，运行webpack重新构建代码：

```shell
$ ./node_modules/.bin/webpack
```

其实，现在大多数浏览器都支持了ES2015特性，所以你可以测试一下IE9。在**bundle.js**中，我们可以看到转码后的代码：

```javascript
// bundle.js
// ...
console.log('Hello ' + name + ', how are you ' + time + '?');
// ...
```

**总结：** 有了Babel，我们就可以放心地使用最新的JavaScript语法了。但是使用[模板字符串](https://babeljs.io/learn-es2015/#ecmascript-2015-features-template-strings)这样简单的语法显然没什么意思，所以不妨试试[async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)。不过，现在我们还有两个问题需要解决：**bundle.js**应该需要压缩，这样才能提高性能，这一点很简单；每次修改代码，都需要手动运行webpack，这样很不方便，下一步我们来解决这个问题。

### npm scripts - 任务管理工具

任务管理工具可以将一些重复性的任务自动化，比如合并文件、压缩代码、优化图片以及运行测试等。

2013年时，Grunt是最流行的任务管理工具，其次是Gulp。现在，直接使用npm的scripts功能的开发者似乎越来越多了，这样不需要安装额外的插件。

修改**package.json**，即可配置npm scripts:

```javascript
{
  "name": "modern-javascript-example",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --progress -p",
    "watch": "webpack --progress --watch"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "moment": "^2.19.1"
  },
  "devDependencies": {
    "babel-core": "^6.26.0",
    "babel-loader": "^7.1.2",
    "babel-preset-env": "^1.6.1",
    "webpack": "^3.7.1"
  }
}
```

我们定义了2个scripts，即build和watch。

运行build，即可构建代码了(- -progress选项可以显示构建进程，-p选项可以压缩代码):

```shell
$ npm run build
```

运行watch，则一旦javascript修改了，就会自动重新运行wepback，这样开发就方便多了：

```shell
$ npm run watch
```

还有，我们可以webpack-dev-server，它可以提供一个网页服务器，而且能够自动重载页面：

```shell
$ npm install webpack-dev-server --save-dev 
```

修改**package.json**:

```javascript
{
  "name": "modern-javascript-example",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --progress -p",
    "watch": "webpack --progress --watch",
    "server": "webpack-dev-server --open"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "moment": "^2.19.1"
  },
  "devDependencies": {
    "babel-core": "^6.26.0",
    "babel-loader": "^7.1.2",
    "babel-preset-env": "^1.6.1",
    "webpack": "^3.7.1"
  }
}
```

运行：

```shell
$ npm run server
```

这时，浏览器会自动打开**localhost:8080**，并访问**index.html**。当我们修改**index.js**时，代码会自动重新构建，并且页面也会自动刷新。这样我们修改代码之后，就可以看到浏览器中的效果，而不需要任何额外的操作。

正如前文提到过，npm scripts或者其他任务管理工具可以做的事情还有很多，感兴趣的话，可以看看这个[视频](https://youtu.be/0RYETb9YVrk)。

### 结论

简单总结一下：刚开始我们用**HTML和JS**写代码；后来我们用**包管理工具**来安装第三方库；然后我们用**打包工具**实现模块化；再后来我们用**转码器**从而使用最新语法；最后我们用**任务管理工具**来自动化一些重复的任务。对于新手来说，这一切都显得非常头疼，更头疼的是这一切还在不断变化之中。

当然也有好消息，各个框架为了方便初学者，都会提供工具，把所有配置都弄好： Ember有**ember-cli**，Angular有**angular-cli**, React有**create-react-app**, Vue有**vue-cli**。这样，似乎你什么都不用管，只需要写代码就可以了。然而，现实是残酷的，总有一天你需要对Babel或者Webpack进行一些个性化配置。因此，理解每一个工具的作用还是非常有必要的，希望这篇博客可以帮助大家。


<div style="text-align: center;">
<img style="width:30%;" src="https://blog.fundebug.com/images/qq_bug.JPG" />
</div>