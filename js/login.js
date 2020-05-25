layui.use(['form', 'layer', 'jquery'], function () {
    $ = layui.$;
    form = layui.form
    //登录操作(layui的表单提交)
    form.on("submit(login)",function(data){
        //data里面有form对象也有全部的表单字段
        $.ajax({
            type:"post",
            url:"/login",//自己登录校验的接口
            data:data.field,//将整个表单字段传到后台接口
            success:function(res){
                if(res.status==200){
                    layer.alert("登录成功");
                    //跳转到主页面
                    window.location.href = "/main";
                }else{
                    //验证码错误
                    //账户或密码错误
                    layer.alert(res.item);
                    //重新刷新验证码
                    window.changeCode();
                }
            }
        })
    })


    //重新生成验证码
    //layui的js里面自定义方法要加window.方法名
    window.changeCode = function(){
        //获取img验证码标签
        $("#codeImg").attr("src",'/getCode?time='+new Date().getTime())
    }








    //表单输入效果
    $(".loginBody .input-item").click(function (e) {
        e.stopPropagation();
        $(this).addClass("layui-input-focus").find(".layui-input").focus();
    })
    $(".loginBody .layui-form-item .layui-input").focus(function () {
        $(this).parent().addClass("layui-input-focus");
    })
    $(".loginBody .layui-form-item .layui-input").blur(function () {
        $(this).parent().removeClass("layui-input-focus");
        if ($(this).val() != '') {
            $(this).parent().addClass("layui-input-active");
        } else {
            $(this).parent().removeClass("layui-input-active");
        }
    })
})





