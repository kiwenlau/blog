---
title: JavaScript开发工具大全

date: 2017-06-19 10:00:00

tags: [JavaScript, 翻译]

---

**译者按: **最全的JavaScript开发工具列表，总有一款适合你！

<!-- more -->

原文: [THE ULTIMATE LIST OF JAVASCRIPT TOOLS](https://da-14.com/blog/ultimate-list-javascript-tools)

译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译。另外，本文版权归原作者所有，翻译仅用于学习**。

## 简介

2017年1月，Stack Overflow年度开发者[调研](https://insights.stackoverflow.com/survey/2017)一共访问了**64000**个程序员，发现JavaScript已经连续5年成为最流行的编程语言。

<div style="text-align: center;">
<img style="width:80%;" src="./javascript-tools-list/javascript_popularity_stackoverflow_report_2017.png" />
</div>

这篇博客将介绍一些常用的JavaScript开发工具：

- 构建&自动化
- IDE&编辑器
- 文档
- 测试
- 调试
- 安全
- 代码优化&分析
- 包管理

### 构建 & 自动化

- **[Webpack](https://webpack.github.io/)**对JavaScript应用依赖的所有模块进行静态分析，生成依赖图，然后将它们打包成数个静态文件。
- **[Grunt](https://gruntjs.com/)**以将重复耗时的任务自动化。Grunt的生态系统非常大8，有超过6010个插件。
- **[Gulp](http://gulpjs.com/)**发布于Grunt之后，采用了完全不同的方式，使用JavaScript函数定义任务。它有超过2770个插件，并且提供了更好的控制。
- **[Browserify](http://browserify.org/)**使得开发者可以在浏览器使用**CommonJS模块**。开发者像在node环境一样，通过`require('modules')`来组织模块之间的引用和依赖，Browserify将这些依赖打包成浏览器可以直接引用的JS文件。
- **[Brunch](http://brunch.io/)**非常简单，速度很快。Brunch的配置文件非常简单，入门文档非常详细。Brunch会自动生成Source Map，方便了开发者Debug。
- **[Yeoman](http://yeoman.io/)**可以用于任何编程语言(JavaScript, Python, C#, Java, etc.)。它是前端开发的脚手架，有6213个插件。

### IDE & 编辑器

- **[WebStorm](https://www.jetbrains.com/webstorm/)**是一款强大的JavaScript IDE。它支持多种框架和CSS语言，包括前端，后端，移动端以及桌面应用。WebStorm可以无缝整合第三方工具，例如构建构建、语法检查构建linter等等。它提供了代码补全，实时错误监测，导航，内置控制台，各种插件等一系统功能。
- **[Atom](https://atom.io/)**是GitHub团队开发的。开发者可以很容易地对Atom进行自定义。Atom自带了一个包管理工具，代码补全，文件系统浏览器，支持多个平台以及其他有用的功能。
- [**Visual Studio Code**](https://code.visualstudio.com/)是微软开发的IDE，支持TypeScript。它提供了代码补全，语法高亮，支持Git命令等等。另外，它还有非常多的插件。
- **[Brackets](http://brackets.io/)**是一个轻量级的开源编辑器。它专注于可视化工具，可以帮助开发者开发Web应用。Brackets支持实时预览以及行内编辑。

### 文档

- [**Swagger**](http://swagger.io/)提供了一系列规则用于描述API。使用Swagger，可以创建清晰的文档，并且自动化API相关的操作(例如功能测试)。
- [**JSDoc**](http://usejsdoc.org/)可以根据javascript文件中注释信息，生成JavaScript应用程序或库、模块的API文档。JSDoc可以用于管理大型项目。
- [**jGrouseDoc **](http://jster.net/library/jgrousedoc)是一个开源工具，可根据JavaScript注释生成类似Jaavdoc 的源码文档。它不仅可以为变量和函数生成文档，还可以为模块等其他元素生成文档。
- [**YUIDoc**](http://yui.github.io/yuidoc/)基于Nodejs，可以将文档中的注释生成API文档。它使用类似于Javadoc与Doxygen的语法，并且支持实时预览，支持各种语言，并且支持标记语言。
- [**Docco **](https://jashkenas.github.io/docco/)是免费的文档工具，由[Literate CoffeeScript](http://coffeescript.org/#literate)编写。它将代码中的注释生成HTML文档。Docco并不限于JavaScript，同时支持Python, Ruby, Clojure等语言。

### 测试

- [**Jasmine **](https://jasmine.github.io/)是一个行为驱动开发(BDD)框架，用于测试JavaScript代码。它不依赖任何第三方模块，也不需要DOM。它的语法非常简单易懂，使得编写测试变得很简单。另外，它也可以用于测试Node.js，Python以及Ruby。
- [**Mocha**](https://mochajs.org/)是一个功能测试框架，用于测试Node.js以及浏览器端JavaScript。作为开发者首选的测试框架，它可以自由的编写测试组，提供详细的测试报告，同时让异步测试非常简单。Mocha通常与断言库[**Chai**](http://chaijs.com/)来验证测试结果。
- [**PhantomJS**](http://phantomjs.org/)用于前端单元测试。由于PhantomJS是一个无界面的Webkit浏览器引擎，与直接使用浏览器测试相比，使用PhantomJS脚本可以运行得更快。它支持各种网页标准，例如JSON, Canvas, DOM操作, SVG以及CSS选择器。
- [**Protractor**](http://www.protractortest.org/)是一个端到端测试框架，用于测试Angular应用。它是基于WebDriverJS构建的，它可以通过浏览器事件或者原生事件，从而模拟真实用户，来测试应用。

### 调试

- [**JavaScript Debugger**](https://developer.mozilla.org/en-US/docs/Tools/Debugger)由Mozilla Developer Network (MDN)开发，可以独立用于调试Node.js代码，或者用于其他浏览器。Firefox提供了本地和远程调试功能，并且，Firefox安卓端也用于调试运行在安卓应用。
- [**Chrome Dev Tools**](https://developers.google.com/web/tools/chrome-devtools/)提供了一系列工具，可以用于调试JavaScript代码，编辑CSS，以及测试应用性能。
- [**ng-inspector**](http://ng-inspector.org/)是Firefox，Chrome和Safari浏览器插件，可以帮助开发者开发、理解以及调试AngularJS应用。它提供了实时更新，DOM高亮等功能。
- [**Augury**](https://augury.angular.io/)是一个Chrome插件，可以用于调试Angular 2应用。它让开发者可以直接查看应用结构，操作特征以及状态变化。

### 安全

- [**Snyk**](https://snyk.io/)是一个付费服务，用于发现、修复和预防JavaScript，Node.js和Ruby应用的已知漏洞。Snyk拥有自己的漏洞库，以及[NSP](https://github.com/nodesecurity/nsp)和[NIST NVD](https://nvd.nist.gov/)的漏洞数据。它允许开发者使用它们的补丁和更新来修复这些安全漏洞。
- [**Node Security Project**](https://nodesecurity.io/)提供了工具用于扫描依赖来监测漏洞。NSP使用自己的漏洞数据，以及来自[NIST NVD](https://nvd.nist.gov/)的漏洞数据。NSP支持集成GitHub和CI软件，实时监测和报警，并且可以提供如何修复Node.js应用漏洞的建议。
- [**RetireJS**](http://retirejs.github.io/retire.js/)是一个开源的依赖监测工具。它包含了多个组件，包括命令行工具，Grunt插件，Firefox和Chrome插件，Burp和OWASP ZAP插件。Retirejs从NIST NVD，漏洞追踪系统，博客和邮件列表等手机漏洞数据。
- [**Gemnasium**](https://gemnasium.com/)是一个付费工具，不过有免费方案。它支持各种技术，比如Ruby, PHP, Bower, Python和npm。Gemnasium提供很多非常有用的特性，比如自动更新，实时报警以及Slack集成等。
- [**OSSIndex**](https://ossindex.net/)支持多个生态系统(Java, JavaScript和.NET/C#)，以及多个平台，例如NuGet, npm, Bower, Chocolatey, Maven, Composer, Drupal和MSI。它从NVD以及其他来源收集漏洞数据。

### 代码优化 & 分析

- [**JSLint**](http://jslint.com/)是一个Web服务，用于验证JavaScript的代码质量。当它诊断到一个问题时，它会返回问题的大致位置和出错信息。JSLint可以分析一些编码规范以及语法错误。
- [**JSHint**](http://jshint.com/)可以发现JavaScript中的错误以及一些潜在的问题。JSHint是一个静态代码分析工具，旨在帮助开发者编写大型的程序。它可以诊断语法错误、隐形类型转换等问题，但是它并不能确定你的应用是否正确、性能是否足够好、以及是否会发生内存泄漏。 JSHint是JSLint的一个fork。
- [**ESLint**](http://eslint.org/)是一个开源诊断工具，用于JSX和JavaScript应用。它可以帮助开发者发现可疑的或者不符合特定编程规范的代码。它帮助开发者在没有执行代码之前发现JS代码中问题，节省了不少时间。ESLint由Node.js编写，可以使用NPM安装。
- [**Flow**](https://flow.org/)是JavaScript代码静态类型检测器，由Facebook开发。Flow可以在编码时检查到类型错误并做出提示。

### 包管理

- [**Bower**](https://bower.io/)是一个用于管理前端依赖的包管理器，Twitter创建。它提供了大量可供使用的依赖包，帮助JavaScript开发者更方便地管理前端依赖的JS库。
- [**NPM**](https://www.npmjs.com/)是**node package manager**的缩写，事实上NPM包可以用于前后端。它是JavaScript包管理系统，也是世界上最大的依赖库，有超过475,000个模块。
- [**Yarn**](https://yarnpkg.com/)是Facebook, Google, Exponent 和 Tilde 开发的一款新的 JavaScript 包管理工具。与NPM相比，它解决了安全、性能以及一致性问题。
- [**Duo**](http://duojs.org/)吸取了[Component](https://github.com/component/component), [Browserify](https://github.com/substack/node-browserify)和[Go](http://golang.org/)的经验，致力于简化大型Web应用的构建过程。

欢迎加入[我们Fundebug](https://fundebug.com/)的**全栈BUG监控交流群: 622902485**。

<div style="text-align: center;">
<img style="width:30%;" src="http://opu5mq5tf.bkt.clouddn.com/qq_bug.JPG" />
</div>