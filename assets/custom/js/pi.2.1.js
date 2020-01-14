
var message_fb_notify = null
var fileApprovalStatus = 0

if(current_role != 'pm'){
  window.localStorage.clear();
  window.location = '../'
}

console.log(current_user);

$(function(){
  $('#fbReset').click(function(){
    swal({   title: "คำเตือน!",
         text: "ปุ่มนี้ใช้กับโครงการที่พร้อมเข้าประชุม Fullboard เท่านั้น",
         type: "warning",
         showCancelButton: true,
         confirmButtonColor: "#DD6B55",
         confirmButtonText: "ยืนยัน",
         cancelButtonText: "ยกเลิก",
         closeOnConfirm: false,
         closeOnCancel: true },
         function(isConfirm){
             if (isConfirm) {

              preload.show()

              var param = {
                id_rs: $('#textId_rs').val(),
                id: current_user
              }

              var jxr = $.post(conf.api + 'staff/reset_fb_agender.php', param, function(){})
                          .always(function(resp){
                            if(resp == 'Y'){
                              window.location.reload()
                            }else{
                            swal("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมููลได้", "error")
                            preload.hide()
                            }
                          })
             }
        });
  })
})
