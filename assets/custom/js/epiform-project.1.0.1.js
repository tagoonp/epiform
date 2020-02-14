var project = {
  create(param){
    preload.show()
    var jxr = $.post(conf.api + 'project?stage=create', param, function(){})
               .always(function(resp){
                 if(resp == 'Y'){
                   $('#formModal').modal('hide')
                   window.location = 'project-list?uid=' + current_user
                 }else{
                   preload.hide()
                   swal("Error!", "Operation fail", "error")
                 }
               })
  },
  formList(){
    var param = {
      pid: current_project,
      uid: current_user
    }
    preload.show()
    var jxr = $.post(conf.api + 'project?stage=list_form', param, function(){}, 'json')
              .always(function(snap){
                if(fnc.json_exist(snap)){
                  snap.forEach(i=>{

                  })
                  preload.hide()
                }
               })
  },
  createForm(){
    if($('#txtFormtitle').val() == ''){ $('#txtFormtitle').addClass('is-invalid'); return ;}else{ $('#txtFormtitle').removeClass('is-invalid'); }
    var param = {
      pid: current_project,
      uid: current_user,
      form_title: $('#txtFormtitle').val(),
      desc: form_info.getData()
    }
    preload.show()
    var jxr = $.post(conf.api + 'project?stage=create_form', param, function(){})
               .always(function(resp){
                 if(resp == 'Y'){
                   // project.formList()
                   window.location.reload()
                 }else{
                   preload.hide()
                   swal("Error!", "Operation fail", "error")
                 }
               })
  },
  list(user, preload){
    // preload.show()
    var param = {
      uid: current_user,
      role: current_role,
      owner_uid: user
    }
    var jxr = $.post(conf.api + 'project?stage=list', param, function(){}, 'json')
               .always(function(snap){
                 if(fnc.json_exist(snap)){
                   $('#table-1-data').empty()
                   $c = 1
                   snap.forEach(i=>{
                     $('#table-1-data').append(
                       '<tr>' +
                         '<td>' + $c + '</td>' +
                         '<td>' +
                            i.p_title +
                            '<div><small>' + i.p_desc + '</small></div>' +
                          '</td>' +
                         '<td>' + i.p_createdatetime + '</td>' +
                         '<td class="text-right">' +
                            '<button class="btn btn-sm btn-icon" onclick="manage_project(\'' + i.pid + '\')"><i class="fas fa-wrench"></i></button>' +
                            '<button class="btn btn-sm btn-icon"><i class="far fa-eye"></i></button>' +
                            '<button class="btn btn-sm btn-icon"><i class="fas fa-trash"></i></button>' +
                         '</td>' +
                       '</tr>'
                     )
                     $c++
                   })
                   $("#table-1").dataTable({
                      "columnDefs": [
                        { "sortable": false, "targets": [2,3] }
                      ],
                      "columns": [
                        { "width": "50px" },
                        null,
                        { "width": "180px" },
                        { "width": "120px" }
                      ]
                    });
                    if(preload == 'list'){ fnc.close_loading() }
                 }else{
                   $('#table-1-data').html('<tr><td colspan="4" class="text-center">No project found.</td></tr>')
                   if(preload == 'list'){ fnc.close_loading() }
                 }
               })
  }
}

$(function(){
  $('#btnCreateproject').click(function(){
    window.location = 'project-create?uid=' + current_user
  })
  $('.createProjectForm').submit(function(){
    $('.form-control').removeClass('is-invalid')
    if($('#txtTitle').val() == ''){
      $('#txtTitle').addClass('is-invalid')
      return ;
    }
    var param = {
      uid: current_user,
      role: current_role,
      title: $('#txtTitle').val(),
      desc: $('#txtDesc').val()
    }
    project.create(param)
  })

})

function manage_project(pid){
  window.localStorage.setItem(conf.prefix + 'project', pid)
  window.location = 'project-manage?uid=' + current_user + '&project=' + pid
}
