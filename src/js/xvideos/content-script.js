/* XVideos - Add New Clip Page
 * https://www.xvideos.com/account/uploads/new
 */
var page = 1; // Increment results pages
$("div.panel-body").before(`<button id="clipnuke-fetch-clips" style="color:#000;margin:5px;">Latest ClipNuke Clips</button><input id="clipnuke-search" placeholder="Search on ClipNuke" style="color:#000">`);

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

          // Autofill form
          // Title
          $(`#upload_form_titledesc_title`).val(data.name);
          // Description
          var cleanDesc = data.description.replace(/kid|xxxmultimedia.com|xxxmultimedia|teenager|force|forced/g,'');
          $("#upload_form_titledesc_description").val(cleanDesc.replace(/(<([^>]+)>)/ig,"")); // Replace strips HTML tags from desc.
          // Tags
          $('button[data-role="add"]').click(); // Init 1st input
          $.each(data.tags, function(key, value){
            $(".tag-list input").val(value.name);
            $('button[data-role="add"]').click(); // Submit
            console.log(value.name);
          });

          // Certify you have rights to video
          $("#upload_form_file_terms").prop('checked', true);

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
