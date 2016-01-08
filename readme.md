# Sticky Admin

[![License](https://poser.pugx.org/automattic/jetpack/license.svg)](http://www.gnu.org/licenses/gpl-2.0.html) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

[StickyAdmin WordPress Plugin](https://wordpress.org/plugins/stickyadmin/)

Welcome to StickyAdmin repository on GitHub. This is the place to keep track of development, look at open issues and browse through the source code.

<!-- ## Documentation ( hidden till the website gets built )
* [StickyAdmin Documentation](http://stickyadmin.net/documentation/) -->

## Support
GitHub is for _bug reports and contributions only_.
This repository is not suitable for support. 
Please don't use our issue tracker for support requests, but for core StickyAdmin issues only. For that, use the [wordpress.org plugin support](https://wordpress.org/support/plugin/stickyadmin) which is available for all plugin's users.
Support requests in _issues_ on this repository will be immediately removed.

## Contributing to StickyAdmin
If you have an idea for the plugin, a patch or stumbled upon an issue with the core, you can contribute this back to the code. Please read our [contributors guidelines](https://github.com/doriandrn/stickyadmin/blob/master/contribute.md) for more information on how to do this.

## Developers Quick Installation & Usage Guide
* Open up a new Terminal / Command Prompt window.
* Change your working directory to WP/wp-content/plugins/ :
`cd pathtoWP/wp-content/plugins`
Tip: Find your current working directory by typing in: `pwd` (Linux, OSX) or `cwd` (Windows)
* Install StickyAdmin plugin from within this repository with just 1 line (requires git-cli): 
`git clone https://github.com/doriandrn/stickyadmin.git stickyadmin`
* Change current working directory to stickyadmin:
`cd stickyadmin`
* If you've made any changes to the CSS or JS type in:
`grunt compile`
This will also check your code for errors.
* Send in the code you've modified by submitting a pull request:
`git push origin nightly`
Please notice the [nightly branch](https://github.com/doriandrn/stickyadmin/tree/nightly) where all the development is going on for both WordPress and the nightly builds of WordPress.