import secrets from "secrets";

chrome.storage.sync.set({clipnuke_api_key: secrets.clipnuke_api_key}, function() {
  console.log('Value is set to ' + value);
});

chrome.storage.sync.get(['key'], function(result) {
  console.log('Value currently is ' + result.key);
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
