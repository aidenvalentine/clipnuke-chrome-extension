/* ManyVids - Edit Vid page
 * https://www.manyvids.com/Edit-vid/1968943/
 */
var page = 1;
$("#videoSettingsForm").before(`<button id="clipnuke-fetch-clips" style="margin-right:5px;padding: 9px;margin-bottom: 5px;">Autofill Form via ClipNuke</button><input id="clipnuke-search" placeholder="Search your clips"><hr />`); // @TODO Make named function
$(`button.submit.js-edit-video`).before(`<a class="btn btn-primary" id="linkToClipNuke" style="color:white;">Link to ClipNuke</a>`)

isClipNukeUrlQuerySet();
clipNukePopupHtml();
populateFromLocalStorage();

function populateFromLocalStorage() {
    $(`#Title`).val(localStorage.getItem("clipnuke-name"));
    var cleanText = localStorage.getItem("clipnuke-description").replace(/<\/?[^>]+(>|$)/g, "");
    $(`textarea[name="video_description"]`).val(cleanText);
    $(`input[name="video_cost"]`).val(localStorage.getItem("clipnuke-price"));
    $(`input.vid-categories`).val(localStorage.getItem("clipnuke-categories"));
    var categories = localStorage.getItem("clipnuke-categories");
    categories.split(/\s*,\s*/).forEach(function(val) {
        console.log(val);
        $(`ul.dropdown-menu > li > a:icontains("${val}")`).trigger("click");
    });
}

/**
 * Get important data from the ManyVids page
 * @return {Obj} Manyvids vid data
 */
function getDataFromForm() {
  var data = {};
  data.id = getUrlParameter("cn-id");
  data.meta_data = [];
  var obj = {};
  obj.key = "manyvids_id";
  obj.value = $('input[name=video_id]').val();
  data.meta_data.push(obj);
  return data;
}

/**
 * If ClipNuke ID is in the New Video URL -- Fetch and prefill form & update clipnuke on save.
 * @return {[type]} [description]
 */
function isClipNukeUrlQuerySet() {
  var id = getUrlParameter("cn-id");
  if (id) {
    console.log(`Query Parameter cn-id Exists!\nPrefilling form with ClipNuke's data for this video.`);
    var data = woocommerceGetProduct(id, function(err, data) {
      saveDataToLocalStorage(data);
    });
  } else {
    // break;
  }
}

/**
 * Save ClipNuke Data to LocalStorage
 * Store /wp-json/wc/v3/product/<id> response in the LocalStorage so we can inject it into the manyvids.com/Edit-vid/<id> page when the user is on it.
 * @param  {Object} data               WC data
 */
function saveDataToLocalStorage(data) {
  localStorage.setItem("clipnuke-test", "TEST");
  localStorage.setItem("clipnuke-name", data.name);
  localStorage.setItem("clipnuke-description", data.description);
  data.meta_data.forEach(function(element) {
    if (element.key == "c4s_price") {
      console.log(`Price: ${element.value}`);
      localStorage.setItem("clipnuke-price", element.value);
      return;
    }
  });
  data.meta_data.forEach(function(element) {
    if (element.key == "categories") {
      console.log(`Categories: ${element.value}`);
      localStorage.setItem("clipnuke-categories", element.value);
      return;
    }
  });
  populateFromLocalStorage(); // Then autofill form if we're on the edit form page.
}

function clipNukePopupHtml() {
  var html = `<div id="clipnuke-dialog" class="ui-dialog-content ui-widget-content" style="width: auto; min-height: 0px; max-height: none; height: 108.887px; display:none;">
    <p>Would you like to add this video to your ClipNuke account?</p>
    <p>We'll create a new video. Or if you already added this video to ClipNuke it will update the Clips4sale section of your ClipNuke video using this info.</p>
  </div>`;
  jQuery('body').append(html);
}

function saveToClipNukePopup() {
  jQuery( "#clipnuke-dialog" ).dialog({
    dialogClass: "no-close",
    buttons: [
      {
        text: "Add to ClipNuke",
        click: function() {
          var id = getUrlParameter("cn-id"); // ClipNuke Video ID
          saveToClipnuke(id);
          jQuery( this ).dialog( "close" );
        }
      }, {
        text: "Skip",
        click: function() {
          jQuery( this ).dialog( "close" );
        }
      }
    ]
  });
}

function saveToClipnuke(id) {
  var data = getDataFromForm();
  if (id) {
    // Update clipnuke product
    woocommerceSaveProduct(id, data);
  } else {
    // New clipnuke product
    woocommerceSaveProduct("", data);
  }
}

/**
 * Deletes Video From ManyVids
 */
$(document).on("click", "#removeFromLibrary", function() {
    var t = $(this).attr("data-id");
    m = {
        vid: t
    },
    $.ajax({
        type: "POST",
        url: "/includes/removeFromLibrary.php",
        data: m,
        success: function(e) {
            e.error ? gritter(e.error, "Oops!") : (success(e.success, "Great!"),
            0 < $(".vid-list.library").length && $("a.delvideo[data-type=library][data-id=" + t + "]").parents(".video-summary").parent().remove(),
            $("#genericPopup").modal("hide"))
        },
        error: function() {},
        dataType: "json"
    })
})

/**
 * HELPERS
 */

// HELPER - Read a page's GET URL variables and return them as an associative array.
function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

/**
 * Creates case insensitive jQuery selector.
 * For searching for categories.
 */
jQuery.expr[':'].icontains = function(a, i, m) {
  return jQuery(a).text().toUpperCase()
      .indexOf(m[3].toUpperCase()) >= 0;
};

/**
* ClipNuke - Get Product JSON data from ClipNuke API
* @param  {Integer} id               ClipNuke Video ID
* @return {Obj}                      Response object from ClipNuke API containing video data or error.
*/
function woocommerceGetProduct(id, callback) {
  var apiUrl = `https://clipnuke.com/wp-json/wc/v3/products/`;
  console.log(`Sending HTTP GET Request: ${apiUrl}${id}`);
  $.ajax({
    url: `${apiUrl}${id}`,
    type: "get",
    cache: false,
    crossDomain: true,
    asynchronous: false,
    jsonpCallback: 'deadCode',
    timeout: 10000, // set a timeout in milliseconds
    complete: function(xhr, responseText, thrownError) {
      if (xhr.status == "200") {
        console.log(`Success! Product #${id} was fetched from ClipNuke.`);
        console.log(xhr.responseJSON);
        callback(null, xhr.responseJSON);
        return xhr.responseJSON;
      }
    }
  });
};

function woocommerceSaveProduct(id, data={}) {
  var apiUrl = `https://clipnuke.com/wp-json/wc/v3/products/`;
  console.log(`Sending HTTP POST Request: ${apiUrl}${id}`);
  $.ajax({
    url: `${apiUrl}${id}`,
    type: "post",
    data: data,
    cache: false,
    crossDomain: true,
    asynchronous: false,
    jsonpCallback: 'deadCode',
    timeout: 10000, // set a timeout in milliseconds
    complete: function(xhr, responseText, thrownError) {
      if (xhr.status == "200") {
        console.log(`Success! Product #${id} was saved to ClipNuke.`);
        console.log(xhr.responseJSON);
        callback(null, xhr.responseJSON);
        return xhr.responseJSON;
      }
    }
  });
};

var bannedKeywords = "!nt0x,!ntox,$hit,$hits,1488,1nt0x,1ntox,1ntoxication,4bus1v3,4bus3,4bus3d,4busiv3,4ced,4n1m4l,4sl33p,4ss3d out,a-buse,A-l-c-o-h-o-l,a-play,ab0se,Abduct,Abducting,Abduction,Abductions,abus3,abus3d,abuse,abused,abuses,abusing,ach.0hol,ag3play,age play,age regression,ageplay,ageregression,alcoh0l,alcohol,an1mal,animal,Animal Sex,aplay,asleep,asphyxia,asphyxiate,Asphyxiation,asphyxicate,asphyxication,Autopsy,Autopsy Photos,b.l.o.o.d,b100d,b100dy,Babies,Baby,babyshivid,Beastality,beastiality,bestiality,bl.o.o.d,bl.ood,bl@@d,bl00d,bl00dy,bl0od,bl33d,Blacked Out,Blacking Out,bled,bleed,bleeding,bleeds,blo0d,blo1o1d,blo44od,blo44odshot,blood,Blood Bath,Bloodbath,bloody,blud,Bong,Boozed,Boozing,Brainwash,Brainwashed,Brainwasher,Brainwashes,Brainwashing,Brut4l,brutal,brutality,brutalization,c n c,c-n-c,c.n.c.,c03rc3d,Ca$h Point Meet,Ca$hpoint,Ca$hpoint Meet,cannibal,cannibalism,Captor,Captured,Captures,Capturing,Cash Point,Cash Point Meet,CashMeet,Cashpoint,CD9,ch0k1ng,ch0k3,ch0k3d,ch0ke,ch0king,ch1ldr3ns,child,children,chink,Chloriform,chloroform,chloroformed,Chloroforming,chok1ing,choke,choked,chokes,choking,Chronophilia,cnc,coerc3d,Coerce,coerced,Coercion,Coma,Crushing,D R U N K,d unk,D-r-u-n-k,d.rug,d.rugs,disgrace,disgraced,Dog Sex,Doobie,Dope,dr unk,dr-unk,Dr!n!k,dr.ug,dr@nken,Dr1nk,dr1nk1ng,dr2u3nken,dri nking,drink,drinkin,drinking,drinks,drlnk,dru nk,dru6,dru66ed,dru6s,drug,drugged,drugging,drugs,drunk,drunken,drunkk,druuunk,Dube,early teen,early teens,ephebophilia,f o r c e d,f()rced,f0.rced,f0r.c3d,f0r.ced,f0rc3d,f0rce,f0rced,f0rces,Fan Fuck,FanFuck,Farm Sex,fecal,Feces,fetal,foetal,for.c3d,for.ced,forc'd,forc3d,forcd,force,force33d,forced,forced bi,forced fem,forced-bi,forcedbi,forcedd,forcedfemme,forceed,forcefucked,forceful,forcefully,forces,forcing,gang-rapeed,Gorilla,Guerilla,H Y P N O,h y p n o s i s,h y p n o t i c,h-y-p-n-o,h-y-p-no-sis,h.yp.no,h@pnotic,hebephilia,hhypn0sis,hipnosis,hussyfan,hy-p-n0,hy-p-no,hy-pn0,hy-pno,hy...notic,hy.p.n.o,hy.pn.0,hy.pn.0.,hy.pn.0sis,hy.pn.0tized,hy.pnotic,hy.pnotizing,hy=pnotic,hyno,hynotise,hynotised,hynotize,hynotized,hyp,hyp.n0,hyp.no,hyp.notic,hyp0,hypn,hypn.0.sis,hypn.o.sis,hypn0,hypn0 s1s,hypn0-sub,hypn0$i$,hypn0s1s,hypn0sis,hypn0sub,hypn0t!ze,hypn0t1c,hypn0therapy,hypn0tic,hypn0tiized,hypn0tist,hypn0tize,hypn0tizing,hypno,hypno sis,hypno-sub,hypno$i$,hypnodomme,hypnodomme!,hypnofetish,hypnoo,hypnose,hypnose-,hypnoses,hypnosi,hypnosi s,hypnosis,hypnosis sub,hypnosisub,hypnossis,hypnosub,hypnoteuse,hypnotic,hypnotic spell,hypnotic.,hypnotice,hypnotiq,hypnotise,hypnotised,hypnotism,hypnotist,hypnotixed,hypnotize,hypnotized,hypnotizes,hypnotizing,hypnoziz,hypnoziz.,hyposis,hypotised,hypotized,i n t o x i c a t i n g,i-n-t-o-x d-r-i-n-k-i-n-g,Immobilize,Immobilized,in.t.ox,in.t0x,Inc3st,incacitated,incapacitate,incapacitation,inces-tual,incest,Incestrual,inebriated,Inestuous,infant,Infantophilia,int()xicated,int0.x,int0x,int0xicate,int0xicated,int0xicates,int0xicating,int0xicatio..n,int0xication,into.x,into.xication,intox,intox.icated,intoxicants,intoxicate,intoxicated,intoxicates,intoxicating,intoxication,intxicating,involunt,involuntarily,involuntary,Inzest,Irreversible,K!dn@pping,k!dnapped,k!ll,K!llll,k1dn@p,k1dn@pped,k1dn4pp3d,k1dnapped,k1ll,k1ll3d,k1lled,Kid,kiddie,kidn4pp3d,kidnap,kidnaped,kidnaping,kidnapp3d,kidnapped,kidnapping,kidnaps,Kids,kill,killed,killing,kills,kingpass,kn!fe,kn1fe,knee grow,kneegrow,knif3,knife,KPC,Light Up,Lighting Up,Lights Up,liquor,Little boy,Little girl,Loli,Lolicon,Lolita,Loses Consciousness,Losing Consciousness,Lost Consciousness,lynched,lynching,menstrual,menstruate,Menstruating,menstruation,Mind Control,Minors,molest,molestation,molested,Molesting,Molestor,murd3r3r,murder,Murdered,Murderer,Murdering,mutilate,Mutilated,Mutilating,mutilation,N@gg 3r,N@gg3r,N*gg*r,N*gger,N2gg 3r$,Nambla,necrophilia,Negro,ngga,nibba,nig.ga,NIG*ERS,nigga,niggas,niggaz,nigger,Nigger!,niggerized,Niggers,niqqer,Non-consent,P 0p P3 rs,p-ppers,P....0p...pers,p...op....ers,p.0.pp.ers,p.0.ppers,p.op.ers,p()ppers,p0.ppers,p00,p0p p3rs,p0p per,p0p pers,p0p-pers,p0p.per,p0p.pers,p0pp3r,p0pp3r$,p0pp3rs,p0pper,p0pperr,p0ppers,p3r10d,P911,Paralyzed,passed out,passes out,pe-riod,Pederast,pedo,pedofile,pedophile,pedophilia,peopper,perio d,period,periodd,Phebophilia,pidofil,pidofile,pidophile,PO-PPERS,po.ppers,poo,poop,pop per,pop pers,pop.per,pop.pers,pop3p3ers,popp3rs,popp3rzs,popper,poppers,poppers intox,poppersintox,pOpperz,poppper,Ppoppers,Pre teen,Pre-teen,Preteen,pthc,ptsc,puke,puked,pukes,puking,R.A.P.E,r.aceplay,r.ape,r.aped,r@cepl@y,r@ceplay,r@p3,r@pe,r@ygold,r$ped,r3p3,r4c1st,r4p3,r4pe,rac3play,race play,race-play,race.play,racepl@y,raceplay,Racism,racist,rap3d,rape,raped,rapemeat,rapes,raping,rapist,rarted,Reefer,reetart,retard,retarded,s.h.i.t,s'mother,Sc@t,scat,scratched,sedate,Sedated,Sedating,sedation,sedative,Self-mutilation,sh it,sh!t,sh.it,sh1t,shit,Shitface,Shitfaded,Shitstain,Shitstained,Shitstainer,Shitstainers,Shitstaining,Shitstains,Shitting,Simulated Minors,Skat,Skyp3,Skype,sl33p,sleep,Sleepin,sleeping,sleeps,slumber,sm.othered,sm0_thered,sm0th3r,sm0th3r1ng,sm0th3r3d,sm0th3ring,sm0ther,sm0thered,sm0thering,smothe.red,smother,smothered,smothering,Smuggle,Smuggling,sniff poppers,snuff,snuffed,snuffing,snuffs,Squash,Squish,stoned,str@ngle,str4ngl3,str4ngl3d,str4ngle,str4ngling,strangle,Strangled,Strangling,Strangulation,suf.focate,suff.ocate,suff0c4t3d,suffo.cated,Suffoc@te,suffocate,suffocating,suffocation,Suicide,t0.rtur3,t0rtu3,t0rtur3,t0rtur3d,t0rtur3s,t0rture,t0rtured,t0rtures,Tard,Teenaged,Teenager,tortur3s,torture,tortured,tortures,torturing,Trafficking,Turd,u!conscious,uconscious,unc0nsc10us,unconscious,Unconsciousness,Under 18,Under age,underage,unwilling,Vape,Vaporizer,violate,violation,Violence,Vodka,vomit,vomited,vomiting,vomits,w4st3d,wasted,Water Pipe,Weapons,Whiskey,Wine,Young Teen,Young Teenager,zoophilia,zzzzzzzzzz";
