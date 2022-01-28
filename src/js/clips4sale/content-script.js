/* Clips4Sale - Add New Clip Page
 * https://admin.clips4sale.com/clips/show
 */
 // @TODO We need to get the window object var tinyMCE so we can populate the description field.
// var tinyMCE = retrieveWindowVariables(["tinyMCE"]);
var page = 1;
$("#html5Uploaders").before(`<button id="clipnuke-fetch-clips">Autofill Form via ClipNuke</button><input id="clipnuke-search" placeholder="Search your clips">`);
$("#keycat").after(`<span onclick="$('#keycat').trigger('change');">Refresh Categories</span>`);
acceptContentCertification();
ifClipIsCloned();
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
$("#clipnuke-search").keyup(function(e){
  if(e.keyCode == 13) {
    $(this).trigger("enterKey");
  }
});

function initTable(){
  $(".clipnuke-autofill-form").click(function(){
    var id = $(this).data('id');
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

          // DESCRIPTION
          var cleanDesc = data.description.replace(/kid|xxxmultimedia.com|xxxmultimedia|teenager|force|forced|blood/g,'');
          if (window[1].document.getElementById("tinymce")) {
            window[1].document.getElementById("tinymce").innerHTML = ""; // Reset description
            window[1].document.getElementById("tinymce").innerHTML = cleanDesc;
            console.log("TinyMCE updated in Window 1");
          } else if (window[2].document.getElementById("tinymce")) {
            window[2].document.getElementById("tinymce").innerHTML = ""; // Reset description
            window[2].document.getElementById("tinymce").innerHTML = cleanDesc;
            console.log("TinyMCE updated in Window 2");
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
          for ( let i = 0; i < 6; i++) {  // reset related cats
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
          for ( let i = 0; i < 16; i++) {  // reset tags
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
          if ($("#clip_price").val()+0 > 12.99) { // Set max price @ $12.99
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
  $("#html5Uploaders").before(html);
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
  if (window.location.href.includes("/clips/show/?c=")) {
    $("#DisplayOrder").val(1);
  }
}

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
