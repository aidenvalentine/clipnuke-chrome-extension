/* PorhHub - Upload New Video Page
 * https://www.pornhub.com/upload/videodata
 */

var app = window.app = window.app || {};
app.analytics.init();
setTimeout(function() {
  app.analytics.track("Pageview");
}, 2000);

/*
 * Wait for page to show the upload's video data form.
 */
var div = document.getElementsByClassName('uploadWrapperContainer')[0],
  divDisplay = jQuery(".uploadWrapperContainer").css("display"),
  observer = new MutationObserver(function() {
    var currentDisplay = jQuery(".uploadWrapperContainer");

    if (divDisplay !== currentDisplay) {
      console.log("Preparing ClipNuke features.");
      jQuery('.translationSection').prepend(`<ul id="clipnuke-translations"></ul>`);
      prefillPage();
      prepareClipNuke();
      autofillVerifyFields(0);
      // loadDefaults(0); // defaults.js
    }
  });
//observe changes
observer.observe(div, {
  attributes: true
});

/**
 * If ClipNuke ID is in the New Video URL -- Fetch and prefill form & update clipnuke on save.
 * @return {[type]} [description]
 */
function prefillPage() {
  var id = getUrlParameter("cn-id");
  if (id) {
    console.log(`Query Parameter cn-id Exists!\nPrefilling form with ClipNuke's data for this video.`);
    fillForm(id);
    // jQuery("body").append(`<button class="clipnuke-autofill-form" data-id="${id}"></button>`).click();
  } else {
    // break;
  }
}

/*
 * Prepare ClipNuke
 */
function prepareClipNuke() {
  window.clipnuke = {}; // Create browser window object for our data & methods.
  var page = 1;
  jQuery("div.videoDataBlock > .blockContentContainer:first").before(`<button id="clipnuke-fetch-clips" style="padding:5px;margin-right:5px;margin-top:7px;">Fetch Your ClipNuke Clips</button><input id="clipnuke-search" placeholder="Search your clips" style="padding:5px;">`);
  // Create HTML container for translations.
  // jQuery('.translationSection').prepend(`<ul id="clipnuke-translations"></ul>`);
  // Override PH behavior.
  jQuery("#clipnuke-fetch-clips").click(function(event) {
    event.preventDefault();
  });
  jQuery("#clipnuke-search").click(function(event) {
    event.preventDefault();
  });
  jQuery("#clipnuke-fetch-clips").click(function() {
    if (!jQuery("#clipnuke-results").length) {
      createTable();
    }
    // Call ClipNuke API and Fetch Latest Clips
    jQuery.ajax({
      url: `https://clipnuke.com/wp-json/wc/v3/products?per_page=25&status=pending&page=${page}`,
      type: "get",
      cache: false,
      crossDomain: true,
      asynchronous: false,
      jsonpCallback: 'deadCode',
      timeout: 10000, // set a timeout in milliseconds
      complete: function(xhr, responseText, thrownError) {
        if (xhr.status == "200") {
          jQuery("#clipnuke-results tbody").empty();
          var data = jQuery.parseJSON(xhr.responseText);
          data.forEach(function(obj) {
            var id = obj.id;
            var name = obj.name;
            var date = obj.date_modified;
            var img;
            if (obj.images.length > 0) {
              img = obj.images[0].src;
            } else {
              img = "https://via.placeholder.com/150x100";
            }
            jQuery("#clipnuke-fetch-clips").text("Next Page");
            jQuery("#clipnuke-results tbody").append(`<tr><td><img src="${img}" width="100px"></td><td style="float:left;padding: 5px;">${name}</td><td style="padding:5px;">${date}</td><td style="padding:5px;"><button class="clipnuke-autofill-form" data-id="${id}">Select</button></td></tr>`);
          });
          jQuery(".clipnuke-autofill-form").click(function(event) {
            event.preventDefault();
          });
          initTable();
          console.log(data); // yes response came, execute success()
          page++;
        } else {
          // Failure
        }
      }
    });
    app.analytics.track(`Fetch Clips`);

  });
  jQuery('#clipnuke-search').bind("enterKey", function(e) {
    if (!jQuery("#clipnuke-results").length) {
      createTable();
    }
    var searchQuery = jQuery('#clipnuke-search').val();
    // Call ClipNuke API and Fetch Latest Clips
    jQuery.ajax({
      url: `https://clipnuke.com/wp-json/wc/v3/products?per_page=100&search=${searchQuery}`,
      type: "get",
      cache: false,
      crossDomain: true,
      asynchronous: false,
      jsonpCallback: 'deadCode',
      timeout: 10000, // set a timeout in milliseconds
      complete: function(xhr, responseText, thrownError) {
        if (xhr.status == "200") {
          jQuery("#clipnuke-results tbody").empty();
          var data = jQuery.parseJSON(xhr.responseText);
          data.forEach(function(obj) {
            var id = obj.id;
            var name = obj.name;
            var date = obj.date_modified;
            var img;
            if (obj.images.length > 0) {
              img = obj.images[0].src;
            } else {
              img = "https://via.placeholder.com/150x100";
            }
            var img = img.slice(0, -4).concat("-100x100.jpg"); // Get a thumbnail from clipnuke.com's server.
            jQuery("#clipnuke-results tbody").append(`<tr><td><img src="${img}" width="100px"></td><td style="float:left;padding: 5px;">${name}</td><td style="padding:5px;">${date}</td><td style="padding:5px;"><button class="clipnuke-autofill-form" data-id="${id}">Select</button></td></tr>`);
          });
          jQuery(".clipnuke-autofill-form").click(function(event) {
            event.preventDefault();
          });
          initTable();
          console.log(data); // yes response came, execute success()
        } else {
          // Failure
        }
      }
    });
    app.analytics.track(`Search Clips`);
  });
  jQuery("#clipnuke-search").keyup(function(e) {
    if (e.keyCode == 13) {
      jQuery(this).trigger("enterKey");
    }
  });
};

function initTable() {
  jQuery(".clipnuke-autofill-form").click(fillForm);
}

function createTable() {
  // Create and populate data table
  var html = `
  <table id="clipnuke-results" style="width:100%;padding:5px;border: 1px solid #ddd;">
    <thead style="border-bottom:1px solid #ddd;">
      <tr>
        <th style="padding:5px;">Thumbnail</th>
        <th style="padding:5px;">Name</th>
        <th style="padding:5px;">Date Modified</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>`;
  jQuery("div.videoDataBlock > .blockContentContainer:first").before(html);
}

/**
 * Call a product from ClipNuke and fill the form's fields with the data.
 * @param  {Integer} id               The ClipNuke post/product ID of your target video.
 * @return {[type]}    [description]
 */
function fillForm(id) {
  // If you click a button w/ data-id attribute, override that as the ClipNuke ID.
  if (jQuery(this).data('id')) {
    var id = jQuery(this).data('id');
  }
  console.log(`Filling form using ID# ${id}`);
  jQuery.ajax({
    url: `https://clipnuke.com/wp-json/wc/v3/products/${id}`,
    type: "get",
    cache: false,
    crossDomain: true,
    asynchronous: false,
    jsonpCallback: 'deadCode',
    timeout: 10000, // set a timeout in milliseconds
    complete: function(xhr, responseText, thrownError) {
      if (xhr.status == "200") {
        var data = jQuery.parseJSON(xhr.responseText);
        window.clipnuke.data = data; // Add response to clipnuke window obj.

        // Autofill form

        /* TITLE & Title Defaults */
        jQuery(`#titleTmplField_0`).val(null); // Reset Title
        jQuery(`#titleTmplField_0`).val(data.name); // Title
        var titleLanguage = "English",
          titleLanguageCode = "en";
        jQuery(`input[name="mainLanguage[]"]`).val(titleLanguage);
        jQuery(`input[name="mainLanguageCode[]"]`).val(titleLanguageCode);

        /* TRANSLATIONS */
        jQuery('#clipnuke-translations').html(null); // Reset translations HTML elems
        jQuery(`input[name="translatedTitle[]"]`).val(null); // Reset translations hidden JSON input.
        var phLanguagesList = ["en", "de", "fr", "es", "it", "pt", "pl", "ru", "jp", "nl", "cz"];
        var translatedTitles = {};
        var translationsObj = {};
        data.meta_data.forEach(function(element) {
          if (element.key.startsWith("translations_")) {
            console.log(element.key.substring(0, 14));
            var keyName = element.key.substring(0, 14);
            if (!translatedTitles[keyName]) {
              translatedTitles[keyName] = {};
            }
            if (element.value.length == 2) {
              translatedTitles[keyName].language = element.value;
            } else {
              translatedTitles[keyName].title = element.value;
            }
          }
        });
        Object.keys(translatedTitles).forEach(function(element) {
          // If PornHub supports the language, add it to the translationsObj.
          if (phLanguagesList.indexOf(translatedTitles[element].language) > -1 && translationsObj[translatedTitles[element].language] != "en") {
            translationsObj[translatedTitles[element].language] = translatedTitles[element].title;
            // Add each translation to the page's HTML for user.
            jQuery('#clipnuke-translations').append(`<li class="translationView translationBlock omega"><label class="uploadFormTitle">${translatedTitles[element].language}</label><span>${translatedTitles[element].title}</span></li>`);
          }

        });
        delete translationsObj["en"]; // Delete default language -- Ex. English
        jQuery(`input[name="translatedTitle[]"]`).val(JSON.stringify(translationsObj));

        /* TAGS */
        // jQuery('input[name="tags[]"]').val(null); // Reset tags
        // jQuery(".tagsContainer : .reset").click();
        data.tags.forEach(function(elem, index) {
          console.log(`Adding Tag: ${elem}`);
          jQuery("#tagsList_0").val(elem.name);
          jQuery("#submitNewTag_0").removeClass("disabled").click();
          // Check if tag is a pornstar's name. If so, select it.
          // jQuery("#pornstarsList_0").delay(1000).val(elem.name.toLowerCase()).autocomplete("search");
          // if (jQuery(".ui-menu-item").first().text().toLowerCase() == elem.name.toLowerCase()) {
          //   jQuery(".ui-menu-item").first().click();
          // }
        })

        /* CATEGORIES */
        jQuery(`.categoryBtn`).removeClass("active"); // Reset categories
        data.meta_data.forEach(function(element) {
          if (element.key == "pornhub_categories") {
            console.log(element.value.length);
            element.value.forEach(function(catId) {
              jQuery(`#${catId}.categoryBtn`).addClass("active");
            })
          }
        });

        /*
         * When will this be published
         * Values: now, date
         */
        var datePublished = "now";
        jQuery(`li[data-schedule-type="now"]`).click();
        if (datePublished == "date") {
          var date = "",
            time = "12:00:00 PM",
            timezone = "US/Eastern";
          jQuery(".clipHubDateInput").val(date); // YYYY-MM-DD
          jQuery(`li[data-schedule-time="${time}"]`).click(); // HH:mm:ss AM/PM
          jQuery(`li[data-schedule-timezone="${timezone}"]`).click(); // Timezone
        }

        console.log(data); // yes response came, execute success()
      } else {
        // Failure
      }
    }
  });
};

/**
 * Autofill Static Fields. Consent checkboxes basically.
 * @param  {Number} [n=0]               Which upload form is this on the page. 0 = 1st form.
 */
function autofillVerifyFields(n = 0) {
  // Verify User
  jQuery(`#dropDownVerify_1_${n} > li.alpha`).click();

  // Tick all the consent boxes
  jQuery(`#js-above18_${n}`).attr("checked", true);
  jQuery(`#js-verifiedContent_${n}`).attr("checked", true);
  jQuery(`#js-uponRequest_${n}`).attr("checked", true);
  jQuery(`#js-validContent_${n}`).attr("checked", true);
}

// jQuery.ajax({
//   url: "https://api.mixpanel.com/import?project_id=2531501&strict=1",
//   type: "POST",
//   headers: {  'Access-Control-Allow-Origin': '*' },
//   data: {
//     event: "pageview",
//     properties: {
//       $device_id: mixpanel.cookie.props.$device_id,
//       $user_id: "aiden@xxxmultimedia.com",
//       distinct_id: mixpanel.cookie.props.distinct_id,
//       Token: "2f26571a72d551c1a0e6c385b9c56883",
//       time: Date.now(),
//       Campaign_id: "ClipNuke Chrome Alpha Version",
//       path: window.location.pathname,
//       hostname: window.location.hostname,
//       url: window.location.href
//     }
//   },
//   crossDomain: true,
//   cache: false,
//   dataType: 'jsonp',
//   beforeSend: function(xhr) {
//     xhr.setRequestHeader("Authorization", "Basic " + btoa(apikey + ":" + apisecret));
//   },
//   complete: function(xhr, responseText, thrownError) {
//     if (xhr.status == "200") {
//       var data = jQuery.parseJSON(xhr.responseText);
//       console.log(data);
//     } else {
//       var data = jQuery.parseJSON(xhr.responseText);
//       console.log(data);
//     }
//   }
// })

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
