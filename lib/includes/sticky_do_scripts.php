<?php
    /**
     *
     * Enqueue custom scripts loaded on dedicated pages,
     * just where we need them.
     * 
     * @author Dorian Tudorache
     * @since 1.0
     *
     */
    // Avoid direct access to this piece of code
    if ( !function_exists( 'add_action' ) )
        exit;
    
    /**
     * 
     * Sticky Global Scripts
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    function sticky_global_js() {
        if ( ! is_admin() ) 
            return;

        wp_enqueue_script('jquery-ui-sortable');

        // Main JS file for Sticky Admin.
        wp_register_script( 'sticky-admin', STICKY_JS . 'sticky-admin' . StickyAdmin::$config['dev']['js_ext'] );
        
        // Define the cookies path so JS also knows about it when setting cookies.
        $cookies = array( 'path' => COOKIEPATH ); 

        if ( ! current_user_can( 'wp_sticky_stats_view' ) ) 
            StickyAdmin::$config['statistics'];

        $origmenu = Array();
        $origids = Array();

        foreach ( StickyAdmin::$original_admin_menu as $menu => $item ) { 
            array_push( $origmenu, $item['menu_slug'] );

            if ( !empty ($item['hookname'] ) )
                array_push( $origids, $item['hookname'] );
            else
                array_push( $origids, 'separator' );
        }

        $stickyObj = array(
            'cookie_path'        => $cookies,
            's_admin'            => ( current_user_can( 'edit_stickyadmin' ) ? true : false ),
            'wpab_close_message' => __( 'To reopen the WP Admin Bar, go to Sticky Options and enable it back!', '_sticky_' ),
            'word:filter'        => __( 'Filter', '_sticky_' ),
            's_reset'            => __( 'Reset', '_sticky_' ),
            'date_format'        => get_option( 'date_format' ),
            'time_format'        => get_option( 'time_format' ),
            'failSafe'           => StickyAdmin::$config['classes_string'],
            'wpab_controls'      => StickyAdmin::$config['adminbar']['controls'],
            's_nav_def_icons'    => StickyAdmin::$config['default_icons']['menu'],
            's_nav_original'     => $origmenu,
            's_nav_original_ids' => $origids,
            's_nav_position'     => StickyAdmin::$config['adminmenu']['position'],
            's_nav_controls'     => StickyAdmin::$config['adminmenu']['controls'],
            's_nav_resizable'    => StickyAdmin::$config['adminmenu']['resizable'],
            's_nav_grid'         => StickyAdmin::$config['adminmenu']['grid'],
            's_nav_sticky'       => StickyAdmin::$config['adminmenu']['sticky'],
            's_header_type'      => StickyAdmin::$config['header']['type'],
            's_header_icons'     => StickyAdmin::$config['header']['icons'],
            's_theme'            => StickyAdmin::$config['theme'],
            // 's_dash_image'       => StickyAdmin::sticky_theme_image( $sticky_theme ),
            's_dash_welcome'     => StickyAdmin::$config['content']['dash_heading'],
            // 's_dash_maps'        => StickyAdmin::$config['colors']['dash_maps'],
            's_stats'            => StickyAdmin::$config['statistics'],
            's_big_stats'        => StickyAdmin::$config['content']['dash_stats'],
            // 's_colors'           => StickyAdmin::$config['hl_colors'],
            // 's_colors2'          => StickyAdmin::$config['hl_colors2'],
        );

        // Dashboard custom.
        if ( $GLOBALS['pagenow'] == 'index.php' && StickyAdmin::$config['statistics'] != false && current_user_can( 'wp_sticky_stats_view' ) ) {
            wp_register_script( 'googleapi', '//www.google.com/jsapi' );
            
            $data_array             = 
            $country_data_array     = 
            $p4_array               = 
            $p2_array               = '';
            
            $browsers               = array();
            $translations           = array( "internet explorer" => "ie");
            $browser_names          = array( 
                "Unknown" => __( 'Unknown', '_sticky_' ),
                "IPhone"  => __( 'Safari', '_sticky_' )
            );
            $oss                    = array();
            $os_names               = array(
                "Unknown" => __('Unknown','_sticky_'),
                "Mac"     => __('OS X', '_sticky_'),
                "Windows" => __('Windows', '_sticky_'),
                "Linux"   => __('Linux', '_sticky_')
            );

            $phrases = array(
                'b_1'  => array(
                    '1' => __( 'Visitors Today', '_sticky_' ),
                    '2' => __( 'Pageviews Today', '_sticky_' )
                ),

                'b_2'  =>array( 
                    '1' => __( 'Popular Locations', '_sticky_' ),
                    '2' => __( 'Hot Traffic From', '_sticky_' ),
                ),

                'b_3'   => array(
                    '1' => __( 'Hot Traffic From', '_sticky_' ),
                ),
            );
            

            $p1_array = __( 'Desktop', '_sticky_' ) . ',' . StickyAdmin::$config['statistics']['desktop'] . ',' . __( 'Tablet', '_sticky_' ) . ',' . StickyAdmin::$config['statistics']['tablet'] . ',' . __( 'Mobile', '_sticky_' ) . ',' . StickyAdmin::$config['statistics']['mobile'];
            $p3_array = __( 'Search Engines', '_sticky_' ) . ',' . StickyAdmin::$config['statistics']['search_engines'] . ',' . __( 'Links', '_sticky_' ) . ',' . StickyAdmin::$config['statistics']['links'] . ',' . __( 'Direct', '_sticky_' ) . ',' . StickyAdmin::$config['statistics']['direct'];

            if ( is_array( StickyAdmin::$config['statistics']['os_data'] ) && ! empty( StickyAdmin::$config['statistics']['os_data'] ) ) {
                foreach (StickyAdmin::$config['statistics']['os_data'] as $os) {
                    $p2_array .= strtr(ucfirst($os['name']), $os_names) . ',' . round($os['hits'] / StickyAdmin::$config['statistics']['os_total_hits'][0] * 100) . ',';
                }
            }
            if ( is_array( StickyAdmin::$config['statistics']['browser_data'] ) && ! empty( StickyAdmin::$config['statistics']['browser_data'] ) ) {
                foreach (StickyAdmin::$config['statistics']['browser_data'] as $browser) {
                    $p4_array .= strtr(ucfirst($browser['name']), $browser_names) . ',' . round($browser['hits'] / StickyAdmin::$config['statistics']['browser_total_hits'][0] * 100) . ',' ;
                }
            }
            if ( is_array( StickyAdmin::$config['statistics']['visits'] ) && ! empty( StickyAdmin::$config['statistics']['visits'] ) ) {
                foreach ( array_reverse( StickyAdmin::$config['statistics']['visits'] ) as $day ) {
                    if ( $day[ 'hits' ] === null ) $day[ 'hits' ] = 0;
                    if ( $day[ 'pageviews' ] === null ) $day[ 'pageviews' ] = 0;
                    $s_date = explode('-', $day['date']);
                    $required_day = date("l", mktime(0, 0, 0, $s_date[1], $s_date[2], $s_date[0]));
                    $data_array .= substr( $required_day, 0, 1 ) . "," . $day['pageviews'] . "," . $day[ 'hits' ] . "," . $required_day . '+' . $day[ 'date' ] . ",";
                } 
            }
            if ( is_array( StickyAdmin::$config['statistics']['country_data'] ) && !empty( StickyAdmin::$config['statistics']['country_data'] ) ) {
                foreach ( StickyAdmin::$config['statistics']['country_data'] as $country ) {
                    if ( $country[ 'name' ] == '' ) $country[ 'name' ] = 'XX'; // Undefined countries, so gmap won't throw an error.
                        $country_data_array .= $country[ 'name' ]. ",".$country[ 'count' ] . ",";
                }
            }

            wp_enqueue_script( 'googleapi' );

            $dash_locals = array(
                'word:year'          => __( 'Year', '_sticky_' ),
                'word:pageviews'     => __( 'Pageviews', '_sticky_' ),
                'word:visitors'      => __( 'Visitors', '_sticky_' ),
                'word:country'       => __( 'Country', '_sticky_' ),
                'word:popularity'    => __( 'Popularity', '_sticky_' ),
                'word:devices'       => __( 'Devices', '_sticky_' ),
                'word:oss'           => __( 'Operating Systems', '_sticky_' ),
                'word:sources'       => __( 'Traffic Sources', '_sticky_' ),
                'word:browsers'      => __( 'Browsers', '_sticky_' ),
                'word:percent'       => __( 'Percentage', '_sticky_' ),
                'word:readmore'      => __( 'Keep Reading', '_sticky_' ),
                'word:morenews'      => __( 'More News', '_sticky_' ),
                'stats-array'        => $data_array,
                'country-array'      => $country_data_array,
                'p1'                 => $p1_array,
                'p2'                 => $p2_array,
                'p3'                 => $p3_array,
                'p4'                 => $p4_array
            );
            $stickyObj = array_merge( $stickyObj, $dash_locals ); 
        } 
        wp_enqueue_script( 'sticky-admin' );
        wp_localize_script( 'sticky-admin', 'stickyObj', $stickyObj );
        wp_enqueue_script( 'sticky-adminbar', STICKY_JS . 'sticky-adminbar' . StickyAdmin::$config['dev']['js_ext'] );
    }
    add_action( 'sticky_add_scripts', 'sticky_global_js', 2 );
    /**
     *
     * JavaScript for the Login Pages
     * 
     * @author Dorian Tudorache
     * @since 1.0
     *
     */
    function sticky_do_login_scripts( $theme ) {
        sticky_addScript( 'all', STICKY_ADMINBAR );
    }
    add_action( 'sticky_add_login_scripts', 'sticky_do_login_scripts' );
    /**
     *
     * Inline JavaScript output function
     * 
     * @author Dorian Tudorache
     * @since 1.0
     *
     */
    function sticky_inline_javascript() {
        echo '<script type="text/javascript">' . "\n";
        echo 'var $s_ui = jQuery.noConflict();' . "\n";
        echo '$s_ui(function() {' . "\n" . StickyAdmin::$config['dev']['custom_js'];
        echo apply_filters( 'sticky_custom_js', '');
        echo '});' . "\n";
        echo '</script>' . "\n";
    }
    add_action( 'sticky_head', 'sticky_inline_javascript' );

    /**
     *
     * Adminbar Javascript
     * 
     * @author Dorian Tudorache
     * @since 1.0
     *
     */
    function sticky_adminbar_js() {
        // wp_deregister_script( 'admin-bar' );

        if ( ! is_admin() && StickyAdmin::$config['adminbar']['preserve'] ) {
            $stickyObj = array(
                's_admin'            => ( current_user_can( 'edit_stickyadmin') ? true : false ),
                'wpab_controls'      => StickyAdmin::$config['adminbar']['controls']
            );
        }
        
        // This will ensure the scripts are loaded on back-end only
        wp_register_script( STICKY_ADMINBAR, STICKY_JS . STICKY_ADMINBAR . StickyAdmin::$config['dev']['js_ext'], array('jquery'), StickyAdmin::VERSION );
        
        if ( ! empty( $stickyObj ) )
            wp_localize_script( STICKY_ADMINBAR, 'stickyObj', $stickyObj );

        wp_enqueue_script( STICKY_ADMINBAR );
    }
    add_action( 'sticky_add_adminbar_scripts', 'sticky_adminbar_js' );

    /**
     *
     * Plugin Icons Function
     * 
     * @author Dorian Tudorache
     * @since 1.0
     *
     */
    function sticky_plugin_icons() {
        echo '<link rel="icon" href="' . StickyAdmin::$config['icons']['favicon'] . '" type="image/x-icon" sizes="16x16">'. "\n" ;
        echo '<link rel="apple-touch-icon-precomposed" href="' . StickyAdmin::$config['icons']['phone_57'] . '"  sizes="57x57">'. "\n";
        echo '<link rel="apple-touch-icon-precomposed" href="' . StickyAdmin::$config['icons']['tablet_72'] . '"  sizes="72x72">'. "\n";
        echo '<link rel="apple-touch-icon-precomposed" href="' . StickyAdmin::$config['icons']['phone_114'] . '"  sizes="114x114">'. "\n";
        echo '<link rel="apple-touch-icon-precomposed" href="' . StickyAdmin::$config['icons']['tablet_144'] . '"  sizes="144x144">'. "\n";
    }
    add_action( 'sticky_head', 'sticky_plugin_icons' );
?>