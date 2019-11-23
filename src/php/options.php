<?php
/**
 *
 * StickyAdmin Options Panel - Configuration
 * 
 * @since 1.0
 * @author Dorian Tudorache
 *
 */
require_once "classes/admin-page-class/admin-page-class.php";
$plugin_url = WP_PLUGIN_URL . '/stickyadmin';
$options_panel = new BF_Admin_Page_Class( 
    array (
        'menu'           => 'settings',
        'page_title'     => __( 'Sticky Admin', '_sticky_' ),
        'capability'     => 'edit_stickyadmin',
        'option_group'   => 'sticky_options',
        'id'             => 'admin_page',
        'fields'         => array(),
        'local_images'   => false,
        'use_with_theme' => false
    ) 
);
// Setup the container
$options_panel->OpenTabs_container( '' );
// Options Tabs
$options_panel->TabsListing( 
    array(
        'links' => array(
            's_themes'     =>  __( 'Themes', '_sticky_' ),
            's_login_page' =>  __( 'Login Page', '_sticky_' ),
            's_dashboard'  =>  __( 'Dashboard', '_sticky_' ),
            's_bar'        =>  __( 'WPAdminBar', '_sticky_' ),
            's_header'     =>  __( 'Header', '_sticky_' ),
            's_navigation' =>  __( 'Navigation', '_sticky_' ),
            's_content'    =>  __( 'Content', '_sticky_' ),
            's_footer'     =>  __( 'Footer', '_sticky_' ),
            's_extend'     =>  __( 'Extensions', '_sticky_' ),
            's_devs'       =>  __( 'Developers', '_sticky_' ),
            's_credits'    =>  __( 'Credits', '_sticky_' )
        )
    ) 
);
$options_panel->OpenTab( 's_themes' );
$options_panel->h1( __( "Sticky Themes", '_sticky_' ) );
$options_panel->AccordionArea( 's_themes_acc' );
$options_panel->Title( __( "Themes", '_sticky_' ) );
$options_panel->add_s_ThemeSelector( 'sticky_theme_selector', 
    array(
        'name' => __( "Choose a theme", '_sticky_' ),
        'std' => 'blue-sky-moisty',
        'options' => array( 
            'aruba'                 => 'Aruba',
            'back-to-basics'        => 'Back to Basics',
            'black-knight'          => 'Black Knight',
            'black-swan'            => 'Black Swan',
            'blue-sky-moisty'       => 'Blue Sky Moisty',
            'choco-coffee'          => 'Chocoloate Coffee',
            'firenze'               => 'Firenze',
            'heart-of-steel'        => 'Heart Of Steel',
            'indigo-moon'           => 'Indigo Moon',
            'japanesse'             => 'Japanesse',
            'knight-drive'          => 'Knight Drive',
            'memorial'              => 'Memorial',
            'midori-madoka'         => 'Midori & Madoka',
            'nautical'              => 'Nautical',
            'oil-flame'             => 'Oil Flame',
            'prairie-sunset'        => 'Prairie Sunset',
            'red-embrace'           => 'Red Embrace',
            'sea-wolf'              => 'Sea Wolf',
            'sigma-orange'          => 'Sigma Orange',
            'summer-leaves'         => 'Summer Leaves',
            'szymborska'            => 'Szymborska',
            'vicky'                 => 'Vicky',
            'vintage-space'         => 'Vintage Space',
            'bonus-1'                => 'Bonus 1',
            'bonus-2'                => 'Bonus 2',
            'bonus-3'                => 'Bonus 3',
            'bonus-4'                => 'Bonus 4',
            'bonus-5'                => 'Bonus 5',
            'bonus-6'                => 'Bonus 6',
            'bonus-7'                => 'Bonus 7',
            'bonus-8'                => 'Bonus 8',
        )
    ) 
);
$options_panel->addHidden( 'sticky_theme', array(
    'std'  => 'blue-sky-moisty'
) );
$options_panel->AccordionAEnd();
$options_panel->CloseTab();
/* Login Page Options */
$options_panel->OpenTab( 's_login_page' );
    $options_panel->h1( __( "Login Page", '_sticky_' ) );
    $options_panel->AccordionArea( 's_login_page_acc' );
        /* Background Options for Login Page */
        $options_panel->Title( __( "Background", '_sticky_' ) );
        $options_panel->addColor( 'login_background_color', array(
                'name'  => __( 'Background Color', '_sticky_' ),
                'desc'  => __( 'Pick a color to use as overlay (if using an image) or background for the login page.', '_sticky_'),
                'std'   => '#1a1f2b'
        ) );
        $options_panel->addImage( 'login_background_image', array(
                'name'  => __( 'Background Image', '_sticky_' ),
                'desc'  => __( 'Choose an image to be displayed as the Login Page background.', '_sticky_' )
        ) );
        $options_panel->addCheckbox( 'login_backstrech', array(
                'name'  => __( 'BackStretch Image', '_sticky_'),
                'desc'  => __( 'This option resizes the background image used on the Login Page to fit any screen, no matter the dimensions of the image. JavaScript required.', '_sticky_' ),
                'std'   => true
        ) );
        /* Logo Options for Login Page */
        $options_panel->Title( __( "Logo", '_sticky_' ) );
        $options_panel->addText( 'login_logo_link' , array(
                'name'  => __( 'Logo Link', '_sticky_' ),
                'desc'  => __( 'Optional. Clicking the logo could take you to a page. Leave empty to disable.', '_sticky_' ),
                'std'   => 'index.php'
        ) );
        $options_panel->addImage( 'logo_image', array(
                'name'  => __( 'Custom Logo Image', '_sticky_' ),
                'desc'  => __( 'Upload your custom logo image (any supported format) to be used as the displaying logo on the Login Page.', '_sticky_' ),
                'std'   => $plugin_url . '/lib/assets/sticky-logo-white.png'
        ) );
        $options_panel->addTextarea( 'login_logo_svg_code', array(
            'name'  => __( 'Logo SVG code', '_sticky_' ),
            'desc'  => __( 'Open your .SVG file with a regular text editor and copy paste the entire text here. Please make sure your SVG is not using any external links in its structure when you have it generated.', '_sticky_' ),
            'std'   => ''
        ) );
        $options_panel->addText( 'login_custom_text_logo', array(
                'name'  => __( 'Custom Logo Text', '_sticky_' ),
                'desc'  => __( 'Enter a custom text to be displayed as the logo. This only applies if the logo is set to be shown as Text.', '_sticky_' ),
                'std'   => 'StickyAdmin'
        ) );
        $options_panel->addText( 'login_logo_alt' , array(
                'name'  => __( 'Logo Description', '_sticky_' ),
                'desc'  => __( 'ALT (Alternative) text for the logo. It shows when hovering the logo.', '_sticky_' ),
                'std'   => 'StickyAdmin - Modern WP-Admin User Interface'
        ) );
        $options_panel->addSelect( 'login_logo_how', NULL, array(
                'name'  => __( 'Display as:', '_sticky_' ),
                'desc'  => __( 'Select how the logo should be displayed on the navigation bar based on your settings above.', '_sticky_' ),
                'std'   => 'image',
                'options' => array(
                    'hide'  => __( "Hide", '_sticky_' ),
                    'text'  => __( "Text", '_sticky_' ),
                    'image' => __( "Image", '_sticky_' ),
                    'svg'   => __( "SVG", '_sticky_' )
                )
        ) );
        /* Login Page Form */
        $options_panel->Title( __( "Login Form", '_sticky' ) );
        $options_panel->addCheckbox( 'login_form_background', array(
                'name'  => __( 'Form Background', '_sticky_' ),
                'desc'  => __( 'Should the form on the Login Page have a background?', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->addColor( 'login_form_background_color', array(
                'name'  => __( 'Form Background', '_sticky_' ),
                'desc'  => __( 'Pick a color to use as the background for the login form.', '_sticky_'),
                'std'   => '#30395c'
        ) );
    $options_panel->AccordionAEnd();
$options_panel->CloseTab();
/* Dashboard Options */
$options_panel->OpenTab( 's_dashboard' );
    $options_panel->h1( __( "Dashboard", '_sticky_' ) );
    $options_panel->AccordionArea( 's_dash_page_acc' );
        $options_panel->Title( __( "Appearance", '_sticky_' ) );
        $options_panel->addText( 'dash_heading', array(
                'name'  => __( 'Welcome text', '_sticky_' ),
                'desc'  => __( 'Input a custom heading title to be displayed on the Dashboard - Welcome Screen. Only works if JavaScript is enabled.', '_sticky_' ), 
                'std'   => __( 'Welcome to WordPress with StickyAdmin!', '_sticky_') 
        ) );
        $options_panel->addText( 'dash_subheading', array(
                'name'  => __( 'Welcome subheading / Statistics Widget title', '_sticky_' ),
                'desc'  => __( 'Input a custom sub-heading to be displayed on the Dashboard - Welcome Screen. Only works if JavaScript is enabled.', '_sticky_' ), 
                'std'   => __( 'Site statistics', '_sticky_') 
        ) );
        $options_panel->Title( __( "Statistics", '_sticky_' ) );
        $options_panel->addCheckbox( 's_stats' , array(
                'name'  => __( 'Statistics widget', '_sticky_' ),
                'desc'  => __( 'Show/Hide the Statistics Widget on the Dashboard. If the next option is also enabled, the widget is morphed into the welcome-panel and no longer displayed as a WordPress widget.', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->addCheckbox( 's_no_welcome' , array(
                'name'  => __( 'Replace Welcome Screen with Statistics', '_sticky_' ),
                'desc'  => __( 'Replace the default welcome-panel with Statistics.', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->addCheckbox( 's_s_tracker', array(
                'name'  => __( 'Track', '_sticky_' ),
                'desc'  => __( 'Status of statistics tracker. If disabled, you will be able to view the statistics, but no new statistics will be collected.', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->addCheckbox( 's_s_track_users', array(
                'name'  => __( 'Track Registered Users', '_sticky_' ),
                'desc'  => __( 'Track logged in users.', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->addCheckbox( 's_s_ignore_bots', array(
                'name'  => __( 'Exlcude bots tracking', '_sticky_' ),
                'desc'  => __( 'Do not to track visits from bots and search engines crawlers.', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->addCheckbox( 's_s_ignore_spam', array(
                'name'  => __( 'Exclude spam tracking', '_sticky_' ),
                'desc'  => __( 'Do not track visits from users who left a spam comment. This option requires Akismet plugin to be enabled. Page views generated by users whose comments are later marked as spam, will also be removed from the statistics.', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->addCheckbox( 's_s_ignore_admin', array(
                'name'  => __( 'Exclude Admin Pages tracking', '_sticky_' ),
                'desc'  => __( 'Do not track activity within your WordPress administration panels.', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->Title( __( "Statistics - Colors", '_sticky_' ) );
        $options_panel->addColor( 's_s_color_1', array(
                'name'  => __( 'Color 1:', '_sticky_' ),
                'desc'  => __( '', '_sticky_' ),
                'std'   => '#4a6491'
        ) );
        $options_panel->addColor( 's_s_color_2', array(
                'name'  => __( 'Color 2:', '_sticky_' ),
                'desc'  => __( '', '_sticky_' ),
                'std'   => '#4a6491'
        ) );
        $options_panel->Title( __( "Statistics - Advanced", '_sticky_' ) );
        $options_panel->addText( 's_s_purge_time', array(
                'name'  => __( 'Statistics Period', '_sticky_' ),
                'desc'  => __( 'Delete statistics older than the number of days specified. Enter 0 (number zero) for unlimited.', '_sticky_' ),
                'std'   => '150'
        ) );
        $options_panel->addTextarea( 's_s_exlude_ips', array(
                'name'  => __( 'Exclude IPs', '_sticky_' ),
                'desc'  => __( 'List all the IP addresses you don\'t want to track, separated by commas. Each network must be defined using the CIDR notation (i.e. 192.168.0.0/24). This filter applies both to the public IP and the originating IP, if available.', '_sticky_' ),
                'std'   => ''
        ) );
        $options_panel->addTextarea( 's_s_exlude_ua', array(
                'name'  => __( 'Exclude User Agents', '_sticky_' ),
                'desc'  => __( 'Browsers (user agents) you don\'t want to track, separated by commas. You can specify the browser\'s version adding a slash after the name (i.e. Firefox/3.6). Wildcards: <em>*</em> matches \'any string, including the empty string\', <em>!</em> matches \'any character\'. For example, <em>Chr*</em> will match Chrome and Chromium, <em>IE/!.0</em> will match IE/7.0 and IE/8.0. Strings are case-insensitive.', '_sticky_' ),
                'std'   => ''
        ) );
        $options_panel->addTextarea( 's_s_exlude_country', array(
                'name'  => __( 'Exclude Countries', '_sticky_' ),
                'desc'  => __( 'Country codes (i.e.: <em>en-us, it, es</em>) that you don\'t want to track, separated by commas.', '_sticky_' ),
                'std'   => ''
        ) );
        $options_panel->addTextarea( 's_s_exlude_referral', array(
                'name'  => __( 'Exclude Referrals', '_sticky_' ),
                'desc'  => __( 'Referring URLs that you don\'t want to track, separated by commas: <em>http://mysite.com*</em>, <em>*/ignore-me-please</em>, etc. Wildcards: <em>*</em> matches \'any string, including the empty string\', <em>!</em> matches \'any character\'. Strings are case-insensitive. Please include either a wildcard or the protocol you want to filter (<em>http://, https://</em>).', '_sticky_' ),
                'std'   => ''
        ) );
        $options_panel->addTextarea( 's_s_exclude_user', array(
                'name'  => __( 'Exclude Users', '_sticky_' ),
                'desc'  => __( 'List all the usernames you don\'t want to track, separated by commas. Please be aware that spaces are not ignored and that usernames are case sensitive.', '_sticky_' ),
                'std'   => ''
        ) );
        $options_panel->addTextarea( 's_s_exlude_page', array(
                'name'  => __( 'Exclude Pages', '_sticky_' ),
                'desc'  => __( 'List all the URLs on your website that you don\'t want to track, separated by commas. Don\'t include the domain name: /about, ?p=1, etc. Wildcards: <em>*</em> matches \'any string, including the empty string\', <em>!</em> matches \'any character\'. For example, <em>/abou*</em> will match <em>/about</em> and <em>/abound</em>, <em>/abo*t</em> will match <em>/aboundant</em> and <em>/about</em>, <em>/abo!t</em> will match <em>/about</em> and <em>/abort</em>. Strings are case-insensitive.', '_sticky_' ),
                'std'   => ''
        ) );
        $options_panel->addTextarea( 's_s_roles', array(
                'name'  => __( 'Statistics Roles', '_sticky_' ),
                'desc'  => __( 'List all the roles, separated by a comma, to allow access to the statistics. Administrator role is always permitted.', '_sticky_' ),
                'std'   => ''
        ) );
        $options_panel->addText( 's_s_visit_time', array(
                'name'  => __( 'Visit Duration', '_sticky_' ),
                'desc'  => __( 'In (seconds). Extend the duration of a visit each time the user visits a new page. ', '_sticky_' ),
                'std'   => '1800'
        ) );
        $options_panel->addCheckbox( 's_s_extend_visit', array(
                'name'  => __( 'Extend Visit', '_sticky_' ),
                'desc'  => __( 'Extend the duration of a visit each time the user visits a new page.', '_sticky_' ),
                'std'   => false
        ) );
        // config roles removed.
     $options_panel->AccordionAEnd();
$options_panel->CloseTab();
/* WPAdmin (Top) Bar */
$options_panel->OpenTab( 's_bar' );
    $options_panel->h1( __( 'Admin Bar', '_sticky_' ) );
    $options_panel->AccordionArea( 's_bar_acc' );
        $options_panel->Title( __( 'Elements', '_sticky_' ) );
        $options_panel->addCheckbox( 'wp_logo', array(
                'name'  => __( 'Show WordPress Logo', '_sticky_' ),
                'desc'  => __( 'Disabling this option will hide the WordPress logo (including the submenu) in the top-left side of your administration panel', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->addCheckbox( 'wpadminbar_updates_button', array(
                'name'  => __( 'Show Updates', '_sticky_' ),
                'desc'  => __( 'Disabling this option will hide the <em>Updates</em> Button on the bar.', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->addCheckbox( 'wpadminbar_comments_button', array(
                'name'  => __( 'Show Comments', '_sticky_' ),
                'desc'  => __( 'Disabling this option will hide the <em>Comments</em> Button on the bar.', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->addCheckbox( 'wpadminbar_sitename_button', array(
                'name'  => __( 'Show Site Title', '_sticky_' ),
                'desc'  => __( 'Disabling this option will hide the <em>Site Title</em> link and dropdown menu on the bar.', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->addCheckbox( 'wpadminbar_sitename_right', array(
                'name'  => __( 'Right Position Site Title', '_sticky_' ),
                'desc'  => __( 'This option will move the site title widget in the right side, before the profile menu.', '_sticky_' ),
                'std'   => false
        ) );
        $options_panel->addCheckbox( 'wpadminbar_new_button', array(
                'name'  => __( 'Show New Content', '_sticky_' ),
                'desc'  => __( 'Disabling this option will hide the <em>(Add) New</em> button and dropdown menu on the bar.', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->addCheckbox( 'wpadminbar_search', array(
                'name'  => __( 'Show SearchBar on Fornt-End', '_sticky_' ),
                'desc'  => __( 'If the theme you are currently using already has a search bar or button included in it, this is no longer needed.', '_sticky_' ),
                'std'   => false
        ) );
        $options_panel->addText( 'wpadminbar_howdy', array(
                'name'  => __( 'Greeting Message', '_sticky_' ),
                'desc'  => __( 'Define a custom "Howdy" greeting message for the profile link.', '_sticky_' ),
                'std'   => __( 'Howdy', '_sticky_' )
        ) );
        /* Settings --- subsection */
        $options_panel->Title( __( 'Settings', '_sticky_' ) );
        $options_panel->addCheckbox( 'wpadminbar_sticky', array(
                'name'  => __( 'Sticky', '_sticky_' ),
                'desc'  => __( 'Disabling this option will un-stick the bar, making it not stay on top when scrolling the page down.', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->addCheckbox( 'wpadminbar_hide', array(
                'name'  => __( 'Hide', '_sticky_' ),
                'desc'  => __( 'Enabling this option will completely hide the bar both on front-end and back-end.', '_sticky_' ),
                'std'   => false
        ) );
        $options_panel->addCheckbox( 'wpadminbar_controls', array(
                'name'  => __( 'Bar Controls', '_sticky_' ),
                'desc'  => __( 'Disabling this option will hide the resize / close toggle buttons from the bar.', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->addCheckbox( 'wpadminbar_preserve', array(
                'name'  => __( 'Preserve Design on Front-End', '_sticky_' ),
                'desc'  => __( 'If you wish to keep the bar design and looks on the front-end area of your website, leave this option enabled.', '_sticky_' ),
                'std'   => true
        ) );
        /* Appearance --- subsection */
        $options_panel->Title( __( "Appearance", '_sticky_' ) );
        $options_panel->addColor( 'wpadminbar_bg', array(
                'name'  => __( 'Background', '_sticky_' ),
                'desc'  => __( 'Pick a custom background color for the bar.', '_sticky_' ),
                'std'   => "#ffffff"
        ) );
        $options_panel->addColor( 'wpadminbar_hl', array(
                'name'  => __( 'Highlight', '_sticky_' ),
                'desc'  => __( 'Pick a custom color (used on the notifcation badges) for the adminbar.', '_sticky_' ),
                'std'   => "#d0e4f2"
        ) );
        $options_panel->addColor( 'wpadminbar_sub_bg', array(
                'name'  => __( 'Submenus', '_sticky_' ),
                'desc'  => __( 'Pick a custom background color for the submenus popping from the bar.', '_sticky_' ),
                'std'   => "#ffffff"
        ) );
        $options_panel->addColor( 'wpadminbar_profile_link_bg', array(
                'name'  => __( 'Profile Link', '_sticky_' ),
                'desc'  => __( 'Pick a custom background color for the profile link in the right side of the bar.', '_sticky_' ),
                'std'   => "#1a1f2b"
        ) );
        $options_panel->addColor( 'wpadminbar_profile_bg', array(
                'name'  => __( 'Profile Menu', '_sticky_' ),
                'desc'  => __( 'Pick a custom background color for the popping menu out of the profle link on the bar', '_sticky_' ),
                'std'   => "#1a1f2b"
        ) );
        $options_panel->Title( __( 'Tooltips', '_sticky_' ) );
        $options_panel->addCheckbox( 'wpab_tooltips_disable', array(
                'name'  => __( 'Disable', '_sticky_' ),
                'desc'  => __( 'Enabling this option will completely disable the tooltips in the Admin Bar. Recommended for advanced WordPress users. Tooltips happen when hovering an element that has an additional description.', '_sticky_' ),
                'std'   => false
        ) );
        $options_panel->addColor( 'wpab_tooltips_bg', array(
                'name'  => __( 'Background', '_sticky_' ),
                'desc'  => __( 'Pick a custom background color for the tooltips.', '_sticky_' ),
                'std'   => "#ffffff"
        ) );
    $options_panel->AccordionAEnd();
$options_panel->CloseTab();
/* Header */
$options_panel->OpenTab( 's_header' );
    $options_panel->h1( __( 'Header', '_sticky_' ) );
    $options_panel->AccordionArea( 's_header_acc' );
        /* Header --- subsection */
        $options_panel->Title( __( 'Settings', '_sticky_' ) );
        $options_panel->addCheckbox( 'header_sticky', array(
                'name'  => __( 'Sticky', '_sticky_' ),
                'desc'  => __( 'This option keeps the header on the top of your page while scrolling.', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->addCheckbox( 'header_icons', array(
                'name'  => __( 'Show icons', '_sticky_' ),
                'desc'  => __( 'Disabling this option will hide all icons in the header.', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->addSelect( 'header_type', NULL, array(
                'name'  => __( 'On Scroll', '_sticky_' ),
                'desc'  => __( 'Choose how to display the header when scrolling down the page.', '_sticky_' ),
                'std'   => 'minimize',
                'options' => array(
                    'minimize'  => __( 'Minimize', '_sticky_' ),
                    'minimized' => __( 'Stay Minimized', '_sticky_' ),
                    'maximized' => __( 'Stay Maximized', '_sticky_' ),
                )
        ) );
        $options_panel->Title( __( 'Appearance', '_sticky_' ) );
        $options_panel->addColor( 'header_bg', array(
                'name'  => __( 'Background', '_sticky_' ),
                'desc'  => __( 'Pick a background color for the header.', '_sticky_' ),
                'std'   => '#4a6491'
        ) );
    $options_panel->AccordionAEnd();
$options_panel->CloseTab();
/* Navigation */
$options_panel->OpenTab( 's_navigation' );
    $options_panel->h1( __( 'Navigation', '_sticky_' ) );
    $options_panel->AccordionArea( 's_nav_acc' );
        $options_panel->Title( __( 'Settings', '_sticky_' ) );
        $options_panel->addCheckbox( 'nav_sticky', array(
                'name'  => __( 'Sticky', '_sticky_' ),
                'desc'  => __( 'This option makes the navigation bar fixed based on the user\'s screen size, allowing them to scroll down the menu. Disabling it will make the navigation bar relative, so when the page is scrolled down, the menu also goes down.', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->addSelect( 'nav_pos', NULL, array(
                'name'  => __( 'Position', '_sticky_' ),
                'desc'  => __( 'Choose your navigation bar position. RTL users should consider this option reverse.', '_sticky_' ),
                'std'   => 'left',
                'options'   => array(
                        'left'  => __( 'Left', '_sticky_' ),
                        'right' => __( 'Right', '_sticky_' )
                        // I really want to have these 2 options implemented for more flexibility sooner or later :)
                        // 'top' => __( 'Top', '_sticky_' )
                        // 'bottom' => __( 'Bottom', '_sticky_' )
                )
        ) );
        $options_panel->addCheckbox( 'nav_fold', array(
                'name'  => __( 'Foldable', '_sticky_' ),
                'desc'  => __( 'If this option is enabled, the fold button will be displayed on screens wider than 1024px, so the menu can be collapsed.', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->addCheckbox( 'nav_iconpicker', array(
                'name'  => __( 'Icon Picker', '_sticky_' ),
                'desc'  => __( 'Right clicking (Middle click on some systems) will pop up an iconpicker so you can customize the icon of a menu item. Disabling this will no longer show the iconpicker. The iconpicker is only displayed on desktop computers.', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->addCheckbox( 'nav_resize', array(
                'name'  => __( 'Resizable', '_sticky_' ),
                'desc'  => __( 'You may resize and transform the navgation bar on screens wider than 1024px. Disable this option to disable this feature.', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->addCheckbox( 'nav_grid', array(
                'name'  => __( 'Grid', '_sticky_' ),
                'desc'  => __( 'If the navigation bar gets resized to a larger size, menu items will become rectangular, giving the menu a grid effect. Disabling this option to disable this feature.', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->addCheckbox( 'nav_controls', array(
                'name'  => __( 'Controls', '_sticky_' ),
                'desc'  => __( 'This option refers to the menu settings icon showed in the bottom left corner of the menu. Disabling it will turn it off.', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->Title( __( "Logo", '_sticky_' ) );
        $options_panel->addText( 'nav_custom_logo_link', array(
                'name'  => __( 'Custom Logo Link', '_sticky_' ),
                'desc'  => __( 'Define a custom link where the logo should link to when clicked. Leave empty to disable.', '_sticky_' ),
                'std'   => ''
        ) );
        $options_panel->addText( 'nav_custom_logo_text', array(
                'name'  => __( 'Custom Logo Text', '_sticky_' ),
                'desc'  => __( 'Define a custom text to be displayed as the logo in the navigation bar. If left empty, it will fall back to the most appropiate option.', '_sticky_' ),
                'std'   => __( 'Sticky', '_sticky_' )
        ) );
        $options_panel->addText( 'nav_custom_logo_letter', array(
                'name'  => __( 'Folded Logo Letter', '_sticky_' ),
                'desc'  => __( 'A custom letter, usually the logo\'s first, to be displayed when the navigation bar is folded.', '_sticky_' ),
                'std'   => 's' //s from... Sticky!
        ) );
        $options_panel->addImage( 'nav_custom_logo_image', array(
                'name'  => __( 'Custom Logo Image', '_sticky_' ),
                'desc'  => __( 'A custom image to be displayed as the logo on the navigation bar.', '_sticky_' ),
                'std'   => ''
        ) );
        $options_panel->addImage( 'folded_logo_image', array(
                'name'  => __( 'Folded Logo Image', '_sticky_' ),
                'desc'  => __( 'A custom image to be displayed as the logo on the navigation bar when it is folded.', '_sticky_' ),
                'std'   => $plugin_url . '/lib/assets/sticky_logo_white_folded.png'
        ) );
        $options_panel->addTextarea( 'logo_svg_code', array(
            'name'  => __( 'Logo SVG code', '_sticky_' ),
            'desc'  => __( 'Open your .SVG file with a regular text editor and copy paste the entire text here. Please make sure that your SVG has a viewBox tag defined and is not using any external links in its structure when you have it generated.', '_sticky_' ),
            'std'   => '<svg width="100%" height="100%" viewBox="0 0 66 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><path d="M32.8426,12.5458c0.770276,0.214047 1.4408,0.188865 2.04308,0l0,-7.98126c-0.661744,-0.138054 -1.33804,-0.171962 -2.04308,0l0,7.98126ZM22.7154,6.40182c-1.55804,-0.352763 -2.29296,-0.66143 -2.29296,-1.39635c0,-0.646732 0.587938,-1.11708 1.64623,-1.11708c0.970098,0 2.24886,0.308668 3.16017,0.690827c0.419431,-0.40633 0.721636,-0.944577 0.85251,-1.67562c-1.01419,-0.440954 -2.39585,-0.837812 -3.96858,-0.837812c-2.36645,0 -3.8216,1.29346 -3.8216,3.11607c0,2.04308 1.71972,2.64572 3.85099,3.13077c1.51394,0.352763 2.20477,0.66143 2.20477,1.36696c0,0.76432 -0.676129,1.17588 -1.80791,1.17588c-1.29346,0 -2.24886,-0.132286 -3.61582,-0.793716c-0.429827,0.430943 -0.757265,0.927922 -0.76432,1.63153c1.64623,0.823113 2.54283,0.984796 4.30665,0.984796c2.41055,0 4.01268,-1.17588 4.01268,-3.17487c0,-1.8961 -1.52864,-2.60163 -3.7628,-3.10137ZM32.0636,6.25483c0.0890945,-0.567859 0.0890945,-1.1313 0,-1.69032l-2.23416,0l0,-3.10137c-0.659598,-0.0642262 -1.34202,-0.0727897 -2.05778,0l0,3.10137l-1.13178,0c-0.108901,0.45576 -0.108901,1.0192 0,1.69032l1.13178,0l0,3.89509c0,1.67562 1.07299,2.51344 2.41055,2.51344c1.14648,0 1.76381,-0.264572 1.85201,-0.293969c0.0849201,-0.520595 0.0849201,-1.03014 0,-1.52864c-0.279271,0.0293969 -0.587938,0.0734923 -0.940701,0.0734923c-1.02889,0 -1.26407,-0.411557 -1.26407,-1.83731l0,-2.8221l2.23416,0ZM41.9703,9.84126c-0.396858,0.602637 -1.05829,0.984796 -1.79321,0.984796c-1.29346,0 -2.35175,-1.02889 -2.35175,-2.27826c0,-1.26407 1.05829,-2.29296 2.35175,-2.29296c0.734923,0 1.39635,0.38216 1.79321,0.970098c0.47924,-0.336012 0.929597,-0.725318 1.32286,-1.21997c-0.720224,-0.970098 -1.83731,-1.58743 -3.11607,-1.58743c-2.41055,0 -4.36544,1.83731 -4.36544,4.13027c0,2.27826 1.95489,4.11557 4.36544,4.11557c1.23467,0 2.36645,-0.617335 3.08668,-1.60213c-0.34561,-0.486577 -0.786829,-0.883832 -1.29346,-1.21997ZM51.5945,4.54807c0.736249,-0.100887 1.41348,-0.0954069 2.03169,0.0164378l2.10188,5.42373l0.146985,0l2.05778,-5.42373c0.657944,-0.0792415 1.35857,-0.0792415 2.10188,0l-3.29245,8.40751c-0.705526,1.80791 -2.58693,2.33705 -4.26255,2.33705c-0.264572,0 -0.499747,0 -0.720224,-0.0146985c-0.17937,-0.832003 -0.0651775,-1.30909 0.249874,-1.54334l0.220477,0c1.10238,0 2.08718,-0.279271 2.54283,-1.20527l-0.176381,0l-2.98175,-7.63721l-2.58897,2.77202l2.95439,4.86519c-0.72946,0.107894 -1.48064,0.12228 -2.26356,0l-2.04308,-3.26306l-1.54334,1.48454l0,1.77851c-0.648138,0.102344 -1.31551,0.144827 -2.04308,0l0,-11.0826c0.647703,-0.0952009 1.32429,-0.107894 2.04308,0l0,6.52611l3.41004,-3.42474c0.701166,-0.0504605 1.38206,-0.0451206 2.05448,-0.0164378ZM33.8568,3.6973c0.646732,0 1.16118,-0.529144 1.16118,-1.19057c0,-0.66143 -0.514446,-1.20527 -1.16118,-1.20527c-0.646732,0 -1.17588,0.543843 -1.17588,1.20527c0,0.66143 0.529144,1.19057 1.17588,1.19057Z" style="fill:#ffffff;"/><g id="symbol"><path id="shape" d="M14.9043,0.879207c0,7.75964 -6.24752,14.8521 -14.8812,14.8521c0,0 5.45056,-1.99884 5.29521,-6.56935c-0.0913755,-2.68834 -1.92424,-4.00687 -3.42363,-5.07256c-1.7672,-1.25605 -1.46038,-3.21021 1.25117,-3.21021l11.7585,0ZM8.66296,11.6622c3.25674,-2.61475 4.65136,-6.22415 5.04952,-8.63801l-7.3755,0l-0.777586,1.45421c0.264753,0.29761 0.531504,0.64284 0.777586,1.03748l1.66922,-0.288376c0.426586,0.837222 0.718737,1.73637 0.865728,2.66444l-1.47349,0.724993c0.0424477,0.192526 0.0640729,1.10667 0.0179983,1.36043l1.45549,0.716137c-0.0517875,0.326973 -0.121593,0.650357 -0.208975,0.968704Z" style="fill:url(#tag1);"/><path id="shadows" d="M7.98974,13.431c-0.947079,0.617907 -2.1981,1.17465 -2.97048,1.433c0,0 2.14709,-1.7577 2.39306,-4.88889l0.49701,0.251258c-0.317153,1.94835 -1.0592,3.08425 -1.0592,3.08425l1.14372,0.111844c0.295876,-0.615408 0.525434,-1.23207 0.669207,-1.76064l0.427596,-0.355322c-0.104407,0.595011 -0.312351,1.22726 -0.604996,1.80274c-0.17876,0.127792 -0.499563,0.329323 -0.499563,0.329323l0.00364059,-0.00755594ZM6.33724,5.51288c0.561589,0.873405 0.905559,1.91803 1.06922,3.10452l0.455932,-0.224572c-0.136957,-1.03451 -0.449229,-2.03527 -1.00447,-2.97184l-0.520681,0.0918931ZM13.7162,3.01897l1.0331,0c-0.209664,1.2021 -0.399158,1.91335 -0.735155,2.88975c0.192212,-2.11072 -0.134651,-2.60024 -0.297945,-2.88975ZM5.55527,4.47823c-0.898756,-1.03097 -1.73411,-1.45416 -1.73411,-1.45416l2.51589,0l-0.781787,1.45416Z" style="fill:#000;fill-opacity:0.25098;"/></g><defs><linearGradient id="tag1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0.0187592,14.773,-14.773,0.0187592,0.708301,0.97579)"><stop offset="0%" style="stop-color:#0bd9d9;stop-opacity:1"/><stop offset="100%" style="stop-color:#0bd9d9;stop-opacity:1"/></linearGradient></defs></svg>'
        ) );
        $options_panel->addTextarea( 'folded_logo_svg_code', array(
            'name'  => __( 'Folded SVG code', '_sticky_' ),
            'desc'  => __( 'Open your .SVG file with a regular text editor and copy paste the entire text here. lease make sure that your SVG has a viewBox tag defined and is not using any external links in its structure when you have it generated.', '_sticky_' ),
            'std'   => '<svg width="100%" height="100%" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><g id="symbol"><path id="shape" d="M15.9696,0.0236995c0,8.32649 -6.7039,15.9371 -15.9683,15.9371c0,0 5.84872,-2.14486 5.68203,-7.04925c-0.0980505,-2.88473 -2.06481,-4.29957 -3.67372,-5.44312c-1.8963,-1.3478 -1.56706,-3.44471 1.34257,-3.44471l12.6174,0ZM9.27225,11.5944c3.49465,-2.80576 4.99114,-6.67883 5.41839,-9.26902l-7.91428,0l-0.834389,1.56044c0.284093,0.31935 0.570331,0.6898 0.834389,1.11327l1.79116,-0.309442c0.457748,0.898381 0.771241,1.86321 0.92897,2.85907l-1.58113,0.777954c0.0455485,0.20659 0.0687535,1.18751 0.0193131,1.4598l1.56182,0.768451c-0.0555705,0.350859 -0.130475,0.697865 -0.22424,1.03947Z" style="fill:url(#tag2);"/><path id="shadows" d="M8.54986,13.4924c-1.01626,0.663045 -2.35867,1.26045 -3.18747,1.53768c0,0 2.30394,-1.8861 2.56787,-5.24603l0.533316,0.269613c-0.340321,2.09068 -1.13657,3.30955 -1.13657,3.30955l1.22727,0.120014c0.317489,-0.660363 0.563817,-1.32208 0.718093,-1.88926l0.458832,-0.381279c-0.112034,0.638477 -0.335168,1.31691 -0.649191,1.93443c-0.191818,0.137128 -0.536056,0.35338 -0.536056,0.35338l0.00390654,-0.0081079ZM6.77664,4.99587c0.602614,0.937207 0.971711,2.05814 1.14732,3.3313l0.489239,-0.240977c-0.146962,-1.11008 -0.482045,-2.18394 -1.07784,-3.18893l-0.558717,0.0986059ZM14.6946,2.31977l1.10857,0c-0.224981,1.28992 -0.428317,2.05312 -0.788858,3.10085c0.206253,-2.26491 -0.144487,-2.79019 -0.31971,-3.10085ZM5.93754,3.88564c-0.96441,-1.10628 -1.86078,-1.56039 -1.86078,-1.56039l2.69968,0l-0.838897,1.56039Z" style="fill:#000;fill-opacity:0.25098;"/></g><defs><linearGradient id="tag2" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0.0201296,15.8522,-15.8522,0.0201296,0.736504,0.127337)"><stop offset="0%" style="stop-color:#0bd9d9;stop-opacity:1"/><stop offset="100%" style="stop-color:#0bd9d9;stop-opacity:1"/></linearGradient></defs></svg>'
        ) );
        // $options_panel
        $options_panel->addSelect( 'nav_logo_how', NULL, array(
                'name'  => __( 'Display as:', '_sticky_' ),
                'desc'  => __( 'Select how the logo should be displayed on the navigation bar based on your settings above.', '_sticky_' ),
                'std'   => 'svg',
                'options' => array(
                    'hide'  => __( "Hide", '_sticky_' ),
                    'text'  => __( "Text", '_sticky_' ),
                    'image' => __( "Image", '_sticky_' ),
                    'svg'   => __( "SVG", '_sticky_' )
                )
        ) );
        $options_panel->Title( __( "Appearance", '_sticky_' ) );
        $options_panel->addColor( 'nav_bg', array(
                'name'  => __( 'Background', '_sticky_' ),
                'desc'  => __( 'Pick a custom background color for the navigation bar.', '_sticky_' ),
                'std'   => '#1a1f2b'
        ) );

        $options_panel->addColor( 'nav_hl', array(
                'name'  => __( 'Highlight', '_sticky_' ),
                'desc'  => __( 'Pick a custom color (used on the notifcation badges, slected menu items\' icons) for the navigation bar.', '_sticky_' ),
                'std'   => '#0bced9'
        ) );
        $options_panel->addColor( 'nav_sub_bg', array(
                'name'  => __( 'Submenus Background', '_sticky_' ),
                'desc'  => __( 'Pick a custom background color for the sub-menus of the navigation menu.', '_sticky_' ),
                'std'   => "#ffffff"
        ) );
        $options_panel->addColor( 'nav_resize_handle_bg', array(
                'name'  => __( 'Resize Handle Background', '_sticky_' ),
                'desc'  => __( 'Pick a custom background color for the resize handle attached to the navgation bar.', '_sticky_' ),
                'std'   => "#ffffff"
        ) );
    $options_panel->AccordionAEnd();
$options_panel->CloseTab();
/* Content */
$options_panel->OpenTab( 's_content' );
    $options_panel->h1( __( "Content", '_sticky_' ) );
    $options_panel->AccordionArea( 's_content_acc' );
            $options_panel->Title( __( "Preloading", '_sticky_' ) );
            $options_panel->addCheckbox( 'content_preload' , array(
                    'name'  => __( 'Preload Content', '_sticky_' ),
                    'desc'  => __( 'Show/Hide the preloader when loading content in pages.', '_sticky_' ),
                    'std'   => true
            ) );
            $options_panel->addTextarea( 'content_preloader', array(
                    'name'  => __( 'Custom Preloader Code', '_sticky_' ),
                    'desc'  => __( 'If you wish to use a custom prelaoder, please input the HTML / CSS code in this textarea. Our recommandation for great preloaders: CssLoad.net website.', '_sticky_' ),
            ) );
            $options_panel->Title( __( 'Appearance', '_sticky_' ) );
            $options_panel->addColor( 'content_bg', array(
                    'name'  => __( 'Background', '_sticky_' ),
                    'desc'  => __( 'Pick a custom background color for the content area.', '_sticky_' ),
                    'std'   => '#ECF2F6'
            ) );
            $options_panel->addColor( 'highlight_color', array(
                    'name'  => __( 'Highlight color', '_sticky_' ),
                    'desc'  => __( 'Choose a highlight color. This should differ based on the above option (a light color for a dark background and vice-versa), otherwise it gets corrected by our algorithm, maintaing the color but changing it\'s lightness', '_sticky_' ),
                    'std'   => '#ffffff'
            ) );
            $options_panel->addColor ( 'scrollbar_rail', array(
                    'name'  => __( 'Scroll Rail', '_sticky_' ),
                    'desc'  => __( 'Pick a custom color for scrollbar rails, globally. Webkit browsers only at this time.', '_sticky_' ),
                    'std'   => '#1a1f2b'
            ) );
            $options_panel->addColor ( 'scrollbar', array(
                    'name'  => __( 'Scroll Bar', '_sticky_' ),
                    'desc'  => __( 'Pick a custom color for scrollbars, globally. Webkit browsers only at this time.', '_sticky_' ),
                    'std'   => '#30395c'
            ) );
            $options_panel->Title( __( "Widefat Tables", '_sticky_' ) );
            // $options_panel->addColor( 'widefat_header', array(
            //         'name'  => __( 'THEAD Background', '_sticky_' ),
            //         'desc'  => __( 'Pick a custom background color for Widefat Tables Header.', '_sticky_' ),
            //         'std'   => '#30395c'
            // ) );
            // $options_panel->addColor( 'widefat_footer', array(
            //         'name'  => __( 'TFOOT Background', '_sticky_' ),
            //         'desc'  => __( 'Pick a custom background color for Widefat Tables Footer.', '_sticky_' ),
            //         'std'   => '#30395c'
            // ) );
            // $options_panel->addColor( 'widefat_body', array(
            //         'name'  => __( 'TBODY Background', '_sticky_' ),
            //         'desc'  => __( 'Pick a custom background color for Widefat Tables Body.', '_sticky_' ),
            //         'std'   => '#ffffff'
            // ) );
            // $options_panel->addColor( 'widefat_selected', array(
            //         'name'  => __( 'Selected Row', '_sticky_' ),
            //         'desc'  => __( 'Pick a custom background color for Selected Rows in Widefat Tables.', '_sticky_' ),
            //         'std'   => '#a8e1ff'
            // ) );
            $options_panel->addColor( 'widefat_draft', array(
                    'name'  => __( 'Draft Post', '_sticky_' ),
                    'desc'  => __( 'Pick a custom background color for Draft Posts in Widefat Tables.', '_sticky_' ),
                    'std'   => '#fff3a2'
            ) );
            $options_panel->addColor( 'widefat_sticky', array(
                    'name'  => __( 'Sticky Post', '_sticky_' ),
                    'desc'  => __( 'Pick a custom background color for Sticky Posts in Widefat Tables.', '_sticky_' ),
                    'std'   => '#6af9ff'
            ) );
            $options_panel->addColor( 'widefat_pass', array(
                    'name'  => __( 'Protected Post', '_sticky_' ),
                    'desc'  => __( 'Pick a custom background color for Password Protected Posts in Widefat Tables.', '_sticky_' ),
                    'std'   => '#ffc7f4'
            ) );
            $options_panel->addColor( 'widefat_trash', array(
                    'name'  => __( 'Trashed Post', '_sticky_' ),
                    'desc'  => __( 'Pick a custom background color for Trash(ed) Posts in Widefat Tables.', '_sticky_' ),
                    'std'   => '#ffa7a7'
            ) );
            $options_panel->addColor( 'widefat_plugin_active', array(
                    'name'  => __( 'Plugin Active', '_sticky_' ),
                    'desc'  => __( 'Pick a custom background color for Active Plugins rows in Widefat Tables.', '_sticky_' ),
                    'std'   => '#30395c'
            ) );
            $options_panel->addColor( 'widefat_plugin_inactive', array(
                    'name'  => __( 'Plugin Inactive', '_sticky_' ),
                    'desc'  => __( 'Pick a custom background color for Inactive Plugin rows in Widefat Tables.', '_sticky_' ),
                    'std'   => '#FF5D5D'
            ) );
            $options_panel->Title( __( "Content Boxes", '_sticky_' ) );
            $options_panel->addColor( 'boxes_top_bg', array(
                    'name'  => __( 'Boxes Handle', '_sticky_' ),
                    'desc'  => __( 'Pick a custom background color for Content Boxes HEADERs. This also applies to several content boxes which use the same color for the background.', '_sticky_' ),
                    'std'   => '#4a6491'
            ) );
            $options_panel->addColor( 'boxes_bg', array(
                    'name'  => __( 'Boxes Background', '_sticky_' ),
                    'desc'  => __( 'Pick a custom background color for Content Boxes\' background. This does not apply to content boxes which use the same background color as the header.', '_sticky_' ),
                    'std'   => '#ECF2F6'
            ) );
            $options_panel->addSelect( 'boxes_type', NULL, array(
                    'name'  => __( 'Content Boxes Style', '_sticky_' ),
                    'desc'  => __( 'Choose your desired Header Style for Content Boxes.', '_sticky_' ),
                    'std'   => 'style4',
                    'options' => array(
                        'style2' => __( '3D-ish', '_sticky_' ),
                        'style3' => __( 'Flat Fill', '_sticky_' ),
                        'style4' => __( 'Small Enough', '_sticky_' )
                    )
            ) );
            $options_panel->Title( __( 'Forms', '_sticky_' ) );
            $options_panel->addColor( 'forms_top_bg', array(
                    'name'  => __( 'Forms Heading Background', '_sticky_' ),
                    'desc'  => __( 'Pick a custom background color for Forms Headers.', '_sticky_' ),
                    'std'   => '#1a1f2b'
            ) );
            $options_panel->addColor( 'forms_bg', array(
                    'name'  => __( 'Forms Background', '_sticky_' ),
                    'desc'  => __( 'Pick a custom background color for Forms.', '_sticky_' ),
                    'std'   => '#4a6491'
            ) );
            $options_panel->addColor( 'customizer_bg', array(
                    'name' => __( 'Customizer Background', '_sticky_' ),
                    'desc' => __( 'Select a background color for the WordPress Customizer form.', '_sticky_' ),
                    'std'  => '#1a1f2b'
            ) );
            $options_panel->Title( __( 'Tooltips', '_sticky_' ) );
            $options_panel->addColor( 'tooltips_bg', array(
                    'name'  => __( 'Background', '_sticky_' ),
                    'desc'  => __( 'Pick a custom background color for Tooltips displayed everywhere but in the Admin Bar.', '_sticky_' ),
                    'std'   => '#ffffff'
            ) );
            // $options_panel->Title( __( 'Widgets', '_sticky_' ) );
            // $options_panel->addColor( 'color_widget', array(
            //         'name'  => __( 'Widgets', '_sticky_' ),
            //         'desc'  => __( 'Pick a custom color for WordPress Widgets.', '_sticky_' ),
            //         'std'   => '#e5e9ec'
            // ) );
            // $options_panel->Title( __( 'Notifications', '_sticky_' ) );
            // $options_panel->addColor( 'color_notifs', array(
            //         'name'  => __( 'Background', '_sticky_' ),
            //         'desc'  => __( 'Pick a custom color for the popping (toastr) notifications.', '_sticky_' ),
            //         'std'   => '#30395c'
            // ) );
        $options_panel->AccordionAEnd();
$options_panel->CloseTab();
/* Footer */
$options_panel->OpenTab( 's_footer' );
    $options_panel->h1( __( 'Footer', '_sticky_' ) );
    $options_panel->AccordionArea( 's_footer_acc' );
        $options_panel->Title( __( 'Settings', '_sticky_' ) );
        $options_panel->addCheckbox( 'show_footer' , array(
                'name'  => __( 'Display Footer', '_sticky_' ),
                'desc'  => __( 'Choose if you would like to display the footer in your Administration Panel. Disabling this option will hide the footer.', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->addText( 'footer_copyright' , array(
                'name'  => __( 'Footer Copyright Text', '_sticky_' ),
                'desc'  => __( 'Input your own Copyright Text to be displayed in the footer.', '_sticky_' ),
                'std'   => '&copy; StickyAdmin 2015. All Rights Reserved. Donate!'
        ) );
        $options_panel->Title( __( 'Appearance', '_sticky_' ) );
        $options_panel->addColor( 'footer_bg', array(
                'name'  => __( 'Footer Background', '_sticky_' ),
                'desc'  => __( 'Pick a custom background color for the footer.', '_sticky_' ),
                'std'   => '#4a6491'
        ) );
    $options_panel->AccordionAEnd();
$options_panel->CloseTab();
/* Extensions */
$options_panel->OpenTab( 's_extend' );
    $options_panel->h1( __( 'Extensions Settings', '_sticky_' ) );
    $options_panel->AccordionArea( 's_ext_acc' );
        $options_panel->Title( __( 'PACE Configurator', '_sticky_' ) );
        $options_panel->addSelect( 'page_load', NULL, array(
                'name'  => __( 'PACE Theme', '_sticky_' ),
                'desc'  => __( 'PACE.js comes packed with several themes to choose from. Pick your favourite!', '_sticky_' ),
                'std'   => 'minimal',
                'options' => array(
                    'barber-shop'       => "Barber Shop",
                    'big-counter'       => "Big Counter",
                    'bounce'            => "Bounce",
                    'center-atom'       => "Center Atom",
                    'center-cirlce'     => "Center Circle",
                    'center-radar'      => "Center Radar",
                    'center-simple'     => "Center Simple",
                    'corner-indicator'  => "Corner Indicator",
                    'fill-left'         => "Fill left",
                    'flash'             => "Flash",
                    'flat-top'          => "Flat Top",
                    'loading-bar'       => "Loading Bar",
                    'mac-osx'           => "Mac OSX",
                    'minimal'           => "Minimal"
                )
            ) );
        $options_panel->addSelect( 'page_load_color', NULL, array(
                'name'  => __( 'PACE Color Scheme', '_sticky_' ),
                'desc'  => __( 'PACE.js comes packed with several color schemes for the loading indicators. Pick your favourite!', '_sticky_' ),
                'std'   => 'silver',
                'options' => array(
                    'black'     => "Black",
                    'blue'      => "Blue",
                    'green'     => "Green",
                    'orange'    => "Orange",
                    'pink'      => "Pink",
                    'purple'    => "Purple",
                    'red'       => "Red",
                    'silver'    => "Silver",
                    'white'     => "White",
                    'yellow'    => "Yellow"
                )
            ) );
        $options_panel->Title( __( 'Code Mirror', '_sticky_' ) );
        $options_panel->addSelect( 'code_editor_theme', NULL, array(
                'name'  => __( 'Choose Theme', '_sticky_' ),
                'desc'  => __( 'Code Mirror (code editor) comes packed with several color schemes. Pick your favourite!', '_sticky_' ),
                'std'   => 'eclipse',
                'options' => array(
                    '3024-day'                  => "3024 Day",
                    '3024-night'                => "3024 Night",
                    'ambiance'                  => "Ambiance",
                    'base16-dark'               => "Base 16 Dark",
                    'base16-light'              => "Base 16 Light",
                    'blackboard'                => "Blackboard",
                    'cobalt'                    => "Cobalt",
                    'eclipse'                   => "Eclipse",
                    'elegant'                   => "Elegant",
                    'erlang-dark'               => "Erlang Dark",
                    'lesser-dark'               => "Lesser Dark",
                    'mbo'                       => "Mbo",
                    'mdn-like'                  => "Mdn Like",
                    'midnight'                  => "Midnight",
                    'monokai'                   => "Monokai",
                    'neat'                      => "Neat",
                    'neo'                       => "Neo",
                    'night'                     => "Night",
                    'paraiso-dark'              => "Paraiso Dark",
                    'paraiso-light'             => "Paraiso Light",
                    'pastel-on-dark'            => "Pastel on Dark",
                    'rubyblue'                  => "Ruby Blue",
                    'solarized-dark'            => "Solarized Dark",
                    'solarized-light'           => "Solarized Light",
                    'the-matrix'                => "The Matrix",
                    'tomorrow-night-eighties'   => "Tomorrow Night Eighties",
                    'twilight'                  => "Twilight",
                    'vibrant-ink'               => "Vibrant Ink",
                    'xq-dark'                   => "XQ Dark",
                    'xq-light'                  => "XQ Light"
                )
            ) );
    $options_panel->AccordionAEnd();
$options_panel->CloseTab();
$options_panel->OpenTab( 's_credits' );
    $options_panel->h1( __( "Credits", '_sticky_' ) );
    $options_panel->AccordionArea( 's_credits_acc' );
        $options_panel->Title( __( "Credits", '_sticky_' ) );
        $options_panel->OpenDiv_Container();
        $options_panel->Subtitle( __( "PHP Libraries", '_sticky_' ) );
        $options_panel->Paragraph( "Admin Page Class - <a href='http://github.hubspot.com/pace/docs/welcome/'>visit website</a>" );
        $options_panel->Subtitle( __( "Icons", '_sticky_' ) );
        $options_panel->Paragraph( "Streamline Icons - <a href='http://www.streamlineicons.com/'>visit website</a>" );
        $options_panel->Paragraph( "FontAwesome - <a href='http://fortawesome.github.io/Font-Awesome/'>visit website</a>" );
        $options_panel->Paragraph( "Cogs Icons by <strong>Jiri Shilha</strong> - <a href='https://dribbble.com/shots/1631956-Settings-Icons-PSD'>view Dribbble Shot</a>" );
        $options_panel->Subtitle( __( "Javascript Libraries", '_sticky_' ) );
        $options_panel->Paragraph( "PACE.js - <a href='http://github.hubspot.com/pace/docs/welcome/'>visit website</a>" );
        $options_panel->Paragraph( "CodeMirror - <a href='http://codemirror.net/'>visit website</a>");
        $options_panel->Paragraph( "qTip - <a href='http://qtip1.com/'>visit website</a>");
        $options_panel->Paragraph( "AnySearch - <a href='http://jevnet.de/anysearch-js.html'>visit website</a>" );
        $options_panel->Paragraph( "Toastr - <a href='https://github.com/CodeSeven/toastr'>go to GitHub link</a>");
        $options_panel->Paragraph( "Labelauty - <a href='https://github.com/fntneves/jquery-labelauty'>go to GitHub link</a>");
        $options_panel->Paragraph( "SelectOrDie - <a href='https://github.com/vestman/Select-or-Die'>go to GitHub link</a>" );
        $options_panel->Paragraph( "SlimScroll - <a href='http://rocha.la/jQuery-slimScroll'>visit website</a>" );
        $options_panel->Subtitle( __( "Images", '_sticky_' ) );
        $options_panel->Paragraph( "Unsplash - <a href='http://unsplash.com/'>visit website</a>" );
        $options_panel->CloseDiv_Container();
        $options_panel->Title( __( "About", '_sticky_' ) );
        $options_panel->OpenDiv_Container();
        $options_panel->Subtitle( "<strong>Sticky Admin</strong> is designed, developed &amp; maintaned with passion and love for WordPress by <a class='about_me'>Dorian Tudorache</a>. All Rights Reserved. Additional coding help by <a class='about_flo'>Popa Florin</a>. All donations received for and via this plugin will be invested to make it better." );
        $options_panel->CloseDiv_Container();
    $options_panel->AccordionAEnd();
$options_panel->CloseTab();
/* Import / Export */
$options_panel->OpenTab( 's_devs' );
    $options_panel->h1( __( 'Developers', '_sticky_' ) );
    $options_panel->AccordionArea( 's_dev_acc' );
        $options_panel->Title( __( 'Custom Code', '_sticky_' ) );
        $options_panel->addCode( 'custom_css', array(
            'name'      => __( 'CSS', '_sticky_' ),
            'desc'      => __( 'Input your own CSS code to add / overwrite in the administration panel.', '_sticky_' ),
            'class'     => 'sticky_custom_css',
            'syntax'    => 'css',
            'theme'     => 'dark'
        ) );
        $options_panel->addCode( 'custom_js', array(
            'name'      => __( 'JavaScript', '_sticky_' ),
            'desc'      => __( 'Input your own Javascript code to add / overwrite in the administration panel. jQuery rules may be used.', '_sticky_' ),
            'class'     => 'sticky_custom_js',
            'syntax'    => 'js',
            'theme'     => 'dark'
        ) );
        $options_panel->Title( __( 'Additional Settings', '_sticky_' ) );
        $options_panel->addCheckbox( 's_minified_css' , array(
                'name'  => __( 'Run Minified CSS', '_sticky_' ),
                'desc'  => __( 'When this option is enabled, Sticky Admin plugin will run all the CSS files minified for faster loading times.', '_sticky_' ),
                'std'   => true
        ) ); 
        $options_panel->addCheckbox( 's_minified_js' , array(
                'name'  => __( 'Run Minified JS', '_sticky_' ),
                'desc'  => __( 'When this option is enabled, Sticky Admin plugin will run all the JS files minified for faster loading times.', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->addCheckbox( 's_cache_css' , array(
                'name'  => __( 'Concatenate &amp; Cache CSS', '_sticky_' ),
                'desc'  => __( 'Pages loading times are improved by over 65% when caching is activated.', '_sticky_' ),
                'std'   => true
        ) );
        $options_panel->Title( __( 'Plugin Icons', '_sticky_' ) );
        $options_panel->addImage( 's_favicon', array(
                    'name'  => __( 'FavIcon', '_sticky_' ),
                    'desc'  => __( '16px on 16px icon to represent the panel / website.', '_sticky_' ),
        ) );
        $options_panel->addImage( 's_phone_57', array(
                    'name'  => __( 'Apple iPhone Icon', '_sticky_' ),
                    'desc'  => __( '57px on 57px icon to represent the panel / website.', '_sticky_' ),
        ) );
        $options_panel->addImage( 's_phone_114', array(
                    'name'  => __( 'Apple iPhone Icon - @2x', '_sticky_' ),
                    'desc'  => __( '114px on 114px icon to represent the panel / website.', '_sticky_' ),
        ) );
        $options_panel->addImage( 's_tablet_72', array(
                    'name'  => __( 'Apple iPad Icon', '_sticky_' ),
                    'desc'  => __( '72px on 72px icon to represent the panel / website.', '_sticky_' ),
        ) );
        $options_panel->addImage( 's_tablet_144', array(
                    'name'  => __( 'Apple iPad Icon - @2x', '_sticky_' ),
                    'desc'  => __( '144px on 144px icon to represent the panel / website.', '_sticky_' ),
        ) );
    $options_panel->Title( __( "Import / Export Settings", '_sticky_' ) );
    $options_panel->addImportExport();
    $options_panel->AccordionAEnd();
$options_panel->CloseTab();
$options_panel->CloseDiv_container( '' );
