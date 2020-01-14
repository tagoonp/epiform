var message_note = null

if($("#message_box_note").length) {
    message_note = CKEDITOR.replace( 'message_box_note', {
        wordcount : {
        showCharCount : false,
        showWordCount : true
        },
        height: '200px'
    });
}
var fnc = {
    close_loading(){
      setTimeout(function(){
        preload.hide()
      }, 1000)
    },
    json_exist(snap){
        if((snap != '') && (snap.length > 0)){
            return true;
        }else{
            return false;
        }
    },
    send_email(param, nextStage, successText, failText, preloadhide){
        console.log('Sending email ...');
        // var jxr = $.post('http://simanh.psu.ac.th/icustomsystem/mailer/sender.php', param, function(){})
        var jxr = $.post('https://fxplor.com/mymailer/mailer/sender.php', param, function(){})
                   .always(function(resp){
                        if(resp == 'Y'){
                            if(nextStage == 'none'){
                                try {
                                    if(preloadhide){ preload.hide() }
                                } catch (e) {

                                } finally {

                                }
                            }else{
                                try {
                                    if(preloadhide){ preload.hide() }
                                } catch (e) {

                                } finally {

                                }
                                swal({
                                    title: "ดำเนินการสำเร็จ",
                                    text: successText,
                                    type: "success",
                                    showCancelButton: false,
                                    confirmButtonColor: "#126cd5",
                                    confirmButtonText: "ตกลง",
                                    closeOnConfirm: true
                                },
                                function(){
                                    if(nextStage == 'reload'){
                                        window.location.reload();
                                    }else if(nextStage == 'none'){
                                        // Do nothing
                                    }else{
                                        window.location = nextStage
                                    }
                                });
                            }
                        }else{ // Can not send email
                            try {
                                if(preloadhide){ preload.hide() }
                            } catch (e) {

                            } finally {

                            }
                            swal({
                                title: "คำเตือน",
                                text: failText,
                                type: "warning",
                                showCancelButton: false,
                                confirmButtonColor: "#126cd5",
                                confirmButtonText: "ตกลง",
                                closeOnConfirm: true
                            },
                            function(){
                                if(nextStage == 'reload'){
                                    window.location.reload();
                                }else{
                                window.location = nextStage
                                }
                            });
                        }
               })
    },convertThaidatetime: function(input){
        let a = input.split(' ');
        let cdate = a[0].split('-');
        return parseInt(cdate[2]) + ' ' + thmonth[parseInt(cdate[1])] + ' ' + (parseInt(cdate[0]) + 543) + ' ' + a[1];
    },
    convertThaidate: function(input){
        if(input != null){
            let a = input.split(' ');
            let cdate = a[0].split('-');
            return parseInt(cdate[2]) + ' ' + thmonth[parseInt(cdate[1])] + ' พ.ศ. ' + (parseInt(cdate[0]) + 543);
        }else{
            return '<span class="text-danger">ไม่สามารถระบุได้</span>'
        }
    },
    convertThaidate2: function(input){
        let a = input.split(' ');
        let cdate = a[0].split('-');
        return parseInt(cdate[2]) + ' ' + thmonth_sh[parseInt(cdate[1])] + ' ' + ((parseInt(cdate[0]) + 543).toString()).substring(2,4);
    },
    convertEndatetime: function(input){
        let a = input.split(' ');
        let cdate = a[0].split('-');
        return parseInt(cdate[2]) + ' ' + enmonth[parseInt(cdate[1])] + ', ' + (parseInt(cdate[0])) + ' ' + a[1];
    },
    convertEndate: function(input){
        let a = input.split(' ');
        let cdate = a[0].split('-');
        return parseInt(cdate[2]) + ' ' + enmonth[parseInt(cdate[1])] + ', ' + (parseInt(cdate[0]));
    },
    convertEnThaidate2: function(input){
        let a = input.split(' ');
        let cdate = a[0].split('-');
        return parseInt(cdate[2]) + ' ' + enmonth_sh[parseInt(cdate[1])] + ', ' + ((parseInt(cdate[0])).toString()).substring(2,4);
    },
    randomString: function(L){
        var s = '';
        var randomchar = function() {
            var n = Math.floor(Math.random() * 62);
            if (n < 10) return n; //1-10
            if (n < 36) return String.fromCharCode(n + 55); //A-Z
            return String.fromCharCode(n + 61); //a-z
        }
        while (s.length < L) s += randomchar();
        return s;
    },
    randomNumber: function(){
        return Math.floor((Math.random() * 99999) + 1);
    },
    check_dateformat: function(datevalue){
        var res = datevalue.split("-");
        if(res.length > 0){
            if(res[0].length > 2){
                return (parseInt(res[0]) - 543) + '-' + res[1] + '-' + res[2];
            }else{
                return (parseInt(res[2]) - 543) + '-' + res[1] + '-' + res[0];
            }
        }else{
            return datevalue;
        }
    },
    calDateDiff: function(start, end){
    // Here are the two dates to compare
    var date1 = start;
    var date2 = end;
    // console.log(date1);

    // First we split the values to arrays date1[0] is the year, [1] the month and [2] the day
    date1 = date1.split('-');
    date2 = date2.split('-');

    // Now we convert the array to a Date object, which has several helpful methods
    date1 = new Date(date1[0], date1[1], date1[2]);
    date2 = new Date(date2[0], date2[1], date2[2]);

    // We use the getTime() method and get the unixtime (in milliseconds, but we want seconds, therefore we divide it through 1000)
    date1_unixtime = parseInt(date1.getTime() / 1000);
    date2_unixtime = parseInt(date2.getTime() / 1000);

    // This is the calculated difference in seconds
    var timeDifference = date2_unixtime - date1_unixtime;

    // in Hours
    var timeDifferenceInHours = timeDifference / 60 / 60;

    // and finaly, in days :)
    var timeDifferenceInDays = timeDifferenceInHours  / 24;

    return timeDifferenceInDays;
    }
}

function gotoPage(url){
    window.location = url
}

function getNext14Days(){
    var today = new Date(+new Date + 12096e5);
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10){
        dd='0'+dd;
    }

    if(mm<10){
        mm='0'+mm;
    }

    var today = yyyy + '-' + mm + '-' + dd;
    return fnc.convertThaidate(today);
  }

  $(function(){
      $('.form_note').submit(function(){
          if(message_note.getData() == ''){
                swal("ขออภัย", "กรุณากรอกข้อความที่ต้องการบันทึก", "error")
                return ;
          }

          var param = {
            id_rs: $('#textId_rs').val(),
            content: message_note.getData(),
            user: current_user,
            crange: $('#txtCanrange').val(),
            role: current_role,
            fnc: 'set'
          }

          preload.show()

          var jxr = $.post(conf.api + 'general/note.php', param, function(){})
               .always(function(resp){
                 console.log(resp);
                 if(resp == 'Y'){
					window.location.reload()
                 }else{
                     preload.hide()
                     swal("ขออภัย", "ไม่สามารถบันทึกโน๊ตได้", "error")
                 }
               })
               .fail(function(){
                    preload.hide()
                    swal("ขออภัย", "ไม่สามารถบันทึกข้อมูลได้", "error")
               })

      })
  })

  function reviewer_comment_2(stage, cid){
    if(stage == 'delete'){
        var param = {
            uid: current_user,
            role: current_role,
            comment_id: cid,
            id_rs: $('#textId_rs').val()
        }

        if((current_user == null) || (current_role == null) || ((current_role != 'staff') && (current_role != 'ec'))){
            swal("Error!", "Permission denine!", "error")
            return ;
        }

        swal({   title: "คุณแน่ใจหรือไม่",
        text: "หากทำการลบข้อเสนอแล้วจะไม่สามารถนำกลับมาได้อีก",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        closeOnConfirm: true,
        closeOnCancel: true },
        function(isConfirm){
            if (isConfirm) {
                preload.show()
                var jxr = $.post(conf.api + 'staff/comment_manage?stage=' + stage, param, function(){})
                   .always(function(resp){
                       if(resp == 'Y'){
                            preload.hide()
                            initial.getComment()
                       }else{
                            preload.hide()
                            swal("เกิดข้อผิดพลาด!", "ไม่สามารถลบข้อเสนอได้", "error")
                       }
                   })
            }
            else {
                return ;
            }
       });
    }
  }

  function reviewer_comment(stage, cid){
    if(stage == 'delete'){
        var param = {
            uid: current_user,
            role: current_role,
            comment_id: cid,
            id_rs: $('#textId_rs').val()
        }

        if((current_user == null) || (current_role == null) || ((current_role != 'staff') && (current_role != 'ec'))){
            swal("Error!", "Permission denine!", "error")
            return ;
        }

        swal({   title: "คุณแน่ใจหรือไม่",
        text: "หากทำการลบข้อเสนอแล้วจะไม่สามารถนำกลับมาได้อีก",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        closeOnConfirm: true,
        closeOnCancel: true },
        function(isConfirm){
            if (isConfirm) {
                preload.show()
                var jxr = $.post(conf.api + 'staff/comment_manage?stage=' + stage, param, function(){})
                   .always(function(resp){
                       console.log(resp);

                       if(resp == 'Y'){
                            preload.hide()
                            window.location.reload()
                       }else{
                            preload.hide()
                            swal("เกิดข้อผิดพลาด!", "ไม่สามารถลบข้อเสนอได้", "error")
                       }
                   })
            }
            else {
                return ;
            }
       });
    }
  }

  function moveUp(c_id, c_seq, s_id, s_seq){
    preload.show()
    var param = {
        id_rs: current_project,
        c_id: c_id,
        c_seq: c_seq,
        s_id: s_id,
        s_seq: s_seq,
        direction: 'down'
    }
    var jxr = $.post(conf.api + 'staff/comment_manage.php?stage=move', param, function(){})
               .always(function(resp){
                 console.log(resp);
                   if(resp == 'Y'){
                      initial.getComment()
                   }else{
                     alert('Error')
                     preload.hide()
                   }
               })
  }

  function moveDown(c_id, c_seq, s_id, s_seq){
    preload.show()
    var param = {
        id_rs: current_project,
        c_id: c_id,
        c_seq: c_seq,
        s_id: s_id,
        s_seq: s_seq,
        direction: 'down'
    }
    var jxr = $.post(conf.api + 'staff/comment_manage.php?stage=move', param, function(){})
               .always(function(resp){
                 console.log(resp);
                   if(resp == 'Y'){
                      initial.getComment()
                   }else{
                     alert('Error')
                     preload.hide()
                   }
               })
  }

  function moveDown_(q_group, seq){
    console.log('Down');
    $sql = $('#sql_' + q_group).val()
    preload.show()
    var param = {
        uid: current_user,
        cmd: $sql,
        gr: q_group,
        seq: seq,
        direction: 'down'
    }

    var jxr = $.post(conf.api + 'staff/comment_manage.php?stage=move', param, function(){})
               .always(function(resp){
                 console.log(resp);
                   if(resp == 'Y'){
                      setTimeout(function(){
                          // window.location.reload()
                          initial.getComment()
                      }, 500)
                   }
               })
  }

  function updateSeq(q_group){
      $sql = $('#sql_' + q_group).val()
      preload.show()
      var param = {
          uid: current_user,
          cmd: $sql,
          gr: q_group
      }
      var jxr = $.post(conf.api + 'staff/comment_manage.php?stage=seq', param, function(){})
                 .always(function(resp){
                    //  console.log(resp);
                    //  return ;

                     if(resp == 'Y'){
                        setTimeout(function(){
                            window.location.reload()
                        }, 500)
                     }else{
                         preload.hide()
                     }
                 })

  }
