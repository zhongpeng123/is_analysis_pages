//layui是按照模块进行划分的，使用哪个就导入哪个
layui.use(['laydate', 'laypage', 'layer', 'table',"upload","form"], function() {
    var laydate = layui.laydate //日期
        , laypage = layui.laypage //分页
        , layer = layui.layer //弹层
        , table = layui.table //表格
        , upload = layui.upload //上传
        , $ = layui.$//jquery模块,
        , form = layui.form//表单模块
    //向世界问个好
    layer.msg('我可太牛了');
    //执行一个 table 实例
    var video_table = table.render({
        elem: '#videolist'//表格的id
        ,height: 600//表格的高度
        ,url: '/video/videolist'//获取视频列表的后台接口(异步的)
        // 借助parseData 回调函数将其解析成 table 组件所规定的数据格式
        ,parseData: function(res){ //res 后端返回给前端的数据(响应)
            return {
                "code": res.status, //解析接口状态
                "msg": res.message, //解析提示文本
                "count": res.total, //解析数据长度
                "data": res.item //解析数据列表
            };
        }
        ,title: '视频列表'
        //设置开启分页之后，其实会帮我向后台传两个参数
        //默认值：page=1   limit=10;
        ,page: true
        ,limit:10
        ,toolbar: '#head-option' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
        ,totalRow: true //开启合计行
        ,cols: [[ //表头
            //如果想要获取的后台数据能够正确渲染到页面上
            // 需要field的值要跟实体类中的name一致
            //sort :是否开启当前列排序
            //width:每列的宽度，如果不写就是完整的自适应
            {type: 'checkbox', fixed: 'left'}
            ,{field: 'id', title: '视频id',  sort: true}
            ,{field: 'username', title: '发布者',sort:true}
            //edit:true:单元格编辑类型  默认时false，可以单独修改某一个单元格
            ,{field: 'videoDesc', title: '视频简介',edit:true}
            ,{field: 'videoPath', title: '视频内容',templet:"#play_video"
            }
            ,{field: 'coverPath', title: '视频封面',width:120,height:200
                ,templet:function(d){
                    return "<img src='/"+d.coverPath+"' style='width: 300px;height: 300px;'/>"
                }
            }
            //unresize:true设置为true，代表不能拖动，默认是false，都能拖动
            ,{field: 'status',width:80, title: '是否发布',unresize:false}
            ,{field: 'createTime', title: '创建时间',sort:true,
                templet:function(d){
                    return showTime(d.createTime)
                }
                }
            ,{fixed: 'right',toolbar: '#barDemo'}
        ]]
    });
    //监听头工具栏事件
    //监听的table标签中的lay-filter的取值
    table.on('toolbar(videoTable)', function(obj){
        var checkStatus = table.checkStatus(obj.config.id)//表格的id
            ,data = checkStatus.data; //获取选中的数据(将数据封装成对象给你返回)
        //定义存放被删除id的数组
        var ids = [];
        //遍历data，取出选中的对象的id存放到数组中
        for(var i=0;i<data.length;i++){
            //数组添加数据：push
            ids.push(data[i].id);
        }
        console.log(ids);
        //obj.event:是点击对应按钮的lay-event的取值
        switch(obj.event){
            case 'upload':
                layer.open({
                    //0（信息框，默认）1（页面层）2（iframe层)
                    type:2,
                    content:"/video/add_video_page",
                    area:["60%","60%"],//控制宽高
                    shadeClose:true,//点击外部窗口关闭
                    shade:0.8//弹层外区域透明度取值
                })
                break;
            case 'delete':
                if(data.length === 0){
                    layer.msg('请选择一行');
                } else {
                    //将选中的id数组传递到后台，删除
                    $.ajax({
                        url:"/video/deleteBatch",//后台删除的接口
                        type:"post",
                        data:{
                            //id数组
                            "ids":ids
                        },
                        //直接传输数组，需要将traditional设置为true
                        traditional:true,
                        //后台成功之后的回调函数
                        success:function(res){
                            if(res.status==200){
                                //index：layui便于记录弹框的索引
                                layer.alert(res.item,function(index){
                                    layer.close(index);//关闭弹框
                                    //重载表格
                                    video_table.reload();
                                })
                            }
                        }
                    })
                }
                break;
        };
    });


    //监听行工具事件
    table.on('tool(videoTable)', function(obj){ //注：tool 是工具条事件名，test是table lay-filter="对应的值"
        var data = obj.data //获得当前行数据
            ,layEvent = obj.event; //获得 lay-event 对应的值
        if(layEvent === 'detail'){
            layer.msg('查看操作');
        } else if(layEvent === 'del'){
            layer.confirm('真的删除行么', function(index){
                    obj.del(); //前端表格的效果：将当前行删除，实际上重新刷新还是存在的
                    layer.close(index);//关闭窗口
                //向服务端发送删除指令
                $.ajax({
                    url:"",//后台删除的接口
                    type:"post",
                    data:{
                        id:data.id//要删除行的id
                    },
                    success:function(){

                    }
                })
            });
        } else if(layEvent === 'edit'){
            layer.msg('编辑操作');
        }
    });

    //监听单元格编辑
    // edit:对单元格的编辑操作
    //videoTable:被修改的表格的lay-filter取值
    table.on('edit(videoTable)',function(obj){
        var value = obj.value,//获取修改后的值
            data = obj.data,//得到修改单元格所在行的所有值
            field = obj.field//获取被修改的字段(列)
        //去后台更新数据
        $.ajax({
            url:"/video/updateById",//后台更新数据的接口
            type:"post",
            data:{
                "vid":data.id,//被修改的视频id
                "value":value,//被修改之后的值
                "field":field//被修改的字段名
            },success:function(){

            }

        })
    })

    //上传视频
    upload.render({
        elem: '#choosevideo' //上传按钮的id值
        ,url: '/video/upload/' //后台的上传接口
        ,accept:'video'//指定上传文件的类型 (默认值是图片)
        ,field:"uploadFile"//指定文件域的字段名(跟后台MultipartFile保持一致)
        ,auto:true //auto取值true，选择完自动上传，
        // 如果为false,需要bindAction 参数来指向一个其它按钮提交上传
        ,data:{
            parentName:"video"
        }
        ,done: function(res){//上传完毕回调   res:后端根据请求给出的响应
            if(res.status==200){
                //给videopath标签赋值
                $("#videoPath").val(res.item);
                //显示删除视频按钮
                $("#delvideo").show();//显示标签:show
                //上传视频按钮变为不可点击的状态
                //添加不能点击的类选择器，只是样式而已，还是可以点
                $("#choosevideo").addClass("layui-btn-disabled");
                $("#choosevideo").attr("disabled",true);
            }
        }
        ,error: function(){
            layer.msg("网络延迟，上传失败")
        }
    });

    //上传图片
    upload.render({
        elem: '#chooseimg' //上传按钮的id值
        ,url: '/video/upload/' //后台的上传接口
        ,field:"uploadFile"//指定文件域的字段名(跟后台MultipartFile保持一致)
        ,auto:true //auto取值true，选择完自动上传，
        // 如果为false,需要bindAction 参数来指向一个其它按钮提交上传
        ,data:{
            parentName:"img"
        }
        ,done: function(res){//上传完毕回调   res:后端根据请求给出的响应
            if(res.status==200){
                //给coverPath标签赋值
                $("#coverPath").val(res.item);
                //显示删除视频按钮
                $("#delimg").show();//显示标签:show
                //上传视频按钮变为不可点击的状态
                //添加不能点击的类选择器，只是样式而已，还是可以点
                $("#chooseimg").addClass("layui-btn-disabled");
                $("#chooseimg").attr("disabled",true);
            }
        }
        ,error: function(){
            layer.msg("网络延迟，上传失败")
        }
    })
    //点击删除按钮触发(删除视频、图片)
    $(".remove-upload").click(function(){
        // this:当前对象  获取当前删除按钮的id，来确定是视频啊还是图片啊
        var id = $(this).attr("id");
        //定义变量存储向后台传递的被删除文件的路径
        var removeTarget = "";
        //定义变量存储上传文件的按钮
        var uploadButton = "";
        //定义存储上传路径的标签
        var showPath = "";
        if(id=="delvideo"){
            //删除视频
            removeTarget = $("#videoPath").val();
            uploadButton = $("#choosevideo")//上传视频的按钮
            showPath = $("#videoPath")//显示视频路径的标签
        }else if(id="delimg"){
            //删除图片
            removeTarget = $("#coverPath").val();
            uploadButton = $("#chooseimg")//上传图片的按钮
            showPath = $("#coverPath")//显示图片路径的标签
        }
        //使用ajax异步删除文件
        $.ajax({
            type:"post",
            url:"/video/removeFile",
            data:{
                removeTarget:removeTarget
            },success:function(res){
                layer.msg(res.item);
                //隐藏删除标签
                $("#"+id).hide()
                //上传的按钮恢复为可点击的状态
                uploadButton.attr("disabled",false);
                uploadButton.removeClass("layui-btn-disabled");
                //清空当前被删除视频的路径
                showPath.val("");
            }
        })
    })

    //监听submit提交
    //submit(submit_video):他是submit按钮的lay-filter取值
    form.on('submit(submit_video)', function(data){
        console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
        console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
        console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        // return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        //刷新父窗口
        window.parent.location.reload();
    });

    //点击播放视频触发的方法
    //layui里面调用事件的自定义方法
    window.play = function(videoPath){
        //视频标签字符串
        var loadVideo = "<video width='100%' height='100%' controls='controls' autoplay='autoplay'>"
            +"<source src='/"+videoPath+"' type='video/mp4'>"+"</source></video>"
        layer.open({
            type:1,//页面层
            content:loadVideo,
            area:["90%","90%"]
        })
    }

    //时间的实例化
    //执行一个laydate实例
    laydate.render({
        elem: '#timerange', //指定元素
        range:"~",//定义分割字符
        type:"date" //date:日期   datetime:日期和时间
    });
    //根据日期和关键字进行搜索
    $("#search").click(function(){
        //为了搜索之后便于重新渲染表格数据，我们使用重载(因为很方便😊(●'◡'●))
        //这里以搜索为例
        video_table.reload({
            where: { //设定异步数据接口的额外参数，任意设
                timerange:$("#timerange").val(),
                keyword:$("#keyword").val()
            }
            ,page: {
                curr: 1 //重新从第 1 页开始
            },
            url:"/video/search"
        });
    })
})

