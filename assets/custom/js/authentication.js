var authen = {
  user(user, preload){
    if((current_user == null) || (current_role == null)){
      window.localStorage.removeItem(conf.prefix + 'uid')
      window.location = conf.domain
      return ;
    }

    if(current_role != sys_role){
      window.localStorage.removeItem(conf.prefix + 'uid')
      window.location = conf.domain
      return ;
    }

    if(current_user != user){
      window.localStorage.removeItem(conf.prefix + 'uid')
      window.location = conf.domain
      return ;
    }

    var param = {uid: current_user, role: current_role}
    var jxr = $.post(conf.api + 'authentication?stage=user', param, function(){}, 'json')
               .always(function(snap){
                 if(fnc.json_exist(snap)){
                   snap.forEach(i=>{
                     $('.userFullname').text(i.fname + ' ' + i.lname)
                   })
                   if(preload == 'user'){ fnc.close_loading() }
                 }else{
                   window.localStorage.removeItem(conf.prefix + 'uid')
                   window.localStorage.removeItem(conf.prefix + 'role')
                   window.location = conf.domain
                   return ;
                 }
               })
  },
  signout(){
    swal({    title: "Are you sure?",
              text: "Click confirm to log out",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Confirm",
              cancelButtonText: "Cancel",
              closeOnConfirm: false },
              function(){
                var jxr = $.post(conf.api + 'authentication?stage=signout', {uid: current_user}, function(){})
                window.localStorage.removeItem(conf.prefix + 'uid')
                window.localStorage.removeItem(conf.prefix + 'role')
                window.location = conf.domain
              });

  }
}
