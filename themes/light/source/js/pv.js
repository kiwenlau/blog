/*global $, AV, alert, location*/

function addCount(Counter)
{
    var url = $(location).attr("href").trim();
    var title = $('title').text().trim();
    var query = new AV.Query(Counter);
    query.equalTo("url", url);
    query.find(
    {
        success: function(results)
        {
            if (results.length > 0)
            {
                var counter = results[0];
                counter.increment("time");
                counter.save(null,
                    {
                        fetchWhenSave: true
                    })
                    .then(() =>
                    {
                        console.log("success");
                    })
                    .catch(function(err)
                    {
                        console.log(err);
                    });
            }
            else
            {
                console.log(title);
                var newcounter = new Counter();
                newcounter.set("title", title);
                newcounter.set("url", url);
                newcounter.set("time", 1);

                newcounter.save(null,
                    {
                        fetchWhenSave: true
                    })
                    .then(() =>
                    {
                        console.log("success");
                    })
                    .catch(function(err)
                    {
                        console.log(err);
                    });
                // newcounter.save(null,
                // {
                //     fetchWhenSave: true,
                //     success: function(newcounter)
                //     {
                //         console.log(newcounter);
                //         //alert('New object created');
                //     },
                //     error: function(newcounter, error)
                //     {
                //         console.log(err);
                //         alert('Failed to create');
                //     }
                // });
            }
        },
        error: function(error)
        {
            //find null is not a error
            console.log(error);
            alert('Error:' + error.code + " " + error.message);
        }
    });
}

$(function()
{
    var Counter = AV.Object.extend("Counter");
    //only increse visit counting when intering a page

    console.log($('title').text());

    if ($('title').length == 1) addCount(Counter);
    var query = new AV.Query(Counter);
    query.descending("time");
    // the sum of popular posts
    query.limit(10);
    query.find(
    {
        success: function(results)
        {
            console.log(results);
            for (var i = 0; i < results.length; i++)
            {
                var counter = results[i];
                var title = counter.get("title");
                var url = counter.get("url");
                var time = counter.get("time");
                // add to the popularlist widget
                var showcontent = title + " (" + time + ")";
                //notice the "" in href

                $('.popularlist').append('<li><a href="' + url + '">' + showcontent + '</a></li>');
            }
        },
        error: function(error)
        {
            alert("Error:" + error.code + " " + error.message);
        }
    });
});
