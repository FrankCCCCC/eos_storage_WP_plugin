<?php
    // $wallet_name = "default";
    $account_name = "tqweqwms23m3";
    $public_key = "EOS6vyzUYasgvswWXifXyEWuaPds4BQFfrss9m5yLUYFWiwzai4GZ";
    $private_key = "5KYmfr1PCp42FuJxDXESSAsXkSZyV4p1Wcob8qGtbjXZ7GbdxBF";
    $author = "php_exe_author";
    $title = "php_exe_title";
    $content = "php_exe_content";
  
    
    // $cloud_server_url = "http://localhost:4900/upload";
  function upload($account, $public_key, $private_key, $author, $title, $content){
    $cloud_server_url = "https://eosstoragecloudserver-vfnkcyau7q-uc.a.run.app/upload";
    settype($account, "string");
    settype($public_key, "string");
    settype($private_key, "string");
    settype($author, "string");
    settype($title, "string");
    settype($content, "string");
    $postdata = http_build_query(
      array(
        'account' => $account,
        'author' => $author,
        'title' => $title,
        'content' => $content,
        'private_key' => $private_key,
        'public_key' => $public_key
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

  upload($account_name, $public_key, $private_key, $author, $title, $content);
?>