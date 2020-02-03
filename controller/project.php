<?php
include "../config/conf.inc.php";
include "../config/connect.inc.php";
include "../config/function.inc.php";

if(!isset($_GET['stage'])){ mysqli_close($conn); die(); }
$stage = mysqli_real_escape_string($conn, $_GET['stage']);
$return = array();

if($stage == 'create'){
  if(
      (!isset($_POST['uid'])) ||
      (!isset($_POST['role'])) ||
      (!isset($_POST['title'])) ||
      (!isset($_POST['desc']))
  )
  {
    echo "Error 1";
    mysqli_close($conn); die();
  }

  $uid = mysqli_real_escape_string($conn, $_POST['uid']);
  $role = mysqli_real_escape_string($conn, $_POST['role']);
  $title = mysqli_real_escape_string($conn, $_POST['title']);
  $desc = mysqli_real_escape_string($conn, $_POST['desc']);

  $strSQL = "INSERT INTO de2x_project (p_title, p_desc, p_createdatetime, p_uid) VALUES ('$title', '$desc', '$sysdatetime', '$uid')";
  $resultInsert = mysqli_query($conn, $strSQL);
  if($resultInsert){
    echo "Y";
  }
  mysqli_close($conn); die();
}

if($stage == 'list'){
  if(
      (!isset($_POST['uid'])) ||
      (!isset($_POST['role'])) ||
      (!isset($_POST['owner_uid']))
  )
  {
    echo "Error 1";
    mysqli_close($conn); die();
  }

  $uid = mysqli_real_escape_string($conn, $_POST['uid']);
  $role = mysqli_real_escape_string($conn, $_POST['role']);
  $owner_uid = mysqli_real_escape_string($conn, $_POST['owner_uid']);

  if($role == 'common'){
    $strSQL = "SELECT * FROM de2x_project WHERE p_uid = '$uid'";
    $result = mysqli_query($conn, $strSQL);
    if(($result) && (mysqli_num_rows($result) > 0)){
      while ($row = mysqli_fetch_array($result)) {
        $buf = array();
        foreach ($row as $key => $value) {
            if(!is_int($key)){
              $buf[$key] = $value;
            }
        }
        $return[] = $buf;
      }
      echo json_encode($return);
    }
  }
  mysqli_close($conn); die();
}
?>
