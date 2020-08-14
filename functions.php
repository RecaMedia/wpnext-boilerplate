<?php
// Handle url update
require_once('includes/manage-url.php');
// Handle plugin functions
require_once('includes/install-plugins.php');
// WPNext Builder
require_once('includes/component-builder.php');

// Bootstrap grid along with CSS overrides
function admin_includes() {
  wp_enqueue_style('admin-overrides', get_template_directory_uri().'/assets/css/admin-overrides.css');
  wp_enqueue_style('admin-grid', get_template_directory_uri().'/assets/css/bootstrap-grid.min.css', array('admin-overrides'));
  wp_enqueue_media();
}

// Set permalinks
function reset_permalinks() {
  global $wp_rewrite;
  $wp_rewrite->set_permalink_structure('/blog/%postname%/');
  $wp_rewrite->flush_rules();
}

// Register menu locations
function register_all_menus() {
  // Get menu locations
  $WPNMenus = json_decode(file_get_contents(dirname(__FILE__) . '/configs/menu-locations.json'), true);
  // Register each location
  foreach($WPNMenus as $menu) {
    register_nav_menu($menu['slug'],__( $menu['name'], 'wp-next' ));
  }
}

// Add admin settings for WPNext
function my_admin_menu() {
  add_menu_page(
    __( 'WPNext Settings', 'wpnext' ),
    __( 'WPNext', 'wpnext' ),
    'manage_options',
    'wpnext-settings',
    'my_admin_page_contents',
    'dashicons-admin-settings',
    3
  );
}

// Contstruct admin page
function my_admin_page_contents() {
  // Bring in the settings page
  require_once('includes/settings-page.php');
}

// Init theme
function init_theme() {
  // Add menu routes
  require_once('includes/install-menus-api.php');
  // Initialize menu route function
  wp_rest_menus_init();
  // Admin UI Builder
  $built_components = new componentBuilder();
  // Register theme setting "wpnext_show_editor"
  register_setting('wpnext', 'wpnext_show_editor');
  add_option('wpnext_show_editor', false);

  // Get "wpnext_show_editor" value to determine if we show editor
  $show_classic_editor = get_option('wpnext_show_editor');
  if (!$show_classic_editor) {
    remove_post_type_support('post', 'editor');
    remove_post_type_support('page', 'editor');
  }
  // Use initial home url for server-info.json
  update_urls(get_home_url());
  // Make sure excerpt field is available
  add_post_type_support('post', 'excerpt');
  add_post_type_support('page', 'excerpt');
  // Make sure feature image option is available
  add_theme_support('post-thumbnails');
  // Register menu locations
  register_all_menus();
}

// Run functions on init
add_action('init', 'init_theme');
// Add CSS grid
add_action('admin_enqueue_scripts', 'admin_includes');
// Reset permalinks
add_action('after_setup_theme', 'reset_permalinks');
// Add admin page & menu
add_action( 'admin_menu', 'my_admin_menu' );
// Add modified routes
include('includes/api-mods.php');
?>