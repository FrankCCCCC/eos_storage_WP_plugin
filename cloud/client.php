<?php
    include "./xrsa.php";

    $url = "http://localhost:5000";
    function http_connect($method, $baseUrl, $router, $payload){
        if((string)$payload != ""){
            $data = http_build_query($payload);
        }
        
        if(strtolower($method) == "post"){
            $opts = array('http' =>
                array(
                'method'  => 'POST',
                'header'  => 'Content-Type: application/x-www-form-urlencoded',
                'content' => $data,
                'timeout' => 60.0,
                )
            );
            $context  = stream_context_create($opts);
            $result = file_get_contents($baseUrl.$router, false, $context);
        }
        else if(strtolower($method) == "get"){
            $opts = array('http' =>
                array(
                'method'  => 'GET',
                'header'  => 'Content-Type: application/x-www-form-urlencoded',
                'timeout' => 60.0,
                )
            );
            $context  = stream_context_create($opts);
            $result = file_get_contents($baseUrl.$router.'?'.$data, false, $context);
        }
        return $result;
    }

    http_connect('get', $url, '/conn', "");
?>