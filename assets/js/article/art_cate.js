$(function(){
    var form=layui.form
    var layer=layui.layer

    // 初始化文章类别
    // 调用初始化函数
    initArtCateList()

    // 定义初始化函数
    function initArtCateList(){
        // 获取后台数据
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                // 调用数据模板，渲染表格
                var htmlStr=template('tpl-table',res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加按钮绑定事件
    // 声明indexAdd,为了后面关闭弹出框
    var indexAdd = null
    $('#btnAddCate').on('click', function (){
        // 设置layer.open函数参数
        indexAdd = layer.open({         
             // 没有确定按钮的弹出层         
              type: 1,          
              area: ['500px', '250px'],         
               title: '添加文章分类',          
               content: $('#dialog-add').html()      
        })
    })

// 因为弹出框是动态生成的，无法直接绑定事件，采用委托代理的方式绑定
$('body').on('submit', '#form-add', function(e){
    // 阻止默认行为
    e.preventDefault()
    // 采用ajax上传数据
    $.ajax({      
        method: 'POST',      
        url: '/my/article/addcates',      
        data: $(this).serialize(),      
        success: function(res) {
            if (res.status !== 0) {          
                return layer.msg('新增分类失败！')        
            }
            // 新增分类成功，重新初始化数据
            initArtCateList()
            layer.msg('新增分类成功！')
            
            // 关闭弹窗，通过索引
            layer.close(indexAdd)
        }
    })
})

// 通过代理为btn-edit绑定事件
    var indexEdit=null
    $('tbody').on('click','.btn-edit',function(){
    // 弹出编辑框
    // 定义索引
    indexEdit=layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            // 内容在html中写
            content: $('#dialog-edit').html()
    })

    // 发起请求，更新修改数据
    // 通过id获取对应数据
    var id=$(this).attr('data-id')
    $.ajax({
        method:'GET',
        url:'/my/article/cates/'+id,
        success:function(res){
            // 通过form.val()函数获取数据,获取到的是对应id的某一条数据
            form.val('form-edit',res.data)
        }
    })
})

// 通过代理，为编辑分类的弹出框绑定submit事件
$('body').on('submit','#form-edit',function(e){
    e.preventDefault()
    $.ajax({
        method:'POST',
        url:'/my/article/updatecate',
        data:$(this).serialize(),
        success:function(res){
            if(res.status!==0){
                return layer.msg('更新分类数据失败！')
            }
            layer.msg('更新分类数据成功！')
            initArtCateList()
            layer.close(indexEdit)
        }
    })
})

// 通过代理，为删除按钮绑定点击事件，弹出确认框
$('tbody').on('click','.btn-delete',function(){
//    在html中自定义data-id属性，绑定数据与id，通过id找数据
    var id=$(this).attr('data-id')
    layer.confirm('确认删除？',{icon:3,title:'提示'},function(index){
        // 拿到选取的数据，确认是否删除
        $.ajax({
            method:'GET',
            url:'/my/article/deletecate/'+id,
            success:function(res){
                if(res.status!==0){
                    return layer.msg('删除分类失败！')
                }
                layer.msg('删除分类成功！')
                initArtCateList()
                layer.close(index)
            }
        })
    })

})





})


