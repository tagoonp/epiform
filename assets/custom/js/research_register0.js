var notification_msg = ''
var p1_status = 0
var p2_status = 0
var p3_status = 0
var p4_status = 0
var p5_status = 0
var p6_status = 0

var file_1 = 0
var file_2 = 0
var file_8 = 0

var selected_copi = null;

var project = {
  checkAnswerStatus(){
    if(pageUpdate == 1){
      var param = {
        id_rs: current_project
      }
      var jxr = $.post(conf.api + 'general/comment_manage?stage=get_comment_status', param, function(){})
                 .always(function(resp){
                   console.log(resp);
                   if(resp == 'Y'){
                     p6_status = 1
                     $('#badge6').removeClass('dn')
                   }else{
                     $html = $('.remarkArea').html()
                     $('.remarkArea').html($html + '- การตอบข้อเสนอแนะ<br>')
                     $('.remarkArea').css('color', 'red')
                     $('.remarkArea').css('font-size', '0.8em')
                   }
                 })
    }
  },
  getComment(){
    if(current_project == null){
      alert('Invalid parameter')
      return ;
    }
    project.getCommentContent(1)
    project.getCommentContent(2)
    project.getCommentContent(3)
    project.getCommentContent(4)
    project.saveDraft_5()
    project.checkAnswerStatus()
  },
  getCommentContent(part){
    var param = {
      id_rs: current_project,
      part: part
    }
    var jxr = $.post(conf.api + 'general/comment_manage?stage=get_comment', param, function(){})
               .always(function(resp){
                 $('.commentSpan' + part).html(resp)
                 preload.hide()
               })
  },
  set2EcMessage(id_rs){
    $('#ecMessageArea').html('<div class="text-center pt-5 pb-4"><i class="fas fa-sync fa-spin" style="font-size: 5em;"></i></div>')
    if(id_rs == null){
      swal("Error!", "Invalid project id", "error")
      return ;
    }
    var param = {
      uid: current_user,
      id_rs: id_rs
    }
    var jxr = $.post(conf.api + 'general/research_register.php?stage=get_lasted_log', param, function(){}, 'json')
               .always(function(snap){
                 if(fnc.json_exist(snap)){
                   snap.forEach(i => {
                     $('#ecMessageArea').html('<div>' + i.log_detail + '</div><div style="font-size: 0.8em;">เมื่อวันที่ : <span class="text-primary">' + i.log_datetime + '</span></div>')
                   })
                 }
               })
  },
  confirmSending(stage){
    if(current_project == null){
      swal("Error!", "Invalid project id", "error")
      return ;
    }
    if(stage == 1){
      swal({
        title: "คำเตือน",
        text: "คุณยืนยันที่จะส่งข้อมูลไปยังเจ้าหน้าที่หรือไม่ เนื่องจากหากทำการยืนยันแล้ว ท่านจะไม่สามารถกลับมาแก้ไขข้อมูลได้อีกจนกว่าจะได้รับการตอบกลับจากเจ้าหน้าที่",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "ยืนยันการส่ง",
        cancelButtonText: "ยกเลิก",
        closeOnConfirm: true
      },
      function(){
        preload.show()
        var param = {
          uid: current_user,
          id_rs: current_project
        }
        var jxr = $.post(conf.api + 'general/research_register.php?stage=confirm_sending', param, function(){})
                   .always(function(resp){
                     console.log(resp);
                     if(resp == 'Y'){
                       setTimeout(function(){
                         window.location = 'research_register_success?uid=' + current_user + '&role=' + current_role
                       }, 1000)
                     }else{
                       setTimeout(function(){
                         preload.hide()
                         swal("เกิดข้อผิดพลาด!", "ไม่สามารถส่งข้อมูลได้ กรุณาติดต่อเจ้าหน้าที่", "error")
                       }, 1000)
                     }
                   })
      });
    }
  },
  saveFinal(){
    preload.show()
    project.saveDraft()
    setTimeout(() => {
      window.location = 'research_register_review?uid=' + current_user + '&role=' + current_role + '&pid=' + current_project
    })

  },
  set2view(id_rs, owner){
    window.localStorage.setItem(conf.prefix + 'project', id_rs)
    if(owner){
        window.location = 'research_view_all_owner?uid=' + current_user + '&role=' + current_role + '&id_rs=' + id_rs
    }else{
        window.location = 'research_view_all?uid=' + current_user + '&role=' + current_role + '&id_rs=' + id_rs
    }
  },
  set2update1(id_rs){
    window.localStorage.setItem(conf.prefix + 'project', id_rs)
    window.location = 'research_register?uid=' + current_user + '&role=' + current_role
  },
  set2deleteProject(pid){
    window.localStorage.setItem(conf.prefix + 'project', pid)
    window.location = 'rs-delete?uid=' + current_user + '&role=' + current_role
  },
  deleteProject(){
    if(current_project == null){
      alert('Invalid parametor')
      return ;
    }

    preload.show()
    var param = {
      uid: current_user,
      pid: current_project,
      role: current_role,
      reason: $('#txtReson').val()
    }

    $('.btnCloseModal').trigger('click')

    var jxr = $.post(conf.api + 'general/research_register.php?stage=delete_project', param, function(){})
               .always(function(resp){
                 console.log(resp);
                 preload.hide()
                 if(resp == 'Y'){
                    swal({
                      title: "ดำเนินการสำเร็จ",
                      text: "โครงการของท่านถูกถอนจากการพิจารณาเรียบร้อยแล้ว",
                      type: "warning",
                      showCancelButton: false,
                      confirmButtonColor: "#DD6B55",
                      confirmButtonText: "กลับสู่หน้าหลัก",
                      closeOnConfirm: true },
                    function(){
                      // window.location = './index?uid=' + current_user + '&role=' + current_role
                      window.history.back()
                    });
                 }else{
                   swal("ขออภัย", "เกิิดข้อผิิดพลาด กรุณาลองใหม่ภายหลังหรือติดต่อเจ้าหน้าที่", "error")
                 }
               })
  },
  get_rs_info(){
    var param = {
      uid: current_user,
      id_rs: current_project
    }
    var jxr = $.post(conf.api + 'general/research_register.php?stage=get_info', param, function(){}, 'json')
                .always(function(snap){
                  console.log(snap);
                  if(fnc.json_exist(snap)){
                    snap.forEach(i => {
                      $('#textIdrs').text(i.id_rs)
                      if(i.code_apdu != ''){
                        $('#textCodeapdu').text(i.code_apdu)
                      }else{
                        $('#textCodeapdu').html('<span class="text-muted">ยังไม่กำหนด</span>')
                      }

                      if(i.title_th == '-'){
                        $('#textTitle').html(i.title_en)
                      }else{
                        $('#textTitle').html(i.title_th + ' <br><small class="text-muted">(' + i.title_en + ')</small>')
                      }

                      if(i.rct_type == null){
                        $('#textConsidetype').html('<span class="text-muted">ยังไม่กำหนด</span>')
                      }else{
                        $('#textConsidetype').html('<span class="text-danger">' + i.rct_type + '</span>')
                      }

                      $('#textFullpiname').html(i.fname + ' ' + i.lname)

                      $('#txtTitle_th').val(i.title_th)
                      $('#txtTitle_en').val(i.title_en)
                      $('#txtKeyword_th').val(i.keywords_th)
                      $('#txtKeyword_en').val(i.keywords_en)
                      $('#txtResearchtype').val(i.id_type)
                      $('#txtStartdate').val(i.start_date)
                      $('#txtFinishdate').val(i.finish_date)

                      if(i.ts1 == 1){
                        $('#cb1').prop('checked', 'checked')
                        $('#cb1_info').removeClass('dn')
                        $('#txtFunding1').val(i.ts1_budget)
                      }

                      if(i.ts2 == 1){
                        $('#cb2').prop('checked', 'checked')
                        $('#cb2_info').removeClass('dn')
                        $('#txtFunding2').val(i.ts2_budget)
                      }

                      if(i.ts7 == 1){
                        $('#cb7').prop('checked', 'checked')
                        $('#cb7_info').removeClass('dn')
                        $('#txtFunding7').val(i.ts7_budget)
                      }

                      if(i.ts3 == 1){
                        $('#cb3').prop('checked', 'checked')
                        $('#cb3_info').removeClass('dn')
                        $('#txtFunding3').val(i.ts3_budget)
                      }

                      if(i.ts4 == 1){
                        $('#cb4').prop('checked', 'checked')
                        $('#cb4_info').removeClass('dn')
                        $('#txtFunding4').val(i.ts4_budget)
                      }

                      if(i.ts5 == 1){
                        $('#cb5').prop('checked', 'checked')
                        $('#cb5_info').removeClass('dn')
                        $('#txtFunding5').val(i.ts5_budget)
                      }

                      $('#txtFundingsource').val(i.source_funds)
                      $('#txtBudget').val(i.budget)

                      if(i.rate_pm != null){
                        $('#txtRatepm').val(i.rate_pm)
                      }

                      if($('#brief_reports').length) {
                          brief_reports.setData(i.brief_reports)
                      }

                      $('#txtPiresponse').val(i.pm_job)
                    })
                    $('.list-group-item').removeClass('dn')
                    project.saveDraft()
                  }
                })
  },
  check_current_project(){
    if(current_project != null){
      $('#list-group-item').removeClass('dn')
    }
  },
  saveDraft(){
    if(current_project == null){
      project.saveDraft_1()
      return ;
    }else{
      project.saveDraft_1()
      project.saveDraft_2()
      project.saveDraft_3()
      project.saveDraft_4()
      project.saveDraft_5()
      setTimeout(function(){
        if((p1_status == 1) && (p2_status == 1) && (p3_status == 1) && (p4_status == 1) && (p5_status == 1)){
          $('.btnFinal').removeClass('dn')
        }
      }, 0)
    }
  },
  saveDraft_1(){
    notification_msg = ''
    $check = 0
    $('.form-control').removeClass('is-invalid')

    if($('#txtTitle_th').val() == ''){
      $check++;
      // $('#txtTitle_th').addClass('is-invalid')
      notification_msg += '- ชื่อโครงการ (ภาษาไทย) <br>'
    }
    if($('#txtTitle_en').val() == ''){
      $check++;
      // $('#txtTitle_en').addClass('is-invalid')
      notification_msg += '- Project title (English) <br>'
    }
    if($('#txtKeyword_th').val() == ''){
      $check++;
      // $('#txtKeyword_th').addClass('is-invalid')
      notification_msg += '- คำสำคัญ (ภาษาไทย) <br>'
    }
    if($('#txtKeyword_en').val() == ''){
      $check++;
      // $('#txtKeyword_en').addClass('is-invalid')
      notification_msg += '- Keywords (English) <br>'
    }
    if($('#txtResearchtype').val() == ''){
      $check++;
      // $('#txtResearchtype').addClass('is-invalid')
      notification_msg += '- ประเภทของการวิจัย <br>'
    }
    if($('#txtStartdate').val() == ''){
      $check++;
      // $('#txtStartdate').addClass('is-invalid')
      notification_msg += '- วันที่คาดว่าจะเริ่มโครงการ <br>'
    }
    if($('#txtFinishdate').val() == ''){
      $check++;
      // $('#txtFinishdate').addClass('is-invalid')
      notification_msg += '- วันที่คาดว่าโครงการสิ้นสุด <br>'
    }

    if($check != 0){
      // swal("คำเตือน", "กรุณากรอกข้อมูลให้ครบถ้วน", "success")
      $('.remarkArea').html(notification_msg)
      $('.remarkArea').css('color', 'red')
      $('.remarkArea').css('font-size', '0.8em')
    }else{
      if(notification_msg != ''){
        notification_msg += '- สรุปย่อโครงการวิจัย (Synopsis) ส่วนที่ 4<br>'
        $('.remarkArea').html(notification_msg)
        $('.remarkArea').css('color', 'red')
        $('.remarkArea').css('font-size', '0.8em')
      }else{
        $('.remarkArea').html('<div class="text-center">ไม่มีข้อมูลการแจ้งเตือนของโครงการนี้</div>')
        $('.remarkArea').css('color', 'rgb(116, 116, 116)')
        $('.remarkArea').css('font-size', '1em')
      }
      p1_status = 1
      $('#badge1').removeClass('dn')
      $('#hint_p1').addClass('dn')

      var param = {
        uid: current_user,
        title_th: $('#txtTitle_th').val(),
        title_en: $('#txtTitle_en').val(),
        keyword_th: $('#txtKeyword_th').val(),
        keyword_en: $('#txtKeyword_en').val(),
        rtype: $('#txtResearchtype').val(),
        start: $('#txtStartdate').val(),
        end: $('#txtFinishdate').val(),
        id_rs: current_project
      }

      var jxr = $.post(conf.api + 'general/research_register.php?stage=new_register', param, function(){}, 'json')
                  .always(function(snap){
                    if(fnc.json_exist(snap)){
                      snap.forEach(i => {
                        current_project = i.id_rs
                        window.localStorage.setItem(conf.prefix + 'project', i.id_rs)
                      })
                      $('.list-group-item').removeClass('dn')
                    }
                  })
    }
  },
  saveDraft_2(){
    $check = 0;
    if($('#txtPiresponse').val() == ''){
      $check++;
      notification_msg += '- หน้าที่ความรับผิดชอบของหัวหน้าโครงการ <br>'
    }

    if($check != 0){
      $('.remarkArea').html(notification_msg)
      $('.remarkArea').css('color', 'red')
      $('.remarkArea').css('font-size', '0.8em')
    }else{
      if(notification_msg != ''){
        $('.remarkArea').html(notification_msg)
        $('.remarkArea').css('color', 'red')
        $('.remarkArea').css('font-size', '0.8em')
      }else{
        $('.remarkArea').html('<div class="text-center">ไม่มีข้อมูลการแจ้งเตือนของโครงการนี้</div>')
        $('.remarkArea').css('color', 'rgb(116, 116, 116)')
        $('.remarkArea').css('font-size', '1em')
      }
      p2_status = 1
      $('#badge2').removeClass('dn')
      var param = {
        uid: current_user,
        id_rs: current_project,
        cotype: $('#txtIsadvice').val(),
        ratepm: $('#txtRatepm').val(),
        pm_job: $('#txtPiresponse').val()
      }
      var jxr = $.post(conf.api + 'general/research_register.php?stage=update_part2', param, function(){})
    }



  },
  saveDraft_3(){
    $check = 0;

    $cb1 = 0
    $cb2 = 0
    $cb7 = 0
    $cb3 = 0
    $cb4 = 0
    $cb5 = 0

    if($('#cb1').is(":checked")){ $cb1 = 1 }
    if($('#cb2').is(":checked")){ $cb2 = 1 }
    if($('#cb7').is(":checked")){ $cb7 = 1 }
    if($('#cb3').is(":checked")){ $cb3 = 1 }
    if($('#cb4').is(":checked")){ $cb4 = 1 }
    if($('#cb5').is(":checked")){ $cb5 = 1 }


    if($('#txtFundexist').val() == '1'){
      if($('#txtFundingsource').val() == ''){
        $check++;
        notification_msg += '- ชื่อแหล่งทุนวิจัย<br>'
      }

      if($cb1 == 1){
        if(($('#txtFunding1').val() == '') || ($('#txtFunding1').val() == '0')){
          $check++;
          notification_msg += '- จำนวนเงินจากทุนวิจัยคณะแพทยศาสตร์<br>'
        }
      }

      if($cb2 == 1){
        if(($('#txtFunding2').val() == '') || ($('#txtFunding2').val() == '0')){
          $check++;
          notification_msg += '- จำนวนเงินจากทุนงบประมาณแผ่นดิน<br>'
        }
      }

      if($cb7 == 1){
        if(($('#txtFunding7').val() == '') || ($('#txtFunding7').val() == '0')){
          $check++;
          notification_msg += '- จำนวนเงินจากทุนภาคเอกชน<br>'
        }
      }

      if($cb3 == 1){
        if(($('#txtFunding3').val() == '') || ($('#txtFunding3').val() == '0')){
          $check++;
          notification_msg += '- จำนวนเงินจากทุนรายได้มหาวิทยาลัยสงขลานครินทร์<br>'
        }
      }

      if($cb4 == 1){
        if(($('#txtFunding4').val() == '') || ($('#txtFunding4').val() == '0')){
          $check++;
          notification_msg += '- จำนวนเงินจากทุนอื่น ๆ ภายในประเทศ<br>'
        }
      }

      if($cb5 == 1){
        if(($('#txtFunding5').val() == '') || ($('#txtFunding5').val() == '0')){
          $check++;
          notification_msg += '- ทุนอื่น ๆ ภายนอกประเทศ<br>'
        }
      }
    }


    if($check != 0){
      $('.remarkArea').html(notification_msg)
      $('.remarkArea').css('color', 'red')
      $('.remarkArea').css('font-size', '0.8em')
      $('#badge3').addClass('dn')
    }else{
      if(notification_msg != ''){
        $('.remarkArea').html(notification_msg)
        $('.remarkArea').css('color', 'red')
        $('.remarkArea').css('font-size', '0.8em')
      }else{
        $('.remarkArea').html('<div class="text-center">ไม่มีข้อมูลการแจ้งเตือนของโครงการนี้</div>')
        $('.remarkArea').css('color', 'rgb(116, 116, 116)')
        $('.remarkArea').css('font-size', '1em')
      }
      p3_status = 1
      $('#badge3').removeClass('dn')
    }

    var param = {
      uid: current_user,
      id_rs: current_project,
      funding_status: $('#txtFundexist').val(),
      ts1: $cb1,
      ts1_b: $('#txtFunding1').val(),
      ts2: $cb2,
      ts2_b: $('#txtFunding2').val(),
      ts7: $cb7,
      ts7_b: $('#txtFunding7').val(),
      ts7_p: $('#txtFunding7_info').val(),
      ts3: $cb3,
      ts3_b: $('#txtFunding3').val(),
      ts4: $cb4,
      ts4_b: $('#txtFunding4').val(),
      ts5: $cb5,
      ts5_b: $('#txtFunding5').val(),
      fundingsource: $('#txtFundingsource').val(),
      budget: $('#txtBudget').val()
    }
    var jxr = $.post(conf.api + 'general/research_register.php?stage=update_part3', param, function(){})
               // .always(function(resp){ console.log(resp); })

  },
  saveDraft_4(){
    if($('#brief_reports').length) {
      if(brief_reports.getData() == ''){

        console.log('aaa');

        $html = $('.remarkArea').html()
        $('.remarkArea').html($html + '- สรุปย่อโครงการวิจัย (Synopsis) ส่วนที่ 4<br>')

        // notification_msg += '- สรุปย่อโครงการวิจัย (Synopsis) ส่วนที่ 4<br>'
        // $('.remarkArea').html(notification_msg)
        $('.remarkArea').css('color', 'red')
        $('.remarkArea').css('font-size', '0.8em')
      }else{
        //
        // if(notification_msg != ''){
        //   $('.remarkArea').html(notification_msg)
        //   $('.remarkArea').css('color', 'red')
        //   $('.remarkArea').css('font-size', '0.8em')
        // }else{
        //   $('.remarkArea').html('<div class="text-center">ไม่มีข้อมูลการแจ้งเตือนของโครงการนี้</div>')
        //   $('.remarkArea').css('color', 'rgb(116, 116, 116)')
        //   $('.remarkArea').css('font-size', '1em')
        // }

        p4_status = 1
        $('#badge4').removeClass('dn')
        var param = {
          uid: current_user,
          id_rs: current_project,
          brief: brief_reports.getData()
        }
        var jxr = $.post(conf.api + 'general/research_register.php?stage=update_part4', param, function(){})
      }
    }
  },
  saveDraft_5(){
    $check = 0;
    // if(file_1 == 0){ $check++; notification_msg += '- Submission form<br>'; }
    // if(file_2 == 0){ $check++; notification_msg += '- Protocol<br>'; }
    // if(file_8 == 0){ $check++; notification_msg += '- Updated CV, หลักฐานการอบรมจริยธรรมการวิจัยในมนุษย์ <br>'; }

    if(file_1 == 0){
      $check++;
      $html = $('.remarkArea').html()
      $('.remarkArea').html($html + '- Submission form<br>')
    }

    if(file_2 == 0){
      $check++;
      $html = $('.remarkArea').html()
      $('.remarkArea').html($html + '- Protocol<br>')
    }

    if(file_8 == 0){
      $check++;
      $html = $('.remarkArea').html()
      $('.remarkArea').html($html + '- Updated CV, หลักฐานการอบรมจริยธรรมการวิจัยในมนุษย์ <br>')
    }


    if($check != 0){

      // $html = $('.remarkArea').html()
      // $('.remarkArea').html($html + '- สรุปย่อโครงการวิจัย (Synopsis) ส่วนที่ 4<br>')
      //
      // $('.remarkArea').html(notification_msg)
      $('.remarkArea').css('color', 'red')
      $('.remarkArea').css('font-size', '0.8em')
      $('#badge5').addClass('dn')
    }else{
      if(notification_msg != ''){
        $('.remarkArea').html(notification_msg)
        $('.remarkArea').css('color', 'red')
        $('.remarkArea').css('font-size', '0.8em')
      }else{
        $('.remarkArea').html('<div class="text-center">ไม่มีข้อมูลการแจ้งเตือนของโครงการนี้</div>')
        $('.remarkArea').css('color', 'rgb(116, 116, 116)')
        $('.remarkArea').css('font-size', '1em')
      }
      p5_status = 1
      $('#badge5').removeClass('dn')
    }
  },
  deleteFile(fid){
    swal({
      title: "คุยแน่ใจหรือไม่",
      text: "หากลบแล้วจะไม่สามารถกู้คืนไฟล์นี้ได้อีก หากเป็นไฟล์ที่เคยส่งสำนักงานแล้ว การลบไฟล์จะทำให้การพิจารณาล่าช้าลง",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "ยืนยันการลบ",
      cancelButtonText: "ยกเลิก",
      closeOnConfirm: true
    },
    function(){
      var param = {
        uid: current_user,
        id_rs: current_project,
        fid: fid
      }
      preload.show()
      var jxr = $.post(conf.api + 'general/research_register.php?stage=delete_reseach_file', param, function(){})
                 .always(function(resp){
                   if(resp == 'Y'){
                     project.getFileResearch()
                   }else{
                     preload.hide()
                     swal("เกิดข้อผิดพลาด", "ไม่สามารถลบไฟล์ได้", "error")
                   }
                 })

    });

  },
  getFileResearch(editable){
    file_1 = 0
    file_2 = 0
    file_8 = 0
    if(current_project != null){
      for(var i = 1; i <= 10; i++){
        project.getFileResearchByPath(i, current_project, editable)
      }

      setTimeout(function(){
        // project.saveDraft_5()
      }, 2000)
    }
  },
  getFileResearchByPath(path, pid, editable){
    console.log(editable);
    var param = {
      id_rs: pid,
      path: path
    }
    var jxr = $.post(conf.api + 'general/research_register.php?stage=list_reseach_file', param, function(){}, 'json')
               .always(function(snap){
                 if(fnc.json_exist(snap)){
                   $('#file_path_' + path).empty()
                   snap.forEach(i=>{
                     if(path == 1){ file_1++; }
                     if(path == 2){ file_2++; }
                     if(path == 8){ file_8++; }

                     $file_status = '<span class="text-danger" style="font-size: 0.8em;">ยังไม่ทำการส่ง</span>'
                     $download = '<a href="../tmp_file/' + i.f_name + '" target="_blank" class="mr-2 text-primary"><i class="fas fa-download"></i> ดาวน์โหลด</a>'
                     if(i.f_full_path != null){
                       $download = '<a href="' + i.f_full_path + '" target="_blank" class="mr-2 text-primary"><i class="fas fa-download"></i> ดาวน์โหลด</a>'
                     }

                     $delete = '<a href="Javascript:project.deleteFile(\'' + i.fid + '\')" class="mr-2 text-danger"><i class="fas fa-times"></i> ลบไฟล์</a>'
                     if(i.f_pi_allow_delete == 0){
                       $delete = '<a href="Javascript:void(0)" class="mr-2 text-muted"><i class="fas fa-times"></i> ลบไฟล์</a>'
                     }

                     if(i.f_approval_status == 1){
                       $file_status = '<span class="text-success" style="font-size: 0.8em;">เอกสารถูกต้อง</span>'
                     }else if(i.f_approval_status == 2){
                       $file_status = '<span class="text-danger" style="font-size: 0.8em;">เอกสารรอการแก้ไข</span>'
                     }
                     $data = '<tr>' +
                                '<td style="vertical-align: top;">' +
                                  i.f_name +
                                  '<div style="font-size: 0.8em;">' +
                                    $download +
                                    $delete +
                                  '</div>' +
                                '</td>' +
                                '<td style="vertical-align: top;">' + $file_status + '</td>' +
                             '</tr>'

                     if(editable == false){
                       $data = '<tr>' +
                                  '<td style="vertical-align: top;">' +
                                    i.f_name +
                                    '<div style="font-size: 0.8em;">' +
                                      $download +
                                    '</div>' +
                                  '</td>' +
                                  '<td style="vertical-align: top;">' + $file_status + '</td>' +
                               '</tr>'
                     }
                     $('#file_path_' + path).append($data)
                   })
                   $('.btnCloseModal').trigger('click')
                   preload.hide()
                 }else{
                   $('#file_path_' + path).html('<tr><td colspan="2" class="text-center">ไม่พบรายการไฟล์ที่อัพโหลด</td></tr>')
                 }
               })
  },
  list_co_pi(){
    if(current_project != null){
      var param = {
        uid: current_user,
        id_rs: current_project
      }

      var jxr = $.post(conf.api + 'general/research_register.php?stage=list_copi', param, function(){}, 'json')
                 .always(function(snap){
                   // console.log(snap);
                   if(fnc.json_exist(snap)){
                     $c = 1;
                     $('#copi_list').empty();
                     snap.forEach(i => {
                       $('#copi_list').append('<tr>' +
                          '<td class="pt-2 pb-2" style="vertical-align: top; line-height: 20px;">' + $c + '</td>' +
                          '<td class="pt-2 pb-2" style="vertical-align: top; line-height: 20px;">' +
                            i.co_prefix_approval + i.co_fname + ' ' + i.co_lname + '<br><small>( ' + i.co_prefix_approval_en +  i.co_fname_en + ' ' + i.co_lname_en +  ' )</small>' +
                            '<div style="font-size: 0.8em;">E-mail address : ' + i.co_email + '</div>' +
                          '</td>' +
                          '<td class="pt-2 pb-2" style="vertical-align: top; line-height: 20px;">' + i.co_ratio + '% </td>' +
                          '<td class="pt-2 pb-2 text-right" style="vertical-align: top;">' +
                            '<button class="btn btn-icon" onclick="project.infoCoPi(\'' + i.copi_id + '\')"><i class="fas fa-pencil-alt"></i></button>' +
                            '<button class="btn btn-icon" onclick="project.deleteCoPi(\'' + i.copi_id + '\')"><i class="fas fa-trash"></i></button>' +
                          '</td>' +
                       '</tr>')
                       $c++;
                     })
                   }else{
                     $('#copi_list').html('<tr><td colspan="4" class="text-center">ไม่พบข้อมูลผู้ร่วมวิจัย</td></tr>')
                   }
                 })

    }
  },
  infoCoPi(copid){
    selected_copi = copid
    $('#txtCopi_id').val(copid)
    var param = {
      uid: current_user,
      id_rs: current_project,
      coid: copid
    }
    preload.show()
    var jxr = $.post(conf.api + 'general/research_register.php?stage=info_copi', param, function(){}, 'json')
               .always(function(snap){
                 console.log(snap);
                 setTimeout(function(){
                   preload.hide()
                   if(fnc.json_exist(snap)){
                     snap.forEach(i=>{
                       console.log(i);
                       $('#txtPrefix_th').val(i.co_prefix_approval)
                       $('#txtFname_th').val(i.co_fname)
                       $('#txtLname_th').val(i.co_lname)
                       $('#txtPrefix_en').val(i.co_prefix_approval_en)
                       $('#txtFname_en').val(i.co_fname_en)
                       $('#txtLname_en').val(i.co_lname_en)
                       $('#txtEmail').val(i.co_email)
                       $('#txtDept_th').val(i.co_dept)
                       $('#txtDept_en').val(i.co_dept_en)
                       $('#txtRatioteam').val(i.co_ratio)
                       $('#txtResponseteam').val(i.co_job)
                     })
                     $('#researchteamModal').modal()
                   }else{
                     swal("ขออภัย", "ไม่พบข้อมูลหรือเกิดข้อผิดพลาด", "error")
                   }
                 }, 500)
               })


  },
  deleteCoPi(copid){
    swal({    title: "คุณแน่ใจหรือไม่",
              text: "หากทำการลบแล้ว จะไม่สามารถกู้คืนบุคคลนี้ได้อีก",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "ยืนยัน",
              cancelButtonText: "ยกเลิก",
              closeOnConfirm: true },
              function(){
                preload.show()
                var param = {
                  uid: current_user,
                  id_rs: current_project,
                  copi: copid
                }
                var jxr = $.post(conf.api + 'general/research_register.php?stage=delete_copi', param, function(){})
                           .always(function(resp){
                             if(resp == 'Y'){
                               preload.hide(); project.list_co_pi(); project.get_rs_info();
                             }else{
                               preload.hide(); swal("เกิดข้อผิดพลาด!", "ไม่สามารถลบข้อมูลผู้ร่วมวิจัยได้", "error")
                             }
                           })
              });

  },
  list_unsend_project(){
    var param = {
      uid: current_user
    }

    var jxr = $.post(conf.api + 'general/research_register.php?stage=get_unsend_list', param, function(){}, 'json')
               .always(function(snap){
                 if(fnc.json_exist(snap)){
                   console.log('a');
                   $('#submitNewInitialUnsend').removeClass('btn-success')
                   $('#submitNewInitialUnsend').addClass('btn-warning')
                   $('#submitNewInitialUnsend').html('<i class="fas fa-bars"></i> ' + $('#submitNewInitialUnsend').text() + ' (' + snap.length + ')')
                   snap.forEach(i=>{
                     console.log(i);
                   })
                 }
               })
  }
}

$(function(){

})

function saveDraft(){
  project.saveDraft();
}

function saveCopi(){
  $('.btn').blur()
  let check = 0
  $('.form-control').removeClass('is-invalid')
  if($('#txtPrefix_th').val() == ''){
    check++; $('#txtPrefix_th').addClass('is-invalid')
  }
  if($('#txtFname_th').val() == ''){
    check++; $('#txtFname_th').addClass('is-invalid')
  }
  if($('#txtLname_th').val() == ''){
    check++; $('#txtLname_th').addClass('is-invalid')
  }
  if($('#txtPrefix_th').val() == ''){
    check++; $('#txtPrefix_en').addClass('is-invalid')
  }
  if($('#txtFname_th').val() == ''){
    check++; $('#txtFname_en').addClass('is-invalid')
  }
  if($('#txtLname_th').val() == ''){
    check++; $('#txtLname_en').addClass('is-invalid')
  }
  if($('#txtDept_th').val() == ''){
    check++; $('#txtDept_th').addClass('is-invalid')
  }
  if($('#txtDept_en').val() == ''){
    check++; $('#txtDept_en').addClass('is-invalid')
  }
  if($('#txtEmail').val() == ''){
    check++; $('#txtEmail').addClass('is-invalid')
  }
  if($('#txtRatioteam').val() == ''){
    check++; $('#txtRatioteam').addClass('is-invalid')
  }
  if($('#txtResponseteam').val() == ''){
    check++; $('#txtResponseteam').addClass('is-invalid')
  }

  if(check != 0){
    return ;
  }



  var param = {
    uid: current_user,
    id_rs: current_project,
    prefix_th: $('#txtPrefix_th').val(),
    prefix_en: $('#txtPrefix_en').val(),
    fname_th: $('#txtFname_th').val(),
    fname_en: $('#txtFname_en').val(),
    lname_th: $('#txtLname_th').val(),
    lname_en: $('#txtLname_en').val(),
    dept_th: $('#txtDept_th').val(),
    dept_en: $('#txtDept_en').val(),
    email: $('#txtEmail').val(),
    ratio: $('#txtRatioteam').val(),
    response: $('#txtResponseteam').val(),
    prev_copi: $('#txtCopi_id').val()
  }

  var jxr = $.post(conf.api + 'general/research_register.php?stage=add_copi', param, function(){})
              .always(function(resp){
                console.log(resp);
                if(resp == 'Over'){
                  preload.hide()
                  swal("เกิดข้อผิดพลาด!", "สัดส่วนของผู้ร่วมวิจัยทุกคนรวมกันต้องน้อยกว่าหรือเท่ากับ 99 %", "error")
                }else if(resp == 'Y'){
                  $('.btnCloseModal').trigger('click')
                  $('#txtPrefix_th').val(''),
                  $('#txtPrefix_en').val(''),
                  $('#txtFname_th').val(''),
                  $('#txtFname_en').val(''),
                  $('#txtLname_th').val(''),
                  $('#txtLname_en').val(''),
                  $('#txtDept_th').val(''),
                  $('#txtDept_en').val(''),
                  $('#txtEmail').val(''),
                  $('#txtRatioteam').val(''),
                  $('#txtResponseteam').val('')

                  // Load co pi lisbtn
                  project.list_co_pi()
                  project.get_rs_info()

                }else{
                  preload.hide()
                  swal("เกิดข้อผิดพลาด!", "ไม่สามารถเพิ่มข้อมูลผู้ร่วมวิจัยได้", "error")
                }
              })
}
