---

title: Fundebug更换JS插件域名

date: 2018-01-05 10:00:00

tags: [Fundebug]

---

**摘要：** 各位[Fundebug](https://fundebug.com/)老用户，请尽快更换JS插件域名！！！将**og6593g2z.qnssl.com**替换为**js.fundebug.cn**。

<!-- more -->

#### Chrome 66拉黑Symantec证书

Google一向比较任性，于是，Chrome[宣布](https://security.googleblog.com/2017/09/chromes-plan-to-distrust-symantec.html)，它们将拉黑[Symantec](https://www.symantec.com/)的证书：

> Starting with Chrome 66, Chrome will remove trust in Symantec-issued certificates issued prior to June 1, 2016. Chrome 66 is currently scheduled to be released to Chrome Beta users on March 15, 2018 and to Chrome Stable users around April 17, 2018.

也就是说，Chrome 66将不再信任Symantec在2016年6月1号之前发布的HTTPS证书，而Chrome 66将在2018年4月17号正式发布。

#### 某CDN的证书被Chrome 66中招

以前，[Fundebug](https://fundebug.com/)的JavaScript监控插件使用的是某CDN厂商提供的域名以及HTTPS证书：

```
https://og6593g2z.qnssl.com/fundebug.0.3.3.min.js
```

而**og6593g2z.qnssl.com**的证书不幸被Chrome拉黑。

对于Fundebug老用户，如果你是采用script标签接入Fundebug，并且使用了**og6593g2z.qnssl.com**域名的话。则现在可以在Chrome控制台会看到这样的Warning信息：

> The SSL certificate used to load resources from https://og6593g2z.qnssl.com will be distrusted in M66. Once distrusted, users will be prevented from loading these resources. See [https://g.co/chrome/symantecpkicerts](https://g.co/chrome/symantecpkicerts) for more information.

可知，**Chrome 66用户将无法正常加载Fundebug插件!!!**

#### 请尽快更换JS插件域名

为了保证服务质量，我们果断更换了CDN厂商，绑定了**js.fundebug.cn**域名，并且申请了新的HTTPS证书。

各位[Fundebug](https://fundebug.com/)老用户，如果您是采用**script**接入插件的，请尽快更换JS插件域名！！！将**og6593g2z.qnssl.com**替换为**js.fundebug.cn**：

```
<script src="https://js.fundebug.cn/fundebug.0.3.3.min.js" apikey="API-KEY"></script>
```

为了保证兼容性，之前部署在**og6593g2z.qnssl.com**的各个版本插件将继续提供服务。但是，新版本的插件都将使用**js.fundebug.cn**域名。

由于更换插件域名所造成的困扰，Fundebug团队深表歉意！


#### 参考 

- [Chrome’s Plan to Distrust Symantec Certificates](https://security.googleblog.com/2017/09/chromes-plan-to-distrust-symantec.html)

<div style="text-align: center;">
<img style="width:30%;" src="https://blog.fundebug.com/images/qq_bug.JPG" />
</div>