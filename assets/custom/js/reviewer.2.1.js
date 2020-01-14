var current_user = window.localStorage.getItem('rmis_current_user')
var current_role = window.localStorage.getItem('rmis_current_role')
var id_reviewer = '';
var path = window.location.pathname;
var page = path.split("/").pop();
var eformnum = 0;
var reviewer = {
  check_unreview: function(){
    var param = { id: current_user }
    var jxhr = $.post(conf.api + 'reviewer/get-waiting-list.php', param, function(){}, 'json')
                .always(function(snap){
                  if((snap != '') && (snap.length > 0)){
                    $('#btnN1').removeClass('btn-custom-1')
                    $('#btnN1').addClass('btn-custom-orange')
                    $('.NewRegister').html('(' + snap.length + ')')
                    swal({    title: "คำเตือน",
                    text: "ท่านมีโครงการที่รอพิจารณาจำนวน " + snap.length + " โครงการ",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "รับทราบ",
                    closeOnConfirm: true },
                    function(){
                    swal("Deleted!", "Your imaginary file has been deleted.", "success");
                    });
                  }
                })
  },
  init: function(){
    
    console.log(current_user);
    console.log(current_role);

    if((current_user == null) || (current_role == null) || (current_role != 'reviewer')){
      swal({    title: "ขออภัย",
             text: "สิทธิ์การเข้าใช้งานของคุณไม่ถูกต้อง",
             type: "warning",
             showCancelButton: false,
             confirmButtonColor: "#139a45",
             confirmButtonText: "เข้าสู่ระบบอีกครั้ง",
             closeOnConfirm: false },
             function(){
              window.location = '../'
             });

      return ;
    }

    var param = {
      id: current_user,
      role: current_role
    }

    var jxhr = $.post(conf.api + 'check_user.php', param, function(){}, 'json')
                .always(function(snap){

                  if(snap != ''){

                    snap.forEach(function(childSnap){

                      console.log(childSnap);

                      $('.userFullname').text(childSnap.prefix_name + childSnap.fname + ' ' + childSnap.lname)
                      window.localStorage.setItem('rmis_current_user_fullname', childSnap.prefix_name + childSnap.fname + ' ' + childSnap.lname)
                      window.localStorage.setItem('rmis_current_user_email', childSnap.email)


                      if(childSnap.profile == ''){
                        profile = '../v3/dist/img/user1.png'
                      }else{
                        profile = '../images/profile/' + childSnap.profile;
                      }

                      window.localStorage.setItem('rmis_current_user_profile', profile);
                      id_pm = childSnap.id_pm

                      $( "#profileImg" ).html('<img src="'+ profile +'" alt="user_auth" class="user-auth-img img-circle"/><span class="user-online-status">' );
                      $('.profileImg').html('<img class="inline-block mb-10" id="profileImg" src="'+ profile +'" alt="user" />')

                      $('.userEmail').text(window.localStorage.getItem('rmis_current_user_email'))
                      $('#txtEmail').val(childSnap.email)

                      $('#txtLinkTemp_email').val(childSnap.email)
                      $('#txtLinkTemp_sid').val(childSnap.password)

                      $('#txtPrefix').val(childSnap.id_prefix)
                      $('#txtFname').val(childSnap.fname)
                      $('#txtLname').val(childSnap.lname)


                      $('.userTel').text(childSnap.tel_office)
                      $('#txtOffice').val(childSnap.tel_office)
                      $('.userMobile').text(childSnap.tel_mobile)
                      $('#txtMobile').val(childSnap.tel_mobile)
                      $('.userFax').text(childSnap.tel_fax)
                      $('#txtFax').val(childSnap.tel_fax)
                      $('.userExp').text(childSnap.expertise)
                      $('#txtExp').val(childSnap.expertise)
                      $('.userRI').text(childSnap.rs_interest)
                      $('#txtRI').val(childSnap.rs_interest)
                      $('.userAddress').text(childSnap.address)
                      $('#txtAddress').val(childSnap.address)
                      $('.userPosition').text(childSnap.personnel_name)
                      $('#txtPosition').val(childSnap.id_personnel)

                      $('#uid').val(childSnap.id)

                      // pi.count_rs()

                    })
                  }else{

                    swal({    title: "ขออภัย",
                           text: "ไม่พบข้อมูลผู้ใช้งาน!",
                           type: "error",
                           showCancelButton: false,
                           confirmButtonColor: "#139a45",
                           confirmButtonText: "เข้าสู่ระบบอีกครั้ง",
                           closeOnConfirm: false },
                           function(){
                            window.location = '../'
                           });

                  }
                }, 'json')
                .fail(function(){
                  swal({    title: "ขออภัย",
                         text: "ไม่สามารถเชื่อมต่อฐานข้อมูลได้",
                         type: "error",
                         showCancelButton: false,
                         confirmButtonColor: "#139a45",
                         confirmButtonText: "เข้าสู่ระบบอีกครั้ง",
                         closeOnConfirm: false },
                         function(){
                          window.location = '../'
                         });

                  return ;
                }, 'json')
    console.log('Checking role success ....');

  }, // End init
  initReviewInfo: function(){
    var param = {
      id: current_user,
      id_rs: current_rs_id,
      role: current_role
    }

    console.log(param);
    // return ;

    var jxhr = $.post(conf.api + 'check_review_info.php', param, function(){}, 'json')
                .always(function(snap){
                  // console.log(snap);
                  // return ;

                  if((snap!='') && (snap.length > 0)){
                    snap.forEach(function(i){
                      if(i.rir_status == "Reviewer 1"){
                        $('.txt-reviewertype').text('Primary reviewer')
                      }else if(i.rir_status == "Reviewer 2"){
                        $('.txt-reviewertype').text('Secondary reviewer')
                      }else if(i.rir_status == "ICF"){
                        $('.txt-reviewertype').text('ICF reviewer')
                      }else if(i.rir_status == "MTA"){
                        $('.txt-reviewertype').text('MTA reviewer')
                      }else if(i.rir_status == "Other"){
                        $('.txt-reviewertype').text('MTA reviewer')
                      }else if(i.rir_status == "Content reviewer"){
                        $('.txt-reviewertype').text('Content reviewer')
                      }else if(i.rir_status == "ICF reviewer"){
                        $('.txt-reviewertype').text('ICF reviewer')
                      }else if(i.rir_status == "Legal reviewer"){
                        $('.txt-reviewertype').text('Legal reviewer')
                      }
                    })
                  }else{
                    // window.location = 'index.html'
                  }

                })
  },
  load_rs_info_2: function(){
    var param = {
      id: current_user,
      sess: current_rs,
      id_rs: current_rs_id
    }
    //
    console.log(param);
    // return ;
    var jxhr = $.post(conf.api + 'reviewer/get-rs-info-2.php', param, function(){}, 'json')
                .always(function(snap){

                  console.log(snap);

                  if((snap!='') && (snap.length > 0)){

                    // if(snap[0].rw_reply_status != 0){
                        reply_status = snap[0].rw_reply_status
                    // }


                    snap.forEach(function(i){
                      $('#txtIdrs').text(i.code_apdu)
                      $('#txtThtitle').text(i.title_th)
                      $('#txtEntitle').text(i.title_en)
                      $('#txtPi').text(i.prefix_name + i.fname + ' ' + i.lname)
                      $('#txtThkeyword').text(i.keywords_th)
                      $('#txtEnkeyword').text(i.keywords_en)
                      $('#txtRtype').text(i.type_name)
                      $('#txtYear').val(i.id_year)
                      $('#txtDept').val(i.id_dept)
                      $('#txtPertype').val(i.id_personnel)
                      $('.ecMsg').html(i.rw_sendding_msg)
                      $('#txtIdCodaAPCU').val(i.code_apdu)
                      $('#txt-CodeApdu').text(i.code_apdu)
                      $('.txt-CodeApdu').text(i.code_apdu)


                      // console.log(i.rw_sendding_msg);
                      if(i.rw_reply_status == 0){
                        console.log(i.rw_reply_status);
                        $('#profile_tab_7').hide()
                        $('#profile_tab_9').hide()
                        $('#profile_tab_10').hide()
                      }

                      $startdate = '0000-00-00';
                      $enddate = '0000-00-00';
                      $b1 = '0000-00-00'; $b2 = '0000-00-00';
                      $startdate = fnc.check_dateformat(i.start_date);
                      $b1 = $startdate;
                      $startdate = fnc.convertThaidate($startdate);

                      $enddate = fnc.check_dateformat(i.finish_date);
                      $b2 = $enddate;
                      $enddate = fnc.convertThaidate($enddate);

                      $durr = fnc.calDateDiff($b1, $b2)
                      // console.log($durr);

                      if(i.code_apdu != ''){
                        $('#txtCode').text(i.code_apdu)
                        var s = i.code_apdu.split('-')
                        $('#txtOrd').val(s[1])
                      }

                      $('#txtRduration').html('<div>เริ่มต้นโครงการ : ' + $startdate + ' วันที่สิ้นสุด : ' + $enddate + '</div>' + '<div>รวมจำนวน : ' + $durr + ' วัน </div>')
                      var budg = i.budget;
                      $('#txtRBudget').text(budg.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' บาท')

                      $('#txtBudget').text(budg.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))

                      // $('#txtRduration').text(fnc.)

                      $rtype = 'เป็นโครงการวิจัยที่ไม่ได้ขอทุนจากแหล่งทุนใด ๆ'
                      if(i.ts0 != 0){
                        $rtype = 'มีทุนวิจัยจากแหล่งทุน'
                      }
                      $('#txtFundingtype').text($rtype)

                      $rgroup = [];

                      if(i.ts1 == 1){
                        $rgroup.push('<div>- ทุนวิจัยคณะแพทยศาสตร์</div>')
                      }

                      if(i.ts7 == 1){
                        $rgroup.push('<div>- ทุนภาคเอกชน (Industry Sponsored Trial)</div>')
                      }

                      if(i.ts2 == 1){
                        $rgroup.push('<div>- ทุนงบประมาณแผ่นดิน</div>')
                      }

                      if(i.ts3 == 1){
                        $rgroup.push('<div>- เงินรายได้มหาวิทยาลัย</div>')
                      }

                      if(i.ts4 == 1){
                        $rgroup.push('<div>- ทุนอื่นภายในประเทศ</div>')
                      }

                      if(i.ts5 == 1){
                        $rgroup.push('<div>- ทุนอื่นภายนอกประเทศ</div>')
                      }

                      if(i.ts6 == 1){
                        $rgroup.push('<div>- ทุนอื่น ๆ </div>')
                      }

                      var fs = 'ไม่มี';
                      if($rgroup.length > 0){
                        fs = $rgroup.join("");
                      }

                      $('#txtFundinggroup').html(fs)
                      $('#txtFundingname').text(i.source_funds)

                      $('.txtSessid').text(i.session_id)

                      if(i.sendding_status == 'Y'){
                        // $('#btnPrint').removeClass('disabled')
                        // $('#btnSending').addClass('disabled')
                        // $('#btnEdit').addClass('disabled')
                        // $('#btnSending').addClass('dn')
                      }


                      preload.hide()


                    })

                    // checkReplyStatus()
                  }else{
                    preload.hide()
                  }
                })
                .fail(function(){
                  preload.hide()
                })

                var jxhr2 = $.post(conf.api + 'staff/pm-co-pi-info.php', {sess: current_rs, id: current_user}, function(){}, 'json')
                            .always(function(snap){

                              var co_piname = [];

                              if((snap.length > 0) && (snap != '')){
                                $n = 1;
                                snap.forEach(function(i){
                                  var copi_recordr = {
                                    rid: i.copi_id,
                                    prefix: i.co_prefix,
                                    prefix_name: i.prefix_name,
                                    fname: i.co_fname,
                                    lname: i.co_lname,
                                    email: i.co_email,
                                    pct: i.co_ratio,
                                    repot: i.co_job,
                                    session_id: i.co_sess_id,
                                    id: i.co_user_id
                                  }

                                  co_piname.push('<div>' + $n + '. ' + i.prefix_name + i.co_fname + ' ' + i.co_lname + ' (สัดส่วน : ' + i.co_ratio + '%)</div>');
                                  $n++;
                                })

                                var cn = 'เกิดข้อผิดพลาดในการดึงข้อมูล';

                                if(co_piname.length > 0){
                                  cn = co_piname.join("");
                                }

                                $('#txtCopi').html(cn)

                              }else{
                                $('#txtCopi').text('ไม่มีผู้ร่วมวิจัย')
                              }
                            },'json')
                            .fail(function(){
                              $('#txtCopi').text('ไม่พบข้อมูล')
                            })
  },
  load_rs_info: function(){
    var param = {
      id: current_user,
      sess: current_rs,
      id_rs: current_rs_id
    }
    var jxhr = $.post(conf.api + 'reviewer/get-rs-info.php', param, function(){}, 'json')
                .always(function(snap){

                  console.log(snap);

                  if((snap!='') && (snap.length > 0)){

                    // if(snap[0].rw_reply_status != 0){
                        reply_status = snap[0].rw_reply_status
                    // }

                    console.log(snap[0].rw_reply_status);

                    snap.forEach(function(i){
                      $('#txtIdrs').text(i.code_apdu)
                      $('#txtThtitle').text(i.title_th)
                      $('#txtEntitle').text(i.title_en)
                      $('#txtPi').text(i.prefix_name + i.fname + ' ' + i.lname)
                      $('#txtThkeyword').text(i.keywords_th)
                      $('#txtEnkeyword').text(i.keywords_en)
                      $('#txtRtype').text(i.type_name)
                      $('#txtYear').val(i.id_year)
                      $('#txtDept').val(i.id_dept)
                      $('#txtPertype').val(i.id_personnel)
                      $('.ecMsg').html(i.rw_sendding_msg)

                      $startdate = '0000-00-00';
                      $enddate = '0000-00-00';
                      $b1 = '0000-00-00'; $b2 = '0000-00-00';
                      $startdate = fnc.check_dateformat(i.start_date);
                      $b1 = $startdate;
                      $startdate = fnc.convertThaidate($startdate);

                      $enddate = fnc.check_dateformat(i.finish_date);
                      $b2 = $enddate;
                      $enddate = fnc.convertThaidate($enddate);

                      $durr = fnc.calDateDiff($b1, $b2)
                      // console.log($durr);

                      if(i.code_apdu != ''){
                        $('#txtCode').text(i.code_apdu)
                        var s = i.code_apdu.split('-')
                        $('#txtOrd').val(s[1])
                      }

                      $('#txtRduration').html('<div>เริ่มต้นโครงการ : ' + $startdate + ' วันที่สิ้นสุด : ' + $enddate + '</div>' + '<div>รวมจำนวน : ' + $durr + ' วัน </div>')
                      var budg = i.budget;
                      $('#txtRBudget').text(budg.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' บาท')



                      // $('#txtRduration').text(fnc.)

                      $rtype = 'เป็นโครงการวิจัยที่ไม่ได้ขอทุนจากแหล่งทุนใด ๆ'
                      if(i.ts0 != 0){
                        $rtype = 'มีทุนวิจัยจากแหล่งทุน'
                      }
                      $('#txtFundingtype').text($rtype)

                      $rgroup = [];

                      if(i.ts1 == 1){
                        $rgroup.push('<div>- ทุนวิจัยคณะแพทยศาสตร์</div>')
                      }

                      if(i.ts7 == 1){
                        $rgroup.push('<div>- ทุนภาคเอกชน (Industry Sponsored Trial)</div>')
                      }

                      if(i.ts2 == 1){
                        $rgroup.push('<div>- ทุนงบประมาณแผ่นดิน</div>')
                      }

                      if(i.ts3 == 1){
                        $rgroup.push('<div>- เงินรายได้มหาวิทยาลัย</div>')
                      }

                      if(i.ts4 == 1){
                        $rgroup.push('<div>- ทุนอื่นภายในประเทศ</div>')
                      }

                      if(i.ts5 == 1){
                        $rgroup.push('<div>- ทุนอื่นภายนอกประเทศ</div>')
                      }

                      if(i.ts6 == 1){
                        $rgroup.push('<div>- ทุนอื่น ๆ </div>')
                      }

                      var fs = 'ไม่มี';
                      if($rgroup.length > 0){
                        fs = $rgroup.join("");
                      }

                      $('#txtFundinggroup').html(fs)
                      $('#txtFundingname').text(i.source_funds)

                      $('.txtSessid').text(i.session_id)

                      if(i.sendding_status == 'Y'){
                        // $('#btnPrint').removeClass('disabled')
                        // $('#btnSending').addClass('disabled')
                        // $('#btnEdit').addClass('disabled')
                        // $('#btnSending').addClass('dn')
                      }


                      preload.hide()


                    })

                    // checkReplyStatus()
                  }else{
                    preload.hide()
                  }
                })
                .fail(function(){
                  preload.hide()
                })

                var jxhr2 = $.post(conf.api + 'staff/pm-co-pi-info.php', {sess: current_rs, id: current_user}, function(){}, 'json')
                            .always(function(snap){

                              var co_piname = [];

                              if((snap.length > 0) && (snap != '')){
                                $n = 1;
                                snap.forEach(function(i){
                                  var copi_recordr = {
                                    rid: i.copi_id,
                                    prefix: i.co_prefix,
                                    prefix_name: i.prefix_name,
                                    fname: i.co_fname,
                                    lname: i.co_lname,
                                    email: i.co_email,
                                    pct: i.co_ratio,
                                    repot: i.co_job,
                                    session_id: i.co_sess_id,
                                    id: i.co_user_id
                                  }

                                  co_piname.push('<div>' + $n + '. ' + i.prefix_name + i.co_fname + ' ' + i.co_lname + ' (สัดส่วน : ' + i.co_ratio + '%)</div>');
                                  $n++;
                                })

                                var cn = 'เกิดข้อผิดพลาดในการดึงข้อมูล';

                                if(co_piname.length > 0){
                                  cn = co_piname.join("");
                                }

                                $('#txtCopi').html(cn)

                              }else{
                                $('#txtCopi').text('ไม่มีผู้ร่วมวิจัย')
                              }
                            },'json')
                            .fail(function(){
                              $('#txtCopi').text('ไม่พบข้อมูล')
                            })
  }, // End load_rs_info


}

function checkReplyStatus(){

  if(reply_status != 0){
    $('#btnAc1').addClass('dn')
    $('#btnAc2').addClass('dn')
    $('#btnAc3').addClass('dn_')
  }

  if(reply_status == 0){
    console.log(cstay);
    if(cstay == 'aknowledge'){
      $('#btnAc1').trigger('click')
    }else if(cstay == 'aknowledgehardcopy'){
      $('#btnAc2').trigger('click')
    }else if(cstay == 'notconside'){
      $('#btnAc3').trigger('click')
    }
  }
}

function checkDataReplyFile(id){

  if(id == 1){
    var param = {
      id: current_user,
      id_rs: current_rs_id
    }
    var response = $.post(conf.api + 'reviewer/check_file_reply_assesment.php', param, function(){}, 'json')
                    .always(function(snap){
                      console.log(snap);
                      if((snap != '') && (snap.length > 0)){

                        $('#ft_assesment_reply_table').empty()
                        $('#ft_assesment_reply').empty()
                        $c = 1;
                        snap.forEach(function(childSnap){
                          var data = '<li class="mb-5">' +
                                      '<div class="row" style="border: solid; border-width: 0px 0px 0px 0px; border-color: rgb(136, 136, 136); padding: 10px 0px; background: rgb(245, 244, 244);">' +
                                        '<div class="col-sm-8">' +
                                          '<a class="f500 txt-dark" href="' + childSnap.rfa_filefullpart + '" target="_blank" style="font-size: 1.2em;">' + childSnap.rfa_filename + '</a>' +
                                        '</div>' +
                                        '<div class="col-sm-2">' +
                                          '<a class="btn btn-block btn-success" href="' + childSnap.rfa_filefullpart + '" target="_blank"><i class="fa fa-download text-light mr-5"></i> <span class="hidden-sm">ดาวน์โหลด</span></a>' +
                                        '</div>' +
                                        '<div class="col-sm-2">' +
                                          '<a class="btn btn-block btn-danger btnDeleteReply" id="btnDeleteReply" href="Javascript:deleteAssesmentReply(' + childSnap.rfa_id + ')" target="_blank"><i class="fas fa-trash text-light mr-5"></i> <span class="hidden-sm">ลบ</span></a>' +
                                        '</div>' +
                                      '</div>' +
                                      '</li>';
                          $('#ft_assesment_reply').append(data);

                          var data2 = '<tr>' +
                                        '<td class=text-center>' + $c + '</td>' +
                                        '<td>' + childSnap.rfa_filename + '</td>' +
                                      '</tr>'

                          $('#ft_assesment_reply_table').append(data2)
                          numreplyfile++;
                          $c++;
                        })

                        console.log(numreplyfile);

                        if(numreplyfile != 0){
                          if(reply_status != 4){
                            $('#btnSendAsessment').prop('disabled', '')
                          }
                        }
                      }else{
                        $('#ft_assesment_reply').empty()
                        $('#ft_assesment_reply_table').empty()

                        var data2 = '<tr>' +
                                      '<td colspan="3">No uploaded files</td>' +
                                    '</tr>'

                        $('#ft_assesment_reply_table').append(data2)
                      }
                    }, 'json')
                    .fail(function(){
                      $('#ft_assesment_reply').append('ยังไม่เชื่อมต่อฐานข้อมูลได้')
                    })
    return ;
  }

  numreplyfile = 0;

  var param = {
    id: current_user,
    id_rs: current_rs_id
  }
  var response = $.post(conf.api + 'reviewer/check_file_reply_assesment.php', param, function(){}, 'json')
                  .always(function(snap){
                    console.log(snap);
                    if((snap != '') && (snap.length > 0)){

                      $('#ft_assesment_reply_table').empty()
                      $('#ft_assesment_reply').empty()
                      $c = 1;
                      snap.forEach(function(childSnap){
                        var data = '<li class="mb-5">' +
                                    '<div class="row" style="border: solid; border-width: 0px 0px 0px 0px; border-color: rgb(136, 136, 136); padding: 10px 0px; background: rgb(245, 244, 244);">' +
                                      '<div class="col-sm-8">' +
                                        '<a class="f500 txt-dark" href="' + childSnap.rfa_filefullpart + '" target="_blank" style="font-size: 1.2em;">' + childSnap.rfa_filename + '</a>' +
                                      '</div>' +
                                      '<div class="col-sm-2">' +
                                        '<a class="btn btn-block btn-success" href="' + childSnap.rfa_filefullpart + '" target="_blank"><i class="fa fa-download text-light mr-5"></i> <span class="hidden-sm">ดาวน์โหลด</span></a>' +
                                      '</div>' +
                                      '<div class="col-sm-2">' +
                                        '<a class="btn btn-block btn-danger btnDeleteReply" id="btnDeleteReply" href="Javascript:deleteAssesmentReply(' + childSnap.rfa_id + ')" target="_blank"><i class="fas fa-trash text-light mr-5"></i> <span class="hidden-sm">ลบ</span></a>' +
                                      '</div>' +
                                    '</div>' +
                                    '</li>';
                        $('#ft_assesment_reply').append(data);

                        var data2 = '<tr>' +
                                      '<td class=text-center>' + $c + '</td>' +
                                      '<td>' + childSnap.rfa_filename + '</td>' +
                                      '<td>' +
                                        '<a class="btn btn-block btn-danger btn-sm" id="btnDeleteReply" href="Javascript:deleteAssesmentReply(' + childSnap.rfa_id + ')" target="_blank"><i class="fas fa-trash fa-2x text-light"></i></a>' +
                                      '</td>' +
                                    '</tr>'

                        $('#ft_assesment_reply_table').append(data2)
                        numreplyfile++;
                        $c++;
                      })

                      console.log(numreplyfile);

                      if(numreplyfile != 0){
                        if(reply_status != 4){
                          $('#btnSendAsessment').prop('disabled', '')
                        }
                      }
                    }else{
                      $('#ft_assesment_reply').empty()
                      $('#ft_assesment_reply_table').empty()

                      var data2 = '<tr>' +
                                    '<td colspan="3">No uploaded files</td>' +
                                  '</tr>'

                      $('#ft_assesment_reply_table').append(data2)
                    }
                  }, 'json')
                  .fail(function(){
                    $('#ft_assesment_reply').append('ยังไม่เชื่อมต่อฐานข้อมูลได้')
                  })
}

function deleteAssesmentReply(did){

  var param = {
    id: current_user,
    id_rs: current_rs_id,
    fid: did
  }

  var jxhr = $.post(conf.api + 'reviewer/delete_file_assesment_reply.php', param, function(){})
              .always(function(resp){

                console.log(resp);
                if(resp != 'Y'){
                  alert(resp)
                }
                checkDataReplyFile()
              })


}

function checkFileAssesment(status){

  if(status == 'finished'){
    console.log('View finish');
    var param = {
      id: current_user,
      id_rs: current_rs_id
    }
    var response = $.post(conf.api + 'reviewer/check_file_assesment.php', param, function(){}, 'json')
                    .always(function(snap){
                      if((snap != '') && (snap.length > 0)){
                        $('#ft_assesment').empty()
                        $('#ft_assesment_e').empty()
                        $('#assesmentList').empty()

                        $data_assesment = ''
                        snap.forEach(function(childSnap){

                          if((childSnap.fid == '2') || (childSnap.fid == '3') || (childSnap.fid == '4') || (childSnap.fid == '8') || (childSnap.fid == '9') || (childSnap.fid == '10') || (childSnap.fid == '11') || (childSnap.fid == '12') || (childSnap.fid == '13')){
                            console.log('sssss');

                            eformnum++;
                            $data_assesment = '<tr>' +
                                      '<td><span class="txt-dark f500" style="font-size: 1.2em;">' + childSnap.fid_name + '</span><br><button class="btn btn-success mt-10 ml-0 btn-lg_ btn-block_ btn-sm_ mr-5" onclick="doEform_view(' + childSnap.fid + ')"><i class="fas fa-search"></i> ดูผลการประเมิน</button></td>' +
                                      // '<td class="text-center"><span class="" style="" id="response_form_' + childSnap.fid + '">ดำเนินการสำเร็จ</span></td>' +
                                    '</tr>'

                            $form = ''

                            if(childSnap.fid == '2'){
                              $form = '<button class="btn btn-success btn-lg_ btn-square_ btn-sm_ mr-5" onclick="doBio()"><i class="fas fa-pencil-alt"></i> ทำแบบประเมิน</button>'
                            }else if(childSnap.fid == '3'){
                            }else if(childSnap.fid == '4'){
                              $form = '<button class="btn btn-success btn-lg_ btn-square_ btn-sm_ mr-5" onclick="doIcf()"><i class="fas fa-pencil-alt"></i> ทำแบบประเมิน</button>'
                            }else if(childSnap.fid == '13'){
                              $form = '<button class="btn btn-success btn-lg_ btn-square_ btn-sm_ mr-5" onclick="doFunding()"><i class="fas fa-search"></i> ทำแบบประเมิน</button>'
                            }

                            var data = '<li class="mb-5"><a href="../form_download/' + childSnap.fid_name + '" target="_blank"><i class="fa fa-download text-info mr-5"></i></a> ' + childSnap.fid_name + '</li>';
                            $('#ft_assesment').append(data);

                            data = '<div class="" style="border: solid; border-width: 0px; border-color: rgb(221, 221, 221); border-radius: 5px; padding-bottom: 10px;">' +
                                      '<div class="row">' +
                                        '<div class="col-sm-12" style="padding-top: px;">' + childSnap.fid_name + '</div>' +
                                        '<div class="col-sm-12">' +

                                          $form +
                                          // '<button class="btn btn-success btn-square_ btn-sm mr-5" data-toggle="modal" data-target=".bs-example-modal-lg-view" onclick="setAssesmentinfo()"><i class="zmdi zmdi-eye"></i> ดูแบบประเมิน</button>' +
                                          // '<button class="btn btn-danger btn-square_ btn-sm mr-5"><i class="zmdi zmdi-mail-send"></i> ส่งข้อมูล</button>' +
                                        '</div>' +
                                      '</div>' +
                                   '</div>'
                            $('#ft_assesment_e').append(data);

                            checkAssesmentStatus(childSnap.fid)

                          }else{

                            $data_assesment = ''

                            var data = '<li class="mb-5"><a href="../form_download/' + childSnap.fid_name + '" target="_blank"><i class="fa fa-download text-info mr-5"></i></a> ' + childSnap.fid_name + '</li>';
                            $('#ft_assesment').append(data);
                          }

                          if($data_assesment != '')
                              $('#assesmentList').append($data_assesment)

                        })
                      }else{
                        $('#ft_assesment').empty()
                        $('#ft_assesment').append('<tr><td>ไม่พบไฟล์แบบประเมิน กรุณาติดต่อเจ้าหน้าที่เพื่อตรวจสอบ</td></tr>')
                      }
                    }, 'json')
                    .fail(function(){
                      $('#ft_assesment').append('ยังไม่เชื่อมต่อฐานข้อมูลได้')
                    })
    return ;
  }

  if((reply_status == 0) && (reply_status == 3)){
    return ;
  }

  $('#replayBack1').addClass('dn')
  $('#replayBack2').removeClass('dn')
  var param = {
    id: current_user,
    id_rs: current_rs_id
  }
  var response = $.post(conf.api + 'reviewer/check_file_assesment.php', param, function(){}, 'json')
                  .always(function(snap){
                    if((snap != '') && (snap.length > 0)){
                      $('#ft_assesment').empty()
                      $('#ft_assesment_e').empty()
                      $('#assesmentList').empty()

                      $data_assesment = ''
                      snap.forEach(function(childSnap){

                        if((childSnap.fid == '2') || (childSnap.fid == '3') || (childSnap.fid == '4') || (childSnap.fid == '8') || (childSnap.fid == '9') || (childSnap.fid == '10') || (childSnap.fid == '11') || (childSnap.fid == '12') || (childSnap.fid == '13')){
                          eformnum++;
                          $data_assesment = '<tr>' +
                                    '<td><span class="txt-dark f500" style="font-size: 1.2em;">' + childSnap.fid_name + '</span></td>' +
                                    '<td class="text-center"><span class="" style="" id="response_form_' + childSnap.fid + '">รอดำเนินการ</span></td>' +
                                    '<td class="text-center">' +
                                      '<button class="btn btn-success btn-lg_ btn-block btn-sm_ mr-5" onclick="doEform(' + childSnap.fid + ')" id="response_form_text_' + childSnap.fid + '"><i class="fas fa-pencil-alt"></i> ทำแบบประเมิน</button>' +
                                    '</td>' +
                                  '</tr>'

                          $form = ''

                          if(childSnap.fid == '2'){
                            $form = '<button class="btn btn-success btn-lg_ btn-square_ btn-sm_ mr-5" onclick="doBio()"><i class="fas fa-pencil-alt"></i> ทำแบบประเมิน</button>'
                          }else if(childSnap.fid == '3'){
                          }else if(childSnap.fid == '4'){
                            $form = '<button class="btn btn-success btn-lg_ btn-square_ btn-sm_ mr-5" onclick="doIcf()"><i class="fas fa-pencil-alt"></i> ทำแบบประเมิน</button>'
                          }else if(childSnap.fid == '13'){
                            $form = '<button class="btn btn-success btn-lg_ btn-square_ btn-sm_ mr-5" onclick="doFunding()"><i class="fas fa-pencil-alt"></i> ทำแบบประเมิน</button>'
                          }

                          var data = '<li class="mb-5"><a href="../form_download/' + childSnap.fid_name + '" target="_blank"><i class="fa fa-download text-info mr-5"></i></a> ' + childSnap.fid_name + '</li>';
                          $('#ft_assesment').append(data);

                          data = '<div class="" style="border: solid; border-width: 0px; border-color: rgb(221, 221, 221); border-radius: 5px; padding-bottom: 10px;">' +
                                    '<div class="row">' +
                                      '<div class="col-sm-12" style="padding-top: px;">' + childSnap.fid_name + '</div>' +
                                      '<div class="col-sm-12">' +

                                        $form +
                                        // '<button class="btn btn-success btn-square_ btn-sm mr-5" data-toggle="modal" data-target=".bs-example-modal-lg-view" onclick="setAssesmentinfo()"><i class="zmdi zmdi-eye"></i> ดูแบบประเมิน</button>' +
                                        // '<button class="btn btn-danger btn-square_ btn-sm mr-5"><i class="zmdi zmdi-mail-send"></i> ส่งข้อมูล</button>' +
                                      '</div>' +
                                    '</div>' +
                                 '</div>'
                          $('#ft_assesment_e').append(data);

                          checkAssesmentStatus(childSnap.fid)

                        }else{

                          $data_assesment = '<tr>' +
                                    '<td><span class="txt-dark f500" style="font-size: 1.2em;">' + childSnap.fid_name + '</span><br>กรุณาทำแบบประเมินนี้และอัพโหลดกลับระบบใน <a href="javascript:void(0)" class="text-success" onclick="doUploadBtn()">ขั้นตอนที่ 3</a></td>' +
                                    '<td><span class="text-center" style="">รอดำเนินการ</span></td>' +
                                    '<td class="text-center">' +
                                      '<button class="btn btn-success  btn-block mr-5" onclick="doDownload(\'../form_download/' + childSnap.fid_name + '\')"><i class="fas fa-download"></i> ดาวน์โหลด</button>' +
                                    '</td>' +
                                  '</tr>'

                          var data = '<li class="mb-5"><a href="../form_download/' + childSnap.fid_name + '" target="_blank"><i class="fa fa-download text-info mr-5"></i></a> ' + childSnap.fid_name + '</li>';
                          $('#ft_assesment').append(data);
                        }

                        $('#assesmentList').append($data_assesment)

                      })
                    }else{
                      $('#ft_assesment').empty()
                      $('#ft_assesment').append('<tr><td>ไม่พบไฟล์แบบประเมิน กรุณาติดต่อเจ้าหน้าที่เพื่อตรวจสอบ</td></tr>')
                    }
                  }, 'json')
                  .fail(function(){
                    $('#ft_assesment').append('ยังไม่เชื่อมต่อฐานข้อมูลได้')
                  })
}

function checkFileAttached(){
  for(var i = 1; i <=8 ; i++){
    checkData(i);
  }
}

function checkData(i){

  console.log(current_rs_id);

  $('#ft' + i).empty()
  var response = $.post(conf.api + 'staff/check_upload_file_research_registration.php', {doctype: i, session_id: current_rs, id_rs: current_rs_id, id_reviewer: current_user}, function(){}, 'json')
                  .always(function(snap){
                    if((snap != '') && (snap.length > 0)){
                      $('#ft' + i).empty();
                      snap.forEach(function(childSnap){
                        var data = '<li class="mb-5"><a href="../tmp_file/' + childSnap.f_name + '" target="_blank"><i class="fa fa-download text-info mr-5"></i></a> ' + childSnap.f_name + '</li>';
                        $('#ft' + i).append(data);
                      })
                    }else{
                      $('#ft' + i).append('ไม่พบไฟล์แนบ');
                    }
                  },'json');
}

function setAssesmentinfo(){

}

function clickNotfitBtn(form_id, ele_id){

  selected_choice = ele_id
  current_ele_id = ele_id

  console.log(form_id);

  $('.bs-example-modal-lg-do').modal({})

  $('#q_qtype').val(form_id)
  $('#q_qprev_id').val(ele_id)

  $baseinf0 = $('#e' + ele_id).html()

  $d = $baseinf0.split('<div class="commentPane"')
  notfin_info.setData($('#comment_id_' + ele_id).html())

  if($d.length > 0){
    $('#question_topic').text($d[0])
  }else{
    $('#question_topic').text($('#e' + ele_id).text())
  }

  if(form_id == '4'){
    $('#ass_title').text('แบบประเมินกระบวนการขอความยินยอมจากอาสาสมัคร (สำหรับ ICF reviewer)')
  }

  if(form_id == '3'){
    $('#ass_title').text('แบบประเมินโครงการวิจัยทางสังคมศาสตร์/พฤติกรรมศาสตร์ (ทบทวนครั้งแรก)')
  }

  if(form_id == '2'){
    $('#ass_title').text('แบบประเมินโครงการวิจัยทางชีวการแพทย์ (ทบทวนครั้งแรก)')
  }
}

function doDownload(url){
  window.open(url)
}

function doEform_view(form_id){
  window.localStorage.setItem('rmis_current_assesment_form', form_id)
  if(form_id == 2){
    window.location = 'assesment_form_bio_view_th.html'
  }else if(form_id == 3){
    window.location = 'assesment_form_social_view_th.html'
  }else if(form_id == 4){
    window.location = 'assesment_form_icf_view_th.html'
  }else if(form_id == 8){
    window.location = 'assesment_form_mta_view_th.html'
  }else if(form_id == 9){
    window.location = 'assesment_form_bio_en.html'
  }else if(form_id == 10){
    window.location = 'assesment_form_social_en.html'
  }else if(form_id == 11){
    window.location = 'assesment_form_bio_fund_th.html'
  }else if(form_id == 12){
    window.location = 'assesment_form_social_fund_th.html'
  }else if(form_id == 13){
    window.location = 'assesment_form_funding_view_th.html'
  }
}

function doEform(form_id){
  window.localStorage.setItem('rmis_current_assesment_form', form_id)
  if(form_id == 2){
    window.location = 'assesment_form_bio_th.html'
  }else if(form_id == 3){
    window.location = 'assesment_form_social_th.html'
  }else if(form_id == 4){
    window.location = 'assesment_form_icf_th.html'
  }else if(form_id == 8){
    window.location = 'assesment_form_mta_th.html'
  }else if(form_id == 9){
    window.location = 'assesment_form_bio_en.html'
  }else if(form_id == 10){
    window.location = 'assesment_form_social_en.html'
  }else if(form_id == 11){
    window.location = 'assesment_form_bio_fund_th.html'
  }else if(form_id == 12){
    window.location = 'assesment_form_social_fund_th.html'
  }else if(form_id == 13){
    window.location = 'assesment_form_funding_th.html'
  }

}

function checkAcnowledegeStatus(){
  var param = {
   id_rs: current_rs_id,
   user: current_user
  }

  var jxr = $.post(conf.api + 'reviewer/check_acknowledge_status.php', param, function(){}, 'json')
             .always(function(snap){
               if((snap != '') && (snap.length > 0)){
                 snap.forEach(function(i){
                   console.log(i.rw_reply_status);
                   if((i.rw_reply_status != 0) || (i.rw_reply_status == 3)){
                     $('.li_1').css('display', '')
                   }

                   if(i.rir_status == 'Reviewer 1'){
                     $('.li_2').css('display', '')
                   }
                 })
               }
             })
}

function saveCommentDraft_icf(stage){
  if(stage == 1){
    saveCommentDraft_icf(2)
    if(checkIcfStatus_alert()){
      setUndraftIcf()
      return ;
    }
  }else if(stage == 2){
    console.log('Stage = 2 : Save without alert');
    var param = {
      id_rs: current_rs_id,
      user: current_user,
      efb_gc: gc_bio.getData(),
      efb_1: $('input[name=radio01]:checked').val(),
      efb_2: $('input[name=radio02]:checked').val(),
      efb_3: $('input[name=radio03]:checked').val(),
      efb_4: $('input[name=radio04]:checked').val(),
      efb_5: $('input[name=radio05]:checked').val(),
      efb_6: $('input[name=radio06]:checked').val(),
      efb_7: $('input[name=radio07]:checked').val(),
      efb_8: $('input[name=radio08]:checked').val(),
      efb_9: $('input[name=radio09]:checked').val(),
      efb_10: $('input[name=radio010]:checked').val(),
      efb_11: $('input[name=radio011]:checked').val(),
      efb_12: $('input[name=radio012]:checked').val(),
      efb_13: $('input[name=radio013]:checked').val(),
      efb_14: $('input[name=radio014]:checked').val(),
      efb_15: $('input[name=radio015]:checked').val(),
      efb_16: $('input[name=radio016]:checked').val(),
      efb_17: $('input[name=radio017]:checked').val(),
      efb_18: $('input[name=radio018]:checked').val(),
      efb_19: $('input[name=radio019]:checked').val(),
      efb_20: $('input[name=radio020]:checked').val(),
      efb_21: $('input[name=radio021]:checked').val(),
      efb_22: $('input[name=radio022]:checked').val(),
      efb_23: $('input[name=radio023]:checked').val(),
      efb_42: $('input[name=radio042]:checked').val(),
      efb_42_comment: notfin_info2.getData()
    }
    var jxr = $.post(conf.api + 'reviewer/saveCommentDraft_icf.php', param ,function(){})
               .always(function(resp){ console.log(resp); })
  }else{
    checkIcfStatus()
    console.log('Stage = 3 : Save with alert');
    var param = {
      id_rs: current_rs_id,
      user: current_user,
      efb_gc: gc_bio.getData(),
      efb_1: $('input[name=radio01]:checked').val(),
      efb_2: $('input[name=radio02]:checked').val(),
      efb_3: $('input[name=radio03]:checked').val(),
      efb_4: $('input[name=radio04]:checked').val(),
      efb_5: $('input[name=radio05]:checked').val(),
      efb_6: $('input[name=radio06]:checked').val(),
      efb_7: $('input[name=radio07]:checked').val(),
      efb_8: $('input[name=radio08]:checked').val(),
      efb_9: $('input[name=radio09]:checked').val(),
      efb_10: $('input[name=radio010]:checked').val(),
      efb_11: $('input[name=radio011]:checked').val(),
      efb_12: $('input[name=radio012]:checked').val(),
      efb_13: $('input[name=radio013]:checked').val(),
      efb_14: $('input[name=radio014]:checked').val(),
      efb_15: $('input[name=radio015]:checked').val(),
      efb_16: $('input[name=radio016]:checked').val(),
      efb_17: $('input[name=radio017]:checked').val(),
      efb_18: $('input[name=radio018]:checked').val(),
      efb_19: $('input[name=radio019]:checked').val(),
      efb_20: $('input[name=radio020]:checked').val(),
      efb_21: $('input[name=radio021]:checked').val(),
      efb_22: $('input[name=radio022]:checked').val(),
      efb_23: $('input[name=radio023]:checked').val(),
      efb_42: $('input[name=radio042]:checked').val(),
      efb_42_comment: notfin_info2.getData()
    }
    var jxr = $.post(conf.api + 'reviewer/saveCommentDraft_icf.php', param ,function(){})
               .always(function(resp){
                 console.log(resp);
                 if(resp == 'Y'){
                  swal("ดำเนินการสำเร็จ", "บันทึกแบบร่างสำเร็จ!", "success")
                 }else{
                  swal("คำเตือน", "เกิดข้อผิดพลาดในการบันทึกแบบร่างหรือระบบตรวจพบว่าท่านยังไม่ทำการบันทึกข้อมูลใด ๆ กรุณาลองใหม่อีกครั้ง หรือแจ้งปัญหานี้กับเจ้าหน้าที่!", "warning")
                 }
               })
  }
}

function saveCommentDraft_social(stage){

  if(stage == 1){
    saveCommentDraft_social(2)
    if(checkSocialStatus_alert()){
      setUndraftsocial()
      return ;
    }
  }else if(stage == 2){
    var param = {
      id_rs: current_rs_id,
      user: current_user,
      efb_gc: gc_bio.getData(),
      efb_1: $('input[name=radio01]:checked').val(),
      efb_2: $('input[name=radio02]:checked').val(),
      efb_3: $('input[name=radio03]:checked').val(),
      efb_4: $('input[name=radio04]:checked').val(),
      efb_5: $('input[name=radio05]:checked').val(),
      efb_6: $('input[name=radio06]:checked').val(),
      efb_7: $('input[name=radio07]:checked').val(),
      efb_8: $('input[name=radio08]:checked').val(),
      efb_9: $('input[name=radio09]:checked').val(),
      efb_10: $('input[name=radio010]:checked').val(),
      efb_11: $('input[name=radio011]:checked').val(),
      efb_12: $('input[name=radio012]:checked').val(),
      efb_13: $('input[name=radio013]:checked').val(),
      efb_14: $('input[name=radio014]:checked').val(),
      efb_15: $('input[name=radio015]:checked').val(),
      efb_16: $('input[name=radio016]:checked').val(),
      efb_17: $('input[name=radio017]:checked').val(),
      efb_18: $('input[name=radio018]:checked').val(),
      efb_19: $('input[name=radio019]:checked').val(),
      efb_20: $('input[name=radio020]:checked').val(),
      efb_21: $('input[name=radio021]:checked').val(),
      efb_22: $('input[name=radio022]:checked').val(),
      efb_23: $('input[name=radio023]:checked').val(),
      efb_24: $('input[name=radio024]:checked').val(),
      efb_25: $('input[name=radio025]:checked').val(),
      efb_26: $('input[name=radio026]:checked').val(),
      efb_27: $('input[name=radio027]:checked').val(),
      efb_28: $('input[name=radio028]:checked').val(),
      efb_29: $('input[name=radio029]:checked').val(),
      efb_30: $('input[name=radio030]:checked').val(),
      efb_42: $('input[name=radio042]:checked').val()
    }
    var jxr = $.post(conf.api + 'reviewer/saveCommentDraft_social.php', param ,function(){})
               .always(function(resp){ console.log(resp); })
  }else{
    checkSocialStatus()
    var param = {
      id_rs: current_rs_id,
      user: current_user,
      efb_gc: gc_bio.getData(),
      efb_1: $('input[name=radio01]:checked').val(),
      efb_2: $('input[name=radio02]:checked').val(),
      efb_3: $('input[name=radio03]:checked').val(),
      efb_4: $('input[name=radio04]:checked').val(),
      efb_5: $('input[name=radio05]:checked').val(),
      efb_6: $('input[name=radio06]:checked').val(),
      efb_7: $('input[name=radio07]:checked').val(),
      efb_8: $('input[name=radio08]:checked').val(),
      efb_9: $('input[name=radio09]:checked').val(),
      efb_10: $('input[name=radio010]:checked').val(),
      efb_11: $('input[name=radio011]:checked').val(),
      efb_12: $('input[name=radio012]:checked').val(),
      efb_13: $('input[name=radio013]:checked').val(),
      efb_14: $('input[name=radio014]:checked').val(),
      efb_15: $('input[name=radio015]:checked').val(),
      efb_16: $('input[name=radio016]:checked').val(),
      efb_17: $('input[name=radio017]:checked').val(),
      efb_18: $('input[name=radio018]:checked').val(),
      efb_19: $('input[name=radio019]:checked').val(),
      efb_20: $('input[name=radio020]:checked').val(),
      efb_21: $('input[name=radio021]:checked').val(),
      efb_22: $('input[name=radio022]:checked').val(),
      efb_23: $('input[name=radio023]:checked').val(),
      efb_24: $('input[name=radio024]:checked').val(),
      efb_25: $('input[name=radio025]:checked').val(),
      efb_26: $('input[name=radio026]:checked').val(),
      efb_27: $('input[name=radio027]:checked').val(),
      efb_28: $('input[name=radio028]:checked').val(),
      efb_29: $('input[name=radio029]:checked').val(),
      efb_30: $('input[name=radio030]:checked').val(),
      efb_42: $('input[name=radio042]:checked').val()
    }
    var jxr = $.post(conf.api + 'reviewer/saveCommentDraft_social.php', param ,function(){})
               .always(function(resp){
                 console.log(resp);
                 if(resp == 'Y'){
                   swal("ดำเนินการสำเร็จ", "บันทึกแบบร่างสำเร็จ!", "success")
                 }else{
                   swal("คำเตือน", "เกิดข้อผิดพลาดในการบันทึกแบบร่าง กรุณาลองใหม่อีกครั้ง หรือแจ้งปัญหานี้กับเจ้าหน้าที่!", "warning")
                 }
               })
  }
}

function loadFundingInfo_view(){
  var param = {
    id_rs: current_rs_id,
    user: current_user
  }

  var jxr = $.post(conf.api + 'reviewer/load-funding-info.php', param, function(){}, 'json')
             .always(function(snap){
               if((snap != '') && (snap.length > 0)){
                snap.forEach(function(i){
                  console.log(i);
                  $('.radio01-' + i.eff_c1).html('<i class="far fa-check-circle text-danger"></i>')
                  $('.radio02-' + i.eff_c2).html('<i class="far fa-check-circle text-danger"></i>')
                  $('.radio03-' + i.eff_c3).html('<i class="far fa-check-circle text-danger"></i>')
                  $('.radio04-' + i.eff_c4).html('<i class="far fa-check-circle text-danger"></i>')
                  $('.radio05-' + i.eff_c5).html('<i class="far fa-check-circle text-danger"></i>')
                  $('.radio06-' + i.eff_c6).html('<i class="far fa-check-circle text-danger"></i>')

                  $('.radio042-' + i.eff_summary).html('<i class="far fa-check-circle text-danger"></i>')
                  if(i.eff_summary == '4'){
                    $('#notFitInfo').removeClass('dn')
                    $('#notFitInfo').html(i.eff_summary_message)
                  }

                  $('#totalyScore').text(i.eff_totalscore)
                })

                // setTimeout(function(){
                //   checkFundingStatus()
                //   calculateFundingScore()
                // }, 1000)
              }
             })
}
function loadFundingInfo(){
  var param = {
    id_rs: current_rs_id,
    user: current_user
  }

  var jxr = $.post(conf.api + 'reviewer/load-funding-info.php', param, function(){}, 'json')
             .always(function(snap){
               if((snap != '') && (snap.length > 0)){
                snap.forEach(function(i){
                  $("input[name=radio01][value=" + i.eff_c1 + "]").attr('checked', 'checked');
                  $("input[name=radio02][value=" + i.eff_c2 + "]").attr('checked', 'checked');
                  $("input[name=radio03][value=" + i.eff_c3 + "]").attr('checked', 'checked');
                  $("input[name=radio04][value=" + i.eff_c4 + "]").attr('checked', 'checked');
                  $("input[name=radio05][value=" + i.eff_c5 + "]").attr('checked', 'checked');
                  $("input[name=radio06][value=" + i.eff_c6 + "]").attr('checked', 'checked');

                  notfin_info2.setData(i.eff_summary_message)
                  $("input[name=radio042][value=" + i.eff_summary + "]").attr('checked', 'checked');
                  if(i.eff_summary == '4'){
                    $('#notFitInfo').removeClass('dn')
                  }
                })

                setTimeout(function(){
                  checkFundingStatus()
                  calculateFundingScore()
                }, 1000)
              }
             })
}

function setUndraftFunding(){
  saveCommentDraft_funding()
  preload.show()
  var param = {
    id_rs: current_rs_id,
    user: current_user
  }
  var jxt = $.post(conf.api + 'reviewer/confirm_funding.php', param, function(){})
            .always(function(resp){
              console.log(resp);
              preload.hide()
              if(resp == 'Y'){
                swal({    title: "บันทึกข้อมูลสำเร็จ",
                              text: "กด 'ตกลง' เพื่อกลับสู่หน้าหลัก",
                              type: "success",
                              showCancelButton: false,
                              confirmButtonColor: "#1ed1a1",
                              confirmButtonText: "ตกลง",
                              closeOnConfirm: false },
                              function(){
                                window.location = 'research_info.html'
                              });
              }else{
                swal({    title: "เกิดความผิดพลาด",
                              text: "ไม่สามารถบันทึกข้อมูลได้",
                              type: "success",
                              showCancelButton: false,
                              confirmButtonColor: "#1ed1a1",
                              confirmButtonText: "ลองใหม่",
                              closeOnConfirm: true },
                              function(){

                              });
              }
            })
            .fail(function(){
              alert('error')
            })
}

function saveCommentDraft_funding(status){
  if(status == 1){
    saveCommentDraft_funding(2)
    if(checkFundingStatus_alert()){
      console.log('a');
      setUndraftFunding()
      return ;
    }
  }else if(status == 2){
    var param = {
      id_rs: current_rs_id,
      user: current_user,
      eff_c1: $('input[name=radio01]:checked').val(),
      eff_c2: $('input[name=radio02]:checked').val(),
      eff_c3: $('input[name=radio03]:checked').val(),
      eff_c4: $('input[name=radio04]:checked').val(),
      eff_c5: $('input[name=radio05]:checked').val(),
      eff_c6: $('input[name=radio06]:checked').val(),
      eff_totalscore: sum_score,
      eff_summary: $('input[name=radio042]:checked').val(),
      eff_summary_comment: notfin_info2.getData()
    }

    var jxr = $.post(conf.api + 'reviewer/saveCommentDraft_funding.php', param ,function(){})
               .always(function(resp){ console.log(resp); })
  }else{
    //Check ว่ากรอกข้อมูลครบรึยัง
    checkFundingStatus()

    var param = {
      id_rs: current_rs_id,
      user: current_user,
      eff_c1: $('input[name=radio01]:checked').val(),
      eff_c2: $('input[name=radio02]:checked').val(),
      eff_c3: $('input[name=radio03]:checked').val(),
      eff_c4: $('input[name=radio04]:checked').val(),
      eff_c5: $('input[name=radio05]:checked').val(),
      eff_c6: $('input[name=radio06]:checked').val(),
      eff_totalscore: sum_score,
      eff_summary: $('input[name=radio042]:checked').val(),
      eff_summary_comment: notfin_info2.getData()
    }

    var jxr = $.post(conf.api + 'reviewer/saveCommentDraft_funding.php', param ,function(){})
               .always(function(resp){
                 if(resp == 'Y'){
                  //  swal("ดำเนินการสำเร็จ", "บันทึกแบบร่างสำเร็จ!", "success")
                  swal({
                    title: "ดำเนินการสำเร็จ",
                    text: "บันทึกแบบประเมินเรียบร้อยแล้ว",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "กลับสู่หน้าหลัก",
                    closeOnConfirm: true },
                  function(){
                    window.location = 'research_info.html'
                  });

                 }else{
                   swal("คำเตือน", "เกิดข้อผิดพลาดในการบันทึกแบบร่างหรือระบบตรวจพบว่าท่านยังไม่ทำการบันทึกข้อมูลใด ๆ กรุณาลองใหม่อีกครั้ง หรือแจ้งปัญหานี้กับเจ้าหน้าที่!", "warning")
                 }
               })
  }
}

function saveCommentDraft_mta(status){

  if(status == 1){
    saveCommentDraft_mta(2)
    if(checkMtaStatus_alert()){
      setUndraftMta()
      return ;
    }
  }else if(status == 2){
    var param = {
      id_rs: current_rs_id,
      user: current_user,
      efb_gc: gc_bio.getData(),
      efb_42: $('input[name=radio042]:checked').val(),
      efb_42_comment: notfin_info2.getData()
    }

    var jxr = $.post(conf.api + 'reviewer/saveCommentDraft_mta.php', param ,function(){})
               .always(function(resp){})
  }else{
    //Check ว่ากรอกข้อมูลครบรึยัง
    checkMtaStatus()

    var param = {
      id_rs: current_rs_id,
      user: current_user
    }
    var param = {
      id_rs: current_rs_id,
      user: current_user,
      efb_gc: gc_bio.getData(),
      efb_42: $('input[name=radio042]:checked').val(),
      efb_42_comment: notfin_info2.getData()
    }

    var jxr = $.post(conf.api + 'reviewer/saveCommentDraft_mta.php', param ,function(){})
               .always(function(resp){
                 if(resp == 'Y'){
                   swal("ดำเนินการสำเร็จ", "บันทึกแบบร่างสำเร็จ!", "success")
                 }else{
                   swal("คำเตือน", "เกิดข้อผิดพลาดในการบันทึกแบบร่าง กรุณาลองใหม่อีกครั้ง หรือแจ้งปัญหานี้กับเจ้าหน้าที่!", "warning")
                 }
               })

  }
}

function saveCommentDraft_Bio(status){
  if(status == 1){
    saveCommentDraft_Bio(2)
    if(checkBioStatus_alert()){
      setUndraftBio()
      return ;
    }
  }else if(status == 2){
      console.log('Save with no alert');
      var param = {
        id_rs: current_rs_id,
        user: current_user,
        efb_gc: gc_bio.getData(),
        efb_1: $('input[name=radio01]:checked').val(),
        efb_2: $('input[name=radio02]:checked').val(),
        efb_3: $('input[name=radio03]:checked').val(),
        efb_4: $('input[name=radio04]:checked').val(),
        efb_5: $('input[name=radio05]:checked').val(),
        efb_6: $('input[name=radio06]:checked').val(),
        efb_7: $('input[name=radio07]:checked').val(),
        efb_8: $('input[name=radio08]:checked').val(),
        efb_9: $('input[name=radio09]:checked').val(),
        efb_10: $('input[name=radio010]:checked').val(),
        efb_11: $('input[name=radio011]:checked').val(),
        efb_12: $('input[name=radio012]:checked').val(),
        efb_13: $('input[name=radio013]:checked').val(),
        efb_14: $('input[name=radio014]:checked').val(),
        efb_15: $('input[name=radio015]:checked').val(),
        efb_16: $('input[name=radio016]:checked').val(),
        efb_17: $('input[name=radio017]:checked').val(),
        efb_18: $('input[name=radio018]:checked').val(),
        efb_19: $('input[name=radio019]:checked').val(),
        efb_20: $('input[name=radio020]:checked').val(),
        efb_21: $('input[name=radio021]:checked').val(),
        efb_22: $('input[name=radio022]:checked').val(),
        efb_23: $('input[name=radio023]:checked').val(),
        efb_24: $('input[name=radio024]:checked').val(),
        efb_25: $('input[name=radio025]:checked').val(),
        efb_26: $('input[name=radio026]:checked').val(),
        efb_27: $('input[name=radio027]:checked').val(),
        efb_28: $('input[name=radio028]:checked').val(),
        efb_29: $('input[name=radio029]:checked').val(),
        efb_30: $('input[name=radio030]:checked').val(),
        efb_31: $('input[name=radio031]:checked').val(),
        efb_32: $('input[name=radio032]:checked').val(),
        efb_33: $('input[name=radio033]:checked').val(),
        efb_34: $('input[name=radio034]:checked').val(),
        efb_35: $('input[name=radio035]:checked').val(),
        efb_36: $('input[name=radio036]:checked').val(),
        efb_37: $('input[name=radio037]:checked').val(),
        efb_38: $('input[name=radio038]:checked').val(),
        efb_39: $('input[name=radio039]:checked').val(),
        efb_40: $('input[name=radio040]:checked').val(),
        efb_41: $('input[name=radio041]:checked').val(),
        efb_42: $('input[name=radio042]:checked').val()
      }

    var jxr = $.post(conf.api + 'reviewer/saveCommentDraft_bio.php', param ,function(){})
               .always(function(resp){ console.log(resp); })
  }else{
    //Check ว่ากรอกข้อมูลครบรึยัง
    checkBioStatus()
    //
    var param = {
      id_rs: current_rs_id,
      user: current_user,
      efb_gc: gc_bio.getData(),
      efb_1: $('input[name=radio01]:checked').val(),
      efb_2: $('input[name=radio02]:checked').val(),
      efb_3: $('input[name=radio03]:checked').val(),
      efb_4: $('input[name=radio04]:checked').val(),
      efb_5: $('input[name=radio05]:checked').val(),
      efb_6: $('input[name=radio06]:checked').val(),
      efb_7: $('input[name=radio07]:checked').val(),
      efb_8: $('input[name=radio08]:checked').val(),
      efb_9: $('input[name=radio09]:checked').val(),
      efb_10: $('input[name=radio010]:checked').val(),
      efb_11: $('input[name=radio011]:checked').val(),
      efb_12: $('input[name=radio012]:checked').val(),
      efb_13: $('input[name=radio013]:checked').val(),
      efb_14: $('input[name=radio014]:checked').val(),
      efb_15: $('input[name=radio015]:checked').val(),
      efb_16: $('input[name=radio016]:checked').val(),
      efb_17: $('input[name=radio017]:checked').val(),
      efb_18: $('input[name=radio018]:checked').val(),
      efb_19: $('input[name=radio019]:checked').val(),
      efb_20: $('input[name=radio020]:checked').val(),
      efb_21: $('input[name=radio021]:checked').val(),
      efb_22: $('input[name=radio022]:checked').val(),
      efb_23: $('input[name=radio023]:checked').val(),
      efb_24: $('input[name=radio024]:checked').val(),
      efb_25: $('input[name=radio025]:checked').val(),
      efb_26: $('input[name=radio026]:checked').val(),
      efb_27: $('input[name=radio027]:checked').val(),
      efb_28: $('input[name=radio028]:checked').val(),
      efb_29: $('input[name=radio029]:checked').val(),
      efb_30: $('input[name=radio030]:checked').val(),
      efb_31: $('input[name=radio031]:checked').val(),
      efb_32: $('input[name=radio032]:checked').val(),
      efb_33: $('input[name=radio033]:checked').val(),
      efb_34: $('input[name=radio034]:checked').val(),
      efb_35: $('input[name=radio035]:checked').val(),
      efb_36: $('input[name=radio036]:checked').val(),
      efb_37: $('input[name=radio037]:checked').val(),
      efb_38: $('input[name=radio038]:checked').val(),
      efb_39: $('input[name=radio039]:checked').val(),
      efb_40: $('input[name=radio040]:checked').val(),
      efb_41: $('input[name=radio041]:checked').val(),
      efb_42: $('input[name=radio042]:checked').val()
    }

  var jxr = $.post(conf.api + 'reviewer/saveCommentDraft_bio.php', param ,function(){})
             .always(function(resp){
               console.log(resp);
                           if(resp == 'Y'){
                             swal("ดำเนินการสำเร็จ", "บันทึกแบบร่างสำเร็จ!", "success")
                           }else{
                             swal("คำเตือน", "เกิดข้อผิดพลาดในการบันทึกแบบร่าง กรุณาลองใหม่อีกครั้ง หรือแจ้งปัญหานี้กับเจ้าหน้าที่!", "warning")
                           }
              })
  }
}

// Old bio form
// function saveCommentDraft_bio(stage){
//   checBioStatus(stage)
//   var param = {
//     id_rs: current_rs_id,
//     user: current_user
//   }
//
//   var param = {
//     id_rs: current_rs_id,
//     user: current_user,
//     efb_gc: gc_bio.getData(),
//     efb_1: $('input[name=radio01]:checked').val(),
//     efb_2: $('input[name=radio02]:checked').val(),
//     efb_3: $('input[name=radio03]:checked').val(),
//     efb_4: $('input[name=radio04]:checked').val(),
//     efb_5: $('input[name=radio05]:checked').val(),
//     efb_6: $('input[name=radio06]:checked').val(),
//     efb_7: $('input[name=radio07]:checked').val(),
//     efb_8: $('input[name=radio08]:checked').val(),
//     efb_9: $('input[name=radio09]:checked').val(),
//     efb_10: $('input[name=radio010]:checked').val(),
//     efb_11: $('input[name=radio011]:checked').val(),
//     efb_12: $('input[name=radio012]:checked').val(),
//     efb_13: $('input[name=radio013]:checked').val(),
//     efb_14: $('input[name=radio014]:checked').val(),
//     efb_15: $('input[name=radio015]:checked').val(),
//     efb_16: $('input[name=radio016]:checked').val(),
//     efb_17: $('input[name=radio017]:checked').val(),
//     efb_18: $('input[name=radio018]:checked').val(),
//     efb_19: $('input[name=radio019]:checked').val(),
//     efb_20: $('input[name=radio020]:checked').val(),
//     efb_21: $('input[name=radio021]:checked').val(),
//     efb_22: $('input[name=radio022]:checked').val(),
//     efb_23: $('input[name=radio023]:checked').val(),
//     efb_24: $('input[name=radio024]:checked').val(),
//     efb_25: $('input[name=radio025]:checked').val(),
//     efb_26: $('input[name=radio026]:checked').val(),
//     efb_27: $('input[name=radio027]:checked').val(),
//     efb_28: $('input[name=radio028]:checked').val(),
//     efb_29: $('input[name=radio029]:checked').val(),
//     efb_30: $('input[name=radio030]:checked').val(),
//     efb_31: $('input[name=radio031]:checked').val(),
//     efb_32: $('input[name=radio032]:checked').val(),
//     efb_33: $('input[name=radio033]:checked').val(),
//     efb_34: $('input[name=radio034]:checked').val(),
//     efb_35: $('input[name=radio035]:checked').val(),
//     efb_36: $('input[name=radio036]:checked').val(),
//     efb_37: $('input[name=radio037]:checked').val(),
//     efb_38: $('input[name=radio038]:checked').val(),
//     efb_39: $('input[name=radio039]:checked').val(),
//     efb_40: $('input[name=radio040]:checked').val(),
//     efb_41: $('input[name=radio041]:checked').val(),
//     efb_42: $('input[name=radio042]:checked').val()
//   }
//
//   // console.log(param);
//
//   var jxr = $.post(conf.api + 'reviewer/saveCommentDraft_bio.php', param ,function(){})
//              .always(function(resp){
//                console.log(resp);
//              })
// }

// function loadCommentDraft_social_fund(){
//   console.log('Loading social draft info ...');
//   loading.show()
//
// }

function loadCommentDraft_social(){
  console.log('Loading social draft info ...');
  loading.show()
  var param = {
    id_rs: current_rs_id,
    user: current_user
  }
  var jxr = $.post(conf.api + 'reviewer/loadCommentDraft_social.php', param, function(){}, 'json')
             .always(function(snap){
               if((snap != '') && (snap.length > 0)){
                 $c = 0
                 snap.forEach(function(i){
                   gc_social.setData(i.efs_gc)
                   $('input:radio[name=radio01]').filter('[value=' + i.efs_1 + ']').prop('checked', true);
                   $('input:radio[name=radio02]').filter('[value=' + i.efs_2 + ']').prop('checked', true);
                   $('input:radio[name=radio03]').filter('[value=' + i.efs_3 + ']').prop('checked', true);
                   $('input:radio[name=radio04]').filter('[value=' + i.efs_4 + ']').prop('checked', true);
                   $('input:radio[name=radio05]').filter('[value=' + i.efs_5 + ']').prop('checked', true);
                   $('input:radio[name=radio06]').filter('[value=' + i.efs_6 + ']').prop('checked', true);
                   $('input:radio[name=radio07]').filter('[value=' + i.efs_7 + ']').prop('checked', true);
                   $('input:radio[name=radio08]').filter('[value=' + i.efs_8 + ']').prop('checked', true);
                   $('input:radio[name=radio09]').filter('[value=' + i.efs_9 + ']').prop('checked', true);
                   $('input:radio[name=radio010]').filter('[value=' + i.efs_10 + ']').prop('checked', true);
                   $('input:radio[name=radio011]').filter('[value=' + i.efs_11 + ']').prop('checked', true);
                   $('input:radio[name=radio012]').filter('[value=' + i.efs_12 + ']').prop('checked', true);
                   $('input:radio[name=radio013]').filter('[value=' + i.efs_13 + ']').prop('checked', true);
                   $('input:radio[name=radio014]').filter('[value=' + i.efs_14 + ']').prop('checked', true);
                   $('input:radio[name=radio015]').filter('[value=' + i.efs_15 + ']').prop('checked', true);
                   $('input:radio[name=radio016]').filter('[value=' + i.efs_16 + ']').prop('checked', true);
                   $('input:radio[name=radio017]').filter('[value=' + i.efs_17 + ']').prop('checked', true);
                   $('input:radio[name=radio018]').filter('[value=' + i.efs_18 + ']').prop('checked', true);
                   $('input:radio[name=radio019]').filter('[value=' + i.efs_19 + ']').prop('checked', true);
                   $('input:radio[name=radio020]').filter('[value=' + i.efs_20 + ']').prop('checked', true);
                   $('input:radio[name=radio021]').filter('[value=' + i.efs_21 + ']').prop('checked', true);
                   $('input:radio[name=radio022]').filter('[value=' + i.efs_22 + ']').prop('checked', true);
                   $('input:radio[name=radio023]').filter('[value=' + i.efs_23 + ']').prop('checked', true);
                   $('input:radio[name=radio024]').filter('[value=' + i.efs_24 + ']').prop('checked', true);
                   $('input:radio[name=radio025]').filter('[value=' + i.efs_25 + ']').prop('checked', true);
                   $('input:radio[name=radio026]').filter('[value=' + i.efs_26 + ']').prop('checked', true);
                   $('input:radio[name=radio027]').filter('[value=' + i.efs_27 + ']').prop('checked', true);
                   $('input:radio[name=radio028]').filter('[value=' + i.efs_28 + ']').prop('checked', true);
                   $('input:radio[name=radio029]').filter('[value=' + i.efs_29 + ']').prop('checked', true);
                   $('input:radio[name=radio030]').filter('[value=' + i.efs_30 + ']').prop('checked', true);
                   $('input:radio[name=radio042]').filter('[value=' + i.efs_42 + ']').prop('checked', true);
                 })
                 loading.hide()
               }else{
                 loading.hide()
                 console.log('No social draft info ...');
               }
             })
             .fail(function(){ loading.hide() })

             setTimeout(function(){
               checkSocialStatus()
             }, 3000)

             for (var i = 1; i <= 42; i++) {
               checkUncomment_social_not_fit(i)
             }
}

function loadCommentDraft_icf(){
  loading.show()
  var param = {
    id_rs: current_rs_id,
    user: current_user
  }
  var jxr = $.post(conf.api + 'reviewer/loadCommentDraft_icf.php', param, function(){}, 'json')
             .always(function(snap){
               console.log(snap);
               if((snap != '') && (snap.length > 0)){
                 $c = 0
                 snap.forEach(function(i){
                   gc_bio.setData(i.efi_gc)
                   $('input:radio[name=radio01]').filter('[value=' + i.efi_1 + ']').prop('checked', true);
                   $('input:radio[name=radio02]').filter('[value=' + i.efi_2 + ']').prop('checked', true);
                   $('input:radio[name=radio03]').filter('[value=' + i.efi_3 + ']').prop('checked', true);
                   $('input:radio[name=radio04]').filter('[value=' + i.efi_4 + ']').prop('checked', true);
                   $('input:radio[name=radio05]').filter('[value=' + i.efi_5 + ']').prop('checked', true);
                   $('input:radio[name=radio06]').filter('[value=' + i.efi_6 + ']').prop('checked', true);
                   $('input:radio[name=radio07]').filter('[value=' + i.efi_7 + ']').prop('checked', true);
                   $('input:radio[name=radio08]').filter('[value=' + i.efi_8 + ']').prop('checked', true);
                   $('input:radio[name=radio09]').filter('[value=' + i.efi_9 + ']').prop('checked', true);
                   $('input:radio[name=radio010]').filter('[value=' + i.efi_10 + ']').prop('checked', true);
                   $('input:radio[name=radio011]').filter('[value=' + i.efi_11 + ']').prop('checked', true);
                   $('input:radio[name=radio012]').filter('[value=' + i.efi_12 + ']').prop('checked', true);
                   $('input:radio[name=radio013]').filter('[value=' + i.efi_13 + ']').prop('checked', true);
                   $('input:radio[name=radio014]').filter('[value=' + i.efi_14 + ']').prop('checked', true);
                   $('input:radio[name=radio015]').filter('[value=' + i.efi_15 + ']').prop('checked', true);
                   $('input:radio[name=radio016]').filter('[value=' + i.efi_16 + ']').prop('checked', true);
                   $('input:radio[name=radio017]').filter('[value=' + i.efi_17 + ']').prop('checked', true);
                   $('input:radio[name=radio018]').filter('[value=' + i.efi_18 + ']').prop('checked', true);
                   $('input:radio[name=radio019]').filter('[value=' + i.efi_19 + ']').prop('checked', true);
                   $('input:radio[name=radio020]').filter('[value=' + i.efi_20 + ']').prop('checked', true);
                   $('input:radio[name=radio021]').filter('[value=' + i.efi_21 + ']').prop('checked', true);
                   $('input:radio[name=radio022]').filter('[value=' + i.efi_22 + ']').prop('checked', true);
                   $('input:radio[name=radio023]').filter('[value=' + i.efi_23 + ']').prop('checked', true);
                   $('input:radio[name=radio042]').filter('[value=' + i.efi_42 + ']').prop('checked', true);
                 })
               }else{
                 preload.hide()
               }
               // preload.hide()
             })
             setTimeout(function(){
               checBioStatus()
             }, 3000)

    for (var i = 1; i <= 42; i++) {
      checkUncomment_icf_not_fit(i)
    }
}

function loadCommentDraft_bio_fund(){
  loading.show()
  var param = {
    id_rs: current_rs_id,
    user: current_user
  }
  var jxr = $.post(conf.api + 'reviewer/loadCommentDraft_bio_fund.php', param, function(){}, 'json')
             .always(function(snap){
               if((snap != '') && (snap.length > 0)){
                 $c = 0
                 snap.forEach(function(i){
                   gc_bio.setData(i.efb_gc)
                   $('input:radio[name=radio01]').filter('[value=' + i.efb_1 + ']').prop('checked', true);
                   $('input:radio[name=radio02]').filter('[value=' + i.efb_2 + ']').prop('checked', true);
                   $('input:radio[name=radio03]').filter('[value=' + i.efb_3 + ']').prop('checked', true);
                   $('input:radio[name=radio04]').filter('[value=' + i.efb_4 + ']').prop('checked', true);
                   $('input:radio[name=radio05]').filter('[value=' + i.efb_5 + ']').prop('checked', true);
                   $('input:radio[name=radio06]').filter('[value=' + i.efb_6 + ']').prop('checked', true);
                   $('input:radio[name=radio07]').filter('[value=' + i.efb_7 + ']').prop('checked', true);
                   $('input:radio[name=radio08]').filter('[value=' + i.efb_8 + ']').prop('checked', true);
                   $('input:radio[name=radio09]').filter('[value=' + i.efb_9 + ']').prop('checked', true);
                   $('input:radio[name=radio010]').filter('[value=' + i.efb_10 + ']').prop('checked', true);
                   $('input:radio[name=radio011]').filter('[value=' + i.efb_11 + ']').prop('checked', true);
                   $('input:radio[name=radio012]').filter('[value=' + i.efb_12 + ']').prop('checked', true);
                   $('input:radio[name=radio013]').filter('[value=' + i.efb_13 + ']').prop('checked', true);
                   $('input:radio[name=radio014]').filter('[value=' + i.efb_14 + ']').prop('checked', true);
                   $('input:radio[name=radio015]').filter('[value=' + i.efb_15 + ']').prop('checked', true);
                   $('input:radio[name=radio016]').filter('[value=' + i.efb_16 + ']').prop('checked', true);
                   $('input:radio[name=radio017]').filter('[value=' + i.efb_17 + ']').prop('checked', true);
                   $('input:radio[name=radio018]').filter('[value=' + i.efb_18 + ']').prop('checked', true);
                   $('input:radio[name=radio019]').filter('[value=' + i.efb_19 + ']').prop('checked', true);
                   $('input:radio[name=radio020]').filter('[value=' + i.efb_20 + ']').prop('checked', true);
                   $('input:radio[name=radio021]').filter('[value=' + i.efb_21 + ']').prop('checked', true);
                   $('input:radio[name=radio022]').filter('[value=' + i.efb_22 + ']').prop('checked', true);
                   $('input:radio[name=radio023]').filter('[value=' + i.efb_23 + ']').prop('checked', true);
                   $('input:radio[name=radio024]').filter('[value=' + i.efb_24 + ']').prop('checked', true);
                   $('input:radio[name=radio025]').filter('[value=' + i.efb_25 + ']').prop('checked', true);
                   $('input:radio[name=radio026]').filter('[value=' + i.efb_26 + ']').prop('checked', true);
                   $('input:radio[name=radio027]').filter('[value=' + i.efb_27 + ']').prop('checked', true);
                   $('input:radio[name=radio028]').filter('[value=' + i.efb_28 + ']').prop('checked', true);
                   $('input:radio[name=radio029]').filter('[value=' + i.efb_29 + ']').prop('checked', true);
                   $('input:radio[name=radio030]').filter('[value=' + i.efb_30 + ']').prop('checked', true);
                   $('input:radio[name=radio031]').filter('[value=' + i.efb_31 + ']').prop('checked', true);
                   $('input:radio[name=radio032]').filter('[value=' + i.efb_32 + ']').prop('checked', true);
                   $('input:radio[name=radio033]').filter('[value=' + i.efb_33 + ']').prop('checked', true);
                   $('input:radio[name=radio034]').filter('[value=' + i.efb_34 + ']').prop('checked', true);
                   $('input:radio[name=radio035]').filter('[value=' + i.efb_35 + ']').prop('checked', true);
                   $('input:radio[name=radio036]').filter('[value=' + i.efb_36 + ']').prop('checked', true);
                   $('input:radio[name=radio037]').filter('[value=' + i.efb_37 + ']').prop('checked', true);
                   $('input:radio[name=radio038]').filter('[value=' + i.efb_38 + ']').prop('checked', true);
                   $('input:radio[name=radio039]').filter('[value=' + i.efb_39 + ']').prop('checked', true);
                   $('input:radio[name=radio040]').filter('[value=' + i.efb_40 + ']').prop('checked', true);
                   $('input:radio[name=radio041]').filter('[value=' + i.efb_41 + ']').prop('checked', true);
                   $('input:radio[name=radio042]').filter('[value=' + i.efb_42 + ']').prop('checked', true);
                   $('input:radio[name=radio043]').filter('[value=' + i.efb_43 + ']').prop('checked', true);
                   $('input:radio[name=radio044]').filter('[value=' + i.efb_44 + ']').prop('checked', true);
                   $('input:radio[name=radio045]').filter('[value=' + i.efb_45 + ']').prop('checked', true);
                   $('input:radio[name=radio046]').filter('[value=' + i.efb_46 + ']').prop('checked', true);
                   $('input:radio[name=radio047]').filter('[value=' + i.efb_47 + ']').prop('checked', true);
                   $('input:radio[name=radio048]').filter('[value=' + i.efb_48 + ']').prop('checked', true);
                   $('input:radio[name=radio049]').filter('[value=' + i.efb_49 + ']').prop('checked', true);
                   $('input:radio[name=radio050]').filter('[value=' + i.efb_50 + ']').prop('checked', true);
                   $('input:radio[name=radio051]').filter('[value=' + i.efb_51 + ']').prop('checked', true);
                   $('input:radio[name=radio052]').filter('[value=' + i.efb_52 + ']').prop('checked', true);
                   $('input:radio[name=radio053]').filter('[value=' + i.efb_53 + ']').prop('checked', true);
                 })
               }else{
                 preload.hide()
               }
               // preload.hide()
             })
             setTimeout(function(){
               checBioStatus_fund()
             }, 3000)

    for (var i = 1; i <= 53; i++) {
      checkUncomment_bio_fund_not_fit(i)
    }
}

function loadCommentDraft_bio(){
  loading.show()
  var param = {
    id_rs: current_rs_id,
    user: current_user
  }
  var jxr = $.post(conf.api + 'reviewer/loadCommentDraft_bio.php', param, function(){}, 'json')
             .always(function(snap){
               if((snap != '') && (snap.length > 0)){
                 $c = 0
                 snap.forEach(function(i){
                   gc_bio.setData(i.efb_gc)
                   $('input:radio[name=radio01]').filter('[value=' + i.efb_1 + ']').prop('checked', true);
                   $('input:radio[name=radio02]').filter('[value=' + i.efb_2 + ']').prop('checked', true);
                   $('input:radio[name=radio03]').filter('[value=' + i.efb_3 + ']').prop('checked', true);
                   $('input:radio[name=radio04]').filter('[value=' + i.efb_4 + ']').prop('checked', true);
                   $('input:radio[name=radio05]').filter('[value=' + i.efb_5 + ']').prop('checked', true);
                   $('input:radio[name=radio06]').filter('[value=' + i.efb_6 + ']').prop('checked', true);
                   $('input:radio[name=radio07]').filter('[value=' + i.efb_7 + ']').prop('checked', true);
                   $('input:radio[name=radio08]').filter('[value=' + i.efb_8 + ']').prop('checked', true);
                   $('input:radio[name=radio09]').filter('[value=' + i.efb_9 + ']').prop('checked', true);
                   $('input:radio[name=radio010]').filter('[value=' + i.efb_10 + ']').prop('checked', true);
                   $('input:radio[name=radio011]').filter('[value=' + i.efb_11 + ']').prop('checked', true);
                   $('input:radio[name=radio012]').filter('[value=' + i.efb_12 + ']').prop('checked', true);
                   $('input:radio[name=radio013]').filter('[value=' + i.efb_13 + ']').prop('checked', true);
                   $('input:radio[name=radio014]').filter('[value=' + i.efb_14 + ']').prop('checked', true);
                   $('input:radio[name=radio015]').filter('[value=' + i.efb_15 + ']').prop('checked', true);
                   $('input:radio[name=radio016]').filter('[value=' + i.efb_16 + ']').prop('checked', true);
                   $('input:radio[name=radio017]').filter('[value=' + i.efb_17 + ']').prop('checked', true);
                   $('input:radio[name=radio018]').filter('[value=' + i.efb_18 + ']').prop('checked', true);
                   $('input:radio[name=radio019]').filter('[value=' + i.efb_19 + ']').prop('checked', true);
                   $('input:radio[name=radio020]').filter('[value=' + i.efb_20 + ']').prop('checked', true);
                   $('input:radio[name=radio021]').filter('[value=' + i.efb_21 + ']').prop('checked', true);
                   $('input:radio[name=radio022]').filter('[value=' + i.efb_22 + ']').prop('checked', true);
                   $('input:radio[name=radio023]').filter('[value=' + i.efb_23 + ']').prop('checked', true);
                   $('input:radio[name=radio024]').filter('[value=' + i.efb_24 + ']').prop('checked', true);
                   $('input:radio[name=radio025]').filter('[value=' + i.efb_25 + ']').prop('checked', true);
                   $('input:radio[name=radio026]').filter('[value=' + i.efb_26 + ']').prop('checked', true);
                   $('input:radio[name=radio027]').filter('[value=' + i.efb_27 + ']').prop('checked', true);
                   $('input:radio[name=radio028]').filter('[value=' + i.efb_28 + ']').prop('checked', true);
                   $('input:radio[name=radio029]').filter('[value=' + i.efb_29 + ']').prop('checked', true);
                   $('input:radio[name=radio030]').filter('[value=' + i.efb_30 + ']').prop('checked', true);
                   $('input:radio[name=radio031]').filter('[value=' + i.efb_31 + ']').prop('checked', true);
                   $('input:radio[name=radio032]').filter('[value=' + i.efb_32 + ']').prop('checked', true);
                   $('input:radio[name=radio033]').filter('[value=' + i.efb_33 + ']').prop('checked', true);
                   $('input:radio[name=radio034]').filter('[value=' + i.efb_34 + ']').prop('checked', true);
                   $('input:radio[name=radio035]').filter('[value=' + i.efb_35 + ']').prop('checked', true);
                   $('input:radio[name=radio036]').filter('[value=' + i.efb_36 + ']').prop('checked', true);
                   $('input:radio[name=radio037]').filter('[value=' + i.efb_37 + ']').prop('checked', true);
                   $('input:radio[name=radio038]').filter('[value=' + i.efb_38 + ']').prop('checked', true);
                   $('input:radio[name=radio039]').filter('[value=' + i.efb_39 + ']').prop('checked', true);
                   $('input:radio[name=radio040]').filter('[value=' + i.efb_40 + ']').prop('checked', true);
                   $('input:radio[name=radio041]').filter('[value=' + i.efb_41 + ']').prop('checked', true);
                   $('input:radio[name=radio042]').filter('[value=' + i.efb_42 + ']').prop('checked', true);
                   console.log(i.efb_42);
                 })
               }else{
                 preload.hide()
               }
               // preload.hide()
             })
             setTimeout(function(){
               checBioStatus()
             }, 3000)

    for (var i = 1; i <= 42; i++) {
      checkUncomment_bio_not_fit(i)
    }
}

function checkUncomment_social_not_fit(i, hide_no_edit){
  var param = {
    id_rs: current_rs_id,
    user: current_user,
    ele: i
  }
  var jxr = $.post(conf.api + 'reviewer/getUncommentDraft_social_notfit.php', param, function(){})
             .always(function(resp){
               if(resp != ''){
                 console.log(i);
                 $('input:radio[name=radio0' + i.toString() + '][value=0]').attr('checked', true);


                 if(hide_no_edit){
                   $('#e' + i).append('<div class="commentPane" id="comment_div_id_' + i + '"><span class="commentMsg"><div id="comment_id_' + i + '">' + resp + '</div>' + '</span></div>')
                 }else{
                   $btn = '<div class="pt-0"><button class="btn btn-sm btn-success btn-square" style="box-shadow: none;" onclick="clickNotfitBtn(3, ' + i + ')"><i class="fas fa-pencil-alt"></i></button></div>'
                   $('#e' + i).append('<div class="commentPane" id="comment_div_id_' + i + '"><span class="commentMsg"><div id="comment_id_' + i + '">' + resp + '</div>' + $btn + '</span></div>')
                 }

               }
             })
}

function checkUncomment_icf_not_fit(i, hide_no_edit){
  var param = {
    id_rs: current_rs_id,
    user: current_user,
    ele: i
  }

  var jxr = $.post(conf.api + 'reviewer/getUncommentDraft_icf_notfit.php', param, function(){})
             .always(function(resp){
               if(resp != ''){
                 $('input:radio[name=radio0' + i.toString() + '][value=0]').attr('checked', true);

                 if(hide_no_edit){
                   $('#e' + i).append('<div class="commentPane" id="comment_div_id_' + i + '"><span class="commentMsg"><div id="comment_id_' + i + '">' + resp + '</div>' + '</span></div>')
                 }else{
                   $btn = '<div class="pt-0"><button class="btn btn-sm btn-success btn-square" style="box-shadow: none;" onclick="clickNotfitBtn(2, ' + i + ')"><i class="fas fa-pencil-alt"></i></button></div>'
                   $('#e' + i).append('<div class="commentPane" id="comment_div_id_' + i + '"><span class="commentMsg"><div id="comment_id_' + i + '">' + resp + '</div>' + $btn + '</span></div>')
                 }

               }
             })
}

function checkUncomment_bio_not_fit(i, hide_no_edit){
  var param = {
    id_rs: current_rs_id,
    user: current_user,
    ele: i
  }

  var jxr = $.post(conf.api + 'reviewer/getUncommentDraft_bio_notfit.php', param, function(){})
             .always(function(resp){
               if(resp != ''){
                  $('input:radio[name=radio0' + i.toString() + '][value=0]').attr('checked', true);

                  if(hide_no_edit){
                    $('#e' + i).append('<div class="commentPane" id="comment_div_id_' + i + '"><span class="commentMsg"><div id="comment_id_' + i + '">' + resp + '</div>' + '</span></div>')
                  }else{
                    $btn = '<div class="pt-0"><button class="btn btn-sm btn-success btn-square" style="box-shadow: none;" onclick="clickNotfitBtn(2, ' + i + ')"><i class="fas fa-pencil-alt"></i></button></div>'
                    $('#e' + i).append('<div class="commentPane" id="comment_div_id_' + i + '"><span class="commentMsg"><div id="comment_id_' + i + '">' + resp + '</div>' + $btn + '</span></div>')
                  }

               }

             })
}

function checkIcfStatus_alert(){
  $check = 0;
  if(gc_bio.getData() == ''){
    $check++;
  }
  for (var i = 1; i <= 42; i++) {
    if($('input[name=radio0' + i + ']:checked').val() == 'na'){
      $check++
    }
  }
  if($check != 0){
    swal("คำเตือน", "ท่านยังตอบแบบประเมินไม่ครบถ้วน!", "warning")
    $('#btnConfirmIcf').addClass('dn')
    $('#notifyf').removeClass('dn')
    $('#notifys').addClass('dn')
    return false;
  }else{
    swal("คำเตือน", "ท่านตอบแบบประเมินครบถ้วนแล้ว!", "success")
    $('#btnConfirmIcf').removeClass('dn')
    $('#notifyf').addClass('dn')
    $('#notifys').removeClass('dn')
    console.log('Complete');
    return true;
  }
  loading.hide()
}

function checkSocialStatus_alert(){
  $check = 0;
  if(gc_bio.getData() == ''){
    $check++;
  }
  for (var i = 1; i <= 42; i++) {
    if($('input[name=radio0' + i + ']:checked').val() == 'na'){
      $check++
    }
  }
  if($check != 0){
    swal("คำเตือน", "ท่านยังตอบแบบประเมินไม่ครบถ้วน!", "warning")
    $('#btnConfirmSocial').addClass('dn')
    $('#notifyf').removeClass('dn')
    $('#notifys').addClass('dn')
    return false;
  }else{
    swal("คำเตือน", "ท่านตอบแบบประเมินครบถ้วนแล้ว!", "success")
    $('#btnConfirmSocial').removeClass('dn')
    $('#notifyf').addClass('dn')
    $('#notifys').removeClass('dn')
    console.log('Complete');
    return true;
  }
  preload.hide()
}

function checkIcfStatus(){
  $check = 0;
  if(gc_bio.getData() == ''){
    $check++;
  }
  for (var i = 1; i <= 42; i++) {
    if($('input[name=radio0' + i + ']:checked').val() == 'na'){
      $check++
    }
  }

  if($('input[name=radio042]:checked').val() == '3'){
    if(notfin_info2.getData() == ''){
        $check++
    }
  }

  if($check != 0){
    // swal("คำเตือน", "ท่านยังตอบแบบประเมินไม่ครบถ้วน!", "warning")
    $('#btnConfirmIcf').addClass('dn')
    $('#notifyf').removeClass('dn')
    $('#notifys').addClass('dn')
  }else{
    // swal("คำเตือน", "ท่านตอบแบบประเมินครบถ้วนแล้ว!", "success")
    $('#btnConfirmIcf').removeClass('dn')
    $('#notifyf').addClass('dn')
    $('#notifys').removeClass('dn')
  }
  preload.hide()
}

function checkSocialStatus(){
  $check = 0;
  if(gc_bio.getData() == ''){
    $check++;
  }
  for (var i = 1; i <= 42; i++) {
    if($('input[name=radio0' + i + ']:checked').val() == 'na'){
      $check++
    }
  }
  if($check != 0){
    $('#btnConfirmSocial').addClass('dn')
    $('#notifyf').removeClass('dn')
    $('#notifys').addClass('dn')
  }else{
    $('#btnConfirmSocial').removeClass('dn')
    $('#notifyf').addClass('dn')
    $('#notifys').removeClass('dn')
  }
  preload.hide()
}

function checkBioStatus(){
  $check = 0;

  if(gc_bio.getData() == ''){
    $check++;
  }

  for (var i = 1; i <= 42; i++) {
    if($('input[name=radio0' + i + ']:checked').val() == 'na'){
      $check++
    }
  }

  console.log($check);
  if($check != 0){
    console.log('b');
    $('#btnConfirmBio').addClass('dn')
    $('#notifyf').removeClass('dn')
    $('#notifys').addClass('dn')
    console.log('Un-complete bio');
    return false;
  }else{
    $('#btnConfirmBio').removeClass('dn')
    $('#notifyf').addClass('dn')
    $('#notifys').removeClass('dn')
    console.log('Complete');
    return true;
  }
}

function checkBioStatus_alert(){
  $check = 0;

  if(gc_bio.getData() == ''){
    $check++;
  }

  for (var i = 1; i <= 42; i++) {
    if($('input[name=radio0' + i + ']:checked').val() == 'na'){
      $check++
    }
  }
  if($check != 0){
    swal("คำเตือน", "ท่านตอบแบบประเมินไม่ครบถ้วน!", "warning")
    $('#btnConfirmBio').addClass('dn')
    $('#notifyf').removeClass('dn')
    $('#notifys').addClass('dn')
    console.log('Un-complete bio');
    return false;
  }else{
    swal("คำเตือน", "ท่านตอบแบบประเมินครบถ้วนแล้ว!", "success")
    $('#btnConfirmBio').removeClass('dn')
    $('#notifyf').addClass('dn')
    $('#notifys').removeClass('dn')
    console.log('Complete');
    return true;
  }
}

function checkFundingStatus(){
  $check = 0;
  for (var i = 1; i <= 42; i++) {
    console.log('c value => ' + $('input[name=radio0' + i + ']:checked').val());
    if($('input[name=radio0' + i + ']:checked').val() == 'na'){
      $check++
    }
  }

  if($('input[name=radio042]:checked').val() == '4'){
    if(notfin_info2.getData() == ''){
      $check++
    }
  }


  if($check != 0){
    console.log('b');
    $('#btnConfirmfunding').addClass('dn')
    $('#notifyf').removeClass('dn')
    $('#notifys').addClass('dn')
  }else{
    $('#btnConfirmfunding').removeClass('dn')
    $('#notifyf').addClass('dn')
    $('#notifys').removeClass('dn')
    console.log('Complete');
  }
  preload.hide()
}

function checkFundingStatus_alert(){
  $check = 0;
  for (var i = 1; i <= 42; i++) {
    if($('input[name=radio0' + i + ']:checked').val() == 'na'){
      $check++
    }
  }

  if($check != 0){
    swal("คำเตือน", "ท่านตอบแบบประเมินไม่ครบถ้วน!", "warning")
    $('#btnConfirmfunding').addClass('dn')
    $('#notifyf').removeClass('dn')
    $('#notifys').addClass('dn')
    return false;
  }else{
    swal("คำเตือน", "ท่านตอบแบบประเมินครบถ้วนแล้ว!", "success")
    $('#btnConfirmfunding').removeClass('dn')
    $('#notifyf').addClass('dn')
    $('#notifys').removeClass('dn')
    console.log('Complete a');
    return true;
  }
}

function checkMtaStatus(){
  $check = 0;
  if(gc_bio.getData() == ''){
    $check++;
  }

  for (var i = 42; i <= 42; i++) {
    if($('input[name=radio0' + i + ']:checked').val() == 'na'){
      $check++
    }
  }

  if($('input[name=radio042]:checked').val() == '3'){
    if(notfin_info2.getData() == ''){
      console.log('dd');
        $check++
    }else{
      console.log('dds');
    }
  }

  if($check != 0){
    console.log('b');
    $('#btnConfirmMta').addClass('dn')
    $('#notifyf').removeClass('dn')
    $('#notifys').addClass('dn')
  }else{
    $('#btnConfirmMta').removeClass('dn')
    $('#notifyf').addClass('dn')
    $('#notifys').removeClass('dn')
    console.log('Complete a');
  }
  preload.hide()
}

function checkMtaStatus_alert(){
  $check = 0;
  if(gc_bio.getData() == ''){
    $check++;
  }

  for (var i = 42; i <= 42; i++) {
    if($('input[name=radio0' + i + ']:checked').val() == 'na'){
      $check++
    }
  }

  if($check != 0){
    console.log('Not complete');
    swal("คำเตือน", "ท่านตอบแบบประเมินไม่ครบถ้วน!", "warning")
    $('#btnConfirmMta').addClass('dn')
    $('#notifyf').removeClass('dn')
    $('#notifys').addClass('dn')
    return false;
  }else{
    swal("คำเตือน", "ท่านตอบแบบประเมินครบถ้วนแล้ว!", "success")
    $('#btnConfirmMta').removeClass('dn')
    $('#notifyf').addClass('dn')
    $('#notifys').removeClass('dn')
    return true;
  }
  // preload.hide()
}

function checBioStatus_fund(){
  $check = 0;
  if(gc_bio.getData() == ''){
    $check++;
  }

  for (var i = 1; i <= 53; i++) {
    if($('input[name=radio0' + i + ']:checked').val() == 'na'){
      $check++
    }
  }

  if($check != 0){
    console.log('Not complete');
  }else{
    $('#btnConfirmBio').removeClass('dn')
    $('#notifyf').addClass('dn')
    $('#notifys').removeClass('dn')
    console.log('Complete');
  }
  preload.hide()
  loading.hide()
}

function checBioStatus(stage){
  $check = 0;
  if(gc_bio.getData() == ''){
    $check++;
  }

  for (var i = 1; i <= 42; i++) {
    if($('input[name=radio0' + i + ']:checked').val() == 'na'){
      $check++
    }
  }

  if($check != 0){
    console.log('Not complete');
    if(stage != false){
      swal("คำเตือน", "ท่านยังตอบแบบประเมินไม่ครบถ้วน!", "warning")
    }

    $('#btnConfirmIcf').addClass('dn')
    $('#notifyf').removeClass('dn')
    $('#notifys').addClass('dn')
  }else{
    if(stage != false){
      swal("คำเตือน", "ท่านตอบแบบประเมินครบถ้วนแล้ว!", "success")
    }

    $('#btnConfirmIcf').removeClass('dn')
    $('#notifyf').addClass('dn')
    $('#notifys').removeClass('dn')
    $('#btnConfirmBio').removeClass('dn')
    $('#notifyf').addClass('dn')
    $('#notifys').removeClass('dn')
    // console.log('Complete');
  }
  preload.hide()
  loading.hide()
}

function setUndraftBio(){
  saveCommentDraft_Bio()
  preload.show()
  var param = {
    id_rs: current_rs_id,
    user: current_user
  }
  var jxt = $.post(conf.api + 'reviewer/confirm_bio.php', param, function(){})
            .always(function(resp){
              preload.hide()
              if(resp == 'Y'){
                swal({    title: "บันทึกข้อมูลสำเร็จ",
                              text: "กด 'ตกลง' เพื่อกลับสู่หน้าหลัก",
                              type: "success",
                              showCancelButton: false,
                              confirmButtonColor: "#1ed1a1",
                              confirmButtonText: "ตกลง",
                              closeOnConfirm: false },
                              function(){
                                window.location = 'research_info.html'
                              });
              }else{
                swal({    title: "เกิดความผิดพลาด",
                              text: "ไม่สามารถบันทึกข้อมูลได้",
                              type: "success",
                              showCancelButton: false,
                              confirmButtonColor: "#1ed1a1",
                              confirmButtonText: "ลองใหม่",
                              closeOnConfirm: true },
                              function(){

                              });
              }
            })
            .fail(function(){
              alert('error')
            })
}

function setUndraftMta(){
  saveCommentDraft_mta()
  preload.show()
  var param = {
    id_rs: current_rs_id,
    user: current_user
  }
  var jxt = $.post(conf.api + 'reviewer/confirm_mta.php', param, function(){})
            .always(function(resp){
              preload.hide()
              if(resp == 'Y'){
                swal({    title: "บันทึกข้อมูลสำเร็จ",
                              text: "กด 'ตกลง' เพื่อกลับสู่หน้าหลัก",
                              type: "success",
                              showCancelButton: false,
                              confirmButtonColor: "#1ed1a1",
                              confirmButtonText: "ตกลง",
                              closeOnConfirm: false },
                              function(){
                                window.location = 'research_info.html'
                              });
              }else{
                swal({    title: "เกิดความผิดพลาด",
                              text: "ไม่สามารถบันทึกข้อมูลได้",
                              type: "success",
                              showCancelButton: false,
                              confirmButtonColor: "#1ed1a1",
                              confirmButtonText: "ลองใหม่",
                              closeOnConfirm: true },
                              function(){

                              });
              }
            })
            .fail(function(){
              alert('error')
            })
}

function setUndraftIcf(){
  preload.show()
  var param = {
    id_rs: current_rs_id,
    user: current_user
  }

  var jxt = $.post(conf.api + 'reviewer/confirm_icf.php', param, function(){})
             .always(function(resp){
               preload.hide()
               if(resp == 'Y'){
                 swal({    title: "บันทึกข้อมูลสำเร็จ",
                               text: "กด 'ตกลง' เพื่อกลับสู่หน้าหลัก",
                               type: "success",
                               showCancelButton: false,
                               confirmButtonColor: "#1ed1a1",
                               confirmButtonText: "ตกลง",
                               closeOnConfirm: false },
                               function(){
                                 window.location = 'research_info.html'
                               });
               }else{
                 swal({    title: "เกิดความผิดพลาด",
                               text: "ไม่สามารถบันทึกข้อมูลได้",
                               type: "success",
                               showCancelButton: false,
                               confirmButtonColor: "#1ed1a1",
                               confirmButtonText: "ลองใหม่",
                               closeOnConfirm: true },
                               function(){

                               });
               }
             })
             .fail(function(){
               // alert('error')
             })
}

function setUndraftio_fund(){
  loading.show()
  var param = {
    id_rs: current_rs_id,
    user: current_user
  }

  var jxt = $.post(conf.api + 'reviewer/confirm_bio_fund.php', param, function(){})
             .always(function(resp){
               loading.hide()
               if(resp == 'Y'){
                 swal({    title: "บันทึกข้อมูลสำเร็จ",
                               text: "กด 'ตกลง' เพื่อกลับสู่หน้าหลัก",
                               type: "success",
                               showCancelButton: false,
                               confirmButtonColor: "#1ed1a1",
                               confirmButtonText: "ตกลง",
                               closeOnConfirm: false },
                               function(){
                                 window.location = 'research_info.html'
                               });
               }else{
                 swal({    title: "เกิดความผิดพลาด",
                               text: "ไม่สามารถบันทึกข้อมูลได้",
                               type: "success",
                               showCancelButton: false,
                               confirmButtonColor: "#1ed1a1",
                               confirmButtonText: "ลองใหม่",
                               closeOnConfirm: true },
                               function(){

                               });
               }
             })
             .fail(function(){
               // alert('error')
             })
}

function setUndraftio(){
  loading.show()
  var param = {
    id_rs: current_rs_id,
    user: current_user
  }

  var jxt = $.post(conf.api + 'reviewer/confirm_bio.php', param, function(){})
             .always(function(resp){
               loading.hide()
               if(resp == 'Y'){
                 swal({    title: "บันทึกข้อมูลสำเร็จ",
                               text: "กด 'ตกลง' เพื่อกลับสู่หน้าหลัก",
                               type: "success",
                               showCancelButton: false,
                               confirmButtonColor: "#1ed1a1",
                               confirmButtonText: "ตกลง",
                               closeOnConfirm: false },
                               function(){
                                 window.location = 'research_info.html'
                               });
               }else{
                 swal({    title: "เกิดความผิดพลาด",
                               text: "ไม่สามารถบันทึกข้อมูลได้",
                               type: "success",
                               showCancelButton: false,
                               confirmButtonColor: "#1ed1a1",
                               confirmButtonText: "ลองใหม่",
                               closeOnConfirm: true },
                               function(){

                               });
               }
             })
             .fail(function(){
               // alert('error')
             })
}

function setUndraftsocial(){
  saveCommentDraft_social()
  preload.show()
  var param = {
    id_rs: current_rs_id,
    user: current_user
  }

  var jxt = $.post(conf.api + 'reviewer/confirm_social.php', param, function(){})
             .always(function(resp){
               preload.hide()
               if(resp == 'Y'){
                 swal({    title: "บันทึกข้อมูลสำเร็จ",
                               text: "กด 'ตกลง' เพื่อกลับสู่หน้าหลัก",
                               type: "success",
                               showCancelButton: false,
                               confirmButtonColor: "#1ed1a1",
                               confirmButtonText: "ตกลง",
                               closeOnConfirm: false },
                               function(){
                                 window.location = 'research_info.html'
                               });
               }else{
                 swal({    title: "เกิดความผิดพลาด",
                               text: "ไม่สามารถบันทึกข้อมูลได้",
                               type: "success",
                               showCancelButton: false,
                               confirmButtonColor: "#1ed1a1",
                               confirmButtonText: "ลองใหม่",
                               closeOnConfirm: true },
                               function(){

                               });
               }
             })
             .fail(function(){
               alert('error')
             })
}


function checkAssesmentStatus(form_id){
  var param = {
    id_rs: current_rs_id,
    id: current_user,
    fid: form_id
  }

  var jxt = $.post(conf.api + 'reviewer/check_assesment_status.php', param, function(){})
             .always(function(resp){
               if(resp == 'Y'){
                 eformnum_success++;
                 $('#response_form_' + form_id).html('<i class="fa fa-check-circle fa-2x text-success"></i> ประเมินเสร็จสิ้น')
                 $('#response_form_text_' + form_id).html('<i class="fas fa-pencil-alt"></i> แก้ไขแบบประเมิน')
               }else{
                 console.log(param);
               }
               setTimeout(function(){
                 checkCompleteForm()
               }, 2000)
             })
}

function checkCompleteForm(){
  console.log('All form -> ' + eformnum);
  console.log('Completed -> ' + eformnum_success);
  if(eformnum == eformnum_success){
    $('#asdasd').addClass('dn')
    $('#btnSendAsessment_2').removeClass('dn')
  }
  preload.hide()
}

function confirmReviewerSend(){
  swal({    title: "ยืนยันการส่ง",
              text: "ท่านยืนยันการส่งข้อมูลนี้ไปยังสำนักงานฯ หรือไม่ หากท่านส่งแล้วจะไม่สามารถกลับมาแก้ไขได้อีก",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "ยืนยันการส่ง",
              cancelButtonText: "ยกเลิก",
              closeOnConfirm: true,
              closeOnCancel: true },
              function(isConfirm){
                if (isConfirm) {
                  sendReviewResult()
                }
              });
}

function sendReviewResult(){
  preload.show()
  var param = {
    id_rs: current_rs_id,
    id: current_user,
    asses_1: $('input[name=radios01]:checked').val(),
    asses_2: $('input[name=radios02]:checked').val(),
    asses_3: comment_other_1.getData(),
    asses_4: comment_other_2.getData()
  }

  var jxr = $.post(conf.api + 'reviewer/confirm_sending.php', param, function(){})
             .always(function(resp){
               preload.hide()
               console.log(resp);
               if(resp == 'Y'){
                 window.location = 'review_success.html'
               }else{
                 swal("เกิดข้อผิดพลาด!", "เนื่องจากไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่ หรือติดต่อเจ้าหน้าที่เพื่อดำเนินการตรวจสอบ", "error")
               }
             })

}
