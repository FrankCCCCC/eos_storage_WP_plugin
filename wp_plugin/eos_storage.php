<?php
/**
 * Plugin Name: Eos Storage Plugin
 * Description: Store Content inside Shortcode in EOS
 */

  $contentBuf = "";

//  function eos_shortcode($atts, $content){
//    $str = $content."Attachment";
//     print $str;
//  }

// add_shortcode('eosstorage', 'eos_shortcode');

function caption_shortcode( $atts, $content = null ) {
  settype($content, "string");
  global $contentBuf;
  $contentBuf = $content;
	return '<span class="caption">' . $content . ' Attachment</span>';
}
add_shortcode( 'caption', 'caption_shortcode' );

function eos_storage_menu(){
  add_menu_page('EOS Storage Plugin Setting', 'EOS Storage Setting', 'manage_options', 'eos_storage_plugin_menu', 'eos_storage_script_page', '', 200);
}
add_action('admin_menu', 'eos_storage_menu');

function eos_storage_script_page(){
  $wallet_name = get_option('eos_storage_wallet_name', "");
  $account_name = get_option('eos_storage_account_name', "");
  $key = get_option('eos_storage_key', "");
  $author = get_option('eos_storage_author', "");
  $title = get_option('eos_storage_title', "");
  $content = get_option('eos_storage_content', "");
  $time = "0";
  $cmd = "";

  if(array_key_exists("update", $_POST)){
    update_option('eos_storage_wallet_name', $_POST['wallet_name']);
	  update_option('eos_storage_account_name', $_POST['account_name']);
    update_option('eos_storage_key', $_POST['key']);
    update_option('eos_storage_author', $_POST['author']);
    update_option('eos_storage_title', $_POST['title']);
    update_option('eos_storage_content', $_POST['content']);

    $wallet_name = $_POST['wallet_name'];
    $account_name = $_POST['account_name'];
    $key = "EOS179";
    $author = "TestAuthor";
    $title = "TITLE";
    $content = "CONTENT";
    $time = "05:00";

    $cmd = 'node include.js '.$wallet_name." ".$account_name." ".$key." ".$author." ".$title." ".$content." ".$time;

    echo exec('node include.js '.$wallet_name." ".$account_name." ".$key." ".$author." ".$title." ".$content." ".$time);
  }

  

  ?>
  <div class="wrap">
    <h1>EOS Storage Plugin Setting</h1>
    <form method="post" action="">
      <label for="wallet_name">Wallet Name</label>
      <textarea name="wallet_name" class="large-text"><?php print $wallet_name; ?></textarea>
      <label for="account_name">Account Name</label>
      <textarea name="account_name" class="large-text"><?php print $account_name; ?></textarea>
      <label for="key">Private Key</label>
      <textarea name="key" class="large-text"><?php print $key; ?></textarea>
      <label for="author">Author</label>
      <textarea name="author" class="large-text"><?php print $author; ?></textarea>
      <label for="title">title</label>
      <textarea name="title" class="large-text"><?php print $title; ?></textarea>
      <label for="content">content</label>
      <textarea name="content" class="large-text"><?php print $content; ?></textarea>
      <input type="submit" name="update" value="Update to EOS" class="button button-primary">
    </form>
    <h3><?php print $cmd ?></h3>
  </div>
  <?php
}


?>