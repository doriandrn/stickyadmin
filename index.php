<?php
/*
Plugin Name: StickyAdmin
Plugin URI: https://wordpress.org/plugins/stickyadmin/
Description: StickyAdmin will revamp your WordPress' Admin User Interface. You can customize it by navigating to Settings -> StickyAdmin Settings.
Author: Dorian Tuorache
Version: 1.0.6
Author URI: https://profiles.wordpress.org/doriantudorache/
*/
if ( function_exists( 'add_action' ) ) {
	// Plugin Options panel
	require_once( "lib/sticky_options.php" );

	// PHP Unit for debugging
    // require_once 'PHPUnit/Autoload.php';

	// Load StickyAdmin
	require_once( "lib/stickyadmin.class.php" );

	// Statistics 
	require_once( "lib/classes/sticky-stats.php" );

	if( class_exists( 'StickyAdmin' ) ) {
		// Hook StickyAdmin
		register_activation_hook( __FILE__, array( 'StickyAdmin', 'activate' ) );
		register_deactivation_hook( __FILE__, array( 'StickyAdmin', 'deactivate' ) );

		// Init the plugin
		add_action( 'plugins_loaded', array( 'StickyAdmin', 'init' ), 1 );

		// Load statistics
		if ( class_exists( 'StickyStats' ) ) {
			add_action( 'plugins_loaded', array( 'StickyStats', 'init' ), 10);
		}
		
		// Ajax listener for statistics
		if ( !empty( $_POST[ 'action' ] ) && $_POST[ 'action' ] == 'sticky_stats_track' ) {
			add_action( 'wp_ajax_sticky_stats_track', array( 'StickyStats', 'sticky_stats_track' ) ); // user logged in
			add_action( 'wp_ajax_nopriv_sticky_stats_track', array( 'StickyStats', 'sticky_stats_track' ) ); // user not logged in
		}
	}
}