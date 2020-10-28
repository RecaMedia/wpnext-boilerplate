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
  $wp_rewrite->set_permalink_structure('/blog/%postname%');
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
    __( 'WPNext Kit', 'wpnext' ),
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

// Our custom post type function
function create_dynamic_posttype() {
  register_post_type('dynamic_page',
    // custom post type options
    array(
      'labels' => array(
        'name' => __( 'Dynamic Pages' ),
        'singular_name' => __( 'Dynamic Page' )
      ),
      'public' => true,
      'has_archive' => false,
      'hierarchical' => false,
      'rewrite' => array(
        'slug' => '/',
        'with_front' => false,
        'pages' => true
      ),
      'show_ui' => false,
      'show_in_menu' => false,
      'show_in_rest' => false,
    )
  );
}

// Remove from main menu
function remove_dynamic_posttype_menu() {
  remove_menu_page('edit.php?post_type=dynamic_page');
}

// Create dynamic links that will be listed within menu items
function read_pages_for_dynamic_posttype_list() {
  // Defaults for retrieving non-wordpress dynamic pages that are not excluded
  $dir = dirname(__FILE__) . "/pages";
  // Strip dashes and underscores to replace with spaces
  function processFileName($string, $makeIntoTitle = false) {
    if ($makeIntoTitle) {
      $string = trim(ucwords(str_replace('.js', ' ', str_replace('_', ' ', str_replace('-', ' ', $string)))));
    } else {
      $string = str_replace('.js', ' ', $string);
    }
    return $string;
  }
  // Private function to process the directory
  function processDir($base, $dir) {
    // Array that will be returned
    $dir_list = array();
    $exclude = array("[slug]", "blog", "_app.js", "index.js");
    // Process loop
    if (is_dir($dir)){
      if ($dh = opendir($dir)){
        while (($file = readdir($dh)) !== false){
          if ($file != "." && $file != ".." && !in_array($file, $exclude)) {
            if (is_dir($file)) {
              $sub_dir = $dir . "/" . $file;
              $sub_list = processDir($file, $sub_dir);
              $dir_list = array_merge($dir_list, $sub_list);
            } else {
              $dir_list[] = array(
                "pageName" => processFileName($file, true),
                "pagePath" => $base . "/" . processFileName($file)
              );
            }
          }
        }
        closedir($dh);
      }
    }
    // Return array
    return $dir_list;
  }
  // Complete files to list
  $list = processDir("", $dir);
  // Get all existing post
  $wp_dy_post = get_posts([
    'post_type' => 'dynamic_page',
    'post_status' => 'publish',
    'numberposts' => -1
  ]);
  // Verify we haven't created the post already before creating it
  foreach($list as $page_data) {
    $found = false;
    foreach($wp_dy_post as $post) {
      if ($post->post_title == $page_data['pageName']) {
        $found = true;
      }
    }
    if (!$found) {
      wp_insert_post(array(
        'post_title' => $page_data['pageName'],
        'post_name' => $page_data['pagePath'],
        'post_content' => 'Dynamic page for ' . $page_data['pageName'],
        'post_status' => 'publish',
        'post_author' => 1,
        'post_type' => 'dynamic_page'
      ));
    }
  }
}

function wpnext_admin_request() {
  require_once('includes/admin-calls.php');
  die();
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

  read_pages_for_dynamic_posttype_list();
}

// Run functions on init
add_action('init', 'init_theme');
// Register custom post type
add_action('init', 'create_dynamic_posttype');
// Remove menu item
add_action('admin_menu', 'remove_dynamic_posttype_menu');
// Add CSS grid
add_action('admin_enqueue_scripts', 'admin_includes');
// Reset permalinks
add_action('after_setup_theme', 'reset_permalinks');
// Add admin page & menu
add_action( 'admin_menu', 'my_admin_menu' );
// Hook that works with the WordPress AJAX functionality
add_action('wp_ajax_wpnext_admin_request', 'wpnext_admin_request'); 
// Add modified routes
require_once('includes/api-mods.php');
?>