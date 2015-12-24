/**
 *
 * Admin Pages Class
 *
 * JS used for the admin pages class and other form items.
 *
 * Copyright 2011 Ohad Raz (admin@bainternet.info)
 * Further Modified and Updated by Dorian Tudorache (dorian@numina.cc)
 * @since 1.0
 *
 */
var $ = jQuery.noConflict();
//code editor
var Ed_array = Array;
//upload button
var formfield1;
var formfield2;
var file_frame;
// Run
jQuery(document).ready(function($) {
    apc_init();
    // We use it this way because WordPress may also output notices here.
    $('.update-status .alert').each(function() {
        notify_box = $(this);
        notify_message = notify_box.html();
        notify_box.hide();
        toastr.success(notify_message);
    });
});


function sticky_luminance(hex) {
    x = hex2rgb(hex);
    if (((x.r * 299) + (x.g * 587) + (x.b * 114)) / 255000 >= .5) return true;
    return false;
}

function hex2rgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * apc_init initate fields
 * @since 1.2.2
 * @return void
 */
function apc_init() {

    body = $('body');

    /**
     * Code Editor Field
     * @since 2.1
     */
    load_code_editor();

    // $(".at-re-toggle").live('click', function() {
    //     $(this).prev().toggle('slow');
    // });
    loadDatePicker();
    loadTimePicker();
    loadColorPicker();
    $('.at-add-file').click(function() {
        var $first = $(this).parent().find('.file-input:first');
        $first.clone().insertAfter($first).show();
        return false;
    });
    sticky_themes = [
        'aruba',
        'back-to-basics',
        'black-knight',
        'black-swan',
        'blue-sky-moisty',
        'choco-coffee',
        'cold-forced',
        'firenze',
        'heart-of-steel',
        'indigo-moon',
        'japanesse',
        'knight-drive',
        'memorial',
        'midori-madoka',
        'nautical',
        'oil-flame',
        'prairie-sunset',
        'red-embrace',
        'sea-wolf',
        'sigma-orange',
        'sonic-treshold',
        'summer-leaves',
        'szymborska',
        'vicky',
        'vintage-space',
        'test-white',
        'test-1',
        'test-2',
        'test-3',
        'test-4',
        'test-5',
        'test-6',
        'test-7',
        'test-8',
        'test-9',
        'test-10'
    ];
    sticky_color_schemes = [
        ["#015770", "#2A8782", "#285D57", "#332F45", "#FFFED2"], // 10%! Aruba
        ["#41444C", "#151B1E", "#151B1E", "#202627", "#EFF4FF"], // 90%! Back to Basics
        ["#000000", "#141414", "#1c1919", "#191716", "#24201f"], // 80%! Black Knight
        ["#24262D", "#13171F", "#961227", "#1C1F26", "#010712"], // 50%! Black Swan
        ['#1a1f2b', '#FFFFFF', '#4a6491', '#30395C', '#ECF2F6'], // 100%! Blue Sky Moisty
        ["#311209", "#2B1E1B", "#4A160A", "#3B2F30", "#E6DED5"], // 0%! Choco Coffee
        ["#468966", "#B64926", "#8E2800", "#FFB03B", "#FFF0A5"], // V! Firenze
        ["#692B28", "#473B39", "#383737", "#940500", "#272A2B"], // V! Heart of Steel
        ["#0C242B", "#84D66E", "#297059", "#D1FB7A", "#14151C"], // V! Indigo Moon
        ["#21786C", "#FFFBF1", "#910000", "#CBB370", "#000000"], // V! Japanesse
        ["#161726", "#59023B", "#231E2D", "#E7F2DF", "#D2C3CB"], // V! Knight Drive
        ["#040404", "#272F32", "#FFFFFF", "#FF3D2E", "#DAEAEF"], // V! Memorial
        ["#D8F2F0", "#194759", "#296B73", "#3E8C84", "#0F2D40"], // V! Midori & Madoka
        ["#C33249", "#FFFFFC", "#333841", "#43C3B1", "#2973A8"], // V! Nautical
        ["#25373A", "#253946", "#164852", "#495E67", "#282E33"], // V! Oil Flame
        ["#29332E", "#B05A3A", "#573328", "#FF8548", "#0F1B1C"], // V! Prairie Sunset
        ["#8C0303", "#BF0404", "#400101", "#F2F2F2", "#590202"], // V! Red Embrace
        ["#dc3522", "#1e1e20", "#374140", "#d9cb9e", "#2a2c2b"], // V! Sea Wolf 
        ["#C75300", "#FFC87A", "#170500", "#D6721A", "#823200"], // V! Sigma Orange
        ["#042200", "#76AB01", "#0E6A00", "#C1D301", "#083500"], // V! Summer Leaves
        ["#310D42", "#3C0133", "#5C2445", "#AB6946", "#150033"], // V! Szymborska
        ["#366353", "#727D59", "#03212E", "#A1A16A", "#133C40"], // V! Vicky
        ["#E8DFD6", "#021B21", "#065F73", "#FF2A1D", "#032C36"], // V! Vintage Space
        ["#1A1F23", "#AF446E", "#263248", "#FFFFFF", "#000000"], // V! Bonus 1
        ["#DDDCC5", "#6A6A61", "#611427", "#958976", "#1D2326"], // V! Bonus 2
        ["#070E0E", "#C13B00", "#424E4F", "#5E6D70", "#1B1D1E"], // V! Bonus 3
        ["#36362C", "#E6D4A7", "#5D917D", "#A8AD80", "#825534"], // V! Bonus 4
        ["#5E0042", "#2C2233", "#00856A", "#8DB500", "#005869"], // V! Bonus 5
        ["#222130", "#464D57", "#FFFCFB", "#ED8917", "#D4E8D3"], // V! Bonus 6
        ["#170B0F", "#FFFFFC", "#E34446", "#E36D6F", "#C21F1F"], // V! Bonus 7
        ["#030913", "#343F4F", "#272433", "#77994C", "#3D6066"], // V! Bonus 8
    ];
    $themes_li = $('li.st');

    $themes_li.click(function() {

        var li = $(this);
        var testi = 0;

        var counter = li.parent().children().length;
        var li_index = li.parent().children().index(this);

        for (var i = 0; i < counter; i++) {
            body.removeClass('gradient-' + i);
        }

        body.addClass('gradient-' + li_index);


        li.parent().children().removeClass('selected');
        li.addClass('selected');
        $('input#sticky_theme').val(sticky_themes[li_index]);

        // s_shuffled = shuffle( sticky_color_schemes[li_index] );
        // c=0;
        // $('.color_scheme > span', li).each( function() {
        //     $(this).css( 'background-color', s_shuffled[c] );
        //     c += 1;
        // });
        // console.log ( sticky_color_schemes[li_index] );

        $('input#nav_bg, input#login_form_background_color, input#wpadminbar_profile_link_bg, input#wpadminbar_profile_bg, input#forms_top_bg, input#s_s_color_2, input#customizer_bg').val(sticky_color_schemes[li_index][0]);
        $('#adminmenuback, #adminmenuwrap, #adminmenuwrap:before, #adminmenuwrap .menu_settings, #wpfooter, #sidemenu, body.admin-bar #adminmenu, .wp-responsive-open #wpadminbar #wp-admin-bar-menu-toggle a, .wp-responsive-open .wrap > h1:first-child > a#wp-menu-toggle, .wp-responsive-open .wrap > h2:first-child > a#wp-menu-toggle, body:not(.grid_menu) #adminmenu .wp-submenu').attr('style', 'background:' + sticky_color_schemes[li_index][0] + '!important;');
        body.removeClass('menu-b menu-w').addClass('menu-' + (sticky_luminance(sticky_color_schemes[li_index][0]) ? 'b' : 'w'));

        $('input#wpadminbar_bg, input#wpadminbar_sub_bg, input#nav_sub_bg, input#scrollbar_rail, input#widefat_header, input#widefat_footer, input#widefat_sticky, input#widefat_plugin_active, input#color_widget, input#side_meta_bg').val(sticky_color_schemes[li_index][1]);
        $('#wpadminbar, #wpadminbar .sticky_toggle button, #wpadminbar .sticky_toggle:before, #wpadminbar .sticky_toggle:after').attr('style', 'background:' + sticky_color_schemes[li_index][1] + '!important;');
        $('input#tooltips_bg, input#scrollbar, input#wpadminbar_hl, input#color_notifs, input#nav_resize_handle_bg, input#widefat_selected, input#highlight_color').val(sticky_color_schemes[li_index][1]);
        body.removeClass('wpab-b wpab-w').addClass('wpab-' + (sticky_luminance(sticky_color_schemes[li_index][1]) ? 'b' : 'w'));

        $('input#header_bg, input#footer_bg, input#boxes_bg, input#widefat_body, input#dash_bg, input#forms_bg').val(sticky_color_schemes[li_index][2]);
        $('.wrap > h1:first-child, .wrap > h2:first-child, .wp-filter .search-form input[type=search], p.search-box input[name=s]').attr('style', 'background:' + sticky_color_schemes[li_index][2] + '!important;');
        body.removeClass('header-b header-w').addClass('header-' + (sticky_luminance(sticky_color_schemes[li_index][2]) ? 'b' : 'w'));
        body.removeClass('footer-w footer-b').addClass('footer-' + (sticky_luminance(sticky_color_schemes[li_index][2]) ? 'b' : 'w'));


        $('input#content_bg, input#nav_hl, input#widefat_plugin_inactive, input#widefat_pass, input#widefat_draft, input#widefat_trash, input#login_background_color').val(sticky_color_schemes[li_index][4]);
        $('body, body.is_loading #overlay, #wpbody, #post-status-info, div.mce-toolbar-grp > div, #ed_toolbar, .switch-html:before, .switch-html:after, .switch-tmce:before, .switch-tmce:after').attr('style', 'background:' + sticky_color_schemes[li_index][4] + '!important');
        body.removeClass('content-w content-b').addClass('content-' + (sticky_luminance(sticky_color_schemes[li_index][4]) ? 'b' : 'w'));


        // $('head').append(gradient);
    });

    $themes_li.each(function(li_index) {
        var li = $(this);
        if (li.hasClass($('input#sticky_theme').val())) li.addClass('selected');

    //     // li.addClass('gradient-' + li_index);

    //     // gradient_getter += 'li.gradient-' + li_index + ' .color_scheme > span:nth-child(4), body.gradient-' + li_index + ' #wpbody-content:before {background: ' + sticky_color_schemes[li_index][2] + ' ;background: -webkit-linear-gradient(180deg, ' + sticky_color_schemes[li_index][2] + ', ' + sticky_color_schemes[li_index][4] + ' 100%);background: -moz-linear-gradient(180deg, ' + sticky_color_schemes[li_index][2] + ', ' + sticky_color_schemes[li_index][4] + ' 100%);background: -o-linear-gradient(180deg, ' + sticky_color_schemes[li_index][2] + ', ' + sticky_color_schemes[li_index][4] + ' 100%);background: linear-gradient(180deg, ' + sticky_color_schemes[li_index][2] + ', ' + sticky_color_schemes[li_index][4] + ' 100%);}';

        $('.color_scheme', li).children().each(function(c) {
            $(this).css('background-color', sticky_color_schemes[li_index][c]);
        });
    });

    // gradient_getter += '</style>';
    // $('head').append(gradient_getter);

    /**
     * Delete File.
     *
     * @since 1.0
     */
    $('.at-upload').delegate('.at-delete-file', 'click', function() {
        var $this = $(this),
            $parent = $this.parent(),
            data = $this.attr('rel');
        $.post(ajaxurl, {
            action: 'at_delete_file',
            data: data
        }, function(response) {
            response == '0' ? (alert('File has been successfully deleted.'), $parent.remove()) : alert('You do NOT have permission to delete this file.');
        });
        return false;
    });
    /**
     * initiate repeater sortable option
     * since 0.4
     */
    $(".repeater-sortable").sortable();
    $('.s_accordion').each(function() {
        $(this).accordion({
            animate: 100
        });
    });

    sticky_ajax_options();
    /**
     * initiate sortable fields option
     * since 0.4
     */
    $(".at-sortable").sortable({
        placeholder: "ui-state-highlight"
    });
    //new image upload field
    load_images_muploader();
    //delete img button
    $('.at-delete_image_button').live('click', function(event) {
        event.preventDefault();
        remove_image($(this));
        return false;
    });
    //upload images
    $('.at-upload_image_button').live('click', function(event) {
        event.preventDefault();
        image_upload($(this));
        return false;
    });
    /**
     * listen for import button click
     * @since 0.8
     * @return void
     */
    $("#apc_import_b").live("click", function() {
        do_ajax_import_export('import');
    });
    /**
     * listen for export button click
     * @since 0.8
     * @return void
     */
    $("#apc_export_b").live("click", function() {
        do_ajax_import_export('export');
    });
    //refresh page
    $("#apc_refresh_page_b").live("click", function() {
        refresh_page();
    });
    //status alert dismiss
    $('[data-dismiss="alert"]').live("click", function() {
        $(this).parent().remove()
    });
}

function sticky_ajax_options() {
    var form = $s_ui('form#admin_page_class');
    if ( ! form.length )
        return;

    var submitButton = $s_ui('#submit', form );
    var resetButton = $s_ui('input[type="reset"]', form );

    resetButton.click(function(e) {
        e.preventDefault();
        var conf = confirm('Are you sure you want to do this?');

        if ( conf )
            sticky_ajax_submit('reset');

        return;
    });

    form.submit(function(e) {
        e.preventDefault();

        var formData = $s_ui(this),
        optionSave = $s_ui("<input>", { type: "text", name:"sticky_option_save", val: true }),
        postData = formData.add(optionSave);
        postData = postData.serializeObject();
        postData = JSON.stringify(postData);

        sticky_ajax_submit(postData);
    });
}

function sticky_ajax_submit(postData) {
    $s_ui.post( ajaxurl, {
        action: 'sticky_option_save',
        sticky_new_options: postData
    }, function(response) {
        console.log(response.message);

        if (response.success)
            toastr.success(response.message);
        else 
            toastr.error(response.message);
    });
}


(function($){
    $.fn.serializeObject = function(){

        var self = this,
            json = {},
            push_counters = {},
            patterns = {
                "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
                "key":      /[a-zA-Z0-9_]+|(?=\[\])/g,
                "push":     /^$/,
                "fixed":    /^\d+$/,
                "named":    /^[a-zA-Z0-9_]+$/
            };


        this.build = function(base, key, value){
            base[key] = value;
            return base;
        };

        this.push_counter = function(key){
            if(push_counters[key] === undefined){
                push_counters[key] = 0;
            }
            return push_counters[key]++;
        };

        $.each($(this).serializeArray(), function(){

            // skip invalid keys
            if(!patterns.validate.test(this.name)){
                return;
            }

            var k,
                keys = this.name.match(patterns.key),
                merge = this.value,
                reverse_key = this.name;

            while((k = keys.pop()) !== undefined){

                // adjust reverse_key
                reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

                // push
                if(k.match(patterns.push)){
                    merge = self.build([], self.push_counter(reverse_key), merge);
                }

                // fixed
                else if(k.match(patterns.fixed)){
                    merge = self.build([], k, merge);
                }

                // named
                else if(k.match(patterns.named)){
                    merge = self.build({}, k, merge);
                }
            }

            json = $.extend(true, json, merge);
        });

        return json;
    };
})(jQuery);
/**
 * loadColorPicker
 * @since 1.2.2
 * @return void
 */
function loadColorPicker() {
    if ($.farbtastic) { //since WordPress 3.5
        $('.at-color').live('focus', function() {
            load_colorPicker($(this).next());
        });
        $('.at-color').live('focusout', function() {
            hide_colorPicker($(this).next());
        });
        /**
         * Select Color Field.
         *
         * @since 1.0
         */
        $('.at-color-select').live('click', function() {
            if ($(this).next('div').css('display') == 'none')
                load_colorPicker($(this));
            else
                hide_colorPicker($(this));
        });

        function load_colorPicker(ele) {
            colorPicker = $(ele).next('div');
            input = $(ele).prev('input');
            $.farbtastic($(colorPicker), function(a) {
                $(input).val(a).css('background', a);
            });
            colorPicker.show();
            //e.preventDefault();
            //$(document).mousedown( function() { $(colorPicker).hide(); });
        }

        function hide_colorPicker(ele) {
            colorPicker = $(ele).next('div');
            $(colorPicker).hide();
        }
        //issue #15
        $('.at-color').each(function() {
            var colo = $(this).val();
            if (colo.length == 7)
                $(this).css('background', colo);
        });
    } else {
        if ($('.at-color-iris').length > 0) {
            $('.at-color-iris').wpColorPicker();
        }
    }
}
/**
 * loadDatePicker
 * @since 1.2.2
 * @return void
 */
function loadDatePicker() {
    $('.at-date').each(function() {
        var $this = $(this),
            format = $this.attr('rel');
        $this.datepicker({
            showButtonPanel: true,
            dateFormat: format
        });
    });
}
/**
 * loadTimePicker
 * @since 1.2.2
 * @return void
 */
function loadTimePicker() {
    $('.at-time').each(function() {
        var $this = $(this),
            format = $this.attr('rel');
        $this.timepicker({
            showSecond: true,
            timeFormat: format
        });
    });
}
/**
 * Select 2 enable function
 * @since 1.1.5
 */
function fancySelect() {
    $("select").each(function() {
        if (!$(this).hasClass('no-fancy'))
            $(this).select2();
    });
}
/**
 * remove_image description
 * @since 1.2.2
 * @param  jQuery element object
 * @return void
 */
function remove_image(ele) {
    var $el = $(ele);
    var field_id = $el.attr("rel");
    var at_id = $el.prev().prev();
    var at_src = $el.prev();
    var t_button = $el;
    data = {
        action: 'apc_delete_mupload',
        _wpnonce: $('#nonce-delete-mupload_' + field_id).val(),
        field_id: field_id,
        attachment_id: jQuery(at_id).val()
    };
    $.getJSON(ajaxurl, data, function(response) {
        if ('success' == response.status) {
            $(t_button).val("Upload Image");
            $(t_button).removeClass('at-delete_image_button').addClass('at-upload_image_button');
            //clear html values
            $(at_id).val('');
            $(at_src).val('');
            $(at_id).prev().html('');
            load_images_muploader();
        } else {
            alert(response.message);
        }
    });
}
/**
 * image_upload handle image upload
 * @since 1.2.2
 * @param  jquery element object
 * @return void
 */
function image_upload(ele) {
    var $el = $(ele);
    formfield1 = $el.prev();
    formfield2 = $el.prev().prev();
    if ($el.attr('data-u') == 'tk') {
        tb_show('', 'media-upload.php?post_id=0&type=image&apc=apc&TB_iframe=true');
        //store old send to editor function
        window.restore_send_to_editor = window.send_to_editor;
        //overwrite send to editor function
        window.send_to_editor = function(html) {
            imgurl = $('img', html).attr('src');
            img_calsses = $('img', html).attr('class').split(" ");
            att_id = '';
            $.each(img_calsses, function(i, val) {
                if (val.indexOf("wp-image") != -1) {
                    att_id = val.replace('wp-image-', "");
                }
            });
            $(formfield2).val(att_id);
            $(formfield1).val(imgurl);
            load_images_muploader();
            tb_remove();
            //restore old send to editor function
            window.send_to_editor = window.restore_send_to_editor;
        }
    } else {
        // Uploading files since WordPress 3.5
        // If the media frame already exists, reopen it.
        if (file_frame) {
            file_frame.open();
            return;
        }
        // Create the media frame.
        file_frame = wp.media.frames.file_frame = wp.media({
            title: $el.data('uploader_title'),
            button: {
                text: $el.data('uploader_button_text'),
            },
            multiple: false // Set to true to allow multiple files to be selected
        });
        // When an image is selected, run a callback.
        file_frame.on('select', function() {
            // We set multiple to false so only get one image from the uploader
            attachment = file_frame.state().get('selection').first().toJSON();
            // Do something with attachment.id and/or attachment.url here
            jQuery(formfield2).val(attachment.id);
            jQuery(formfield1).val(attachment.url);
            load_images_muploader();
        });
        // Finally, open the modal
        file_frame.open();
    }
}
/**
 * load_images_muploader
 * load images after upload
 * @return void
 */
function load_images_muploader() {
    $(".mupload_img_holder").each(function(i, v) {
        if ($(this).next().next().val() != '') {
            if (!$(this).children().size() > 0) {
                var h = $(this).attr('data-he');
                var w = $(this).attr('data-wi');
                $(this).append('<img src="' + $(this).next().next().val() + '" style="height: ' + h + ';width: ' + w + ';" />');
                $(this).next().next().next().val("Delete");
                $(this).next().next().next().removeClass('at-upload_image_button').addClass('at-delete_image_button');
            }
        }
    });
}
/**
 * load_code_editor  loads code editors
 * @since 1.2.2
 * @return void
 */
function load_code_editor() {
    var e_d_count = 0;
    $(".code_text").each(function() {
        var lang = $(this).attr("data-lang");
        //php application/x-httpd-php
        //css text/css
        //html text/html
        //javascript text/javascript
        switch (lang) {
            case 'php':
                lang = 'application/x-httpd-php';
                break;
            case 'less':
            case 'css':
                lang = 'text/css';
                break;
            case 'html':
                lang = 'text/html';
                break;
            case 'javascript':
                lang = 'text/javascript';
                break;
            default:
                lang = 'application/x-httpd-php';
        }
        var theme = $(this).attr("data-theme");
        switch (theme) {
            case 'default':
                theme = 'default';
                break;
            case 'light':
                theme = 'solarizedLight';
                break;
            case 'dark':
                theme = 'solarizedDark';;
                break;
            default:
                theme = 'default';
        }
        var editor = CodeMirror.fromTextArea(document.getElementById($(this).attr('id')), {
            lineNumbers: true,
            matchBrackets: true,
            mode: lang,
            indentUnit: 4,
            indentWithTabs: true,
            enterMode: "keep",
            tabMode: "shift"
        });
        editor.setOption("theme", theme);
        $(editor.getScrollerElement()).width(100); // set this low enough
        width = $(editor.getScrollerElement()).parent().width();
        $(editor.getScrollerElement()).width(width); // set it to
        editor.refresh();
        Ed_array[e_d_count] = editor;
        e_d_count++;
    });
}
/***************************
 * Import Export Functions *
 * ************************/
/**
 * do_ajax
 *
 * @author Ohad Raz <admin@bainternet.info>
 * @since 0.8
 * @param  string which  (import|export)
 *
 * @return void
 */
function do_ajax_import_export(which) {
    before_ajax_import_export(which);
    var group = jQuery("#option_group_name").val();
    var seq_selector = "#apc_" + which + "_nonce";
    var action_selctor = "apc_" + which + "_" + group;
    jQuery.ajaxSetup({
        cache: false
    });
    if (which == 'export')
        export_ajax_call(action_selctor, group, seq_selector, which);
    else
        import_ajax_call(action_selctor, group, seq_selector, which);
    jQuery.ajaxSetup({
        cache: true
    });
}
/**
 * export_ajax_call make export ajax call
 *
 * @author Ohad Raz <admin@bainternet.info>
 * @since 0.8
 *
 * @param  string action
 * @param  string group
 * @param  string seq_selector
 * @param  string which
 * @return void
 */
function export_ajax_call(action, group, seq_selector, which) {
    jQuery.getJSON(ajaxurl, {
            group: group,
            rnd: microtime(false), //hack to avoid request cache
            action: action,
            seq: jQuery(seq_selector).val()
        },
        function(data) {
            if (data) {
                export_response(data);
            } else {
                alert("Something Went Wrong, try again later");
            }
            after_ajax_import_export(which);
        }
    );
}
/**
 * import_ajax_call make import ajax call
 *
 * @author Ohad Raz <admin@bainternet.info>
 * @since 0.8
 *
 * @param  string action
 * @param  string group
 * @param  string seq_selector
 * @param  string which
 * @return void
 */
function import_ajax_call(action, group, seq_selector, which) {
    jQuery.post(ajaxurl, {
            group: group,
            rnd: microtime(false), //hack to avoid request cache
            action: action,
            seq: jQuery(seq_selector).val(),
            imp: jQuery("#import_code").val(),
        },
        function(data) {
            if (data) {
                import_response(data);
            } else {
                alert("Something Went Wrong, try again later");
            }
            after_ajax_import_export(which);
        },
        "json"
    );
}
/**
 * before_ajax_import_export
 *
 * @author Ohad Raz <admin@bainternet.info>
 * @since 0.8
 * @param  string which  (import|export)
 *
 * @return void
 */
function before_ajax_import_export(which) {
    jQuery(".import_status").hide("fast");
    jQuery(".export_status").hide("fast");
    jQuery(".export_results").html('').removeClass('alert-success').hide();
    jQuery(".import_results").html('').removeClass('alert-success').hide();
    if (which == 'import')
        jQuery(".import_status").show("fast");
    else
        jQuery(".export_status").show("fast");
}
/**
 * after_ajax_import_export
 *
 * @author Ohad Raz <admin@bainternet.info>
 * @since 0.8
 * @param  string which  (import|export)
 *
 * @return void
 */
function after_ajax_import_export(which) {
    if (which == 'import')
        jQuery(".import_status").hide("fast");
    else
        jQuery(".export_status").hide("fast");
}
/**
 * export_reponse
 *
 * @author Ohad Raz <admin@bainternet.info>
 * @since 0.8
 * @param  json data ajax response
 * @return void
 */
function export_response(data) {
    if (data.code)
        jQuery('#export_code').val(data.code);
    if (data.nonce)
        jQuery("#apc_export_nonce").val(data.nonce);
    if (data.err)
        jQuery(".export_results").html(data.err).show('slow');
}
/**
 * import_reponse
 *
 * @author Ohad Raz <admin@bainternet.info>
 * @since 0.8
 * @param  json data ajax response
 *
 * @return void
 */
function import_response(data) {
    if (data.nonce)
        jQuery("#apc_import_nonce").val(data.nonce);
    if (data.err)
        jQuery(".import_results").html(data.err);
    if (data.success)
        jQuery(".import_results").html(data.success).addClass('alert-success').show('slow');
}
/********************
 * Helper Functions *
 *******************/
/**
 * refresh_page
 * @since 0.8
 * @return void
 */
function refresh_page() {
    location.reload();
}
/**
 * microtime used as hack to avoid ajax cache
 *
 * @author Ohad Raz <admin@bainternet.info>
 * @since 0.8
 * @param  boolean get_as_float
 *
 * @return microtime as int or float
 */
function microtime(get_as_float) {
    var now = new Date().getTime() / 1000;
    var s = parseInt(now);
    return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + " " + s;
}
/**
 * Helper Function
 *
 * Get Query string value by name.
 *
 * @since 1.0
 */
function get_query_var(name) {
    var match = RegExp('[?&]' + name + '=([^&#]*)').exec(location.href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
