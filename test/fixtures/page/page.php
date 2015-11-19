<?php

	function url_get_param($url, $name, $default) {
	    parse_str(parse_url($url, PHP_URL_QUERY), $vars);
	    return isset($vars[$name]) ? $vars[$name] : $default;
	}


	$page = (string)url_get_param($_SERVER['REQUEST_URI'], 'page', 'not_found');
	$page_title = (string)url_get_param($_SERVER['REQUEST_URI'], 'title', 'not_found');
	$layout = (string)url_get_param($_SERVER['REQUEST_URI'], 'layout', 'default');

	$page_id = (int)url_get_param($_SERVER['REQUEST_URI'], 'page_id', 0);
	$page_gallery_id = (int)url_get_param($_SERVER['REQUEST_URI'], 'page_gallery_id', 0);

?>

<h1><?php echo $page_title ?></h1>