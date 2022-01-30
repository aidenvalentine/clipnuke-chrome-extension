var userData = {};
userData.email = "aiden@xxxmultimedia.com";
chrome.storage.sync.set({user: userData}, function() {
  console.log('Value is set to ' + JSON.stringify(userData));
});

window.addEventListener('load', function() {
  $.ajax({
    url: "https://clipnuke.com/wp-json/",
    type: "get",
    cache: false,
    crossDomain: true,
    asynchronous: false,
    jsonpCallback: 'deadCode',
    timeout: 10000, // set a timeout in milliseconds
    complete: function(xhr, responseText, thrownError) {
      if (xhr.status == "200") {
        $("#panelContainer").append("<p>ClipNuke is Online.</p>");
        console.log(responseText); // yes response came, execute success()
      } else {
        // Failure
      }
    }
  });
});
