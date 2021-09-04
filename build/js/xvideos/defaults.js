/*
 * Defaults
 * Changes user's autofill settings for the page and stores it.
 */

// Free/Paying Users?
$("#upload_form_video_premium legend").append(`<a id="save-default-free-paying" style="color:#ff0000">Save default</a>`);
// Tick default free/paying on page load.
var defaultFreePayingElemId = localStorage.getItem('free_or_paying');
if (defaultFreePayingElemId) {
  $('#'+defaultFreePayingElemId).prop('checked', true);
}
// Free/Paying option.
$('#save-default-free-paying').click(function(){
  var isFree = $('#upload_form_video_premium_video_premium_centered_zone_all_site:checked').length;
  if (isFree) {
    saveDefaultFreePaying('upload_form_video_premium_video_premium_centered_zone_all_site');
  } else {
    saveDefaultFreePaying('upload_form_video_premium_video_premium_centered_zone_premium');
  }
});
function saveDefaultFreePaying(elemId) {
  if (confirm('Are you sure you want to save this as the default?')) {
    localStorage.setItem('free_or_paying', elemId);
    $("#upload_form_video_premium_video_premium_centered_zone_all_site").off(); $("#upload_form_video_premium_video_premium_centered_zone_premium").off();
    $("#change-default-free-paying-instructions").remove();
    console.log('New default was saved to the database.');
  } else {
    console.log('New default was not saved to the database.');
  }
};

// Ads to display/Sponsor Links
$("#upload_form_sponsorlinks legend").append(`<a id="change-default-sponsor-links" style="    margin-left: 8px;">Change default</a>`);
// Tick default sponsor ads on page load.
var defaultAds = JSON.parse(localStorage.getItem('sponsor_ads_to_display'));
if (defaultAds) {
  defaultAds.forEach(function(val){
    $('#upload_form_sponsorlinks_sponsorlinks_'+val).prop('checked', true);
    console.log('Ticking promotional ad #'+val);
  });
}
$('#change-default-sponsor-links').click(function(){
  changeDefaultSponsorLinks();
  $('.form-field-upload_form_sponsorlinks_sponsorlinks div.content').before(`<span id="change-default-sponsor-links-instructions" class="clearfix">Tick which sponsor ads you'd like to set as the default when you add a new video. Then click the red "Save Defaults" link.</span>`);
});
function changeDefaultSponsorLinks() {
  console.log("changeDefaultSponsorLinks()");
  $('#change-default-sponsor-links').remove();
  $("#upload_form_sponsorlinks legend").append(`<a id="save-default-sponsor-links" style="    margin-left: 8px;color:#ff0000">Save default</a>`);
  $('#save-default-sponsor-links').off('click').click(function(){ // off() lets it attach event trigger only once.
    saveDefaultSponsorLinks();
  });
};
function saveDefaultSponsorLinks() {
  if (confirm('Are you sure you want to save these sponsor links as the default?')) {
    var sponsorAds = JSON.stringify($('input[name="upload_form[sponsorlinks][sponsorlinks][]"]:checked').map(function(){return $(this).val();}).get()); // Get array of ad ids
    localStorage.setItem('sponsor_ads_to_display', sponsorAds);
    $("#change-default-sponsor-links-instructions").remove();
    console.log('New default was saved to the database.');
  } else {
    console.log('New default was not saved to the database.');
  }
};
