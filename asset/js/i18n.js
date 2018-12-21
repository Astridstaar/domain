var currency = "USA";
var aid = "0";

//var cctld = 'com';
var cctld = getTLD();

var countrycode_ip = countries[GeoIP['MAYA_COUNTRY_CODE']];

$.i18n.setDictionary(i18n_js_vars);

setCCandCurrency(getTLD());


var cc_ip = $(document).getUrlParam("countrycode_ip");
if (cc_ip){ // for debugging cc promos
    countrycode_ip = cc_ip;
}

var cc_tld = $(document).getUrlParam("countrycode_tld");
if (cc_tld){ // for debugging cc promos
    countrycode_tld = cc_tld;
}

function _(str, params){
    //alert(str + params);
    return $.i18n._(str, params);
}; // _ shortcut for i18n

function setCCandCurrency(tld){
    switch(tld){
        case "com": countrycode_tld = "USA"; currency = "USA"; aid="0"; break; 
        case "co.uk": countrycode_tld = "GB"; currency = "UK"; aid="1"; break; 
        case "com.au": countrycode_tld = "AU"; currency = "AU"; aid="2"; break;
        case "co.nz": countrycode_tld = "NZ"; currency = "NZ"; aid="3"; break;
        default: countrycode_tld = "USA"; currency = "USA"; break; 
    }
}

function getTLD() {
    return document.domain.substring(document.domain.search('lycos')+6,document.domain.length);
}




