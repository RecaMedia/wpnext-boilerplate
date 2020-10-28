<?php
include 'admin-calls.php';

// Defaults
$plugin = 'classic-editor';
$classic_editor_plugin = array(
  "slug" => $plugin,
  "path" => "$plugin/$plugin.php",
  "full_path" => ABSPATH . "wp-content/plugins/$plugin/$plugin.php"
);
$show_classic_editor = get_option('wpnext_show_editor');
$server_status_check = get_option('wpnext_server_status');


// Process SAVE submission
if (isset($_POST['page']) && $_POST['page'] == "wpnext-settings" && isset($_POST['save'])) {
  
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


if (!$server_status_check || ((isset($_POST['page']) && $_POST['page'] == "wpnext-settings") && isset($_POST['refresh_info']))) {
  // Simple indicator the info is new
  $server_status = "<strong>Freshly squeezed info...</strong>\n";

  // Initial commands
  $is_linux = exec('cat /etc/os-release');
  $is_windows = exec('systeminfo');
  $node_v = shell_exec('node -v');
  $npm_v = shell_exec('npm -v');

  // Determine OS
  if ($is_linux) {
    update_option('wpnext_server_os', "Linux");
    $server_status .= "OS: Linux\n";
  } else if ($is_windows) {
    update_option('wpnext_server_os', "Windows");
    $server_status .= "OS: Windows\n";
  }

  // Check if Node JS is installed
  if ($node_v) {
    update_option('wpnext_server_node', preg_replace( "/\r|\n/", "", $node_v));
    $server_status .= "Node: $node_v";
    if ($npm_v) {
      update_option('wpnext_server_npm', preg_replace( "/\r|\n/", "", $npm_v));
      $server_status .= "NPM: $npm_v";
    } else {
      $server_status .= "NPM: Not Installed\n";
    }
  } else {
    $server_status .= "Node: Not Installed\n";
    $server_status .= "NPM: Not Installed\n";
  }
  
  // Check if modules have been installed
  $node_modules_dir = dirname(__DIR__) . '/node_modules';
  if (is_dir($node_modules_dir)) {
    update_option('wpnext_server_node_mods', 'Installed');
    $server_status .= "Node Modules: Installed\n";
  } else {
    update_option('wpnext_server_node_mods', 'Not Installed (<a href="#" onClick="terminalProcess(\'install\')">Install Modules</a>)');
    $server_status .= "Node Modules: Not Installed (<a href=\"#\" onClick=\"terminalProcess('install')\">Install Modules</a>)\n";
  }

  update_option('wpnext_server_status', true);
} else {
  $server_status = "OS: ".get_option('wpnext_server_os')."\nNode: ".get_option('wpnext_server_node')."\nNPM: ".get_option('wpnext_server_npm')."\nNode Modules: ".get_option('wpnext_server_node_mods');
}

$server_info = json_decode(file_get_contents(get_template_directory_uri().'/configs/server-info.json'));
$classic_editor_installed = check_for_plugin($classic_editor_plugin['full_path']);
?>
<style>
.status-icon {
  height: 8px;
  width: 8px;
  border-radius: 4px;
}
.server-on {
  display: inline-block;
  background-color: #00ff00;
}
.server-off {
  display: inline-block;
  background-color: #ff0000;
}
</style>
<script> 
function checkStatus() {
  var server_toggle;
  jQuery.ajax({
    url: ajaxurl,
    method: "POST",
    data: {
      action: 'wpnext_admin_request',
      url: "<?php echo $server_info->homeURL;?>",
      process: "ping"
    },
    success:function(data) {
      var result = JSON.parse(data);
      if (result.status) {
        server_toggle = '<input type="button" class="button button-primary" value="Stop Server" style="width:100px;" onClick="terminalProcess(\'stop\');">';
      } else {
        server_toggle = '<input type="button" class="button button-primary" value="Start Server" style="width:100px;" onClick="terminalProcess(\'start\');">';
      }
      jQuery('.status-icon').addClass('server-'+(result.status?'on':'off'));
      jQuery('#ServerToggle').html(server_toggle);
    },  
    error: function(errorThrown){
      console.log(errorThrown);
    }
  })
}
function terminalProcess(type) {
  var comms;
  if (type == "start") {
    comms = [
      'cd ../wp-content/themes/wpnext',
      'npm run build',
      'npm start'
    ];
  } else if (type == "stop") {
    comms = [
      'cd ../wp-content/themes/wpnext',
      '^C'
    ];
  } else if (type == "install") {
    comms = [
      'cd ../wp-content/themes/wpnext',
      'npm install',
      'npm audit fix'
    ];
  }
  jQuery.ajax({
    url: ajaxurl,
    method: "POST",
    data: {
      action: 'wpnext_admin_request',
      comm: JSON.stringify(comms),
      process: "term"
    },
    success:function(data) {
      var result = JSON.parse(data);
      result.response.forEach((line, index) => {
        jQuery('#TermOutput').append(line+"\n");
      });
      if (type == "start" || type == "stop") {
        checkStatus();
      }
    },  
    error: function(errorThrown){
      console.log(errorThrown.error);
    }
  });
}
jQuery(document).ready(function(){
  checkStatus();
});
</script>
<div class="wrap">
  <h1>WPNext Theme Kit</h1>
  <form method="post" action="/wp-admin/admin.php?page=wpnext-settings">
  <input type="hidden" name="page" value="wpnext-settings"/>
  <div id="dashboard-widgets-wrap">
    <div id="dashboard-widgets" class="metabox-holder">
      <div id="postbox-container-1" class="postbox-container">
        <div id="normal-sortables" class="meta-box-sortables ui-sortable">
          <div id="wpnext_url_manager" class="postbox">
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
          <div id="wpnext_classic_editor_install" class="postbox">
            <h2 class="hndle" style="cursor:default;"><span>Classic Editor</span></h2>
            <div class="inside">
              <p>Classic editor allows you to easily transfer content to WPNext Builder.</p>
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
    <div style="clear: both; padding: 0 12px 12px;">
      <input type="submit" name="save" id="Save" class="button button-primary" value="Save Changes">
    </div>
  </div>
  </form>
  <hr/>
  <h2>Server</h2>
  <form method="post" action="/wp-admin/admin.php?page=wpnext-settings">
  <input type="hidden" name="page" value="wpnext-settings"/>
  <div id="dashboard-widgets-wrap">
    <div id="dashboard-widgets" class="metabox-holder">
      <div id="postbox-container-1" class="postbox-container">
        <div id="normal-sortables" class="meta-box-sortables ui-sortable">
          <div id="dashboard_site_health" class="postbox">
            <h2 class="hndle" style="cursor:default;"><span>System Information</span></h2>
            <div class="inside">
              <pre><?php echo $server_status;?></pre>
              <input type="submit" name="refresh_info" id="RefreshInfo" class="button button-primary" value="Refresh Info">
            </div>
          </div>
        </div>
      </div>
      <div id="postbox-container-2" class="postbox-container">
        <div id="normal-sortables" class="meta-box-sortables ui-sortable">
          <div id="dashboard_site_health" class="postbox">
            <h2 class="hndle" style="cursor:default;"><span>Status:</span> <span class="status-icon"></span></h2>
            <div class="inside">
              <table style="width:100%;" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:10px;">
                    <textarea id="TermOutput" style="width:100%;height:115px;border:1px solid #CCCCCC;appearance:none;" disabled></textarea>
                  </td>
                  <td style="width:100px;vertical-align:top;">
                    <div id="ServerToggle"></div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </form>
</div>
