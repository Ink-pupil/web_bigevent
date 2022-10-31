$(function(){
    getUserInfo()

    var layer=layui.layer

    // 实现退出功能
    $('#btnLogout').on('click',function(){
        layer.confirm('确定退出登录？',{icon:3,title:'请确认'},function(index){
            // 与登录功能相反
            // 清除本地存储
            localStorage.removeItem('token')
            // 回到登录页
            location.href='/login.html'

            layer.close(index)
        })
    })
})

// 获取用户的基本信息
function getUserInfo(){
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        success:function(res){
            if(res.status!==0){
                return layui.layer.msg('获取用户信息失败！')
            }
            renderAvatar(res.data)
        }
    })
}
function renderAvatar(user){
    var name=user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;'+name)
    if(user.user_pic!==null){
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide()
    }else{
        $('.layui-nav-img').hide()
        var first=name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}