var $s_ui = jQuery.noConflict();

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
 */

// Load the charts libraries for the dashboard
if ( pagenow == 'dashboard' ) 
	google.load("visualization", "1", {packages:["corechart", "geochart", "piechart"]});

// Sticky Functions - Main
// The order of these functions is really important, don't change unless you know what you're doing
$s_ui( function() {
	// var $s_ui = jQuery.noConflict();
	if ( typeof stickyObj === undefined )
		return;

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
    sticky_forms();
    sticky_code_editors();
    sticky_update_core();
    sticky_comments();
	do_sticky_items();

	sticky_window();
});

// Window Resize triggers the resizeEnd event which I'll bind the functions to.
function sticky_window() {
	var selector = $s_ui(window);

	selector.resize(function() {
		body.addClass('sleeping');
		if(this.resizeTO) clearTimeout(this.resizeTO);
	    this.resizeTO = setTimeout(function() {
	        $s_ui(this).trigger('resizeEnd');
	    }, 500);
	});

	// These functions are executed everytime the window gets resized.
	selector.on('resizeEnd', function() {
		sticky_stats_unsleep();
		sticky_adjust_wrap_height();
		update_carousels();
	    sticky_themes_adjustments();
	});

	// Close all open elements when clicking elsewhere
	selector.click(function(event) {
	    if ( $s_ui(event.target).is('h4') ) return;
	    if ( ! $s_ui(event.target).closest('.open').length ) {
	        $s_ui( '.welcome-panel-column, .activity-block, .drafts' ).removeClass('open');
	    }
	});
}


// Functions for forms.
function sticky_forms() {
	var selector = $s_ui( '> form', wpwrapwrap );
	if ( !selector.length )
		return;

	do_stuff_for_forms( selector );	
}

// Stuff for the forms
function do_stuff_for_forms( form ) {
	var selector = $s_ui( '> p', form );
    if ( !selector.length )
    	return;
		
	forms_better();

    $s_ui('ul.cat-checklist').mCustomScrollbar({
        axis: 'y',
        scrollbarPosition: 'inside',
        autoHideScrollbar: true
    });
}


function forms_better() {
	var replace_htm = '';
    var binder = selector.closest( 'h3.title' );
    
    // All paragraphs
    selector.each(function() {
        var p = $s_ui(this);
        if ( p.attr('class') ) return;
        replace_htm += p.html() + '\n';
        p.remove();
    });

    binder.attr( 'title', replace_htm );
}

// Changes for the commnets
function sticky_comments() {
	var selector = $s_ui( 'table.widefat.comments' );
	if ( !selector.length )
		return;

	sticky_comments_cleanup( selector );
}

// Cleanup comments section, urgh...
function sticky_comments_cleanup( comments ) {
    $s_ui( 'table.widefat td.column-author, table.widefat .column-comment .comment-author', comments ).each(function() {
        td = $s_ui(this);
        inside = $s_ui( 'strong', td );
        $s_ui('<div class="s_links"></div>').appendTo( inside );
        
        c = 0;
        $s_ui( 'br', td ).remove();
        $s_ui( '> a', td ).each(function() {
          	a = $s_ui(this);
          	if ( ! $s_ui(body).hasClass('mobile') ) a.attr('title', a.text() ).html('');
          
			c += 1;

			switch (c) {
				case 1:
					aclass = 's_domain';
					break;

				case 2:
					aclass = 's_email';
					break;

				case 3:
					aclass = 's_ip';
					break;
			}

			a.addClass(aclass).addClass('s_modified');
			a.appendTo( a.parent().find('.s_links') );
        });
    });
}

// Sticky Code Editors
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

// Sticky Stats 
function sticky_stats_unsleep() {
	if ( ! pagenow.startsWith('dashboard') ) 
		return;
	body.removeClass('sleeping');
}

// A function that checks if StickyAdmin loaded well
function sticky_failsafe() {
	if ( ! body.length ) 
		return;
	
	if ( ! body.hasClass('sticky-admin') && failSafeAttempts < 5 ) {
		failSafeAttempts += 1;
		if ( failSafeAttempts == 1 ) {
			body.addClass('failsafe');
		}
		setTimeout( sticky_failsafe, 1000 );
		return;
	}
	if ( failSafeAttempts == 5 ) {
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
	if ( ! stickyObj.failSafe.length ) return;
	body.addClass( stickyObj.failSafe );
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

	 	if ( update_info_text !== '' ) {
	 		toastr.info( '<p>' + update_info_text + '</p>' );
	 		update_info.remove();
	 	}
 	}
 	
 	// Note information
 	var update_info_note = $s_ui( 'p.s_modified + p.s_modified', container );

 	if ( update_info_note.length ) {
 		var update_info_note_text = update_info_note.html();

	 	if ( update_info_note_text !== '' ) {
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

	// THIS IS DEPRECATED, must be updated
	// newf_button.toggle(function(ev) {
	// 	ev.preventDefault();
	// 	$s_ui(this).removeClass('off').addClass('on');
	// 	meta.show();
	// }, function(ev) {
	// 	ev.preventDefault();
	// 	$s_ui(this).removeCLass('on').addClass('off');
	// 	meta.hide();
	// });
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
		make_clickable_sticky_element( 'input[type=reset]', $s_ui('> form .submit', wpwrapwrap ), newcontainer, true );	
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
 	if ( ! stickyObj.s_stats || ! stickyObj['stats-array'] || ! stickyObj['country-array'] || pagenow != 'dashboard' ) return;
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

// Functions for the widefats
function sticky_widefat() {
	selector = $s_ui('.widefat');
	if ( ! selector.length ) 
		return;
	sticky_widefat_descriptions( selector );
	sticky_widefat_post_states( selector );
	sticky_widefat_select( selector );
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
		var container = $s_ui( '<abbr>' + date + '</abbr>' );
		td.empty();
		container.appendTo(td);
		container.attr('title', olddate);
		tr_state = td.parent().attr('class');
		if ( tr_state !== '' ) tr_state = tr_state.substring(tr_state.indexOf('status-') + 7);
		if ( tr_state !== '' ) tr_state = tr_state.substring(0, tr_state.indexOf(' '));
		var statusc = $s_ui( '<div title="' + state + '" class="sticky status ' + tr_state + '"></div>' );
		statusc.appendTo(td);
		states[tr_state] = state;
	});
	selector = $s_ui('abbr', selector);
	sticky_cool_dates( selector );
}
// Reworks the description columns
function sticky_widefat_descriptions( item ) {
	var selector = $s_ui( 'td.column-description', item );
	if ( ! selector.length ) return;
	selector.each(function(i) {
		var desc 		= $s_ui(this),
			morebuts 	= $s_ui('<div class="more_but">...</div>');
		if ( desc.text() === '' ) return;
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

	s_media_attachments();

	body.removeClass('is_loading');
	overlay.attr('style', 'visibility:hidden;');
}

function s_media_attachments() {
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
		gutterX: 15,
		gutterY: 10,
		cellW: 150,
		cellH: 'auto',
		onResize: function() {
			stickymediawall.refresh();
		}
	});
	stickymediawall.fitWidth();
}

function sticky_move_filters_to_header() {
    var 
    	selector = $s_ui('#post-query-submit'),
    	media = false;
    // If they exist, return
    if ( $s_ui('#sticky_filters', header).length || f_attempts === 'undefined' || f_attempts > 3) return;
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
    var filters_array = [];
    var active_index = [];
    selects.each(function( index ) {
        sel = $s_ui(this);
        sel.attr('id','sel-'+index );
        var options = $s_ui('option', sel);
        filters_array[index] = [];
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
        	thoseEvents = grabEvents.change;
        	if ( typeof thoseEvents === 'object' ) {
        		for (var i = 0; i < thoseEvents.length; i++) {
                    events.push( grabEvents.change[i].handler );
                }
                for (var j = 0; j < events.length; j++) {
            		menu.bind('change', events[j]);
        		}
        	}
        }
        for ( var k in element ) {
            var binder = $s_ui('<li class="' + k + '">' + element[k] + '</li>').appendTo(menu);
            // ( ( k == '"' + active_index[index] + '"' ) ? k + ' active' : k )
            if ( k === active_index[index] ) binder.addClass('active');
            binder.click( trigger_filters( binder, index ) );
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

function trigger_filters( filter, index ) {
    if ( filter.hasClass('active') || ! filter.length ) 
    	return;

    var menu = $s_ui('#filters-expand > ul');
    if ( !menu.length )
    	return;

    var get_state = filter.attr('class').split(' ').pop();
    filter.parent().children().removeClass('active');
    filter.addClass('active');
	$s_ui( '#sel-' + index ).val( get_state );
	menu.trigger('change');
}

function sticky_tablenav() {
    var selector = $s_ui('.tablenav');
    if ( ! selector ) return;
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
    var existing_actions = [];
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
    if ( stickyObj.s_header_type != 'minimize' ) return;
    // Document Scroll Event, 
	$s_ui(window).scroll(function() {
	    var scroll = $s_ui(this).scrollTop();
	    nav_binder.removeAttr('style');
  	 	if ( scroll >= 44 ) 
  	 		body.addClass( 'header-small' );
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
    body        = $s_ui('body');
    wpadminbar  = $s_ui('#wpadminbar');
    wpwrap      = $s_ui('#wpwrap');
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
	$s_ui(window).load(function() {
		if ( typeof labelauty != 'function' )
			return;

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
	    });
	});
}
//===== SelectrODie =====//
function sticky_rework_selects() {
    $s_ui(window).load(function() {
		if ( typeof selectOrDie != 'function' )
			return;
    
	    $s_ui("select:not(#bulk-action-selector-bottom):not(.attachment-filters)").selectOrDie({
	        size: 5
	    });
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
    });
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
    if ( ! stickyObj.wpab_controls || ! wpadminbar.length ) return;
    var toggle = $s_ui('<div id="sticky_toggle"></div>').appendTo(wpadminbar);
    $s_ui('<button id="sticky_resize">-</button>').appendTo(toggle);
    if ( stickyObj.s_admin )
        $s_ui('<button id="sticky_close">x</button>').appendTo(toggle); 
}
// Toastr Notifications Options
function sticky_setup_notifications() {
	if ( !toastr.length )
		return;

    toastr.options.progressBar = true;
    toastr.options.positionClass = 'toast-top-right';
    toastr.options.showDuration = 0;
    toastr.options.hideDuration = 0;
    toastr.options.onShown = function() {
        $s_ui('#toast-container > div').addClass('toast-show');
    };
    toastr.options.onHidden = function() {
        $s_ui('#toast-container > div').removeClass('toast-show');
    };
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
    };
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
	if ( el !== undefined ) {
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
		var changed = $s_ui( change_id );
		changed.prop( 'checked', true );
		$s_ui('#screen-options-apply').click();
		
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
    var cookie_path = stickyObj.cookie_path.path;
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else expires = "";
    document.cookie = name + "=" + value + expires + "; path=" + cookie_path + "wp-admin";
}
// Gets cookie value
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
// Erases a cookie
function eraseCookie(name) {
    setCookie(name, "", -1);
}
// Adds a scrollbar for the sticky navigation state
function sticky_menu_sticky() {
    if ( ! stickyObj.s_nav_sticky ) return;
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
    if ( ! stickyObj.s_admin ) return;
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
    if ( body.hasClass('mobile') || body.hasClass('folded') || ! stickyObj.s_admin ) return;
    // s_nav.disableSelection();
    s_nav.sortable({
        items: 'li.menu-top:not(#sticky_logout)',
        stop: function(event, ui) {
            sticky_update_sortable_indexes();
        }
    });
}
function sticky_menu_settings() {
    if ( ! stickyObj.s_admin ) return;
    menu_settings = $s_ui('<div class=\'menu_settings\'></div>');
    var s_reset_button = $s_ui('<button class=\'s_reset\' data-content='+stickyObj.s_reset+' ></button>');
    nav_binder.append(menu_settings);
    menu_settings.append(s_reset_button);
    s_reset_button.click(function() {
    	sticky_default_menu_icons();
    	sticky_sort_menu_default();
        sticky_reset_menu(); 
    });
}
function sticky_default_menu_icons() {
	if ( !stickyObj.s_nav_def_icons ) return;
	var out = '<style type="text/css">';
	$s_ui('#adminmenu li.menu-top').each(function() {
		var li = $s_ui(this);
		var id = li.attr('id');
		getcontent = ( id in stickyObj.s_nav_def_icons ) ? stickyObj.s_nav_def_icons[id] : '\\e7e9';
		out += '#' + id + ' div.wp-menu-image:before{content:"' + getcontent + '";}' + "\n";
	});
	out += '</style>';
	$s_ui('head').append(out);
}
function sticky_reset_menu() {
    $s_ui.post(ajaxurl, { action: 'dynamic_css', sticky_reset_menu: 'reset'}, function(response){});
    $s_ui.post(ajaxurl, { action: 'update_menu_positions', menu_item_positions: stickyObj.s_nav_original.toString() }, function(response) {});
}
function sticky_sort_menu_default() {
	var ul = $s_ui( 'ul#adminmenu' ), seps = -1, i = 0;
	for ( i; i<stickyObj.s_nav_original_ids.length;i++) {
		var selector;
		var name = '#' + stickyObj.s_nav_original_ids[i];
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
    if ( ! stickyObj.s_admin ) return;
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
	element.removeClass('picker_open');
}
function sticky_show_iconpicker( element, type ) {
	if ( ! element.length || element.attr('id') == 'wp-admin-bar-wp-logo' ) return;
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
        	smw.s_menu_width = 220;
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
    if ( ! stickyObj.s_admin ) return;
    var sticky_menu_seps, positions = [];
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
    if ( ! stickyObj.s_nav_resizable || body.hasClass('mobile') ) return;
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
    	s_x = ( stickyObj.s_nav_position == 'left' ) ? ( e.pageX - handle_offset ) : ( handle_offset - e.pageX );
    	
    	s_nav_newWidth = ( s_x > s_nav_maxWidth ) ? s_nav_maxWidth : s_x;
    	s_nav_newWidth = ( s_nav_newWidth < s_nav_minWidth ) ? s_nav_minWidth : s_nav_newWidth; 
        // Grid Menu - add classes to body.
        if (s_nav_newWidth >= s_grid_1) {
            body.addClass('grid_menu');
            if ( s_nav_newWidth >= s_grid_2) {
                body.addClass('large_grid');
            } else {
                body.removeClass('large_grid');
            }
        } else {
            body.removeClass('grid_menu');
        }
        wpcontent
        .addClass('no_trans')
        .css('margin-' + stickyObj.s_nav_position, s_nav_newWidth + 'px'); // CSS Class used to stop transitions for real-time changes.
        nav.
        addClass('no_trans')
        .attr('style', 'min-width:' + s_nav_newWidth + 'px; max-width:' + s_nav_newWidth + 'px');            

        $s_ui('.menu_settings', nav).addClass('no_trans').attr('style', 'min-width:' + s_nav_newWidth + 'px; max-width:' + s_nav_newWidth + 'px');            

        // nav_binder.
        // addClass('no_trans')
        // .attr('style', 'min-width:' + s_nav_newWidth + 'px; max-width:' + s_nav_newWidth + 'px' );
        overlay
        .attr('style', stickyObj.s_nav_position + ':' + s_nav_newWidth + 'px; visibility: hidden;');
        $s_ui('#sticky_bulk_actions')
        .attr('style', stickyObj.s_nav_position + ':' + s_nav_newWidth + 'px;');
        footer
        .css( stickyObj.s_nav_position, s_nav_newWidth + 'px');
        header
        .addClass('no_trans').attr('style', stickyObj.s_nav_position + ':' + s_nav_newWidth + 'px');
        $s_ui('#adminmenu li#collapse-menu')
        .attr('style', stickyObj.s_nav_position + ':' + (s_nav_newWidth - 32) + 'px');
        if (pagenow == 'themes') 
        	$s_ui('.wrap > .theme-overlay')
        	.addClass('no_trans')
        	.attr('style', stickyObj.s_nav_position + ':' + s_nav_newWidth + 'px');
            // if ( body.hasClsas('s_nav_right') ) $s_ui( 'body.s_nav_right.folded .wp-filter .search-form, body.s_nav_right.folded p.search-box' ).addClass('no_trans').attr( stickyObj[ 's_nav_position'] + ':' + ( s_nav_newWidth + 35 ) + 'px!important' );
       	if (stickyObj.s_nav_position == 'right')
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
        if ( ! stickyObj.s_nav_sticky || $s_ui( '#wpwrap' ).hasClass( 'wp-responsive-open' ) || $s_ui( 'body' ).hasClass( 'mobile' ) ) return;
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
    if (el === undefined) return false;
    rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}
function h2d(h) {return parseInt(h,16);}

// StickyAdmin :)
function sticky_admin() {
	vs_attempts = f_attempts = o_attempts = 0;
    sticky_init();
    sticky_init_pace_js();
    sticky_wpab_add_controls();
    sticky_setup_notifications();
    sticky_do_notifications();
    sticky_bulk_actions();
    sticky_tablenav();
    sticky_rework_form_elements();
    sticky_other_scrollbars();
	sticky_screen_meta();

    // On window load
	$s_ui(window).load(function() {
	    sticky_screen_init();
	    sticky_run_odometer();
	    sticky_themes_adjustments();
		sticky_tooltips();
	});
}

// Functions for FORM ELEMENTS
function sticky_rework_form_elements() {
	sticky_rework_inputs();
	sticky_rework_selects();
    sticky_check_labels();
}

// The header
function sticky_header() {
	if ( ! header.length )
		return;

	sticky_header_screen_options();
	sticky_move_viewswitch_to_header();
    sticky_move_filters_to_header();
    sticky_header_iconpicker();
    sticky_subsub_counter();
    sticky_subsub_scrollbar();
    sticky_header_sticky();
    sticky_hamburger_menu();
}

function sticky_header_screen_options() {
	if ( ! $s_ui( '#screen-meta > #screen-options-wrap').length )
		return;

	body.addClass('has-options');

	header.click( function(event) {
		if ( ! $s_ui(event.target).is( header ) ) 
			return;

		body.toggleClass('show-settings-link');
		body.toggleClass('sidepanel_open');
	});
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
        	var p = ( deltatext !== '' ) ? parseFloat( deltatext ) : 0;
        	
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
            });
            $s_ui(this).toggleClass('previous');
        });
    });
}
// Replaces the welcome panel with the statistics screen
function sticky_make_big_stats() {
    if ( ! stickyObj.s_big_stats || ! stickyObj.s_stats ) 
    	return; 
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
    
    if ( stickyObj.s_dash_welcome !== '' ) 
        title.text( stickyObj.s_dash_welcome );
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
	defaultformat = stickyObj.date_format;
	timeformat = stickyObj.time_format;
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
	if ( date === undefined || date.indexOf('F') != -1 ) return;
	// console.log( 'sticky_wp_date_format();' );
	if ( stickyObj.date_format.indexOf('m') != -1 ) {
		format = stickyObj.date_format.replace('m', 'MM');
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
	if ( stickyObj.date_format.startsWith('m') || stickyObj.date_format.startsWith('M') )
		expectedDateFormat = 'MM';
	if ( stickyObj.date_format.startsWith('d') || stickyObj.date_format.startsWith('D') )
		expectedDateFormat = 'DD';
	dates.each( function() {
		var date = $s_ui(this).text(), y, xx, splitter;
		xx = date.match( '(19|20)[0-9][0-9]' );
		if ( xx ) {
			xx = xx.toString();
			y = xx.substr(0, xx.indexOf(','));
			if ( date.indexOf( y ) === 0 ) 
				dateStartsWith = 'year';
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
        if ( t.val() !== '' ) $s_ui('form#quick-press').addClass('modified');
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
    title.click(function() {
        title.toggleClass('open');
        container.toggleClass('open');
    });
    var morenews = $s_ui('.rss-widget:nth-child(2)');
    var moreheader = $s_ui('<a class="more-news">' + stickyObj['word:morenews'] + '</a>').prependTo(morenews);
    moreheader.parent().addClass('s-morenews');
    var popular_plugin = moreheader.parent().next();
    // Check if the right element
    if ( popular_plugin.hasClass('rss-widget') )
    	popular_plugin.addClass('s-popular-plugin');
    moreheader.click(function() {
        morenews.toggleClass('open');
    });
}
function sticky_welcome_panel() {
     $s_ui( '.welcome-panel-column h4, .activity-block h4, .drafts h4' ).click(function() {
        $s_ui(this).parent().toggleClass('open');
    });
    // Heading - Welcome Text
    var selector = $s_ui( ".welcome-panel-content > h3:first-child" );
    if ( ! selector.length )
    	selector = $s_ui( ".welcome-panel-content > h2:first-child" );
    
    if ( stickyObj.s_dash_welcome !== '' ) {
        selector.text( stickyObj.s_dash_welcome );
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
	            	    visitors_dif = stickyObj.s_stats.today_visits - stickyObj.s_stats.yesterday_visits;
	            	if ( visitors_dif < 0 ) {
	            		string = 'less than';
	            	}
	            	string = Math.abs(visitors_dif) + ' ' + string;
	            	if ( visitors_dif === 0 ) string = 'same as';
	            	string += ' yesterday';
	                return '<button class="graph"><span class="icon"></span>' + '<span class="desc"><strong>Visitors Today</strong>' + string + '</span>' + '</button>';

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
	                    if ( index % 2 === 0 && index < 6 && element !== '' ) {
	                        countries[c] = isoCountries[element];
	                        c += 1;
	                    }
	                    else return;
	                });
	                return '<button class="map"><span class="icon"></span>' + '<span class="desc"><strong>Popular Locations</strong>' + countries.join(', ') + '</span>' + '</button>';
            	case 2 :
	                var traffic = Array();
	                for ( var j = 0; j <= 3; j++ ) {
	                    var ms = stickyObj['p'+(j+1)].split(',');
	                    var max = 0;
	                    var found = 0;
	                    // ms.forEach(function( element, index, array) {
	                    //     if ( parseInt(element) >= max ) max = element;
	                    // });
	                    // traffic[j] = ms[ms.indexOf(max) - 1];
	                }
	                return '<button class="circle"><span class="icon"></span>' + '<span class="desc"><strong>Best Traffic From</strong>' + traffic.join(', ') + '</span>' + '</button>';
            	case 3 :
                	return '<button class="list"><span class="icon"></span>' + '<span class="desc"><strong>Most Accessed Link</strong>'+ stickyObj.s_stats.top_links[0].referer +'</span>' + '</button>';
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
    if ( ! stickyObj.s_stats || ! stickyObj['stats-array'] || ! stickyObj['country-array'] || pagenow != 'dashboard' ) return;
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
        colors: stickyObj.s_colors,
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
        feoffset.setAttribute("dy", stickyObj.s_required_color == 'black' ? 1 : 3 );
        feGaussianBlur.setAttribute("result", "blurOut");
        feGaussianBlur.setAttribute("in", "shadow");
        // Use a lower-intensity shadow for white backgrounds
        feGaussianBlur.setAttribute("stdDeviation", stickyObj.s_required_color == 'black' ? 1 : 3 );
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
        if ( path1 !== undefined ) {
        	path1.setAttribute('filter', 'url(' + drn + '#sticky_svg_shadow)' );
         	path1.setAttribute('stroke', 'url(' + drn + '#fx)' );
         }
        if ( path2 !== undefined ) {
        	path2.setAttribute('filter', 'url(' + drn + '#sticky_svg_shadow)' );
        	path2.setAttribute('stroke', 'url(' + drn + '#fxtwo)' );
        }
        if ( path1inside !== undefined ) 
        	path1inside.setAttribute('fill', 'url(' + drn + '#fx)' );
        if ( path2inside !== undefined ) 
        	path2inside.setAttribute('fill', 'url(' + drn + '#fxtwo)' );
    });    
    chart.draw(data, options);
}
// Creates a SVG NS
function createSVG(n,a,b) {
      var xmlns = "http://www.w3.org/2000/svg",
          e     = document.createElementNS(xmlns, n);
      for(var k in a){
        e.setAttributeNS (null, k,a[k]);
      }
      for(var l in b){
        e.setAttribute (l,b[l]);
      }
      return e;
}
// Draws the map on the dashboard statistics 
function drawMap() {
    if ( ! stickyObj['country-array'] || pagenow != 'dashboard' ) return;
    var data = [];
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
        colors: stickyObj.s_colors,
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
}
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
        colors: stickyObj.s_colors,
        legend: {
            position: 'bottom',
            alignment: 'center',
        },
        pieHole: 0.95,
        pieSliceBorderColor: 'transparent',
        pieSliceText: 'label',
        pieSliceTextStyle: {
            color: stickyObj.s_dash_maps,
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
    var data = {};
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
  if ( ( ( x.r * 299 ) + ( x.g * 587 ) + ( x.b * 114 ) ) / 255000 >= 0.5 ) return true;
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
        if (state[0] !== undefined) {
            tr.removeClass('status-publish');
            status = state.text();
            // class_status = tr.attr('class').match(/status-([^\s]+)/)[0];
            title = tr.find($s_ui('.post-title > strong'));
            pagesub = state.find($s_ui('.post'));
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
	var selector = $s_ui( 'tr.no-items' );
	if ( ! selector.length || selector.parent().attr('id') == 'the-extra-comment-list' )
		return;
    
    selector.each(function() {
        tr = $s_ui(this);
        trtext = tr.text();
        tr.parent().parent().replaceWith('<div class="sticky_no_items">'+trtext+'</div>');
    });
}

// Selects all checkboxes when clicking the header / footer checkbox and selected items are put in new container
function sticky_widefat_select( selector ) {
    if ( ! selector.length ) 
    	return;
    
    $s_ui(window).load(function() {
	    var counter = $s_ui( '#sticky_bulk_actions > div.counter' ), 
	        c = 0;
	    
	    counter.click(function() {
	        body.removeClass('bulk-open');
	    });
	    
	    selector.each(function() {
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
    });
}
(function($) {
    $(document).ready(function() {
        function debouncer(func, timeout) {
            var timeoutID;
            timeout = timeout || 200;
            return function() {
                var scope = this,
                    args = arguments;
                clearTimeout(timeoutID);
                timeoutID = setTimeout(function() {
                    func.apply(scope, Array.prototype.slice.call(args));
                }, timeout);
            };
        }
    });
})(jQuery);