/*global $, AV, location*/

var Counter = AV.Object.extend("Counter");

function addCount(title, url)
{
    var query = new AV.Query(Counter);
    query.equalTo("url", url);
    query.find(
    {
        success: function(results)
        {
            if (results.length > 0)
            {
                // 数据库中已存在该链接时，pv加1
                var counter = results[0];
                counter.increment("pv");
                counter.save(null,
                    {
                        fetchWhenSave: true
                    });
            }
            else
            {
                // 数据库中不存在该链接，新建数据
                var newcounter = new Counter();
                newcounter.set("title", title);
                newcounter.set("url", url);
                newcounter.set("pv", 1);

                newcounter.save(null,
                    {
                        fetchWhenSave: true
                    });
            }
        }
    });
}

$(function()
{
    // 获取博客的标题和链接
    var title = $('header').children("h1.title").text().trim();
    var url =  $(location).attr("href").trim();

    // 只有博客页面有css样式copyright
    // 本地访问时，不记录访问量
    if ($('.copyright').length === 1 && url.indexOf("4000") === -1) addCount(title, url);

    var query = new AV.Query(Counter);
    query.descending("pv");
    query.limit(10);
    query.find(
    {
        success: function(results)
        {
            for (var i = 0; i < results.length; i++)
            {
                var counter = results[i];
                var title = counter.get("title");
                var url = counter.get("url");
                $('.popularlist').append('<li><a href="' + url + '">' + title + '</a></li>');
            }
        }
    });
});
