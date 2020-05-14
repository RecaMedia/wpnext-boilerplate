<?php
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

// Register new routes
add_action( 'rest_api_init', function () {

  // Front Page route -> /wp-json/wpn/v1/frontpage/
  register_rest_route('wpn/v1', '/frontpage', array(
    'methods'  => 'GET',
    'callback' => 'get_frontpage',
  ));

  // Modify posts route to include complete author info
  register_rest_field(array('page','post'), 'author', array(
    'get_callback' => function($post_obj) {
      // Create request from users endpoint by id.
      $request  = new \WP_REST_Request( 'GET', '/wp/v2/users/' . $post_obj['author']);
      // Parse request to get data.
      $response = rest_do_request($request);
      // Handle if error.
      if ($response->is_error()) {
        return array('error' => 'Something broke with author api mod.');
      }
      // Return data
      return $response->get_data();
    },
    'update_callback' => function($author, $post_obj) {
      return $author;
    },
    'schema' => array(
      'description' => __('Complete author information.'),
      'type' => 'object'
    ),
  ));

  // Modify posts route to include complete featured media
  register_rest_field(array('page','post'), 'featured_media', array(
    'get_callback' => function($post_obj) {
      // Create request from users endpoint by id.
      $request  = new \WP_REST_Request( 'GET', '/wp/v2/media/' . $post_obj['featured_media']);
      // Parse request to get data.
      $response = rest_do_request($request);
      // Handle if error.
      if ($response->is_error()) {
        return array('error' => 'Something broke with getting media object.');
      }
      // Return data
      return $response->get_data();
    },
    'update_callback' => function($media_obj, $post_obj) {
      return $media_obj;
    },
    'schema' => array(
      'description' => __('Complete media information.'),
      'type' => 'object'
    ),
  ));

  // Modify posts route to include complete category info
  register_rest_field(array('page','post'), 'categories', array(
    'get_callback' => function($post_obj) {
      $categories = [];
      foreach ($post_obj['categories'] as $index => $category_id) {
        // Create request from users endpoint by id.
        $request  = new \WP_REST_Request( 'GET', '/wp/v2/categories/' . $category_id);
        // Parse request to get data.
        $response = rest_do_request($request);
        // Handle if error.
        if ($response->is_error()) {
          $categories['error'] = 'Something broke with getting category id ' . $category_id;
        } else {
          $category_obj = $response->get_data();
          $categories[$category_obj['slug']] = $category_obj;
        }
      }
      return (object) $categories;
    },
    'update_callback' => function($categories, $post_obj) {
      return $categories;
    },
    'schema' => array(
      'description' => __('Complete category information.'),
      'type' => 'object'
    ),
  ));

  // Modify posts route to include complete tag info
  register_rest_field(array('page','post'), 'tags', array(
    'get_callback' => function($post_obj) {
      $categories = [];
      foreach ($post_obj['tags'] as $index => $tag_id) {
        // Create request from users endpoint by id.
        $request  = new \WP_REST_Request( 'GET', '/wp/v2/tags/' . $tag_id);
        // Parse request to get data.
        $response = rest_do_request($request);
        // Handle if error.
        if ($response->is_error()) {
          $categories['error'] = 'Something broke with getting tag id ' . $tag_id;
        } else {
          $tag_obj = $response->get_data();
          $categories[$tag_obj['slug']] = $tag_obj;
        }
      }
      return (object) $categories;
    },
    'update_callback' => function($categories, $post_obj) {
      return $categories;
    },
    'schema' => array(
      'description' => __('Complete tag information.'),
      'type' => 'object'
    ),
  ));
});
?>