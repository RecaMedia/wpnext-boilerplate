<?php
// Add menu api endpoints
/**************** Provided by ****************
* Plugin Name: WP REST API Menus
* Plugin URI:  https://github.com/nekojira/wp-api-menus
* Description: Extends WP API with WordPress menu routes.
* Version: 1.3.1
* Author: Fulvio Notarstefano
*********************************************/
include_once ABSPATH . 'wp-content/themes/wp-next/includes/vendors/wp-api-menus/wp-api-menus-v1.php';
// WP API v2.
include_once ABSPATH . 'wp-content/themes/wp-next/includes/vendors/wp-api-menus/wp-api-menus-v2.php';
// Check if wp_rest_menus_init exist
if ( ! function_exists ( 'wp_rest_menus_init' ) ) {
  function wp_rest_menus_init() {
    if ( ! defined( 'JSON_API_VERSION' ) && ! in_array( 'json-rest-api/plugin.php', get_option( 'active_plugins' ) ) ) {
      $class = new WP_REST_Menus();
      add_filter( 'rest_api_init', array( $class, 'register_routes' ) );
    } else {
      $class = new WP_JSON_Menus();
      add_filter( 'json_endpoints', array( $class, 'register_routes' ) );
    }
  }
}
/********************************************/
?>