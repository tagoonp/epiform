var authen = {
  signout(){
    window.localStorage.removeItem(conf.prefix + 'uid')
    window.localStorage.removeItem(conf.prefix + 'role')
    window.location = '../'
  },
  update_password(param){
    var xjr = $.post(conf.api + 'general/profile?stage=update_password', param, function(){})
               .always(function(resp){
                 if(resp == 'Y'){
                   preload.hide()
                   $('.btnCloseModal').trigger('click')
                   swal({
                      title: "รหัสผ่านถูกเปลี่ยนแล้ว",
                      text: "กดปุ่ม ตกลง เพื่อรีเฟรชข้อมูล",
                      type: "success",
                      showCancelButton: false,
                      confirmButtonColor: "#DD6B55",
                      confirmButtonText: "ตกลง",
                      closeOnConfirm: false },
                    function(){
                      window.location.reload()
                    });
                 }else{
                   preload.hide()
                   swal({
                      title: "ขออภัย",
                      text: "ไม่สามารถเปลี่ยนรหัสผ่านได้ กรุณาลองใหม่อีกครั้งภายหลัง",
                      type: "error",
                      showCancelButton: false,
                      confirmButtonColor: "#DD6B55",
                      confirmButtonText: "รับทราบ",
                      closeOnConfirm: true },
                    function(){
                      // window.location.reload()
                    });
                 }
               })
  },
  update_profile(param){
    var xjr = $.post(conf.api + 'general/profile?stage=update_profile', param, function(){})
               .always(function(resp){
                 console.log(resp);
                 if(resp == 'Y'){
                   preload.hide()
                   $('.btnCloseModal').trigger('click')
                   swal({
                      title: "ดำเนินการสำเร็จ",
                      text: "กดปุ่ม ตกลง เพื่อรีเฟรชข้อมูล",
                      type: "success",
                      showCancelButton: false,
                      confirmButtonColor: "#DD6B55",
                      confirmButtonText: "ตกลง",
                      closeOnConfirm: false },
                    function(){
                      window.location.reload()
                    });
                 }else{
                   preload.hide()
                   swal({
                      title: "ขออภัย",
                      text: "ไม่สามารถปรับปรุงข้อมูลได้ กรุณาลองใหม่อีกครั้งภายหลัง",
                      type: "error",
                      showCancelButton: false,
                      confirmButtonColor: "#DD6B55",
                      confirmButtonText: "รับทราบ",
                      closeOnConfirm: true },
                    function(){
                      // window.location.reload()
                    });
                 }
               })
  },
  update_contact(param){
    var xjr = $.post(conf.api + 'general/profile?stage=update_contact', param, function(){})
               .always(function(resp){
                 if(resp == 'Y'){
                   preload.hide()
                   $('.btnCloseModal').trigger('click')
                   swal({
                      title: "ดำเนินการสำเร็จ",
                      text: "กดปุ่ม ตกลง เพื่อรีเฟรชข้อมูล",
                      type: "success",
                      showCancelButton: false,
                      confirmButtonColor: "#DD6B55",
                      confirmButtonText: "ตกลง",
                      closeOnConfirm: false },
                    function(){
                      window.location.reload()
                    });
                 }else if(resp == 'D'){
                   preload.hide()
                   swal({
                      title: "ขออภัย",
                      text: "อีเมลนี้ถูกใช้แล้ว กรุณาลองด้านอีเมลอื่น หรือหากมีข้อสงสัยให้ติดต่อเจ้าหน้าที่",
                      type: "error",
                      showCancelButton: false,
                      confirmButtonColor: "#DD6B55",
                      confirmButtonText: "รับทราบ",
                      closeOnConfirm: true },
                    function(){
                      // window.location.reload()
                    });
                 }else{
                   preload.hide()
                   swal({
                      title: "ขออภัย",
                      text: "ไม่สามารถปรับปรุงข้อมูลได้ กรุณาลองใหม่อีกครั้งภายหลัง",
                      type: "error",
                      showCancelButton: false,
                      confirmButtonColor: "#DD6B55",
                      confirmButtonText: "รับทราบ",
                      closeOnConfirm: true },
                    function(){
                      // window.location.reload()
                    });
                 }
               })
  }
}
