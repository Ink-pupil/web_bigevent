$(function(){
  // 去注册和去登陆的切换
  // 去注册账号链接
  $('#link_reg').on('click',function(){
    $('.login-box').hide()
    $('.reg-box').show()
  })
  // 去登陆账号链接
  $('#link_login').on('click',function(){
    $('.login-box').show()
    $('.reg-box').hide()
  })

  // 预验证，用layui的verify()函数
  var form=layui.form  //引入form模块
  var layer=layui.layer  //引入layer模块

  // form.verify()函数自定义校验规则
  form.verify({
    pwd:[/^[\S]{6,12}$/,'密码必须为6-12位，且不能出现空格'],

    repwd:function(value){
      // 通过value拿到确认密码框中的内容
      var pwd=$('.reg-box [name=password]').val()  //通过后代属性选择器，拿到密码框中的值
      if(pwd!==value){
        return '两次密码不一致！'
      }
    }
  })

//监听注册表单提交事件
$('#form_reg').on('submit',function(e){
// 阻止默认提交行为
  e.preventDefault()
  // 发起Ajax的post请求（看文档说明）
  var data={
    username:$('#form_reg [name=username]').val(),
    password:$('#form_reg [name=password]').val()
  }
  $.post('/api/reguser',data,function(res){
    if(res.status!==0){
      return layer.msg(res.message)
    }
    layer.msg('注册成功，请登录！')
    $('#link_login').click()
  })
})
//监听登录表单提交事件
$('#form_login').on('submit',function(e){
  // 阻止默认提交行为
    e.preventDefault()
    // 发起Ajax的post请求（看文档说明）
    $.ajax({
      url:'/api/login',
      method:'post',
      data:$(this).serialize(),
      success:function(res){
        if(res.status!==0){
          return layer.msg('登陆失败！')
        }
        layer.msg('登录成功！')
        localStorage.setItem('token',res.token)
        location.href='../../index.html'
      }
    })
  })
})