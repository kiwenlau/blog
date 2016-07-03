//返回顶部
(function($) {
    
    // 显示返回顶部图标的位置
    var upperLimit = 100;

    // Our scroll link element
    var scrollElem = $('#totop');

    // 返回顶部的速度，数值越小速度越快
    var scrollSpeed = 500;

    // Show and hide the scroll to top link based on scroll position
    scrollElem.hide();
    $(window).scroll(function () {
        var scrollTop = $(document).scrollTop();
        if ( scrollTop > upperLimit ) {
            $(scrollElem).stop().fadeTo(300, 1); // fade back in
        }else{
            $(scrollElem).stop().fadeTo(300, 0); // fade out
        }
    });

    // Scroll to top animation on click
    $(scrollElem).click(function(){
        $('html, body').animate({scrollTop:0}, scrollSpeed); return false;
    });
})(jQuery);