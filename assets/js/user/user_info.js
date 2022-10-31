$(function(){
    var form=layui.form
    var layer=layui.layer

    // 自定义验证规则
    form.verify({
        nickname:function(value){
            if(value.length>6){
                return "昵称长度不超过6位字符！"
            }
        }
    })
    
initUserInfo()

function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败！')
        }
        // console.log(res)
        // 调用 form.val() 快速为表单赋值
        form.val('formUserInfo', res.data)
      }
    })
  }

// 重置表单数据
$('#btnReset').on('click',function(e){
    e.preventDefault()
    initUserInfo()
})

// 监听表单提交事件
$('.layui-form').on('submit',function(e){
    e.preventDefault()
    $.ajax({
        method:'POST',
        url:'/my/userinfo',
        data:$(this).serialize(),
        success:function(res){
            if(res.status!==0){
                return layer.msg('更新用户信息失败！')
            }
            layer.msg('更新用户信息成功！')
            window.parent.getUserInfo()
        }
    })
})
})
