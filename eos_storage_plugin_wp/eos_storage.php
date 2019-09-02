<?php
/**
 * Plugin Name: Eos Storage Plugin
 * Description: Store Content inside Shortcode in EOS
 */

$contentBuf = "";
$monitor_page_url = "https://frankccccc.github.io/eos_storage_WP_plugin/";
// $cloud_server_url = "https://eosstoragecloudserver-vfnkcyau7q-uc.a.run.app/";

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
  // echo $result;
  return $result;
}

function sample_admin_notice__success() {
  ?>
  <div class="notice notice-success is-dismissible">
      <p><?php _e( 'Done!', 'sample-text-domain' ); ?></p>
  </div>
  <script>
      alert("This is alert");
  </script>
  <?php
}
// add_action( 'admin_notices', 'sample_admin_notice__success' );

function eos_storage_menu(){
  add_menu_page('EOS Storage Plugin Setting', 'EOS Storage Setting', 'manage_options', 'eos_storage_plugin_menu', 'eos_storage_script_page', '', 200);
}
add_action('admin_menu', 'eos_storage_menu');

function temp_post($post_ID)  {
  $post = get_post($post_ID); 
  $title = apply_filters( 'the_title', $post->post_title );
  $content = apply_filters( 'the_content', $post->post_content );
  $permalink = get_permalink($post_ID);   

  $author = get_option('eos_storage_author', "");
  $account_name = get_option('eos_storage_account_name', "");
  $private_key = get_option('eos_storage_private_key', "");
  $public_key = get_option('eos_storage_public_key', "");
  $is_auto_update = get_option('is_eos_storage_auto_update', "false");

  if($is_auto_update == "true"){
    $res = upload($account_name, $public_key, $private_key, $author, $title, $content);

    // echo $res;
    $arrRes = json_decode($res, true);
    $list = get_option('eos_storage_uploaded_article', "");
    $arrAdd = array(
      'title' => $title,
      'link' => $arrRes['link']
    );
    array_push($list, $arrAdd);
    update_option('res', $res);
    update_option('eos_storage_uploaded_article', $list);
    // echo ‘<script type=”text/javascript”>alert(“Success!!”);</script>’;
    
  }

  // return $post_ID;
}

add_action('publish_post', 'temp_post');

function eos_storage_script_page(){
  $arr = array(
    array(
      'title' => "Test Title",
      'link' => "https://jjsv"
    ),
    array(
      'title' => "Test Title2",
      'link' => "https://jjsv222"
    )
  );
  // update_option('eos_storage_uploaded_article', $arr);
  $res = get_option('res', "");
  $list = get_option('eos_storage_uploaded_article', "");
  $account_name = get_option('eos_storage_account_name', "");
  $private_key = get_option('eos_storage_private_key', "");
  $public_key = get_option('eos_storage_public_key', "");
  $author = get_option('eos_storage_author', "");
  $is_auto_update = get_option('is_eos_storage_auto_update', "false");
  $checked = "";
  if ($is_auto_update == "true"){
    $checked = "checked";
  }
  

  if(array_key_exists("update", $_POST)){
    $args = array("post_type" => "post", "s" => $title);
    $query = get_posts( $args );
    // $author = $query->post_author;
    $title = $query->post_title;
    $content = $query->post_content;

    $author = get_option('eos_storage_author', "");
    $account_name = get_option('eos_storage_account_name', "");
    $private_key = get_option('eos_storage_private_key', "");
    $public_key = get_option('eos_storage_public_key', "");

    echo $title;
    echo $author;
    echo $content;

    upload($account_name, $public_key, $private_key, $author, $title, $content);
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
    update_option('eos_storage_account_name', $_POST['account_name']);
    update_option('eos_storage_author', $_POST['author']);
    update_option('eos_storage_private_key', $_POST['private_key']);
    update_option('eos_storage_public_key', $_POST['public_key']);
  }

  ?>
  <div class="wrap">
    <h1>EOS Storage Plugin Setting</h1>
    <form method="post" action="">
      <h2>Set Author Name</h2>
      <label for="account_name">Account Name</label>
      <textarea name="account_name" class="large-text"><?php print $account_name; ?></textarea>
      <label for="author">Author</label>
      <textarea name="author" class="large-text"><?php print $author; ?></textarea>
      <label for="private_key">Private Key</label>>
      <textarea name="private_key" class="large-text"><?php print $private_key; ?></textarea>
      <label for="public_key">Public Key</label>>
      <textarea name="public_key" class="large-text"><?php print $public_key; ?></textarea>
      <input type="submit" name="set_author" value="Apply" class="button button-primary">
    </form>
    <form method="post" action="">
      <h2>Auto Upload</h2>
      <input type="checkbox" name="is_auto_update" value="true" <?php print $checked ?>><label>Auto Update The Post Whenever a Post Publish.</label>
      <input type="submit" name="confirm_auto_update" value="Apply" class="button button-primary">
    </form>
    <form method="post" action="">
      <h2>Upload Other Posts</h2>
      <label for="title">Title</label>
      <textarea name="title" class="large-text"><?php print $title; ?></textarea>
      
      <input type="submit" name="update" value="Update to EOS" class="button button-primary">
    </form>
  </div>
  <div>
    <h2>Uploaded Articles</h2>
    <p><?php print $res; ?></p>
    <table>
      <tr>
        <td>Title</td>
        <td>Link1</td>
      </tr>
      <?php 
        foreach($list as $art){
          echo '<tr><td>'.$art['title'].'</td><td><a href="'.$art['link'].'">'.$art['link'].'</a></td></tr>';
        }
      ?>
    </table>
  </div>
<?php
}
?>