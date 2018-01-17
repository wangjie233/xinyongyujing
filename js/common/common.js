var URL = 'http://192.168.200.192:8022/';
/***
 * ajax的get请求
 * @param url 请求的url
 * @param type 请求的类型
 * @param params 请求参数
 * @param successBack 成功之后的回调函数
 * @param errorBack 失败之后的回调函数
 */
function ajax(type,wUrl,params,callBack,errorFn) {
  $.ajax({
    url: URL + wUrl,
    type: type,
    data: params ? JSON.stringify(params) : null,
    dataType: 'json',
    contentType: "application/json",
    crossDomain: true == !(document.all),
    success: function (res) {
      if(callBack) callBack(res);
    },
    error: function (err) {
      if(errorFn) errorFn(err);
    }
  })
}

/***
 * 去空格
 * @returns {string}
 */
String.prototype.trim=function() {
    return this.replace(/(^\s*)|(\s*$)/g,'');
};
/**
 * 多出字符串长度用...代替
 * @param num 截取长度
 * @returns {string}
 */
String.prototype.strEllipsis=function(num) {
    return this.substring(0,num)+'...';
};

/*
 tab切换
 
 * */
function getEle(id,callBack){
  $('#'+id+' em').on('click',function () {
    $('#'+id+' em').removeClass('tab-checked');
    $(this).addClass('tab-checked');
    callBack($(this).attr('data-value'));
  })
}

//千位符格式化
function toThousands(num) {
  var num = (num || 0).toString(), result = '';
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result;
    num = num.slice(0, num.length - 3);
  }
  if (num) { result = num + result; }
  return result;
}

function noData(id) {
  $("#"+id).html('');
  $("#"+id).append('<div class="noData">暂无数据</div>');
}