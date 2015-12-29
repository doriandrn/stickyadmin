var $s_ui = jQuery.noConflict();
/**
 * Sticky - Login / Register page scripts
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

$s_ui( function() {
  sticky_login_globals();
  sticky_login_js();
  sticky_login_form();
  sticky_login_notifs();
  sticky_login_done();
});

// Globals for the Login page
function sticky_login_globals() {
  body      = $s_ui('body.login');
  overlay   = $s_ui('#overlay');
  login     = $s_ui('#login', body );
}

// Removes the no-js on body
function sticky_login_js() {
  $s_ui(document).ready(function() {
    body.removeClass('no-js');
  });
}

// All done
function sticky_login_done() {
  $s_ui(window).load(function() {
    body.removeClass('is_loading');
    overlay.fadeOut();
  });
}

// Login Image
function sticky_login_image( img ) {
  if ( body.hasClass( 'interim-login' ) ) 
    return;

  $s_ui.backstretch( img ); 
  body.addClass('backstretched');
}

// Login form elements
function sticky_login_form() {
  $s_ui( '#login > form > p label input[type=email], #login > form > p label input[type=text], #login > form > p label input[type=password]' ).each( function() {
      var ti = $s_ui(this);
      var p = ti.parent().parent();
      if ( p.is('p') )
        p.addClass('s');
      var name = String( ti.parent().text() ).replace(/<\/?[^>]+(>|$)/g, "").trim();
      ti.val( name );
      sticky_focus_effect( ti );
  });

  $s_ui('#login > form > p.forgetmenot > label').click(function() {
    $s_ui(this).parent().toggleClass('on', $s_ui('input', $s_ui(this) ).is(':checked') );
  });
}


// Login Notifications
function sticky_login_notifs() {
  var notif = $s_ui( 'h1 + div', login );

  if ( ! notif.length )
    notif = $s_ui( 'h1 + p.message', login);

  if ( ! notif.length )
    return;

  if ( notif.is('div') && notif.attr('id').indexOf('error') > -1 )
    toastr.error( notif.html() );

  if ( notif.is('p') )
    toastr.info( notif.html() );

  // console.log( notif.html() );
  notif.remove();
}

function sticky_focus_effect( el ) {
  var tival = el.val();
  var tiparent = el.parent().parent();
  el.on('focus', function(e) {
    if ( $s_ui(this).attr('id') == 'user_pass' ) 
      $s_ui('p#nav').addClass('show');
    tiparent.addClass('editing');
    if ( ! el.data( tival ) ) el.data( tival, el.val() );
    if ( el.val() == el.data( tival ) ) el.val('');
  });
  el.on('blur', function(e) {
    if ( $s_ui(this).attr('id') == 'user_pass' ) 
      $s_ui('p#nav').removeClass('show');
    if ( el.val() === '' ) { 
      tiparent.removeClass('editing');
      el.val( el.data( tival ) );
    }
  });
}