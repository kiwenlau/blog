$(document).ready(function()
{
    Highcharts.chart('ipContainer',
    {
        chart:
        {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title:
        {
            text: '错误IP地址统计'
        },
        tooltip:
        {
            pointFormat: '错误个数: <b>{point.y}</b>'
        },
        plotOptions:
        {
            pie:
            {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels:
                {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style:
                    {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        credits:
        {
            text: 'https://fundebug.com',
            href: 'https://fundebug.com',
            style:
            {
                "cursor": "pointer",
                "color": "#0432FF",
                "fontSize": "10px"
            }
        },
        series: [
        {
            name: 'Brands',
            colorByPoint: true,
            data: [
                {
                    name: "中国",
                    y: 295
                },

                {
                    name: "美国",
                    y: 74
                },
                {
                    name: "德国",
                    y: 5
                },
                {
                    name: "英国",
                    y: 5
                },
                {
                    name: "瑞典",
                    y: 5
                },
                {
                    name: "新加坡",
                    y: 10
                },
                {
                    name: "日本",
                    y: 5
                }
            ]
        }]
    });
});
