<?php
include "../config/conf.inc.php";
include "../config/connect.inc.php";
include "../config/function.inc.php";

if(!isset($_GET['stage'])){ mysqli_close($conn); die(); }
$stage = mysqli_real_escape_string($conn, $_GET['stage']);
$return = array();

if($stage == 'register'){
  if(
      (!isset($_POST['fname'])) ||
      (!isset($_POST['lname'])) ||
      (!isset($_POST['email'])) ||
      (!isset($_POST['password']))
  )
  {
    echo "Error 1";
    mysqli_close($conn); die();
  }

  $fname = mysqli_real_escape_string($conn, $_POST['fname']);
  $lname = mysqli_real_escape_string($conn, $_POST['lname']);
  $email = mysqli_real_escape_string($conn, $_POST['email']);
  $password = base64_encode(mysqli_real_escape_string($conn, $_POST['password']));

  $strSQL = "SELECT * FROM de2x_account WHERE username = '$email' AND activate_status = 'Y'";
  $result = mysqli_query($conn, $strSQL);

  if(($result) && (mysqli_num_rows($result) > 0)){
    echo "Duplicate";
    mysqli_close($conn); die();
  }

  $uid = base64_encode($sysdateu.$fname);

  $strSQL = "INSERT INTO de2x_account (UID, username, password, fname, lname, reg_datetime) VALUES ('$uid', '$email', '$password', '$fname', '$lname', '$sysdatetime')";
  if($result = mysqli_query($conn, $strSQL)){
    $strSQL = "INSERT INTO de2x_stagement VALUES ('$sysdatetime', '$ip', 'Register', '', '$uid')";
              mysqli_query($conn, $strSQL);
    echo "Y";
  }
  mysqli_close($conn); die();
}
else if($stage == 'login'){
  if(
      (!isset($_POST['email'])) ||
      (!isset($_POST['password']))
  )
  {
    echo "Error 1";
    mysqli_close($conn); die();
  }
  $email = mysqli_real_escape_string($conn, $_POST['email']);
  $password = base64_encode(mysqli_real_escape_string($conn, $_POST['password']));

  $strSQL = "SELECT * FROM de2x_account
             WHERE
               username = '$email'
               AND password = '$password'
               AND activate_status = 'Y'
               AND allow_status = 'Y'
            ";
  $result = mysqli_query($conn, $strSQL);

  if(($result) && (mysqli_num_rows($result) > 0)){
    $uid = '';
    while ($row = mysqli_fetch_array($result)) {
      $buf = [];
      foreach ($row as $key => $value) {
          if(!is_int($key)){
            $buf[$key] = $value;
            if($key == 'UID'){
              $uid = $value;
            }
          }
      }
      $return[] = $buf;
    }

    $strSQL = "INSERT INTO de2x_stagement VALUES ('$sysdatetime', '$ip', 'Log in', '', '$uid')";
              mysqli_query($conn, $strSQL);

    echo json_encode($return);
  }
  mysqli_close($conn); die();
}
else if($stage == 'user'){
  if(
      (!isset($_POST['uid'])) ||
      (!isset($_POST['role']))
  )
  {
    echo "Error 1";
    mysqli_close($conn); die();
  }
  $uid = mysqli_real_escape_string($conn, $_POST['uid']);
  $role = mysqli_real_escape_string($conn, $_POST['role']);

  $strSQL = "SELECT * FROM de2x_account
             WHERE
               UID = '$uid'
               AND primary_role = '$role'
               AND activate_status = 'Y'
               AND allow_status = 'Y'
            ";
  $result = mysqli_query($conn, $strSQL);
  if(($result) && (mysqli_num_rows($result) > 0)){
    $uid = '';
    while ($row = mysqli_fetch_array($result)) {
      $buf = [];
      foreach ($row as $key => $value) {
          if(!is_int($key)){
            $buf[$key] = $value;
          }
      }
      $return[] = $buf;
    }
    echo json_encode($return);
  }
  mysqli_close($conn); die();
}
else if($stage == 'signout'){
  if(
      (!isset($_POST['uid']))
  )
  {
    echo "Error 1";
    mysqli_close($conn); die();
  }
  $uid = mysqli_real_escape_string($conn, $_POST['uid']);
  $strSQL = "INSERT INTO de2x_stagement VALUES ('$sysdatetime', '$ip', 'Log out', '', '$uid')";
            mysqli_query($conn, $strSQL);
}
else{
  mysqli_close($conn); die();
}
?>
