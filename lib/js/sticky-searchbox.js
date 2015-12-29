/**
 * Sticky UI - AJAX Search
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

StickySearch = function(document) {
    var 
    d = this,
    modern = (d.addEventListener), 
    thread = null,
    s = '',
    url,
    flag = false,
    stickySearchbar,
    get_stuff = function() {
        var b = stickySearchbar.parent();
        var t = stickySearchbar.closest('form').find('table');
        if(!t.length) {
            t = stickySearchbar.closest('div').find('table');
            return;
        }
        z = '.'+t.attr('class').replace(/\s/g, '.');
        tn = '.top .displaying-num';
        bn = '.bottom .displaying-num';
        tpl = '.top span.pagination-links';
        bpl = '.bottom span.pagination-links';
        tnt = '.tablenav.top';
        tnb = '.tablenav.bottom';

        return true;
    },
    init = function() {
        stickySearchbar = $s_ui('input[type="search"]');
        if ( ! stickySearchbar.length ) return;

        if ( ! get_stuff() ) return;

        $s_ui(d).anysearch({
            reactOnKeycodes: 'all',
            secondsBetweenKeypress: 1,
            minimumChars: 2,
            liveField: { 
                selector: 'input[name="s"]', 
                value: true 
            },
            startAnysearch: function() {
                flag = true;
                openSearchbar( stickySearchbar );
            },
            searchFunc: function(string) {
                search(string);
            },
            stopAnysearch: function() {
                ajaxStop();
            }
        });
    },
    search = function( string ) {
        s = string.replace(' ', '+');

        url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < url.length; i++) {
            if (/(^s$)|(\bs=.*\b)|(\bs=)/g.test(url[i]) === true || /http.*/g.test(url[i]) === true) y = i;
        }
        if (typeof y === 'undefined') url.unshift('s='+s);
        else url[y] = 's='+s;
        // url = url.join('&');
        url = url + '&' + url[y];
        url = window.location.pathname+'?'+url;

        $s_ui.get(url, {}, function(data) {
            var r = $s_ui('<div />').html(data);
            var table = r.find(z);
            var tablenav_top = r.find(tnt);
            var tablenav_bottom = r.find(tnb);
            $s_ui(z).replaceWith(table);
            $s_ui(tnt).replaceWith(tablenav_top);
            $s_ui(tnb).replaceWith(tablenav_bottom);
        },'html');

        body.addClass('is_loading');
    },
    ajaxStop = function( url ) {
        $s_ui(d).ajaxStop( function() {
            if ( s.length ) history.pushState({}, "after search", url);
            else history.pushState({}, "empty search", url);
            afterSearch();
        });
    },
    afterSearch = function() {
        if ( ! flag ) return;

        sticky_search_string_replace( $s_ui('.wrap > h1:first-child > .subtitle') );
        sticky_remake_widefat_tr();
        sticky_no_items();
        sticky_tablenav();
        sticky_move_filters_to_header();
        sticky_rework_inputs();
        sticky_rework_selects();
        sticky_widefat_select();
        sticky_screen_init();

        flag = false;
    },
    openSearchbar = function( searchbar ) {
        var selector = searchbar.parent();
        if ( selector.hasClass('open') ) return;
        searchbar.val('');
        selector.addClass('open');
    };
    if ( modern ) {
        d.addEventListener("DOMContentLoaded", init, false);
    } else {
        d.attachEvent("onreadystatechange", function(){
            if(d.readyState === "complete") {
                init();
            }
        });
    }
};

StickySearch();