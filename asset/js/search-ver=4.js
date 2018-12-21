var oocart = new shoppingcart();
var debugging = 0;
var multidomain = 0;
var cctld = 'com';
var search_cctld = '';
var TLDcost = new Array();
var maxresults;
var resultstotal = 0;
var displayCSDomainTxt = false;
var displayWarningOnLeftResults = false;
var selectedDomain;

function toggleAddon(item) {
    //hide current cart contents
    $(".editHide").hide();
    //deselect colors on all rows
    $("table[id=cart] tr").css("background-color", "");

    if ($('table[id=cart] tr[id=' + item + '_addonsListing]'))
    {
        if ($('table[id=cart] tr[id=' + item + '_addonsListing]').css('display') == "none")
        {
            $('table[id=cart] tr[id=' + item + ']').css('background-color', '#ebf2f8');
            $('table[id=cart] tr[id=' + item + '_addonsListing]').css('display', '');
            $('table[id=cart] tr[id=' + item + '_addonsListing]').css('background-color', '#ebf2f8');
        } else {
            $('table[id=cart] tr[id=' + item + ']').css('background-color', '');
            $('table[id=cart] tr[id=' + item + '_addonsListing]').css('display', 'none');
            $('table[id=cart] tr[id=' + item + '_addonsListing]').css('background-color', '#ebf2f8');
        }
    }
    selectedDomain = item;
}

function roundVal(val) {
    var dec = 2;
    var result = Math.round(val * Math.pow(10, dec)) / Math.pow(10, dec);
    result = result.toString();
    if (result.length == (result.indexOf('.') + 2)) {
        result += "0";
    }
    if (result == parseInt(result)) {
        result += ".00";
    }

    return result;
}

function removeFromCart(domain, type) {
    track("cart/remove/" + type);

    $.getJSON("/tldform/remove", {
        domain: domain
    },
    function(data) {

        if (data.removed == '1') {

            oocart.removeItem(domain);
            $('table id=[cart] tr[id=' + domain + ']').remove();
            incartToggle(domain, false);

            redraw_cart();
        }
    });
}

function incartToggle(domain, incart) {
    if (incart == true) {
        $(".search_" + domain.escapeDots()).children(".actions").children(".incart").show();
        $(".search_" + domain.escapeDots()).children(".actions").children(".addtocart").hide();

    } else {
        $(".search_" + domain.escapeDots()).children(".actions").children(".incart").hide();
        $(".search_" + domain.escapeDots()).children(".actions").children(".addtocart").show();
    }
}

function addManyToCart(domains) {
    var domarray = domains.split(',');
    $.each(domarray,
    function() {
        oocart.addItem(this, "regular", {
            price: "12.95"
        });
    });

    track("cart/addmany/" + domarray.length);
    redraw_cart();
}

function addInternationalToCart(domain, form) {
    var params = new Object();
    params['domain'] = domain;
    params['set'] = 'requirement';

    var input = $(form).find(":input");
    $.each(input,
    function() {
        if ($(this).attr("type") == "checkbox") {
            if ($(this).is(':checked')) {
                params[$(this).attr("name")] = $(this).val();
            }
        } else {
            params[$(this).attr("name")] = $(this).val();
        }
    });

    $.getJSON("/bin/ajax/tldinfo", params,
    function(data) {
        if (!data.requirementErrors) {
            oocart.addItem(domain, "international", {
                price: data.price[0]
            });
            incartToggle(domain, true);
            redraw_cart();
            $.modal.close();
        } else {
            alert(_("search_js_alert_invalid"));
        }
    });
    return false;
}

function buyInternationalNow(domain, form) {

    var params = new Object();
    params['domain'] = domain;
    params['set'] = 'requirement';

    var input = $(form).contents().find(":input");
    $.each(input,
    function() {
        params[$(this).attr("name")] = $(this).val();
    });

    $.getJSON("/bin/ajax/tldinfo", params,
    function(data) {
        if (!data.requirementErrors) {
            oocart.clearCart();
            oocart.save();
            oocart.addItem(domain, "international", {
                price: data.price[0]
            });
            redraw_cart();
            $.modal.close();
        } else {
            alert(_("search_js_alert_invalid"));
        }
    });
    return false;
}

function addToCart(domain, type, extra) {

    if (oocart.itemCount() < 5) {

        // Not really sure how requirements work for transfers
        if (type == "transfer") {

            oocart.addItem(domain, type, { auth: extra});
            incartToggle(domain, true);

            redraw_cart();

        } else {

            // Check session for any saved TLD field values for this domain
            $.getJSON("/tldform/check", {
                domain: domain
            },
            function (data) {

                // TLD form is filled out (or not applicable) - add domain to cart
                if (data.valid == 1) {

                    // close the TLD form
                    $.modal.close();

                    oocart.addItem(domain, type, { price: extra});
                    incartToggle(domain, true);

                    redraw_cart();

                // TLD form is missing some required values - show the form
                } else {
                    showTLDForm(domain, type, extra);
                }
            });
        }

        redraw_cart();

    } else {
        alert(_("search_js_alert_cart"));
    }
}

function showTLDForm(domain, type, extra) {

    $.getJSON("/tldform/load", {
        domain: domain
    },
    function (data) {

        var formHTML = generateTLDForm(data.tldform, data.tldform_opts, data.tldform_vals, domain, type, extra);

        $.modal.close();
        $.modal(formHTML, {
            autoResize: [true],
            autoPosition: [false],
            closeHTML: "<a href=\"#\" class=\"modalCloseImg simplemodal-close\" title=\"Save & Continue\" onclick=\"javascript: saveForm(false); return false;\">Save & Continue Shopping</a>"
        });
        $(".tldform").closest("#simplemodal-container").css("top", "50px").css("position", "absolute");
    });
}

function generateTLDForm(tldform, tldform_opts, tldform_vals, domain, type, extra) {

    var html = $("<div></div>");
    
    var inner_div = $("<div class=\"tldform\"><h1 class=\"tldform\">This domain requires additional registrant information</h1></div>");

    var tldform_form = $("<form id=\"tldform\"></form>");

    tldform_form.append("<input type=\"hidden\" name=\"domain\" value=\"" + domain + "\">");
    tldform_form.append("<input type=\"hidden\" name=\"type\" value=\"" + type + "\">");
    tldform_form.append("<input type=\"hidden\" name=\"extra\" value=\"" + extra + "\">");

    var tldform_table = $("<table class=\"tldform\"><thead></thead><tbody></tbody></table>");

    for (var i in tldform) {

        var fieldname = tldform[i].field_name;
        var fieldval  = tldform_vals[fieldname];

        var row = $("<tr></tr>");
        row.append("<td>" + fieldname + (tldform[i].field_required == 1 ? "*" : "") + "</td>");

        var type_cell = $("<td></td>");

        switch (tldform[i].field_type) {

            case "combo":
                select = $("<select name=\"" + fieldname + "\"></select>");
                var options = tldform_opts[fieldname];
                for (var j in options) {
                    var selected = (fieldval != undefined && fieldval == options[j] ? " selected" : "");
                    select.append("<option value=\"" + options[j] + "\"" + selected + ">&nbsp;" + options[j] + "</option>");
                }
                type_cell.append(select);
                break;

            case "radio":
                var options = tldform_opts[fieldname];
                for (var j in options) {
                    var checked = (fieldval != undefined && fieldval == options[j] ? " checked=\"checked\"" : "");
                    var radio_div = $("<div></div>");
                    radio_div.html("<input type=\"radio\" id=\"" + fieldname + "_" + j + "\" name=\"" + fieldname + "\" value=\"" + options[j] + "\"" + checked + " />&nbsp;" + options[j]);
                    type_cell.append(radio_div);
                }
                break;

            default:
                type_cell.append("<input type=\"text\" name=\"" + fieldname + "\"" + (fieldval != undefined ? " value=\"" + fieldval + "\"" : "") + " />");
        }

        row.append(type_cell);
        row.append("<td>" + (tldform[i].field_desc != undefined ? tldform[i].field_desc : "") + "</td>");

        tldform_table.children("tbody").append(row);
    }

    var bottom_row = $("<tr></tr>");
    bottom_row.append("<td colspan=\"3\"><p style=\"text-align: right;\">* indicates a required field.</p></td>");
    tldform_table.children("tbody").append(bottom_row);

    tldform_form.append(tldform_table);

    inner_div.append(tldform_form);

    html.append(inner_div);
    html.append("<div class=\"tldform_bottom\"><button type=\"button\" onclick=\"javascript: saveForm(true); return false;\">Save & Add to Cart</button></div>");

    return html;
}

function saveForm(doAddToCart) {

    var tldform = {};

    $('#tldform').find('input').each(function() {
        switch (this.type) {
            case "checkbox":
            case "radio":
                if (this.checked) {
                    tldform[this.name] = $(this).val();
                }
                break;
            default:
                tldform[this.name] = $(this).val();
        }
    });

    $('#tldform').find('select').each(function() {
        tldform[this.name] = $(this).val();
    });

    // If we're not adding to cart straight away, force TLD form to re-open next time
    tldform['recheck'] = doAddToCart ? 0 : 1;

    $.getJSON("/tldform/save", {
        tldform: JSON.stringify (tldform,replacer)
    },
    function (data) {
        if (doAddToCart && data.saved == '1') {
            addToCart(data.domain, data.type, data.extra);
        }
    });
}

function showCart() {
    for (selectedDomain in oocart.items) {
        break;
    }
    if (selectedDomain) {
        oocart.toggleAddon(selectedDomain);
    }
    var html = oocart.renderCart();
    $.modal.close();
    $.modal(html, {
        autoResize: [false],
        autoPosition: [false]
    });
    $('.cart').closest("#simplemodal-container").css("top", "50px").css("position", "absolute");
    $('.simplemodal-close').html(_("search_js_cart_close_and_continue"));
    $(window).unbind('resize.simplemodal');
    // hack to disable simplemodal resizing
    if ($(window).width() >= 940) {
        $('.cart').closest("#simplemodal-container").css("left", (($(window).width() - 920) / 2)).css("top", "50px");
    } else {
        $('.cart').closest("#simplemodal-container").css("left", "90px").css("top", "50px");
    }

    if (selectedDomain) {
        oocart.toggleAddon(selectedDomain);
    }
    oocart.updateSelections(oocart.items);
}

$(window).resize(function() {
    // hack for dynamic cart vertical align
    if ($(window).width() >= 940) {
        $('.cart').closest("#simplemodal-container").css("left", (($(window).width() - 920) / 2)).css("top", "50px");
        $('#transferform').closest("#simplemodal-container").css("left", (($(window).width() - 920) / 2)).css("top", "50px");
        $('.tldform').closest("#simplemodal-container").css("left", (($(window).width() - 920) / 2)).css("top", "50px");
    }
    $("#simplemodal-overlay").css("width", "100%").css("height", "100%");
});

function checkall(addon, checked) {
    $.each($("tr#" + addon + " td").last().children("input"),
    function(i, item) {
        if (checked) {
            addAddon($(item).val(), addon, 1);
        } else {
            addAddon($(item).val(), addon, 0);
        }
    });
}

function addAddon(domain, addon, value) {
    track("cart/" + addon + "/" + value);

    if (addon == "privacy") {
        oocart.privatize(domain, value);
    } else if (addon == "staticip") {
        oocart.staticipize(domain, value);
    } else if (addon == "sitelock") {
        if (value == 1) {
            value = $("#sitelockselector option:selected").val();
        }
        oocart.sitelockize(domain, value);
    } else if (addon == "phphosting") {
        if (value == 1) {
            value = $("#phphostingselector option:selected").val();
        }
        oocart.phphostingize(domain, value);
    }

    redraw_cart();
    toggleAddon(domain);

}

function updatePrivacy(domain) {
    oocart.updatePrivacy(domain);
    redraw_cart();
    toggleAddon(domain);

}

function updatePhpHosting(domain, value) {
    oocart.updatePhpHosting(domain, value);
	
    oocart.items[domain].options.phphosting_cycle = phphosting_cycle[domain];
    oocart.items[domain].options.staticip_cycle = staticip_cycle[domain];

    redraw_cart();

    $("input[name=" + domain + "_phphostingselector]:radio")[0].checked = false;
    $("input[name=" + domain + "_phphostingselector]:radio")[1].checked = false;
    $("input[name=" + domain + "_phphostingselector]:radio")[2].checked = false;
    $("input[name=" + domain + "_phphostingselector]:radio")[3].checked = false;
    $("input[name=" + domain + "_phphostingselector]:radio")[4].checked = false;
    $("input[name=" + domain + "_phphostingselector]:radio")[value].checked = true;

	/*
	// this forces static ip upselling
    if (value == 0) {
        $('input[name=' + domain + '_staticipselector]').enable(false);
        $('input[name=' + domain + '_staticipselector]').selected(false);
        oocart.items[domain].options.staticip = "0";
    } else {
        $('input[name=' + domain + '_staticipselector]').enable(true);
        $('input[name=' + domain + '_staticipselector]').selected(true);
        oocart.items[domain].options.staticip = "1";
    }
	*/
    toggleAddon(domain);


}

function updateSitelocks(domain, value) {
    oocart.updateSitelocks(domain, value);
    redraw_cart();

    $("input[name=" + domain + "_sitelockselector]:radio")[0].checked = false;
    $("input[name=" + domain + "_sitelockselector]:radio")[1].checked = false;
    $("input[name=" + domain + "_sitelockselector]:radio")[2].checked = false;
    $("input[name=" + domain + "_sitelockselector]:radio")[3].checked = false;
    $("input[name=" + domain + "_sitelockselector]:radio")[value].checked = true;
    toggleAddon(domain);

}

function updateStaticIP(domain) {
    oocart.updateStaticIP(domain);
    oocart.items[domain].options.staticip_cycle = staticip_cycle[domain];

    redraw_cart();
    toggleAddon(domain);

}

function updateTerm(domain, term) {
    track("cart/term/" + term);
    oocart.updateTerm(domain, term);
    redraw_cart();
    toggleAddon(domain);

    makeLinksWork();
}

function updateCartButton() {
    oocart.renderCart();

    $("button#cartbutton").html(_("search_js_cart") + " (" + oocart.getCount() + ") " + makePrice(oocart.getSum()));

    if (oocart.getCount() > 1) {
        cartlang = "domains";
    } else {
        cartlang = "domain";
    }

    $("span#sum").html("Total (" + oocart.getCount() + " " + cartlang + ") " + makePrice(oocart.getSum()));



    if (oocart.getCount() == 0) {
        $('button.viewcart').hide();
        $('button#cartbutton').hide();
        $.modal.close();
    } else {
        $('button.viewcart').show();
        $('button#cartbutton').show();
    }
}


function redraw_cart() {
    oocart.save();
    updateCartButton();
    if ($("table#cart").length) {
        showCart();
    }
}

function buyOnly(domain, type, price) {
    if (type == "suggested") {
        track("cart/buyonly/" + type + "/" + price);
        price = null;
    } else {
        track("cart/buyonly/" + type);
    }

    oocart.clearCart();
    oocart.save();
    view('cart');
    addToCart(domain, type, {
        price: price
    });

    $.modal.close();
}

function replacer(key, value) {
    if (typeof value === 'number' && !isFinite(value)) {
        return String(value);
    }
    return value;
}

function saveAndCheckOut() {

    $.getJSON("/tldform/store", {
        cart_domains: JSON.stringify(oocart.items)
    },
    function (data) {

        if (data.stored == '1') {

            oocart.save();
            oocart.checkOut();
        }
    });
}

var abtest = false;

$(document).ready(function() {
    $('#loading').hide();

    // Set default search ccTLD based on filename.
    var tld_find_regexp = /_(\w{2,4})/;
    var tld_find_regexp_array = [];
    tld_find_regexp_array = tld_find_regexp.exec(window.location.href);
    if (tld_find_regexp_array && tld_find_regexp_array[1]) {
        cctld = tld_find_regexp_array[1];
    }


    // Sanitize ccTLD for TLDs we have templatized.
    var tld_regexp = /^(com|uk|eu|de|fr|nz|tv|au|co)$/;
    if (!tld_regexp.test(cctld)) {
        cctld = 'com';
    }
    //showForm("test.com.au");
    // Set default search ccTLD based on server URL.
    var where_regexp = /domains\.lycos\.([\.|\w]+)[:\/]/;
    var where_array = where_regexp.exec(window.location.href);
    if (where_array && where_array[1]) {
        if (where_array[1] == 'co.uk' && cctld == 'com') {
            //cctld = 'uk';
            }
    }

    getPrices();
    var price_cctld = cctld;
    switch (cctld) {
    case 'au':
        price_cctld = 'com.au';
        break;
    case 'nz':
        price_cctld = 'co.nz';
        break;
    case 'uk':
        price_cctld = 'co.uk';
        break;
    }


    setCountryPromo();


    $("#navsearch input.navbutton").makeidletext("Search");
    $("#headersearch").makeidletext(_("search_js_yourdomain") + "." + cctld);
    $("#frontsearch").makeidletext(_("search_js_yourdomain") + "." + cctld);

    $("#regular").tablesorter({
        headers: {
            2: {
                sorter: false
            }
        }
    });

    $("#international").tablesorter({
        headers: {
            2: {
                sorter: false
            }
        }
    });
    // $("#premium").tablesorter({ headers: { 2: { sorter: false } } } );
    //$("#suggested").tablesorter({ headers: { 1: { sorter: false }, 2: { sorter: false } } } );

    $('#otherresults').tabs();

    redraw_cart();
    $("body").css("overflow", "visible");

    if (ip.charAt(ip.length - 1) % 2 == 1) {
        abtest = true;
    }
    ab = $(document).getUrlParam("abtest");
    if (ab == "a") {
        abtest = true;
    }
    if (ab == "b") {
        abtest = false;
    }

    if (abtest) {
        track("abtesting/a");
    } else {
        track("abtesting/b");
    }


    transf = $(document).getUrlParam("transfer");
    if (transf) {
        transferDomain(transf);
    } else {
        $(".searchresults").hide();
    }

    param = $(document).getUrlParam("search");
    if (param) {

        param = decodeURI(param);
        param = param.replace(/[^a-zA-Z0-9-\._]/g, "");

        $("#searchArea").val(param);
        // $("#searchResults").show();
        //  $("#mainIndex").hide();
        searchterm = param;
        search();
    } else {
        // $("#searchResults").hide();
        }
    var curtab = $(document).getUrlParam("tab");
    if (curtab) {
        view(curtab);
    }

    var autocart = $(document).getUrlParam("cart");
    if (autocart) {
        var autocartdomains = autocart.split(",");
        $.each(autocartdomains,
        function(domain) {
            addToCart(autocartdomains[domain], "international");
            $("#domainsearch").val(autocartdomains[domain]);
        });
        search();
        view("cart");
        showCart();
    }

    makeLinksWork();

    updateCartButton();
    //showCart();//for testing
});


var oldsearch = ''

function search(type) {

    updateCartButton();
    //  $("#frontpage").hide();
    //   $("#resultspage").show();
    $("#searchArea").val(searchterm);
    $(".searchbox").each(function() {
        if ($(this).children("select").children(":selected").val() != undefined) {
            $(this).children("select").children("option :contains('" + searchtld + "')").attr('selected', 'selected');

        }
    });

    var searchtermlc = searchterm.toLowerCase();
    searchterm = searchtermlc;
    var wwwreplace = searchterm.substr(0, 4);
    if (wwwreplace == "www.")
    {
        searchterm = searchterm.substr(4);
    }

    var searchtermnsp = searchterm.replace(/\+/g, "");
    searchterm = searchtermnsp;

    if (searchterm != "" && searchterm != oldsearch) {
        track("search/" + searchterm);

        var allglobal_tld = /\.(ac|ad|ae|aero|af|ag|ai|al|am|an|ao|aq|ar|arpa|as|asia|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|biz|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cat|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|com|coop|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|edu|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gov|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|info|int|io|iq|ir|is|it|je|jm|jo|jobs|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mil|mk|ml|mm|mn|mo|mobi|mp|mq|mr|ms|mt|mu|museum|mv|mw|mx|my|mz|na|name|nc|ne|net|nf|ng|ni|nl|no|np|nr|nu|nz|om|org|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|pro|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tel|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|travel|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw)$/;
        var match_global_tlds = allglobal_tld.exec(searchterm);

        var match_global = false;
        if (match_global_tlds && match_global_tlds[1] != '') {
            match_global = true;
        }

        var match_ours = false;
        var cc_regexp = /\.(com|net|org|biz|info|co.uk|tv|co|mobi|cc)$/;
        var temp_search_cctld = cc_regexp.exec(searchterm);

        if (temp_search_cctld && temp_search_cctld[1] != '') {
            search_cctld = temp_search_cctld[1];
            match_ours = true;
        } else {
            search_cctld = cctld;
        }

        // if not a valid tld, replace spaces and . and send down as .com to search all domains	
        if (!match_global && !match_ours)
        {
            // take out all dots and spaces
            searchterm = searchterm.split('.').join('');
            nomatches = true;

            displayCSDomainTxt = true;
        } else if (match_global && !match_ours)
        {
            // if a tld we don't support, take out tld and still search across our results
            var indexforrealtld = searchterm.indexOf(match_global_tlds[1]);
            var newsearch = searchterm.substr(0, indexforrealtld - 1);
            searchterm = newsearch.split('.').join('');

            // and display cs txt
            displayCSDomainTxt = true;
        }

        if (cctld != 'com') {
            // Change the search TLD as necessary for promo pages.
            if (cc_regexp.test(searchterm)) {
                var gcc_regexp = /\.(com|net|org|biz|info)$/;
                var gcc_array = gcc_regexp.exec(searchterm);
                if (gcc_array && gcc_array[1] != '') {
                    // Change 'this.com' -> 'this.au'
                    searchterm = searchterm.replace(gcc_array[1], cctld);
                } else if (search_cctld && search_cctld != cctld) {
                    // Change 'this.fr' -> 'this.fr.au'
                    searchterm = searchterm + '.' + cctld;
                }
            } else {
                // Change 'this' -> 'this.au'
                searchterm = searchterm + '.' + cctld;
            }
        }

        oldsearch = searchterm;

        searchDomains("regular");

        //Removed 5/27/14 as we are not currently supporting ccTLDS other than co.uk
        //searchDomains("international");

        searchSuggested();

        //	setTimeout("searchDomains('suggested')",4000);
        // DAMN YOU JAVASCRIPT, this actually doesn't work!
        // let the parallel ajax calls on home page load first
        // then request results on the suggested tab, which is not visible anyways
        // this was suggested won't slow down ohme page results
        /*
	var domainsresultsfrontpage = 19;
	while (resultstotal < domainsresultsfrontpage)
	{
		// yes, javascript doesn't have a sleep function..
		var milliseconds = 5000;
		var start = new Date().getTime();
		while ((new Date().getTime() - start) < milliseconds){
			// Do nothing
		}
	}	

	if (resultstotal >= domainsresultsfrontpage)
	{
   		searchDomains("suggested");
        }
*/
        /*var exclude = [];  // anything in here will be hidden from the page in case we dont have a contract to offer them in certain countries

            exclude = ['premium'];


        for (i=0; i < types.length; i++){
            if (types[i] in oc(exclude)){
                var hiddentab = '#sect_' + types[i];
                $(hiddentab).hide();
                $('a[href$="'+hiddentab+'"]').parents('li').hide();

            } else {
                searchType(types[i]);
                if (type && types[i] == type) {
                    $('#otherresults').tabs('select', '#sect_' + type);
                }
            }
        }   */
        $("span.resulttext").css("height", $("span.resulttext").maxHeight());
        return false;
    }
}



var searchterm = "";
var searchtld = "";
function updatesearchterm(input) {
    var searchbox = $(input).parent();
    searchterm = searchbox.children("input").val();
    if (searchbox.children("select").children(":selected").val() != undefined) {
        searchterm += searchbox.children("select").children(":selected").val();
        searchtld = searchbox.children("select").children(":selected").val();
    }
}

function oc(a) {
    var o = {};
    for (var i = 0; i < a.length; i++) {
        o[a[i]] = '';
    }
    return o;
}

function searchSuggested()
 {
    var justdomain;
    var totalavailable = new Array();
    var totalprice = 0.0;
    var count = 0;
    var type = "suggested";

    $("#" + type + " tbody").html("<tr><td colspan=3 class='waiting'></td></tr>");
    $("#" + type).trigger("update");
    $("#" + type + " tfoot").html("<tr><td colspan='3'>&nbsp;</td></tr>");

    var startTLDpos = searchterm.indexOf('.');
    var pureDomainName;
    var pureFullTLD;

    if (currency == "UK")
    {
        var regularTLDs = new Array("co.uk", "com", "co", "net", "org", "tv", "biz", "info");
        //, "mobi", "name");
    } else {
        var regularTLDs = new Array("com", "co", "net", "org", "tv", "biz", "info", "mobi");
    }

    if (startTLDpos >= 0)
    {
        pureDomainName = searchterm.substring(0, startTLDpos);
        pureFullTLD = searchterm.substring(startTLDpos + 1);
    } else if (startTLDpos == -1) {
        pureDomainName = searchterm;
        pureFullTLD = regularTLDs[0];
        // if no tld entered, just keyword, set max to domains count from left side (7)
    }

    var maxresults = regularTLDs.length;
    var cartlist = oc(oocart.domainList());

    $.getJSON("/bin/search", {
        domain: pureDomainName,
        type: "suggested",
        currency: currency
    },
    function(data)
    {
        $("#" + type + " tbody").html("");

        $.each(data.names,
        function(i, item)
        {
            if (item.available != "taken" && item.available != "NA") {
                totalprice += parseFloat(item.price);
                totalavailable.push(item.name);
            }

            var tr = $("<tr id='result" + type + "_" + item.name + "' class='search_" + item.name + "'></tr>");
            tr.append("<td id='result" + type + "_" + item.name + "_name' class='result-main'>" + item.name + "</td>");

            if (item.price != "NA") {
                tr.append("<td style='text-align:left;' id='result" + type + "_" + item.name + "_price'>" + makePrice(item.price) + "</td>");
            } else {
                tr.append("<td style='text-align:left;' id='result" + type + "_" + item.name + "_price'>" + _("search_js_notavail") + "</td>");
            }

            var availStatus;
            if (item.available == "taken") {
                availStatus = " " + _("search_js_taken") + " ";
            } else if (item.available == "NA") {
                availStatus = " " + _("search_js_notavail") + " ";
            } else {
                /*
				availStatus = "<a class='addtocart' href='javascript:addToCart(\""+item.name+"\",\""+type+"\",\""+item.price+"\" )'>"+_("search_js_add_tocart")+"</a><span class='incart' style='display:none;'>" + _("search_js_incart") + "</span>";
		
				if (item.name in cartlist){
					availStatus = _("search_js_incart");
				}
*/
                var addToCartStyle = "";
                var inCartStyle = "";
                if (item.name in cartlist) {
                    addToCartStyle = "style='display:none;'";
                } else {
                    inCartStyle = "style='display:none;'";
                }
                availStatus = "<a class='addtocart' href='javascript:addToCart(\"" + item.name + "\",\"" + type + "\",\"" + item.price + "\")'" + addToCartStyle + ">" + _("search_js_add_tocart") + "</a><span class='incart'" + inCartStyle + ">" + _("search_js_incart") + "</span>";
            }

            var avail = $("<td style='text-align:center; font-color: gray;' class='actions' id='result" + type + "_" + item.name + "_status'>" + availStatus + "</td>");
            tr.append(avail);
            //tr.append("<td class='type'></td>");
            $("#" + type + " tbody").append(tr);

            if (count >= maxresults) {
                // hide some results for the show more button to unhide unless we are within two results of the full list
                $("#" + type + " tbody").children('tr').last().hide();
                $("#" + type + " tfoot").html("<tr><td colspan='3'><a class=\"bold\" href='javascript:moreResults(\"" + type + "\")'>" + _("search_js_more", Array(_("search_js_" + type))) + "</a></td></tr>");
            } else {
                $("#" + type + " tfoot").html("<tr><td colspan='3'>&nbsp;</td></tr>");
            }

            count++;
            resultstotal++;

        });
        if (count > 0)
        {
            $("#suggested").show();
        }

    });

    if (totalavailable.length > 0) {
        $("#" + type + " tfoot").html("<tr><td colspan='3'>&nbsp;</td></tr>");
    }



    /*var sorting = [[3,1]];
	$("#" + type).trigger("update");
	$("#" + type).trigger("sorton",[sorting]);*/

}

function searchDomains(type) {
    var justdomain;
    var totalavailable = new Array();
    var totalprice = 0.0;
    var count = 0;

    if (type == "regular")
    {
        if (displayCSDomainTxt)
        {
            $("#resultsMessage").html(_("search_js_searchblurbcontactcs"));
        }/* else {
            $("#searchblurb").printf(_("search_js_searchblurb", Array(searchterm)));
        }*/
    }

    //$('#regular tbody').html("<tr><td colspan=3 class='waiting'></td></tr>");
    $("#" + type).trigger("update");
    $("#" + type + " tfoot").html("<tr><td colspan='3'>&nbsp;</td></tr>");

    var startTLDpos = searchterm.indexOf('.');
    var pureDomainName;
    var pureFullTLD;

    if (countrycode_tld == "USA")
    {
        //Removed ccTLDS on 5/27/14 as we currently only support .co.uk
        
        var regularTLDsLEFTSideUK = new Array("co.uk", "com", "co", "net", "org", "tv", "cc", "biz", "info");
        //, "mobi", "name","me");
        //var regularTLDsRIGHTSideUK = new Array("eu", "com.au", "org.au", "net.au", "id.au", "co.nz", "net.nz", "org.nz", "gen.nz", "geek.nz");
        //"us", "de", "asia", "at", "bz", "ch", "es", "li", "nl", "tw",
        var regularTLDsLEFTSideUSA = new Array("com", "co", "net", "org", "tv", "cc", "biz", "info", "mobi");
        //, "us""me",
        //var regularTLDsRIGHTSideUSA = new Array("co.uk", "eu", "com.au", "org.au", "net.au", "id.au", "co.nz", "net.nz", "org.nz", "gen.nz", "geek.nz");
        //"de", "asia", "at", "bz", "ch", "es", "li", "nl", "tw",
        var regularTLDsLEFTSideAU = new Array("com", "co", "net", "org", "tv", "biz", "info", "mobi");
        //var regularTLDsRIGHTSideAU = new Array("co.uk", "eu", "id.au", "co.nz", "net.nz", "org.nz", "gen.nz", "geek.nz");
        // "de", "asia", "at", "bz", "ch", "es", "li", "nl", "tw"
        var regularTLDsLEFTSideNZ = new Array("com", "co", "net", "org", "tv", "biz", "info", "mobi");
       // var regularTLDsRIGHTSideNZ = new Array("co.uk", "eu", "gen.nz", "geek.nz", "com.au", "org.au", "net.au", "id.au");
        // "de", "asia", "at", "bz", "ch", "es", "li", "nl", "tw",
    } else {
        var regularTLDsLEFTSideUK = new Array("co.uk", "com", "co", "net", "org", "tv", "biz", "info");
        //, "mobi", "name" "me",);
        //var regularTLDsRIGHTSideUK = new Array("eu", "us", "com.au", "org.au", "net.au", "id.au", "co.nz", "net.nz", "org.nz", "gen.nz", "geek.nz");
        // "de", "asia", "at", "bz", "ch", "es", "li", "nl", "tw",
        var regularTLDsLEFTSideUSA = new Array("com", "co", "net", "org", "tv", "biz", "info", "mobi");
        //"me",
        //var regularTLDsRIGHTSideUSA = new Array("co.uk", "eu", "us", "com.au", "org.au", "net.au", "id.au", "co.nz", "net.nz", "org.nz", "gen.nz", "geek.nz");
        //"de", "asia", "at", "bz", "ch", "es", "li", "nl", "tw",
        var regularTLDsLEFTSideAU = new Array("com", "co", "net", "org", "tv", "biz", "info", "mobi");
        //var regularTLDsRIGHTSideAU = new Array("co.uk", "eu", "id.au", "co.nz", "net.nz", "org.nz", "gen.nz", "geek.nz");
        //"de", "asia", "at", "bz", "ch", "es", "li", "nl", "tw",
        var regularTLDsLEFTSideNZ = new Array("com", "co", "net", "org.nz", "org", "tv", "biz", "info", "mobi");
        //var regularTLDsRIGHTSideNZ = new Array("co.uk", "eu", "gen.nz", "geek.nz", "com.au", "org.au", "net.au", "id.au");
        //"de", "asia", "at", "bz", "ch", "es", "li", "nl", "tw",
    }

    // in the US, move .us results to the left panel, otherwise show under .eu on right panel
    if (type == "regular" || type == "suggested")
    {
        if (currency == "UK") {
            // No UK prices yet for mobi, name - exclude them from search
            var regularTLDs = regularTLDsLEFTSideUK;
        } else if (currency == "USA") {
            var regularTLDs = regularTLDsLEFTSideUSA;
        } else if (currency == "AU") {
            var regularTLDs = regularTLDsLEFTSideAU;
        } else if (currency == "NZ") {
            var regularTLDs = regularTLDsLEFTSideNZ;
        }
    } 
    
    //Removed 5/27/14 as we are currently only supporting .co.uk
    /*else if (type == "international")
    {
        if (currency == "USA") {
            var regularTLDs = regularTLDsRIGHTSideUSA;
        } else if (currency == "UK") {
            var regularTLDs = regularTLDsRIGHTSideUK;
        } else if (currency == "AU") {
            var regularTLDs = regularTLDsRIGHTSideAU;
        } else if (currency == "NZ") {
            var regularTLDs = regularTLDsRIGHTSideNZ;
        }
    }*/

    if (startTLDpos >= 0)
    {
        pureDomainName = searchterm.substring(0, startTLDpos);
        pureFullTLD = searchterm.substring(startTLDpos + 1);
    } else if (startTLDpos == -1) {
        pureDomainName = searchterm;
        pureFullTLD = regularTLDs[0];
        // if no tld entered, just keyword, set max to domains count from left side (7)
        if (type == "regular")
        {
            maxresults = regularTLDs.length;
        }
    }
    if (type == "regular")
    {
        if (pureFullTLD == 'com.au' || pureFullTLD == 'org.au' || pureFullTLD == 'net.au' || pureFullTLD == 'id.au' || pureFullTLD == 'co.uk' || pureFullTLD == 'mobi' || pureFullTLD == 'co.nz')
        {
            displayWarningOnLeftResults = true;
            $("#regulardomaincostwarning").append(_("search_js_searchblurb2yearcommitment")).show();
        }
    }

    if (!displayWarningOnLeftResults && type == "international")
    {
        $("#internationaldomaincostwarning").append(_("search_js_searchblurb2yearcommitment")).show();
    }

    var tldInRegularTLDsPosition = -1;
    var orderedTLDs = new Array();

    // lets see if the searched term's TLD is in out TLD list
    for (var i = 0, len = regularTLDs.length; tld = regularTLDs[i], i < len; i++)
    {
        if (tld == pureFullTLD)
        {
            tldInRegularTLDsPosition = i;
        }
    }

    if (type == "regular")
    {
        if (tldInRegularTLDsPosition >= 0)
        {
            // domain with a tld equal from list, still count from lft side (7)
            maxresults = regularTLDs.length;
        } else {
            // otherwise, unknown tld, will become first on list, count incremented (8)
            maxresults = regularTLDs.length + 1;
        }
    }

    if (tldInRegularTLDsPosition <= 0)
    {
        if (tldInRegularTLDsPosition == -1)
        {
            // no match
            orderedTLDs.push(pureFullTLD);
            for (var i = 0, len = regularTLDs.length; tld = regularTLDs[i], i < len; i++)
            {
                orderedTLDs.push(tld);
            }

        } else {
            // .com first, don't reorder
            orderedTLDs = regularTLDs;
        }
    } else if (tldInRegularTLDsPosition > 0) {
        orderedTLDs.push(regularTLDs[tldInRegularTLDsPosition]);

        for (var i = 0, len = regularTLDs.length; tld = regularTLDs[i], i < len; i++)
        {
            if (i != tldInRegularTLDsPosition)
            {
                orderedTLDs.push(tld);
            }
        }
    }

    // start building response table
    for (var i = 0, len = orderedTLDs.length; val2 = orderedTLDs[i], i < len; i++)
    {
        if (type == "international" && val2 == pureFullTLD && pureFullTLD == cctld)
        {
            continue;
        }

        var domain_name = pureDomainName + "." + val2;
        var item;

        var extra1 = '';
        var extra2 = '';
        if (searchterm == domain_name)
        {
            extra1 = '<b>';
            extra2 = '</b>';
        }

        var tr = $("<tr id='result" + type + "_" + domain_name + "' class='search_" + domain_name + "'></tr>");
        tr.append("<td class='result-main' id='result" + type + "_" + domain_name + "_name'>" + extra1 + "" + domain_name + "" + extra2 + "</td>");
        tr.append("<td style='text-align:left;' id='result" + type + "_" + domain_name + "_price'>" + extra1 + "" + _("search_js_searchingprice") + "" + extra2 + "</td>");

        var avail = $("<td style='text-align:center; font-color: gray;' class='actions' id='result" + type + "_" + domain_name + "_status'>" + extra1 + "" + _("search_js_checkingavailability") + "" + extra2 + "</td>");
        tr.append(avail);
        //tr.append("<td class='type'></td>");
        $("#" + type + " tbody").append(tr);

        if (count >= maxresults) {
            // hide some results for the show more button to unhide unless we are within two results of the full list
            $("#" + type + " tbody").children('tr').last().hide();
            $("#" + type + " tfoot").html("<tr><td colspan='3'><a class=\"bold\" href='javascript:moreResults(\"" + type + "\")'>" + _("search_js_more", Array(_("search_js_" + type))) + "</a></td></tr>");
        } else {
            $("#" + type + " tfoot").html("<tr><td colspan='3'>&nbsp;</td></tr>");
        }

        count++;
        resultstotal++;
    }

    for (var a = 0, len3 = orderedTLDs.length; val3 = orderedTLDs[a], a < len3; a++)
    {
        var cartlist = oc(oocart.domainList());
        var domain_name = pureDomainName + "." + val3;

        $.getJSON("/bin/search", {
            domain: domain_name,
            type: "regular",
            currency: currency
        },
        function(data) {

            $.each(data.names,
            function(i, item) {
                if (item.available != "taken" && item.available != "NA") {
                    totalprice += parseFloat(item.price);
                    totalavailable.push(item.name);
                }

                var fieldname = "result" + type + "_" + item.name;

                var extra1 = '';
                var extra2 = '';
                if (searchterm == item.name) {
                    extra1 = '<b>';
                    extra2 = '</b>';
                }

                var availStatus;
                if (item.available == "taken") {
                    availStatus = " " + extra1 + "" + _("search_js_taken") + "" + extra2 + " ";
                } else if (item.available == "NA") {
                    availStatus = " " + extra1 + "" + _("search_js_notavail") + "" + extra2 + " ";
                } else {
                    var addToCartStyle = "";
                    var inCartStyle = "";
                    if (item.name in cartlist) {
                        addToCartStyle = "style='display:none;'";
                    } else {
                        inCartStyle = "style='display:none;'";
                    }
                    availStatus = "<a class='addtocart' href='javascript:addToCart(\"" + item.name + "\",\"" + type + "\",\"" + item.price + "\" )'" + addToCartStyle + ">" + extra1 + _("search_js_add_tocart") + extra2 + "</a><span class='incart'" + inCartStyle + ">" + extra1 + _("search_js_incart") + extra2 + "</span>";
                }

                if (document.getElementById(fieldname + "_price")) {
                    if (item.price != "NA") {
                        document.getElementById(fieldname + "_price").innerHTML = extra1 + makePrice(item.price) + extra2 + (item.tld == "org.au" || item.tld == "com.au" || item.tld == "net.au" || item.tld == "id.au" || item.tld == "co.uk" || item.tld == "mobi" || item.tld == "co.nz" ? "*" : "");
                    } else {
                        document.getElementById(fieldname + "_price").innerHTML = extra1 + _("search_js_notavail") + extra2;
                    }
                }

                if (document.getElementById(fieldname + "_status")) {
                    document.getElementById(fieldname + "_status").innerHTML = availStatus;
                }
            });
        });
    }

    if (totalavailable.length > 0) {
        $("#" + type + " tfoot").html("<tr><td colspan='3'>&nbsp;</td></tr>");
    }

    /*   var sorting = [[3,1]]; 
        $("#" + type).trigger("update");
        $("#" + type).trigger("sorton",[sorting]);*/

}

function setCountryPromo() {
    $("div#promo").html("<a href='javascript:transferDomain();'><img src='/images/transfer_domain.jpg' border='0'></a>");

    //    if (countrycode_ip in oc(['AU','CA','DE','FR','GB','NZ','TV','EU'])){ // show country if we have one
    //        $("div#promo").html("<img src='/images/ccpromo/"+countrycode_ip+".jpg'>");
    //$("div#promo").html("<a href='http://www.tripod.lycos.com/contest?m_ORIGIN=TWD__tripod_zeeblio__contest&utm_campaign=Twitter&utm_source=Domains'><img src='/images/ccpromo/domainsAd.jpg' style='border-style: none'></a>");
    //    } else if (countrycode_ip in oc(['BE','GB','CZ','DK','DE','EE','IE','GR','ES','FR','IT','CY','LV','LT','LU','HU','MT','NL','AT','PL','PT','RO','SI','SK','FI','SE','GB'])){ // show eu
    //        $("div#promo").html("<img src='/images/ccpromo/EU.jpg'>");
    //$("div#promo").html("<a href='http://www.tripod.lycos.com/contest?m_ORIGIN=TWD__tripod_zeeblio__contest&utm_campaign=Twitter&utm_source=Domains'><img src='/images/ccpromo/domainsAd.jpg' style='border-style: none'></a>");
    //    } else {  //show tv default
    //        $("div#promo").html("<img src='/images/ccpromo/TV.jpg'>");
    //$("div#promo").html("<a href='http://www.tripod.lycos.com/contest?m_ORIGIN=TWD__tripod_zeeblio__contest&utm_campaign=Twitter&utm_source=Domains'><img src='/images/ccpromo/domainsAd.jpg' style='border-style: none'></a>");
    //    }
}

function transferDomain(domain) {
    var transfer_bubble = new Bubble("tbubble", "ok");
    transfer_bubble.form_id = 'transferform';
    //transfer_bubble.form_onsubmit = 'checkAuthCode(this); return false;';

    //if (domain) {
    //    transfer_bubble.body += "<input type='hidden' name='domain' value='" + domain + "'/>";
    //}
    transfer_bubble.arbitrarycode = '<div style="position: absolute; top: 15px; left: 15px;"><img src="/images/img_inbox.gif"/></div>';

    transfer_bubble.body += "<br/><p style='text-align:left'>" + _("search_js_transfer_bubble_para1") + "</p><br/>";
    transfer_bubble.body += "<p style='text-align:left'>" + _("search_js_transfer_bubble_para11") + "</p><br/>";
    transfer_bubble.body += "<p style='text-align:left'>" + _("search_js_transfer_bubble_para2") + "</p><br/>";
    transfer_bubble.body += "<p style='text-align:left'>" + _("search_js_transfer_bubble_para4") + "</p><br/>";
    transfer_bubble.body += "<p style='text-align:left'>" + _("search_js_transfer_bubble_para5") + "</p><br/>";
    transfer_bubble.body += "<p><div style='float:left; text-align:left; width:25%;'>" + _("search_js_transfer_bubble_domain") + "<input type='text' name='domain' id='domain'/></div>";
    transfer_bubble.body += "<div style='float:left; text-align:left; width:25%;'>" + _("search_js_transfer_bubble_authcode") + "<input type='text' name='authcode' id='authcode'/></div>";
    transfer_bubble.body += "<div style='float:left; text-align:left; width:25%'>User name:<input type='text' name='user' id='user' /></div>";
    transfer_bubble.body += "<div style='float:left; text-align:left; width:25%;'>" + _("search_js_transfer_bubble_email") + "<input type='text' name='email' id='email'/></div></p><br/><br/><br/><br/>";
    transfer_bubble.body += "<p style='text-align:left'>" + _("search_js_transfer_bubble_para6") + "</p><br/>";
    transfer_bubble.body += "<p><span style='cursor: pointer;' onclick='$.modal.close()'><img src='/images/btn_cancel.png'/></span>&nbsp;&nbsp;&nbsp;&nbsp;<input type='image' id='submitting' src='/images/btn_continue.png' onclick='zendeskSubmit();'/><img id='loading' src='/images/loading.gif' style='display:none;'/></p>";
    
    var html = "";
    //if (domain) {
    //    html = "<h2 style='margin: 0pt 0pt 20px; text-align: left; font-size: 2.4em;'>" + _("search_js_transferring") + " <span class='red'>" + domain + "</span></h2>" + transfer_bubble.HTML();
    //} else {
        html = "<h2 style='margin: 0pt 0pt 20px; text-align: left; font-size: 2.4em;'>" + _("search_js_transfer") + "</h2>" + transfer_bubble.HTML();
    //}


    $.modal(html, {
        autoResize: [false],
        autoPosition: [false]
    });
    //#####################
    $('#transferform').closest("#simplemodal-container").css("top", "50px").css("position", "absolute");
    $(window).unbind('resize.simplemodal');
    // hack to disable simplemodal resizing
    if ($(window).width() >= 940) {
        $('#transferform').closest("#simplemodal-container").css("left", (($(window).width() - 920) / 2)).css("top", "50px");
    } else {
        $('#transferform').closest("#simplemodal-container").css("left", "90px").css("top", "50px");
    }
    $(window).scrollTop(0);
    //####################
}

/*function checkAuthCode(form) {
    //	alert("sending to /bin/ajax/transfer authcode "+form.authcode.value+" for domain: "+form.domain.value);
    if (form.agree.checked == false) {
        alert(_("search_js_auth_check"));
    } else if (form.domain.value == "") {
        alert(_("search_js_auth_check_domain"));
    } else if (form.authcode.value == "") {
        alert(_("search_js_auth_check_code"));
    } else {
        $.getJSON("/bin/ajax/transfer", {
            authcode: form.authcode.value,
            domain: form.domain.value
        },
        function(data) {
            if (data.transfer == 0) {
                if (data.result == "[Melbourne IT is current registrar]")
                {
                    alert(_("search_js_transfer_melbourne_existing"));
                } else if (data.result == "[Unable to retrieve domain info]")
                {
                    alert(_("search_js_transfer_domauth_fail"));
                } else if (data.result == "[Transfer request found]")
                {
                    alert(_("search_js_transfer_request_found"));
                } else {
                    alert(data.result + _("search_js_auth_check_code"));
                }
            } else {
                var safeauthcode = form.authcode.value;
                safeauthcode = safeauthcode.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                addToCart(form.domain.value, "transfer", safeauthcode);
                $.modal.close();
                view("cart");
                showCart();
            }
        });
    }
}*/


var heading = "<tr><th class=\"domain\" style='width:400px;'>Domain</th><th class=\"prices\" style='width:100px;'>Price</th><th class=\"status\" style='width:500px;text-align:center;'>Actions</th></tr>";


var maxresults = 12;

String.prototype.toProperCase = function() {
    return this.toLowerCase().replace(/^(.)|\s(.)/g,
    function($1) {
        return $1.toUpperCase();
    });
}

String.prototype.escapeDots = function() {
    return this.replace(/\./g, "\\.")
}

function searchType(type) {
    var table = $('#' + type);
    table.children('tfoot').html("<tr><td colspan='3'>&nbsp;</td></tr>");
    var count = 0;
    table.children('tbody').html("<tr><td colspan=3 class='waiting'></td></tr>");
    $.getJSON("/bin/search", {
        domain: searchterm,
        type: type,
        currency: currency
    },
    function(data) {
        table.children('tfoot').html("<tr><td colspan='3'>&nbsp;</td></tr>");
        if (data.results.length == 0) {
            table.children('tbody').html("<tr><td colspan=3><h2>" + _("search_js_none_found", Array(_("search_js_" + type))) + "</h2></td></tr>");
            table.trigger("update");
        } else {
            table.children('tbody').html("");
            var cartlist = oc(oocart.domainList());
            $.each(data.results,
            function(i, item) {
                if (item.name.substring(item.name.length - search_cctld.length, item.name.length) == search_cctld) {
                    return true;
                }
                // Skip ccTLD duplicates.
                table.children('tbody').append("<tr class='search_" + item.name + "'><td>" + item.name + "</td><td style='text-align:left;'>" + makePrice(roundVal(parseFloat(item.price))) + "</td><td style='text-align:center;' class='actions'><a class='addtocart' href='javascript:addToCart(\"" + item.name + "\",\"" + type + "\",\"" + item.price + "\")'>" + _("search_js_add_tocart") + "</a><span class='incart' style='display:none;'>" + _("search_js_incart") + "</span></td></tr>");

                if (item.name in cartlist) {
                    table.children('tbody').children("tr").last().children("td.actions").children(".addtocart").hide();
                    table.children('tbody').children("tr").last().children("td.actions").children(".incart").show();
                }

                if ((count >= maxresults) && (data.results.length > (maxresults + 2))) {
                    // hide some results for the show more button to unhide unless we are within two results of the full list
                    table.children('tbody').children('tr').last().hide();
                    table.children('tfoot').html("<tr><td colspan='3'><a class=\"bold\" href='javascript:moreResults(\"" + type + "\")'>" + _("search_js_more", Array(_("search_js_" + type))) + "</a></td></tr>");
                } else {
                    table.children('tfoot').html("<tr><td colspan='3'>&nbsp;</td></tr>");
                }

                count++;
                if (item.name == searchterm) {
                    table.children('tbody tr').last().children().addClass("exactmatch");
                }
                makeLinksWork();
            });

            table.children('tbody tr').first().children().addClass("exactmatch").first().append("<span class='smallflag'>&nbsp</span>");
            table.trigger("update");
        }
    });
}

function moreResults(type) {
    $("table#" + type + " tbody tr").show();
    $("table#" + type).children('tfoot').html("<tr><td colspan='3'>&nbsp;</td></tr>");
}

function zendeskSubmit() {
    $('#transferform').submit(function(ev){
        ev.preventDefault();
        $('#submitting').attr('disabled', 'disabled').hide();
        $('#loading').show();
        var processing_bubble = new Bubble('tbubble', 'ok');
        processing_bubble.body += "<p>Testing</p>";
        $.post("/createTicket/", {
            "method": "transfer",
            "domainname": $('#domain').val(),
            "authcode": $('#authcode').val(),
            "user": $('#user').val(),
            "email": $('#email').val()
        },
        function(response) {
            $('#submitimg').removeAttr('disabled').show();
            $('#loading').hide();
            alert(response['message']);
            if (response['message'] === "Your request has been submitted.") {
                $.modal.close();
            }
        }, 'json');
    });
}

