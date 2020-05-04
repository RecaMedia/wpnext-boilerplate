<?php
function install_plugin($plugin_slug) {
  include_once( ABSPATH . 'wp-admin/includes/file.php' );
  include_once( ABSPATH . 'wp-admin/includes/misc.php' );
  include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
  include_once( ABSPATH . 'wp-admin/includes/class-wp-upgrader.php' );
  include_once( ABSPATH . 'wp-admin/includes/class-wp-upgrader-skin.php' );
  include_once( ABSPATH . 'wp-admin/includes/plugin-install.php' ); //for plugins_api..
  $api = plugins_api( 'plugin_information', array(
    'slug' => $plugin_slug
  ));
  $upgrader = new Plugin_Upgrader( new WP_Upgrader_Skin());
  $upgrader->install($api->download_link);
}

function check_for_plugin($plugin_path) {
  return file_exists($plugin_path);
}

function check_if_active($plugin_path) {
  include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
  return is_plugin_active($plugin_path);
}

function toggle_plugin($switch, $plugin_path) {
  include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
  if ($switch) {
    activate_plugin($plugin_path);
  } else {
    deactivate_plugins($plugin_path);
  }
}
?>