<?php
// Avoid direct access to this piece of code
if ( !function_exists( 'add_action' ) )
    exit;

    /**
     *
     * CSS enqueues for specific pages
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    function sticky_do_styles( $theme ) {
        global $wp_styles;

        if ( ! is_object( $wp_styles ) ) return;

        if ( ! ( $wp_styles instanceof WP_Styles ) ) {
            $wp_styles = new WP_Styles();
        }

        _wp_scripts_maybe_doing_it_wrong( __FUNCTION__ );

        // Dregister all CSSs loaded by WordPress
        $to_deregister = array( 
            "colors",
            "wp-admin",
            "login",
            "install",
            "mediaelement",
            // "wp-color-picker",
            "customize-controls",
            "customize-widgets",
            "customize-nav-menus",
            "customize-preview",
            "press-this",
            "ie",
            "buttons",
            "dashicons",
            // "open-sans",
            "admin-bar",
            "wp-auth-check",
            "editor-buttons",
            "media-views",
            "wp-pointer",
            "imgareaselect",
            "wp-jquery-ui-dialog",
            "wp-mediaelement",
            "thickbox",
            "media",
            "farbtastic",
            "jcrop",
            "colors-fresh",
            "bp-admin-bar"
        );

        // BuddyPress 2.4.3
        $to_dequeue = array (
            'colors',
            'admin-bar',
            'ie',
            'wp-auth-check',
            'thickbox'
        );

        foreach ( $to_deregister as $handle ) {
            $wp_styles->remove( $handle );
        }

        foreach ( $to_dequeue as $handle ) {
            $wp_styles->dequeue( $handle );
        }

        unset ( $to_deregister, $to_dequeue );

        if ( StickyAdmin::$config['dev']['cache_css'] ) {
            // Clone the existing object as other styles may be also enqueued by themes and plugins, direct manipulation of $wp_styles is not a viable solution.
            $sticky_styles = wp_clone( $wp_styles );
            
            $suffix = '';

            $sticky_load_styles = array (
                'fonts'     => array(
                    'name'  => STICKY_FONTS
                ),
                'preload'   => array(
                    'name'  => STICKY_PRELOAD
                ),
                'admin'     => array(
                    'name'  => 'sticky-admin'
                ),
                
                'adminbar'  => array(
                    'name'  => 'sticky-adminbar'
                ),
                'adminmenu' => array( 
                    'name'  => 'sticky-adminmenu'
                ),
                'admin-responsive' => array (
                    'name'  => 'sticky-admin-responsive'
                ),
                'searchbox' => array(
                    'name'  => STICKY_SEARCHBOX
                ),
                'forms'     => array(
                    'name'  => STICKY_FORMS
                ),
                'selects'   => array(
                    'name'  => STICKY_SELECTS
                ),  
                'labelauty' => array(
                    'name'  => STICKY_LABELAUTY
                ),
                'media'     => array(
                    'name'  => STICKY_MEDIA
                ),
                'toastr'    => array(
                    'name'  => 'sticky-notifications'
                ),
                'tooltips'  => array(
                    'name'  => STICKY_TOOLTIPS
                ),
                'scrollbars'=> array(
                    'name'  => 'jquery.mCustomScrollbar'
                )
            );

            // Generate the minified admin.css file on Sticky first run
            $blogid = get_current_blog_id();
            if ( ! file_exists( STICKY_CSS_URI . 'sticky-minified.css' ) || sticky_has_changed( $blogid ) ) {
                $content = '';

                ob_start();

                foreach( $sticky_load_styles as $style=>$src ) {
                    // $wp_styles->add( 'sticky-'.$style, STICKY_CSS . $src['name'] . $suffix . '.css', $src['deps'], StickyAdmin::VERSION, 'all' );
                    // $wp_styles->enqueue( 'sticky-'.$style );

                    $sticky_styles->to_do = array_diff( $sticky_styles->to_do, array( $style ) );
                    $sticky_styles->done[] = $style;

                    $content .= minify_css( file_get_contents( STICKY_CSS . $src['name'] . $suffix . '.css' ) ) . "\n";
                }
                file_put_contents( STICKY_CACHE_URI . 'sticky-minified-' . $blogid . '.css', $content, LOCK_EX );
            }
            delete_transient( $blogid . '_sticky-changes' );

            wp_enqueue_style( 'sticky-admin', STICKY_CACHE . 'sticky-minified-' . $blogid . '.css', false, StickyAdmin::VERSION );
            wp_enqueue_style( 'sticky-dynamic', admin_url( 'admin-ajax.php') . '?action=dynamic_css&_wpnonce=' . wp_create_nonce( 'sticky-nonce' ), false,  StickyAdmin::VERSION );

            unset( $blogid );

        } else if ( is_admin() ){
            // NOT CACHING CSS
            wp_register_style( 'sticky-fonts', STICKY_CSS . STICKY_FONTS . '.css', false, StickyAdmin::VERSION );
            wp_register_style( 'sticky-admin', STICKY_CSS . 'sticky-admin.css', false, StickyAdmin::VERSION );
            wp_register_style( 'sticky-adminbar', STICKY_CSS . STICKY_ADMINBAR . '.css', false, StickyAdmin::VERSION );
            wp_register_style( 'sticky-adminmenu', STICKY_CSS . 'sticky-adminmenu.css', false, StickyAdmin::VERSION );
            wp_register_style( 'sticky-dynamic', admin_url( 'admin-ajax.php') . '?action=dynamic_css&_wpnonce=' . wp_create_nonce( 'sticky-nonce' ), false,  StickyAdmin::VERSION );
            wp_register_style( 'sticky-toastr', STICKY_CSS . 'sticky-notifications.css', false, StickyAdmin::VERSION );
            
            wp_register_style( 'pace_theme', STICKY_CSS . 'pace.js/' . StickyAdmin::$config['extensions']['pace_color']. '/pace-theme-' . StickyAdmin::$config['extensions']['pace_theme'] . '.css' );
            wp_register_style( 'mCustomScrollbar', STICKY_CSS . 'jquery.mCustomScrollbar.css' );
            wp_register_style( 'qTip', STICKY_CSS . STICKY_TOOLTIPS . '.css' );
            wp_enqueue_style( 'sticky-fonts' );
            wp_enqueue_style( 'sticky-admin' );
            wp_enqueue_style( 'sticky-adminbar' );
            wp_enqueue_style( 'sticky-adminmenu' );
            wp_enqueue_style( 'sticky-dynamic' );
            wp_enqueue_style( 'sticky-toastr' );
            
            // Additional CSS - Extensions
            wp_enqueue_style( 'pace_theme' );
            wp_enqueue_style( 'mCustomScrollbar' );
            wp_enqueue_style( 'qTip' );

            if ( isset( $_GET[ 'page' ] ) && substr( $_GET[ 'page' ], 0, 3 ) === 'bp-' ) {
                wp_enqueue_style( 'sticky-widefat', STICKY_CSS . STICKY_WIDEFAT . '.css', false, StickyAdmin::VERSION );
            }

            // Searhbox
            sticky_addStyle( array( 'Posts', 'Tags', 'Media', 'Themes', 'ThemeInstall', 'Plugins', 'PluginInstall', 'Users', 'Comments', 'Sites' ), STICKY_SEARCHBOX, 1, 40 );
            // Media 
            sticky_addStyle( 'all', STICKY_MEDIA, 1 );
            // Preloader 
            sticky_addStyle( 'all', STICKY_PRELOAD, 0 );
            // Forms
            sticky_addStyle( 'all', STICKY_FORMS, 1 );
            // Labelauty jQuery plugin
            sticky_addStyle( 'all', STICKY_LABELAUTY );
            // SelectOrDie jQuery plugin
            sticky_addStyle( 'all', STICKY_SELECTS );
            sticky_addStyle( 'all', 'sticky-admin-responsive', 0, 11 );
        }
        
        // Themes
        sticky_addStyle( array( 'Themes', 'ThemeInstall' ), STICKY_THEMES );
        // Widefat
        sticky_addStyle( array( 'Posts', 'Tags', 'Plugins', 'PluginInstall', 'Comments', 'Users', 'Import', 'UpdateCore', 'Sites', 'MySites', 'BPActivity', 'Media' ), STICKY_WIDEFAT, 1, 40 );
        
        if ( is_network_admin() ) {
            sticky_addStyle( array( 'Themes' ), STICKY_WIDEFAT );
        }
        sticky_addStyle( array( 'PressThis'), STICKY_PRESSTHIS );
        // Editor
        sticky_addStyle( array( 'Post', 'PostNew'), STICKY_EDITOR );
        // Dashboard
        sticky_addStyle( 'Dashboard', STICKY_DASHBOARD, 1 );     
        // About Pages
        sticky_addStyle( 'About', STICKY_ABOUT, 1 );
        // Navigation Menus
        sticky_addStyle( 'Menus', STICKY_MENUS, 1 );
        // Customizer
        sticky_addStyle( 'Customize', STICKY_CUSTOMIZER );
        // Widgets 
        sticky_addStyle( 'Widgets', STICKY_WIDGETS, 1 );

        
        if ( $GLOBALS['pagenow'] == 'nav-menus.php' && isset( $_GET['actions'] ) && $_GET[ 'action' ] == 'locations' ) {
            sticky_addStyle( 'Menus', STICKY_WIDEFAT );
        }
    }
    add_action( 'sticky_add_styles', 'sticky_do_styles', 1 );
    function sticky_bp_styles( $theme ) {
        wp_enqueue_style( 'sticky-widefat' );
        
    }
    add_action( 'sticky_buddypress_enqueues', 'sticky_bp_styles' );
     
     /**
     * 
     * Sticky Global CSS
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    function sticky_global_styles() {
        // global $grab_data;
        // PACE.js CSS files based on settings.
        // $pace_color = $grab_data['page_load_color'] ? : 'orange';
        // $pace_theme = $grab_data['page_load'] ? : 'minimal';
        // Sticky Admin GLOBAL Custom CSS
        // wp_register_style( 'sticky-fonts', STICKY_CSS . STICKY_FONTS . '.css', false, StickyAdmin::VERSION );
        // wp_register_style( 'sticky-admin', STICKY_CSS . 'sticky-admin.css', false, StickyAdmin::VERSION );
        // wp_register_style( 'sticky-adminmenu', STICKY_CSS . 'sticky-adminmenu.css', false, StickyAdmin::VERSION );
        // wp_register_style( 'sticky-dynamic', admin_url( 'admin-ajax.php') . '?action=dynamic_css&_wpnonce=' . wp_create_nonce( 'sticky-nonce' ), false,  StickyAdmin::VERSION );
        // wp_register_style( 'sticky-toastr', STICKY_CSS . 'sticky-notifications.css', false, StickyAdmin::VERSION );
        // wp_register_style( 'sticky-css', STICKY_CSS . 'sticky-' . get_current_blog_id() . '.css', false, StickyAdmin::VERSION );
        // wp_register_style( 'pace_theme', STICKY_CSS . 'pace.js/' . $pace_color. '/pace-theme-' . $pace_theme . '.css' );
        // wp_register_style( 'mCustomScrollbar', STICKY_CSS . 'jquery.mCustomScrollbar.css' );
        // wp_register_style( 'qTip', STICKY_CSS . STICKY_TOOLTIPS . '.css' );
        // wp_enqueue_style( 'sticky-fonts' );
        // wp_enqueue_style( 'sticky-admin' );
        // wp_enqueue_style( 'sticky-adminmenu' );
        // wp_enqueue_style( 'sticky-dynamic' );
        // wp_enqueue_style( 'sticky-toastr' );
        // wp_enqueue_style( 'sticky-css' );
        
        // Additional CSS - Extensions
        // wp_enqueue_style( 'pace_theme' );
        // wp_enqueue_style( 'mCustomScrollbar' );
        // wp_enqueue_style( 'qTip' );
        // if ( isset( $_GET[ 'page' ] ) && substr( $_GET[ 'page' ], 0, 3 ) === 'bp-' ) {
            // wp_enqueue_style( 'sticky-widefat', STICKY_CSS . STICKY_WIDEFAT . '.css', false, StickyAdmin::VERSION );
        // }
    }
    add_action( 'sticky_add_styles',  'sticky_global_styles' );
    
    /**
    * 
    * Adminbar CSS styles
    *
    * @since 1.0
    * @author Dorian Tudorache
    *
    */
    function sticky_adminbar_css() {
        if ( is_admin() || ! StickyAdmin::$config['adminbar']['preserve'] ) return;

        // Remove the styles loaded by WordPress.
        wp_dequeue_style( 'admin-bar' );
        wp_deregister_style( 'admin-bar' );
        
        // Add Sticky's ones
        wp_register_style( STICKY_FONTS, STICKY_CSS . STICKY_FONTS . '.css', 0, StickyAdmin::VERSION );
        wp_register_style( STICKY_ADMINBAR, STICKY_CSS . STICKY_ADMINBAR . '.css', 0, StickyAdmin::VERSION );
        wp_register_style( 'sticky-dynamic', admin_url( 'admin-ajax.php') . '?action=dynamic_css&_wpnonce=' . wp_create_nonce( 'sticky-nonce' ), false,  StickyAdmin::VERSION );
        wp_register_style( STICKY_TOOLTIPS, STICKY_CSS . STICKY_TOOLTIPS . '.css', 0, StickyAdmin::VERSION );
    
        wp_enqueue_style ( STICKY_FONTS );
        wp_enqueue_style ( STICKY_ADMINBAR );
        wp_enqueue_style ( 'sticky-dynamic' );
        wp_enqueue_style ( STICKY_TOOLTIPS );
        
    }
    add_action( 'sticky_adminbar_enqueue', 'sticky_adminbar_css' );

     /**
     * 
     * Output the custom generated CSS in the header.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    function sticky_custom_css() {
        // Gets the user inputted CSS from the options panel.        
        echo '<style type="text/css">' . "\n" . minify_css( StickyAdmin::$config['dev']['custom_css'] );
        echo apply_filters( 'sticky_custom_css', '');
        echo '</style>' . "\n";
    }
    add_action( 'sticky_add_styles', 'sticky_custom_css' );
    
    /**
     *
     * Login Page CSS enqueue
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    function sticky_do_login_styles( $theme ) {
        sticky_addStyle( 'Login', STICKY_FONTS );
        sticky_addStyle( 'Login', STICKY_LABELAUTY );
        sticky_addStyle( 'Login', STICKY_LOGIN );
    }
    add_action( 'sticky_login_css_enqueues', 'sticky_do_login_styles', 1 );

    /**
     *
     * Generated CSS to be used on the frontend only
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    function sticky_frontend_css() {
        return minify_css('
            #wpadminbar,
            #wpadminbar #sticky_toggle button {
                background:'. StickyAdmin::$config['colors']['adminbar'] .'!important;
            }
            #wpadminbar .menupop .ab-sub-wrapper {
                background:'. StickyAdmin::$config['colors']['adminbar_submenu'] .';
            }
            #wpadminbar #wp-admin-bar-user-actions,
            #wpadminbar .menupop .ab-sub-wrapper .menupop .ab-sub-wrapper,
            #wpadminbar .quicklinks > ul > li .ab-sub-wrapper ul li.sticky-menu-head {
                background:'. StickyAdmin::$config['colors']['adminbar_submenu_top'] .';
            }
            #wp-admin-bar-bp-notifications .count, #wp-admin-bar-comments .ab-label, #wp-admin-bar-updates .ab-label {
                border: 2px solid '. StickyAdmin::$config['colors']['adminbar'] .';
            }
            #wpadminbar ul.ab-top-secondary ul.ab-submenu .menupop .ab-sub-wrapper:after {
                border-left-color:'. StickyAdmin::$config['colors']['adminbar_submenu_top'] .';
            }
            #wpadminbar .menupop .ab-sub-wrapper:before {
                border-bottom-color:'. StickyAdmin::$config['colors']['adminbar_submenu_top'] .'!important;
            }
            #wpadminbar .quicklinks > ul > li .ab-sub-wrapper ul li.sticky-menu-head:after {
                border-top-color:'. StickyAdmin::$config['colors']['adminbar_submenu_top'] .'!important;
            }
            .sticky_wpab.qtip,
            .sticky_wpab.qtip-default {
                background: rgba(' . hex2rgb( StickyAdmin::$config['colors']['adminbar_tooltip'] ) . ', .95)!important;
            }
            .sticky_wpab.qtip:after,
            .sticky_wpab.qtip-default:after {
                border-bottom-color: rgba(' . hex2rgb( StickyAdmin::$config['colors']['adminbar_tooltip'] ) . ', .95)!important;
            }
            #wp-admin-bar-bp-notifications .count,
            #wp-admin-bar-comments .ab-label,
            #wp-admin-bar-updates .ab-label {
                background:'. StickyAdmin::$config['colors']['adminbar_hl'] .';
            }
        ');
    }

    /**
     *
     * 
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    function sticky_icons() {
        foreach ( StickyAdmin::$config['iconpickers'] as $which => $selector ) {
            $icons = get_transient( get_current_blog_id() . '_sticky_'. $which .'_icons' );
            if ( ! empty( $icons ) ) {
                foreach ( (array) $icons as $element => $content ) {
                    if ( ! empty( $element ) && $element != 'undefined' )
                        echo sticky_parse_icon( $which, $element ) . '{content:"'. $content. '"}';
                }
            }  
        }
    }


    /**
     *
     * 
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    function sticky_parse_icon( $which = '', $element = '' ) {
        if ( $element == '' || $which == '' ) return;

        $string = StickyAdmin::$config['iconpickers'][$which];
        if ( $string == '' ) return;

        return str_replace( 'SID', $element, $string);
    }

    /**
     *
     * Dynamic CSS
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    function sticky_dynamic_css() {
        if ( ! is_admin() && ! StickyAdmin::$config['adminbar']['preserve'] ) return;

        return minify_css('
            body, 
            body.is_loading #overlay, 
            #wpbody,
            #postdivrich .switch-html:before,
            #postdivrich .switch-html:after,
            #postdivrich .switch-tmce:before,
            #postdivrich .switch-tmce:after
            {
                background: ' . StickyAdmin::$config['colors']['content'] . ' ;
            }
            #screen-meta,#screen-meta-links .show-settings {
                background: ' . StickyAdmin::$config['colors']['side_meta'] . ';
            }
            ::-webkit-scrollbar-track {
                background:' . StickyAdmin::$config['colors']['scrollbar_rail'] . ';
            }
            ::-webkit-scrollbar-thumb {
                background-color: '. StickyAdmin::$config['colors']['scrollbar'] . ';
            }
            #adminmenumain,
            #sidemenu,
            .wp-responsive-open #wpadminbar #wp-admin-bar-menu-toggle a,
            #adminmenuwrap .menu_settings,
            .panel_menu,
            body:not(.grid_menu) #adminmenu .wp-submenu {
                background:'. StickyAdmin::$config['colors']['adminmenu'] . '!important;
            }
            #adminmenu .awaiting-mod, #adminmenu span.update-plugins, 
            #sidemenu li a span.update-plugins {
                border:2px solid ' . StickyAdmin::$config['colors']['adminmenu'] . ';
            }
            #adminmenu .awaiting-mod, 
            #adminmenu span.update-plugins, 
            #sidemenu li a span.update-plugins {
                background-color:' . StickyAdmin::$config['colors']['adminmenu_hl'] . '!important;
            }
            #adminmenu li.menu-top-open > a .wp-menu-image:before,
            #adminmenu li.opensub > a .wp-menu-image:before,
            #adminmenu li.current > a .wp-menu-image:before,
            #adminmenu li.wp-has-current-submenu > a .wp-menu-image:before {
                color:' . StickyAdmin::$config['colors']['adminmenu_hl']. '!important;
            }
            #sticky_icon_picker {
                background:'. StickyAdmin::$config['colors']['adminbar_submenu_top'] .';
            }
            #sticky_icon_picker:before {
                border-bottom-color: ' . StickyAdmin::$config['colors']['adminbar_submenu_top'] . '!important; 
            }
            #sticky_icon_picker.reposition:before {
                border-bottom-color: transparent!important;
                border-top-color: ' . StickyAdmin::$config['colors']['adminbar_submenu_top'] . '!important;
            }
            body:not(.mobile) #adminmenu .wp-not-current-submenu .wp-submenu,
            body.folded:not(.mobile) #adminmenu .wp-has-current-submenu .wp-submenu {
                background:'. StickyAdmin::$config['colors']['adminmenu_submenu'] . '!important;
            }
            #fx stop:nth-child(1) { 
                stop-color:'. StickyAdmin::$config['hl_colors'][1] . '; 
            }               
            #fx stop:nth-child(2) { 
                stop-color:' . StickyAdmin::$config['hl_colors'][0] . ';
            }
            #fx stop:nth-child(3) { 
                stop-color:' . StickyAdmin::$config['hl_colors'][2] . '; 
            }

            #fxtwo stop:nth-child(1) { 
                stop-color:'. StickyAdmin::$config['hl_colors2'][1] . '; 
            }               
            #fxtwo stop:nth-child(2) { 
                stop-color:' . StickyAdmin::$config['hl_colors2'][0] . ';
            }
            #fxtwo stop:nth-child(3) { 
                stop-color:' . StickyAdmin::$config['hl_colors2'][2] . '; 
            }
            
            #overlay svg path {
                fill:' . StickyAdmin::$config['hl_colors'][0] . ';
            }

            body.wp-admin input + label > span.labelauty-checked-image,
            body.wp-admin #post-formats-select input[type=radio]:checked + label:before,
            #toast-container > div:before,
            body.wp-admin ul.category-tabs li.tabs a,
            .wrap > .subsubsub a.current .count,
            #sticky_bulk_actions div.counter,
            .star-rating .star,
            .row-actions a:hover:before,
            .tabs-panel li.popular-category:after,
            .wp-responsive-open .wrap > h1:first-child > a#wp-menu-toggle,
            .wp-responsive-open .wrap > h2:first-child > a#wp-menu-toggle,
            .welcome-panel .slick-dots li.slick-active span.icon:before,
            body.wp-admin #activity-widget ul.slick-dots > li.slick-active > button,
            .panel_menu li.active_tab a.nav_tab_link:before { 
                color:' . StickyAdmin::$config['hl_colors'][0] . '; 
            }

            #sticky_bulk_actions button.selected,
            .sod_select .sod_list_wrapper,
            body.sticky-admin #welcome-panel.welcome-panel select:focus,
            body.sticky-admin #welcome-panel.welcome-panel .sod_select:focus,
            body.sticky-admin #welcome-panel.welcome-panel .sod_select.focus,
            body.wp-admin input[type="text"]:focus, 
            body.wp-admin input[type="password"]:focus, 
            body.wp-admin input[type="file"]:focus, 
            body.wp-admin input[type="email"]:focus, 
            body.wp-admin input[type="number"]:focus, 
            body.wp-admin input[type="search"]:focus, 
            body.wp-admin input[type="tel"]:focus, 
            body.wp-admin input[type="url"]:focus, 
            body.wp-admin select:focus,
            body.wp-admin .sod_select.focus {
                border-color: ' . StickyAdmin::$config['hl_colors'][0] . '; 
            }

            .current-panel .accordion-sub-container.control-panel-content,
            #customize-controls { 
                background:' . StickyAdmin::$config['colors']['customizer'] . '; 
            }

            .qtip,
            .qtip-default,
            div.google-visualization-tooltip { 
                background: rgba(' . hex2rgb( StickyAdmin::$config['colors']['tooltip'] ) . ', .98); 
            }
            .qtip:after,
            .qtip-default:after { 
                border-top-color: rgba(' . hex2rgb( StickyAdmin::$config['colors']['tooltip'] ) . ', .98) !important;
            }
            
            .wrap > h1:first-child,
            .wrap > h2:first-child,
            .wp-filter .search-form input[type=search],
            p.search-box input[name=s]
            {
                background:'. StickyAdmin::$config['colors']['header'] .';
            }
            .wrap > h1 > .page-title-action, 
            .wrap .add-new-h2,
            .wp-media-buttons .button,
            #sticky_bulk_actions input[type=submit] {
                background:'. StickyAdmin::$config['hl_colors'][0] .';   
            }
            .wrap > h1:first-child #filters-expand ul li.active:before,
            .view-switch > .current { 
                color:' . StickyAdmin::$config['hl_colors'][0] . '!important;
            }
            .post-state-format {
                color:' . StickyAdmin::$config['hl_colors'][0] . ' !important;
            }
            #overlay:before,
            .filter-links, 
            .subsubsub,
            .media-frame.mode-grid .uploader-inline,
            .wrap > .nav-tab-wrapper,
            body.update-core-php .wrap > #s-update-notice-container, 
            #welcome-panel,
            #category-tabs,
            #side-sortables .taxonomy-tabs, 
            #side-sortables .posttype-tabs,
            #activity-widget ul.subsubsub,
            .wrap > form > .tablenav.bottom > .tablenav-pages,
            .press-this-actions {
                background: ' . StickyAdmin::$config['colors']['header'] . ' ;
                background: -webkit-linear-gradient(180deg, '. StickyAdmin::$config['colors']['header'] .', '. StickyAdmin::$config['colors']['header_grad'] .' 100%);
                background: -moz-linear-gradient(180deg, '. StickyAdmin::$config['colors']['header'] .', '. StickyAdmin::$config['colors']['header_grad'] .' 100%);
                background: -o-linear-gradient(180deg, '. StickyAdmin::$config['colors']['header'] .', '. StickyAdmin::$config['colors']['header_grad'] .' 100%);
                background: linear-gradient(180deg, '. StickyAdmin::$config['colors']['header'] .', '. StickyAdmin::$config['colors']['header_grad'] .' 100%);
            }

            #wpbody-content:after {
                background: ' . StickyAdmin::$config['colors']['header'] . ' ;
            }
            
            #wpfooter { 
                background-color:' . StickyAdmin::$config['colors']['footer'] . ' ;
            }

            #adminmenu li#collapse-menu { 
                left: ' . ( StickyAdmin::$config['adminmenu']['width'] - 32 ) . 'px; 
            }
            body.rtl #adminmenu li#collapse-menu { 
                left: auto;
                right: ' . ( StickyAdmin::$config['adminmenu']['width'] - 32 ) . 'px; 
            }
            #adminmenuwrap .resize_handle,
            .welcome-panel .welcome-panel-close { 
                background:' . StickyAdmin::$config['colors']['adminmenu_handle'] . '; 
            }
            @media screen and (min-width: 1025px) {
                body.grid_menu:not(.mobile):not(.folded) #adminmenu .wp-submenu {
                    background:' . StickyAdmin::$config['colors']['adminmenu_submenu'] . '!important;
                }
                #adminmenuwrap .menu_settings,
                body:not(.mobile):not(.folded) #adminmenumain { 
                    min-width: '. StickyAdmin::$config['adminmenu']['width'] . 'px;
                    max-width: '. StickyAdmin::$config['adminmenu']['width'] . 'px;
                }
                body.header-sticky:not(.mobile) .wrap > h1:first-child, 
                body.header-sticky:not(.mobile) .wrap > h2:first-child, 
                #overlay, 
                #sticky_bulk_actions,
                body:not(.mobile):not(.folded) .wrap > .theme-overlay { left: ' . StickyAdmin::$config['adminmenu']['width'] . 'px; }


                body.rtl.header-sticky:not(.mobile) .wrap > h1:first-child, 
                body.rtl.header-sticky:not(.mobile) .wrap > h2:first-child, 
                body.rtl #overlay,
                body.rtl:not(.mobile):not(.folded) .wrap > .theme-overlay { right: ' . StickyAdmin::$config['adminmenu']['width'] . 'px; left: 0; }

                body:not(.mobile):not(.folded) #wpfooter {
                    left: ' . StickyAdmin::$config['adminmenu']['width'] . 'px;
                }
                body:not(.mobile):not(.folded) #wpcontent { 
                    margin-left: ' . StickyAdmin::$config['adminmenu']['width'] . 'px; 
                }

                body.rtl:not(.mobile):not(.folded) #wpfooter {
                    right: ' . StickyAdmin::$config['adminmenu']['width'] . 'px;
                    left: 0   
                }
                body.rtl:not(.mobile):not(.folded) #wpcontent { 
                    margin-right: ' . StickyAdmin::$config['adminmenu']['width'] . 'px; 
                    margin-left: 0 
                }
            }
            @media screen and (min-width: 783px) and (max-width: 1024px) {
                body.auto-fold:not(.mobile) #adminmenu .wp-has-current-submenu:hover > a + .wp-submenu {
                    background:'.StickyAdmin::$config['colors']['adminmenu_submenu'] . '!important;
                }
                body:not(.auto-fold) #adminmenumain {
                    min-width: '. StickyAdmin::$config['adminmenu']['width'] . 'px;
                }

                body:not(.auto-fold) .wrap > h1:first-child,  
                body:not(.auto-fold) .wrap > h2:first-child,  
                body:not(.auto-fold) .theme-overlay { left: ' . StickyAdmin::$config['adminmenu']['width'] . 'px; }

                body.rtl:not(.auto-fold) .wrap > h1:first-child,  
                body.rtl:not(.auto-fold) .wrap > h2:first-child,  
                body.rtl:not(.auto-fold) .theme-overlay { right: ' . StickyAdmin::$config['adminmenu']['width'] . 'px; left: auto; }

                body:not(.mobile):not(.auto-fold) #wpcontent { margin-left: ' . StickyAdmin::$config['adminmenu']['width'] . 'px; }
                body.rtl:not(.mobile):not(.auto-fold) { margin-right: ' . StickyAdmin::$config['adminmenu']['width'] . 'px; margin-left: 0 }
                body:not(.mobile):not(.auto-fold) #wpfooter { left: ' . StickyAdmin::$config['adminmenu']['width'] . 'px; }
                body.rtl:not(.mobile):not(.auto-fold) #wpfooter { right: ' . StickyAdmin::$config['adminmenu']['width'] . 'px; padding-left: 0 }

            }
            #adminmenu .wp-submenu:before {
                border-right-color:'.StickyAdmin::$config['colors']['adminmenu_submenu'] . '!important;
            }
            body.s_nav_right #adminmenu .wp-submenu:before {
                border-left-color:'.StickyAdmin::$config['colors']['adminmenu_submenu'] . '!important;
                border-right-color:transparent!important;
            }

            .status-draft .sticky_altered.post-state:after { color: '. StickyAdmin::$config['colors']['widefat_draft'] .'; }
            .status-draft .sticky_altered.post-state:after { color: '. StickyAdmin::$config['colors']['widefat_draft'] .'; }

            .widefat.plugins > tbody > tr.inactive > td.plugin-title > strong { color: '. StickyAdmin::$config['widefat']['plugin-inactive'] .'; }
            .widefat.plugins > tbody > tr.active > td.plugin-title > strong { color: '. StickyAdmin::$config['widefat']['plugin-active'] .'; }

            .widefat > tbody input.labelauty:checked + label {
                color: '. StickyAdmin::$config['hl_colors'][0] .'!important;
            }
            #sticky_stats .instats #s-circle-falls stop:nth-child(1) {
                stop-color:' . StickyAdmin::$config['hl_colors2'][0] . ';
            }
            #sticky_stats .instats #s-circle-falls stop:nth-child(2) {
                stop-color:' . StickyAdmin::$config['hl_colors2'][1] . ';
            }

            #sticky_stats .instats #s-circle-rises stop:nth-child(1) {
                stop-color:' . StickyAdmin::$config['hl_colors'][0] . ';
            }
            #sticky_stats .instats #s-circle-rises stop:nth-child(2) {
                stop-color:' . StickyAdmin::$config['hl_colors'][1] . ';
            }
            #map_canvas svg path {
                stroke: ' . StickyAdmin::$config['colors']['dash_maps'] . ';
                fill: ' . StickyAdmin::$config['colors']['dash_maps_bg'] . ';
            }
            ' . ( ( ! StickyAdmin::$config['footer']['show'] ) ? '#wpfooter{display:none!important}' : '' ) . '
        ');
    }
?>