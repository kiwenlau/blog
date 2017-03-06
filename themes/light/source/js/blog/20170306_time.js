$(document).ready(function() {
   
   var title = {
      text: 'jQuery is not defined错误统计'   
   };

   var tooltip = {
        dateTimeLabelFormats: {
            day: '%Y-%m-%d'
        },
        pointFormat: '错误个数: <b>{point.y}</b>'
   };

   var credits = {
        text: 'https://fundebug.com',
        href: 'https://fundebug.com',
        style: { "cursor": "pointer", "color": "#0432FF", "fontSize": "10px" }
   };

   var xAxis ={
        type: 'datetime',
        dateTimeLabelFormats: {
            month: '%Y-%m'
        }
    };

   var yAxis =  {
       title: {
         text: '错误个数'
      },
   };

   var series = [{
        data: [0,25,10,4,0,0,0,5,0,0,0,2,0,4,0,3,0,0,0,0,0,5,0,0,0,0,0,5,5,0,5,0,0,5,0,30,0,0,7,9,0,0,20,5,0,0,0,0,5,1,0,5,45,10,0,0,45,20,0,8,5,30,20,15,0,0,10,1,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,5,0,5,0,5,0,5,0,0,0,0,0,0,0,0,5],
        pointStart: Date.UTC(2016, 10, 11),
        pointInterval: 24 * 3600 * 1000, // 1天
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