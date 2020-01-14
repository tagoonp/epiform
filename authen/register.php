<?php
include "../config/conf.inc.php";
include "../config/connect.inc.php";
include "../config/function.inc.php";

if(!isset($_GET['signup'])){
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

      <div class="registerDiv">
        <div class="row">
          <div class="col-12 col-sm-7">

          </div>
          <div class="col-12 col-sm-5">
            <form class="register-form" onsubmit="return false;">
              <div class="row">
                <div class="form-group col-12">
                  <label for="">Name : </label>
                  <input type="text" name="txtFname" id="txtFname" class="form-control">
                </div>

                <div class="form-group col-12">
                  <label for="">Surname : </label>
                  <input type="text" name="txtLname" id="txtLname" class="form-control">
                </div>

                <div class="form-group col-12">
                  <label for="">E-mail address : </label>
                  <input type="email" name="txtEmail" id="txtEmail" class="form-control">
                </div>

                <div class="form-group col-12">
                  <label for="">Create password : </label>
                  <input type="text" name="txtPassword" id="txtPassword" class="form-control">
                </div>

                <div class="form-group col-12">
                  <button type="submit" class="btn btn-primary btn-block" name="button">Sign up</button>
                </div>

                <div class="col-12 text-center">
                  <a href="./?login">Back to log in</a>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
      <!-- .registerDiv -->

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

  <!-- Page script -->
  <script type="text/javascript" src="../assets/custom/pages/register.js"></script>

  <script type="text/javascript">
    $(document).ready(function(){
      preload.hide()
    })
  </script>

</html>
