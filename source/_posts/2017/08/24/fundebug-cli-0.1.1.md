---
title: 使用fundebug-cli批量上传Source Map

date: 2017-08-24 10:00:00

tags: [Fundebug]

---

**摘要：** [fundebug-cli](https://www.npmjs.com/package/fundebug-cli)是[Fudnebug](https://fundebug.com/)的命令行工具，可以用于批量上传Source Map文件。

<!-- more -->

[Fundebug支持使用Source Map还原真正的错误位置](https://blog.fundebug.com/2017/02/27/fundebug-support-sourcemap/)。这样的话，开发者能够迅速定位出错的源代码。另外，Fundebug还能够展示出错的代码块，帮助开发者更快地解决问题。

### 为什么需要批量上传？

如果希望使用Source Map功能的话，我们必须拿到Source Map文件。用户可以将Source Map文件挂载到自己的服务器，我们会自动下载；或者，用户也可以主动上传Source Map。

之前，我们一共提供了2种不同的上传方式：

- [前端UI上传](https://docs.fundebug.com/notifier/javascript/sourcemap/upload/ui.html)
- [API上传](https://docs.fundebug.com/notifier/javascript/sourcemap/upload/api.html)

通过前端UI上传Source Map文件的话，需要手动操作，而程序员偏爱用代码解决问题；因此，我们提供了一个上传Source Map文件的API接口，但是这个接口需要指定需要上传的Source Map的文件名，如果文件太多的话就比较麻烦了，除非使用代码去调用接口；于是我们实现了一个命令行工具，让用户可以批量上传Source Map文件：

- [fundebug-cli批量上传](https://docs.fundebug.com/notifier/javascript/sourcemap/upload/cli.html)



### 如何批量上传？

#### 安装fundebug-cli

请先安装[Node.js](https://nodejs.org/zh-cn/download/)

```
npm install fundebug-cli -g
```


若国外的NPM速度太慢的话，可以使用淘宝NPM镜像安装:

```bash
npm install fundebug-cli -g --registry=https://registry.npm.taobao.org
```

#### 批量上传Source Map

```
fundebug-cli upload --apikey "API-KEY" --directory dist/
```

- apikey: 获取**apikey**需要[免费注册](https://fundebug.com/team/create)帐号并且[创建项目](https://fundebug.com/project/create)
- directory: Source Map文件所在的目录，该目录中的.map文件将全部被上传

这样，用户只需要指定Source Map文件所在的目录，就可以方便地批量上传所有的Source Map文件。

```bash
fundebug-cli upload --apikey 12b40f3634eede54fb02a10b4034b2571c8f7d71dee9edbc60eba024678a1aa1  --directory dist/

上传成功: test01.js.map

上传成功: test02.js.map

上传成功: test03.js.map

上传成功: test04.js.map

上传失败: test05.js.map超过大小

上传成功: test06.js.map

所有Source Map文件上传成功!
```

### 参考链接

- [Fundebug支持Source Map](https://blog.fundebug.com/2017/02/27/fundebug-support-sourcemap/)
- [Source Map入门教程](https://blog.fundebug.com/2017/03/13/sourcemap-tutorial/)