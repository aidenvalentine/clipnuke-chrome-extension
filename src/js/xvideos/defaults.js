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
$("#upload_form_sponsorlinks legend").append(`<a id="save-default-sponsor-links" style="margin-left: 8px;color: #ff0000">Save default</a>`);
// Tick default sponsor ads on page load.
var defaultAds = JSON.parse(localStorage.getItem('sponsor_ads_to_display'));
if (defaultAds) {
  defaultAds.forEach(function(val){
    $('#upload_form_sponsorlinks_sponsorlinks_'+val).prop('checked', true);
    console.log('Ticking promotional ad #'+val);
  });
}
$('#save-default-sponsor-links').click(function(){
  saveDefaultSponsorLinks();
  // $('.form-field-upload_form_sponsorlinks_sponsorlinks div.content').before(`<span id="change-default-sponsor-links-instructions" class="clearfix">Tick which sponsor ads you'd like to set as the default when you add a new video. Then click the red "Save Defaults" link.</span>`);
});
function saveDefaultSponsorLinks() {
  if (confirm('Are you sure you want to save these sponsor links as the default?')) {
    var val = JSON.stringify($('input[name="upload_form[sponsorlinks][sponsorlinks][]"]:checked').map(function(){return $(this).val();}).get()); // Get array of ad ids
    localStorage.setItem('sponsor_ads_to_display', val);
    $("#change-default-sponsor-links-instructions").remove();
    console.log('New default was saved to the database.');
  } else {
    console.log('New default was not saved to the database.');
  }
};

// Main orientation categories
$("#upload_form_category legend").append(`<a id="save-default-main-orientation-categories" style="margin-left: 8px;color: #ff0000">Save default</a>`);
// Tick default sponsor ads on page load.
var mainOrientationCategories = JSON.parse(localStorage.getItem('main_orientation_categories'));
if (mainOrientationCategories) {
  mainOrientationCategories.forEach(function(val){
    $('#upload_form_category_category_centered_category_'+val).prop('checked', true);
    console.log('Ticking main orientation category '+val);
  });
}
$('#save-default-main-orientation-categories').click(function(){
  saveDefaultMainOrientationCategories();
});
function saveDefaultMainOrientationCategories() {
  if (confirm('Are you sure you want to save these main orientation categories as the default?')) {
    var val = JSON.stringify($('input[name="upload_form[category][category_centered][category][]"]:checked').map(function(){return $(this).val();}).get()); // Get array of ad ids
    localStorage.setItem('main_orientation_categories', val);
    console.log('New default was saved to the database.');
  } else {
    console.log('New default was not saved to the database.');
  }
};
