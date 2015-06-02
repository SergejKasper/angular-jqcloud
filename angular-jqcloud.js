/*!
 * Angular jQCloud
 * For jQCloud 2 (https://github.com/mistic100/jQCloud)
 * Copyright 2014 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

angular.module('angular-jqcloud', []).directive('jqcloud', ['$parse', function($parse) {
  // get existing options
  var defaults = jQuery.fn.jQCloud.defaults.get(),
      jqcOptions = [];

  for (var opt in defaults) {
    if (defaults.hasOwnProperty(opt)) {
      jqcOptions.push(opt);
    }
  }

  return {
    restrict: 'E',
    template: '<div></div>',
    replace: true,
    require: '?ngModel',
    scope: {
      onWordSelected: '&',
      words: '=words'
    },
    link: function($scope, $elem, $attr) {
      var options = {};

      for (var i=0, l=jqcOptions.length; i<l; i++) {
        var opt = jqcOptions[i];
        if ($attr[opt] !== undefined) {
          options[opt] = $parse($attr[opt])();
        }
      }
      options.autoResize = true;
      $elem.jQCloud($scope.words, options);
      $scope.$watchCollection('words', function() {
        $scope.$evalAsync(function() {
          var words = [];
          $.extend(words,$scope.words);
          $elem.jQCloud('update', words);
          if($elem.attr("on-word-selected")) $elem.find("span a").bind("click", function(e, i) {
              //a.preventDefault();
              var $e = angular.element(e.target);
              var sel = $e.hasClass("selected");

              $elem.find("span a").removeClass("selected");
              if(!sel)$e.addClass("selected");

              $scope.onWordSelected({
                  selected: e.target.text
              });
          });
        });
      });
      $elem.bind('$destroy', function() {
        $elem.jQCloud('destroy');
      });
    }
  };
}]);
