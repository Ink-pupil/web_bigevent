$(function(){
    //密码规则验证
    var form=layui.form
    
    form.verify({
        // 所有密码长度有要求6-12位
        pwd:[/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
        // 新旧密码比较
        samePwd:function(value){
            if(value===$('[name=oldPwd]').val()){
                return '新旧密码不能相同！'
            }
        },
        // 新密码重复输入
        rePwd:function(value){
            if(value!==$('[name=newPwd]').val()){
                return '两次密码不一致！'
            }
        }

    })
      
    // 提交新密码，重置密码
    $('.layui-form').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/updatepwd',
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')

                // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })


})