var default_term = '1';
var default_privacy = '0';
var default_sitelock = '0';
var default_phphosting = '0';
var current_sitelock_level = default_sitelock;
var current_phphosting_level = default_phphosting;
var addon_description = new Object();
var phphosting_cycle = new Object();
var staticip_cycle = new Object();
var phphosting_billingcycle_textlong = new Object();
var staticip_billingcycle_textlong = new Object();

addon_description['privacy'] = _("search_js_cart_addon_privacy", Array(makePrice(getAddonPrice('privacy'))));
addon_description['sitelock'] = _("search_js_cart_addon_sitelock");
addon_description['ssl'] = _("search_js_cart_addon_ssl");
addon_description['phphosting'] = _("search_js_cart_addon_phphosting");

function showAddon(item) {
    $(".editHide").hide();
    if ($('table[id=cart] tr[id=' + item + '_addonsListing]')) {
        $('table[id=cart] tr[id=' + item + '_addonsListing]').css('background-color', '');
    }
    selectedDomain = item;
}

function toggleAddon(item) {
    $(".editHide").hide();

    if (item && item != "" && $('table[id=cart] tr[id=' + item + '_addonsListing]')) {
        if ($('table[id=cart] tr[id=' + item + '_addonsListing]').css('display') == "none")
        {
            $('table[id=cart] tr[id=' + item + '_addonsListing]').css('display', '');
        } else {
            $('table[id=cart] tr[id=' + item + '_addonsListing]').css('display', 'none');
        }
    }
    selectedDomain = item;

    if ($('table[id=cart] tr[id=' + item + '')) {
        $('table[id=cart] tr[id=' + item + '').css('background-color', '#ebf2f8');
        $('table[id=cart] tr[id=' + item + '_addonsListing').css('background-color', '#ebf2f8');
    }
}

function updateStaticIPPriceText(domain) {
    //oocart.items[domain].options.staticip = "0";
    updateStaticIP(domain);
    oocart.updateStaticIP(domain);

    redraw_cart();

	/*
    if (staticip_cycle[domain] === undefined) {
		staticip_cycle[domain] == "m";
	}
	if (staticip_billingcycle_textlong[domain] === undefined) {
		staticip_billingcycle_textlong[domain] == "month";
	}
	*/

    if (staticip_cycle[domain] == "m") {
        staticip_cycle[domain] = "y";
        staticip_billingcycle_textlong[domain] = "year";
        toggletext = "<a href='#' onclick='updateStaticIPPriceText(\"" + domain + "\");'>monthly</a> | <b>annual</b>";
    } else {
        staticip_cycle[domain] = "m";
        staticip_billingcycle_textlong[domain] = "month";
        toggletext = "<b>monthly</b> | <a href='#' onclick='updateStaticIPPriceText(\"" + domain + "\");'>annual</a>";
    }

    oocart.items[domain].options.staticip_cycle = staticip_cycle[domain];

    $("div[id=" + domain + "_staticipselector_text1]").html(" - " + makePrice(all_prices.addons.staticip[staticip_cycle[domain] + "1"][0]) + "/" + staticip_billingcycle_textlong[domain]);
    $("div[id=" + domain + "_staticip_billingtoggle]").html(toggletext);

    redraw_cart();
    toggleAddon(domain);

}

function updatePhpHostingPriceText(domain) {
    updateStaticIPPriceText(domain);

    //oocart.items[domain].options.phphosting = "0";
    //oocart.items[domain].options.staticip = "0";
    updatePhpHosting(domain, oocart.items[domain].options.phphosting);
    oocart.updatePhpHosting(domain, oocart.items[domain].options.phphosting);

    redraw_cart();
	
    if (phphosting_cycle[domain] == "m") {
        phphosting_cycle[domain] = "y";
        phphosting_billingcycle_textlong[domain] = "year";
        toggletext = "<a href='#' onclick='updatePhpHostingPriceText(\"" + domain + "\");'>monthly</a> | <b>annual</b>";
    } else {
        phphosting_cycle[domain] = "m";
        phphosting_billingcycle_textlong[domain] = "month";
        toggletext = "<b>monthly</b> | <a href='#' onclick='updatePhpHostingPriceText(\"" + domain + "\");'>annual</a>";
    }

//	console.log("set phphosting_cycle for "+domain+" to " + phphosting_cycle[domain]);
//	console.log("set phphosting_billingcycle_textlong for "+domain+" to " + phphosting_billingcycle_textlong[domain]);

    oocart.items[domain].options.phphosting_cycle = phphosting_cycle[domain];

    $("div[id=" + domain + "_phphostingselector_text1]").html(" - " + makePrice(all_prices.addons.phphosting[phphosting_cycle[domain] + "1"][0]) + "/" + phphosting_billingcycle_textlong[domain]);
    $("div[id=" + domain + "_phphostingselector_text2]").html(" - " + makePrice(all_prices.addons.phphosting[phphosting_cycle[domain] + "2"][0]) + "/" + phphosting_billingcycle_textlong[domain]);
    $("div[id=" + domain + "_phphostingselector_text3]").html(" - " + makePrice(all_prices.addons.phphosting[phphosting_cycle[domain] + "3"][0]) + "/" + phphosting_billingcycle_textlong[domain]);
    $("div[id=" + domain + "_phphostingselector_text4]").html(" - " + makePrice(all_prices.addons.phphosting[phphosting_cycle[domain] + "4"][0]) + "/" + phphosting_billingcycle_textlong[domain]);

    $("div[id=" + domain + "_phphosting_billingtoggle]").html(toggletext);

    redraw_cart();
    toggleAddon(domain);

}


function cartitem(domain, type, options) {
	if (typeof(phphosting_cycle[domain]) === 'undefined' || 
		!phphosting_cycle[domain] ||
		typeof(phphosting_cycle[domain]) == 'object') {
		phphosting_cycle[domain] = "m";
	}
	if (typeof(phphosting_billingcycle_textlong[domain]) === 'undefined' || !phphosting_billingcycle_textlong[domain]) {
		phphosting_billingcycle_textlong[domain] = "month";
	}

	if (typeof(staticip_cycle[domain]) === 'undefined' || !staticip_cycle[domain]) {
	    staticip_cycle[domain] = "m";
	}

	if (typeof(staticip_billingcycle_textlong[domain]) === 'undefined' || !staticip_billingcycle_textlong[domain]) {
		staticip_billingcycle_textlong[domain] = "month";
	}

//	console.log("1 set phphosting_cycle for "+domain+" to " + phphosting_cycle[domain]);
//	console.log("1 set phphosting_billingcycle_textlong for "+domain+" to " + phphosting_billingcycle_textlong[domain]);
//	console.log("1 set staticip_cycle for "+domain+" to " + staticip_cycle[domain]);
//	console.log("1 set staticip_billingcycle_textlong for "+domain+" to " + staticip_billingcycle_textlong[domain]);

    this.name = domain;
    this.tld = getTld(domain);
    this.addons = null;

    multidomain = 1;
    //may not need
    this.type = type;
    this.options = options;

    this.options.price = (typeof this.options.price != "undefined" ? this.options.price: "12.95");
    this.options.privacy = (this.options.privacy ? this.options.privacy: default_privacy);
    this.options.sitelock = (this.options.sitelock ? this.options.sitelock: default_sitelock);
    this.options.phphosting = (this.options.phphosting ? this.options.phphosting: default_phphosting);
	
	this.options.phphosting_cycle = phphosting_cycle[domain];
	this.options.phphosting_billingcycle_textlong = phphosting_billingcycle_textlong[domain];
	this.options.staticip_cycle = staticip_cycle[domain];
	this.options.staticip_billingcycle_textlong = staticip_billingcycle_textlong[domain];
	
    this.options.term = (this.options.term ? this.options.term: default_term);
    if (this.type == "transfer") {
        this.options.auth = this.options.auth;
    }

    // build year term selector
    this.makeTermInfo = function() {
        var namelen = this.name.length;
        var mysel;
        if (this.name.substr(namelen - 2, namelen) == "uk" ||
        this.name.substr(namelen - 2, namelen) == "au" ||
        this.name.substr(namelen - 5, namelen) == "co.nz" ||
        this.name.substr(namelen - 4, namelen) == "mobi") {
            this.options.term = 2;
            mysel = "<input type='hidden' name='term' value='2'> Only available in 2 year terms.";
        } else if (this.name.substr(namelen - 2, namelen) == "co") {
            this.options.term = 1;
            //hack
            mysel = "<input type='hidden' name='term' value='1'> Only available in 1 year terms.";
            //hack
        } else {
            mysel = "<select name='term' onchange='updateTerm(\"" + this.name + "\",this.value)'  style='width: 125px;'>";
            for (var x = 1; x <= 3; x++) {
            
                var raw_price = all_prices.domains[this.tld][x - 1];
                mysel += "<option value='" + x + "' " + (x == this.options.term ? "selected='selected'": "") + " >" + x + " " + _("search_js_cart_year") + (x == 1 ? "": "s") + " - " + makePrice(raw_price) + "</option>";
            }
            mysel += "</select>";
        }
        return mysel;
    };

    this.makeAddonsListIcons = function(name) {
        var addonListIcon =
            '<span id="privacy_' + name + '_icon" class="icon_small privacy inactive"></span>' +
/*
            '<span id="phphosting_' + name + '_icon" class="icon_small hosting inactive"></span>' +
            '<span id="staticip_' + name + '_icon" class="icon_small staticip inactive"></span>' +
*/
            '<span id="sitelock_' + name + '_icon" class="icon_small sitelock inactive"></span>';
        return addonListIcon;
    };

    this.makeAddonsDetails = function() {
        var addonsTable = "<div align='center'><table class='manageTable' style='border-spacing: 2px; border-color: gray;'><tbody><tr>";
        var addonsTableEnd = "</tr></tbody><tfoot></tfoot></table></div>";
        // start entry for each addon
        // privacy
        addonsTable += "<td id='privacy_" + this.name + "' width='25%'><h3 class='titleAddon'><span class='icon privacy'></span> Privacy</h3><br>" + this.makePrivacy() +
        "</td>";

        // only do hosting in the US site for now
/*
        if (currency == "USA")
        {
            // hosting
            addonsTable += "<td id='phphosting_" + this.name + "' width='25%'><h3 class='titleAddon'><span class='icon hosting'></span> cPanel Powered Hosting</span></h3><br/>" + this.makePhpHosting() + "</td>";
            // static ip
            addonsTable += "<td id='staticip_" + this.name + "' width='25%'><h3 class='titleAddon'><span class='icon staticip'></span> Dedicated IP</h3><br/>" + this.makeStaticIP() + "</td>";
        }

        // sitelock
        addonsTable += "<td id='sitelock_" + this.name + "' width='25%'><h3 class='titleAddon'><span class='icon sitelock'></span> SiteLock</h3><br>" + this.makeSiteLock() +
        "</td>";
*/
        // end table
        addonsTable += addonsTableEnd;

        var addonsListing = $("<tr id='" + this.name + "_addonsListing' class='editHide " + this.name + "_addonsListing' style='display:none;' class='addonsList'><td colspan='5'><div class='editAddonRegion'><h2>Manage Add-Ons for " + this.name + "</h2>" + addonsTable + "</div></td></tr>");

        return addonsListing;
    };

    // build selector for year terms and price associations
    this.makeTerm = function() {
        // ugly hack for uk, but it saves having to make another ajax call until we have more domains that need specific renewal years
        // Also au, 2010/08/27.
        // And mobi, 2010/10/20. Its probably time to de-hack this =\
        var namelen = this.name.length;
        //hack
        var mysel;
        //hack
        if (this.name.substr(namelen - 2, namelen) == "uk" ||
        this.name.substr(namelen - 2, namelen) == "au" ||
        this.name.substr(namelen - 5, namelen) == "co.nz" ||
        this.name.substr(namelen - 4, namelen) == "mobi") {
            //hack
            this.options.term = 2;
            //hack
            mysel = "<input type='hidden' name='term' value='2'> Only available in 2 year terms. " + makePrice(all_prices.domains[this.tld][1]);
            //hack
        } else if (this.name.substr(namelen - 2, namelen) == "co") {
            this.options.term = 1;
            //hack
            mysel = "<input type='hidden' name='term' value='1'> Only available in 1 year terms.";
        } else {
            //hack
            mysel = "<select name='term' onchange='updateTerm(\"" + this.name + "\",this.value)'>";
            for (var x = 1; x <= 3; x++) {
                var raw_price = all_prices.domains[this.tld][x - 1];
                if (raw_price != "") {
                    // hack - only add a price option if a price exists
                    var price = makePrice(raw_price);
                    mysel += "<option value='" + x + "' " + (x == this.options.term ? "selected='selected'": "") + " >" + x + " " + _("search_js_cart_year") + (x == 1 ? "": "s") + " - " + price + "</option>";
                }
            }
            mysel += "</select>";
        }
        //:hack
        return mysel;
    };


   this.makeSiteLock = function() {
        getPrices();
        /*

        var sl_sel = "<div style='height: 180px; text-align: left;'><center>Protect Your Visitors</center><br/><br/>";

        for (var x = 0; x <= 3; x++) {
            sl_sel += '<input type="radio" id="' + this.name + '_sitelockselector" name="' + this.name + '_sitelockselector" onchange="updateSitelocks(\'' + this.name + '\',this.value)" value="' + x + '" ' + (x == current_sitelock_level ? 'selected="selected"': '') + ' > ';
            switch (x) {
            case 1:
                sl_sel += _("search_js_cart_basic") + " - " + makePrice(all_prices.addons.sitelock.y1[0]) + "/year<br />";
                break;
            case 2:
                sl_sel += _("search_js_cart_premium") + " - " + makePrice(all_prices.addons.sitelock.y2[0]) + "/year<br />";
                break;
            case 3:
                sl_sel += _("search_js_cart_smb") + " - " + makePrice(all_prices.addons.sitelock.y3[0]) + "/year<br />";
                break;
            case 0:
                sl_sel += "No SiteLock<br />";
                break;
            }
        }

        sl_sel += "</div><a href='/sitelock' target='_blank'><img src='/images/btn_learnMore_siteLock.png' border=0></a>";
*/
sl_sel = '';
        return sl_sel;
    };

    this.makePrivacy = function() {
        if (this.tld == "co.uk")
        {
            var privacyTxt = "<div style='height: 180px; text-align: left;'>Privacy is not available for this domain.</div>";
        } else {
            var privacyTxt = "<div style='height: 180px; text-align: left;'><center>Safeguard Your Identify</center><br/><br/><input type='checkbox' name='" + this.name + "_privacyselector' id='" + this.name + "_privacyselector' value='1' onclick='updatePrivacy(\"" + $.trim(this.name) + "\")' /> Enable" + " - " + makePrice(all_prices.addons.privacy[1][0]) + "/year";
            privacyTxt += "</div><a href='/services#privacy' target='_blank'><img src='/images/btn_learnMore_privacy.png' border=0></a>";
        }
        
        return privacyTxt;
    };

    this.makeStaticIP = function() {
        var toggletext;

        if (this.options.staticip_cycle) {
            staticip_cycle[this.name] = this.options.staticip_cycle;
		} 
	
        if (staticip_cycle[this.name] == "m") {
            staticip_billingcycle_textlong[this.name] = "month";
            toggletext = "<b>monthly</b> | <a href='#' onclick='updateStaticIPPriceText(\"" + domain + "\");'>annual</a>";
        } else {
            staticip_billingcycle_textlong[this.name] = "year";
            toggletext = "<a href='#' onclick='updateStaticIPPriceText(\"" + domain + "\");'>monthly</a> | <b>annual</b>";
        }
        //var sl_sel = "<div style='height: 150px; text-align: left;'><center><div id='"+this.name+"_staticip_billingtoggle'>"+toggletext+"</div></center><br />";
        var sl_sel = "<div style='height: 180px; text-align: left;'><center>Maximize SEO Value<br/><br/><div id='" + this.name + "_staticip_billingtoggle' style='display:none'>" + toggletext + "</div></center><br />";

        sl_sel += "<input type='checkbox' name='" + this.name + "_staticipselector' id='" + this.name + "_staticipselector' value='1' onclick='updateStaticIP(\"" + $.trim(this.name) + "\")' disabled /> Enable <div style='display:inline' id='" + this.name + "_staticipselector_text1'>" + " - " + makePrice(all_prices.addons.staticip[staticip_cycle[this.name] + "1"][0]) + "/" + staticip_billingcycle_textlong[this.name] + "</div><br/><br>Note: Dedicated IP requires a <br> Hosting Plan selection.";
        sl_sel += "</div><a href='/services#staticip' target='_blank'><img src='/images/btn_learnMore_staticIP.png' border=0></a>";

        return sl_sel;
    };

    this.makePhpHosting = function() {
        getPrices();
        var toggletext;


        if (this.options.phphosting_cycle) {
            phphosting_cycle[this.name] = this.options.phphosting_cycle;
        } else {
			phphosting_cycle[this.name] = "m";
		}
        
        if (phphosting_cycle[this.name] == "m") {
            phphosting_billingcycle_textlong[this.name] = "month";
            toggletext = "<b>monthly</b> | <a href='#' onclick='updatePhpHostingPriceText(\"" + domain + "\");'>annual</a>";
        } else {
            phphosting_billingcycle_textlong[this.name] = "year";
            toggletext = "<a href='#' onclick='updatePhpHostingPriceText(\"" + domain + "\");'>monthly</a> | <b>annual</b>";
        }

        var sl_sel = "<div style='height: 180px; text-align: left;'><center>Create A Website<br/><br/><div id='" + this.name + "_phphosting_billingtoggle'>" + toggletext + "</div></center><br />";
        sl_sel += "<input type='radio' name='" + this.name + "_phphostingselector' id='" + this.name + "_phphostingselector' value='0' onclick='updatePhpHosting(\"" + $.trim(this.name) + "\", \"0\"); return false' /> No Hosting<br />";
        sl_sel += "<input type='radio' name='" + this.name + "_phphostingselector' id='" + this.name + "_phphostingselector' value='1' onclick='updatePhpHosting(\"" + $.trim(this.name) + "\", \"1\"); return false' /> Tiny <div style='display:inline' id='" + this.name + "_phphostingselector_text1'>" + " - " + makePrice(all_prices.addons.phphosting[phphosting_cycle[this.name] + "1"][0]) + "/" + phphosting_billingcycle_textlong[this.name] + "</div><br />";
        sl_sel += "<input type='radio' name='" + this.name + "_phphostingselector' id='" + this.name + "_phphostingselector' value='2' onclick='updatePhpHosting(\"" + $.trim(this.name) + "\", \"2\"); return false' /> Small <div style='display:inline' id='" + this.name + "_phphostingselector_text2'>" + " - " + makePrice(all_prices.addons.phphosting[phphosting_cycle[this.name] + "2"][0]) + "/" + phphosting_billingcycle_textlong[this.name] + "</div><br />";
        sl_sel += "<input type='radio' name='" + this.name + "_phphostingselector' id='" + this.name + "_phphostingselector' value='3' onclick='updatePhpHosting(\"" + $.trim(this.name) + "\", \"3\"); return false' /> Medium <div style='display:inline' id='" + this.name + "_phphostingselector_text3'>" + " - " + makePrice(all_prices.addons.phphosting[phphosting_cycle[this.name] + "3"][0]) + "/" + phphosting_billingcycle_textlong[this.name] + "</div><br />";
        sl_sel += "<input type='radio' name='" + this.name + "_phphostingselector' id='" + this.name + "_phphostingselector' value='4' onclick='updatePhpHosting(\"" + $.trim(this.name) + "\", \"4\"); return false' /> Large <div style='display:inline' id='" + this.name + "_phphostingselector_text4'>" + " - " + makePrice(all_prices.addons.phphosting[phphosting_cycle[this.name] + "4"][0]) + "/" + phphosting_billingcycle_textlong[this.name] + "</div><br />";

        sl_sel += "</div><a href='/cpanel' target='_blank'><img src='/images/btn_learnMore_hosting.png' border=0></a>";

        return sl_sel;
    };

    this.makePriceItem = function() {
        getPrices();
        price = parseFloat(all_prices.domains[this.tld][this.options.term - 1]);
        if (this.options.privacy == "1") {
            price += parseFloat(all_prices.addons.privacy[1][this.options.term - 1]);
        }
        if (this.options.sitelock > 0) {
            price += parseFloat(all_prices.addons.sitelock["y" + this.options.sitelock][this.options.term - 1]);
        }
        if (this.options.phphosting > 0) {
            price += parseFloat(all_prices.addons.phphosting[phphosting_cycle[this.name] + this.options.phphosting][this.options.term - 1]);
        }
        if (this.options.staticip > 0) {
            price += parseFloat(all_prices.addons.staticip[staticip_cycle[this.name] + this.options.staticip][this.options.term - 1]);
        }

        if (this.type == "premium") {
            price += parseFloat(this.options.price);
        }
        return roundVal(price);
    }

    this.getPrice = function() {
        getPrices();
        // I wish I could remove all the parseFloats, but we need all the nubmers to be floats, not strings.  someday...
        price = parseFloat(all_prices.domains[this.tld][this.options.term - 1]);
        if (this.options.privacy == "1") {
            price += parseFloat(all_prices.addons.privacy[1][this.options.term - 1]);
        }
        if (this.options.sitelock > 0) {
            price += parseFloat(all_prices.addons.sitelock["y" + this.options.sitelock][this.options.term - 1]);
        }
        if (this.options.phphosting > 0) {
            price += parseFloat(all_prices.addons.phphosting[this.options.phphosting_cycle + this.options.phphosting][this.options.term - 1]);
        }
        if (this.options.staticip > 0) {
            price += parseFloat(all_prices.addons.staticip[this.options.staticip_cycle + this.options.staticip][this.options.term - 1]);
        }
        if (this.type == "premium") {
            price += parseFloat(this.options.price);
        }
        return roundVal(price);
    };

    this.getAddons = function() {
        if (this.addons == null) {
            var response = $.ajax({
                url: "/bin/ajax/tldinfo",
                async: false,
                data: {
                    domain: this.name,
                    get: "addons"
                },
                dataType: "json"
            }).responseText;
            var data = eval('(' + response + ')');
            this.addons = data.addons;
        }
        return this.addons;
    };

    this.hasAddon = function(addonname) {
        this.getAddons();
        for (var addon in this.addons) {
            if (this.addons[addon] == addonname) {
                return true;
            }
        }
        return false;
    };


}

tmp = new Object();

function shoppingcart(item, domain) {
    this.items = new Object();
    this.count = '0';

    this.toggleAddon = function(item) {
        $(".editHide").hide();
        if (item && item != "" && $('table[id=cart] tr[id=' + item + '_addonsListing]')) {
            if ($('table[id=cart] tr[id=' + item + '_addonsListing]').css('display') == "none")
            {
                $('table[id=cart] tr[id=' + item + '_addonsListing]').css('display', '');
            } else {
                $('table[id=cart] tr[id=' + item + '_addonsListing]').css('display', 'none');
            }
        }

        selectedDomain = item;

        if ($('table[id=cart] tr[id=' + item + ']')) {
            $('table[id=cart] tr[id=' + item + ']').css('background-color', '#ebf2f8');
            $('table[id=cart] tr[id=' + item + '_addonsListing]').css('background-color', '#ebf2f8');
        }

        selectedDomain = item;
    };

    var mycookie = $.cookie('domaincart');
    if (mycookie && mycookie != "{}") {
        var myitems = eval('(' + $.cookie('domaincart') + ')');
        $.each(myitems,
        function() {
            var options = new Object();
            options.price = this.options.price;
            options.privacy = this.options.privacy;
            options.sitelock = this.options.sitelock;
            options.phphosting = this.options.phphosting;
            options.staticip = this.options.staticip;
            options.phphosting_cycle = this.options.phphosting_cycle;
            options.staticip_cycle = this.options.staticip_cycle;

            options.term = this.options.term;
            if (this.options.auth) {
                options.auth = this.options.auth;
            }
            tmp[this.name] = new cartitem(this.name, this.type, options);
        });
        this.items = tmp;
    }

    this.addItem = function(domain, type, options) {
        this.items[domain] = new cartitem(domain, type, options);
        update("<p>" + _("search_js_cart_added" + (type == "transfer" ? "_transfer" : ""), Array(domain)) + "</p>");
    };

    this.removeItem = function(domain) {
        delete this.items[domain];
    };

    this.privatize = function(domain, checked) {
        this.items[domain]['options']['privacy'] = (checked ? "1": "0");
    };

    this.sitelockize = function(domain, level) {
        this.items[domain]['options']['sitelock'] = (level ? level: default_sitelock);
    };

    this.phphostingize = function(domain, level) {
        this.items[domain]['options']['phphosting'] = (level ? level: default_phphosting);
        this.items[domain].options.phphosting_cycle = phphosting_cycle[domain];
    };

    this.staticipize = function(domain, checked) {
        this.items[domain]['options']['staticip'] = (checked ? "1": "0");
        this.items[domain].options.staticip_cycle = staticip_cycle[domain];
    };

    this.updateStaticIP = function(domain) {
        if (this.items[domain]['options']['staticip'] == "0")
        {
            this.items[domain]['options']['staticip'] = "1";
        } else {
            this.items[domain]['options']['staticip'] = "0";
        }
        this.items[domain].options.staticip_cycle = staticip_cycle[domain];
        toggleAddon(domain);
    };

    this.updatePrivacy = function(domain) {
        if (this.items[domain]['options']['privacy'] == "0")
        {
            this.items[domain]['options']['privacy'] = "1";
        } else {
            this.items[domain]['options']['privacy'] = "0";
        }
    };

    this.updateSitelocks = function(domain, level) {
        current_sitelock_level = level;
        this.items[domain]['options']['sitelock'] = level;

        $("input[name=" + domain + "_sitelockselector]:radio")[0].checked = false;
        $("input[name=" + domain + "_sitelockselector]:radio")[1].checked = false;
        $("input[name=" + domain + "_sitelockselector]:radio")[2].checked = false;
        $("input[name=" + domain + "_sitelockselector]:radio")[3].checked = false;
        $("input[name=" + domain + "_sitelockselector]:radio")[level].checked = true;
    };

    this.updatePhpHosting = function(domain, level) {

        current_phphosting_level = level;
        this.items[domain]['options']['phphosting'] = level;

        $("input[name=" + domain + "_phphostingselector]:radio")[0].checked = false;
        $("input[name=" + domain + "_phphostingselector]:radio")[1].checked = false;
        $("input[name=" + domain + "_phphostingselector]:radio")[2].checked = false;
        $("input[name=" + domain + "_phphostingselector]:radio")[3].checked = false;
        $("input[name=" + domain + "_phphostingselector]:radio")[4].checked = false;
        $("input[name=" + domain + "_phphostingselector]:radio")[level].checked = true;

        /*
	if (level > 0) {
		this.items[domain]['options']['staticip'] = "1";
	*/
        //updateStaticIP(domain);
        //	} else {
        //	        this.items[domain]['options']['staticip'] = "0";
        //	}
        this.items[domain]['options']['staticip'] = oocart.items[domain]['options']['staticip'];


        //this.items[domain].options.phphosting_cycle = phphosting_cycle;
    };

    this.updateTerm = function(domain, term) {
        if (domain == "all") {
            default_term = term;
            $.each(this.items,
            function(i, item) {
                this.items[i]['options']['term'] = term;
            });
        } else {
            this.items[domain]['options']['term'] = term;
        }
    };
    this.clearCart = function() {
        manage_ind = 1;
        $.cookie("manageind", null);
        this.items = new Object();
        $.cookie('domaincart', null);
    };

    this.renderCart = function() {
        var domcount = this.getCount();
        var table = $("<div style='float:left;padding-left: 20px;padding-bottom:10px;'>Click on each domain to check out the add-ons and make your selections. You don't have to select the same plans for each domain in the cart.</div><br><table class='cart' id='cart'><thead><tr><th>Domain</th><th class='term-price'>Term</th><th class='term-price'>Add-Ons</th><th class='term-price'>Total Price</th><th class='remove'>Remove</th></tr></thead><tbody></tbody><tfoot></tfoot></table>");
        $.each(this.items,
        function(i, item) {
            var myaddons = item.makeAddonsListIcons(i);
            //ok
            var myaddonsdetails = item.makeAddonsDetails();
            var myterm = item.makeTermInfo();
            //ok
            var myprice = item.makePriceItem();
            //ok, need update hook too
            //var myremove 		= item.makeRemoveItem();	//ok
            // start cart entry row for each domain
            var row = $("<tr id='" + i + "'></tr>");
            // 1. domain radio for selection and domains name
            row.append("<td class='domain' onClick='toggleAddon(\"" + $.trim(this.name) + "\"); return false;'><div class='domain'> " + i + "</div><div class='addons'></div> " + (item['type'] == "transfer" ? "( transfer )": "") + "</td>");
            // 3. term total
            row.append("<td class='term-price' onClick='toggleAddon(\"" + $.trim(this.name) + "\");'>" + myterm + "</td>");
            // 2. addons icons faded in or out based on status
            row.append("<td class='addons' onClick='toggleAddon(\"" + $.trim(this.name) + "\");'><center>" + myaddons + "</center></td>");
            // 4. domains and adons price total
            row.append("<td class='term-price' onClick='toggleAddon(\"" + $.trim(this.name) + "\");'>" + makePrice(myprice) + "</td>");
            // 5. entry removal
            row.append("<td class='remove'><a href='#' onclick='removeFromCart(\"" + i + "\",\"" + item['type'] + "\"); return false;'><img src='images/icon_delete.png'/></a></td>");
            // add row to cart
            table.children("tbody").append(row);

            // add addon details to cart after domains entry
            table.children("tbody").append(myaddonsdetails);

        });

        var html = $("<div class='bluebox'><h2 class='bluebox'>" + _("search_js_cart_title") + "</h2><div class='blueboxcontent'><div style='margin: 10px;'></div><br style='clear: both;'></div></div>");
        html.children("div div").html(table);
        //html.children("div div").append(addontable);
        html.children("div div").append("<br>");
        html.children("div div").append("<div id='sumline'>" + this.renderSum() + "<button class='yellowbutton ui-corner-all' onclick='saveAndCheckOut(); return false;'>" + _("search_js_cart_proceed_to_checkout") + "</button></div>");
        html.children("div div").append("<br>");

        // Hack to embed cart-specific Omniture tagging
        var cart_frame = "<iframe src='/home/cart' width='0' height='0' frameborder='0'></iframe>";
        html.children("div div").append(cart_frame);

        if (selectedDomain) {
            showAddon(selectedDomain);
        }

        return html;
    };

    this.updateSelections = function(items) {
        $.each(this.items,
        function(i, item) {
            //hosting
            optionkey = "phphosting";
            optionval = item.options.phphosting;
            var selObj = $('table[id=cart] input[id=' + i + '_' + optionkey + 'selector]');
            selObj.selectedIndex = optionval;
            domainRowIcon = $('table[id=cart] span[id=' + optionkey + '_' + i + '_icon]');
            if (optionval == "0")
            {
                domainRowIcon.removeClass('icon_small hosting inactive');
                domainRowIcon.addClass('icon_small hosting inactive');
                domainRowIcon.css("opacity", "0.2");
            } else {
                domainRowIcon.removeClass('icon_small hosting inactive');
                domainRowIcon.addClass('icon_small hosting');
                domainRowIcon.css("opacity", "1");
            }

            //privacy
            optionkey = "privacy";
            optionval = item.options.privacy;
            var selObj = $('table[id=cart] input[id=' + i + '_' + optionkey + 'selector]');
            if (optionval == "1")
            {
                selObj.attr('checked', 'checked');
            } else {
                selObj.removeAttr('checked');
            }
            domainRowIcon = $('table[id=cart] span[id=' + optionkey + '_' + i + '_icon]');
            if (optionval == "0")
            {
                domainRowIcon.removeClass('icon_small privacy inactive');
                domainRowIcon.addClass('icon_small privacy inactive');
                domainRowIcon.css("opacity", "0.2");
            } else {
                domainRowIcon.removeClass('icon_small privacy inactive');
                domainRowIcon.addClass('icon_small privacy');
                domainRowIcon.css("opacity", "1");
            }

            //phphosting
            optionkey = "phphosting";
            optionval = item.options.phphosting;
            var selObj = $('table[id=cart] input[id=' + i + '_' + optionkey + 'selector]');

            if (selObj.length > 0)
            {
                $("input[name=" + i + "_phphostingselector]:radio")[0].checked = false;
                $("input[name=" + i + "_phphostingselector]:radio")[1].checked = false;
                $("input[name=" + i + "_phphostingselector]:radio")[2].checked = false;
                $("input[name=" + i + "_phphostingselector]:radio")[3].checked = false;
                $("input[name=" + i + "_phphostingselector]:radio")[4].checked = false;
                $("input[name=" + i + "_phphostingselector]:radio")[optionval].checked = true;
    
                domainRowIcon = $('table[id=cart] span[id=' + optionkey + '_' + i + '_icon]');

	        if (optionval == 0) {
       		      $('input[name=' + i + '_staticipselector]').enable(false);
        	      $('input[name=' + i + '_staticipselector]').selected(false);
        	      item.options.staticip = "0";
        	} else {
        	      $('input[name=' + i + '_staticipselector]').enable(true);
		}
	    }

            //staticip
            var phphosting_staticipval = item.options.phphosting;

            optionkey = "staticip";
            optionval = item.options.staticip;
            var selObj = $('table[id=cart] input[id=' + i + '_' + optionkey + 'selector]');

            if (optionval == "1")
            {
                selObj.attr('checked', 'checked');
            } else {
                selObj.removeAttr('checked');
            }
            domainRowIcon = $('table[id=cart] span[id=' + optionkey + '_' + i + '_icon]');

            if (optionval == "0")
            {
                domainRowIcon.removeClass('icon_small staticip inactive');
                domainRowIcon.addClass('icon_small staticip inactive');
                domainRowIcon.css("opacity", "0.2");
            } else {
                domainRowIcon.removeClass('icon_small staticip inactive');
                domainRowIcon.addClass('icon_small staticip');
                domainRowIcon.css("opacity", "1");
            }

            //sitelock
            optionkey = "sitelock";
            optionval = item.options.sitelock;
            var selObj = $('table[id=cart] div[id=' + i + '_' + optionkey + 'selector]');

            selObj.selectedIndex = optionval;
            domainRowIcon = $('table[id=cart] span[id=' + optionkey + '_' + i + '_icon]');

            if (optionval == "0")
            {
                domainRowIcon.removeClass('icon_small sitelock inactive');
                domainRowIcon.addClass('icon_small sitelock inactive');
                domainRowIcon.css("opacity", "0.2");
            } else {
                domainRowIcon.removeClass('icon_small sitelock inactive');
                domainRowIcon.addClass('icon_small sitelock');
                domainRowIcon.css("opacity", "1");
            }

            $("input[name=" + i + "_sitelockselector]:radio")[0].checked = false;
            $("input[name=" + i + "_sitelockselector]:radio")[1].checked = false;
            $("input[name=" + i + "_sitelockselector]:radio")[2].checked = false;
            $("input[name=" + i + "_sitelockselector]:radio")[3].checked = false;
            $("input[name=" + i + "_sitelockselector]:radio")[optionval].checked = true;

        });
        //redraw_cart();
        //toggleAddon(domain);
    }

    this.renderSum = function() {
        var sum = 0.0;
        var count = 0;
        $.each(this.items,
        function(i, item) {
            sum += parseFloat(item.getPrice());
            count++;
        });
        return "<span id='sum'>" + _("search_js_cart_total", Array(count.toString(), (count == 1 ? "": "s"))) + "&nbsp;&nbsp;&nbsp;&nbsp; " + makePrice(roundVal(sum)) + "</span>";
    };

    this.getCount = function() {
        var count = 0;
        $.each(this.items,
        function(i, item) {
            count++;
        });
        return count;
    };

    this.domainList = function() {
        var list = new Array();
        $.each(this.items,
        function(i, item) {
            list.push(item.name);
        });
        return list;
    };

    this.getSum = function() {
        var sum = 0.0;
        $.each(this.items,
        function(i, item) {
            sum += parseFloat(item.getPrice());
        });
        return roundVal(sum);
    };

    this.save = function() {
        var myJSONText = JSON.stringify(this.items, replacer);
        $.cookie('domaincart', myJSONText, { path: '/' });
    };

    this.checkOut = function() {

        var myJSONText = JSON.stringify(this, replacer);
        var origin = '';
        origin = $.cookie("origin");

        $.getJSON("/bin/checkout", {
            json: myJSONText,
            origin: origin,
            currency: currency
        },
        function(data) {

            if (! (data.url == undefined || data.url == "")) {
                window.location = data.url
            }
        },
        "text");
    };

    this.itemCount = function() {
        var size = 0,
        key;
        for (key in this.items) {
            if (this.items.hasOwnProperty(key)) size++;
        }
        return size;
    };
}


