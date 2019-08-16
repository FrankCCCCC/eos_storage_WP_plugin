<?php
/**
 * Plugin Name: Eos Storage Plugin
 * Description: Store Content inside Shortcode in EOS
 */

$contentBuf = "";
$monitor_page_url = "https://frankccccc.github.io/eos_storage_WP_plugin/";
$cloud_server_url = "https://eosstoragecloudserver-vfnkcyau7q-an.a.run.app/";
// $cloud_server_url = "http://localhost:4900/";

// function caption_shortcode( $atts, $content = null ) {
//   settype($content, "string");
//   global $contentBuf;
//   $contentBuf = $content;
// 	return '<span class="caption">' . $content . ' Attachment</span>';
// }
// add_shortcode( 'caption', 'caption_shortcode' );

function upload($author, $title, $content){
  global $cloud_server_url;
  settype($author, "string");
  settype($title, "string");
  settype($content, "string");
  $postdata = http_build_query(
    array(
      // 'user' => 'phpExecText',
      'author' => $author,
      'title' => $title,
      'content' => $content,
      // 'time_upload' => 'php_exe_time'
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
  // echo $result;
  return $result;
}

function eos_storage_menu(){
  add_menu_page('EOS Storage Plugin Setting', 'EOS Storage Setting', 'manage_options', 'eos_storage_plugin_menu', 'eos_storage_script_page', '', 200);
}
add_action('admin_menu', 'eos_storage_menu');

// function temp_post($id, $post){
//   $auto_update = get_option('is_eos_storage_auto_update', "false");
//   $temp_author_id = $post->post_author;
//   $temp_author = get_the_author_meta( 'display_name', $temp_author_id);
//   $temp_title = $post->post_title;
//   $temp_content = $post->post_content;

//   // upload($temp_author, $temp_title, $temp_content);

//   $friends = 'unaxultraspaceos5@gmail.com';
//   $sent = wp_mail( $friends, "sally's blog updated", 'I just put something on my blog: http://blog.example.com' );

//   // update_opiton('temp_post_author_12', $temp_author);
//   // update_opiton('temp_post_title_12', $temp_title);
//   // update_opiton('temp_post_content_12', $temp_content);

//   // if($auto_update == "true"){  
  
    
//   // }else{
//   //   update_opiton('temp_post_author', $temp_author);
//   //   update_opiton('temp_post_title', $temp_title);
//   //   update_opiton('temp_post_content', $temp_content);
//   // }

  
// }
// add_action('publish_post', 'temp_post', 10, 2);

function temp_post($post_ID)  {
  $post = get_post($post_ID); 
  // $title = $post->post_title;
  // $content = $post->post_content;
  // $author = apply_filters( 'the_author', $post->post_author );
  $author = get_option('eos_storage_author', "");
  $title = apply_filters( 'the_title', $post->post_title );
  $content = apply_filters( 'the_content', $post->post_content );
  $permalink = get_permalink($post_ID);   
  $is_auto_update = get_option('is_eos_storage_auto_update', "false");

  if($is_auto_update == "true"){
    upload($author, $title, $content);
  }

  // update_opiton('temp_post_author', $author);
  // update_opiton('temp_post_title', $title);
  // update_opiton('temp_post_content', $content);

  return $post_ID;
}

add_action('publish_post', 'temp_post');

// function upload_latest_post(){
//   $title = get_option('temp_post_title', "");
//   $content = get_option('temp_post_content', "");
//   $author = get_option('temp_post_author', "");
//   echo $title;
//   echo $author;
//   echo $content;
//   // upload($author, $title, $content);
//   upload("author", "title", "content");
// }

function eos_storage_script_page(){
  // $wallet_name = get_option('eos_storage_wallet_name', "");
  // $account_name = get_option('eos_storage_account_name', "");
  // $key = get_option('eos_storage_key', "");
  $author = get_option('eos_storage_author', "");
  // $title = get_option('eos_storage_title', "");
  // $content = get_option('eos_storage_content', "");
  $is_auto_update = get_option('is_eos_storage_auto_update', "false");
  $checked = "";
  if ($is_auto_update == "true"){
    $checked = "checked";
  }
  

  if(array_key_exists("update", $_POST)){
    // update_option('eos_storage_wallet_name', $_POST['wallet_name']);
	  // update_option('eos_storage_account_name', $_POST['account_name']);
    // update_option('eos_storage_key', $_POST['key']);
    // update_option('eos_storage_author', $_POST['author']);
    // update_option('eos_storage_title', $_POST['title']);
    // update_option('eos_storage_content', $_POST['content']);
    $args = array("post_type" => "post", "s" => $title);
    $query = get_posts( $args );
    $author = $query->post_author;
    $title = $query->post_title;
    $content = $query->post_content;
    echo $title;
    echo $author;
    echo $content;

    upload($author, $title, $content);
  }

  if(array_key_exists("confirm_auto_update", $_POST)){
    update_option('is_eos_storage_auto_update', $_POST['is_auto_update']);
    $is_auto_update = get_option('is_eos_storage_auto_update', "false");
    $checked = "";
    if ($is_auto_update == "true"){
      $checked = "checked";
    }
  }

  if(array_key_exists("set_author", $_POST)){
    update_option('eos_storage_author', $_POST['author']);
  }

  ?>
  <div class="wrap">
    <h1>EOS Storage Plugin Setting</h1>
    <form method="post" action="">
      <h2>Set Author Name</h2>
      <textarea name="author" class="large-text"><?php print $author; ?></textarea>
      <input type="submit" name="set_author" value="Apply" class="button button-primary">
    </form>
    <form method="post" action="">
      <h2>Auto Upload</h2>
      <input type="checkbox" name="is_auto_update" value="true" <?php print $checked ?>><label>Auto Update The Post Whenever a Post Publish.</label>
      <input type="submit" name="confirm_auto_update" value="Apply" class="button button-primary">
    </form>
    <form method="post" action="">
      <h2>Upload Other Posts</h2>
      <!-- <label for="wallet_name">Wallet Name</label>
      <textarea name="wallet_name" class="large-text"><?php print $wallet_name; ?></textarea> -->
      <!-- <label for="account_name">Account Name</label>
      <textarea name="account_name" class="large-text"><?php print $account_name; ?></textarea> -->
      <!-- <label for="key">Private Key</label>
      <textarea name="key" class="large-text"><?php print $key; ?></textarea> -->
      <!-- <label for="author">Author</label>
      <textarea name="author" class="large-text"><?php print $author; ?></textarea> -->
      <label for="title">Input the title of the post which you want to upload to EOS</label>
      <!-- <label for="title">Title</label> -->
      <textarea name="title" class="large-text"><?php print $title; ?></textarea>
      <!-- <label for="content">Content</label>
      <textarea name="content" class="large-text"><?php print $content; ?></textarea> -->
      <input type="submit" name="update" value="Update to EOS" class="button button-primary">
    </form>
  </div>
<?php
}
?>