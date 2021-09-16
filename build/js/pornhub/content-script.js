/* PorhHub - Upload New Video Page
 * https://www.pornhub.com/upload/videodata
 */

/*
 * Wait for page to show the upload's video data form.
 */
var div = document.getElementsByClassName('uploadWrapperContainer')[0],
  divDisplay = jQuery(".uploadWrapperContainer").css("display"),
  observer = new MutationObserver(function() {
    var currentDisplay = jQuery(".uploadWrapperContainer");

    if (divDisplay !== currentDisplay) {
      console.log("Preparing ClipNuke features.");
      prepareClipNuke();
      autofill();
      loadDefaults();
    }
  });
//observe changes
observer.observe(div, {
  attributes: true
});

/*
 * Prepare ClipNuke
 */
function prepareClipNuke() {
  var page = 1;
  jQuery("div.videoDataBlock > .blockContentContainer:first").before(`<button id="clipnuke-fetch-clips" style="padding:5px;margin-right:5px;margin-top:7px;">Autofill Form via ClipNuke</button><input id="clipnuke-search" placeholder="Search your clips" style="padding:5px;">`);
  // Override PH behavior.
  jQuery("#clipnuke-fetch-clips").click(function(event){
    event.preventDefault();
  });
  jQuery("#clipnuke-search").click(function(event){
    event.preventDefault();
  });
  jQuery("#clipnuke-fetch-clips").click(function(){
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
            jQuery("#clipnuke-fetch-clips").text("Next Page");
            jQuery("#clipnuke-results tbody").append(`<tr><td><img src="${img}" width="100px"></td><td style="float:left;padding: 5px;">${name}</td><td style="padding:5px;">${date}</td><td style="padding:5px;"><button class="clipnuke-autofill-form" data-id="${id}">Select</button></td></tr>`);
          });
          jQuery(".clipnuke-autofill-form").click(function(event){
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

  });
  jQuery('#clipnuke-search').bind("enterKey",function(e){
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
            jQuery("#clipnuke-results tbody").append(`<tr><td><img src="${img}" width="100px"></td><td style="float:left;padding: 5px;">${name}</td><td style="padding:5px;">${date}</td><td style="padding:5px;"><button class="clipnuke-autofill-form" data-id="${id}">Select</button></td></tr>`);
          });
          jQuery(".clipnuke-autofill-form").click(function(event){
            event.preventDefault();
          });
          initTable();
          console.log(data); // yes response came, execute success()
        } else {
          // Failure
        }
      }
    });
  });
  jQuery("#clipnuke-search").keyup(function(e){
    if(e.keyCode == 13) {
      jQuery(this).trigger("enterKey");
    }
  });
};

function initTable(){
  jQuery(".clipnuke-autofill-form").click(function(){
    var id = jQuery(this).data('id');
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

          // Autofill form
          jQuery(`input[name="ClipTitle"]`).val(data.name);
          var cleanDesc = data.description.replace(/kid|xxxmultimedia.com|xxxmultimedia|teenager|force|forced/g,'');
          tinyMCE.activeEditor.setContent(`${cleanDesc}`, {format: "raw"});
          // jQuery(`[name="ClipName"]`).val();

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
  jQuery("div.videoDataBlock > .blockContentContainer:first").before(html);
}

/*
 * Autofill Form
 */
function autofill() {
  // Verify User
  // jQuery("#dropDownColumn_1_1 > div.uploaderDropDownContainer").addClass("hoverActive");
  jQuery("#dropDownVerify_1_1 > li.alpha").click();
  // jQuery("#dropDownColumn_1_1 > div.uploaderDropDownContainer").removeClass("hoverActive");

  /*
   * When will this be published
   * Values: now, date
   */
  var datePublished = "now";
  jQuery(`li[data-schedule-type="now"]`).click();
  if (datePublished == "date") {
    var date = "";
    jQuery(".clipHubDateInput").val(date); // YYYY-MM-DD
    jQuery(`li[data-schedule-time="01:00:00 AM"]`).click(); // HH:mm:ss AM/PM
    jQuery(`li[data-schedule-timezone="US/Eastern"]`).click(); // Timezone
  }

  // Title
  jQuery("#titleTmplField_1").val("test");

  // Tick all the consent boxes
  jQuery("#js-above18_1").attr("checked", true);
  jQuery("#js-verifiedContent_1").attr("checked", true);
  jQuery("#js-uponRequest_1").attr("checked", true);
  jQuery("#js-validContent_1").attr("checked", true);

  // Fallback
  jQuery(`span[data-name="above18"]`).click();
  jQuery(`span[data-name="verifiedContent"]`).click();
  jQuery(`span[data-name="uponRequest"]`).click();
  jQuery(`span[data-name="validContent"]`).click();
}
