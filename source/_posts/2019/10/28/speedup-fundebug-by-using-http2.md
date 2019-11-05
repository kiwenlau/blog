---
title: Fundebug网站升级HTTP/2，真的变快了！

date: 2019-10-28 10:00:00

tags: [HTTP/2]

keywords: HTTP/2

description: Fundebug网站升级HTTP/2，真的变快了！
---

**摘要：** 迟到的更新！

<!-- more -->

作为新一代的HTTP协议，HTTP/2可以提高网站性能，优化用户体验，[Fundebug](https://www.fundebug.com/)也是时候升级HTTP/2了，虽然已经有点晚了。

升级HTTP/2是一件很简单的事情，改1行Nginx配置就好了，但是，**工程师只知道How是远远不够的，还需要理解Why**，这就要求我们需要足够的事先调研（1. 什么是HTTP/2？）以及事后分析（4. 升级HTTP/2真的提高性能了吗？）。

### 1. 什么是HTTP/2？

HTTP/2是新一代的HTTP协议，于2015正式发布。

与其他众多Web技术标准一样，推动HTTP/2标准的依然是Google。发布Chrome的时候Google说过要推动Web技术的发展，然后它真的做到了。（[JavaScript深入浅出第5课：Chrome是如何成功的？](https://blog.fundebug.com/2019/08/08/how-does-chrome-succeed/)）

根据[W3Techs](https://w3techs.com/technologies/details/ce-http2/all/all)的统计，截止2019年10月26日，全世界41.3%的网站已经使用了HTTP/2。

根据[Can I use](https://caniuse.com/#search=http2)，绝大多数浏览器都支持了HTTP/2：

![](https://image.fundebug.com/2019-10-07-can-i-use-http2.png)

HTTP/2主要有以下几个特性：

- **HTTP/2为二进制协议**

![](https://image.fundebug.com/2019-10-07-http2-binary-protocol.png)
**图片来源：[Valentin V. Bartenev](https://www.nginx.com/blog/http2-module-nginx)**

由上图可知，HTTP/1.1传输的是文本数据，而HTTP/2传输的是二进制数据，提高了数据传输效率。

- **HTTP/2支持TCP连接多路复用**

![](https://image.fundebug.com/2019-10-07-http2-tcp-multiplexing.png)
**图片来源：[Factory.hr](https://medium.com/@factoryhr/http-2-the-difference-between-http-1-1-benefits-and-how-to-use-it-38094fa0e95b)**

由上图可知，HTTP 1.1需要为不同的HTTP请求建立单独的TCP连接，而HTTP/2的多个HTTP请求可以复用同一个TCP连接。

要知道，建立TCP连接时需要3次握手，再加上TLS的4次握手，加起来就是7次握手，如果可以复用TCP连接的话，则可以减少这些多余的开销。

- **HTTP/2会压缩请求Header**

![](https://image.fundebug.com/2019-10-07-http2-header-compression.png)
**图片来源：[运维实谈](https://mp.weixin.qq.com/s/vcBEVaSfhrNZ3dYPMZSUQw)**

如上图所示，第2个请求的Header只有:path不一样，因此压缩空间非常可观。

Headers压缩的算法HPACK本身似乎很复杂(其实也不难)，但是算法思想其实非常简单的，假设我们在浏览器发起100个请求，它们的user-agent是不会变的，那我们为什么需要重复传输这个长长的字符串呢？用dictionary记录一次不就行了！

- **HTTP/2支持服务器推送(Server Push)**

![](https://image.fundebug.com/2019-10-07-http2-server-push.png)


**图片来源：[lujjjh](https://zhuanlan.zhihu.com/p/26757514)**

由上图可知，当客服端向服务端请求HTML时，Server Push服务端可以提前返回HTML所依赖的css、js等资源，这样可以节省解析HTML以及请求资源的时间，从而缩短页面的加载时间。


### 2. 如何升级HTTP/2？

我们使用了Nginx作为前端页面与后端接口的反向代理服务器(Reverse Proxy)，只需要修改一下Nginx配置文件就可以升级HTTP/2了，非常简单。

注意，在 Nginx 上 开启 HTTP/2 需要 Nginx 1.9.5 以上版本（包括1.9.5），并且需要 OpenSSL 1.0.2 以上版本(包括1.0.2)。使用`nginx -V`命令可以查看Nginx的版本信息：

```bash
nginx -V
nginx version: nginx/1.12.1
built by gcc 6.3.0 20170516 (Debian 6.3.0-18)
built with OpenSSL 1.1.0f  25 May 2017
TLS SNI support enabled
configure arguments: --prefix=/etc/nginx --sbin3-path=/usr/sbin/nginx --modules-path=/usr/lib/nginx/modules --conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log --pid-path=/var/run/nginx.pid --lock-path=/var/run/nginx.lock --http-client-body-temp-path=/var/cache/nginx/client_temp --http-proxy-temp-path=/var/cache/nginx/proxy_temp --http-fastcgi-temp-path=/var/cache/nginx/fastcgi_temp --http-uwsgi-temp-path=/var/cache/nginx/uwsgi_temp --http-scgi-temp-path=/var/cache/nginx/scgi_temp --user=nginx --group=nginx --with-compat --with-file-aio --with-threads --with-http_addition_module --with-http_auth_request_module --with-http_dav_module --with-http_flv_module --with-http_gunzip_module --with-http_gzip_static_module --with-http_mp4_module --with-http_random_index_module --with-http_realip_module --with-http_secure_link_module --with-http_slice_module --with-http_ssl_module --with-http_stub_status_module --with-http_sub_module --with-http_v2_module --with-mail --with-mail_ssl_module --with-stream --with-stream_realip_module --with-stream_ssl_module --with-stream_ssl_preread_module --with-cc-opt='-g -O2 -fdebug-prefix-map=/data/builder/debuild/nginx-1.12.1/debian/debuild-base/nginx-1.12.1=. -specs=/usr/share/dpkg/no-pie-compile.specs -fstack-protector-strong -Wformat -Werror=format-security -Wp,-D_FORTIFY_SOURCE=2 -fPIC' --with-ld-opt='-specs=/usr/share/dpkg/no-pie-link.specs -Wl,-z,relro -Wl,-z,now -Wl,--as-needed -pie'
```

可知，我们使用的Nginx版本为1.12.1，OpenSSL版本为1.1.0f，符合要求。

还有一点，虽然HTTP/2标准并没有要求加密，但是所有浏览器都要求HTTP/2必须加密，这样的话，只有HTTPS才能升级HTTP/2。

如果你还没用过HTTPS的话，不妨看看我的博客：[教你快速撸一个免费HTTPS证书](https://blog.fundebug.com/2018/07/06/apply-lets-encrypt-certificate/)，其实也很简单。

一切前提没问题的话(Nginx>=1.9.5，OpenSSL>=1.0.2，HTTPS)，只需要修改1行配置，在listen指令后面添加http2：

```nginx
server
{
    listen 443 ssl http2;
    server_name www.fundebug.com;
}
```

重启Nginx，升级HTTP/2就成功了，可以使用curl命令检查：

```bash
curl -sI https://www.fundebug.com
HTTP/2 200
server: nginx/1.12.1
date: Mon, 07 Oct 2019 00:12:53 GMT
content-type: text/html; charset=UTF-8
content-length: 4892
x-powered-by: Express
accept-ranges: bytes
cache-control: public, max-age=0
last-modified: Sun, 06 Oct 2019 23:07:25 GMT
etag: W/"131c-16da353dbc8"
vary: Accept-Encoding
strict-transport-security: max-age=15768001
```

### 3. HTTP/2导致Safari浏览器OPTIONS请求失败

升级HTTP/2之后，使用Safari的用户发现无法登陆Fundebug了：

![](https://image.fundebug.com/2019-10-07-fundebug-login-error.jpg)

我们的前端异常监控插件捕获了这个报错：

![](https://image.fundebug.com/2019-10-07-fundebug-capture-login-error.png)

可知，是**/api/members/login**接口出错了。

经过排查发现是OPTIONS请求失败了：

```bash
curl -X OPTIONS https://api.fundebug.com/api/members/login -v
*   Trying 120.77.45.162...
* TCP_NODELAY set
* Connected to api.fundebug.com (120.77.45.162) port 443 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
* Cipher selection: ALL:!EXPORT:!EXPORT40:!EXPORT56:!aNULL:!LOW:!RC4:@STRENGTH
* successfully set certificate verify locations:
*   CAfile: /etc/ssl/cert.pem
  CApath: none
* TLSv1.2 (OUT), TLS handshake, Client hello (1):
* TLSv1.2 (IN), TLS handshake, Server hello (2):
* TLSv1.2 (IN), TLS handshake, Certificate (11):
* TLSv1.2 (IN), TLS handshake, Server key exchange (12):
* TLSv1.2 (IN), TLS handshake, Server finished (14):
* TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
* TLSv1.2 (OUT), TLS change cipher, Client hello (1):
* TLSv1.2 (OUT), TLS handshake, Finished (20):
* TLSv1.2 (IN), TLS change cipher, Client hello (1):
* TLSv1.2 (IN), TLS handshake, Finished (20):
* SSL connection using TLSv1.2 / ECDHE-RSA-AES128-GCM-SHA256
* ALPN, server accepted to use h2
* Server certificate:
*  subject: CN=api.fundebug.com
*  start date: Sep 15 16:38:43 2019 GMT
*  expire date: Dec 14 16:38:43 2019 GMT
*  subjectAltName: host "api.fundebug.com" matched cert's "api.fundebug.com"
*  issuer: C=US; O=Let's Encrypt; CN=Let's Encrypt Authority X3
*  SSL certificate verify ok.
* Using HTTP2, server supports multi-use
* Connection state changed (HTTP/2 confirmed)
* Copying HTTP/2 data in stream buffer to connection buffer after upgrade: len=0
* Using Stream ID: 1 (easy handle 0x7fcfbb80ce00)
> OPTIONS /api/members/login HTTP/2
> Host: api.fundebug.com
> User-Agent: curl/7.54.0
> Accept: */*
>
* Connection state changed (MAX_CONCURRENT_STREAMS updated)!
* http2 error: Invalid HTTP header field was received: frame type: 1, stream: 1, name: [content-length], value: [0]
* HTTP/2 stream 1 was not closed cleanly: PROTOCOL_ERROR (err 1)
* Closing connection 0
* TLSv1.2 (OUT), TLS alert, Client hello (1):
curl: (92) HTTP/2 stream 1 was not closed cleanly: PROTOCOL_ERROR (err 1)
```

根据curl的报错信息，可知是Header中content-length有问题：

```bash
* http2 error: Invalid HTTP header field was received: frame type: 1, stream: 1, name: [content-length], value: [0]
```

将Nginx配置文件中OPTIONS请求的Content-Length配置注释掉，问题就解决了：

```nginx
if ($request_method = "OPTIONS")
{
    add_header Access-Control-Allow-Origin *;
    add_header 'Access-Control-Max-Age' 86400;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, OPTIONS, DELETE';
    add_header 'Access-Control-Allow-Headers' 'token, reqid, nid, host, x-real-ip, x-forwarded-ip, event-type, event-id, accept, content-type';
    # add_header 'Content-Length' 0; // 必须注释，否则HTTP/2会报错
    add_header 'Content-Type' 'text/plain, charset=utf-8';
    return 200;
}
```

HTTP/2中对于Header有特殊处理，这应该是导致出错的根本原因，关于这一个问题，我会在下一篇博客中详细介绍。


### 4. 升级HTTP/2真的提高性能了吗？

理论上来说，HTTP/2应该可以提高网站性能，但是实际情况是怎样呢？HTTP/2真的可以提高性能了吗？如果有的话，究竟提高了多少呢？

于是，我使用Chrome记录了升级HTTP/2前后[Fundebug首页](https://www.fundebug.com/)的加载时间，计算了5次加载的平均时间(单位为妙)，如下表：

| **HTTP版本** | **DOMContentLoaded** | **Load** | **Finish** |
| -------- | -------------------- | -------- | ---------- |
| HTTP/1.1 | 1.572                | 4.342    | 5.138      |
| HTTP/2   | 1.0004               | 4.102    | 4.288      |

可知，HTTP/2明显提高了首页加载时间，DOMContentLoaded、Load与Finish时间均有明显提高。

一共也就改了2行Nginx配置，就可以提高页面访问性能，多好啊！

### 参考

- [Module ngx_http_v2_module](http://nginx.org/en/docs/http/ngx_http_v2_module.html)
- [HTTP/2 Frequently Asked Questions](https://http2.github.io/faq/)
- [HTTP的前世今生](https://coolshell.cn/articles/19840.html)
- [The HTTP/2 Module in NGINX](https://www.nginx.com/blog/http2-module-nginx)
- [HTTP/2: the difference between HTTP/1.1, benefits and how to use it](https://medium.com/@factoryhr/http-2-the-difference-between-http-1-1-benefits-and-how-to-use-it-38094fa0e95b)
- [HPACK: the silent killer (feature) of HTTP/2](https://blog.cloudflare.com/hpack-the-silent-killer-feature-of-http-2/)
- [浅谈 HTTP/2 Server Push](https://zhuanlan.zhihu.com/p/26757514)