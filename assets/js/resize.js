$(window).on('load resize',function(){
  var wH = $(window).height();
  var wW = $(window).width();
  $('.mask').css('border-width','0 0 ' + wH + 'px ' + wW + 'px');
});
