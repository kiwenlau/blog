---

title: Node.js之HTTP/2服务器推送

date: 2018-03-27 10:00:00

tags: [Node.js, 翻译]

---

**译者按：** 盆友们，是时候拥抱新一代HTTP协议了！

<!-- more -->

- 译者：[Fundebug](https://blog.risingstack.com/node-js-http-2-push/)
- 原文：[HTTP/2 Server Push with Node.js](https://blog.risingstack.com/node-js-http-2-push/)

[Node.js 8.4.0](https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V8.md#8.4.0)已经开始支持HTTP/2，执行node命令时，加上`--expose-http2`选项就可以使用了。

在这篇博客中，我们会介绍如何使用HTTP/2进行**服务器推送(server push)**，另外，我们还写了一个简单的Node.js示例。

### 关于HTTP/2

HTTP/2是新一代HTTP协议，支持**多路复用(MultiPlexing)、header压缩、服务器推送(server push)**等特性，有效减少了时延。对HTTP/2感兴趣的话，可以查看 [Introduction to HTTP/2](https://developers.google.com/web/fundamentals/performance/http2/)。

### HTTP/1 VS HTTP/2

HTTP/2服务器推送允许服务器在浏览器请求资源之前推送资源，减少页面加载时间。这里，我们不妨对比一下HTTP/1和HTTP/2。

#### HTTP/1

客户端发送请求给服务器，服务器返回请求的资源，通常是HTML文件，HTML文件包含一些资源链接(比如.js, .css等)。浏览器解析HTML文件，获取资源链接，然后分别请求这些资源。

下面的图片展示了这个过程，注意：timeline中有3个独立的请求，bundle1.js和bundle2.js的请求的initiator是(index)Parser。


<div style="text-align: center;">
<img style="width:60%;" src="http1.png" />
</div>


HTTP/1是这样工作的，我们已经这样做很多年了，那为什么要改变呢？问题在于，用户需要等待浏览器解析HTML文件，获取链接然后请求资源。这会延缓前端渲染，增加页面加载时间。将一些资源嵌入HTML是一个解决方法，但是那会使得第一次请求变得很大很慢。

#### HTTP/2

下面的图片显示了当服务器启用HTTP/2之后的网站加载过程。由timeline和initiator可知，多路复用减少了请求个数，而且bundle1.js和bundle2.js在第一次请求时就推送给前端了。

<div style="text-align: center;">
<img style="width:60%;" src="http2.png" />
</div>

### Node.js示例

使用内置的http2模块，我们可以创建一个http2服务器。有趣的一点在于，当`index.html`被请求时，我们会主动推送其他资源：bundle1.js和bundle2.js。这样的话，bundle1.js和bundle2.js可以在浏览器请求它们之前就推送过去了。

```javascript
const http2 = require('http2')
const server = http2.createSecureServer(
  { cert, key },
  onRequest
)

function push (stream, filePath) {
  const { file, headers } = getFile(filePath)
  const pushHeaders = { [HTTP2_HEADER_PATH]: filePath }

  stream.pushStream(pushHeaders, (pushStream) => {
    pushStream.respondWithFD(file, headers)
  })
}

function onRequest (req, res) {
  // Push files with index.html
  if (reqPath === '/index.html') {
    push(res.stream, 'bundle1.js')
    push(res.stream, 'bundle2.js')
  }

  // Serve file
  res.stream.respondWithFD(file.fileDescriptor, file.headers)
}

```

完整的示例可以查看GitHub仓库：[RisingStack/http2-push-example](https://github.com/RisingStack/http2-push-example)

### HTTP/2 & Node.js

Node.js启用HTTP/2特性可以帮助我们优化客户端与服务端的交互性能。使用服务器推送，我们可以在浏览器请求资源之前，将资源推送给浏览器，这样可以减少页面加载时间，提高用户体验。

