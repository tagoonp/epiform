<?php
include "../../config/conf.inc.php";
include "../../config/connect.inc.php";
include "../../config/function.inc.php";

if((!isset($_GET['uid'])) || (!isset($_GET['project']))){
    header('Location: ../');
    die();
}
$uid = mysqli_real_escape_string($conn, $_GET['uid']);
$pid = mysqli_real_escape_string($conn, $_GET['project']);

$strSQL = "SELECT * FROM de2x_project WHERE pid = '$pid' AND p_uid = '$uid' AND p_delete_status = 'N'";
$resultProject = mysqli_query($conn, $strSQL);
$dataProject = '';
if(($resultProject) && (mysqli_num_rows($resultProject) > 0)){
  $dataProject = mysqli_fetch_assoc($resultProject);
}else{
  echo "Invalid parameter";
  mysqli_close($conn); die();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no" name="viewport">
  <title>EPIForm Dashboard</title>

  <link rel="stylesheet" href="../../node_modules/bootstrap/dist/css/bootstrap.min.css" >
  <link rel="stylesheet" href="../../node_modules/@fortawesome/fontawesome-free/css/all.css">
  <link rel="stylesheet" href="../../node_modules/bootstrap-daterangepicker/daterangepicker.css">
  <link rel="stylesheet" href="../../node_modules/sweetalert/dist/sweetalert.css">
  <link rel="stylesheet" href="../../node_modules/preload.js/dist/css/preload.css">

  <!-- CSS Libraries -->

  <!-- Template CSS -->
  <link rel="stylesheet" href="../../assets/css/style.css">
  <link rel="stylesheet" href="../../assets/css/components.css">

  <style media="screen">
    body{
      background: rgb(237, 237, 237) !important;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }
  </style>

</head>

<body>
  <div id="app">
    <div class="main-wrapper main-wrapper-1">
      <div class="navbar-bg"></div>
      <nav class="navbar navbar-expand-lg main-navbar">
        <form class="form-inline mr-auto">
          <ul class="navbar-nav mr-3">
            <li><a href="#" data-toggle="sidebar" class="nav-link nav-link-lg"><i class="fas fa-bars"></i></a></li>
            <li><a href="Javascript:epiform.search(); return ;" data-toggle="search" class="nav-link nav-link-lg d-sm-none"><i class="fas fa-search"></i></a></li>
          </ul>
          <div class="search-element">
            <input class="form-control" type="search" placeholder="Search" aria-label="Search" data-width="250" id="txtMainSearch">
            <button class="btn" type="button" onclick="epiform.search()"><i class="fas fa-search"></i></button>
            <div class="search-backdrop"></div>
            <div class="search-result">
              <div class="search-header">
                Histories
              </div>
              <?php include "./componants/search_history.php"; ?>
            </div>
          </div>
        </form>
        <ul class="navbar-nav navbar-right">
          <li class="dropdown dropdown-list-toggle"><a href="#" data-toggle="dropdown" class="nav-link nav-link-lg message-toggle  <?php checkBeep($conn, $uid, 'message'); ?>"><i class="far fa-envelope"></i></a>
            <div class="dropdown-menu dropdown-list dropdown-menu-right">
              <div class="dropdown-header">Messages
                <div class="float-right">
                  <a href="#">Mark All As Read</a>
                </div>
              </div>
              <?php
              include "./componants/message.php";
              ?>
              <div class="dropdown-footer text-center">
                <a href="#">View All <i class="fas fa-chevron-right"></i></a>
              </div>
            </div>
          </li>
          <li class="dropdown dropdown-list-toggle"><a href="#" data-toggle="dropdown" class="nav-link notification-toggle nav-link-lg <?php checkBeep($conn, $uid, 'notification'); ?>"><i class="far fa-bell"></i></a>
            <div class="dropdown-menu dropdown-list dropdown-menu-right">
              <div class="dropdown-header">Notifications
                <div class="float-right">
                  <a href="#">Mark All As Read</a>
                </div>
              </div>
              <?php
              include "./componants/notification.php";
              ?>
              <div class="dropdown-footer text-center">
                <a href="#">View All <i class="fas fa-chevron-right"></i></a>
              </div>
            </div>
          </li>
          <li class="dropdown"><a href="#" data-toggle="dropdown" class="nav-link dropdown-toggle nav-link-lg nav-link-user">
            <img alt="image" src="../../assets/img/avatar/avatar-1.png" class="rounded-circle mr-1">
            <div class="d-sm-none d-lg-inline-block">Hi, <span class="userFullname"><i class="fas fa-sync fa-spin"></i></span> </div></a>
            <div class="dropdown-menu dropdown-menu-right">
              <a href="features-profile?uid=<?php echo $uid;?>" class="dropdown-item has-icon">
                <i class="far fa-user"></i> Profile
              </a>
              <a href="features-activities?uid=<?php echo $uid;?>" class="dropdown-item has-icon">
                <i class="fas fa-bolt"></i> Activities
              </a>
              <a href="features-settings?uid=<?php echo $uid;?>" class="dropdown-item has-icon">
                <i class="fas fa-cog"></i> Settings
              </a>
              <div class="dropdown-divider"></div>
              <a href="Javascript:authen.signout()" class="dropdown-item has-icon text-danger">
                <i class="fas fa-sign-out-alt"></i> Logout
              </a>
            </div>
          </li>
        </ul>
      </nav>
      <div class="main-sidebar sidebar-style-2">
        <aside id="sidebar-wrapper">
          <div class="sidebar-brand">
            <a href="./?uid=<?php echo $uid; ?>">EPIForm</a>
          </div>
          <div class="sidebar-brand sidebar-brand-sm">
            <a href="index.html">St</a>
          </div>
          <ul class="sidebar-menu">
              <li class="menu-header">Dashboard</li>
              <li><a class="nav-link" href="./?uid=<?php echo $uid; ?>"><i class="fas fa-fire"></i> <span>Dashboard</span></a></li>
              <li class="menu-header">Starter</li>
              <li class="active" class="nav-item dropdown">
                <a href="#" class="nav-link has-dropdown" data-toggle="dropdown"><i class="fas fa-columns"></i> <span>Project</span></a>
                <ul class="dropdown-menu">
                  <li><a class="nav-link" href="project-list?uid=<?php echo $uid; ?>">Your project list</a></li>
                  <li class="active"><a class="nav-link" href="project-manage?uid=<?php echo $uid; ?>&pid=<?php echo $pid;?>">Project management</a></li>
                </ul>
              </li>

              <li class="menu-header">Tools</li>
              <li><a class="nav-link" href="fxplor-dashboard?uid=<?php echo $uid; ?>"><i class="fas fa-project-diagram"></i> <span>Fxplor</span></a></li>

              <li class="menu-header">Documentation</li>
              <li class="nav-item dropdown">
                <a href="#" class="nav-link has-dropdown"><i class="fas fa-book"></i> <span>How to?</span></a>
                <ul class="dropdown-menu">
                  <li><a class="nav-link" href="doc-howto?uid=<?php echo $uid; ?>">Documentation for user</a></li>
                </ul>
              </li>
              <li class="menu-header">Other</li>
              <li><a class="nav-link" href="credits?uid=<?php echo $uid; ?>"><i class="fas fa-pencil-ruler"></i> <span>Credits</span></a></li>
            </ul>
        </aside>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <section class="section">
          <div class="section-header">
            <h1>Project management</h1>
          </div>

          <div class="section-body">
            <div class="row">
              <div class="col-8">
                <h6>All form</h6>
              </div>
              <div class="col-4 text-right pb-2">
                <?php
                $strSQL = "SELECT * FROM de2x_form WHERE form_pid = '$pid' ";
                $resultForm = mysqli_query($conn, $strSQL);
                if(($resultForm) && (mysqli_num_rows($resultForm) > 0)){
                  ?>
                  <button type="button" name="button" class="btn btn-primary" data-toggle="modal" data-target="#formModal" style="margin-top: -10px;"><i class="fas fa-plus"></i> Create new form</button>
                  <?php
                }
                ?>

              </div>
            </div>

            <?php
            if(($resultForm) && (mysqli_num_rows($resultForm) > 0)){
              while($row = mysqli_fetch_array($resultForm)){
                ?>
                <div class="card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-12">
                        <h3><?php echo $row['form_title']; ?><a href="#" class="float-right"><i class="fas fa-pencil-alt"></i></a></h3>
                        <h6><?php echo $row['form_desc']; ?></h6>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-12">
                        <button type="button" name="button" class="btn btn-secondary text-dark bsdn" data-toggle="modal" data-target="#paramModal" onclick="setFormId('<?php echo $row['form_id']; ?>')"><i class="fas fa-plus"></i> เพิ่มข้อคำถาม</button>
                        <button type="button" name="button" class="btn btn-danger btn-icon  bsdn"><i class="fas fa-trash"></i></button>
                      </div>
                    </div>
                  </div>
                </div>
                <?php
              }
            }else{
              ?>
              <div class="card">
                <div class="card-body pt-5 pb-5">
                  <div class="row">
                    <div class="col-12 text-center">
                      No questionaire form found.
                    </div>
                    <div class="col-12 text-center pt-3">
                      <button type="button" class="btn btn-primary btn-lg" name="button"  data-toggle="modal" data-target="#formModal"><i class="fas fa-plus"></i> Click here to create first form</button>
                    </div>
                  </div>
                </div>
              </div>
              <?php
            }
            ?>
          </div>
        </section>
      </div>
      <footer class="main-footer">
        <div class="footer-left">
          Copyright &copy; 2018 <div class="bullet"></div> Develop by <a href="https://wisnior.com/" target="_blank">Wisnior Co. Ltd.</a> Theme by  Design By <a href="https://nauval.in/" target="_blank">Muhamad Nauval Azhar</a>
        </div>
        <div class="footer-right">
          2.3.0
        </div>
      </footer>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="formModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Create form</h5>
          <button type="button" class="close btnCloseModal" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form class="" onsubmit="return false;">
            <div class="form-group dn">
              <label for="">Project id : <span class="text-danger">*</span> </label>
              <input type="text" class="form-control" id="txtFormprojectid" value="<?php echo $pid; ?>" readonly>
            </div>
            <div class="form-group">
              <label for="">Form title : <span class="text-danger">*</span> </label>
              <input type="text" class="form-control" id="txtFormtitle">
            </div>
            <div class="form-group">
              <label for="">Description :</label>
              <textarea name="txtFormdesc" id="txtFormdesc" rows="8" cols="80" class="form-control"></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" onclick="project.createForm()">Create</button>
        </div>
      </div>
    </div>
  </div>
  <!-- formModal -->

  <!-- Modal -->
  <div class="modal fade" id="paramModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Create variable</h5>
          <button type="button" class="close btnCloseModal" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form class="" onsubmit="return false;">
            <div class="form-group">
              <label for="">Variable name : <span class="text-danger">*</span> </label>
              <input type="text" class="form-control" id="txtFormtitle">
            </div>
            <div class="form-group">
              <label for="">Question / Variable label :</label>
              <textarea name="txtFormdesc" id="txtFormdesc" rows="8" cols="80" class="form-control"></textarea>
            </div>
            <div class="form-group">
              <label for="">Answer length : </label>
              <input type="number" min="1" max="255" class="form-control" id="txtFormtitle">
              <small>Leave blank if answer my be as long text.</small>
            </div>
            <div class="form-group">
              <label for="">Answer display type : </label>
              <select class="form-control" name="">
                <option value="">Text input</option>
                <option value="">Paragraph</option>
                <option value="">Signle choice</option>
                <option value="">Multiple choice</option>
                <option value="">Rating scale</option>
              </select>
              <small>This inout will show in tablet mode data entry.</small>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" onclick="project.createForm()">Create</button>
        </div>
      </div>
    </div>
  </div>
  <!-- formModal -->

  <!-- General JS Scripts -->
  <script type="text/javascript" src="../../node_modules/jquery/dist/jquery.min.js" ></script>
  <script type="text/javascript" src="../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
  <script type="text/javascript" src="../../node_modules/popper.js/dist/umd/popper.min.js"></script>
  <script type="text/javascript" src="../../node_modules/sweetalert/dist/sweetalert.min.js"></script>
  <script type="text/javascript" src="../../node_modules/moment/min/moment.min.js"></script>
  <script type="text/javascript" src="../../node_modules/bootstrap-daterangepicker/daterangepicker.js"></script>
  <script type="text/javascript" src="../../node_modules/jquery.nicescroll/dist/jquery.nicescroll.min.js"></script>
  <script type="text/javascript" src="../../node_modules/preload.js/dist/js/preload.js"></script>
  <script type="text/javascript" src="../../node_modules/ckeditor_lite/ckeditor.js"></script>
  <script type="text/javascript" src="../../assets/js/stisla.js"></script>

  <!-- Core script -->
  <script src="../../assets/custom/js/config.js?token=<?php echo $sysdateu; ?>"></script>
  <script src="../../assets/custom/js/core.js?token=<?php echo $sysdateu; ?>"></script>
  <script src="../../assets/custom/js/function.js?token=<?php echo $sysdateu; ?>"></script>
  <script src="../../assets/custom/js/authentication.js?token=<?php echo $sysdateu; ?>"></script>

  <script src="../../assets/custom/role/common.js?token=<?php echo $sysdateu; ?>"></script>
  <script src="../../assets/custom/js/epiform.1.0.1.js?token=<?php echo $sysdateu; ?>"></script>
  <script src="../../assets/custom/js/epiform-project.1.0.1.js?token=<?php echo $sysdateu; ?>"></script>

  <script src="../../assets/js/scripts.js?token=<?php echo $sysdateu; ?>"></script>

  <script type="text/javascript">

    var form_info = null;
    var selected_form_id = null;

    $(document).ready(function(){
      authen.user('<?php echo $uid; ?>', 'user')

      if($("#txtFormdesc").length) {
          form_info = CKEDITOR.replace( 'txtFormdesc', {
              wordcount : {
              showCharCount : false,
              showWordCount : true,
              },
              height: '250px'
          });
      }

    })

    function setFormId(id){
      selected_form_id = id
    }
  </script>

</body>
</html>
