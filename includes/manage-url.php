<?php
function update_urls($home_url) {
  $server_info_file = dirname(dirname(__FILE__)).'/configs/server-info.json';
  $server_info = json_decode(file_get_contents($server_info_file));
  $server_info->WPURL = network_site_url();
  $server_info->WPJson = network_site_url() . "/wp-json/";
  $server_info->homeURL = $home_url;

  $file = fopen($server_info_file, "w+");
  fwrite($file, json_encode($server_info));
  fclose($file);

  get_home_url($home_url);
}
?>