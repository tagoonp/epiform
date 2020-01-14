$(function(){
  $('.login-form').submit(function(){
    $check = 0
    $('.form-control').removeClass('is-invalid')
    if($('#txtEmail').val() == ''){ $('#txtEmail').addClass('is-invalid'); $check++; }
    if($('#txtPassword').val() == ''){ $('#txtPassword').addClass('is-invalid'); $check++; }
    if($check != 0){ return ; }
    preload.show()
    var param = { email: $('#txtEmail').val(), password: $('#txtPassword').val() };
    var jxr = $.post(conf.api + 'authentication?stage=login', param, function(){}, 'json')
               .always(function(snap){
                 console.log(snap);
                 if(fnc.json_exist(snap)){
                   snap.forEach(i=>{
                     window.localStorage.setItem(conf.prefix + 'uid', i.UID)
                     window.localStorage.setItem(conf.prefix + 'role', i.primary_role)
                     window.location = '../core/' + i.primary_role + '/?uid=' + i.UID
                   })
                 }else{
                   preload.hide()
                   swal("System denine.", "Invalid e-mail address or password", "error")
                 }
               })
  })
})
