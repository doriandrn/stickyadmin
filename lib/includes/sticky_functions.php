<?php
// Avoid direct access to this piece of code
if ( !function_exists( 'add_action' ) )
    exit;

if ( !function_exists( 'sticky_addStyle' ) ) :
    /**
     *
     * addStyle function
     * - an easier way to enqueue styles using StickyAdmin
     *
     * @since v1.0
     * @author Dorian Tudorache
     * @param $hooks {array} - pages to load the script on,
     * @param $filename_no_ext {string} - file to load without an extension,
     * @param $minified {bool} - should add '.min'? before the extension,
     * @param $deps {array} - dependencies
     *
     */
    function sticky_addStyle( $hooks, $filename_no_ext, $has_rtl = NULL, $order = 1 ) {
        $style = trim ( $filename_no_ext ) ;
        $enqueue_string = '';
        if ( is_array ( $hooks ) )
            foreach ( $hooks as $hook ) {
                $hook = StickyAdmin::$config['default_pages_list'][$hook];
                $enqueue_string = 'wp_enqueue_style ( "' . $style . '", "' . STICKY_CSS . $style . '.css", "sticky-admin", "' . StickyAdmin::VERSION . '" );';
                // if ( function_exists('is_rtl') && is_rtl() && $has_rtl )
                    // $enqueue_string = 'wp_enqueue_style ( "' . $style . '", "' . STICKY_CSS . $style . '.rtl.css", "sticky-admin", "' . StickyAdmin::VERSION . '" );';
                add_action( 'admin_print_styles-' . $hook, ( create_function( '', $enqueue_string ) ), $order );
            }
        else {
            if ( $hooks != 'Login' && $hooks != 'all' ) {
                $hook = StickyAdmin::$config['default_pages_list'][$hooks];
                // if ( $GLOBALS['pagenow'] != $hook ) return;
                $enqueue_string = 'wp_enqueue_style ( "' . $style . '", "' . STICKY_CSS . $style . '.css", "sticky-admin", "' . StickyAdmin::VERSION . '" );';
                add_action( 'admin_print_styles-' . $hook, ( create_function( '', $enqueue_string ) ), $order );
            }
            elseif ( $hooks == 'Login' ) {
                echo "<link rel='stylesheet' href='". STICKY_CSS . $style .".css' type='text/css' ></link>";
            }
            elseif ( $hooks == 'all' ) {
                $enqueue_string = 'wp_enqueue_style ( "' . $style . '", "' . STICKY_CSS . $style . '.css", "sticky-admin", "' . StickyAdmin::VERSION . '" );';
                add_action( 'admin_print_styles', ( create_function( '', $enqueue_string ) ), $order );
            }
        }   
    }
endif;
if ( !function_exists( 'sticky_addScript' ) ) :
    /**
     *
     * addScript function
     * - an easier way to enqueue scripts using StickyAdmin
     * - runs in the stash, so we can create proper hooks for all pages
     *
     * @since v1.0
     * @author Dorian Tudorache
     * @param $hooks {array} - pages to load the script on,
     * @param $filename_no_ext {string} - file to load without an extension,
     * @param $minified {bool} - should add '.min'? before the extension,
     * @param $deps {array} - dependencies
     *
     */
    function sticky_addScript( $hooks, $filename_no_ext, $minified = FALSE, $deps = 'jquery' ) {
        $script = trim ( $filename_no_ext );
        $deps = array( $deps );
        $deps_string = '';
        $minified = StickyAdmin::$config['dev']['minified_js'];
        // Only do this if we have dependencies
        if ( ! empty( $deps ) ) {
            $deps_count = count( $deps );
            $i = $c = 0;
            $deps_string .= 'array(';
            foreach ( $deps as $dep ) {
                
                if ( ! is_array( $dep ) ) {
                    $deps_string .= '"' . $dep . '' . ( ( ++$i === $deps_count ) ? '"' : '",' ); 
                }
                else {
                    $sdepc = count( $dep );
                    foreach( $dep as $s_dep ) {
                        $deps_string .= '"' . $s_dep . '' . ( ( ++$c === $sdepc ) ? '"' : '",' ); 
                    }
                }
            }
            $deps_string .= ')';
            // print_r($deps_string);
        } else $deps_string = '""';
        if ( is_array( $hooks ))
            foreach ( $hooks as $hook ) {
                $hook = StickyAdmin::$config['default_pages_list'][$hook];
                $enqueue_string = 'wp_enqueue_script ( "' . $script . '", "' . STICKY_JS . $script . "" . ( ( $minified ) ? ".min" : "" ) . '.js", ' . $deps_string . ', "' . StickyAdmin::VERSION . '" );';
    
                add_action( 'admin_print_scripts-' . $hook, create_function( '', $enqueue_string ) );
            }
        else {
            if ( $hooks != 'all' && $hooks != 'Login' ) {
                $hook = StickyAdmin::$config['default_pages_list'][$hooks];
                $enqueue_string = 'wp_enqueue_script ( "' . $script . '", "' . STICKY_JS . $script . "" . ( ( $minified ) ? ".min" : "" ) . '.js", ' . $deps_string . ', "' . StickyAdmin::VERSION . '" );';
                add_action( 'admin_print_scripts-' . $hook, create_function( '', $enqueue_string ) );
            } elseif ( $hooks == 'Login' ) {
                echo "<script src='" . STICKY_JS . $script . "". ( ( $minified ) ? ".min" : "" ) . ".js' type='text/javascript'></script>";
            } elseif ( $hooks == 'all' ) {
                $enqueue_string = 'wp_enqueue_script ( "' . $script . '", "' . STICKY_JS . $script . "" . ( ( $minified ) ? ".min" : "" ) . '.js", ' . $deps_string . ', "' . StickyAdmin::VERSION . '" );';
                add_action( 'admin_enqueue_scripts', create_function( '', $enqueue_string ) );
            }
        }
    }
endif;
 
if ( !function_exists( 'minify_css' ) ) :   
    /**
     * CSS minifier function
     *
     * @since 1.0
     *
     */
    function minify_css( $string ) {
        $string = preg_replace( '!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $string );
        $string = str_replace( array( "\r\n", "\r", "\n", "\t", '  ', '    ', '     ' ), '', $string );
        $string = str_replace( ': ', ':', $string );
        $string = preg_replace( array( '(( )+{)', '({( )+)' ), '{', $string );
        $string = preg_replace( array( '(( )+})', '(}( )+)', '(;( )*})' ), '}', $string );
        $string = preg_replace( array( '(;( )+)', '(( )+;)' ), ';', $string );
        return $string;
    }
endif;

if ( !function_exists( 'hex2rgb' ) ) :
    /**
     * HEX to RGB converter
     *
     * @since 1.0
     * @return R,G,B
     *
     */
    function hex2rgb( $hex ) {
       $hex = str_replace( "#", "", $hex);
       if ( strlen( $hex ) == 3 ) {
          $r = hexdec(substr($hex,0,1).substr($hex,0,1));
          $g = hexdec(substr($hex,1,1).substr($hex,1,1));
          $b = hexdec(substr($hex,2,1).substr($hex,2,1));
       } else {
          $r = hexdec(substr($hex,0,2));
          $g = hexdec(substr($hex,2,2));
          $b = hexdec(substr($hex,4,2));
       }
       
       return $r . ',' . $g . ',' . $b;
    }
endif;

if ( !function_exists( 'rgb2hex' ) ) :
    /**
     * HEX to RGB converter
     *
     * @since 1.0
     * @return R,G,B
     *
     */
    function rgb2hex( $rgb ) {
       $rgb = explode( ',', $rgb );
       return '#' . sprintf('%02x', $rgb[0]) . sprintf('%02x', $rgb[1]) . sprintf('%02x', $rgb[2]);
    }
endif;

if ( !function_exists( 'rgb2hsv' ) ) :
    /**
     * RGB to hsv converter
     *
     */
    function rgb2hsv($rgb) {
        // Fill variables $r, $g, $b by array given.
        list($R, $G, $B) = $rgb;
        $R = ($R / 255);
        $G = ($G / 255);
        $B = ($B / 255);

        // Calculate a few basic values, the maximum value of R,G,B, the
        //   minimum value, and the difference of the two (chroma).
        $maxRGB = max($R, $G, $B);
        $minRGB = min($R, $G, $B);
        $chroma = $maxRGB - $minRGB;

        // Value (also called Brightness) is the easiest component to calculate,
        //   and is simply the highest value among the R,G,B components.
        // We multiply by 100 to turn the decimal into a readable percent value.
        $computedV = 100 * $maxRGB;

        // Special case if hueless (equal parts RGB make black, white, or grays)
        // Note that Hue is technically undefined when chroma is zero, as
        //   attempting to calculate it would cause division by zero (see
        //   below), so most applications simply substitute a Hue of zero.
        // Saturation will always be zero in this case, see below for details.
        if ($chroma == 0)
            return array(0, 0, $computedV);

        // Saturation is also simple to compute, and is simply the chroma
        //   over the Value (or Brightness)
        // Again, multiplied by 100 to get a percentage.
        $computedS = 100 * ($chroma / $maxRGB);

        // Calculate Hue component
        // Hue is calculated on the "chromacity plane", which is represented
        //   as a 2D hexagon, divided into six 60-degree sectors. We calculate
        //   the bisecting angle as a value 0 <= x < 6, that represents which
        //   portion of which sector the line falls on.
        if ($R == $minRGB)
            $h = 3 - (($G - $B) / $chroma);
        elseif ($B == $minRGB)
            $h = 1 - (($R - $G) / $chroma);
        else // $G == $minRGB
            $h = 5 - (($B - $R) / $chroma);

        // After we have the sector position, we multiply it by the size of
        //   each sector's arc (60 degrees) to obtain the angle in degrees.
        $computedH = 60 * $h;

        return array( round($computedH), round($computedS), round($computedV));
    }
endif;

if ( ! function_exists('sticky_compare_correct') ) :
    /**
     *
     * Compares two hex colors and if they are close in HUE range, it returns a diferrent, close-match color.
     *
     * @since 1.0
     * @return HEX for the new color
     * @author Dorian Tudorache
     *
     */
    function sticky_compare_correct( $color, $check_color, $range ) {

        // print_r("\n".'!!!! ' . $color . ' + ' . $check_color . ' => ' );

        $color = hex2hsv( $color );
        $check_color = hex2hsv( $check_color );

        $newrange = 0;
        $cdiff = abs( $color[0] - $check_color[0] );


        // print_r( 'CDIFF['.$color[0] .'-'. $check_color[0]. ']:' . $cdiff );

        if ( $cdiff >= 315 )
            $check_color[0] -= 90;

        if ( $cdiff <= 45 )
            $check_color[0] += 90;

        $check_color[0] = abs( $check_color[0] ) ; 

        // print_r( 'C1: ' . $color[0] . ' vs. C2: ' . $check_color[0] . ' = ' . $cdiff . "\n");

        if ( $cdiff >= ( 360 - $range ) )
            $newrange = $range;

        if ( $cdiff < $range ) 
            $newrange = $range + $cdiff;

        $check_color[0] = $check_color[0] + $newrange;

        if ( $check_color[0] > 360 ) $check_color[0] = abs( 360 - $check_color[0] );

        // print_r('dupa corectie: ' . $check_color[0] . '=>' . rgb2hex( implode( ',', hsv2rgb( $check_color ) ) ));
        return rgb2hex( implode( ',', hsv2rgb( $check_color ) ) );
    }

endif;


if ( !function_exists( 'hsv2rgb' ) ) :
    /**
     * HSV to RGB converter
     *
     * @since 1.0
     * @return array[R,G,B]
     *
     */
    function hsv2rgb($hsv) {
        // Fill variables $h, $s, $l by array given.
        list($h, $s, $v) = $hsv;

        $h /= 360;
        $s /= 100;
        $v /= 100;
 
        $h -= floor($h);

        if ($s == 0) {
            return array( $v * 255, $v * 255, $v * 255 );
        }

        $chroma = $v * $s;
        $h_ = $h * 6;
        $k = intval($h_);
        $h_mod2 = $k % 2 + $h_ - floor($h_);
        $x = $chroma * abs(1 - abs($h_mod2 - 1));
        $r = $g = $b = 0.0;
        switch ($k) {
            case 0: 
            case 6:
                $r = $chroma;
                $g = $x;
                break;
            case 1:
                $r = $x;
                $g = $chroma;
                break;
            case 2:
                $g = $chroma;
                $b = $x;
                break;
            case 3:
                $g = $x;
                $b = $chroma;
                break;
            case 4:
                $r = $x;
                $b = $chroma;
                break;
            case 5:
                $r = $chroma;
                $b = $x;
                break;
        }
        $m = $v - $chroma;
        $r = round((($r + $m) * 255));
        $g = round((($g + $m) * 255));
        $b = round((($b + $m) * 255));
        return array($r, $g, $b);
    }
endif;

if ( !function_exists( 'sticky_make_hl_color' ) ) :
    /**
     * Sticky Make Highlight Color
     *
     * @since 1.0
     * @return #HEX
     * @author Dorian Tudorache
     *
     */
    function sticky_make_hl_color( $hex, $dif = 0 ) {
        // This is only used once when generating the principal HL color.
        // if ( $dif == 0 && sticky_luminance(StickyAdmin::$content_background) == sticky_luminance($hex) ) 
            // sticky_options_updater( 'highlight_color', sticky_adjust_hl_color($hex, 0) );
        
        return sticky_adjust_hl_color( $hex, $dif, 0, 0, 1 );
    }
endif;

if ( !function_exists( 'sticky_drop_flags' ) ) :
    /**
     * Deletes transients, runs at the end of stash
     *
     * @since 1.0
     * @return #HEX
     * @author Dorian Tudorache
     *
     */
    function sticky_drop_flags() {
        delete_transient( get_current_blog_id() . '_sticky-changes' );
    }
endif;

if ( !function_exists( 'sticky_adjust_hl_color' ) ) :
    /**
     * Adjust a color by increasing or decreasing any of the HSV parameters.
     *
     * @since 1.0
     * @return #HEX
     * @author Dorian Tudorache
     *
     */
    function sticky_adjust_hl_color( $hex, $h = 0, $s = 0, $v = 0, $auto = false, $setting = 'content' ) {
        $get_color = hex2hsv( $hex );
    
        $get_color[0] = $get_color[0] + $h;
        $get_color[1] = $get_color[1] + $s;
        $get_color[2] = $get_color[2] + $v;
        
        if ( $get_color[0] >= 360 ) $get_color[0] = abs( $get_color[0] - 360 );
        if ( $get_color[0] < 0 ) $get_color[0] = abs( 360 + $get_color[0] );

        $get_color[1] = ( $get_color[1] >= 100 ) ? 100 : $get_color[1];
        $get_color[2] = ( $get_color[2] >= 100 ) ? 100 : $get_color[2];

        $get_color[1] = ( $get_color[1] <= 0 ) ? 0 : $get_color[1];
        $get_color[2] = ( $get_color[2] <= 0 ) ? 0 : $get_color[2];

        if ( $auto ) {
            $selector = StickyAdmin::$config['colors'][$setting]['bg'];
            if ( ! $selector ) 
                return rgb2hex( implode( ',', hsv2rgb( $get_color ) ) );

            $hl_color_hsv = hex2hsv( $selector );
            $hue_diff = abs( $get_color[0] - $hl_color_hsv[0] );
       
            if ( $hue_diff < 45 ) {
                $get_color[0] = ( abs( $get_color[0] ) > 180 ) ? abs( $get_color[0] - 45 ) : abs( $get_color[0] + 45 );
            }

            // Color might look wrong if it's too far away from the bg color hue
            if ( $hue_diff > 100 && $hue_diff < 180 ) {
                $get_color[0] = ( abs( $get_color[0] ) <= 180 ) ? abs( $get_color[0] + 90 ) : abs( $get_color[0] - 90 ); // Adjust by decreasing it by 80
            }

            if ( $hue_diff >= 180 ) {
                $get_color[0] = ( abs( $get_color[0] ) <= 180 ) ? abs( $get_color[0] + 90 ) : abs( $get_color[0] - 90 ); // Adjust by decreasing it by 80
            }

            if ( $get_color[0] <= 0 || $get_color[0] >= 360 ) 
                $get_color[0] = abs( 360 - abs( $get_color[0] ) );

            if ( ! sticky_luminance( $selector ) ) {
                $get_color[1] = 95; 
                $get_color[2] = 85;
            }
            else {
                $get_color[1] = 75;
                $get_color[2] = 80; 
            } 
        }
        return rgb2hex( implode( ',', hsv2rgb( $get_color ) ) );
    }
endif;

if ( !function_exists( 'hex2hsv' ) ) :
    function hex2hsv( $hex ) {
        return rgb2hsv( explode( ',', hex2rgb( $hex ) ) );
    }
endif;

if ( !function_exists( 'sticky_luminance' ) ) :
    /**
     * Get the Luminance Level of a hexcolor and determine 
     * what color to use over that as a foregrand, 
     * for best contrast results.
     *
     * @param $hexcolor {string} - the color
     * @return TRUE if black, FALSE if white.
     *
     */
    function sticky_luminance( $hexcolor ) {
        $rgb = explode( ',', hex2rgb( str_replace( '#', '', $hexcolor ) ) );
        if ( ( ( $rgb[0] * 299 ) + ( $rgb[1] * 587 ) + ( $rgb[2] * 114 ) ) / 255000 >= 0.5 ) 
            return true;
        return false;
    }
endif;
if ( !function_exists( 'sticky_options_updater' ) ) :
    /**
     *
     * Updates an option in the options panel.
     *
     * @since 1.0
     * @author Popa Florin
     *
     */
    function sticky_options_updater($key, $value) {
        global $grab_data;
        $t_sticky_opt = get_option( 'sticky_options' );

        if ( empty( $t_sticky_opt ) )
            return;

        if ( array_key_exists ($key, $t_sticky_opt) && $t_sticky_opt[ $key ] !== $value) {
            delete_option( 'sticky_options' );
            $t_sticky_opt[ $key ] = $value;
            $grab_data[ $key ] = $value;
            update_option( 'sticky_options', $t_sticky_opt);
        }
    }
endif;

if ( !function_exists( 'sticky_has_changed' ) ) :
    /**
     *
     * Anything Has Changed function
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    function sticky_has_changed( $blogid = 1 ) {
        if ( get_transient( $blogid . '_sticky-changes' ) )
            return true;
        return false;
    }
endif;

if ( !function_exists( 'sticky_get_delta' ) ) :
    /**
     *
     * Gets the delta value of one of the statistics parameters
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    function sticky_get_delta( $delta_name ) {

        $delta = StickyAdmin::$config['statistics'][ $delta_name ];

        return $delta;
    }
endif;


if ( !function_exists( 'sticky_delta_class' ) ) :
    /**
     *
     * Adds a class for reference to the delta container
     *
     * @since 1.0
     * @author Dorian Tudorache
     *
     */
    function sticky_delta_class( $delta_name ) {
        $delta = StickyAdmin::$config['statistics'][ $delta_name ];

        if ( $delta > 100 ) {
            $class = 'rises';
        } else if ( $delta == 0 ) {
            $class = 'no-change';
        } else {
            $class = 'falls';
        }
        
        return $class;
    }
endif;

if ( !function_exists( 'sticky_stats_display' ) ) :
    /**
     *
     * Statistics on Dashboard
     *
     * @since 1.0
     * @author Igor Buyanov
     * @code_adapt Dorian Tudorache
     *
     */
    function sticky_stats_display() {
        if ( ! current_user_can( 'wp_sticky_stats_view' ) ) 
            return;

        if ( ! empty( StickyAdmin::$config['statistics']['visits'] ) || ! empty( StickyAdmin::$config['statistics']['country_data'] ) ) {
            
            echo '<div class="instats">
                <div class="visits">
                    <strong>' . __( 'Visits', '_sticky_' ) . '</strong>
                    <ul>
                        <li><div>' . __( 'Today', '_sticky_' ) . '</div><strong>' . ( ! empty( StickyAdmin::$config['statistics']['today_visits'][0] ) ? StickyAdmin::$config['statistics']['today_visits'][0] : 0 ) . '</strong><span class="delta ' . sticky_delta_class( 'day_visits_delta' ) . '">' . sticky_get_delta( 'day_visits_delta' ) . '</span></li>
                        <li><div>' . __( 'This week', '_sticky_' ) . '</div><strong>' . ( ! empty( StickyAdmin::$config['statistics']['this_week_visits'][0] ) ? StickyAdmin::$config['statistics']['this_week_visits'][0] : 0 ) . '</strong><span class="delta ' . sticky_delta_class( 'week_visits_delta' ) . '">' . sticky_get_delta( 'week_visits_delta' ) . '</span></li>
                        <li><div>' . __( 'This month', '_sticky_' ) . '</div><strong>' . ( ! empty( StickyAdmin::$config['statistics']['this_month_visits'][0] ) ? StickyAdmin::$config['statistics']['this_month_visits'][0] : 0 ) . '</strong><span class="delta ' . sticky_delta_class( 'month_visits_delta' ) . '">' . sticky_get_delta( 'month_visits_delta' ) . '</span></li>
                    </ul>
                    <ul class="hide">
                        <li><div>' . __( 'Yesterday', '_sticky_' ) . '</div><strong>' . ( ! empty( StickyAdmin::$config['statistics']['yesterday_visits'][0] ) ? StickyAdmin::$config['statistics']['yesterday_visits'][0] : 0 ) . '</strong></li>
                        <li><div>' . __( 'Last week', '_sticky_' ) . '</div><strong>' . ( ! empty( StickyAdmin::$config['statistics']['last_week_visits'][0] ) ? StickyAdmin::$config['statistics']['last_week_visits'][0] : 0 ) . '</strong></li>
                        <li><div>' . __( 'Last month', '_sticky_' ) . '</div><strong>' . ( ! empty( StickyAdmin::$config['statistics']['last_month_visits'][0] ) ? StickyAdmin::$config['statistics']['last_month_visits'][0] : 0 ) . '</strong></li>
                    </ul>
                </div>

                <div class="pageviews">
                    <strong>' . __( 'Pageviews', '_sticky_' ) . '</strong>
                    <ul>
                        <li><div>' . __( 'Today', '_sticky_' ) . '</div><strong>' . ( ! empty( StickyAdmin::$config['statistics']['today_pv'][0] ) ? StickyAdmin::$config['statistics']['today_pv'][0] : 0 ) . '</strong><span class="delta ' . sticky_delta_class( 'day_pvs_delta' ) . '">' . sticky_get_delta( 'day_pvs_delta' ) . '</span></li>
                        <li><div>' . __( 'This week', '_sticky_' ) . '</div><strong>' . ( ! empty( StickyAdmin::$config['statistics']['this_week_pv'][0] ) ? StickyAdmin::$config['statistics']['this_week_pv'][0] : 0 ) . '</strong><span class="delta ' . sticky_delta_class( 'week_pvs_delta' ) . '">' . sticky_get_delta( 'week_pvs_delta' ) . '</span></li>
                        <li><div>' . __( 'This month', '_sticky_' ) . '</div><strong>' . ( ! empty( StickyAdmin::$config['statistics']['this_month_pv'][0] ) ? StickyAdmin::$config['statistics']['this_month_pv'][0] : 0 ) . '</strong><span class="delta ' . sticky_delta_class( 'month_pvs_delta' ) . '">' . sticky_get_delta( 'month_pvs_delta' ) . '</span></li>
                    </ul>
                    <ul class="hide">
                        <li><div>' . __( 'Yesterday', '_sticky_' ) . '</div><strong>' . ( ! empty( StickyAdmin::$config['statistics']['yesterday_pv'][0] ) ? StickyAdmin::$config['statistics']['yesterday_pv'][0] : 0 ) . '</strong></li>
                        <li><div>' . __( 'Last week', '_sticky_' ) . '</div><strong>' . ( ! empty( StickyAdmin::$config['statistics']['last_week_pv'][0] ) ? StickyAdmin::$config['statistics']['last_week_pv'][0] : 0 ) . '</strong></li>
                        <li><div>' . __( 'Last month', '_sticky_' ) . '</div><strong>' . ( ! empty( StickyAdmin::$config['statistics']['last_month_pv'][0] ) ? StickyAdmin::$config['statistics']['last_month_pv'][0] : 0 ) . '</strong></li>
                    </ul>
                </div>
            </div>';

            echo '<div id="dash_slick">
                    <div>
                        <h3>' . __( 'Site Statistics', '_sticky_') . '</h3>
                        <select id="s_chart_type">
                            <option id="daily">' . __('Daily','_sticky_') . '</option>
                            <option id="weekly">' . __('Weekly','_sticky_') . '</option>
                            <option id="monthly">' . __('Monthly','_sticky_') . '</option>
                            <option id="yearly">' . __('Yearly','_sticky_') . '</option>
                        </select>
                        <div id="chart_div" style="width: 100%; height: 260px;"></div>
                    </div>
                    <div>
                        <h3>' . __( 'Hot Locations', '_sticky_') . '</h3>
                        <div id="map_canvas" style=" height: 260px; width: 100%; text-align: center; margin: auto;"></div>
                    </div>
                    <div class="overview">
                        <h3>' . __( 'Traffic Overview', '_sticky_') . '</h3>
                        <div>
                            <h5>'. __( 'Devices', '_sticky_' ) .'</h5>
                            <div id="p1_devices"></div>
                        </div>
                        <div>
                            <h5>'. __( 'Operating Systems', '_sticky_' ) .'</h5>
                            <div id="p2_oss"></div>
                        </div>
                        <div>
                            <h5>'. __( 'Traffic Sources', '_sticky_' ) .'</h5>
                            <div id="p3_sources"></div>
                        </div>
                        <div>
                            <h5>'. __( 'Browsers', '_sticky_' ) .'</h5>
                            <div id="p4_browsers"></div>
                        </div>
                    </div>
                    <div class="linkslist">
                        <h3>' . __( 'Top hits', '_sticky_') . '</h3>
                        <div class="slidethis">
                        <div class="ot">
                            <div class="ot_inside">
                                <strong>' . __( 'Top Posts', '_sticky_' ) . '</strong>
                                <ul class="top_posts">' . "\n";
            foreach ( StickyAdmin::$config['statistics']['top_posts'] as $post ) {
                echo '                              <li class="link"><a href="' . get_permalink( $post[ 'post_id' ] ) . '" target="_blank">' . $post['title'] . '</a></li>' . "\n";
            }
            echo '                          </ul>
                            </div>
                        </div>
                        <div class="ot">
                            <div class="ot_inside">
                                <strong>' . __( 'Top Links', '_sticky_' ) . '</strong>
                                <ul class="top_links">' . "\n";
            foreach ( StickyAdmin::$config['statistics']['top_links'] as $link ) {
                echo '                              <li class="link"><a href="' . $link['referer'] . '" target="_blank">' . $link['referer'] . '</a></li>' . "\n";
            }
            echo '                          </ul>
                            </div>
                        </div>
                        <div class="ot">
                            <div class="ot_inside">
                                <strong>' . __( 'Top Search Terms', '_sticky_' ) . '</strong>
                                <ul class="top_searches">' . "\n";
            foreach ( StickyAdmin::$config['statistics']['top_searches'] as $search ) {
                echo '                              <li class="link">' . $search['term'] . '</a></li>' . "\n";
            }
            echo '                          </ul>
                            </div>
                        </div>
                        </div>
                    </div>
                 </div>';
        } else {
            echo '<div id="sticky_notice"><p>' . __( 'Please allow the statistics screen up to 30 minutes to gather elemental data in order for it to show up. Unfortunately, the statistics panel IS NOT AVAILABLE for localhost installations at this time.', '_sticky_' ) . '</p></div>';
        }
    }
endif;