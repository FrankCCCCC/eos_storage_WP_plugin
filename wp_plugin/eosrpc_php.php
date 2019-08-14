<?php

// $url = "http://192.168.111.16:8888/v1";
// $urlKeosd = "http://192.168.111.16:8900/v1";
$url = "https://api-kylin.eosasia.one/v1";
$urlKeosd = "http://39.108.231.157:30065/v1";
function curl_post($rpc, $payload, $is_json){
    settype($rpc, "string");
    settype($payload, "string");

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $rpc);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    // curl_setopt($ch, CURLOPT_HEADER, true);  
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload); 
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                   
        'Content-Type: application/json',                                                                                
        'Content-Length: ' . strlen($payload)) 
    );
    curl_setopt($ch, CURLOPT_FAILONERROR, true);

    $output = curl_exec($ch);

    // curl_errno Handling
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if($httpcode != 200){
        // Http code handling
        // echo "HTTP Code: ".$httpcode." ERROR\n";
        if (curl_errno($ch)) {
            $error_msg = curl_error($ch);
            echo $error_msg;
        }
    }

    curl_close($ch);
    $resObj = json_decode($output, true);

    // echo $output."\n";
    
    if($is_json){return $output;}
    else{return $resObj;}
}

function curl_get($rpc, $is_json){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $rpc);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FAILONERROR, true);
    if (curl_errno($ch)) {
        $error_msg = curl_error($ch);
        echo $error_msg;
    }

    $output = curl_exec($ch); 

    // curl_errno Handling
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if($httpcode != 200){
        // Http code handling
        // echo "HTTP Code: ".$httpcode." ERROR\n";
        if (curl_errno($ch)) {
            $error_msg = curl_error($ch);
            echo $error_msg;
        }
    }

    curl_close($ch);
    $resObj = json_decode($output, true);

    if($is_json){return $output;}
    else{return $resObj;}
}

function eos_get_info(){
    global $url;
    
    // echo $url."\n";
    $rpc = $url."/chain/get_info";

    $resObj = curl_get($rpc, false);
    
    // var_dump($resObj);
    return $resObj;
}

function eos_get_block($block_num_or_id){
    global $url;
    $rpc = $url."/chain/get_block";
    settype($block_num_or_id, "string");
    $payload = json_encode(array("block_num_or_id"=>$block_num_or_id));

    $resObj = curl_post($rpc, $payload, false);
    
    // var_dump($resObj);
    return $resObj;
}

function eos_abi_json_to_bin($code, $action, $args, $key){
    global $url;
    $rpc = $url."/chain/abi_json_to_bin";

    settype($code, "string");
    settype($action, "string");
    if(gettype($args) != "array"){echo "Wrong type of args, should be an Array.\n"; return ;}
    $json_args = json_encode($args);
    $json_args = trim($json_args, "{}");
    $payload = "{
        \"code\" : \"".$code."\",
        \"action\" : \"".$action."\",
        \"args\" : {
          ".$json_args.",
          \"owner\" : {
            \"accounts\" : [ ],
            \"keys\" : [ {
              \"key\" : \"".$key."\",
              \"weight\" : 1
            } ],
            \"threshold\" : 1,
            \"waits\" : [ ]
          },
          \"active\" : {
            \"accounts\" : [ ],
            \"keys\" : [ {
              \"key\" : \"".$key."\",
              \"weight\" : 1
            } ],
            \"threshold\" : 1,
            \"waits\" : [ ]
          }
        }
      }";
    
    // echo $payload."\n";

    $resObj = curl_post($rpc, $payload, false);
    // echo $resObj."\n";
    // var_dump($resObj);
    return $resObj;
}

function eos_sign_transaction($action_account, $action_name, $actor, $args, $key){
    global $urlKeosd;
    $rpc = $urlKeosd."/wallet/sign_transaction";
    // $rpc = "http://127.0.0.1:5555/v1/wallet/sign_transaction";
    echo $rpc."\n";

    settype($action_account, "string");
    settype($action_name, "string");
    settype($actor, "string");
    settype($key, "string");
    if(gettype($args) != "array"){echo "Wrong type of args, should be an Array.\n"; return ;}

    $chainInfo = eos_get_info();
    $chain_id = $chainInfo["chain_id"];
    $ref_block_num = $chainInfo["head_block_id"];
    $latestBlockInfo = eos_get_block($ref_block_num);
    $timestamp = $latestBlockInfo["timestamp"];
    $ref_block_prefix = $latestBlockInfo["ref_block_prefix"];
    $binargObj = eos_abi_json_to_bin($action_account, $action_name, $args, $key);
    $binarg = $binargObj["binargs"];
    // $actor = "";
    // $action_account = "";
    // $action_name = "";
    $expiration = "2019-09-05T08:40:37";

    $payload = "[ {
        \"actions\" : [ {
          \"account\" : \"".$action_account."\",
          \"name\" : \"".$action_name."\",
          \"authorization\" : [ {
            \"actor\" : \"".$actor."\",
            \"permission\" : \"active\"
          } ],
          \"data\" : \"".$binarg."\"
        }],
        \"expiration\" : \"".$expiration."\",
        \"max_cpu_usage_ms\" : 0,
        \"max_net_usage_words\" : 0,
        \"ref_block_num\" : \"".$ref_block_num."\",
        \"ref_block_prefix\" : \"".$ref_block_prefix."\",
        \"region\" : \"0\"
      }, [ \"".$key."\" ], \"".$chain_id."\" ]";

    // $expiration = gmdate("Y-M-DT");
    echo $payload."\n";
    $resObj = curl_post($rpc, $payload, false);
    
    var_dump($resObj);
    return $resObj;
}

function eos_get_account($account_name){
    global $url;
    $rpc = $url."/chain/get_account";
    settype($account_name, "string");
    $payload = json_encode(array("account_name"=>$account_name));

    
    $resObj = curl_post($rpc, $payload, false);
    
    // var_dump($resObj);
    return $resObj;
}



function eos_get_abi($account_name){
    global $url;
    $rpc = $url."/chain/get_abi";
    settype($account_name, "string");
    $payload = json_encode(array("account_name"=>$account_name));
    
    $resObj = curl_post($rpc, $payload, false);
    // var_dump($resObj);
    return $resObj;
}

function eos_get_code($account_name, $code_as_wasm){
    global $url;
    $rpc = $url."/chain/get_code";
    settype($account_name, "string");
    if(gettype($code_as_wasm) == "string"){
        
    }
    elseif(gettype($code_as_wasm) == "bool"){
        if($code_as_wasm){
            settype($code_as_wasm, "string");
            $code_as_wasm = "true";
        }else{
            settype($code_as_wasm, "string");
            $code_as_wasm = "false";
        }
    }
    elseif(gettype($code_as_wasm) == "int"){
        if($code_as_wasm == 0){
            settype($code_as_wasm, "string");
            $code_as_wasm = "false";
        }else{
            settype($code_as_wasm, "string");
            $code_as_wasm = "true";
        }   
    }else{
        return ;
    }
    
    $payload = json_encode(array("account_name"=>$account_name, "code_as_wasm"=>"true"));
    // $payload1 = "{\"account_name\":\"eosio.token\",\"code_as_wasm\":\"false\"}";
    // echo $payload."\n";
    // echo $payload1."\n";
    $resObj = curl_post($rpc, $payload, false);
    
    // var_dump($resObj);
    return $resObj;
}

function eos_get_raw_code_and_abi($account_name){
    global $url;
    $rpc = $url."/chain/get_raw_code_and_abi";
    settype($account_name, "string");
    $payload = json_encode(array("account_name"=>$account_name));

    $resObj = curl_post($rpc, $payload, true);
    
    // var_dump($resObj);
    echo $resObj."\n";
    return $resObj;
}

function eos_get_table_rows($scope, $code, $table, $json, $lower_bound, $upper_bound, $limit){
    global $url;
    $rpc = $url."/chain/get_get_table_rows";
    settype($scope, "string");
    settype($code, "string");
    settype($table, "string");
    settype($json, "string");
    settype($lower_bound, "int");
    settype($upper_bound, "int");
    settype($limit, "int");

    $payload = json_encode(array("scope"=>$scope, "code"=>$code, "table"=>$table, "json"=>$json, "lower_bound"=>$lower_bound, "upper_bound"=>$upper_bound, "limit"=>$limit));

    // $ch = curl_init();
    // curl_setopt($ch, CURLOPT_URL, $rpc);
    // curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    // curl_setopt($ch, CURLOPT_POST, true);
    // curl_setopt($ch, CURLOPT_POSTFIELDS, $payload); 
    
    // $output = curl_exec($ch); 
    // curl_close($ch);
    // $resObj = json_decode($output, true);
    $resObj = curl_post($rpc, $payload, false);
    
    var_dump($resObj);
    return $resObj;
}

function eos_list_wallets(){
    global $urlKeosd;
    $rpc = $urlKeosd."/wallet/list_wallets";
    
    $resObj = curl_get($rpc, false);
    
    var_dump($resObj);
    return $resObj;
}

function eos_get_currency_balance($code, $account, $symbol){
    global $url;
    $rpc = $url."/chain/get_currency_balance";
    settype($code, "string");
    settype($account, "string");
    settype($symbol, "string");

    $payload = json_encode(array("code"=>$code, "account"=>$account, "symbol"=>$symbol));
    $resObj = curl_post($rpc, $payload, false);
    
    var_dump($resObj);
    return $resObj;
}

function http_request(){
    $homepage = file_get_contents('http://192.168.111.16:8888/v1/chain/get_info');
    echo $homepage;
}

// echo "Hello PHP\n";
$lastestBlock = eos_get_info();
var_dump($lastestBlock);
echo $lastestBlock["head_block_id"]."\n";
eos_get_block($lastestBlock["head_block_id"]);
// eos_get_account("eosio");
// eos_get_abi("eosio");
// eos_get_code("eosio.token", "false");
//@eos_get_raw_code_and_abi("inita", "currency", "account", "false", "0", "-1", "10");
// eos_get_currency_balance("eosio.token", "weragune24nn", "EOS");
$arr = array("user"=>"rpc", "title"=>"rpc_t", "content"=>"rpc_c");
// eos_abi_json_to_bin("weragune24nn", "upload", $arr, "EOS69hQcpRzqodpntbU1rpDsbayn8ira67UKrvNpMjeCPqStq9aCY");
// eos_sign_transaction("weragun", "upload", "test", $arr, "EOS69hQcpRzqodpntbU1rpDsbayn8ira67UKrvNpMjeCPqStq9aCY");
// eos_list_wallets();
echo '<script type="text/javascript"> drawChart(); </script>';

// json_test();

// $time = "2018-09-11T05:59:10.000";

?>