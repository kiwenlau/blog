---

title: MongoDB裸奔，2亿国人求职简历泄漏！

date: 2019-01-12 10:00:00

tags: [新闻, MongoDB]

keywords: MongoDB, 安全, 黑客

description: MongoDB裸奔，2亿国人求职简历泄漏！

---

**摘要：** 数据库不能裸奔。

<!-- more -->

**2018-01-12 Fundebug快讯**

根据安全站点HackenProof的[报告](https://blog.hackenproof.com/industry-news/202-million-private-resumes-exposed/)，由于MongoDB数据库没有采取任何安全保护措施，导致共计202,730,434份国人求职简历泄漏。其中，简历中包含姓名、性别、生日、手机号码、微信、学历等各种隐私数据。

![](https://image.fundebug.com/2019-01-12-resume.png)

通过对比简历的数据模式，发现GitHub项目[xzfan/data-import](https://github.com/xzfan/data-import)(改项目已被删除)疑似为收集这些简历数据的爬虫。该爬虫会收集来自58同城等各个求职平台的简历。58同城否认数据泄漏来自他们，认为是第三方爬虫泄漏了简历数据：

> We have searched all over the database of us and investigated all the other storage, turned out that the sample data is not leaked from us. It seems that the data is leaked from a third party who scrape data from many CV websites.

目前，泄漏数据的MongoDB数据库已经无法访问，但是通过日志发现，有数十个IP曾经访问过该数据库，这意味着简历数据可能已经被黑客窃取。





