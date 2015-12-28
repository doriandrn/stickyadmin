var $s_ui = jQuery.noConflict();
/**
 * Sticky Comments Improvements - JS
 *
 * @version 1.0.0
 * @copyright 2015
 * @author Dorian Tudorache
 * @link www.stickyadmin.com
 *
 * @license See Licensing folder
 *
 * @package Sticky Admin
 *
 */

$s_ui(function() {
    // Cleanup some elments, urgh...
    $s_ui( 'table.widefat td.column-author, table.widefat .column-comment .comment-author' ).each(function() {
        td = $s_ui(this);
        inside = $s_ui( 'strong', td );
        $s_ui('<div class="s_links"></div>').appendTo( inside );
        
        c = 0;
        $s_ui( 'br', td ).remove();
        $s_ui( '> a', td ).each(function() {
          a = $s_ui(this);

          if ( ! $s_ui(body).hasClass('mobile') ) a.attr('title', a.text() ).html('');
          
          c += 1;
          if ( c == 1 ) aclass = 's_domain';
          if ( c == 2 ) aclass = 's_email';
          if ( c == 3 ) aclass = 's_ip'; 
          a.addClass(aclass).addClass('s_modified');
          a.appendTo( a.parent().find('.s_links') );
        });
    });
});

