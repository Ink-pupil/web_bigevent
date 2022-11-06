$(function(){
    var layer=layui.layer
    var form=layui.form
    // 导入layui中分页的方法
    var laypage=layui.laypage

    // 定义美化时间的过滤器，用template模板引擎操作
    template.defaults.imports.dataFormat=function(date){
        // 实例化一个时间
        const dt=new Date(date)
        // 定义年月日，时分秒
        var y=dt.getFullYear()
        // 月份从0开始
        var m=padZero(dt.getMonth()+1)
        var d=padZero(dt.getDate())
        var hh=padZero(dt.getHours())
        var mm=padZero(dt.getMinutes())
        var ss=padZero(dt.getSeconds())

        return y+'-'+m+'-'+d+' '+hh+':'+mm+':'+ss

    }
    // 定义一个补零的函数
    function padZero(n){
        return n>9?n:'0'+n
    }



    // 定义初始化函数
    // 根据文档，先定义发起请求时需要携带的查询参数
    var q={
        pagenum:1,
        pagesize:2,
        cate_id:'',
        state:''
    }
    // 初始化列表，调用初始化函数
    initTable()
    // 获取分类列表，调用分类初始化函数
    initCate()

    function initTable() {
        $.ajax({
          method: 'GET',
          url: '/my/article/list',
          data: q,
          success: function(res) {
            if (res.status !== 0) {
              return layer.msg('获取文章列表失败！')
            }
            // 使用模板引擎渲染页面的数据
            var htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
            // 调用渲染分页的方法
            renderPage(res.total)
          }
        })
      }

    // 分类初始化函数
    function initCate() {
        $.ajax({
          method: 'GET',
          url: '/my/article/cates',
          success: function(res) {
            if (res.status !== 0) {
              return layer.msg('获取分类数据失败！')
            }
            // 调用模板引擎渲染分类的可选项
            var htmlStr = template('tpl-cate', res)
            $('[name=cate_id]').html(htmlStr)
            // 通过 layui 重新渲染表单区域的UI结构
            form.render()
          }
        })
      }

    //   为筛选表单绑定submit事件，拿到输入的数据，在赋值给q的cate_id和state
    $('#form-search').on('submit',function(e){
        e.preventDefault()
        var cate_id=$('[name=cate_id]').val()
        var state=$('[name=state]').val()
        // 赋值，更改q的查询参数
        q.cate_id=cate_id
        q.state=state
        // 再次调用列表初始化函数
        initTable()

    })

    // 定义分页的方法，在拿到列表数据后进行渲染
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
          elem: 'pageBox', // 分页容器的 Id
          count: total, // 总数据条数
          limit: q.pagesize, // 每页显示几条数据
          curr: q.pagenum, // 设置默认被选中的分页
          layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
          limits: [2, 3, 5, 10],
          // 分页发生切换的时候，触发 jump 回调
          // 触发 jump 回调的方式有两种：
          // 1. 点击页码的时候，会触发 jump 回调
          // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
          jump: function(obj, first) {
            // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
            // 如果 first 的值为 true，证明是方式2触发的
            // 否则就是方式1触发的
            console.log(first)
            console.log(obj.curr)
            // 把最新的页码值，赋值到 q 这个查询参数对象中
            q.pagenum = obj.curr
            // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
            q.pagesize = obj.limit
            // 根据最新的 q 获取对应的数据列表，并渲染表格
            // initTable()
            if (!first) {
              initTable()
            }
          }
        })
      }

    // 因为条数是动态数据，所以只能通过代理的方式绑定事件
    $('tbody').on('click','.btn-delete',function(){
        // 获取当前页数据条数，也就是删除按钮的数目
        var len=$('.btn-delete').length
        // 获取文章的id，通过id来选定要删除的对象,之前就通过自定义属性data-id来为每一条数据绑定id
        var id=$(this).attr('data-id')

        // 询问是否确认删除数据，用layui.confirm()方法
        // 确认后调用ajax传入删除命令和相应的id参数，index是为了layer.close()准备
        layer.confirm('确认要删除吗？',{icon:3,title:'注意'},function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/delete/'+id,
                success:function(res){
                    if(res.status!==0){
                        return layer.msg('获取数据失败！')
                    }
                    layer.msg('删除数据成功！')
                    // 如果当前页面只有1条数据，删除后，页码要-1，而如果当前页码就是1，则不变
                    if(len===1){
                        q.pagenum=q.pagenum===1?1:q.pagenum-1
                    }
                    initTable()
                }
            })
            layer.close(index)
        })

    })
})