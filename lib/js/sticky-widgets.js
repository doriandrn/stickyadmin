jQuery(window).ready(function() {
  	jQuery('.widget-description').each( function() {
  		t = jQuery(this);
  		t.parent('.widget').attr( 'title', t.text() );
  		t.remove();
  	});
});