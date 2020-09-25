<?php
function process($index, $name, $desc, $size, $type, $value, $options) {

  $slug = implode("_", explode(" ", strtolower($name)));

  switch($size) {
    case "1/4":
      $column = "col-sm-3";
    break;
    case "1/2":
      $column = "col-sm-6";
    break;
    case "3/4":
      $column = "col-sm-9";
    break;
    case "1":
      $column = "col-sm-12";
    break;
  }

  switch($type) {
    case "group":
    case "repeater":
      $options['fields'] = build_field_objects($options['fields']);
    break;
  }

  return array(
    "fieldtype_name" => $name,
    "form" => array(
      $slug => array(
        "description" => $desc,
        "value" => $value,
        "input" => $type,
        "options" => $options
      )
    ),
    "title" => $slug,
    "meta" => array(
      "ui_index" => $index,
      "ui_size" => $column
    )
  );
}

function build_field_objects($fields) {

  $processed_fields = array();

  if (is_array($fields) || is_object($fields)) {
    foreach($fields as $index => $field) {
      $processed_fields[] = process(
        $index,
        $field['name'],
        $field['description'],
        $field['size'],
        $field['type'],
        $field['value'],
        isset($field['options']) ? $field['options'] : null
      );
    }
  }

  return $processed_fields;
}
?>