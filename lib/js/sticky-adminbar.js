$s_ui = jQuery.noConflict();
/**
 * Sticky - Adminbar JS
 *
 * @version 1.0.0
 * @copyright 2015
 * @author Dorian Tudorache
 * @link www.stickyadmin.net
 *
 * @license See Licensing folder
 *
 * @package Sticky Admin
 *
 */
$s_ui(function() {
    wpadminbar = document.getElementById( 'wpadminbar' );
    if ( ! wpadminbar ) 
        return;

    sticky_restyle_adminbar( wpadminbar );
});

// A function that restyles some adminbar elements
function sticky_restyle_adminbar( bar ) {
    // This will ensure the iconpicker only fires in the backend
    if ( typeof sticky_do_iconpicker == 'function' )
        sticky_do_iconpicker( $s_ui( element, bar ), 'bar' );
    
    var element = '#wp-admin-bar-root-default > li';
    sticky_wpab_append_names_to_menus( element );
    sticky_wpab_sites_menu();
    sticky_wpab_controls();
    sticky_wpab_notifications();
    sticky_wpab_no_notifications();
    sticky_wpab_mobile();
    sticky_wpab_tooltips();
}

function sticky_wpab_sites_menu() {
    var selector = $s_ui( '#wp-admin-bar-site-name', wpadminbar );
    if ( ! selector.length ) 
        return;
    var subwrapper = $s_ui( '.ab-sub-wrapper', selector );
    if ( ! subwrapper.length ) 
        return;

    var container = $s_ui( '<ul id="sticky_view_site"></ul>' ).appendTo( subwrapper );

    var lis = '#wp-admin-bar-view-site, #wp-admin-bar-edit-site';
    $s_ui( lis, selector ).each( function() {
        $s_ui(this).prependTo( container );
    });
}

// Puts the names to WPAB submenus so we can keep the WPAB clean
function sticky_wpab_append_names_to_menus( selector ) {
    selector = $s_ui( selector, wpadminbar );
    if ( ! selector.length ) 
        return;

    selector.each(function() {
        var li = $s_ui(this);
        if ( li.attr('id') == 'wp-admin-bar-menu-toggle' ) 
            return;

        var item = $s_ui('> a.ab-item', li) ;
        var itemtext = item.text(), hasSubmenu = false;

        if ( item.parent().find( '.ab-sub-wrapper').length === 0 ) 
            item.attr( 'title', itemtext );
        else 
            $s_ui( '<li class="sticky-menu-head">' + itemtext + '</li>' ).prependTo( $s_ui( '> .ab-sub-wrapper > ul:first-child', li ) );
    });
}

// BuddyPress Notifications, replace title
function sticky_wpab_no_notifications() {
    var ael = $s_ui('#wp-admin-bar-bp-notifications > a.ab-item');
    if ( ! ael.length ) 
        return;

    var no_notifs = ( ! ael.hasClass( 'new' ) ? true : false );
    var no_el = $s_ui( '#wp-admin-bar-no-notifications' );
    if ( no_notifs ) {
        ael.attr('title',no_el.text());
        // ael.closest('.ab-sub-wrapper').remove();
    }
}

// Controls the WpAdminBar State
function sticky_wpab_controls() {
    var toggle = $s_ui('#wpadminbar #sticky_toggle');
    if ( ! toggle.length || ! stickyObj.wpab_controls ) return;
    
    var clck = 0;

    $s_ui('#sticky_resize', toggle).click(function() {
        var newstate, state = sticky_get_wpab_state();
        switch (state) {
            case 'minimized': newstate = 'maximized'; break;
            case 'maximized': newstate = 'minimized'; break;
        }
        body.removeClass('wpab-' + state).addClass('wpab-' + newstate);
        setCookie('sticky_wpab', newstate);
        sticky_adjust_wrap_height();
        clck ++;
        if ( clck == 1 ) 
            body.addClass('sticky-bar-anim');
    });

    $s_ui('#sticky_close', toggle).click(function() {
        if ( ! stickyObj.s_admin ) return;
        sticky_wpab_close();
    });  
}

// Gets the active WpAdminBar state
function sticky_get_wpab_state() {
    var states = [ 'minimized', 'maximized', 'closed' ], active = false;
    states.forEach(function( element, index ) {
        var checkfor = 'wpab-' + element;
        if ( body.hasClass(checkfor) ) {
            active = element;     
        }
    });
    
    return active;
}

function sticky_wpab_tooltips() {
    $s_ui(window).load(function() {
        $s_ui('#wpadminbar [title!=""]').qtip({
            position: {
                my: 'top center',
                at: 'bottom left',
                viewport: $s_ui(window),
                // target: 'mouse',
                adjust: {
                    x: 10,
                    y: 5
                }
            },
            show: {
                delay: 0
            },
            style: {
                classes: 'sticky_wpab'
            }
        }); 
    }); 
}

function sticky_wpab_close() {
    body.removeClass('wpab-maximized wpab-minimized').addClass('wpab-closed');
    setCookie('sticky_wpab', 'closed');
    toastr.info('<p>' + stickyObj.wpab_close_message + '</p>');
}

function sticky_wpab_mobile() {
    $s_ui('#wpadminbar .quicklinks ul li.menupop > a').click(function( e ) {
        e.preventDefault();
    });
}

// Hide 'no-notifications' ( zero new notifications )
function sticky_wpab_notifications() {
    $s_ui(window).ready(function() {
        var selector = $s_ui( '#wp-admin-bar-bp-notifications .count, #wp-admin-bar-comments .ab-label, #wp-admin-bar-updates .ab-label', wpadminbar );
        if ( ! selector.length ) return;
        selector.each( function() {
            el = $s_ui(this);
            if ( el.text() != '0' ) {
                el.closest('a').addClass('new');
            } else {
                el.closest('a').addClass('no-new');
                el.remove();  
            }
        });
    });
}