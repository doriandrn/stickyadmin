=== StickyAdmin ===
Contributors: dorian.tudorache
Donate link: http://bit.ly/1St79Tr
Tags: sticky, admin, wp-admin, theme, skin, backend, interface, ui, ux, panel, login, custom, statistics, stats, dashboard, stickyadmin, improved, better, functionality
Requires at least: 4.2
Tested up to: 4.4
Stable tag: 4.4
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Fresh, modern, native WordPress Admin Interface designed & developed with compatibility in mind.

== Description ==

StickyAdmin is a **highly customizable User Interface** designed to give WordPress a better look and improved functionality. It’s modern design and the ability to change the colours make it a perfect match for any WordPress theme. 

The interface was entirely developed with compatibility in mind, permitting it to be expanded and easily adapted to other plugins or themes. Crafted for mobiles, tablets and desktops.

= Features =

* (Optional) Fully fledged (built-in) Statistics Panel & Tracker; 
* Lightweight. Fast. Optimised. Runs almost as fast as WordPress does.
* Responsive, mobile-first layout;
* Retina & HiDPI (everything is a vector);
* Pixel-Perfect User Interface;
* Reorder menu items using drag & drop;
* Change UI icons on the go (triggers on right / middle click);
* Over 2000 icons (Streamline icon set) to choose from;
* Use your custom logo in any image format including .svg;
* Minimize / close the admin bar;
* Over 25 pre-made themes;
* Toastr notifications;
* qTip tooltips;
* Search on type, AJAXified live search;
* Customizable color schemes;
* Customize ‘Howdy' message;
* Change copyright footer text;
* Custom CSS and Javascript
* Support for favicons, smartphone & tablet app icons;
* 99% compatibility with themes & plugins;
* bbPress, buddyPress, MultiSite, WPML, WPMU support;
* RTL version

= Requirements =

* PHP 5.3+ (recommended PHP 7.0+)
* JavaScript (the no-js version is still under development)
* WordPress - check for required version in the sidebar
* Modern Browsers

== Contribute ==

StickyAdmin started as a simple project about two years ago and recently I came to the conclusion that it'd be impossible for only one individual to get it done the right way, so hereby I request everyone's help to get involved in developing a better yet compatbile interface for the admin side of WordPress.

Developers of all levels can help!

Like WordPress itself, StickyAdmin is and will remain open-source. You can test planned improvements, check out the code, file and view bug reports, and even submit your own patches. The community’s contributions are what make WordPress and StickyAdmin so strong.

Most software projects, including WordPress, use a version-control system to keep track of source code and revisions. 

StickyAdmin is available on GitHub, all development process happens over here:
https://github.com/doriandrn/stickyadmin

Start with creating your branch and submitting your patches!


== Installation ==

The easiest way to install StickyAdmin is via your site’s Dashboard. 
Please follow these instructions:

1. Log in to your site’s Dashboard (e.g. www.yourgroovydomain.com/wp-admin)
2. Click on the “Plugins” tab in the left panel, then click “Add New”.
3. Search for “StickyAdmin” and the latest version will appear at the top of the list of results.
4. Install it by clicking the “Install Now” link.
5. When installation finishes, click “Activate Plugin”.

You’re done!

= Manual Install: =

1. Upload stickyadmin to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress

If you're having troubles with the installation process please don't hesitate to open up a new support topic by navigating to the Support tab here. 

== Frequently Asked Questions ==

= Why is it so buggy? Is this a finished project even? =
The reason StickyAdmin is Open-Source is to make it better in every aspect and get rid of any possible bugs. Unfortunately, being a uberly large interface, there are uncountable edge-cases which I could not replicate or simply missed them. Your feedback is essential for me and anyone investing their time and knowledge in making StickyAdmin a better UI, so please take your time to communicate with us, the crew is devoted to make it pixel-perfect and fully functioning. 

== Screenshots ==

Coming soon.

== Changelog ==

= 1.0.7 =
Jan 14th, 2015

Improvements:

* Plugin localisation + Romanian language file
* Better Media section - final version to come in v1.1

BugFixes:

* Freewall js was not loading on media library page;
* Fixed broken scripts behaviour in media library;
* Fixed postboxes container width bug on 'Edit Posts' & 'Edit Pages' pages;


= 1.0.6 =
Dec 29th, 2015

Improvements:

* AJAXified the control panel;
* Added a 'Reset options' button in the panel;
* Further optimised PHP code;
* Improved color matches algorithms;
* Better caching of files; 
* 100% compatibility with PHP 7.0+
* Added GruntJS for minifications and compilations;
* All files run now minified, better page loading speeds.

BugFixes:

* The logo no longer overfloats the adminmenu;
* Fixed a bug where clicking the header would have brough up empty screen options panel;
* Icon for WP Logo Menu (in adminbar) can no longer be changed. There is an option to disable it in the panel;
* Fixed alignment for Bulk Actions buttons;
* Fixed missing styles for filesystem dialogs;
* Fixed a bug where inactive plugins names were getting colored;
* Fixed a bug where the title on dashboard was not getting replaced;
* Fixed a bug where the view-switch in the header was not working properly on some pages;
* Fixed plugins background on add new plugins page.


= 1.0.5 =
Dec 21st, 2015

Improvements:

* Screen Options button removed, screen options panel moved to header on click.
* Tooltips are now even more visible;

BugFixes:

* Searchbar now works properly;
* Selects were showing wrong when out of screen, now they no longer have this behavious;
* Major fixes brought to the header;
* Labels are now bolder;
* Menu Toggle button now adjusts well with the header on mobile screens;

= 1.0.4 =
Dec 18th, 2015

Improvements:

* Page Title Action buttons are now more "pushy".

BugFixes:

* Broken comments tab on dashboard activity widget;
* Sticky action buttons now resize well with the header;
* Fixed design glitches on comments-php page;
* Fixed mobile adminmenu background issue;
* Collapse menu button adjusts position with menu;
* UI glitches & bugfixes on all pages;

= 1.0.3 =
Dec 15th, 2015

* Fixed incorrect triggering of failsafe;
* WPAdminBar bugfixes;
* Major universal UI improvements;


= 1.0.2 =
Dec 13th, 2015

* Windows Server support - DIRECTORY_SEPARATOR no longer used for paths;
* Plugins List default colors fix;
* Added the backgrounds back to forms;
* Various UI improvements and bugfixes;
* Fixed broken update-core.php due to JS;
* Unticking 'Display Footer' now works properly;
* Reworked a few of the Sticky Admin panel elements.

= 1.0.1 = 
Dec 12th, 2015

* Added a fallback for DIRECTORY_SEPARATOR as it might be empty on some installs;
* Bugfixes for notifications on login page;
* Header not shrinking issue fixed;

= 1.0.0 = 
Dec 10th, 2015

* Initial Release.