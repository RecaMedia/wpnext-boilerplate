<?php
class myCustomFields {  
  /**
  * @var  array  $postTypes  An array of public custom post types, plus the standard "post" and "page" - add the custom types you want to include here
  */
  var $postTypes = array( "page", "post" );

  var $component;
  var $componentTitle;
  var $scope;
  var $customFields;
  /**
  * PHP 4 Compatible Constructor
  */
  function myCustomFields() { $this->__construct(); }
  /**
  * PHP 5 Constructor
  */
  function __construct($componentName, $scope, $customFields) {
    $this->component = $this->lowercase_underscore($componentName);
    $this->componentTitle = $componentName;
    $this->scope = $scope;
    $this->prefix = $this->component . "_";
    $this->customFields = $customFields;
    $this->init();
  }

  /********************** START: Util functions **********************/
  function custom_field_get($object, $field_name, $request){
    return json_decode(get_post_meta($object['id'], $field_name, true)); 
  }
  function custom_field_update($value, $object, $field_name){
    return update_post_meta($object['id'], $field_name, json_encode($value)); 
  }
  function lowercase_underscore($str) {
    return join("_", explode(" ", strtolower($str)));
  }
  /********************** END: Util functions **********************/

  /********************** START: Add Field to Post Type **********************/
  function addCustomField($args) {
    register_rest_field(array( "post", "page" ), $this->component, 
      array(
        'get_callback' => array( &$this, 'custom_field_get' ),
        'update_callback' => array( &$this, 'custom_field_update' ),
        'schema' => array(
          'description' => $this->componentTitle . " component.",
          'type' => 'object',
          'context' => array('view', 'edit')
        )
      )
    );
  }
  /********************** END: Add Field to Post Type **********************/
  
  /**
  * Remove the default Custom Fields meta box
  */
  function removeDefaultCustomFields( $type, $context, $post ) {
    foreach ( array( 'normal', 'advanced', 'side' ) as $context ) {
      foreach ( $this->postTypes as $postType ) {
        remove_meta_box( 'postcustom', $postType, $context );
      }
    }
  }
  /**
  * Create the new Custom Fields meta box
  */
  function createCustomFields() {
    if ( function_exists( 'add_meta_box' ) ) {
      foreach ( $this->postTypes as $postType ) {
        add_meta_box( $this->component, $this->componentTitle, array( &$this, 'displayCustomFields' ), $postType, 'normal', 'high' );
      }
    }
  }
  
  function buildCustomFields($fields, $customFieldName, $customFieldData) {
    echo '<div class="'.$customFieldData[ 'grid' ].'">';
    echo '<div class="form-field form-required">';
    switch ( $customFieldData[ 'field_type' ] ) {
      case "checkbox": {
        // Checkbox
        echo '<label for="' . $this->prefix . $customFieldName .'" style="display:inline;">';
        echo '<input style="margin-right:10px" type="checkbox" name="' . $this->prefix . $customFieldName . '" id="' . $this->prefix . $customFieldName . '" value="true"';
        if ($fields->$customFieldName->value === true)
          echo ' checked="checked"';
        echo ' style="width: auto;" />';
        echo '<b>' . $customFieldData[ 'title' ] . '</b></label>';
        if ( $customFieldData[ 'description' ] ) echo '<p>' . $customFieldData[ 'description' ] . '</p>';
        break;
      }
      case "textarea":
        // Text area
        echo '<label for="' . $this->prefix . $customFieldName .'"><b>' . $customFieldData[ 'title' ] . '</b></label>';
        if ( $customFieldData[ 'description' ] ) echo '<p>' . $customFieldData[ 'description' ] . '</p>';
        echo '<textarea style="width:100%;" name="' . $this->prefix . $customFieldName . '" id="' . $this->prefix . $customFieldName . '" rows="3">' . htmlspecialchars($fields->$customFieldName->value) . '</textarea>';
        break;
      case "wysiwyg": {
        echo '<label for="' . $this->prefix . $customFieldName .'"><b>' . $customFieldData[ 'title' ] . '</b></label>';
        if ( $customFieldData[ 'description' ] ) echo '<p>' . $customFieldData[ 'description' ] . '</p>';
        wp_editor($fields->$customFieldName->value, $this->prefix . $customFieldName, array('textarea_rows'=>6, 'editor_class'=>'mytext_class')); 
        break;
      }
      default: {
        // Plain text field
        echo '<label for="' . $this->prefix . $customFieldName .'"><b>' . $customFieldData[ 'title' ] . '</b></label>';
        echo '<input type="text" name="' . $this->prefix . $customFieldName . '" id="' . $this->prefix . $customFieldName . '" value="' . htmlspecialchars($fields->$customFieldName->value) . '" />';
        if ( $customFieldData[ 'description' ] ) echo '<p>' . $customFieldData[ 'description' ] . '</p>';
        break;
      }
    }
    echo '</div></div>';
  }

  function displayCustomFields() {
    global $post;
    ?>
      <div class="form-wrap">
        <div class="row" style="display: flex;align-items: stretch;flex-direction: row;flex-wrap: wrap;">
          <?php
          wp_nonce_field( $this->component, $this->component . '_wpnonce', false, true );
          // Check component scope
          $output = false;
          foreach ( $this->scope as $scopeItem ) {
            switch ( $scopeItem ) {
              default: {
                if ( $post->post_type == $scopeItem )
                  $output = true;
                break;
              }
            }
            if ( $output ) break;
          }
          // Get field values
          $fields = json_decode(get_post_meta( $post->ID, $this->component, true));
          // Loop through fields to print
          foreach ( $this->customFields as $customFieldName => $customFieldData ) {
            // Check capability
            if ( !current_user_can( $customFieldData['capability'], $post->ID ) )
              $output = false;
              // Output if allowed
              if ( $output ) {
                // if (is_array($customFieldData)) {
                //   $subComponents = $fields->$customFieldName
                //   foreach ( $subComponents as $customFieldName => $customFieldData ) {

                //   }
                // } else {
                  $this->buildCustomFields($fields, $customFieldName, $customFieldData);
                // }
              }
            }
          ?>
        </div>
      </div>
    <?php
  }
  
  /**
  * Save the new Custom Fields values
  */
  function saveCustomFields( $post_id, $post ) {
    if ( !isset( $_POST[ $this->component . '_wpnonce' ] ) || !wp_verify_nonce( $_POST[ $this->component . '_wpnonce' ], $this->component ) )
      return;
    if ( !current_user_can( 'edit_post', $post_id ) )
      return;
    if ( ! in_array( $post->post_type, $this->postTypes ) )
      return;

    $customFields = $this->customFields;
    $update_found = false;
    foreach ( $this->customFields as $customFieldName => $customFieldData ) {
      if ( current_user_can( $customFieldData['capability'], $post_id ) ) {
        if ( isset( $_POST[ $this->prefix . $customFieldName ] ) && trim( $_POST[ $this->prefix . $customFieldName ] ) ) {
          $update_found = true;
          $customFields[$customFieldName]['value'] = $_POST[ $this->prefix . $customFieldName ];
          // Auto-paragraphs for any WYSIWYG
          if ( $customFieldData['field_type'] == "wysiwyg" )
            $customFields[$customFieldName]['value'] = wpautop( $_POST[ $this->prefix . $customFieldName ] );
          if ( $customFieldData['field_type']  == "checkbox" )
            $customFields[$customFieldName]['value'] = ($_POST[ $this->prefix . $customFieldName ] === "true" ? true : false);
        }
      }
    }

    if ($update_found) {
      update_post_meta( $post_id, $this->component, json_encode($customFields));
    } else {
      delete_post_meta( $post_id, $this->component);
    }
  }

  function init() {
    add_action( 'admin_menu', array( &$this, 'createCustomFields' ) );
    add_action( 'save_post', array( &$this, 'saveCustomFields' ), 1, 2 );
    add_action( 'do_meta_boxes', array( &$this, 'removeDefaultCustomFields' ), 10, 3 );
    add_action( 'rest_api_init', array( &$this, 'addCustomField' ));
  }
}
?>