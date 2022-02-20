var event = {};
event.translations = [{
  lang: "en",
  xvideosTitle: "This is simply a fucking test",
  networkTitle: "A test network description on this bad boy."
}, {
  lang: "es",
  xvideosTitle: "Yo soy Alejandro. Tengo quince anos.",
  networkTitle: "Tu madre no es sopa",

}];
console.log(event);
if (event["translations"][0]) {
  $('#upload_form_title_translations_title_translations > button').click();
  $('a[data-locale="' + event["translations"][0]["lang"] + '"]').click();
  $('#upload_form_title_translations_title_translations_tr_0_tr_0_title').val(event["translations"][0]["xvideosTitle"]);
  if (event["translations"][0]["lang"] && event["translations"][0]["networkTitle"]) {
    $('#upload_form_title_translations_title_network_translations_ntr_0 > div > div > div > span > button').click();
    $('a[data-locale="' + event["translations"][0]["lang"] + '"]').click();
    $('#upload_form_title_translations_title_network_translations_ntr_0_ntr_0_title').val(event["translations"][0]["networkTitle"]);
  }
}
if (event["translations"][1]) {
  $('#upload_form_title_translations_title_translations > button').click();
  $('a[data-locale="' + event["translations"][1]["lang"] + '"]').click();
  $('#upload_form_title_translations_title_translations_tr_1_tr_1_title').val(event["translations"][1]["xvideosTitle"]);
  if (event["translations"][1]["lang"] && event["translations"][1]["networkTitle"]) {
    $('#upload_form_title_translations_title_network_translations > button').click();
    $('a[data-locale="' + event["translations"][1]["lang"] + '"]').click();
    $('#upload_form_title_translations_title_network_translations_ntr_1_ntr_1_title').val(event["translations"][1]["networkTitle"]);
  }
}
