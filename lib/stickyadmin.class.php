<?php
/**
 * --------------------------------------------------
 * Class StickyAdmin - Main file for plugin execution
 * ==================================================
 *
 * @version 1.0.6
 * @copyright 2016
 * @author Dorian Tudorache
 * @link www.stickyadmin.net
 *
 * @license GPL 2.0+
 *
 * @package Sticky Admin
 *
 */
if ( ! class_exists( 'StickyAdmin' ) ) :

class StickyAdmin {
    protected static $instance = null;
    const PLUGIN_NAME   = 'Sticky Admin';
    const PLUGIN_SLUG   = 'stickyadmin';
    const VERSION       = '1.0.6';
    
    /**
     * The pre-modified admin menu.
     *
     * @since 1.0.0
     */
    public static $original_admin_menu;

    /**
     * StickyAdmin config
     *
     * @since 1.0.0
     */
    public static $config;
    

    /**
     * Vars to keep the user id and current blog id stored for use
     *
     * @since 1.0.5
     */
    public static $current_blog_id;
    public static $current_user_id;

    /**
     * The menu ID for the currently being edited cd_admin_menu nav menu.
     *
     * @since 1.0.0
     */
    public $menu_ID;
    
    /**
     * The role that the current menu is for.
     *
     * @since 1.0.0
     */
    public $role;
    
    /**
     * Default Menu Positions
     *
     * @since 1.0.0
     */
    public $menu_item_defaults;
    
    /**
     *
     * Execute Sticky Admin - Order is really important, don't change unless you know what you're doing.
     *
     * @since 1.0.0
     * @author Dorian Tudorache
     *
     */
    public static function init() {
        self::sticky_constants();
        self::sticky_objects_constants();
        self::sticky_functions();
        self::sticky_vars();
        self::sticky_generate_css( self::$config, self::$current_blog_id );
        self::sticky_on_init();
        self::sticky_login_page();
        
        // Styles & scripts
        self::sticky_admin_ss();
        self::sticky_hook_scripts();
        self::sticky_custom_ss();
        self::sticky_extensions_integration();
    }
    
    /**
     * A dummy constructor to prevent StickyAdmin from being loaded more than once.
     *
     * @since 1.0.0
     * @author Dorian Tudorache
     *
     */
    public function __construct() { /* Do nothing here */ }
    
    /**
     * A dummy magic method to prevent StickyAdmin from being cloned.
     *
     * @since 1.0.0
     * @author Dorian Tudorache
     *
     */
    public function __clone() { _doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', '_sticky_' ), '1.0.0' ); }
    
    /**
     *
     * Define plugin constants.
     *
     * @since 1.0.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_constants() {
        define( 'STICKY_DIR',           WP_PLUGIN_URL . '/stickyadmin/' ); 
        define( 'STICKY_URI',           plugin_dir_path(__FILE__) );
        define( 'STICKY_LIB',           STICKY_DIR . 'lib/' );
        define( 'STICKY_CSS',           STICKY_LIB . 'css/' );
        define( 'STICKY_JS',            STICKY_LIB . 'js/' );
        define( 'STICKY_ASSETS',        STICKY_LIB . 'assets/' );
        define( 'STICKY_CACHE',         STICKY_LIB . 'cache/' );
        define( 'STICKY_CLASSES',       STICKY_LIB . 'classes/' );
        define( 'STICKY_INCLUDES',      STICKY_LIB . 'includes/' );
        
        // URIs
        define( 'STICKY_ASSETS_URI',    STICKY_URI . 'assets/' );
        define( 'STICKY_INCLUDES_URI',  STICKY_URI . 'includes/' );
        define( 'STICKY_CLASSES_URI',   STICKY_URI . 'classes/' );
        define( 'STICKY_CSS_URI',       STICKY_URI . 'css/' );
        define( 'STICKY_CACHE_URI',     STICKY_URI . 'cache/' );
    }
    
    /**
     *
     * Sticky objects constants.
     *
     * @since 1.0.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_objects_constants() {
        define( 'STICKY_ABOUT',         'sticky-about' );
        define( 'STICKY_ADMINBAR',      'sticky-adminbar' );
        define( 'STICKY_ADMINMENU',     'sticky-adminmenu' );
        define( 'STICKY_COMMENTS',      'sticky-comments' );
        define( 'STICKY_CUSTOMIZER',    'sticky-customizer' );
        define( 'STICKY_DASHBOARD',     'sticky-dashboard' );
        define( 'STICKY_EDITOR',        'sticky-editor' );
        define( 'STICKY_FONTS',         'sticky-fonts' );
        define( 'STICKY_FORMS',         'sticky-forms' );
        define( 'STICKY_LABELAUTY',     'sticky-labelauty' );
        define( 'STICKY_LOGIN',         'sticky-login' );
        define( 'STICKY_LOGO',          'sticky-logo' );
        define( 'STICKY_MAIN',          'sticky-main' );
        define( 'STICKY_MEDIA',         'sticky-media' );
        define( 'STICKY_MENUS',         'sticky-menus' );
        define( 'STICKY_NOTIFICATIONS', 'sticky-notifications' );
        define( 'STICKY_PRELOAD',       'sticky-preload'  );
        define( 'STICKY_SEARCHBOX',     'sticky-searchbox' );
        define( 'STICKY_SELECTS',       'sticky-selects' );
        define( 'STICKY_THE_LIST',      'sticky-the-list' );
        define( 'STICKY_THEMES',        'sticky-themes' );
        define( 'STICKY_TOOLTIPS',      'sticky-tooltips' );
        define( 'STICKY_WIDEFAT',       'sticky-widefat' );
        define( 'STICKY_WIDGETS',       'sticky-widgets' );
        define( 'STICKY_PRESSTHIS',     'sticky-pressthis' );
    }
    
    /**
     * 
     * Load the required files
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
    */
    public static function sticky_functions() {
        // Sticky required functions
        require_once( STICKY_INCLUDES_URI . 'sticky_functions.php' );

        // Sticky styles and scripts definitions
        require_once( STICKY_INCLUDES_URI . 'sticky_do_styles.php' );
        require_once( STICKY_INCLUDES_URI . 'sticky_do_scripts.php' );

        // Login page
        require_once( STICKY_INCLUDES_URI . 'sticky_login.php' );
    } 
    
    /**
     *
     * Sticky variables object init.
     *
     * @since 1.0.0
     * @param $grab_data is the - options pulled from the StickyAdmin settings panel - array.
     * @param $default_pages_list is the WP default pages array.
     *
    */
    public static function sticky_vars() {
        self::sticky_setup_options( get_option('sticky_options') );
    }


    /**
     *
     * Actions that run once the plugin is initalized.
     *
     * @since 1.0.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_on_init() {
        add_action( 'admin_init',           array( 'StickyAdmin', 'sticky_remove_wp_admin_styles' ) );
        add_action( 'bp_init',              array( 'StickyAdmin', 'sticky_remove_bp_adminbar_css' ) );
        add_action( 'get_header',           array( 'StickyAdmin', 'sticky_wpab_remove_inline_css' ) );
        add_action( 'admin_init',           array( 'StickyAdmin', 'sticky_wpab' ) );
        add_action( 'admin_init',           array( 'StickyAdmin', 'sticky_wpab_state_controller' ) );
        add_action( 'admin_init',           array( 'StickyAdmin', 'sticky_wpab_check' ) );
        add_action( 'admin_init',           array( 'StickyAdmin', 'sticky_extensions' ) );
        add_action( 'init' ,                array( 'StickyAdmin', 'sticky_wpab' ) );
        add_action( 'init' ,                array( 'StickyAdmin', 'sticky_grab_ids' ) );
    }
    
    /**
     *
     * Sticky styles & scripts
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_admin_ss() {
        // Plugin styles & scripts.
        add_action( 'admin_enqueue_scripts',        array( 'StickyAdmin', 'sticky_styles' ) );
        add_action( 'admin_enqueue_scripts',        array( 'StickyAdmin', 'sticky_scripts' ) );  
        // Admin Bar only.
        add_action( 'admin_enqueue_scripts',        array( 'StickyAdmin', 'sticky_wpab_css' ) );
        add_action( 'admin_enqueue_scripts',        array( 'StickyAdmin', 'sticky_wpab_js' ) );
        add_action( 'wp_enqueue_scripts',           array( 'StickyAdmin', 'sticky_wpab_css' ) );
        add_action( 'wp_enqueue_scripts',           array( 'StickyAdmin', 'sticky_wpab_js' ) );
    
        // BuddyPress
        add_action( 'bp_admin_enqueue_scripts',     array( 'StickyAdmin', 'sticky_buddypress_enqueue' ) );
        // Preserve Modified Admin Bar actions.
        add_action( 'wp_before_admin_bar_render',   array( 'StickyAdmin', 'sticky_wpadminbar_remove' ) );
        
    }   
    
    /**
     *
     * Sticky custom styles & scripts
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_custom_ss() {
        add_action( 'admin_head',                   array( 'StickyAdmin', 'sticky_head' ) );
        // Grab the original Admin Menu for diferrent roles.
        $nav_hook = ( is_network_admin() ? 'network_admin_menu' : ( is_user_admin() ? 'user_admin_menu' : 'admin_menu' ) );
        add_action( $nav_hook,                      array( 'StickyAdmin', 'sticky_get_orig_admin_menu' ), 999998 );
        // Remove the original Admin Menu.
        add_action( 'admin_head',                   array( 'StickyAdmin', 'sticky_remove_orig_menu' ), 99999 );
        // Dashboard Enhacements.
        add_action( 'wp_dashboard_setup',           array( 'StickyAdmin', 'sticky_dashboard' ) );
        // Filter the <body> classes.
        add_filter( 'admin_body_class',             array( 'StickyAdmin', 'sticky_bodyclass_controller' ) );
        // add_filter( 'admin_body_class',             array( 'StickyAdmin', 'sticky_body_class_ajax' ) );
        add_filter( 'body_class',                   array( 'StickyAdmin', 'sticky_uses_sticky' ) );
        // FormatDiv Meta Box style refresh.
        add_action( 'do_meta_boxes',                array( 'StickyAdmin', 'sticky_change_format_meta_box' ), 0 );
        // Content Preloader - all_admin_notices hook used so it goes in #wpbody.
        add_action( 'all_admin_notices',            array( 'StickyAdmin', 'sticky_content_preload' ) );
        // Footer Text Replacement
        add_filter( 'admin_footer_text' ,           array( 'StickyAdmin', 'sticky_wp_admin_footer' ), 999999 );
        // Howdy message replace
        add_filter( 'admin_bar_menu',               array( 'StickyAdmin', 'sticky_wpab_my_account' ), 10, 3);
        // Customizer styles
        add_action( 'customize_controls_print_styles', array( 'StickyAdmin', 'sticky_customizer_enqeueue' ) );
        // Sticky Editor
        add_filter( 'tiny_mce_before_init',         array( 'StickyAdmin', 'sticky_editor' ) );
        // Replace default avatars
        // add_filter( 'avatar_defaults',              array( 'StickyAdmin', 'sticky_avatar' ) );
        // Inject the logo - action fires before the menu.
        add_action( 'sticky_before_nav',            array( 'StickyAdmin', 'sticky_adminmenu_logo' ), 0 );
        add_action( 'sticky_before_nav',            array( 'StickyAdmin', 'sticky_logout_button' ) );
        
        // Sticky Admin Menu
        add_action( 'adminmenu',                    array( 'StickyAdmin', 'sticky_admin_menu' ), 999999 );
        // MENU - Order, Sort and AJAX
        add_filter( 'custom_menu_order',            array( 'StickyAdmin', 'sticky_custom_menu_order') );
        add_filter( 'menu_order',                   array( 'StickyAdmin', 'sticky_custom_menu_order') );
        
        add_action( 'wp_ajax_sticky_update',         array( 'StickyAdmin', 'sticky_setup_options') );
        add_action( 'wp_ajax_update_menu_positions', array( 'StickyAdmin', 'sticky_update_menu_positions') );
        add_action( 'wp_ajax_dynamic_css',          array( 'StickyAdmin', 'sticky_ajax_css' ) );
        add_action( 'wp_ajax_nopriv_dynamic_css',   array( 'StickyAdmin', 'sticky_ajax_css' ) );
        // Copyright on Options Panel
        add_action( 'admin_page_class_after_page',  array( 'StickyAdmin', 'sticky_copyright' ) );
        // After panel save, trigger the flag
        add_action( 'WP_EX_after_save',				array( 'StickyAdmin', 'sticky_theme_changed' ) );
    }

    /**
     *
     * Function to enqueue CSS on the customizer page.
     *
     * @since 1.0.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_customizer_enqeueue() {
        if ( $GLOBALS['pagenow'] != 'customize.php' ) return;
        wp_enqueue_style( STICKY_CUSTOMIZER, STICKY_CSS . STICKY_CUSTOMIZER . '.css' );
    }

    /**
     *
     * A simple function to capture IDs of the current user & blog
     *
     * @since 1.0.5
     * @author Dorian Tudorache
     *
     */
    public static function sticky_grab_ids() {
        self::$current_blog_id = get_current_blog_id();
        self::$current_user_id = get_current_user_id();
    }

    /**
     *
     * Actions & filters just for the login page.
     *
     * @since 1.0.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_login_page() {
        // If we're not on the login page, skip this.
        if ( ! in_array( $GLOBALS['pagenow'],       array( 'wp-login.php', 'wp-register.php' ) ) ) return;
        /* Login Page
        -------------------------- */
        add_action( 'login_init',                   array( 'StickyAdmin', 'sticky_replace_login_style' ) );
        add_action( 'login_head',                   array( 'StickyAdmin', 'sticky_login_page_css' ) );
        add_action( 'login_head',                   array( 'StickyAdmin', 'sticky_login_page_js' ) );
        add_filter( 'login_body_class',             array( 'StickyAdmin', 'sticky_login_classes' ) );
        add_filter( 'login_headertitle',            array( 'StickyAdmin', 'sticky_login_page_headertitle' ) );
        add_filter( 'login_headerurl',              array( 'StickyAdmin', 'sticky_login_page_headerurl' ) );
    }

    /**
     *
     * Sticky Extensions
     *
     * @since 1.0.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_extensions_integration() {
        add_action( 'admin_print_scripts-theme-editor.php',     array( 'StickyAdmin', 'code_editor_scripts' ) );
        add_action( 'admin_print_scripts-plugin-editor.php',    array( 'StickyAdmin', 'code_editor_scripts' ) );
        add_action( 'admin_print_styles-theme-editor.php',      array( 'StickyAdmin', 'code_editor_styles' ) );
        add_action( 'admin_print_styles-plugin-editor.php',     array( 'StickyAdmin', 'code_editor_styles' ) );
    }

    /**
     *
     * Sets up the options, self::$config object
     *
     * @since 1.0.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_setup_options( $s_ui ) {        
        // Syicky Random Cogs
        include ( 'includes/sticky_preloaders.php' );
        
        self::$config = array(
            // Elements colors
            'colors'    => array(
                'highlight' => array(
                    'bg'    => ( isset ( $s_ui[ 'highlight_color' ] ) ? $s_ui[ 'highlight_color' ] : '#FFFFFF' ),
                    'color' => '',
                    'hl'    => '',
                ),

                // Header
                'header'    => array(
                    'bg'    => ( isset ( $s_ui[ 'header_bg' ] ) ? $s_ui[ 'header_bg' ] : '#4A6491' ),
                    'color' => '',
                    'hl'    => ''
                ),

                // AdminMenu
                'adminmenu' => array(
                    'bg'    => ( isset ( $s_ui[ 'nav_bg' ] ) ? $s_ui[ 'nav_bg' ] : '#1A1F2B' ),
                    'color' => '',
                    'hl'    => '',
                    // Submenus
                    'submenu'   => array( //adminmenu_submenu
                        'bg'    => ( isset ( $s_ui[ 'nav_sub_bg' ] ) ? $s_ui[ 'nav_sub_bg' ] : '#FFFFFF' ),
                        'color' => ''
                    ),
                    // The resize handle
                    'handle'    => array(
                        'bg'    => ( isset ( $s_ui[ 'nav_resize_handle_bg' ] ) ? $s_ui[ 'nav_resize_handle_bg' ] : '#FFFFFF' ),
                        'color' => ''
                    ),
                ),

                // AdminBar
                'adminbar'  => array(
                    'bg'    => ( isset ( $s_ui[ 'wpadminbar_bg' ] ) ? $s_ui['wpadminbar_bg'] : '#FFFFFF' ),
                    'color' => '',
                    'hl'    => '',
                    // SubMenus
                    'submenu'   => array(
                        'bg'    => ( isset ( $s_ui[ 'wpadminbar_sub_bg' ] ) ? $s_ui[ 'wpadminbar_sub_bg' ] : '#FFFFFF' ),
                        'color' => ''
                    ),
                    // Profile menu
                    'profile'   => array(
                        'bg'    => ( isset ( $s_ui[ 'wpadminbar_profile_bg' ] ) ? $s_ui[ 'wpadminbar_profile_bg' ] : '#1A1F2B' ),
                        'color' => ''
                    ),
                    // Tooltips
                    'tooltips'  => array(
                        'bg'    => ( isset ( $s_ui[ 'wpab_tooltips_bg' ] ) ? $s_ui[ 'wpab_tooltips_bg' ] : '#FFFFFF' ),
                        'color' => ''
                    )
                ),

                // Content
                'content'   => array(
                    'bg'    => ( isset ( $s_ui[ 'content_bg' ] ) ? $s_ui[ 'content_bg' ] : '#ECF2F6' ),
                    'color' => '',
                    'hl'    => '',
                     // Widgets
                    'widgets'   => array(
                        'bg'    => ( isset ( $s_ui[ 'color_widget' ] ) ? $s_ui[ 'color_widget' ] : '#FFFFFF' ),
                        'color' => '',
                        'hl'    => ''
                    ),
                    // Content ScrollBar
                    'scroll'    => array(
                        'bg'    => ( isset ( $s_ui[ 'scrollbar' ] ) ? $s_ui[ 'scrollbar' ] : '#30395c' ),
                        'rail'  => ( isset ( $s_ui[ 'scrollbar_rail' ] ) ? $s_ui[ 'scrollbar_rail' ] : '#ffffff' ),
                    ), 
                    // Tooltips
                    'tooltips'  => array(
                        'bg'    => ( isset ( $s_ui[ 'tooltips_bg' ] ) ? $s_ui[ 'tooltips_bg' ] : '#FFFFFF' ),
                        'color' => '',
                        'hl'    => ''
                    ),  
                ),

                // Customizer
                'customizer'=> array(
                    'bg'    => ( isset ( $s_ui[ 'customizer_bg' ] ) ? $s_ui[ 'customizer_bg' ] : '#1A1F2B' ),
                    'color' => '',
                    'hl'    => ''
                ),

                // Footer
                'footer'    => array(
                    'bg'    => ( isset ( $s_ui[ 'footer_bg' ] ) ? $s_ui[ 'footer_bg' ] : '#4A6491' ),
                    'color' => '',
                    'hl'    => '',
                ),
            ),
            'adminmenu' => array(
                'position'          =>  ( isset( $s_ui[ 'nav_pos' ] ) ? $s_ui['nav_pos'] : 'left' ),
                'foldable'          =>  ( isset( $s_ui[ 'nav_fold' ] ) ? $s_ui['nav_fold'] : true ),
                'sticky'            =>  ( isset( $s_ui[ 'nav_sticky' ] ) ? $s_ui[ 'nav_sticky' ] : true), 
                'grid'              =>  ( isset( $s_ui[ 'nav_grid' ] ) ? $s_ui[ 'nav_grid' ] : true ),
                'grid_on'           =>  ( isset( $_COOKIE[ 'sticky-gridmenu' ] ) ? $_COOKIE[ 'sticky-gridmenu' ] : ''),
                'resizable'         =>  ( isset( $s_ui[ 'nav_resize' ] ) ? $s_ui['nav_resize'] : true ),
                'controls'          =>  ( isset( $s_ui[ 'nav_controls' ] ) ? $s_ui['nav_controls'] : true ),
                'mobile'            =>  ( isset( $s_ui[ 'nav_mobile' ] ) ? $s_ui[ 'nav_mobile' ] : true ),
                'width'             =>  ( isset( $_COOKIE[ 'sticky_nav_width' ] ) ? $_COOKIE[ 'sticky_nav_width' ] : '220' )
            ),
            'header'    => array(
                'icons'             =>  ( isset( $s_ui[ 'header_icons' ] ) ? $s_ui[ 'header_icons' ] : true ),
                'sticky'            =>  ( isset( $s_ui[ 'header_sticky' ] ) ? $s_ui[ 'header_sticky' ] : true ),
                'type'              =>  ( isset( $s_ui[ 'header_type' ] ) ? $s_ui[ 'header_type' ] : 'minimize' ),
            ),
            'content'   => array(
                'dash_heading'      =>  ( isset( $s_ui[ 'dash_heading' ] ) ? esc_attr ( $s_ui[ 'dash_heading' ] ) : __( 'Welcome to WordPress with StickyAdmin!', '_sticky_' ) ),
                'dash_stats'        =>  ( isset( $s_ui[ 's_no_welcome' ] ) ? $s_ui['s_no_welcome'] : true ),
                'preload'           =>  ( isset( $s_ui[ 'content_preload' ] ) ? $s_ui['content_preload'] : true ),
                'preloader'         =>  ( isset( $s_ui[ 'content_preloader' ] ) && ( $s_ui [ 'content_preloader' ] != '' ) ? $s_ui['content_preloader'] : sticky_cogs( rand(1,24) ) )
            ),
            'adminbar'  => array(
                'preserve'          =>  ( isset( $s_ui[ 'wpadminbar_preserve' ] ) ? $s_ui[ 'wpadminbar_preserve' ] : true ),
                'sticky'            =>  ( isset( $s_ui[ 'wpadminbar_sticky' ] ) ? $s_ui[ 'wpadminbar_sticky' ] : true ),
                'hide'              =>  ( isset( $s_ui[ 'wpadminbar_hide' ] ) ? $s_ui[ 'wpadminbar_hide' ] : false ),
                'controls'          =>  ( isset( $s_ui[ 'wpadminbar_controls' ] ) ? $s_ui[ 'wpadminbar_controls' ] : true ),
                'cookie'            =>  ( isset( $_COOKIE[ 'sticky_wpab' ] ) ? $_COOKIE[ 'sticky_wpab' ] : 'maximized' ),
                'state'             =>  '',
                'tooltips'          =>  ( isset( $s_ui[ 'wpab_tooltips_disable' ] ) ? $s_ui[ 'wpab_tooltips_disable' ] : false ),
                'searchbar'         =>  ( isset( $s_ui[ 'wpab_search' ] ) ? $s_ui[ 'wpab_search' ] : false ),
                'howdy_text'        =>  ( isset( $s_ui[ 'wpadminbar_howdy' ] ) ? $s_ui[ 'wpadminbar_howdy' ] : __( 'Howdy', '_sticky_' ) )
            ),
            'widefat'   => array(
                'post-draft'        =>  ( isset( $s_ui[ 'widefat_draft' ] ) ? $s_ui [ 'widefat_draft' ] : '#fff3a2' ),
                'post-protected'    =>  ( isset( $s_ui[ 'widefat_pass' ] ) ? $s_ui [ 'widefat_pass' ] : '#ffc7f4' ),
                'post-trash'        =>  ( isset( $s_ui[ 'widefat_trash' ] ) ? $s_ui [ 'widefat_trash' ] : '#ffa7a7' ),
                'post-sticky'       =>  ( isset( $s_ui[ 'widefat_sticky' ] ) ? $s_ui [ 'widefat_sticky' ] : '#6af9ff'),
                'plugin-active'     =>  ( isset( $s_ui[ 'widefat_plugin_active' ] ) ? $s_ui [ 'widefat_plugin_active' ] : '#30395c' ),
                'plugin-inactive'   =>  ( isset( $s_ui[ 'widefat_plugin_inactive' ] ) ? $s_ui [ 'widefat_plugin_inactive' ] : '#ff5d5d')
            ),
            'logo'      => array(
                'how'               =>  ( isset( $s_ui[ 'nav_logo_how' ] ) ? $s_ui[ 'nav_logo_how' ] : 'svg' ),
                'link'              =>  ( isset( $s_ui[ 'nav_custom_logo_link' ] ) ? $s_ui[ 'nav_custom_logo_link' ] : '' ),
                'image_path'        => '',
                'show'              => '', // The output
                'show_folded'       => '' // Folded output
            ),
            'login'     => array(
                'bg_color'          =>  ( isset( $s_ui[ 'login_background_color' ] ) ? $s_ui['login_background_color']: '#1a1f2b' ),
                'bg_image'          =>  ( isset( $s_ui[ 'login_background_image' ][ 'src' ] ) ? $s_ui['login_background_image']['src'] : STICKY_ASSETS . 'sticky-default-login-bg.jpg' ),
                'display_logo'      =>  ( isset( $s_ui[ 'logo_enable' ] ) ? $s_ui['logo_enable'] : true ),
                'form'              =>  ( isset( $s_ui[ 'login_form_background' ] ) ? $s_ui[ 'login_form_background' ] : true ),
                'form_bg'           =>  ( isset( $s_ui[ 'login_form_background_color' ] ) ? $s_ui[ 'login_form_background_color' ] : true ),
            ),
            'icons'     => array(
                'favicon'           =>  ( isset( $s_ui[ 's_favicon' ][ 'src' ] ) && ! empty( $s_ui[ 's_favicon' ][ 'src' ] ) ) ? $s_ui[ 's_favicon' ][ 'src '] : STICKY_ASSETS . 'favico.png',
                'phone_57'          =>  ( isset( $s_ui[ 's_phone_57' ][ 'src' ] ) ) ? $s_ui[ 's_phone_57' ][ 'src' ] : STICKY_ASSETS . 'sticky_logo_57.png',
                'phone_114'         =>  ( isset( $s_ui[ 's_phone_114' ][ 'src' ] ) ) ? $s_ui[ 's_phone_114' ][ 'src' ] : STICKY_ASSETS . 'sticky_logo_114.png',
                'tablet_72'         =>  ( isset( $s_ui[ 's_tablet_72' ][ 'src' ] ) ) ? $s_ui[ 's_tablet_72' ][ 'src' ] : STICKY_ASSETS . 'sticky_logo_72.png',
                'tablet_144'        =>  ( isset( $s_ui[ 's_tablet_144' ][ 'src' ] ) ) ? $s_ui[ 's_tablet_144' ][ 'src' ] : STICKY_ASSETS . 'sticky_logo_144.png'
            ),
            'footer'    => array(
                'show'              =>  ( isset ( $s_ui[ 'show_footer' ] ) ? $s_ui['show_footer'] : true ),
                'copyright'         =>  ( isset ( $s_ui[ 'footer_copyright'] ) ? esc_attr( $s_ui[ 'footer_copyright' ] ) : '&copy; StickyAdmin 2015. All Rights Reserved. Donate!' ),
            ),
            'forms'     => array(

            ),
            'iconpickers' => array( 
                'menu'      => '#adminmenu #SID a.menu-top > .wp-menu-image:before',
                'header'    => 'body.SID .wrap>h1:first-child:before,body.SID .wrap>h2:first-child', 
                'bar'       => '#wpadminbar #wp-admin-bar-root-default li#SID > .ab-item:before'
            ),
            'extensions' => array(
                'pace_color'        => ( isset( $s_ui['page_load_color'] ) ? $s_ui['page_load_color'] : 'orange' ),
                'pace_theme'        => ( isset( $s_ui['page_load'] ) ? $s_ui['page_load'] : 'minimal' )
            ),
            'theme'     => ( isset( $s_ui[ 'sticky_theme' ] ) ? $s_ui[ 'sticky_theme' ] : 'default' ),
            'default_icons' => array(
                'menu' => array(
                    'menu-dashboard'              => '\\e7e1',
                    'menu-posts'                  => '\\e8a5',
                    'menu-media'                  => '\\e8e7',
                    'menu-links'                  => '\\e994',
                    'menu-pages'                  => '\\e6f1',
                    'menu-comments'               => '\\e79e',
                    'menu-feedback'               => '\\eb10',
                    'menu-appearance'             => '\\eb6e',
                    'menu-logout'                 => '\\e763',
                    'menu-users'                  => '\\e605',
                    'menu-plugins'                => '\\ebd4',
                    'menu-tools'                  => '\\ed7d',
                    'menu-settings'               => '\\e7c9',
                    'menu-generic'                => '\\e75d',
                    'toplevel_page_bp-activity'   => '\\e91a',
                    'menu-posts-forum'            => '\\e841',
                    'menu-posts-topic'            => '\\e78c',
                    'menu-posts-reply'            => '\\e79d'
                ),
                'header'    => array(
                    'index-php'                         => '\\e7e1',
                    'comments-php'                      => '\\e724',
                    'edit-comments-php'                 => '\\e79e',
                    'update-core-php'                   => '\\ec96',
                    'edit-php'                          => '\\e8a5',
                    'edit-php.post-type-page'           => '\\e6f1',
                    'post-new-php'                      => '\\e8a3',
                    'plugins-php'                       => '\\ebd4',
                    'edit-tags-php'                     => '\\e6fd',
                    'users-php'                         => '\\e605',
                    'user-new-php'                      => '\\eb91',
                    'profile-php'                       => '\\eba1',
                    'edit-tags-php.taxonomy-category'   => '\\e701',
                    'import-php'                        => '\\e70e',
                    'export-php'                        => '\\e70d',
                    'upload-php'                        => '\\ed13',
                    'options-general-php'               => '\\e7c9',
                    'options-writing-php'               => '\\eb85',
                    'options-reading-php'               => '\\e910',
                    'options-discussion-php'            => '\\e723',
                    'options-media-php'                 => '\\e8e7',
                    'options-permalink-php'             => '\\e996',
                    'media-new-php'                     => '\\e89c',
                    'themes-php'                        => '\\eb6e',
                    'tools-php'                         => '\\ed7d',
                    'widgets-php'                       => '\\e710',
                    'nav-menus-php'                     => '\\e712',
                ),
                'bar'   => array(
                    'wp-admin-bar-new-content'      => '\\e60c',
                    'wp-admin-bar-my-sites'         => '\\ed70',
                    'wp-admin-bar-site-name'        => '\\ed70',
                    'wp-admin-bar-bp-login'         => '\\e98d'
                ),
            ),
            'default_pages_list' => array(
                'About'             => 'about.php',
                'BPActivity'        => 'bp-acitivity.php',
                'Comments'          => 'edit-comments.php',
                'Customize'         => 'customize.php',
                'Dashboard'         => 'index.php',
                'Export'            => 'export.php',
                'Import'            => 'import.php',
                'Login'             => 'wp-login.php',
                'Media'             => 'upload.php',
                'Menus'             => 'nav-menus.php',
                'MySites'           => 'my-sites.php',
                'OptionsWriting'    => 'options-writing.php',
                'Plugins'           => 'plugins.php',
                'PluginInstall'     => 'plugin-install.php',
                'Post'              => 'post.php',
                'Posts'             => 'edit.php',
                'PostNew'           => 'post-new.php',
                'PressThis'         => 'press-this.php',
                'Settings'          => 'options-general.php',
                'Sites'             => 'sites.php',
                'Tags'              => 'edit-tags.php',
                'Themes'            => 'themes.php',
                'ThemeEditor'       => 'theme-editor.php',
                'ThemeInstall'      => 'theme-install.php',
                'Tools'             => 'tools.php',
                'UpdateCore'        => 'update-core.php',
                'Users'             => 'users.php',
                'Widgets'           => 'widgets.php'
            ),
            'donate_link'           =>  'http://bit.ly/1St79Tr',
            'dev'   => array(
                'minified_css'      =>  ( isset( $s_ui['s_minified_css'] ) ? $s_ui['s_minified_css'] : true ),
                'cache_css'         =>  ( isset( $s_ui['s_cache_css'] ) ? $s_ui['s_cache_css'] : true ),
                'minified_js'       =>  ( isset( $s_ui['s_minified_js'] ) ? $s_ui['s_minified_js'] : true ),
                'custom_css'        =>  ( isset( $s_ui['custom_css'] ) ? $s_ui['custom_css'] : '' ),
                'custom_js'         =>  ( isset( $s_ui['custom_js'] ) ? $s_ui['custom_js'] : '' )
            ),
            'statistics'            =>  ( isset( $s_ui[ 's_stats' ] ) ? $s_ui [ 's_stats' ] : true ),
            'svg_support'           => true // TODO - Check if browser supports SVG
        );
        
        // Based on the above settings, this function is run here to manipulate the data;
        self::adjust_sticky_config();
    }

    /**
     *
     * Adds / Modifies options
     * -----------------------
     *
     * @since 1.0.5
     * @author Dorian Tudorache
     *
     */
    public static function adjust_sticky_config() {
        self::generate_colors( self::$config['colors'] );
        self::adjust_additional_options();
        self::statistics_config();
        self::body_classes();
        self::logo_config();
        // print_r(self::$config);
    }

    /**
     *
     * Logo Config
     * -----------------------
     *
     * @since 1.0.5
     * @author Dorian Tudorache
     *
     */
    public static function logo_config() {
        // Logo Configuration
        if ( StickyAdmin::$config['logo']['how'] == 'svg' && ! self::$config['svg_support'] )
            StickyAdmin::$config['logo']['how'] = 'image';

        switch ( StickyAdmin::$config['logo']['how'] ) {
            case 'svg':
                self::$config['logo']['show']           = ( isset( $s_ui[ 'logo_svg_code' ] ) ? stripslashes( $s_ui['logo_svg_code'] ) : '<svg width="100%" height="100%" viewBox="0 0 66 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><path d="M32.8426,12.5458c0.770276,0.214047 1.4408,0.188865 2.04308,0l0,-7.98126c-0.661744,-0.138054 -1.33804,-0.171962 -2.04308,0l0,7.98126ZM22.7154,6.40182c-1.55804,-0.352763 -2.29296,-0.66143 -2.29296,-1.39635c0,-0.646732 0.587938,-1.11708 1.64623,-1.11708c0.970098,0 2.24886,0.308668 3.16017,0.690827c0.419431,-0.40633 0.721636,-0.944577 0.85251,-1.67562c-1.01419,-0.440954 -2.39585,-0.837812 -3.96858,-0.837812c-2.36645,0 -3.8216,1.29346 -3.8216,3.11607c0,2.04308 1.71972,2.64572 3.85099,3.13077c1.51394,0.352763 2.20477,0.66143 2.20477,1.36696c0,0.76432 -0.676129,1.17588 -1.80791,1.17588c-1.29346,0 -2.24886,-0.132286 -3.61582,-0.793716c-0.429827,0.430943 -0.757265,0.927922 -0.76432,1.63153c1.64623,0.823113 2.54283,0.984796 4.30665,0.984796c2.41055,0 4.01268,-1.17588 4.01268,-3.17487c0,-1.8961 -1.52864,-2.60163 -3.7628,-3.10137ZM32.0636,6.25483c0.0890945,-0.567859 0.0890945,-1.1313 0,-1.69032l-2.23416,0l0,-3.10137c-0.659598,-0.0642262 -1.34202,-0.0727897 -2.05778,0l0,3.10137l-1.13178,0c-0.108901,0.45576 -0.108901,1.0192 0,1.69032l1.13178,0l0,3.89509c0,1.67562 1.07299,2.51344 2.41055,2.51344c1.14648,0 1.76381,-0.264572 1.85201,-0.293969c0.0849201,-0.520595 0.0849201,-1.03014 0,-1.52864c-0.279271,0.0293969 -0.587938,0.0734923 -0.940701,0.0734923c-1.02889,0 -1.26407,-0.411557 -1.26407,-1.83731l0,-2.8221l2.23416,0ZM41.9703,9.84126c-0.396858,0.602637 -1.05829,0.984796 -1.79321,0.984796c-1.29346,0 -2.35175,-1.02889 -2.35175,-2.27826c0,-1.26407 1.05829,-2.29296 2.35175,-2.29296c0.734923,0 1.39635,0.38216 1.79321,0.970098c0.47924,-0.336012 0.929597,-0.725318 1.32286,-1.21997c-0.720224,-0.970098 -1.83731,-1.58743 -3.11607,-1.58743c-2.41055,0 -4.36544,1.83731 -4.36544,4.13027c0,2.27826 1.95489,4.11557 4.36544,4.11557c1.23467,0 2.36645,-0.617335 3.08668,-1.60213c-0.34561,-0.486577 -0.786829,-0.883832 -1.29346,-1.21997ZM51.5945,4.54807c0.736249,-0.100887 1.41348,-0.0954069 2.03169,0.0164378l2.10188,5.42373l0.146985,0l2.05778,-5.42373c0.657944,-0.0792415 1.35857,-0.0792415 2.10188,0l-3.29245,8.40751c-0.705526,1.80791 -2.58693,2.33705 -4.26255,2.33705c-0.264572,0 -0.499747,0 -0.720224,-0.0146985c-0.17937,-0.832003 -0.0651775,-1.30909 0.249874,-1.54334l0.220477,0c1.10238,0 2.08718,-0.279271 2.54283,-1.20527l-0.176381,0l-2.98175,-7.63721l-2.58897,2.77202l2.95439,4.86519c-0.72946,0.107894 -1.48064,0.12228 -2.26356,0l-2.04308,-3.26306l-1.54334,1.48454l0,1.77851c-0.648138,0.102344 -1.31551,0.144827 -2.04308,0l0,-11.0826c0.647703,-0.0952009 1.32429,-0.107894 2.04308,0l0,6.52611l3.41004,-3.42474c0.701166,-0.0504605 1.38206,-0.0451206 2.05448,-0.0164378ZM33.8568,3.6973c0.646732,0 1.16118,-0.529144 1.16118,-1.19057c0,-0.66143 -0.514446,-1.20527 -1.16118,-1.20527c-0.646732,0 -1.17588,0.543843 -1.17588,1.20527c0,0.66143 0.529144,1.19057 1.17588,1.19057Z" style="fill:'.( ( self::$config['colors']['adminmenu']['color'] == 'w' ) ? '#fff' : '#000' ).';"/><g id="symbol"><path id="shape" d="M14.9043,0.879207c0,7.75964 -6.24752,14.8521 -14.8812,14.8521c0,0 5.45056,-1.99884 5.29521,-6.56935c-0.0913755,-2.68834 -1.92424,-4.00687 -3.42363,-5.07256c-1.7672,-1.25605 -1.46038,-3.21021 1.25117,-3.21021l11.7585,0ZM8.66296,11.6622c3.25674,-2.61475 4.65136,-6.22415 5.04952,-8.63801l-7.3755,0l-0.777586,1.45421c0.264753,0.29761 0.531504,0.64284 0.777586,1.03748l1.66922,-0.288376c0.426586,0.837222 0.718737,1.73637 0.865728,2.66444l-1.47349,0.724993c0.0424477,0.192526 0.0640729,1.10667 0.0179983,1.36043l1.45549,0.716137c-0.0517875,0.326973 -0.121593,0.650357 -0.208975,0.968704Z" style="fill:url(#tag1);"/><path id="shadows" d="M7.98974,13.431c-0.947079,0.617907 -2.1981,1.17465 -2.97048,1.433c0,0 2.14709,-1.7577 2.39306,-4.88889l0.49701,0.251258c-0.317153,1.94835 -1.0592,3.08425 -1.0592,3.08425l1.14372,0.111844c0.295876,-0.615408 0.525434,-1.23207 0.669207,-1.76064l0.427596,-0.355322c-0.104407,0.595011 -0.312351,1.22726 -0.604996,1.80274c-0.17876,0.127792 -0.499563,0.329323 -0.499563,0.329323l0.00364059,-0.00755594ZM6.33724,5.51288c0.561589,0.873405 0.905559,1.91803 1.06922,3.10452l0.455932,-0.224572c-0.136957,-1.03451 -0.449229,-2.03527 -1.00447,-2.97184l-0.520681,0.0918931ZM13.7162,3.01897l1.0331,0c-0.209664,1.2021 -0.399158,1.91335 -0.735155,2.88975c0.192212,-2.11072 -0.134651,-2.60024 -0.297945,-2.88975ZM5.55527,4.47823c-0.898756,-1.03097 -1.73411,-1.45416 -1.73411,-1.45416l2.51589,0l-0.781787,1.45416Z" style="fill:#000;fill-opacity:0.25098;"/></g><defs><linearGradient id="tag1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0.0187592,14.773,-14.773,0.0187592,0.708301,0.97579)"><stop offset="0%" style="stop-color:'.StickyAdmin::$config['colors']['adminmenu']['hl'][1].';stop-opacity:1"/><stop offset="100%" style="stop-color:'. self::$config['colors']['adminmenu']['hl'][0].';stop-opacity:1"/></linearGradient></defs></svg>' );
                self::$config['logo']['show_folded']    = ( isset( $s_ui[ 'folded_logo_svg_code' ] ) ? stripslashes( $s_ui['folded_logo_svg_code'] ) : '<svg width="100%" height="100%" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><g id="symbol"><path id="shape" d="M15.9696,0.0236995c0,8.32649 -6.7039,15.9371 -15.9683,15.9371c0,0 5.84872,-2.14486 5.68203,-7.04925c-0.0980505,-2.88473 -2.06481,-4.29957 -3.67372,-5.44312c-1.8963,-1.3478 -1.56706,-3.44471 1.34257,-3.44471l12.6174,0ZM9.27225,11.5944c3.49465,-2.80576 4.99114,-6.67883 5.41839,-9.26902l-7.91428,0l-0.834389,1.56044c0.284093,0.31935 0.570331,0.6898 0.834389,1.11327l1.79116,-0.309442c0.457748,0.898381 0.771241,1.86321 0.92897,2.85907l-1.58113,0.777954c0.0455485,0.20659 0.0687535,1.18751 0.0193131,1.4598l1.56182,0.768451c-0.0555705,0.350859 -0.130475,0.697865 -0.22424,1.03947Z" style="fill:url(#tag2);"/><path id="shadows" d="M8.54986,13.4924c-1.01626,0.663045 -2.35867,1.26045 -3.18747,1.53768c0,0 2.30394,-1.8861 2.56787,-5.24603l0.533316,0.269613c-0.340321,2.09068 -1.13657,3.30955 -1.13657,3.30955l1.22727,0.120014c0.317489,-0.660363 0.563817,-1.32208 0.718093,-1.88926l0.458832,-0.381279c-0.112034,0.638477 -0.335168,1.31691 -0.649191,1.93443c-0.191818,0.137128 -0.536056,0.35338 -0.536056,0.35338l0.00390654,-0.0081079ZM6.77664,4.99587c0.602614,0.937207 0.971711,2.05814 1.14732,3.3313l0.489239,-0.240977c-0.146962,-1.11008 -0.482045,-2.18394 -1.07784,-3.18893l-0.558717,0.0986059ZM14.6946,2.31977l1.10857,0c-0.224981,1.28992 -0.428317,2.05312 -0.788858,3.10085c0.206253,-2.26491 -0.144487,-2.79019 -0.31971,-3.10085ZM5.93754,3.88564c-0.96441,-1.10628 -1.86078,-1.56039 -1.86078,-1.56039l2.69968,0l-0.838897,1.56039Z" style="fill:#000;fill-opacity:0.25098;"/></g><defs><linearGradient id="tag2" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0.0201296,15.8522,-15.8522,0.0201296,0.736504,0.127337)"><stop offset="0%" style="stop-color:'.StickyAdmin::$config['colors']['adminmenu']['hl'][1].';stop-opacity:1"/><stop offset="100%" style="stop-color:'.StickyAdmin::$config['colors']['adminmenu']['hl'][0].';stop-opacity:1"/></linearGradient></defs></svg>' );
                break;

            case 'image':
                self::$config['logo']['image_path']     = ( ( isset( $s_ui[ 'nav_custom_logo_image' ][ 'src' ] ) && $s_ui[ 'nav_custom_logo_image']['src'] != '' ) ? $s_ui[ 'nav_custom_logo_image' ][ 'src' ] : STICKY_ASSETS . 'sticky-logo-' . self::$config['colors']['adminmenu']['color'] . '.png' );
                self::$config['logo']['show']           = '<img src="' . self::$config['logo']['image_path'] . '" alt="'. __( 'Logo', '_sticky_' ). '" />';
                self::$config['logo']['show_folded']    = ( ( isset( $s_ui[ 'folded_logo_image' ][ 'src' ] ) && $s_ui[ 'folded_logo_image' ][ 'src' ] != '' ) ? '<img src="' . $s_ui[ 'folded_logo_image' ][ 'src' ] . '" alt="'. __( 'Logo', '_sticky_' ). '" />' : self::$config['logo']['show_folded'] );
                break;

            case 'text':
                self::$config['logo']['show']           = ( ( isset( $s_ui[ 'nav_custom_logo_text' ] ) && $s_ui[ 'nav_custom_logo_text' ] != '' ) ? esc_attr( $s_ui[ 'nav_custom_logo_text' ] ) : __( 'Sticky', '_sticky_' ) ); 
                self::$config['logo']['show_folded']    = ( ( isset( $s_ui[ 'nav_custom_logo_letter' ] ) && $s_ui[ 'nav_custom_logo_letter' ] != '' ) ? substr( esc_attr( $s_ui[ 'nav_custom_logo_letter' ] ), 0, 2 ) : __( 'st', '_sticky_' ) ); 
                break;
        }

        // Login Page
        // self::$config['login']['logo_color'] = ( sticky_luminance( self::$config['login']['form_bg'] ) ? 1 : 0 );
        // self::$config['login']['logo_image'] = ( isset( $s_ui[ 'logo_image' ][ 'src' ] ) ? $s_ui['logo_image']['src'] : STICKY_ASSETS . STICKY_LOGO . '-' . ( ( self::$config['login']['logo_color'] ) ? 'black' : 'white' ) . '.png' );
        // self::$config['login']['logo_svg']   = ( isset( $s_ui[ 'login_logo_svg_code' ] ) && $s_ui[ 'login_logo_svg_code' ] != '' ) ? base64_encode( stripslashes( $s_ui[ 'login_logo_svg_code' ] ) ) : ( ( $logo_color )
        //         ? 'PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJTdGlja3lMb2dvIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjQwMy43MTFweCIgaGVpZ2h0PSIxMzMuNDEycHgiIHZpZXdCb3g9Ii05LjkxMiAyODYuMzM2IDQwMy43MTEgMTMzLjQxMiINCgkgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAtOS45MTIgMjg2LjMzNiA0MDMuNzExIDEzMy40MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGZpbGw9ImJsYWNrIj4NCjxwYXRoIGlkPSJTdGlja3lHZWFyIiBkPSJNMTE1LjU3NSwzNTMuMDQyYzAtMy41NDgtMC4zMTYtNy4wMi0wLjg5My0xMC40MDJsMy4xODEtOC44ODZjLTMuMDEyLTkuOTg1LTguMzAzLTE4Ljk3Ni0xNS4yNjYtMjYuMzgyDQoJbC05LjI0LTEuNjc5Yy01LjMzMi00LjQzOC0xMS40MjMtNy45OTItMTguMDUzLTEwLjQzN2wtNi4wNjQtNy4xNTFjLTQuODk3LTEuMTQ1LTkuOTk0LTEuNzctMTUuMjQtMS43N3MtMTAuMzQzLDAuNjI1LTE1LjI0LDEuNzcNCglsLTYuMDY0LDcuMTUxYy02LjYzLDIuNDQ0LTEyLjcyMSw1Ljk5OS0xOC4wNTMsMTAuNDM3bC05LjI0LDEuNjc5Yy02Ljk2Myw3LjQwNi0xMi4yNTQsMTYuMzk2LTE1LjI2NiwyNi4zODJsMy4xODEsOC44ODYNCgljLTAuNTc2LDMuMzgzLTAuODkzLDYuODU0LTAuODkzLDEwLjQwMmMwLDMuNTY3LDAuMzA5LDcuMDU4LDAuODczLDEwLjQ1OWwtMy4yMTEsOC45N2MyLjkyMSw5Ljg5MSw4LjA0LDE4LjgwMSwxNC44NDQsMjYuMTU1DQoJbDkuMTg2LDEuNjdjNS40NjgsNC42MDYsMTEuNzg5LDguMjY2LDE4Ljc0OSwxMC43MzFsNS45NzcsNy4wNDdjNC44NDYsMS4wODMsOS45MSwxLjY3NCwxNS4xNTgsMS42NzQNCgljNS4yNDYsMCwxMC4zNDMtMC42MjUsMTUuMjQtMS43N2w2LjA2NS03LjE1MWM2LjYyOS0yLjQ0NSwxMi43MTktNS45OTksMTguMDUxLTEwLjQzNmw5LjI0MS0xLjY4DQoJYzYuOTYzLTcuNDA2LDEyLjI1NC0xNi4zOTYsMTUuMjY2LTI2LjM4MmwtMy4xODEtOC44ODZDMTE1LjI1OSwzNjAuMDYyLDExNS41NzUsMzU2LjU5LDExNS41NzUsMzUzLjA0MnogTTIuNTk2LDM1My4wNDINCgljMC0yOC4zOTEsMjMuMDE2LTUxLjQwNSw1MS40MDUtNTEuNDA1YzMuNDc5LDAsNi44NzYsMC4zNSwxMC4xNjEsMS4wMDljLTUuNzEyLDQuNzA0LTcuODI0LDYuMTc0LTEwLjE2MSw3LjM0OA0KCWMtMi4yNTgsMS4xMzUtNS4wNDMsMS45MjgtNy45NzksMi43NTRjLTE4Ljg2NCwzLjcxNS0zMy4wOTMsMjAuMzQyLTMzLjA5Myw0MC4yOTVjMCwxOC4wNSwxMS4yMTcsMzMuMzc5LDI3LjU2NiwzOC44OQ0KCWMtMi45NDIsMi4yMzktNS40MDksNC43NDgtNy44NjUsNy44MDdjLTAuMDQ0LDAuMDU2LTAuMDcsMC4xMTUtMC4wODcsMC4xNzhDMTQuNTg1LDM5MS44NjIsMi41OTYsMzczLjkxMiwyLjU5NiwzNTMuMDQyeg0KCSBNMzYuMjQ4LDMzMy45ODNjLTAuMjIxLTcuNTY4LDYuMjQzLTkuMzE3LDEyLjk5NC0xMS4xMDVjMS41NTEtMC4yNDQsMy4xNC0wLjM3Miw0Ljc1OS0wLjM3MmMxNi44NjQsMCwzMC41MzUsMTMuNjcyLDMwLjUzNSwzMC41MzYNCgljMCw0LjcxNC0xLjA2OSw5LjE3OC0yLjk3NywxMy4xNjNDNzQuOTAxLDM0Ni4yODYsMzYuNjk4LDM0OS41MDcsMzYuMjQ4LDMzMy45ODN6IE03MS44NDMsMzcyLjU5M2MwLDcuOTItNy4zNzQsOS4yNzItMTMuMzcsMTAuNjU2DQoJYy0xLjQ2LDAuMjE0LTIuOTUyLDAuMzI5LTQuNDcyLDAuMzI5Yy0xNy4zNjQsMC0zMC41MzUtMTMuNjcyLTMwLjUzNS0zMC41MzZjMC00LjY2MiwxLjA0OS05LjA3OCwyLjkxNy0xMy4wMzENCglDMzIuNjQ2LDM2MC4wNDIsNzEuODQzLDM1NS4zMSw3MS44NDMsMzcyLjU5M3ogTTU0LjAwMSw0MDQuNDQ3Yy0zLjYzOSwwLTcuMTY4LTAuMzU3LTEwLjU2LTEuMDM3bDAsMA0KCWMzLjgwNC0zLjc1MSw5LjAyNy03LjI3OCwxNi4wMTEtOS42NTZjMy4wMjUtMC40LDUuOTQ3LTEuMTMsOC43MjgtMi4xNTJjMC4yMzEtMC4wMzgsNC44ODEtMi4wMzksNi4wNjMtMi44MTUNCgljMTIuNDM4LTcuMDYsMjAuODMtMjAuNDIxLDIwLjgzLTM1Ljc0NGMwLTE4LjE3Mi0xMS44MDEtMzMuNTg0LTI4LjE1Ni0zOC45OThjMi43OTYtMi4wNzQsNS4zNy00LjQzMyw4LjA2My03LjkzDQoJYzE3LjkyOSw4LjAyNywzMC40MjcsMjYuMDEzLDMwLjQyNyw0Ni45MjhDMTA1LjQwNiwzODEuNDMzLDgyLjM5Myw0MDQuNDQ3LDU0LjAwMSw0MDQuNDQ3eiIvPg0KPGcgaWQ9IlN1YnRpdGxlIiBvcGFjaXR5PSIwLjciPg0KCTxwYXRoIGQ9Ik0xNDQuODE1LDQwOC40NDdsLTAuODgzLTIuMzcyaC02LjAwNGwtMC44ODMsMi4zNzJoLTMuMzhsNS4zOTYtMTQuMDA1aDMuNzM4bDUuMzk2LDE0LjAwNUgxNDQuODE1eiBNMTQwLjkzMSwzOTcuNDI1DQoJCWwtMi4xODQsNi4wMjVoNC4zNjdMMTQwLjkzMSwzOTcuNDI1eiIvPg0KCTxwYXRoIGQ9Ik0xNTUuMzgsNDA4LjQ0N3YtMTQuMDA1aDUuNTIxYzQuMzg5LDAsNy40MzQsMi43OTMsNy40MzQsNi45OTJjMCw0LjI0MS0zLjA0NSw3LjAxMy03LjQxMiw3LjAxM0gxNTUuMzh6IE0xNjUuMjksNDAxLjQzNQ0KCQljMC0yLjQ1Ny0xLjUxMi00LjM2Ny00LjM2Ny00LjM2N2gtMi41NjJ2OC43NTZoMi41NEMxNjMuNjczLDQwNS44MjMsMTY1LjI5LDQwMy44MjgsMTY1LjI5LDQwMS40MzV6Ii8+DQoJPHBhdGggZD0iTTE4OC41MTUsNDA4LjQ0N3YtMTAuMDk5bC0zLjk0NywxMC4wOTloLTEuMzAybC0zLjk0Ny0xMC4wOTl2MTAuMDk5aC0yLjk4MXYtMTQuMDA1aDQuMTc4bDMuNDAyLDguNzU2bDMuNC04Ljc1Nmg0LjE5OQ0KCQl2MTQuMDA1SDE4OC41MTV6Ii8+DQoJPHBhdGggZD0iTTIwMC4xNzIsNDA4LjQ0N3YtMTQuMDA1aDIuOTgxdjE0LjAwNUgyMDAuMTcyeiIvPg0KCTxwYXRoIGQ9Ik0yMjEuNDY0LDQwOC40NDdsLTYuNjc3LTkuMTM0djkuMTM0aC0yLjk4MXYtMTQuMDA1aDMuMDY1bDYuNDg3LDguNzk4di04Ljc5OGgyLjk4MnYxNC4wMDVIMjIxLjQ2NHoiLz4NCgk8cGF0aCBkPSJNMjQ0LjI3MSw0MDguNDQ3di0xNC4wMDVoNi41NTFjMy4wNDQsMCw0LjcwMywyLjA1OSw0LjcwMyw0LjUxNWMwLDIuNDM2LTEuNjgsNC40OTMtNC43MDMsNC40OTNoLTMuNTY5djQuOTk3SDI0NC4yNzF6DQoJCSBNMjUyLjQ4MSwzOTguOTU3YzAtMS4xNzYtMC45MDMtMS44OS0yLjA3OS0xLjg5aC0zLjE0OXYzLjc1OGgzLjE0OUMyNTEuNTc4LDQwMC44MjUsMjUyLjQ4MSw0MDAuMTEyLDI1Mi40ODEsMzk4Ljk1N3oiLz4NCgk8cGF0aCBkPSJNMjcyLjk1Niw0MDguNDQ3bC0wLjg4My0yLjM3MmgtNi4wMDRsLTAuODgzLDIuMzcyaC0zLjM4bDUuMzk2LTE0LjAwNWgzLjczOGw1LjM5NiwxNC4wMDVIMjcyLjk1NnogTTI2OS4wNzEsMzk3LjQyNQ0KCQlsLTIuMTg0LDYuMDI1aDQuMzY3TDI2OS4wNzEsMzk3LjQyNXoiLz4NCgk8cGF0aCBkPSJNMjkzLjE3OSw0MDguNDQ3bC02LjY3Ny05LjEzNHY5LjEzNGgtMi45ODF2LTE0LjAwNWgzLjA2NWw2LjQ4Nyw4Ljc5OHYtOC43OThoMi45ODJ2MTQuMDA1SDI5My4xNzl6Ii8+DQoJPHBhdGggZD0iTTMwNC43MDksNDA4LjQ0N3YtMTQuMDA1aDkuOTF2Mi42MjVoLTYuOTI5djIuOTM5aDYuNzgxdjIuNjI1aC02Ljc4MXYzLjE5MWg2LjkyOXYyLjYyNEgzMDQuNzA5eiIvPg0KCTxwYXRoIGQ9Ik0zMjIuNzA2LDQwOC40NDd2LTE0LjAwNWgzLjAwMnYxMS4zODFoNS45MjJ2Mi42MjRIMzIyLjcwNnoiLz4NCjwvZz4NCjxnIGlkPSJUaXRsZSI+DQoJPHBhdGggaWQ9InkiIGQ9Ik0zNTAuMTk2LDM5OC40NDFsNC44OTktNy42YzMuNTAxLDQuMzk5LDkuMTAxLDYuMiwxNC42MDIsNi4yYzguNSwwLDEzLjYwMS00LjgwMSwxMy42MDEtMTMuNDAxdi01LjYNCgkJYy0zLjQsMy44LTkuNCw3LjYtMTcuMDAxLDcuNmMtMTAuNCwwLTE1LjYwMS01LjUtMTUuNjAxLTE1LjMwMXYtMzIuNjAyaDEwLjV2MjguNzAxYzAsNy41MDEsMy44MDEsOS45MDEsOS44MDEsOS45MDENCgkJYzUuMzAxLDAsOS45LTMuMTAxLDEyLjMwMS02LjMwMXYtMzIuMzAyaDEwLjUwMXY0NS45MDJjMCwxNC41MDEtMTAuMjAxLDIyLjAwMi0yNC4xMDIsMjIuMDAyDQoJCUMzNjEuNTk3LDQwNS42NDMsMzU1LjQ5Niw0MDMuMzQyLDM1MC4xOTYsMzk4LjQ0MXoiLz4NCgk8cGF0aCBpZD0iayIgZD0iTTMzMC4yNDksMzg2LjA0MWwtMTQuNzAxLTIwLjAwMWwtNi44LDd2MTMuMDAxaC0xMC41MDJ2LTY2LjcwNGgxMC41MDJ2NDEuNzAybDIxLjMwMS0yMy4zMDFoMTMuMDAxbC0yMC4wMDIsMjEuOTAxDQoJCWwyMC40MDEsMjYuNDAxSDMzMC4yNDl6Ii8+DQoJPHBhdGggaWQ9ImMiIGQ9Ik0yNDcuMDQ4LDM2MS44NGMwLTE0LjYwMiwxMC4zLTI1LjMwMiwyNC45MDEtMjUuMzAyYzkuNSwwLDE1LjEwMiw0LDE4LjUwMSw4LjYwMWwtNi45LDYuMw0KCQljLTIuNy0zLjgtNi40LTUuNi0xMS4xMDEtNS42Yy04LjcwMSwwLTE0LjYwMiw2LjYwMS0xNC42MDIsMTYuMDAxczUuOSwxNi4xMDEsMTQuNjAyLDE2LjEwMWM0LjcsMCw4LjQtMiwxMS4xMDEtNS44bDYuOSw2LjUNCgkJYy0zLjM5OSw0LjUtOS4wMDEsOC42MDEtMTguNTAxLDguNjAxQzI1Ny4zNDgsMzg3LjI0MSwyNDcuMDQ4LDM3Ni40NCwyNDcuMDQ4LDM2MS44NHoiLz4NCgk8cGF0aCBpZD0iaSIgZD0iTTIyOC4xNDgsMzI1LjMzN2MwLTMuNiwyLjktNi41LDYuNS02LjVjMy42MDEsMCw2LjUsMi45LDYuNSw2LjVjMCwzLjYwMS0yLjg5OSw2LjUwMS02LjUsNi41MDENCgkJQzIzMS4wNDksMzMxLjgzOCwyMjguMTQ4LDMyOC45MzgsMjI4LjE0OCwzMjUuMzM3eiBNMjI5LjM0OCwzODYuMDQxdi00OC4zMDNoMTAuNTAydjQ4LjMwM0gyMjkuMzQ4eiIvPg0KCTxwYXRoIGlkPSJ0IiBkPSJNMjAxLjA0OCwzNzQuNzR2LTI3LjkwMWgtOC4wMDF2LTkuMTAxaDguMDAxdi0xMy4yMDFoMTAuNTAxdjEzLjIwMWg5LjgwMXY5LjEwMWgtOS44MDF2MjUuMzAyDQoJCWMwLDMuMywxLjYsNS44LDQuNiw1LjhjMiwwLDMuODAxLTAuOSw0LjYwMS0xLjhsMi41MDEsOGMtMS45LDEuNy01LjAwMSwzLjEwMS05LjgwMSwzLjEwMQ0KCQlDMjA1LjI0OCwzODcuMjQxLDIwMS4wNDgsMzgyLjg0MSwyMDEuMDQ4LDM3NC43NHoiLz4NCgk8cGF0aCBpZD0icyIgZD0iTTEzMy41NSwzNzYuNjQxbDYuNi05LjEwMWM0LjUsNC45LDExLjgwMSw5LjMwMSwyMS4xMDIsOS4zMDFjOS42MDEsMCwxMy4zMDEtNC43LDEzLjMwMS05LjIwMQ0KCQljMC0xNC4wMDEtMzguODAyLTUuMy0zOC44MDItMjkuODAyYzAtMTEuMTAxLDkuNjAxLTE5LjYwMSwyNC4zMDEtMTkuNjAxYzEwLjMwMSwwLDE4LjgwMiwzLjM5OSwyNC45MDEsOS40bC02LjYsOC43DQoJCWMtNS4zMDEtNS4zLTEyLjQwMS03LjctMTkuNDAyLTcuN2MtNi44LDAtMTEuMjAxLDMuNC0xMS4yMDEsOC4zMDFjMCwxMi41LDM4LjgwMiw0LjgsMzguODAyLDI5LjYwMg0KCQljMCwxMS4xMDEtNy45LDIwLjcwMS0yNS44MDEsMjAuNzAxQzE0OC40NTEsMzg3LjI0MSwxMzkuNTUxLDM4Mi44NDEsMTMzLjU1LDM3Ni42NDF6Ii8+DQo8L2c+DQo8L3N2Zz4='
        //         : 'PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJTdGlja3lMb2dvIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjQwMy43MTFweCIgaGVpZ2h0PSIxMzMuNDEycHgiIHZpZXdCb3g9Ii05LjkxMiAyODYuMzM2IDQwMy43MTEgMTMzLjQxMiINCgkgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAtOS45MTIgMjg2LjMzNiA0MDMuNzExIDEzMy40MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGZpbGw9IndoaXRlIj4NCjxwYXRoIGlkPSJTdGlja3lHZWFyIiBkPSJNMTE1LjU3NSwzNTMuMDQyYzAtMy41NDgtMC4zMTYtNy4wMi0wLjg5My0xMC40MDJsMy4xODEtOC44ODZjLTMuMDEyLTkuOTg1LTguMzAzLTE4Ljk3Ni0xNS4yNjYtMjYuMzgyDQoJbC05LjI0LTEuNjc5Yy01LjMzMi00LjQzOC0xMS40MjMtNy45OTItMTguMDUzLTEwLjQzN2wtNi4wNjQtNy4xNTFjLTQuODk3LTEuMTQ1LTkuOTk0LTEuNzctMTUuMjQtMS43N3MtMTAuMzQzLDAuNjI1LTE1LjI0LDEuNzcNCglsLTYuMDY0LDcuMTUxYy02LjYzLDIuNDQ0LTEyLjcyMSw1Ljk5OS0xOC4wNTMsMTAuNDM3bC05LjI0LDEuNjc5Yy02Ljk2Myw3LjQwNi0xMi4yNTQsMTYuMzk2LTE1LjI2NiwyNi4zODJsMy4xODEsOC44ODYNCgljLTAuNTc2LDMuMzgzLTAuODkzLDYuODU0LTAuODkzLDEwLjQwMmMwLDMuNTY3LDAuMzA5LDcuMDU4LDAuODczLDEwLjQ1OWwtMy4yMTEsOC45N2MyLjkyMSw5Ljg5MSw4LjA0LDE4LjgwMSwxNC44NDQsMjYuMTU1DQoJbDkuMTg2LDEuNjdjNS40NjgsNC42MDYsMTEuNzg5LDguMjY2LDE4Ljc0OSwxMC43MzFsNS45NzcsNy4wNDdjNC44NDYsMS4wODMsOS45MSwxLjY3NCwxNS4xNTgsMS42NzQNCgljNS4yNDYsMCwxMC4zNDMtMC42MjUsMTUuMjQtMS43N2w2LjA2NS03LjE1MWM2LjYyOS0yLjQ0NSwxMi43MTktNS45OTksMTguMDUxLTEwLjQzNmw5LjI0MS0xLjY4DQoJYzYuOTYzLTcuNDA2LDEyLjI1NC0xNi4zOTYsMTUuMjY2LTI2LjM4MmwtMy4xODEtOC44ODZDMTE1LjI1OSwzNjAuMDYyLDExNS41NzUsMzU2LjU5LDExNS41NzUsMzUzLjA0MnogTTIuNTk2LDM1My4wNDINCgljMC0yOC4zOTEsMjMuMDE2LTUxLjQwNSw1MS40MDUtNTEuNDA1YzMuNDc5LDAsNi44NzYsMC4zNSwxMC4xNjEsMS4wMDljLTUuNzEyLDQuNzA0LTcuODI0LDYuMTc0LTEwLjE2MSw3LjM0OA0KCWMtMi4yNTgsMS4xMzUtNS4wNDMsMS45MjgtNy45NzksMi43NTRjLTE4Ljg2NCwzLjcxNS0zMy4wOTMsMjAuMzQyLTMzLjA5Myw0MC4yOTVjMCwxOC4wNSwxMS4yMTcsMzMuMzc5LDI3LjU2NiwzOC44OQ0KCWMtMi45NDIsMi4yMzktNS40MDksNC43NDgtNy44NjUsNy44MDdjLTAuMDQ0LDAuMDU2LTAuMDcsMC4xMTUtMC4wODcsMC4xNzhDMTQuNTg1LDM5MS44NjIsMi41OTYsMzczLjkxMiwyLjU5NiwzNTMuMDQyeg0KCSBNMzYuMjQ4LDMzMy45ODNjLTAuMjIxLTcuNTY4LDYuMjQzLTkuMzE3LDEyLjk5NC0xMS4xMDVjMS41NTEtMC4yNDQsMy4xNC0wLjM3Miw0Ljc1OS0wLjM3MmMxNi44NjQsMCwzMC41MzUsMTMuNjcyLDMwLjUzNSwzMC41MzYNCgljMCw0LjcxNC0xLjA2OSw5LjE3OC0yLjk3NywxMy4xNjNDNzQuOTAxLDM0Ni4yODYsMzYuNjk4LDM0OS41MDcsMzYuMjQ4LDMzMy45ODN6IE03MS44NDMsMzcyLjU5M2MwLDcuOTItNy4zNzQsOS4yNzItMTMuMzcsMTAuNjU2DQoJYy0xLjQ2LDAuMjE0LTIuOTUyLDAuMzI5LTQuNDcyLDAuMzI5Yy0xNy4zNjQsMC0zMC41MzUtMTMuNjcyLTMwLjUzNS0zMC41MzZjMC00LjY2MiwxLjA0OS05LjA3OCwyLjkxNy0xMy4wMzENCglDMzIuNjQ2LDM2MC4wNDIsNzEuODQzLDM1NS4zMSw3MS44NDMsMzcyLjU5M3ogTTU0LjAwMSw0MDQuNDQ3Yy0zLjYzOSwwLTcuMTY4LTAuMzU3LTEwLjU2LTEuMDM3bDAsMA0KCWMzLjgwNC0zLjc1MSw5LjAyNy03LjI3OCwxNi4wMTEtOS42NTZjMy4wMjUtMC40LDUuOTQ3LTEuMTMsOC43MjgtMi4xNTJjMC4yMzEtMC4wMzgsNC44ODEtMi4wMzksNi4wNjMtMi44MTUNCgljMTIuNDM4LTcuMDYsMjAuODMtMjAuNDIxLDIwLjgzLTM1Ljc0NGMwLTE4LjE3Mi0xMS44MDEtMzMuNTg0LTI4LjE1Ni0zOC45OThjMi43OTYtMi4wNzQsNS4zNy00LjQzMyw4LjA2My03LjkzDQoJYzE3LjkyOSw4LjAyNywzMC40MjcsMjYuMDEzLDMwLjQyNyw0Ni45MjhDMTA1LjQwNiwzODEuNDMzLDgyLjM5Myw0MDQuNDQ3LDU0LjAwMSw0MDQuNDQ3eiIvPg0KPGcgaWQ9IlN1YnRpdGxlIiBvcGFjaXR5PSIwLjciPg0KCTxwYXRoIGQ9Ik0xNDQuODE1LDQwOC40NDdsLTAuODgzLTIuMzcyaC02LjAwNGwtMC44ODMsMi4zNzJoLTMuMzhsNS4zOTYtMTQuMDA1aDMuNzM4bDUuMzk2LDE0LjAwNUgxNDQuODE1eiBNMTQwLjkzMSwzOTcuNDI1DQoJCWwtMi4xODQsNi4wMjVoNC4zNjdMMTQwLjkzMSwzOTcuNDI1eiIvPg0KCTxwYXRoIGQ9Ik0xNTUuMzgsNDA4LjQ0N3YtMTQuMDA1aDUuNTIxYzQuMzg5LDAsNy40MzQsMi43OTMsNy40MzQsNi45OTJjMCw0LjI0MS0zLjA0NSw3LjAxMy03LjQxMiw3LjAxM0gxNTUuMzh6IE0xNjUuMjksNDAxLjQzNQ0KCQljMC0yLjQ1Ny0xLjUxMi00LjM2Ny00LjM2Ny00LjM2N2gtMi41NjJ2OC43NTZoMi41NEMxNjMuNjczLDQwNS44MjMsMTY1LjI5LDQwMy44MjgsMTY1LjI5LDQwMS40MzV6Ii8+DQoJPHBhdGggZD0iTTE4OC41MTUsNDA4LjQ0N3YtMTAuMDk5bC0zLjk0NywxMC4wOTloLTEuMzAybC0zLjk0Ny0xMC4wOTl2MTAuMDk5aC0yLjk4MXYtMTQuMDA1aDQuMTc4bDMuNDAyLDguNzU2bDMuNC04Ljc1Nmg0LjE5OQ0KCQl2MTQuMDA1SDE4OC41MTV6Ii8+DQoJPHBhdGggZD0iTTIwMC4xNzIsNDA4LjQ0N3YtMTQuMDA1aDIuOTgxdjE0LjAwNUgyMDAuMTcyeiIvPg0KCTxwYXRoIGQ9Ik0yMjEuNDY0LDQwOC40NDdsLTYuNjc3LTkuMTM0djkuMTM0aC0yLjk4MXYtMTQuMDA1aDMuMDY1bDYuNDg3LDguNzk4di04Ljc5OGgyLjk4MnYxNC4wMDVIMjIxLjQ2NHoiLz4NCgk8cGF0aCBkPSJNMjQ0LjI3MSw0MDguNDQ3di0xNC4wMDVoNi41NTFjMy4wNDQsMCw0LjcwMywyLjA1OSw0LjcwMyw0LjUxNWMwLDIuNDM2LTEuNjgsNC40OTMtNC43MDMsNC40OTNoLTMuNTY5djQuOTk3SDI0NC4yNzF6DQoJCSBNMjUyLjQ4MSwzOTguOTU3YzAtMS4xNzYtMC45MDMtMS44OS0yLjA3OS0xLjg5aC0zLjE0OXYzLjc1OGgzLjE0OUMyNTEuNTc4LDQwMC44MjUsMjUyLjQ4MSw0MDAuMTEyLDI1Mi40ODEsMzk4Ljk1N3oiLz4NCgk8cGF0aCBkPSJNMjcyLjk1Niw0MDguNDQ3bC0wLjg4My0yLjM3MmgtNi4wMDRsLTAuODgzLDIuMzcyaC0zLjM4bDUuMzk2LTE0LjAwNWgzLjczOGw1LjM5NiwxNC4wMDVIMjcyLjk1NnogTTI2OS4wNzEsMzk3LjQyNQ0KCQlsLTIuMTg0LDYuMDI1aDQuMzY3TDI2OS4wNzEsMzk3LjQyNXoiLz4NCgk8cGF0aCBkPSJNMjkzLjE3OSw0MDguNDQ3bC02LjY3Ny05LjEzNHY5LjEzNGgtMi45ODF2LTE0LjAwNWgzLjA2NWw2LjQ4Nyw4Ljc5OHYtOC43OThoMi45ODJ2MTQuMDA1SDI5My4xNzl6Ii8+DQoJPHBhdGggZD0iTTMwNC43MDksNDA4LjQ0N3YtMTQuMDA1aDkuOTF2Mi42MjVoLTYuOTI5djIuOTM5aDYuNzgxdjIuNjI1aC02Ljc4MXYzLjE5MWg2LjkyOXYyLjYyNEgzMDQuNzA5eiIvPg0KCTxwYXRoIGQ9Ik0zMjIuNzA2LDQwOC40NDd2LTE0LjAwNWgzLjAwMnYxMS4zODFoNS45MjJ2Mi42MjRIMzIyLjcwNnoiLz4NCjwvZz4NCjxnIGlkPSJUaXRsZSI+DQoJPHBhdGggaWQ9InkiIGQ9Ik0zNTAuMTk2LDM5OC40NDFsNC44OTktNy42YzMuNTAxLDQuMzk5LDkuMTAxLDYuMiwxNC42MDIsNi4yYzguNSwwLDEzLjYwMS00LjgwMSwxMy42MDEtMTMuNDAxdi01LjYNCgkJYy0zLjQsMy44LTkuNCw3LjYtMTcuMDAxLDcuNmMtMTAuNCwwLTE1LjYwMS01LjUtMTUuNjAxLTE1LjMwMXYtMzIuNjAyaDEwLjV2MjguNzAxYzAsNy41MDEsMy44MDEsOS45MDEsOS44MDEsOS45MDENCgkJYzUuMzAxLDAsOS45LTMuMTAxLDEyLjMwMS02LjMwMXYtMzIuMzAyaDEwLjUwMXY0NS45MDJjMCwxNC41MDEtMTAuMjAxLDIyLjAwMi0yNC4xMDIsMjIuMDAyDQoJCUMzNjEuNTk3LDQwNS42NDMsMzU1LjQ5Niw0MDMuMzQyLDM1MC4xOTYsMzk4LjQ0MXoiLz4NCgk8cGF0aCBpZD0iayIgZD0iTTMzMC4yNDksMzg2LjA0MWwtMTQuNzAxLTIwLjAwMWwtNi44LDd2MTMuMDAxaC0xMC41MDJ2LTY2LjcwNGgxMC41MDJ2NDEuNzAybDIxLjMwMS0yMy4zMDFoMTMuMDAxbC0yMC4wMDIsMjEuOTAxDQoJCWwyMC40MDEsMjYuNDAxSDMzMC4yNDl6Ii8+DQoJPHBhdGggaWQ9ImMiIGQ9Ik0yNDcuMDQ4LDM2MS44NGMwLTE0LjYwMiwxMC4zLTI1LjMwMiwyNC45MDEtMjUuMzAyYzkuNSwwLDE1LjEwMiw0LDE4LjUwMSw4LjYwMWwtNi45LDYuMw0KCQljLTIuNy0zLjgtNi40LTUuNi0xMS4xMDEtNS42Yy04LjcwMSwwLTE0LjYwMiw2LjYwMS0xNC42MDIsMTYuMDAxczUuOSwxNi4xMDEsMTQuNjAyLDE2LjEwMWM0LjcsMCw4LjQtMiwxMS4xMDEtNS44bDYuOSw2LjUNCgkJYy0zLjM5OSw0LjUtOS4wMDEsOC42MDEtMTguNTAxLDguNjAxQzI1Ny4zNDgsMzg3LjI0MSwyNDcuMDQ4LDM3Ni40NCwyNDcuMDQ4LDM2MS44NHoiLz4NCgk8cGF0aCBpZD0iaSIgZD0iTTIyOC4xNDgsMzI1LjMzN2MwLTMuNiwyLjktNi41LDYuNS02LjVjMy42MDEsMCw2LjUsMi45LDYuNSw2LjVjMCwzLjYwMS0yLjg5OSw2LjUwMS02LjUsNi41MDENCgkJQzIzMS4wNDksMzMxLjgzOCwyMjguMTQ4LDMyOC45MzgsMjI4LjE0OCwzMjUuMzM3eiBNMjI5LjM0OCwzODYuMDQxdi00OC4zMDNoMTAuNTAydjQ4LjMwM0gyMjkuMzQ4eiIvPg0KCTxwYXRoIGlkPSJ0IiBkPSJNMjAxLjA0OCwzNzQuNzR2LTI3LjkwMWgtOC4wMDF2LTkuMTAxaDguMDAxdi0xMy4yMDFoMTAuNTAxdjEzLjIwMWg5LjgwMXY5LjEwMWgtOS44MDF2MjUuMzAyDQoJCWMwLDMuMywxLjYsNS44LDQuNiw1LjhjMiwwLDMuODAxLTAuOSw0LjYwMS0xLjhsMi41MDEsOGMtMS45LDEuNy01LjAwMSwzLjEwMS05LjgwMSwzLjEwMQ0KCQlDMjA1LjI0OCwzODcuMjQxLDIwMS4wNDgsMzgyLjg0MSwyMDEuMDQ4LDM3NC43NHoiLz4NCgk8cGF0aCBpZD0icyIgZD0iTTEzMy41NSwzNzYuNjQxbDYuNi05LjEwMWM0LjUsNC45LDExLjgwMSw5LjMwMSwyMS4xMDIsOS4zMDFjOS42MDEsMCwxMy4zMDEtNC43LDEzLjMwMS05LjIwMQ0KCQljMC0xNC4wMDEtMzguODAyLTUuMy0zOC44MDItMjkuODAyYzAtMTEuMTAxLDkuNjAxLTE5LjYwMSwyNC4zMDEtMTkuNjAxYzEwLjMwMSwwLDE4LjgwMiwzLjM5OSwyNC45MDEsOS40bC02LjYsOC43DQoJCWMtNS4zMDEtNS4zLTEyLjQwMS03LjctMTkuNDAyLTcuN2MtNi44LDAtMTEuMjAxLDMuNC0xMS4yMDEsOC4zMDFjMCwxMi41LDM4LjgwMiw0LjgsMzguODAyLDI5LjYwMg0KCQljMCwxMS4xMDEtNy45LDIwLjcwMS0yNS44MDEsMjAuNzAxQzE0OC40NTEsMzg3LjI0MSwxMzkuNTUxLDM4Mi44NDEsMTMzLjU1LDM3Ni42NDF6Ii8+DQo8L2c+DQo8L3N2Zz4='
        //     ) 

    }

    /**
     *
     * Statistics Config
     * -----------------------
     *
     * @since 1.0.5
     * @author Dorian Tudorache
     *
     */
    public static function statistics_config() {
        global $wpdb;

        if ( ! self::$config['statistics'] ) 
            return;
        
        self::$config['statistics'] = array(
            // Overall stats config
            'ignore_spam'       => ( isset( $s_ui[ 's_s_ignore_spam' ] ) && $s_ui[ 's_s_ignore_spam' ] ) ? 1 : 0,
            'tracker_active'    => ( isset( $s_ui[ 's_s_tracker' ] ) && $s_ui[ 's_s_tracker' ] ) ? 1 : 1,
            'ignore_admin'      => ( isset( $s_ui[ 's_s_ignore_admin' ] ) && $s_ui[ 's_s_ignore_admin' ] ) ? 1 : 0,
            'track_users'       => ( isset( $s_ui[ 's_s_track_users' ] ) && $s_ui[ 's_s_track_users' ] ) ? 1 : 0,
            'purge_interval'    => ( isset( $s_ui[ 's_s_purge_time' ] ) ? $s_ui[ 's_s_purge_time' ] : 150 ),
            'ignore_ips'        => ( isset( $s_ui[ 's_s_exclude_ips' ] ) ? $s_ui[ 's_s_exclude_ips' ] : '' ),
            'ignore_countries'  => ( isset( $s_ui[ 's_s_exclude_country' ] ) ? $s_ui[ 's_s_exclude_country' ] : '' ),
            'ignore_uas'        => ( isset( $s_ui[ 's_s_exclude_ua' ] ) ? $s_ui [ 's_s_exclude_ua' ] : '' ),
            'ignore_users'      => ( isset( $s_ui[ 's_s_exclude_user' ] ) ? $s_ui [ 's_s_exclude_user' ] : '' ),
            'ignore_pages'      => ( isset( $s_ui[ 's_s_exclude_page' ] ) ? $s_ui[ 's_s_exclude_page' ] : '' ),
            'extend_session'    => ( isset( $s_ui[ 's_s_extend_visit'] ) ? $s_ui[ 's_s_extend_visit' ] : false )
        );

        // Configuration from down here it's only for the dashboard
        if ( $GLOBALS['pagenow'] != 'index.php' ) 
            return;

        $week_start = get_option('start_of_week'); // Get Wordpress option
        $now        = current_time('mysql');
        $week_mode  = ( $week_start == 1 ) ? 1 : 0;

        self::$config['statistics'] += array(
            // Visits
            // ------------------------
            'visits'            => $wpdb->get_results("SELECT `v`.`date`, COUNT(`v`.`id`) AS `hits`, `p`.`hits` AS `pageviews` FROM `{$wpdb->prefix}sticky_stats_visits` AS `v` JOIN `{$wpdb->prefix}sticky_stats_pageviews` AS `p` ON (`v`.`date` = `p`.`date`) GROUP BY `date` ORDER BY `v`.`date` DESC LIMIT 11", ARRAY_A),
            'total_visits'      => $wpdb->get_row("SELECT COUNT(`id`) FROM `{$wpdb->prefix}sticky_stats_visits`", ARRAY_N),

            // Daily
            'today_visits'      => $wpdb->get_row("SELECT COUNT(id) FROM `{$wpdb->prefix}sticky_stats_visits` WHERE DATE(`date`) = DATE('". $now ."')", ARRAY_N),
            'yesterday_visits'  => $wpdb->get_row("SELECT COUNT(id) FROM `{$wpdb->prefix}sticky_stats_visits` WHERE DATE(`date`) = DATE(DATE_SUB('". $now ."', INTERVAL 1 DAY))", ARRAY_N),
            
            // Weekly
            'this_week_visits'  => $wpdb->get_row("SELECT COUNT(id) FROM `{$wpdb->prefix}sticky_stats_visits` WHERE WEEK(`date`, $week_mode) = WEEK('". $now ."', $week_mode)", ARRAY_N),
            'last_week_visits'  => $wpdb->get_row("SELECT COUNT(id) FROM `{$wpdb->prefix}sticky_stats_visits` WHERE WEEK(`date`, $week_mode) = WEEK(DATE_SUB('". $now ."', INTERVAL 1 WEEK), $week_mode)", ARRAY_N),

            // Monthly
            'this_month_visits' => $wpdb->get_row("SELECT COUNT(id) FROM `{$wpdb->prefix}sticky_stats_visits` WHERE MONTH(`date`) = MONTH('". $now ."')", ARRAY_N),
            'last_month_visits' => $wpdb->get_row("SELECT COUNT(id) FROM `{$wpdb->prefix}sticky_stats_visits` WHERE MONTH(`date`) = MONTH(DATE_SUB('". $now ."', INTERVAL 1 MONTH))", ARRAY_N),
            'country_data'      => $wpdb->get_results("SELECT `country` AS `name`, COUNT(`id`) AS `count` FROM `{$wpdb->prefix}sticky_stats_visits` GROUP BY `country` ORDER BY `count` DESC", ARRAY_A),

            // Daily
            'today_pv'          => $wpdb->get_row("SELECT SUM(`hits`) FROM `{$wpdb->prefix}sticky_stats_pageviews` WHERE DATE(`date`) = DATE('". $now ."')", ARRAY_N),
            'yesterday_pv'      => $wpdb->get_row("SELECT SUM(`hits`) FROM `{$wpdb->prefix}sticky_stats_pageviews` WHERE DATE(`date`) = DATE(DATE_SUB('". $now ."', INTERVAL 1 DAY))", ARRAY_N),

            // Weekly
            'this_week_pv'      => $wpdb->get_row("SELECT SUM(`hits`) FROM `{$wpdb->prefix}sticky_stats_pageviews` WHERE WEEK(`date`, $week_mode) = WEEK('". $now ."', $week_mode)", ARRAY_N),
            'last_week_pv'      => $wpdb->get_row("SELECT COUNT(id) FROM `{$wpdb->prefix}sticky_stats_visits` WHERE MONTH(`date`) = MONTH(DATE_SUB('". $now ."', INTERVAL 1 MONTH))", ARRAY_N),

            // Monthly
            'this_month_pv'     => $wpdb->get_row("SELECT SUM(`hits`) FROM `{$wpdb->prefix}sticky_stats_pageviews` WHERE MONTH(`date`) = MONTH('". $now ."')", ARRAY_N),
            'last_month_pv'     => $wpdb->get_row("SELECT SUM(`hits`) FROM `{$wpdb->prefix}sticky_stats_pageviews` WHERE MONTH(`date`) = MONTH(DATE_SUB('". $now ."', INTERVAL 1 MONTH))", ARRAY_N),

            // Hits
            // ------------------------
            'desktop_hits'      => $wpdb->get_row("SELECT COUNT(`id`) FROM `{$wpdb->prefix}sticky_stats_visits` WHERE `device`='desktop'", ARRAY_N ),
            'tablet_hits'       => $wpdb->get_row("SELECT COUNT(`id`) FROM `{$wpdb->prefix}sticky_stats_visits` WHERE `device`='tablet'", ARRAY_N ),
            'mobile_hits'       => $wpdb->get_row("SELECT COUNT(`id`) FROM `{$wpdb->prefix}sticky_stats_visits` WHERE `device`='mobile'", ARRAY_N ),
            
            // Referers
            // ------------------------
            'search_engine_referers' => $wpdb->get_row("SELECT COUNT(id) FROM `{$wpdb->prefix}sticky_stats_visits` WHERE `is_search_engine` = '1'", ARRAY_N ),
            'non_empty_referers'     => $wpdb->get_row("SELECT COUNT(id) FROM `{$wpdb->prefix}sticky_stats_visits` WHERE `referer` != '' AND `is_search_engine` != '1'", ARRAY_N ),

            // Browsers
            // ------------------------
            'browser_data'       => $wpdb->get_results("SELECT `browser` AS `name`, `count` AS `hits` FROM `{$wpdb->prefix}sticky_stats_browsers` ORDER BY `count` DESC LIMIT 3", ARRAY_A),
            'browser_total_hits' => $wpdb->get_row("SELECT SUM(`count`) AS `total_hits` FROM `{$wpdb->prefix}sticky_stats_browsers`", ARRAY_N),

            // Operating Systems
            // ------------------------
            'os_data'            => $wpdb->get_results("SELECT `os` AS `name`, `count` AS `hits` FROM `{$wpdb->prefix}sticky_stats_os` ORDER BY `count` DESC LIMIT 3", ARRAY_A),
            'os_total_hits'      => $wpdb->get_row("SELECT SUM(`count`) AS `total_hits` FROM `{$wpdb->prefix}sticky_stats_os`", ARRAY_N),

            // Tops
            // ------------------------
            'top_posts'          => $wpdb->get_results("SELECT `s`.`post_id`, `wp`.`post_title` AS `title`, SUM(`s`.`hits`) AS `hits` FROM `{$wpdb->prefix}sticky_stats_posts` AS `s` LEFT JOIN `{$wpdb->posts}` AS `wp` ON (`s`.`post_id` = `wp`.`id`) GROUP BY `s`.`post_id` ORDER BY `hits` DESC LIMIT 10", ARRAY_A),
            'top_links'          => $wpdb->get_results("SELECT `referer`, `count` FROM `{$wpdb->prefix}sticky_stats_referers` ORDER BY `count` DESC LIMIT 10", ARRAY_A),
            'top_searches'       => $wpdb->get_results("SELECT `terms`, `count` FROM `{$wpdb->prefix}sticky_stats_searches` ORDER BY `count` DESC LIMIT 10", ARRAY_A),
            'visits'             => $wpdb->get_results("SELECT `v`.`date`, COUNT(`v`.`id`) AS `hits`, `p`.`hits` AS `pageviews` FROM `{$wpdb->prefix}sticky_stats_visits` AS `v` JOIN `{$wpdb->prefix}sticky_stats_pageviews` AS `p` ON (`v`.`date` = `p`.`date`) GROUP BY `date` ORDER BY `v`.`date` DESC LIMIT 11", ARRAY_A),
            'country_data'       => $wpdb->get_results("SELECT `country` AS `name`, COUNT(`id`) AS `count` FROM `{$wpdb->prefix}sticky_stats_visits` GROUP BY `country` ORDER BY `count` DESC", ARRAY_A)

        );

        // self::$config['statistics']['visits']               = array_reverse( self::$config['statistics']['visits'] );
    
        // Visits Deltas
        self::$config['statistics']['day_visits_delta']     = ( self::$config['statistics']['yesterday_visits'][0] == 0 ) ? 0 : round( self::$config['statistics']['today_visits'][0] / self::$config['statistics']['yesterday_visits'][0], 2) * 100;
        self::$config['statistics']['week_visits_delta']    = ( self::$config['statistics']['last_week_visits'][0] == 0 ) ? 0 : round( self::$config['statistics']['this_week_visits'][0] / self::$config['statistics']['last_week_visits'][0], 2 ) * 100;
        @self::$config['statistics']['month_visits_delta']   = ( self::$config['statistics']['this_month_visits'][0] == 0) ? 0 : round( self::$config['statistics']['this_month_visits'][0] / self::$config['statistics']['last_month_visits'][0], 2 ) * 100;
        
        // Pageviews Deltas
        self::$config['statistics']['day_pvs_delta']        = ( self::$config['statistics']['yesterday_pv'][0] == 0 ) ? 0 : round( self::$config['statistics']['today_pv'][0] / self::$config['statistics']['yesterday_pv'][0], 2) * 100;
        self::$config['statistics']['week_pvs_delta']       = ( self::$config['statistics']['last_week_pv'][0] == 0 ) ? 0 : round( self::$config['statistics']['this_week_pv'][0] / self::$config['statistics']['last_week_pv'][0], 2 ) * 100;
        self::$config['statistics']['month_pvs_delta']      = ( self::$config['statistics']['last_month_pv'][0] == 0 ) ? 0 : round( self::$config['statistics']['this_month_pv'][0] / self::$config['statistics']['last_month_pv'][0], 2) * 100;
    
        // Devices
        self::$config['statistics']['desktop']              = ( ! empty( self::$config['statistics']['total_visits'][0] ) ) ? round( self::$config['statistics']['desktop_hits'][0] / self::$config['statistics']['total_visits'][0] * 100) : 0;
        self::$config['statistics']['tablet']               = ( ! empty( self::$config['statistics']['total_visits'][0] ) ) ? round( self::$config['statistics']['tablet_hits'][0] / self::$config['statistics']['total_visits'][0] * 100) : 0;
        self::$config['statistics']['mobile']               = ( ! empty( self::$config['statistics']['total_visits'][0] ) ) ? round( self::$config['statistics']['mobile_hits'][0] / self::$config['statistics']['total_visits'][0] * 100) : 0;
    
        // Browsers
        self::$config['statistics']['search_engines']       = ( ! empty( self::$config['statistics']['total_visits'][0] )) ? round( self::$config['statistics']['search_engine_referers'][0] / self::$config['statistics']['total_visits'][0] * 100) : 0;
        self::$config['statistics']['links']                = ( ! empty( self::$config['statistics']['total_visits'][0] )) ? round( self::$config['statistics']['non_empty_referers'][0] / self::$config['statistics']['total_visits'][0] * 100) : 0;
        self::$config['statistics']['direct']               = 100 - self::$config['statistics']['search_engines'] - self::$config['statistics']['links'];
    }

    /**
     *
     * Adjusts any other option
     * -----------------------
     *
     * @since 1.0.5
     * @author Dorian Tudorache
     *
     */
    public static function adjust_additional_options() {
        // echo 'la inceput cookie: ' . self::$config['adminbar']['cookie'] . '<br/>';
        // echo 'la inceput state: ' . self::$config['adminbar']['state'] . '<br/>';
        
        // In case of error
        if ( self::$config['adminbar']['cookie'] == 'undefined' ) {
            self::$config['adminbar']['cookie'] = 'maximized';
            setcookie( 'sticky_wpab', 'maximized' );
        }
        // Update the adminbar state
        self::$config['adminbar']['state'] = ( isset( self::$config['adminbar']['cookie'] ) ? self::$config['adminbar']['cookie'] : ( self::$config['adminbar']['hide'] ? 'closed' : 'maximized' ) );
        // echo 'dupa cookie: ' . self::$config['adminbar']['cookie'] . '<br/>';
        // echo 'dupa mod state: ' . self::$config['adminbar']['state'] . '<br/>';

        // Extensions to use for CSS and JS files
        self::$config['dev']['js_ext'] = ( self::$config['dev']['minified_js'] ) ? '.min.js' : '.js';
        self::$config['dev']['css_ext'] = ( self::$config['dev']['minified_css'] ) ? '.min.css' : '.css';

        // If the value read from the cookie is illegal
        $wid = intval( self::$config['adminmenu']['width'] );
        if ( $wid < 60 || $wid > 440 ) 
            self::$config['adminmenu']['width'] = '220';

        // If the footer and header have the same colors, make the footer color the sec gradient header color
        if ( is_array( self::$config['colors']['header']['bg'] ) ) 
            if ( self::$config['colors']['header']['bg'][0] == self::$config['colors']['footer']['bg'] )
                self::$config['colors']['footer']['bg'] = self::$config['colors']['header']['bg'][0];

        // Dashboard Maps
        // self::$config['colors']['dash_maps'] = sticky_adjust_hl_color( self::$config['colors']['content'], 0, 0, 15 );
        // self::$config['colors']['dash_maps_bg'] = sticky_adjust_hl_color( self::$config['colors']['content'], 0, 5, -5 );
    }

    /**
     *
     * Body classes
     * -----------------------
     *
     * @since 1.0.5
     * @author Dorian Tudorache
     *
     */
    public static function body_classes() {
        self::$config['adminbar']['classes_string'] = 
             ' wpab-'       . self::$config['adminbar']['state']
           . ' wpab-'       . self::$config['colors']['adminbar']['color']
           . ' wpab-t-'     . self::$config['colors']['adminbar']['tooltips']['color']
           . ' wpab-sub-'   . self::$config['colors']['adminbar']['submenu']['color']
           . ' wpab-hl-'    . self::$config['colors']['adminbar']['hl_color'];

        // Admin Body Classes
        self::$config['classes_string'] = ' sticky-admin is_loading'
           . self::$config['adminbar']['classes_string']
           . ' content-'    . self::$config['colors']['content']['color']
           . ' content-hl-' . self::$config['colors']['content']['hl_color'] 
           . ' tip-'        . self::$config['colors']['content']['tooltips']['color']
           . ' header-'     . self::$config['colors']['header']['color']
           . ' header-hl-'  . self::$config['colors']['header']['hl_color']
           . ' menu-'       . self::$config['colors']['adminmenu']['color']
           . ' menu-hl-'    . self::$config['colors']['adminmenu']['hl_color']
           . ' menu-'       . self::$config['adminmenu']['position']
           . ' menu-h-'     . self::$config['colors']['adminmenu']['handle']['color']
           . ' menu-sub-'   . self::$config['colors']['adminmenu']['submenu']['color']
           . ( ! empty( self::$config['adminmenu']['grid_on'] ) ? ' ' . self::$config['adminmenu']['grid_on'] : '' )
           . ' footer-'     . self::$config['colors']['footer']['color']
           . ( self::$config['header']['sticky'] ? ' header-sticky' : '' )
           . ( self::$config['header']['type'] == 'minimized' ? ' header-small' : '' );
            
        // Statistics widget enabled?
        if ( $GLOBALS['pagenow'] === 'dashboard.php' && self::$config['content']['dash_stats'] )
            self::$config['classes_string'] .= ' s-stats';
    }

    /**
     *
     * Generates the colors 
     * -----------------------
     * (recursive)
     *
     * @since 1.0.5
     * @author Dorian Tudorache
     *
     */
    public static function generate_colors( &$node ) {
        // error_reporting(0);
        $color_step = 15; // on HSV scale (360deg), colors increase/decrease by this ammount (deg).
        foreach ( $node as $key => &$elem ) {
            if ( is_array( $elem ) && ! empty( $elem ) && array_key_exists( 'bg', $elem ) ) {
                if ( array_key_exists( 'hl', $elem ) && empty( $elem['hl'] ) ) {
                    $test = sticky_compare_correct( self::$config['colors']['highlight']['bg'], $elem['bg'], $color_step );

                    // Element specific rules
                    switch ( $key ) {
                        // Highlight colors for the header
                        case 'header':
                            if ( ! is_array( $elem['hl'] ) && ! is_array( $elem['bg'] ) ) {
                                $elem['hl'] = array(
                                    sticky_make_hl_color( $test, 0 ),
                                    sticky_make_hl_color( $test, - $color_step ),
                                    sticky_make_hl_color( $test, $color_step ),
                                    sticky_make_hl_color( $test, - $color_step * 2 ),
                                    sticky_make_hl_color( $test, $color_step * 2 ),
                                    sticky_make_hl_color( $test, - $color_step * 3 )
                                );
                                $elem['bg'] = array(
                                    $elem['bg'],
                                    sticky_adjust_hl_color( $elem['bg'], $color_step * 5 ) // for gradient
                                );
                            }
                            
                            break;

                        // Highlight colors for the nav
                        case 'adminmenu':
                            if ( ! is_array( $elem['hl'] ) ) {
                                $elem['hl'] = array(
                                    sticky_make_hl_color( $test, 0 ),
                                    sticky_make_hl_color( $test, $color_step ),
                                );
                            }
                            break;

                        case 'adminbar':
                            if ( ! is_array( $elem['submenu']['bg'] ) ) {
                                $elem['submenu']['bg'] = array(
                                    $elem['submenu']['bg'],
                                    sticky_adjust_hl_color( $elem['submenu']['bg'], 0, 0, ( -$color_step/2 ) )
                                );
                            }
                            $elem['hl'] = sticky_make_hl_color( $test, 0 );
                            break;

                        // Highlight colors for all other elements
                        default: 
                            $elem['hl'] = sticky_make_hl_color( $test, 0 );
                            break;
                    }
                    // One interpretation is enough here
                    $elem['hl_color'] = ( !is_array( $elem['hl'] ) ? ( sticky_luminance( $elem['hl'] ) ? 'b' : 'w' ) : ( sticky_luminance( $elem['hl'][0] ) ? 'b' : 'w' ) );
                }   

                if ( array_key_exists( 'color', $elem ) ) {
                    $elem['color'] = ( !is_array( $elem['bg'] ) ? ( sticky_luminance( $elem['bg'] ) ? 'b' : 'w' ) : ( sticky_luminance( $elem['bg'][0] ) ? 'b' : 'w' ) );
                }

                self::generate_colors( $node[$key] );
            }
        }
    }


    /**
     *
     * Checks for the 'donate' in the footer.
     * -----------------------
     *
     * @since 1.0.5
     * @author Dorian Tudorache
     *
     */
    public static function sticky_has_footer_donate() {
        if ( strpos( self::$config['footer']['copyright'], 'Donate!' ) !== false ) 
            return true;
        return false;
    }

    /**
     *
     * Plugin activation
     * -----------------------
     * Creates tables, initializes options and schedules cron
     *
     * @since 1.0.0
     * @author Dorian Tudorache
     *
     */
    public static function activate()
    {
        if ( function_exists('apply_filters') ) {
            $wpdb = apply_filters('sticky_stats_custom_wpdb', $GLOBALS['wpdb']);
        }
        // Create the tables
        self::init_tables( $wpdb );
        // Schedule the auto purge hook
        if ( false === wp_next_scheduled( 'sticky_stats_purge' ) ) {
            wp_schedule_event( '1111111111', 'daily', 'sticky_stats_purge' );
        }
        self::sticky_create_capabilities();
        chmod( STICKY_CACHE_URI, 0755 );
        return true;
    }
    
    /**
     * Bind SA capabilities to users on activation
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_create_capabilities() {
        $roles = get_editable_roles();
        $grant = false;
        foreach ( $GLOBALS['wp_roles']->role_objects as $key => $role ) {
            if ( $role->has_cap( 'edit_themes' ) ) $grant = true;

            if ( isset( $roles[$key] ) ) {
                $role->add_cap( 'edit_stickyadmin', $grant );
                $role->add_cap( 'edit_menu_order', $grant );
            }
        }
    }

    /**
     * Remove SA capabilities bound to users on deactivation
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_remove_capabilities() {
        $roles = get_editable_roles();
        foreach ($GLOBALS['wp_roles']->role_objects as $key => $role) {
            if ( isset( $roles[$key] ) && $role->has_cap( 'edit_stickyadmin' ) ) {
                $role->remove_cap( 'edit_stickyadmin' );
                $role->remove_cap( 'edit_menu_order' );
            }
        }
    }

    /**
     *
     * Plugin reset
     * -----------------------
     * Deletes the options, cookies, basically everything
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function reset() {
        delete_option( 'sticky_options' );
    }

    /**
     *
     * My account tab on the adminbar.
     * -----------------------
     * Replaces the howdy text and the avatar with a HiDpi one.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_wpab_my_account( $wp_admin_bar ) {
        if ( ! is_user_logged_in() ) return;

        $wp_admin_bar->remove_node('my-account');
        $howdy_text = '<em>' . self::$config['adminbar']['howdy_text'] . ', </em>';
        
        $user_id      = get_current_user_id();
        $current_user = wp_get_current_user();
        $profile_url  = get_edit_profile_url( $user_id );
        if ( ! $user_id )
            return;
        $avatar = get_avatar( $user_id, 52 );
        $howdy  = sprintf( $howdy_text . '%1$s', $current_user->display_name );
        $wp_admin_bar->add_menu( array(
            'id'        => 'my-account',
            'parent'    => 'top-secondary',
            'title'     => $howdy . $avatar,
            'href'      => $profile_url,
            'meta'      => array(
            'class'     => empty( $avatar ) ? '' : 'with-avatar',
            ),
        ) );
    }

    /**
     *
     * Create tables for statistics
     * -----------------------
     * Creates tables, initializes options and schedules cron
     *
     * @since 1.0
     *
     */
    public static function init_tables($wpdb = '')
    {
        // Is InnoDB engine available
        $have_innodb = $wpdb->get_results("SHOW VARIABLES LIKE 'have_innodb'", ARRAY_A);
        $use_innodb = (!empty($have_innodb[0]) && $have_innodb[0]['Value'] == 'YES') ? 'ENGINE=InnoDB' : '';
        $table_prefix = $wpdb->prefix;
        $create_browsers = "CREATE TABLE IF NOT EXISTS `{$table_prefix}sticky_stats_browsers` (
          `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
          `browser` varchar(255) NOT NULL,
          `count` int(11) NOT NULL,
          PRIMARY KEY (`id`)
        ) $use_innodb DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;";
        $create_os = "CREATE TABLE IF NOT EXISTS `{$table_prefix}sticky_stats_os` (
          `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
          `os` varchar(255) NOT NULL,
          `count` int(11) NOT NULL,
          PRIMARY KEY (`id`)
        ) $use_innodb DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;";
        $create_pageviews = "CREATE TABLE IF NOT EXISTS `{$table_prefix}sticky_stats_pageviews` (
          `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
          `date` date NOT NULL,
          `hits` int(10) unsigned NOT NULL,
          PRIMARY KEY  (`id`),
          UNIQUE KEY `post_id` (`date`)
        ) $use_innodb DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;";
        $create_posts = "CREATE TABLE IF NOT EXISTS `{$table_prefix}sticky_stats_posts` (
          `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
          `post_id` int(16) NOT NULL,
          `date` date NOT NULL,
          `hits` int(10) unsigned NOT NULL,
          PRIMARY KEY (`id`),
          UNIQUE KEY `post_id` (`post_id`,`date`)
        ) $use_innodb DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci AUTO_INCREMENT=1;";
        $create_searches = "CREATE TABLE IF NOT EXISTS `{$table_prefix}sticky_stats_searches` (
          `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
          `terms` varchar(255) DEFAULT NULL,
          `count` int(11) NOT NULL,
          PRIMARY KEY (`id`)
        ) $use_innodb DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;";
        $create_visits = "CREATE TABLE IF NOT EXISTS `{$table_prefix}sticky_stats_visits` (
          `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
          `date` date NOT NULL,
          `ip` varchar(20),
          `time` time NOT NULL,
          `country` varchar(4),
          `device` varchar(16),
          `referer` text,
          `browser` varchar(255),
          `browser_version` varchar(16),
          `os` varchar(255),
          `language` varchar(128),
          `user` varchar(64),
          `is_search_engine` tinyint(4),
          `is_bot` tinyint(4),
          `user_agent` text,
          PRIMARY KEY (`id`),
          UNIQUE KEY `date` (`date`,`ip`)
        ) $use_innodb DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;";
        $create_referers = "CREATE TABLE IF NOT EXISTS `{$table_prefix}sticky_stats_referers` (
          `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
          `referer` text NOT NULL,
          `count` int(11) NOT NULL,
          PRIMARY KEY (`id`)
        ) $use_innodb DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;";
        self::create_table( $create_browsers, $table_prefix . 'sticky_stats_browsers', $wpdb );
        self::create_table( $create_os, $table_prefix . 'sticky_stats_os', $wpdb );
        self::create_table( $create_pageviews, $table_prefix . 'sticky_stats_pageviews', $wpdb );
        self::create_table( $create_posts, $table_prefix . 'sticky_stats_posts', $wpdb );
        self::create_table( $create_searches, $table_prefix . 'sticky_stats_searches', $wpdb );
        self::create_table( $create_visits, $table_prefix . 'sticky_stats_visits', $wpdb );
        self::create_table( $create_referers, $table_prefix . 'sticky_stats_referers', $wpdb );
        // Add capabilities to the administrator role
        $role = get_role( "administrator" );
        if ( is_object( $role ) && method_exists( $role, 'add_cap' ) ) {
            $role->add_cap( 'wp_sticky_stats_view' );
            $role->add_cap( 'wp_sticky_stats_configure' );
        }
    }

    /**
     * Creates a table in the database
     */
    protected static function create_table($sql = '', $tablename = '', $wpdb = '')
    {
        $wpdb->query($sql);
        // Let's make sure this table was actually created
        foreach ($wpdb->get_col("SHOW TABLES LIKE '$tablename'", 0) as $table)
            if ($table == $tablename) return true;
        return false;
    }

    /**
     *
     * Clears the purge cron job
     *
     */
    public static function deactivate()
    {
        // Remove the scheduled cron job
        wp_clear_scheduled_hook('sticky_stats_purge');
        self::sticky_remove_capabilities();
    }

    /**
     *
     * Enqueue Styles - the Sticky way.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_styles() {
        // This function is not needed on login / register page.
        if ( in_array( $GLOBALS['pagenow'], array('wp-login.php', 'wp-register.php') ) ) return;
        // Plugins and themes could further hook
        // their custom styles and scripts with Sticky.
        do_action( 'sticky_add_styles' );
    }

    /**
     *
     * Add a 'theme_has_changed' flag
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_theme_changed() {
        set_transient( self::$current_blog_id . '_sticky-changes', '1' );
    }

    /**
     *
     * Generated CSS file
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_generate_css( $data, $blogid = 1 ) {
        // This function is not needed on login / register page.
        if ( in_array( $GLOBALS['pagenow'], array('wp-login.php', 'wp-register.php') ) ) return;

        if ( ! is_writeable(STICKY_CACHE_URI) )
            return;
        
        $cache_file = 'sticky-' . self::$current_blog_id . '.css';

        if ( file_exists( STICKY_CACHE . $cache_file ) && ! sticky_has_changed( $blogid ) ) return;

        ob_start();

        $css = sticky_dynamic_css();
        $css .= ob_get_clean();

        // Write the CSS cache file
        file_put_contents( STICKY_CACHE_URI . $cache_file , $css, LOCK_EX );
    }

    /**
     *
     * Enqueue Scripts - hooks for actions to pages only.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_hook_scripts() {
        // This function is not needed on login / register page.
        if ( in_array( $GLOBALS['pagenow'], array('wp-login.php', 'wp-register.php') ) ) return;
        // Plugins and themes could further hook
        // their custom styles and scripts with Sticky.
        do_action( 'sticky_page_specific_scripts' );
    }
    /**
     *
     * Enqueue Scripts
     *
     * @since 1.0.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_scripts() {
        // This function is not needed on login / register page.
        if ( in_array( $GLOBALS['pagenow'], array('wp-login.php', 'wp-register.php') ) ) return;
        // Plugins and themes could further hook
        // their custom styles and scripts with Sticky.
        do_action( 'sticky_add_scripts' );
    }
    /**
     * 
     * Change the HTML structure of the Format DIV
     *
     * @since 1.0.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_change_format_meta_box() {
        $screens = array( 'post', 'custom_post_type' );
        remove_meta_box( 'formatdiv', null, 'side', 'core' );
        foreach ( $screens as $screen ) {
            add_meta_box( 'formatdiv', _x( 'Format', 'post format' ), array( 'StickyAdmin', 'sticky_post_format_meta_box' ), $screen, 'side', 'default' );
        }
    }

    /**
     *
     * Deregister all (default) styles used by WordPress.
     *
     * @since 1.0.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_remove_wp_admin_styles() {
        apply_filters( 'mce_css', STICKY_CSS . 'sticky-editor-style.css' );
        // Add The Custom Editor Style
        remove_editor_styles();
        add_editor_style( STICKY_CSS . 'sticky-editor-style-' . self::$config['colors']['content']['color'] . '.css' );
    }

    /**
     *
     * Checks for AJAX request
     *
     * @since 1.0.5
     * @author Dorian Tudorache
     *
     */
    public static function sticky_ajax_request() {
        if ( ( !empty( $_SERVER['HTTP_X_REQUESTED_WITH'] ) ) && ( strtolower( $_SERVER['HTTP_X_REQUESTED_WITH'] ) == 'xmlhttprequest' ) )
            return true;
        return false;
    }

    /**
     *
     * Deregister the styles the login pages uses,
     * enqueue jQuery as this is the right place to do it.
     *
     * @since 1.0.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_replace_login_style() {
        wp_deregister_style( 'login', 'wp-admin' );
        wp_dequeue_style( 'login' );
        wp_enqueue_script( 'jquery' );
    }

    /** 
     * BuddyPress also adds it's own stylesheets,
     * these also should not be loaded at all!
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_remove_bp_adminbar_css() {
        wp_dequeue_style ( 'bp-admin-bar' );
        wp_dequeue_style ( 'bp-admin-bar-rtl' );
    }

    /** 
     *
     * WordPress adds some inline CSS for the adminbar,
     * we have to take that out.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_wpab_remove_inline_css() {
        remove_action( 'wp_head', '_admin_bar_bump_cb' );
    }

    /** 
     *
     * Removes items in the admin bar.
     * 
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_wpadminbar_remove() {
        if ( ! is_admin() && ! self::$config['adminbar']['preserve'] ) return;
        global $wp_admin_bar;

        // Move these elements to the secondary bar.
        $wp_admin_bar->remove_menu('comments');
        $wp_admin_bar->remove_menu('updates');

        $update_data = wp_get_update_data();
        if ( $update_data['counts']['total'] ) {
            $title = '<span class="ab-icon"></span><span class="ab-label">' . number_format_i18n( $update_data['counts']['total'] ) . '</span>';
            $title .= '<span class="screen-reader-text">' . $update_data['title'] . '</span>';
            $wp_admin_bar->add_menu( array(
                'id'    => 'updates',
                'parent'=> 'top-secondary',
                'title' => $title,
                'href'  => network_admin_url( 'update-core.php' ),
                'meta'  => array(
                    'title' => $update_data['title'],
                ),
            ) );
        }

        if ( current_user_can('edit_posts') ) {
            $awaiting_mod = wp_count_comments();
            $awaiting_mod = $awaiting_mod->moderated;
            $awaiting_title = esc_attr( sprintf( _n( '%s comment awaiting moderation', '%s comments awaiting moderation', $awaiting_mod ), number_format_i18n( $awaiting_mod ) ) );
            $icon  = '<span class="ab-icon"></span>';
            $title = '<span id="ab-awaiting-mod" class="ab-label awaiting-mod pending-count count-' . $awaiting_mod . '">' . number_format_i18n( $awaiting_mod ) . '</span>';
            $wp_admin_bar->add_menu( array(
                'id'    => 'comments',
                'parent'=> 'top-secondary',
                'title' => $icon . $title,
                'href'  => admin_url('edit-comments.php'),
                'meta'  => array( 'title' => $awaiting_title ),
            ) );
        }

        if ( isset( $grab_data[ 'wpadminbar_sitename_right' ] ) ? $grab_data[ 'wpadminbar_sitename_right' ] : false ) {
            $wp_admin_bar->remove_menu('site-name');
            
            $blogname = get_bloginfo('name');
            if ( ! $blogname ) {
                $blogname = preg_replace( '#^(https?://)?(www.)?#', '', get_home_url() );
            }
            if ( is_network_admin() ) {
                $blogname = sprintf( __('Network Admin: %s', '_sticky_' ), esc_html( get_current_site()->site_name ) );
            } elseif ( is_user_admin() ) {
                $blogname = sprintf( __( 'User Dashboard: %s', '_sticky_' ), esc_html( get_current_site()->site_name ) );
            }
            $title = wp_html_excerpt( $blogname, 40, '&hellip;' );

            $wp_admin_bar->add_menu( array(
                'parent'=> 'top-secondary',
                'id'    => 'site-name',
                'title' => $title,
                'href'  => is_admin() ? home_url( '/' ) : admin_url(),
            ) );
        }

        if ( isset( $grab_data[ '#wp_logo' ] ) && ! $grab_data[ '#wp_logo' ] )
            $wp_admin_bar->remove_menu('wp-logo');
        if ( isset( $grab_data[ 'wpadminbar_comments_button' ] ) && !$grab_data[ 'wpadminbar_comments_button' ] )
            $wp_admin_bar->remove_menu('comments');
        if ( isset( $grab_data[ 'wpadminbar_updates_button' ] ) && !$grab_data[ 'wpadminbar_updates_button' ] )
            $wp_admin_bar->remove_menu('updates');
        if ( isset( $grab_data[ 'wpadminbar_sitename_button' ] ) && !$grab_data[ 'wpadminbar_sitename_button' ] )
            $wp_admin_bar->remove_menu('site-name');
        if ( isset( $grab_data[ 'wpadminbar_new_button' ] ) && !$grab_data[ 'wpadminbar_new_button' ] )
            $wp_admin_bar->remove_menu('new-content');
    }

    /**
     * The admin bar will have separate scripts and styles
     * to ensure they also load on the user's frontend,
     * if requested so.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_wpab() {
        if ( ! is_admin() && ! self::$config['adminbar']['preserve'] ) return;        
        // Hook for scripts and styles enqueue-ing for the AdminBar. 
        do_action( 'sticky_adminbar_enqueue' );    
    }

    /**
     *
     * Custom CSS output just for the adminbar.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_wpab_css() {
        if ( ! is_admin() && ! self::$config['adminbar']['preserve'] ) return;
        do_action( 'sticky_adminbar_enqueue' );
        echo '<style type="text/css">' .  apply_filters( 'sticky_adminbar_css', '' ) . '</style>';
    }
    /**
     * 
     * JavaScript for the AdminBar
     * 
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_wpab_js() {
        if ( ! self::$config['adminbar']['preserve'] && ! is_admin() ) return;
        do_action( 'sticky_add_adminbar_scripts' );
    }


    /**
     * 
     * Updates the icons transients via Ajax
     * 
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_update_ui_icons( $which ) {
        $request = 's_'. $which .'_icons';
        $request = ( isset( $_REQUEST[ $request ] ) ) ? $_REQUEST[ $request ] : false ;
        $get_icons = array();
        $transient_name = self::$current_blog_id . '_sticky_'. $which .'_icons';
        $previous_icons = ( get_transient( $transient_name ) ) ? (array) get_transient( $transient_name ) : self::$config['default_icons'][$which];

        if ( $request ) 
            $get_icons = (array) json_decode( stripslashes( preg_replace('/\x{FEFF}/u', '', $request ) ) );
    
        set_transient( $transient_name,  array_merge( $previous_icons, $get_icons ) );
    }

    /**
     * 
     * Dynamic (AJAXified) CSS
     * 
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_ajax_css() {
        foreach ( self::$config['iconpickers'] as $item => $value ) {
            self::sticky_update_ui_icons( $item );

            if ( isset( $_REQUEST[ 'sticky_reset_' . $item ] ) && $_REQUEST['sticky_reset_' . $item ] == 'reset' ) {
                delete_transient( self::$current_blog_id . '_sticky_'. $item .'_icons' );
            }
        }
        
        // Dyanimc CSS and other stuff
        if ( isset( $_REQUEST['sticky_new_values'] ) && ! empty( $_REQUEST['sticky_new_values'] ) ) {
            $new_values = json_decode( stripslashes( preg_replace('/\x{FEFF}/u', '', $_REQUEST['sticky_new_values'] ) ) );
            if ( !empty( $new_values ) ) self::update_sticky_config( $new_values );
        }

        if ( isset( $_REQUEST['sticky_update_options'] ) && ! empty( $_REQUEST['sticky_update_options'] ) )
            self::sticky_setup_options( get_option('sticky_options') );

        require( STICKY_INCLUDES_URI . '/sticky_ajax_css.php' );
        exit;
    }

    public static function update_sticky_config( $values ) {
        foreach ( $values as $key => $values ) {

        }
    }
    /**
     *
     * Debugging function.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    private function sticky_debug() {
        // Debugging functions were removed from final distribution package.
    }
    /**
     *
     * This function changes the format (div) MetaBox on
     * Add New / Edit Post page or elsewhere the change
     * is needed.
     *
     * @since 1.0
     * @author Popa Florin
     *
     */  
    public static function sticky_post_format_meta_box( $post, $box ) {
        if ( current_theme_supports( 'post-formats' ) && post_type_supports( $post->post_type, 'post-formats' ) ) :
            $post_formats = get_theme_support( 'post-formats' );
            if ( is_array( $post_formats[0] ) ) :
                $post_format = get_post_format( $post->ID );
                if ( !$post_format )
                    $post_format = '0';
                // Add in the current one if it isn't there yet, in case the current theme doesn't support it
                if ( $post_format && ! in_array( $post_format, $post_formats[0] ) )
                    $post_formats[0][] = $post_format;
?>
        <div id="post-formats-select">
          <span>
          <input type="radio" name="post_format" class="post-format" id="post-format-0" value="0" <?php checked( $post_format, '0' ); ?> /> <label for="post-format-0" class="post-format-icon post-format-standard"><?php echo get_post_format_string( 'standard' ); ?></label>
          </span>
          <?php foreach ( $post_formats[0] as $format ) : ?>
          <span><input type="radio" name="post_format" class="post-format" id="post-format-<?php echo esc_attr( $format ); ?>" value="<?php echo esc_attr( $format ); ?>" <?php checked( $post_format, $format ); ?> /> <label for="post-format-<?php echo esc_attr( $format ); ?>" class="post-format-icon post-format-<?php echo esc_attr( $format ); ?>"><?php echo esc_html( get_post_format_string( $format ) ); ?></label></span>
          <?php endforeach; ?>
       </div>
<?php           endif; 
        endif;
    }
   
    /**
     *
     * Sticky w/ BuddyPress!
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_buddypress_enqueue() {
        do_action( 'sticky_buddypress_enqueues' );
    }
    /**
     * 
     * CodeMirror Style Chooser
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function code_editor_styles() {
        global $grab_data;
        $codemirror_theme = $grab_data['code_editor_theme'] ? : 'neat';
        wp_register_style( 'codemirror' , STICKY_CSS . 'codemirror.css' );
        wp_register_style( 'codemirror_theme', STICKY_CSS . 'codemirror_themes/'. $codemirror_theme .'.css' );
        wp_enqueue_style( 'codemirror_theme' );
        wp_enqueue_style( 'codemirror' );
    }
    /**
     * 
     * CodeMirror JS
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function code_editor_scripts() {
        global $grab_data, $file;
        $filename = $file;
        $ext = pathinfo( $filename, PATHINFO_EXTENSION );
        $codemirror_mode = $ext;
        if ( $codemirror_mode == 'php' )
            $codemirror_mode = 'application/x-httpd-php';
        $codemirror_theme = 'neat';
        $codemirror_theme = $grab_data['code_editor_theme'];
        if ( !empty( $filename ) )
            $params = array(
                'filename' => $filename,
                'mode' => $codemirror_mode,
                'theme' => $codemirror_theme
            );
        wp_register_script( 'codemirror', STICKY_JS . 'codemirror.js' );
        wp_register_script( 'codemirror_mode', STICKY_JS . 'codemirror/'.$ext.'/'.$ext.'.js' );
        wp_register_script( 'codemirror_sticky', STICKY_JS . 'sticky-codemirror.js', self::VERSION );
        wp_localize_script( 'codemirror_sticky', 'StickyCM', $params );
        wp_enqueue_script( 'codemirror' );
        wp_enqueue_script( 'codemirror_mode' );
        wp_enqueue_script( 'codemirror_sticky' );
    }
    
    /**
     * Every theme will have it's own image. This function
     * will return the current theme's image path.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_theme_image( $theme_name ) {
        global $grab_data, $sticky_themes_images;
    
        if ( ! isset( $grab_data[ 'dash_image' ] ) && ! isset ( $grab_data[ 'dash_image' ][ 'src' ] ) ) {
            if ( ! empty( $sticky_themes_images[ $theme_name ] ) )
                return str_replace( '/', DIRECTORY_SEPARATOR, STICKY_ASSETS . $sticky_themes_images[ $theme_name ] );
        }
        return;
    }
    /**
     *
     * We'll be using transients to store menu data,
     * such as: icons, position, list item visible.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public function sticky_adminmenu_transients( $args = array() ) {
        $defaults = array(
            'li_id'     => '',
            'li_icon'   => '',
            'li_hide'   => ''
        );
        $args = wp_parse_args( $args, $defaults );
        $transient_name = 'sticky_nav';
    }
    /**
     *
     * Outputs the inputted JS in the Custom JS field.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_head() {
        do_action( 'sticky_head' );
    }
    /** 
     *
     * (OnNavigation) Logo Controller
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
     public static function sticky_adminmenu_logo() {    
        echo "\n" . '<li id="adminmenu_logo">';
        // FOLDED 
        echo "\n" . '   <div class="folded_logo">';
        if ( self::$config['logo']['link'] != '' ) 
            echo "\n" . '      <a target="_blank" href="' . $logo_link . '">';
        echo self::$config['logo']['show_folded'];
        if ( self::$config['logo']['link'] != '' ) 
            echo "\n" . '      </a>';
        echo "\n" . '</div>';
        // FOLDED END

        // BASIC
        if ( self::$config['logo']['link'] != '' ) 
            echo "\n" . '      <a target="_blank" href="' . $logo_link . '">';
        echo self::$config['logo']['show'];
        if ( self::$config['logo']['link'] != '' ) 
            echo "\n" . '      </a>';
        echo "\n" . '</li>' . "\n"; 
        // BASIC END
    }

    /** 
     *
     * Adds a logout button at the end of the adminmenu when
     * the wpadminbar has the closed state.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_logout_button() {
        echo '<li id="sticky_logout" class="wp-not-current-submenu menu-top menu-icon-logout">
                <a href="' . wp_logout_url() . '" class="menu-top">
                    <div class="wp-menu-image"></div>
                    <div class="wp-menu-name">' . __( 'Logout', '_sticky_' ) . '</div>
                </a>
              </li>';
    }
    /**
     * 
     * Content Preloader
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_content_preload() {                
        if ( ! self::$config['content']['preload'] ) return;

        echo 
            '<div id="overlay">
                <div id="sticky_preloader">' . self::$config['content']['preloader'] . '</div>
            </div>';
    }
    /**
     *
     * Replace the copyright text in footer.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_wp_admin_footer() {
        return ( self::sticky_has_footer_donate() ? str_replace( 'Donate!', '<a href="'. self::$config['donate_link'].'">Donate!</a>', self::$config['footer']['copyright'] ) : self::$config['footer']['copyright'] );
    }

    /**
     *
     * Set the WP Admin Bar State based on cookie value.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_wpab_state_controller() {
        // self::$config['adminbar']['state'] = isset( self::$config['adminbar']['cookie'] ) ? self::$config['adminbar']['cookie'] : ( self::$config['adminbar']['hide'] ? 'closed' : 'maximized' );
        if ( self::$config['adminbar']['cookie'] !== 'closed' && self::$config['adminbar']['hide'] ) {
            self::$config['adminbar']['cookie'] = self::$config['adminbar']['state'] = 'closed';
        } elseif ( self::$config['adminbar']['cookie'] === 'closed' && ! self::$config['adminbar']['hide'] ) {
            self::$config['adminbar']['state'] = 'maximized';
            setcookie( 'sticky_wpab', '' );
        }  
    }
    /**
     *
     * A second check is needed based on the panel option.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_wpab_check() {
        if ( false === self::$config['adminbar']['hide'] && self::$config['adminbar']['cookie'] === 'closed' ) {
            self::$config['adminbar']['cookie'] = self::$config['adminbar']['state'] = 'closed';
            sticky_options_updater( 'wpadminbar_hide', true );
        }
    }
    /**
     *
     * Adds the toggle bar to the wpadminbar.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public function sticky_wpab_toggle() {
        echo '<div class="sticky_toggle"><button class="sticky_resize"></button><button class="sticky_close"></button></div>';
    }
    /**
     *
     * Custom CSS classes needed for the frontend.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_uses_sticky( $classes ) {
        if ( self::$config['adminbar']['preserve'] ) {
            $classes[] = 'uses_sticky';
            foreach( explode(' ', self::$config['adminbar']['classes_string'] ) as $class )
                $classes[] = $class;
        }
        return $classes;
    }

    /**
     *
     * Custom CSS classes needed for the body.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_bodyclass_controller( $admin_body_class ) {
        /* Dynamic Classes
        ------------------------------------ */
        $admin_body_class .= self::$config['classes_string'];

        return $admin_body_class;
    }

    /**
     *
     * Replaces the default avatar with Sticky one.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_avatar() {
        $s_avatar = STICKY_ASSETS . 'sticky-avatar.png';
        $avatar_defaults[ $s_avatar ] = 'Sticky Avatar';
        
        return $avatar_defaults;
    }

    /** 
     *
     * Dashboard Widgets Controller
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_dashboard() {
        global $grab_data, $wp_meta_boxes, $wp_registered_widgets;
        if ( ( isset( $grab_data[ 's_stats' ] ) ? $grab_data[ 's_stats' ] : true ) && current_user_can( 'wp_sticky_stats_view' )  )
            wp_add_dashboard_widget( 'sticky_stats', __( 'Site Statistics', '_sticky_' ), 'sticky_stats_display' );
    }

    /**
     *
     * Body classes for the Login Page.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_login_classes( $classes ) {
        $classes[] = 'is_loading';
        $classes[] = 'no-js';
        $classes[] = ( sticky_luminance( self::$config['login']['form']['bg'] ) ? 'login-w' : 'login-b' );
        return $classes;
    }

    /**
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_login_page_headertitle() {
        global $grab_data;
        if ( $logo_description = esc_attr ( $grab_data['login_logo_alt'] ) )
            return esc_attr( $logo_description );
    }
    /**
     *
     * Login Page URL
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_login_page_headerurl() {
        global $grab_data;
        if ( $logo_url = esc_url ( $grab_data[ 'login_logo_link' ] ) )
            return $logo_url;
    }

    /** 
     *
     * CSS for the Login Page
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_login_page_css() {
        do_action( 'sticky_login_css_enqueues' );
        echo '<style type="text/css">' . "\n";
        apply_filters( 'sticky_filter_login_styles', '' );
        echo '</style>' . "\n";
    }
    private function sticky_me() {
        $p = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA0ODAgNDgwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0ODAgNDgwIiB4bWw6c3BhY2U9InByZXNlcnZlIj48ZyBpZD0iTGF5ZXJfMV94QTBfSW1hZ2VfMV8iIGRpc3BsYXk9Im5vbmUiPjxpbWFnZSBkaXNwbGF5PSJpbmxpbmUiIG92ZXJmbG93PSJ2aXNpYmxlIiB3aWR0aD0iMjAwMCIgaGVpZ2h0PSIyMDAwIiBpZD0iTGF5ZXJfMV94QTBfSW1hZ2UiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFCOUFBQUFmUUNBSUFBQUFWV2xNdUFBQUFDWEJJV1hNQUFDNGpBQUF1SXdGNHBUOTJBQUFBR1hSRldIUlRiMlowZDJGeVpRQkJaRzlpWlNCSmJXRm5aVkpsWVdSNWNjbGxQQUFBUHlCSlJFRlVlTnJzMkRFQkFDQU13RERBditjaFlqMFRDVDE3WitZQUFBQUFBQUE3VHdJQUFBQUFBTmd6M0FFQUFBQUFJR0M0QXdBQUFBQkF3SEFIQUFBQUFJQ0E0UTRBQUFBQUFBSERIUUFBQUFBQUFvWTdBQUFBQUFBRURIY0FBQUFBQUFnWTdnQUFBQUFBRUREY0FRQUFBQUFnWUxnREFBQUFBRURBY0FjQUFBQUFnSURoRGdBQUFBQUFBY01kQUFBQUFBQUNoanNBQUFBQUFBUU1kd0FBQUFBQUNCanVBQUFBQUFBUU1Od0JBQUFBQUNCZ3VBTUFBQUFBUU1Cd0J3QUFBQUNBZ09FT0FBQUFBQUFCd3gwQUFBQUFBQUtHT3dBQUFBQUFCQXgzQUFBQUFBQUlHTzRBQUFBQUFCQXczQUVBQUFBQUlHQzRBd0FBQUFCQXdIQUhBQUFBQUlDQTRRNEFBQUFBQUFIREhRQUFBQUFBQW9ZN0FBQUFBQUFFREhjQUFBQUFBQWdZN2dBQUFBQUFFRERjQVFBQUFBQWdZTGdEQUFBQUFFREFjQWNBQUFBQWdJRGhEZ0FBQUFBQUFjTWRBQUFBQUFBQ2hqc0FBQUFBQUFRTWR3QUFBQUFBQ0JqdUFBQUFBQUFRTU53QkFBQUFBQ0JndUFNQUFBQUFRTUJ3QndBQUFBQ0FnT0VPQUFBQUFBQUJ3eDBBQUFBQUFBS0dPd0FBQUFBQUJBeDNBQUFBQUFBSUdPNEFBQUFBQUJBdzNBRUFBQUFBSUdDNEF3QUFBQUJBd0hBSEFBQUFBSUNBNFE0QUFBQUFBQUhESFFBQUFBQUFBb1k3QUFBQUFBQUVESGNBQUFBQUFBZ1k3Z0FBQUFBQUVERGNBUUFBQUFBZ1lMZ0RBQUFBQUVEQWNBY0FBQUFBZ0lEaERnQUFBQUFBQWNNZEFBQUFBQUFDaGpzQUFBQUFBQVFNZHdBQUFBQUFDQmp1QUFBQUFBQVFNTndCQUFBQUFDQmd1QU1BQUFBQVFNQndCd0FBQUFDQWdPRU9BQUFBQUFBQnd4MEFBQUFBQUFLR093QUFBQUFBQkF4M0FBQUFBQUFJR080QUFBQUFBQkF3M0FFQUFBQUFJR0M0QXdBQUFBQkF3SEFIQUFBQUFJQ0E0UTRBQUFBQUFBSERIUUFBQUFBQUFvWTdBQUFBQUFBRURIY0FBQUFBQUFnWTdnQUFBQUFBRUREY0FRQUFBQUFnWUxnREFBQUFBRURBY0FjQUFBQUFnSURoRGdBQUFBQUFBY01kQUFBQUFBQUNoanNBQUFBQUFBUU1kd0FBQUFBQUNCanVBQUFBQUFBUU1Od0JBQUFBQUNCZ3VBTUFBQUFBUU1Cd0J3QUFBQUNBZ09FT0FBQUFBQUFCd3gwQUFBQUFBQUtHT3dBQUFBQUFCQXgzQUFBQUFBQUlHTzRBQUFBQUFCQXczQUVBQUFBQUlHQzRBd0FBQUFCQXdIQUhBQUFBQUlDQTRRNEFBQUFBQUFIREhRQUFBQUFBQW9ZN0FBQUFBQUFFREhjQUFBQUFBQWdZN2dBQUFBQUFFRERjQVFBQUFBQWdZTGdEQUFBQUFFREFjQWNBQUFBQWdJRGhEZ0FBQUFBQUFjTWRBQUFBQUFBQ2hqc0FBQUFBQUFRTWR3QUFBQUFBQ0JqdUFBQUFBQUFRTU53QkFBQUFBQ0JndUFNQUFBQUFRTUJ3QndBQUFBQ0FnT0VPQUFBQUFBQUJ3eDBBQUFBQUFBS0dPd0FBQUFBQUJBeDNBQUFBQUFBSUdPNEFBQUFBQUJBdzNBRUFBQUFBSUdDNEF3QUFBQUJBd0hBSEFBQUFBSUNBNFE0QUFBQUFBQUhESFFBQUFBQUFBb1k3QUFBQUFBQUVESGNBQUFBQUFBZ1k3Z0FBQUFBQUVERGNBUUFBQUFBZ1lMZ0RBQUFBQUVEQWNBY0FBQUFBZ0lEaERnQUFBQUFBQWNNZEFBQUFBQUFDaGpzQUFBQUFBQVFNZHdBQUFBQUFDQmp1QUFBQUFBQVFNTndCQUFBQUFDQmd1QU1BQUFBQVFNQndCd0FBQUFDQWdPRU9BQUFBQUFBQnd4MEFBQUFBQUFLR093QUFBQUFBQkF4M0FBQUFBQUFJR080QUFBQUFBQkF3M0FFQUFBQUFJR0M0QXdBQUFBQkF3SEFIQUFBQUFJQ0E0UTRBQUFBQUFBSERIUUFBQUFBQUFvWTdBQUFBQUFBRURIY0FBQUFBQUFnWTdnQUFBQUFBRUREY0FRQUFBQUFnWUxnREFBQUFBRURBY0FjQUFBQUFnSURoRGdBQUFBQUFBY01kQUFBQUFBQUNoanNBQUFBQUFBUU1kd0FBQUFBQUNCanVBQUFBQUFBUU1Od0JBQUFBQUNCZ3VBTUFBQUFBUU1Cd0J3QUFBQUNBZ09FT0FBQUFBQUFCd3gwQUFBQUFBQUtHT3dBQUFBQUFCQXgzQUFBQUFBQUlHTzRBQUFBQUFCQXczQUVBQUFBQUlHQzRBd0FBQUFCQXdIQUhBQUFBQUlDQTRRNEFBQUFBQUFIREhRQUFBQUFBQW9ZN0FBQUFBQUFFREhjQUFBQUFBQWdZN2dBQUFBQUFFRERjQVFBQUFBQWdZTGdEQUFBQUFFREFjQWNBQUFBQWdJRGhEZ0FBQUFBQUFjTWRBQUFBQUFBQ2hqc0FBQUFBQUFRTWR3QUFBQUFBQ0JqdUFBQUFBQUFRTU53QkFBQUFBQ0JndUFNQUFBQUFRTUJ3QndBQUFBQ0FnT0VPQUFBQUFBQUJ3eDBBQUFBQUFBS0dPd0FBQUFBQUJBeDNBQUFBQUFBSUdPNEFBQUFBQUJBdzNBRUFBQUFBSUdDNEF3QUFBQUJBd0hBSEFBQUFBSUNBNFE0QUFBQUFBQUhESFFBQUFBQUFBb1k3QUFBQUFBQUVESGNBQUFBQUFBZ1k3Z0FBQUFBQUVERGNBUUFBQUFBZ1lMZ0RBQUFBQUVEQWNBY0FBQUFBZ0lEaERnQUFBQUFBQWNNZEFBQUFBQUFDaGpzQUFBQUFBQVFNZHdBQUFBQUFDQmp1QUFBQUFBQVFNTndCQUFBQUFDQmd1QU1BQUFBQVFNQndCd0FBQUFDQWdPRU9BQUFBQUFBQnd4MEFBQUFBQUFLR093QUFBQUFBQkF4M0FBQUFBQUFJR080QUFBQUFBQkF3M0FFQUFBQUFJR0M0QXdBQUFBQkF3SEFIQUFBQUFJQ0E0UTRBQUFBQUFBSERIUUFBQUFBQUFvWTdBQUFBQUFBRURIY0FBQUFBQUFnWTdnQUFBQUFBRUREY0FRQUFBQUFnWUxnREFBQUFBRURBY0FjQUFBQUFnSURoRGdBQUFBQUFBY01kQUFBQUFBQUNoanNBQUFBQUFBUU1kd0FBQUFBQUNCanVBQUFBQUFBUU1Od0JBQUFBQUNCZ3VBTUFBQUFBUU1Cd0J3QUFBQUNBZ09FT0FBQUFBQUFCd3gwQUFBQUFBQUtHT3dBQUFBQUFCQXgzQUFBQUFBQUlHTzRBQUFBQUFCQXczQUVBQUFBQUlHQzRBd0FBQUFCQXdIQUhBQUFBQUlDQTRRNEFBQUFBQUFIREhRQUFBQUFBQW9ZN0FBQUFBQUFFREhjQUFBQUFBQWdZN2dBQUFBQUFFRERjQVFBQUFBQWdZTGdEQUFBQUFFREFjQWNBQUFBQWdJRGhEZ0FBQUFBQUFjTWRBQUFBQUFBQ2hqc0FBQUFBQUFRTWR3QUFBQUFBQ0JqdUFBQUFBQUFRTU53QkFBQUFBQ0JndUFNQUFBQUFRTUJ3QndBQUFBQ0FnT0VPQUFBQUFBQUJ3eDBBQUFBQUFBS0dPd0FBQUFBQUJBeDNBQUFBQUFBSUdPNEFBQUFBQUJBdzNBRUFBQUFBSUdDNEF3QUFBQUJBd0hBSEFBQUFBSUNBNFE0QUFBQUFBQUhESFFBQUFBQUFBb1k3QUFBQUFBQUVESGNBQUFBQUFBZ1k3Z0FBQUFBQUVERGNBUUFBQUFBZ1lMZ0RBQUFBQUVEQWNBY0FBQUFBZ0lEaERnQUFBQUFBQWNNZEFBQUFBQUFDaGpzQUFBQUFBQVFNZHdBQUFBQUFDQmp1QUFBQUFBQVFNTndCQUFBQUFDQmd1QU1BQUFBQVFNQndCd0FBQUFDQWdPRU9BQUFBQUFBQnd4MEFBQUFBQUFLR093QUFBQUFBQkF4M0FBQUFBQUFJR080QUFBQUFBQkF3M0FFQUFBQUFJR0M0QXdBQUFBQkF3SEFIQUFBQUFJQ0E0UTRBQUFBQUFBSERIUUFBQUFBQUFvWTdBQUFBQUFBRURIY0FBQUFBQUFnWTdnQUFBQUFBRUREY0FRQUFBQUFnWUxnREFBQUFBRURBY0FjQUFBQUFnSURoRGdBQUFBQUFBY01kQUFBQUFBQUNoanNBQUFBQUFBUU1kd0FBQUFBQUNCanVBQUFBQUFBUU1Od0JBQUFBQUNCZ3VBTUFBQUFBUU1Cd0J3QUFBQUNBZ09FT0FBQUFBQUFCd3gwQUFBQUFBQUtHT3dBQUFBQUFCQXgzQUFBQUFBQUlHTzRBQUFBQUFCQXczQUVBQUFBQUlHQzRBd0FBQUFCQXdIQUhBQUFBQUlDQTRRNEFBQUFBQUFIREhRQUFBQUFBQW9ZN0FBQUFBQUFFREhjQUFBQUFBQWdZN2dBQUFBQUFFRERjQVFBQUFBQWdZTGdEQUFBQUFFREFjQWNBQUFBQWdJRGhEZ0FBQUFBQUFjTWRBQUFBQUFBQ2hqc0FBQUFBQUFRTWR3QUFBQUFBQ0JqdUFBQUFBQUFRTU53QkFBQUFBQ0JndUFNQUFBQUFRTUJ3QndBQUFBQ0FnT0VPQUFBQUFBQUJ3eDBBQUFBQUFBS0dPd0FBQUFBQUJBeDNBQUFBQUFBSUdPNEFBQUFBQUJBdzNBRUFBQUFBSUdDNEF3QUFBQUJBd0hBSEFBQUFBSUNBNFE0QUFBQUFBQUhESFFBQUFBQUFBb1k3QUFBQUFBQUVESGNBQUFBQUFBZ1k3Z0FBQUFBQUVERGNBUUFBQUFBZ1lMZ0RBQUFBQUVEQWNBY0FBQUFBZ0lEaERnQUFBQUFBQWNNZEFBQUFBQUFDaGpzQUFBQUFBQVFNZHdBQUFBQUFDQmp1QUFBQUFBQVFNTndCQUFBQUFDQmd1QU1BQUFBQVFNQndCd0FBQUFDQWdPRU9BQUFBQUFBQnd4MEFBQUFBQUFLR093QUFBQUFBQkF4M0FBQUFBQUFJR080QUFBQUFBQkF3M0FFQUFBQUFJR0M0QXdBQUFBQkF3SEFIQUFBQUFJQ0E0UTRBQUFBQUFBSERIUUFBQUFBQUFvWTdBQUFBQUFBRURIY0FBQUFBQUFnWTdnQUFBQUFBRUREY0FRQUFBQUFnWUxnREFBQUFBRURBY0FjQUFBQUFnSURoRGdBQUFBQUFBY01kQUFBQUFBQUNoanNBQUFBQUFBUU1kd0FBQUFBQUNCanVBQUFBQUFBUU1Od0JBQUFBQUNCZ3VBTUFBQUFBUU1Cd0J3QUFBQUNBZ09FT0FBQUFBQUFCd3gwQUFBQUFBQUtHT3dBQUFBQUFCQXgzQUFBQUFBQUlHTzRBQUFBQUFCQXczQUVBQUFBQUlHQzRBd0FBQUFCQXdIQUhBQUFBQUlDQTRRNEFBQUFBQUFIREhRQUFBQUFBQW9ZN0FBQUFBQUFFREhjQUFBQUFBQWdZN2dBQUFBQUFFRERjQVFBQUFBQWdZTGdEQUFBQUFFREFjQWNBQUFBQWdJRGhEZ0FBQUFBQUFjTWRBQUFBQUFBQ2hqc0FBQUFBQUFRTWR3QUFBQUFBQ0JqdUFBQUFBQUFRTU53QkFBQUFBQ0JndUFNQUFBQUFRTUJ3QndBQUFBQ0FnT0VPQUFBQUFBQUJ3eDBBQUFBQUFBS0dPd0FBQUFBQUJBeDNBQUFBQUFBSUdPNEFBQUFBQUJBdzNBRUFBQUFBSUdDNEF3QUFBQUJBd0hBSEFBQUFBSUNBNFE0QUFBQUFBQUhESFFBQUFBQUFBb1k3QUFBQUFBQUVESGNBQUFBQUFBZ1k3Z0FBQUFBQUVERGNBUUFBQUFBZ1lMZ0RBQUFBQUVEQWNBY0FBQUFBZ0lEaERnQUFBQUFBQWNNZEFBQUFBQUFDaGpzQUFBQUFBQVFNZHdBQUFBQUFDQmp1QUFBQUFBQVFNTndCQUFBQUFDQmd1QU1BQUFBQVFNQndCd0FBQUFDQWdPRU9BQUFBQUFBQnd4MEFBQUFBQUFLR093QUFBQUFBQkF4M0FBQUFBQUFJR080QUFBQUFBQkF3M0FFQUFBQUFJR0M0QXdBQUFBQkF3SEFIQUFBQUFJQ0E0UTRBQUFBQUFBSERIUUFBQUFBQUFvWTdBQUFBQUFBRURIY0FBQUFBQUFnWTdnQUFBQUFBRUREY0FRQUFBQUFnWUxnREFBQUFBRURBY0FjQUFBQUFnSURoRGdBQUFBQUFBY01kQUFBQUFBQUNoanNBQUFBQUFBUU1kd0FBQUFBQUNCanVBQUFBQUFBUU1Od0JBQUFBQUNCZ3VBTUFBQUFBUU1Cd0J3QUFBQUNBZ09FT0FBQUFBQUFCd3gwQUFBQUFBQUtHT3dBQUFBQUFCQXgzQUFBQUFBQUlHTzRBQUFBQUFCQXczQUVBQUFBQUlHQzRBd0FBQUFCQXdIQUhBQUFBQUlDQTRRNEFBQUFBQUFIREhRQUFBQUFBQW9ZN0FBQUFBQUFFREhjQUFBQUFBQWdZN2dBQUFBQUFFRERjQVFBQUFBQWdZTGdEQUFBQUFFREFjQWNBQUFBQWdJRGhEZ0FBQUFBQUFjTWRBQUFBQUFBQ2hqc0FBQUFBQUFRTWR3QUFBQUFBQ0JqdUFBQUFBQUFRTU53QkFBQUFBQ0JndUFNQUFBQUFRTUJ3QndBQUFBQ0FnT0VPQUFBQUFBQUJ3eDBBQUFBQUFBS0dPd0FBQUFBQUJBeDNBQUFBQUFBSUdPNEFBQUFBQUJBdzNBRUFBQUFBSUdDNEF3QUFBQUJBd0hBSEFBQUFBSUNBNFE0QUFBQUFBQUhESFFBQUFBQUFBb1k3QUFBQUFBQUVESGNBQUFBQUFBZ1k3Z0FBQUFBQUVERGNBUUFBQUFBZ1lMZ0RBQUFBQUVEQWNBY0FBQUFBZ0lEaERnQUFBQUFBQWNNZEFBQUFBQUFDaGpzQUFBQUFBQVFNZHdBQUFBQUFDQmp1QUFBQUFBQVFNTndCQUFBQUFDQmd1QU1BQUFBQVFNQndCd0FBQUFDQWdPRU9BQUFBQUFBQnd4MEFBQUFBQUFLR093QUFBQUFBQkF4M0FBQUFBQUFJR080QUFBQUFBQkF3M0FFQUFBQUFJR0M0QXdBQUFBQkF3SEFIQUFBQUFJQ0E0UTRBQUFBQUFBSERIUUFBQUFBQUFvWTdBQUFBQUFBRURIY0FBQUFBQUFnWTdnQUFBQUFBRUREY0FRQUFBQUFnWUxnREFBQUFBRURBY0FjQUFBQUFnSURoRGdBQUFBQUFBY01kQUFBQUFBQUNoanNBQUFBQUFBUU1kd0FBQUFBQUNCanVBQUFBQUFBUU1Od0JBQUFBQUNCZ3VBTUFBQUFBUU1Cd0J3QUFBQUNBZ09FT0FBQUFBQUFCd3gwQUFBQUFBQUtHT3dBQUFBQUFCQXgzQUFBQUFBQUlHTzRBQUFBQUFCQXczQUVBQUFBQUlHQzRBd0FBQUFCQXdIQUhBQUFBQUlDQTRRNEFBQUFBQUFIREhRQUFBQUFBQW9ZN0FBQUFBQUFFREhjQUFBQUFBQWdZN2dBQUFBQUFFRERjQVFBQUFBQWdZTGdEQUFBQUFFREFjQWNBQUFBQWdJRGhEZ0FBQUFBQUFjTWRBQUFBQUFBQ2hqc0FBQUFBQUFRTWR3QUFBQUFBQ0JqdUFBQUFBQUFRTU53QkFBQUFBQ0JndUFNQUFBQUFRTUJ3QndBQUFBQ0FnT0VPQUFBQUFBQUJ3eDBBQUFBQUFBS0dPd0FBQUFBQUJBeDNBQUFBQUFBSUdPNEFBQUFBQUJBdzNBRUFBQUFBSUdDNEF3QUFBQUJBd0hBSEFBQUFBSUNBNFE0QUFBQUFBQUhESFFBQUFBQUFBb1k3QUFBQUFBQUVESGNBQUFBQUFBZ1k3Z0FBQUFBQUVERGNBUUFBQUFBZ1lMZ0RBQUFBQUVEQWNBY0FBQUFBZ0lEaERnQUFBQUFBQWNNZEFBQUFBQUFDaGpzQUFBQUFBQVFNZHdBQUFBQUFDQmp1QUFBQUFBQVFNTndCQUFBQUFDQmd1QU1BQUFBQVFNQndCd0FBQUFDQWdPRU9BQUFBQUFBQnd4MEFBQUFBQUFLR093QUFBQUFBQkF4M0FBQUFBQUFJR080QUFBQUFBQkF3M0FFQUFBQUFJR0M0QXdBQUFBQkF3SEFIQUFBQUFJQ0E0UTRBQUFBQUFBSERIUUFBQUFBQUFvWTdBQUFBQUFBRURIY0FBQUFBQUFnWTdnQUFBQUFBRUREY0FRQUFBQUFnWUxnREFBQUFBRURBY0FjQUFBQUFnSURoRGdBQUFBQUFBY01kQUFBQUFBQUNoanNBQUFBQUFBUU1kd0FBQUFBQUNCanVBQUFBQUFBUU1Od0JBQUFBQUNCZ3VBTUFBQUFBUU1Cd0J3QUFBQUNBZ09FT0FBQUFBQUFCd3gwQUFBQUFBQUtHT3dBQUFBQUFCQXgzQUFBQUFBQUlHTzRBQUFBQUFCQXczQUVBQUFBQUlHQzRBd0FBQUFCQXdIQUhBQUFBQUlDQTRRNEFBQUFBQUFIREhRQUFBQUFBQW9ZN0FBQUFBQUFFREhjQUFBQUFBQWdZN2dBQUFBQUFFRERjQVFBQUFBQWdZTGdEQUFBQUFFREFjQWNBQUFBQWdJRGhEZ0FBQUFBQUFjTWRBQUFBQUFBQ2hqc0FBQUFBQUFRTWR3QUFBQUFBQ0JqdUFBQUFBQUFRTU53QkFBQUFBQ0JndUFNQUFBQUFRTUJ3QndBQUFBQ0FnT0VPQUFBQUFBQUJ3eDBBQUFBQUFBS0dPd0FBQUFBQUJBeDNBQUFBQUFBSUdPNEFBQUFBQUJBdzNBRUFBQUFBSUdDNEF3QUFBQUJBd0hBSEFBQUFBSUNBNFE0QUFBQUFBQUhESFFBQUFBQUFBb1k3QUFBQUFBQUVESGNBQUFBQUFBZ1k3Z0FBQUFBQUVERGNBUUFBQUFBZ1lMZ0RBQUFBQUVEQWNBY0FBQUFBZ0lEaERnQUFBQUFBQWNNZEFBQUFBQUFDaGpzQUFBQUFBQVFNZHdBQUFBQUFDQmp1QUFBQUFBQVFNTndCQUFBQUFDQmd1QU1BQUFBQVFNQndCd0FBQUFDQWdPRU9BQUFBQUFBQnd4MEFBQUFBQUFLR093QUFBQUFBQkF4M0FBQUFBQUFJR080QUFBQUFBQkF3M0FFQUFBQUFJR0M0QXdBQUFBQkF3SEFIQUFBQUFJQ0E0UTRBQUFBQUFBSERIUUFBQUFBQUFvWTdBQUFBQUFBRURIY0FBQUFBQUFnWTdnQUFBQUFBRUREY0FRQUFBQUFnWUxnREFBQUFBRURBY0FjQUFBQUFnSURoRGdBQUFBQUFBY01kQUFBQUFBQUNoanNBQUFBQUFBUU1kd0FBQUFBQUNCanVBQUFBQUFBUU1Od0JBQUFBQUNCZ3VBTUFBQUFBUU1Cd0J3QUFBQUNBZ09FT0FBQUFBQUFCd3gwQUFBQUFBQUtHT3dBQUFBQUFCQXgzQUFBQUFBQUlHTzRBQUFBQUFCQXczQUVBQUFBQUlHQzRBd0FBQUFCQXdIQUhBQUFBQUlDQTRRNEFBQUFBQUFIREhRQUFBQUFBQW9ZN0FBQUFBQUFFREhjQUFBQUFBQWdZN2dBQUFBQUFFRERjQVFBK08zWXNBQUFBQURESTMzb1NPd3NqQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVl4STRkQ3dBQUFBQU04cmVleE03Q1NMZ0RBQUFBQU1CQXVBTUFBQUFBd0VDNEF3QUFBQURBUUxnREFBQUFBTUJBdUFNQUFBQUF3RUM0QXdBQUFBREFRTGdEQUFBQUFNQkF1QU1BQUFBQXdFQzRBd0FBQUFEQVFMZ0RBQUFBQU1CQXVBTUFBQUFBd0VDNEF3QUFBQURBUUxnREFBQUFBTUJBdUFNQUFBQUF3RUM0QXdBQUFBREFRTGdEQUFBQUFNQkF1QU1BQUFBQXdFQzRBd0FBQUFEQVFMZ0RBQUFBQU1CQXVBTUFBQUFBd0VDNEF3QUFBQURBUUxnREFBQUFBTUJBdUFNQUFBQUF3RUM0QXdBQUFBREFRTGdEQUFBQUFNQkF1QU1BQUFBQXdFQzRBd0FBQUFEQVFMZ0RBQUFBQU1CQXVBTUFBQUFBd0VDNEF3QUFBQURBUUxnREFBQUFBTUJBdUFNQUFBQUF3Q0FCMnJGakFRQUFBSUJCL3RhVDJGa1lDWGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlDSGNBQUFBQUFCZ0lkd0FBQUFBQUdBaDNBQUFBQUFBWUNIY0FBQUFBQUJnSWR3QUFBQUFBR0FoM0FBQUFBQUFZQ0hjQUFBQUFBQmdJZHdBQUFBQUFHQWgzQUFBQUFBQVlCQlVZRXAxZE1XR3VBQUFBQUVsRlRrU3VRbUNDIiB0cmFuc2Zvcm09Im1hdHJpeCgwLjI0IDAgMCAwLjI0IDAgMCkiPjwvaW1hZ2U+PC9nPjxnIGlkPSJWZXJzaW9uMV8xXyI+PGcgaWQ9IlNoYXBlXzE3Ij48Zz48cGF0aCBmaWxsPSIjMDUwNTA1IiBkPSJNMzAxLDE4NC4zYy0yLjUtMS43LTI1LTE0LjEtNDAuNiwxLjJjMCwwLDktNS44LDE2LjEtNmM3LjEtMC4yLDE2LjUsMS4zLDIyLjgsNS4zYzYuMyw0LDguMiw0LjUsOC4yLDMuOEMzMDcuNCwxODgsMzAzLjUsMTg2LDMwMSwxODQuM3oiLz48L2c+PC9nPjxnIGlkPSJTaGFwZV8xMyI+PGc+PHBhdGggZmlsbD0iIzA1MDUwNSIgZD0iTTM0MiwyMTVjLTIuNC0zLjQtMy44LTcuNS00LjMtMy42cy0xLjgsOC45LTEuNywxMS4zcy0wLjQsNy41LDAuNSw3LjJzNi40LTAuNCw3LjQtNC42UzM0NC40LDIxOC40LDM0MiwyMTV6Ii8+PC9nPjwvZz48ZyBpZD0iU2hhcGVfMSI+PGc+PHBhdGggZmlsbD0iIzA1MDUwNSIgZD0iTTMxMy45LDczLjljMCwwLTMuOS03LjMtMTMuNy0xMi4ycy0xMC4zLTIuNi0xOC43LTkuNGMtOC40LTYuNy0yMC41LTIwLjgtNTQuNS0yMS4xYy0zNC0wLjQtNDIuNiw3LjEtNTMuMywxM2MtMTAuNiw1LjktMTAuNiwxMS41LTIxLjQsMjUuOWMtMTAuNywxNC40LTE0LjgsMzcuOS0xMC4zLDU4LjZjNC41LDIwLjYsNy43LDQwLjgsMTAuOCw1My4zczYuOCwxOS43LDcuMiwzMC41YzAsMC45LDAuMSwxLjcsMC4xLDIuMmMwLTAuNiwwLTEuMSwwLjEtMS4zYzAuMS0wLjEsMC4xLTAuMSwwLjEtMC4xYy0wLjItNC4yLTAuOS0xMi4yLTMtMjAuNWMtNC0xNS42LTkuMy01NC4xLTEuMi02NC44czIyLTI0LjQsMzQuNi0zMS45czI5LjItOS41LDM2LjctMTAuMWM3LjYtMC42LDItNCwxNC4yLTMuNnM1Mi40LDAuMiw2Ni4yLDE2LjhjMTMuOSwxNi42LDExLjgsMjQuOSwxMC44LDMxLjljLTEsNy4xLDEuOSwyMC45LDcuMiwzMC43YzUuMyw5LjksNC45LDE3LjMsNS44LDI1czguNyw2NC44LTkuMSw5N2MwLDAtMTIuOCwxNy40LTE4LjcsMTQuMmMtNS45LTMuMy01LjYtMy40LTYuNy0xMy40Yy0wLjktOCwxLjgtMTcuMi0zLjEtMjRjLTYuNC04LjktMTcuNC0xMi41LTI1LjItMTEuOGMtNi41LDAuOC05LjgtMC40LTEyLjUsMGMtMTAuMywxLjQtMTMuOCw1LjktMjAuNiw2LjJjLTcuNSwwLjQtMTIuOS01LjctMTguMi0zLjRjLTMsMS4zLTExLjksMy42LTE3LjksOC4zYy00LjQsMy41LTguMyw4LjEtOSwxMS4xYy0yLjQsMTAuOCwxMC4xLDEwLjksMTIuNiw2LjVjMS42LTIuOCwzLjctNC44LDguNC01LjVzOS4yLTAuMiwxMy43LTEuMnM0LjgtMy4xLDguOS0yLjljNCwwLjIsOS4yLTAuNiwxNC40LTEuNGM1LjItMC44LDUuNi0yLjEsMTAuMy0yLjljNC43LTAuOCwxOC0xLjUsMjIuMywxczkuNiw3LjIsOS42LDExLjVjMCw0LjMtNS4xLDI3LjUtOS4xLDM2LjdjLTYuNiwxNS4zLTIxLjYsMTQuMy0zMS40LDE2LjNjLTkuOCwyLTIwLjUsNS40LTI1LjIsMXMtMjAuMy0yNy4xLTIwLjktMzYuN2MtMC42LTkuNi0xLjgtMTIuMS0zLjQtMTIuMmMtNi4zLTAuNi04LjYsMTUuNi0xNS42LDVjLTQtNi0xMy43LTI4LjMtMTguNS00Mi43Yy00LjUtMTMuOC01LjEtMzAuNC02LjEtMzAuMWMwLjEsMy0wLjEsMy45LTAuMywxLjRjMC4yLDUuOCw1LjIsMjguMiw2LjQsMzUuNWMxLjMsOCwxMCwyOS44LDEyLjcsMzguNGMzLjYsMTEuNSwxMi45LDI2LjMsMTkuNywzMy4xYzcuOSw4LDE5LjcsMjcuNCwyNy40LDI5LjhjOS4zLDIuOCwzMC45LDMuOSw0My40LTQuNmMxMi41LTguNSwzMC40LTIzLjksMzYuNy0zMWM2LjQtNywyMy42LTMwLjMsMjcuOC02MC43YzQuMS0yOS43LDIuNS00Ni44LDEuOS01Ni42YzAsMCwyLjMtMTEuNyw4LjItMTMuNEMzNDQuNCwxODUsMzQ2LjIsOTMuMiwzMTMuOSw3My45eiIvPjwvZz48L2c+PGcgaWQ9IlNoYXBlXzE1Ij48Zz48cGF0aCBmaWxsPSIjMDUwNTA1IiBkPSJNMzYwLjUsMzE5LjdjLTYuNC01LjMtMjIuNy0yMC0yNC41LTMyLjJjLTEuOC0xMi4xLTEuOS0zMS41LTMuNi0zMGMtMS43LDEuNSwwLDUuNC0wLjIsNi4yYzAsMCwxLjcsMjIuMiwzLjYsMjYuOWMzLjksOS41LDE4LDMxLDQwLjYsMzkuOEMzNzYuMywzMzAuNSwzNjYuOSwzMjUsMzYwLjUsMzE5Ljd6Ii8+PC9nPjwvZz48ZyBpZD0iU2hhcGVfMTYiPjxnPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBmaWxsPSIjMDUwNTA1IiBkPSJNNDgwLDM5NS41Yy0zLjctMTIuNy05LjMtMjMtMTcuOC0yNy44Yy0zOC40LTIxLjktNjEuNi0zMS43LTY2LjUtMzMuMWMtOC45LTIuNy0xOS40LTUtMTkuNC01cy03LjIsNS4xLTE3LDE3Yy05LjksMTEuOS0yOSwyNi4zLTM4LjksMzEuOWMtOS45LDUuNi00NS41LDIxLjgtNTcuOCwyNS40cy0zNS45LDcuOS0yNC41LTI1LjljMCwwLTYuNi0xNy4zLTguNC0yMS40YzAsMC0xNi4zLDE2LjItMjYuNiwzNS44Yy04LjksMTYuOS0xOC41LDY3LjctMTguNiw4Ny42SDQ4MFYzOTUuNXoiLz48L2c+PC9nPjxnIGlkPSJTaGFwZV8yIj48Zz48cGF0aCBmaWxsPSIjMDUwNTA1IiBkPSJNMjAzLjMsMjcxLjlsLTExLjgtMS43YzAsMC0zLjQsMC42LTAuMiwxMS44YzEuOSw2LjctMC40LDguOS0wLjcsOS42Yy0wLjcsMS42LDEwLjYsMi40LDEwLjYsMi40czItNS45LDEuNC0xMS44QzIwMiwyNzYuNywyMDMuMywyNzEuOSwyMDMuMywyNzEuOXoiLz48L2c+PC9nPjxnIGlkPSJTaGFwZV8zIj48Zz48cGF0aCBmaWxsPSIjMDUwNTA1IiBkPSJNMTU3LjQsMjEzLjZjMC44LDMuMSwzLjIsNiw0LDguNGMtMC4yLTMuNi0wLjUtMTAuNS0xLjQtMTQuMkMxNjAuMSwyMDcuOCwxNTYuNCwyMDkuNywxNTcuNCwyMTMuNnogTTE2MS41LDIyMmMwLjEsMS45LDAuMiwyLjgsMC4zLDEuOUMxNjEuOCwyMjMuMywxNjEuNywyMjIuNywxNjEuNSwyMjJ6Ii8+PC9nPjwvZz48ZyBpZD0iU2hhcGVfNCI+PGc+PHBhdGggZmlsbD0iIzA1MDUwNSIgZD0iTTM1MS4xLDIxMi40Yy0xLjYtMTEuMSwwLjYtMTguMS0xLjQtMjEuNGMtMi0zLjItMy43LTYuMy00LjgtNmMtMC43LDAuMi0zLjksMS02LDQuMWMtMS41LDIuMi0xLjcsNi41LTMuMSw4LjJjMCwwLTAuMyw3LjMsMSw3LjJzOC42LTEzLjMsOS4xLTEwLjZjMC42LDIuOCwxLDYuNywxLDEwLjhzNS4xLDE0LjksMCwyNC4yYy01LjEsOS40LTQuNCwxMi42LTYuNywxNS40Yy0yLjMsMi43LTUuOSwyLjItNiwxYy0wLjEtMS4zLTEuOSw4LjUtMS43LDguOWMxLjcsMi45LDcuOCwyLjEsOS42LTEuN2MxLjgtMy44LDMuMy02LjMsNS41LTEzLjRDMzQ5LjcsMjMxLjksMzUyLjcsMjIzLjUsMzUxLjEsMjEyLjR6Ii8+PC9nPjwvZz48ZyBpZD0iU2hhcGVfNSI+PGc+PHBhdGggZmlsbD0iIzA1MDUwNSIgZD0iTTMxMS44LDE2Mi41Yy03LjYtNS41LTE5LjYtMTQuOC00NS40LTdsLTMuNiwxLjJjLTAuOSwwLjUtNS41LDMuNi01LjUsMy42bC0wLjUtMi42bC0yLjYsMi45bC0xLjItMS40YzAsMC0yLjcsNS4zLTMuNiw1LjVjLTEsMC4yLTMuOCwxMS43LDEsMTIuMmM0LjgsMC42LDguNS0yLjYsMTQuNC0zLjZjNS45LTEsMzUuNC0xMS43LDQ2LjYtNi4yQzMxMS4zLDE2NywzMTkuMywxNjgsMzExLjgsMTYyLjV6Ii8+PC9nPjwvZz48ZyBpZD0iU2hhcGVfNiI+PGc+PHBhdGggZmlsbD0iIzA1MDUwNSIgZD0iTTIxMy44LDE3MC45Yy0zLjItNi45LTEuNCwxLTEuNCwxbC0zLjEtNC4xYy0yLjctMS4xLTYuMi00LjgtNi4yLTQuOGMtMS4yLDEuNS0xMC43LDAuMy0xNy41LDEuMmMtNi44LDAuOS0zMy41LDQuNi0yNS43LDI0YzAsMCwyLjQtOS43LDEzLTkuMWMxNiwwLjksMzMuOSw0LjUsNDAuOCwyLjRDMjEzLjYsMTgxLjQsMjE3LjEsMTc3LjgsMjEzLjgsMTcwLjl6Ii8+PC9nPjwvZz48ZyBpZD0iU2hhcGVfNyI+PGc+PHBhdGggZmlsbD0iIzA1MDUwNSIgZD0iTTI5Ny4xLDE4OC40Yy0yLjctMS44LTE1LjQtMTEuOC0zMS0yLjljMCwwLTUuOCw0LjYtNy4yLDUuNWMwLDAsOC41LTMuNywxMS44LTQuNmMwLDAtMS4xLDYuNiw2LjIsNy43YzAsMCwxMS4zLDAuNCwxMC4xLTguNmMwLDAsNS40LDQuNCw4LjIsNC44QzI5OCwxOTAuNywyOTkuOCwxOTAuMiwyOTcuMSwxODguNHoiLz48L2c+PC9nPjxnIGlkPSJTaGFwZV84Ij48Zz48cGF0aCBmaWxsPSIjMDUwNTA1IiBkPSJNMjExLjQsMTk1LjRjMCwwLTkuMi03LjMtMTguNS0zLjZjLTkuMywzLjctMTAuOCw4LjgtMTQuMiwxMWMtMy40LDIuMiwwLjYsMS43LDMuNC0wLjJjMi44LTIsNi4zLTYuNSw3LjItNi41YzAsMC0wLjUsNS44LDMuNCw2LjdzOS40LTEuNSwxMC44LTMuMWMxLjQtMS42LDAuMy02LTAuNS02LjdMMjExLjQsMTk1LjR6Ii8+PC9nPjwvZz48ZyBpZD0iU2hhcGVfOSI+PGc+PHBhdGggZmlsbD0iIzA1MDUwNSIgZD0iTTI2NS45LDIzNS43YzEuOSwyLjktMi4zLDcuMy03LjIsNy40cy0xMi4zLDMuMy0xNy41LDcuN2MtNi4xLDUuMS0xMS44LDEuOC0xNy41LTAuNWMtNS44LTIuMy05LjItMi43LTEyLjctNmMtMy42LTMuMywyLjQtNy4yLDIuNC03LjJjLTkuMiwzLjctMy40LDExLDEuNywxMmM1LjEsMSw4LDMuMywxMi4yLDQuOHM4LjUsMS44LDE0LjYtMWM2LjUtMi45LDExLjQtNS45LDE1LjgtNmM0LjUtMC4xLDYuNi0yLjQsOC42LTYuMkMyNjguOCwyMzYuMiwyNjUuOSwyMzUuNywyNjUuOSwyMzUuN3oiLz48L2c+PC9nPjxnIGlkPSJTaGFwZV8xMCI+PGc+PHBhdGggZmlsbD0iIzA1MDUwNSIgZD0iTTIxOC40LDI0NC4xYy0xLjMtNC45LDAuNC05LjMtMC41LTExLjNjLTAuMy0wLjctMS42LDguNC0wLjcsMTEuM2MwLjksMi44LDEuNCwzLjYsMy44LDQuM0MyMjMuNCwyNDkuMSwyMTkuNSwyNDguMywyMTguNCwyNDQuMXoiLz48L2c+PC9nPjxnIGlkPSJTaGFwZV8xMSI+PGc+PHBhdGggZmlsbD0iIzA1MDUwNSIgZD0iTTI4My4yLDI2OC4zYy0zLjksMC0xMi42LTIuNS0xNS42LTIuMmMtMywwLjMtMTUuMywzLjUtMjAuNiw1Yy01LjMsMS41LTE1LjYsMS42LTIyLjYsMi40Yy03LDAuOC0xMC40LDEuNy0xMy40LDIuNGMtMy4xLDAuNy02LjYsMS40LTMuMSw1LjVjMCwwLDcuMiw4LjgsMTEuNSwxMy43YzQuMyw0LjksMTAuMywxMS45LDI2LjksOC45czIyLjctNy40LDI3LjQtMTQuNGM0LjctNyw3LjQtMTIsMTAuMy0xNS42QzI4Ni44LDI3MC40LDI4Ny4xLDI2OC4zLDI4My4yLDI2OC4zeiIvPjwvZz48L2c+PGcgaWQ9IlNoYXBlXzE4Ij48Zz48cGF0aCBmaWxsPSIjMDUwNTA1IiBkPSJNMTk5LjIsMTg3LjJjLTItMC4yLTE0LjYsNS4zLTE3LjgsNi4yYy0zLjEsMC45LTgsOC4xLTcuOSw4LjljMCwwLjgtMC42LDEuNiwzLjQtMy4xYzMuOS00LjcsMTAuOS03LjEsMTktMTAuM2M4LjgtMy42LDE1LjQsMy4xLDE1LjQsMy4xQzIwOC4xLDE4Ny40LDIwMS4yLDE4Ny40LDE5OS4yLDE4Ny4yeiIvPjwvZz48L2c+PGcgaWQ9IlNoYXBlXzE0Ij48Zz48cGF0aCBmaWxsPSIjMDUwNTA1IiBkPSJNMjI3LjMsMzQ5LjdjLTEuOC0wLjYsNC41LDEzLjIsMTAuMSwyNy42YzUsMTMsOS4zLDI2LjYsOS44LDI4LjhjMS4yLDQuNiwxLjksMS45LDEuOSwxLjlDMjUwLjQsNDAxLDIyOC4yLDM1MCwyMjcuMywzNDkuN3oiLz48L2c+PC9nPjxnIGlkPSJTaGFwZV8xMiI+PGc+PHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTI3NiwyNzEuN2MtNiwxLjUtMjQsNy4xLTMzLjYsNy45Yy05LjYsMC44LTIwLjIsMC40LTI0LjIsMC41Yy00LDAuMS02LjMsMS45LTMuNiwzLjhjMCwwLDYuNSw1LjMsMTYuMSw3LjJjOS42LDEuOSwxNi44LDEuNiwyMi4xLTFjNS4zLTIuNSwxNy44LTkuNywyMS42LTEyLjJDMjc3LjEsMjc2LjEsMjgyLDI3MC4yLDI3NiwyNzEuN3oiLz48L2c+PC9nPjwvZz48L3N2Zz4=)';
        $a = '';
    }
    public static function sticky_copyright() {
        echo '<p class="hidden_copyright">&copy; 2015 - Sticky Admin, a WordPress plugin by Dorian Tudorache. All Rights Reserved.</p>';
    }
    public static function sticky_extensions() {
        // Whatever else is need for Sticky Admin UI
    }
    /**
     *
     * Updates the menu positions.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_update_menu_positions() {
        update_user_meta( get_current_user_id(), self::$current_blog_id . '_sticky_menu_order', str_replace('admin.php?page=', '', $_REQUEST['menu_item_positions'])); // str_replace (support for custom added menu items)
    }
    /**
     *
     * Updates the hidden items on adminmenu.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_update_menu_hidden_items() {
        update_user_meta( get_current_user_id(), self::$current_blog_id . '_sticky_menu_hidden_items', str_replace('admin.php?page=', '', $_REQUEST['menu_items_to_hide']));
    }
    /**
     *
     * Gets the custom menu order.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_custom_menu_order( $menu_order ) {
        global $menu;
        if ( ! $menu_order)
            return true;
        $new_menu_order = get_user_meta(get_current_user_id(), self::$current_blog_id . '_sticky_menu_order', true);
        if ( $new_menu_order ) {
            $new_menu_order = explode(',', $new_menu_order);
            return $new_menu_order;
        } else {
            return $menu_order;
        }
    }
    /**
     *
     * Removes the original admin menu.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_remove_orig_menu() {
        global $orig_menu, $menu, $orig_submenu, $submenu;
        $orig_menu = $menu; // This is where we'll keep a copy of the admin $menu as it gets emptied later on. 
        $orig_submenu = $submenu;
        // If the menus have been set, remove all of them
        if ( ! empty( self::$original_admin_menu ) ) {
            foreach ( self::$original_admin_menu as $menu_item ) {
                remove_menu_page( $menu_item['menu_slug'] );
                // Cycle through all sub-menus now, if they exist
                if ( ! empty( $menu_item['submenus'] ) ) {
                    foreach ( $menu_item['submenus'] as $submenu_item ) {
                        remove_submenu_page( $menu_item['menu_slug'], $submenu_item['menu_slug'] );
                    }
                }
            }
        }
    }
    /**
     *
     * Adds the new, modified admin menu.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_admin_menu() {
        global $orig_menu, $orig_submenu, $parent_file, $admin_page_hooks, $orig_menu;
        // Get current role
        // $current_role = $this->get_user_role();
        // Handy hook :)
        do_action( 'sticky_before_nav' );
        // Replace the Menu Output function by WordPress
        _wp_menu_output( $orig_menu, $orig_submenu, false );
    }
    /**
     *
     * Adds a new, modified instance of the editor with
     * custom options. 
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_editor( $in ) {
        // $in['plugins']='inlinepopups,spellchecker,tabfocus,paste,media,fullscreen,wordpress,wpeditimage,wpgallery,wplink,wpdialogs';
        // $in['wpautop']=true;
        // $in['apply_source_formatting']=false;
        // $in['theme_advanced_buttons1']='formatselect,forecolor,|,bold,italic,underline,|,bullist,numlist,blockquote,|,justifyleft,justifycenter,justifyright,justifyfull,|,link,unlink,|,wp_fullscreen,wp_adv';
        // $in['theme_advanced_buttons2']='pastetext,pasteword,removeformat,|,charmap,|,outdent,indent,|,undo,redo';
        // $in['theme_advanced_buttons3']='';
        // $in['theme_advanced_buttons4']='';
        $in['skin']=NULL;
        return $in;
    }
    /**
     * Gets the current user's role.
     *
     * @since 1.0
     * @author Dorian Tudorache
     * @return mixed - The role.
     *
     */
    public static function get_user_role() {
        global $current_user;
        $user_roles = $current_user->roles;
        $user_role  = array_shift( $user_roles );
        return $user_role;
    }
    /**
     *
     * Returns the original, un-modified admin menu.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_original_admin_menu() {
        global $menu, $submenu, $orig_menu, $orig_submenu;
        $orig_menu = $menu;
        $orig_submenu = $submenu;
    }
    /**
     * Get the original, un-modified admin menu.
     *
     * @since 1.0
     */
    public static function sticky_get_orig_admin_menu() {
        global $menu, $submenu, $wp_filter;
        // $menu
        // 0 => Menu Title, 1 => Capability, 2 => Slug, 3 => Page Title, 4 => Classes, 5 => Hookname, 6 => Icon
        // $submenu
        // 0 => Menu Title, 1 => Capability, 2 => Slug, 3 => Page Title
        foreach ( $menu as $menu_location => $menu_item ) {
            // Skip links IF the link manager is not enabled
            // Links are disabled as of WP 3.5, and only enabled with the presence of this filter being true. So if this
            // filter is set, we can pretty safely assume it's set to true.
            if ( $menu_item[0] == 'Links' && isset( $wp_filter['pre_option_link_manager_enabled'] ) ) {
                continue;
            }
            $menu_array = array(
                'menu_title' => isset( $menu_item[0] ) ? $menu_item[0] : null,
                'capability' => isset( $menu_item[1] ) ? $menu_item[1] : null,
                'menu_slug'  => isset( $menu_item[2] ) ? $menu_item[2] : null,
                'page_title' => isset( $menu_item[3] ) ? $menu_item[3] : null,
                'position'   => $menu_location,
                'hookname'   => isset( $menu_item[5] ) ? $menu_item[5] : null,
                'icon_url'   => isset( $menu_item[6] ) && $menu_item[6] != 'dashicons-admin-generic' ? $menu_item[6] : null
            );
            $orig_menu[ $menu_location ] = $menu_array;
            // Loop through all of the sub-menus IF they exist
            if ( ! empty( $submenu[ $menu_array['menu_slug'] ] ) && is_array( $submenu[ $menu_array['menu_slug'] ] ) ) {
                foreach ( $submenu[ $menu_array['menu_slug'] ] as $submenu_location => $submenu_item ) {
                    $submenu_array = array(
                        'menu_title'  => isset( $submenu_item[0] ) ? $submenu_item[0] : null,
                        'capability'  => isset( $submenu_item[1] ) ? $submenu_item[1] : null,
                        'menu_slug'   => isset( $submenu_item[2] ) ? $submenu_item[2] : null,
                        'page_title'  => isset( $submenu_item[3] ) ? $submenu_item[3] : null,
                        'parent_slug' => $menu_array['menu_slug']
                    );
                    $orig_menu[ $menu_location ]['submenus'][ $submenu_location ] = $submenu_array;
                }
            }
        }
        // Sort the menus, then re-index them by their position
        ksort( $orig_menu );
        $i = - 1;
        foreach ( $orig_menu as $menu_item ) {
            $i ++;
            $i_parent       = $i;
            $new_menu[ $i ] = $menu_item;
            if ( isset( $menu_item['submenus'] ) ) {
                unset( $new_menu[ $i ]['submenus'] );
                foreach ( $menu_item['submenus'] as $submenu_item ) {
                    $i ++;
                    $new_menu[ $i_parent ]['submenus'][ $i ] = $submenu_item;
                }
            }
        }
        // self::$total_menu_items    = $i;
        self::$original_admin_menu = $new_menu;
    }

    /**
     *
     * JavaScript for the Login Page.
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public static function sticky_login_page_js() {
        do_action( 'sticky_login_enqueues' );
        echo '<script type="text/javascript">';
        echo apply_filters( 'sticky_login_dynamic_js', '' );
        echo '</script>';
    }

    /**
     *
     * Sticky Admin plugin localization
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    public function load_plugin_textdomain() {
        $domain = $this->plugin_slug;
        $locale = apply_filters( 'plugin_locale', get_locale(), $domain );
        load_textdomain( $domain, trailingslashit( WP_LANG_DIR ) . $domain . '/' . $domain . '-' . $locale . '.mo' );
        load_plugin_textdomain( $domain, FALSE, basename( plugin_dir_path( dirname( __FILE__ ) ) ) . '/i18n/languages/' );
    }
}
endif;
?>
