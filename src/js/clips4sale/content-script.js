/* Clips4Sale - Add New Clip Page
 * https://admin.clips4sale.com/clips/show
 */
// @TODO We need to get the window object var tinyMCE so we can populate the description field.
// var tinyMCE = retrieveWindowVariables(["tinyMCE"]);
var page = 1;
$("#html5Uploaders").before(`<button id="clipnuke-fetch-clips" style="margin-right:5px;">Autofill Form via ClipNuke</button><input id="clipnuke-search" placeholder="Search your clips">`); // @TODO Make named function
prefillPage();
overrideSubmit();
acceptContentCertification();
ifClipIsCloned();

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

        /** Autofill form */
        // TITLE
        $(`input[name="ClipTitle"]`).val(null); // Reset title
        $(`input[name="ClipTitle"]`).val(data.name);

        // PERFORMERS
        // var performerIds = [];
        // performers.forEach(function(elem) {
          // var performerId = $("#performer_ids").find(`[data-name="${elem}"]`).val();
        // });
        // JSON.stringify(performerIds);
        // $("#performer_ids_collector").val(performerIds); // Set to comma-separated list of performer IDs.

        // DESCRIPTION
        var cleanDesc = data.description.replace(/kid|xxxmultimedia.com|xxxmultimedia|teenager|force|forced|blood/g, '');
        if (window[1]) { // Check bc it may not exist for SOME reason. God knows.
          if (window[1].document.getElementById("tinymce")) {
            window[1].document.getElementById("tinymce").innerHTML = ""; // Reset description
            window[1].document.getElementById("tinymce").innerHTML = cleanDesc;
            console.log("TinyMCE updated in Window 1");
          } else if (window[2].document.getElementById("tinymce")) {
            window[2].document.getElementById("tinymce").innerHTML = ""; // Reset description
            window[2].document.getElementById("tinymce").innerHTML = cleanDesc;
            console.log("TinyMCE updated in Window 2");
          }
        }
        localStorage.setItem('add-clipDescription', cleanDesc);

        // CATEGORIES
        $(`#keycat`).val(0).trigger('change'); // reset main category
        data.meta_data.forEach(function(element) {
          if (element.key == "primary_category") {
            console.log(`Main Category: ${element.value}`);
            $("#keycat").val($(`#keycat option:textEquals(${element.value})`).val());
            $(`#select2-keycat-container`).attr('title', element.value); // Manually set dropdown item
            $(`#select2-keycat-container`).html(element.value); // Manually set dropdown item
            localStorage.setItem('add-clipCategory', $(`#keycat option:textEquals(${element.value})`).val());
          }
        });

        // RELATED CATEGORIES
        for (let i = 0; i < 6; i++) { // reset related cats
          $(`#key${i}`).val(null).trigger('change');
          $(`#select2-key${i+1}-container`).attr('title', "Select Related Categories"); // Manually set dropdown item
          $(`#select2-key${i+1}-container`).html("Select Related Categories"); // Manually set dropdown item
        }
        data.meta_data.forEach(function(element, i) {
          if (element.key == "categories") {
            if (element.value.length > 1) {
              element.value.forEach(function(elem, index) {
                console.log(elem);
                $(`#key${index+1}`).val($(`#key${index+1} option:textEquals(${elem})`).val());
                $(`#select2-key${index+1}-container`).attr('title', elem); // Manually set dropdown item
                $(`#select2-key${index+1}-container`).html(elem); // Manually set dropdown item
                localStorage.setItem(`add-clipRelatedCategory${index+1}`, $(`#key${index+1} option:textEquals(${elem})`).val());
              })
            } else if (element.value.length == 0) {
              // $(`#select2-key${index+1}-container`).attr('title', ""); // Manually set dropdown item
              // $(`#select2-key${index+1}-container`).html(null); // Manually set dropdown item
              // $(`#key${index+1`).val(0);
            }
          }
        });

        $("#keycat").trigger('change'); // Force reload cats
        $("#key1").trigger('change');

        // KEYWORDS/TAGS
        for (let i = 0; i < 16; i++) { // reset tags
          $(`[name="keytype[${i}]"]`).val(null);
        }
        for (let i = 0; i < data.tags.length; i++) {
          $(`[name="keytype[${i}]"]`).val(data.tags[i].name);
          localStorage.setItem(`add-clipKeyword${i}`, data.tags[i].name || null)
        }

        // FILENAME
        $("#ClipName").val(null).trigger("change"); // Reset
        // var filename = getMetadataValue("minio_object_key") || getMetadataValue("s3_object_key") || data.sku;
        $("#ClipName").val(data.sku + '_hd.mp4').trigger("change");
        localStorage.setItem('add-clipName', data.sku + '_hd.mp4');

        $("#clip_preview").val(null).trigger("change"); // Reset
        $("#clip_preview").val(data.sku + '_preview.mp4').trigger("change");
        localStorage.setItem('add-clipPreview', data.sku + '_preview.mp4');
        localStorage.setItem('add-clipPreviewMethod', "8");

        $("#ClipImage").val(null).trigger("change"); // Reset
        $("#ClipImage").val(data.sku + '.jpg').trigger("change");

        // CLIP PRICE
        $("#clip_price").val(null).trigger("change");
        if ($("#clip_price").val() + 0 > 12.99) { // Set max price @ $12.99
          $("#clip_price").val("12.99");
          $("#clip_price").trigger("change");
        }
        localStorage.setItem('add-clipPrice', $("#clip_price").val());

        console.log(data); // yes response came, execute success()
      } else {
        // Failure
      }
    }
  });
}

/**
 * Clips4Sale -> Add Clip -> Content Certification
 * Tick all the ToS and compliance checkboxes.
 * @return {[type]} [description]
 */
function acceptContentCertification() {
  $(`input[name="consent_upload"]`).attr("checked", "checked");
  $(`input[name="verify_age"]`).attr("checked", "checked");
  $(`input[name="verify_identity"]`).attr("checked", "checked");
  $(`input[name="verify_docs"]`).attr("checked", "checked");
  $(`input[name="consent_sell"]`).attr("checked", "checked");
  $(`input[name="accept_terms_of_service"]`).attr("checked", "checked");
}

function ifClipIsCloned() {
  // If current URL matches string. It is a "cloned" clip.
  if (window.location.href.includes("c=")) {
    $("#DisplayOrder").val(0);
  }
}

function overrideSubmit() {
  $('#submitButton').hide(); // Hide default save button
  $('#submitButton').before(`<button data-toggle="modal" type="button" data-target="#compliance-modal" id="clipnukeSubmit" class="btn btn-info btn-xs" style="background-color: limegreen;">Add Clip [ClipNuke]</button>`);
  $(`#clipnukeSubmit`).click(function() {
    let text;
    if (confirm("Press a button!") == true) {
      text = "Save/Update linked video on ClipNuke?";
      $('#submitButton').click();
      saveToClipnuke();
    } else {
      text = "No! Only Save to Clips4Sale.";
      $('#submitButton').click();
    }
  });
}

function saveToClipnuke(id) {
  var data = getDataFromForm();
  if (id) {
    // Update clipnuke product
    woocommerceSaveProduct(id, data);
  } else {
    // New clipnuke product
    woocommerceSaveProduct(null, data);
  }
}

function getDataFromForm() {
  var data = {}; // Init WooCommerce REST API/Product Data Object

  // Fetch Page Variables
  var studioId = $(`input[name="producer_id"]`).val();
  var clipId;
  if ($(`input[name="id"]`).val()) {
    clipId = $(`input[name="id"]`).val();
  }

  // TITLE
  data.name = $(`input[name="ClipTitle"]`).val();
  // DESCRIPTION
  if (window[1].document.getElementById("tinymce")) {
    data.description = window[1].document.getElementById("tinymce").innerHTML;
  } else if (window[2].document.getElementById("tinymce")) {
    data.description = window[2].document.getElementById("tinymce").innerHTML;
  }
  // PERFORMERS
  var performers = [];
  $(".added-performer-name").each(function(i, elem) {
    performers.push(elem.innerText);
  });
  performers.join(", ");
  // console.log(performers);

  // CATEGORIES -- Reads all categories and inserts them into an array.
  var categories = [];
  function getCats() {
    $(".select2-selection__rendered").each(function(i, elem) {
      console.log(`Category: ${elem}`, $(elem).innerText);
      categories.push(elem.innerText);
    });
    console.log(categories);
  };
  getCats();

  // MAIN CATEGORY
  var primaryCategory = categories[0]; // Grab first category and set as primary.

  // RELATED CATEGORIES
  var relatedCategories = categories.shift(); // Remove 1st element, main category.

  // TAGS
  data.tags = [];
  function getTags() {
    $(".keyWordLimit").each(function(i, elem) {
      var val = $(elem).val();
      console.log(`Tag: ${val}`);
      data.tags.push(val);
    });
  };
  // getTags();

  if ($("#ClipName").val()) {
    data.sku = $("#ClipName").val().replace(/\.[^/.]+$/, ""); // Remove file extension. Regex.
  }

  // PRICE
  if ($(`#clip_price`).val()) {
    data.price = $(`#clip_price`).val();
    data.regular_price = data.price;
    // data.sale_price = data.price;
  }

  // IMAGES
  data.images = [];

  // METADATA
  data.meta_data = [];
  data["meta_data"].push({
    key: "c4s_uploaded_clips_0_c4s_store_id", // @TODO make this accept multiple c4s versions.
    value: studioId
  });
  data["meta_data"].push({
    key: "_c4s_uploaded_clips_0_c4s_store_id", // @TODO make this accept multiple c4s versions.
    value: "field_5cccd476c77bf"
  });
  data["meta_data"].push({
    key: "c4s_uploaded_clips_0_c4s_clip_id", // @TODO make this accept multiple c4s versions.
    value: clipId
  });
  data["meta_data"].push({
    key: "_c4s_uploaded_clips_0_c4s_clip_id", // @TODO make this accept multiple c4s versions.
    value: "field_5cccd495c77c0"
  });
  // # of versions of this video uploaded to C4S
  data["meta_data"].push({
    key: "c4s_uploaded_clips",
    value: function(id) {
      if (id) {
        // return // How many C4S versions are attached to this video?
        return null;
      } else {
        return 1;
      }
    }
  });
  data["meta_data"].push({
    key: "_c4s_uploaded_clips",
    value: "field_5cccd3f1c77be"
  });
  // Clips4Sale Important Metadata
  data["meta_data"].push({
    key: "categories",
    value: categories
  });
  data["meta_data"].push({
    key: "_categories",
    value: "field_5cb9c7ca9e319"
  });
  data["meta_data"].push({
    key: "primary_category",
    value: primaryCategory
  });
  data["meta_data"].push({
    key: "_primary_category",
    value: "field_5cb9caeec4601"
  });

  // Optional Clips4Sale Metadata
  data["meta_data"].push({
    key: "publication_date",
    value: function() {
      var releaseDate;
      var d = new Date().toISOString();
      if ($(`#fut_active`).attr("checked")) {
        // If clip is set to activate now, set the release date as now.
        releaseDate = d;
      } else if ($(`#fut_checkbox`).attr("checked")) {
        // If clip is sceduled for the future, set release date as specified on C4S.
        var mm = $(`#fut_month`).val();
        var dd = $(`#fut_day`).val();
        var yyyy = $(`#fut_year`).val();
        var hh = $(`#fut_hour`).val();
        var mm = $(`#fut_minute`).val();
        releaseDate = `${yyyy}-${mm}-${dd}T${hh}:${mm}:00.000Z`;
      }
      return releaseDate;
    }
  })
  data["meta_data"].push({
    key: "_publication_date",
    value: "field_5cb9cb17c4602"
  });
  data["meta_data"].push({
    key: "c4s_poster_image",
    value: $(`#ClipImage`).val()
  });
  data["meta_data"].push({
    key: "_c4s_poster_image",
    value: "field_5cbad9226a4ad"
  });
  data["meta_data"].push({
    key: "c4s_trailer",
    value: $(`#clip_preview`).val()
  });
  data["meta_data"].push({
    key: "_c4s_trailer",
    value: "field_5cbadbf2db9b0"
  });
  data["meta_data"].push({
    key: "c4s_file",
    value: $(`input[name="ClipName"]`).val()
  });
  data["meta_data"].push({
    key: "_c4s_file",
    value: "field_5cbadc49db9b1"
  });
  data["meta_data"].push({
    key: "c4s_pornstars",
    value: ""
  });
  data["meta_data"].push({
    key: "_c4s_pornstars",
    value: "field_5cccadc3d2e3b"
  });
  data["meta_data"].push({
    key: "c4s_tags",
    value: ""
  });
  data["meta_data"].push({
    key: "_c4s_tags",
    value: "field_5cccae07d2e3c"
  });
  data["meta_data"].push({
    key: "c4s_price",
    value: $(`#clip_price`).val()
  });
  data["meta_data"].push({
    key: "_c4s_price",
    value: "field_5cb9ef3b89f11"
  });
  // data["meta_data"].push({
  //   key: "thumbnail",
  //   value: ""
  // });
  // data["meta_data"].push({
  //   key: "_thumbnail",
  //   value: "field_5cc60b9507a69"
  // });

  // XXXtra Metadata
  data["meta_data"].push({
    key: "filename",
    value: ""
  });
  data["meta_data"].push({
    key: "_filename",
    value: ""
  });
  data["meta_data"].push({
    key: "price",
    value: ""
  });
  data["meta_data"].push({
    key: "_price",
    value: ""
  });
  data["meta_data"].push({
    key: "thumbnail_filename",
    value: ""
  });
  data["meta_data"].push({
    key: "_thumbnail_filename",
    value: ""
  });
  data["meta_data"].push({
    key: "trailer_filename",
    value: ""
  });
  data["meta_data"].push({
    key: "_trailer_filename",
    value: ""
  });
  data["meta_data"].push({
    key: "trailer_mp4_url",
    value: ""
  });
  data["meta_data"].push({
    key: "_trailer_mp4_url",
    value: ""
  });
  data["meta_data"].push({
    key: "minio_object_key",
    value: ""
  });
  data["meta_data"].push({
    key: "_minio_object_key",
    value: "field_5cca0bdfed7da"
  });
  data["meta_data"].push({
    key: "minio_bucket_name",
    value: ""
  });
  data["meta_data"].push({
    key: "_minio_bucket_name",
    value: "field_5cca0b62ed7d9"
  });
  data["meta_data"].push({
    key: "video_duration",
    value: ""
  });
  data["meta_data"].push({
    key: "_video_duration",
    value: "field_5adc9a469b9c1"
  });
  // data["meta_data"].push({
  //   key: "_publicize_twitter_user",
  //   value: ""
  // });
  // data["meta_data"].push({
  //   key: "pornstars",
  //   value: ""
  // });
  // data["meta_data"].push({
  //   key: "_pornstars",
  //   value: ""
  // });
  // data["meta_data"].push({
  //   key: "cn_trailer_bucket_name",
  //   value: ""
  // });
  // data["meta_data"].push({
  //   key: "_cn_trailer_bucket_name",
  //   value: "field_5cce21b2a6f2b"
  // });
  // data["meta_data"].push({
  //   key: "cn_trailer_object_key",
  //   value: ""
  // });
  // data["meta_data"].push({
  //   key: "_cn_trailer_object_key",
  //   value: "field_5cce21d9a6f2c"
  // });

  return data;
};

function woocommerceSaveProduct(id, data={}) {
  // var data = {};
  var apiUrl = `https://clipnuke.com/wp-json/wc/v3/products/`;
  console.log(`Sending HTTP Request: ${apiUrl}${id}`);
  var httpVerb;
  if (id) { // If not an existing product, create a new one.
    httpVerb = "put";
    createdOrUpdated = "updated";
  } else {
    httpVerb = "post";
    createdOrUpdated = "created";
  }
  $.ajax({
    url: `${apiUrl}${id}`,
    data: data,
    type: httpVerb,
    cache: false,
    crossDomain: true,
    asynchronous: false,
    jsonpCallback: 'deadCode',
    timeout: 10000, // set a timeout in milliseconds
    complete: function(xhr, responseText, thrownError) {
      if (xhr.status == "200") {
        console.log(`Success! Product was ${createdOrUpdated}.`);
      }
    }
  });
};

/**
 * HELPERS
 * These are pieces of code that may be used on multiple content-scripts and can be abstracted to helpers.js
 */

// Add a extend pseudo function. CSS Match text.
$.expr[':'].textEquals = $.expr.createPseudo(function(arg) {
  return function(elem) {
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
 * CLIPNUKE HELPERS
 * These are files that are injected into EVERY distributor's pages. Like the results table, search box, etc.
 * Can be DRYer by abstracting to clipnuke-widget.js
 */

$("#clipnuke-fetch-clips").click(function() {
  if (!$("#clipnuke-results").length) {
    createTable("#html5Uploaders");
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
          $("#clipnuke-fetch-clips").text("Next Page");
          $("#clipnuke-results tbody").append(`<tr><td><img src="${img}" width="100px"></td><td style="float:left;padding: 5px;">${name}</td><td style="padding:5px;">${date}</td><td style="padding:5px;"><button class="clipnuke-autofill-form" data-id="${id}">Select</button></td></tr>`);
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

$('#clipnuke-search').bind("enterKey", function(e) {
  if (!$("#clipnuke-results").length) {
    createTable("#html5Uploaders");
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
          $("#clipnuke-results tbody").append(`<tr><td><img src="${img}" width="100px"></td><td style="float:left;padding: 5px;">${name}</td><td style="padding:5px;">${date}</td><td style="padding:5px;"><button class="clipnuke-autofill-form" data-id="${id}">Select</button></td></tr>`);
        });
        initTable();
        console.log(data); // yes response came, execute success()
      } else {
        // Failure
      }
    }
  });
});

$("#clipnuke-search").keyup(function(e) {
  if (e.keyCode == 13) {
    $(this).trigger("enterKey");
  }
});

function initTable() {
  jQuery(".clipnuke-autofill-form").click(fillForm);
}

function createTable(elemSelector) {
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
  $(elemSelector).before(html);
};
