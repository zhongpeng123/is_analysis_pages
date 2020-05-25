//layui是按照模块进行划分的，使用哪个就导入哪个
layui.use(['laydate', 'laypage', 'layer', 'table',"upload","form"], function() {
    var laydate = layui.laydate //日期
        , laypage = layui.laypage //分页
        , layer = layui.layer //弹层
        , table = layui.table //表格
        , upload = layui.upload //上传
        , $ = layui.$//jquery模块,
        , form = layui.form//表单模块
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
        
        ,totalRow: true //开启合计行
        ,cols: [[ //表头
            //如果想要获取的后台数据能够正确渲染到页面上
            // 需要field的值要跟实体类中的name一致
            //sort :是否开启当前列排序
            //width:每列的宽度，如果不写就是完整的自适应
            {type: 'checkbox', fixed: 'left'}
            ,{field: 'id', title: '图书id',  sort: true}
            ,{field: 'username', title: '作者',sort:true}
            //edit:true:单元格编辑类型  默认时false，可以单独修改某一个单元格
            ,{field: 'videoDesc', title: '出版社',edit:true}
            ,{field: 'videoPath', title: '图书简介',templet:"#play_video"
            }
            ,{field: 'coverPath', title: '图书封面',width:120,height:200
                ,templet:function(d){
                    return "<img src='/"+d.coverPath+"' style='width: 300px;height: 300px;'/>"
                }
            }
            //unresize:true设置为true，代表不能拖动，默认是false，都能拖动
            ,{field: 'status',width:80, title: '是否订阅',unresize:false}
            ,{fixed: 'right',toolbar: '#barDemo'}
        ]]
    });
    
