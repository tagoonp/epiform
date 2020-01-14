$(function(){
  $('.projectTitleForm').submit(function(){
    $check = 0
    $('.form-control').removeClass('is-invalid')
    if($('#txtThtitle').val() == ''){
      $('#txtThtitle').addClass('is-invalid')
      $check++
    }
    if($('#txtEntitle').val() == ''){
      $('#txtEntitle').addClass('is-invalid')
      $check++
    }

    if($check != 0){
      return ;
    }

    if(current_project == null){
      swal({   title: "คำเตือน!",
           text: "การส่งข้อมูลไม่ครบถ้วน กดต่อลงเพื่อกลับสู่หน้าหลัก",
           type: "warning",
           showCancelButton: false,
           confirmButtonColor: "#DD6B55",
           confirmButtonText: "ยืนยัน",
           cancelButtonText: "ยกเลิก",
           closeOnConfirm: false,
           closeOnCancel: true },
      function(isConfirm){
          window.location = 'index?uid=' + current_user + '&role=' + current_role
      });
    }

    var param = {
      uid: current_user,
      id_rs: current_project,
      role: current_role,
      title_th: $('#txtThtitle').val(),
      title_en: $('#txtEntitle').val()
    }

    swal({
      title: "คำเตือน!",
      text: "กรุณาตรวจสอบความถูกต้องก่อนดำเนินการ กดปุ่ม ยืนยัน เพื่อดำเนินการต่อ",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      closeOnConfirm: true,
      closeOnCancel: true
    },
    function(isConfirm){
      preload.show()
      var jxt = $.post(conf.api + 'staff/change_reseach_info?stage=updatetitle', param, function(){})
                 .always(function(resp){
                   setTimeout(function(){
                     if(resp == 'Y'){
                       preload.hide()
                       swal({
                         title: "ดำเนินการสำเร็จ",
                         text: "กด ตกลง เพื่อทำการรีโหลดข้อมูล",
                         type: "success",
                         showCancelButton: false,
                         confirmButtonColor: "#DD6B55",
                         confirmButtonText: "ยืนยัน",
                         cancelButtonText: "ตกลง",
                         closeOnConfirm: true,
                         closeOnCancel: true
                       },
                       function(isConfirm){
                         window.location.reload()
                       });
                     }else{
                       preload.hide()
                       swal("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมููลได้", "error")
                     }
                   }, 1000)
                 })
    });
  })
})
