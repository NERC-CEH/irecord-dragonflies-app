<?php

/**
 * @file
 * Default theme implementation to display the basic html structure of a single
 * Drupal page.
 *
 * Variables:
 * - $css: An array of CSS files for the current page.
 * - $language: (object) The language the site is being displayed in.
 *   $language->language contains its textual representation.
 *   $language->dir contains the language direction. It will either be 'ltr' or 'rtl'.
 * - $rdf_namespaces: All the RDF namespace prefixes used in the HTML document.
 * - $grddl_profile: A GRDDL profile allowing agents to extract the RDF data.
 * - $head_title: A modified version of the page title, for use in the TITLE
 *   tag.
 * - $head_title_array: (array) An associative array containing the string parts
 *   that were used to generate the $head_title variable, already prepared to be
 *   output as TITLE tag. The key/value pairs may contain one or more of the
 *   following, depending on conditions:
 *   - title: The title of the current page, if any.
 *   - name: The name of the site.
 *   - slogan: The slogan of the site, if any, and if there is no title.
 * - $head: Markup for the HEAD section (including meta tags, keyword tags, and
 *   so on).
 * - $styles: Style tags necessary to import all CSS files for the page.
 * - $scripts: Script tags necessary to load the JavaScript files and settings
 *   for the page.
 * - $page_top: Initial markup from any modules that have altered the
 *   page. This variable should always be output first, before all other dynamic
 *   content.
 * - $page: The rendered page content.
 * - $page_bottom: Final closing markup from any modules that have altered the
 *   page. This variable should always be output last, after all other dynamic
 *   content.
 * - $classes String of classes that can be used to style contextually through
 *   CSS.
 *
 * @see template_preprocess()
 * @see template_preprocess_html()
 * @see template_process()
 */

// Get settings to pass to JavaScript
$start_path = base_path() . mobile_jquery_theme_get_setting('app_home');
// Get path to JavaScript
$theme_path = base_path() . $GLOBALS['theme_path'];
$iform_mobile_path = 'sites/all/modules/iform_mobile/';
?>

<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no" />
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">

  <!-- ICONS -->
  <link rel="shortcut icon" type="image/vnd.microsoft.icon" href="<?php echo $theme_path ?>/images/favicon.ico">
  <link rel="shortcut icon" sizes="192x192" href="<?php echo $theme_path ?>/images/android/192.png">
  <link rel="apple-touch-icon" href="<?php echo $theme_path ?>/images/ios/AppIcon60x60.png">
  <link rel="apple-touch-icon" sizes="76x76" href="<?php echo $theme_path ?>/images/ios/AppIcon76x76.png">
  <link rel="apple-touch-icon" sizes="120x120" href="<?php echo $theme_path ?>/images/ios/AppIcon120x120.png">
  <link rel="apple-touch-icon" sizes="152x152" href="<?php echo $theme_path ?>/images/ios/AppIcon152x152.png">
  <link rel="apple-touch-startup-image" href="<?php echo $theme_path ?>/images/ios/startup.png">

  <!-- CSS -->
  <?php print $styles; ?>

  <!-- JavaScript -->
  <?php
   // drupal_add_js(base_path() . "sites/all/modules/iform/media/js/mobile/libs/jquery.mobile.router.js");
   // print drupal_get_js();
    print $scripts;
  ?>

  <!-- APP libs-->
  <script type="text/javascript"
          src="<?php echo base_path() . $iform_mobile_path; ?>js/libs/fastclick.js"></script>
  <script type="text/javascript"
          src="<?php echo base_path() . $iform_mobile_path; ?>js/libs/latlon/vector3d.js"></script>
  <script type="text/javascript"
          src="<?php echo base_path() . $iform_mobile_path; ?>js/libs/latlon/geo.js"></script>
  <script type="text/javascript"
          src="<?php echo base_path() . $iform_mobile_path; ?>js/libs/latlon/latlon-ellipsoid.js"></script>
  <script type="text/javascript"
          src="<?php echo base_path() . $iform_mobile_path; ?>js/libs/latlon/osgridref.js"></script>
  <script type="text/javascript"
          src="<?php echo base_path() . $iform_mobile_path; ?>js/libs/photoswipe-3.0.4/klass.min.js"></script>
  <link type="text/css"
        href="<?php echo base_path() . $iform_mobile_path; ?>js/libs/photoswipe-3.0.4/photoswipe.css" rel="stylesheet" />
  <script type="text/javascript"
          src="<?php echo base_path() . $iform_mobile_path; ?>js/libs/photoswipe-3.0.4/code.photoswipe.jquery-3.0.4.min.js"></script>
  <script type="text/javascript"
          src="<?php echo base_path() . $iform_mobile_path; ?>js/libs/handlebars.js"></script>

  <script type="text/javascript"
          src="<?php echo base_path() . $iform_mobile_path; ?>js/app.js"></script>
  <script type="text/javascript"
          src="<?php echo base_path() . $iform_mobile_path; ?>js/helper.js"></script>
  <script type="text/javascript"
          src="<?php echo base_path() . $iform_mobile_path; ?>js/appcache_back_button_fix.js"></script>
  <script type="text/javascript"
          src="<?php echo base_path() . $iform_mobile_path; ?>js/form.js"></script>
  <script type="text/javascript"
          src="<?php echo base_path() . $iform_mobile_path; ?>js/io.js"></script>
  <script type="text/javascript"
          src="<?php echo base_path() . $iform_mobile_path; ?>js/storage.js"></script>
  <script type="text/javascript"
          src="<?php echo base_path() . $iform_mobile_path; ?>js/geoloc.js"></script>
  <script type="text/javascript"
          src="<?php echo base_path() . $iform_mobile_path; ?>js/navigation.js"></script>
  <script type="text/javascript"
          src="<?php echo base_path() . $iform_mobile_path; ?>js/image.js"></script>

  <!-- APP specific scripts -->
  <script type="text/javascript" src="<?php echo $theme_path?>/scripts/controllers/sref.js"></script>
  <script type="text/javascript" src="<?php echo $theme_path?>/scripts/controllers/record.js"></script>
  <script type="text/javascript" src="<?php echo $theme_path?>/scripts/controllers/user.js"></script>
  <script type="text/javascript" src="<?php echo $theme_path?>/scripts/controllers/login.js"></script>
  <script type="text/javascript" src="<?php echo $theme_path?>/scripts/controllers/list.js"></script>
  <script type="text/javascript" src="<?php echo $theme_path?>/scripts/controllers/list.prob.js"></script>
  <script type="text/javascript" src="<?php echo $theme_path?>/scripts/controllers/species.js"></script>

  <script type="text/javascript" src="<?php echo $theme_path?>/scripts/conf.js"></script>
  <script type="text/javascript" src="<?php echo $theme_path?>/scripts/dragonfly.js"></script>

</head>
<body class="<?php print $classes; ?>" <?php print $attributes; ?>>
<?php print $page_top; ?>
<?php print $page; ?>
<?php print $page_bottom; ?>
</body>
</html>
