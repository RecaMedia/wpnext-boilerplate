<?php

/************************************************
****** All available fields to choose from ******
LIST:
-------------
checkbox - [Value: Boolean]
colorpicker - [Value: String, EX: rgba(0,0,0,0)]
date - [Value: String] [Options: "mode" => "date","time","both"]
editor - [Value: String] [Options: "mode" => "slim","standard","full"]
group - [Value: String] [Options: "fields" => array([List of other fields])]
text - [Value: String]
radio - [Value: String] [Options: "selections" => array(array("name" => "H1", "value" => "h1"))]
select - [Value: String] [Options: "selections" => array(array("name" => "H1", "value" => "h1"))]
textarea - [Value: String]
file - [Value: String]
code - [Value: String]
hidden - [Value: String, array, object]

EXAMPLE:
-------------
array(
  "name"         => "Block Text",       <- Name and slug Ex: "block_text"
  "description"  => "A block of text.", <- Description
  "size"         => "1/2",              <- Field size
  "type"         => "textarea",         <- Field type
  "value"        => "",                 <- Default value
  "options"      => array()             <- Not required
)
************************************************/



$fields = array(
  array(
    "name"         => "Hero Content",
    "description"  => "Text content within hero.",
    "size"         => "1/2",
    "type"         => "group",
    "value"        => "",
    "options"      => array(
      "fields"     => array(
        array(
          "name"         => "Hero Title",
          "description"  => "Title within hero.",
          "size"         => "1",
          "type"         => "text",
          "value"        => ""
        ),
        array(
          "name"         => "Hero Caption",
          "description"  => "Caption below title.",
          "size"         => "1",
          "type"         => "text",
          "value"        => ""
        )
      )
    )
  ),
  array(
    "name"         => "Background Image",
    "description"  => "Select a hero image.",
    "size"         => "1/2",
    "type"         => "file",
    "value"        => ""
  )
);
?>