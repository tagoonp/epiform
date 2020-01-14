<?php
function checkTimeline($conn, $role, $stage){
    echo 0;
}

function DateThai($strDate, $dateonly){
    if($strDate != NULL){
      $strYear = date("Y",strtotime($strDate))+543;
  		$strMonth= date("n",strtotime($strDate));
  		$strDay= date("j",strtotime($strDate));
  		$strHour= date("H",strtotime($strDate));
  		$strMinute= date("i",strtotime($strDate));
  		$strSeconds= date("s",strtotime($strDate));
  		$strMonthCut = Array("","ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค.");
  		$strMonthThai=$strMonthCut[$strMonth];
      if($dateonly){
        return "$strDay $strMonthThai $strYear";
      }else{
        return "$strDay $strMonthThai $strYear, $strHour:$strMinute";
      }
    }else{
      return "NA";
    }
}

function DateEnglish($strDate, $dateonly){
    if($strDate != NULL){
      $strYear = date("Y",strtotime($strDate))+543;
  		$strMonth= date("n",strtotime($strDate));
  		$strDay= date("j",strtotime($strDate));
  		$strHour= date("H",strtotime($strDate));
  		$strMinute= date("i",strtotime($strDate));
  		$strSeconds= date("s",strtotime($strDate));
  		$strMonthCut = Array("","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
  		$strMonthThai=$strMonthCut[$strMonth];
      if($dateonly){
        return "$strDay $strMonthThai $strYear";
      }else{
        return "$strDay $strMonthThai $strYear, $strHour:$strMinute";
      }
    }else{
      return "NA";
    }
}

function DateDiff($start, $end, $unit){
  if($unit == 'day'){
    $date1 = strtotime($start." 00:00:00");
    $date2 = strtotime($end." 00:00:00");
    $diff = ($date2 - $date1)/60/60/24;
    return $diff;
  }
}

function DateDiff2($start, $end){
  $bd1 = explode("-", $start);
  $bd2 = explode("-", $end);
  $start = $bd1[2]."-".$bd1[1]."-".$bd1[0];
  $end = $bd2[2]."-".$bd2[1]."-".$bd2[0];
  $datetime1 = date_create($start);
  $datetime2 = date_create($end);

  // Calculates the difference between DateTime objects
  $interval = date_diff($datetime1, $datetime2);

  // Display the result
  echo $interval->format('Difference between two dates: %R%a days');
}

function checkBeep($conn, $uid, $condition){
  if($condition == 'message'){
    $strSQL = "SELECT * FROM de2x_message WHERE msg_uid = '$uid' AND msg_unread = '1' LIMIT 1";
    $result = mysqli_query($conn, $strSQL);
    if(($result) && (mysqli_num_rows($result) > 0)){
      echo "beep";
    }
  }else if($condition == 'notification'){
    $strSQL = "SELECT * FROM de2x_notification WHERE noti_uid = '$uid' AND noti_unread = '1' LIMIT 1";
    $result = mysqli_query($conn, $strSQL);
    if(($result) && (mysqli_num_rows($result) > 0)){
      echo "beep";
    }
  }
}
?>
