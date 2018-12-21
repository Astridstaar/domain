var update_timer;

function update(message, level) {
    // Level 0: warning (disappears)
    // Level 1: error (disappears)
    // Level 2: error (remains)
    // Level 3: error (remains; red)
    clearTimeout(update_timer);
    $('#alert_message').html(message);  
    if ( $("#alert").css("display") != "block" ){
        $("#alert").show("blind").animate({opacity: 1.0}, 2500);
    }
    if (! level || level < 2){ update_timer = setTimeout(hideUpdate, 2500); }
    if (level > 2) {
	// Make 'error' message red.
	$('#alert').css('background','#EED0D0 url("/images/icon_info.png") no-repeat scroll 7px 2px');
    } else {
	// Reset color if necessary (or not).
	$('#alert').css('background','#E6EEEE url("/images/icon_info.png") no-repeat scroll 7px 2px');
    }

}

function hideUpdate(){
    $("#alert").animate({opacity: 0}, 2000).hide("blind");
    $('#alert').css('background','#E6EEEE url("/images/icon_info.png") no-repeat scroll 7px 2px');
}

//var ajaxformoptions = { 
//    dataType:        'json', 
//    success:  showResponse
//}; 


function makeLinksWork(){
  $('a[rel*=help]').facebox({
        loadingImage : '/images/loading.gif',
        closeImage   : '/images/closelabel.gif'
    }); 
//    var options = { 
//        dataType:        'json', 
//        success:  showResponse
//    }; 
  //$('.ajaxform').removeAttr("action");
//  $('.ajaxform').ajaxForm(options); 
}

function view(type) {
    if (type < 10){
        //reloadtab(type);
        $('#tabs').tabs('select', '#sect_' + tablist[type]);
    } else {
        $('#tabs').tabs('select', '#sect_' + type);
    }
}



function showResponse(responseText, statusText)  { 
    //if (debugging) {  Dumper.alert( this); }
    var myresponse = eval(responseText);
    //getAssignment();
    manage_domain(current_domain);
    update( myresponse.message); 
} 

function track(tag){
    var path = location.pathname;
    if (path == "/") { path = "/index.html"; }
    pageTracker._trackPageview(path + "/" + tag);
}

function help(type, domain){

        //track("help/"+type);

    switch(type){
        case "privacy":
            $.facebox(_("common_js_facebox_privacy")); break;
        case "premium":
            $.facebox(_("common_js_facebox_premium")); break;
        case "faqwhat":
            $.facebox(_("common_js_facebox_faq_domain_what")); break;
        case "faqwhy":
            $.facebox(_("common_js_facebox_faq_domain_why")); break;
        case "faqnowebsite":
            $.facebox(_("common_js_facebox_faq_nowebsite")); break;
        case "faqconnectdomain":
            $.facebox(_("common_js_facebox_faq_connectdomain")); break;
        case "faqwaiting":
            $.facebox(_("common_js_facebox_faq_waiting")); break;
        case "faqemailincluded":
            $.facebox(_("common_js_facebox_faq_mailincluded")); break;
        case "faqreceiveemail":
            $.facebox(_("common_js_facebox_faq_receivemail")); break;
        case "faqhost":
            $.facebox(_("common_js_facebox_faq_host")); break;
        case "faqrules":
            $.facebox(_("common_js_facebox_faq_rules")); break;
        case "faqreserve":
            $.facebox(_("common_js_facebox_faq_reserve")); break;
        case "hosting":
            $.facebox('<a href="http://www.tripod.lycos.com/compare/index.tmpl" target="_blank"><img src="/images/tripod_ad.png"></a>'); break;
        case "pricing": // Seems like pricing shouldn't be hard-coded into this help box :(
            $.facebox(_("common_js_facebox_pricing")); break;
        case "newsite":
            $.facebox(_("common_js_facebox_newsite")); break;
        case "account_contact":
            $.facebox(_("common_js_facebox_contact")); break;
        case "feedback":
            $.facebox('<iframe src="https://spreadsheets.google.com/embeddedform?key=tb-wII1AlY3QI_1ULK39rqw" width="620" height="906" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>'); break;
        case "pop":
            $.facebox(_("common_js_facebox_pop")); break;
        case "forwards":
            $.facebox(_("common_js_facebox_forwards")); break;
        case "alias":
            $.facebox(_("common_js_facebox_alias")); break;
        case "popsettings":
            $.facebox(_("common_js_facebox_popsettings")); break;
        case "lockstatus":
            $.facebox(_("common_js_facebox_lockstatus")); break;
        case "sitelock":
            $.facebox(_("common_js_facebox_sitelock")); break;
        case "catchall":
            $.facebox(_("common_js_facebox_catchall")); break;
        case "cashparking_status_attempted":
	    $.facebox(_("common_js_facebox_cashparking_attempt")); break;
        case "cashparking_status_pending":
	    $.facebox(_("common_js_facebox_cashparking_pending")); break;
        case "cashparking_status_active":
	    $.facebox(_("common_js_facebox_cashparking_active")); break;
        case "cashparking_status_inactive":
	    $.facebox(_("common_js_facebox_cashparking_inactive")); break;

    }
}





// awesome  // more awesome, handles multiple elements now
jQuery.fn.makeidletext = function() {
    var elements = new Array();
    var text = arguments[0]; // It's your object of arguments
    for (i=0; i <= this.length; i++){
        var element = $(this[i]); // It's your element
        //var dataSource = args.dataSource;
        //var pagingStart = args.pagingStart;
        element.addClass('idletext');
        element.attr('value', text);
        element.blur(function () {
            if ($(this).val() == "") {
                $(this).addClass("idletext").val(text);
            }
        });
        element.click(function () {
            if ($(this).hasClass("idletext")) {
                $(this).val("").removeClass("idletext");
            }
        });
        elements.push(element);
        }
    return elements
};

jQuery.fn.maxHeight = function() {
    var elements = new Array();
    var maxheight = 0;
    for (i=0; i <= this.length; i++){
        var element = $(this[i]); // It's your element
        if (element.innerHeight() > maxheight){
            maxheight = element.innerHeight();
        }
    }
    return maxheight; 
};




