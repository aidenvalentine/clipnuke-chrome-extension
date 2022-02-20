/* XVideos - Add New Clip Page
 * https://www.xvideos.com/account/uploads/new
 */
var page = 1; // Increment results pages
$("div.panel-body").before(`<button id="clipnuke-fetch-clips" style="color:#000;margin:5px;">Latest ClipNuke Clips</button><input id="clipnuke-search" placeholder="Search on ClipNuke" style="color:#000">`);
prefillPage();

$("#clipnuke-fetch-clips").click(function(){
  if (!$("#clipnuke-results").length) {
      createTable();
  }
  // Call ClipNuke API and Fetch Latest Clips
  $.ajax({
    url: `https://clipnuke.com/wp-json/wc/v3/products?per_page=25&status=pending&page=${page}`,
    type: "get",
    cache: false,
    crossDomain: true,
    asynchronous: false,
    jsonpCallback: 'deadCode',
    timeout: 10000, // set a timeout in milliseconds
    complete: function(xhr, responseText, thrownError) {
      if (xhr.status == "200") {
        $("#clipnuke-results tbody").empty();
        var data = $.parseJSON(xhr.responseText);
        data.forEach(function(obj){
          var id = obj.id;
          var name = obj.name;
          var date = obj.date_modified;
          var img;
          if (obj.images.length > 0) {
            img = obj.images[0].src;
          } else {
            img = "https://via.placeholder.com/150x100";
          }
          $("#clipnuke-fetch-clips").text("Next Page");
          $("#clipnuke-results tbody").append(`<tr><td><img src="${img}" width="100px"></td><td style="float:left;padding: 5px;">${name}</td><td style="padding:5px;">${date}</td><td style="padding:5px;"><button class="clipnuke-autofill-form" data-id="${id}" style="color:#000;">Select</button></td></tr>`);
        });
        initTable();
        console.log(data); // yes response came, execute success()
        page++;
      } else {
        // Failure
      }
    }
  });

});
$('#clipnuke-search').bind("enterKey",function(e){
  if (!$("#clipnuke-results").length) {
      createTable();
  }
  var searchQuery = $('#clipnuke-search').val();
  // Call ClipNuke API and Fetch Latest Clips
  $.ajax({
    url: `https://clipnuke.com/wp-json/wc/v3/products?per_page=100&search=${searchQuery}`,
    type: "get",
    cache: false,
    crossDomain: true,
    asynchronous: false,
    jsonpCallback: 'deadCode',
    timeout: 10000, // set a timeout in milliseconds
    complete: function(xhr, responseText, thrownError) {
      if (xhr.status == "200") {
        $("#clipnuke-results tbody").empty();
        var data = $.parseJSON(xhr.responseText);
        data.forEach(function(obj){
          var id = obj.id;
          var name = obj.name;
          var date = obj.date_modified;
          var img;
          if (obj.images.length > 0) {
            img = obj.images[0].src;
          } else {
            img = "https://via.placeholder.com/150x100";
          }
          $("#clipnuke-results tbody").append(`<tr><td><img src="${img}" width="100px"></td><td style="float:left;padding: 5px;">${name}</td><td style="padding:5px;">${date}</td><td style="padding:5px;"><button class="clipnuke-autofill-form" data-id="${id}" style="color:#000;">Select</button></td></tr>`);
        });
        initTable();
        console.log(data); // yes response came, execute success()
      } else {
        // Failure
      }
    }
  });
});
$("#clipnuke-search").keyup(function(e){
  if(e.keyCode == 13) {
    $(this).trigger("enterKey");
  }
});

function initTable(){
  $(".clipnuke-autofill-form").click(function(){
    var id = $(this).data('id');
    console.log(`Filling form using ID# ${id}`);
    $('span[data-role="remove"]').click(); // Clear existing tags
    $.ajax({
      url: `https://clipnuke.com/wp-json/wc/v3/products/${id}`,
      type: "get",
      cache: false,
      crossDomain: true,
      asynchronous: false,
      jsonpCallback: 'deadCode',
      timeout: 10000, // set a timeout in milliseconds
      complete: function(xhr, responseText, thrownError) {
        if (xhr.status == "200") {
          var data = $.parseJSON(xhr.responseText);
          fillForm(data, function(err, data) {
            if (err) { alert("Error"); }
            // Success
          });

          console.log(data); // yes response came, execute success()
        } else {
          // Failure
        }
      }
    });
  });
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
  $("div.panel-body").before(html);
  $("#clipnuke-search").after(`<span class="icon-f icf-close" onclick="$('#clipnuke-search').val('');$('#clipnuke-results tbody tr').remove();$('#clipnuke-results-close').remove();" id="clipnuke-results-close"></span>`);
}

// Certify you have the rights to video
$('#upload_form_file_terms').prop('checked', true);

/**
 * If ClipNuke ID is in the New Video URL -- Fetch and prefill form & update clipnuke on save.
 * @return {[type]} [description]
 */
function prefillPage() {
  var id = getUrlParameter("cn-id");
  if (id) {
    console.log(`Query Parameter cn-id Exists!\nPrefilling form with ClipNuke's data for this video.`);
    fillForm(id);
  } else {
    // break;
  }
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
  $.ajax({
    url: `https://clipnuke.com/wp-json/wc/v3/products/${id}`,
    type: "get",
    cache: false,
    crossDomain: true,
    asynchronous: false,
    jsonpCallback: 'deadCode',
    timeout: 10000, // set a timeout in milliseconds
    complete: function(xhr, responseText, thrownError) {
      if (xhr.status == "200") {
        var data = $.parseJSON(xhr.responseText);

        // Autofill form
        // Title
        $(`#upload_form_titledesc_title`).val(data.name);
        addTranslations(data);
        data.meta_data.forEach(function(element) {
          if (element.key == "translations_0_xvideos_title") {
            // Open language selector
            $('#upload_form_titledesc > div.form-group.form-field-upload_form_titledesc_title > div > div > span > button').click();
            // Choose language
            data.meta_data.forEach(function(element) {
              if (element.key == "translations_0_language") {
                $('a[data-locale="' + element.value + '"]').click();
              }
            });
            $(`#upload_form_titledesc_title`).val(element.value); // Clip Title
          }
        });
        data.meta_data.forEach(function(element) {
          if (element.key == "translations_0_xvideos_network_title") {
            $(`#upload_form_titledesc_title_network`).val(element.value);
          }
        });

        // Description
        var cleanDesc = data.description.replace(/kid|xxxmultimedia.com|xxxmultimedia|teenager|force|forced/g,'');
        $("#upload_form_titledesc_description").val(cleanDesc.replace(/(<([^>]+)>)/ig,"")); // Replace strips HTML tags from desc.
        // Tags
        $('button[data-role="add"]:first').click(); // Init 1st input
        $.each(data.tags, function(key, value){
          $(".tag-list input:first").val(value.name);
          $('button[data-role="add"]:first').click(); // Submit
          console.log(value.name);
        });

        // File URL
        $('#upload_form_file_file_options_file_2_video_url').val(data.video_url);

        // TRANSLATIONS
        // data.meta_data.forEach(function(element) {
        //   if (element.key == "translations_1_xvideos_title") {
        //     $(`#upload_form_title_translations_title_translations_tr_0_tr_0_title`).val(element.value);
        //   }
        // });
        // addTranslations();
        // $("#upload_form_title_translations_title_translations > button").trigger("click", function() {
        //     $('a[data-locale="' + "en" + '"]').click();
        // });
        // data.meta_data.forEach(function(element) {
        //   if (element.key == "translations_1_xvideos_network_title") {
        //     $(`#upload_form_title_translations_title_network_translations_ntr_0_ntr_0_title`).val(element.value);
        //   }
        // });


        console.log(data); // yes response came, execute success()
      } else {
        // Failure
      }
    }
  });
}

/**
 * HELPERS
 * These are pieces of code that may be used on multiple content-scripts and can be abstracted to helpers.js
 */

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

 /**
 * ClipNuke - Get Product JSON data from ClipNuke API
 * @param  {Integer} id               ClipNuke Video ID
 * @return {Obj}                      Response object from ClipNuke API containing video data or error.
 */
 function woocommerceGetProduct(id) {
   var apiUrl = `https://clipnuke.com/wp-json/wc/v3/products/`;
   console.log(`Sending HTTP GET Request: ${apiUrl}${id}`);
   $.ajax({
     url: `${apiUrl}${id}`,
     type: "get",
     cache: false,
     crossDomain: true,
     asynchronous: false,
     jsonpCallback: 'deadCode',
     timeout: 10000, // set a timeout in milliseconds
     complete: function(xhr, responseText, thrownError) {
       if (xhr.status == "200") {
         console.log(`Success! Product #${id} was fetched from ClipNuke.`);
         console.log(xhr.responseJSON);
         return xhr.responseJSON;
       }
     }
   });
 };

function addTranslations(data) {
  /* Pick the right flag for the right language. */
  function flagClass(lang) {
    switch(lang) {
      case "en": // English
        return "flag-us";
      case "es": // Spanish
        return "flag-es";
      case "pt": // Portugese
        return "flag-pt";
      case "nl": // Dutch
        return "flag-nl";
      case "de": // German
        return "flag-de";
      case "fr": // French
        return "flag-pt";
      case "po": // Polish
        return "flag-pl";
      case "ru": // Russian
        return "flag-ru";
      case "cz": // Czech
        return "flag-cz";
      case "ja": // Japanese
        return "flag-jp";
      case "zh": // Chinese
        return "flag-cn";
      case "hi": // Indian
        return "flag-in";
      case "ar": // Arabic
        return "flag-eg";
    }
  }
  if (data.translations[0].xvideosTitle) {
    $(`#upload_form_titledesc_title`).val(data.translations[0].xvideosTitle); // Main Clip Title
  } else {
    $(`#upload_form_titledesc_title`).val(data.name);
  }
  if (data.translations[0].networkTitle) {
    $(`#upload_form_titledesc_title_network`).val(data.translations[0].networkTitle); // Main Network title
  }
  data.translations.pop();
  data.translations.forEach(function(item, i) {
    // XVideos Title
    $(`input#upload_form_title_translations_title_translations_tr_${i}_tr_${i}_title_lang`).val(item.lang).trigger("change");
    $(`#upload_form_title_translations_title_translations_tr_${i} > div > div > div > span > button > span`).removeClass("flag-question").addClass(flagClass(item.lang));
    $(`#upload_form_title_translations_title_translations_tr_${i}`).show();
    $(`#upload_form_title_translations_title_translations_tr_${i}_tr_${i}_title`).val(item.xvideosTitle);
    // Network Title
    $(`input#upload_form_title_translations_title_network_translations_ntr_${i}_ntr_${i}_title_lang`).val(item.lang).trigger("change");
    $(`#upload_form_title_translations_title_network_translations_ntr_${i} > div > div > div > span > button > span`).removeClass("flag-question").addClass(flagClass(item.lang));
    $(`#upload_form_title_translations_title_network_translations_ntr_${i}`).show();
    $(`#upload_form_title_translations_title_network_translations_ntr_${i}_ntr_${i}_title`).val(item.networkTitle);
  });
}
