function showTime(tmpDate){
    //将毫秒数转换为对应的日期或者时间
    var d = new Date(tmpDate);
    var year = d.getFullYear();
    //月份是从0开始滴
    var month = d.getMonth();
    month++;
    var day = d.getDate();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    //三元运算符，对数值进行处理
    month = month<10?"0"+month:month;
    day = day<10?"0"+day:day;
    hours = hours<10?"0"+hours:hours;
    minutes = minutes<10?"0"+minutes:minutes;
    seconds = seconds<10?"0"+seconds:seconds;
    var time = year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
    return time;
}