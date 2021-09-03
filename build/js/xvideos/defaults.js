/*
 * Defaults
 */
var script = `function changeDefaultFreePaying() {
  $("#upload_form_video_premium_video_premium_centered_zone_all_site").click(function() {
    saveDefaultFreePaying(this.id);
  });
  $("#upload_form_video_premium_video_premium_centered_zone_premium").click(function() {
    saveDefaultFreePaying(this.id);
  });
};`;

function saveDefaultFreePaying(elemId) {
  if (confirm('Are you sure you want to save this as the default?')) {
    localStorage.setItem('free_or_paying', elemId);
    $("#upload_form_video_premium_video_premium_centered_zone_all_site", "#upload_form_video_premium_video_premium_centered_zone_premium").off();
    console.log('New default was saved to the database.');
  } else {
    console.log('New default was not saved to the database.');
  }
};

var ss = document.createElement("script");
ss.innerHTML= script;
document.documentElement.appendChild(ss);

/* Secure communicate between DOM and extension */
var port = chrome.runtime.connect();

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "FROM_PAGE")) {
    console.log("Content script received: " + event.data.text);
    port.postMessage(event.data.text);
  }
}, false);

document.getElementById("span.icf-close-circle").addEventListener("click",
    function() {
  window.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*");
}, false);
