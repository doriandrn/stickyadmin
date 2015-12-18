<?php

echo '
#wpadminbar,
#wpadminbar .sticky_toggle button,
#wpadminbar .sticky_toggle:before,
#wpadminbar .sticky_toggle:after {
    background:'. StickyAdmin::$config['colors']['adminbar'] .'!important;
}
#wpadminbar .menupop .ab-sub-wrapper {
    background:'. StickyAdmin::$config['colors']['adminbar'] .';
}
#wp-admin-bar-bp-notifications .count, #wp-admin-bar-comments .ab-label, #wp-admin-bar-updates .ab-label {
    border: 2px solid '. StickyAdmin::$config['colors']['adminbar'] .';
}
#wpadminbar .menupop .ab-sub-wrapper:before {
    border-bottom-color:'. StickyAdmin::$config['colors']['adminbar'] .'!important;
}
#wpadminbar .ab-top-secondary #wp-admin-bar-my-account { 
    background: ' . StickyAdmin::$config['colors']['adminbar_profile'] . '; 
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
    background:'. StickyAdmin::$config['colors']['adminbar_badges'] .';
}
';

    // if ( is_admin() ) {
echo
'body, 
body.is_loading #overlay, 
#wpbody,
#post-status-info,
div.mce-toolbar-grp > div,
#ed_toolbar,
.switch-html:before,
.switch-html:after,
.switch-tmce:before,
.switch-tmce:after
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
    background-color: '. StickyAdmin::$config['colors']['scrollbar_rail'] . ';
}
#adminmenuback,
#adminmenuwrap,
#adminmenuwrap:before,
#adminmenuwrap .menu_settings,
#sidemenu,
body.admin-bar #adminmenu,
.wp-responsive-open #wpadminbar #wp-admin-bar-menu-toggle a,
.wp-responsive-open .wrap > h1:first-child > a#wp-menu-toggle,
.wp-responsive-open .wrap > h2:first-child > a#wp-menu-toggle,
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
    background-color:' . StickyAdmin::$config['colors']['adminmenu_badges'] . '!important;
}
#adminmenu li.menu-top:hover > a .wp-menu-name:before,
#adminmenu li.opensub:hover > a .wp-menu-name:before,
#adminmenu li.menu-top > a:hover .wp-menu-name:before,
#adminmenu li.opensub > a:hover .wp-menu-name:before {
    color:' . sticky_make_hl_color( StickyAdmin::$config['colors']['adminmenu_icons'] ) . ' !important;
}
.picker_open div.sticky_nav_icon_picker,
body:not(.mobile) #adminmenu .wp-not-current-submenu .wp-submenu,
body.folded:not(.mobile) #adminmenu .wp-has-current-submenu .wp-submenu {
    background:' . StickyAdmin::$config['colors']['adminmenu_submenu'] . '!important;
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
#overlay svg path {
    fill:' . StickyAdmin::$config['hl_colors'][0] . ';
}
.wrap > .subsubsub a.current .count { 
    color:rgba('.hex2rgb(StickyAdmin::$config['hl_colors'][0]).',.65); 
}
.current-panel .accordion-sub-container.control-panel-content,
#customize-controls { 
    background:' . StickyAdmin::$config['colors']['customizer'] . '; 
}
.form-table, 
.form-wrap,
#tabs .sections,
.wrap > form:not(#file-form):not(#comments-form):not(#posts-filter):not(#bulk-action-form):not(#plugin-filter):not(#post):not(#myblogs):not(.upgrade) > p:not(.submit):not(.search-box):not(.max-upload-size),
.wrap > form:not(#file-form):not(#comments-form):not(#posts-filter):not(#bulk-action-form):not(#plugin-filter):not(#post):not(#myblogs):not(.upgrade) > .pressthis-code,
form#nav-menu-meta,
#nav-menu-header,
#nav-menu-footer,
.widget-top + .widget-inside,
.inline-edit-row,
.menu-item-settings,
.panel_menu .nav_tab_link { 
    background:' . StickyAdmin::$config['colors']['form'] . '; 
}
.wrap > form:not(#file-form):not(#comments-form):not(#posts-filter):not(#bulk-action-form):not(#plugin-filter):not(#post):not(#myblogs) > h3 {
    background:' . StickyAdmin::$config['colors']['form_head'] . ';
}
.qtip,
.qtip-default,
div.google-visualization-tooltip { 
    background: rgba(' . StickyAdmin::$config['colors']['tooltip'] . ', .95); 
}
.qtip:after,
.qtip-default:after { 
    border-top-color: rgba(' . StickyAdmin::$config['colors']['tooltip'] . ', .95);
}
.stuffbox,
.postbox,
#activity-widget .activity-block > h4,
#activity-widget .activity-block > h4 + ul, 
div#widgets-right .widgets-sortables,
.js #dashboard_quick_press .drafts,
.wrap > .tool-box,
.wrap > .card {
    background:' . StickyAdmin::$config['colors']['content_boxes'] . ';
}
.wrap > h1:first-child,
.wrap > h2:first-child,
.wp-filter .search-form input[type=search],
p.search-box input[name=s]
{
    background:'. StickyAdmin::$config['colors']['header'] .';
}
.wrap > h1:first-child #filters-expand ul li.active:before,
.view-switch > a.current { 
    color:' . StickyAdmin::$config['hl_colors'][0] . '!important;
}
.post-state-format {
    color:' . StickyAdmin::$config['hl_colors'][0] . ' !important;
}
#overlay:before,
.filter-links:before, 
.welcome-panel,
.subsubsub:before, 
.wrap > .nav-tab-wrapper:before,
ul.core-updates,
.press-this-actions,
#poststuff > #post-body:before {
    background: ' . StickyAdmin::$config['colors']['header'] . ' ;
    background: -webkit-linear-gradient(180deg, '. StickyAdmin::$config['colors']['header'] .', '. StickyAdmin::$config['colors']['content'] .' 100%);
    background: -moz-linear-gradient(180deg, '. StickyAdmin::$config['colors']['header'] .', '. StickyAdmin::$config['colors']['content'] .' 100%);
    background: -o-linear-gradient(180deg, '. StickyAdmin::$config['colors']['header'] .', '. StickyAdmin::$config['colors']['content'] .' 100%);
    background: linear-gradient(180deg, '. StickyAdmin::$config['colors']['header'] .', '. StickyAdmin::$config['colors']['content'] .' 100%);
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
#adminmenuwrap .resize_handle { 
    background:' . StickyAdmin::$config['colors']['adminmenu_handle'] . '; 
}
@media screen and (min-width: 1025px) {
    body.grid_menu:not(.mobile):not(.folded) #adminmenu .wp-submenu {
        background:' . StickyAdmin::$config['colors']['adminmenu_submenu'] . '!important;
    }
    #adminmenumain,
    #wpwrap > #adminmenuwrap,
    #adminmenuback,
    #adminmenu { 
        width: '. StickyAdmin::$config['adminmenu']['width'] . 'px;
        min-width: 220px;
    }
    body.header-sticky:not(.mobile) .wrap > h1:first-child, 
    body.header-sticky:not(.mobile) .wrap > h2:first-child, 
    #overlay, 
    body:not(.mobile):not(.folded) .wrap > .theme-overlay { left: ' . StickyAdmin::$config['adminmenu']['width'] . 'px; }


    body.rtl.header-sticky:not(.mobile) .wrap > h1:first-child, 
    body.rtl.header-sticky:not(.mobile) .wrap > h2:first-child, 
    body.rtl #overlay,
    body.rtl:not(.mobile):not(.folded) .wrap > .theme-overlay { right: ' . StickyAdmin::$config['adminmenu']['width'] . 'px; left: 0; }

    body:not(.mobile):not(.folded) #wpfooter,
    body:not(.mobile):not(.folded) #wpcontent { margin-left: ' . StickyAdmin::$config['adminmenu']['width'] . 'px; }

    body.rtl:not(.mobile):not(.folded) #wpfooter,
    body.rtl:not(.mobile):not(.folded) #wpcontent { margin-right: ' . StickyAdmin::$config['adminmenu']['width'] . 'px; margin-left: 0 }
}
.picker_open div.sticky_nav_icon_picker:before {
    border-bottom-color: ' . StickyAdmin::$config['colors']['adminmenu_submenu'] . '!important; 
}
.picker_open div.sticky_nav_icon_picker.reposition:before {
    border-bottom-color: transparent!important;
    border-top-color: ' . StickyAdmin::$config['colors']['adminmenu_submenu'] . '!important;
}
@media screen and (min-width: 783px) and (max-width: 1024px) {
    body.auto-fold:not(.mobile) #adminmenu .wp-has-current-submenu:hover > a + .wp-submenu {
        background:'.StickyAdmin::$config['colors']['adminmenu_submenu'] . '!important;
    }
    body:not(.auto-fold) #adminmenumain,
    body:not(.auto-fold) #wpwrap > #adminmenuwrap,
    body:not(.auto-fold) #adminmenuback,
    body:not(.auto-fold) #adminmenu { 
        width: '. StickyAdmin::$config['adminmenu']['width'] . 'px;
    }

    body:not(.auto-fold) .wrap > h1:first-child,  
    body:not(.auto-fold) .wrap > h2:first-child,  
    body:not(.auto-fold) .theme-overlay { left: ' . StickyAdmin::$config['adminmenu']['width'] . 'px; }

    body.rtl:not(.auto-fold) .wrap > h1:first-child,  
    body.rtl:not(.auto-fold) .wrap > h2:first-child,  
    body.rtl:not(.auto-fold) .theme-overlay { right: ' . StickyAdmin::$config['adminmenu']['width'] . 'px; left: auto; }



    body:not(.mobile):not(.auto-fold) #wpcontent { margin-left: ' . StickyAdmin::$config['adminmenu']['width'] . 'px; }
    body.rtl:not(.mobile):not(.auto-fold) { margin-right: ' . StickyAdmin::$config['adminmenu']['width'] . 'px; margin-left: 0 }
    body:not(.mobile):not(.auto-fold) #wpfooter { padding-left: ' . ( StickyAdmin::$config['adminmenu']['width'] + 35 ) . 'px; }
    body.rtl:not(.mobile):not(.auto-fold) #wpfooter { padding-right: ' . ( StickyAdmin::$config['adminmenu']['width'] + 35 ) . 'px; padding-left: 0 }

}
#adminmenu .wp-submenu:before {
    border-right-color:'.StickyAdmin::$config['colors']['adminmenu_submenu'] . '!important;
}
body.s_nav_right #adminmenu .wp-submenu:before {
    border-left-color:'.StickyAdmin::$config['colors']['adminmenu_submenu'] . '!important;
    border-right-color:transparent!important;
}
.stuffbox,
.postbox,
#post-body,
#activity-widget .activity-block > h4,
#activity-widget .activity-block > h4 + ul, 
div#widgets-right .widgets-sortables,
.js #dashboard_quick_press .drafts,
.wrap > .tool-box,
.wrap > .card {
    background:'.StickyAdmin::$config['colors']['content_boxes'].';
}
';

?>