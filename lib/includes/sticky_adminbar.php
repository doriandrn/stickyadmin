<?php
    // Avoid direct access to this piece of code
    if ( !function_exists( 'add_action' ) )
        exit;
    
    
    function sticky_adminbar_dynamic_css() {
        global $grab_data;
        if ( is_admin() ) {
            $s_nav_bg =
                ( isset ( $grab_data[ 'nav_bg' ] ) )
                ? $grab_data[ 'nav_bg' ] 
                : '#1a1f2b';
        }
        $wpab_background =
            ( isset ( $grab_data[ 'wpadminbar_bg' ] ) )
            ? $grab_data['wpadminbar_bg']
            : '#30395c';
        $wpab_sub_background =
            ( isset ( $grab_data[ 'wpadminbar_sub_bg' ] ) )
            ? $grab_data[ 'wpadminbar_sub_bg' ]
            : '#ffffff';
        $wpab_sticky =
            ( isset ( $grab_data[ 'wpadminbar_sticky' ] ) )
            ? $grab_data[ 'wpadminbar_sticky' ]
            : true;
        $wpab_hide =
            ( isset ( $grab_data[ 'wpadminbar_hide' ] ) )
            ? $grab_data[ 'wpadminbar_hide' ]
            : false;
        $wpab_controls =
            ( isset ( $grab_data[ 'wpadminbar_controls' ] ) )
            ? $grab_data[ 'wpadminbar_controls' ]
            : true;
        $wpab_profile_link =
            ( isset ( $grab_data[ 'wpadminbar_profile_link_bg' ] ) )
            ? $grab_data[ 'wpadminbar_profile_link_bg' ]
            : '#1a1f2b';
        $wpab_profile_bg =
            ( isset ( $grab_data[ 'wpadminbar_profile_bg' ] ) )
            ? $grab_data[ 'wpadminbar_profile_bg' ]
            : '#1a1f2b';
        $wpab_badges =
            ( isset ( $grab_data[ 'wpadminbar_badges' ] ) )
            ? $grab_data[ 'wpadminbar_badges' ]
            : '#d0e4f2';
        $wpab_tooltip_disable =
            ( isset ( $grab_data[ 'wpab_tooltips_disable' ] ) )
            ? $grab_data[ 'wpab_tooltips_disable' ]
            : false;
        $wpab_tooltip =
            ( isset ( $grab_data[ 'wpab_tooltips_bg' ] ) )
            ? $grab_data[ 'wpab_tooltips_bg' ]
            : '#ffffff';
        $wpab_search = 
            ( isset( $grab_data[ 'wpab_search' ] ) )
            ? $grab_data[ 'wpab_search' ] 
            : false;
        echo minify_css( '
            
        ' );

        if ( ! $wpab_search ) echo minify_css( '#wpadminbar .quicklinks #wp-admin-bar-search { display:none!important; }' );
        if ( isset ( $s_nav_bg ) ) {
            if ( sticky_luminance( $s_nav_bg ) ) {
                echo minify_css( '.wp-responsive-open #wpadminbar #wp-admin-bar-menu-toggle .ab-icon:before { color: #000 !important; }' );
            } else {
                echo minify_css( '.wp-responsive-open #wpadminbar #wp-admin-bar-menu-toggle .ab-icon:before { color: #fff !important; }' );
            }
        }
        
        if ( isset( $grab_data[ 'wp_logo' ] ) && ! $grab_data[ 'wp_logo' ] ) {
            echo minify_css( '#wpadminbar li#wp-admin-bar-wp-logo { display:none; }' );
        }
        /* User Profile */
        // Polymorphism! :)
        if ( ! sticky_luminance( $wpab_profile_link ) ) {
            echo minify_css( '
                #wpadminbar .quicklinks #wp-admin-bar-my-account > a { color: rgba(255,255,255,.75); }
                #wpadminbar .quicklinks #wp-admin-bar-my-account > a:hover,
                #wpadminbar .quicklinks #wp-admin-bar-my-account > a:focus { color: rgba(255,255,255,.95)!important; }
                #wpadminbar .quicklinks li#wp-admin-bar-my-account.with-avatar > a img, #wp-admin-bar-user-info .avatar { border:2px solid rgba(255,255,255,.35); }
            ' );
        } else {
            echo minify_css( '
                #wpadminbar .quicklinks #wp-admin-bar-my-account > a { color: rgba(0,0,0,.75); }
                #wpadminbar .quicklinks #wp-admin-bar-my-account > a:hover,
                #wpadminbar .quicklinks #wp-admin-bar-my-account > a:focus { color: rgba(0,0,0,.95)!important; }
                #wpadminbar .quicklinks li#wp-admin-bar-my-account.with-avatar > a img, #wp-admin-bar-user-info .avatar { border:2px solid rgba(0,0,0,.35); } 
            ' );
        }
        if ( ! sticky_luminance( $wpab_profile_bg ) ) {
            echo minify_css( '
                ul#wp-admin-bar-my-account-buddypress { border:1px solid rgba(255,255,255,.1); }
                
                #wpadminbar #wp-admin-bar-user-actions a { color: rgba(255,255,255,.75); }
                #wpadminbar #wp-admin-bar-user-info a { color: rgba(255,255,255,.85)!important; }
                #wpadminbar #wp-admin-bar-user-info a:hover { color: rgba(255,255,255,1)!important; }
                #wpadminbar .ab-top-secondary #wp-admin-bar-my-account .ab-sub-wrapper a { color: rgba(255,255,255,.75); }
                #wpadminbar .ab-top-secondary #wp-admin-bar-my-account .ab-sub-wrapper a:hover { color: rgba(255,255,255,.95)!important; }
            ' );
        } else {
            echo minify_css( '
                ul#wp-admin-bar-my-account-buddypress { border:1px solid rgba(0,0,0,.1); }
                #wpadminbar #wp-admin-bar-user-actions a { color: rgba(0,0,0,.75); }
                #wpadminbar #wp-admin-bar-user-info a { color: rgba(0,0,0,.85)!important; }
                #wpadminbar #wp-admin-bar-user-info a:hover { color: rgba(0,0,0,1)!important; }
                #wpadminbar .ab-top-secondary #wp-admin-bar-my-account .ab-sub-wrapper a { color: rgba(0,0,0,.75); }
                #wpadminbar .ab-top-secondary #wp-admin-bar-my-account .ab-sub-wrapper a:hover { color: rgba(0,0,0,.95)!important; }
            ' );
        }
        echo minify_css( '#wpadminbar .ab-top-secondary #wp-admin-bar-my-account .ab-sub-wrapper { background: ' . $wpab_profile_bg . ' }' );
        if ( ! sticky_luminance( $wpab_background ) ) {
            echo minify_css( '
                /* Defaults */
                #wpadminbar { color:rgba(255,255,255,.65); }
                #wpadminbar a { color:rgba(255,255,255,.85); }
                #wpadminbar a:hover,
                #wpadminbar .quicklinks > ul:first-child > li:hover > a { color:#fff!important }
                #wpadminbar a.ab-item { color:rgba(255,255,255,.75); }
                #wpadminbar a.ab-item:hover { color:rgba(255,255,255,.9)!important }
                
                #wpadminbar #wp-admin-bar-root-default > li:not(.first-child):not(#wp-admin-bar-wp-logo):before {
                    background: #FFF;
                }
                /* Sticky Bar Buttons */
                #wpadminbar .sticky_toggle button { color:rgba(255,255,255,.25)!important; }
                #wpadminbar .sticky_toggle button:hover { color:rgba(255,255,255,.95)!important; }
                /* Profile Link - ( second bar ) */
                
                /* New Content Button */
                #wpadminbar #wp-admin-bar-new-content.hover > .ab-item:before { color:rgba(255,255,255,.5) }
                #wpadminbar #wp-admin-bar-new-content .ab-label { color:rgba(255,255,255,.85); }
                #wpadminbar #wp-admin-bar-new-content a:hover .ab-label { color:rgba(255,255,255,1)!important; }
                #wpadminbar #wp-admin-bar-view > a { border-color: rgba(255,255,255,.15)!important; }
                #wpadminbar #wp-admin-bar-new-content:hover > a, 
                #wpadminbar .quicklinks #wp-admin-bar-view:hover > a { border-color:rgba(255,255,255,.5)!important }

                
                /* Links with submenus */
                #wpadminbar .quicklinks #wp-admin-bar-root-default .menupop:hover .ab-icon:before,
                #wpadminbar .quicklinks #wp-admin-bar-root-default .menupop:hover .ab-label { color:rgba(255,255,255,.9)!important }
                #wpadminbar .quicklinks #wp-admin-bar-root-default .menupop li:hover,
                #wpadminbar .quicklinks #wp-admin-bar-root-default .menupop li.hover,
                #wpadminbar .quicklinks #wp-admin-bar-root-default .menupop .ab-item:focus,
                #wpadminbar .quicklinks #wp-admin-bar-root-default .ab-top-menu .menupop .ab-item:focus { color:#fff!important } 
            ' );
        } else {
            echo minify_css( '
                /* Defaults */
                #wpadminbar { color:rgba(0,0,0,.65); }
                #wpadminbar a { color:rgba(0,0,0,.85); }
                #wpadminbar a:hover,
                #wpadminbar .quicklinks > ul:first-child > li:hover > a  { color:#000!important }
                #wpadminbar a.ab-item { color:rgba(0,0,0,.75); }
                #wpadminbar a.ab-item:hover { color:rgba(0,0,0,.9)!important }
                
                #wpadminbar #wp-admin-bar-root-default > li:not(.first-child):not(#wp-admin-bar-wp-logo):before {
                    background: #000;
                }
                /* Sticky Bar Buttons */
                #wpadminbar .sticky_toggle button { color:rgba(0,0,0,.25)!important; }
                #wpadminbar .sticky_toggle button:hover { color:rgba(0,0,0,.95)!important; }
                /* Profile Link - ( second bar ) */
                #wpadminbar .ab-top-secondary #wp-admin-bar-my-account { background: ' . $wpab_profile_link . '; }
                /* New Content Button */
                #wpadminbar #wp-admin-bar-new-content.hover > .ab-item:before { color:rgba(0,0,0,.5) }
                #wpadminbar #wp-admin-bar-new-content .ab-label { color:rgba(0,0,0,.85); }
                #wpadminbar #wp-admin-bar-new-content .ab-label:after { color:rgba(0,0,0,.35); }
                #wpadminbar #wp-admin-bar-new-content a:hover .ab-label { color:rgba(0,0,0,1)!important; }
                #wpadminbar #wp-admin-bar-view > a { border-color: rgba(0,0,0,.15)!important; }
                #wpadminbar #wp-admin-bar-new-content:hover > a, 
                #wpadminbar .quicklinks #wp-admin-bar-view:hover > a { border-color:rgba(0,0,0,.5)!important }

                /* Links with submenus */
                #wpadminbar .quicklinks #wp-admin-bar-root-default .menupop:hover .ab-icon:before,
                #wpadminbar .quicklinks #wp-admin-bar-root-default .menupop:hover .ab-label { color:rgba(0,0,0,.9)!important }
                #wpadminbar .quicklinks #wp-admin-bar-root-default .menupop li:hover,
                #wpadminbar .quicklinks #wp-admin-bar-root-default .menupop li.hover,
                #wpadminbar .quicklinks #wp-admin-bar-root-default .menupop .ab-item:focus,
                #wpadminbar .quicklinks #wp-admin-bar-root-default .ab-top-menu .menupop .ab-item:focus { color:#000!important } 
            ' );
        }

        echo minify_css( '
            #wpadminbar,
            #wpadminbar .sticky_toggle button,
            #wpadminbar .sticky_toggle:before,
            #wpadminbar .sticky_toggle:after {
                background:'. $wpab_background .'!important;
            }
            #wpadminbar .menupop .ab-sub-wrapper {
                background:'. $wpab_sub_background .';
            }
            #wp-admin-bar-bp-notifications .count, #wp-admin-bar-comments .ab-label, #wp-admin-bar-updates .ab-label {
                border: 2px solid '. $wpab_sub_background .';
            }
            #wpadminbar .menupop .ab-sub-wrapper:before {
                border-bottom-color:'. $wpab_sub_background .'!important;
            }
            #wp-admin-bar-bp-notifications .count,
            #wp-admin-bar-comments .ab-label,
            #wp-admin-bar-updates .ab-label {
                background:'. $wpab_badges .';
          }' );
    }
    // add_filter( 'sticky_adminbar_css', 'sticky_adminbar_dynamic_css' );
?>
