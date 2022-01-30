// Read a page's GET URL variables and return them as an associative array.
function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

// Add a extend pseudo function. CSS Match text.
$.expr[':'].textEquals = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().match("^" + arg + "$");
    };
});

// WooCommerce Metadata Value Helper
// Get metadata value by metadata key name
function getMetadataValue(fieldName) {
  data.meta_data.forEach(function(element) {
    if (element.key == fieldName) {
      return element.value;
    }
  });
}
