/*
 * This file can be included into a Jenkins box through the
 * https://wiki.jenkins-ci.org/display/JENKINS/Simple+Theme+Plugin at the URL
 * https://raw.github.com/blacklocus/jquery-impression/master/include/jenkins.js
 *
 * See commented code for functionality.
 */

(function ($) {
  $.getScript("https://raw.github.com/blacklocus/jquery-impression/master/jquery.impression.min.js", function () {
    $('form[name=parameters] input').impression();
  });
})(jQuery);

