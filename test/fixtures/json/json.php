<?php header('Content-type: application/json'); ?>
<?php

	function url_get_param($url, $name, $default) {
	    parse_str(parse_url($url, PHP_URL_QUERY), $vars);
	    return isset($vars[$name]) ? $vars[$name] : $default;
	}

	$page = (string)url_get_param($_SERVER['REQUEST_URI'], 'page', 'not_found');
	
	$obj = array( 'success' => true, 'name' => $page );

	echo json_encode($obj);
	
?>