<?php
// Protected processes
if (is_user_logged_in() && isset($_POST['process'])) {

  if ($_POST['process'] == "ping") {
    // Function used to check if front-end is running
    function pingURL($url = NULL) {  
      if($url == NULL) return false;  
      $ch = curl_init($url);  
      curl_setopt($ch, CURLOPT_TIMEOUT, 5);  
      curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);  
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  
      $data = curl_exec($ch);  
      $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);  
      curl_close($ch);  
      if($httpcode>=200 && $httpcode<300){  
        return true;  
      } else {  
        return false;  
      }  
    }

    if (isset($_POST['url']) && $_POST['url'] != "") {
      echo json_encode(array(
        "status" => pingURL($_POST['url'])
      ));
    } else {
      echo json_encode(array(
        "status" => false,
        "error" => "Url not provided."
      ));
    }
  }

  if ($_POST['process'] == "term") {
    function command($commands) {
      $outputs = array();

      foreach($commands as $command) {
        exec($command, $comm_output, $success);
        if ($success != 0) {
          array_push($outputs, "Command \"".$command."\" failed!");
          break;
        } else {
          $outputs = array_merge($outputs, $comm_output);
        }
      }
      
      return $outputs;
    }

    if (isset($_POST['comm']) && $_POST['comm'] != "") {
      $commands = json_decode(html_entity_decode(stripslashes($_POST['comm'])),true);

      $response = command($commands);
      echo json_encode(array(
        "commands" => $commands,
        "response" => $response
      ));
    } else {
      echo json_encode(array(
        "response" => false,
        "error" => "Command not provided."
      ));
    }
  }
}
?>