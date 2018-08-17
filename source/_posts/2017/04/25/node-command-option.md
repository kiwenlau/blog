---
title: 全面掌握Node命令选项

date: 2017-04-25 21:00:00

tags: [Node.js, 翻译]
---

**译者按:** 作为Node.js开发者，有必要全面了解一下Node命令的所有选项，这样在关键时刻才能得心应手。


<!-- more -->

- 原文: [Mastering the Node.js CLI & Command Line Options](https://blog.risingstack.com/mastering-the-node-js-cli-command-line-options/)
- 译者: [Fundebug](https://fundebug.com/)

**为了保证可读性，本文采用意译而非直译。**

Node命令有很多选项，可以用于调试代码。这篇博客全面介绍了Node命令，可以提高大家的工作效率。

### 查看Node命令选项

使用**man**命令可以获取Node命令的所有选项:

```bash
$ man node

Usage: node [options] [ -e script | script.js ] [arguments]  
       node debug script.js [arguments] 

Options:  
  -v, --version         print Node.js version
  -e, --eval script     evaluate script
  -p, --print           evaluate script and print result
  -c, --check           syntax check script without executing
...
```

有Usage信息可知，所有选项都是可选的，且需要放在脚本之前。

**index.js**如下:

```javascript
console.log(new Buffer(100))  
```

`--zero-fill-buffers`选项将所有新创建Buffer初始化为0:

```bash
--zero-fill-buffers
              Automatically zero-fills all newly allocated Buffer and SlowBuffer instances.
```

使用`--zero-fill-buffers`选项的命令如下

```bash
$ node --zero-fill-buffers index.js
```

这样的话，输出结果全部为0，而不是随机的序列:

```tex
<Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ... >  
```

### Node命令常用选项

#### `--version` 或 `-v`

执行 `node --version`或者 `node -v`，可以查看Node版本信息。`-v`为`--version`的缩写，其他选项也有对应的缩写。

```bash
$ node -v
v6.10.0  
```

#### `--eval` 或 `-e`

使用`--eval` 选项，可以直接在终端执行Node.js代码。REPL中定义的模块，例如`http` 、 `fs`等都可以直接使用，不需要require。

```bash
$ node -e 'console.log(3 + 2)'
5  
```

#### `--print` 或 `-p`

`--print`选项与`--eval`选项的功能类似，但是`--print`选项可以打印表达式的结果。`--eval`选项使用`console.log`的话可以达到相同的效果。

```bash
$ node -p '3 + 2'
5  
```

#### `--check` 或`-c`

**Node v4.2.0之后才有**

使用`--check`，则会检查代码的语法(并不会执行代码)。

**index.js**如下:

```javascript
console.log(new Buffer(100)  
```

可知，代码中缺少了一个`)`，如果使用`node index.js`执行的话则会出错:

```bash
/Users/gergelyke/Development/risingstack/mastering-nodejs-cli/index.js:1
(function (exports, require, module, __filename, __dirname) { console.log(new Buffer(100)
                                                                                        ^
SyntaxError: missing ) after argument list  
    at Object.exports.runInThisContext (vm.js:76:16)
    at Module._compile (module.js:542:28)
    at Object.Module._extensions..js (module.js:579:10)
    at Module.load (module.js:487:32)
    at tryModuleLoad (module.js:446:12)
    at Function.Module._load (module.js:438:3)
    at Module.runMain (module.js:604:10)
    at run (bootstrap_node.js:394:7)
```

使用`node --check index.js`命令，可以在不执行代码的情况下检查到同样的错误。两者输出结果非常相似，但是**使用`--check`选项时没有执行代码，因此没有错误栈(stack trace)**:

```bash
/Users/gergelyke/Development/risingstack/mastering-nodejs-cli/index.js:1
(function (exports, require, module, __filename, __dirname) { console.log(new Buffer(100)
                                                                                        ^
SyntaxError: missing ) after argument list  
    at startup (bootstrap_node.js:144:11)
    at bootstrap_node.js:509:3
```

#### `--inspect[=host:port]`

**node v6.3.0之后才有**

使用`node --inspect`选项可以在指定的地址(host)和端口(port)开启监控器。如果没有指定地址和端口，则默认为`127.0.0.1:9229`。Chrome调试工具([Chrome Debugging Protocol](https://chromedevtools.github.io/debugger-protocol-viewer/))通过该端口绑定Node.js进程。

#### `--inspect-brk[=host:port]`

**node v7.6.0之后才有**

`--inspect-brk`选项与`--inspect`选项的功能相同，只是它会在代码第一行就暂停。

```bash
$ node --inspect-brk index.js 
Debugger listening on port 9229.  
Warning: This is an experimental feature and could change at any time.  
To start debugging, open the following URL in Chrome:  
    chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/86dd44ef-c865-479e-be4d-806d622a4813
```

运行命令之后，使用Chrome浏览器访问输出中提示的URL地址[chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/86dd44ef-c865-479e-be4d-806d622a4813](chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/86dd44ef-c865-479e-be4d-806d622a4813)就可以调试Node.js代码了。

#### `--zero-fill-buffers`

**node v6.0.0之后才有**

使用`--zero-fill-buffers`选项可以使所有新创建的Buffer初始化为0。 这样做可以防止内存中的敏感信息泄露。

注意，仅当需要防止内存敏感信息泄露时才使用该选项，因为它会严重影响代码性能。

> 另外，下面这些Buffer构造器在node v6.0.0已经弃用了。
>
> Also note, that some Buffer constructors got deprecated in `v6.0.0`:
>
> - `new Buffer(array)`
> - `new Buffer(arrayBuffer[, byteOffset [, length]])`
> - `new Buffer(buffer)`
> - `new Buffer(size)`
> - `new Buffer(string[, encoding])`
>
> 所以，应该使用 `Buffer.alloc(size[, fill[, encoding]])`, `Buffer.from(array)`, `Buffer.from(buffer)`, `Buffer.from(arrayBuffer[, byteOffset[, length]])` 和 `Buffer.from(string[, encoding])`.

关于Node.js的内存安全问题，可以查看博客[Exploiting Buffer](https://snyk.io/blog/exploiting-buffer/)

#### `--prof-process`

使用 `--prof-process`选项，Node.js进程将输出V8引擎的性能记录信息(profiler)

首先，使用`--prof`选项执行代码:

```bash
node --prof index.js  
```

运行之后，工作目录中将生成一个新文件，前缀为`isolate-`。

然后，使用`--prof-process`选项执行代码:

```bash
node --prof-process isolate-0x102001600-v8.log > output.txt  
```

**output.txt**文件中有V8引擎的性能记录信息，比如: C++代码花了多少时间，JavaScript代码花了多少时间，那个函数调用花了最多时间。如下:

```bash
[C++]:
   ticks  total  nonlib   name
     16   18.4%   18.4%  node::ContextifyScript::New(v8::FunctionCallbackInfo<v8::Value> const&)
      4    4.6%    4.6%  ___mkdir_extended
      2    2.3%    2.3%  void v8::internal::String::WriteToFlat<unsigned short>(v8::internal::String*, unsigned short*, int, int)
      2    2.3%    2.3%  void v8::internal::ScavengingVisitor<(v8::internal::MarksHandling)1, (v8::internal::LoggingAndProfiling)0>::ObjectEvacuationStrategy<(v8::internal::ScavengingVisitor<(v8::internal::MarksHandling)1, (v8::internal::LoggingAndProfiling)0>::ObjectContents)1>::VisitSpecialized<24>(v8::internal::Map*, v8::internal::HeapObject**, v8::internal::HeapObject*)

[Summary]:
   ticks  total  nonlib   name
      1    1.1%    1.1%  JavaScript
     70   80.5%   80.5%  C++
      5    5.7%    5.7%  GC
      0    0.0%          Shared libraries
     16   18.4%          Unaccounted
```

访问[官方文档](https://nodejs.org/dist/latest-v7.x/docs/api/cli.html#cli_command_line_options)，可以查看Node命令的所有选项。

------

### V8引擎选项

使用`--v8-options`选项可以打印所有的V8引擎选项。

> 目前，V8引擎提供了上百个选项，这篇博客只是介绍了其中几个。这些选项可以大大地改变V8引擎的行为，因此需要慎重使用。

#### `--harmony`

使用`--harmony`选项，则在代码中可以使用所有harmony特性(即正在开发的特性，例如在低版本的Node中使用ES6特性)。

#### `--max_old_space_size`

使用`--max_old_space_size`选项，可以调整老生代内存空间(old space，用于储存存活时间较长或常驻内存的对象)的最大值，这个将直接影响Node.js进程可以使用的内存大小。在内存较小的情况下，这个选项将非常方便，因为我们可以限制Node.js进程对内存的使用。

#### `--optimize_for_size`

使用`--optimize_for_size`选项，V8引擎会优化内存空间的使用，这样很可能会降低应用的执行速度。同样，在内存较小的情况下，这个选项将非常方便。

### 环境变量

#### `NODE_DEBUG=module[,…]`

设置**NODE_DEBUG**环境变量可以打印Node.js核心模块的调试信息。例如，下面的命令可以查看**module**模块的调试信息(你也可以查看其它模块，例如http, fs等):

```bash
$ NODE_DEBUG=module node index.js
```

输出如下(可知，module模块负责加载代码调用的各个模块):

```
MODULE 7595: looking for "/Users/gergelyke/Development/risingstack/mastering-nodejs-cli/index.js" in ["/Users/gergelyke/.node_modules","/Users/gergelyke/.node_libraries","/Users/gergelyke/.nvm/versions/node/v6.10.0/lib/node"]  
MODULE 7595: load "/Users/gergelyke/Development/risingstack/mastering-nodejs-cli/index.js" for module "."  
```

#### `NODE_PATH=path`

使用**NODE_PATH**，可以指定Node.js进程搜索模块的额外目录。

#### `OPENSSL_CONF=file`

使用**OPENSSL_CONF**，可以指定OpenSSL的配置文件。

访问[官方文档](https://nodejs.org/dist/latest-v7.x/docs/api/cli.html#cli_environment_variables)，可以查看Node命令的所有选项。
