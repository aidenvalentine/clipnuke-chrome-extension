/* Clips4Sale - Add New Clip Page
 * https://admin.clips4sale.com/clips/show
 */
 // @TODO We need to get the window object var tinyMCE so we can populate the description field.
// var tinyMCE = retrieveWindowVariables(["tinyMCE"]);
var page = 1;
$("#html5Uploaders").before(`<button id="clipnuke-fetch-clips">Autofill Form via ClipNuke</button><input id="clipnuke-search" placeholder="Search your clips">`);
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

          // Autofill form
          $(`input[name="ClipTitle"]`).val(data.name);
          var cleanDesc = data.description.replace(/kid|xxxmultimedia.com|xxxmultimedia|teenager|force|forced/g,'');
          tinyMCE.activeEditor.setContent(`${cleanDesc}`, {format: "raw"});
          // $(`[name="ClipName"]`).val();

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
