<?php
include "../config/conf.inc.php";
include "../config/connect.inc.php";
include "../config/function.inc.php";

if(!isset($_GET['login'])){
    header('Location: ../');
    die();
}
?>

<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>EPIFORm Authentication</title>
    <!-- General CSS Files -->
    <link rel="stylesheet" href="../node_modules/bootstrap/dist/css/bootstrap.min.css" >
    <link rel="stylesheet" href="../node_modules/@fortawesome/fontawesome-free/css/all.css">
    <link rel="stylesheet" href="../node_modules/bootstrap-daterangepicker/daterangepicker.css">
    <link rel="stylesheet" href="../node_modules/sweetalert/dist/sweetalert.css">
    <link rel="stylesheet" href="../node_modules/preload.js/dist/css/preload.css">
  </head>
  <body>

    <div class="container">
      <div class="loginDiv">
        <div class="row">
          <div class="col-12 col-sm-4 offset-sm-4">
            <form class="login-form" onsubmit="return false;">
              <div class="form-group">
                <label for="">E-mail address : </label>
                <input type="email" class="form-control" name="txtEmail" id="txtEmail">
              </div>

              <div class="form-group">
                <label for="">Password : </label>
                <input type="password" class="form-control" name="txtPassword" id="txtPassword">
              </div>

              <div class="form-group">
                <button type="submit" class="btn btn-primary btn-block" name="button">Log in</button>
              </div>
            </form>
          </div>

          <div class="col-12 text-center">
            <a href="./register?signup">Register</a>
          </div>
        </div>
        <!-- .row -->
      </div>
      <!-- .loginDiv -->

    </div>
  </body>
  <!-- General JS Scripts -->
  <script type="text/javascript" src="../node_modules/jquery/dist/jquery.min.js" ></script>
  <script type="text/javascript" src="../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
  <script type="text/javascript" src="../node_modules/popper.js/dist/umd/popper.min.js"></script>
  <script type="text/javascript" src="../node_modules/sweetalert/dist/sweetalert.min.js"></script>
  <script type="text/javascript" src="../node_modules/moment/min/moment.min.js"></script>
  <script type="text/javascript" src="../node_modules/bootstrap-daterangepicker/daterangepicker.js"></script>
  <script type="text/javascript" src="../node_modules/jquery.nicescroll/dist/jquery.nicescroll.min.js"></script>
  <script type="text/javascript" src="../node_modules/preload.js/dist/js/preload.js"></script>
  <script type="text/javascript" src="../assets/js/stisla.js"></script>

  <!-- Core script -->
  <script src="../assets/custom/js/config.js"></script>
  <script src="../assets/custom/js/core.js"></script>
  <script src="../assets/custom/js/function.js"></script>

  <!-- Page script -->
  <script type="text/javascript" src="../assets/custom/pages/login.js"></script>

  <script type="text/javascript">
    $(document).ready(function(){
      preload.hide()
    })
  </script>

</html>
