/*
 * Defaults
 * Changes user's autofill settings for the page and stores it.
 */
function loadDefaults(n=0) {
  /*
  * Orientation
  * Values: 1 <Straight>, 11 <Gay>, 21 <Lesbian>, 31 <Bisexual Male>, 41 <Transgender>
  */
  jQuery(`#dropDownColumn_0_${n} .uploadFormTitle`).append(`<a id="save-default-orientation" style="color:#ff0000;font-size:12px;float:right;">Save default</a>`);
  // Select default on page load.
  var defaultOrientationId = localStorage.getItem('default_orientation');
  if (defaultOrientationId) {
    jQuery(`li[data-orientation-id="${defaultOrientationId}"]`).click();
  }
  jQuery('#save-default-orientation').click(function(){
    var orientation = jQuery(`#dropDownTitle_0_${n}`).text().trim();
    var orientationId;
    switch(orientation) {
      case "Straight":
      orientationId = 1;
      break;
      case "Gay":
      orientationId = 11;
      break;
      case "Lesbian":
      orientationId = 21;
      break;
      case "Bisexual Male":
      orientationId = 31;
      break;
      case "Transexual":
      orientationId = 41;
      break;
    }
    saveDefault("orientation", orientation);
  });

  /*
   * Choose a Production
   * Values: professional, homemade
   */
  jQuery(`#dropDownColumn_2_${n} .uploadFormTitle`).append(`<a id="save-default-production" style="color:#ff0000;font-size:12px;float:right;">Save default</a>`);
  // Select default on page load.
  var defaultProduction = localStorage.getItem('default_production');
  if (defaultProduction) {
    jQuery(`li[data-production-type="${defaultProduction}"]`).click();
  }
  jQuery('#save-default-production').click(function(){
    var production = jQuery(`#dropDownTitle_2_${n}`).text().trim().toLowerCase();
    saveDefault("production", production);
  });

  /*
   * Privacy Settings
   * Values: private, community, unlisted, paid
   */
  jQuery(`#dropDownColumn_3_${n} .uploadFormTitle`).append(`<a id="save-default-privacy" style="color:#ff0000;font-size:12px;float:right;">Save default</a>`);
  // Select default on page load.
  var defaultPrivacy = localStorage.getItem('default_privacy');
  if (defaultPrivacy) {
    jQuery(`li[data-privacy="${defaultPrivacy}"]`).click();
  }
  jQuery('#save-default-privacy').click(function(){
    var privacy = jQuery(`#dropDownTitle_3_${n}`).text().trim().toLowerCase();
    switch (privacy) {
      case "public":
        privacy = "community";
        break;
      case "for sale":
        privacy = "paid";
        break;
    }
    saveDefault("privacy", privacy);
  });

  /*
   * Language Spoken in Video
   * Values: <many>
   */
  jQuery(`#dropDownColumn_4_${n} .uploadFormTitle`).append(`<a id="save-default-language" style="color:#ff0000;font-size:12px;float:right;">Save default</a>`);
  // Select default on page load.
  var defaultLanguage = localStorage.getItem('default_language');
  if (defaultLanguage) {
    jQuery(`li[data-language="${defaultLanguage}"]`).click();
  }
  jQuery('#save-default-language').click(function(){
    var language = jQuery(`#dropDownTitle_4_${n}`).text().trim();
    switch (language) {
      case "English":
        var languageId = 0;
        break;
      case "English (British)":
        var languageId = 30;
        break;
      case "English (Australian)":
        var languageId = 31;
        break;
      case "Arabic":
        var languageId = 7;
        break;
      case "Bengali":
        var languageId = 22;
        break;
      case "Cantonese":
        var languageId = 24;
        break;
      case "Czech":
        var languageId = 9;
        break;
      case "Danish":
        var languageId = 33;
        break;
      case "Dutch":
        var languageId = 20;
        break;
      case "Finnish":
        var languageId = 35;
        break;
      case "French":
        var languageId = 1;
        break;
      case "German":
        var languageId = 3;
        break;
      case "Greek":
        var languageId = 28;
        break;
      case "Hindi":
        var languageId = 21;
        break;
      case "Hungarian":
        var languageId = 10;
        break;
      case "Indonesian":
        var languageId = 14;
        break;
      case "Italian":
        var languageId = 4;
        break;
      case "Japanese":
        var languageId = 6;
        break;
      case "Javanese":
        var languageId = 27;
        break;
      case "Korean":
        var languageId = 13;
        break;
      case "Mandarin":
        var languageId = 25;
        break;
      case "Norwegian":
        var languageId = 34;
        break;
      case "Persian":
        var languageId = 26;
        break;
      case "Polish":
        var languageId = 18;
        break;
      case "Portuguese":
        var languageId = 8;
        break;
      case "Portuguese (Brazilian)":
        var languageId = 32;
        break;
      case "Punjabi":
        var languageId = 23;
        break;
      case "Romanian":
        var languageId = 16;
        break;
      case "Russian":
        var languageId = 5;
        break;
      case "Spanish":
        var languageId = 2;
        break;
      case "Swedish":
        var languageId = 19;
        break;
      case "Tagalog":
        var languageId = 11;
        break;
      case "Thai":
        var languageId = 12;
        break;
      case "Turkish":
        var languageId = 29;
        break;
      case "Ukrainian":
        var languageId = 17;
        break;
      case "Vietnamese":
        var languageId = 15;
        break;
    }
    saveDefault("language", languageId);
  });

}

/*
* Save Default Helper
* @param {type}  fieldName Enter the short name of the field value you're saving.
* @param {type}  val The value you'd like to save to localStorage.
*/
function saveDefault(fieldName, val) {
  if (confirm('Are you sure you want to save this as the default?')) {
    localStorage.setItem(`default_${fieldName}`, val);
    console.log('New default was saved to the database.');
  } else {
    console.log('New default was not saved to the database.');
  }
};
