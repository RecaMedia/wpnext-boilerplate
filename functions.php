<?php
// Handle url update
require_once('includes/manage-url.php');
// Handle plugin functions
require_once('includes/install-plugins.php');
// WPNext Builder
require_once('includes/component-builder.php');

// Menu locations
$WPNMenus = json_decode(file_get_contents(dirname(__FILE__) . '/configs/menu-locations.json'), true);

// Bootstrap grid
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

function register_all_menus() {
  global $WPNMenus;
  foreach($WPNMenus as $menu) {
    register_nav_menu($menu['slug'],__( $menu['name'], 'wp-next' ));
  }
}

// Get frontpage data for frontpage route
function get_frontpage($req) {
  // Get WP options front page from settings > reading.
  $frontpage_id = get_option('page_on_front');
  // Handle if error.
  if ( empty( $frontpage_id ) ) {
    // return error
    return 'error';
  }
  // Create request from pages endpoint by frontpage id.
  $request  = new \WP_REST_Request( 'GET', '/wp/v2/pages/' . $frontpage_id );
  // Parse request to get data.
  $response = rest_do_request( $request );
  // Handle if error.
  if ( $response->is_error() ) {
     return array('error' => 'Something broke.');
  }
  // Return data
  return $response->get_data();
}

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

function my_admin_page_contents() {
  // Bring in the settings page
  require_once('includes/settings-page.php');
}

// Remove editor from post types
function init_theme() {
  // Add menu routes
  require_once('includes/install-menus-api.php');
  // Admin UI Builder
  $built_components = new componentBuilder();

  register_setting('wpnext', 'wpnext_show_editor');
  add_option('wpnext_show_editor', false);

  $show_classic_editor = get_option('wpnext_show_editor');
  if (!$show_classic_editor) {
    remove_post_type_support('post', 'editor');
    remove_post_type_support('page', 'editor');
  }

  update_urls(get_home_url());

  add_post_type_support('post', 'excerpt');
  add_post_type_support('page', 'excerpt');
  add_theme_support('post-thumbnails');
  register_all_menus();
  wp_rest_menus_init();
}

// Run functions on init
add_action('init', 'init_theme');
// Add CSS grid
add_action('admin_enqueue_scripts', 'admin_includes');
// Reset permalinks
add_action('after_setup_theme', 'reset_permalinks');
// Register new routes
add_action( 'rest_api_init', function () {
  // Front Page route -> /wp-json/wpn/v1/frontpage/
  register_rest_route('wpn/v1', '/frontpage', array(
    'methods'  => 'GET',
    'callback' => 'get_frontpage',
  ));
});
// Add admin page & menu
add_action( 'admin_menu', 'my_admin_menu' );
?>