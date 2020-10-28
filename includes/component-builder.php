<?php
require_once('utils.php');

class componentBuilder {  
  /**
  * @var  array  $postTypes  An array of public custom post types, plus the standard "post" and "page" - add the custom types you want to include here
  */
  var $postTypes = array( "page", "post" );

  // PHP 4 Compatible Constructor
  function componentBuilder() { $this->__construct(); }

  // PHP 5 Constructor
  function __construct() {
    $this->loaded_components = array();
    $this->init();
  }

  function custom_field_get($object, $field_name, $request){
    return json_decode(urldecode(get_post_meta($object['id'], $field_name, true)));
  }

  function custom_field_update($value, $object, $field_name){
    return update_post_meta($object['id'], $field_name, urlencode(json_encode($value))); 
  }

  function get_components() {
    $components_dir = dirname(dirname(__FILE__)).'/components';
    $component_list = scandir($components_dir);
    // Loop through component directory
    foreach ( $component_list as $component ) {
      if ($component != '.' && $component != '..') {
        // Get component files
        require_once($components_dir.'/'.$component.'/fields.php');
        $component_meta = parse_ini_file($components_dir.'/'.$component.'/info.ini');
        // Process fields
        $component_meta['fields'] = build_field_objects($fields);
        // Adding component
        $this->loaded_components[] = $component_meta;
      }
    }
  }

  // Add Field to Post Type
  function add_custom_field($args) {
    register_rest_field( array("post", "page"), 'wpnext', 
      array(
        'get_callback' => array( &$this, 'custom_field_get' ),
        'update_callback' => array( &$this, 'custom_field_update' ),
        'schema' => array(
          'description' => "Components and listed values.",
          'type' => 'object',
          'context' => array('view', 'edit')
        )
      )
    );
  }
  
  // Remove the default Custom Fields meta box
  function remove_default_custom_fields( $type, $context, $post ) {
    foreach ( array( 'normal', 'advanced', 'side' ) as $context ) {
      foreach ( $this->postTypes as $postType ) {
        remove_meta_box( 'postcustom', $postType, $context );
      }
    }
  }

  //Create the new Custom Fields meta box
  function create_custom_fields() {
    // Get all components to be listed
    $this->get_components();
    // Add components meta box
    if ( function_exists( 'add_meta_box' ) ) {
      foreach ( $this->postTypes as $postType ) {
        add_meta_box( 'wpnext', 'WPNext Builder', array( &$this, 'display_custom_fields' ), $postType, 'normal', 'high' );
      }
    }
  }

  function display_custom_fields() {
    global $post;
    wp_nonce_field('wpnext', 'wpnext_wpnonce', false, true);
    $WPNData = get_post_meta($post->ID, 'wpnext', true);
    ?>
    <link rel="stylesheet" href="https://unpkg.com/ionicons@4.5.0/dist/css/ionicons.min.css"/>
    <link rel="stylesheet" href="<?php echo get_template_directory_uri().'/admin/admin-min.css'; ?>"/>
    <div id="AdminWrapper" class="WPN-wrapper">
			<input id="WPNComponents" name="wpn_components" type="hidden" value="<?php echo urlencode(json_encode($this->loaded_components));?>"/>
			<input id="WPNPostData" name="wpn_post_data" type="hidden" value="<?php echo $WPNData;?>"/>
			<div id="WPNextUI"></div>
			<script src="<?php echo get_template_directory_uri().'/admin/admin-min.js'; ?>"></script>
		</div>
    <?php
  }
  
  // Save the new Custom Fields values
  function save_custom_fields( $post_id, $post ) {
    if ( !isset($_POST['wpnext_wpnonce']) || !wp_verify_nonce($_POST['wpnext_wpnonce'], 'wpnext') )
      return;
    if ( !current_user_can( 'edit_post', $post_id ) )
      return;

    if ( isset($_POST['wpn_post_data']) ) {
      update_post_meta( $post_id, 'wpnext', $_POST['wpn_post_data']);
    } else {
      delete_post_meta( $post_id, 'wpnext');
    }
  }

  function init() {
    add_action( 'admin_menu', array( &$this, 'create_custom_fields' ) );
    add_action( 'save_post', array( &$this, 'save_custom_fields' ), 1, 2 );
    add_action( 'do_meta_boxes', array( &$this, 'remove_default_custom_fields' ), 10, 3 );
    add_action( 'rest_api_init', array( &$this, 'add_custom_field' ));
  }
}
?>