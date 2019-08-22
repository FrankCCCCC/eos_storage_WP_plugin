<?php
    $wallet_name = "default";
    $account_name = "php_exec_text";
    $key = "EOS68391";
    $author = "php_exe_author";
    $title = "php_exe_title";
    $content = "php_exe_content";
    $time_upload = "php_exe_time";
    
    // echo exec('node include.js '.$wallet_name." ".$account_name." ".$key." ".$author." ".$title." ".$content." ".$time_upload);

    // $cloud_server_url = "https://eosstoragecloudserver-vfnkcyau7q-an.a.run.app/";
    
    $cloud_server_url = "http://localhost:4900/upload";
  function upload($author, $title, $content){
    global $cloud_server_url;
    settype($author, "string");
    settype($title, "string");
    settype($content, "string");
    $postdata = http_build_query(
      array(
        'account' => 'jwqnka13noaq',
        'author' => $author,
        'title' => $title,
        'content' => $content,
        'private_key' => '5Hse6HU8gt49wA2DSdomT6JujWzzHWbpgm54cf3Ci6qiGdrbB2X',
        'public_key' => 'EOS5adzeBDm18Qg44reD9BxydmHX8F1tyPsDxCBUxsaWunUjpVp3E'
      )
    );
    
    $opts = array('http' =>
        array(
            'method'  => 'POST',
            'header'  => 'Content-Type: application/x-www-form-urlencoded',
            'content' => $postdata,
            'timeout' => 60.0,
        )
    );
    $context  = stream_context_create($opts);
    $result = file_get_contents($cloud_server_url, false, $context);
    echo $result;
  }

  upload($author, $title, $content);
?>