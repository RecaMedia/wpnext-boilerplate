<?php

$plugin = 'classic-editor';
$classic_editor_plugin = array(
  "slug" => $plugin,
  "path" => "$plugin/$plugin.php",
  "full_path" => ABSPATH . "wp-content/plugins/$plugin/$plugin.php"
);
$show_classic_editor = get_option('wpnext_show_editor');

// Do things only when form is submitted
if (isset($_POST['page']) && $_POST['page'] == "wpnext-settings") {
  
  // Check if we show editor
  if (isset($_POST['wpnext_home_url']) && "" != $_POST['wpnext_home_url']) {
    update_urls($_POST['wpnext_home_url']);
  }

  // Check if we show editor
  if (isset($_POST['show_classic_plugin']) && "active" == $_POST['show_classic_plugin']) {
    $show_classic_editor = true;
  } else {
    $show_classic_editor = false;
  }
  update_option('wpnext_show_editor', $show_classic_editor);

  // Check classic plugin toggle
  if (isset($_POST['use_classic_plugin']) && "active" == $_POST['use_classic_plugin']) {
    $plugin_is_active = true;
  } else {
    $plugin_is_active = false;
  }
  toggle_plugin($plugin_is_active, $classic_editor_plugin['full_path']);

  // Check if user wants to install plugin
  if (isset($_POST['install_classic_plugin'])) {
    install_plugin($classic_editor_plugin['slug']);
  }

} else {
  // Do things when form is not submitted
  $plugin_is_active = check_if_active($classic_editor_plugin['path']);
}

$server_info = json_decode(file_get_contents(get_template_directory_uri().'/configs/server-info.json'));
$classic_editor_installed = check_for_plugin($classic_editor_plugin['full_path']);

?>
<form method="post" action="/wp-admin/admin.php?page=wpnext-settings">
  <input type="hidden" name="page" value="wpnext-settings"/>
  <div class="wrap">
    <h1>WPNext</h1>
    <div id="dashboard-widgets-wrap">
      <div id="dashboard-widgets" class="metabox-holder">
        <div id="postbox-container-1" class="postbox-container">
          <div id="normal-sortables" class="meta-box-sortables ui-sortable">
            <div id="dashboard_site_health" class="postbox ">
              <h2 class="hndle" style="cursor:default;"><span>URL Manager</span></h2>
              <div class="inside">
                <table style="width:100%;">
                  <tr>
                    <td><label for="wpnext_wp_api">WordPress URL</label></td>
                    <td style="width:60%;"><input id="wpnext_wp_api" style="width:100%;" name="wpnext_wp_api" type="text" value="<?php echo $server_info->WPURL;?>" disabled/></td>
                  </tr>
                  <tr>
                    <td><label for="wpnext_wp_api_url">WordPress API URL</label></td>
                    <td style="width:60%;"><input id="wpnext_wp_api_url" style="width:100%;" name="wpnext_wp_api_url" type="text" value="<?php echo $server_info->WPJson;?>" disabled/></td>
                  </tr>
                  <tr>
                    <td colspan="2"><p class="description" id="home-description">You can modify your WordPress URLs within the <a href="http://wp.shannonreca.local/wp-admin/options-general.php">settings</a> page.</p></td>
                  </tr>
                  <tr>
                    <td><label for="wpnext_home_url">WordPress Home URL</label></td>
                    <td style="width:60%;"><input id="wpnext_home_url" style="width:100%;" name="wpnext_home_url" type="text" value="<?php echo $server_info->homeURL;?>"/></td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div id="postbox-container-2" class="postbox-container">
          <div id="normal-sortables" class="meta-box-sortables ui-sortable">
            <div id="dashboard_site_health" class="postbox ">
              <h2 class="hndle" style="cursor:default;"><span>Classic Editor</span></h2>
              <div class="inside">
                <?php if ($classic_editor_installed) {
                  echo '<p><label><input type="checkbox" name="show_classic_plugin" value="active" '.($show_classic_editor ? "checked='checked'" : "" ).'/> Show Classic Editor</label></p>';
                  echo '<p><label><input type="checkbox" name="use_classic_plugin" value="active" '.($plugin_is_active ? "checked='checked'" : "" ).'/> Use Classic Editor</label></p>';
                } else {
                  echo '<input type="submit" name="install_classic_plugin" value="Install Classic Editor"/>';
                }?>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <input type="submit" name="save" id="submit" class="button button-primary" value="Save Changes">
  </div>
</form>