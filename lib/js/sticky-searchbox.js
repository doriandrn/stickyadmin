var $s_ui = jQuery.noConflict();
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
}

StickySearch();

// MIT license :: Copyright [2013] [Eugen Wagner - Jev]
// www.jevnet.de/anysearch-js.html
(function(e){e.fn.anysearch=function(t){t=e.extend({reactOnKeycodes:"string",secondsBetweenKeypress:2,searchPattern:{1:"[^~,]*"},minimumChars:3,liveField:false,excludeFocus:"input,textarea,select",enterKey:13,backspaceKey:8,checkIsBarcodeMilliseconds:250,checkBarcodeMinLength:4,searchSlider:true,startAnysearch:function(){},stopAnysearch:function(){},minimumCharsNotReached:function(e,t,n){},searchFunc:function(e){},patternsNotMatched:function(e,t){},isBarcode:function(e){}},t);return this.each(function(){var n=null;var r=null;var i=[];var s=setTimeout(function(){});var o="";var u=null;switch(t.reactOnKeycodes){case"string":o="32,48,49,50,51,52,53,54,55,56,57,94,176,33,34,167,36,37,38,47,40,41,61,63,96,180,223,178,179,123,91,93,125,92,113,119,101,114,116,122,117,105,111,112,252,43,35,228,246,108,107,106,104,103,102,100,115,97,60,121,120,99,118,98,110,109,44,46,45,81,87,69,82,84,90,85,73,79,80,220,42,65,83,68,70,71,72,74,75,76,214,196,39,62,89,88,67,86,66,78,77,59,58,95,64,8364,126,35,124,181";break;case"numeric":o="43,45,48,49,50,51,52,53,54,55,56,57";break;case"all":o="all";break;default:o=t.reactOnKeycodes;break}if(o!=="all"){var a=o.replace(/\s/g,"").split(",").map(function(e){return parseInt(e)})}var f=function(e,n){if(typeof n==="undefined"){n=t.secondsBetweenKeypress}var r=(new Date).getTime();if(r-e<=n*1e3){return true}return false};var l=function(){i=null;i=[];r=null;n=null;clearTimeout(s);s=setTimeout(function(){});u=null};var c=function(e){t.searchFunc(e)};var h=function(){var n=false;var r=t.excludeFocus.split(",");e.each(r,function(t,r){if(e(""+e.trim(r)).is(":focus")){return n=true}});return n};var p=function(n){var r=false;e.each(t.searchPattern,function(e,t){var i=new RegExp(t);if(i.test(n)){return r=true}});if(r===false){t.patternsNotMatched(n,t.searchPattern)}return r};var d=function(e){if(e&&e.preventDefault){e.preventDefault()}else{e.returnValue=false}i.pop();return};var v=function(){var e=String.fromCharCode.apply(String,i);if(m(e,4,n,r)){var s=e.split("");var e="";for(var o=0;o<s.length;o++){if((o+1)%4===0){e=e+s[o]}}t.isBarcode(e)}return e};var m=function(e,n,r,i){if(i-r<t.checkIsBarcodeMilliseconds&&e.length>=t.checkBarcodeMinLength*n){return true}return false};var g=function(e){if(e.length>=t.minimumChars){return true}t.minimumCharsNotReached(e,e.length,t.minimumChars);return false};var y=function(n){var r=String.fromCharCode.apply(String,n);if(t.searchSlider===true){e("#anysearch-input").val(r)}if(t.liveField!==false&&t.liveField.selector!==null){if(t.liveField.html===true){e(""+t.liveField.selector).html(r);return}if(t.liveField.value===true){e(""+t.liveField.selector).val(r);return}if(t.liveField.attr!==null){e(""+t.liveField.selector).attr(t.liveField.attr,r);return}}};var b=function(){var e=v(n,r,i);if(e.length>=1){if(p(e)===true&&g(e)){c(e)}l();y(i);t.stopAnysearch();if(t.searchSlider===true){T()}}};var w=function(e){d(e);y(i)};var E=function(){clearTimeout(s);s=setTimeout(function(){T()},t.secondsBetweenKeypress*1e3)};var S=function(e){if(o==="all"){return true}if(jQuery.inArray(e.which,a)>=0){return true}return false};e(this).keydown(function(e){if(h()===false){if(f(r)&&(e.which===t.enterKey||e.which===t.backspaceKey)){r=(new Date).getTime();if(e.which===t.enterKey){clearTimeout(s);b()}if(e.which===t.backspaceKey){if(t.searchSlider===true){E()}w(e)}}}});e(this).keypress(function(e){if(h()===false&&e.which!==t.backspaceKey&&e.which!==t.enterKey&&S(e)){if(f(r)||r===null){if(t.searchSlider===true){x()}if(r===null&&e.which!==t.enterKey&&e.which!==t.backspaceKey){n=(new Date).getTime();t.startAnysearch()}r=(new Date).getTime();i.push(e.which);y(i)}else{l();y(i);i.push(e.which);y(i)}if(t.searchSlider===true){E()}}});if(t.searchSlider===true){e('<div id="anysearch-slidebox"><div id="anysearch-slidebox-button"><button id="anysearch-sidebutton"><i class="anysearch-icon"></i></button></div><div id="anysearch-slidebox-content"><input id="anysearch-input" type="text" placeholder="Suchen..."></div></div>').appendTo("body");e("#anysearch-slidebox").css("right","-"+e("#anysearch-slidebox-content").outerWidth()+"px");function x(){setTimeout(function(){var t=e("#anysearch-slidebox").find("#anysearch-sidebutton");if(!e(t).hasClass("anysearchIsOpen")){e("#anysearch-slidebox").animate({right:"0px"},300);e(t).addClass("anysearchIsOpen")}},25)}function T(){setTimeout(function(){var t=e("#anysearch-slidebox").find("#anysearch-sidebutton");if(e(t).hasClass("anysearchIsOpen")){e("#anysearch-slidebox").stop(true).animate({right:"-"+e("#anysearch-slidebox-content").outerWidth()},100);e(t).removeClass("anysearchIsOpen");l();e("#anysearch-input").val("").blur()}},25)}e(this).bind("click",function(t){if(!e(t.target).is("#anysearch-input")&&!e(t.target).is("#anysearch-sidebutton")&&!e(t.target).is("#anysearch-slidebox-button")&&!e(t.target).is("#anysearch-slidebox")&&!e(t.target).is("#anysearch-slidebox-content")){T()}});e("#anysearch-sidebutton").click(function(){if(!e(this).hasClass("anysearchIsOpen")){e("#anysearch-input").focus();x()}else{T()}});e("#anysearch-input").keydown(function(n){if(u===null&&n.which!==13){u=(new Date).getTime();t.startAnysearch()}if(n.which===13){var r=e(this).val();var i=(new Date).getTime();if(m(r,1,u,i)){t.isBarcode(r)}u=null;if(r.length>=1){if(p(r)===true&&g(r)){c(r);T()}}t.stopAnysearch()}});e("#anysearch-input").focus(function(){clearTimeout(s)})}})}})(jQuery)