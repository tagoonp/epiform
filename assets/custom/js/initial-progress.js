var ans_1 = '';
var ans_2 = '';
var ans_3 = '';
var ans_4 = '';

if($("#txtAnswer_1").length) {
    ans_1 = CKEDITOR.replace( 'txtAnswer_1', {
        wordcount : {
        showCharCount : false,
        showWordCount : true
        },
        height: '150px'
    });
}

if($("#txtAnswer_2").length) {
    ans_2 = CKEDITOR.replace( 'txtAnswer_2', {
        wordcount : {
        showCharCount : false,
        showWordCount : true
        },
        height: '150px'
    });
}

if($("#txtAnswer_3").length) {
    ans_3 = CKEDITOR.replace( 'txtAnswer_3', {
        wordcount : {
        showCharCount : false,
        showWordCount : true
        },
        height: '150px'
    });
}

if($("#txtAnswer_4").length) {
    ans_4 = CKEDITOR.replace( 'txtAnswer_4', {
        wordcount : {
        showCharCount : false,
        showWordCount : true
        },
        height: '100px'
    });
}

var initial = {
  getComment(){
    initial.getCommentContent(2)
    initial.getCommentContent(3)
    initial.getCommentContent(4)
  },
  getCommentContent(part){
    var param = {
      id_rs: current_project,
      part: part
    }
    var jxr = $.post(conf.api + 'staff/comment_manage?stage=get_comment', param, function(){})
               .always(function(resp){
                 $('.commentSpan' + part).html(resp)
                 preload.hide()
               })
  },
  getFileResearchContent(){
    var param = {
      id_rs: current_project,
      role: current_role
    }
    var jxr = $.post(conf.api + 'staff/file_research_attach?stage=get_all', param, function(){})
               .always(function(resp){
                 $('#fileResult').html(resp)
                 preload.hide()
               })
  },
  getFileApprovalStatus(){
    var param = {
      id_rs: current_project
    }
    var jxr = $.post(conf.api + 'staff/file_research_attach?stage=get_approve_status', param, function(){})
               .always(function(resp){
                  if(resp == 'Y'){ // ยังมีไฟล์ที่ยังไม่ตรวจสอบ
                    fileApprovalStatus = 0
                  }else{
                    fileApprovalStatus = 1
                  }
               })
  },
  manageProject(id_rs, url){
    window.localStorage.setItem(conf.prefix + 'project', id_rs)
    window.location = url
  },
  Setto23(){
    if(current_project != null){

      swal({
        title: "คุณแน่ใจหรือไม่",
        text: "กรุณากดปุ่ม 'ตกลง' เพื่อยืนยันการดำเนินการ",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
        closeOnConfirm: true
      },
      function(){
        preload.show()
        var param = {
          uid: current_user,
          id_rs: current_project,
          status: '23'
        }
        var jxr = $.post(conf.api + 'staff/research?stage=update_status', param, function(){})
                   .always(function(resp){
                     // console.log(resp);
                      if(resp == 'Y'){ // ยังมีไฟล์ที่ยังไม่ตรวจสอบ
                        setTimeout(function(){
                          preload.hide()
                          swal({
                            title: "ปรับสถานะสำเร็จ",
                            text: "กดตกลง เพื่อกลับสู่หน้าแรก",
                            type: "warning",
                            showCancelButton: false,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "ตกลง",
                            closeOnConfirm: true },
                            function(){
                              window.location = './index?uid=' + current_user + '&role=' + current_role
                              // console.log('./index?uid=' + current_user + '&role=' + current_role);
                            });

                        }, 500)
                      }else{
                        preload.hide()
                        swal("เกิดข้อผิดพลาด", "ไม่สามารถปรับสถานะโครงการได้", "error")
                      }
                   })
      });
    }else{
      alert('Error')
    }
  },
  sendToAnswercomment(){

    $bordresult = $('#textBoardResult').text()

    if($bordresult == 'ยังไม่กำหนด'){

      preload.hide()
      swal("เกิดข้อผิดพลาด", "ไม่สามารถดำเนินการได้เนื่องจากโครงการที่เป็น Fullboard ต้องมีการระบุมติจากที่ประชุมก่อน", "error")
      return ;

    }

    preload.hide()
    swal({
      title: "ยืนยันการดำเนินการ",
      text: "คุณยืนยันการส่งข้อเสนอแนะดังกล่าวไปยังผู้วิจัยหรือไม่",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b92e13",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      closeOnConfirm: true
    },
    function(){
      preload.show()
      $msg = message_1.getData()
      var param = {
        id: current_user,
        id_rs: current_project,
        msg: $msg
      }
      var jxhr = $.post(conf.api + 'ec/fb_to_pi_update', param, function(){})
                      .always(function(resp){
                        if(resp == 'Y'){
                          initial.sendCommentToPi()
                        }else{
                          preload.hide()
                          swal("เกิดข้อผิดพลาด", "ไม่สามารถดำเนินการได้", "error")
                        }
                      })


    })
  },
  sendCommentToPi(){
    if($('#txtRTypess').text() == 'Expedited'){
      var dataContent = '<h3>เรื่อง ผลการประเมินด้านจริยธรรมการวิจัยในมนุษย์ ประเภทพิจารณาแบบเร็ว</h3>' +
                        '<p><strong>ชื่อโครงการ (ไทย)</strong> ' + $('#txtThtitle').text() + '<br><strong>ชื่อโครงการ</strong> ' + $('#txtEntitle').text() +'</p>' +
                        '<p><strong>เรียน</strong> ' + $('#txtPi').text() + '</p>' +
                        '<p>ตามที่ท่านเสนอโครงร่างการวิจัยเพื่อขอรับพิจารณาจริยธรรมการวิจัยในมนุษย์ หมายเลขโครงการ REC. ' + $('#txtCode').text() + ' โครงการวิจัยดังกล่าว ' +
                        'ได้รับการพิจารณาโดยผู้เชี่ยวชาญอิสระและกรรมการจริยธรรม มีมติ คือ <span style="color:red;">ปรับปรุงแก้ไขเพื่อรับรอง (Minor modification)</span></p>' +
                        "<p>จึงเรียนมาเพื่อทราบและดำเนินการแก้ไข (response to reviewer's comments) ได้ที่ <a href=" + conf.domain + " target=_blank>" + conf.domain + "</a>" +
                        'ให้แล้วเสร็จภายใน 60 วันหลังจากได้รับอีเมลฉบับนี้ หากพ้นกำหนดดังกล่าว โดยที่ท่านยังมีความประสงค์ที่จะขอรับการพิจารณาจริยธรรม ท่านต้องดำเนินการยื่นเอกสารโครงการวิจัยเสมือนขอรับพิจารณาจริยธรรมใหม่ทั้งหมด</p>' +
                        "<p>หากผู้วิจัยมีข้อสงสัยในข้อคำถามของคณะกรรมการสามารถสอบถามเลขานุการ โดยผู้วิจัยโทรศัพท์นัดหมายกับเจ้าหน้าที่สำนักงาน ที่หมายเลข 074-451157 หรือ 074-451149</p>" +
                        "<p>หากลิงค์ไม่ทำงาน กรุณา copy ลิงค์เพื่อเปิดกับเว็บเบราว์เซอร์ <br>" +
                        "สอบถามเพิ่มเติม ติดต่อ คุณณัฎฐา ศิริรักษ์ สำนักงานจริยธรรมการวิจัยในมนุษย์<br>" +
                        "E-mail: sinuttha@medicine.psu.ac.th หรือ โทร. 1149 และ1157</p>" +
                        "<p>หมายเหตุ : <br>** ระบบ RMIS อยู่ในระหว่างการทดสอบ (เริ่มทดลองใช้เต็มรูปแบบ มกราคม 2561) ความเห็นที่ได้จากท่านจะถูกนำไปพัฒนาระบบให้ดียิ่งขึ้น<br>*** กรุณาอย่าตอบกลับอีเมลฉบับนี้ (Do not reply)</p>" +
                        "<hr>" +
                        "<p>สำนักงานจริยธรรมการวิจัยในมนุษย์ หน่วยส่งเสริมและพัฒนาทางวิชาการ คณะแพทยศาสตร์ มหาวิทยาลัยสงขลานครินทร์" +
                        "<br>(Human Research Ethic Committee, Faculty of Medicine, Prince of Songkla University) </p>";;


      var param = {
        title: "ผลการประเมินโครงการวิจัย REC." + $('#textCode').text() + " เพื่อขอพิจารณาจริยธรรมการวิจัยในมนุษย์",
        content: dataContent,
        user: conf.mail_user,
        key: conf.mail_key,
        toemail: $('#textPiEmail').text(),
        toname:  $('#textPiName').text()
       }
       fnc.send_email(param, 'index?uid=' + current_user + '&role=' + current_role, 'ส่งข้อมูลถึงหัวหน้าโครงการสำเร็จ กดตกลงเพื่อกลับสู่หน้าแรก', 'ระบบได้ดำเนินการตามกระบวนที่ท่านได้ดำเนินการแล้ว แต่เกิดข้อผิดพลาดในส่วนของการส่งอีเมล กรุณาแจ้งเจ้าหน้าที่เพื่อตรวจสอบและดำเนินการแก้ไข', true)

    }else if(($('#txtRTypess').text() == 'Fullboard (Bio)') || ($('#txtRTypess').text() == 'Fullboard (Social)')){

      // console.log('Fullboard');
      $bordresult = $('#textBoardResult').text()
      // console.log($bordresult);
      // return ;

      if($bordresult == 'ยังไม่กำหนด'){

        preload.hide()
        swal("เกิดข้อผิดพลาด", "ไม่สามารถดำเนินการได้เนื่องจากโครงการที่เป็น Fullboard ต้องมีการระบุมติจากที่ประชุมก่อน", "error")
        return ;

      }else{

        $res = 'ปรับปรุงแก้ไขเพื่อรับรอง (Minor modification : หมายถึง ไม่ต้องเข้าพิจารณาในกรรมการเต็มชุดรอบ 2 หากเลขานุการเห็นชอบการแก้ไข)'
        $resfile = ''
        $mn1 = 'โดยไม่ต้องทำเอกสารมายังสำนักงาน ยกเว้นเจ้าหน้าที่มีการร้องขอ'

        if($bordresult.trim() == 'Major'){
          console.log('a');
          $res = 'ปรับปรุงแก้ไขและนำเข้าพิจารณาใหม่ (Major modification : หมายถึง ปรับปรุงแก้ไขและต้องบรรจุเข้ากรรมการเต็มชุดรอบที่ 2)'
          $resfile = '<li>จัดทำเอกสารทั้งหมด 14 ชุด ส่งมายังสำนักงานจริยธรรมเพื่อเนำเข้าพิจารณาใน Board ครั้งต่อไปใน panal เดียวกัน </li>'
          $mn1 = ''
        }else if($bordresult.trim() == 'Minor'){
          console.log('b');
          $res = 'ปรับปรุงแก้ไขเพื่อรับรอง (Minor modification : หมายถึง ไม่ต้องเข้าพิจารณาในกรรมการเต็มชุดรอบ 2 หากเลขานุการเห็นชอบการแก้ไข)'
          $resfile = ''
          $mn1 = 'โดยไม่ต้องทำเอกสารมายังสำนักงาน ยกเว้นเจ้าหน้าที่มีการร้องขอ'
        }else{
          console.log('c');
          console.log($bordresult);
          swal("เกิดข้อผิดพลาด", "Invalid board result stage", "error")
          return ;
        }

        var dataContent = '<h3>เรื่อง มติคณะกรรมการพิจารณาจริยธรรมการวิจัยในมนุษย์ ' + $('#Fbminfo').text() + '</h3>' +
                          '<p><strong>เรียน</strong> นักวิิจัยหลัก (' + $('#textPiEmail').text() + ') ที่นับถือ </p>' +
                          '<p><strong>ชื่อโครงการ (ไทย)</strong> ' + $('#textTitleTh').text() + '<br><strong>Project title</strong> ' + $('#textTitleEn').text() +'</p>' +

                          '<p>ตามที่ท่านเสนอโครงร่างการวิจัยเพื่อขอรับพิจารณาจริยธรรมการวิจัยในมนุษย์ หมายเลขโครงการ REC. ' + $('#textCode').text() + ' โครงร่างการวิจัยดังกล่าว ได้รับการพิจารณาในที่ประชุมคณะกรรมใน' + $('#Fbminfo').text() + '</p>' +
                          '<p><strong>มีมติ คือ <span style="color:red;">' + $res + '</span></strong></p>' +
                          "<p>จึงเรียนมาเพื่อทราบและดำเนินการแก้ไข ดังต่อไปนี้ " +
                              '<ol>' +
                                  "<li>ชี้แจงต่อข้อคำถามของกรรมการ (response to reviewer's comments) ได้ที่ <a href=" + conf.domain + " target=_blank>" + conf.domain + "</a></li>" +
                                  "<li>โครงร่างการวิจัยที่ทำการแก้ไข พร้อม High-light ส่วนที่แก้ไข และปรับเวอร์ชั่น</li>" +
                                  "<li>อัพโหลดไฟล์ฉบับแก้ไขในระบบ RMIS " + $mn1 + "</li>" +
                                  $resfile +
                              '</ol>' +
                          'ขอให้ดำเนินการ<span style="color:red;">ให้แล้วเสร็จภายใน 60 วันหลังจากได้รับอีเมลฉบับนี้</span> หากพ้นกำหนดดังกล่าว ท่านยังมีความประสงค์ที่จะขอรับการพิจารณาจริยธรรม ท่านต้องดำเนินการยื่นเอกสารโครงร่างการวิจัยเสมือนขอรับการพิจารณาจริยธรรมใหม่ทั้งหมด</p>' +
                          "<p>หากผู้วิจัยมีข้อสงสัยในข้อคำถามของคณะกรรมการสามารถสอบถามเลขานุการ โดยผู้วิจัยโทรศัพท์นัดหมายกับเจ้าหน้าที่สำนักงาน ที่หมายเลข 074-451157 หรือ 074-451149</p>" +
                          "<p>หากลิงค์ไม่ทำงาน กรุณา copy ลิงค์เพื่อเปิดกับเว็บเบราว์เซอร์ <br>" +
                          "สอบถามเพิ่มเติม ติดต่อ คุณณัฎฐา ศิริรักษ์ สำนักงานจริยธรรมการวิจัยในมนุษย์<br>" +
                          "E-mail: sinuttha@medicine.psu.ac.th หรือ โทร. 1149 และ1157</p>" +
                          "<p>หมายเหตุ : <br>*** กรุณาอย่าตอบกลับอีเมลฉบับนี้ (Do not reply)</p>" +
                          "<hr>" +
                          "<p>สำนักงานจริยธรรมการวิจัยในมนุษย์ หน่วยส่งเสริมและพัฒนาทางวิชาการ คณะแพทยศาสตร์ มหาวิทยาลัยสงขลานครินทร์" +
                          "<br>(Human Research Ethic Committee, Faculty of Medicine, Prince of Songkla University) </p>";
        var param = {
          title: "มติคณะกรรมการพิจารณาจริยธรรมการวิจัยในมนุษย์ โครงการวิจัย REC." + $('#textCode').text() ,
          content: dataContent,
          user: conf.mail_user,
          key: conf.mail_key,
          toemail: $('#textPiEmail').text(),
          toname:  $('#textPiName').text()
         }
         fnc.send_email(param, 'index?uid=' + current_user + '&role=' + current_role, 'ท่านได้ส่งข้อมูลข้อเสนอแนะเรียบร้อยแล้ว กด ตกลง เพื่อกลับสู่หน้าหลัก', 'ระบบได้ดำเนินการตามกระบวนที่ท่านได้ดำเนินการแล้ว แต่เกิดข้อผิดพลาดในส่วนของการส่งอีเมล กรุณาแจ้งเจ้าหน้าที่เพื่อตรวจสอบและดำเนินการแก้ไข', true)
      }

    }else{
      swal("Error", "Invalid operation", "error")
    }
  },
  onProgress_6(){

      $check = 0
      $('.form-control').removeClass('is-invalid')
      $msg = message_1.getData()
      if($('#txtResult').val() == ''){
        $('#txtResult').addClass('is-invalid')
        $check++
      }

      if($msg == ''){
        $check++
      }

      if($check != 0){
        swal("คำเตือน", "กรุณากรอกข้อมูลให้ครบถ้วน", "error")
        return ;
      }

      var senddingType = $('#txtResult').val()
      if(senddingType == 1){ //ส่งแก้ไข
        preload.show()
        // Check number of comment
        var param = {
          id_rs: current_project
        }
        var jxr = $.post(conf.api + 'staff/comment_manage?stage=get_number_of_comment', param, function(){})
                   .always(function(resp){
                     if(resp == 0){
                       preload.hide()
                       swal("คำเตือน", "ไม่พบข้อคำถามให้ PI แก้ไข กรุณาตรวจสอบข้อมูลอีกครั้ง", "error")
                       return ;
                     }else{
                       initial.sendToAnswercomment()
                     }
                   })

      } // End send back to update
      else if(senddingType == 2){ // นำเข้าที่ประชุม
        swal({    title: "ยืนยันการดำเนินการ",
            text: "คุณยืนยันการดำเนินการนี้หรือไม่",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#b92e13",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
            closeOnConfirm: false
        },
        function(){
          var param = {
            id: current_user,
            id_rs: current_project,
            msg: $msg
          }

          var jxhr = $.post(conf.api + 'ec/update_status_15.php', param, function(){})
                      .always(function(resp){
                        if(resp=='Y'){
                          swal({    title: "ดำเนินการสำเร็จ",
                          text: "กด 'ตกลง' เพื่อกลับสู่หน้าแรก",
                          type: "warning",
                          showCancelButton: false,
                          confirmButtonColor: "#0daf66",
                          confirmButtonText: "ตกลง",
                          closeOnConfirm: false },
                          function(){
                            window.location = 'index?uid=' + current_user + '&role=' + current_role
                          });
                        }else{
                          alert(resp)
                        }
                      })
        });
      } // End set to board meeting
      else if(senddingType == 3){  // รอออกใบรับรอง
        swal({    title: "ยืนยันการดำเนินการ",
            text: "คุณยืนยันการดำเนินการนี้หรือไม่",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#b92e13",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
            closeOnConfirm: false
        },
        function(){

          var param = {
            id: current_user,
            id_rs: current_project,
            msg: $msg
          }

          var jxhr = $.post(conf.api + 'ec/update_status_22.php', param, function(){})
                      .always(function(resp){
                        if(resp=='Y'){
                          swal({    title: "ดำเนินการสำเร็จ",
                          text: "กด 'ตกลง' เพื่อกลับสู่หน้าแรก",
                          type: "warning",
                          showCancelButton: false,
                          confirmButtonColor: "#0daf66",
                          confirmButtonText: "ตกลง",
                          closeOnConfirm: false },
                          function(){
                            window.location = 'index?uid=' + current_user + '&role=' + current_role
                          });
                        }else{
                          alert(resp)
                        }
                      })
        });
      } // End ออกใบรับรอง
      else if(senddingType == 5){ //Send to staff
        if($msg == ''){
          swal("คำเตือน", "กรุณาระบุข้อความก่อนส่ง", "error")
          return ;
        }

        swal({    title: "ยืนยันการดำเนินการ",
            text: "คุณยืนยันการดำเนินการนี้ เพื่อส่งกลับไปยังเจ้าหน้าที่หรือไม่",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#b92e13",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
            closeOnConfirm: false
        },
        function(){

          var param = {
            id: current_user,
            id_rs: current_project,
            id_status: '5',
            msg: $msg
          }

          var jxhr = $.post(conf.api + 'ec/reply_back_to_staff_2.php', param, function(){})
                      .always(function(resp){
                        if(resp=='Y'){
                          swal({    title: "ดำเนินการสำเร็จ",
                          text: "กด 'ตกลง' เพื่อกลับสู่หน้าหลัก",
                          type: "warning",
                          showCancelButton: false,
                          confirmButtonColor: "#0daf66",
                          confirmButtonText: "ตกลง",
                          closeOnConfirm: false },
                          function(){
                            window.location = 'index?uid=' + current_user + '&role=' + current_role
                          });
                        }else{
                          alert(resp)
                        }
                      })
        });
      }else if(senddingType == 6){ //Send to chairman to dis-approve

        if($msg == ''){
          swal("คำเตือน", "กรุณาระบุข้อความก่อนส่ง", "error")
          return ;
        }

        swal({    title: "ยืนยันการดำเนินการ",
            text: "คุณยืนยันการดำเนินการนี้ เพื่อส่งข้อมูลไปยังประธาน ฯ หรือไม่",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#b92e13",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
            closeOnConfirm: false
        },
        function(){

          var param = {
            id: current_user,
            id_rs: current_project,
            id_status: '6',
            msg: $msg
          }

          var jxhr = $.post(conf.api + 'ec/forward_disapp_to_chaiman.php', param, function(){})
                      .always(function(resp){
                        if(resp=='Y'){
                          swal({    title: "ดำเนินการสำเร็จ",
                          text: "กด 'ตกลง' เพื่อกลับสู่หน้าหลัก",
                          type: "warning",
                          showCancelButton: false,
                          confirmButtonColor: "#0daf66",
                          confirmButtonText: "ตกลง",
                          closeOnConfirm: false },
                          function(){
                            window.location = 'index?uid=' + current_user + '&role=' + current_role
                          });
                        }else{
                          alert(resp)
                        }
                      })
        });

      }
  }
}
