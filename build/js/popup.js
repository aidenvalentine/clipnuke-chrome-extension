$(`#login`).click(function() {
  var data = {};
  data.username = $('#email').val();
  data.password = $('#password').val();
  jQuery.ajax({
    url: `https://clipnuke.com/wp-json/clipnuke-extension/login`,
    type: "post",
    data: data,
    dataType: "text json",
    cache: false,
    crossDomain: true,
    asynchronous: false,
    jsonpCallback: 'deadCode',
    timeout: 10000, // set a timeout in milliseconds
    complete: function(xhr, responseText, thrownError) {
      console.log("Login request sent.");
      if (xhr.status == "200") {
        $('.wrong-userpass').remove(); // Clear wrong password alert if triggered.
        $('.panelContainer').hide();
        // console.log(responseText)
        // Save to user's browser across all instances.
        chrome.storage.sync.set({
          user: data
        }, function() {
          console.log(`Value is set to ${data}`);
          $('#optionsMenuUserName').text(data.username);
        });
      } else {
        console.log(xhr);
        if (!$('.wrong-userpass').length) {
          $('form').prepend(`<div class="alert alert-danger wrong-userpass" role="alert">${xhr.responseText}</div>`);
        }
      }
    }
  });

});

chrome.storage.sync.get("user", function(userdata) {
  // console.log('Storage Sync is set to ' + JSON.stringify(user));
  $('#optionsMenuUserName').text(userdata.user.username);
  console.log(`Hello ${userdata.user.username}`);
  $('#username').text(userdata.user.username);
  if (!userdata.user.username && !userdata.user.password) {
    // If not logged in, show login/register form.
    $('.panelContainer').show();
  }
});

// $('.panelContainer').show(); // Debug
