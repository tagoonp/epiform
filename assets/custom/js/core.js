var current_user = window.localStorage.getItem(conf.prefix + 'uid')
var current_role = window.localStorage.getItem(conf.prefix + 'role')
var current_project = window.localStorage.getItem(conf.prefix + 'project')

var thmonth = new Array ("", "มกราคม","กุมภาพันธ์","มีนาคม",
"เมษายน","พฤษภาคม","มิถุนายน", "กรกฎาคม","สิงหาคม","กันยายน",
"ตุลาคม","พฤศจิกายน","ธันวาคม");

var thmonth2 = new Array ("มกราคม","กุมภาพันธ์","มีนาคม",
"เมษายน","พฤษภาคม","มิถุนายน", "กรกฎาคม","สิงหาคม","กันยายน",
"ตุลาคม","พฤศจิกายน","ธันวาคม");


var thmonth_sh = new Array ("", "ม.ค.","ก.พ.","มี.ค.",
"เม.ย.","พ.ค.","มิ.ย.", "ก.ค.","ส.ค.","ก.ย.",
"ต.ค.","พ.ย.","ธ.ค.");

var enmonth = new Array ("", "January","February","March",
"April","May","June", "July","August","September",
"October","November","December");

var enmonth_sh = new Array ("", "Jan","Feb","Mar",
"Apr","May","Jun", "Jul","Aug","Sep",
"Oct","Nov","Dec");

function printAsFile(divName){
  var printContent = $('#' + divName).html()
  var originalContent = $('body').html()
  $('body').html(printContent)
  window.print()
  window.location.reload()
}
