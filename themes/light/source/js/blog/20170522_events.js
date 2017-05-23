$(document).ready(function()
{

    var title = {
        text: 'Fundebug处理错误事件数统计'
    };

    var tooltip = {
        dateTimeLabelFormats:
        {
            day: '%Y-%m-%d'
        },
        pointFormat: '事件个数: <b>{point.y}</b>'
    };

    var credits = {
        text: 'https://fundebug.com',
        href: 'https://fundebug.com',
        style:
        {
            "cursor": "pointer",
            "color": "#0432FF",
            "fontSize": "10px"
        }
    };

    var xAxis = {
        type: 'datetime',
        dateTimeLabelFormats:
        {
            month: '%Y-%m'
        }
    };

    var yAxis = {
        title:
        {
            text: '事件个数'
        },
    };

    var series = [
    {
        // 时间向前平移了1个月
        data: [
            [Date.UTC(2016, 10, 11), 0],
            [Date.UTC(2016, 11, 11), 2374],
            [Date.UTC(2016, 12, 11), 10685],
            [Date.UTC(2017, 01, 11), 21210],
            [Date.UTC(2017, 02, 11), 44174],
            [Date.UTC(2017, 03, 11), 101689],
            [Date.UTC(2017, 04, 11), 2403952],
            [Date.UTC(2017, 05, 21), 10798349]
        ],
        showInLegend: false,
        color: "#90ED7D"
    }];

    var json = {};

    json.credits = credits;
    json.tooltip = tooltip;
    json.title = title;
    json.xAxis = xAxis;
    json.yAxis = yAxis;
    json.series = series;

    $('#timeContainer').highcharts(json);
});
