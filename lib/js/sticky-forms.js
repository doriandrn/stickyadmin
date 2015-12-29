var $s_ui = jQuery.noConflict();
/**
 * Sticky Forms JS
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
    // Cleanup some elments, urgh...
    replace_htm = '';
    p_repl = $s_ui( '.wrap > form > p' );
    binder = p_repl.closest( 'h3.title' );
    p_repl.each(function() {
        p = $s_ui(this);
        if ( p.attr('class') ) return;
        replace_htm += p.html() + '\n';
        p.remove();
    });
    binder.attr( 'title', replace_htm );
    $s_ui('ul.cat-checklist').mCustomScrollbar({
        axis: 'y',
        scrollbarPosition: 'inside',
        autoHideScrollbar: true
    });
});