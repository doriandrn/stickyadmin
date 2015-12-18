$s_ui = jQuery.noConflict();
/**
 * Sticky UI - Main Javascript file
 * =====================================
 *
 * @version 1.0.0
 * @copyright 2015
 * @author Dorian Tudorache
 * @link www.stickyadmin.net
 *
 * @license See Licensing folder
 *
 * @package Sticky Admin
 * =====================================
 *
 */
// Load the charts libraries for the dashboard
if ( pagenow == 'dashboard' ) 
	google.load("visualization", "1", {packages:["corechart", "geochart", "piechart"]});
// Sticky Functions - Main
// The order of these functions is really important, don't change unless you know what you're doing
$s_ui( function() {
	sticky_declare_globals();
    sticky_failsafe();
    sticky_admin();
    sticky_menu();
    sticky_header();
    sticky_footer();
    sticky_dashboard();
    sticky_media();
    sticky_widefat();
    sticky_pages();
    sticky_themes();
    sticky_code_editors();
    sticky_update_core();
	do_sticky_items();
});
// On window load
$s_ui(window).load(function() {
    sticky_rework_selects();
    sticky_screen_meta();
    sticky_screen_init();
    sticky_run_odometer();
    sticky_themes_adjustments();
    sticky_widefat_select();
    sticky_tooltips();
});
// Window Resize triggers the resizeEnd event which I'll bind the functions to.
$s_ui(window).resize(function() {
	body.addClass('sleeping');
	if(this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function() {
        $s_ui(this).trigger('resizeEnd');
    }, 500);
});
function sticky_code_editors() {
	if ( pagenow != 'theme-editor' || pagenow != 'plugin-editor' )
		return;
    var editor = CodeMirror.fromTextArea(jQuery("#template textarea")[0], {
		theme: StickyCM.theme,
		lineNumbers: true,
		matchBrackets: true,
		mode: StickyCM.mode,
		indentUnit: 4,
		indentWithTabs: true,
		enterMode: "keep",
		tabMode: "shift"
    });
}
// These functions are executed everytime the window gets resized.
$s_ui(window).on('resizeEnd', function() {
	sticky_stats_unsleep();
	sticky_adjust_wrap_height();
	update_carousels();
    sticky_themes_adjustments();
});
// themes.php page functions
function sticky_themes() {
	sticky_themes_adjustments();
}
// Adjustments for themes.php
function sticky_themes_adjustments() {
    if ( pagenow != 'themes' ) 
    	return;
    var themeh = $s_ui('.theme.add-new-theme');
    themeh.innerHeight( themeh.prev().outerHeight() );
}
function sticky_stats_unsleep() {
	if ( ! pagenow.startsWith('dashboard') ) return;
	body.removeClass('sleeping');
}
// A function that checks if StickyAdmin loaded well
function sticky_failsafe() {
	if ( ! body.length ) 
		return;
	
	if ( ! body.hasClass('sticky-admin') && failSafeAttempts < 10 ) {
		console.log( failSafeAttempts );
		failSafeAttempts += 1;
		if ( failSafeAttempts == 1 ) {
			body.addClass('failsafe');
		}
		setTimeout( sticky_failsafe, 1000 );
		return;
	}
	if ( failSafeAttempts == 10 ) {
		sticky_init_failsafe_mode();
		return;
	}
}
// Runs the failsafe mode functions
function sticky_init_failsafe_mode() {
	if ( body.hasClass('sticky-admin') ) 
		return;
	toastr.warning( 'StickyAdmin FAILSAFE Mode!' );
	console.log('WARNING: StickyAdmin is running in failsafe mode. This happens when your PHP install has something to output as in notices/ errors/ warnings on the body.');
	sticky_add_body_classes();
	body.removeClass('is_loading');
}
// Adds the failsafe body classes
function sticky_add_body_classes() {
	if ( ! stickyObj['failSafe'].length ) return;
	body.addClass(stickyObj['failSafe']);
}
// Update.php improvements
function sticky_update_core() {
	if ( ! pagenow.startsWith('update-core') ) 
		return;

	sticky_update_notice();
	// sticky_update_remove_buttons();
	sticky_update_tab_switcher();
}
function sticky_update_remove_buttons() {
	var selector = $s_ui( '.wrap form table.widefat' ).prev();
	if ( selector.length ) selector.hide();
	return;
}

// The tabs for updates
function sticky_update_tab_switcher() {
	var check_update_group = $s_ui( '> h2 + p', wpwrapwrap ), 
		titles = [], 
		descriptors = [];

	if ( ! check_update_group.length ) 
		return;

	var s_container = $s_ui( '#s-update-notice-container', wpwrapwrap );
	var container = $s_ui( '<div id="update_tabs"></div>' );

	if ( ! s_container.length )
		return;

	container.insertAfter( s_container );

	check_update_group.each( function( i ) { 
		var el = $s_ui(this); // as in the paragraph
		var h2 = el.prev();
		var with_form = el.next();

		if ( ! h2.is('h2') ) {
			console.log( 'StickyAdmin DEBUG: No H2 tag found on the page. If you have no updates to make and seeing this message, please let us know.');
			return;
		}

		var title = h2.text();
		titles[ i ] = title;
		descriptors[ i ] = el.text(); 

		var tab = $s_ui('<div class="tab ' + title.toLowerCase() + '"></div>');
		tab.appendTo( container );


		if ( with_form.is('form') ) {
			with_form.appendTo( tab );
		} else {
			$s_ui('<p clsas="zero-updates">' + el.text() + '</p>').appendTo( tab );
		}

		el.remove();
		h2.remove();

		// Delete/hide duplicate (top position) submit buttons in the form
		var widefat_in_form = $s_ui( 'table.widefat', with_form );
		if ( ! widefat_in_form.length )
			return;

		var prev_widefat_el = widefat_in_form.prev();
		if ( prev_widefat_el.has('input.submit') )
			prev_widefat_el.hide();
	});

	container.slick({
		slidesToShow: 1, 
	    slidesToScroll: 1,
	    swipeToSlide: true,
	    touchMove: true,
	    accessibility: true,
	    infinite: false,
	    arrows: false,
	    dots: true,
	    adaptiveHeight: false,
	    customPaging: function( slick, i ) {
	        return '<button class="" title="'+descriptors[i]+'"><span class="icon"></span>'+titles[i]+'</button>';
	    }
	});
}

// Update-Core.PHP improvements
function sticky_update_notice() {
	var selector = $s_ui('ul.core-updates');
	if ( ! selector.length ) 
		return;

	var update_groups = $s_ui( '> li', selector );
	if ( ! update_groups.length )
		return;

	var update_header = $s_ui('.response');

	if ( ! update_header.length )
		update_header = $s_ui(' > h2', wpwrapwrap).first();

	var container = $s_ui('<div id="s-update-notice-container"></div>').insertAfter(header);

	if ( ! update_header.length && update_groups.length > 1 )
		update_header = update_groups.first();

	if ( ! update_header.length ) {
		console.log( 'ERROR! No response header found on update-core-php. Please submit a ticket.');
	} else {
		update_header = update_header.prependTo(container);
	}

 	selector.appendTo(container);
 	$s_ui( '>p', wpwrapwrap ).each( function() {
		var p = $s_ui(this);
 		// The check-again paragraph, no other inidcators to select it at this time.
 		if ( p.find('a').length > 0 ) {
 			p.appendTo(container);
 			p.addClass('s_modified');
 		}
 	});

 	// Update information
 	var update_info = $s_ui( '+p', container );

 	if ( update_info.length ) {
 		var update_info_text = update_info.html();

	 	if ( update_info_text != '' ) {
	 		toastr.info( '<p>' + update_info_text + '</p>' );
	 		update_info.remove();
	 	}
 	}
 	
 	// Note information
 	var update_info_note = $s_ui( 'p.s_modified + p.s_modified', container );

 	if ( update_info_note.length ) {
 		var update_info_note_text = update_info_note.html();

	 	if ( update_info_note_text != '' ) {
	 		toastr.info( '<p>' + update_info_note_text + '</p>' );
	 		update_info_note.remove();	
	 	}
 	}
 	

 	// Add slick if more updates are shown
 	if ( $s_ui( 'li', selector ).length > 1 ) {
 		selector.slick({
 			slidesToShow: 1, 
	        slidesToScroll: 1,
	        swipeToSlide: true,
	        touchMove: true,
	        accessibility: true,
	        infinite: false,
	        arrows: false,
	        dots: true,
	        adaptiveHeight: true
 		});
 	}
	
}
function sticky_pages() {
	if ( pagenow != 'page' && pagenow != 'post' ) return;
	sticky_slug_box();
	sticky_custom_fields();
	sticky_publish();
}
// Publish section of page / post edit
function sticky_publish() {
	sticky_publish_date();
}
// Prettifies the date in the publish section
function sticky_publish_date() {
	var selector = $s_ui('#submitdiv .misc-pub-section #timestamp b');
	if ( !selector.length) return;
	sticky_cool_dates( selector );
}
// A function that re-arranges the Custom Fields widget on posts and pages
function sticky_custom_fields() {
	var selector = $s_ui( '#postcustom' );
	if ( !selector.length ) return;
	var meta = $s_ui( '#newmeta', selector );
	meta.hide();
	var newfield = $s_ui( '#list-table + p', selector );
	var newfieldtext = newfield.text();
	newfield.hide();
	var newf_button = $s_ui( '<button class="off">' + newfieldtext + '</button>');
	newf_button.insertAfter( '#list-table' );
	newf_button.unbind('click');
	newf_button.toggle(function(ev) {
		ev.preventDefault();
		$s_ui(this).removeClass('off').addClass('on');
		meta.show();
	}, function(ev) {
		ev.preventDefault();
		$s_ui(this).removeCLass('on').addClass('off');
		meta.hide();
	});
}
function sticky_slug_box_get_url() {
	var selector = $s_ui( '#titlediv #edit-slug-box > .button' );
	if ( ! selector.length )
		return;
	selector.attr('title', selector.text() );
}
function sticky_slug_box() {
	var selector = $s_ui( '#edit-slug-box' );
	if ( !selector.length ) return;
	selector.addClass('s_modified');
	sticky_slug_box_get_url();
	var edit_post_name = $s_ui( '#editable-post-name', selector );
	if ( !edit_post_name.length ) return;
	edit_post_name.on( 'click', function() {
		sticky_slug_box_bindings();
	});	
}
function sticky_slug_box_bindings() {
	setTimeout( function() {
		var new_post_slug = $s_ui( 'input#new-post-slug' );
		if ( ! new_post_slug.length ) return;
		var ok = $s_ui( '#edit-slug-buttons .save' );
		if ( ! ok.length ) return;
		new_post_slug.bind( 'blur', function() {
			ok.click();
		});
	}, 500 );
}
function do_sticky_items() {
	sticky_actions();
}
function sticky_footer() {

}
// The function that adds the action buttons in the top-right section of the panel, in the header.
function sticky_actions() {
	var selector, s_items = [];
	// Basically the pages that don't need to have the actions
	if ( pagenow.startsWith('dashboard') || pagenow.startsWith('update-core') ) 
		return;

	if ( $s_ui('p.search-box').length || $s_ui('.wp-filter .search-form').length )
		return;

	var newcontainer = $s_ui('<div id="sticky-actions"></div>').appendTo(header);
	if ( pagenow == 'page' || pagenow == 'post' ) {
		make_clickable_sticky_element( 'input[type=submit]', $s_ui('#submitdiv #publishing-action'), newcontainer, true );	
		make_clickable_sticky_element( '.submitdelete', $s_ui('#delete-action'), newcontainer );					
		(function(){
			if ( pagenow == 'post' ) {
				make_clickable_sticky_element( '#save-post', $s_ui('#save-action'), newcontainer );					
			}
		})();
	}
	if ( pagenow.startsWith('options-') ) {
		make_clickable_sticky_element( 'input[type=submit]', $s_ui('> form .submit', wpwrapwrap ), newcontainer, true );	
	}
	var hasSubmit = $s_ui('p.submit', wpwrapwrap);
	if ( hasSubmit.length ) {
		make_clickable_sticky_element( 'input[type=submit]', hasSubmit, newcontainer );
	}
}
// A function that clones the button and hides the original ones.
function make_clickable_sticky_element( element, selector, container, mainaction ) {
	var el = $s_ui( element, selector );
	if ( ! el.length ) return;
	mainaction = typeof mainaction !== 'undefined' ? mainaction : false;
	var newelement = el.clone();
	el.hide();
	var href = el.attr('href');
	newelement.prependTo(container);
	newelement.changeElementType('button');
	// The newly created element
	element = element.replace('input','button');
	newelement = $s_ui( element, '.wrap > h1:first-child' );
	// newelement.sticky_moveEvents( el )
	if ( mainaction )
		newelement.addClass('mainaction');
	if ( typeof href !== 'undefined' ) {
		newelement.attr('onclick','location.href="' + href + '"');
		newelement.removeAttr('href');
		var text = newelement.text();
		newelement.attr('title',text);
	} else {
		newelement.attr('title',newelement.val());
		newelement.click(function() {
			el.click();
		});
	}
}
// Change element type function
(function($) {
    $.fn.changeElementType = function(newType) {
        var attrs = {};
        $.each(this[0].attributes, function(idx, attr) {
            attrs[attr.nodeName] = attr.nodeValue;
        });
        this.replaceWith(function() {
            return $("<" + newType + "/>", attrs).append($(this).contents());
        });
    };
})(jQuery);
function sticky_sidebar() {
	
}
/* Updates the dashboard statistics panel */
function update_statistics() {
 	if ( ! stickyObj['s_stats'] || ! stickyObj['stats-array'] || ! stickyObj['country-array'] || pagenow != 'dashboard' ) return;
 	var curTab = $s_ui( '#dash_slick' );
 	if ( ! curTab.length ) return;
 	var activetab = $s_ui( '.slick-active', curTab ).index();
 	switch ( activetab ) {
 		case 3:
 		case 0:
 			drawChart();
 			break;
 		case 1:
 			drawMap();
 			break;
 		case 2:
 			sticky_make_pie1();
 			sticky_make_pie2();
 			sticky_make_pie3();
 			sticky_make_pie4();
 			break;
 	}
} 
$s_ui(document).click(function(event) {
    if ( $s_ui(event.target).is('h4') ) return;
    if ( ! $s_ui(event.target).closest('.open').length ) {
        $s_ui( '.welcome-panel-column, .activity-block, .drafts' ).removeClass('open');
    }
});
// Functions for the widefats
function sticky_widefat() {
	selector = $s_ui('.widefat');
	if ( ! selector.length ) return;
	sticky_widefat_descriptions( selector );
	sticky_widefat_post_states( selector );
	$s_ui(window).ready(function() {
    	sticky_remake_widefat_tr();
    	sticky_no_items();
	});
}
// Reworks the dates and posts states on widefats
function sticky_widefat_post_states( item ) {
	var selector = $s_ui( 'td.column-date', item );
	if ( ! selector.length || pagenow == 'edit-comments'  ) return;
	var states = [];
	selector.each(function() {
		var td = $s_ui(this);
		var state = td.text();
		var date = state, olddate;
		// This should work for the next 1k years. ;)
		state = state.substr( 0, state.search(/\d/));
		date = date.replace( state, '' );
		olddate = date;
		// console.log('1: ' + olddate);
		// date = make_sticky_date( olddate );
		// console.log('3: ' + date);
		var container = $s_ui( '<abbr>' + date + '</abbr>' );
		td.empty();
		container.appendTo(td);
		container.attr('title', olddate);
		tr_state = td.parent().attr('class');
		if ( tr_state != '' ) tr_state = tr_state.substring(tr_state.indexOf('status-') + 7);
		if ( tr_state != '' ) tr_state = tr_state.substring(0, tr_state.indexOf(' '));
		var statusc = $s_ui( '<div title="' + state + '" class="sticky status ' + tr_state + '"></div>' );
		statusc.appendTo(td);
		states[tr_state] = state;
	});
	selector = $s_ui('abbr', selector);
	sticky_cool_dates( selector );
	// console.log(states);
}
// Reworks the description columns
function sticky_widefat_descriptions( item ) {
	var selector = $s_ui( 'td.column-description', item );
	if ( ! selector.length ) return;
	selector.each(function(i) {
		var desc 		= $s_ui(this),
			morebuts 	= $s_ui('<div class="more_but">...</div>');
		if ( desc.text() == '' ) return;
		desc.addClass('no-more');
		morebuts.appendTo(desc);
		desc.click(function() {
			var desc = $s_ui(this);
			desc.toggleClass('no-more');
		});
	});
}
// Media Upload functions
function sticky_media() {
	if ( pagenow !== 'undefined' && pagenow !== 'upload' ) return;
	var attachments = $s_ui('.attachment');
	if ( ! attachments.length || mediacounter < attachments.length ) {
		setTimeout( sticky_media, 2000 );
		mediacounter = attachments.length;
		return;
	}
	var stickymediawall = new freewall('.attachments');
	stickymediawall.reset({
		selector: '.attachment',
		animate: true,
		gutterX: 10,
		gutterY: 10,
		cellW: 150,
		cellH: 'auto',
		onResize: function() {
			stickymediawall.refresh();
		}
	});
	stickymediawall.fitWidth();
	body.removeClass('is_loading');
	overlay.attr('style', 'visibility:hidden;');
}
function sticky_move_filters_to_header() {
    var 
    	selector = $s_ui('#post-query-submit'),
    	media = false;
    // If they exist, return
    if ( $s_ui('.wrap > h1 > #sticky_filters').length || f_attempts === 'undefined' || f_attempts > 3) return;
    // If the selector was not found, look for the one on the media page.
    if ( ! selector.length ) {
    	selector = $s_ui('.media-toolbar-secondary');
    	if ( selector.length ) media = true; // We're on the media page
    }
    if ( ! selector.length ) {
    	setTimeout( sticky_move_filters_to_header, 1000 );
    	f_attempts++;
    	return;
    } 
    selector = selector.parent();
    selector.hide();
    var container = $s_ui('<div id="sticky_filters"><div>' + stickyObj['word:filter'] + '</div></div>');
    var whereto = '.wrap > h1:first-child > a.page-title-action';
    if ( $s_ui( whereto ) ) {
        container.insertBefore(whereto);
    }
    else {
        container.appendTo('.wrap > h1:first-child');
    }
    var selects = $s_ui('select', selector);
    var filters_array = new Array();
    var active_index = new Array();
    selects.each(function( index ) {
        sel = $s_ui(this);
        sel.attr('id','sel-'+index );
        var options = $s_ui('option', sel);
        filters_array[index] = new Array();
        var c=0;
        options.each(function(i) {
            var op = $s_ui(this);
            if ( op.prop('selected') ) {
                active_index.push(op.val());
            }
            filters_array[index][op.val()] = op.text();
        });
    });
    container = $s_ui('<div id="filters-expand"></div>').appendTo('#sticky_filters');
    filters_array.forEach( function(element, index, array) {
        var menu = $s_ui('<ul></ul>').appendTo(container);
        if ( media ) {
        	var events = [];
        	grabEvents = $s_ui._data( selects[index], 'events' );
        	thoseEvents = grabEvents['change'];
        	if ( typeof thoseEvents === 'object' ) {
        		for (var i = 0; i < thoseEvents.length; i++) {
                    events.push( grabEvents['change'][i].handler );
                }
                for (var i = 0; i < events.length; i++) {
            		menu.bind('change', events[i]);
        		}
        	}
        }
        for ( var k in element ) {
            var binder = $s_ui('<li class="' + k + '">' + element[k] + '</li>').appendTo(menu);
            // ( ( k == '"' + active_index[index] + '"' ) ? k + ' active' : k )
            if ( k === active_index[index] ) binder.addClass('active');
            binder.click(function() {
                var b = $s_ui(this);
                if ( b.hasClass('active') ) return;
                var get_state = b.attr('class').split(' ').pop();
                b.parent().children().removeClass('active');
                b.addClass('active');
            	$s_ui( '#sel-' + index ).val( get_state );
            	menu.trigger('change');
            });
        }
        menu.mCustomScrollbar({
            axis: 'y',
            scrollbarPosition: 'inside',
            autoHideScrollbar: true
        });
    });
    if ( ! media ) {
	    var button = $s_ui('<button class="sticky_filter_go">Filter</button>');
	    button = button.appendTo(container);
	    button.click(function() {
	        $s_ui('#post-query-submit').click();
	    });
	} 
}
function sticky_tablenav() {
    var selector = $s_ui('.tablenav');
    if ( ! selector ) return
    selector.each(function() {
        sel = $s_ui(this);
        if ( sel.hasClass('top') ) {
            $s_ui('.tablenav-pages',sel).remove();
            $s_ui('br',sel).remove();
            sel.addClass('sticky-empty');
            if (sel.children().length < 1) sel.remove();
        }
    });
}
function sticky_bulk_actions() {
    var selector = $s_ui('.tablenav .bulkactions');
    if ( ! selector.length ) return;
    // We'll get the bottom one.
    var executor = $s_ui('input#doaction2');
    if ( ! executor.length ) executor = $s_ui('input#doaction');
    var container = "#posts-filter";
    if ( ! $s_ui(container).length ) container = "#bulk-action-form";
    if ( ! $s_ui(container).length ) container = "#comments-form";
    // Setup an array with the existing bulk actions
    var existing_actions = new Array();
    // No need for the $which var here, duplicates have the same value so the array generated will have unique entries
    $s_ui('select option', selector.first() ).each(function(i) {
        var opt = $s_ui(this);
        if ( opt.context.value != '-1') existing_actions[opt.context.value] = opt.context.text;
    });
    // Create the container
    container = $s_ui('<div id="sticky_bulk_actions"></div>').appendTo(container);
    // The counter
    $s_ui('<div class="counter"></div>').prependTo(container);
    // Put the existing actions in the container
    for ( var key in existing_actions ) {
        var button = '<button class="sb ' + key + '" name="' + key + '">' + existing_actions[key] + '</button>';
        $s_ui(button).appendTo('#sticky_bulk_actions');
    }
    executor.appendTo('#sticky_bulk_actions');
    $s_ui('button.sb').click(function(e) {
        e.preventDefault();
        var but = $s_ui(this);
        if ( but.hasClass('selected') ) return;
        but.parent().children().removeClass('selected');
        $s_ui('select', selector).val(but.attr('class').split(' ').pop());
        but.addClass('selected');
    });
    selector.hide();

    if ( selector.parent().hasClass('submit') )
    	selector.parent().hide();
}
// Makes the header element sticky.
function sticky_header_sticky() {
    // Return if the option header does not need to minimize, or if on an about page.
    if ( stickyObj[ 's_header_type' ] != 'minimize' ) return;
    // Document Scroll Event, 
	$s_ui(document).scroll(function() {
	    var scroll = $s_ui(this).scrollTop();
  	 	if ( scroll >= 44 ) 
  	 		body.addClass( 'header-small' )
        else 
        	body.removeClass( 'header-small' );
	});
	// Scroll Position variable
    
}
// Toggle menu button in the header
function sticky_hamburger_menu() {
	sticky_add_menu_toggle_button();
	var selector = $s_ui( '#wp-menu-toggle', header );
	if ( ! selector.length ) return;
	selector.addClass('hamburger').removeAttr('href');
	var toggle_ripple = $s_ui('<div id="toggle-ripple"></div>').appendTo( selector );
	var toggle_button = $s_ui('<div id="toggle-menu-wrap"></div>').appendTo( selector );
	$s_ui('<div id="st-line-top"></div><div id="st-line-bot"></div>').appendTo( toggle_button );
	var NS = "http://www.w3.org/2000/svg";
	var svg = document.createElementNS(NS, "svg");
	var path = document.createElementNS(NS, "path");
	svg.setAttribute( 'viewBox', '0 0 150 150' );
	svg.setAttribute( 'x', '0px' );
	svg.setAttribute( 'y', '0px' );
	svg.setAttribute( 'width', '30' );
	path.setAttribute( 'id', 'sticky-toggle');
	path.setAttribute( 'd', 'M41,78h71c0,0,29.7-8,16-36c-1.6-3.3-19.3-30-52-30c-36,0-64,29-64,65c0,29,26,59,61.6,59c41.4,0,62.6-29,62.6-59c0-37.7-19.2-49.1-26.3-54');
    path.setAttribute( 'stroke-linejoin', 'round' );
    path.setAttribute( 'stroke-linecap', 'round' );
    // path.addClass('s-toggle-menu');
    svg.appendChild(path);
    toggle_button.prepend(svg);
}
// Sticky function globals
function sticky_declare_globals() {
    body        = $s_ui('body'),
    wpadminbar  = $s_ui('#wpadminbar'),
    wpwrap      = $s_ui('#wpwrap'),
    nav 		= $s_ui('#adminmenumain');
    nav_binder  = $s_ui('#adminmenuwrap', nav);
    footer 		= $s_ui('#wpfooter');
    overlay  	= $s_ui('#overlay');
    wpcontent 	= $s_ui('> #wpcontent', wpwrap);
    wpwrapwrap 	= $s_ui('.wrap', wpcontent);
    header      = $s_ui('> h1:first-child', wpwrapwrap);
    s_nav       = $s_ui('#adminmenu', nav_binder);
    // Support for WP versions < 4.2
    if ( ! header.length )
    	header = $s_ui('> h2:first-child', wpwrapwrap);
    if ( ! header.length )
    	toastr.error('StickyAdmin Error: No header found.');
    // Init the Odometer for Dashboard
    if ( pagenow == 'dashboard' ) {
        window.odometerOptions = {
            auto: true,
            selector: '#dashboard_right_now .main ul > li .number > span',
            duration: 2500,
            animation: 'count',
            format: 'd',
            theme: 'minimal'
        };
    }
    if ( pagenow == 'upload' )
    	mediacounter = -1;
	failSafeAttempts = 0;
	iconPicker_generated = 0;
	decodeEntities = (function() {
		// this prevents any overhead from creating the object each time
		var element = document.createElement('div');
		function decodeHTMLEntities (str) {
			if(str && typeof str === 'string') {
				// strip script/html tags
				str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
				str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
				element.innerHTML = str;
				str = element.textContent;
				element.textContent = '';
			}
			return str;
		}
		return decodeHTMLEntities;
	})();
}
// Odometer extension for dashboard numbers.
function sticky_run_odometer() {
    if ( pagenow !== 'dashboard') return;
    // Run after a second so the loading animation gets to finish.
    setTimeout(function() {
        $s_ui('#dashboard_right_now .main ul > li .number > span').each(function(x) {
            els = $s_ui(this);
            els.html(odo_arr[x]);
        });
    }, 1000);
}
// The screen meta toggle in the right side of the screen
function sticky_screen_meta() {
   	var selector = $s_ui('.screen-meta-toggle a, .screen-meta-toggle button');
   	if ( ! selector.length ) return;
    // Had to do this, just to get the animation running smoothly.
    // WordPress uses slideUp and slideDown which will trigger a display:block/none on the element.
    selector.unbind('click').click(function(e) {
        e.preventDefault();
        id = $s_ui(this).prop('id');
        $s_ui(this).parent().siblings().toggleClass('hide');
        wrap = id.replace('-link', '-wrap');
        body.toggleClass('sidepanel_open ' + id);
    });
    overlay.click(function() {
        body.removeClass('sidepanel_open show-settings-link');
    });
}
// Checks labels that need a check 
function sticky_check_labels() {
    $s_ui('input.radio, input.labelauty').each(function() {
        if ( $s_ui(this).is(':checked') ) {
            if ( $s_ui(this).parent().is('label') ) $s_ui(this).parent().addClass('checked');
        }
    });
}
// A function that reworks the inputs and selects on page
function sticky_rework_inputs() {
    $s_ui(":checkbox").labelauty({
        checked_label: '',
        unchecked_label: ''
    });
    $s_ui(":not(.post-format):radio").labelauty({
        class: 'radio'
    });
    $s_ui('input.radio, input.labelauty').click(function() {
        var rel = $s_ui(this);
        if ( rel.is(':checked') ) {
            if ( rel.parent().is('label') ) {
                rel.parent().parent().children().removeClass('checked');
                rel.parent().addClass('checked');
            }
        } else {
            if ( rel.parent().is('label') ) {
                rel.parent().removeClass('checked');
            }
        }
    })
}
function sticky_rework_selects() {
    //===== SelectrODie =====//
    $s_ui("select:not(#bulk-action-selector-bottom):not(.attachment-filters)").selectOrDie({
        size: 5
    });
}
function sticky_init() {
    //===== INIT actions for WordPress =====//
    $s_ui('.hide-if-js').hide();
    $s_ui('.hide-if-no-js').show();
}
function sticky_tooltips() {
     //===== Tooltips to elements with title attr. =====//
    $s_ui('#wpbody [title!=""]').qtip({
        position: {
            my: 'bottom center',
            at: 'top left',
            position: {
            	viewport: wpwrapwrap,
            	adjust: {
            		method: 'shift none'
            	}
            },
            target: 'mouse',
            adjust: {
            	screen: true,
                x: 0,
                y: -10
            }
        },
        show: {
        	show: {
        		effect: function(offset) {
            		$s_ui(this).slideDown(100); // "this" refers to the tooltip
        		}
    		},
            delay: 100
        }
    });
}
function sticky_do_notifications() {
    $s_ui('div.updated:not(.hidden):not(.notice), .update-nag').each(function() {
        notif_box = $s_ui(this);
        if ( ! $s_ui( 'p', notif_box ).length ) {
            gettxt = notif_box.html();
            notif_box.html('');
            notif_box.prepend('<p>' + gettxt + '</p>');
        }
        notif_message = notif_box.html();
        notif_box.remove();
        toastr.info(notif_message);
    })
    $s_ui('div.error:not(.hide-if-js):not(.hidden)').each(function() {
        error_box = $s_ui(this);
        error_message = error_box.html();
        error_box.remove();
        toastr.error(error_message);
    });
    $s_ui('div.notice:not(.hidden):not(.error), td.plugin-update .update-message').each(function() {
        notify_box = $s_ui(this);
        // Check to see if the message is covered in a paragraph, if not, add it.
        if ( ! $s_ui( 'p', notify_box ).length ) {
            gettxt = notify_box.html();
            notify_box.html('');
            notify_box.prepend('<p>' + gettxt + '</p>');
        }
        notify_message = notify_box.html();
        notify_box.remove();
        toastr.warning(notify_message);
    });
}
// Adminbar toggle 
function sticky_wpab_add_controls() {
    if ( ! stickyObj['wpab_controls'] || ! wpadminbar.length ) return;
    var toggle = $s_ui('<div id="sticky_toggle"></div>').appendTo(wpadminbar);
    $s_ui('<button id="sticky_resize">-</button>').appendTo(toggle);
    if ( stickyObj['s_admin'] )
        $s_ui('<button id="sticky_close">x</button>').appendTo(toggle); 
}
// Toastr Notifications Options
function sticky_setup_notifications() {
    toastr.options.progressBar = true;
    toastr.options.positionClass = 'toast-top-right';
    toastr.options.showDuration = 0;
    toastr.options.hideDuration = 0;
    toastr.options.onShown = function() {
        $s_ui('#toast-container > div').addClass('toast-show');
    }
    toastr.options.onHidden = function() {
        $s_ui('#toast-container > div').removeClass('toast-show');
    }
    toastr.options.timeOut = 120000;
    toastr.options.extendedTimeOut = 120000;
    toastr.options.hideDuration = 300;
    toastr.options.closeButton = true;
    toastr.options.preventDuplicates = true;
}
// subsubsub count modifier
function sticky_subsub_counter() {
    $s_ui('.subsubsub .count').text(function() {
        return $s_ui(this).text().replace(/[()]/g, '');
    });
}
// Adds a scrollbar to the subsubsub in the wrap.
function sticky_subsub_scrollbar() {
	var selector = $s_ui( '.wrap > ul.subsubsub' );
	if ( ! selector.length ) return;
    selector.mCustomScrollbar({
        axis: 'x',
        scrollbarPosition: 'outside',
        advanced:{ autoExpandHorizontalScroll: true }
    });
}
// Adds the toggle button in the header if the adminbar is closed
function sticky_add_menu_toggle_button() {
    $s_ui('<a id="wp-menu-toggle" href="#"></a>').prependTo( header ).click(function() {
        wpwrap.toggleClass( 'wp-responsive-open' );
    });
}
// Adds scrollbars to tabs-panel and other elemenets
function sticky_other_scrollbars() {
	var selector = $s_ui('.tabs-panel, .cat-checklist');
	if ( !selector.length ) return;
    selector.mCustomScrollbar({
        axis: 'y',
        scrollbarPosition: 'inside',
        autoHideScrollbar: true
    });
}
// Load PACE JS state
function sticky_init_pace_js() {
    paceOptions = {
        restartOnPushState: true
    }
}
// Function executed after all other functions, initiates the screen
function sticky_screen_init() {
	if ( pagenow !== undefined && pagenow == 'upload' ) return;
    sticky_adjust_wrap_height();
    overlay.attr('style', 'visibility:hidden;');
    body.removeClass('is_loading');
    $s_ui('p.search-box').removeClass('open');
}
// Adjusts the wrap height so it ( the container ) won't be smaller than the screen requires to
function sticky_adjust_wrap_height() {
	var footerheight = parseInt( footer.outerHeight() );
    wpwrapwrap.css('min-height', $s_ui(window).innerHeight() - ( body.hasClass('wpab-maximized') ? 44 : ( body.hasClass('wpab-minimized') ? 4 : 0 ) ) - parseInt( wpwrapwrap.css('padding-top') ) - footerheight - parseInt( header.outerHeight() ) ); 
    wpcontent.css('margin-bottom', footerheight + 'px' );
}
/**
 *
 * Moves the view-switch element to the header.
 * Function is bound to sticky_add_menu_toggle_button.
 *
 */ 
function sticky_move_viewswitch_to_header() {
	var whereto, sel_type;
	if ( typeof vs_attempts !== 'undefined' && vs_attempts > 2 ) return; 
    var selector = $s_ui('.view-switch'); 
    if ( ! selector.length ) {
    	vs_attempts++;
    	if ( pagenow == 'post' || pagenow == 'page' || pagenow == 'edit-post' ) {
    		selector = $s_ui('.wp-editor-tabs');
    		sel_type = 'normal';
    		// WP 4.4 - Thanks for this WordPress, definitely an improvement! *sarcasm off*
    		if ( ! selector.length ) {
    			selector = $s_ui('#screen-meta #adv-settings .view-mode');
    			sel_type = 'meta';
    		}
    	}
    	if ( ! selector.length ) {
    		setTimeout( sticky_move_viewswitch_to_header, 1000 );
    		return;
    	} else 
    		switch ( sel_type ) {
    			case 'normal' :
    				if ( !selector.hasClass('view-switch') ) selector.addClass('view-switch');
    				break;
    			case 'meta' :	
    				selector = sticky_create_viewswitch( selector );
    				break;
    		}
    }
    whereto = '.wrap > h1 > .page-title-action';
    if ( $s_ui( whereto ).length ) {
        selector.insertBefore(whereto);
    }
    else {
        selector.appendTo('.wrap > h1:first-child');
    }
}
// Wordpress moved the view-switch element to the screen meta panel in v4.4
function sticky_create_viewswitch( which ) {
	if ( ! which.length ) return;
	var el;
	var newfilters = $s_ui('<div class="view-switch"></div>');
	var listview = $s_ui( '<a class="view-list" id="list-view"></a>' ).appendTo(newfilters);
	var excerptview = $s_ui( '<a class="view-excerpt" id="excerpt-view"></a>' ).appendTo(newfilters);
	$s_ui( 'input[type=radio]', which ).each(function() {
		var checked = this.checked;
		if ( checked ) 
			el = $s_ui(this).attr('id').replace('-mode','' );
	});
	if ( el != undefined ) {
		switch (el) {
			case 'list-view':
				listview.addClass('current');
				break;
			case 'excerpt-view':
				excerptview.addClass('current');
				break;
		}
	}
	listview.add(excerptview).click(function() {
		var change_id = '#' + $s_ui(this).attr('id') + '-mode';
		$s_ui( change_id, which ).prop( 'checked', true );
		// console.log( $s_ui( change_id ).length );
		listview.add(excerptview).removeClass('current');
		$s_ui( this ).addClass('current');
	});
	return newfilters;
}
function sticky_search_string_replace( a ) {
    $s_ui('.wrap > h2 .subtitle').text( $s_ui('.wrap > h2 .subtitle').text().replace(/\“(\w+)\”/i,"\"" + a.val() + "\"") );
}
// Sets a cookie
function setCookie(name, value, days) {
    var cookie_path = stickyObj['cookie_path'].path;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=" + cookie_path + "wp-admin";
}
// Gets cookie value
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
// Erases a cookie
function eraseCookie(name) {
    setCookie(name, "", -1);
}
// Adds a scrollbar for the sticky navigation state
function sticky_menu_sticky() {
    if ( ! stickyObj['s_nav_sticky'] ) return;
    nav_binder.mCustomScrollbar({
        autoHideScrollbar: true,
        axis: 'y',
        scrollbarPosition: 'inside'
    });
}
// Adds a logout menu button if the adminbar is closed
function sticky_menu_logout_button() {
    if ( body.hasClass('wpadminbar-closed') ) {
        $s_ui( '#sticky_logout' ).appendTo( $s_ui('#sticky_logout').parent() ).attr('style', 'display: inline-block!important' );
    }
}
// Hide nav items function
function sticky_menu_hide_items() {
    if ( ! stickyObj['s_admin'] ) return;
    $s_ui( 'li.menu-top', s_nav ).each(function() {
        li = $s_ui(this);
        a = $s_ui(' > a', $s_ui(this));
        li.prepend('<a class=\'s_nav_close\'>x</a>');
    });
    $s_ui( 'a.s_nav_close', 'li.menu-top' ).click(function() {
        a = $s_ui(this);
        // alsdata = a.parent().attr('id');
        a.parent().remove();
        // $s_ui.post(ajaxurl, alsdata, function(response) {});
    });
}
function sticky_menu_sortable() {
    if ( body.hasClass('mobile') || body.hasClass('folded') || ! stickyObj['s_admin'] ) return;
    s_nav.disableSelection();
    s_nav.sortable({
        items: 'li.menu-top:not(#sticky_logout)',
        stop: function(event, ui) {
            sticky_update_sortable_indexes();
        }
    });
}
function sticky_menu_settings() {
    if ( ! stickyObj['s_admin'] ) return;
    menu_settings = $s_ui('<div class=\'menu_settings\'></div>');
    var s_reset_button = $s_ui('<button class=\'s_reset\' data-content='+stickyObj['s_reset']+' ></button>');
    nav_binder.append(menu_settings);
    menu_settings.append(s_reset_button);
    s_reset_button.click(function() {
    	sticky_default_menu_icons();
    	sticky_sort_menu_default();
        sticky_reset_menu(); 
    });
}
function sticky_default_menu_icons() {
	if ( !stickyObj['s_nav_def_icons'] ) return;
	var out = '<style type="text/css">';
	$s_ui('#adminmenu li.menu-top').each(function() {
		var li = $s_ui(this);
		var id = li.attr('id');
		getcontent = ( id in stickyObj['s_nav_def_icons'] ) ? stickyObj['s_nav_def_icons'][id] : '\\e7e9';
		out += '#' + id + ' div.wp-menu-image:before{content:"' + getcontent + '";}' + "\n";
	});
	out += '</style>';
	$s_ui('head').append(out);
}
function sticky_reset_menu() {
    $s_ui.post(ajaxurl, { action: 'dynamic_css', sticky_reset_menu: 'reset'}, function(response){});
    $s_ui.post(ajaxurl, { action: 'update_menu_positions', menu_item_positions: stickyObj['s_nav_original'].toString() }, function(response) {});
}
function sticky_sort_menu_default() {
	var ul = $s_ui( 'ul#adminmenu' ), seps = -1, i = 0;
	for ( i; i<stickyObj['s_nav_original_ids'].length;i++) {
		var selector;
		var name = '#' + stickyObj['s_nav_original_ids'][i];
		if ( name != '#separator' ) {
			selector = $s_ui( name, ul );
		}
		else {
			seps++;
			selector = $s_ui( '.wp-menu-separator', ul );
		}
		if (selector.length) selector.attr('data-order', i);
	}
	$s_ui('#sticky_logout', ul).attr('data-order', i+1);
	var lis = $s_ui( 'li.menu-top:not(#collapse-menu)', ul );
	lis.sort(function(a,b) {
		compA = parseInt( $s_ui(a).attr('data-order') );
		compB = parseInt( $s_ui(b).attr('data-order') );
		// console.log( compA + ' vs. ' + compB );
		return (compA > compB) ? 1 : 0;
	});
}
// Initiaties a new iconpicker module bound to an element(el)
function sticky_do_iconpicker( el, type ) {
    if ( ! stickyObj['s_admin'] ) return;
    // Bind icon picker on right click.
    el.bind( 'contextmenu', function(e) {
        e.preventDefault();
        var selected = $s_ui(this);
        sticky_show_iconpicker( selected, type );
    }); 
}
function sticky_put_iconpicker( toElement ) {
	if ( ! toElement.length ) return;
	toElement.addClass( 'picker_open' );
	return $s_ui( '#sticky_icon_picker' ).appendTo(toElement);
}
function sticky_close_picker( element, picker ) {
	if ( !picker.length ) return;
	picker.appendTo(body);
	$s_ui('li', picker).unbind('click');
	element.removeClass('picker_open')
}
function sticky_show_iconpicker( element, type ) {
	if ( ! element.length ) return;
	var parent = element.parent();
    var picker = sticky_generate_iconpicker();
    picker = sticky_put_iconpicker( element );
    // if ( ! picker.elementInViewport(window) ) 
        // picker.parent().addClass( 'reposition' );
    $s_ui('li', picker).click( function(e) {
    	e.preventDefault();
        var li = $s_ui(this), header_icons={}, menu_icons={}, bar_icons={};
        switch ( type ) {
            case 'menu':
             	menu_icons[parent.attr('id')] = li.attr('data-content');
             	$s_ui( '> div.wp-menu-image', element ).addClass('s_live_icon').attr( 'data-content', li.attr('data-content' ) );
  				$s_ui.post(ajaxurl, { action: 'dynamic_css', s_menu_icons: JSON.stringify(menu_icons) }, function(response){ } );
            	break;
            case 'header':
                header_icons[adminpage] = li.attr('data-content');
            	element.addClass('s_live_icon').attr( 'data-content', li.attr('data-content' ) );
  				$s_ui.post(ajaxurl, { action: 'dynamic_css', s_header_icons: JSON.stringify(header_icons) }, function(response){ } );
            	break;
            case 'bar':
				bar_icons[element.attr('id')] = li.attr('data-content');
            	$s_ui( '.ab-item', element ).addClass('s_live_icon').attr( 'data-content', li.attr('data-content' ) );
  				$s_ui.post(ajaxurl, { action: 'dynamic_css', s_bar_icons: JSON.stringify(bar_icons) }, function(response){ } );
            	break;
        }
        sticky_close_picker( element, picker );
	});
  	$s_ui(document).click(function(event) {
        if ( $s_ui(event.target).is('.picker-open') ) return;
        else sticky_close_picker( element, picker );
    });
    picker.mCustomScrollbar({
        autoHideScrollbar: false,
        axis: 'y',
        scrollbarPosition: 'inside'
    });
}
function sticky_generate_iconpicker() {
	var iconstart = 58880, picker = $s_ui( '#sticky_icon_picker', body );
    if ( picker.length ) {
    	iconPicker_generated = true;
    	return picker;
    } else {
    	var container = $s_ui( '<div id=\'sticky_icon_picker\'></div>' );	
    	picker = $s_ui( '<ul class=\'sticky_icon_picker\'></ul> ');
    	container.appendTo( body );
        picker.appendTo( container );
        for ( i=0; i < 1926; i++) {
        	$s_ui( '<li data-content="&#' + iconstart + ';"></li>' ).appendTo(picker);
        	iconstart++;
    	}
    }
    return picker;
}
function sticky_menu_fold() {
    var selector = $s_ui( '#adminmenu #collapse-menu' ).first();
    if ( ! selector.length) return;
    var smw = [];
    selector.click(function() {
        if ( body.hasClass('folded') && getCookie('sticky_nav_width') == 60 ) { 
        	smw['s_menu_width'] = 220;
        }
        setTimeout( function() {
        	sticky_draw_stats();
        	update_carousels();
        	update_statistics();
        }, 1000);
        $s_ui.post(ajaxurl, { action: 'dynamic_css', sticky_new_values: JSON.stringify(smw) }, function(response){});
    });
}
function update_carousels() {
	if ( pagenow != 'dashboard' ) return;
	update_carousel('#dash_slick');
    update_carousel('#activity-widget');
    update_carousel('.slidethis');
    // #dash-slick contains the statistics, which also need to be redrawn after the carousel updated.
    setTimeout( update_statistics(), 500 );
}
function sticky_update_values( vals ) {
    $s_ui.post(ajaxurl, { action: 'dynamic_css', sticky_new_values: JSON.stringify(vals) }, function(response){});   
}
function sticky_update_sortable_indexes() {
    if ( ! stickyObj['s_admin'] ) return;
    var sticky_menu_seps, positions = new Array();
    sepcount = 0;
    sticky_menu_seps = $s_ui( 'li.wp-menu-separator:not(.buddypress)', s_nav ).length;
    $s_ui( 'li.menu-top:not(#collapse-menu), li.wp-menu-separator', s_nav ).each( function( i, obj ) {
        li = $s_ui( this );
        el = $s_ui( '> a.menu-top', this );
        if ( li.hasClass( 'wp-menu-separator' ) && ! li.hasClass( 'buddypress' ) && ! li.hasClass( 'toplevel_page_bp-activity' ) ) {
            sepcount++;
            positions[i] = 'separator' + ( ( sticky_menu_seps - sepcount >= 1 ) ? sepcount : '-last' );
        } 
        // BuddyPress FIX
        else if ( li.hasClass( 'buddypress') ) {
            positions[i] = 'separator-buddypress';
        }
        else if ( li.hasClass( 'toplevel_page_bp-activity' ) ) {
            positions[i] = 'bp-activity';
        }
        else {
            positions[i] = el.attr('href');
        }
    });
    // console.log(positions);
    var data = {
        action: 'update_menu_positions',
        menu_item_positions: positions.toString()
    };
    $s_ui.post(ajaxurl, data, function(response) {});
}
// If the option 'Resizeable' is enabled, add the handler and make it work!
function sticky_menu_resize() {
    if ( ! stickyObj['s_nav_resizable'] || body.hasClass('mobile') ) return;
    isDragging = false;
    // Append the resize handle. JS way because no hooks in #adminmenuwrap...!
    var handle = nav_binder.append('<div class=\'resize_handle\'></div>');
    if ( ! handle.length ) return;
    // isDragging = false;
    handle
    .mousedown(function(e) {
    	e.preventDefault();
    	$s_ui(this).bind('mousemove');
    	isDragging = false;
    	sMD = true;
    })
    .mousemove(function(e) {
    	if ( typeof sMD == 'undefined' || ! sMD )
    		return;
    	e.preventDefault();
    	isDragging = true;
    	sWD = sticky_resize_it( e, $s_ui(this) );
    })
    .mouseup(function() {
    	body.removeClass('sleeping');
    	var wasDragging = isDragging;
    	isDragging = false;
    	smD = false;
    	// if ( wasDragging ) {
    		s_nav.trigger('sticky-menu-resized');
    	// }
    });
    $s_ui( document ).mouseup( function() {
    	if ( typeof sMD == 'undefined' )
    		return;
    	sMD = false;
    	body.removeClass('sleeping');
    });
    s_nav.on('sticky-menu-resized', function(e) {
        e.preventDefault();
        sMD = false;
        // console.log('SM Resized!');
    	if ( body.hasClass('mobile') || body.hasClass('folded') ) 
    		return;
    	if ( typeof sWD != 'undefined' )
    		sticky_update_nav( sWD );
    });
    function sticky_resize_it( e, handle ) {
    	body.addClass('sleeping');
    	var 
    		handle_offset = ( ! isRtl ) ? handle.offset().left : handle.offset().right,
    		s_nav_minWidth = 200,
    		s_nav_maxWidth = 400,
    		s_nav_newWidth = nav.width(),
    		s_grid_1 = 250,
        	s_grid_2 = 360;
    	s_x = ( stickyObj['s_nav_position'] == 'left' ) ? ( e.pageX - handle_offset ) : ( handle_offset - e.pageX );
    	
    	s_nav_newWidth = ( s_x > s_nav_maxWidth ) ? s_nav_maxWidth : s_x;
    	s_nav_newWidth = ( s_nav_newWidth < s_nav_minWidth ) ? s_nav_minWidth : s_nav_newWidth; 
        // Grid Menu - add classes to body.
        if (s_nav_newWidth >= s_grid_1) {
            body.addClass('grid_menu');
            if ( s_nav_newWidth >= s_grid_2) {
                body.addClass('large_grid');
            } else {
                body.removeClass('large_grid')
            }
        } else {
            body.removeClass('grid_menu');
        }
        wpcontent
        .addClass('no_trans')
        .css('margin-' + stickyObj['s_nav_position'], s_nav_newWidth + 'px'); // CSS Class used to stop transitions for real-time changes.
        nav.
        addClass('no_trans')
        .attr('style', 'min-width:' + s_nav_newWidth + 'px; max-width:' + s_nav_newWidth + 'px');            

        $s_ui('.menu_settings', nav).addClass('no_trans').attr('style', 'min-width:' + s_nav_newWidth + 'px; max-width:' + s_nav_newWidth + 'px');            

        // nav_binder.
        // addClass('no_trans')
        // .attr('style', 'min-width:' + s_nav_newWidth + 'px; max-width:' + s_nav_newWidth + 'px' );
        overlay
        .attr('style', stickyObj['s_nav_position'] + ':' + s_nav_newWidth + 'px; visibility: hidden;');
        $s_ui('#sticky_bulk_actions')
        .attr('style', stickyObj['s_nav_position'] + ':' + s_nav_newWidth + 'px;');
        footer
        .css( stickyObj['s_nav_position'], s_nav_newWidth + 'px');
        header
        .addClass('no_trans').attr('style', stickyObj['s_nav_position'] + ':' + s_nav_newWidth + 'px');
        $s_ui('#adminmenu li#collapse-menu')
        .attr('style', stickyObj['s_nav_position'] + ':' + (s_nav_newWidth - 32) + 'px');
        if (pagenow == 'themes') 
        	$s_ui('.wrap > .theme-overlay')
        	.addClass('no_trans')
        	.attr('style', stickyObj['s_nav_position'] + ':' + s_nav_newWidth + 'px');
            // if ( body.hasClsas('s_nav_right') ) $s_ui( 'body.s_nav_right.folded .wp-filter .search-form, body.s_nav_right.folded p.search-box' ).addClass('no_trans').attr( stickyObj[ 's_nav_position'] + ':' + ( s_nav_newWidth + 35 ) + 'px!important' );
       	if (stickyObj['s_nav_position'] == 'right')
            $s_ui('p.search-box, .wp-filter .search-form').addClass('no_trans').css('right', s_nav_newWidth + 'px!important');   
        return s_nav_newWidth;
    }
	function sticky_update_nav( newWidth ) {
		if ( typeof newWidth == 'undefined' )
			return;
		var
			s_grid_1 = 250,
        	s_grid_2 = 360;
		setCookie('sticky_nav_width', newWidth, 0);
        $s_ui('.reposition').removeClass('reposition');
        // Grid Menu cookie
        if (newWidth >= s_grid_1)
            setCookie('sticky-gridmenu', 'grid_menu', 0);
        else 
        	eraseCookie('sticky-gridmenu');
        // Large Grid Menu
        if ( newWidth >= s_grid_2) 
        	setCookie('sticky-gridmenu', 'grid_menu large_grid', 0);
        handle.removeClass('visible');
        $s_ui('#wpcontent, #adminmenumain, #adminmenuwrap, #adminmenuback, #adminmenu, .wrap > h2:first-child, .wrap > h1:first-child').removeClass('no_trans');
        update_carousels();
	}
}
function sticky_menu() {
    sticky_menu_settings();
    sticky_menu_sticky();
    sticky_menu_resize();
    sticky_menu_sortable();
    sticky_menu_reposition_submenus();
    sticky_menu_logout_button();
    sticky_menu_fold();
    sticky_menu_collapse();
    sticky_do_iconpicker( $s_ui( '#adminmenu li.menu-top' ), 'menu' );
}
// Repositions submenus in case they don't 'fit' the window
function sticky_menu_reposition_submenus() {
    var selector = $s_ui( 'li.menu-top', s_nav);
    if ( body.hasClass( 'mobile' ) || ! selector.length ) return;
    selector.on('mouseover', function() {
        if ( ! stickyObj[ 's_nav_sticky'] || $s_ui( '#wpwrap' ).hasClass( 'wp-responsive-open' ) || $s_ui( 'body' ).hasClass( 'mobile' ) ) return;
        menuItem = $s_ui(this);
        if ( menuItem.hasClass( 'wp-menu-open' ) && ! body.hasClass( 'folded' ) && ! body.hasClass( 'grid_menu' ) ) return;
        submenuWrapper = $s_ui( ' > ul ', menuItem);
        if ( ! submenuWrapper.length ) return;
        // If the menu gets out of screen, reposition it.
        sticky_menu_adjust( submenuWrapper );
    });
}
// Reposition the sub menu if they get out of the viewport
function sticky_menu_adjust( el ) {
    if ( $s_ui('body').hasClass('mobile') ) return;
    if ( ! elementInViewport(el)) {
        el.addClass('reposition');
    }
}
function sticky_menu_collapse() {
    var selector = $s_ui('#adminmenu #collapse-menu');
    if ( !selector.length ) return;
    var c = 0;
    selector.each(function() {
        var t = $s_ui(this);
        c += 1;
        if ( c == 2 ) t.remove();
        else if ( pagenow === 'dashboard') t.click(function() {
        	body.addClass('sleeping');
            setTimeout(function() {
                sticky_dashboard_update();
            }, 2000);
        });
    });
}
function elementInViewport(el) {
    if (typeof jQuery === 'function' && el instanceof jQuery) {
        el = el[0];
    }
    if (el == undefined) return false;
    rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}
function h2d(h) {return parseInt(h,16);}
function sticky_admin() {
	vs_attempts = f_attempts = o_attempts = 0;
    sticky_init();
    sticky_init_pace_js();
    sticky_wpab_add_controls();
    sticky_setup_notifications();
    sticky_do_notifications();
    sticky_bulk_actions();
    sticky_tablenav();
    sticky_rework_inputs();
    sticky_check_labels();
    sticky_other_scrollbars();
    // sticky_filters();
}
function sticky_header() {
	sticky_move_viewswitch_to_header();
    sticky_move_filters_to_header();
    sticky_header_iconpicker();
    sticky_subsub_counter();
    sticky_subsub_scrollbar();
    sticky_header_sticky();
    sticky_hamburger_menu();
}
// Binds the iconpicker to the header
function sticky_header_iconpicker() {
	sticky_do_iconpicker( header, 'header' );
}

function sticky_dashboard() {
    if ( ! pagenow.startsWith('dashboard') ) return;
    // backstretched = false;
    sticky_init_odometer();
    sticky_draw_stats();
    sticky_make_big_stats();
    sticky_cur_date();
    sticky_instats();
    sticky_stats_list_carousel();
    sticky_activity();
    // sticky_dashboard_image();
    sticky_welcome_panel();    
    sticky_stats_carousel();
    sticky_info_widgets();
    sticky_dash_widgets_rework();
}
function sticky_cur_date() {
	var selector = $s_ui('.welcome-panel #sticky_stats #s-cur-date');
	if ( ! selector.length ) return;
	selector.prependTo( selector.parent().parent() );
}
// A function for the string, checks if it starts with something.
if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.indexOf(str) === 0;
  };
}
// Updates a slick carousel on the dashboard 
function update_carousel( which ) {
	var selector = $s_ui(which);
	if ( !selector.length || pagenow != 'dashboard' ) return;
	selector.slick('setPosition');
}
// Activity widget rework
function sticky_activity() {
	var selector = $s_ui('#dashboard_activity');
	if ( ! selector.length ) return;
	$s_ui('.hndle',selector).click(function() {
		setTimeout( function() { $s_ui('#activity-widget').slick('setPosition'); }, 500 );
	});
	selector = $s_ui('#activity-widget', selector);
	var ids = [], 
		titles = [];
 	var activity_header = $s_ui( '.activity-block > h4', selector );
 	// WP 4.4 - changed h4 to h3
 	if ( ! activity_header.length ) 
 		activity_header = $s_ui( '.activity-block > h3', selector );
 	if ( activity_header.length ) {
		activity_header.each(function() {
			ids.push( $s_ui(this).parent().attr('id') );
			titles.push( $s_ui(this).text() );
		});
		// Carousel on these!
		selector.slick({
			slidesToShow: 1, 
	        slidesToScroll: 1,
	        swipeToSlide: true,
	        touchMove: true,
	        accessibility: false, // Keep this option for statistics.
	        infinite: false,
	        arrows: false,
	        dots: true,
	        adaptiveHeight: true,
	        customPaging: function( slick, i ) {
	            return '<button class="activity-'+ids[i]+'" title="'+titles[i]+'"><span class="icon"></span></button>';
	        }
		});
	}
}
// Visits / Pageviews functionality
function sticky_instats() {
    var selector = $s_ui( '.welcome-panel .instats > div' );
    if ( ! selector.length ) return;
    selector.each(function() {
        var div = $s_ui(this);
        li = $s_ui( '> ul:not(.hide) > li', div );
        li.each( function( pie ) {
        	var instat = $s_ui(this);
        	var delta = $s_ui('.delta', instat );
        	var dclass = delta.attr('class').replace('delta ','');
        	instat.addClass( dclass );
        	var deltatext = delta.text();
        	var p = ( deltatext != '' ) ? parseFloat( deltatext ) : 0;
        	
        	if ( p >=100 ) 
        		delta.text('100');
        	var pid = 's-circle-' + dclass;
        	// console.log(percent);
        	var NS = "http://www.w3.org/2000/svg";
			var svg = document.createElementNS(NS, "svg");
			var defs = document.createElementNS(NS, 'defs');
			var circle = document.createElementNS(NS, "circle");
			var gradient  = createSVG('linearGradient',{x1:0,y1:1,x2:1,y2:0},{id:pid});
			gradient.appendChild(createSVG('stop',{offset:'0%'}));
        	gradient.appendChild(createSVG('stop',{offset:'100%'}));
        	defs.appendChild(gradient);
        	svg.appendChild(defs);
			// var title = document.createElementNS(NS, "title");
			circle.setAttribute("r", 15);
			circle.setAttribute("cx", 18);
			circle.setAttribute("cy", 18);
			circle.setAttribute("stroke-dasharray", p + " 100");
			svg.setAttribute("viewBox", "1 1 34 34"); // would have been 0 0 32 32 but this way I avoid overflowing
			svg.setAttribute("id", "instat-" + pie);
			svg.appendChild(circle);
			instat.append(svg);
        });
        div.click(function() {
        	$s_ui(this).parent().children().removeClass('active');
        	$s_ui(this).addClass('active');
            $s_ui( 'ul', div ).each(function() {
                var ul = $s_ui(this);
                if ( ul.hasClass('hide') ) ul.removeClass('hide');
                else ul.addClass('hide');
            })
            $s_ui(this).toggleClass('previous');
        });
    });
}
// Replaces the welcome panel with the statistics screen
function sticky_make_big_stats() {
    if ( ! stickyObj['s_big_stats'] || ! stickyObj['s_stats'] ) return; 
    // Create the container if it does not exist. 
    if ( ! $s_ui('.welcome-panel, #welcome-panel').length ) {
        $s_ui('<div class="welcome-panel" id="welcome-panel"><div class="welcome-panel-content">'+ sticky_dashboard_title_type() +'<p class="about-description"></p></div></div>').insertAfter( $s_ui('.wrap > h1') );
    } 
    var widget 		= $s_ui( '#sticky_stats' );
    var table 		= $s_ui( '.inside', widget ),
        wpc 		= $s_ui( '.welcome-panel-content' ),
        widget_name = $s_ui( '.hndle', widget ).text(); 
    var descriptor = $s_ui( '.about-description', wpc );
    var ds = $s_ui( '#dash_slick', widget);
    // $s_ui('<div class="spinner active"></div>').prependTo(ds);
   	// Replace the text in the about-description
    if ( descriptor.length )
    	descriptor.text( widget_name );
    descriptor.remove();
    // Move the statistics
    table.appendTo( wpc );
    // Remove the widget as we have moved everything to the big statistics panel
    widget.remove();
    // Remove the columns, not needed
    $s_ui( '.welcome-panel-column-container', wpc).remove();
    $s_ui( '.welcome-panel-column', wpc ).remove();
    // Adds an identifier to the panel
    wpc.attr( 'id', 'sticky_stats' );
}
// Determines if h3 or h2 based on WP version and puts the title in it
function sticky_dashboard_title_type() {
	var title = $s_ui( '.welcome-panel-content > h3' ), type = '<h3></h3>';
    // WP 4.4
    if ( ! title.length ) {
    	title = $s_ui( '.welcome-panel-content > h2');
    	
    	if ( title.length )
    		type = '<h2></h2>';
    }
    
    if ( stickyObj[ 's_dash_welcome' ] != '' ) 
        title.text( stickyObj[ 's_dash_welcome' ] );
    else 
    	title.remove();
    
    return type;
}
// Odometer on Dashboard numbers
function sticky_init_odometer() {
    odo_arr = Array();
    $s_ui( '#dashboard_right_now ul li > a:first-child, #dashboard_right_now ul li > span:first-child' ).each(function() {
        rev = $s_ui(this);
        var val = rev.text();
        n = val.match(/^[0-9]{1,}/);
        newval = val.replace(/^[0-9]{1,}/, "<span class='number'><span>" + n[0] + "</span></span>");
        rev.html(newval);
    });
    // Set values to 0 and save them in the odo_arr array.
    $s_ui('#dashboard_right_now .main ul > li .number > span').each(function(i) {
        el = $s_ui(this);
        odo_arr[i] = el.text();
        el.text('0');
    });
    return odo_arr;
}
// A function that reworks a few widgets on the dashboard.
function sticky_dash_widgets_rework() {
	// The 'WP News widget'
    sticky_remake_wp_news();
    // Hide the save draft button if the form is empty and show it otherwise
    sticky_quickpress();
    // Comments in the activity widget
    add_scrollbar_to_comments();
    sticky_cool_dates('#activity-widget #future-posts ul li span, #activity-widget #published-posts ul li span, .drafts time');
}
// Prettifies wp-admin dates.
function sticky_cool_dates( selector ) {
	selector = $s_ui( selector );
	if ( ! selector.length ) return;
	var interpretDate = sticky_get_to_know_dates( selector );
	selector.each(function() {
		var date = $s_ui(this);
		// console.log(date.text());
		date.text( make_sticky_date( date.text(), interpretDate ) );
	});
}
// Interprets the WP dates in the admin panel to conver them to 'ago' dates
function make_sticky_date( date, monthFirst ) {
	var datetext, makedate, meridian, defaultformat, stickyformat, timeformat, stickytimeformat;
	if ( ! date.length ) return;
	defaultformat = stickyObj['date_format'];
	timeformat = stickyObj['time_format'];
	if ( ! defaultformat.length || ! timeformat.length ) return;
	if ( $s_ui.isNumeric( date.substr( 0, 1 ) ) && ( defaultformat.indexOf('/') !== -1 || defaultformat.indexOf('-') !== -1 ) ) {
		stickyformat = sticky_wp_date_format( date, monthFirst );
	}
	else {
		if ( defaultformat.indexOf('F') !== -1 ) {
			stickyformat = defaultformat.replace('F', 'MMM');
			stickyformat = stickyformat.replace('j', 'Do');
			stickyformat = stickyformat.replace('Y', 'YYYY');
			stickyformat += ' ' + timeformat.replace('H', 'HH');
			stickyformat = stickyformat.replace('i', 'mm');
			stickyformat = stickyformat.replace('g', 'hh');
			if ( date.indexOf('/') > -1 || date.indexOf('-') > -1 ) {
				// console.log('mf: ' + date);
				stickyformat = sticky_wp_date_format( date, monthFirst );
				// console.log('output:' + stickyformat );
			}
		} else {
			stickyformat = "Mo Do YYYY, hh:mm";
		}
		if ( ! $s_ui.isNumeric( date.substr( 0, 1 ) ) ) {
			stickyformat = stickyformat.replace('Do MMM', 'MMM Do');
		}
		meridian = date.substr( date.length - 2, date.length );
		// No year found in string
		if ( ! date.match( '(19|20)[0-9][0-9]' ) ) {
			var currentYear = new Date().getFullYear();
			date = date.replace( ',', ' ' + currentYear );
		}
		// stickyformat = stickyformat.replace(',','');
		datetext = date.substr( 0, date.indexOf(',') );
		if ( meridian == 'am' )
			stickyformat += ' a';
		if ( meridian == 'pm' )
			stickyformat += ' A';
	}
	// stickycheck = stickyformat.substr( 0, stickyformat.indexOf(',') );
	// for (var count=-1,index=-2; index != -1; count++,index=datetext.indexOf(' ',index+1) );
	// for (var scount=-1,sindex=-2; sindex != -1; scount++,sindex=stickycheck.indexOf(' ',sindex+1) );
	// if ( count - scount != 0 ) {
		// count ++;
		// console.log(count);
	// }
	// console.log( stickyformat );
	makedate = moment( date, stickyformat, document.documentElement.lang.substr(0,2) );
	if ( makedate.isValid() ) {
		makedate = makedate.fromNow();
	}
	else {
		// console.log('INCORECT: ' + stickyformat );
		makedate = moment( new Date( date ) );
		if ( makedate.isValid() ) {
			makedate = makedate.fromNow();
		}
		else {
			makedate = date;
		}
	}
	// console.log(makedate);
	return makedate;
}
function sticky_wp_date_format( date, dateStartsWith ) {
	var format;
	// Not the format we need.
	if ( date == undefined || date.indexOf('F') != -1 ) return;
	// console.log( 'sticky_wp_date_format();' );
	if ( stickyObj['date_format'].indexOf('m') != -1 ) {
		format = stickyObj['date_format'].replace('m', 'MM');
		format = format.replace('d', 'DD');
		format = format.replace('Y', 'YYYY');
	} else {
		format = 'MM-DD-YYYY';
		if ( dateStartsWith == 'year' ) {
			format = 'YYYY-MM-DD';
		}
	}
	if ( dateStartsWith !== undefined ) {
		if ( dateStartsWith == 'day' && format.startsWith('MM') ) 
			format = format.replace('MM','XX').replace('DD','MM').replace('XX','DD');
		if ( dateStartsWith != 'year' && format.startsWith('YY') ) {
			if ( dateStartsWith == 'day' ) {
				format = format.replace('YYYY','XX').replace('DD','YYYY').replace('XX','DD');
			} else if ( dateStartsWith == 'month') {
				format = format.replace('YYYY','XX').replace('MM','YYYY').replace('XX','MM');
			}
		}
	}
	return format;
}
// A function that returns true if the dates of the selector provided are parsed and detected to start with month first, day after.
// Otherwise returns false. Returns undefined if date could not be parsed.
function sticky_get_to_know_dates( dates ) {
	if ( ! dates || ! dates.length ) return;
	var dateStartsWith = '', expectedDateFormat;
	if ( stickyObj['date_format'].startsWith('m') || stickyObj['date_format'].startsWith('M') )
		expectedDateFormat = 'MM';
	if ( stickyObj['date_format'].startsWith('d') || stickyObj['date_format'].startsWith('D') )
		expectedDateFormat = 'DD';
	dates.each( function() {
		var date = $s_ui(this).text(), y, xx, splitter;
		if ( xx = date.match( '(19|20)[0-9][0-9]' ) ) {
			xx = xx.toString();
			y = xx.substr(0, xx.indexOf(','));
			if ( date.indexOf( y ) == 0 ) dateStartsWith = 'year';
		} 
		// If we have an y
		if ( y != 'undefined' ) {
			y = date.replace( y, '' );
			// Strip splitters
			splitter = y.match(/\D/);
			var abc = new RegExp( splitter, 'g' );
			// console.log(y);
			y = y.replace( abc , '' );
			// console.log(y);
		}
		if ( y.length == 4 ) {
			var predict = y.substr(0,2);
			// console.log("PREDI:" + predict );
			if ( $s_ui.isNumeric( predict ) ) {
				if ( predict > 12 )  {// day first
					dateStartsWith = 'day';
				} else {
					var predictd = y.substr(2,4);
					if ( $s_ui.isNumeric( predictd ) ) {
						if ( predictd > 12 ) dateStartsWith = 'month';
					}
				}
			}
		}
		// console.log('anu:' + y );
		// console.log('DATA:'+date);
	});
	if ( dateStartsWith != 'undefined' ) {
		// console.log('incepe cu:'+dateStartsWith);
		return dateStartsWith;
	}
}
// QuickPress widget adjustments
function sticky_quickpress() {
	var selector = $s_ui( '#dashboard_quick_press' );
	if ( ! selector.length )
		return;
	var title_wrap 	= $s_ui('#title-wrap', selector ),
		drafts 		= $s_ui('.drafts', selector );
	var drafts_ul 	= $s_ui('>ul', drafts);
		title 		= $s_ui('>h2,>h3', drafts);
	var drafts_no   = drafts_ul.children().length;
	if ( title.length ) {
		$s_ui('<span class="count">'+drafts_no+'</span>').appendTo(title);
		drafts.click(function() {
			$s_ui(this).toggleClass('open');
		});
	}
	var inputs = $s_ui( 'input[type=text], textarea#content', selector );
	inputs.on('change', function() {
        var t = $s_ui(this);
        if ( t.val() != '' ) $s_ui('form#quick-press').addClass('modified');
    });
}
function add_scrollbar_to_comments() {
	var selector = $s_ui( '#latest-comments.activity-block #the-comment-list' );
	if ( !selector.length ) return;
	selector.mCustomScrollbar( {
        axis: 'y',
        scrollbarPosition: 'inside',
        autoHideScrollbar: true
    });
}
function sticky_remake_wp_news() {
    // Move the elements in a new div called rss-content
    var selector = $s_ui('#dashboard_primary .rssSummary');
    if ( typeof o_attempts !== 'undefined' && o_attempts > 3 || selector.hasClass('s_modified') ) return;
    // Wait for the widget to load if not loaded. Lame way, I know.
    if ( ! selector.length ) {
    	setTimeout( sticky_remake_wp_news, 1000 );
    	o_attempts++;
    	return;
    }
    selector.addClass('s_modified');
    // Setup the new container
    var container = $s_ui('<div id="rss-content"></div>').appendTo( selector.parent() );
    $s_ui('.rss-date', selector.parent() ).appendTo( container );
    selector.appendTo( container );
    var title = $s_ui('a', selector.parent().parent() );
    var titlelink = title.attr('href');
    title.removeAttr('href');
    var button = $s_ui('<a href="' + titlelink + '" target="_blank" class="s_read_more">' + stickyObj['word:readmore'] + '</a>').appendTo( container );
    title.toggle(function() {
        title.addClass('open');
        container.addClass('open');
    }, function() {
        title.removeClass('open');
        container.removeClass('open');
    });
    var morenews = $s_ui('.rss-widget:nth-child(2)');
    var moreheader = $s_ui('<a class="more-news">' + stickyObj['word:morenews'] + '</a>').prependTo(morenews);
    moreheader.parent().addClass('s-morenews');
    var popular_plugin = moreheader.parent().next();
    // Check if the right element
    if ( popular_plugin.hasClass('rss-widget') )
    	popular_plugin.addClass('s-popular-plugin');
    moreheader.toggle(function() {
        morenews.addClass('open');
    }, function() {
        morenews.removeClass('open');
    });
}
function sticky_welcome_panel() {
     $s_ui( '.welcome-panel-column h4, .activity-block h4, .drafts h4' ).click(function() {
        $s_ui(this).parent().toggleClass('open');
    });
    // Heading - Welcome Text
    var selector = $s_ui( ".welcome-panel-content > h3" );
    if ( stickyObj[ 's_dash_welcome' ] != '' ) {
        selector.text( stickyObj[ 's_dash_welcome' ] );
    } else {
        selector.remove();
    }
}
function sticky_stats_list_carousel() {
    $s_ui( '#dash_slick .linkslist .slidethis' ).slick({
    	slidesToShow: 1, 
        slidesToScroll: 1,
        swipeToSlide: true,
        touchMove: true,
        accessibility: true,
        infinite: false,
        arrows: false,
        dots: true,
        vertical: false,
        adaptiveHeight: false,
        edgeFriction: true,
        customPaging: function( slick, i ) {
            return '<button class="list-'+i+'" title=""><span class="icon"></span></button>';
        }
    });
}
function sticky_stats_carousel() {
    // Statistics Carousel
    $s_ui( '#dash_slick' ).slick({
        slidesToShow: 1, 
        slidesToScroll: 1,
        swipeToSlide: true,
        touchMove: true,
        accessibility: true,
        infinite: false,
        arrows: false,
        dots: true,
        vertical: true,
        adaptiveHeight: true,
        edgeFriction: true,
        customPaging: function( slick, i ) {
            switch (i) {
            	case 0 :
	            	var string = 'more than',
	            	    visitors_dif = stickyObj['s_stats']['today_visits'] - stickyObj['s_stats']['yesterday_visits'];
	            	if ( visitors_dif < 0 ) {
	            		string = 'less than';
	            	}
	            	string = Math.abs(visitors_dif) + ' ' + string;
	            	if ( visitors_dif == 0 ) string = 'same as';
	            	string += ' yesterday';
	                return '<button class="graph"><span class="icon"></span>' + '<span class="desc"><strong>Visitors Today</strong>' + string + '</span>' + '</button>';
	                break;
            	case 1 :
	                var isoCountries = {
	                    'AF' : 'Afghanistan',
	                    'AX' : 'Aland Islands',
	                    'AL' : 'Albania',
	                    'DZ' : 'Algeria',
	                    'AS' : 'American Samoa',
	                    'AD' : 'Andorra',
	                    'AO' : 'Angola',
	                    'AI' : 'Anguilla',
	                    'AQ' : 'Antarctica',
	                    'AG' : 'Antigua And Barbuda',
	                    'AR' : 'Argentina',
	                    'AM' : 'Armenia',
	                    'AW' : 'Aruba',
	                    'AU' : 'Australia',
	                    'AT' : 'Austria',
	                    'AZ' : 'Azerbaijan',
	                    'BS' : 'Bahamas',
	                    'BH' : 'Bahrain',
	                    'BD' : 'Bangladesh',
	                    'BB' : 'Barbados',
	                    'BY' : 'Belarus',
	                    'BE' : 'Belgium',
	                    'BZ' : 'Belize',
	                    'BJ' : 'Benin',
	                    'BM' : 'Bermuda',
	                    'BT' : 'Bhutan',
	                    'BO' : 'Bolivia',
	                    'BA' : 'Bosnia And Herzegovina',
	                    'BW' : 'Botswana',
	                    'BV' : 'Bouvet Island',
	                    'BR' : 'Brazil',
	                    'IO' : 'British Indian Ocean Territory',
	                    'BN' : 'Brunei Darussalam',
	                    'BG' : 'Bulgaria',
	                    'BF' : 'Burkina Faso',
	                    'BI' : 'Burundi',
	                    'KH' : 'Cambodia',
	                    'CM' : 'Cameroon',
	                    'CA' : 'Canada',
	                    'CV' : 'Cape Verde',
	                    'KY' : 'Cayman Islands',
	                    'CF' : 'Central African Republic',
	                    'TD' : 'Chad',
	                    'CL' : 'Chile',
	                    'CN' : 'China',
	                    'CX' : 'Christmas Island',
	                    'CC' : 'Cocos (Keeling) Islands',
	                    'CO' : 'Colombia',
	                    'KM' : 'Comoros',
	                    'CG' : 'Congo',
	                    'CD' : 'Congo, Democratic Republic',
	                    'CK' : 'Cook Islands',
	                    'CR' : 'Costa Rica',
	                    'CI' : 'Cote D\'Ivoire',
	                    'HR' : 'Croatia',
	                    'CU' : 'Cuba',
	                    'CY' : 'Cyprus',
	                    'CZ' : 'Czech Republic',
	                    'DK' : 'Denmark',
	                    'DJ' : 'Djibouti',
	                    'DM' : 'Dominica',
	                    'DO' : 'Dominican Republic',
	                    'EC' : 'Ecuador',
	                    'EG' : 'Egypt',
	                    'SV' : 'El Salvador',
	                    'GQ' : 'Equatorial Guinea',
	                    'ER' : 'Eritrea',
	                    'EE' : 'Estonia',
	                    'ET' : 'Ethiopia',
	                    'FK' : 'Falkland Islands (Malvinas)',
	                    'FO' : 'Faroe Islands',
	                    'FJ' : 'Fiji',
	                    'FI' : 'Finland',
	                    'FR' : 'France',
	                    'GF' : 'French Guiana',
	                    'PF' : 'French Polynesia',
	                    'TF' : 'French Southern Territories',
	                    'GA' : 'Gabon',
	                    'GM' : 'Gambia',
	                    'GE' : 'Georgia',
	                    'DE' : 'Germany',
	                    'GH' : 'Ghana',
	                    'GI' : 'Gibraltar',
	                    'GR' : 'Greece',
	                    'GL' : 'Greenland',
	                    'GD' : 'Grenada',
	                    'GP' : 'Guadeloupe',
	                    'GU' : 'Guam',
	                    'GT' : 'Guatemala',
	                    'GG' : 'Guernsey',
	                    'GN' : 'Guinea',
	                    'GW' : 'Guinea-Bissau',
	                    'GY' : 'Guyana',
	                    'HT' : 'Haiti',
	                    'HM' : 'Heard Island & Mcdonald Islands',
	                    'VA' : 'Holy See (Vatican City State)',
	                    'HN' : 'Honduras',
	                    'HK' : 'Hong Kong',
	                    'HU' : 'Hungary',
	                    'IS' : 'Iceland',
	                    'IN' : 'India',
	                    'ID' : 'Indonesia',
	                    'IR' : 'Iran, Islamic Republic Of',
	                    'IQ' : 'Iraq',
	                    'IE' : 'Ireland',
	                    'IM' : 'Isle Of Man',
	                    'IL' : 'Israel',
	                    'IT' : 'Italy',
	                    'JM' : 'Jamaica',
	                    'JP' : 'Japan',
	                    'JE' : 'Jersey',
	                    'JO' : 'Jordan',
	                    'KZ' : 'Kazakhstan',
	                    'KE' : 'Kenya',
	                    'KI' : 'Kiribati',
	                    'KR' : 'Korea',
	                    'KW' : 'Kuwait',
	                    'KG' : 'Kyrgyzstan',
	                    'LA' : 'Lao People\'s Democratic Republic',
	                    'LV' : 'Latvia',
	                    'LB' : 'Lebanon',
	                    'LS' : 'Lesotho',
	                    'LR' : 'Liberia',
	                    'LY' : 'Libyan Arab Jamahiriya',
	                    'LI' : 'Liechtenstein',
	                    'LT' : 'Lithuania',
	                    'LU' : 'Luxembourg',
	                    'MO' : 'Macao',
	                    'MK' : 'Macedonia',
	                    'MG' : 'Madagascar',
	                    'MW' : 'Malawi',
	                    'MY' : 'Malaysia',
	                    'MV' : 'Maldives',
	                    'ML' : 'Mali',
	                    'MT' : 'Malta',
	                    'MH' : 'Marshall Islands',
	                    'MQ' : 'Martinique',
	                    'MR' : 'Mauritania',
	                    'MU' : 'Mauritius',
	                    'YT' : 'Mayotte',
	                    'MX' : 'Mexico',
	                    'FM' : 'Micronesia, Federated States Of',
	                    'MD' : 'Moldova',
	                    'MC' : 'Monaco',
	                    'MN' : 'Mongolia',
	                    'ME' : 'Montenegro',
	                    'MS' : 'Montserrat',
	                    'MA' : 'Morocco',
	                    'MZ' : 'Mozambique',
	                    'MM' : 'Myanmar',
	                    'NA' : 'Namibia',
	                    'NR' : 'Nauru',
	                    'NP' : 'Nepal',
	                    'NL' : 'Netherlands',
	                    'AN' : 'Netherlands Antilles',
	                    'NC' : 'New Caledonia',
	                    'NZ' : 'New Zealand',
	                    'NI' : 'Nicaragua',
	                    'NE' : 'Niger',
	                    'NG' : 'Nigeria',
	                    'NU' : 'Niue',
	                    'NF' : 'Norfolk Island',
	                    'MP' : 'Northern Mariana Islands',
	                    'NO' : 'Norway',
	                    'OM' : 'Oman',
	                    'PK' : 'Pakistan',
	                    'PW' : 'Palau',
	                    'PS' : 'Palestinian Territory, Occupied',
	                    'PA' : 'Panama',
	                    'PG' : 'Papua New Guinea',
	                    'PY' : 'Paraguay',
	                    'PE' : 'Peru',
	                    'PH' : 'Philippines',
	                    'PN' : 'Pitcairn',
	                    'PL' : 'Poland',
	                    'PT' : 'Portugal',
	                    'PR' : 'Puerto Rico',
	                    'QA' : 'Qatar',
	                    'RE' : 'Reunion',
	                    'RO' : 'Romania',
	                    'RU' : 'Russian Federation',
	                    'RW' : 'Rwanda',
	                    'BL' : 'Saint Barthelemy',
	                    'SH' : 'Saint Helena',
	                    'KN' : 'Saint Kitts And Nevis',
	                    'LC' : 'Saint Lucia',
	                    'MF' : 'Saint Martin',
	                    'PM' : 'Saint Pierre And Miquelon',
	                    'VC' : 'Saint Vincent And Grenadines',
	                    'WS' : 'Samoa',
	                    'SM' : 'San Marino',
	                    'ST' : 'Sao Tome And Principe',
	                    'SA' : 'Saudi Arabia',
	                    'SN' : 'Senegal',
	                    'RS' : 'Serbia',
	                    'SC' : 'Seychelles',
	                    'SL' : 'Sierra Leone',
	                    'SG' : 'Singapore',
	                    'SK' : 'Slovakia',
	                    'SI' : 'Slovenia',
	                    'SB' : 'Solomon Islands',
	                    'SO' : 'Somalia',
	                    'ZA' : 'South Africa',
	                    'GS' : 'South Georgia And Sandwich Isl.',
	                    'ES' : 'Spain',
	                    'LK' : 'Sri Lanka',
	                    'SD' : 'Sudan',
	                    'SR' : 'Suriname',
	                    'SJ' : 'Svalbard And Jan Mayen',
	                    'SZ' : 'Swaziland',
	                    'SE' : 'Sweden',
	                    'CH' : 'Switzerland',
	                    'SY' : 'Syrian Arab Republic',
	                    'TW' : 'Taiwan',
	                    'TJ' : 'Tajikistan',
	                    'TZ' : 'Tanzania',
	                    'TH' : 'Thailand',
	                    'TL' : 'Timor-Leste',
	                    'TG' : 'Togo',
	                    'TK' : 'Tokelau',
	                    'TO' : 'Tonga',
	                    'TT' : 'Trinidad And Tobago',
	                    'TN' : 'Tunisia',
	                    'TR' : 'Turkey',
	                    'TM' : 'Turkmenistan',
	                    'TC' : 'Turks And Caicos Islands',
	                    'TV' : 'Tuvalu',
	                    'UG' : 'Uganda',
	                    'UA' : 'Ukraine',
	                    'AE' : 'United Arab Emirates',
	                    'GB' : 'United Kingdom',
	                    'US' : 'United States',
	                    'UM' : 'United States Outlying Islands',
	                    'UY' : 'Uruguay',
	                    'UZ' : 'Uzbekistan',
	                    'VU' : 'Vanuatu',
	                    'VE' : 'Venezuela',
	                    'VN' : 'Viet Nam',
	                    'VG' : 'Virgin Islands, British',
	                    'VI' : 'Virgin Islands, U.S.',
	                    'WF' : 'Wallis And Futuna',
	                    'EH' : 'Western Sahara',
	                    'YE' : 'Yemen',
	                    'ZM' : 'Zambia',
	                    'ZW' : 'Zimbabwe'
	                };
	                var c = 0;
	                var countries = Array();
	                var m = stickyObj['country-array'].split(',');
	                m.forEach(function( element, index, array ) {
	                    if ( index % 2 == 0 && index < 6 && element != '' ) {
	                        countries[c] = isoCountries[element];
	                        c += 1;
	                    }
	                    else return;
	                });
	                return '<button class="map"><span class="icon"></span>' + '<span class="desc"><strong>Popular Locations</strong>' + countries.join(', ') + '</span>' + '</button>';
	               	break;
            	case 2 :
	                var traffic = Array();
	                for ( var j = 0; j <= 3; j++ ) {
	                    var m = stickyObj['p'+(j+1)].split(',');
	                    var max = found = 0;
	                    m.forEach(function( element, index, array) {
	                        if ( parseInt(element) >= max ) max = element;
	                    });
	                    traffic[j] = m[m.indexOf(max) - 1];
	                }
	                return '<button class="circle"><span class="icon"></span>' + '<span class="desc"><strong>Best Traffic From</strong>' + traffic.join(', ') + '</span>' + '</button>';
            		break;
            	case 3 :
                	return '<button class="list"><span class="icon"></span>' + '<span class="desc"><strong>Most Accessed Link</strong>'+ stickyObj['s_stats']['top_links'][0]['referer'] +'</span>' + '</button>';
        			break;
        	}
    	}
    });
    // $s_ui( '#dash_slick' ).on('afterChange', function(event, slick, duration) {
        // if ( backstretched ) $s_ui( "#welcome-panel" ).backstretch( stickyObj[ 's_dash_image' ] );
        // else return;
    // });
}
// function sticky_dashboard_image() {
//     if ( ! stickyObj[ 's_dash_image' ] != '' || ! $s_ui('body').hasClass( 'index-php' )  || ! stickyObj[ 's_dash_image' ] != null ) return;
//     $s_ui( "#welcome-panel" ).backstretch( stickyObj[ 's_dash_image' ] );
//     backstretched = true;
// }
function sticky_draw_stats() {
    if ( ! stickyObj['s_stats'] || ! stickyObj['stats-array'] || ! stickyObj['country-array'] || pagenow != 'dashboard' ) return;
    google.setOnLoadCallback(drawChart);
    google.setOnLoadCallback(drawMap);
    google.setOnLoadCallback(sticky_make_pie1);
    google.setOnLoadCallback(sticky_make_pie2);
    google.setOnLoadCallback(sticky_make_pie3);
    google.setOnLoadCallback(sticky_make_pie4);    
}
// Adds information tooltips to boxes
function sticky_info_widgets() {
    // if (body.hasClass('mobile')) return;
    var widgets_w_info = $s_ui("#dashboard_right_now, #bbp-dashboard-right-now");
    if ( ! widgets_w_info.length ) return;
    widgets_w_info.each(function() {
        var wi = $s_ui(this);
        var infocon = '';
        $s_ui('.inside > .main > p, .versions',wi).each(function() {
            infocon += $s_ui(this).html();
            infocon += '<br />';
            $s_ui(this).remove();
        });
        infocon = decodeEntities(infocon);
        wi.prepend('<div class="widget-info" title="'+infocon+'"></div>');
    });
}
// Updates the dashboard
function sticky_dashboard_update() {
    $s_ui( '#dash_slick' ).slick('setPosition');
    // drawChart();
    // drawMap();
    body.removeClass('sleeping');
}
//
function drawChart() {
    if ( ! stickyObj['stats-array'] || pagenow != 'dashboard' ) return;
    var data = [[ 
        stickyObj['word:year'], 
        {type:'string', role:'tooltip', p:{html:true}},
        {type:'number', label:stickyObj['word:pageviews']}, 
        {type:'number', label:stickyObj['word:visitors']},
    ]];
    var spl = stickyObj['stats-array'].split(",");
    var count = spl.length - 1;
    function sticky_chart_tip( text, pvs, visits, pvs_delta, visits_delta ) {
    	var date = text.split('+');
    	var day = new Date(date[1]);
    	text = '<div class="sticky_tooltip_text"><div class="domain"><strong>' + date[0] + '</strong><em>' + date[1] + '</em></div><ul class="data"><li><strong>'+stickyObj['word:pageviews']+'</strong> '+pvs+'</li><li><strong>'+stickyObj['word:visitors']+'</strong> '+visits+'</li></ul></div>';
    	return text;
    }
    for ( i = 0; i < count; i += 4 ) {
        var smarr = [ spl[0+i], 
        sticky_chart_tip( spl[3+i], parseInt( spl[1+i] ), parseInt( spl[2+i] ) ), parseInt( spl[1+i] ), parseInt( spl[2+i] ) ];
        data.push(smarr);
    }
    // Turn the data into a datatable
    data = google.visualization.arrayToDataTable( data );
    // Chart Options
    var options = {
        title: '',
        tooltip: { 
            isHtml: true,
            trigger: 'both'
        },
        backgroundColor: 'transparent',
        animation: {
            startup: true,
            duration: 500,
            easing: 'in'
        },
        colors: stickyObj['s_colors'],
        pointsVisible: false,
        vAxis: {
            title: '',
            baselineColor: '#ffffff',
            textPosition: 'in',
            textStyle: {
                bold: false,
                color: '#ffffff',
                fontSize: 9
            },
            gridlines: {
                count: 5
            }
        },
        hAxis: {
            title: '',
            textStyle: {
                color: '#ffffff'
            },
            textPosition: 'top',
            showTextEvery: '1',
            gridlines: {
                color: '#ffffff',
                count: 11
            },
            direction: ( isRtl ) ? -1 : 1,
            format: '####'
        },
        legend: {
            position: 'none'
        },
        lineWidth: '2',
        pointSize: '0',
        curveType: 'function',
        is3D: false,
        fontName: 'Open Sans',
        fontSize: '11',
        focusTarget: 'category',
        chartArea: {
            width: '99%', // so the margin dots are displayed
            height: '70%'
        }
    };
    chartdiv = document.getElementById('chart_div');
    chart = new google.visualization.LineChart(chartdiv);
 //    google.visualization.events.addOneTimeListener(chart, 'ready', function () {
	//     var container = document.querySelector('#chart_div > div:last-child');
	//     function setPosition () {
	//     	console.log('ad');
	//         var tooltip = container.querySelector('.google-visualization-tooltip');
	//         tooltip.style.top = parseFloat(tooltip.style.top) + 1000;
	//         tooltip.style.left = parseFloat(tooltip.style.left) - 15;
	//     }
	//     if (typeof MutationObserver === 'function') {
	//         var observer = new MutationObserver(function(m) {
	//         	console.log('dafux');
	//             for (var i = 0; i < m.length; i++) {
	//                 if (m[i].addedNodes.length) {
	//                     setPosition();
	//                     break; // once we find the added node, we shouldn't need to look any further
	//                 }
	//             }
	//         });
	//         observer.observe(container, {
	//             childList: true
	//         });
	//     }
	//     else if (document.addEventListener) {
	//         container.addEventListener('DOMNodeInserted', setPosition);
	//     }
	//     else {
	//         container.attachEvent('onDOMNodeInserted', setPosition);
	//     }
	// });
    // Add the sticky effects after the animation has finished
    google.visualization.events.addListener(chart, 'animationfinish', function() {
        var gradient  = createSVG('linearGradient',{x1:0,y1:1,x2:1,y2:0},{id:'fx'});
        var gradient2  = createSVG('linearGradient',{x1:0,y1:1,x2:1,y2:0},{id:'fxtwo'});
        var feoffset = document.createElementNS("http://www.w3.org/2000/svg", "feOffset");
        var feGaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
        var filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
        var feBlend = document.createElementNS("http://www.w3.org/2000/svg", "feBlend");
        var feFuncA = document.createElementNS("http://www.w3.org/2000/svg", "feFuncA");
        var feCTransfer = document.createElementNS("http://www.w3.org/2000/svg", "feComponentTransfer");
        filter.setAttribute("id", "sticky_svg_shadow");
        feoffset.setAttribute("result", "shadow");
        feoffset.setAttribute("in", "offOut");
        feoffset.setAttribute("dx", "0");
        feoffset.setAttribute("dy", stickyObj['s_required_color'] == 'black' ? 1 : 3 );
        feGaussianBlur.setAttribute("result", "blurOut");
        feGaussianBlur.setAttribute("in", "shadow");
        // Use a lower-intensity shadow for white backgrounds
        feGaussianBlur.setAttribute("stdDeviation", stickyObj['s_required_color'] == 'black' ? 1 : 3 );
        feCTransfer.setAttribute("in", "SourceAlpha");
        feCTransfer.setAttribute("result", "offOut");
        feFuncA.setAttribute("type", "linear");
        feFuncA.setAttribute("slope", "0.2");
        feBlend.setAttribute("in", "SourceGraphic");
        feBlend.setAttribute("in2", "blurOut");
        feBlend.setAttribute("mode", "normal");
        filter.appendChild(feCTransfer);
        filter.appendChild(feoffset);
        filter.appendChild(feGaussianBlur);
        filter.appendChild(feBlend);
        feCTransfer.appendChild(feFuncA);
        var g_el = chartdiv.querySelector('svg>defs');
        g_el.appendChild(gradient);
        g_el.appendChild(gradient2);
        g_el.appendChild(filter);
        gradient.appendChild(createSVG('stop',{offset:'0%'}));
        gradient.appendChild(createSVG('stop',{offset:'50%'}));
        gradient.appendChild(createSVG('stop',{offset:'100%'}));
        gradient2.appendChild(createSVG('stop',{offset:'0%'}));
        gradient2.appendChild(createSVG('stop',{offset:'50%'}));
        gradient2.appendChild(createSVG('stop',{offset:'100%'}));
        var drn = chartdiv.querySelector('svg>defs+g>rect+g');
        	drn = drn.getAttribute('clip-path');
        	drn = drn.substring( 4, drn.indexOf('#') );
        var path1 = chartdiv.querySelector('svg>defs+g>g>g:last-child>path:first-child');
        var path2 = chartdiv.querySelector('svg>defs+g>g>g:last-child>path:nth-child(2)');
        var path1inside = chartdiv.querySelector('svg>defs+g>rect+g>g:nth-child(2)>g:first-child>path');
        var path2inside = chartdiv.querySelector('svg>defs+g>rect+g>g:nth-child(2)>g:nth-child(2)>path');
        if ( path1 != undefined ) {
        	path1.setAttribute('filter', 'url(' + drn + '#sticky_svg_shadow)' );
         	path1.setAttribute('stroke', 'url(' + drn + '#fx)' );
         }
        if ( path2 != undefined ) {
        	path2.setAttribute('filter', 'url(' + drn + '#sticky_svg_shadow)' );
        	path2.setAttribute('stroke', 'url(' + drn + '#fxtwo)' );
        }
        if ( path1inside != undefined ) 
        	path1inside.setAttribute('fill', 'url(' + drn + '#fx)' );
        if ( path2inside != undefined ) 
        	path2inside.setAttribute('fill', 'url(' + drn + '#fxtwo)' );
    });    
    chart.draw(data, options);
}
// Creates a SVG NS
function createSVG(n,a,b){
      var xmlns = "http://www.w3.org/2000/svg",
          e     = document.createElementNS(xmlns, n);
      for(var k in a){
        e.setAttributeNS (null, k,a[k]);
      }
      for(var k in b){
        e.setAttribute (k,b[k]);
      }
      return e;
}
// Draws the map on the dashboard statistics 
function drawMap() {
    if ( ! stickyObj['country-array'] || pagenow != 'dashboard' ) return;
    var data = new Array();
    data = [
        [
            stickyObj['word:country'],
            stickyObj['word:popularity'],
        ]
    ];
    var spl = stickyObj['country-array'].split(",");
    count = spl.length - 1;
    for ( i = 0; i < count; i += 2) {
        var smarr = [ spl[0+i], parseInt( spl[1+i] ) ];
        data.push(smarr);
    }
    data = google.visualization.arrayToDataTable( data );
    var options = {
        backgroundColor: {
            fill: 'transparent',
        },
        forceIFrame: false,
        keepAspectRatio: true,
        legend: 'none',
        datalessRegionColor: 'transparent',
        displayMode: 'markers',
        colors: stickyObj['s_colors'],
        annotations: {
            highContrast: true
        },
        magnifyingGlass: {
            enable: true,
            zoomFactor: 5.0
        }
    };
    var container = document.getElementById('map_canvas');
    var geomap = new google.visualization.GeoChart(container);
    geomap.draw(data, options);
};
function sticky_make_pie1() {
    sticky_make_pie_chart(stickyObj['word:devices'],'p1','p1_devices');
}
function sticky_make_pie2() {
    sticky_make_pie_chart(stickyObj['word:oss'],'p2','p2_oss');   
}
function sticky_make_pie3() {
    sticky_make_pie_chart(stickyObj['word:sources'],'p3','p3_sources');
}
function sticky_make_pie4() {
    sticky_make_pie_chart(stickyObj['word:browsers'],'p4','p4_browsers');   
}
function sticky_make_pie_chart(title, src, container) {
	if ( ! title.length || pagenow != 'dashboard' ) return;
    var data = google.visualization.arrayToDataTable( sticky_read_pie_data(title, src) );
    var csel = document.getElementById(container);
    var pie = new google.visualization.PieChart(csel);
    var options = {
        backgroundColor: 'transparent',
        colors: stickyObj['s_colors'],
        legend: {
            position: 'bottom',
            alignment: 'center',
        },
        pieHole: 0.95,
        pieSliceBorderColor: 'transparent',
        pieSliceText: 'label',
        pieSliceTextStyle: {
            color: stickyObj['s_dash_maps'],
        },
        chartArea: {
            width: '100%',
            backgroundColor: {
                stroke: 'transparent',
                strokeWidth: 0,
                fill: 'transparent',
            }
        }, 
        tooltip: {
            isHtml: true
        }
    };
    pie.draw(data, options);
}
function sticky_read_pie_data(title, src) {
    var data = new Object();
    data = [[ title, stickyObj['word:percent'] ]];
    var xs = stickyObj[ '' + src].split(',');
    var count = xs.length - 1;
    for ( i = 0; i < count; i += 2 ) {
        data.push( [ xs[0+i], parseInt( xs[1+i] ) ] );
    }
    return data;
}
function sticky_luminance( hex ) {
  x = hex2rgb( hex );
  if ( ( ( x.r * 299 ) + ( x.g * 587 ) + ( x.b * 114 ) ) / 255000 >= .5 ) return true;
  return false;
}
function hex2rgb( hex ) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
}
function sticky_remake_widefat_tr() {
    $s_ui('#the-list tr, .widefat tr').each(function() {
        tr = $s_ui(this);
        state = $s_ui('span.post-state', tr);
        if (tr.hasClass('post-password-required')) tr.addClass('status-password');
        if (state[0] != undefined) {
            tr.removeClass('status-publish');
            status = state.text();
            // class_status = tr.attr('class').match(/status-([^\s]+)/)[0];
            title = tr.find($s_ui('.post-title > strong'));
            pagesub = state.find($s_ui('.post'))
            $s_ui(title).html(function() {
                elem = $s_ui('a', this);
                espan = elem.parent();
                parsd = espan.html();
                return elem;
            });
            state.addClass('sticky_altered').attr('title', status).prependTo(tr.children('th'));
        }
    });
}
function sticky_no_items() {
    $s_ui( 'tr.no-items' ).each(function() {
        tr = $s_ui(this);
        trtext = tr.text();
        tr.parent().parent().replaceWith('<div class="sticky_no_items">'+trtext+'</div>');
    });
}
function sticky_widefat_select() {
    // Toggle all on header / footer checkbox click.
    if ( ! $s_ui('table.widefat').length ) return;
    var counter = $s_ui( '#sticky_bulk_actions > div.counter' ), 
        c = 0;
    counter.click(function() {
        body.removeClass('bulk-open');
    });
    $s_ui("table.widefat").each(function() {
        var table   = $s_ui(this),
            all     = parseInt( $s_ui( 'tbody > tr', table ).length );
        $s_ui( " > thead .check-column input:checkbox, > tfoot .check-column input:checkbox", table ).click(function() {
            chStatus = this.checked;
            $s_ui("tbody .check-column input:checkbox", table).each(function() {
                this.checked = chStatus;
                $s_ui(this).prop('checked', chStatus);
                $s_ui(this).closest('tr').toggleClass('thisRow', chStatus);
            });
            if (chStatus) { 
                body.addClass('bulk-open');
                c = all;
            }
            else {
                body.removeClass('bulk-open');
                c = 0;
            }
            counter.text(c);
        });
    });
    // Toggle 'thisRow' class on row select.
    $s_ui('tbody .check-column input:checkbox').click(function() {
        schStatus = this.checked;
        if ( schStatus ) c += 1;
        else c -= 1;
        $s_ui(this).closest('tr').toggleClass('thisRow', schStatus);
        if ( c >= 1 ) {
            if ( !body.hasClass('bulk-open') ) body.addClass('bulk-open');
        } else {
            if ( body.hasClass('bulk-open') ) body.removeClass('bulk-open');
            $s_ui('table.widefat > thead .check-column input:checkbox, table.widefat > thead .check-column input:checkbox').prop('checked',false);
        }
        counter.text(c);
    });
}
(function($) {
    $(document).ready(function() {
        function debouncer(func, timeout) {
            var timeoutID, timeout = timeout || 200;
            return function() {
                var scope = this,
                    args = arguments;
                clearTimeout(timeoutID);
                timeoutID = setTimeout(function() {
                    func.apply(scope, Array.prototype.slice.call(args));
                }, timeout);
            }
        }
    });
})(jQuery);
/* 
 * StickyAdmin
 * EXTENSIONS 
 */
//toastr
!function(a){a(["jquery"],function(a){return function(){function b(a,b,c){return o({type:u.error,iconClass:p().iconClasses.error,message:a,optionsOverride:c,title:b})}function c(b,c){return b||(b=p()),r=a("#"+b.containerId),r.length?r:(c&&(r=l(b)),r)}function d(a,b,c){return o({type:u.info,iconClass:p().iconClasses.info,message:a,optionsOverride:c,title:b})}function e(a){s=a}function f(a,b,c){return o({type:u.success,iconClass:p().iconClasses.success,message:a,optionsOverride:c,title:b})}function g(a,b,c){return o({type:u.warning,iconClass:p().iconClasses.warning,message:a,optionsOverride:c,title:b})}function h(a){var b=p();r||c(b),k(a,b)||j(b)}function i(b){var d=p();return r||c(d),b&&0===a(":focus",b).length?void q(b):void(r.children().length&&r.remove())}function j(b){for(var c=r.children(),d=c.length-1;d>=0;d--)k(a(c[d]),b)}function k(b,c){return b&&0===a(":focus",b).length?(b[c.hideMethod]({duration:c.hideDuration,easing:c.hideEasing,complete:function(){q(b)}}),!0):!1}function l(b){return r=a("<div/>").attr("id",b.containerId).addClass(b.positionClass).attr("aria-live","polite").attr("role","alert"),r.appendTo(a(b.target)),r}function m(){return{tapToDismiss:!0,toastClass:"toast",containerId:"toast-container",debug:!1,showMethod:"fadeIn",showDuration:300,showEasing:"swing",onShown:void 0,hideMethod:"fadeOut",hideDuration:1e3,hideEasing:"swing",onHidden:void 0,extendedTimeOut:1e3,iconClasses:{error:"toast-error",info:"toast-info",success:"toast-success",warning:"toast-warning"},iconClass:"toast-info",positionClass:"toast-top-right",timeOut:5e3,titleClass:"toast-title",messageClass:"toast-message",target:"body",closeHtml:"<button>&times;</button>",newestOnTop:!0}}function n(a){s&&s(a)}function o(b){function d(b){return!a(":focus",j).length||b?j[g.hideMethod]({duration:g.hideDuration,easing:g.hideEasing,complete:function(){q(j),g.onHidden&&"hidden"!==o.state&&g.onHidden(),o.state="hidden",o.endTime=new Date,n(o)}}):void 0}function e(){(g.timeOut>0||g.extendedTimeOut>0)&&(i=setTimeout(d,g.extendedTimeOut))}function f(){clearTimeout(i),j.stop(!0,!0)[g.showMethod]({duration:g.showDuration,easing:g.showEasing})}var g=p(),h=b.iconClass||g.iconClass;"undefined"!=typeof b.optionsOverride&&(g=a.extend(g,b.optionsOverride),h=b.optionsOverride.iconClass||h),t++,r=c(g,!0);var i=null,j=a("<div/>"),k=a("<div/>"),l=a("<div/>"),m=a(g.closeHtml),o={toastId:t,state:"visible",startTime:new Date,options:g,map:b};return b.iconClass&&j.addClass(g.toastClass).addClass(h),b.title&&(k.append(b.title).addClass(g.titleClass),j.append(k)),b.message&&(l.append(b.message).addClass(g.messageClass),j.append(l)),g.closeButton&&(m.addClass("toast-close-button").attr("role","button"),j.prepend(m)),j.hide(),g.newestOnTop?r.prepend(j):r.append(j),j[g.showMethod]({duration:g.showDuration,easing:g.showEasing,complete:g.onShown}),g.timeOut>0&&(i=setTimeout(d,g.timeOut)),j.hover(f,e),!g.onclick&&g.tapToDismiss&&j.click(d),g.closeButton&&m&&m.click(function(a){a.stopPropagation?a.stopPropagation():void 0!==a.cancelBubble&&a.cancelBubble!==!0&&(a.cancelBubble=!0),d(!0)}),g.onclick&&j.click(function(){g.onclick(),d()}),n(o),g.debug&&console&&console.log(o),j}function p(){return a.extend({},m(),v.options)}function q(a){r||(r=c()),a.is(":visible")||(a.remove(),a=null,0===r.children().length&&r.remove())}var r,s,t=0,u={error:"error",info:"info",success:"success",warning:"warning"},v={clear:h,remove:i,error:b,getContainer:c,info:d,options:{},subscribe:e,success:f,version:"2.0.3",warning:g};return v}()})}("function"==typeof define&&define.amd?define:function(a,b){"undefined"!=typeof module&&module.exports?module.exports=b(require("jquery")):window.toastr=b(window.jQuery)});
//labelauty
!function(a){function b(a,b){a&&window.console&&window.console.log&&window.console.log("jQuery-LABELAUTY: "+b)}function c(a,b,c){var d,e,f;return null==b?e=f="":(e=b[0],f=null==b[1]?e:b[1]),d=1==c?'<label for="'+a+'"><span class="labelauty-unchecked-image"></span><span class="labelauty-unchecked">'+e+'</span><span class="labelauty-checked-image"></span><span class="labelauty-checked">'+f+"</span></label>":'<label for="'+a+'"><span class="labelauty-unchecked-image"></span><span class="labelauty-checked-image"></span></label>'}a.fn.labelauty=function(d){var e=a.extend({development:!1,"class":"labelauty",label:!0,separator:"|",checked_label:"Checked",unchecked_label:"Unchecked",minimum_width:!1,same_width:!0},d);return this.each(function(){var g,h,i,d=a(this),f=!0;if(d.is(":checkbox")===!1&&d.is(":radio")===!1)return this;if(d.addClass(e["class"]),g=d.attr("data-labelauty"),f=e.label,f===!0&&(null==g||0===g.length?(h=new Array,h[0]=e.unchecked_label,h[1]=e.checked_label):(h=g.split(e.separator),h.length>2?(f=!1,b(e.development,"There's more than two labels. LABELAUTY will not use labels.")):1===h.length&&b(e.development,"There's just one label. LABELAUTY will use this one for both cases."))),d.css({display:"none"}),d.removeAttr("data-labelauty"),i=d.attr("id"),null==i){var j=1+Math.floor(1024e3*Math.random());for(i="labelauty-"+j;0!==a(i).length;)j++,i="labelauty-"+j,b(e.development,"Holy crap, between 1024 thousand numbers, one raised a conflict. Trying again.");d.attr("id",i)}if(d.after(c(i,h,f)),e.minimum_width!==!1&&d.next("label[for="+i+"]").css({"min-width":e.minimum_width}),0!=e.same_width&&1==e.label){var k=d.next("label[for="+i+"]"),l=k.find("span.labelauty-unchecked").width(),m=k.find("span.labelauty-checked").width();l>m?k.find("span.labelauty-checked").width(l):k.find("span.labelauty-unchecked").width(m)}})}}(jQuery);
/*! pace 1.0.2 */
(function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X=[].slice,Y={}.hasOwnProperty,Z=function(a,b){function c(){this.constructor=a}for(var d in b)Y.call(b,d)&&(a[d]=b[d]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},$=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1};for(u={catchupTime:100,initialRate:.03,minTime:250,ghostTime:100,maxProgressPerFrame:20,easeFactor:1.25,startOnPageLoad:!0,restartOnPushState:!0,restartOnRequestAfter:500,target:"body",elements:{checkInterval:100,selectors:["body"]},eventLag:{minSamples:10,sampleCount:3,lagThreshold:3},ajax:{trackMethods:["GET"],trackWebSockets:!0,ignoreURLs:[]}},C=function(){var a;return null!=(a="undefined"!=typeof performance&&null!==performance&&"function"==typeof performance.now?performance.now():void 0)?a:+new Date},E=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,t=window.cancelAnimationFrame||window.mozCancelAnimationFrame,null==E&&(E=function(a){return setTimeout(a,50)},t=function(a){return clearTimeout(a)}),G=function(a){var b,c;return b=C(),(c=function(){var d;return d=C()-b,d>=33?(b=C(),a(d,function(){return E(c)})):setTimeout(c,33-d)})()},F=function(){var a,b,c;return c=arguments[0],b=arguments[1],a=3<=arguments.length?X.call(arguments,2):[],"function"==typeof c[b]?c[b].apply(c,a):c[b]},v=function(){var a,b,c,d,e,f,g;for(b=arguments[0],d=2<=arguments.length?X.call(arguments,1):[],f=0,g=d.length;g>f;f++)if(c=d[f])for(a in c)Y.call(c,a)&&(e=c[a],null!=b[a]&&"object"==typeof b[a]&&null!=e&&"object"==typeof e?v(b[a],e):b[a]=e);return b},q=function(a){var b,c,d,e,f;for(c=b=0,e=0,f=a.length;f>e;e++)d=a[e],c+=Math.abs(d),b++;return c/b},x=function(a,b){var c,d,e;if(null==a&&(a="options"),null==b&&(b=!0),e=document.querySelector("[data-pace-"+a+"]")){if(c=e.getAttribute("data-pace-"+a),!b)return c;try{return JSON.parse(c)}catch(f){return d=f,"undefined"!=typeof console&&null!==console?console.error("Error parsing inline pace options",d):void 0}}},g=function(){function a(){}return a.prototype.on=function(a,b,c,d){var e;return null==d&&(d=!1),null==this.bindings&&(this.bindings={}),null==(e=this.bindings)[a]&&(e[a]=[]),this.bindings[a].push({handler:b,ctx:c,once:d})},a.prototype.once=function(a,b,c){return this.on(a,b,c,!0)},a.prototype.off=function(a,b){var c,d,e;if(null!=(null!=(d=this.bindings)?d[a]:void 0)){if(null==b)return delete this.bindings[a];for(c=0,e=[];c<this.bindings[a].length;)e.push(this.bindings[a][c].handler===b?this.bindings[a].splice(c,1):c++);return e}},a.prototype.trigger=function(){var a,b,c,d,e,f,g,h,i;if(c=arguments[0],a=2<=arguments.length?X.call(arguments,1):[],null!=(g=this.bindings)?g[c]:void 0){for(e=0,i=[];e<this.bindings[c].length;)h=this.bindings[c][e],d=h.handler,b=h.ctx,f=h.once,d.apply(null!=b?b:this,a),i.push(f?this.bindings[c].splice(e,1):e++);return i}},a}(),j=window.Pace||{},window.Pace=j,v(j,g.prototype),D=j.options=v({},u,window.paceOptions,x()),U=["ajax","document","eventLag","elements"],Q=0,S=U.length;S>Q;Q++)K=U[Q],D[K]===!0&&(D[K]=u[K]);i=function(a){function b(){return V=b.__super__.constructor.apply(this,arguments)}return Z(b,a),b}(Error),b=function(){function a(){this.progress=0}return a.prototype.getElement=function(){var a;if(null==this.el){if(a=document.querySelector(D.target),!a)throw new i;this.el=document.createElement("div"),this.el.className="pace pace-active",document.body.className=document.body.className.replace(/pace-done/g,""),document.body.className+=" pace-running",this.el.innerHTML='<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>',null!=a.firstChild?a.insertBefore(this.el,a.firstChild):a.appendChild(this.el)}return this.el},a.prototype.finish=function(){var a;return a=this.getElement(),a.className=a.className.replace("pace-active",""),a.className+=" pace-inactive",document.body.className=document.body.className.replace("pace-running",""),document.body.className+=" pace-done"},a.prototype.update=function(a){return this.progress=a,this.render()},a.prototype.destroy=function(){try{this.getElement().parentNode.removeChild(this.getElement())}catch(a){i=a}return this.el=void 0},a.prototype.render=function(){var a,b,c,d,e,f,g;if(null==document.querySelector(D.target))return!1;for(a=this.getElement(),d="translate3d("+this.progress+"%, 0, 0)",g=["webkitTransform","msTransform","transform"],e=0,f=g.length;f>e;e++)b=g[e],a.children[0].style[b]=d;return(!this.lastRenderedProgress||this.lastRenderedProgress|0!==this.progress|0)&&(a.children[0].setAttribute("data-progress-text",""+(0|this.progress)+"%"),this.progress>=100?c="99":(c=this.progress<10?"0":"",c+=0|this.progress),a.children[0].setAttribute("data-progress",""+c)),this.lastRenderedProgress=this.progress},a.prototype.done=function(){return this.progress>=100},a}(),h=function(){function a(){this.bindings={}}return a.prototype.trigger=function(a,b){var c,d,e,f,g;if(null!=this.bindings[a]){for(f=this.bindings[a],g=[],d=0,e=f.length;e>d;d++)c=f[d],g.push(c.call(this,b));return g}},a.prototype.on=function(a,b){var c;return null==(c=this.bindings)[a]&&(c[a]=[]),this.bindings[a].push(b)},a}(),P=window.XMLHttpRequest,O=window.XDomainRequest,N=window.WebSocket,w=function(a,b){var c,d,e;e=[];for(d in b.prototype)try{e.push(null==a[d]&&"function"!=typeof b[d]?"function"==typeof Object.defineProperty?Object.defineProperty(a,d,{get:function(){return b.prototype[d]},configurable:!0,enumerable:!0}):a[d]=b.prototype[d]:void 0)}catch(f){c=f}return e},A=[],j.ignore=function(){var a,b,c;return b=arguments[0],a=2<=arguments.length?X.call(arguments,1):[],A.unshift("ignore"),c=b.apply(null,a),A.shift(),c},j.track=function(){var a,b,c;return b=arguments[0],a=2<=arguments.length?X.call(arguments,1):[],A.unshift("track"),c=b.apply(null,a),A.shift(),c},J=function(a){var b;if(null==a&&(a="GET"),"track"===A[0])return"force";if(!A.length&&D.ajax){if("socket"===a&&D.ajax.trackWebSockets)return!0;if(b=a.toUpperCase(),$.call(D.ajax.trackMethods,b)>=0)return!0}return!1},k=function(a){function b(){var a,c=this;b.__super__.constructor.apply(this,arguments),a=function(a){var b;return b=a.open,a.open=function(d,e){return J(d)&&c.trigger("request",{type:d,url:e,request:a}),b.apply(a,arguments)}},window.XMLHttpRequest=function(b){var c;return c=new P(b),a(c),c};try{w(window.XMLHttpRequest,P)}catch(d){}if(null!=O){window.XDomainRequest=function(){var b;return b=new O,a(b),b};try{w(window.XDomainRequest,O)}catch(d){}}if(null!=N&&D.ajax.trackWebSockets){window.WebSocket=function(a,b){var d;return d=null!=b?new N(a,b):new N(a),J("socket")&&c.trigger("request",{type:"socket",url:a,protocols:b,request:d}),d};try{w(window.WebSocket,N)}catch(d){}}}return Z(b,a),b}(h),R=null,y=function(){return null==R&&(R=new k),R},I=function(a){var b,c,d,e;for(e=D.ajax.ignoreURLs,c=0,d=e.length;d>c;c++)if(b=e[c],"string"==typeof b){if(-1!==a.indexOf(b))return!0}else if(b.test(a))return!0;return!1},y().on("request",function(b){var c,d,e,f,g;return f=b.type,e=b.request,g=b.url,I(g)?void 0:j.running||D.restartOnRequestAfter===!1&&"force"!==J(f)?void 0:(d=arguments,c=D.restartOnRequestAfter||0,"boolean"==typeof c&&(c=0),setTimeout(function(){var b,c,g,h,i,k;if(b="socket"===f?e.readyState<2:0<(h=e.readyState)&&4>h){for(j.restart(),i=j.sources,k=[],c=0,g=i.length;g>c;c++){if(K=i[c],K instanceof a){K.watch.apply(K,d);break}k.push(void 0)}return k}},c))}),a=function(){function a(){var a=this;this.elements=[],y().on("request",function(){return a.watch.apply(a,arguments)})}return a.prototype.watch=function(a){var b,c,d,e;return d=a.type,b=a.request,e=a.url,I(e)?void 0:(c="socket"===d?new n(b):new o(b),this.elements.push(c))},a}(),o=function(){function a(a){var b,c,d,e,f,g,h=this;if(this.progress=0,null!=window.ProgressEvent)for(c=null,a.addEventListener("progress",function(a){return h.progress=a.lengthComputable?100*a.loaded/a.total:h.progress+(100-h.progress)/2},!1),g=["load","abort","timeout","error"],d=0,e=g.length;e>d;d++)b=g[d],a.addEventListener(b,function(){return h.progress=100},!1);else f=a.onreadystatechange,a.onreadystatechange=function(){var b;return 0===(b=a.readyState)||4===b?h.progress=100:3===a.readyState&&(h.progress=50),"function"==typeof f?f.apply(null,arguments):void 0}}return a}(),n=function(){function a(a){var b,c,d,e,f=this;for(this.progress=0,e=["error","open"],c=0,d=e.length;d>c;c++)b=e[c],a.addEventListener(b,function(){return f.progress=100},!1)}return a}(),d=function(){function a(a){var b,c,d,f;for(null==a&&(a={}),this.elements=[],null==a.selectors&&(a.selectors=[]),f=a.selectors,c=0,d=f.length;d>c;c++)b=f[c],this.elements.push(new e(b))}return a}(),e=function(){function a(a){this.selector=a,this.progress=0,this.check()}return a.prototype.check=function(){var a=this;return document.querySelector(this.selector)?this.done():setTimeout(function(){return a.check()},D.elements.checkInterval)},a.prototype.done=function(){return this.progress=100},a}(),c=function(){function a(){var a,b,c=this;this.progress=null!=(b=this.states[document.readyState])?b:100,a=document.onreadystatechange,document.onreadystatechange=function(){return null!=c.states[document.readyState]&&(c.progress=c.states[document.readyState]),"function"==typeof a?a.apply(null,arguments):void 0}}return a.prototype.states={loading:0,interactive:50,complete:100},a}(),f=function(){function a(){var a,b,c,d,e,f=this;this.progress=0,a=0,e=[],d=0,c=C(),b=setInterval(function(){var g;return g=C()-c-50,c=C(),e.push(g),e.length>D.eventLag.sampleCount&&e.shift(),a=q(e),++d>=D.eventLag.minSamples&&a<D.eventLag.lagThreshold?(f.progress=100,clearInterval(b)):f.progress=100*(3/(a+3))},50)}return a}(),m=function(){function a(a){this.source=a,this.last=this.sinceLastUpdate=0,this.rate=D.initialRate,this.catchup=0,this.progress=this.lastProgress=0,null!=this.source&&(this.progress=F(this.source,"progress"))}return a.prototype.tick=function(a,b){var c;return null==b&&(b=F(this.source,"progress")),b>=100&&(this.done=!0),b===this.last?this.sinceLastUpdate+=a:(this.sinceLastUpdate&&(this.rate=(b-this.last)/this.sinceLastUpdate),this.catchup=(b-this.progress)/D.catchupTime,this.sinceLastUpdate=0,this.last=b),b>this.progress&&(this.progress+=this.catchup*a),c=1-Math.pow(this.progress/100,D.easeFactor),this.progress+=c*this.rate*a,this.progress=Math.min(this.lastProgress+D.maxProgressPerFrame,this.progress),this.progress=Math.max(0,this.progress),this.progress=Math.min(100,this.progress),this.lastProgress=this.progress,this.progress},a}(),L=null,H=null,r=null,M=null,p=null,s=null,j.running=!1,z=function(){return D.restartOnPushState?j.restart():void 0},null!=window.history.pushState&&(T=window.history.pushState,window.history.pushState=function(){return z(),T.apply(window.history,arguments)}),null!=window.history.replaceState&&(W=window.history.replaceState,window.history.replaceState=function(){return z(),W.apply(window.history,arguments)}),l={ajax:a,elements:d,document:c,eventLag:f},(B=function(){var a,c,d,e,f,g,h,i;for(j.sources=L=[],g=["ajax","elements","document","eventLag"],c=0,e=g.length;e>c;c++)a=g[c],D[a]!==!1&&L.push(new l[a](D[a]));for(i=null!=(h=D.extraSources)?h:[],d=0,f=i.length;f>d;d++)K=i[d],L.push(new K(D));return j.bar=r=new b,H=[],M=new m})(),j.stop=function(){return j.trigger("stop"),j.running=!1,r.destroy(),s=!0,null!=p&&("function"==typeof t&&t(p),p=null),B()},j.restart=function(){return j.trigger("restart"),j.stop(),j.start()},j.go=function(){var a;return j.running=!0,r.render(),a=C(),s=!1,p=G(function(b,c){var d,e,f,g,h,i,k,l,n,o,p,q,t,u,v,w;for(l=100-r.progress,e=p=0,f=!0,i=q=0,u=L.length;u>q;i=++q)for(K=L[i],o=null!=H[i]?H[i]:H[i]=[],h=null!=(w=K.elements)?w:[K],k=t=0,v=h.length;v>t;k=++t)g=h[k],n=null!=o[k]?o[k]:o[k]=new m(g),f&=n.done,n.done||(e++,p+=n.tick(b));return d=p/e,r.update(M.tick(b,d)),r.done()||f||s?(r.update(100),j.trigger("done"),setTimeout(function(){return r.finish(),j.running=!1,j.trigger("hide")},Math.max(D.ghostTime,Math.max(D.minTime-(C()-a),0)))):c()})},j.start=function(a){v(D,a),j.running=!0;try{r.render()}catch(b){i=b}return document.querySelector(".pace")?(j.trigger("start"),j.go()):setTimeout(j.start,50)},"function"==typeof define&&define.amd?define(["pace"],function(){return j}):"object"==typeof exports?module.exports=j:D.startOnPageLoad&&j.start()}).call(this);
//selz
!function(n){"use strict";function e(){n(document.body).on("click",o(),c),n(window).on("message",r).on("unload",function(){n.isFunction(u.onClose)&&"checkoutData"in u&&u.onClose(l.checkoutData)})}function t(n){return"undefined"==typeof n||null===n||""===n}function o(){var e="";return n.each(u.shortDomain,function(n,t){e+="a[href^='"+t+"']"+(n<u.shortDomain.length-1?",":"")}),"string"==typeof u.longDomain&&(e+=",a[href*='"+u.longDomain+"']"),e}function a(e,t){"undefined"!=typeof l.items[e.attr("href")]?i(e,l.items[e.attr("href")],t,!1):n.getJSON(u.domain+"/embed/itemdata/?itemurl="+e.attr("href")+"&callback=?",function(n){e.data("modal-url",n.Url),l.items[e.attr("href")]=n,i(e,n,t,!0)}).fail(function(){"console"in window&&console.warn("We couldn't find a matching item for that link.")})}function i(e,t,o,a){n.isFunction(o)&&o(t),n.isFunction(u.onDataReady)&&a&&u.onDataReady(e,t)}function c(e){var t=n(this),o=t.data("modal-url");e.preventDefault(),"string"==typeof o&&o.length>0?window._$elz.m.open(o,null):a(t,function(n){window._$elz.m.open(n.Url,null)}),n.isFunction(u.onModalOpen)&&u.onModalOpen(t),l.currentTrigger=t}function r(e){e=e.originalEvent;var o=e.data;if(e.origin===u.domain&&"string"==typeof o)try{var a=JSON.parse(o);switch(a.key){case"modal-theme":var i={};if(n.each(u.theme,function(e,t){switch(e){case"button":n.each(t,function(n,e){switch(n){case"bg":i.cb=e;break;case"text":i.ct=e}});break;case"checkout":n.each(t,function(n,e){switch(n){case"headerBg":i.chbg=e;break;case"headerText":i.chtx=e}})}}),e.source.postMessage(JSON.stringify({key:"modal-theme",data:Object.size(i)?i:null}),u.domain),n.isFunction(u.getTracking)){var c=u.getTracking(l.currentTrigger);t(c)||e.source.postMessage(JSON.stringify({key:"set-tracking",data:c}),u.domain)}break;case"purchase":n.isFunction(u.onPurchase)&&u.onPurchase(a.data);break;case"processing":n.isFunction(u.onProcessing)&&u.onProcessing(a.data);break;case"modal-close":n.isFunction(u.onClose)&&u.onClose(l.currentTrigger,a.data);break;case"beforeunload":l.checkoutData=a.data}}catch(r){}}function s(){n("a[href^='"+u.shortDomain+"/']").each(function(){a(n(this),null)})}window._$elz=window._$elz||{};var u={domain:"https://selz.com",shortDomain:["http://selz.co/","http://bit.ly/"],longDomain:".selz.com/item/",prefetch:!1,items:{},theme:{}},l={items:{}};Object.size=function(n){var e,t=0;for(e in n)n.hasOwnProperty(e)&&t++;return t},window._$elz.m=window._$elz.m||{s:{src:u.domain+"/assets/js/embed/modal.js"}},"undefined"==typeof window._$elz.m.open?n.getScript(window._$elz.m.s.src,function(){e()}):e(),n.selz=function(e){n.extend(!0,u,e),n.isArray(u.shortDomain)||(u.shortDomain=[u.shortDomain]),s()}}(window.jQuery);
/* == jquery mousewheel plugin == Version: 3.1.12, License: MIT License (MIT) */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});
/* == malihu jquery custom scrollbar plugin == Version: 3.0.8, License: MIT License (MIT) */
!function(e){"undefined"!=typeof module&&module.exports?module.exports=e:e(jQuery,window,document)}(function(e){!function(t){var o="function"==typeof define&&define.amd,a="undefined"!=typeof module&&module.exports,n="https:"==document.location.protocol?"https:":"http:",i="cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.12/jquery.mousewheel.min.js";o||(a?require("jquery-mousewheel")(e):e.event.special.mousewheel||e("head").append(decodeURI("%3Cscript src="+n+"//"+i+"%3E%3C/script%3E"))),t()}(function(){var t,o="mCustomScrollbar",a="mCS",n=".mCustomScrollbar",i={setTop:0,setLeft:0,axis:"y",scrollbarPosition:"inside",scrollInertia:950,autoDraggerLength:!0,alwaysShowScrollbar:0,snapOffset:0,mouseWheel:{enable:!0,scrollAmount:"auto",axis:"y",deltaFactor:"auto",disableOver:["select","option","keygen","datalist","textarea"]},scrollButtons:{scrollType:"stepless",scrollAmount:"auto"},keyboard:{enable:!0,scrollType:"stepless",scrollAmount:"auto"},contentTouchScroll:25,advanced:{autoScrollOnFocus:"input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']",updateOnContentResize:!0,updateOnImageLoad:!0},theme:"light",callbacks:{onTotalScrollOffset:0,onTotalScrollBackOffset:0,alwaysTriggerOffsets:!0}},r=0,l={},s=window.attachEvent&&!window.addEventListener?1:0,c=!1,d=["mCSB_dragger_onDrag","mCSB_scrollTools_onDrag","mCS_img_loaded","mCS_disabled","mCS_destroyed","mCS_no_scrollbar","mCS-autoHide","mCS-dir-rtl","mCS_no_scrollbar_y","mCS_no_scrollbar_x","mCS_y_hidden","mCS_x_hidden","mCSB_draggerContainer","mCSB_buttonUp","mCSB_buttonDown","mCSB_buttonLeft","mCSB_buttonRight"],u={init:function(t){var t=e.extend(!0,{},i,t),o=f.call(this);if(t.live){var s=t.liveSelector||this.selector||n,c=e(s);if("off"===t.live)return void m(s);l[s]=setTimeout(function(){c.mCustomScrollbar(t),"once"===t.live&&c.length&&m(s)},500)}else m(s);return t.setWidth=t.set_width?t.set_width:t.setWidth,t.setHeight=t.set_height?t.set_height:t.setHeight,t.axis=t.horizontalScroll?"x":p(t.axis),t.scrollInertia=t.scrollInertia>0&&t.scrollInertia<17?17:t.scrollInertia,"object"!=typeof t.mouseWheel&&1==t.mouseWheel&&(t.mouseWheel={enable:!0,scrollAmount:"auto",axis:"y",preventDefault:!1,deltaFactor:"auto",normalizeDelta:!1,invert:!1}),t.mouseWheel.scrollAmount=t.mouseWheelPixels?t.mouseWheelPixels:t.mouseWheel.scrollAmount,t.mouseWheel.normalizeDelta=t.advanced.normalizeMouseWheelDelta?t.advanced.normalizeMouseWheelDelta:t.mouseWheel.normalizeDelta,t.scrollButtons.scrollType=g(t.scrollButtons.scrollType),h(t),e(o).each(function(){var o=e(this);if(!o.data(a)){o.data(a,{idx:++r,opt:t,scrollRatio:{y:null,x:null},overflowed:null,contentReset:{y:null,x:null},bindEvents:!1,tweenRunning:!1,sequential:{},langDir:o.css("direction"),cbOffsets:null,trigger:null});var n=o.data(a),i=n.opt,l=o.data("mcs-axis"),s=o.data("mcs-scrollbar-position"),c=o.data("mcs-theme");l&&(i.axis=l),s&&(i.scrollbarPosition=s),c&&(i.theme=c,h(i)),v.call(this),e("#mCSB_"+n.idx+"_container img:not(."+d[2]+")").addClass(d[2]),u.update.call(null,o)}})},update:function(t,o){var n=t||f.call(this);return e(n).each(function(){var t=e(this);if(t.data(a)){var n=t.data(a),i=n.opt,r=e("#mCSB_"+n.idx+"_container"),l=[e("#mCSB_"+n.idx+"_dragger_vertical"),e("#mCSB_"+n.idx+"_dragger_horizontal")];if(!r.length)return;n.tweenRunning&&V(t),t.hasClass(d[3])&&t.removeClass(d[3]),t.hasClass(d[4])&&t.removeClass(d[4]),S.call(this),_.call(this),"y"===i.axis||i.advanced.autoExpandHorizontalScroll||r.css("width",x(r.children())),n.overflowed=B.call(this),O.call(this),i.autoDraggerLength&&b.call(this),C.call(this),k.call(this);var s=[Math.abs(r[0].offsetTop),Math.abs(r[0].offsetLeft)];"x"!==i.axis&&(n.overflowed[0]?l[0].height()>l[0].parent().height()?T.call(this):(Q(t,s[0].toString(),{dir:"y",dur:0,overwrite:"none"}),n.contentReset.y=null):(T.call(this),"y"===i.axis?M.call(this):"yx"===i.axis&&n.overflowed[1]&&Q(t,s[1].toString(),{dir:"x",dur:0,overwrite:"none"}))),"y"!==i.axis&&(n.overflowed[1]?l[1].width()>l[1].parent().width()?T.call(this):(Q(t,s[1].toString(),{dir:"x",dur:0,overwrite:"none"}),n.contentReset.x=null):(T.call(this),"x"===i.axis?M.call(this):"yx"===i.axis&&n.overflowed[0]&&Q(t,s[0].toString(),{dir:"y",dur:0,overwrite:"none"}))),o&&n&&(2===o&&i.callbacks.onImageLoad&&"function"==typeof i.callbacks.onImageLoad?i.callbacks.onImageLoad.call(this):3===o&&i.callbacks.onSelectorChange&&"function"==typeof i.callbacks.onSelectorChange?i.callbacks.onSelectorChange.call(this):i.callbacks.onUpdate&&"function"==typeof i.callbacks.onUpdate&&i.callbacks.onUpdate.call(this)),X.call(this)}})},scrollTo:function(t,o){if("undefined"!=typeof t&&null!=t){var n=f.call(this);return e(n).each(function(){var n=e(this);if(n.data(a)){var i=n.data(a),r=i.opt,l={trigger:"external",scrollInertia:r.scrollInertia,scrollEasing:"mcsEaseInOut",moveDragger:!1,timeout:60,callbacks:!0,onStart:!0,onUpdate:!0,onComplete:!0},s=e.extend(!0,{},l,o),c=Y.call(this,t),d=s.scrollInertia>0&&s.scrollInertia<17?17:s.scrollInertia;c[0]=j.call(this,c[0],"y"),c[1]=j.call(this,c[1],"x"),s.moveDragger&&(c[0]*=i.scrollRatio.y,c[1]*=i.scrollRatio.x),s.dur=d,setTimeout(function(){null!==c[0]&&"undefined"!=typeof c[0]&&"x"!==r.axis&&i.overflowed[0]&&(s.dir="y",s.overwrite="all",Q(n,c[0].toString(),s)),null!==c[1]&&"undefined"!=typeof c[1]&&"y"!==r.axis&&i.overflowed[1]&&(s.dir="x",s.overwrite="none",Q(n,c[1].toString(),s))},s.timeout)}})}},stop:function(){var t=f.call(this);return e(t).each(function(){var t=e(this);t.data(a)&&V(t)})},disable:function(t){var o=f.call(this);return e(o).each(function(){var o=e(this);if(o.data(a)){{o.data(a)}X.call(this,"remove"),M.call(this),t&&T.call(this),O.call(this,!0),o.addClass(d[3])}})},destroy:function(){var t=f.call(this);return e(t).each(function(){var n=e(this);if(n.data(a)){var i=n.data(a),r=i.opt,l=e("#mCSB_"+i.idx),s=e("#mCSB_"+i.idx+"_container"),c=e(".mCSB_"+i.idx+"_scrollbar");r.live&&m(r.liveSelector||e(t).selector),X.call(this,"remove"),M.call(this),T.call(this),n.removeData(a),Z(this,"mcs"),c.remove(),s.find("img."+d[2]).removeClass(d[2]),l.replaceWith(s.contents()),n.removeClass(o+" _"+a+"_"+i.idx+" "+d[6]+" "+d[7]+" "+d[5]+" "+d[3]).addClass(d[4])}})}},f=function(){return"object"!=typeof e(this)||e(this).length<1?n:this},h=function(t){var o=["rounded","rounded-dark","rounded-dots","rounded-dots-dark"],a=["rounded-dots","rounded-dots-dark","3d","3d-dark","3d-thick","3d-thick-dark","inset","inset-dark","inset-2","inset-2-dark","inset-3","inset-3-dark"],n=["minimal","minimal-dark"],i=["minimal","minimal-dark"],r=["minimal","minimal-dark"];t.autoDraggerLength=e.inArray(t.theme,o)>-1?!1:t.autoDraggerLength,t.autoExpandScrollbar=e.inArray(t.theme,a)>-1?!1:t.autoExpandScrollbar,t.scrollButtons.enable=e.inArray(t.theme,n)>-1?!1:t.scrollButtons.enable,t.autoHideScrollbar=e.inArray(t.theme,i)>-1?!0:t.autoHideScrollbar,t.scrollbarPosition=e.inArray(t.theme,r)>-1?"outside":t.scrollbarPosition},m=function(e){l[e]&&(clearTimeout(l[e]),Z(l,e))},p=function(e){return"yx"===e||"xy"===e||"auto"===e?"yx":"x"===e||"horizontal"===e?"x":"y"},g=function(e){return"stepped"===e||"pixels"===e||"step"===e||"click"===e?"stepped":"stepless"},v=function(){var t=e(this),n=t.data(a),i=n.opt,r=i.autoExpandScrollbar?" "+d[1]+"_expand":"",l=["<div id='mCSB_"+n.idx+"_scrollbar_vertical' class='mCSB_scrollTools mCSB_"+n.idx+"_scrollbar mCS-"+i.theme+" mCSB_scrollTools_vertical"+r+"'><div class='"+d[12]+"'><div id='mCSB_"+n.idx+"_dragger_vertical' class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>","<div id='mCSB_"+n.idx+"_scrollbar_horizontal' class='mCSB_scrollTools mCSB_"+n.idx+"_scrollbar mCS-"+i.theme+" mCSB_scrollTools_horizontal"+r+"'><div class='"+d[12]+"'><div id='mCSB_"+n.idx+"_dragger_horizontal' class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>"],s="yx"===i.axis?"mCSB_vertical_horizontal":"x"===i.axis?"mCSB_horizontal":"mCSB_vertical",c="yx"===i.axis?l[0]+l[1]:"x"===i.axis?l[1]:l[0],u="yx"===i.axis?"<div id='mCSB_"+n.idx+"_container_wrapper' class='mCSB_container_wrapper' />":"",f=i.autoHideScrollbar?" "+d[6]:"",h="x"!==i.axis&&"rtl"===n.langDir?" "+d[7]:"";i.setWidth&&t.css("width",i.setWidth),i.setHeight&&t.css("height",i.setHeight),i.setLeft="y"!==i.axis&&"rtl"===n.langDir?"989999px":i.setLeft,t.addClass(o+" _"+a+"_"+n.idx+f+h).wrapInner("<div id='mCSB_"+n.idx+"' class='mCustomScrollBox mCS-"+i.theme+" "+s+"'><div id='mCSB_"+n.idx+"_container' class='mCSB_container' style='position:relative; top:"+i.setTop+"; left:"+i.setLeft+";' dir="+n.langDir+" /></div>");var m=e("#mCSB_"+n.idx),p=e("#mCSB_"+n.idx+"_container");"y"===i.axis||i.advanced.autoExpandHorizontalScroll||p.css("width",x(p.children())),"outside"===i.scrollbarPosition?("static"===t.css("position")&&t.css("position","relative"),t.css("overflow","visible"),m.addClass("mCSB_outside").after(c)):(m.addClass("mCSB_inside").append(c),p.wrap(u)),w.call(this);var g=[e("#mCSB_"+n.idx+"_dragger_vertical"),e("#mCSB_"+n.idx+"_dragger_horizontal")];g[0].css("min-height",g[0].height()),g[1].css("min-width",g[1].width())},x=function(t){return Math.max.apply(Math,t.map(function(){return e(this).outerWidth(!0)}).get())},_=function(){var t=e(this),o=t.data(a),n=o.opt,i=e("#mCSB_"+o.idx+"_container");n.advanced.autoExpandHorizontalScroll&&"y"!==n.axis&&i.css({position:"absolute",width:"auto"}).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({width:Math.ceil(i[0].getBoundingClientRect().right+.4)-Math.floor(i[0].getBoundingClientRect().left),position:"relative"}).unwrap()},w=function(){var t=e(this),o=t.data(a),n=o.opt,i=e(".mCSB_"+o.idx+"_scrollbar:first"),r=tt(n.scrollButtons.tabindex)?"tabindex='"+n.scrollButtons.tabindex+"'":"",l=["<a href='#' class='"+d[13]+"' oncontextmenu='return false;' "+r+" />","<a href='#' class='"+d[14]+"' oncontextmenu='return false;' "+r+" />","<a href='#' class='"+d[15]+"' oncontextmenu='return false;' "+r+" />","<a href='#' class='"+d[16]+"' oncontextmenu='return false;' "+r+" />"],s=["x"===n.axis?l[2]:l[0],"x"===n.axis?l[3]:l[1],l[2],l[3]];n.scrollButtons.enable&&i.prepend(s[0]).append(s[1]).next(".mCSB_scrollTools").prepend(s[2]).append(s[3])},S=function(){var t=e(this),o=t.data(a),n=e("#mCSB_"+o.idx),i=t.css("max-height")||"none",r=-1!==i.indexOf("%"),l=t.css("box-sizing");if("none"!==i){var s=r?t.parent().height()*parseInt(i)/100:parseInt(i);"border-box"===l&&(s-=t.innerHeight()-t.height()+(t.outerHeight()-t.innerHeight())),n.css("max-height",Math.round(s))}},b=function(){var t=e(this),o=t.data(a),n=e("#mCSB_"+o.idx),i=e("#mCSB_"+o.idx+"_container"),r=[e("#mCSB_"+o.idx+"_dragger_vertical"),e("#mCSB_"+o.idx+"_dragger_horizontal")],l=[n.height()/i.outerHeight(!1),n.width()/i.outerWidth(!1)],c=[parseInt(r[0].css("min-height")),Math.round(l[0]*r[0].parent().height()),parseInt(r[1].css("min-width")),Math.round(l[1]*r[1].parent().width())],d=s&&c[1]<c[0]?c[0]:c[1],u=s&&c[3]<c[2]?c[2]:c[3];r[0].css({height:d,"max-height":r[0].parent().height()-10}).find(".mCSB_dragger_bar").css({"line-height":c[0]+"px"}),r[1].css({width:u,"max-width":r[1].parent().width()-10})},C=function(){var t=e(this),o=t.data(a),n=e("#mCSB_"+o.idx),i=e("#mCSB_"+o.idx+"_container"),r=[e("#mCSB_"+o.idx+"_dragger_vertical"),e("#mCSB_"+o.idx+"_dragger_horizontal")],l=[i.outerHeight(!1)-n.height(),i.outerWidth(!1)-n.width()],s=[l[0]/(r[0].parent().height()-r[0].height()),l[1]/(r[1].parent().width()-r[1].width())];o.scrollRatio={y:s[0],x:s[1]}},y=function(e,t,o){var a=o?d[0]+"_expanded":"",n=e.closest(".mCSB_scrollTools");"active"===t?(e.toggleClass(d[0]+" "+a),n.toggleClass(d[1]),e[0]._draggable=e[0]._draggable?0:1):e[0]._draggable||("hide"===t?(e.removeClass(d[0]),n.removeClass(d[1])):(e.addClass(d[0]),n.addClass(d[1])))},B=function(){var t=e(this),o=t.data(a),n=e("#mCSB_"+o.idx),i=e("#mCSB_"+o.idx+"_container"),r=null==o.overflowed?i.height():i.outerHeight(!1),l=null==o.overflowed?i.width():i.outerWidth(!1);return[r>n.height(),l>n.width()]},T=function(){var t=e(this),o=t.data(a),n=o.opt,i=e("#mCSB_"+o.idx),r=e("#mCSB_"+o.idx+"_container"),l=[e("#mCSB_"+o.idx+"_dragger_vertical"),e("#mCSB_"+o.idx+"_dragger_horizontal")];if(V(t),("x"!==n.axis&&!o.overflowed[0]||"y"===n.axis&&o.overflowed[0])&&(l[0].add(r).css("top",0),Q(t,"_resetY")),"y"!==n.axis&&!o.overflowed[1]||"x"===n.axis&&o.overflowed[1]){var s=dx=0;"rtl"===o.langDir&&(s=i.width()-r.outerWidth(!1),dx=Math.abs(s/o.scrollRatio.x)),r.css("left",s),l[1].css("left",dx),Q(t,"_resetX")}},k=function(){function t(){r=setTimeout(function(){e.event.special.mousewheel?(clearTimeout(r),W.call(o[0])):t()},100)}var o=e(this),n=o.data(a),i=n.opt;if(!n.bindEvents){if(R.call(this),i.contentTouchScroll&&E.call(this),D.call(this),i.mouseWheel.enable){var r;t()}P.call(this),H.call(this),i.advanced.autoScrollOnFocus&&z.call(this),i.scrollButtons.enable&&U.call(this),i.keyboard.enable&&q.call(this),n.bindEvents=!0}},M=function(){var t=e(this),o=t.data(a),n=o.opt,i=a+"_"+o.idx,r=".mCSB_"+o.idx+"_scrollbar",l=e("#mCSB_"+o.idx+",#mCSB_"+o.idx+"_container,#mCSB_"+o.idx+"_container_wrapper,"+r+" ."+d[12]+",#mCSB_"+o.idx+"_dragger_vertical,#mCSB_"+o.idx+"_dragger_horizontal,"+r+">a"),s=e("#mCSB_"+o.idx+"_container");n.advanced.releaseDraggableSelectors&&l.add(e(n.advanced.releaseDraggableSelectors)),o.bindEvents&&(e(document).unbind("."+i),l.each(function(){e(this).unbind("."+i)}),clearTimeout(t[0]._focusTimeout),Z(t[0],"_focusTimeout"),clearTimeout(o.sequential.step),Z(o.sequential,"step"),clearTimeout(s[0].onCompleteTimeout),Z(s[0],"onCompleteTimeout"),o.bindEvents=!1)},O=function(t){var o=e(this),n=o.data(a),i=n.opt,r=e("#mCSB_"+n.idx+"_container_wrapper"),l=r.length?r:e("#mCSB_"+n.idx+"_container"),s=[e("#mCSB_"+n.idx+"_scrollbar_vertical"),e("#mCSB_"+n.idx+"_scrollbar_horizontal")],c=[s[0].find(".mCSB_dragger"),s[1].find(".mCSB_dragger")];"x"!==i.axis&&(n.overflowed[0]&&!t?(s[0].add(c[0]).add(s[0].children("a")).css("display","block"),l.removeClass(d[8]+" "+d[10])):(i.alwaysShowScrollbar?(2!==i.alwaysShowScrollbar&&c[0].css("display","none"),l.removeClass(d[10])):(s[0].css("display","none"),l.addClass(d[10])),l.addClass(d[8]))),"y"!==i.axis&&(n.overflowed[1]&&!t?(s[1].add(c[1]).add(s[1].children("a")).css("display","block"),l.removeClass(d[9]+" "+d[11])):(i.alwaysShowScrollbar?(2!==i.alwaysShowScrollbar&&c[1].css("display","none"),l.removeClass(d[11])):(s[1].css("display","none"),l.addClass(d[11])),l.addClass(d[9]))),n.overflowed[0]||n.overflowed[1]?o.removeClass(d[5]):o.addClass(d[5])},I=function(e){var t=e.type;switch(t){case"pointerdown":case"MSPointerDown":case"pointermove":case"MSPointerMove":case"pointerup":case"MSPointerUp":return e.target.ownerDocument!==document?[e.originalEvent.screenY,e.originalEvent.screenX,!1]:[e.originalEvent.pageY,e.originalEvent.pageX,!1];case"touchstart":case"touchmove":case"touchend":var o=e.originalEvent.touches[0]||e.originalEvent.changedTouches[0],a=e.originalEvent.touches.length||e.originalEvent.changedTouches.length;return e.target.ownerDocument!==document?[o.screenY,o.screenX,a>1]:[o.pageY,o.pageX,a>1];default:return[e.pageY,e.pageX,!1]}},R=function(){function t(e){var t=m.find("iframe");if(t.length){var o=e?"auto":"none";t.css("pointer-events",o)}}function o(e,t,o,a){if(m[0].idleTimer=u.scrollInertia<233?250:0,n.attr("id")===h[1])var i="x",r=(n[0].offsetLeft-t+a)*d.scrollRatio.x;else var i="y",r=(n[0].offsetTop-e+o)*d.scrollRatio.y;Q(l,r.toString(),{dir:i,drag:!0})}var n,i,r,l=e(this),d=l.data(a),u=d.opt,f=a+"_"+d.idx,h=["mCSB_"+d.idx+"_dragger_vertical","mCSB_"+d.idx+"_dragger_horizontal"],m=e("#mCSB_"+d.idx+"_container"),p=e("#"+h[0]+",#"+h[1]),g=u.advanced.releaseDraggableSelectors?p.add(e(u.advanced.releaseDraggableSelectors)):p;p.bind("mousedown."+f+" touchstart."+f+" pointerdown."+f+" MSPointerDown."+f,function(o){if(o.stopImmediatePropagation(),o.preventDefault(),$(o)){c=!0,s&&(document.onselectstart=function(){return!1}),t(!1),V(l),n=e(this);var a=n.offset(),d=I(o)[0]-a.top,f=I(o)[1]-a.left,h=n.height()+a.top,m=n.width()+a.left;h>d&&d>0&&m>f&&f>0&&(i=d,r=f),y(n,"active",u.autoExpandScrollbar)}}).bind("touchmove."+f,function(e){e.stopImmediatePropagation(),e.preventDefault();var t=n.offset(),a=I(e)[0]-t.top,l=I(e)[1]-t.left;o(i,r,a,l)}),e(document).bind("mousemove."+f+" pointermove."+f+" MSPointerMove."+f,function(e){if(n){var t=n.offset(),a=I(e)[0]-t.top,l=I(e)[1]-t.left;if(i===a)return;o(i,r,a,l)}}).add(g).bind("mouseup."+f+" touchend."+f+" pointerup."+f+" MSPointerUp."+f,function(){n&&(y(n,"active",u.autoExpandScrollbar),n=null),c=!1,s&&(document.onselectstart=null),t(!0)})},E=function(){function o(e){if(!et(e)||c||I(e)[2])return void(t=0);t=1,S=0,b=0;var o=M.offset();d=I(e)[0]-o.top,u=I(e)[1]-o.left,A=[I(e)[0],I(e)[1]]}function n(e){if(et(e)&&!c&&!I(e)[2]&&(e.stopImmediatePropagation(),!b||S)){p=J();var t=k.offset(),o=I(e)[0]-t.top,a=I(e)[1]-t.left,n="mcsLinearOut";if(R.push(o),E.push(a),A[2]=Math.abs(I(e)[0]-A[0]),A[3]=Math.abs(I(e)[1]-A[1]),y.overflowed[0])var i=O[0].parent().height()-O[0].height(),r=d-o>0&&o-d>-(i*y.scrollRatio.y)&&(2*A[3]<A[2]||"yx"===B.axis);if(y.overflowed[1])var l=O[1].parent().width()-O[1].width(),f=u-a>0&&a-u>-(l*y.scrollRatio.x)&&(2*A[2]<A[3]||"yx"===B.axis);r||f?(e.preventDefault(),S=1):b=1,_="yx"===B.axis?[d-o,u-a]:"x"===B.axis?[null,u-a]:[d-o,null],M[0].idleTimer=250,y.overflowed[0]&&s(_[0],D,n,"y","all",!0),y.overflowed[1]&&s(_[1],D,n,"x",W,!0)}}function i(e){if(!et(e)||c||I(e)[2])return void(t=0);t=1,e.stopImmediatePropagation(),V(C),m=J();var o=k.offset();f=I(e)[0]-o.top,h=I(e)[1]-o.left,R=[],E=[]}function r(e){if(et(e)&&!c&&!I(e)[2]){e.stopImmediatePropagation(),S=0,b=0,g=J();var t=k.offset(),o=I(e)[0]-t.top,a=I(e)[1]-t.left;if(!(g-p>30)){x=1e3/(g-m);var n="mcsEaseOut",i=2.5>x,r=i?[R[R.length-2],E[E.length-2]]:[0,0];v=i?[o-r[0],a-r[1]]:[o-f,a-h];var d=[Math.abs(v[0]),Math.abs(v[1])];x=i?[Math.abs(v[0]/4),Math.abs(v[1]/4)]:[x,x];var u=[Math.abs(M[0].offsetTop)-v[0]*l(d[0]/x[0],x[0]),Math.abs(M[0].offsetLeft)-v[1]*l(d[1]/x[1],x[1])];_="yx"===B.axis?[u[0],u[1]]:"x"===B.axis?[null,u[1]]:[u[0],null],w=[4*d[0]+B.scrollInertia,4*d[1]+B.scrollInertia];var C=parseInt(B.contentTouchScroll)||0;_[0]=d[0]>C?_[0]:0,_[1]=d[1]>C?_[1]:0,y.overflowed[0]&&s(_[0],w[0],n,"y",W,!1),y.overflowed[1]&&s(_[1],w[1],n,"x",W,!1)}}}function l(e,t){var o=[1.5*t,2*t,t/1.5,t/2];return e>90?t>4?o[0]:o[3]:e>60?t>3?o[3]:o[2]:e>30?t>8?o[1]:t>6?o[0]:t>4?t:o[2]:t>8?t:o[3]}function s(e,t,o,a,n,i){e&&Q(C,e.toString(),{dur:t,scrollEasing:o,dir:a,overwrite:n,drag:i})}var d,u,f,h,m,p,g,v,x,_,w,S,b,C=e(this),y=C.data(a),B=y.opt,T=a+"_"+y.idx,k=e("#mCSB_"+y.idx),M=e("#mCSB_"+y.idx+"_container"),O=[e("#mCSB_"+y.idx+"_dragger_vertical"),e("#mCSB_"+y.idx+"_dragger_horizontal")],R=[],E=[],D=0,W="yx"===B.axis?"none":"all",A=[],P=M.find("iframe"),z=["touchstart."+T+" pointerdown."+T+" MSPointerDown."+T,"touchmove."+T+" pointermove."+T+" MSPointerMove."+T,"touchend."+T+" pointerup."+T+" MSPointerUp."+T];M.bind(z[0],function(e){o(e)}).bind(z[1],function(e){n(e)}),k.bind(z[0],function(e){i(e)}).bind(z[2],function(e){r(e)}),P.length&&P.each(function(){e(this).load(function(){L(this)&&e(this.contentDocument||this.contentWindow.document).bind(z[0],function(e){o(e),i(e)}).bind(z[1],function(e){n(e)}).bind(z[2],function(e){r(e)})})})},D=function(){function o(){return window.getSelection?window.getSelection().toString():document.selection&&"Control"!=document.selection.type?document.selection.createRange().text:0}function n(e,t,o){d.type=o&&i?"stepped":"stepless",d.scrollAmount=10,F(r,e,t,"mcsLinearOut",o?60:null)}var i,r=e(this),l=r.data(a),s=l.opt,d=l.sequential,u=a+"_"+l.idx,f=e("#mCSB_"+l.idx+"_container"),h=f.parent();f.bind("mousedown."+u,function(){t||i||(i=1,c=!0)}).add(document).bind("mousemove."+u,function(e){if(!t&&i&&o()){var a=f.offset(),r=I(e)[0]-a.top+f[0].offsetTop,c=I(e)[1]-a.left+f[0].offsetLeft;r>0&&r<h.height()&&c>0&&c<h.width()?d.step&&n("off",null,"stepped"):("x"!==s.axis&&l.overflowed[0]&&(0>r?n("on",38):r>h.height()&&n("on",40)),"y"!==s.axis&&l.overflowed[1]&&(0>c?n("on",37):c>h.width()&&n("on",39)))}}).bind("mouseup."+u,function(){t||(i&&(i=0,n("off",null)),c=!1)})},W=function(){function t(t,a){if(V(o),!A(o,t.target)){var r="auto"!==i.mouseWheel.deltaFactor?parseInt(i.mouseWheel.deltaFactor):s&&t.deltaFactor<100?100:t.deltaFactor||100;if("x"===i.axis||"x"===i.mouseWheel.axis)var d="x",u=[Math.round(r*n.scrollRatio.x),parseInt(i.mouseWheel.scrollAmount)],f="auto"!==i.mouseWheel.scrollAmount?u[1]:u[0]>=l.width()?.9*l.width():u[0],h=Math.abs(e("#mCSB_"+n.idx+"_container")[0].offsetLeft),m=c[1][0].offsetLeft,p=c[1].parent().width()-c[1].width(),g=t.deltaX||t.deltaY||a;else var d="y",u=[Math.round(r*n.scrollRatio.y),parseInt(i.mouseWheel.scrollAmount)],f="auto"!==i.mouseWheel.scrollAmount?u[1]:u[0]>=l.height()?.9*l.height():u[0],h=Math.abs(e("#mCSB_"+n.idx+"_container")[0].offsetTop),m=c[0][0].offsetTop,p=c[0].parent().height()-c[0].height(),g=t.deltaY||a;"y"===d&&!n.overflowed[0]||"x"===d&&!n.overflowed[1]||(i.mouseWheel.invert&&(g=-g),i.mouseWheel.normalizeDelta&&(g=0>g?-1:1),(g>0&&0!==m||0>g&&m!==p||i.mouseWheel.preventDefault)&&(t.stopImmediatePropagation(),t.preventDefault()),Q(o,(h-g*f).toString(),{dir:d}))}}var o=e(this),n=o.data(a),i=n.opt,r=a+"_"+n.idx,l=e("#mCSB_"+n.idx),c=[e("#mCSB_"+n.idx+"_dragger_vertical"),e("#mCSB_"+n.idx+"_dragger_horizontal")],d=e("#mCSB_"+n.idx+"_container").find("iframe");n&&(d.length&&d.each(function(){e(this).load(function(){L(this)&&e(this.contentDocument||this.contentWindow.document).bind("mousewheel."+r,function(e,o){t(e,o)})})}),l.bind("mousewheel."+r,function(e,o){t(e,o)}))},L=function(e){var t=null;try{var o=e.contentDocument||e.contentWindow.document;t=o.body.innerHTML}catch(a){}return null!==t},A=function(t,o){var n=o.nodeName.toLowerCase(),i=t.data(a).opt.mouseWheel.disableOver,r=["select","textarea"];return e.inArray(n,i)>-1&&!(e.inArray(n,r)>-1&&!e(o).is(":focus"))},P=function(){var t=e(this),o=t.data(a),n=a+"_"+o.idx,i=e("#mCSB_"+o.idx+"_container"),r=i.parent(),l=e(".mCSB_"+o.idx+"_scrollbar ."+d[12]);l.bind("touchstart."+n+" pointerdown."+n+" MSPointerDown."+n,function(){c=!0}).bind("touchend."+n+" pointerup."+n+" MSPointerUp."+n,function(){c=!1}).bind("click."+n,function(a){if(e(a.target).hasClass(d[12])||e(a.target).hasClass("mCSB_draggerRail")){V(t);var n=e(this),l=n.find(".mCSB_dragger");if(n.parent(".mCSB_scrollTools_horizontal").length>0){if(!o.overflowed[1])return;var s="x",c=a.pageX>l.offset().left?-1:1,u=Math.abs(i[0].offsetLeft)-.9*c*r.width()}else{if(!o.overflowed[0])return;var s="y",c=a.pageY>l.offset().top?-1:1,u=Math.abs(i[0].offsetTop)-.9*c*r.height()}Q(t,u.toString(),{dir:s,scrollEasing:"mcsEaseInOut"})}})},z=function(){var t=e(this),o=t.data(a),n=o.opt,i=a+"_"+o.idx,r=e("#mCSB_"+o.idx+"_container"),l=r.parent();r.bind("focusin."+i,function(){var o=e(document.activeElement),a=r.find(".mCustomScrollBox").length,i=0;o.is(n.advanced.autoScrollOnFocus)&&(V(t),clearTimeout(t[0]._focusTimeout),t[0]._focusTimer=a?(i+17)*a:0,t[0]._focusTimeout=setTimeout(function(){var e=[ot(o)[0],ot(o)[1]],a=[r[0].offsetTop,r[0].offsetLeft],s=[a[0]+e[0]>=0&&a[0]+e[0]<l.height()-o.outerHeight(!1),a[1]+e[1]>=0&&a[0]+e[1]<l.width()-o.outerWidth(!1)],c="yx"!==n.axis||s[0]||s[1]?"all":"none";"x"===n.axis||s[0]||Q(t,e[0].toString(),{dir:"y",scrollEasing:"mcsEaseInOut",overwrite:c,dur:i}),"y"===n.axis||s[1]||Q(t,e[1].toString(),{dir:"x",scrollEasing:"mcsEaseInOut",overwrite:c,dur:i})},t[0]._focusTimer))})},H=function(){var t=e(this),o=t.data(a),n=a+"_"+o.idx,i=e("#mCSB_"+o.idx+"_container").parent();i.bind("scroll."+n,function(){(0!==i.scrollTop()||0!==i.scrollLeft())&&e(".mCSB_"+o.idx+"_scrollbar").css("visibility","hidden")})},U=function(){var t=e(this),o=t.data(a),n=o.opt,i=o.sequential,r=a+"_"+o.idx,l=".mCSB_"+o.idx+"_scrollbar",s=e(l+">a");s.bind("mousedown."+r+" touchstart."+r+" pointerdown."+r+" MSPointerDown."+r+" mouseup."+r+" touchend."+r+" pointerup."+r+" MSPointerUp."+r+" mouseout."+r+" pointerout."+r+" MSPointerOut."+r+" click."+r,function(a){function r(e,o){i.scrollAmount=n.snapAmount||n.scrollButtons.scrollAmount,F(t,e,o)}if(a.preventDefault(),$(a)){var l=e(this).attr("class");switch(i.type=n.scrollButtons.scrollType,a.type){case"mousedown":case"touchstart":case"pointerdown":case"MSPointerDown":if("stepped"===i.type)return;c=!0,o.tweenRunning=!1,r("on",l);break;case"mouseup":case"touchend":case"pointerup":case"MSPointerUp":case"mouseout":case"pointerout":case"MSPointerOut":if("stepped"===i.type)return;c=!1,i.dir&&r("off",l);break;case"click":if("stepped"!==i.type||o.tweenRunning)return;r("on",l)}}})},q=function(){function t(t){function a(e,t){r.type=i.keyboard.scrollType,r.scrollAmount=i.snapAmount||i.keyboard.scrollAmount,"stepped"===r.type&&n.tweenRunning||F(o,e,t)}switch(t.type){case"blur":n.tweenRunning&&r.dir&&a("off",null);break;case"keydown":case"keyup":var l=t.keyCode?t.keyCode:t.which,s="on";if("x"!==i.axis&&(38===l||40===l)||"y"!==i.axis&&(37===l||39===l)){if((38===l||40===l)&&!n.overflowed[0]||(37===l||39===l)&&!n.overflowed[1])return;"keyup"===t.type&&(s="off"),e(document.activeElement).is(u)||(t.preventDefault(),t.stopImmediatePropagation(),a(s,l))}else if(33===l||34===l){if((n.overflowed[0]||n.overflowed[1])&&(t.preventDefault(),t.stopImmediatePropagation()),"keyup"===t.type){V(o);var f=34===l?-1:1;if("x"===i.axis||"yx"===i.axis&&n.overflowed[1]&&!n.overflowed[0])var h="x",m=Math.abs(c[0].offsetLeft)-.9*f*d.width();else var h="y",m=Math.abs(c[0].offsetTop)-.9*f*d.height();Q(o,m.toString(),{dir:h,scrollEasing:"mcsEaseInOut"})}}else if((35===l||36===l)&&!e(document.activeElement).is(u)&&((n.overflowed[0]||n.overflowed[1])&&(t.preventDefault(),t.stopImmediatePropagation()),"keyup"===t.type)){if("x"===i.axis||"yx"===i.axis&&n.overflowed[1]&&!n.overflowed[0])var h="x",m=35===l?Math.abs(d.width()-c.outerWidth(!1)):0;else var h="y",m=35===l?Math.abs(d.height()-c.outerHeight(!1)):0;Q(o,m.toString(),{dir:h,scrollEasing:"mcsEaseInOut"})}}}var o=e(this),n=o.data(a),i=n.opt,r=n.sequential,l=a+"_"+n.idx,s=e("#mCSB_"+n.idx),c=e("#mCSB_"+n.idx+"_container"),d=c.parent(),u="input,textarea,select,datalist,keygen,[contenteditable='true']",f=c.find("iframe"),h=["blur."+l+" keydown."+l+" keyup."+l];f.length&&f.each(function(){e(this).load(function(){L(this)&&e(this.contentDocument||this.contentWindow.document).bind(h[0],function(e){t(e)})})}),s.attr("tabindex","0").bind(h[0],function(e){t(e)})},F=function(t,o,n,i,r){function l(e){var o="stepped"!==f.type,a=r?r:e?o?p/1.5:g:1e3/60,n=e?o?7.5:40:2.5,s=[Math.abs(h[0].offsetTop),Math.abs(h[0].offsetLeft)],d=[c.scrollRatio.y>10?10:c.scrollRatio.y,c.scrollRatio.x>10?10:c.scrollRatio.x],u="x"===f.dir[0]?s[1]+f.dir[1]*d[1]*n:s[0]+f.dir[1]*d[0]*n,m="x"===f.dir[0]?s[1]+f.dir[1]*parseInt(f.scrollAmount):s[0]+f.dir[1]*parseInt(f.scrollAmount),v="auto"!==f.scrollAmount?m:u,x=i?i:e?o?"mcsLinearOut":"mcsEaseInOut":"mcsLinear",_=e?!0:!1;return e&&17>a&&(v="x"===f.dir[0]?s[1]:s[0]),Q(t,v.toString(),{dir:f.dir[0],scrollEasing:x,dur:a,onComplete:_}),e?void(f.dir=!1):(clearTimeout(f.step),void(f.step=setTimeout(function(){l()},a)))}function s(){clearTimeout(f.step),Z(f,"step"),V(t)}var c=t.data(a),u=c.opt,f=c.sequential,h=e("#mCSB_"+c.idx+"_container"),m="stepped"===f.type?!0:!1,p=u.scrollInertia<26?26:u.scrollInertia,g=u.scrollInertia<1?17:u.scrollInertia;switch(o){case"on":if(f.dir=[n===d[16]||n===d[15]||39===n||37===n?"x":"y",n===d[13]||n===d[15]||38===n||37===n?-1:1],V(t),tt(n)&&"stepped"===f.type)return;l(m);break;case"off":s(),(m||c.tweenRunning&&f.dir)&&l(!0)}},Y=function(t){var o=e(this).data(a).opt,n=[];return"function"==typeof t&&(t=t()),t instanceof Array?n=t.length>1?[t[0],t[1]]:"x"===o.axis?[null,t[0]]:[t[0],null]:(n[0]=t.y?t.y:t.x||"x"===o.axis?null:t,n[1]=t.x?t.x:t.y||"y"===o.axis?null:t),"function"==typeof n[0]&&(n[0]=n[0]()),"function"==typeof n[1]&&(n[1]=n[1]()),n},j=function(t,o){if(null!=t&&"undefined"!=typeof t){var n=e(this),i=n.data(a),r=i.opt,l=e("#mCSB_"+i.idx+"_container"),s=l.parent(),c=typeof t;o||(o="x"===r.axis?"x":"y");var d="x"===o?l.outerWidth(!1):l.outerHeight(!1),f="x"===o?l[0].offsetLeft:l[0].offsetTop,h="x"===o?"left":"top";switch(c){case"function":return t();case"object":var m=t.jquery?t:e(t);if(!m.length)return;return"x"===o?ot(m)[1]:ot(m)[0];case"string":case"number":if(tt(t))return Math.abs(t);if(-1!==t.indexOf("%"))return Math.abs(d*parseInt(t)/100);if(-1!==t.indexOf("-="))return Math.abs(f-parseInt(t.split("-=")[1]));if(-1!==t.indexOf("+=")){var p=f+parseInt(t.split("+=")[1]);return p>=0?0:Math.abs(p)}if(-1!==t.indexOf("px")&&tt(t.split("px")[0]))return Math.abs(t.split("px")[0]);if("top"===t||"left"===t)return 0;if("bottom"===t)return Math.abs(s.height()-l.outerHeight(!1));if("right"===t)return Math.abs(s.width()-l.outerWidth(!1));if("first"===t||"last"===t){var m=l.find(":"+t);return"x"===o?ot(m)[1]:ot(m)[0]}return e(t).length?"x"===o?ot(e(t))[1]:ot(e(t))[0]:(l.css(h,t),void u.update.call(null,n[0]))}}},X=function(t){function o(){clearTimeout(h[0].autoUpdate),h[0].autoUpdate=setTimeout(function(){return f.advanced.updateOnSelectorChange&&(m=r(),m!==w)?(l(3),void(w=m)):(f.advanced.updateOnContentResize&&(p=[h.outerHeight(!1),h.outerWidth(!1),v.height(),v.width(),_()[0],_()[1]],(p[0]!==S[0]||p[1]!==S[1]||p[2]!==S[2]||p[3]!==S[3]||p[4]!==S[4]||p[5]!==S[5])&&(l(p[0]!==S[0]||p[1]!==S[1]),S=p)),f.advanced.updateOnImageLoad&&(g=n(),g!==b&&(h.find("img").each(function(){i(this)}),b=g)),void((f.advanced.updateOnSelectorChange||f.advanced.updateOnContentResize||f.advanced.updateOnImageLoad)&&o()))},60)}function n(){var e=0;return f.advanced.updateOnImageLoad&&(e=h.find("img").length),e}function i(t){function o(e,t){return function(){return t.apply(e,arguments)}}function a(){this.onload=null,e(t).addClass(d[2]),l(2)}if(e(t).hasClass(d[2]))return void l();var n=new Image;n.onload=o(n,a),n.src=t.src}function r(){f.advanced.updateOnSelectorChange===!0&&(f.advanced.updateOnSelectorChange="*");var t=0,o=h.find(f.advanced.updateOnSelectorChange);return f.advanced.updateOnSelectorChange&&o.length>0&&o.each(function(){t+=e(this).height()+e(this).width()}),t}function l(e){clearTimeout(h[0].autoUpdate),u.update.call(null,s[0],e)}var s=e(this),c=s.data(a),f=c.opt,h=e("#mCSB_"+c.idx+"_container");if(t)return clearTimeout(h[0].autoUpdate),void Z(h[0],"autoUpdate");var m,p,g,v=h.parent(),x=[e("#mCSB_"+c.idx+"_scrollbar_vertical"),e("#mCSB_"+c.idx+"_scrollbar_horizontal")],_=function(){return[x[0].is(":visible")?x[0].outerHeight(!0):0,x[1].is(":visible")?x[1].outerWidth(!0):0]},w=r(),S=[h.outerHeight(!1),h.outerWidth(!1),v.height(),v.width(),_()[0],_()[1]],b=n();o()},N=function(e,t,o){return Math.round(e/t)*t-o},V=function(t){var o=t.data(a),n=e("#mCSB_"+o.idx+"_container,#mCSB_"+o.idx+"_container_wrapper,#mCSB_"+o.idx+"_dragger_vertical,#mCSB_"+o.idx+"_dragger_horizontal");n.each(function(){K.call(this)})},Q=function(t,o,n){function i(e){return s&&c.callbacks[e]&&"function"==typeof c.callbacks[e]}function r(){return[c.callbacks.alwaysTriggerOffsets||_>=w[0]+b,c.callbacks.alwaysTriggerOffsets||-C>=_]}function l(){var e=[h[0].offsetTop,h[0].offsetLeft],o=[v[0].offsetTop,v[0].offsetLeft],a=[h.outerHeight(!1),h.outerWidth(!1)],i=[f.height(),f.width()];t[0].mcs={content:h,top:e[0],left:e[1],draggerTop:o[0],draggerLeft:o[1],topPct:Math.round(100*Math.abs(e[0])/(Math.abs(a[0])-i[0])),leftPct:Math.round(100*Math.abs(e[1])/(Math.abs(a[1])-i[1])),direction:n.dir}}var s=t.data(a),c=s.opt,d={trigger:"internal",dir:"y",scrollEasing:"mcsEaseOut",drag:!1,dur:c.scrollInertia,overwrite:"all",callbacks:!0,onStart:!0,onUpdate:!0,onComplete:!0},n=e.extend(d,n),u=[n.dur,n.drag?0:n.dur],f=e("#mCSB_"+s.idx),h=e("#mCSB_"+s.idx+"_container"),m=h.parent(),p=c.callbacks.onTotalScrollOffset?Y.call(t,c.callbacks.onTotalScrollOffset):[0,0],g=c.callbacks.onTotalScrollBackOffset?Y.call(t,c.callbacks.onTotalScrollBackOffset):[0,0];
if(s.trigger=n.trigger,(0!==m.scrollTop()||0!==m.scrollLeft())&&(e(".mCSB_"+s.idx+"_scrollbar").css("visibility","visible"),m.scrollTop(0).scrollLeft(0)),"_resetY"!==o||s.contentReset.y||(i("onOverflowYNone")&&c.callbacks.onOverflowYNone.call(t[0]),s.contentReset.y=1),"_resetX"!==o||s.contentReset.x||(i("onOverflowXNone")&&c.callbacks.onOverflowXNone.call(t[0]),s.contentReset.x=1),"_resetY"!==o&&"_resetX"!==o){switch(!s.contentReset.y&&t[0].mcs||!s.overflowed[0]||(i("onOverflowY")&&c.callbacks.onOverflowY.call(t[0]),s.contentReset.x=null),!s.contentReset.x&&t[0].mcs||!s.overflowed[1]||(i("onOverflowX")&&c.callbacks.onOverflowX.call(t[0]),s.contentReset.x=null),c.snapAmount&&(o=N(o,c.snapAmount,c.snapOffset)),n.dir){case"x":var v=e("#mCSB_"+s.idx+"_dragger_horizontal"),x="left",_=h[0].offsetLeft,w=[f.width()-h.outerWidth(!1),v.parent().width()-v.width()],S=[o,0===o?0:o/s.scrollRatio.x],b=p[1],C=g[1],B=b>0?b/s.scrollRatio.x:0,T=C>0?C/s.scrollRatio.x:0;break;case"y":var v=e("#mCSB_"+s.idx+"_dragger_vertical"),x="top",_=h[0].offsetTop,w=[f.height()-h.outerHeight(!1),v.parent().height()-v.height()],S=[o,0===o?0:o/s.scrollRatio.y],b=p[0],C=g[0],B=b>0?b/s.scrollRatio.y:0,T=C>0?C/s.scrollRatio.y:0}S[1]<0||0===S[0]&&0===S[1]?S=[0,0]:S[1]>=w[1]?S=[w[0],w[1]]:S[0]=-S[0],t[0].mcs||(l(),i("onInit")&&c.callbacks.onInit.call(t[0])),clearTimeout(h[0].onCompleteTimeout),(s.tweenRunning||!(0===_&&S[0]>=0||_===w[0]&&S[0]<=w[0]))&&(G(v[0],x,Math.round(S[1]),u[1],n.scrollEasing),G(h[0],x,Math.round(S[0]),u[0],n.scrollEasing,n.overwrite,{onStart:function(){n.callbacks&&n.onStart&&!s.tweenRunning&&(i("onScrollStart")&&(l(),c.callbacks.onScrollStart.call(t[0])),s.tweenRunning=!0,y(v),s.cbOffsets=r())},onUpdate:function(){n.callbacks&&n.onUpdate&&i("whileScrolling")&&(l(),c.callbacks.whileScrolling.call(t[0]))},onComplete:function(){if(n.callbacks&&n.onComplete){"yx"===c.axis&&clearTimeout(h[0].onCompleteTimeout);var e=h[0].idleTimer||0;h[0].onCompleteTimeout=setTimeout(function(){i("onScroll")&&(l(),c.callbacks.onScroll.call(t[0])),i("onTotalScroll")&&S[1]>=w[1]-B&&s.cbOffsets[0]&&(l(),c.callbacks.onTotalScroll.call(t[0])),i("onTotalScrollBack")&&S[1]<=T&&s.cbOffsets[1]&&(l(),c.callbacks.onTotalScrollBack.call(t[0])),s.tweenRunning=!1,h[0].idleTimer=0,y(v,"hide")},e)}}}))}},G=function(e,t,o,a,n,i,r){function l(){S.stop||(x||m.call(),x=J()-v,s(),x>=S.time&&(S.time=x>S.time?x+f-(x-S.time):x+f-1,S.time<x+1&&(S.time=x+1)),S.time<a?S.id=h(l):g.call())}function s(){a>0?(S.currVal=u(S.time,_,b,a,n),w[t]=Math.round(S.currVal)+"px"):w[t]=o+"px",p.call()}function c(){f=1e3/60,S.time=x+f,h=window.requestAnimationFrame?window.requestAnimationFrame:function(e){return s(),setTimeout(e,.01)},S.id=h(l)}function d(){null!=S.id&&(window.requestAnimationFrame?window.cancelAnimationFrame(S.id):clearTimeout(S.id),S.id=null)}function u(e,t,o,a,n){switch(n){case"linear":case"mcsLinear":return o*e/a+t;case"mcsLinearOut":return e/=a,e--,o*Math.sqrt(1-e*e)+t;case"easeInOutSmooth":return e/=a/2,1>e?o/2*e*e+t:(e--,-o/2*(e*(e-2)-1)+t);case"easeInOutStrong":return e/=a/2,1>e?o/2*Math.pow(2,10*(e-1))+t:(e--,o/2*(-Math.pow(2,-10*e)+2)+t);case"easeInOut":case"mcsEaseInOut":return e/=a/2,1>e?o/2*e*e*e+t:(e-=2,o/2*(e*e*e+2)+t);case"easeOutSmooth":return e/=a,e--,-o*(e*e*e*e-1)+t;case"easeOutStrong":return o*(-Math.pow(2,-10*e/a)+1)+t;case"easeOut":case"mcsEaseOut":default:var i=(e/=a)*e,r=i*e;return t+o*(.499999999999997*r*i+-2.5*i*i+5.5*r+-6.5*i+4*e)}}e._mTween||(e._mTween={top:{},left:{}});var f,h,r=r||{},m=r.onStart||function(){},p=r.onUpdate||function(){},g=r.onComplete||function(){},v=J(),x=0,_=e.offsetTop,w=e.style,S=e._mTween[t];"left"===t&&(_=e.offsetLeft);var b=o-_;S.stop=0,"none"!==i&&d(),c()},J=function(){return window.performance&&window.performance.now?window.performance.now():window.performance&&window.performance.webkitNow?window.performance.webkitNow():Date.now?Date.now():(new Date).getTime()},K=function(){var e=this;e._mTween||(e._mTween={top:{},left:{}});for(var t=["top","left"],o=0;o<t.length;o++){var a=t[o];e._mTween[a].id&&(window.requestAnimationFrame?window.cancelAnimationFrame(e._mTween[a].id):clearTimeout(e._mTween[a].id),e._mTween[a].id=null,e._mTween[a].stop=1)}},Z=function(e,t){try{delete e[t]}catch(o){e[t]=null}},$=function(e){return!(e.which&&1!==e.which)},et=function(e){var t=e.originalEvent.pointerType;return!(t&&"touch"!==t&&2!==t)},tt=function(e){return!isNaN(parseFloat(e))&&isFinite(e)},ot=function(e){var t=e.parents(".mCSB_container");return[e.offset().top-t.offset().top,e.offset().left-t.offset().left]};e.fn[o]=function(t){return u[t]?u[t].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof t&&t?void e.error("Method "+t+" does not exist"):u.init.apply(this,arguments)},e[o]=function(t){return u[t]?u[t].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof t&&t?void e.error("Method "+t+" does not exist"):u.init.apply(this,arguments)},e[o].defaults=i,window[o]=!0,e(window).load(function(){e(n)[o](),e.extend(e.expr[":"],{mcsInView:e.expr[":"].mcsInView||function(t){var o,a,n=e(t),i=n.parents(".mCSB_container");if(i.length)return o=i.parent(),a=[i[0].offsetTop,i[0].offsetLeft],a[0]+ot(n)[0]>=0&&a[0]+ot(n)[0]<o.height()-n.outerHeight(!1)&&a[1]+ot(n)[1]>=0&&a[1]+ot(n)[1]<o.width()-n.outerWidth(!1)},mcsOverflow:e.expr[":"].mcsOverflow||function(t){var o=e(t).data(a);if(o)return o.overflowed[0]||o.overflowed[1]}})})})});
/* ===========================================================
 *
 *  Name:          selectordie.min.js
 *  Updated:       2014-10-11
 *  Version:       0.1.8
 *  Created by:    Per V @ Vst.mn
 *  What?:         Minified version of the Select or Die JS
 *
 *  Copyright (c) 2014 Per Vestman
 *  Dual licensed under the MIT and GPL licenses.
 *
 *  Beards, Rock & Loud Guns | Cogs 'n Kegs
 *
 * =========================================================== */
!function(a){"use strict";a.fn.selectOrDie=function(b){var f,g,c={customID:null,customClass:"",placeholder:null,placeholderOption:!1,prefix:null,cycle:!1,stripEmpty:!1,links:!1,linksExternal:!1,size:0,tabIndex:0,onChange:a.noop},d={},e=!1,h={initSoD:function(b){return d=a.extend({},c,b),this.each(function(){if(a(this).parent().hasClass("sod_select"))console.log("Select or Die: It looks like the SoD already exists");else{var u,v,w,b=a(this),c=b.data("custom-id")?b.data("custom-id"):d.customID,e=b.data("custom-class")?b.data("custom-class"):d.customClass,f=b.data("prefix")?b.data("prefix"):d.prefix,g=b.data("placeholder")?b.data("placeholder"):d.placeholder,i=b.data("placeholder-option")?b.data("placeholder-option"):d.placeholderOption,j=b.data("cycle")?b.data("cycle"):d.cycle,k=b.data("links")?b.data("links"):d.links,l=b.data("links-external")?b.data("links-external"):d.linksExternal,m=parseInt(b.data("size"))?b.data("size"):d.size,n=parseInt(b.data("tabindex"))?b.data("tabindex"):d.tabIndex?d.tabIndex:b.attr("tabindex")?b.attr("tabindex"):d.tabIndex,o=b.data("strip-empty")?b.data("strip-empty"):d.stripEmpty,p=b.prop("title")?b.prop("title"):null,q=b.is(":disabled")?" disabled":"",r="",s="",t=0;f&&(r='<span class="sod_prefix">'+f+"</span> "),s+=g&&!f?'<span class="sod_label sod_placeholder">'+g+"</span>":'<span class="sod_label">'+r+"</span>",u=a("<span/>",{id:c,"class":"sod_select "+e+q,title:p,tabindex:n,html:s,"data-cycle":j,"data-links":k,"data-links-external":l,"data-placeholder":g,"data-placeholder-option":i,"data-prefix":f,"data-filter":""}).insertAfter(this),h.isTouch()&&u.addClass("touch"),v=a("<span/>",{"class":"sod_list_wrapper"}).appendTo(u),w=a("<span/>",{"class":"sod_list"}).appendTo(v),a("option, optgroup",b).each(function(b){var c=a(this);o&&!a.trim(c.text())?c.remove():0===b&&i&&!r?h.populateSoD(c,w,u,!0):h.populateSoD(c,w,u,!1)}),m&&(v.show(),a(".sod_option:lt("+m+")",w).each(function(){t+=a(this).outerHeight()}),v.removeAttr("style"),w.css({"max-height":t})),b.appendTo(u),u.on("focusin",h.focusSod).on("click",h.triggerSod).on("click",".sod_option",h.optionClick).on("mousemove",".sod_option",h.optionHover).on("keydown",h.keyboardUse),b.on("change",h.selectChange),a(document).on("click","label[for='"+b.attr("id")+"']",function(a){a.preventDefault(),u.focus()})}})},populateSoD:function(b,c,d,e){var f=d.data("placeholder"),g=d.data("placeholder-option"),h=d.data("prefix"),i=d.find(".sod_label"),j=b.parent(),k=b.text(),l=b.val(),m=b.data("custom-id")?b.data("custom-id"):null,n=b.data("custom-class")?b.data("custom-class"):"",o=b.is(":disabled")?" disabled ":"",p=b.is(":selected")?" selected active ":"",q=b.data("link")?" link ":"",r=b.data("link-external")?" linkexternal":"",s=b.prop("label");b.is("option")?(a("<span/>",{"class":"sod_option "+n+o+p+q+r,id:m,title:k,html:k,"data-value":l}).appendTo(c),e&&!h?(d.data("label",k),d.data("placeholder",k),b.prop("disabled",!0),c.find(".sod_option:last").addClass("is-placeholder disabled"),p&&i.addClass("sod_placeholder")):p&&f&&!g&&!h?d.data("label",f):p&&d.data("label",k),(p&&!f||p&&g||p&&h)&&i.append(k),j.is("optgroup")&&(c.find(".sod_option:last").addClass("groupchild"),j.is(":disabled")&&c.find(".sod_option:last").addClass("disabled"))):a("<span/>",{"class":"sod_option optgroup "+o,title:s,html:s,"data-label":s}).appendTo(c)},focusSod:function(){var b=a(this);b.hasClass("disabled")?h.blurSod(b):(h.blurSod(a(".sod_select.focus").not(b)),b.addClass("focus"),a("html").on("click.sodBlur",function(){h.blurSod(b)}))},triggerSod:function(b){b.stopPropagation();var c=a(this),d=c.find(".sod_list"),e=c.data("placeholder"),f=c.find(".active"),i=c.find(".selected");c.hasClass("disabled")||c.hasClass("open")||c.hasClass("touch")?(clearTimeout(g),c.removeClass("open"),e&&(c.find(".sod_label").get(0).lastChild.nodeValue=f.text())):(c.addClass("open"),e&&!c.data("prefix")&&c.find(".sod_label").addClass("sod_placeholder").html(e),h.listScroll(d,i),h.checkViewport(c,d))},keyboardUse:function(b){var l,m,n,c=a(this),d=c.find(".sod_list"),g=c.find(".sod_option"),i=c.find(".sod_label"),j=c.data("cycle"),k=g.filter(".active");return b.which>36&&b.which<41?(37===b.which||38===b.which?(m=k.prevAll(":not('.disabled, .optgroup')").first(),n=g.not(".disabled, .optgroup").last()):(39===b.which||40===b.which)&&(m=k.nextAll(":not('.disabled, .optgroup')").first(),n=g.not(".disabled, .optgroup").first()),!m.hasClass("sod_option")&&j&&(m=n),(m.hasClass("sod_option")||j)&&(k.removeClass("active"),m.addClass("active"),i.get(0).lastChild.nodeValue=m.text(),h.listScroll(d,m),c.hasClass("open")||(e=!0)),!1):(13===b.which||32===b.which&&c.hasClass("open")&&(" "===c.data("filter")[0]||""===c.data("filter"))?(b.preventDefault(),k.click()):32!==b.which||c.hasClass("open")||" "!==c.data("filter")[0]&&""!==c.data("filter")?27===b.which&&h.blurSod(c):(b.preventDefault(),e=!1,c.click()),0!==b.which&&(clearTimeout(f),c.data("filter",c.data("filter")+String.fromCharCode(b.which)),l=g.filter(function(){return 0===a(this).text().toLowerCase().indexOf(c.data("filter").toLowerCase())}).not(".disabled, .optgroup").first(),l.length&&(k.removeClass("active"),l.addClass("active"),h.listScroll(d,l),i.get(0).lastChild.nodeValue=l.text(),c.hasClass("open")||(e=!0)),f=setTimeout(function(){c.data("filter","")},500)),void 0)},optionHover:function(){var b=a(this);b.hasClass("disabled")||b.hasClass("optgroup")||b.siblings().removeClass("active").end().addClass("active")},optionClick:function(b){b.stopPropagation();var c=a(this),d=c.closest(".sod_select"),e=c.hasClass("disabled"),f=c.hasClass("optgroup"),h=d.find(".sod_option:not('.optgroup')").index(this);d.hasClass("touch")||(e||f||(d.find(".selected, .sod_placeholder").removeClass("selected sod_placeholder"),c.addClass("selected"),d.find("select option")[h].selected=!0,d.find("select").change()),clearTimeout(g),d.removeClass("open"))},selectChange:function(){var b=a(this),c=b.find(":selected"),e=c.text(),f=b.closest(".sod_select");f.find(".sod_label").get(0).lastChild.nodeValue=e,f.data("label",e),d.onChange.call(this),!f.data("links")&&!c.data("link")||c.data("link-external")?(f.data("links-external")||c.data("link-external"))&&window.open(c.val(),"_blank"):window.location.href=c.val()},blurSod:function(b){if(a("body").find(b).length){var c=b.data("label"),d=b.data("placeholder"),f=b.find(".active"),h=b.find(".selected"),i=!1;clearTimeout(g),e&&!f.hasClass("selected")?(f.click(),i=!0):f.hasClass("selected")||(f.removeClass("active"),h.addClass("active")),!i&&d?b.find(".sod_label").get(0).lastChild.nodeValue=h.text():i||(b.find(".sod_label").get(0).lastChild.nodeValue=c),e=!1,b.removeClass("open focus"),b.blur(),a("html").off(".sodBlur")}},checkViewport:function(b,c){var d=b[0].getBoundingClientRect(),e=c.outerHeight();d.bottom+e+10>a(window).height()&&d.top-e>10?b.addClass("above"):b.removeClass("above"),g=setTimeout(function(){h.checkViewport(b,c)},200)},listScroll:function(a,b){var c=a[0].getBoundingClientRect(),d=b[0].getBoundingClientRect();c.top>d.top?a.scrollTop(a.scrollTop()-c.top+d.top):c.bottom<d.bottom&&a.scrollTop(a.scrollTop()-c.bottom+d.bottom)},isTouch:function(){return"ontouchstart"in window||navigator.MaxTouchPoints>0||navigator.msMaxTouchPoints>0}},i={destroy:function(){return this.each(function(){var b=a(this),c=b.parent();c.hasClass("sod_select")?(b.off("change"),c.find("span").remove(),b.unwrap()):console.log("Select or Die: There's no SoD to destroy")})},update:function(){return this.each(function(){var b=a(this),c=b.parent(),d=c.find(".sod_list:first");c.hasClass("sod_select")?(d.empty(),c.find(".sod_label").get(0).lastChild.nodeValue="",b.is(":disabled")&&c.addClass("disabled"),a("option, optgroup",b).each(function(){h.populateSoD(a(this),d,c)})):console.log("Select or Die: There's no SoD to update")})},disable:function(b){return this.each(function(){var c=a(this),d=c.parent();d.hasClass("sod_select")?"undefined"!=typeof b?(d.find(".sod_list:first .sod_option[data-value='"+b+"']").addClass("disabled"),d.find(".sod_list:first .sod_option[data-label='"+b+"']").nextUntil(":not(.groupchild)").addClass("disabled"),a("option[value='"+b+"'], optgroup[label='"+b+"']",this).prop("disabled",!0)):d.hasClass("sod_select")&&(d.addClass("disabled"),c.prop("disabled",!0)):console.log("Select or Die: There's no SoD to disable")})},enable:function(b){return this.each(function(){var c=a(this),d=c.parent();d.hasClass("sod_select")?"undefined"!=typeof b?(d.find(".sod_list:first .sod_option[data-value='"+b+"']").removeClass("disabled"),d.find(".sod_list:first .sod_option[data-label='"+b+"']").nextUntil(":not(.groupchild)").removeClass("disabled"),a("option[value='"+b+"'], optgroup[label='"+b+"']",this).prop("disabled",!1)):d.hasClass("sod_select")&&(d.removeClass("disabled"),c.prop("disabled",!1)):console.log("Select or Die: There's no SoD to enable")})}};return i[b]?i[b].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof b&&b?(a.error('Select or Die: Oh no! No such method "'+b+'" for the SoD instance'),void 0):h.initSoD.apply(this,arguments)}}(jQuery);
/*! odometer 0.4.7 */
(function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G=[].slice;q='<span class="odometer-value"></span>',n='<span class="odometer-ribbon"><span class="odometer-ribbon-inner">'+q+"</span></span>",d='<span class="odometer-digit"><span class="odometer-digit-spacer">8</span><span class="odometer-digit-inner">'+n+"</span></span>",g='<span class="odometer-formatting-mark"></span>',c="(,ddd).dd",h=/^\(?([^)]*)\)?(?:(.)(d+))?$/,i=30,f=2e3,a=20,j=2,e=.5,k=1e3/i,b=1e3/a,o="transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd",y=document.createElement("div").style,p=null!=y.transition||null!=y.webkitTransition||null!=y.mozTransition||null!=y.oTransition,w=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,l=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver,s=function(a){var b;return b=document.createElement("div"),b.innerHTML=a,b.children[0]},v=function(a,b){return a.className=a.className.replace(new RegExp("(^| )"+b.split(" ").join("|")+"( |$)","gi")," ")},r=function(a,b){return v(a,b),a.className+=" "+b},z=function(a,b){var c;return null!=document.createEvent?(c=document.createEvent("HTMLEvents"),c.initEvent(b,!0,!0),a.dispatchEvent(c)):void 0},u=function(){var a,b;return null!=(a=null!=(b=window.performance)&&"function"==typeof b.now?b.now():void 0)?a:+new Date},x=function(a,b){return null==b&&(b=0),b?(a*=Math.pow(10,b),a+=.5,a=Math.floor(a),a/=Math.pow(10,b)):Math.round(a)},A=function(a){return 0>a?Math.ceil(a):Math.floor(a)},t=function(a){return a-x(a)},C=!1,(B=function(){var a,b,c,d,e;if(!C&&null!=window.jQuery){for(C=!0,d=["html","text"],e=[],b=0,c=d.length;c>b;b++)a=d[b],e.push(function(a){var b;return b=window.jQuery.fn[a],window.jQuery.fn[a]=function(a){var c;return null==a||null==(null!=(c=this[0])?c.odometer:void 0)?b.apply(this,arguments):this[0].odometer.update(a)}}(a));return e}})(),setTimeout(B,0),m=function(){function a(b){var c,d,e,g,h,i,l,m,n,o,p=this;if(this.options=b,this.el=this.options.el,null!=this.el.odometer)return this.el.odometer;this.el.odometer=this,m=a.options;for(d in m)g=m[d],null==this.options[d]&&(this.options[d]=g);null==(h=this.options).duration&&(h.duration=f),this.MAX_VALUES=this.options.duration/k/j|0,this.resetFormat(),this.value=this.cleanValue(null!=(n=this.options.value)?n:""),this.renderInside(),this.render();try{for(o=["innerHTML","innerText","textContent"],i=0,l=o.length;l>i;i++)e=o[i],null!=this.el[e]&&!function(a){return Object.defineProperty(p.el,a,{get:function(){var b;return"innerHTML"===a?p.inside.outerHTML:null!=(b=p.inside.innerText)?b:p.inside.textContent},set:function(a){return p.update(a)}})}(e)}catch(q){c=q,this.watchForMutations()}}return a.prototype.renderInside=function(){return this.inside=document.createElement("div"),this.inside.className="odometer-inside",this.el.innerHTML="",this.el.appendChild(this.inside)},a.prototype.watchForMutations=function(){var a,b=this;if(null!=l)try{return null==this.observer&&(this.observer=new l(function(){var a;return a=b.el.innerText,b.renderInside(),b.render(b.value),b.update(a)})),this.watchMutations=!0,this.startWatchingMutations()}catch(c){a=c}},a.prototype.startWatchingMutations=function(){return this.watchMutations?this.observer.observe(this.el,{childList:!0}):void 0},a.prototype.stopWatchingMutations=function(){var a;return null!=(a=this.observer)?a.disconnect():void 0},a.prototype.cleanValue=function(a){var b;return"string"==typeof a&&(a=a.replace(null!=(b=this.format.radix)?b:".","<radix>"),a=a.replace(/[.,]/g,""),a=a.replace("<radix>","."),a=parseFloat(a,10)||0),x(a,this.format.precision)},a.prototype.bindTransitionEnd=function(){var a,b,c,d,e,f,g=this;if(!this.transitionEndBound){for(this.transitionEndBound=!0,b=!1,e=o.split(" "),f=[],c=0,d=e.length;d>c;c++)a=e[c],f.push(this.el.addEventListener(a,function(){return b?!0:(b=!0,setTimeout(function(){return g.render(),b=!1,z(g.el,"odometerdone")},0),!0)},!1));return f}},a.prototype.resetFormat=function(){var a,b,d,e,f,g,i,j;if(a=null!=(i=this.options.format)?i:c,a||(a="d"),d=h.exec(a),!d)throw new Error("Odometer: Unparsable digit format");return j=d.slice(1,4),g=j[0],f=j[1],b=j[2],e=(null!=b?b.length:void 0)||0,this.format={repeating:g,radix:f,precision:e}},a.prototype.render=function(a){var b,c,d,e,f,g,h;for(null==a&&(a=this.value),this.stopWatchingMutations(),this.resetFormat(),this.inside.innerHTML="",f=this.options.theme,b=this.el.className.split(" "),e=[],g=0,h=b.length;h>g;g++)c=b[g],c.length&&((d=/^odometer-theme-(.+)$/.exec(c))?f=d[1]:/^odometer(-|$)/.test(c)||e.push(c));return e.push("odometer"),p||e.push("odometer-no-transitions"),e.push(f?"odometer-theme-"+f:"odometer-auto-theme"),this.el.className=e.join(" "),this.ribbons={},this.formatDigits(a),this.startWatchingMutations()},a.prototype.formatDigits=function(a){var b,c,d,e,f,g,h,i,j,k;if(this.digits=[],this.options.formatFunction)for(d=this.options.formatFunction(a),j=d.split("").reverse(),f=0,h=j.length;h>f;f++)c=j[f],c.match(/0-9/)?(b=this.renderDigit(),b.querySelector(".odometer-value").innerHTML=c,this.digits.push(b),this.insertDigit(b)):this.addSpacer(c);else for(e=!this.format.precision||!t(a)||!1,k=a.toString().split("").reverse(),g=0,i=k.length;i>g;g++)b=k[g],"."===b&&(e=!0),this.addDigit(b,e)},a.prototype.update=function(a){var b,c=this;return a=this.cleanValue(a),(b=a-this.value)?(v(this.el,"odometer-animating-up odometer-animating-down odometer-animating"),b>0?r(this.el,"odometer-animating-up"):r(this.el,"odometer-animating-down"),this.stopWatchingMutations(),this.animate(a),this.startWatchingMutations(),setTimeout(function(){return c.el.offsetHeight,r(c.el,"odometer-animating")},0),this.value=a):void 0},a.prototype.renderDigit=function(){return s(d)},a.prototype.insertDigit=function(a,b){return null!=b?this.inside.insertBefore(a,b):this.inside.children.length?this.inside.insertBefore(a,this.inside.children[0]):this.inside.appendChild(a)},a.prototype.addSpacer=function(a,b,c){var d;return d=s(g),d.innerHTML=a,c&&r(d,c),this.insertDigit(d,b)},a.prototype.addDigit=function(a,b){var c,d,e,f;if(null==b&&(b=!0),"-"===a)return this.addSpacer(a,null,"odometer-negation-mark");if("."===a)return this.addSpacer(null!=(f=this.format.radix)?f:".",null,"odometer-radix-mark");if(b)for(e=!1;;){if(!this.format.repeating.length){if(e)throw new Error("Bad odometer format without digits");this.resetFormat(),e=!0}if(c=this.format.repeating[this.format.repeating.length-1],this.format.repeating=this.format.repeating.substring(0,this.format.repeating.length-1),"d"===c)break;this.addSpacer(c)}return d=this.renderDigit(),d.querySelector(".odometer-value").innerHTML=a,this.digits.push(d),this.insertDigit(d)},a.prototype.animate=function(a){return p&&"count"!==this.options.animation?this.animateSlide(a):this.animateCount(a)},a.prototype.animateCount=function(a){var c,d,e,f,g,h=this;if(d=+a-this.value)return f=e=u(),c=this.value,(g=function(){var i,j,k;return u()-f>h.options.duration?(h.value=a,h.render(),void z(h.el,"odometerdone")):(i=u()-e,i>b&&(e=u(),k=i/h.options.duration,j=d*k,c+=j,h.render(Math.round(c))),null!=w?w(g):setTimeout(g,b))})()},a.prototype.getDigitCount=function(){var a,b,c,d,e,f;for(d=1<=arguments.length?G.call(arguments,0):[],a=e=0,f=d.length;f>e;a=++e)c=d[a],d[a]=Math.abs(c);return b=Math.max.apply(Math,d),Math.ceil(Math.log(b+1)/Math.log(10))},a.prototype.getFractionalDigitCount=function(){var a,b,c,d,e,f,g;for(e=1<=arguments.length?G.call(arguments,0):[],b=/^\-?\d*\.(\d*?)0*$/,a=f=0,g=e.length;g>f;a=++f)d=e[a],e[a]=d.toString(),c=b.exec(e[a]),e[a]=null==c?0:c[1].length;return Math.max.apply(Math,e)},a.prototype.resetDigits=function(){return this.digits=[],this.ribbons=[],this.inside.innerHTML="",this.resetFormat()},a.prototype.animateSlide=function(a){var b,c,d,f,g,h,i,j,k,l,m,n,o,p,q,s,t,u,v,w,x,y,z,B,C,D,E;if(s=this.value,j=this.getFractionalDigitCount(s,a),j&&(a*=Math.pow(10,j),s*=Math.pow(10,j)),d=a-s){for(this.bindTransitionEnd(),f=this.getDigitCount(s,a),g=[],b=0,m=v=0;f>=0?f>v:v>f;m=f>=0?++v:--v){if(t=A(s/Math.pow(10,f-m-1)),i=A(a/Math.pow(10,f-m-1)),h=i-t,Math.abs(h)>this.MAX_VALUES){for(l=[],n=h/(this.MAX_VALUES+this.MAX_VALUES*b*e),c=t;h>0&&i>c||0>h&&c>i;)l.push(Math.round(c)),c+=n;l[l.length-1]!==i&&l.push(i),b++}else l=function(){E=[];for(var a=t;i>=t?i>=a:a>=i;i>=t?a++:a--)E.push(a);return E}.apply(this);for(m=w=0,y=l.length;y>w;m=++w)k=l[m],l[m]=Math.abs(k%10);g.push(l)}for(this.resetDigits(),D=g.reverse(),m=x=0,z=D.length;z>x;m=++x)for(l=D[m],this.digits[m]||this.addDigit(" ",m>=j),null==(u=this.ribbons)[m]&&(u[m]=this.digits[m].querySelector(".odometer-ribbon-inner")),this.ribbons[m].innerHTML="",0>d&&(l=l.reverse()),o=C=0,B=l.length;B>C;o=++C)k=l[o],q=document.createElement("div"),q.className="odometer-value",q.innerHTML=k,this.ribbons[m].appendChild(q),o===l.length-1&&r(q,"odometer-last-value"),0===o&&r(q,"odometer-first-value");return 0>t&&this.addDigit("-"),p=this.inside.querySelector(".odometer-radix-mark"),null!=p&&p.parent.removeChild(p),j?this.addSpacer(this.format.radix,this.digits[j-1],"odometer-radix-mark"):void 0}},a}(),m.options=null!=(E=window.odometerOptions)?E:{},setTimeout(function(){var a,b,c,d,e;if(window.odometerOptions){d=window.odometerOptions,e=[];for(a in d)b=d[a],e.push(null!=(c=m.options)[a]?(c=m.options)[a]:c[a]=b);return e}},0),m.init=function(){var a,b,c,d,e,f;if(null!=document.querySelectorAll){for(b=document.querySelectorAll(m.options.selector||".odometer"),f=[],c=0,d=b.length;d>c;c++)a=b[c],f.push(a.odometer=new m({el:a,value:null!=(e=a.innerText)?e:a.textContent}));return f}},null!=(null!=(F=document.documentElement)?F.doScroll:void 0)&&null!=document.createEventObject?(D=document.onreadystatechange,document.onreadystatechange=function(){return"complete"===document.readyState&&m.options.auto!==!1&&m.init(),null!=D?D.apply(this,arguments):void 0}):document.addEventListener("DOMContentLoaded",function(){return m.options.auto!==!1?m.init():void 0},!1),"function"==typeof define&&define.amd?define(["jquery"],function(){return m}):"undefined"!=typeof exports&&null!==exports?module.exports=m:window.Odometer=m}).call(this);
/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/
 Version: 1.5.3
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues
 */
/* global window, document, define, jQuery, setInterval, clearInterval */
!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):"undefined"!=typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){"use strict";var b=window.Slick||{};b=function(){function c(c,d){var f,g,h,e=this;if(e.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:a(c),appendDots:a(c),arrows:!0,asNavFor:null,prevArrow:'<button type="button" data-role="none" class="slick-prev" aria-label="previous">Previous</button>',nextArrow:'<button type="button" data-role="none" class="slick-next" aria-label="next">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(a,b){return'<button type="button" data-role="none">'+(b+1)+"</button>"},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0},e.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},a.extend(e,e.initials),e.activeBreakpoint=null,e.animType=null,e.animProp=null,e.breakpoints=[],e.breakpointSettings=[],e.cssTransitions=!1,e.hidden="hidden",e.paused=!1,e.positionProp=null,e.respondTo=null,e.rowCount=1,e.shouldClick=!0,e.$slider=a(c),e.$slidesCache=null,e.transformType=null,e.transitionType=null,e.visibilityChange="visibilitychange",e.windowWidth=0,e.windowTimer=null,f=a(c).data("slick")||{},e.options=a.extend({},e.defaults,f,d),e.currentSlide=e.options.initialSlide,e.originalSettings=e.options,g=e.options.responsive||null,g&&g.length>-1){e.respondTo=e.options.respondTo||"window";for(h in g)g.hasOwnProperty(h)&&(e.breakpoints.push(g[h].breakpoint),e.breakpointSettings[g[h].breakpoint]=g[h].settings);e.breakpoints.sort(function(a,b){return e.options.mobileFirst===!0?a-b:b-a})}"undefined"!=typeof document.mozHidden?(e.hidden="mozHidden",e.visibilityChange="mozvisibilitychange"):"undefined"!=typeof document.webkitHidden&&(e.hidden="webkitHidden",e.visibilityChange="webkitvisibilitychange"),e.autoPlay=a.proxy(e.autoPlay,e),e.autoPlayClear=a.proxy(e.autoPlayClear,e),e.changeSlide=a.proxy(e.changeSlide,e),e.clickHandler=a.proxy(e.clickHandler,e),e.selectHandler=a.proxy(e.selectHandler,e),e.setPosition=a.proxy(e.setPosition,e),e.swipeHandler=a.proxy(e.swipeHandler,e),e.dragHandler=a.proxy(e.dragHandler,e),e.keyHandler=a.proxy(e.keyHandler,e),e.autoPlayIterator=a.proxy(e.autoPlayIterator,e),e.instanceUid=b++,e.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,e.init(!0),e.checkResponsive(!0)}var b=0;return c}(),b.prototype.addSlide=b.prototype.slickAdd=function(b,c,d){var e=this;if("boolean"==typeof c)d=c,c=null;else if(0>c||c>=e.slideCount)return!1;e.unload(),"number"==typeof c?0===c&&0===e.$slides.length?a(b).appendTo(e.$slideTrack):d?a(b).insertBefore(e.$slides.eq(c)):a(b).insertAfter(e.$slides.eq(c)):d===!0?a(b).prependTo(e.$slideTrack):a(b).appendTo(e.$slideTrack),e.$slides=e.$slideTrack.children(this.options.slide),e.$slideTrack.children(this.options.slide).detach(),e.$slideTrack.append(e.$slides),e.$slides.each(function(b,c){a(c).attr("data-slick-index",b)}),e.$slidesCache=e.$slides,e.reinit()},b.prototype.animateHeight=function(){var a=this;if(1===a.options.slidesToShow&&a.options.adaptiveHeight===!0&&a.options.vertical===!1){var b=a.$slides.eq(a.currentSlide).outerHeight(!0);a.$list.animate({height:b},a.options.speed)}},b.prototype.animateSlide=function(b,c){var d={},e=this;e.animateHeight(),e.options.rtl===!0&&e.options.vertical===!1&&(b=-b),e.transformsEnabled===!1?e.options.vertical===!1?e.$slideTrack.animate({left:b},e.options.speed,e.options.easing,c):e.$slideTrack.animate({top:b},e.options.speed,e.options.easing,c):e.cssTransitions===!1?(e.options.rtl===!0&&(e.currentLeft=-e.currentLeft),a({animStart:e.currentLeft}).animate({animStart:b},{duration:e.options.speed,easing:e.options.easing,step:function(a){a=Math.ceil(a),e.options.vertical===!1?(d[e.animType]="translate("+a+"px, 0px)",e.$slideTrack.css(d)):(d[e.animType]="translate(0px,"+a+"px)",e.$slideTrack.css(d))},complete:function(){c&&c.call()}})):(e.applyTransition(),b=Math.ceil(b),d[e.animType]=e.options.vertical===!1?"translate3d("+b+"px, 0px, 0px)":"translate3d(0px,"+b+"px, 0px)",e.$slideTrack.css(d),c&&setTimeout(function(){e.disableTransition(),c.call()},e.options.speed))},b.prototype.asNavFor=function(b){var c=this,d=c.options.asNavFor;d&&null!==d&&(d=a(d).not(c.$slider)),null!==d&&"object"==typeof d&&d.each(function(){var c=a(this).slick("getSlick");c.unslicked||c.slideHandler(b,!0)})},b.prototype.applyTransition=function(a){var b=this,c={};c[b.transitionType]=b.options.fade===!1?b.transformType+" "+b.options.speed+"ms "+b.options.cssEase:"opacity "+b.options.speed+"ms "+b.options.cssEase,b.options.fade===!1?b.$slideTrack.css(c):b.$slides.eq(a).css(c)},b.prototype.autoPlay=function(){var a=this;a.autoPlayTimer&&clearInterval(a.autoPlayTimer),a.slideCount>a.options.slidesToShow&&a.paused!==!0&&(a.autoPlayTimer=setInterval(a.autoPlayIterator,a.options.autoplaySpeed))},b.prototype.autoPlayClear=function(){var a=this;a.autoPlayTimer&&clearInterval(a.autoPlayTimer)},b.prototype.autoPlayIterator=function(){var a=this;a.options.infinite===!1?1===a.direction?(a.currentSlide+1===a.slideCount-1&&(a.direction=0),a.slideHandler(a.currentSlide+a.options.slidesToScroll)):(0===a.currentSlide-1&&(a.direction=1),a.slideHandler(a.currentSlide-a.options.slidesToScroll)):a.slideHandler(a.currentSlide+a.options.slidesToScroll)},b.prototype.buildArrows=function(){var b=this;b.options.arrows===!0&&b.slideCount>b.options.slidesToShow&&(b.$prevArrow=a(b.options.prevArrow),b.$nextArrow=a(b.options.nextArrow),b.htmlExpr.test(b.options.prevArrow)&&b.$prevArrow.appendTo(b.options.appendArrows),b.htmlExpr.test(b.options.nextArrow)&&b.$nextArrow.appendTo(b.options.appendArrows),b.options.infinite!==!0&&b.$prevArrow.addClass("slick-disabled"))},b.prototype.buildDots=function(){var c,d,b=this;if(b.options.dots===!0&&b.slideCount>b.options.slidesToShow){for(d='<ul class="'+b.options.dotsClass+'">',c=0;c<=b.getDotCount();c+=1)d+="<li>"+b.options.customPaging.call(this,b,c)+"</li>";d+="</ul>",b.$dots=a(d).appendTo(b.options.appendDots),b.$dots.find("li").first().addClass("slick-active").attr("aria-hidden","false")}},b.prototype.buildOut=function(){var b=this;b.$slides=b.$slider.children(":not(.slick-cloned)").addClass("slick-slide"),b.slideCount=b.$slides.length,b.$slides.each(function(b,c){a(c).attr("data-slick-index",b)}),b.$slidesCache=b.$slides,b.$slider.addClass("slick-slider"),b.$slideTrack=0===b.slideCount?a('<div class="slick-track"/>').appendTo(b.$slider):b.$slides.wrapAll('<div class="slick-track"/>').parent(),b.$list=b.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent(),b.$slideTrack.css("opacity",0),(b.options.centerMode===!0||b.options.swipeToSlide===!0)&&(b.options.slidesToScroll=1),a("img[data-lazy]",b.$slider).not("[src]").addClass("slick-loading"),b.setupInfinite(),b.buildArrows(),b.buildDots(),b.updateDots(),b.options.accessibility===!0&&b.$list.prop("tabIndex",0),b.setSlideClasses("number"==typeof this.currentSlide?this.currentSlide:0),b.options.draggable===!0&&b.$list.addClass("draggable")},b.prototype.buildRows=function(){var b,c,d,e,f,g,h,a=this;if(e=document.createDocumentFragment(),g=a.$slider.children(),a.options.rows>1){for(h=a.options.slidesPerRow*a.options.rows,f=Math.ceil(g.length/h),b=0;f>b;b++){var i=document.createElement("div");for(c=0;c<a.options.rows;c++){var j=document.createElement("div");for(d=0;d<a.options.slidesPerRow;d++){var k=b*h+(c*a.options.slidesPerRow+d);g.get(k)&&j.appendChild(g.get(k))}i.appendChild(j)}e.appendChild(i)}a.$slider.html(e),a.$slider.children().children().children().width(100/a.options.slidesPerRow+"%").css({display:"inline-block"})}},b.prototype.checkResponsive=function(b){var d,e,f,c=this,g=!1,h=c.$slider.width(),i=window.innerWidth||a(window).width();if("window"===c.respondTo?f=i:"slider"===c.respondTo?f=h:"min"===c.respondTo&&(f=Math.min(i,h)),c.originalSettings.responsive&&c.originalSettings.responsive.length>-1&&null!==c.originalSettings.responsive){e=null;for(d in c.breakpoints)c.breakpoints.hasOwnProperty(d)&&(c.originalSettings.mobileFirst===!1?f<c.breakpoints[d]&&(e=c.breakpoints[d]):f>c.breakpoints[d]&&(e=c.breakpoints[d]));null!==e?null!==c.activeBreakpoint?e!==c.activeBreakpoint&&(c.activeBreakpoint=e,"unslick"===c.breakpointSettings[e]?c.unslick(e):(c.options=a.extend({},c.originalSettings,c.breakpointSettings[e]),b===!0&&(c.currentSlide=c.options.initialSlide),c.refresh()),g=e):(c.activeBreakpoint=e,"unslick"===c.breakpointSettings[e]?c.unslick(e):(c.options=a.extend({},c.originalSettings,c.breakpointSettings[e]),b===!0?c.currentSlide=c.options.initialSlide:c.refresh()),g=e):null!==c.activeBreakpoint&&(c.activeBreakpoint=null,c.options=c.originalSettings,b===!0&&(c.currentSlide=c.options.initialSlide),c.refresh(),g=e),b||g===!1||c.$slider.trigger("breakpoint",[c,g])}},b.prototype.changeSlide=function(b,c){var f,g,h,d=this,e=a(b.target);switch(e.is("a")&&b.preventDefault(),e.is("li")||(e=e.closest("li")),h=0!==d.slideCount%d.options.slidesToScroll,f=h?0:(d.slideCount-d.currentSlide)%d.options.slidesToScroll,b.data.message){case"previous":g=0===f?d.options.slidesToScroll:d.options.slidesToShow-f,d.slideCount>d.options.slidesToShow&&d.slideHandler(d.currentSlide-g,!1,c);break;case"next":g=0===f?d.options.slidesToScroll:f,d.slideCount>d.options.slidesToShow&&d.slideHandler(d.currentSlide+g,!1,c);break;case"index":var i=0===b.data.index?0:b.data.index||e.index()*d.options.slidesToScroll;d.slideHandler(d.checkNavigable(i),!1,c),e.children().trigger("focus");break;default:return}},b.prototype.checkNavigable=function(a){var c,d,b=this;if(c=b.getNavigableIndexes(),d=0,a>c[c.length-1])a=c[c.length-1];else for(var e in c){if(a<c[e]){a=d;break}d=c[e]}return a},b.prototype.cleanUpEvents=function(){var b=this;b.options.dots===!0&&b.slideCount>b.options.slidesToShow&&a("li",b.$dots).off("click.slick",b.changeSlide),b.options.dots===!0&&b.options.pauseOnDotsHover===!0&&b.options.autoplay===!0&&a("li",b.$dots).off("mouseenter.slick",a.proxy(b.setPaused,b,!0)).off("mouseleave.slick",a.proxy(b.setPaused,b,!1)),b.options.arrows===!0&&b.slideCount>b.options.slidesToShow&&(b.$prevArrow&&b.$prevArrow.off("click.slick",b.changeSlide),b.$nextArrow&&b.$nextArrow.off("click.slick",b.changeSlide)),b.$list.off("touchstart.slick mousedown.slick",b.swipeHandler),b.$list.off("touchmove.slick mousemove.slick",b.swipeHandler),b.$list.off("touchend.slick mouseup.slick",b.swipeHandler),b.$list.off("touchcancel.slick mouseleave.slick",b.swipeHandler),b.$list.off("click.slick",b.clickHandler),a(document).off(b.visibilityChange,b.visibility),b.$list.off("mouseenter.slick",a.proxy(b.setPaused,b,!0)),b.$list.off("mouseleave.slick",a.proxy(b.setPaused,b,!1)),b.options.accessibility===!0&&b.$list.off("keydown.slick",b.keyHandler),b.options.focusOnSelect===!0&&a(b.$slideTrack).children().off("click.slick",b.selectHandler),a(window).off("orientationchange.slick.slick-"+b.instanceUid,b.orientationChange),a(window).off("resize.slick.slick-"+b.instanceUid,b.resize),a("[draggable!=true]",b.$slideTrack).off("dragstart",b.preventDefault),a(window).off("load.slick.slick-"+b.instanceUid,b.setPosition),a(document).off("ready.slick.slick-"+b.instanceUid,b.setPosition)},b.prototype.cleanUpRows=function(){var b,a=this;a.options.rows>1&&(b=a.$slides.children().children(),b.removeAttr("style"),a.$slider.html(b))},b.prototype.clickHandler=function(a){var b=this;b.shouldClick===!1&&(a.stopImmediatePropagation(),a.stopPropagation(),a.preventDefault())},b.prototype.destroy=function(){var b=this;b.autoPlayClear(),b.touchObject={},b.cleanUpEvents(),a(".slick-cloned",b.$slider).detach(),b.$dots&&b.$dots.remove(),b.$prevArrow&&"object"!=typeof b.options.prevArrow&&b.$prevArrow.remove(),b.$nextArrow&&"object"!=typeof b.options.nextArrow&&b.$nextArrow.remove(),b.$slides&&(b.$slides.removeClass("slick-slide slick-active slick-center slick-visible").removeAttr("aria-hidden").removeAttr("data-slick-index").css({position:"",left:"",top:"",zIndex:"",opacity:"",width:""}),b.$slideTrack.children(this.options.slide).detach(),b.$slideTrack.detach(),b.$list.detach(),b.$slider.append(b.$slides)),b.cleanUpRows(),b.$slider.removeClass("slick-slider"),b.$slider.removeClass("slick-initialized"),b.unslicked=!0},b.prototype.disableTransition=function(a){var b=this,c={};c[b.transitionType]="",b.options.fade===!1?b.$slideTrack.css(c):b.$slides.eq(a).css(c)},b.prototype.fadeSlide=function(a,b){var c=this;c.cssTransitions===!1?(c.$slides.eq(a).css({zIndex:1e3}),c.$slides.eq(a).animate({opacity:1},c.options.speed,c.options.easing,b)):(c.applyTransition(a),c.$slides.eq(a).css({opacity:1,zIndex:1e3}),b&&setTimeout(function(){c.disableTransition(a),b.call()},c.options.speed))},b.prototype.filterSlides=b.prototype.slickFilter=function(a){var b=this;null!==a&&(b.unload(),b.$slideTrack.children(this.options.slide).detach(),b.$slidesCache.filter(a).appendTo(b.$slideTrack),b.reinit())},b.prototype.getCurrent=b.prototype.slickCurrentSlide=function(){var a=this;return a.currentSlide},b.prototype.getDotCount=function(){var a=this,b=0,c=0,d=0;if(a.options.infinite===!0)for(;b<a.slideCount;)++d,b=c+a.options.slidesToShow,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;else if(a.options.centerMode===!0)d=a.slideCount;else for(;b<a.slideCount;)++d,b=c+a.options.slidesToShow,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;return d-1},b.prototype.getLeft=function(a){var c,d,f,b=this,e=0;return b.slideOffset=0,d=b.$slides.first().outerHeight(),b.options.infinite===!0?(b.slideCount>b.options.slidesToShow&&(b.slideOffset=-1*b.slideWidth*b.options.slidesToShow,e=-1*d*b.options.slidesToShow),0!==b.slideCount%b.options.slidesToScroll&&a+b.options.slidesToScroll>b.slideCount&&b.slideCount>b.options.slidesToShow&&(a>b.slideCount?(b.slideOffset=-1*(b.options.slidesToShow-(a-b.slideCount))*b.slideWidth,e=-1*(b.options.slidesToShow-(a-b.slideCount))*d):(b.slideOffset=-1*b.slideCount%b.options.slidesToScroll*b.slideWidth,e=-1*b.slideCount%b.options.slidesToScroll*d))):a+b.options.slidesToShow>b.slideCount&&(b.slideOffset=(a+b.options.slidesToShow-b.slideCount)*b.slideWidth,e=(a+b.options.slidesToShow-b.slideCount)*d),b.slideCount<=b.options.slidesToShow&&(b.slideOffset=0,e=0),b.options.centerMode===!0&&b.options.infinite===!0?b.slideOffset+=b.slideWidth*Math.floor(b.options.slidesToShow/2)-b.slideWidth:b.options.centerMode===!0&&(b.slideOffset=0,b.slideOffset+=b.slideWidth*Math.floor(b.options.slidesToShow/2)),c=b.options.vertical===!1?-1*a*b.slideWidth+b.slideOffset:-1*a*d+e,b.options.variableWidth===!0&&(f=b.slideCount<=b.options.slidesToShow||b.options.infinite===!1?b.$slideTrack.children(".slick-slide").eq(a):b.$slideTrack.children(".slick-slide").eq(a+b.options.slidesToShow),c=f[0]?-1*f[0].offsetLeft:0,b.options.centerMode===!0&&(f=b.options.infinite===!1?b.$slideTrack.children(".slick-slide").eq(a):b.$slideTrack.children(".slick-slide").eq(a+b.options.slidesToShow+1),c=f[0]?-1*f[0].offsetLeft:0,c+=(b.$list.width()-f.outerWidth())/2)),c},b.prototype.getOption=b.prototype.slickGetOption=function(a){var b=this;return b.options[a]},b.prototype.getNavigableIndexes=function(){var e,a=this,b=0,c=0,d=[];for(a.options.infinite===!1?e=a.slideCount:(b=-1*a.options.slidesToScroll,c=-1*a.options.slidesToScroll,e=2*a.slideCount);e>b;)d.push(b),b=c+a.options.slidesToScroll,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;return d},b.prototype.getSlick=function(){return this},b.prototype.getSlideCount=function(){var c,d,e,b=this;return e=b.options.centerMode===!0?b.slideWidth*Math.floor(b.options.slidesToShow/2):0,b.options.swipeToSlide===!0?(b.$slideTrack.find(".slick-slide").each(function(c,f){return f.offsetLeft-e+a(f).outerWidth()/2>-1*b.swipeLeft?(d=f,!1):void 0}),c=Math.abs(a(d).attr("data-slick-index")-b.currentSlide)||1):b.options.slidesToScroll},b.prototype.goTo=b.prototype.slickGoTo=function(a,b){var c=this;c.changeSlide({data:{message:"index",index:parseInt(a)}},b)},b.prototype.init=function(b){var c=this;a(c.$slider).hasClass("slick-initialized")||(a(c.$slider).addClass("slick-initialized"),c.buildRows(),c.buildOut(),c.setProps(),c.startLoad(),c.loadSlider(),c.initializeEvents(),c.updateArrows(),c.updateDots()),b&&c.$slider.trigger("init",[c])},b.prototype.initArrowEvents=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.on("click.slick",{message:"previous"},a.changeSlide),a.$nextArrow.on("click.slick",{message:"next"},a.changeSlide))},b.prototype.initDotEvents=function(){var b=this;b.options.dots===!0&&b.slideCount>b.options.slidesToShow&&a("li",b.$dots).on("click.slick",{message:"index"},b.changeSlide),b.options.dots===!0&&b.options.pauseOnDotsHover===!0&&b.options.autoplay===!0&&a("li",b.$dots).on("mouseenter.slick",a.proxy(b.setPaused,b,!0)).on("mouseleave.slick",a.proxy(b.setPaused,b,!1))},b.prototype.initializeEvents=function(){var b=this;b.initArrowEvents(),b.initDotEvents(),b.$list.on("touchstart.slick mousedown.slick",{action:"start"},b.swipeHandler),b.$list.on("touchmove.slick mousemove.slick",{action:"move"},b.swipeHandler),b.$list.on("touchend.slick mouseup.slick",{action:"end"},b.swipeHandler),b.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},b.swipeHandler),b.$list.on("click.slick",b.clickHandler),a(document).on(b.visibilityChange,a.proxy(b.visibility,b)),b.$list.on("mouseenter.slick",a.proxy(b.setPaused,b,!0)),b.$list.on("mouseleave.slick",a.proxy(b.setPaused,b,!1)),b.options.accessibility===!0&&b.$list.on("keydown.slick",b.keyHandler),b.options.focusOnSelect===!0&&a(b.$slideTrack).children().on("click.slick",b.selectHandler),a(window).on("orientationchange.slick.slick-"+b.instanceUid,a.proxy(b.orientationChange,b)),a(window).on("resize.slick.slick-"+b.instanceUid,a.proxy(b.resize,b)),a("[draggable!=true]",b.$slideTrack).on("dragstart",b.preventDefault),a(window).on("load.slick.slick-"+b.instanceUid,b.setPosition),a(document).on("ready.slick.slick-"+b.instanceUid,b.setPosition)},b.prototype.initUI=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.show(),a.$nextArrow.show()),a.options.dots===!0&&a.slideCount>a.options.slidesToShow&&a.$dots.show(),a.options.autoplay===!0&&a.autoPlay()},b.prototype.keyHandler=function(a){var b=this;37===a.keyCode&&b.options.accessibility===!0?b.changeSlide({data:{message:"previous"}}):39===a.keyCode&&b.options.accessibility===!0&&b.changeSlide({data:{message:"next"}})},b.prototype.lazyLoad=function(){function g(b){a("img[data-lazy]",b).each(function(){var b=a(this),c=a(this).attr("data-lazy"),d=document.createElement("img");d.onload=function(){b.animate({opacity:1},200)},d.src=c,b.css({opacity:0}).attr("src",c).removeAttr("data-lazy").removeClass("slick-loading")})}var c,d,e,f,b=this;b.options.centerMode===!0?b.options.infinite===!0?(e=b.currentSlide+(b.options.slidesToShow/2+1),f=e+b.options.slidesToShow+2):(e=Math.max(0,b.currentSlide-(b.options.slidesToShow/2+1)),f=2+(b.options.slidesToShow/2+1)+b.currentSlide):(e=b.options.infinite?b.options.slidesToShow+b.currentSlide:b.currentSlide,f=e+b.options.slidesToShow,b.options.fade===!0&&(e>0&&e--,f<=b.slideCount&&f++)),c=b.$slider.find(".slick-slide").slice(e,f),g(c),b.slideCount<=b.options.slidesToShow?(d=b.$slider.find(".slick-slide"),g(d)):b.currentSlide>=b.slideCount-b.options.slidesToShow?(d=b.$slider.find(".slick-cloned").slice(0,b.options.slidesToShow),g(d)):0===b.currentSlide&&(d=b.$slider.find(".slick-cloned").slice(-1*b.options.slidesToShow),g(d))},b.prototype.loadSlider=function(){var a=this;a.setPosition(),a.$slideTrack.css({opacity:1}),a.$slider.removeClass("slick-loading"),a.initUI(),"progressive"===a.options.lazyLoad&&a.progressiveLazyLoad()},b.prototype.next=b.prototype.slickNext=function(){var a=this;a.changeSlide({data:{message:"next"}})},b.prototype.orientationChange=function(){var a=this;a.checkResponsive(),a.setPosition()},b.prototype.pause=b.prototype.slickPause=function(){var a=this;a.autoPlayClear(),a.paused=!0},b.prototype.play=b.prototype.slickPlay=function(){var a=this;a.paused=!1,a.autoPlay()},b.prototype.postSlide=function(a){var b=this;b.$slider.trigger("afterChange",[b,a]),b.animating=!1,b.setPosition(),b.swipeLeft=null,b.options.autoplay===!0&&b.paused===!1&&b.autoPlay()},b.prototype.prev=b.prototype.slickPrev=function(){var a=this;a.changeSlide({data:{message:"previous"}})},b.prototype.preventDefault=function(a){a.preventDefault()},b.prototype.progressiveLazyLoad=function(){var c,d,b=this;c=a("img[data-lazy]",b.$slider).length,c>0&&(d=a("img[data-lazy]",b.$slider).first(),d.attr("src",d.attr("data-lazy")).removeClass("slick-loading").load(function(){d.removeAttr("data-lazy"),b.progressiveLazyLoad(),b.options.adaptiveHeight===!0&&b.setPosition()}).error(function(){d.removeAttr("data-lazy"),b.progressiveLazyLoad()}))},b.prototype.refresh=function(){var b=this,c=b.currentSlide;b.destroy(),a.extend(b,b.initials),b.init(),b.changeSlide({data:{message:"index",index:c}},!1)},b.prototype.reinit=function(){var b=this;b.$slides=b.$slideTrack.children(b.options.slide).addClass("slick-slide"),b.slideCount=b.$slides.length,b.currentSlide>=b.slideCount&&0!==b.currentSlide&&(b.currentSlide=b.currentSlide-b.options.slidesToScroll),b.slideCount<=b.options.slidesToShow&&(b.currentSlide=0),b.setProps(),b.setupInfinite(),b.buildArrows(),b.updateArrows(),b.initArrowEvents(),b.buildDots(),b.updateDots(),b.initDotEvents(),b.options.focusOnSelect===!0&&a(b.$slideTrack).children().on("click.slick",b.selectHandler),b.setSlideClasses(0),b.setPosition(),b.$slider.trigger("reInit",[b])},b.prototype.resize=function(){var b=this;a(window).width()!==b.windowWidth&&(clearTimeout(b.windowDelay),b.windowDelay=window.setTimeout(function(){b.windowWidth=a(window).width(),b.checkResponsive(),b.setPosition()},50))},b.prototype.removeSlide=b.prototype.slickRemove=function(a,b,c){var d=this;return"boolean"==typeof a?(b=a,a=b===!0?0:d.slideCount-1):a=b===!0?--a:a,d.slideCount<1||0>a||a>d.slideCount-1?!1:(d.unload(),c===!0?d.$slideTrack.children().remove():d.$slideTrack.children(this.options.slide).eq(a).remove(),d.$slides=d.$slideTrack.children(this.options.slide),d.$slideTrack.children(this.options.slide).detach(),d.$slideTrack.append(d.$slides),d.$slidesCache=d.$slides,d.reinit(),void 0)},b.prototype.setCSS=function(a){var d,e,b=this,c={};b.options.rtl===!0&&(a=-a),d="left"==b.positionProp?Math.ceil(a)+"px":"0px",e="top"==b.positionProp?Math.ceil(a)+"px":"0px",c[b.positionProp]=a,b.transformsEnabled===!1?b.$slideTrack.css(c):(c={},b.cssTransitions===!1?(c[b.animType]="translate("+d+", "+e+")",b.$slideTrack.css(c)):(c[b.animType]="translate3d("+d+", "+e+", 0px)",b.$slideTrack.css(c)))},b.prototype.setDimensions=function(){var a=this;a.options.vertical===!1?a.options.centerMode===!0&&a.$list.css({padding:"0px "+a.options.centerPadding}):(a.$list.height(a.$slides.first().outerHeight(!0)*a.options.slidesToShow),a.options.centerMode===!0&&a.$list.css({padding:a.options.centerPadding+" 0px"})),a.listWidth=a.$list.width(),a.listHeight=a.$list.height(),a.options.vertical===!1&&a.options.variableWidth===!1?(a.slideWidth=Math.ceil(a.listWidth/a.options.slidesToShow),a.$slideTrack.width(Math.ceil(a.slideWidth*a.$slideTrack.children(".slick-slide").length))):a.options.variableWidth===!0?a.$slideTrack.width(5e3*a.slideCount):(a.slideWidth=Math.ceil(a.listWidth),a.$slideTrack.height(Math.ceil(a.$slides.first().outerHeight(!0)*a.$slideTrack.children(".slick-slide").length)));var b=a.$slides.first().outerWidth(!0)-a.$slides.first().width();a.options.variableWidth===!1&&a.$slideTrack.children(".slick-slide").width(a.slideWidth-b)},b.prototype.setFade=function(){var c,b=this;b.$slides.each(function(d,e){c=-1*b.slideWidth*d,b.options.rtl===!0?a(e).css({position:"relative",right:c,top:0,zIndex:800,opacity:0}):a(e).css({position:"relative",left:c,top:0,zIndex:800,opacity:0})}),b.$slides.eq(b.currentSlide).css({zIndex:900,opacity:1})},b.prototype.setHeight=function(){var a=this;if(1===a.options.slidesToShow&&a.options.adaptiveHeight===!0&&a.options.vertical===!1){var b=a.$slides.eq(a.currentSlide).outerHeight(!0);a.$list.css("height",b)}},b.prototype.setOption=b.prototype.slickSetOption=function(a,b,c){var d=this;d.options[a]=b,c===!0&&(d.unload(),d.reinit())},b.prototype.setPosition=function(){var a=this;a.setDimensions(),a.setHeight(),a.options.fade===!1?a.setCSS(a.getLeft(a.currentSlide)):a.setFade(),a.$slider.trigger("setPosition",[a])},b.prototype.setProps=function(){var a=this,b=document.body.style;a.positionProp=a.options.vertical===!0?"top":"left","top"===a.positionProp?a.$slider.addClass("slick-vertical"):a.$slider.removeClass("slick-vertical"),(void 0!==b.WebkitTransition||void 0!==b.MozTransition||void 0!==b.msTransition)&&a.options.useCSS===!0&&(a.cssTransitions=!0),void 0!==b.OTransform&&(a.animType="OTransform",a.transformType="-o-transform",a.transitionType="OTransition",void 0===b.perspectiveProperty&&void 0===b.webkitPerspective&&(a.animType=!1)),void 0!==b.MozTransform&&(a.animType="MozTransform",a.transformType="-moz-transform",a.transitionType="MozTransition",void 0===b.perspectiveProperty&&void 0===b.MozPerspective&&(a.animType=!1)),void 0!==b.webkitTransform&&(a.animType="webkitTransform",a.transformType="-webkit-transform",a.transitionType="webkitTransition",void 0===b.perspectiveProperty&&void 0===b.webkitPerspective&&(a.animType=!1)),void 0!==b.msTransform&&(a.animType="msTransform",a.transformType="-ms-transform",a.transitionType="msTransition",void 0===b.msTransform&&(a.animType=!1)),void 0!==b.transform&&a.animType!==!1&&(a.animType="transform",a.transformType="transform",a.transitionType="transition"),a.transformsEnabled=null!==a.animType&&a.animType!==!1},b.prototype.setSlideClasses=function(a){var c,d,e,f,b=this;b.$slider.find(".slick-slide").removeClass("slick-active").attr("aria-hidden","true").removeClass("slick-center"),d=b.$slider.find(".slick-slide"),b.options.centerMode===!0?(c=Math.floor(b.options.slidesToShow/2),b.options.infinite===!0&&(a>=c&&a<=b.slideCount-1-c?b.$slides.slice(a-c,a+c+1).addClass("slick-active").attr("aria-hidden","false"):(e=b.options.slidesToShow+a,d.slice(e-c+1,e+c+2).addClass("slick-active").attr("aria-hidden","false")),0===a?d.eq(d.length-1-b.options.slidesToShow).addClass("slick-center"):a===b.slideCount-1&&d.eq(b.options.slidesToShow).addClass("slick-center")),b.$slides.eq(a).addClass("slick-center")):a>=0&&a<=b.slideCount-b.options.slidesToShow?b.$slides.slice(a,a+b.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):d.length<=b.options.slidesToShow?d.addClass("slick-active").attr("aria-hidden","false"):(f=b.slideCount%b.options.slidesToShow,e=b.options.infinite===!0?b.options.slidesToShow+a:a,b.options.slidesToShow==b.options.slidesToScroll&&b.slideCount-a<b.options.slidesToShow?d.slice(e-(b.options.slidesToShow-f),e+f).addClass("slick-active").attr("aria-hidden","false"):d.slice(e,e+b.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false")),"ondemand"===b.options.lazyLoad&&b.lazyLoad()},b.prototype.setupInfinite=function(){var c,d,e,b=this;if(b.options.fade===!0&&(b.options.centerMode=!1),b.options.infinite===!0&&b.options.fade===!1&&(d=null,b.slideCount>b.options.slidesToShow)){for(e=b.options.centerMode===!0?b.options.slidesToShow+1:b.options.slidesToShow,c=b.slideCount;c>b.slideCount-e;c-=1)d=c-1,a(b.$slides[d]).clone(!0).attr("id","").attr("data-slick-index",d-b.slideCount).prependTo(b.$slideTrack).addClass("slick-cloned");for(c=0;e>c;c+=1)d=c,a(b.$slides[d]).clone(!0).attr("id","").attr("data-slick-index",d+b.slideCount).appendTo(b.$slideTrack).addClass("slick-cloned");b.$slideTrack.find(".slick-cloned").find("[id]").each(function(){a(this).attr("id","")})}},b.prototype.setPaused=function(a){var b=this;b.options.autoplay===!0&&b.options.pauseOnHover===!0&&(b.paused=a,a?b.autoPlayClear():b.autoPlay())},b.prototype.selectHandler=function(b){var c=this,d=a(b.target).is(".slick-slide")?a(b.target):a(b.target).parents(".slick-slide"),e=parseInt(d.attr("data-slick-index"));return e||(e=0),c.slideCount<=c.options.slidesToShow?(c.$slider.find(".slick-slide").removeClass("slick-active").attr("aria-hidden","true"),c.$slides.eq(e).addClass("slick-active").attr("aria-hidden","false"),c.options.centerMode===!0&&(c.$slider.find(".slick-slide").removeClass("slick-center"),c.$slides.eq(e).addClass("slick-center")),c.asNavFor(e),void 0):(c.slideHandler(e),void 0)},b.prototype.slideHandler=function(a,b,c){var d,e,f,g,h=null,i=this;return b=b||!1,i.animating===!0&&i.options.waitForAnimate===!0||i.options.fade===!0&&i.currentSlide===a||i.slideCount<=i.options.slidesToShow?void 0:(b===!1&&i.asNavFor(a),d=a,h=i.getLeft(d),g=i.getLeft(i.currentSlide),i.currentLeft=null===i.swipeLeft?g:i.swipeLeft,i.options.infinite===!1&&i.options.centerMode===!1&&(0>a||a>i.getDotCount()*i.options.slidesToScroll)?(i.options.fade===!1&&(d=i.currentSlide,c!==!0?i.animateSlide(g,function(){i.postSlide(d)}):i.postSlide(d)),void 0):i.options.infinite===!1&&i.options.centerMode===!0&&(0>a||a>i.slideCount-i.options.slidesToScroll)?(i.options.fade===!1&&(d=i.currentSlide,c!==!0?i.animateSlide(g,function(){i.postSlide(d)}):i.postSlide(d)),void 0):(i.options.autoplay===!0&&clearInterval(i.autoPlayTimer),e=0>d?0!==i.slideCount%i.options.slidesToScroll?i.slideCount-i.slideCount%i.options.slidesToScroll:i.slideCount+d:d>=i.slideCount?0!==i.slideCount%i.options.slidesToScroll?0:d-i.slideCount:d,i.animating=!0,i.$slider.trigger("beforeChange",[i,i.currentSlide,e]),f=i.currentSlide,i.currentSlide=e,i.setSlideClasses(i.currentSlide),i.updateDots(),i.updateArrows(),i.options.fade===!0?(c!==!0?i.fadeSlide(e,function(){i.postSlide(e)}):i.postSlide(e),i.animateHeight(),void 0):(c!==!0?i.animateSlide(h,function(){i.postSlide(e)}):i.postSlide(e),void 0)))},b.prototype.startLoad=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.hide(),a.$nextArrow.hide()),a.options.dots===!0&&a.slideCount>a.options.slidesToShow&&a.$dots.hide(),a.$slider.addClass("slick-loading")},b.prototype.swipeDirection=function(){var a,b,c,d,e=this;return a=e.touchObject.startX-e.touchObject.curX,b=e.touchObject.startY-e.touchObject.curY,c=Math.atan2(b,a),d=Math.round(180*c/Math.PI),0>d&&(d=360-Math.abs(d)),45>=d&&d>=0?e.options.rtl===!1?"left":"right":360>=d&&d>=315?e.options.rtl===!1?"left":"right":d>=135&&225>=d?e.options.rtl===!1?"right":"left":e.options.verticalSwiping===!0?d>=35&&135>=d?"left":"right":"vertical"},b.prototype.swipeEnd=function(){var c,b=this;if(b.dragging=!1,b.shouldClick=b.touchObject.swipeLength>10?!1:!0,void 0===b.touchObject.curX)return!1;if(b.touchObject.edgeHit===!0&&b.$slider.trigger("edge",[b,b.swipeDirection()]),b.touchObject.swipeLength>=b.touchObject.minSwipe)switch(b.swipeDirection()){case"left":c=b.options.swipeToSlide?b.checkNavigable(b.currentSlide+b.getSlideCount()):b.currentSlide+b.getSlideCount(),b.slideHandler(c),b.currentDirection=0,b.touchObject={},b.$slider.trigger("swipe",[b,"left"]);break;case"right":c=b.options.swipeToSlide?b.checkNavigable(b.currentSlide-b.getSlideCount()):b.currentSlide-b.getSlideCount(),b.slideHandler(c),b.currentDirection=1,b.touchObject={},b.$slider.trigger("swipe",[b,"right"])
}else b.touchObject.startX!==b.touchObject.curX&&(b.slideHandler(b.currentSlide),b.touchObject={})},b.prototype.swipeHandler=function(a){var b=this;if(!(b.options.swipe===!1||"ontouchend"in document&&b.options.swipe===!1||b.options.draggable===!1&&-1!==a.type.indexOf("mouse")))switch(b.touchObject.fingerCount=a.originalEvent&&void 0!==a.originalEvent.touches?a.originalEvent.touches.length:1,b.touchObject.minSwipe=b.listWidth/b.options.touchThreshold,b.options.verticalSwiping===!0&&(b.touchObject.minSwipe=b.listHeight/b.options.touchThreshold),a.data.action){case"start":b.swipeStart(a);break;case"move":b.swipeMove(a);break;case"end":b.swipeEnd(a)}},b.prototype.swipeMove=function(a){var d,e,f,g,h,b=this;return h=void 0!==a.originalEvent?a.originalEvent.touches:null,!b.dragging||h&&1!==h.length?!1:(d=b.getLeft(b.currentSlide),b.touchObject.curX=void 0!==h?h[0].pageX:a.clientX,b.touchObject.curY=void 0!==h?h[0].pageY:a.clientY,b.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(b.touchObject.curX-b.touchObject.startX,2))),b.options.verticalSwiping===!0&&(b.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(b.touchObject.curY-b.touchObject.startY,2)))),e=b.swipeDirection(),"vertical"!==e?(void 0!==a.originalEvent&&b.touchObject.swipeLength>4&&a.preventDefault(),g=(b.options.rtl===!1?1:-1)*(b.touchObject.curX>b.touchObject.startX?1:-1),b.options.verticalSwiping===!0&&(g=b.touchObject.curY>b.touchObject.startY?1:-1),f=b.touchObject.swipeLength,b.touchObject.edgeHit=!1,b.options.infinite===!1&&(0===b.currentSlide&&"right"===e||b.currentSlide>=b.getDotCount()&&"left"===e)&&(f=b.touchObject.swipeLength*b.options.edgeFriction,b.touchObject.edgeHit=!0),b.swipeLeft=b.options.vertical===!1?d+f*g:d+f*(b.$list.height()/b.listWidth)*g,b.options.verticalSwiping===!0&&(b.swipeLeft=d+f*g),b.options.fade===!0||b.options.touchMove===!1?!1:b.animating===!0?(b.swipeLeft=null,!1):(b.setCSS(b.swipeLeft),void 0)):void 0)},b.prototype.swipeStart=function(a){var c,b=this;return 1!==b.touchObject.fingerCount||b.slideCount<=b.options.slidesToShow?(b.touchObject={},!1):(void 0!==a.originalEvent&&void 0!==a.originalEvent.touches&&(c=a.originalEvent.touches[0]),b.touchObject.startX=b.touchObject.curX=void 0!==c?c.pageX:a.clientX,b.touchObject.startY=b.touchObject.curY=void 0!==c?c.pageY:a.clientY,b.dragging=!0,void 0)},b.prototype.unfilterSlides=b.prototype.slickUnfilter=function(){var a=this;null!==a.$slidesCache&&(a.unload(),a.$slideTrack.children(this.options.slide).detach(),a.$slidesCache.appendTo(a.$slideTrack),a.reinit())},b.prototype.unload=function(){var b=this;a(".slick-cloned",b.$slider).remove(),b.$dots&&b.$dots.remove(),b.$prevArrow&&"object"!=typeof b.options.prevArrow&&b.$prevArrow.remove(),b.$nextArrow&&"object"!=typeof b.options.nextArrow&&b.$nextArrow.remove(),b.$slides.removeClass("slick-slide slick-active slick-visible").attr("aria-hidden","true").css("width","")},b.prototype.unslick=function(a){var b=this;b.$slider.trigger("unslick",[b,a]),b.destroy()},b.prototype.updateArrows=function(){var b,a=this;b=Math.floor(a.options.slidesToShow/2),a.options.arrows===!0&&a.options.infinite!==!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.removeClass("slick-disabled"),a.$nextArrow.removeClass("slick-disabled"),0===a.currentSlide?(a.$prevArrow.addClass("slick-disabled"),a.$nextArrow.removeClass("slick-disabled")):a.currentSlide>=a.slideCount-a.options.slidesToShow&&a.options.centerMode===!1?(a.$nextArrow.addClass("slick-disabled"),a.$prevArrow.removeClass("slick-disabled")):a.currentSlide>=a.slideCount-1&&a.options.centerMode===!0&&(a.$nextArrow.addClass("slick-disabled"),a.$prevArrow.removeClass("slick-disabled")))},b.prototype.updateDots=function(){var a=this;null!==a.$dots&&(a.$dots.find("li").removeClass("slick-active").attr("aria-hidden","true"),a.$dots.find("li").eq(Math.floor(a.currentSlide/a.options.slidesToScroll)).addClass("slick-active").attr("aria-hidden","false"))},b.prototype.visibility=function(){var a=this;document[a.hidden]?(a.paused=!0,a.autoPlayClear()):a.options.autoplay===!0&&(a.paused=!1,a.autoPlay())},a.fn.slick=function(){var g,a=this,c=arguments[0],d=Array.prototype.slice.call(arguments,1),e=a.length,f=0;for(f;e>f;f++)if("object"==typeof c||"undefined"==typeof c?a[f].slick=new b(a[f],c):g=a[f].slick[c].apply(a[f].slick,d),"undefined"!=typeof g)return g;return a}});
// Freewall.js created by Minh Nguyen;
// version 1.05;
!function(a){function f(c){function l(b){j.gutterX,j.gutterY;var f=j.cellH,g=j.cellW,k=a(b),l=k.find(k.attr("data-handle"));d.setDraggable(b,{handle:l[0],onStart:function(a){i.animate&&d.transition&&d.setTransition(this,""),k.css("z-index",9999).addClass("fw-float"),i.onBlockDrag.call(b,a)},onDrag:function(a){var d=k.position(),e=Math.round(d.top/f),l=Math.round(d.left/g),m=Math.round(k.width()/g),n=Math.round(k.height()/f);e=Math.min(Math.max(0,e),j.limitRow-n),l=Math.min(Math.max(0,l),j.limitCol-m),h.setHoles({top:e,left:l,width:m,height:n}),h.refresh(),i.onBlockMove.call(b,a)},onDrop:function(c){var d=k.position(),e=Math.round(d.top/f),l=Math.round(d.left/g),m=Math.round(k.width()/g),n=Math.round(k.height()/f);e=Math.min(Math.max(0,e),j.limitRow-n),l=Math.min(Math.max(0,l),j.limitCol-m),k.removeClass("fw-float"),k.css({zIndex:"auto",top:e*f,left:l*g});var o,p,q,r;for(p=0;n>p;++p)for(o=0;m>o;++o)q=p+e+"-"+(o+l),r=j.matrix[q],r&&1!=r&&a("#"+r).removeAttr("data-position");j.holes={},k.attr({"data-width":k.width(),"data-height":k.height(),"data-position":e+"-"+l}),h.refresh(),i.onBlockDrop.call(b,c)}})}var f=a(c);"static"==f.css("position")&&f.css("position","relative");var g=Number.MAX_VALUE,h=this;d.totalGrid+=1;var i=a.extend({},d.defaultConfig),j={arguments:null,blocks:{},events:{},matrix:{},holes:{},cellW:0,cellH:0,cellS:1,filter:"",lastId:0,length:0,maxWoB:0,maxHoB:0,minWoB:g,minHoB:g,running:0,gutterX:15,gutterY:15,totalCol:0,totalRow:0,limitCol:666666,limitRow:666666,sortFunc:null,keepOrder:!1};i.runtime=j,j.totalGrid=d.totalGrid;var k=document.body.style;d.transition||(null!=k.webkitTransition||null!=k.MozTransition||null!=k.msTransition||null!=k.OTransition||null!=k.transition)&&(d.transition=!0),a.extend(h,{addCustomEvent:function(a,b){var c=j.events;return a=a.toLowerCase(),!c[a]&&(c[a]=[]),b.eid=c[a].length,c[a].push(b),this},appendBlock:function(b){var c=a(b).appendTo(f),g=null,h=[];j.arguments&&(a.isFunction(j.sortFunc)&&c.sort(j.sortFunc),c.each(function(a,b){b.index=++a,g=d.loadBlock(b,i),g&&h.push(g)}),e[i.engine](h,i),d.setWallSize(j,f),j.length=c.length,c.each(function(a,b){d.showBlock(b,i),(i.draggable||b.getAttribute("data-draggable"))&&l(b)}))},appendHoles:function(a){var d,b=[].concat(a),c={};for(d=0;d<b.length;++d)c=b[d],j.holes[c.top+"-"+c.left+"-"+c.width+"-"+c.height]=c;return this},container:f,destroy:function(){var b=f.find(i.selector).removeAttr("id");b.each(function(b,c){$item=a(c);var d=1*$item.attr("data-width")||"",e=1*$item.attr("data-height")||"";$item.width(d).height(e).css({position:"static"})})},fillHoles:function(a){if(0==arguments.length)j.holes={};else{var d,b=[].concat(a),c={};for(d=0;d<b.length;++d)c=b[d],delete j.holes[c.top+"-"+c.left+"-"+c.width+"-"+c.height]}return this},filter:function(a){return j.filter=a,j.arguments&&this.refresh(),this},fireEvent:function(a,b,c){var d=j.events;if(a=a.toLowerCase(),d[a]&&d[a].length)for(var e=0;e<d[a].length;++e)d[a][e].call(this,b,c);return this},fitHeight:function(a){var a=a?a:f.height()||b.height();this.fitZone("auto",a),j.arguments=arguments},fitWidth:function(a){var a=a?a:f.width()||b.width();this.fitZone(a,"auto"),j.arguments=arguments},fitZone:function(c,g){var k=f.find(i.selector).removeAttr("id"),m=null,n=[];g=g?g:f.height()||b.height(),c=c?c:f.width()||b.width(),j.arguments=arguments,d.resetGrid(j),d.adjustUnit(c,g,i),j.filter?(k.data("active",0),k.filter(j.filter).data("active",1)):k.data("active",1),a.isFunction(j.sortFunc)&&k.sort(j.sortFunc),k.each(function(b,c){var e=a(c);c.index=++b,m=d.loadBlock(c,i),m&&e.data("active")&&n.push(m)}),h.fireEvent("onGridReady",f,i),e[i.engine](n,i),d.setWallSize(j,f),h.fireEvent("onGridArrange",f,i),j.length=k.length,k.each(function(a,b){d.showBlock(b,i),(i.draggable||b.getAttribute("data-draggable"))&&l(b)})},fixPos:function(b){return a(b.block).attr({"data-position":b.top+"-"+b.left}),this},fixSize:function(b){return null!=b.height&&a(b.block).attr({"data-height":b.height}),null!=b.width&&a(b.block).attr({"data-width":b.width}),this},prepend:function(a){return f.prepend(a),j.arguments&&this.refresh(),this},refresh:function(){var a=arguments.length?arguments:j.arguments,b=j.arguments,c=b?b.callee:this.fitWidth;return c.apply(this,Array.prototype.slice.call(a,0)),this},reset:function(b){return a.extend(i,b),this},setHoles:function(a){var d,b=[].concat(a),c={};for(j.holes={},d=0;d<b.length;++d)c=b[d],j.holes[c.top+"-"+c.left+"-"+c.width+"-"+c.height]=c;return this},sortBy:function(a){return j.sortFunc=a,j.arguments&&this.refresh(),this},unFilter:function(){return delete j.filter,this.refresh(),this}}),f.attr("data-min-width",80*Math.floor(b.width()/80));for(var m in d.plugin)d.plugin.hasOwnProperty(m)&&d.plugin[m].call(h,i,f);b.resize(function(){j.running||(j.running=1,setTimeout(function(){j.running=0,i.onResize.call(h,f)},122),f.attr("data-min-width",80*Math.floor(b.width()/80)))})}null==a.isNumeric&&(a.isNumeric=function(a){return null!=a&&a.constructor===Number}),null==a.isFunction&&(a.isFunction=function(a){return null!=a&&a instanceof Function});var b=a(window),c=a(document),d={defaultConfig:{animate:!1,cellW:100,cellH:100,delay:0,engine:"giot",fixSize:null,gutterX:15,gutterY:15,keepOrder:!1,selector:"> div",draggable:!1,cacheSize:!0,rightToLeft:!1,bottomToTop:!1,onGapFound:function(){},onComplete:function(){},onResize:function(){},onBlockDrag:function(){},onBlockMove:function(){},onBlockDrop:function(){},onBlockReady:function(){},onBlockFinish:function(){},onBlockActive:function(){},onBlockResize:function(){}},plugin:{},totalGrid:1,transition:!1,loadBlock:function(b,c){var d=c.runtime,e=d.gutterX,f=d.gutterY,g=d.cellH,h=d.cellW,i=null,j=a(b),k=j.data("active"),l=j.attr("data-position"),m=parseInt(j.attr("data-fixSize")),n=d.lastId++ +"-"+d.totalGrid;if(j.hasClass("fw-float"))return null;j.attr({id:n,"data-delay":b.index}),c.animate&&this.transition&&this.setTransition(b,""),isNaN(m)&&(m=null),null==m&&(m=c.fixSize);var o=m?"ceil":"round";null==j.attr("data-height")&&j.attr("data-height",j.height()),null==j.attr("data-width")&&j.attr("data-width",j.width());var p=1*j.attr("data-height"),q=1*j.attr("data-width");c.cacheSize||(b.style.width="",q=j.width(),b.style.height="",p=j.height());var r=q?Math[o]((q+e)/h):0,s=p?Math[o]((p+f)/g):0;if(m||"auto"!=c.cellH||(j.width(h*r-e),b.style.height="",p=j.height(),s=p?Math.round((p+f)/g):0),m||"auto"!=c.cellW||(j.height(g*s-f),b.style.width="",q=j.width(),r=q?Math.round((q+e)/h):0),null!=m&&(r>d.limitCol||s>d.limitRow))i=null;else if(s&&s<d.minHoB&&(d.minHoB=s),r&&r<d.minWoB&&(d.minWoB=r),s>d.maxHoB&&(d.maxHoB=s),r>d.maxWoB&&(d.maxWoB=r),0==q&&(r=0),0==p&&(s=0),i={resize:!1,id:n,width:r,height:s,fixSize:m},l){l=l.split("-"),i.y=1*l[0],i.x=1*l[1],i.width=null!=m?r:Math.min(r,d.limitCol-i.x),i.height=null!=m?s:Math.min(s,d.limitRow-i.y);var t=i.y+"-"+i.x+"-"+i.width+"-"+i.height;k?(d.holes[t]={id:i.id,top:i.y,left:i.x,width:i.width,height:i.height},this.setBlock(i,c)):delete d.holes[t]}return null==j.attr("data-state")?j.attr("data-state","init"):j.attr("data-state","move"),c.onBlockReady.call(b,i,c),l&&k?null:i},setBlock:function(a,b){var c=b.runtime,d=c.gutterX,e=c.gutterY,f=a.height,g=a.width,h=c.cellH,i=c.cellW,j=a.x,k=a.y;b.rightToLeft&&(j=c.limitCol-j-g),b.bottomToTop&&(k=c.limitRow-k-f);var l={fixSize:a.fixSize,resize:a.resize,top:k*h,left:j*i,width:i*g-d,height:h*f-e};return l.top=1*l.top.toFixed(2),l.left=1*l.left.toFixed(2),l.width=1*l.width.toFixed(2),l.height=1*l.height.toFixed(2),a.id&&(c.blocks[a.id]=l),l},showBlock:function(b,c){function k(){if(i&&g.attr("data-state","start"),c.animate&&h.transition&&h.setTransition(b,j),f)f.fixSize&&(f.height=1*g.attr("data-height"),f.width=1*g.attr("data-width")),g.css({opacity:1,width:f.width,height:f.height}),g[e]({top:f.top,left:f.left}),null!=g.attr("data-nested")&&h.nestedGrid(b,c);else{var a=parseInt(b.style.height)||0,k=parseInt(b.style.width)||0,l=parseInt(b.style.left)||0,m=parseInt(b.style.top)||0;g[e]({left:l+k/2,top:m+a/2,width:0,height:0,opacity:0})}d.length-=1,c.onBlockFinish.call(b,f,c),0==d.length&&c.onComplete.call(b,f,c)}var d=c.runtime,e=c.animate&&!this.transition?"animate":"css",f=d.blocks[b.id],g=a(b),h=this,i="move"!=g.attr("data-state"),j=i?"width 0.5s, height 0.5s":"top 0.5s, left 0.5s, width 0.5s, height 0.5s, opacity 0.5s";b.delay&&clearTimeout(b.delay),g.hasClass("fw-float")||(h.setTransition(b,""),b.style.position="absolute",c.onBlockActive.call(b,f,c),f&&f.resize&&c.onBlockResize.call(b,f,c),c.delay>0?b.delay=setTimeout(k,c.delay*g.attr("data-delay")):k())},nestedGrid:function(b,c){var d,e=a(b),g=c.runtime,h=e.attr("data-gutterX")||c.gutterX,i=e.attr("data-gutterY")||c.gutterY,j=e.attr("data-method")||"fitZone",k=e.attr("data-nested")||"> div",l=e.attr("data-cellH")||c.cellH,m=e.attr("data-cellW")||c.cellW,n=g.blocks[b.id];if(n)switch(d=new f(e),d.reset({cellH:l,cellW:m,gutterX:1*h,gutterY:1*i,selector:k,cacheSize:!1}),j){case"fitHeight":d[j](n.height);break;case"fitWidth":d[j](n.width);break;case"fitZone":d[j](n.width,n.height)}},adjustBlock:function(b,c){var d=c.runtime,e=d.gutterX,f=d.gutterY,g=a("#"+b.id),h=d.cellH,i=d.cellW;"auto"==c.cellH&&(g.width(b.width*i-e),g[0].style.height="",b.height=Math.round((g.height()+f)/h))},adjustUnit:function(b,c,d){var e=d.gutterX,f=d.gutterY,g=d.runtime,h=d.cellW,i=d.cellH;if(a.isFunction(h)&&(h=h(b)),h=1*h,!a.isNumeric(h)&&(h=1),a.isFunction(i)&&(i=i(c)),i=1*i,!a.isNumeric(i)&&(i=1),a.isNumeric(b)){1>h&&(h*=b);var j=Math.max(1,Math.floor(b/h));a.isNumeric(e)||(e=(b-j*h)/Math.max(1,j-1),e=Math.max(0,e)),j=Math.floor((b+e)/h),g.cellW=(b+e)/Math.max(j,1),g.cellS=g.cellW/h,g.gutterX=e,g.limitCol=j}if(a.isNumeric(c)){1>i&&(i*=c);var k=Math.max(1,Math.floor(c/i));a.isNumeric(f)||(f=(c-k*i)/Math.max(1,k-1),f=Math.max(0,f)),k=Math.floor((c+f)/i),g.cellH=(c+f)/Math.max(k,1),g.cellS=g.cellH/i,g.gutterY=f,g.limitRow=k}a.isNumeric(b)||(1>h&&(h=g.cellH),g.cellW=1!=h?h*g.cellS:1,g.gutterX=e,g.limitCol=666666),a.isNumeric(c)||(1>i&&(i=g.cellW),g.cellH=1!=i?i*g.cellS:1,g.gutterY=f,g.limitRow=666666),g.keepOrder=d.keepOrder},resetGrid:function(a){a.blocks={},a.length=0,a.cellH=0,a.cellW=0,a.lastId=1,a.matrix={},a.totalCol=0,a.totalRow=0},setDraggable:function(b,d){var e=!1,f={startX:0,startY:0,top:0,left:0,handle:null,onDrop:function(){},onDrag:function(){},onStart:function(){}};a(b).each(function(){function l(a){return a.stopPropagation(),a=a.originalEvent,a.touches&&(e=!0,a=a.changedTouches[0]),2!=a.button&&3!=a.which&&(b.onStart.call(h,a),b.startX=a.clientX,b.startY=a.clientY,b.top=parseInt(i.css("top"))||0,b.left=parseInt(i.css("left"))||0,c.bind("mouseup touchend",n),c.bind("mousemove touchmove",m)),!1}function m(a){a=a.originalEvent,e&&(a=a.changedTouches[0]),i.css({top:b.top-(b.startY-a.clientY),left:b.left-(b.startX-a.clientX)}),b.onDrag.call(h,a)}function n(a){a=a.originalEvent,e&&(a=a.changedTouches[0]),b.onDrop.call(h,a),c.unbind("mouseup touchend",n),c.unbind("mousemove touchmove",m)}var b=a.extend({},f,d),g=b.handle||this,h=this,i=a(h),j=a(g),k=i.css("position");"absolute"!=k&&i.css("position","relative"),i.find("iframe, form, input, textarea, .ignore-drag").each(function(){a(this).on("touchstart mousedown",function(a){a.stopPropagation()})}),c.unbind("mouseup touchend",n),c.unbind("mousemove touchmove",m),j.unbind("mousedown touchstart").bind("mousedown touchstart",l)})},setTransition:function(b,c){var d=b.style,e=a(b);!this.transition&&e.stop?e.stop():null!=d.webkitTransition?d.webkitTransition=c:null!=d.MozTransition?d.MozTransition=c:null!=d.msTransition?d.msTransition=c:null!=d.OTransition?d.OTransition=c:d.transition=c},getFreeArea:function(a,b,c){for(var d=Math.min(a+c.maxHoB,c.limitRow),e=Math.min(b+c.maxWoB,c.limitCol),f=e,g=d,h=c.matrix,i=a;g>i;++i)for(var j=b;e>j;++j)h[i+"-"+j]&&j>b&&f>j&&(f=j);for(var i=a;d>i;++i)for(var j=b;f>j;++j)h[i+"-"+j]&&i>a&&g>i&&(g=i);return{top:a,left:b,width:f-b,height:g-a}},setWallSize:function(a,b){var c=a.totalRow,d=a.totalCol,e=a.gutterY,f=a.gutterX,g=a.cellH,h=a.cellW,i=Math.max(0,h*d-f),j=Math.max(0,g*c-e);b.attr({"data-total-col":d,"data-total-row":c,"data-wall-width":Math.ceil(i),"data-wall-height":Math.ceil(j)}),a.limitCol<a.limitRow&&!b.attr("data-height")&&b.height(Math.ceil(j))}},e={giot:function(a,b){function u(a,b,c,d,e){for(var f=b;b+e>f;){for(var g=c;c+d>g;)n[f+"-"+g]=a,++g>i&&(i=g);++f>j&&(j=f)}}var c=b.runtime,e=c.limitRow,f=c.limitCol,g=0,h=0,i=c.totalCol,j=c.totalRow,k={},l=c.holes,m=null,n=c.matrix,o=Math.max(f,e),p=null,q=null,r=e>f?1:0,s=null,t=Math.min(f,e);for(var v in l)l.hasOwnProperty(v)&&u(l[v].id||!0,l[v].top,l[v].left,l[v].width,l[v].height);for(var w=0;o>w&&a.length;++w){r?h=w:g=w,s=null;for(var x=0;t>x&&a.length;++x)if(m=null,r?g=x:h=x,!c.matrix[h+"-"+g]){if(p=d.getFreeArea(h,g,c),null==b.fixSize){if(s&&!r&&c.minHoB>p.height){s.height+=p.height,s.resize=!0,u(s.id,s.y,s.x,s.width,s.height),d.setBlock(s,b);continue}if(s&&r&&c.minWoB>p.width){s.width+=p.width,s.resize=!0,u(s.id,s.y,s.x,s.width,s.height),d.setBlock(s,b);continue}}if(c.keepOrder)m=a.shift(),m.resize=!0;else{for(var v=0;v<a.length;++v)if(!(a[v].height>p.height||a[v].width>p.width)){m=a.splice(v,1)[0];break}if(null==m&&null==b.fixSize)for(var v=0;v<a.length;++v)if(null==a[v].fixSize){m=a.splice(v,1)[0],m.resize=!0;break}}if(null!=m)m.resize&&(r?(m.width=p.width,"auto"==b.cellH&&d.adjustBlock(m,b),m.height=Math.min(m.height,p.height)):(m.height=p.height,m.width=Math.min(m.width,p.width))),k[m.id]={id:m.id,x:g,y:h,width:m.width,height:m.height,resize:m.resize,fixSize:m.fixSize},s=k[m.id],u(s.id,s.y,s.x,s.width,s.height),d.setBlock(s,b);else{var q={x:g,y:h,fixSize:0};if(r){q.width=p.width,q.height=0;for(var y=g-1,z=h;n[z+"-"+y];)n[z+"-"+g]=!0,q.height+=1,z+=1}else{q.height=p.height,q.width=0;for(var z=h-1,y=g;n[z+"-"+y];)n[h+"-"+y]=!0,q.width+=1,y+=1}b.onGapFound(d.setBlock(q,b),b)}}}c.matrix=n,c.totalRow=j,c.totalCol=i}};f.addConfig=function(b){a.extend(d.defaultConfig,b)},f.createEngine=function(b){a.extend(e,b)},f.createPlugin=function(b){a.extend(d.plugin,b)},f.getMethod=function(a){return d[a]},window.Freewall=window.freewall=f}(window.Zepto||window.jQuery);
/* qTip2 v2.2.1-14- | Plugins: None | Styles: core | qtip2.com | Licensed MIT | Sun Aug 09 2015 04:50:30 */
!function(a,b,c){!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):jQuery&&!jQuery.fn.qtip&&a(jQuery)}(function(d){"use strict";function e(a,b,c,e){this.id=c,this.target=a,this.tooltip=z,this.elements={target:a},this._id=I+"-"+c,this.timers={img:{}},this.options=b,this.plugins={},this.cache={event:{},target:d(),disabled:y,attr:e,onTooltip:y,lastClass:""},this.rendered=this.destroyed=this.disabled=this.waiting=this.hiddenDuringWait=this.positioning=this.triggering=y}function f(a){return a===z||"object"!==d.type(a)}function g(a){return!(d.isFunction(a)||a&&a.attr||a.length||"object"===d.type(a)&&(a.jquery||a.then))}function h(a){var b,c,e,h;return f(a)?y:(f(a.metadata)&&(a.metadata={type:a.metadata}),"content"in a&&(b=a.content,f(b)||b.jquery||b.done?b=a.content={text:c=g(b)?y:b}:c=b.text,"ajax"in b&&(e=b.ajax,h=e&&e.once!==y,delete b.ajax,b.text=function(a,b){var f=c||d(this).attr(b.options.content.attr)||"Loading...",g=d.ajax(d.extend({},e,{context:b})).then(e.success,z,e.error).then(function(a){return a&&h&&b.set("content.text",a),a},function(a,c,d){b.destroyed||0===a.status||b.set("content.text",c+": "+d)});return h?f:(b.set("content.text",f),g)}),"title"in b&&(d.isPlainObject(b.title)&&(b.button=b.title.button,b.title=b.title.text),g(b.title||y)&&(b.title=y))),"position"in a&&f(a.position)&&(a.position={my:a.position,at:a.position}),"show"in a&&f(a.show)&&(a.show=a.show.jquery?{target:a.show}:a.show===x?{ready:x}:{event:a.show}),"hide"in a&&f(a.hide)&&(a.hide=a.hide.jquery?{target:a.hide}:{event:a.hide}),"style"in a&&f(a.style)&&(a.style={classes:a.style}),d.each(H,function(){this.sanitize&&this.sanitize(a)}),a)}function i(a,b){for(var c,d=0,e=a,f=b.split(".");e=e[f[d++]];)d<f.length&&(c=e);return[c||a,f.pop()]}function j(a,b){var c,d,e;for(c in this.checks)for(d in this.checks[c])(e=new RegExp(d,"i").exec(a))&&(b.push(e),("builtin"===c||this.plugins[c])&&this.checks[c][d].apply(this.plugins[c]||this,b))}function k(a){return L.concat("").join(a?"-"+a+" ":" ")}function l(a,b){return b>0?setTimeout(d.proxy(a,this),b):void a.call(this)}function m(a){this.tooltip.hasClass(S)||(clearTimeout(this.timers.show),clearTimeout(this.timers.hide),this.timers.show=l.call(this,function(){this.toggle(x,a)},this.options.show.delay))}function n(a){if(!this.tooltip.hasClass(S)&&!this.destroyed){var b=d(a.relatedTarget),c=b.closest(M)[0]===this.tooltip[0],e=b[0]===this.options.show.target[0];if(clearTimeout(this.timers.show),clearTimeout(this.timers.hide),this!==b[0]&&"mouse"===this.options.position.target&&c||this.options.hide.fixed&&/mouse(out|leave|move)/.test(a.type)&&(c||e))try{a.preventDefault(),a.stopImmediatePropagation()}catch(f){}else this.timers.hide=l.call(this,function(){this.toggle(y,a)},this.options.hide.delay,this)}}function o(a){!this.tooltip.hasClass(S)&&this.options.hide.inactive&&(clearTimeout(this.timers.inactive),this.timers.inactive=l.call(this,function(){this.hide(a)},this.options.hide.inactive))}function p(a){this.rendered&&this.tooltip[0].offsetWidth>0&&this.reposition(a)}function q(a,c,e){d(b.body).delegate(a,(c.split?c:c.join("."+I+" "))+"."+I,function(){var a=s.api[d.attr(this,K)];a&&!a.disabled&&e.apply(a,arguments)})}function r(a,c,f){var g,i,j,k,l,m=d(b.body),n=a[0]===b?m:a,o=a.metadata?a.metadata(f.metadata):z,p="html5"===f.metadata.type&&o?o[f.metadata.name]:z,q=a.data(f.metadata.name||"qtipopts");try{q="string"==typeof q?d.parseJSON(q):q}catch(r){}if(k=d.extend(x,{},s.defaults,f,"object"==typeof q?h(q):z,h(p||o)),i=k.position,k.id=c,"boolean"==typeof k.content.text){if(j=a.attr(k.content.attr),k.content.attr===y||!j)return y;k.content.text=j}if(i.container.length||(i.container=m),i.target===y&&(i.target=n),k.show.target===y&&(k.show.target=n),k.show.solo===x&&(k.show.solo=i.container.closest("body")),k.hide.target===y&&(k.hide.target=n),k.position.viewport===x&&(k.position.viewport=i.container),i.container=i.container.eq(0),i.at=new u(i.at,x),i.my=new u(i.my),a.data(I))if(k.overwrite)a.qtip("destroy",!0);else if(k.overwrite===y)return y;return a.attr(J,c),k.suppress&&(l=a.attr("title"))&&a.removeAttr("title").attr(U,l).attr("title",""),g=new e(a,k,c,!!j),a.data(I,g),g}var s,t,u,v,w,x=!0,y=!1,z=null,A="x",B="y",C="top",D="left",E="bottom",F="right",G="center",H={},I="qtip",J="data-hasqtip",K="data-qtip-id",L=["ui-widget","ui-tooltip"],M="."+I,N="click dblclick mousedown mouseup mousemove mouseleave mouseenter".split(" "),O=I+"-fixed",P=I+"-default",Q=I+"-focus",R=I+"-hover",S=I+"-disabled",T="_replacedByqTip",U="oldtitle",V={ie:function(){for(var a=4,c=b.createElement("div");(c.innerHTML="<!--[if gt IE "+a+"]><i></i><![endif]-->")&&c.getElementsByTagName("i")[0];a+=1);return a>4?a:0/0}(),iOS:parseFloat((""+(/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent)||[0,""])[1]).replace("undefined","3_2").replace("_",".").replace("_",""))||y};t=e.prototype,t._when=function(a){return d.when.apply(d,a)},t.render=function(a){if(this.rendered||this.destroyed)return this;var b,c=this,e=this.options,f=this.cache,g=this.elements,h=e.content.text,i=e.content.title,j=e.content.button,k=e.position,l=("."+this._id+" ",[]);return d.attr(this.target[0],"aria-describedby",this._id),f.posClass=this._createPosClass((this.position={my:k.my,at:k.at}).my),this.tooltip=g.tooltip=b=d("<div/>",{id:this._id,"class":[I,P,e.style.classes,f.posClass].join(" "),width:e.style.width||"",height:e.style.height||"",tracking:"mouse"===k.target&&k.adjust.mouse,role:"alert","aria-live":"polite","aria-atomic":y,"aria-describedby":this._id+"-content","aria-hidden":x}).toggleClass(S,this.disabled).attr(K,this.id).data(I,this).appendTo(k.container).append(g.content=d("<div />",{"class":I+"-content",id:this._id+"-content","aria-atomic":x})),this.rendered=-1,this.positioning=x,i&&(this._createTitle(),d.isFunction(i)||l.push(this._updateTitle(i,y))),j&&this._createButton(),d.isFunction(h)||l.push(this._updateContent(h,y)),this.rendered=x,this._setWidget(),d.each(H,function(a){var b;"render"===this.initialize&&(b=this(c))&&(c.plugins[a]=b)}),this._unassignEvents(),this._assignEvents(),this._when(l).then(function(){c._trigger("render"),c.positioning=y,c.hiddenDuringWait||!e.show.ready&&!a||c.toggle(x,f.event,y),c.hiddenDuringWait=y}),s.api[this.id]=this,this},t.destroy=function(a){function b(){if(!this.destroyed){this.destroyed=x;var a,b=this.target,c=b.attr(U);this.rendered&&this.tooltip.stop(1,0).find("*").remove().end().remove(),d.each(this.plugins,function(){this.destroy&&this.destroy()});for(a in this.timers)clearTimeout(this.timers[a]);b.removeData(I).removeAttr(K).removeAttr(J).removeAttr("aria-describedby"),this.options.suppress&&c&&b.attr("title",c).removeAttr(U),this._unassignEvents(),this.options=this.elements=this.cache=this.timers=this.plugins=this.mouse=z,delete s.api[this.id]}}return this.destroyed?this.target:(a===x&&"hide"!==this.triggering||!this.rendered?b.call(this):(this.tooltip.one("tooltiphidden",d.proxy(b,this)),!this.triggering&&this.hide()),this.target)},v=t.checks={builtin:{"^id$":function(a,b,c,e){var f=c===x?s.nextid:c,g=I+"-"+f;f!==y&&f.length>0&&!d("#"+g).length?(this._id=g,this.rendered&&(this.tooltip[0].id=this._id,this.elements.content[0].id=this._id+"-content",this.elements.title[0].id=this._id+"-title")):a[b]=e},"^prerender":function(a,b,c){c&&!this.rendered&&this.render(this.options.show.ready)},"^content.text$":function(a,b,c){this._updateContent(c)},"^content.attr$":function(a,b,c,d){this.options.content.text===this.target.attr(d)&&this._updateContent(this.target.attr(c))},"^content.title$":function(a,b,c){return c?(c&&!this.elements.title&&this._createTitle(),void this._updateTitle(c)):this._removeTitle()},"^content.button$":function(a,b,c){this._updateButton(c)},"^content.title.(text|button)$":function(a,b,c){this.set("content."+b,c)},"^position.(my|at)$":function(a,b,c){"string"==typeof c&&(this.position[b]=a[b]=new u(c,"at"===b))},"^position.container$":function(a,b,c){this.rendered&&this.tooltip.appendTo(c)},"^show.ready$":function(a,b,c){c&&(!this.rendered&&this.render(x)||this.toggle(x))},"^style.classes$":function(a,b,c,d){this.rendered&&this.tooltip.removeClass(d).addClass(c)},"^style.(width|height)":function(a,b,c){this.rendered&&this.tooltip.css(b,c)},"^style.widget|content.title":function(){this.rendered&&this._setWidget()},"^style.def":function(a,b,c){this.rendered&&this.tooltip.toggleClass(P,!!c)},"^events.(render|show|move|hide|focus|blur)$":function(a,b,c){this.rendered&&this.tooltip[(d.isFunction(c)?"":"un")+"bind"]("tooltip"+b,c)},"^(show|hide|position).(event|target|fixed|inactive|leave|distance|viewport|adjust)":function(){if(this.rendered){var a=this.options.position;this.tooltip.attr("tracking","mouse"===a.target&&a.adjust.mouse),this._unassignEvents(),this._assignEvents()}}}},t.get=function(a){if(this.destroyed)return this;var b=i(this.options,a.toLowerCase()),c=b[0][b[1]];return c.precedance?c.string():c};var W=/^position\.(my|at|adjust|target|container|viewport)|style|content|show\.ready/i,X=/^prerender|show\.ready/i;t.set=function(a,b){if(this.destroyed)return this;{var c,e=this.rendered,f=y,g=this.options;this.checks}return"string"==typeof a?(c=a,a={},a[c]=b):a=d.extend({},a),d.each(a,function(b,c){if(e&&X.test(b))return void delete a[b];var h,j=i(g,b.toLowerCase());h=j[0][j[1]],j[0][j[1]]=c&&c.nodeType?d(c):c,f=W.test(b)||f,a[b]=[j[0],j[1],c,h]}),h(g),this.positioning=x,d.each(a,d.proxy(j,this)),this.positioning=y,this.rendered&&this.tooltip[0].offsetWidth>0&&f&&this.reposition("mouse"===g.position.target?z:this.cache.event),this},t._update=function(a,b){var c=this,e=this.cache;return this.rendered&&a?(d.isFunction(a)&&(a=a.call(this.elements.target,e.event,this)||""),d.isFunction(a.then)?(e.waiting=x,a.then(function(a){return e.waiting=y,c._update(a,b)},z,function(a){return c._update(a,b)})):a===y||!a&&""!==a?y:(a.jquery&&a.length>0?b.empty().append(a.css({display:"block",visibility:"visible"})):b.html(a),this._waitForContent(b).then(function(a){c.rendered&&c.tooltip[0].offsetWidth>0&&c.reposition(e.event,!a.length)}))):y},t._waitForContent=function(a){var b=this.cache;return b.waiting=x,(d.fn.imagesLoaded?a.imagesLoaded():d.Deferred().resolve([])).done(function(){b.waiting=y}).promise()},t._updateContent=function(a,b){this._update(a,this.elements.content,b)},t._updateTitle=function(a,b){this._update(a,this.elements.title,b)===y&&this._removeTitle(y)},t._createTitle=function(){var a=this.elements,b=this._id+"-title";a.titlebar&&this._removeTitle(),a.titlebar=d("<div />",{"class":I+"-titlebar "+(this.options.style.widget?k("header"):"")}).append(a.title=d("<div />",{id:b,"class":I+"-title","aria-atomic":x})).insertBefore(a.content).delegate(".qtip-close","mousedown keydown mouseup keyup mouseout",function(a){d(this).toggleClass("ui-state-active ui-state-focus","down"===a.type.substr(-4))}).delegate(".qtip-close","mouseover mouseout",function(a){d(this).toggleClass("ui-state-hover","mouseover"===a.type)}),this.options.content.button&&this._createButton()},t._removeTitle=function(a){var b=this.elements;b.title&&(b.titlebar.remove(),b.titlebar=b.title=b.button=z,a!==y&&this.reposition())},t._createPosClass=function(a){return I+"-pos-"+(a||this.options.position.my).abbrev()},t.reposition=function(c,e){if(!this.rendered||this.positioning||this.destroyed)return this;this.positioning=x;var f,g,h,i,j=this.cache,k=this.tooltip,l=this.options.position,m=l.target,n=l.my,o=l.at,p=l.viewport,q=l.container,r=l.adjust,s=r.method.split(" "),t=k.outerWidth(y),u=k.outerHeight(y),v=0,w=0,z=k.css("position"),A={left:0,top:0},B=k[0].offsetWidth>0,I=c&&"scroll"===c.type,J=d(a),K=q[0].ownerDocument,L=this.mouse;if(d.isArray(m)&&2===m.length)o={x:D,y:C},A={left:m[0],top:m[1]};else if("mouse"===m)o={x:D,y:C},(!r.mouse||this.options.hide.distance)&&j.origin&&j.origin.pageX?c=j.origin:!c||c&&("resize"===c.type||"scroll"===c.type)?c=j.event:L&&L.pageX&&(c=L),"static"!==z&&(A=q.offset()),K.body.offsetWidth!==(a.innerWidth||K.documentElement.clientWidth)&&(g=d(b.body).offset()),A={left:c.pageX-A.left+(g&&g.left||0),top:c.pageY-A.top+(g&&g.top||0)},r.mouse&&I&&L&&(A.left-=(L.scrollX||0)-J.scrollLeft(),A.top-=(L.scrollY||0)-J.scrollTop());else{if("event"===m?c&&c.target&&"scroll"!==c.type&&"resize"!==c.type?j.target=d(c.target):c.target||(j.target=this.elements.target):"event"!==m&&(j.target=d(m.jquery?m:this.elements.target)),m=j.target,m=d(m).eq(0),0===m.length)return this;m[0]===b||m[0]===a?(v=V.iOS?a.innerWidth:m.width(),w=V.iOS?a.innerHeight:m.height(),m[0]===a&&(A={top:(p||m).scrollTop(),left:(p||m).scrollLeft()})):H.imagemap&&m.is("area")?f=H.imagemap(this,m,o,H.viewport?s:y):H.svg&&m&&m[0].ownerSVGElement?f=H.svg(this,m,o,H.viewport?s:y):(v=m.outerWidth(y),w=m.outerHeight(y),A=m.offset()),f&&(v=f.width,w=f.height,g=f.offset,A=f.position),A=this.reposition.offset(m,A,q),(V.iOS>3.1&&V.iOS<4.1||V.iOS>=4.3&&V.iOS<4.33||!V.iOS&&"fixed"===z)&&(A.left-=J.scrollLeft(),A.top-=J.scrollTop()),(!f||f&&f.adjustable!==y)&&(A.left+=o.x===F?v:o.x===G?v/2:0,A.top+=o.y===E?w:o.y===G?w/2:0)}return A.left+=r.x+(n.x===F?-t:n.x===G?-t/2:0),A.top+=r.y+(n.y===E?-u:n.y===G?-u/2:0),H.viewport?(h=A.adjusted=H.viewport(this,A,l,v,w,t,u),g&&h.left&&(A.left+=g.left),g&&h.top&&(A.top+=g.top),h.my&&(this.position.my=h.my)):A.adjusted={left:0,top:0},j.posClass!==(i=this._createPosClass(this.position.my))&&k.removeClass(j.posClass).addClass(j.posClass=i),this._trigger("move",[A,p.elem||p],c)?(delete A.adjusted,e===y||!B||isNaN(A.left)||isNaN(A.top)||"mouse"===m||!d.isFunction(l.effect)?k.css(A):d.isFunction(l.effect)&&(l.effect.call(k,this,d.extend({},A)),k.queue(function(a){d(this).css({opacity:"",height:""}),V.ie&&this.style.removeAttribute("filter"),a()})),this.positioning=y,this):this},t.reposition.offset=function(a,c,e){function f(a,b){c.left+=b*a.scrollLeft(),c.top+=b*a.scrollTop()}if(!e[0])return c;var g,h,i,j,k=d(a[0].ownerDocument),l=!!V.ie&&"CSS1Compat"!==b.compatMode,m=e[0];do"static"!==(h=d.css(m,"position"))&&("fixed"===h?(i=m.getBoundingClientRect(),f(k,-1)):(i=d(m).position(),i.left+=parseFloat(d.css(m,"borderLeftWidth"))||0,i.top+=parseFloat(d.css(m,"borderTopWidth"))||0),c.left-=i.left+(parseFloat(d.css(m,"marginLeft"))||0),c.top-=i.top+(parseFloat(d.css(m,"marginTop"))||0),g||"hidden"===(j=d.css(m,"overflow"))||"visible"===j||(g=d(m)));while(m=m.offsetParent);return g&&(g[0]!==k[0]||l)&&f(g,1),c};var Y=(u=t.reposition.Corner=function(a,b){a=(""+a).replace(/([A-Z])/," $1").replace(/middle/gi,G).toLowerCase(),this.x=(a.match(/left|right/i)||a.match(/center/)||["inherit"])[0].toLowerCase(),this.y=(a.match(/top|bottom|center/i)||["inherit"])[0].toLowerCase(),this.forceY=!!b;var c=a.charAt(0);this.precedance="t"===c||"b"===c?B:A}).prototype;Y.invert=function(a,b){this[a]=this[a]===D?F:this[a]===F?D:b||this[a]},Y.string=function(a){var b=this.x,c=this.y,d=b!==c?"center"===b||"center"!==c&&(this.precedance===B||this.forceY)?[c,b]:[b,c]:[b];return a!==!1?d.join(" "):d},Y.abbrev=function(){var a=this.string(!1);return a[0].charAt(0)+(a[1]&&a[1].charAt(0)||"")},Y.clone=function(){return new u(this.string(),this.forceY)},t.toggle=function(a,c){var e=this.cache,f=this.options,g=this.tooltip;if(c){if(/over|enter/.test(c.type)&&e.event&&/out|leave/.test(e.event.type)&&f.show.target.add(c.target).length===f.show.target.length&&g.has(c.relatedTarget).length)return this;e.event=d.event.fix(c)}if(this.waiting&&!a&&(this.hiddenDuringWait=x),!this.rendered)return a?this.render(1):this;if(this.destroyed||this.disabled)return this;var h,i,j,k=a?"show":"hide",l=this.options[k],m=(this.options[a?"hide":"show"],this.options.position),n=this.options.content,o=this.tooltip.css("width"),p=this.tooltip.is(":visible"),q=a||1===l.target.length,r=!c||l.target.length<2||e.target[0]===c.target;return(typeof a).search("boolean|number")&&(a=!p),h=!g.is(":animated")&&p===a&&r,i=h?z:!!this._trigger(k,[90]),this.destroyed?this:(i!==y&&a&&this.focus(c),!i||h?this:(d.attr(g[0],"aria-hidden",!a),a?(this.mouse&&(e.origin=d.event.fix(this.mouse)),d.isFunction(n.text)&&this._updateContent(n.text,y),d.isFunction(n.title)&&this._updateTitle(n.title,y),!w&&"mouse"===m.target&&m.adjust.mouse&&(d(b).bind("mousemove."+I,this._storeMouse),w=x),o||g.css("width",g.outerWidth(y)),this.reposition(c,arguments[2]),o||g.css("width",""),l.solo&&("string"==typeof l.solo?d(l.solo):d(M,l.solo)).not(g).not(l.target).qtip("hide",d.Event("tooltipsolo"))):(clearTimeout(this.timers.show),delete e.origin,w&&!d(M+'[tracking="true"]:visible',l.solo).not(g).length&&(d(b).unbind("mousemove."+I),w=y),this.blur(c)),j=d.proxy(function(){a?(V.ie&&g[0].style.removeAttribute("filter"),g.css("overflow",""),"string"==typeof l.autofocus&&d(this.options.show.autofocus,g).focus(),this.options.show.target.trigger("qtip-"+this.id+"-inactive")):g.css({display:"",visibility:"",opacity:"",left:"",top:""}),this._trigger(a?"visible":"hidden")},this),l.effect===y||q===y?(g[k](),j()):d.isFunction(l.effect)?(g.stop(1,1),l.effect.call(g,this),g.queue("fx",function(a){j(),a()})):g.fadeTo(90,a?1:0,j),a&&l.target.trigger("qtip-"+this.id+"-inactive"),this))},t.show=function(a){return this.toggle(x,a)},t.hide=function(a){return this.toggle(y,a)},t.focus=function(a){if(!this.rendered||this.destroyed)return this;var b=d(M),c=this.tooltip,e=parseInt(c[0].style.zIndex,10),f=s.zindex+b.length;return c.hasClass(Q)||this._trigger("focus",[f],a)&&(e!==f&&(b.each(function(){this.style.zIndex>e&&(this.style.zIndex=this.style.zIndex-1)}),b.filter("."+Q).qtip("blur",a)),c.addClass(Q)[0].style.zIndex=f),this},t.blur=function(a){return!this.rendered||this.destroyed?this:(this.tooltip.removeClass(Q),this._trigger("blur",[this.tooltip.css("zIndex")],a),this)},t.disable=function(a){return this.destroyed?this:("toggle"===a?a=!(this.rendered?this.tooltip.hasClass(S):this.disabled):"boolean"!=typeof a&&(a=x),this.rendered&&this.tooltip.toggleClass(S,a).attr("aria-disabled",a),this.disabled=!!a,this)},t.enable=function(){return this.disable(y)},t._createButton=function(){var a=this,b=this.elements,c=b.tooltip,e=this.options.content.button,f="string"==typeof e,g=f?e:"Close tooltip";b.button&&b.button.remove(),b.button=e.jquery?e:d("<a />",{"class":"qtip-close "+(this.options.style.widget?"":I+"-icon"),title:g,"aria-label":g}).prepend(d("<span />",{"class":"ui-icon ui-icon-close",html:"&times;"})),b.button.appendTo(b.titlebar||c).attr("role","button").click(function(b){return c.hasClass(S)||a.hide(b),y})},t._updateButton=function(a){if(!this.rendered)return y;var b=this.elements.button;a?this._createButton():b.remove()},t._setWidget=function(){var a=this.options.style.widget,b=this.elements,c=b.tooltip,d=c.hasClass(S);c.removeClass(S),S=a?"ui-state-disabled":"qtip-disabled",c.toggleClass(S,d),c.toggleClass("ui-helper-reset "+k(),a).toggleClass(P,this.options.style.def&&!a),b.content&&b.content.toggleClass(k("content"),a),b.titlebar&&b.titlebar.toggleClass(k("header"),a),b.button&&b.button.toggleClass(I+"-icon",!a)},t._storeMouse=function(a){return(this.mouse=d.event.fix(a)).type="mousemove",this},t._bind=function(a,b,c,e,f){if(a&&c&&b.length){var g="."+this._id+(e?"-"+e:"");return d(a).bind((b.split?b:b.join(g+" "))+g,d.proxy(c,f||this)),this}},t._unbind=function(a,b){return a&&d(a).unbind("."+this._id+(b?"-"+b:"")),this},t._trigger=function(a,b,c){var e=d.Event("tooltip"+a);return e.originalEvent=c&&d.extend({},c)||this.cache.event||z,this.triggering=a,this.tooltip.trigger(e,[this].concat(b||[])),this.triggering=y,!e.isDefaultPrevented()},t._bindEvents=function(a,b,c,e,f,g){var h=c.filter(e).add(e.filter(c)),i=[];h.length&&(d.each(b,function(b,c){var e=d.inArray(c,a);e>-1&&i.push(a.splice(e,1)[0])}),i.length&&(this._bind(h,i,function(a){var b=this.rendered?this.tooltip[0].offsetWidth>0:!1;(b?g:f).call(this,a)}),c=c.not(h),e=e.not(h))),this._bind(c,a,f),this._bind(e,b,g)},t._assignInitialEvents=function(a){function b(a){return this.disabled||this.destroyed?y:(this.cache.event=a&&d.event.fix(a),this.cache.target=a&&d(a.target),clearTimeout(this.timers.show),void(this.timers.show=l.call(this,function(){this.render("object"==typeof a||c.show.ready)},c.prerender?0:c.show.delay)))}var c=this.options,e=c.show.target,f=c.hide.target,g=c.show.event?d.trim(""+c.show.event).split(" "):[],h=c.hide.event?d.trim(""+c.hide.event).split(" "):[];this._bind(this.elements.target,["remove","removeqtip"],function(){this.destroy(!0)},"destroy"),/mouse(over|enter)/i.test(c.show.event)&&!/mouse(out|leave)/i.test(c.hide.event)&&h.push("mouseleave"),this._bind(e,"mousemove",function(a){this._storeMouse(a),this.cache.onTarget=x}),this._bindEvents(g,h,e,f,b,function(){return this.timers?void clearTimeout(this.timers.show):y}),(c.show.ready||c.prerender)&&b.call(this,a)},t._assignEvents=function(){var c=this,e=this.options,f=e.position,g=this.tooltip,h=e.show.target,i=e.hide.target,j=f.container,k=f.viewport,l=d(b),q=(d(b.body),d(a)),r=e.show.event?d.trim(""+e.show.event).split(" "):[],t=e.hide.event?d.trim(""+e.hide.event).split(" "):[];d.each(e.events,function(a,b){c._bind(g,"toggle"===a?["tooltipshow","tooltiphide"]:["tooltip"+a],b,null,g)}),/mouse(out|leave)/i.test(e.hide.event)&&"window"===e.hide.leave&&this._bind(l,["mouseout","blur"],function(a){/select|option/.test(a.target.nodeName)||a.relatedTarget||this.hide(a)}),e.hide.fixed?i=i.add(g.addClass(O)):/mouse(over|enter)/i.test(e.show.event)&&this._bind(i,"mouseleave",function(){clearTimeout(this.timers.show)}),(""+e.hide.event).indexOf("unfocus")>-1&&this._bind(j.closest("html"),["mousedown","touchstart"],function(a){var b=d(a.target),c=this.rendered&&!this.tooltip.hasClass(S)&&this.tooltip[0].offsetWidth>0,e=b.parents(M).filter(this.tooltip[0]).length>0;b[0]===this.target[0]||b[0]===this.tooltip[0]||e||this.target.has(b[0]).length||!c||this.hide(a)}),"number"==typeof e.hide.inactive&&(this._bind(h,"qtip-"+this.id+"-inactive",o,"inactive"),this._bind(i.add(g),s.inactiveEvents,o)),this._bindEvents(r,t,h,i,m,n),this._bind(h.add(g),"mousemove",function(a){if("number"==typeof e.hide.distance){var b=this.cache.origin||{},c=this.options.hide.distance,d=Math.abs;(d(a.pageX-b.pageX)>=c||d(a.pageY-b.pageY)>=c)&&this.hide(a)}this._storeMouse(a)}),"mouse"===f.target&&f.adjust.mouse&&(e.hide.event&&this._bind(h,["mouseenter","mouseleave"],function(a){return this.cache?void(this.cache.onTarget="mouseenter"===a.type):y}),this._bind(l,"mousemove",function(a){this.rendered&&this.cache.onTarget&&!this.tooltip.hasClass(S)&&this.tooltip[0].offsetWidth>0&&this.reposition(a)})),(f.adjust.resize||k.length)&&this._bind(d.event.special.resize?k:q,"resize",p),f.adjust.scroll&&this._bind(q.add(f.container),"scroll",p)},t._unassignEvents=function(){var c=this.options,e=c.show.target,f=c.hide.target,g=d.grep([this.elements.target[0],this.rendered&&this.tooltip[0],c.position.container[0],c.position.viewport[0],c.position.container.closest("html")[0],a,b],function(a){return"object"==typeof a});e&&e.toArray&&(g=g.concat(e.toArray())),f&&f.toArray&&(g=g.concat(f.toArray())),this._unbind(g)._unbind(g,"destroy")._unbind(g,"inactive")},d(function(){q(M,["mouseenter","mouseleave"],function(a){var b="mouseenter"===a.type,c=d(a.currentTarget),e=d(a.relatedTarget||a.target),f=this.options;b?(this.focus(a),c.hasClass(O)&&!c.hasClass(S)&&clearTimeout(this.timers.hide)):"mouse"===f.position.target&&f.position.adjust.mouse&&f.hide.event&&f.show.target&&!e.closest(f.show.target[0]).length&&this.hide(a),c.toggleClass(R,b)}),q("["+K+"]",N,o)}),s=d.fn.qtip=function(a,b,e){var f=(""+a).toLowerCase(),g=z,i=d.makeArray(arguments).slice(1),j=i[i.length-1],k=this[0]?d.data(this[0],I):z;return!arguments.length&&k||"api"===f?k:"string"==typeof a?(this.each(function(){var a=d.data(this,I);if(!a)return x;if(j&&j.timeStamp&&(a.cache.event=j),!b||"option"!==f&&"options"!==f)a[f]&&a[f].apply(a,i);else{if(e===c&&!d.isPlainObject(b))return g=a.get(b),y;a.set(b,e)}}),g!==z?g:this):"object"!=typeof a&&arguments.length?void 0:(k=h(d.extend(x,{},a)),this.each(function(a){var b,c;return c=d.isArray(k.id)?k.id[a]:k.id,c=!c||c===y||c.length<1||s.api[c]?s.nextid++:c,b=r(d(this),c,k),b===y?x:(s.api[c]=b,d.each(H,function(){"initialize"===this.initialize&&this(b)}),void b._assignInitialEvents(j))}))},d.qtip=e,s.api={},d.each({attr:function(a,b){if(this.length){var c=this[0],e="title",f=d.data(c,"qtip");if(a===e&&f&&"object"==typeof f&&f.options.suppress)return arguments.length<2?d.attr(c,U):(f&&f.options.content.attr===e&&f.cache.attr&&f.set("content.text",b),this.attr(U,b))}return d.fn["attr"+T].apply(this,arguments)},clone:function(a){var b=(d([]),d.fn["clone"+T].apply(this,arguments));return a||b.filter("["+U+"]").attr("title",function(){return d.attr(this,U)}).removeAttr(U),b}},function(a,b){if(!b||d.fn[a+T])return x;var c=d.fn[a+T]=d.fn[a];d.fn[a]=function(){return b.apply(this,arguments)||c.apply(this,arguments)}}),d.ui||(d["cleanData"+T]=d.cleanData,d.cleanData=function(a){for(var b,c=0;(b=d(a[c])).length;c++)if(b.attr(J))try{b.triggerHandler("removeqtip")}catch(e){}d["cleanData"+T].apply(this,arguments)}),s.version="2.2.1-14-",s.nextid=0,s.inactiveEvents=N,s.zindex=15e3,s.defaults={prerender:y,id:y,overwrite:x,suppress:x,content:{text:x,attr:"title",title:y,button:y},position:{my:"top left",at:"bottom right",target:y,container:y,viewport:y,adjust:{x:0,y:0,mouse:x,scroll:x,resize:x,method:"flipinvert flipinvert"},effect:function(a,b){d(this).animate(b,{duration:200,queue:y})}},show:{target:y,event:"mouseenter",effect:x,delay:90,solo:y,ready:y,autofocus:y},hide:{target:y,event:"mouseleave",effect:x,delay:0,fixed:y,inactive:y,leave:"window",distance:y},style:{classes:"",widget:y,width:y,height:y,def:x},events:{render:z,move:z,show:z,hide:z,toggle:z,visible:z,hidden:z,focus:z,blur:z}}})}(window,document);
//! moment.js
//! version : 2.10.6
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.moment=t()}(this,function(){"use strict";function e(){return Js.apply(null,arguments)}function t(e){Js=e}function a(e){return"[object Array]"===Object.prototype.toString.call(e)}function n(e){return e instanceof Date||"[object Date]"===Object.prototype.toString.call(e)}function s(e,t){var a,n=[];for(a=0;a<e.length;++a)n.push(t(e[a],a));return n}function _(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function r(e,t){for(var a in t)_(t,a)&&(e[a]=t[a]);return _(t,"toString")&&(e.toString=t.toString),_(t,"valueOf")&&(e.valueOf=t.valueOf),e}function d(e,t,a,n){return Ht(e,t,a,n,!0).utc()}function i(){return{empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1}}function o(e){return null==e._pf&&(e._pf=i()),e._pf}function m(e){if(null==e._isValid){var t=o(e);e._isValid=!(isNaN(e._d.getTime())||!(t.overflow<0)||t.empty||t.invalidMonth||t.invalidWeekday||t.nullInput||t.invalidFormat||t.userInvalidated),e._strict&&(e._isValid=e._isValid&&0===t.charsLeftOver&&0===t.unusedTokens.length&&void 0===t.bigHour)}return e._isValid}function u(e){var t=d(0/0);return null!=e?r(o(t),e):o(t).userInvalidated=!0,t}function l(e,t){var a,n,s;if("undefined"!=typeof t._isAMomentObject&&(e._isAMomentObject=t._isAMomentObject),"undefined"!=typeof t._i&&(e._i=t._i),"undefined"!=typeof t._f&&(e._f=t._f),"undefined"!=typeof t._l&&(e._l=t._l),"undefined"!=typeof t._strict&&(e._strict=t._strict),"undefined"!=typeof t._tzm&&(e._tzm=t._tzm),"undefined"!=typeof t._isUTC&&(e._isUTC=t._isUTC),"undefined"!=typeof t._offset&&(e._offset=t._offset),"undefined"!=typeof t._pf&&(e._pf=o(t)),"undefined"!=typeof t._locale&&(e._locale=t._locale),Cs.length>0)for(a in Cs)n=Cs[a],s=t[n],"undefined"!=typeof s&&(e[n]=s);return e}function M(t){l(this,t),this._d=new Date(null!=t._d?t._d.getTime():0/0),Us===!1&&(Us=!0,e.updateOffset(this),Us=!1)}function L(e){return e instanceof M||null!=e&&null!=e._isAMomentObject}function h(e){return 0>e?Math.ceil(e):Math.floor(e)}function c(e){var t=+e,a=0;return 0!==t&&isFinite(t)&&(a=h(t)),a}function Y(e,t,a){var n,s=Math.min(e.length,t.length),_=Math.abs(e.length-t.length),r=0;for(n=0;s>n;n++)(a&&e[n]!==t[n]||!a&&c(e[n])!==c(t[n]))&&r++;return r+_}function y(){}function p(e){return e?e.toLowerCase().replace("_","-"):e}function f(e){for(var t,a,n,s,_=0;_<e.length;){for(s=p(e[_]).split("-"),t=s.length,a=p(e[_+1]),a=a?a.split("-"):null;t>0;){if(n=D(s.slice(0,t).join("-")))return n;if(a&&a.length>=t&&Y(s,a,!0)>=t-1)break;t--}_++}return null}function D(e){var t=null;if(!Ns[e]&&"undefined"!=typeof module&&module&&module.exports)try{t=Gs._abbr,require("./locale/"+e),k(t)}catch(a){}return Ns[e]}function k(e,t){var a;return e&&(a="undefined"==typeof t?g(e):T(e,t),a&&(Gs=a)),Gs._abbr}function T(e,t){return null!==t?(t.abbr=e,Ns[e]=Ns[e]||new y,Ns[e].set(t),k(e),Ns[e]):(delete Ns[e],null)}function g(e){var t;if(e&&e._locale&&e._locale._abbr&&(e=e._locale._abbr),!e)return Gs;if(!a(e)){if(t=D(e))return t;e=[e]}return f(e)}function w(e,t){var a=e.toLowerCase();Is[a]=Is[a+"s"]=Is[t]=e}function v(e){return"string"==typeof e?Is[e]||Is[e.toLowerCase()]:void 0}function S(e){var t,a,n={};for(a in e)_(e,a)&&(t=v(a),t&&(n[t]=e[a]));return n}function H(t,a){return function(n){return null!=n?(j(this,t,n),e.updateOffset(this,a),this):b(this,t)}}function b(e,t){return e._d["get"+(e._isUTC?"UTC":"")+t]()}function j(e,t,a){return e._d["set"+(e._isUTC?"UTC":"")+t](a)}function W(e,t){var a;if("object"==typeof e)for(a in e)this.set(a,e[a]);else if(e=v(e),"function"==typeof this[e])return this[e](t);return this}function x(e,t,a){var n=""+Math.abs(e),s=t-n.length,_=e>=0;return(_?a?"+":"":"-")+Math.pow(10,Math.max(0,s)).toString().substr(1)+n}function F(e,t,a,n){var s=n;"string"==typeof n&&(s=function(){return this[n]()}),e&&(Rs[e]=s),t&&(Rs[t[0]]=function(){return x(s.apply(this,arguments),t[1],t[2])}),a&&(Rs[a]=function(){return this.localeData().ordinal(s.apply(this,arguments),e)})}function A(e){return e.match(/\[[\s\S]/)?e.replace(/^\[|\]$/g,""):e.replace(/\\/g,"")}function P(e){var t,a,n=e.match(Vs);for(t=0,a=n.length;a>t;t++)n[t]=Rs[n[t]]?Rs[n[t]]:A(n[t]);return function(s){var _="";for(t=0;a>t;t++)_+=n[t]instanceof Function?n[t].call(s,e):n[t];return _}}function z(e,t){return e.isValid()?(t=E(t,e.localeData()),$s[t]=$s[t]||P(t),$s[t](e)):e.localeData().invalidDate()}function E(e,t){function a(e){return t.longDateFormat(e)||e}var n=5;for(Ks.lastIndex=0;n>=0&&Ks.test(e);)e=e.replace(Ks,a),Ks.lastIndex=0,n-=1;return e}function O(e){return"function"==typeof e&&"[object Function]"===Object.prototype.toString.call(e)}function J(e,t,a){o_[e]=O(t)?t:function(e){return e&&a?a:t}}function G(e,t){return _(o_,e)?o_[e](t._strict,t._locale):new RegExp(C(e))}function C(e){return e.replace("\\","").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(e,t,a,n,s){return t||a||n||s}).replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}function U(e,t){var a,n=t;for("string"==typeof e&&(e=[e]),"number"==typeof t&&(n=function(e,a){a[t]=c(e)}),a=0;a<e.length;a++)m_[e[a]]=n}function N(e,t){U(e,function(e,a,n,s){n._w=n._w||{},t(e,n._w,n,s)})}function I(e,t,a){null!=t&&_(m_,e)&&m_[e](t,a._a,a,e)}function V(e,t){return new Date(Date.UTC(e,t+1,0)).getUTCDate()}function K(e){return this._months[e.month()]}function $(e){return this._monthsShort[e.month()]}function R(e,t,a){var n,s,_;for(this._monthsParse||(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[]),n=0;12>n;n++){if(s=d([2e3,n]),a&&!this._longMonthsParse[n]&&(this._longMonthsParse[n]=new RegExp("^"+this.months(s,"").replace(".","")+"$","i"),this._shortMonthsParse[n]=new RegExp("^"+this.monthsShort(s,"").replace(".","")+"$","i")),a||this._monthsParse[n]||(_="^"+this.months(s,"")+"|^"+this.monthsShort(s,""),this._monthsParse[n]=new RegExp(_.replace(".",""),"i")),a&&"MMMM"===t&&this._longMonthsParse[n].test(e))return n;if(a&&"MMM"===t&&this._shortMonthsParse[n].test(e))return n;if(!a&&this._monthsParse[n].test(e))return n}}function Z(e,t){var a;return"string"==typeof t&&(t=e.localeData().monthsParse(t),"number"!=typeof t)?e:(a=Math.min(e.date(),V(e.year(),t)),e._d["set"+(e._isUTC?"UTC":"")+"Month"](t,a),e)}function q(t){return null!=t?(Z(this,t),e.updateOffset(this,!0),this):b(this,"Month")}function B(){return V(this.year(),this.month())}function X(e){var t,a=e._a;return a&&-2===o(e).overflow&&(t=a[l_]<0||a[l_]>11?l_:a[M_]<1||a[M_]>V(a[u_],a[l_])?M_:a[L_]<0||a[L_]>24||24===a[L_]&&(0!==a[h_]||0!==a[c_]||0!==a[Y_])?L_:a[h_]<0||a[h_]>59?h_:a[c_]<0||a[c_]>59?c_:a[Y_]<0||a[Y_]>999?Y_:-1,o(e)._overflowDayOfYear&&(u_>t||t>M_)&&(t=M_),o(e).overflow=t),e}function Q(t){e.suppressDeprecationWarnings===!1&&"undefined"!=typeof console&&console.warn&&console.warn("Deprecation warning: "+t)}function et(e,t){var a=!0;return r(function(){return a&&(Q(e+"\n"+(new Error).stack),a=!1),t.apply(this,arguments)},t)}function tt(e,t){f_[e]||(Q(t),f_[e]=!0)}function at(e){var t,a,n=e._i,s=D_.exec(n);if(s){for(o(e).iso=!0,t=0,a=k_.length;a>t;t++)if(k_[t][1].exec(n)){e._f=k_[t][0];break}for(t=0,a=T_.length;a>t;t++)if(T_[t][1].exec(n)){e._f+=(s[6]||" ")+T_[t][0];break}n.match(r_)&&(e._f+="Z"),Dt(e)}else e._isValid=!1}function nt(t){var a=g_.exec(t._i);return null!==a?void(t._d=new Date(+a[1])):(at(t),void(t._isValid===!1&&(delete t._isValid,e.createFromInputFallback(t))))}function st(e,t,a,n,s,_,r){var d=new Date(e,t,a,n,s,_,r);return 1970>e&&d.setFullYear(e),d}function _t(e){var t=new Date(Date.UTC.apply(null,arguments));return 1970>e&&t.setUTCFullYear(e),t}function rt(e){return dt(e)?366:365}function dt(e){return e%4===0&&e%100!==0||e%400===0}function it(){return dt(this.year())}function ot(e,t,a){var n,s=a-t,_=a-e.day();return _>s&&(_-=7),s-7>_&&(_+=7),n=bt(e).add(_,"d"),{week:Math.ceil(n.dayOfYear()/7),year:n.year()}}function mt(e){return ot(e,this._week.dow,this._week.doy).week}function ut(){return this._week.dow}function lt(){return this._week.doy}function Mt(e){var t=this.localeData().week(this);return null==e?t:this.add(7*(e-t),"d")}function Lt(e){var t=ot(this,1,4).week;return null==e?t:this.add(7*(e-t),"d")}function ht(e,t,a,n,s){var _,r=6+s-n,d=_t(e,0,1+r),i=d.getUTCDay();return s>i&&(i+=7),a=null!=a?1*a:s,_=1+r+7*(t-1)-i+a,{year:_>0?e:e-1,dayOfYear:_>0?_:rt(e-1)+_}}function ct(e){var t=Math.round((this.clone().startOf("day")-this.clone().startOf("year"))/864e5)+1;return null==e?t:this.add(e-t,"d")}function Yt(e,t,a){return null!=e?e:null!=t?t:a}function yt(e){var t=new Date;return e._useUTC?[t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate()]:[t.getFullYear(),t.getMonth(),t.getDate()]}function pt(e){var t,a,n,s,_=[];if(!e._d){for(n=yt(e),e._w&&null==e._a[M_]&&null==e._a[l_]&&ft(e),e._dayOfYear&&(s=Yt(e._a[u_],n[u_]),e._dayOfYear>rt(s)&&(o(e)._overflowDayOfYear=!0),a=_t(s,0,e._dayOfYear),e._a[l_]=a.getUTCMonth(),e._a[M_]=a.getUTCDate()),t=0;3>t&&null==e._a[t];++t)e._a[t]=_[t]=n[t];for(;7>t;t++)e._a[t]=_[t]=null==e._a[t]?2===t?1:0:e._a[t];24===e._a[L_]&&0===e._a[h_]&&0===e._a[c_]&&0===e._a[Y_]&&(e._nextDay=!0,e._a[L_]=0),e._d=(e._useUTC?_t:st).apply(null,_),null!=e._tzm&&e._d.setUTCMinutes(e._d.getUTCMinutes()-e._tzm),e._nextDay&&(e._a[L_]=24)}}function ft(e){var t,a,n,s,_,r,d;t=e._w,null!=t.GG||null!=t.W||null!=t.E?(_=1,r=4,a=Yt(t.GG,e._a[u_],ot(bt(),1,4).year),n=Yt(t.W,1),s=Yt(t.E,1)):(_=e._locale._week.dow,r=e._locale._week.doy,a=Yt(t.gg,e._a[u_],ot(bt(),_,r).year),n=Yt(t.w,1),null!=t.d?(s=t.d,_>s&&++n):s=null!=t.e?t.e+_:_),d=ht(a,n,s,r,_),e._a[u_]=d.year,e._dayOfYear=d.dayOfYear}function Dt(t){if(t._f===e.ISO_8601)return void at(t);t._a=[],o(t).empty=!0;var a,n,s,_,r,d=""+t._i,i=d.length,m=0;for(s=E(t._f,t._locale).match(Vs)||[],a=0;a<s.length;a++)_=s[a],n=(d.match(G(_,t))||[])[0],n&&(r=d.substr(0,d.indexOf(n)),r.length>0&&o(t).unusedInput.push(r),d=d.slice(d.indexOf(n)+n.length),m+=n.length),Rs[_]?(n?o(t).empty=!1:o(t).unusedTokens.push(_),I(_,n,t)):t._strict&&!n&&o(t).unusedTokens.push(_);o(t).charsLeftOver=i-m,d.length>0&&o(t).unusedInput.push(d),o(t).bigHour===!0&&t._a[L_]<=12&&t._a[L_]>0&&(o(t).bigHour=void 0),t._a[L_]=kt(t._locale,t._a[L_],t._meridiem),pt(t),X(t)}function kt(e,t,a){var n;return null==a?t:null!=e.meridiemHour?e.meridiemHour(t,a):null!=e.isPM?(n=e.isPM(a),n&&12>t&&(t+=12),n||12!==t||(t=0),t):t}function Tt(e){var t,a,n,s,_;if(0===e._f.length)return o(e).invalidFormat=!0,void(e._d=new Date(0/0));for(s=0;s<e._f.length;s++)_=0,t=l({},e),null!=e._useUTC&&(t._useUTC=e._useUTC),t._f=e._f[s],Dt(t),m(t)&&(_+=o(t).charsLeftOver,_+=10*o(t).unusedTokens.length,o(t).score=_,(null==n||n>_)&&(n=_,a=t));r(e,a||t)}function gt(e){if(!e._d){var t=S(e._i);e._a=[t.year,t.month,t.day||t.date,t.hour,t.minute,t.second,t.millisecond],pt(e)}}function wt(e){var t=new M(X(vt(e)));return t._nextDay&&(t.add(1,"d"),t._nextDay=void 0),t}function vt(e){var t=e._i,s=e._f;return e._locale=e._locale||g(e._l),null===t||void 0===s&&""===t?u({nullInput:!0}):("string"==typeof t&&(e._i=t=e._locale.preparse(t)),L(t)?new M(X(t)):(a(s)?Tt(e):s?Dt(e):n(t)?e._d=t:St(e),e))}function St(t){var _=t._i;void 0===_?t._d=new Date:n(_)?t._d=new Date(+_):"string"==typeof _?nt(t):a(_)?(t._a=s(_.slice(0),function(e){return parseInt(e,10)}),pt(t)):"object"==typeof _?gt(t):"number"==typeof _?t._d=new Date(_):e.createFromInputFallback(t)}function Ht(e,t,a,n,s){var _={};return"boolean"==typeof a&&(n=a,a=void 0),_._isAMomentObject=!0,_._useUTC=_._isUTC=s,_._l=a,_._i=e,_._f=t,_._strict=n,wt(_)}function bt(e,t,a,n){return Ht(e,t,a,n,!1)}function jt(e,t){var n,s;if(1===t.length&&a(t[0])&&(t=t[0]),!t.length)return bt();for(n=t[0],s=1;s<t.length;++s)(!t[s].isValid()||t[s][e](n))&&(n=t[s]);return n}function Wt(){var e=[].slice.call(arguments,0);return jt("isBefore",e)}function xt(){var e=[].slice.call(arguments,0);return jt("isAfter",e)}function Ft(e){var t=S(e),a=t.year||0,n=t.quarter||0,s=t.month||0,_=t.week||0,r=t.day||0,d=t.hour||0,i=t.minute||0,o=t.second||0,m=t.millisecond||0;this._milliseconds=+m+1e3*o+6e4*i+36e5*d,this._days=+r+7*_,this._months=+s+3*n+12*a,this._data={},this._locale=g(),this._bubble()}function At(e){return e instanceof Ft}function Pt(e,t){F(e,0,0,function(){var e=this.utcOffset(),a="+";return 0>e&&(e=-e,a="-"),a+x(~~(e/60),2)+t+x(~~e%60,2)})}function zt(e){var t=(e||"").match(r_)||[],a=t[t.length-1]||[],n=(a+"").match(b_)||["-",0,0],s=+(60*n[1])+c(n[2]);return"+"===n[0]?s:-s}function Et(t,a){var s,_;return a._isUTC?(s=a.clone(),_=(L(t)||n(t)?+t:+bt(t))-+s,s._d.setTime(+s._d+_),e.updateOffset(s,!1),s):bt(t).local()}function Ot(e){return 15*-Math.round(e._d.getTimezoneOffset()/15)}function Jt(t,a){var n,s=this._offset||0;return null!=t?("string"==typeof t&&(t=zt(t)),Math.abs(t)<16&&(t=60*t),!this._isUTC&&a&&(n=Ot(this)),this._offset=t,this._isUTC=!0,null!=n&&this.add(n,"m"),s!==t&&(!a||this._changeInProgress?ta(this,qt(t-s,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,e.updateOffset(this,!0),this._changeInProgress=null)),this):this._isUTC?s:Ot(this)}function Gt(e,t){return null!=e?("string"!=typeof e&&(e=-e),this.utcOffset(e,t),this):-this.utcOffset()}function Ct(e){return this.utcOffset(0,e)}function Ut(e){return this._isUTC&&(this.utcOffset(0,e),this._isUTC=!1,e&&this.subtract(Ot(this),"m")),this}function Nt(){return this._tzm?this.utcOffset(this._tzm):"string"==typeof this._i&&this.utcOffset(zt(this._i)),this}function It(e){return e=e?bt(e).utcOffset():0,(this.utcOffset()-e)%60===0}function Vt(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset()}function Kt(){if("undefined"!=typeof this._isDSTShifted)return this._isDSTShifted;var e={};if(l(e,this),e=vt(e),e._a){var t=e._isUTC?d(e._a):bt(e._a);this._isDSTShifted=this.isValid()&&Y(e._a,t.toArray())>0}else this._isDSTShifted=!1;return this._isDSTShifted}function $t(){return!this._isUTC}function Rt(){return this._isUTC}function Zt(){return this._isUTC&&0===this._offset}function qt(e,t){var a,n,s,r=e,d=null;return At(e)?r={ms:e._milliseconds,d:e._days,M:e._months}:"number"==typeof e?(r={},t?r[t]=e:r.milliseconds=e):(d=j_.exec(e))?(a="-"===d[1]?-1:1,r={y:0,d:c(d[M_])*a,h:c(d[L_])*a,m:c(d[h_])*a,s:c(d[c_])*a,ms:c(d[Y_])*a}):(d=W_.exec(e))?(a="-"===d[1]?-1:1,r={y:Bt(d[2],a),M:Bt(d[3],a),d:Bt(d[4],a),h:Bt(d[5],a),m:Bt(d[6],a),s:Bt(d[7],a),w:Bt(d[8],a)}):null==r?r={}:"object"==typeof r&&("from"in r||"to"in r)&&(s=Qt(bt(r.from),bt(r.to)),r={},r.ms=s.milliseconds,r.M=s.months),n=new Ft(r),At(e)&&_(e,"_locale")&&(n._locale=e._locale),n}function Bt(e,t){var a=e&&parseFloat(e.replace(",","."));return(isNaN(a)?0:a)*t}function Xt(e,t){var a={milliseconds:0,months:0};return a.months=t.month()-e.month()+12*(t.year()-e.year()),e.clone().add(a.months,"M").isAfter(t)&&--a.months,a.milliseconds=+t-+e.clone().add(a.months,"M"),a}function Qt(e,t){var a;return t=Et(t,e),e.isBefore(t)?a=Xt(e,t):(a=Xt(t,e),a.milliseconds=-a.milliseconds,a.months=-a.months),a}function ea(e,t){return function(a,n){var s,_;return null===n||isNaN(+n)||(tt(t,"moment()."+t+"(period, number) is deprecated. Please use moment()."+t+"(number, period)."),_=a,a=n,n=_),a="string"==typeof a?+a:a,s=qt(a,n),ta(this,s,e),this}}function ta(t,a,n,s){var _=a._milliseconds,r=a._days,d=a._months;s=null==s?!0:s,_&&t._d.setTime(+t._d+_*n),r&&j(t,"Date",b(t,"Date")+r*n),d&&Z(t,b(t,"Month")+d*n),s&&e.updateOffset(t,r||d)}function aa(e,t){var a=e||bt(),n=Et(a,this).startOf("day"),s=this.diff(n,"days",!0),_=-6>s?"sameElse":-1>s?"lastWeek":0>s?"lastDay":1>s?"sameDay":2>s?"nextDay":7>s?"nextWeek":"sameElse";return this.format(t&&t[_]||this.localeData().calendar(_,this,bt(a)))}function na(){return new M(this)}function sa(e,t){var a;return t=v("undefined"!=typeof t?t:"millisecond"),"millisecond"===t?(e=L(e)?e:bt(e),+this>+e):(a=L(e)?+e:+bt(e),a<+this.clone().startOf(t))}function _a(e,t){var a;return t=v("undefined"!=typeof t?t:"millisecond"),"millisecond"===t?(e=L(e)?e:bt(e),+e>+this):(a=L(e)?+e:+bt(e),+this.clone().endOf(t)<a)}function ra(e,t,a){return this.isAfter(e,a)&&this.isBefore(t,a)}function da(e,t){var a;return t=v(t||"millisecond"),"millisecond"===t?(e=L(e)?e:bt(e),+this===+e):(a=+bt(e),+this.clone().startOf(t)<=a&&a<=+this.clone().endOf(t))}function ia(e,t,a){var n,s,_=Et(e,this),r=6e4*(_.utcOffset()-this.utcOffset());return t=v(t),"year"===t||"month"===t||"quarter"===t?(s=oa(this,_),"quarter"===t?s/=3:"year"===t&&(s/=12)):(n=this-_,s="second"===t?n/1e3:"minute"===t?n/6e4:"hour"===t?n/36e5:"day"===t?(n-r)/864e5:"week"===t?(n-r)/6048e5:n),a?s:h(s)}function oa(e,t){var a,n,s=12*(t.year()-e.year())+(t.month()-e.month()),_=e.clone().add(s,"months");return 0>t-_?(a=e.clone().add(s-1,"months"),n=(t-_)/(_-a)):(a=e.clone().add(s+1,"months"),n=(t-_)/(a-_)),-(s+n)}function ma(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")}function ua(){var e=this.clone().utc();return 0<e.year()&&e.year()<=9999?"function"==typeof Date.prototype.toISOString?this.toDate().toISOString():z(e,"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"):z(e,"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")}function la(t){var a=z(this,t||e.defaultFormat);return this.localeData().postformat(a)}function Ma(e,t){return this.isValid()?qt({to:this,from:e}).locale(this.locale()).humanize(!t):this.localeData().invalidDate()}function La(e){return this.from(bt(),e)}function ha(e,t){return this.isValid()?qt({from:this,to:e}).locale(this.locale()).humanize(!t):this.localeData().invalidDate()}function ca(e){return this.to(bt(),e)}function Ya(e){var t;return void 0===e?this._locale._abbr:(t=g(e),null!=t&&(this._locale=t),this)}function ya(){return this._locale}function pa(e){switch(e=v(e)){case"year":this.month(0);case"quarter":case"month":this.date(1);case"week":case"isoWeek":case"day":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return"week"===e&&this.weekday(0),"isoWeek"===e&&this.isoWeekday(1),"quarter"===e&&this.month(3*Math.floor(this.month()/3)),this}function fa(e){return e=v(e),void 0===e||"millisecond"===e?this:this.startOf(e).add(1,"isoWeek"===e?"week":e).subtract(1,"ms")}function Da(){return+this._d-6e4*(this._offset||0)}function ka(){return Math.floor(+this/1e3)}function Ta(){return this._offset?new Date(+this):this._d}function ga(){var e=this;return[e.year(),e.month(),e.date(),e.hour(),e.minute(),e.second(),e.millisecond()]}function wa(){var e=this;return{years:e.year(),months:e.month(),date:e.date(),hours:e.hours(),minutes:e.minutes(),seconds:e.seconds(),milliseconds:e.milliseconds()}}function va(){return m(this)}function Sa(){return r({},o(this))}function Ha(){return o(this).overflow}function ba(e,t){F(0,[e,e.length],0,t)}function ja(e,t,a){return ot(bt([e,11,31+t-a]),t,a).week}function Wa(e){var t=ot(this,this.localeData()._week.dow,this.localeData()._week.doy).year;return null==e?t:this.add(e-t,"y")}function xa(e){var t=ot(this,1,4).year;return null==e?t:this.add(e-t,"y")}function Fa(){return ja(this.year(),1,4)}function Aa(){var e=this.localeData()._week;return ja(this.year(),e.dow,e.doy)}function Pa(e){return null==e?Math.ceil((this.month()+1)/3):this.month(3*(e-1)+this.month()%3)}function za(e,t){return"string"!=typeof e?e:isNaN(e)?(e=t.weekdaysParse(e),"number"==typeof e?e:null):parseInt(e,10)}function Ea(e){return this._weekdays[e.day()]}function Oa(e){return this._weekdaysShort[e.day()]}function Ja(e){return this._weekdaysMin[e.day()]}function Ga(e){var t,a,n;for(this._weekdaysParse=this._weekdaysParse||[],t=0;7>t;t++)if(this._weekdaysParse[t]||(a=bt([2e3,1]).day(t),n="^"+this.weekdays(a,"")+"|^"+this.weekdaysShort(a,"")+"|^"+this.weekdaysMin(a,""),this._weekdaysParse[t]=new RegExp(n.replace(".",""),"i")),this._weekdaysParse[t].test(e))return t}function Ca(e){var t=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=e?(e=za(e,this.localeData()),this.add(e-t,"d")):t}function Ua(e){var t=(this.day()+7-this.localeData()._week.dow)%7;return null==e?t:this.add(e-t,"d")}function Na(e){return null==e?this.day()||7:this.day(this.day()%7?e:e-7)}function Ia(e,t){F(e,0,0,function(){return this.localeData().meridiem(this.hours(),this.minutes(),t)})}function Va(e,t){return t._meridiemParse}function Ka(e){return"p"===(e+"").toLowerCase().charAt(0)}function $a(e,t,a){return e>11?a?"pm":"PM":a?"am":"AM"}function Ra(e,t){t[Y_]=c(1e3*("0."+e))}function Za(){return this._isUTC?"UTC":""}function qa(){return this._isUTC?"Coordinated Universal Time":""}function Ba(e){return bt(1e3*e)}function Xa(){return bt.apply(null,arguments).parseZone()}function Qa(e,t,a){var n=this._calendar[e];return"function"==typeof n?n.call(t,a):n}function en(e){var t=this._longDateFormat[e],a=this._longDateFormat[e.toUpperCase()];return t||!a?t:(this._longDateFormat[e]=a.replace(/MMMM|MM|DD|dddd/g,function(e){return e.slice(1)}),this._longDateFormat[e])}function tn(){return this._invalidDate}function an(e){return this._ordinal.replace("%d",e)}function nn(e){return e}function sn(e,t,a,n){var s=this._relativeTime[a];return"function"==typeof s?s(e,t,a,n):s.replace(/%d/i,e)}function _n(e,t){var a=this._relativeTime[e>0?"future":"past"];return"function"==typeof a?a(t):a.replace(/%s/i,t)}function rn(e){var t,a;for(a in e)t=e[a],"function"==typeof t?this[a]=t:this["_"+a]=t;this._ordinalParseLenient=new RegExp(this._ordinalParse.source+"|"+/\d{1,2}/.source)}function dn(e,t,a,n){var s=g(),_=d().set(n,t);return s[a](_,e)}function on(e,t,a,n,s){if("number"==typeof e&&(t=e,e=void 0),e=e||"",null!=t)return dn(e,t,a,s);var _,r=[];for(_=0;n>_;_++)r[_]=dn(e,_,a,s);return r}function mn(e,t){return on(e,t,"months",12,"month")}function un(e,t){return on(e,t,"monthsShort",12,"month")}function ln(e,t){return on(e,t,"weekdays",7,"day")}function Mn(e,t){return on(e,t,"weekdaysShort",7,"day")}function Ln(e,t){return on(e,t,"weekdaysMin",7,"day")}function hn(){var e=this._data;return this._milliseconds=er(this._milliseconds),this._days=er(this._days),this._months=er(this._months),e.milliseconds=er(e.milliseconds),e.seconds=er(e.seconds),e.minutes=er(e.minutes),e.hours=er(e.hours),e.months=er(e.months),e.years=er(e.years),this}function cn(e,t,a,n){var s=qt(t,a);return e._milliseconds+=n*s._milliseconds,e._days+=n*s._days,e._months+=n*s._months,e._bubble()}function Yn(e,t){return cn(this,e,t,1)}function yn(e,t){return cn(this,e,t,-1)}function pn(e){return 0>e?Math.floor(e):Math.ceil(e)}function fn(){var e,t,a,n,s,_=this._milliseconds,r=this._days,d=this._months,i=this._data;return _>=0&&r>=0&&d>=0||0>=_&&0>=r&&0>=d||(_+=864e5*pn(kn(d)+r),r=0,d=0),i.milliseconds=_%1e3,e=h(_/1e3),i.seconds=e%60,t=h(e/60),i.minutes=t%60,a=h(t/60),i.hours=a%24,r+=h(a/24),s=h(Dn(r)),d+=s,r-=pn(kn(s)),n=h(d/12),d%=12,i.days=r,i.months=d,i.years=n,this}function Dn(e){return 4800*e/146097}function kn(e){return 146097*e/4800}function Tn(e){var t,a,n=this._milliseconds;if(e=v(e),"month"===e||"year"===e)return t=this._days+n/864e5,a=this._months+Dn(t),"month"===e?a:a/12;switch(t=this._days+Math.round(kn(this._months)),e){case"week":return t/7+n/6048e5;case"day":return t+n/864e5;case"hour":return 24*t+n/36e5;case"minute":return 1440*t+n/6e4;case"second":return 86400*t+n/1e3;case"millisecond":return Math.floor(864e5*t)+n;default:throw new Error("Unknown unit "+e)}}function gn(){return this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*c(this._months/12)}function wn(e){return function(){return this.as(e)}}function vn(e){return e=v(e),this[e+"s"]()}function Sn(e){return function(){return this._data[e]}}function Hn(){return h(this.days()/7)}function bn(e,t,a,n,s){return s.relativeTime(t||1,!!a,e,n)}function jn(e,t,a){var n=qt(e).abs(),s=cr(n.as("s")),_=cr(n.as("m")),r=cr(n.as("h")),d=cr(n.as("d")),i=cr(n.as("M")),o=cr(n.as("y")),m=s<Yr.s&&["s",s]||1===_&&["m"]||_<Yr.m&&["mm",_]||1===r&&["h"]||r<Yr.h&&["hh",r]||1===d&&["d"]||d<Yr.d&&["dd",d]||1===i&&["M"]||i<Yr.M&&["MM",i]||1===o&&["y"]||["yy",o];return m[2]=t,m[3]=+e>0,m[4]=a,bn.apply(null,m)}function Wn(e,t){return void 0===Yr[e]?!1:void 0===t?Yr[e]:(Yr[e]=t,!0)}function xn(e){var t=this.localeData(),a=jn(this,!e,t);return e&&(a=t.pastFuture(+this,a)),t.postformat(a)}function Fn(){var e,t,a,n=yr(this._milliseconds)/1e3,s=yr(this._days),_=yr(this._months);e=h(n/60),t=h(e/60),n%=60,e%=60,a=h(_/12),_%=12;var r=a,d=_,i=s,o=t,m=e,u=n,l=this.asSeconds();return l?(0>l?"-":"")+"P"+(r?r+"Y":"")+(d?d+"M":"")+(i?i+"D":"")+(o||m||u?"T":"")+(o?o+"H":"")+(m?m+"M":"")+(u?u+"S":""):"P0D"}function An(e,t){var a=e.split("_");return t%10===1&&t%100!==11?a[0]:t%10>=2&&4>=t%10&&(10>t%100||t%100>=20)?a[1]:a[2]}function Pn(e,t,a){var n={mm:t?"хвіліна_хвіліны_хвілін":"хвіліну_хвіліны_хвілін",hh:t?"гадзіна_гадзіны_гадзін":"гадзіну_гадзіны_гадзін",dd:"дзень_дні_дзён",MM:"месяц_месяцы_месяцаў",yy:"год_гады_гадоў"};return"m"===a?t?"хвіліна":"хвіліну":"h"===a?t?"гадзіна":"гадзіну":e+" "+An(n[a],+e)}function zn(e,t){var a={nominative:"студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань".split("_"),accusative:"студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня".split("_")},n=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(t)?"accusative":"nominative";return a[n][e.month()]}function En(e,t){var a={nominative:"нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота".split("_"),accusative:"нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу".split("_")},n=/\[ ?[Вв] ?(?:мінулую|наступную)? ?\] ?dddd/.test(t)?"accusative":"nominative";return a[n][e.day()]}function On(e,t,a){var n={mm:"munutenn",MM:"miz",dd:"devezh"};return e+" "+Cn(n[a],e)}function Jn(e){switch(Gn(e)){case 1:case 3:case 4:case 5:case 9:return e+" bloaz";default:return e+" vloaz"}}function Gn(e){return e>9?Gn(e%10):e}function Cn(e,t){return 2===t?Un(e):e}function Un(e){var t={m:"v",b:"v",d:"z"};return void 0===t[e.charAt(0)]?e:t[e.charAt(0)]+e.substring(1)}function Nn(e,t,a){var n=e+" ";switch(a){case"m":return t?"jedna minuta":"jedne minute";case"mm":return n+=1===e?"minuta":2===e||3===e||4===e?"minute":"minuta";case"h":return t?"jedan sat":"jednog sata";case"hh":return n+=1===e?"sat":2===e||3===e||4===e?"sata":"sati";case"dd":return n+=1===e?"dan":"dana";case"MM":return n+=1===e?"mjesec":2===e||3===e||4===e?"mjeseca":"mjeseci";case"yy":return n+=1===e?"godina":2===e||3===e||4===e?"godine":"godina"}}function In(e){return e>1&&5>e&&1!==~~(e/10)}function Vn(e,t,a,n){var s=e+" ";switch(a){case"s":return t||n?"pár sekund":"pár sekundami";case"m":return t?"minuta":n?"minutu":"minutou";case"mm":return t||n?s+(In(e)?"minuty":"minut"):s+"minutami";case"h":return t?"hodina":n?"hodinu":"hodinou";case"hh":return t||n?s+(In(e)?"hodiny":"hodin"):s+"hodinami";case"d":return t||n?"den":"dnem";case"dd":return t||n?s+(In(e)?"dny":"dní"):s+"dny";case"M":return t||n?"měsíc":"měsícem";case"MM":return t||n?s+(In(e)?"měsíce":"měsíců"):s+"měsíci";case"y":return t||n?"rok":"rokem";case"yy":return t||n?s+(In(e)?"roky":"let"):s+"lety"}}function Kn(e,t,a){var n={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[e+" Tage",e+" Tagen"],M:["ein Monat","einem Monat"],MM:[e+" Monate",e+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[e+" Jahre",e+" Jahren"]};return t?n[a][0]:n[a][1]}function $n(e,t,a){var n={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[e+" Tage",e+" Tagen"],M:["ein Monat","einem Monat"],MM:[e+" Monate",e+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[e+" Jahre",e+" Jahren"]};return t?n[a][0]:n[a][1]}function Rn(e,t,a,n){var s={s:["mõne sekundi","mõni sekund","paar sekundit"],m:["ühe minuti","üks minut"],mm:[e+" minuti",e+" minutit"],h:["ühe tunni","tund aega","üks tund"],hh:[e+" tunni",e+" tundi"],d:["ühe päeva","üks päev"],M:["kuu aja","kuu aega","üks kuu"],MM:[e+" kuu",e+" kuud"],y:["ühe aasta","aasta","üks aasta"],yy:[e+" aasta",e+" aastat"]};return t?s[a][2]?s[a][2]:s[a][1]:n?s[a][0]:s[a][1]}function Zn(e,t,a,n){var s="";switch(a){case"s":return n?"muutaman sekunnin":"muutama sekunti";case"m":return n?"minuutin":"minuutti";case"mm":s=n?"minuutin":"minuuttia";break;case"h":return n?"tunnin":"tunti";case"hh":s=n?"tunnin":"tuntia";break;case"d":return n?"päivän":"päivä";case"dd":s=n?"päivän":"päivää";break;case"M":return n?"kuukauden":"kuukausi";case"MM":s=n?"kuukauden":"kuukautta";break;case"y":return n?"vuoden":"vuosi";case"yy":s=n?"vuoden":"vuotta"}return s=qn(e,n)+" "+s}function qn(e,t){return 10>e?t?Cr[e]:Gr[e]:e}function Bn(e,t,a){var n=e+" ";switch(a){case"m":return t?"jedna minuta":"jedne minute";case"mm":return n+=1===e?"minuta":2===e||3===e||4===e?"minute":"minuta";case"h":return t?"jedan sat":"jednog sata";case"hh":return n+=1===e?"sat":2===e||3===e||4===e?"sata":"sati";case"dd":return n+=1===e?"dan":"dana";case"MM":return n+=1===e?"mjesec":2===e||3===e||4===e?"mjeseca":"mjeseci";case"yy":return n+=1===e?"godina":2===e||3===e||4===e?"godine":"godina"}}function Xn(e,t,a,n){var s=e;switch(a){case"s":return n||t?"néhány másodperc":"néhány másodperce";case"m":return"egy"+(n||t?" perc":" perce");case"mm":return s+(n||t?" perc":" perce");case"h":return"egy"+(n||t?" óra":" órája");case"hh":return s+(n||t?" óra":" órája");case"d":return"egy"+(n||t?" nap":" napja");case"dd":return s+(n||t?" nap":" napja");case"M":return"egy"+(n||t?" hónap":" hónapja");case"MM":return s+(n||t?" hónap":" hónapja");case"y":return"egy"+(n||t?" év":" éve");case"yy":return s+(n||t?" év":" éve")}return""}function Qn(e){return(e?"":"[múlt] ")+"["+Kr[this.day()]+"] LT[-kor]"}function es(e,t){var a={nominative:"հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր".split("_"),accusative:"հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի".split("_")},n=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(t)?"accusative":"nominative";return a[n][e.month()]}function ts(e){var t="հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ".split("_");return t[e.month()]}function as(e){var t="կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ".split("_");return t[e.day()]}function ns(e){return e%100===11?!0:e%10===1?!1:!0}function ss(e,t,a,n){var s=e+" ";switch(a){case"s":return t||n?"nokkrar sekúndur":"nokkrum sekúndum";case"m":return t?"mínúta":"mínútu";case"mm":return ns(e)?s+(t||n?"mínútur":"mínútum"):t?s+"mínúta":s+"mínútu";case"hh":return ns(e)?s+(t||n?"klukkustundir":"klukkustundum"):s+"klukkustund";case"d":return t?"dagur":n?"dag":"degi";case"dd":return ns(e)?t?s+"dagar":s+(n?"daga":"dögum"):t?s+"dagur":s+(n?"dag":"degi");case"M":return t?"mánuður":n?"mánuð":"mánuði";case"MM":return ns(e)?t?s+"mánuðir":s+(n?"mánuði":"mánuðum"):t?s+"mánuður":s+(n?"mánuð":"mánuði");case"y":return t||n?"ár":"ári";case"yy":return ns(e)?s+(t||n?"ár":"árum"):s+(t||n?"ár":"ári")}}function _s(e,t){var a={nominative:"იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი".split("_"),accusative:"იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს".split("_")},n=/D[oD] *MMMM?/.test(t)?"accusative":"nominative";return a[n][e.month()]}function rs(e,t){var a={nominative:"კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი".split("_"),accusative:"კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს".split("_")},n=/(წინა|შემდეგ)/.test(t)?"accusative":"nominative";return a[n][e.day()]}function ds(e,t,a){var n={m:["eng Minutt","enger Minutt"],h:["eng Stonn","enger Stonn"],d:["een Dag","engem Dag"],M:["ee Mount","engem Mount"],y:["ee Joer","engem Joer"]};return t?n[a][0]:n[a][1]}function is(e){var t=e.substr(0,e.indexOf(" "));return ms(t)?"a "+e:"an "+e}function os(e){var t=e.substr(0,e.indexOf(" "));return ms(t)?"viru "+e:"virun "+e}function ms(e){if(e=parseInt(e,10),isNaN(e))return!1;if(0>e)return!0;if(10>e)return e>=4&&7>=e?!0:!1;if(100>e){var t=e%10,a=e/10;return ms(0===t?a:t)}if(1e4>e){for(;e>=10;)e/=10;return ms(e)
}return e/=1e3,ms(e)}function us(e,t,a,n){return t?"kelios sekundės":n?"kelių sekundžių":"kelias sekundes"}function ls(e,t){var a={nominative:"sausis_vasaris_kovas_balandis_gegužė_birželis_liepa_rugpjūtis_rugsėjis_spalis_lapkritis_gruodis".split("_"),accusative:"sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio".split("_")},n=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(t)?"accusative":"nominative";return a[n][e.month()]}function Ms(e,t,a,n){return t?hs(a)[0]:n?hs(a)[1]:hs(a)[2]}function Ls(e){return e%10===0||e>10&&20>e}function hs(e){return $r[e].split("_")}function cs(e,t,a,n){var s=e+" ";return 1===e?s+Ms(e,t,a[0],n):t?s+(Ls(e)?hs(a)[1]:hs(a)[0]):n?s+hs(a)[1]:s+(Ls(e)?hs(a)[1]:hs(a)[2])}function Ys(e,t){var a=-1===t.indexOf("dddd HH:mm"),n=Rr[e.day()];return a?n:n.substring(0,n.length-2)+"į"}function ys(e,t,a){return a?t%10===1&&11!==t?e[2]:e[3]:t%10===1&&11!==t?e[0]:e[1]}function ps(e,t,a){return e+" "+ys(Zr[a],e,t)}function fs(e,t,a){return ys(Zr[a],e,t)}function Ds(e,t){return t?"dažas sekundes":"dažām sekundēm"}function ks(e){return 5>e%10&&e%10>1&&~~(e/10)%10!==1}function Ts(e,t,a){var n=e+" ";switch(a){case"m":return t?"minuta":"minutę";case"mm":return n+(ks(e)?"minuty":"minut");case"h":return t?"godzina":"godzinę";case"hh":return n+(ks(e)?"godziny":"godzin");case"MM":return n+(ks(e)?"miesiące":"miesięcy");case"yy":return n+(ks(e)?"lata":"lat")}}function gs(e,t,a){var n={mm:"minute",hh:"ore",dd:"zile",MM:"luni",yy:"ani"},s=" ";return(e%100>=20||e>=100&&e%100===0)&&(s=" de "),e+s+n[a]}function ws(e,t){var a=e.split("_");return t%10===1&&t%100!==11?a[0]:t%10>=2&&4>=t%10&&(10>t%100||t%100>=20)?a[1]:a[2]}function vs(e,t,a){var n={mm:t?"минута_минуты_минут":"минуту_минуты_минут",hh:"час_часа_часов",dd:"день_дня_дней",MM:"месяц_месяца_месяцев",yy:"год_года_лет"};return"m"===a?t?"минута":"минуту":e+" "+ws(n[a],+e)}function Ss(e,t){var a={nominative:"январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),accusative:"января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split("_")},n=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(t)?"accusative":"nominative";return a[n][e.month()]}function Hs(e,t){var a={nominative:"янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек".split("_"),accusative:"янв_фев_мар_апр_мая_июня_июля_авг_сен_окт_ноя_дек".split("_")},n=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(t)?"accusative":"nominative";return a[n][e.month()]}function bs(e,t){var a={nominative:"воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split("_"),accusative:"воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу".split("_")},n=/\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/.test(t)?"accusative":"nominative";return a[n][e.day()]}function js(e){return e>1&&5>e}function Ws(e,t,a,n){var s=e+" ";switch(a){case"s":return t||n?"pár sekúnd":"pár sekundami";case"m":return t?"minúta":n?"minútu":"minútou";case"mm":return t||n?s+(js(e)?"minúty":"minút"):s+"minútami";case"h":return t?"hodina":n?"hodinu":"hodinou";case"hh":return t||n?s+(js(e)?"hodiny":"hodín"):s+"hodinami";case"d":return t||n?"deň":"dňom";case"dd":return t||n?s+(js(e)?"dni":"dní"):s+"dňami";case"M":return t||n?"mesiac":"mesiacom";case"MM":return t||n?s+(js(e)?"mesiace":"mesiacov"):s+"mesiacmi";case"y":return t||n?"rok":"rokom";case"yy":return t||n?s+(js(e)?"roky":"rokov"):s+"rokmi"}}function xs(e,t,a,n){var s=e+" ";switch(a){case"s":return t||n?"nekaj sekund":"nekaj sekundami";case"m":return t?"ena minuta":"eno minuto";case"mm":return s+=1===e?t?"minuta":"minuto":2===e?t||n?"minuti":"minutama":5>e?t||n?"minute":"minutami":t||n?"minut":"minutami";case"h":return t?"ena ura":"eno uro";case"hh":return s+=1===e?t?"ura":"uro":2===e?t||n?"uri":"urama":5>e?t||n?"ure":"urami":t||n?"ur":"urami";case"d":return t||n?"en dan":"enim dnem";case"dd":return s+=1===e?t||n?"dan":"dnem":2===e?t||n?"dni":"dnevoma":t||n?"dni":"dnevi";case"M":return t||n?"en mesec":"enim mesecem";case"MM":return s+=1===e?t||n?"mesec":"mesecem":2===e?t||n?"meseca":"mesecema":5>e?t||n?"mesece":"meseci":t||n?"mesecev":"meseci";case"y":return t||n?"eno leto":"enim letom";case"yy":return s+=1===e?t||n?"leto":"letom":2===e?t||n?"leti":"letoma":5>e?t||n?"leta":"leti":t||n?"let":"leti"}}function Fs(e,t,a,n){var s={s:["viensas secunds","'iensas secunds"],m:["'n míut","'iens míut"],mm:[e+" míuts"," "+e+" míuts"],h:["'n þora","'iensa þora"],hh:[e+" þoras"," "+e+" þoras"],d:["'n ziua","'iensa ziua"],dd:[e+" ziuas"," "+e+" ziuas"],M:["'n mes","'iens mes"],MM:[e+" mesen"," "+e+" mesen"],y:["'n ar","'iens ar"],yy:[e+" ars"," "+e+" ars"]};return n?s[a][0]:t?s[a][0]:s[a][1].trim()}function As(e,t){var a=e.split("_");return t%10===1&&t%100!==11?a[0]:t%10>=2&&4>=t%10&&(10>t%100||t%100>=20)?a[1]:a[2]}function Ps(e,t,a){var n={mm:"хвилина_хвилини_хвилин",hh:"година_години_годин",dd:"день_дні_днів",MM:"місяць_місяці_місяців",yy:"рік_роки_років"};return"m"===a?t?"хвилина":"хвилину":"h"===a?t?"година":"годину":e+" "+As(n[a],+e)}function zs(e,t){var a={nominative:"січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень".split("_"),accusative:"січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня".split("_")},n=/D[oD]? *MMMM?/.test(t)?"accusative":"nominative";return a[n][e.month()]}function Es(e,t){var a={nominative:"неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота".split("_"),accusative:"неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу".split("_"),genitive:"неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи".split("_")},n=/(\[[ВвУу]\]) ?dddd/.test(t)?"accusative":/\[?(?:минулої|наступної)? ?\] ?dddd/.test(t)?"genitive":"nominative";return a[n][e.day()]}function Os(e){return function(){return e+"о"+(11===this.hours()?"б":"")+"] LT"}}var Js,Gs,Cs=e.momentProperties=[],Us=!1,Ns={},Is={},Vs=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,Ks=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,$s={},Rs={},Zs=/\d/,qs=/\d\d/,Bs=/\d{3}/,Xs=/\d{4}/,Qs=/[+-]?\d{6}/,e_=/\d\d?/,t_=/\d{1,3}/,a_=/\d{1,4}/,n_=/[+-]?\d{1,6}/,s_=/\d+/,__=/[+-]?\d+/,r_=/Z|[+-]\d\d:?\d\d/gi,d_=/[+-]?\d+(\.\d{1,3})?/,i_=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,o_={},m_={},u_=0,l_=1,M_=2,L_=3,h_=4,c_=5,Y_=6;F("M",["MM",2],"Mo",function(){return this.month()+1}),F("MMM",0,0,function(e){return this.localeData().monthsShort(this,e)}),F("MMMM",0,0,function(e){return this.localeData().months(this,e)}),w("month","M"),J("M",e_),J("MM",e_,qs),J("MMM",i_),J("MMMM",i_),U(["M","MM"],function(e,t){t[l_]=c(e)-1}),U(["MMM","MMMM"],function(e,t,a,n){var s=a._locale.monthsParse(e,n,a._strict);null!=s?t[l_]=s:o(a).invalidMonth=e});var y_="January_February_March_April_May_June_July_August_September_October_November_December".split("_"),p_="Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),f_={};e.suppressDeprecationWarnings=!1;var D_=/^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,k_=[["YYYYYY-MM-DD",/[+-]\d{6}-\d{2}-\d{2}/],["YYYY-MM-DD",/\d{4}-\d{2}-\d{2}/],["GGGG-[W]WW-E",/\d{4}-W\d{2}-\d/],["GGGG-[W]WW",/\d{4}-W\d{2}/],["YYYY-DDD",/\d{4}-\d{3}/]],T_=[["HH:mm:ss.SSSS",/(T| )\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss",/(T| )\d\d:\d\d:\d\d/],["HH:mm",/(T| )\d\d:\d\d/],["HH",/(T| )\d\d/]],g_=/^\/?Date\((\-?\d+)/i;e.createFromInputFallback=et("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.",function(e){e._d=new Date(e._i+(e._useUTC?" UTC":""))}),F(0,["YY",2],0,function(){return this.year()%100}),F(0,["YYYY",4],0,"year"),F(0,["YYYYY",5],0,"year"),F(0,["YYYYYY",6,!0],0,"year"),w("year","y"),J("Y",__),J("YY",e_,qs),J("YYYY",a_,Xs),J("YYYYY",n_,Qs),J("YYYYYY",n_,Qs),U(["YYYYY","YYYYYY"],u_),U("YYYY",function(t,a){a[u_]=2===t.length?e.parseTwoDigitYear(t):c(t)}),U("YY",function(t,a){a[u_]=e.parseTwoDigitYear(t)}),e.parseTwoDigitYear=function(e){return c(e)+(c(e)>68?1900:2e3)};var w_=H("FullYear",!1);F("w",["ww",2],"wo","week"),F("W",["WW",2],"Wo","isoWeek"),w("week","w"),w("isoWeek","W"),J("w",e_),J("ww",e_,qs),J("W",e_),J("WW",e_,qs),N(["w","ww","W","WW"],function(e,t,a,n){t[n.substr(0,1)]=c(e)});var v_={dow:0,doy:6};F("DDD",["DDDD",3],"DDDo","dayOfYear"),w("dayOfYear","DDD"),J("DDD",t_),J("DDDD",Bs),U(["DDD","DDDD"],function(e,t,a){a._dayOfYear=c(e)}),e.ISO_8601=function(){};var S_=et("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548",function(){var e=bt.apply(null,arguments);return this>e?this:e}),H_=et("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548",function(){var e=bt.apply(null,arguments);return e>this?this:e});Pt("Z",":"),Pt("ZZ",""),J("Z",r_),J("ZZ",r_),U(["Z","ZZ"],function(e,t,a){a._useUTC=!0,a._tzm=zt(e)});var b_=/([\+\-]|\d\d)/gi;e.updateOffset=function(){};var j_=/(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,W_=/^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;qt.fn=Ft.prototype;var x_=ea(1,"add"),F_=ea(-1,"subtract");e.defaultFormat="YYYY-MM-DDTHH:mm:ssZ";var A_=et("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",function(e){return void 0===e?this.localeData():this.locale(e)});F(0,["gg",2],0,function(){return this.weekYear()%100}),F(0,["GG",2],0,function(){return this.isoWeekYear()%100}),ba("gggg","weekYear"),ba("ggggg","weekYear"),ba("GGGG","isoWeekYear"),ba("GGGGG","isoWeekYear"),w("weekYear","gg"),w("isoWeekYear","GG"),J("G",__),J("g",__),J("GG",e_,qs),J("gg",e_,qs),J("GGGG",a_,Xs),J("gggg",a_,Xs),J("GGGGG",n_,Qs),J("ggggg",n_,Qs),N(["gggg","ggggg","GGGG","GGGGG"],function(e,t,a,n){t[n.substr(0,2)]=c(e)}),N(["gg","GG"],function(t,a,n,s){a[s]=e.parseTwoDigitYear(t)}),F("Q",0,0,"quarter"),w("quarter","Q"),J("Q",Zs),U("Q",function(e,t){t[l_]=3*(c(e)-1)}),F("D",["DD",2],"Do","date"),w("date","D"),J("D",e_),J("DD",e_,qs),J("Do",function(e,t){return e?t._ordinalParse:t._ordinalParseLenient}),U(["D","DD"],M_),U("Do",function(e,t){t[M_]=c(e.match(e_)[0],10)});var P_=H("Date",!0);F("d",0,"do","day"),F("dd",0,0,function(e){return this.localeData().weekdaysMin(this,e)}),F("ddd",0,0,function(e){return this.localeData().weekdaysShort(this,e)}),F("dddd",0,0,function(e){return this.localeData().weekdays(this,e)}),F("e",0,0,"weekday"),F("E",0,0,"isoWeekday"),w("day","d"),w("weekday","e"),w("isoWeekday","E"),J("d",e_),J("e",e_),J("E",e_),J("dd",i_),J("ddd",i_),J("dddd",i_),N(["dd","ddd","dddd"],function(e,t,a){var n=a._locale.weekdaysParse(e);null!=n?t.d=n:o(a).invalidWeekday=e}),N(["d","e","E"],function(e,t,a,n){t[n]=c(e)});var z_="Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),E_="Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),O_="Su_Mo_Tu_We_Th_Fr_Sa".split("_");F("H",["HH",2],0,"hour"),F("h",["hh",2],0,function(){return this.hours()%12||12}),Ia("a",!0),Ia("A",!1),w("hour","h"),J("a",Va),J("A",Va),J("H",e_),J("h",e_),J("HH",e_,qs),J("hh",e_,qs),U(["H","HH"],L_),U(["a","A"],function(e,t,a){a._isPm=a._locale.isPM(e),a._meridiem=e}),U(["h","hh"],function(e,t,a){t[L_]=c(e),o(a).bigHour=!0});var J_=/[ap]\.?m?\.?/i,G_=H("Hours",!0);F("m",["mm",2],0,"minute"),w("minute","m"),J("m",e_),J("mm",e_,qs),U(["m","mm"],h_);var C_=H("Minutes",!1);F("s",["ss",2],0,"second"),w("second","s"),J("s",e_),J("ss",e_,qs),U(["s","ss"],c_);var U_=H("Seconds",!1);F("S",0,0,function(){return~~(this.millisecond()/100)}),F(0,["SS",2],0,function(){return~~(this.millisecond()/10)}),F(0,["SSS",3],0,"millisecond"),F(0,["SSSS",4],0,function(){return 10*this.millisecond()}),F(0,["SSSSS",5],0,function(){return 100*this.millisecond()}),F(0,["SSSSSS",6],0,function(){return 1e3*this.millisecond()}),F(0,["SSSSSSS",7],0,function(){return 1e4*this.millisecond()}),F(0,["SSSSSSSS",8],0,function(){return 1e5*this.millisecond()}),F(0,["SSSSSSSSS",9],0,function(){return 1e6*this.millisecond()}),w("millisecond","ms"),J("S",t_,Zs),J("SS",t_,qs),J("SSS",t_,Bs);var N_;for(N_="SSSS";N_.length<=9;N_+="S")J(N_,s_);for(N_="S";N_.length<=9;N_+="S")U(N_,Ra);var I_=H("Milliseconds",!1);F("z",0,0,"zoneAbbr"),F("zz",0,0,"zoneName");var V_=M.prototype;V_.add=x_,V_.calendar=aa,V_.clone=na,V_.diff=ia,V_.endOf=fa,V_.format=la,V_.from=Ma,V_.fromNow=La,V_.to=ha,V_.toNow=ca,V_.get=W,V_.invalidAt=Ha,V_.isAfter=sa,V_.isBefore=_a,V_.isBetween=ra,V_.isSame=da,V_.isValid=va,V_.lang=A_,V_.locale=Ya,V_.localeData=ya,V_.max=H_,V_.min=S_,V_.parsingFlags=Sa,V_.set=W,V_.startOf=pa,V_.subtract=F_,V_.toArray=ga,V_.toObject=wa,V_.toDate=Ta,V_.toISOString=ua,V_.toJSON=ua,V_.toString=ma,V_.unix=ka,V_.valueOf=Da,V_.year=w_,V_.isLeapYear=it,V_.weekYear=Wa,V_.isoWeekYear=xa,V_.quarter=V_.quarters=Pa,V_.month=q,V_.daysInMonth=B,V_.week=V_.weeks=Mt,V_.isoWeek=V_.isoWeeks=Lt,V_.weeksInYear=Aa,V_.isoWeeksInYear=Fa,V_.date=P_,V_.day=V_.days=Ca,V_.weekday=Ua,V_.isoWeekday=Na,V_.dayOfYear=ct,V_.hour=V_.hours=G_,V_.minute=V_.minutes=C_,V_.second=V_.seconds=U_,V_.millisecond=V_.milliseconds=I_,V_.utcOffset=Jt,V_.utc=Ct,V_.local=Ut,V_.parseZone=Nt,V_.hasAlignedHourOffset=It,V_.isDST=Vt,V_.isDSTShifted=Kt,V_.isLocal=$t,V_.isUtcOffset=Rt,V_.isUtc=Zt,V_.isUTC=Zt,V_.zoneAbbr=Za,V_.zoneName=qa,V_.dates=et("dates accessor is deprecated. Use date instead.",P_),V_.months=et("months accessor is deprecated. Use month instead",q),V_.years=et("years accessor is deprecated. Use year instead",w_),V_.zone=et("moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779",Gt);var K_=V_,$_={sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},R_={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},Z_="Invalid date",q_="%d",B_=/\d{1,2}/,X_={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},Q_=y.prototype;Q_._calendar=$_,Q_.calendar=Qa,Q_._longDateFormat=R_,Q_.longDateFormat=en,Q_._invalidDate=Z_,Q_.invalidDate=tn,Q_._ordinal=q_,Q_.ordinal=an,Q_._ordinalParse=B_,Q_.preparse=nn,Q_.postformat=nn,Q_._relativeTime=X_,Q_.relativeTime=sn,Q_.pastFuture=_n,Q_.set=rn,Q_.months=K,Q_._months=y_,Q_.monthsShort=$,Q_._monthsShort=p_,Q_.monthsParse=R,Q_.week=mt,Q_._week=v_,Q_.firstDayOfYear=lt,Q_.firstDayOfWeek=ut,Q_.weekdays=Ea,Q_._weekdays=z_,Q_.weekdaysMin=Ja,Q_._weekdaysMin=O_,Q_.weekdaysShort=Oa,Q_._weekdaysShort=E_,Q_.weekdaysParse=Ga,Q_.isPM=Ka,Q_._meridiemParse=J_,Q_.meridiem=$a,k("en",{ordinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(e){var t=e%10,a=1===c(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th";return e+a}}),e.lang=et("moment.lang is deprecated. Use moment.locale instead.",k),e.langData=et("moment.langData is deprecated. Use moment.localeData instead.",g);var er=Math.abs,tr=wn("ms"),ar=wn("s"),nr=wn("m"),sr=wn("h"),_r=wn("d"),rr=wn("w"),dr=wn("M"),ir=wn("y"),or=Sn("milliseconds"),mr=Sn("seconds"),ur=Sn("minutes"),lr=Sn("hours"),Mr=Sn("days"),Lr=Sn("months"),hr=Sn("years"),cr=Math.round,Yr={s:45,m:45,h:22,d:26,M:11},yr=Math.abs,pr=Ft.prototype;pr.abs=hn,pr.add=Yn,pr.subtract=yn,pr.as=Tn,pr.asMilliseconds=tr,pr.asSeconds=ar,pr.asMinutes=nr,pr.asHours=sr,pr.asDays=_r,pr.asWeeks=rr,pr.asMonths=dr,pr.asYears=ir,pr.valueOf=gn,pr._bubble=fn,pr.get=vn,pr.milliseconds=or,pr.seconds=mr,pr.minutes=ur,pr.hours=lr,pr.days=Mr,pr.weeks=Hn,pr.months=Lr,pr.years=hr,pr.humanize=xn,pr.toISOString=Fn,pr.toString=Fn,pr.toJSON=Fn,pr.locale=Ya,pr.localeData=ya,pr.toIsoString=et("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",Fn),pr.lang=A_,F("X",0,0,"unix"),F("x",0,0,"valueOf"),J("x",__),J("X",d_),U("X",function(e,t,a){a._d=new Date(1e3*parseFloat(e,10))}),U("x",function(e,t,a){a._d=new Date(c(e))}),e.version="2.10.6",t(bt),e.fn=K_,e.min=Wt,e.max=xt,e.utc=d,e.unix=Ba,e.months=mn,e.isDate=n,e.locale=k,e.invalid=u,e.duration=qt,e.isMoment=L,e.weekdays=ln,e.parseZone=Xa,e.localeData=g,e.isDuration=At,e.monthsShort=un,e.weekdaysMin=Ln,e.defineLocale=T,e.weekdaysShort=Mn,e.normalizeUnits=v,e.relativeTimeThreshold=Wn;var fr=e,Dr=(fr.defineLocale("af",{months:"Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des".split("_"),weekdays:"Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag".split("_"),weekdaysShort:"Son_Maa_Din_Woe_Don_Vry_Sat".split("_"),weekdaysMin:"So_Ma_Di_Wo_Do_Vr_Sa".split("_"),meridiemParse:/vm|nm/i,isPM:function(e){return/^nm$/i.test(e)},meridiem:function(e,t,a){return 12>e?a?"vm":"VM":a?"nm":"NM"},longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Vandag om] LT",nextDay:"[Môre om] LT",nextWeek:"dddd [om] LT",lastDay:"[Gister om] LT",lastWeek:"[Laas] dddd [om] LT",sameElse:"L"},relativeTime:{future:"oor %s",past:"%s gelede",s:"'n paar sekondes",m:"'n minuut",mm:"%d minute",h:"'n uur",hh:"%d ure",d:"'n dag",dd:"%d dae",M:"'n maand",MM:"%d maande",y:"'n jaar",yy:"%d jaar"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(e){return e+(1===e||8===e||e>=20?"ste":"de")},week:{dow:1,doy:4}}),fr.defineLocale("ar-ma",{months:"يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),monthsShort:"يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),weekdays:"الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:6,doy:12}}),{1:"١",2:"٢",3:"٣",4:"٤",5:"٥",6:"٦",7:"٧",8:"٨",9:"٩",0:"٠"}),kr={"١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","٠":"0"},Tr=(fr.defineLocale("ar-sa",{months:"يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),monthsShort:"يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},meridiemParse:/ص|م/,isPM:function(e){return"م"===e},meridiem:function(e){return 12>e?"ص":"م"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},preparse:function(e){return e.replace(/[١٢٣٤٥٦٧٨٩٠]/g,function(e){return kr[e]}).replace(/،/g,",")},postformat:function(e){return e.replace(/\d/g,function(e){return Dr[e]}).replace(/,/g,"،")},week:{dow:6,doy:12}}),fr.defineLocale("ar-tn",{months:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),monthsShort:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:1,doy:4}}),{1:"١",2:"٢",3:"٣",4:"٤",5:"٥",6:"٦",7:"٧",8:"٨",9:"٩",0:"٠"}),gr={"١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","٠":"0"},wr=function(e){return 0===e?0:1===e?1:2===e?2:e%100>=3&&10>=e%100?3:e%100>=11?4:5},vr={s:["أقل من ثانية","ثانية واحدة",["ثانيتان","ثانيتين"],"%d ثوان","%d ثانية","%d ثانية"],m:["أقل من دقيقة","دقيقة واحدة",["دقيقتان","دقيقتين"],"%d دقائق","%d دقيقة","%d دقيقة"],h:["أقل من ساعة","ساعة واحدة",["ساعتان","ساعتين"],"%d ساعات","%d ساعة","%d ساعة"],d:["أقل من يوم","يوم واحد",["يومان","يومين"],"%d أيام","%d يومًا","%d يوم"],M:["أقل من شهر","شهر واحد",["شهران","شهرين"],"%d أشهر","%d شهرا","%d شهر"],y:["أقل من عام","عام واحد",["عامان","عامين"],"%d أعوام","%d عامًا","%d عام"]},Sr=function(e){return function(t,a){var n=wr(t),s=vr[e][wr(t)];return 2===n&&(s=s[a?0:1]),s.replace(/%d/i,t)}},Hr=["كانون الثاني يناير","شباط فبراير","آذار مارس","نيسان أبريل","أيار مايو","حزيران يونيو","تموز يوليو","آب أغسطس","أيلول سبتمبر","تشرين الأول أكتوبر","تشرين الثاني نوفمبر","كانون الأول ديسمبر"],br=(fr.defineLocale("ar",{months:Hr,monthsShort:Hr,weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"D/‏M/‏YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},meridiemParse:/ص|م/,isPM:function(e){return"م"===e},meridiem:function(e){return 12>e?"ص":"م"},calendar:{sameDay:"[اليوم عند الساعة] LT",nextDay:"[غدًا عند الساعة] LT",nextWeek:"dddd [عند الساعة] LT",lastDay:"[أمس عند الساعة] LT",lastWeek:"dddd [عند الساعة] LT",sameElse:"L"},relativeTime:{future:"بعد %s",past:"منذ %s",s:Sr("s"),m:Sr("m"),mm:Sr("m"),h:Sr("h"),hh:Sr("h"),d:Sr("d"),dd:Sr("d"),M:Sr("M"),MM:Sr("M"),y:Sr("y"),yy:Sr("y")},preparse:function(e){return e.replace(/\u200f/g,"").replace(/[١٢٣٤٥٦٧٨٩٠]/g,function(e){return gr[e]}).replace(/،/g,",")},postformat:function(e){return e.replace(/\d/g,function(e){return Tr[e]}).replace(/,/g,"،")},week:{dow:6,doy:12}}),{1:"-inci",5:"-inci",8:"-inci",70:"-inci",80:"-inci",2:"-nci",7:"-nci",20:"-nci",50:"-nci",3:"-üncü",4:"-üncü",100:"-üncü",6:"-ncı",9:"-uncu",10:"-uncu",30:"-uncu",60:"-ıncı",90:"-ıncı"}),jr=(fr.defineLocale("az",{months:"yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr".split("_"),monthsShort:"yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek".split("_"),weekdays:"Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə".split("_"),weekdaysShort:"Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən".split("_"),weekdaysMin:"Bz_BE_ÇA_Çə_CA_Cü_Şə".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[bugün saat] LT",nextDay:"[sabah saat] LT",nextWeek:"[gələn həftə] dddd [saat] LT",lastDay:"[dünən] LT",lastWeek:"[keçən həftə] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s sonra",past:"%s əvvəl",s:"birneçə saniyyə",m:"bir dəqiqə",mm:"%d dəqiqə",h:"bir saat",hh:"%d saat",d:"bir gün",dd:"%d gün",M:"bir ay",MM:"%d ay",y:"bir il",yy:"%d il"},meridiemParse:/gecə|səhər|gündüz|axşam/,isPM:function(e){return/^(gündüz|axşam)$/.test(e)},meridiem:function(e){return 4>e?"gecə":12>e?"səhər":17>e?"gündüz":"axşam"},ordinalParse:/\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,ordinal:function(e){if(0===e)return e+"-ıncı";var t=e%10,a=e%100-t,n=e>=100?100:null;return e+(br[t]||br[a]||br[n])},week:{dow:1,doy:7}}),fr.defineLocale("be",{months:zn,monthsShort:"студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж".split("_"),weekdays:En,weekdaysShort:"нд_пн_ат_ср_чц_пт_сб".split("_"),weekdaysMin:"нд_пн_ат_ср_чц_пт_сб".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., HH:mm",LLLL:"dddd, D MMMM YYYY г., HH:mm"},calendar:{sameDay:"[Сёння ў] LT",nextDay:"[Заўтра ў] LT",lastDay:"[Учора ў] LT",nextWeek:function(){return"[У] dddd [ў] LT"},lastWeek:function(){switch(this.day()){case 0:case 3:case 5:case 6:return"[У мінулую] dddd [ў] LT";case 1:case 2:case 4:return"[У мінулы] dddd [ў] LT"}},sameElse:"L"},relativeTime:{future:"праз %s",past:"%s таму",s:"некалькі секунд",m:Pn,mm:Pn,h:Pn,hh:Pn,d:"дзень",dd:Pn,M:"месяц",MM:Pn,y:"год",yy:Pn},meridiemParse:/ночы|раніцы|дня|вечара/,isPM:function(e){return/^(дня|вечара)$/.test(e)},meridiem:function(e){return 4>e?"ночы":12>e?"раніцы":17>e?"дня":"вечара"},ordinalParse:/\d{1,2}-(і|ы|га)/,ordinal:function(e,t){switch(t){case"M":case"d":case"DDD":case"w":case"W":return e%10!==2&&e%10!==3||e%100===12||e%100===13?e+"-ы":e+"-і";case"D":return e+"-га";default:return e}},week:{dow:1,doy:7}}),fr.defineLocale("bg",{months:"януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември".split("_"),monthsShort:"янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек".split("_"),weekdays:"неделя_понеделник_вторник_сряда_четвъртък_петък_събота".split("_"),weekdaysShort:"нед_пон_вто_сря_чет_пет_съб".split("_"),weekdaysMin:"нд_пн_вт_ср_чт_пт_сб".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"D.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[Днес в] LT",nextDay:"[Утре в] LT",nextWeek:"dddd [в] LT",lastDay:"[Вчера в] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[В изминалата] dddd [в] LT";case 1:case 2:case 4:case 5:return"[В изминалия] dddd [в] LT"}},sameElse:"L"},relativeTime:{future:"след %s",past:"преди %s",s:"няколко секунди",m:"минута",mm:"%d минути",h:"час",hh:"%d часа",d:"ден",dd:"%d дни",M:"месец",MM:"%d месеца",y:"година",yy:"%d години"},ordinalParse:/\d{1,2}-(ев|ен|ти|ви|ри|ми)/,ordinal:function(e){var t=e%10,a=e%100;return 0===e?e+"-ев":0===a?e+"-ен":a>10&&20>a?e+"-ти":1===t?e+"-ви":2===t?e+"-ри":7===t||8===t?e+"-ми":e+"-ти"},week:{dow:1,doy:7}}),{1:"১",2:"২",3:"৩",4:"৪",5:"৫",6:"৬",7:"৭",8:"৮",9:"৯",0:"০"}),Wr={"১":"1","২":"2","৩":"3","৪":"4","৫":"5","৬":"6","৭":"7","৮":"8","৯":"9","০":"0"},xr=(fr.defineLocale("bn",{months:"জানুয়ারী_ফেবুয়ারী_মার্চ_এপ্রিল_মে_জুন_জুলাই_অগাস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর".split("_"),monthsShort:"জানু_ফেব_মার্চ_এপর_মে_জুন_জুল_অগ_সেপ্ট_অক্টো_নভ_ডিসেম্".split("_"),weekdays:"রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পত্তিবার_শুক্রুবার_শনিবার".split("_"),weekdaysShort:"রবি_সোম_মঙ্গল_বুধ_বৃহস্পত্তি_শুক্রু_শনি".split("_"),weekdaysMin:"রব_সম_মঙ্গ_বু_ব্রিহ_শু_শনি".split("_"),longDateFormat:{LT:"A h:mm সময়",LTS:"A h:mm:ss সময়",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm সময়",LLLL:"dddd, D MMMM YYYY, A h:mm সময়"},calendar:{sameDay:"[আজ] LT",nextDay:"[আগামীকাল] LT",nextWeek:"dddd, LT",lastDay:"[গতকাল] LT",lastWeek:"[গত] dddd, LT",sameElse:"L"},relativeTime:{future:"%s পরে",past:"%s আগে",s:"কএক সেকেন্ড",m:"এক মিনিট",mm:"%d মিনিট",h:"এক ঘন্টা",hh:"%d ঘন্টা",d:"এক দিন",dd:"%d দিন",M:"এক মাস",MM:"%d মাস",y:"এক বছর",yy:"%d বছর"},preparse:function(e){return e.replace(/[১২৩৪৫৬৭৮৯০]/g,function(e){return Wr[e]})},postformat:function(e){return e.replace(/\d/g,function(e){return jr[e]})},meridiemParse:/রাত|সকাল|দুপুর|বিকেল|রাত/,isPM:function(e){return/^(দুপুর|বিকেল|রাত)$/.test(e)},meridiem:function(e){return 4>e?"রাত":10>e?"সকাল":17>e?"দুপুর":20>e?"বিকেল":"রাত"},week:{dow:0,doy:6}}),{1:"༡",2:"༢",3:"༣",4:"༤",5:"༥",6:"༦",7:"༧",8:"༨",9:"༩",0:"༠"}),Fr={"༡":"1","༢":"2","༣":"3","༤":"4","༥":"5","༦":"6","༧":"7","༨":"8","༩":"9","༠":"0"},Ar=(fr.defineLocale("bo",{months:"ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),monthsShort:"ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),weekdays:"གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་".split("_"),weekdaysShort:"ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),weekdaysMin:"ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),longDateFormat:{LT:"A h:mm",LTS:"A h:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm",LLLL:"dddd, D MMMM YYYY, A h:mm"},calendar:{sameDay:"[དི་རིང] LT",nextDay:"[སང་ཉིན] LT",nextWeek:"[བདུན་ཕྲག་རྗེས་མ], LT",lastDay:"[ཁ་སང] LT",lastWeek:"[བདུན་ཕྲག་མཐའ་མ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s ལ་",past:"%s སྔན་ལ",s:"ལམ་སང",m:"སྐར་མ་གཅིག",mm:"%d སྐར་མ",h:"ཆུ་ཚོད་གཅིག",hh:"%d ཆུ་ཚོད",d:"ཉིན་གཅིག",dd:"%d ཉིན་",M:"ཟླ་བ་གཅིག",MM:"%d ཟླ་བ",y:"ལོ་གཅིག",yy:"%d ལོ"},preparse:function(e){return e.replace(/[༡༢༣༤༥༦༧༨༩༠]/g,function(e){return Fr[e]})},postformat:function(e){return e.replace(/\d/g,function(e){return xr[e]})},meridiemParse:/མཚན་མོ|ཞོགས་ཀས|ཉིན་གུང|དགོང་དག|མཚན་མོ/,isPM:function(e){return/^(ཉིན་གུང|དགོང་དག|མཚན་མོ)$/.test(e)},meridiem:function(e){return 4>e?"མཚན་མོ":10>e?"ཞོགས་ཀས":17>e?"ཉིན་གུང":20>e?"དགོང་དག":"མཚན་མོ"},week:{dow:0,doy:6}}),fr.defineLocale("br",{months:"Genver_C'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu".split("_"),monthsShort:"Gen_C'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker".split("_"),weekdays:"Sul_Lun_Meurzh_Merc'her_Yaou_Gwener_Sadorn".split("_"),weekdaysShort:"Sul_Lun_Meu_Mer_Yao_Gwe_Sad".split("_"),weekdaysMin:"Su_Lu_Me_Mer_Ya_Gw_Sa".split("_"),longDateFormat:{LT:"h[e]mm A",LTS:"h[e]mm:ss A",L:"DD/MM/YYYY",LL:"D [a viz] MMMM YYYY",LLL:"D [a viz] MMMM YYYY h[e]mm A",LLLL:"dddd, D [a viz] MMMM YYYY h[e]mm A"},calendar:{sameDay:"[Hiziv da] LT",nextDay:"[Warc'hoazh da] LT",nextWeek:"dddd [da] LT",lastDay:"[Dec'h da] LT",lastWeek:"dddd [paset da] LT",sameElse:"L"},relativeTime:{future:"a-benn %s",past:"%s 'zo",s:"un nebeud segondennoù",m:"ur vunutenn",mm:On,h:"un eur",hh:"%d eur",d:"un devezh",dd:On,M:"ur miz",MM:On,y:"ur bloaz",yy:Jn},ordinalParse:/\d{1,2}(añ|vet)/,ordinal:function(e){var t=1===e?"añ":"vet";return e+t},week:{dow:1,doy:4}}),fr.defineLocale("bs",{months:"januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar".split("_"),monthsShort:"jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.".split("_"),weekdays:"nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[jučer u] LT",lastWeek:function(){switch(this.day()){case 0:case 3:return"[prošlu] dddd [u] LT";case 6:return"[prošle] [subote] [u] LT";case 1:case 2:case 4:case 5:return"[prošli] dddd [u] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"par sekundi",m:Nn,mm:Nn,h:Nn,hh:Nn,d:"dan",dd:Nn,M:"mjesec",MM:Nn,y:"godinu",yy:Nn},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),fr.defineLocale("ca",{months:"gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre".split("_"),monthsShort:"gen._febr._mar._abr._mai._jun._jul._ag._set._oct._nov._des.".split("_"),weekdays:"diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte".split("_"),weekdaysShort:"dg._dl._dt._dc._dj._dv._ds.".split("_"),weekdaysMin:"Dg_Dl_Dt_Dc_Dj_Dv_Ds".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd D MMMM YYYY H:mm"},calendar:{sameDay:function(){return"[avui a "+(1!==this.hours()?"les":"la")+"] LT"
},nextDay:function(){return"[demà a "+(1!==this.hours()?"les":"la")+"] LT"},nextWeek:function(){return"dddd [a "+(1!==this.hours()?"les":"la")+"] LT"},lastDay:function(){return"[ahir a "+(1!==this.hours()?"les":"la")+"] LT"},lastWeek:function(){return"[el] dddd [passat a "+(1!==this.hours()?"les":"la")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"fa %s",s:"uns segons",m:"un minut",mm:"%d minuts",h:"una hora",hh:"%d hores",d:"un dia",dd:"%d dies",M:"un mes",MM:"%d mesos",y:"un any",yy:"%d anys"},ordinalParse:/\d{1,2}(r|n|t|è|a)/,ordinal:function(e,t){var a=1===e?"r":2===e?"n":3===e?"r":4===e?"t":"è";return("w"===t||"W"===t)&&(a="a"),e+a},week:{dow:1,doy:4}}),"leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec".split("_")),Pr="led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro".split("_"),zr=(fr.defineLocale("cs",{months:Ar,monthsShort:Pr,monthsParse:function(e,t){var a,n=[];for(a=0;12>a;a++)n[a]=new RegExp("^"+e[a]+"$|^"+t[a]+"$","i");return n}(Ar,Pr),weekdays:"neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota".split("_"),weekdaysShort:"ne_po_út_st_čt_pá_so".split("_"),weekdaysMin:"ne_po_út_st_čt_pá_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd D. MMMM YYYY H:mm"},calendar:{sameDay:"[dnes v] LT",nextDay:"[zítra v] LT",nextWeek:function(){switch(this.day()){case 0:return"[v neděli v] LT";case 1:case 2:return"[v] dddd [v] LT";case 3:return"[ve středu v] LT";case 4:return"[ve čtvrtek v] LT";case 5:return"[v pátek v] LT";case 6:return"[v sobotu v] LT"}},lastDay:"[včera v] LT",lastWeek:function(){switch(this.day()){case 0:return"[minulou neděli v] LT";case 1:case 2:return"[minulé] dddd [v] LT";case 3:return"[minulou středu v] LT";case 4:case 5:return"[minulý] dddd [v] LT";case 6:return"[minulou sobotu v] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"před %s",s:Vn,m:Vn,mm:Vn,h:Vn,hh:Vn,d:Vn,dd:Vn,M:Vn,MM:Vn,y:Vn,yy:Vn},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),fr.defineLocale("cv",{months:"кӑрлач_нарӑс_пуш_ака_май_ҫӗртме_утӑ_ҫурла_авӑн_юпа_чӳк_раштав".split("_"),monthsShort:"кӑр_нар_пуш_ака_май_ҫӗр_утӑ_ҫур_авн_юпа_чӳк_раш".split("_"),weekdays:"вырсарникун_тунтикун_ытларикун_юнкун_кӗҫнерникун_эрнекун_шӑматкун".split("_"),weekdaysShort:"выр_тун_ытл_юн_кӗҫ_эрн_шӑм".split("_"),weekdaysMin:"вр_тн_ыт_юн_кҫ_эр_шм".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD-MM-YYYY",LL:"YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ]",LLL:"YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm",LLLL:"dddd, YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm"},calendar:{sameDay:"[Паян] LT [сехетре]",nextDay:"[Ыран] LT [сехетре]",lastDay:"[Ӗнер] LT [сехетре]",nextWeek:"[Ҫитес] dddd LT [сехетре]",lastWeek:"[Иртнӗ] dddd LT [сехетре]",sameElse:"L"},relativeTime:{future:function(e){var t=/сехет$/i.exec(e)?"рен":/ҫул$/i.exec(e)?"тан":"ран";return e+t},past:"%s каялла",s:"пӗр-ик ҫеккунт",m:"пӗр минут",mm:"%d минут",h:"пӗр сехет",hh:"%d сехет",d:"пӗр кун",dd:"%d кун",M:"пӗр уйӑх",MM:"%d уйӑх",y:"пӗр ҫул",yy:"%d ҫул"},ordinalParse:/\d{1,2}-мӗш/,ordinal:"%d-мӗш",week:{dow:1,doy:7}}),fr.defineLocale("cy",{months:"Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr".split("_"),monthsShort:"Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag".split("_"),weekdays:"Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn".split("_"),weekdaysShort:"Sul_Llun_Maw_Mer_Iau_Gwe_Sad".split("_"),weekdaysMin:"Su_Ll_Ma_Me_Ia_Gw_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Heddiw am] LT",nextDay:"[Yfory am] LT",nextWeek:"dddd [am] LT",lastDay:"[Ddoe am] LT",lastWeek:"dddd [diwethaf am] LT",sameElse:"L"},relativeTime:{future:"mewn %s",past:"%s yn ôl",s:"ychydig eiliadau",m:"munud",mm:"%d munud",h:"awr",hh:"%d awr",d:"diwrnod",dd:"%d diwrnod",M:"mis",MM:"%d mis",y:"blwyddyn",yy:"%d flynedd"},ordinalParse:/\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,ordinal:function(e){var t=e,a="",n=["","af","il","ydd","ydd","ed","ed","ed","fed","fed","fed","eg","fed","eg","eg","fed","eg","eg","fed","eg","fed"];return t>20?a=40===t||50===t||60===t||80===t||100===t?"fed":"ain":t>0&&(a=n[t]),e+a},week:{dow:1,doy:4}}),fr.defineLocale("da",{months:"januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),weekdays:"søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),weekdaysShort:"søn_man_tir_ons_tor_fre_lør".split("_"),weekdaysMin:"sø_ma_ti_on_to_fr_lø".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY HH:mm",LLLL:"dddd [d.] D. MMMM YYYY HH:mm"},calendar:{sameDay:"[I dag kl.] LT",nextDay:"[I morgen kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[I går kl.] LT",lastWeek:"[sidste] dddd [kl] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"%s siden",s:"få sekunder",m:"et minut",mm:"%d minutter",h:"en time",hh:"%d timer",d:"en dag",dd:"%d dage",M:"en måned",MM:"%d måneder",y:"et år",yy:"%d år"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),fr.defineLocale("de-at",{months:"Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jän._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY HH:mm",LLLL:"dddd, D. MMMM YYYY HH:mm"},calendar:{sameDay:"[Heute um] LT [Uhr]",sameElse:"L",nextDay:"[Morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[Gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",m:Kn,mm:"%d Minuten",h:Kn,hh:"%d Stunden",d:Kn,dd:Kn,M:Kn,MM:Kn,y:Kn,yy:Kn},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),fr.defineLocale("de",{months:"Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY HH:mm",LLLL:"dddd, D. MMMM YYYY HH:mm"},calendar:{sameDay:"[Heute um] LT [Uhr]",sameElse:"L",nextDay:"[Morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[Gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",m:$n,mm:"%d Minuten",h:$n,hh:"%d Stunden",d:$n,dd:$n,M:$n,MM:$n,y:$n,yy:$n},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),fr.defineLocale("el",{monthsNominativeEl:"Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος".split("_"),monthsGenitiveEl:"Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου".split("_"),months:function(e,t){return/D/.test(t.substring(0,t.indexOf("MMMM")))?this._monthsGenitiveEl[e.month()]:this._monthsNominativeEl[e.month()]},monthsShort:"Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ".split("_"),weekdays:"Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο".split("_"),weekdaysShort:"Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ".split("_"),weekdaysMin:"Κυ_Δε_Τρ_Τε_Πε_Πα_Σα".split("_"),meridiem:function(e,t,a){return e>11?a?"μμ":"ΜΜ":a?"πμ":"ΠΜ"},isPM:function(e){return"μ"===(e+"").toLowerCase()[0]},meridiemParse:/[ΠΜ]\.?Μ?\.?/i,longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendarEl:{sameDay:"[Σήμερα {}] LT",nextDay:"[Αύριο {}] LT",nextWeek:"dddd [{}] LT",lastDay:"[Χθες {}] LT",lastWeek:function(){switch(this.day()){case 6:return"[το προηγούμενο] dddd [{}] LT";default:return"[την προηγούμενη] dddd [{}] LT"}},sameElse:"L"},calendar:function(e,t){var a=this._calendarEl[e],n=t&&t.hours();return"function"==typeof a&&(a=a.apply(t)),a.replace("{}",n%12===1?"στη":"στις")},relativeTime:{future:"σε %s",past:"%s πριν",s:"λίγα δευτερόλεπτα",m:"ένα λεπτό",mm:"%d λεπτά",h:"μία ώρα",hh:"%d ώρες",d:"μία μέρα",dd:"%d μέρες",M:"ένας μήνας",MM:"%d μήνες",y:"ένας χρόνος",yy:"%d χρόνια"},ordinalParse:/\d{1,2}η/,ordinal:"%dη",week:{dow:1,doy:4}}),fr.defineLocale("en-au",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var t=e%10,a=1===~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th";return e+a},week:{dow:1,doy:4}}),fr.defineLocale("en-ca",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"YYYY-MM-DD",LL:"D MMMM, YYYY",LLL:"D MMMM, YYYY h:mm A",LLLL:"dddd, D MMMM, YYYY h:mm A"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var t=e%10,a=1===~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th";return e+a}}),fr.defineLocale("en-gb",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var t=e%10,a=1===~~(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th";return e+a},week:{dow:1,doy:4}}),fr.defineLocale("eo",{months:"januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec".split("_"),weekdays:"Dimanĉo_Lundo_Mardo_Merkredo_Ĵaŭdo_Vendredo_Sabato".split("_"),weekdaysShort:"Dim_Lun_Mard_Merk_Ĵaŭ_Ven_Sab".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Ĵa_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"D[-an de] MMMM, YYYY",LLL:"D[-an de] MMMM, YYYY HH:mm",LLLL:"dddd, [la] D[-an de] MMMM, YYYY HH:mm"},meridiemParse:/[ap]\.t\.m/i,isPM:function(e){return"p"===e.charAt(0).toLowerCase()},meridiem:function(e,t,a){return e>11?a?"p.t.m.":"P.T.M.":a?"a.t.m.":"A.T.M."},calendar:{sameDay:"[Hodiaŭ je] LT",nextDay:"[Morgaŭ je] LT",nextWeek:"dddd [je] LT",lastDay:"[Hieraŭ je] LT",lastWeek:"[pasinta] dddd [je] LT",sameElse:"L"},relativeTime:{future:"je %s",past:"antaŭ %s",s:"sekundoj",m:"minuto",mm:"%d minutoj",h:"horo",hh:"%d horoj",d:"tago",dd:"%d tagoj",M:"monato",MM:"%d monatoj",y:"jaro",yy:"%d jaroj"},ordinalParse:/\d{1,2}a/,ordinal:"%da",week:{dow:1,doy:7}}),"Ene._Feb._Mar._Abr._May._Jun._Jul._Ago._Sep._Oct._Nov._Dic.".split("_")),Er="Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic".split("_"),Or=(fr.defineLocale("es",{months:"Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split("_"),monthsShort:function(e,t){return/-MMM-/.test(t)?Er[e.month()]:zr[e.month()]},weekdays:"Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),weekdaysShort:"Dom._Lun._Mar._Mié._Jue._Vie._Sáb.".split("_"),weekdaysMin:"Do_Lu_Ma_Mi_Ju_Vi_Sá".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY H:mm",LLLL:"dddd, D [de] MMMM [de] YYYY H:mm"},calendar:{sameDay:function(){return"[hoy a la"+(1!==this.hours()?"s":"")+"] LT"},nextDay:function(){return"[mañana a la"+(1!==this.hours()?"s":"")+"] LT"},nextWeek:function(){return"dddd [a la"+(1!==this.hours()?"s":"")+"] LT"},lastDay:function(){return"[ayer a la"+(1!==this.hours()?"s":"")+"] LT"},lastWeek:function(){return"[el] dddd [pasado a la"+(1!==this.hours()?"s":"")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"hace %s",s:"unos segundos",m:"un minuto",mm:"%d minutos",h:"una hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un año",yy:"%d años"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}}),fr.defineLocale("et",{months:"jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember".split("_"),monthsShort:"jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets".split("_"),weekdays:"pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev".split("_"),weekdaysShort:"P_E_T_K_N_R_L".split("_"),weekdaysMin:"P_E_T_K_N_R_L".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[Täna,] LT",nextDay:"[Homme,] LT",nextWeek:"[Järgmine] dddd LT",lastDay:"[Eile,] LT",lastWeek:"[Eelmine] dddd LT",sameElse:"L"},relativeTime:{future:"%s pärast",past:"%s tagasi",s:Rn,m:Rn,mm:Rn,h:Rn,hh:Rn,d:Rn,dd:"%d päeva",M:Rn,MM:Rn,y:Rn,yy:Rn},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),fr.defineLocale("eu",{months:"urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua".split("_"),monthsShort:"urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.".split("_"),weekdays:"igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata".split("_"),weekdaysShort:"ig._al._ar._az._og._ol._lr.".split("_"),weekdaysMin:"ig_al_ar_az_og_ol_lr".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"YYYY[ko] MMMM[ren] D[a]",LLL:"YYYY[ko] MMMM[ren] D[a] HH:mm",LLLL:"dddd, YYYY[ko] MMMM[ren] D[a] HH:mm",l:"YYYY-M-D",ll:"YYYY[ko] MMM D[a]",lll:"YYYY[ko] MMM D[a] HH:mm",llll:"ddd, YYYY[ko] MMM D[a] HH:mm"},calendar:{sameDay:"[gaur] LT[etan]",nextDay:"[bihar] LT[etan]",nextWeek:"dddd LT[etan]",lastDay:"[atzo] LT[etan]",lastWeek:"[aurreko] dddd LT[etan]",sameElse:"L"},relativeTime:{future:"%s barru",past:"duela %s",s:"segundo batzuk",m:"minutu bat",mm:"%d minutu",h:"ordu bat",hh:"%d ordu",d:"egun bat",dd:"%d egun",M:"hilabete bat",MM:"%d hilabete",y:"urte bat",yy:"%d urte"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),{1:"۱",2:"۲",3:"۳",4:"۴",5:"۵",6:"۶",7:"۷",8:"۸",9:"۹",0:"۰"}),Jr={"۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","۰":"0"},Gr=(fr.defineLocale("fa",{months:"ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),monthsShort:"ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),weekdays:"یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),weekdaysShort:"یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),weekdaysMin:"ی_د_س_چ_پ_ج_ش".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},meridiemParse:/قبل از ظهر|بعد از ظهر/,isPM:function(e){return/بعد از ظهر/.test(e)},meridiem:function(e){return 12>e?"قبل از ظهر":"بعد از ظهر"},calendar:{sameDay:"[امروز ساعت] LT",nextDay:"[فردا ساعت] LT",nextWeek:"dddd [ساعت] LT",lastDay:"[دیروز ساعت] LT",lastWeek:"dddd [پیش] [ساعت] LT",sameElse:"L"},relativeTime:{future:"در %s",past:"%s پیش",s:"چندین ثانیه",m:"یک دقیقه",mm:"%d دقیقه",h:"یک ساعت",hh:"%d ساعت",d:"یک روز",dd:"%d روز",M:"یک ماه",MM:"%d ماه",y:"یک سال",yy:"%d سال"},preparse:function(e){return e.replace(/[۰-۹]/g,function(e){return Jr[e]}).replace(/،/g,",")},postformat:function(e){return e.replace(/\d/g,function(e){return Or[e]}).replace(/,/g,"،")},ordinalParse:/\d{1,2}م/,ordinal:"%dم",week:{dow:6,doy:12}}),"nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän".split(" ")),Cr=["nolla","yhden","kahden","kolmen","neljän","viiden","kuuden",Gr[7],Gr[8],Gr[9]],Ur=(fr.defineLocale("fi",{months:"tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split("_"),monthsShort:"tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu".split("_"),weekdays:"sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split("_"),weekdaysShort:"su_ma_ti_ke_to_pe_la".split("_"),weekdaysMin:"su_ma_ti_ke_to_pe_la".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD.MM.YYYY",LL:"Do MMMM[ta] YYYY",LLL:"Do MMMM[ta] YYYY, [klo] HH.mm",LLLL:"dddd, Do MMMM[ta] YYYY, [klo] HH.mm",l:"D.M.YYYY",ll:"Do MMM YYYY",lll:"Do MMM YYYY, [klo] HH.mm",llll:"ddd, Do MMM YYYY, [klo] HH.mm"},calendar:{sameDay:"[tänään] [klo] LT",nextDay:"[huomenna] [klo] LT",nextWeek:"dddd [klo] LT",lastDay:"[eilen] [klo] LT",lastWeek:"[viime] dddd[na] [klo] LT",sameElse:"L"},relativeTime:{future:"%s päästä",past:"%s sitten",s:Zn,m:Zn,mm:Zn,h:Zn,hh:Zn,d:Zn,dd:Zn,M:Zn,MM:Zn,y:Zn,yy:Zn},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),fr.defineLocale("fo",{months:"januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur".split("_"),weekdaysShort:"sun_mán_týs_mik_hós_frí_ley".split("_"),weekdaysMin:"su_má_tý_mi_hó_fr_le".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D. MMMM, YYYY HH:mm"},calendar:{sameDay:"[Í dag kl.] LT",nextDay:"[Í morgin kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[Í gjár kl.] LT",lastWeek:"[síðstu] dddd [kl] LT",sameElse:"L"},relativeTime:{future:"um %s",past:"%s síðani",s:"fá sekund",m:"ein minutt",mm:"%d minuttir",h:"ein tími",hh:"%d tímar",d:"ein dagur",dd:"%d dagar",M:"ein mánaði",MM:"%d mánaðir",y:"eitt ár",yy:"%d ár"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),fr.defineLocale("fr-ca",{months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Aujourd'hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},ordinalParse:/\d{1,2}(er|e)/,ordinal:function(e){return e+(1===e?"er":"e")}}),fr.defineLocale("fr",{months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Aujourd'hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},ordinalParse:/\d{1,2}(er|)/,ordinal:function(e){return e+(1===e?"er":"")},week:{dow:1,doy:4}}),"jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.".split("_")),Nr="jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),Ir=(fr.defineLocale("fy",{months:"jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber".split("_"),monthsShort:function(e,t){return/-MMM-/.test(t)?Nr[e.month()]:Ur[e.month()]},weekdays:"snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon".split("_"),weekdaysShort:"si._mo._ti._wo._to._fr._so.".split("_"),weekdaysMin:"Si_Mo_Ti_Wo_To_Fr_So".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[hjoed om] LT",nextDay:"[moarn om] LT",nextWeek:"dddd [om] LT",lastDay:"[juster om] LT",lastWeek:"[ôfrûne] dddd [om] LT",sameElse:"L"},relativeTime:{future:"oer %s",past:"%s lyn",s:"in pear sekonden",m:"ien minút",mm:"%d minuten",h:"ien oere",hh:"%d oeren",d:"ien dei",dd:"%d dagen",M:"ien moanne",MM:"%d moannen",y:"ien jier",yy:"%d jierren"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(e){return e+(1===e||8===e||e>=20?"ste":"de")},week:{dow:1,doy:4}}),fr.defineLocale("gl",{months:"Xaneiro_Febreiro_Marzo_Abril_Maio_Xuño_Xullo_Agosto_Setembro_Outubro_Novembro_Decembro".split("_"),monthsShort:"Xan._Feb._Mar._Abr._Mai._Xuñ._Xul._Ago._Set._Out._Nov._Dec.".split("_"),weekdays:"Domingo_Luns_Martes_Mércores_Xoves_Venres_Sábado".split("_"),weekdaysShort:"Dom._Lun._Mar._Mér._Xov._Ven._Sáb.".split("_"),weekdaysMin:"Do_Lu_Ma_Mé_Xo_Ve_Sá".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd D MMMM YYYY H:mm"},calendar:{sameDay:function(){return"[hoxe "+(1!==this.hours()?"ás":"á")+"] LT"},nextDay:function(){return"[mañá "+(1!==this.hours()?"ás":"á")+"] LT"},nextWeek:function(){return"dddd ["+(1!==this.hours()?"ás":"a")+"] LT"},lastDay:function(){return"[onte "+(1!==this.hours()?"á":"a")+"] LT"},lastWeek:function(){return"[o] dddd [pasado "+(1!==this.hours()?"ás":"a")+"] LT"},sameElse:"L"},relativeTime:{future:function(e){return"uns segundos"===e?"nuns segundos":"en "+e},past:"hai %s",s:"uns segundos",m:"un minuto",mm:"%d minutos",h:"unha hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un ano",yy:"%d anos"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:7}}),fr.defineLocale("he",{months:"ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר".split("_"),monthsShort:"ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳".split("_"),weekdays:"ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת".split("_"),weekdaysShort:"א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳".split("_"),weekdaysMin:"א_ב_ג_ד_ה_ו_ש".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D [ב]MMMM YYYY",LLL:"D [ב]MMMM YYYY HH:mm",LLLL:"dddd, D [ב]MMMM YYYY HH:mm",l:"D/M/YYYY",ll:"D MMM YYYY",lll:"D MMM YYYY HH:mm",llll:"ddd, D MMM YYYY HH:mm"},calendar:{sameDay:"[היום ב־]LT",nextDay:"[מחר ב־]LT",nextWeek:"dddd [בשעה] LT",lastDay:"[אתמול ב־]LT",lastWeek:"[ביום] dddd [האחרון בשעה] LT",sameElse:"L"},relativeTime:{future:"בעוד %s",past:"לפני %s",s:"מספר שניות",m:"דקה",mm:"%d דקות",h:"שעה",hh:function(e){return 2===e?"שעתיים":e+" שעות"},d:"יום",dd:function(e){return 2===e?"יומיים":e+" ימים"},M:"חודש",MM:function(e){return 2===e?"חודשיים":e+" חודשים"},y:"שנה",yy:function(e){return 2===e?"שנתיים":e%10===0&&10!==e?e+" שנה":e+" שנים"}}}),{1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"}),Vr={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"},Kr=(fr.defineLocale("hi",{months:"जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर".split("_"),monthsShort:"जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.".split("_"),weekdays:"रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),weekdaysShort:"रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि".split("_"),weekdaysMin:"र_सो_मं_बु_गु_शु_श".split("_"),longDateFormat:{LT:"A h:mm बजे",LTS:"A h:mm:ss बजे",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm बजे",LLLL:"dddd, D MMMM YYYY, A h:mm बजे"},calendar:{sameDay:"[आज] LT",nextDay:"[कल] LT",nextWeek:"dddd, LT",lastDay:"[कल] LT",lastWeek:"[पिछले] dddd, LT",sameElse:"L"},relativeTime:{future:"%s में",past:"%s पहले",s:"कुछ ही क्षण",m:"एक मिनट",mm:"%d मिनट",h:"एक घंटा",hh:"%d घंटे",d:"एक दिन",dd:"%d दिन",M:"एक महीने",MM:"%d महीने",y:"एक वर्ष",yy:"%d वर्ष"},preparse:function(e){return e.replace(/[१२३४५६७८९०]/g,function(e){return Vr[e]})},postformat:function(e){return e.replace(/\d/g,function(e){return Ir[e]})},meridiemParse:/रात|सुबह|दोपहर|शाम/,meridiemHour:function(e,t){return 12===e&&(e=0),"रात"===t?4>e?e:e+12:"सुबह"===t?e:"दोपहर"===t?e>=10?e:e+12:"शाम"===t?e+12:void 0},meridiem:function(e){return 4>e?"रात":10>e?"सुबह":17>e?"दोपहर":20>e?"शाम":"रात"},week:{dow:0,doy:6}}),fr.defineLocale("hr",{months:"siječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac".split("_"),monthsShort:"sij._velj._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.".split("_"),weekdays:"nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[jučer u] LT",lastWeek:function(){switch(this.day()){case 0:case 3:return"[prošlu] dddd [u] LT";case 6:return"[prošle] [subote] [u] LT";case 1:case 2:case 4:case 5:return"[prošli] dddd [u] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"par sekundi",m:Bn,mm:Bn,h:Bn,hh:Bn,d:"dan",dd:Bn,M:"mjesec",MM:Bn,y:"godinu",yy:Bn},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),"vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton".split(" ")),$r=(fr.defineLocale("hu",{months:"január_február_március_április_május_június_július_augusztus_szeptember_október_november_december".split("_"),monthsShort:"jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec".split("_"),weekdays:"vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat".split("_"),weekdaysShort:"vas_hét_kedd_sze_csüt_pén_szo".split("_"),weekdaysMin:"v_h_k_sze_cs_p_szo".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"YYYY.MM.DD.",LL:"YYYY. MMMM D.",LLL:"YYYY. MMMM D. H:mm",LLLL:"YYYY. MMMM D., dddd H:mm"},meridiemParse:/de|du/i,isPM:function(e){return"u"===e.charAt(1).toLowerCase()},meridiem:function(e,t,a){return 12>e?a===!0?"de":"DE":a===!0?"du":"DU"},calendar:{sameDay:"[ma] LT[-kor]",nextDay:"[holnap] LT[-kor]",nextWeek:function(){return Qn.call(this,!0)},lastDay:"[tegnap] LT[-kor]",lastWeek:function(){return Qn.call(this,!1)},sameElse:"L"},relativeTime:{future:"%s múlva",past:"%s",s:Xn,m:Xn,mm:Xn,h:Xn,hh:Xn,d:Xn,dd:Xn,M:Xn,MM:Xn,y:Xn,yy:Xn},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),fr.defineLocale("hy-am",{months:es,monthsShort:ts,weekdays:as,weekdaysShort:"կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),weekdaysMin:"կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY թ.",LLL:"D MMMM YYYY թ., HH:mm",LLLL:"dddd, D MMMM YYYY թ., HH:mm"},calendar:{sameDay:"[այսօր] LT",nextDay:"[վաղը] LT",lastDay:"[երեկ] LT",nextWeek:function(){return"dddd [օրը ժամը] LT"},lastWeek:function(){return"[անցած] dddd [օրը ժամը] LT"},sameElse:"L"},relativeTime:{future:"%s հետո",past:"%s առաջ",s:"մի քանի վայրկյան",m:"րոպե",mm:"%d րոպե",h:"ժամ",hh:"%d ժամ",d:"օր",dd:"%d օր",M:"ամիս",MM:"%d ամիս",y:"տարի",yy:"%d տարի"},meridiemParse:/գիշերվա|առավոտվա|ցերեկվա|երեկոյան/,isPM:function(e){return/^(ցերեկվա|երեկոյան)$/.test(e)},meridiem:function(e){return 4>e?"գիշերվա":12>e?"առավոտվա":17>e?"ցերեկվա":"երեկոյան"},ordinalParse:/\d{1,2}|\d{1,2}-(ին|րդ)/,ordinal:function(e,t){switch(t){case"DDD":case"w":case"W":case"DDDo":return 1===e?e+"-ին":e+"-րդ";default:return e}},week:{dow:1,doy:7}}),fr.defineLocale("id",{months:"Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des".split("_"),weekdays:"Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu".split("_"),weekdaysShort:"Min_Sen_Sel_Rab_Kam_Jum_Sab".split("_"),weekdaysMin:"Mg_Sn_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/pagi|siang|sore|malam/,meridiemHour:function(e,t){return 12===e&&(e=0),"pagi"===t?e:"siang"===t?e>=11?e:e+12:"sore"===t||"malam"===t?e+12:void 0},meridiem:function(e){return 11>e?"pagi":15>e?"siang":19>e?"sore":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Besok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kemarin pukul] LT",lastWeek:"dddd [lalu pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lalu",s:"beberapa detik",m:"semenit",mm:"%d menit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}}),fr.defineLocale("is",{months:"janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember".split("_"),monthsShort:"jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des".split("_"),weekdays:"sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur".split("_"),weekdaysShort:"sun_mán_þri_mið_fim_fös_lau".split("_"),weekdaysMin:"Su_Má_Þr_Mi_Fi_Fö_La".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] H:mm",LLLL:"dddd, D. MMMM YYYY [kl.] H:mm"},calendar:{sameDay:"[í dag kl.] LT",nextDay:"[á morgun kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[í gær kl.] LT",lastWeek:"[síðasta] dddd [kl.] LT",sameElse:"L"},relativeTime:{future:"eftir %s",past:"fyrir %s síðan",s:ss,m:ss,mm:ss,h:"klukkustund",hh:ss,d:ss,dd:ss,M:ss,MM:ss,y:ss,yy:ss},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),fr.defineLocale("it",{months:"gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre".split("_"),monthsShort:"gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic".split("_"),weekdays:"Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Venerdì_Sabato".split("_"),weekdaysShort:"Dom_Lun_Mar_Mer_Gio_Ven_Sab".split("_"),weekdaysMin:"D_L_Ma_Me_G_V_S".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Oggi alle] LT",nextDay:"[Domani alle] LT",nextWeek:"dddd [alle] LT",lastDay:"[Ieri alle] LT",lastWeek:function(){switch(this.day()){case 0:return"[la scorsa] dddd [alle] LT";
default:return"[lo scorso] dddd [alle] LT"}},sameElse:"L"},relativeTime:{future:function(e){return(/^[0-9].+$/.test(e)?"tra":"in")+" "+e},past:"%s fa",s:"alcuni secondi",m:"un minuto",mm:"%d minuti",h:"un'ora",hh:"%d ore",d:"un giorno",dd:"%d giorni",M:"un mese",MM:"%d mesi",y:"un anno",yy:"%d anni"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}}),fr.defineLocale("ja",{months:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日".split("_"),weekdaysShort:"日_月_火_水_木_金_土".split("_"),weekdaysMin:"日_月_火_水_木_金_土".split("_"),longDateFormat:{LT:"Ah時m分",LTS:"Ah時m分s秒",L:"YYYY/MM/DD",LL:"YYYY年M月D日",LLL:"YYYY年M月D日Ah時m分",LLLL:"YYYY年M月D日Ah時m分 dddd"},meridiemParse:/午前|午後/i,isPM:function(e){return"午後"===e},meridiem:function(e){return 12>e?"午前":"午後"},calendar:{sameDay:"[今日] LT",nextDay:"[明日] LT",nextWeek:"[来週]dddd LT",lastDay:"[昨日] LT",lastWeek:"[前週]dddd LT",sameElse:"L"},relativeTime:{future:"%s後",past:"%s前",s:"数秒",m:"1分",mm:"%d分",h:"1時間",hh:"%d時間",d:"1日",dd:"%d日",M:"1ヶ月",MM:"%dヶ月",y:"1年",yy:"%d年"}}),fr.defineLocale("jv",{months:"Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_Nopember_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nop_Des".split("_"),weekdays:"Minggu_Senen_Seloso_Rebu_Kemis_Jemuwah_Septu".split("_"),weekdaysShort:"Min_Sen_Sel_Reb_Kem_Jem_Sep".split("_"),weekdaysMin:"Mg_Sn_Sl_Rb_Km_Jm_Sp".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/enjing|siyang|sonten|ndalu/,meridiemHour:function(e,t){return 12===e&&(e=0),"enjing"===t?e:"siyang"===t?e>=11?e:e+12:"sonten"===t||"ndalu"===t?e+12:void 0},meridiem:function(e){return 11>e?"enjing":15>e?"siyang":19>e?"sonten":"ndalu"},calendar:{sameDay:"[Dinten puniko pukul] LT",nextDay:"[Mbenjang pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kala wingi pukul] LT",lastWeek:"dddd [kepengker pukul] LT",sameElse:"L"},relativeTime:{future:"wonten ing %s",past:"%s ingkang kepengker",s:"sawetawis detik",m:"setunggal menit",mm:"%d menit",h:"setunggal jam",hh:"%d jam",d:"sedinten",dd:"%d dinten",M:"sewulan",MM:"%d wulan",y:"setaun",yy:"%d taun"},week:{dow:1,doy:7}}),fr.defineLocale("ka",{months:_s,monthsShort:"იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ".split("_"),weekdays:rs,weekdaysShort:"კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ".split("_"),weekdaysMin:"კვ_ორ_სა_ოთ_ხუ_პა_შა".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[დღეს] LT[-ზე]",nextDay:"[ხვალ] LT[-ზე]",lastDay:"[გუშინ] LT[-ზე]",nextWeek:"[შემდეგ] dddd LT[-ზე]",lastWeek:"[წინა] dddd LT-ზე",sameElse:"L"},relativeTime:{future:function(e){return/(წამი|წუთი|საათი|წელი)/.test(e)?e.replace(/ი$/,"ში"):e+"ში"},past:function(e){return/(წამი|წუთი|საათი|დღე|თვე)/.test(e)?e.replace(/(ი|ე)$/,"ის წინ"):/წელი/.test(e)?e.replace(/წელი$/,"წლის წინ"):void 0},s:"რამდენიმე წამი",m:"წუთი",mm:"%d წუთი",h:"საათი",hh:"%d საათი",d:"დღე",dd:"%d დღე",M:"თვე",MM:"%d თვე",y:"წელი",yy:"%d წელი"},ordinalParse:/0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,ordinal:function(e){return 0===e?e:1===e?e+"-ლი":20>e||100>=e&&e%20===0||e%100===0?"მე-"+e:e+"-ე"},week:{dow:1,doy:7}}),fr.defineLocale("km",{months:"មករា_កុម្ភៈ_មិនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),monthsShort:"មករា_កុម្ភៈ_មិនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),weekdays:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),weekdaysShort:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),weekdaysMin:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[ថ្ងៃនៈ ម៉ោង] LT",nextDay:"[ស្អែក ម៉ោង] LT",nextWeek:"dddd [ម៉ោង] LT",lastDay:"[ម្សិលមិញ ម៉ោង] LT",lastWeek:"dddd [សប្តាហ៍មុន] [ម៉ោង] LT",sameElse:"L"},relativeTime:{future:"%sទៀត",past:"%sមុន",s:"ប៉ុន្មានវិនាទី",m:"មួយនាទី",mm:"%d នាទី",h:"មួយម៉ោង",hh:"%d ម៉ោង",d:"មួយថ្ងៃ",dd:"%d ថ្ងៃ",M:"មួយខែ",MM:"%d ខែ",y:"មួយឆ្នាំ",yy:"%d ឆ្នាំ"},week:{dow:1,doy:4}}),fr.defineLocale("ko",{months:"1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),monthsShort:"1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),weekdays:"일요일_월요일_화요일_수요일_목요일_금요일_토요일".split("_"),weekdaysShort:"일_월_화_수_목_금_토".split("_"),weekdaysMin:"일_월_화_수_목_금_토".split("_"),longDateFormat:{LT:"A h시 m분",LTS:"A h시 m분 s초",L:"YYYY.MM.DD",LL:"YYYY년 MMMM D일",LLL:"YYYY년 MMMM D일 A h시 m분",LLLL:"YYYY년 MMMM D일 dddd A h시 m분"},calendar:{sameDay:"오늘 LT",nextDay:"내일 LT",nextWeek:"dddd LT",lastDay:"어제 LT",lastWeek:"지난주 dddd LT",sameElse:"L"},relativeTime:{future:"%s 후",past:"%s 전",s:"몇초",ss:"%d초",m:"일분",mm:"%d분",h:"한시간",hh:"%d시간",d:"하루",dd:"%d일",M:"한달",MM:"%d달",y:"일년",yy:"%d년"},ordinalParse:/\d{1,2}일/,ordinal:"%d일",meridiemParse:/오전|오후/,isPM:function(e){return"오후"===e},meridiem:function(e){return 12>e?"오전":"오후"}}),fr.defineLocale("lb",{months:"Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),weekdays:"Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg".split("_"),weekdaysShort:"So._Mé._Dë._Më._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mé_Dë_Më_Do_Fr_Sa".split("_"),longDateFormat:{LT:"H:mm [Auer]",LTS:"H:mm:ss [Auer]",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm [Auer]",LLLL:"dddd, D. MMMM YYYY H:mm [Auer]"},calendar:{sameDay:"[Haut um] LT",sameElse:"L",nextDay:"[Muer um] LT",nextWeek:"dddd [um] LT",lastDay:"[Gëschter um] LT",lastWeek:function(){switch(this.day()){case 2:case 4:return"[Leschten] dddd [um] LT";default:return"[Leschte] dddd [um] LT"}}},relativeTime:{future:is,past:os,s:"e puer Sekonnen",m:ds,mm:"%d Minutten",h:ds,hh:"%d Stonnen",d:ds,dd:"%d Deeg",M:ds,MM:"%d Méint",y:ds,yy:"%d Joer"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),{m:"minutė_minutės_minutę",mm:"minutės_minučių_minutes",h:"valanda_valandos_valandą",hh:"valandos_valandų_valandas",d:"diena_dienos_dieną",dd:"dienos_dienų_dienas",M:"mėnuo_mėnesio_mėnesį",MM:"mėnesiai_mėnesių_mėnesius",y:"metai_metų_metus",yy:"metai_metų_metus"}),Rr="sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis".split("_"),Zr=(fr.defineLocale("lt",{months:ls,monthsShort:"sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd".split("_"),weekdays:Ys,weekdaysShort:"Sek_Pir_Ant_Tre_Ket_Pen_Šeš".split("_"),weekdaysMin:"S_P_A_T_K_Pn_Š".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"YYYY [m.] MMMM D [d.]",LLL:"YYYY [m.] MMMM D [d.], HH:mm [val.]",LLLL:"YYYY [m.] MMMM D [d.], dddd, HH:mm [val.]",l:"YYYY-MM-DD",ll:"YYYY [m.] MMMM D [d.]",lll:"YYYY [m.] MMMM D [d.], HH:mm [val.]",llll:"YYYY [m.] MMMM D [d.], ddd, HH:mm [val.]"},calendar:{sameDay:"[Šiandien] LT",nextDay:"[Rytoj] LT",nextWeek:"dddd LT",lastDay:"[Vakar] LT",lastWeek:"[Praėjusį] dddd LT",sameElse:"L"},relativeTime:{future:"po %s",past:"prieš %s",s:us,m:Ms,mm:cs,h:Ms,hh:cs,d:Ms,dd:cs,M:Ms,MM:cs,y:Ms,yy:cs},ordinalParse:/\d{1,2}-oji/,ordinal:function(e){return e+"-oji"},week:{dow:1,doy:4}}),{m:"minūtes_minūtēm_minūte_minūtes".split("_"),mm:"minūtes_minūtēm_minūte_minūtes".split("_"),h:"stundas_stundām_stunda_stundas".split("_"),hh:"stundas_stundām_stunda_stundas".split("_"),d:"dienas_dienām_diena_dienas".split("_"),dd:"dienas_dienām_diena_dienas".split("_"),M:"mēneša_mēnešiem_mēnesis_mēneši".split("_"),MM:"mēneša_mēnešiem_mēnesis_mēneši".split("_"),y:"gada_gadiem_gads_gadi".split("_"),yy:"gada_gadiem_gads_gadi".split("_")}),qr=(fr.defineLocale("lv",{months:"janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris".split("_"),monthsShort:"jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec".split("_"),weekdays:"svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena".split("_"),weekdaysShort:"Sv_P_O_T_C_Pk_S".split("_"),weekdaysMin:"Sv_P_O_T_C_Pk_S".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY.",LL:"YYYY. [gada] D. MMMM",LLL:"YYYY. [gada] D. MMMM, HH:mm",LLLL:"YYYY. [gada] D. MMMM, dddd, HH:mm"},calendar:{sameDay:"[Šodien pulksten] LT",nextDay:"[Rīt pulksten] LT",nextWeek:"dddd [pulksten] LT",lastDay:"[Vakar pulksten] LT",lastWeek:"[Pagājušā] dddd [pulksten] LT",sameElse:"L"},relativeTime:{future:"pēc %s",past:"pirms %s",s:Ds,m:fs,mm:ps,h:fs,hh:ps,d:fs,dd:ps,M:fs,MM:ps,y:fs,yy:ps},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),{words:{m:["jedan minut","jednog minuta"],mm:["minut","minuta","minuta"],h:["jedan sat","jednog sata"],hh:["sat","sata","sati"],dd:["dan","dana","dana"],MM:["mjesec","mjeseca","mjeseci"],yy:["godina","godine","godina"]},correctGrammaticalCase:function(e,t){return 1===e?t[0]:e>=2&&4>=e?t[1]:t[2]},translate:function(e,t,a){var n=qr.words[a];return 1===a.length?t?n[0]:n[1]:e+" "+qr.correctGrammaticalCase(e,n)}}),Br=(fr.defineLocale("me",{months:["januar","februar","mart","april","maj","jun","jul","avgust","septembar","oktobar","novembar","decembar"],monthsShort:["jan.","feb.","mar.","apr.","maj","jun","jul","avg.","sep.","okt.","nov.","dec."],weekdays:["nedjelja","ponedjeljak","utorak","srijeda","četvrtak","petak","subota"],weekdaysShort:["ned.","pon.","uto.","sri.","čet.","pet.","sub."],weekdaysMin:["ne","po","ut","sr","če","pe","su"],longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sjutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[juče u] LT",lastWeek:function(){var e=["[prošle] [nedjelje] [u] LT","[prošlog] [ponedjeljka] [u] LT","[prošlog] [utorka] [u] LT","[prošle] [srijede] [u] LT","[prošlog] [četvrtka] [u] LT","[prošlog] [petka] [u] LT","[prošle] [subote] [u] LT"];return e[this.day()]},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"nekoliko sekundi",m:qr.translate,mm:qr.translate,h:qr.translate,hh:qr.translate,d:"dan",dd:qr.translate,M:"mjesec",MM:qr.translate,y:"godinu",yy:qr.translate},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),fr.defineLocale("mk",{months:"јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември".split("_"),monthsShort:"јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек".split("_"),weekdays:"недела_понеделник_вторник_среда_четврток_петок_сабота".split("_"),weekdaysShort:"нед_пон_вто_сре_чет_пет_саб".split("_"),weekdaysMin:"нe_пo_вт_ср_че_пе_сa".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"D.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[Денес во] LT",nextDay:"[Утре во] LT",nextWeek:"dddd [во] LT",lastDay:"[Вчера во] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[Во изминатата] dddd [во] LT";case 1:case 2:case 4:case 5:return"[Во изминатиот] dddd [во] LT"}},sameElse:"L"},relativeTime:{future:"после %s",past:"пред %s",s:"неколку секунди",m:"минута",mm:"%d минути",h:"час",hh:"%d часа",d:"ден",dd:"%d дена",M:"месец",MM:"%d месеци",y:"година",yy:"%d години"},ordinalParse:/\d{1,2}-(ев|ен|ти|ви|ри|ми)/,ordinal:function(e){var t=e%10,a=e%100;return 0===e?e+"-ев":0===a?e+"-ен":a>10&&20>a?e+"-ти":1===t?e+"-ви":2===t?e+"-ри":7===t||8===t?e+"-ми":e+"-ти"},week:{dow:1,doy:7}}),fr.defineLocale("ml",{months:"ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ".split("_"),monthsShort:"ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.".split("_"),weekdays:"ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച".split("_"),weekdaysShort:"ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി".split("_"),weekdaysMin:"ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ".split("_"),longDateFormat:{LT:"A h:mm -നു",LTS:"A h:mm:ss -നു",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm -നു",LLLL:"dddd, D MMMM YYYY, A h:mm -നു"},calendar:{sameDay:"[ഇന്ന്] LT",nextDay:"[നാളെ] LT",nextWeek:"dddd, LT",lastDay:"[ഇന്നലെ] LT",lastWeek:"[കഴിഞ്ഞ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s കഴിഞ്ഞ്",past:"%s മുൻപ്",s:"അൽപ നിമിഷങ്ങൾ",m:"ഒരു മിനിറ്റ്",mm:"%d മിനിറ്റ്",h:"ഒരു മണിക്കൂർ",hh:"%d മണിക്കൂർ",d:"ഒരു ദിവസം",dd:"%d ദിവസം",M:"ഒരു മാസം",MM:"%d മാസം",y:"ഒരു വർഷം",yy:"%d വർഷം"},meridiemParse:/രാത്രി|രാവിലെ|ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി/i,isPM:function(e){return/^(ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി)$/.test(e)},meridiem:function(e){return 4>e?"രാത്രി":12>e?"രാവിലെ":17>e?"ഉച്ച കഴിഞ്ഞ്":20>e?"വൈകുന്നേരം":"രാത്രി"}}),{1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"}),Xr={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"},Qr=(fr.defineLocale("mr",{months:"जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर".split("_"),monthsShort:"जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.".split("_"),weekdays:"रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),weekdaysShort:"रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि".split("_"),weekdaysMin:"र_सो_मं_बु_गु_शु_श".split("_"),longDateFormat:{LT:"A h:mm वाजता",LTS:"A h:mm:ss वाजता",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm वाजता",LLLL:"dddd, D MMMM YYYY, A h:mm वाजता"},calendar:{sameDay:"[आज] LT",nextDay:"[उद्या] LT",nextWeek:"dddd, LT",lastDay:"[काल] LT",lastWeek:"[मागील] dddd, LT",sameElse:"L"},relativeTime:{future:"%s नंतर",past:"%s पूर्वी",s:"सेकंद",m:"एक मिनिट",mm:"%d मिनिटे",h:"एक तास",hh:"%d तास",d:"एक दिवस",dd:"%d दिवस",M:"एक महिना",MM:"%d महिने",y:"एक वर्ष",yy:"%d वर्षे"},preparse:function(e){return e.replace(/[१२३४५६७८९०]/g,function(e){return Xr[e]})},postformat:function(e){return e.replace(/\d/g,function(e){return Br[e]})},meridiemParse:/रात्री|सकाळी|दुपारी|सायंकाळी/,meridiemHour:function(e,t){return 12===e&&(e=0),"रात्री"===t?4>e?e:e+12:"सकाळी"===t?e:"दुपारी"===t?e>=10?e:e+12:"सायंकाळी"===t?e+12:void 0},meridiem:function(e){return 4>e?"रात्री":10>e?"सकाळी":17>e?"दुपारी":20>e?"सायंकाळी":"रात्री"},week:{dow:0,doy:6}}),fr.defineLocale("ms-my",{months:"Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),monthsShort:"Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),weekdays:"Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),weekdaysShort:"Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),weekdaysMin:"Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/pagi|tengahari|petang|malam/,meridiemHour:function(e,t){return 12===e&&(e=0),"pagi"===t?e:"tengahari"===t?e>=11?e:e+12:"petang"===t||"malam"===t?e+12:void 0},meridiem:function(e){return 11>e?"pagi":15>e?"tengahari":19>e?"petang":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Esok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kelmarin pukul] LT",lastWeek:"dddd [lepas pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lepas",s:"beberapa saat",m:"seminit",mm:"%d minit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}}),fr.defineLocale("ms",{months:"Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),monthsShort:"Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),weekdays:"Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),weekdaysShort:"Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),weekdaysMin:"Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/pagi|tengahari|petang|malam/,meridiemHour:function(e,t){return 12===e&&(e=0),"pagi"===t?e:"tengahari"===t?e>=11?e:e+12:"petang"===t||"malam"===t?e+12:void 0},meridiem:function(e){return 11>e?"pagi":15>e?"tengahari":19>e?"petang":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Esok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kelmarin pukul] LT",lastWeek:"dddd [lepas pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lepas",s:"beberapa saat",m:"seminit",mm:"%d minit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}}),{1:"၁",2:"၂",3:"၃",4:"၄",5:"၅",6:"၆",7:"၇",8:"၈",9:"၉",0:"၀"}),ed={"၁":"1","၂":"2","၃":"3","၄":"4","၅":"5","၆":"6","၇":"7","၈":"8","၉":"9","၀":"0"},td=(fr.defineLocale("my",{months:"ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ".split("_"),monthsShort:"ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ".split("_"),weekdays:"တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ".split("_"),weekdaysShort:"နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),weekdaysMin:"နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[ယနေ.] LT [မှာ]",nextDay:"[မနက်ဖြန်] LT [မှာ]",nextWeek:"dddd LT [မှာ]",lastDay:"[မနေ.က] LT [မှာ]",lastWeek:"[ပြီးခဲ့သော] dddd LT [မှာ]",sameElse:"L"},relativeTime:{future:"လာမည့် %s မှာ",past:"လွန်ခဲ့သော %s က",s:"စက္ကန်.အနည်းငယ်",m:"တစ်မိနစ်",mm:"%d မိနစ်",h:"တစ်နာရီ",hh:"%d နာရီ",d:"တစ်ရက်",dd:"%d ရက်",M:"တစ်လ",MM:"%d လ",y:"တစ်နှစ်",yy:"%d နှစ်"},preparse:function(e){return e.replace(/[၁၂၃၄၅၆၇၈၉၀]/g,function(e){return ed[e]})},postformat:function(e){return e.replace(/\d/g,function(e){return Qr[e]})},week:{dow:1,doy:4}}),fr.defineLocale("nb",{months:"januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),weekdaysShort:"søn_man_tirs_ons_tors_fre_lør".split("_"),weekdaysMin:"sø_ma_ti_on_to_fr_lø".split("_"),longDateFormat:{LT:"H.mm",LTS:"H.mm.ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] H.mm",LLLL:"dddd D. MMMM YYYY [kl.] H.mm"},calendar:{sameDay:"[i dag kl.] LT",nextDay:"[i morgen kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[i går kl.] LT",lastWeek:"[forrige] dddd [kl.] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"for %s siden",s:"noen sekunder",m:"ett minutt",mm:"%d minutter",h:"en time",hh:"%d timer",d:"en dag",dd:"%d dager",M:"en måned",MM:"%d måneder",y:"ett år",yy:"%d år"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),{1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"}),ad={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"},nd=(fr.defineLocale("ne",{months:"जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर".split("_"),monthsShort:"जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.".split("_"),weekdays:"आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार".split("_"),weekdaysShort:"आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.".split("_"),weekdaysMin:"आइ._सो._मङ्_बु._बि._शु._श.".split("_"),longDateFormat:{LT:"Aको h:mm बजे",LTS:"Aको h:mm:ss बजे",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, Aको h:mm बजे",LLLL:"dddd, D MMMM YYYY, Aको h:mm बजे"},preparse:function(e){return e.replace(/[१२३४५६७८९०]/g,function(e){return ad[e]})},postformat:function(e){return e.replace(/\d/g,function(e){return td[e]})},meridiemParse:/राती|बिहान|दिउँसो|बेलुका|साँझ|राती/,meridiemHour:function(e,t){return 12===e&&(e=0),"राती"===t?3>e?e:e+12:"बिहान"===t?e:"दिउँसो"===t?e>=10?e:e+12:"बेलुका"===t||"साँझ"===t?e+12:void 0},meridiem:function(e){return 3>e?"राती":10>e?"बिहान":15>e?"दिउँसो":18>e?"बेलुका":20>e?"साँझ":"राती"},calendar:{sameDay:"[आज] LT",nextDay:"[भोली] LT",nextWeek:"[आउँदो] dddd[,] LT",lastDay:"[हिजो] LT",lastWeek:"[गएको] dddd[,] LT",sameElse:"L"},relativeTime:{future:"%sमा",past:"%s अगाडी",s:"केही समय",m:"एक मिनेट",mm:"%d मिनेट",h:"एक घण्टा",hh:"%d घण्टा",d:"एक दिन",dd:"%d दिन",M:"एक महिना",MM:"%d महिना",y:"एक बर्ष",yy:"%d बर्ष"},week:{dow:1,doy:7}}),"jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_")),sd="jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_"),_d=(fr.defineLocale("nl",{months:"januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),monthsShort:function(e,t){return/-MMM-/.test(t)?sd[e.month()]:nd[e.month()]},weekdays:"zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),weekdaysShort:"zo._ma._di._wo._do._vr._za.".split("_"),weekdaysMin:"Zo_Ma_Di_Wo_Do_Vr_Za".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[vandaag om] LT",nextDay:"[morgen om] LT",nextWeek:"dddd [om] LT",lastDay:"[gisteren om] LT",lastWeek:"[afgelopen] dddd [om] LT",sameElse:"L"},relativeTime:{future:"over %s",past:"%s geleden",s:"een paar seconden",m:"één minuut",mm:"%d minuten",h:"één uur",hh:"%d uur",d:"één dag",dd:"%d dagen",M:"één maand",MM:"%d maanden",y:"één jaar",yy:"%d jaar"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(e){return e+(1===e||8===e||e>=20?"ste":"de")},week:{dow:1,doy:4}}),fr.defineLocale("nn",{months:"januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag".split("_"),weekdaysShort:"sun_mån_tys_ons_tor_fre_lau".split("_"),weekdaysMin:"su_må_ty_on_to_fr_lø".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[I dag klokka] LT",nextDay:"[I morgon klokka] LT",nextWeek:"dddd [klokka] LT",lastDay:"[I går klokka] LT",lastWeek:"[Føregåande] dddd [klokka] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"for %s sidan",s:"nokre sekund",m:"eit minutt",mm:"%d minutt",h:"ein time",hh:"%d timar",d:"ein dag",dd:"%d dagar",M:"ein månad",MM:"%d månader",y:"eit år",yy:"%d år"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),"styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień".split("_")),rd="stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia".split("_"),dd=(fr.defineLocale("pl",{months:function(e,t){return""===t?"("+rd[e.month()]+"|"+_d[e.month()]+")":/D MMMM/.test(t)?rd[e.month()]:_d[e.month()]},monthsShort:"sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru".split("_"),weekdays:"niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota".split("_"),weekdaysShort:"nie_pon_wt_śr_czw_pt_sb".split("_"),weekdaysMin:"N_Pn_Wt_Śr_Cz_Pt_So".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Dziś o] LT",nextDay:"[Jutro o] LT",nextWeek:"[W] dddd [o] LT",lastDay:"[Wczoraj o] LT",lastWeek:function(){switch(this.day()){case 0:return"[W zeszłą niedzielę o] LT";case 3:return"[W zeszłą środę o] LT";case 6:return"[W zeszłą sobotę o] LT";default:return"[W zeszły] dddd [o] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"%s temu",s:"kilka sekund",m:Ts,mm:Ts,h:Ts,hh:Ts,d:"1 dzień",dd:"%d dni",M:"miesiąc",MM:Ts,y:"rok",yy:Ts},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),fr.defineLocale("pt-br",{months:"Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),monthsShort:"Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),weekdays:"Domingo_Segunda-Feira_Terça-Feira_Quarta-Feira_Quinta-Feira_Sexta-Feira_Sábado".split("_"),weekdaysShort:"Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),weekdaysMin:"Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY [às] HH:mm",LLLL:"dddd, D [de] MMMM [de] YYYY [às] HH:mm"},calendar:{sameDay:"[Hoje às] LT",nextDay:"[Amanhã às] LT",nextWeek:"dddd [às] LT",lastDay:"[Ontem às] LT",lastWeek:function(){return 0===this.day()||6===this.day()?"[Último] dddd [às] LT":"[Última] dddd [às] LT"},sameElse:"L"},relativeTime:{future:"em %s",past:"%s atrás",s:"poucos segundos",m:"um minuto",mm:"%d minutos",h:"uma hora",hh:"%d horas",d:"um dia",dd:"%d dias",M:"um mês",MM:"%d meses",y:"um ano",yy:"%d anos"},ordinalParse:/\d{1,2}º/,ordinal:"%dº"}),fr.defineLocale("pt",{months:"Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),monthsShort:"Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),weekdays:"Domingo_Segunda-Feira_Terça-Feira_Quarta-Feira_Quinta-Feira_Sexta-Feira_Sábado".split("_"),weekdaysShort:"Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),weekdaysMin:"Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY HH:mm",LLLL:"dddd, D [de] MMMM [de] YYYY HH:mm"},calendar:{sameDay:"[Hoje às] LT",nextDay:"[Amanhã às] LT",nextWeek:"dddd [às] LT",lastDay:"[Ontem às] LT",lastWeek:function(){return 0===this.day()||6===this.day()?"[Último] dddd [às] LT":"[Última] dddd [às] LT"},sameElse:"L"},relativeTime:{future:"em %s",past:"há %s",s:"segundos",m:"um minuto",mm:"%d minutos",h:"uma hora",hh:"%d horas",d:"um dia",dd:"%d dias",M:"um mês",MM:"%d meses",y:"um ano",yy:"%d anos"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}}),fr.defineLocale("ro",{months:"ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie".split("_"),monthsShort:"ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.".split("_"),weekdays:"duminică_luni_marți_miercuri_joi_vineri_sâmbătă".split("_"),weekdaysShort:"Dum_Lun_Mar_Mie_Joi_Vin_Sâm".split("_"),weekdaysMin:"Du_Lu_Ma_Mi_Jo_Vi_Sâ".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[azi la] LT",nextDay:"[mâine la] LT",nextWeek:"dddd [la] LT",lastDay:"[ieri la] LT",lastWeek:"[fosta] dddd [la] LT",sameElse:"L"},relativeTime:{future:"peste %s",past:"%s în urmă",s:"câteva secunde",m:"un minut",mm:gs,h:"o oră",hh:gs,d:"o zi",dd:gs,M:"o lună",MM:gs,y:"un an",yy:gs},week:{dow:1,doy:7}}),fr.defineLocale("ru",{months:Ss,monthsShort:Hs,weekdays:bs,weekdaysShort:"вс_пн_вт_ср_чт_пт_сб".split("_"),weekdaysMin:"вс_пн_вт_ср_чт_пт_сб".split("_"),monthsParse:[/^янв/i,/^фев/i,/^мар/i,/^апр/i,/^ма[й|я]/i,/^июн/i,/^июл/i,/^авг/i,/^сен/i,/^окт/i,/^ноя/i,/^дек/i],longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., HH:mm",LLLL:"dddd, D MMMM YYYY г., HH:mm"},calendar:{sameDay:"[Сегодня в] LT",nextDay:"[Завтра в] LT",lastDay:"[Вчера в] LT",nextWeek:function(){return 2===this.day()?"[Во] dddd [в] LT":"[В] dddd [в] LT"},lastWeek:function(e){if(e.week()===this.week())return 2===this.day()?"[Во] dddd [в] LT":"[В] dddd [в] LT";switch(this.day()){case 0:return"[В прошлое] dddd [в] LT";case 1:case 2:case 4:return"[В прошлый] dddd [в] LT";case 3:case 5:case 6:return"[В прошлую] dddd [в] LT"}},sameElse:"L"},relativeTime:{future:"через %s",past:"%s назад",s:"несколько секунд",m:vs,mm:vs,h:"час",hh:vs,d:"день",dd:vs,M:"месяц",MM:vs,y:"год",yy:vs},meridiemParse:/ночи|утра|дня|вечера/i,isPM:function(e){return/^(дня|вечера)$/.test(e)},meridiem:function(e){return 4>e?"ночи":12>e?"утра":17>e?"дня":"вечера"},ordinalParse:/\d{1,2}-(й|го|я)/,ordinal:function(e,t){switch(t){case"M":case"d":case"DDD":return e+"-й";case"D":return e+"-го";case"w":case"W":return e+"-я";default:return e}},week:{dow:1,doy:7}}),fr.defineLocale("si",{months:"ජනවාරි_පෙබරවාරි_මාර්තු_අප්‍රේල්_මැයි_ජූනි_ජූලි_අගෝස්තු_සැප්තැම්බර්_ඔක්තෝබර්_නොවැම්බර්_දෙසැම්බර්".split("_"),monthsShort:"ජන_පෙබ_මාර්_අප්_මැයි_ජූනි_ජූලි_අගෝ_සැප්_ඔක්_නොවැ_දෙසැ".split("_"),weekdays:"ඉරිදා_සඳුදා_අඟහරුවාදා_බදාදා_බ්‍රහස්පතින්දා_සිකුරාදා_සෙනසුරාදා".split("_"),weekdaysShort:"ඉරි_සඳු_අඟ_බදා_බ්‍රහ_සිකු_සෙන".split("_"),weekdaysMin:"ඉ_ස_අ_බ_බ්‍ර_සි_සෙ".split("_"),longDateFormat:{LT:"a h:mm",LTS:"a h:mm:ss",L:"YYYY/MM/DD",LL:"YYYY MMMM D",LLL:"YYYY MMMM D, a h:mm",LLLL:"YYYY MMMM D [වැනි] dddd, a h:mm:ss"},calendar:{sameDay:"[අද] LT[ට]",nextDay:"[හෙට] LT[ට]",nextWeek:"dddd LT[ට]",lastDay:"[ඊයේ] LT[ට]",lastWeek:"[පසුගිය] dddd LT[ට]",sameElse:"L"},relativeTime:{future:"%sකින්",past:"%sකට පෙර",s:"තත්පර කිහිපය",m:"මිනිත්තුව",mm:"මිනිත්තු %d",h:"පැය",hh:"පැය %d",d:"දිනය",dd:"දින %d",M:"මාසය",MM:"මාස %d",y:"වසර",yy:"වසර %d"},ordinalParse:/\d{1,2} වැනි/,ordinal:function(e){return e+" වැනි"},meridiem:function(e,t,a){return e>11?a?"ප.ව.":"පස් වරු":a?"පෙ.ව.":"පෙර වරු"}}),"január_február_marec_apríl_máj_jún_júl_august_september_október_november_december".split("_")),id="jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec".split("_"),od=(fr.defineLocale("sk",{months:dd,monthsShort:id,monthsParse:function(e,t){var a,n=[];for(a=0;12>a;a++)n[a]=new RegExp("^"+e[a]+"$|^"+t[a]+"$","i");return n}(dd,id),weekdays:"nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota".split("_"),weekdaysShort:"ne_po_ut_st_št_pi_so".split("_"),weekdaysMin:"ne_po_ut_st_št_pi_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd D. MMMM YYYY H:mm"},calendar:{sameDay:"[dnes o] LT",nextDay:"[zajtra o] LT",nextWeek:function(){switch(this.day()){case 0:return"[v nedeľu o] LT";case 1:case 2:return"[v] dddd [o] LT";case 3:return"[v stredu o] LT";case 4:return"[vo štvrtok o] LT";case 5:return"[v piatok o] LT";case 6:return"[v sobotu o] LT"}},lastDay:"[včera o] LT",lastWeek:function(){switch(this.day()){case 0:return"[minulú nedeľu o] LT";case 1:case 2:return"[minulý] dddd [o] LT";case 3:return"[minulú stredu o] LT";case 4:case 5:return"[minulý] dddd [o] LT";case 6:return"[minulú sobotu o] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"pred %s",s:Ws,m:Ws,mm:Ws,h:Ws,hh:Ws,d:Ws,dd:Ws,M:Ws,MM:Ws,y:Ws,yy:Ws},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),fr.defineLocale("sl",{months:"januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december".split("_"),monthsShort:"jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split("_"),weekdays:"nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota".split("_"),weekdaysShort:"ned._pon._tor._sre._čet._pet._sob.".split("_"),weekdaysMin:"ne_po_to_sr_če_pe_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danes ob] LT",nextDay:"[jutri ob] LT",nextWeek:function(){switch(this.day()){case 0:return"[v] [nedeljo] [ob] LT";case 3:return"[v] [sredo] [ob] LT";case 6:return"[v] [soboto] [ob] LT";case 1:case 2:case 4:case 5:return"[v] dddd [ob] LT"}},lastDay:"[včeraj ob] LT",lastWeek:function(){switch(this.day()){case 0:return"[prejšnjo] [nedeljo] [ob] LT";case 3:return"[prejšnjo] [sredo] [ob] LT";case 6:return"[prejšnjo] [soboto] [ob] LT";case 1:case 2:case 4:case 5:return"[prejšnji] dddd [ob] LT"}},sameElse:"L"},relativeTime:{future:"čez %s",past:"pred %s",s:xs,m:xs,mm:xs,h:xs,hh:xs,d:xs,dd:xs,M:xs,MM:xs,y:xs,yy:xs},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),fr.defineLocale("sq",{months:"Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor".split("_"),monthsShort:"Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj".split("_"),weekdays:"E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë".split("_"),weekdaysShort:"Die_Hën_Mar_Mër_Enj_Pre_Sht".split("_"),weekdaysMin:"D_H_Ma_Më_E_P_Sh".split("_"),meridiemParse:/PD|MD/,isPM:function(e){return"M"===e.charAt(0)},meridiem:function(e){return 12>e?"PD":"MD"
},longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Sot në] LT",nextDay:"[Nesër në] LT",nextWeek:"dddd [në] LT",lastDay:"[Dje në] LT",lastWeek:"dddd [e kaluar në] LT",sameElse:"L"},relativeTime:{future:"në %s",past:"%s më parë",s:"disa sekonda",m:"një minutë",mm:"%d minuta",h:"një orë",hh:"%d orë",d:"një ditë",dd:"%d ditë",M:"një muaj",MM:"%d muaj",y:"një vit",yy:"%d vite"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),{words:{m:["један минут","једне минуте"],mm:["минут","минуте","минута"],h:["један сат","једног сата"],hh:["сат","сата","сати"],dd:["дан","дана","дана"],MM:["месец","месеца","месеци"],yy:["година","године","година"]},correctGrammaticalCase:function(e,t){return 1===e?t[0]:e>=2&&4>=e?t[1]:t[2]},translate:function(e,t,a){var n=od.words[a];return 1===a.length?t?n[0]:n[1]:e+" "+od.correctGrammaticalCase(e,n)}}),md=(fr.defineLocale("sr-cyrl",{months:["јануар","фебруар","март","април","мај","јун","јул","август","септембар","октобар","новембар","децембар"],monthsShort:["јан.","феб.","мар.","апр.","мај","јун","јул","авг.","сеп.","окт.","нов.","дец."],weekdays:["недеља","понедељак","уторак","среда","четвртак","петак","субота"],weekdaysShort:["нед.","пон.","уто.","сре.","чет.","пет.","суб."],weekdaysMin:["не","по","ут","ср","че","пе","су"],longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[данас у] LT",nextDay:"[сутра у] LT",nextWeek:function(){switch(this.day()){case 0:return"[у] [недељу] [у] LT";case 3:return"[у] [среду] [у] LT";case 6:return"[у] [суботу] [у] LT";case 1:case 2:case 4:case 5:return"[у] dddd [у] LT"}},lastDay:"[јуче у] LT",lastWeek:function(){var e=["[прошле] [недеље] [у] LT","[прошлог] [понедељка] [у] LT","[прошлог] [уторка] [у] LT","[прошле] [среде] [у] LT","[прошлог] [четвртка] [у] LT","[прошлог] [петка] [у] LT","[прошле] [суботе] [у] LT"];return e[this.day()]},sameElse:"L"},relativeTime:{future:"за %s",past:"пре %s",s:"неколико секунди",m:od.translate,mm:od.translate,h:od.translate,hh:od.translate,d:"дан",dd:od.translate,M:"месец",MM:od.translate,y:"годину",yy:od.translate},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),{words:{m:["jedan minut","jedne minute"],mm:["minut","minute","minuta"],h:["jedan sat","jednog sata"],hh:["sat","sata","sati"],dd:["dan","dana","dana"],MM:["mesec","meseca","meseci"],yy:["godina","godine","godina"]},correctGrammaticalCase:function(e,t){return 1===e?t[0]:e>=2&&4>=e?t[1]:t[2]},translate:function(e,t,a){var n=md.words[a];return 1===a.length?t?n[0]:n[1]:e+" "+md.correctGrammaticalCase(e,n)}}),ud=(fr.defineLocale("sr",{months:["januar","februar","mart","april","maj","jun","jul","avgust","septembar","oktobar","novembar","decembar"],monthsShort:["jan.","feb.","mar.","apr.","maj","jun","jul","avg.","sep.","okt.","nov.","dec."],weekdays:["nedelja","ponedeljak","utorak","sreda","četvrtak","petak","subota"],weekdaysShort:["ned.","pon.","uto.","sre.","čet.","pet.","sub."],weekdaysMin:["ne","po","ut","sr","če","pe","su"],longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedelju] [u] LT";case 3:return"[u] [sredu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[juče u] LT",lastWeek:function(){var e=["[prošle] [nedelje] [u] LT","[prošlog] [ponedeljka] [u] LT","[prošlog] [utorka] [u] LT","[prošle] [srede] [u] LT","[prošlog] [četvrtka] [u] LT","[prošlog] [petka] [u] LT","[prošle] [subote] [u] LT"];return e[this.day()]},sameElse:"L"},relativeTime:{future:"za %s",past:"pre %s",s:"nekoliko sekundi",m:md.translate,mm:md.translate,h:md.translate,hh:md.translate,d:"dan",dd:md.translate,M:"mesec",MM:md.translate,y:"godinu",yy:md.translate},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),fr.defineLocale("sv",{months:"januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),weekdays:"söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag".split("_"),weekdaysShort:"sön_mån_tis_ons_tor_fre_lör".split("_"),weekdaysMin:"sö_må_ti_on_to_fr_lö".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Idag] LT",nextDay:"[Imorgon] LT",lastDay:"[Igår] LT",nextWeek:"[På] dddd LT",lastWeek:"[I] dddd[s] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"för %s sedan",s:"några sekunder",m:"en minut",mm:"%d minuter",h:"en timme",hh:"%d timmar",d:"en dag",dd:"%d dagar",M:"en månad",MM:"%d månader",y:"ett år",yy:"%d år"},ordinalParse:/\d{1,2}(e|a)/,ordinal:function(e){var t=e%10,a=1===~~(e%100/10)?"e":1===t?"a":2===t?"a":"e";return e+a},week:{dow:1,doy:4}}),fr.defineLocale("ta",{months:"ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),monthsShort:"ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),weekdays:"ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை".split("_"),weekdaysShort:"ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி".split("_"),weekdaysMin:"ஞா_தி_செ_பு_வி_வெ_ச".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, HH:mm",LLLL:"dddd, D MMMM YYYY, HH:mm"},calendar:{sameDay:"[இன்று] LT",nextDay:"[நாளை] LT",nextWeek:"dddd, LT",lastDay:"[நேற்று] LT",lastWeek:"[கடந்த வாரம்] dddd, LT",sameElse:"L"},relativeTime:{future:"%s இல்",past:"%s முன்",s:"ஒரு சில விநாடிகள்",m:"ஒரு நிமிடம்",mm:"%d நிமிடங்கள்",h:"ஒரு மணி நேரம்",hh:"%d மணி நேரம்",d:"ஒரு நாள்",dd:"%d நாட்கள்",M:"ஒரு மாதம்",MM:"%d மாதங்கள்",y:"ஒரு வருடம்",yy:"%d ஆண்டுகள்"},ordinalParse:/\d{1,2}வது/,ordinal:function(e){return e+"வது"},meridiemParse:/யாமம்|வைகறை|காலை|நண்பகல்|எற்பாடு|மாலை/,meridiem:function(e){return 2>e?" யாமம்":6>e?" வைகறை":10>e?" காலை":14>e?" நண்பகல்":18>e?" எற்பாடு":22>e?" மாலை":" யாமம்"},meridiemHour:function(e,t){return 12===e&&(e=0),"யாமம்"===t?2>e?e:e+12:"வைகறை"===t||"காலை"===t?e:"நண்பகல்"===t&&e>=10?e:e+12},week:{dow:0,doy:6}}),fr.defineLocale("th",{months:"มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม".split("_"),monthsShort:"มกรา_กุมภา_มีนา_เมษา_พฤษภา_มิถุนา_กรกฎา_สิงหา_กันยา_ตุลา_พฤศจิกา_ธันวา".split("_"),weekdays:"อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์".split("_"),weekdaysShort:"อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์".split("_"),weekdaysMin:"อา._จ._อ._พ._พฤ._ศ._ส.".split("_"),longDateFormat:{LT:"H นาฬิกา m นาที",LTS:"H นาฬิกา m นาที s วินาที",L:"YYYY/MM/DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY เวลา H นาฬิกา m นาที",LLLL:"วันddddที่ D MMMM YYYY เวลา H นาฬิกา m นาที"},meridiemParse:/ก่อนเที่ยง|หลังเที่ยง/,isPM:function(e){return"หลังเที่ยง"===e},meridiem:function(e){return 12>e?"ก่อนเที่ยง":"หลังเที่ยง"},calendar:{sameDay:"[วันนี้ เวลา] LT",nextDay:"[พรุ่งนี้ เวลา] LT",nextWeek:"dddd[หน้า เวลา] LT",lastDay:"[เมื่อวานนี้ เวลา] LT",lastWeek:"[วัน]dddd[ที่แล้ว เวลา] LT",sameElse:"L"},relativeTime:{future:"อีก %s",past:"%sที่แล้ว",s:"ไม่กี่วินาที",m:"1 นาที",mm:"%d นาที",h:"1 ชั่วโมง",hh:"%d ชั่วโมง",d:"1 วัน",dd:"%d วัน",M:"1 เดือน",MM:"%d เดือน",y:"1 ปี",yy:"%d ปี"}}),fr.defineLocale("tl-ph",{months:"Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre".split("_"),monthsShort:"Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis".split("_"),weekdays:"Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado".split("_"),weekdaysShort:"Lin_Lun_Mar_Miy_Huw_Biy_Sab".split("_"),weekdaysMin:"Li_Lu_Ma_Mi_Hu_Bi_Sab".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"MM/D/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY HH:mm",LLLL:"dddd, MMMM DD, YYYY HH:mm"},calendar:{sameDay:"[Ngayon sa] LT",nextDay:"[Bukas sa] LT",nextWeek:"dddd [sa] LT",lastDay:"[Kahapon sa] LT",lastWeek:"dddd [huling linggo] LT",sameElse:"L"},relativeTime:{future:"sa loob ng %s",past:"%s ang nakalipas",s:"ilang segundo",m:"isang minuto",mm:"%d minuto",h:"isang oras",hh:"%d oras",d:"isang araw",dd:"%d araw",M:"isang buwan",MM:"%d buwan",y:"isang taon",yy:"%d taon"},ordinalParse:/\d{1,2}/,ordinal:function(e){return e},week:{dow:1,doy:4}}),{1:"'inci",5:"'inci",8:"'inci",70:"'inci",80:"'inci",2:"'nci",7:"'nci",20:"'nci",50:"'nci",3:"'üncü",4:"'üncü",100:"'üncü",6:"'ncı",9:"'uncu",10:"'uncu",30:"'uncu",60:"'ıncı",90:"'ıncı"}),ld=(fr.defineLocale("tr",{months:"Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık".split("_"),monthsShort:"Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara".split("_"),weekdays:"Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi".split("_"),weekdaysShort:"Paz_Pts_Sal_Çar_Per_Cum_Cts".split("_"),weekdaysMin:"Pz_Pt_Sa_Ça_Pe_Cu_Ct".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[bugün saat] LT",nextDay:"[yarın saat] LT",nextWeek:"[haftaya] dddd [saat] LT",lastDay:"[dün] LT",lastWeek:"[geçen hafta] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s sonra",past:"%s önce",s:"birkaç saniye",m:"bir dakika",mm:"%d dakika",h:"bir saat",hh:"%d saat",d:"bir gün",dd:"%d gün",M:"bir ay",MM:"%d ay",y:"bir yıl",yy:"%d yıl"},ordinalParse:/\d{1,2}'(inci|nci|üncü|ncı|uncu|ıncı)/,ordinal:function(e){if(0===e)return e+"'ıncı";var t=e%10,a=e%100-t,n=e>=100?100:null;return e+(ud[t]||ud[a]||ud[n])},week:{dow:1,doy:7}}),fr.defineLocale("tzl",{months:"Januar_Fevraglh_Març_Avrïu_Mai_Gün_Julia_Guscht_Setemvar_Listopäts_Noemvar_Zecemvar".split("_"),monthsShort:"Jan_Fev_Mar_Avr_Mai_Gün_Jul_Gus_Set_Lis_Noe_Zec".split("_"),weekdays:"Súladi_Lúneçi_Maitzi_Márcuri_Xhúadi_Viénerçi_Sáturi".split("_"),weekdaysShort:"Súl_Lún_Mai_Már_Xhú_Vié_Sát".split("_"),weekdaysMin:"Sú_Lú_Ma_Má_Xh_Vi_Sá".split("_"),longDateFormat:{LT:"HH.mm",LTS:"LT.ss",L:"DD.MM.YYYY",LL:"D. MMMM [dallas] YYYY",LLL:"D. MMMM [dallas] YYYY LT",LLLL:"dddd, [li] D. MMMM [dallas] YYYY LT"},meridiem:function(e,t,a){return e>11?a?"d'o":"D'O":a?"d'a":"D'A"},calendar:{sameDay:"[oxhi à] LT",nextDay:"[demà à] LT",nextWeek:"dddd [à] LT",lastDay:"[ieiri à] LT",lastWeek:"[sür el] dddd [lasteu à] LT",sameElse:"L"},relativeTime:{future:"osprei %s",past:"ja%s",s:Fs,m:Fs,mm:Fs,h:Fs,hh:Fs,d:Fs,dd:Fs,M:Fs,MM:Fs,y:Fs,yy:Fs},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),fr.defineLocale("tzm-latn",{months:"innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),monthsShort:"innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),weekdays:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),weekdaysShort:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),weekdaysMin:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[asdkh g] LT",nextDay:"[aska g] LT",nextWeek:"dddd [g] LT",lastDay:"[assant g] LT",lastWeek:"dddd [g] LT",sameElse:"L"},relativeTime:{future:"dadkh s yan %s",past:"yan %s",s:"imik",m:"minuḍ",mm:"%d minuḍ",h:"saɛa",hh:"%d tassaɛin",d:"ass",dd:"%d ossan",M:"ayowr",MM:"%d iyyirn",y:"asgas",yy:"%d isgasn"},week:{dow:6,doy:12}}),fr.defineLocale("tzm",{months:"ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),monthsShort:"ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),weekdays:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),weekdaysShort:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),weekdaysMin:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[ⴰⵙⴷⵅ ⴴ] LT",nextDay:"[ⴰⵙⴽⴰ ⴴ] LT",nextWeek:"dddd [ⴴ] LT",lastDay:"[ⴰⵚⴰⵏⵜ ⴴ] LT",lastWeek:"dddd [ⴴ] LT",sameElse:"L"},relativeTime:{future:"ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s",past:"ⵢⴰⵏ %s",s:"ⵉⵎⵉⴽ",m:"ⵎⵉⵏⵓⴺ",mm:"%d ⵎⵉⵏⵓⴺ",h:"ⵙⴰⵄⴰ",hh:"%d ⵜⴰⵙⵙⴰⵄⵉⵏ",d:"ⴰⵙⵙ",dd:"%d oⵙⵙⴰⵏ",M:"ⴰⵢoⵓⵔ",MM:"%d ⵉⵢⵢⵉⵔⵏ",y:"ⴰⵙⴳⴰⵙ",yy:"%d ⵉⵙⴳⴰⵙⵏ"},week:{dow:6,doy:12}}),fr.defineLocale("uk",{months:zs,monthsShort:"січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд".split("_"),weekdays:Es,weekdaysShort:"нд_пн_вт_ср_чт_пт_сб".split("_"),weekdaysMin:"нд_пн_вт_ср_чт_пт_сб".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY р.",LLL:"D MMMM YYYY р., HH:mm",LLLL:"dddd, D MMMM YYYY р., HH:mm"},calendar:{sameDay:Os("[Сьогодні "),nextDay:Os("[Завтра "),lastDay:Os("[Вчора "),nextWeek:Os("[У] dddd ["),lastWeek:function(){switch(this.day()){case 0:case 3:case 5:case 6:return Os("[Минулої] dddd [").call(this);case 1:case 2:case 4:return Os("[Минулого] dddd [").call(this)}},sameElse:"L"},relativeTime:{future:"за %s",past:"%s тому",s:"декілька секунд",m:Ps,mm:Ps,h:"годину",hh:Ps,d:"день",dd:Ps,M:"місяць",MM:Ps,y:"рік",yy:Ps},meridiemParse:/ночі|ранку|дня|вечора/,isPM:function(e){return/^(дня|вечора)$/.test(e)},meridiem:function(e){return 4>e?"ночі":12>e?"ранку":17>e?"дня":"вечора"},ordinalParse:/\d{1,2}-(й|го)/,ordinal:function(e,t){switch(t){case"M":case"d":case"DDD":case"w":case"W":return e+"-й";case"D":return e+"-го";default:return e}},week:{dow:1,doy:7}}),fr.defineLocale("uz",{months:"январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),monthsShort:"янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),weekdays:"Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба".split("_"),weekdaysShort:"Якш_Душ_Сеш_Чор_Пай_Жум_Шан".split("_"),weekdaysMin:"Як_Ду_Се_Чо_Па_Жу_Ша".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"D MMMM YYYY, dddd HH:mm"},calendar:{sameDay:"[Бугун соат] LT [да]",nextDay:"[Эртага] LT [да]",nextWeek:"dddd [куни соат] LT [да]",lastDay:"[Кеча соат] LT [да]",lastWeek:"[Утган] dddd [куни соат] LT [да]",sameElse:"L"},relativeTime:{future:"Якин %s ичида",past:"Бир неча %s олдин",s:"фурсат",m:"бир дакика",mm:"%d дакика",h:"бир соат",hh:"%d соат",d:"бир кун",dd:"%d кун",M:"бир ой",MM:"%d ой",y:"бир йил",yy:"%d йил"},week:{dow:1,doy:7}}),fr.defineLocale("vi",{months:"tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12".split("_"),monthsShort:"Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12".split("_"),weekdays:"chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy".split("_"),weekdaysShort:"CN_T2_T3_T4_T5_T6_T7".split("_"),weekdaysMin:"CN_T2_T3_T4_T5_T6_T7".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM [năm] YYYY",LLL:"D MMMM [năm] YYYY HH:mm",LLLL:"dddd, D MMMM [năm] YYYY HH:mm",l:"DD/M/YYYY",ll:"D MMM YYYY",lll:"D MMM YYYY HH:mm",llll:"ddd, D MMM YYYY HH:mm"},calendar:{sameDay:"[Hôm nay lúc] LT",nextDay:"[Ngày mai lúc] LT",nextWeek:"dddd [tuần tới lúc] LT",lastDay:"[Hôm qua lúc] LT",lastWeek:"dddd [tuần rồi lúc] LT",sameElse:"L"},relativeTime:{future:"%s tới",past:"%s trước",s:"vài giây",m:"một phút",mm:"%d phút",h:"một giờ",hh:"%d giờ",d:"một ngày",dd:"%d ngày",M:"một tháng",MM:"%d tháng",y:"một năm",yy:"%d năm"},ordinalParse:/\d{1,2}/,ordinal:function(e){return e},week:{dow:1,doy:4}}),fr.defineLocale("zh-cn",{months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"周日_周一_周二_周三_周四_周五_周六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"Ah点mm分",LTS:"Ah点m分s秒",L:"YYYY-MM-DD",LL:"YYYY年MMMD日",LLL:"YYYY年MMMD日Ah点mm分",LLLL:"YYYY年MMMD日ddddAh点mm分",l:"YYYY-MM-DD",ll:"YYYY年MMMD日",lll:"YYYY年MMMD日Ah点mm分",llll:"YYYY年MMMD日ddddAh点mm分"},meridiemParse:/凌晨|早上|上午|中午|下午|晚上/,meridiemHour:function(e,t){return 12===e&&(e=0),"凌晨"===t||"早上"===t||"上午"===t?e:"下午"===t||"晚上"===t?e+12:e>=11?e:e+12},meridiem:function(e,t){var a=100*e+t;return 600>a?"凌晨":900>a?"早上":1130>a?"上午":1230>a?"中午":1800>a?"下午":"晚上"},calendar:{sameDay:function(){return 0===this.minutes()?"[今天]Ah[点整]":"[今天]LT"},nextDay:function(){return 0===this.minutes()?"[明天]Ah[点整]":"[明天]LT"},lastDay:function(){return 0===this.minutes()?"[昨天]Ah[点整]":"[昨天]LT"},nextWeek:function(){var e,t;return e=fr().startOf("week"),t=this.unix()-e.unix()>=604800?"[下]":"[本]",0===this.minutes()?t+"dddAh点整":t+"dddAh点mm"},lastWeek:function(){var e,t;return e=fr().startOf("week"),t=this.unix()<e.unix()?"[上]":"[本]",0===this.minutes()?t+"dddAh点整":t+"dddAh点mm"},sameElse:"LL"},ordinalParse:/\d{1,2}(日|月|周)/,ordinal:function(e,t){switch(t){case"d":case"D":case"DDD":return e+"日";case"M":return e+"月";case"w":case"W":return e+"周";default:return e}},relativeTime:{future:"%s内",past:"%s前",s:"几秒",m:"1 分钟",mm:"%d 分钟",h:"1 小时",hh:"%d 小时",d:"1 天",dd:"%d 天",M:"1 个月",MM:"%d 个月",y:"1 年",yy:"%d 年"},week:{dow:1,doy:4}}),fr.defineLocale("zh-tw",{months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"週日_週一_週二_週三_週四_週五_週六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"Ah點mm分",LTS:"Ah點m分s秒",L:"YYYY年MMMD日",LL:"YYYY年MMMD日",LLL:"YYYY年MMMD日Ah點mm分",LLLL:"YYYY年MMMD日ddddAh點mm分",l:"YYYY年MMMD日",ll:"YYYY年MMMD日",lll:"YYYY年MMMD日Ah點mm分",llll:"YYYY年MMMD日ddddAh點mm分"},meridiemParse:/早上|上午|中午|下午|晚上/,meridiemHour:function(e,t){return 12===e&&(e=0),"早上"===t||"上午"===t?e:"中午"===t?e>=11?e:e+12:"下午"===t||"晚上"===t?e+12:void 0},meridiem:function(e,t){var a=100*e+t;return 900>a?"早上":1130>a?"上午":1230>a?"中午":1800>a?"下午":"晚上"},calendar:{sameDay:"[今天]LT",nextDay:"[明天]LT",nextWeek:"[下]ddddLT",lastDay:"[昨天]LT",lastWeek:"[上]ddddLT",sameElse:"L"},ordinalParse:/\d{1,2}(日|月|週)/,ordinal:function(e,t){switch(t){case"d":case"D":case"DDD":return e+"日";case"M":return e+"月";case"w":case"W":return e+"週";default:return e}},relativeTime:{future:"%s內",past:"%s前",s:"幾秒",m:"一分鐘",mm:"%d分鐘",h:"一小時",hh:"%d小時",d:"一天",dd:"%d天",M:"一個月",MM:"%d個月",y:"一年",yy:"%d年"}}),fr);return ld.locale("en"),ld});