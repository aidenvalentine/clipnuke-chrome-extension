;
(function(window) {
  var api = atob('aHR0cHM6Ly9hcGkubWl4cGFuZWwuY29t');
  var app = window.app = window.app || {};

  var mp = {};

  function init() {
    chrome.storage.sync.get(['user'], function(result) {
      // console.debug('Value currently is ' + JSON.stringify(result));
      console.debug(`User: ${result.user.email}`);
      mp.distinct_id = result.user.email;
    });
    mp.token = atob('MmYyNjU3MWE3MmQ1NTFjMWEwZTZjMzg1YjljNTY4ODM=');
  }

  function track(event) {
    // var obj = {};
    // $.getJSON('https://json.geoiplookup.io/?callback=?', function(data) {
    //   obj = data;
    //   console.log(JSON.stringify(data, null, 2));
    // });

    // Detect OS
    var OSName = navigator.platform;
    if (navigator.userAgent.indexOf("Win") != -1) OSName = "Windows";
    if (navigator.userAgent.indexOf("Mac") != -1) OSName = "Macintosh";
    if (navigator.userAgent.indexOf("Linux") != -1) OSName = "Linux";
    var payload = {
      event: event,
      properties: {
        distinct_id: mp.distinct_id,
        token: mp.token,
        $browser: navigator.userAgentData.brands[0].brand,
        $browser_version: navigator.userAgentData.brands[0].version,
        $device: navigator.userAgent,
        // $device_id: mp.deviceId,
        $user_id: mp.distinct_id,
        $current_url: window.location.href,
        $os: OSName,
        $referrer: document.referrer,
        $referring_domain: function() {
          if (document.referrer) {
            return new URL(document.referrer).host;
          } else {
            return '';
          }
        },
        $screen_height: window.screen.height,
        $screen_width: window.screen.width,
        // $initial_referrer: document.referrer,
        // $initial_referring_domain: new URL(document.referrer).host,
        connectionType: navigator.connection.effectiveType,
        rtt: navigator.connection.rtt,
        downlink: navigator.connection.downlink,
        language: navigator.language,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: navigator.deviceMemory,
        platform: navigator.platform,
        browserWidth: window.innerWidth,
        browserHeight: window.innerHeight,
        host: window.location.host,
        path: window.location.pathname
        // ip: obj.ip
      }
    };

    var data = btoa(JSON.stringify(payload));
    var url = api + '/track?data=' + data;

    $.get(url, function(code) {
      if (code == 1) {
        console.debug("Analytics: Success.");
      } else {
        console.debug("Analytics: Error.");
      }
    });
  }

  function identify(email) {

  }

  function pornhub(event) {
    /* PH properties
    window.UPLOAD_VIDEODATA.userId; // PH User ID
    window.UPLOAD_VIDEODATA.isContentPartner;
    jQuery(".smallAvatar")[0].src; // User's PornHub Avatar
    jQuery("#profileMenuDropdown li span a").attr("href"); // Profile URL
    jQuery("#profileMenuDropdown li span a").attr("title"); // Name
    */
  }

  /* UUID Helper */
  // crypto.randomUUID();

  app.analytics = {
    init: init,
    track: track,
    identify: identify
  };

})(window);
