<?php
    /**
     *
     * Login page UI & UX
     * 
     * @author Dorian Tudorache
     * @since 1.0
     *
     */
    // Avoid direct access to this piece of code
    if ( !function_exists( 'add_action' ) )
        exit;

    function sticky_login_dynamic_css() {
        echo minify_css( '
            body.login:before { 
                background: url( ' . StickyAdmin::$config['login']['bg_image'] . ' ); 
            }' 
        );
        if ( StickyAdmin::$config['login']['bg_color'] == '' ) {
            echo minify_css( 'body.login:before{opacity:1!important}' );
        }
        if ( ! StickyAdmin::$config['login']['display_logo'] ) {
            echo minify_css( ".login h1 { display:none!important; }" );
        }
        if ( isset ( StickyAdmin::$config['login']['bg_image'] ) && StickyAdmin::$config['login']['bg_image'] != '' ) {
            echo minify_css( "body.login.no-js { background: url('" . StickyAdmin::$config['login']['bg_image'] . "'); background-size: cover; }" );
        }
        
        echo minify_css('
            #login h1 { background: '. StickyAdmin::$config['colors']['adminmenu']['bg'] .'}
            #login #backtoblog a { color: ' . ( sticky_luminance( StickyAdmin::$config['colors']['adminmenu']['bg'] ) ? 'rgba(0,0,0,.25)' : 'rgba(255,255,255,.25)' ) . ';}
            body.login #login p.forgetmenot.on { background: '. StickyAdmin::$config['colors']['content']['hl'] .'; }
        ');

        // Logo affichage
        switch ( StickyAdmin::$config['logo']['how'] ) {
            case 'svg':
                $logo_svg = base64_encode( StickyAdmin::$config['logo']['show'] );
                echo minify_css('.login h1 a { background: url("data:image/svg+xml;base64, ' . $logo_svg . '") 50% 50% no-repeat; }');    
                break;
            case 'image':
                echo minify_css( ".login h1 a { background: url('" . StickyAdmin::$config['logo']['image_path'] . "') center center no-repeat;}" );
                break;
        }
       
    }
    add_filter( 'sticky_filter_login_styles', 'sticky_login_dynamic_css' );

    function sticky_login_enq() {
        // Remove shake js
        remove_action( 'login_head', 'wp_shake_js', 12 );
        // Required Scripts for the Login Page
        sticky_addScript ( 'Login', STICKY_LOGIN );
    }
    add_action( 'sticky_login_enqueues', 'sticky_login_enq' );

    function sticky_login_js() {
        global $grab_data, $login_background_image, $sticky_themes_images;
        echo 'jQuery(document).ready(function() {';
        if ( $login_background_image != '' ) {
            echo 'sticky_login_image("' . $login_background_image . '");';
        }
        echo '});';
        unset( $login_background_image );
    }
    add_filter( 'sticky_login_dynamic_js', 'sticky_login_js' );

?>