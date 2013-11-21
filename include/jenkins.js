/*
 * This file can be included into a Jenkins box through the
 * https://wiki.jenkins-ci.org/display/JENKINS/Simple+Theme+Plugin at the URL
 * https://raw.github.com/blacklocus/jquery-impression/master/include/jenkins.js
 *
 * See commented code for functionality.
 */

(function ($) {
  /* remember last inputs on parameterized builds */
  $('<script type="text/javascript" src="https://raw.github.com/blacklocus/jquery-impression/master/jquery.impression.min.js"></script>').appendTo('body');
  setTimeout(function() {
    $('form[name=parameters]').impression();
  }, 1);
})(jQuery);

