

title: Fundebug前端JavaScript插件更新至1.5.0，报错附带页面性能指标

date: 2018-12-04 10:00:00

tags: [Fundebug]

keywords: Fundebug, 前端, JavaScrip, BUG监控 

description: Fundebug前端JavaScript插件更新至1.5.0，报错附带页面性能指标

------

**摘要：** **1.5.0**将在报错数据中附带页面性能指标，辅助用户Debug。

<!-- more -->

![](https://image.fundebug.com/2018-12-04-js_upgrade.jpg)

### Performance

使用[Performance](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance)接口，可以获取页面的性能指标，如下：

```javascript
 {
     "redirectCount": 0,
     "type": "navigate",
     "loadEventEnd": 5707.200000004377,
     "loadEventStart": 5702.499999999418,
     "domComplete": 5702.499999999418,
     "domContentLoadedEventEnd": 2112.699999997858,
     "domContentLoadedEventStart": 2071.5999999956694,
     "domInteractive": 2071.5000000054715,
     "unloadEventEnd": 0,
     "unloadEventStart": 0,
     "serverTiming": [],
     "decodedBodySize": 6748,
     "encodedBodySize": 2365,
     "transferSize": 2792,
     "responseEnd": 221.79999999934807,
     "responseStart": 202.00000000477303,
     "requestStart": 164.79999999864958,
     "secureConnectionStart": 106.40000000421423,
     "connectEnd": 163.40000000491273,
     "connectStart": 70.69999999657739,
     "domainLookupEnd": 70.69999999657739,
     "domainLookupStart": 23.9000000001397,
     "fetchStart": 22.400000001653098,
     "redirectEnd": 0,
     "redirectStart": 0,
     "workerStart": 0,
     "nextHopProtocol": "http/1.1",
     "initiatorType": "navigation",
     "duration": 5707.200000004377,
     "startTime": 0,
     "entryType": "navigation",
     "name": "https://www.fundebug.com/"
 }
```

其中[domComplete](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming/domComplete)即为**html文档完全解析完毕的时间节点**，其他指标的含义如下图所示：

![](https://image.fundebug.com/2018-12-04-navigation-timing-attributes.png)

在Fundebug控制台的错误详情页面的Performance标签，即可看到收集的性能数据：

![](https://image.fundebug.com/2018-12-04-performance_tab.png)

另外，我们只是在报错的时候收集Performance指标，目的是辅助用户Debug。[Fundebug](https://www.fundebug.com/)目前专注于BUG监控，没有提供全方位的性能监控服务的打算。

### silentPerformance

如果你不需要报错的时候附带页面性能指标，则可以将[silentPerformance](https://docs.fundebug.com/notifier/javascript/customize/silentperformance.html)属性设为true。

- 在HTML中配置`<script>`标签中配置silentPerformance属性

```html
<script src="https://js.fundebug.cn/fundebug.1.5.0.min.js" 
            apikey="API-KEY" 
            silentPerformance=true></script>
```

- 在JavaScript中配置silentPerformance变量

```javascript
if ("fundebug" in window) {
   fundebug.silentPerformance = true;
}
```

### 参考

- [Fundebug文档 - silentPerformance](https://docs.fundebug.com/notifier/javascript/customize/silentperformance.html)

