<?php
    $wallet_name = "default";
    $account_name = "php_exec_text";
    $key = "EOS68391";
    $author = "php_exe_author";
    $title = "php_exe_title";
    $content = "php_exe_content";
    $time = "php_exe_time";
    
    echo exec('node include.js '.$wallet_name." ".$account_name." ".$key." ".$author." ".$title." ".$content." ".$time);
?>