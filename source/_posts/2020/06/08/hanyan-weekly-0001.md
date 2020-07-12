---
title: 《寒雁周刊》第1期

date: 2020-06-08 10:00:00

tags: [寒雁周刊]

keywords: 寒雁周刊

description: 寒雁周刊
---

**摘要：** 阅读 & 思考

<!-- more -->

时间：2020-06-01 ~ 2020-06-05


# 摘要
本期分享3篇技术博客，1部纪录片以及1个podcast。


虽然我并不熟悉Vue，竟然有3篇内容是关于Vue的，成功被尤大圈粉了！不同框架的技术细节确实不同，但是这并不重要，因为框架背后的技术基础和编程思想都是一致。如果面试者或者面试官过于看重框架，这是舍本逐末。


我从来都不看翻译，因为99%的翻译都不怎么样，所以我分享的内容有3篇是英文的。优秀的技术翻译者需要技术足够好，英文足够好，写作水平足够好，这3点很难同时做到。另外，程序员还是得努力提高英语水平啊，如果还需要Google翻译，或者写issue的时候用中式英语，那还是多看点英文内容吧。

写这篇周刊的时候还有一个深刻的体会，真正的技术创新思想都是很简单的，可以一句话讲清楚：

- 为什么Vite比Webpack更快?
- 为什么要重写Vue？
- 为什么JavaScript应用领域越来越广？
- 如何解决node_modules的问题?
- 为什么Vue会出现？



# [140: Evan You - Reimagining the Modern Dev Server with Vite](https://www.fullstackradio.com/episodes/140)


改了一行前端代码之后，却需要等待好几秒钟才能看到更新，这个问题我想大部分前端都遇到了，那应该如何解决？浏览器都支持ES Module了，干嘛还需要打包啊，直接跳过，Vite就是这么干的。虽然ES Module在前端生产环境下还没法用，但是用在开发环境还是不错的。


这大概就是真正的创新了，思想很简单，效果很明显，让人拍案叫绝：“我也这么想过，就差撸代码了：）”。如果你造的轮子很难让用户理解，很有可能你的轮子没啥用：你只是搬了个石头放在路中间，然后把石头搬开了。


Linus为了写Linux开发了Git，尤大为了写Vue开发了Vite，果然真正的高手都是自己造轮子给自己用。
# 
# [The process: Making Vue 3](https://increment.com/frontend/making-vue-3/)
在软件开发过程中，随着新技术的崛起（TypeScript），以及我们对软件本身更加深刻的理解，必然会让我们发现一些技术债，这时有必要进行适当的重构，而重构的前提是有足够的单元测试。


当技术债积累到一定程度的时候，重构比重写的代价更大，这时还不如重写，尤大就这么干了！Vue 3已经做了1年半了，看样子难度不小，应该是在积累大招吧：更快、更小。


很多人都在期待Vue 3早点发布，但是我觉得，这事慢一点挺好的。对于Breaking change，如果没有积累足够大的收益，不要这么做，写代码是为用户服务的，技术层面上代码写得再好，如果用户不爽了，也是做无用功。重写是为了长远利益，所以慢一点也是合理的。

Composition API的RFC刚出来的时候，由于没有说明清楚以及用户误会，造成大量恐慌和排斥，也从侧面证明了很多用户都是抗拒Breaking change的。写代码追求完美的技术方案是一件好事情，但绝不是自己写得开心就好，而是应该更多地从用户的角度去考虑问题。


前期的充分设计和讨论，后期提供足够升级文档及工具，来尽量降低切换成本。AngularJS 1到Angular 2，完全不同，也是把AngularJS 1的用户坑得够惨，前车之鉴还不远。


当然，Vue团队在文档方面做得非常好，这可以极大降低切换成本，期待吧，少年们！
# 
# [SpaceX 龙飞船中的新触控交互操作系统，意味着什么？](https://www.zhihu.com/question/396878847/answer/1261374042)


JavaScript 上天了！

SpaceX的Dragon 2飞船的触控界面是使用Web技术开发的，还是很炫酷的：

![spacex.jpeg](https://cdn.nlark.com/yuque/0/2020/jpeg/928098/1591495443660-82709abc-8623-4bfd-85a6-3de88bae422e.jpeg#align=left&display=inline&height=675&margin=%5Bobject%20Object%5D&name=spacex.jpeg&originHeight=675&originWidth=1020&size=114998&status=done&style=none&width=1020)

《火星援救》中马特达蒙改的大概是汇编代码，现在轮到JS了，想成为宇航员，先学一下JS，万一有BUG或者要发个求援信号怎么办：(

![p2385466069.jpg](https://cdn.nlark.com/yuque/0/2020/jpeg/928098/1591402598439-9e9de4a8-e971-4faf-844c-46dbf2d34eb8.jpeg#align=left&display=inline&height=720&margin=%5Bobject%20Object%5D&name=p2385466069.jpg&originHeight=720&originWidth=1280&size=103834&status=done&style=none&width=1280)
玩笑归玩笑，不过看起来龙飞船只是在UI界面上用到了JavaScript，飞船关键操作都有实体的开关或者按钮。


Chrome成为操作系统的梦想还没有实现，目测也很难实现，不过统一各种设备的UI层的趋势还是很明显的。
# [node_modules 困境](https://zhuanlan.zhihu.com/p/137535779)


Node.s作者Ryan Dahl对于Node.js最大的遗憾之一，就是node_modules，它的模块查找算法导致了各种各样的问题。

[node_modules 困境](https://zhuanlan.zhihu.com/p/137535779)这篇文章非常长，算是把node_nodules的问题讲得很清楚了，如果遇到NPM依赖相关的BUG，不妨参考一下这篇博客！如果你认真阅读这篇博客，可能会把你绕晕了，也有可能让你觉得Node.js已经无药可救了，其实也没那么阔怕：（


说来说去，node_modules的本质问题出在模块查找算法，它是一种隐式的（implicit）、不确定的（indeterminate）查找算法：开发者不需要指定模块版本，也不需要知道模块到底存储在哪个目录。


那么解决问题的方式也很简单，把查找算法改为显式的（explicit）、确定的（determinate）算法即可：


- 开发者必须指定模块的版本；
- 模块全部存在node_modules根目录下，不同版本的模块，使用不同的目录



这种方法简单粗暴，符合KISS原则(Keep It Simple, Stupid)，增加代码的确定性（我一直认为代码依赖应该是确定的，正如Dockerfile解决了代码执行环境的依赖问题）：
```javascript
const moment1=require("moment@1.7.2");
const moment2=require("moment@2.26.0");
```


```bash
 tree node_modules
node_modules
├── lodash@4.17.15
├── moment@1.7.2
└── moment@2.26.0
```


这只是我的一个初步idea，大家觉得怎么样？




# [Vue.js: The Documentary](https://www.youtube.com/watch?v=OrxmtDw4pVI)


这部纪录片讲述了Vue从诞生到发展壮大的历程，动人的故事，激励人心！作为程序员，有一个属于自己的产品，自己写的代码可以真正帮助到其他人，是一件很幸福的事情。


Vue这个名字挺好的，原来它是View的法语单词。


尤大写Vue的最初的idea，只是为了JavaScript对象与DOM同步，这样就不要手动去操作DOM了。计算机技术的发展本身就是一层层的抽象，简单点理解，要写的代码越来越少了。不妨想想，你写过几行汇编代码？

做过自己产品的人，会对尤大这句话深有同感：

> I feel like it is my baby.



下面的图片应该是尤大的House，这才是真正的房子啊：
![Vue.js_ The Documentary 0-35 screenshot.png](https://cdn.nlark.com/yuque/0/2020/png/928098/1591407253201-a6875be9-2b16-4d7e-b379-58bb77fdd338.png#align=left&display=inline&height=720&margin=%5Bobject%20Object%5D&name=Vue.js_%20The%20Documentary%200-35%20screenshot.png&originHeight=720&originWidth=1280&size=1286807&status=done&style=none&width=1280)


# 参考

- [Vue 3 – A roundup of infos about the new version of Vue.js](https://madewithvuejs.com/blog/vue-3-roundup)
- [SpaceX used JavaScript in Dragon Flight - But WHY?](https://www.youtube.com/watch?v=J5VECXgTpWk)
- [doodlewind：SpaceX 龙飞船中的新触控交互操作系统，意味着什么？](https://www.zhihu.com/question/396878847/answer/1261374042)
- [跟风吹了半天SpaceX，所以它的飞船到底牛在哪了？](https://www.pingwest.com/a/211762)

最后，欢迎大家关注我的微信公众号**寒雁Talk**。

### 招聘

阿里巴巴业务平台事业部招聘P6及以上前端大佬，参与最前沿的阿里前端生态系统，一起探索数据中台技术，拥抱未来，内推地址：hanyan.lk@alibaba-inc.com
