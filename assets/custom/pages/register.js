$(function(){
  $('.register-form').submit(function(){
    $check = 0
    $('.form-control').removeClass('is-invalid')
    if($('#txtFname').val() == ''){ $('#txtFname').addClass('is-invalid'); $check++; }
    if($('#txtLname').val() == ''){ $('#txtLname').addClass('is-invalid'); $check++; }
    if($('#txtEmail').val() == ''){ $('#txtEmail').addClass('is-invalid'); $check++; }
    if($('#txtPassword').val() == ''){ $('#txtPassword').addClass('is-invalid'); $check++; }
    if($check != 0){ return ; }
    preload.show()
    var param = { fname: $('#txtFname').val(), lname: $('#txtLname').val(), email: $('#txtEmail').val(), password: $('#txtPassword').val() };
    var jxr = $.post(conf.api + 'authentication?stage=register', param, function(){})
               .always(function(resp){
                 if(resp == 'Y'){
                   window.location = 'register-result?stage=success'
                 }else if(resp == 'Duplicate'){
                   window.location = 'register-result?stage=duplicate'
                 }else{
                   window.location = 'register-result?stage=fail'
                 }
               })
  })
})
