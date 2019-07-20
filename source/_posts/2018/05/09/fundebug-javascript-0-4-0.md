---

title: Fundebug：JavaScript插件支持错误采样

date: 2018-05-09 10:00:00

tags: [JavaScript, 产品更新]

keywords: JavaScript, BUG监控, 采样

description: Fundebug前端异常监控支持错误采样
---

**摘要：** [Fundebug](https://www.fundebug.com/)的JavaScript错误监控插件更新至[0.4.0](https://js.fundebug.cn/fundebug.0.4.0.min.js)，支持错误采样。

![](https://image.fundebug.com/2019-06-03-fundebug-javascript-upgrade.jpg)

<!-- more -->

Fundebug的[付费套餐](https://www.fundebug.com/price)主要是根据错误事件数制定的，这是因为每一个发送到我们服务器的事件，都会消耗一定的CPU、内存、磁盘以及带宽资源，尤其当错误事件数非常大时，会对我们的计算资源造成很大压力。

如果您希望采样收集错误，比如“只收集30%的错误”，可以将**sampleRate**属性设为0.3。这样的话，您可以选择更加合适套餐。

 **1. 在HTML中配置`<script>`标签中配置sampleRate属性**

 ```html
 <script src="https://js.fundebug.cn/fundebug.0.4.0.min.js" 
            apikey="API-KEY" 
            sampleRate=0.3></script>
 ```

 **2. 在JavaScript中配置sampleRate变量**

 ```js
 fundebug.sampleRate = 0.3;
 ```

注意，是否收集错误是完全随机的，因此理论上这样可能会导致一些错误不会被收集。因此，您需要自行权衡利弊，选择是否配置sampleRate以及配置多大的sampleRate。

另外，0.4.0的插件还支持[过滤特定属性不存在的错误](https://blog.fundebug.com/2018/05/10/fundebug-javascript-0-4-0/)。
