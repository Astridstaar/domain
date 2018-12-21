var urls = new Object();
urls['tripod'] = "tripod.com";
urls['angelfire'] = "angelfire.com";
urls['webon'] = "ash.com";
var hidesavebtn = 0;

function byteformatted(bytes){
        if (bytes >= 1073741824) {
             bytes = number_format(bytes / 1073741824, 2, '.', '') + ' Gb';
        } else { 
                if (bytes >= 1048576) {
                bytes = number_format(bytes / 1048576, 2, '.', '') + ' Mb';
        } else { 
                        if (bytes >= 1024) {
                bytes = number_format(bytes / 1024, 0) + ' Kb';
                } else {
                bytes = number_format(bytes, 0) + ' bytes';
                        };
                };
        };
  return bytes;
};
function number_format( number, decimals, dec_point, thousands_sep ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +     bugfix by: Michael White (http://crestidg.com)
    // +     bugfix by: Benjamin Lupton
    // +     bugfix by: Allan Jensen (http://www.winternet.no)
    // +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)    
    // *     example 1: number_format(1234.5678, 2, '.', '');
    // *     returns 1: 1234.57     
 
    var n = number, c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
    var d = dec_point == undefined ? "," : dec_point;
    var t = thousands_sep == undefined ? "." : thousands_sep, s = n < 0 ? "-" : "";
    var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

function emailobj(email, type, dest, used, quota, percent, sendcount, sendlimit, vendor){
    this.email = email;
    this.account = email.split("@")[0];
    if(this.account == '*') this.account = 'default';
    this.domain = email.split("@")[1];
    this.type = type;
    this.passdest = dest;
    this.used = used;
    this.quota = quota;
    this.percent = percent;
    this.sendcount = sendcount;
    this.sendlimit = sendlimit;
    this.sendpercent = parseFloat(this.sendcount)/parseFloat(this.sendlimit) * 100;
    this.vendor = vendor;
    
    if (vendor === undefined) {
	this.vendor = "Tucows";
    }

    this.HTML = function(){
        var email = new Bubble(this.account, "ok");
        email.icon = "icon_email_"+this.type+".png";
        email.title = "<span>" + this.email + "</span>";
        email.form_onsubmit = "saveEmail(\""+this.email+"\");return false;"; 
        hidden = new Hash("domain", this.domain, "account", this.account, "type", this.type, "vendor", this.vendor);
        
        switch(this.type){
          case "forwards":{  
              email.closed = "closed";
              email.title += "<span> forwards to </span><input type='text' value='" + this.passdest +"' name='passdest'/></p>"; 
              email.title += hidden.hiddenFields(); 
              email.buttons += "<input type='image' src='/images/btn_save.png' alt='save'/><img type='button' src='/images/btn_delete_account.png' onclick='deleteEmail(\""+this.email+"\")' alt='Delete Account'/>";
              break; }
          case "pop":{ 
              email.title += " [ <a href='/service/email/check_email?domain="+this.domain+"&account="+this.account+"&vendor="+this.vendor+"'>Login</a> ]";

              var pop_table = new infoTable();
              pop_table.addRow("account", "User Name", (this.account == "default"? "* (default)" : this.account) );
              pop_table.addRow("passwordedit", "Password", "<a href='javascript:void(0)' onclick='editPassword(this)' >change password</a>");
              pop_table.addRow("password", "New Password", "<input type='password' value='" + this.passdest +"' name='passdest'/>", 1);
              pop_table.addRow("password", "Confirm Password", "<input type='password' value='" + this.passdest +"' name='passdest2'/>", 1);
              email.body += hidden.hiddenFields(); 
              email.body += pop_table.HTML(); 
              email.body += "<br/>";
              
	      /*	
	      email.body += "<div class='inner bk-blank outline'>";
              var sendicon = "good";
              if (this.sendpercent > 85){
                  sendicon = "bad";
              } else if (this.sendpercent > 60){
                  sendicon = "warn";
              }
              var quotaicon = "good";
              if (this.percent > 85){
                  quotaicon = "bad";
              } else if (this.percent > 60){
                  quotaicon = "warn";
              }
		*/
              //    email.body += "<p><span class='bold "+(sendicon=="bad"?"red":"")+"'>Daily sending limits :</span> <img class='emailwarn' src='/images/icon_"+sendicon+".png'/>  ("+this.sendcount+" of "+this.sendlimit+" emails sent today)</p>";
              //email.body += "<p><span class='bold "+(quotaicon=="bad"?"red":"")+"'>" + _("domains_js_email_quota") + " :</span> <img class='emailwarn' src='/images/icon_"+quotaicon+".png'/>  ("+byteformatted(this.used)+" of "+byteformatted(this.quota)+" used)</p>";
              //email.body += "</div><br/>";
              //var sendquota = makeQuota(this.sendcount, this.sendlimit, "Emails", null,"mini");
              //email.title += sendquota;
              //email.body += "<br style='clear:both;'/>";
              email.body += "<div class='click editbuttons'><input type='image' src='/images/btn_save.png' alt='save'/> <img type='button' src='/images/btn_delete_account.png' onclick='deleteEmail(\""+this.email+"\")' alt='Delete Account'/></div>";
              break; }
          case "alias":{  
              email.closed = "closed";
              email.title += "<span> is an Alias for </span><input type='text' value='" + this.passdest +"' name='passdest'/></p>"; 
              email.title += hidden.hiddenFields(); 
              email.buttons += "<input type='image' src='/images/btn_save.png' alt='save'/> <img type='button' src='/images/btn_delete_account.png' onclick='deleteEmail(\""+this.email+"\")' alt='Delete Account'/>";
              break; }
        }

        return email.HTML();
    }; 
 
}


function smultiply(character, times){
var out = ""
for (x=0;x<times;x++){
out += character;
}
return out;
}

function Bubble(name, type, icon, closed){
    this.name = name;
    this.type = type;
    this.icon = icon;
    if (closed) {
        this.closed = closed;
    } 
    this.title = "";
    this.body = "";
    this.buttons = "";
    this.form_id = "";
    this.form_onsubmit = "";
    this.arbitrarycode = "";

    this.HTML = function(){
        var html = "<form "+(this.form_id != ""? " id='"+this.form_id+"'" : "")+" onsubmit='"+this.form_onsubmit+"'><div id='"+this.name+"' class='bubble bubblebody bk-"+this.type+"light outline ui-corner-all-wide "+this.closed+"'>";
        if (this.title != "") {
            html += "<div class='bubbletitle bk-"+this.type+"dark outline ui-corner-all-wide'>";
            html += "<span class='icon'>"+(this.icon?"<img src='/images/"+this.icon+"'/>":" ")+"</span>";
            html += "<span class='name'>"+this.title+"</span>";
            html += "<span class='buttons'>"+this.buttons;
            if(this.body != "") {
		if(this.closed != "unclosable") {
		    html += "<img class='arrow' onclick='toggleInfo(this)' src='/images/icon_arrow_"+(this.closed == null ? "up" : "down" )+".png'/>";
		}
            }
            html += "</span>";
            html += "</div>";
        }
            html += this.arbitrarycode
        if (this.body != ""){
            html += "<div class='bubblebodytext' "+(this.closed=="closed"?"style='display:none;'":"")+">";
            html += this.body; 
            html += "</div>";
        }
        html += "</div></form>";
        return html;
    };

    this.HTML2 = function(){
        var html = "<form "+(this.form_id != ""? " id='"+this.form_id+"'" : "")+" onsubmit='"+this.form_onsubmit+"'><div id='"+this.name+"' class='bubble bubblebody bk-"+this.type+"light outline ui-corner-all-wide "+this.closed+"' style='text-align:left;'>";
        html += "<span class='icon' style='float:left'>"+(this.icon!=""?"<img src='/images/"+this.icon+"'/>":" ")+"</span>";
        html += "<div class='' style='text-align:left'>";
        html += "<span class='name'>"+this.title+"</span>";
        html += "<span class='buttons'>"+this.buttons;
        html += "</span>";
        html += "</div>";
        html += "<div class='bubblebodytext' "+(this.closed=="closed"?"style='display:none;'":"")+">";
        html += this.body; 
        html += "</div>";
        html += "</div></form>";
        return html;
    };
}



function subdomain(item, domain){
    var subdomparent = this;
    this.domain = domain;
    this.type = item.type;
    this.host = item.host;
    //optional
    this.member = membername;
    this.namespace = item.namespace;
    if(this.namespace == undefined) {
	this.namespace == 'us';
	if(this.member.toLowerCase() != alias['tripod'].toLowerCase() && this.member.toLowerCase() == alias['tripod_uk'].toLowerCase()) {
	    this.namespace = 'uk';
	}
    }
    this.sedo_username = item.sedo_username;
    this.subdir = "";
    this.dest = "http://";
    this.type = item.type; 
    if (item.type == "tripod" || item.type == "angelfire"){
        this.member = (item.state != "" ? item.state + "/":"") + item.member;
        this.state= item.state;
        this.url= urls[item.type];
        if (item.dest.indexOf("/") != -1){
            if (this.state != ""){
                if (item.dest.indexOf("/", item.dest.indexOf("/")+1) != -1){
                    this.subdir = item.dest.substring(item.dest.indexOf("/", item.dest.indexOf("/")+1)+1,1000);
                } else {
                    this.subdir = '';
                }
            } else {
                this.subdir = item.dest.substring(item.dest.indexOf("/")+1,1000);
            }
        } else {
            this.subdir = '';
        }
        this.dest = item.dest;
    } else if (item.type == "frame" || item.type == "redirect" || item.type=="forwarding"){
/*
        if (item.masking == "0") {
            this.type = "redirect";
        } else {
            this.type = "frame";
        }
*/
        this.dest = item.dest;
    } else if (item.type == "ip" || item.type == "cname"){
        this.dest = item.dest;
    } else if (item.type == "publish") {
        this.dest = 'http://publish.lycos.com';
    }

    this.changeType = function(newtype){ 
        if (newtype == "angelfire" || newtype == "tripod" || newtype == "publish") {
            this.subdir = "";
        }
        this.type = newtype; 
    };

    this.changeNamespace = function(newnamespace){ 
        this.namespace = newnamespace;
    };

    this.HTML = function(open){
        var sub = new Bubble(this.host, "ok");
        sub.icon = "icon_globe.png";
        sub.title = this.host + "." + this.domain;
        sub.form_id = "myform";
        if (this.type != "ash"){
            sub.form_onsubmit = "saveSubdomain(this);return false;";
        }
        myhtml = "  <input type='hidden' name='domain' value='"+this.domain+"'/>\
                    <input type='hidden' name='type' value='"+this.type+"'/>\
                    <input type='hidden' name='oldhost' value='"+this.host+"'/>\
                    <input type='hidden' name='subdir' value='"+this.subdir+"'/>\
                    <p>";

        if (this.host != "www") {
            if (open != "open"){
            	sub.closed = "closed" ;
            }
            myhtml += "<input type='hidden' name='host' value='"+this.host+"'/>";
            myhtml += this.host + "." + this.domain ;
        } else {
            myhtml += "<input type='hidden' name='host' value='"+this.host+"'/>";
            myhtml += this.host + "." + this.domain ;
        }


        switch(this.type){
            case "tripod": myhtml += " is <span class='dropplace'/>"+this.__makeDrop__() ; break;
            case "angelfire": myhtml += " is <span class='dropplace'/>"+this.__makeDrop__() ; break;
            case "publish": myhtml += " is <input type='hidden' name='dest' value='http://publish.lycos.com'/><span class='dropplace'/>"+this.__makeDrop__() ; break
            case "ash": myhtml += _("domains_js_hostedwith_webon"); break; 
            case "phphosting": myhtml += " is <span class='dropplace'/>"+this.__makeDrop__(); break;
            case "parked": myhtml += " is a <span class='dropplace'/>"+this.__makeDrop__()+" page."; break;
            case "cashparking": myhtml += " is <span class='dropplace'/>"+this.__makeDrop__(); break;
            case "frame": myhtml += " is <span class='dropplace'/>"+this.__makeDrop__()+" to <input type='text' name='dest' value='"+ (isURL(this.dest)? this.dest : "http://")+"'/>"; break;
            case "redirect": myhtml += " is "+this.__makeDrop__()+" to <input type='text' name='dest' value='"+ (isURL(this.dest) ? this.dest : "http://") +"'/>"; break;
            case "ip": myhtml += " is "+this.__makeDrop__()+" to <input type='text' name='dest' value='"+  this.dest +"'/>"; break;
            case "cname": myhtml += " is "+this.__makeDrop__()+" to <input type='text' name='dest' value='"+ this.dest +"'/>"; break;
        }

        myhtml +=" </p><br/>";
        if (this.type == "tripod" || this.type == "angelfire") {
	    hidesavebtn = 0; 
	    var member_editable = 0;
	    if(this.member != alias[this.type] || (this.type != 'angelfire' && (this.namespace == 'uk' && this.member != alias['tripod_uk']))) 
        { 
            member_editable = 1; 
        }

        var minfo_table = new infoTable();
        var a_table = new infoTable();
	    var tripod_namespace = '';
	    
        if(this.type == "tripod") 
        {
			tripod_namespace = '<span class="s_tripod_namespace"' + (member_editable ? '':' style="display:none;"') + '>&nbsp;&nbsp;<select name="tripod_namespace" onchange=\'checkName("'+this.host+'","'+this.dest+'",this.value); getDirs("'+this.host+'");\'><option value="us"'+(this.namespace=='us'?' selected':'')+'>Tripod US (tripod.com)</option><option value="uk"'+(this.namespace=='uk'?' selected':'')+'>Tripod UK (tripod.co.uk)</option></select></span>';
	    }


	    minfo_table.addRow("hmname", this.type.replace(/\w/,this.type.charAt(0).toUpperCase())+" User Name","<span class='hmembername'><span class='hmnamestatic'"+(member_editable?" style='display:none;'":"")+">"+makeCleanUsername(this.dest)+" <a href='javascript:void(0);' onclick='changeMembername(\""+this.host+"\",\""+this.dest+"\",\""+this.namespace+"\")'>edit</a></span> <span class='hmnameinput'"+(member_editable?"":"style='display:none;'")+"><input type='text' onblur='getDirs(\""+this.host+"\");' onkeyup='checkName(\""+this.host+"\",this.value,\""+this.namespace+"\");' name='member' value='"+makeCleanUsername(this.dest)+"'/></span></span>"+tripod_namespace);
	    minfo_table.addRow("pass", "Password","<input type='password' name='password' value='' onblur='getDirs(\""+this.host+"\");' />",!member_editable);
		 
//	    a_table.addRow("hmname", "Assignment","<span class='assignmenthost'>"+ makeDest(this.type,this.dest,this.namespace) + "</span><span class='dest'>"+this.subdir+"</span><a href='javascript:void(0);' class='editfolderlink' onclick='changeMembername(\""+this.host+"\",\""+this.dest+"\",\""+this.namespace+"\");getDirs(\""+this.host+"\");$(this).hide();'>edit</a>");
	    a_table.addRow("hmname", "Assignment","<span class='assignmenthost'>"+ makeDest(this.type,this.dest,this.namespace) + "</span><a href='javascript:void(0);' class='editfolderlink' onclick='getDirs(\""+this.host+"\");$(this).hide();'>edit</a>");
	    a_table.addRow("folders", "Folders","<ul class='subdirs' style='padding-left:10px;'></ul>",1);
	    myhtml += "<p>"+minfo_table.HTML()+"<br/>"+a_table.HTML()+"<br/></p>" ;
        }

        if (this.type == "publish") {
        hidesavebtn = 0; 
        var member_editable = 0;
                if(this.member != alias[this.type] || (this.type != 'publish')) { 
                    member_editable = 1; 
                }
                //call the Publish Sites API to get user blogs
                var response = $.ajax({
                    url: "/bin/ajax/getPublishBlogs",
                    async: false,
                    data: {
                        domain: current_domain,
                        user: this.member,
                        get: "blogs"
                    },
                    dataType: "json"
                }).responseText;
                var data = eval('(' + response + ')');


                var minfo_table = new infoTable();
                var c_table = new infoTable();
                //alert(Object.keys(data));
                var keys = Object.keys(data);

            myhtml += "<select name='siteid'>";
 
               for(var i = 0; i < keys.length; i++) {
                   var l = keys[i]
                   myhtml += "<option value='"+data[l].userblog_id+"'>"+data[l].blogname+"</option>"
                }
            myhtml += "</select><br />";
        }


        if (this.type == "cashparking") { 
            hidesavebtn = 0;

	    if(this.sedo_username) {
		myhtml += _("domains_js_cashparking_stats");
	    } else {
		myhtml += _("domains_js_cashparking_sedo");
	    }

        }

	if (this.type == "phphosting")
        {
	    if (hosting[this.domain] === undefined ) {
/*
	    myhtml += '<div id="phphosting" class="bubble bubblebody bk-yellowlight outline ui-corner-all-wide undefined"><div class="bubbletitle bk-yellowdark outline ui-corner-all-wide"><span class="icon hosting"></span><span class="name">Web Hosting</span><span class="buttons"><a href="/service/addon?domain='+this.domain+'&addon=phphosting&value=1"><img type="image" src="/images/btn_on.png" class="btn"></a><img type="image" src="/images/btn_off_selected.png" class="btn"><img class="arrow" onclick="toggleInfo(this)" src="/images/icon_arrow_up.png"></span></div><div class="bubblebodytext"><div class="inner bk-blank outline"><p>Web Hosting has not been enabled for this domain. By purchasing our advanced web hosting solution, you can host advanced web applications on your domain and purchase dedicated IP addresses. Plans start at just <b>$22.00 a year.</b></p><p class="centered"><a href="/web_hosting.html" target="_blank"><img border="0" src="/images/btn_learnMore_hosting.png"></a> <a href="/service/addon?domain='+this.domain+'&addon=phphosting&value=1"><img border="0" src="/images/btn_sign_up_h.png"></a></p></div></div></div>';
*/
	    hidesavebtn = 1;
	    } else {
	            hidesavebtn = 0;
		    var hostingd = hosting[this.domain];
	            var minfo_table = new infoTable();
	            var a_table = new infoTable();
	            var b_table = new infoTable();
	    		minfo_table.addRow("hmname", "Control Panel Access","<span class='assignmenthost'><a href='https://"+ hostingd['server_name'] + ":2083/login?user=" +  hostingd['username'] + "&pass=" + hostingd['password'] + "' target='_new'>Login</a></span>");

            		a_table.addRow("hmname", "SSH Hostname","<span class='assignmenthost'>"+hostingd['server_name']+"</span>");
            		a_table.addRow("hmname", "Username","<span class='assignmenthost'>"+hostingd['username']+"</span>");
            		a_table.addRow("hmname", "Password","<span class='assignmenthost'>"+hostingd['password']+"</span>");

            		b_table.addRow("hmname", "Bandwidth Limit","<span class='assignmenthost'>"+hostingd['bandwidth_limit']+" GB</span>");
            		b_table.addRow("hmname", "Disk Space Limit","<span class='assignmenthost'>"+hostingd['disk_space_limit']+" GB</span>");
            		b_table.addRow("hmname", "IP Address","<span class='assignmenthost'>"+hostingd['ip']+"</span>");

            		myhtml += "<input type='hidden' name='dest' value='"+hostingd['ip']+"'><p>"+minfo_table.HTML()+"<br/>"+a_table.HTML()+"<br/>"+b_table.HTML()+"</p>" ;
	     }
	        myhtml += "<div class='click editbuttons'><span class='save_wait' style='display:none;'><img src='/images/loading.gif'/></span></div>";

	} else {
        hidesavebtn = 0;
    }

	if(this.type == 'cashparking' && ! this.sedo_username) {
            hidesavebtn = 0;
	    myhtml += "<span class='savebutton'><input type='image' src='/images/btn_next.png' alt='next'/></span><input type='hidden' name='redirect' value='cashparking'/>";
	} else {
	    if (hidesavebtn == 0) {
		myhtml += (this.type!="ash"?"<span class='savebutton'><input type='image' src='/images/btn_save.png' alt='save'/></span> ":"") + (this.host != "www" ? "<img type='button' src='/images/btn_delete.png' onclick='deleteSubdomain(\""+this.host+"\")' alt='Delete Subdomain'/>" : "" );
	    }
	}

        sub.body = myhtml;

        return sub.HTML();
    };

    this.__makeDrop__ = function (){
        var types = new Hash('tripod', _("domains_js_hostedwith_tripod"), 'angelfire', _("domains_js_hostedwith_angelfire"), 'publish', _("domains_js_hostedwith_publish"), 'phphosting', _("domains_js_phphosting"), 'parked', _("domains_js_parked"), 'frame', _("domains_js_forwarding_frame"), 'redirect', _("domains_js_forwarding_redirect")) ;           
        var atypes = new Hash('ip', _("domains_js_ip"), 'cname', _("domains_js_cname"));
    var editdrop = '<select class="typeselect" name="type" onchange="changeType(\''+this.host+'\',this.value)">';

    if (this.type == 'cashparking')
        {
            types.items['cashparking'] = _("domains_js_cashparking");
        }
    for (var item in types.items) {
        editdrop += "<option value='" + item + "' " + (this.type == item ? "selected" : "") + ">"+types.items[item]+"</option>";
    }
    if (state == "advanced" || atypes.hasItem(this.type)){
        for (var item in atypes.items) {
        editdrop += "<option value='" + item + "' " + (this.type == item ? "selected" : "") + ">"+atypes.items[item]+"</option>";
        }
    } else {
        editdrop += "<option value='advanced'>" + _("domains_js_advanced") + "</option>";
    }
    
        editdrop += '</select>';
        return editdrop;
    };

    this.changeTypeold = function(newtype){
    this.value=newtype;
        if (this.value=="advanced") {
            toggle_advanced("Simple");
        } else {
            if (this.value == "angelfire" || this.value == "tripod") {
                this.subdir = "";
            }
            subdomparent.type = this.value; 
            //updateSubdomain(subdomparent.host);
            $("#" + subdomparent.host).parents('form').after(subdomparent.HTML("open")).remove();
        }
    };


    this.changeType = function(){
        if (this.value=="advanced") {
            toggle_advanced("Simple");
        } else {
            if (this.value == "angelfire" || this.value == "tripod") {
                this.subdir = "";
            }
            subdomparent.type = this.value; 
            $("#" + subdomparent.host).after(subdomparent.HTML()).remove();
        }
    };

}

function obj2str ( obj ) {
  $("body").append("<div id='mytmpdiv' style='ddsplay:none;'></div>");
  $("#mytmpdiv").append(obj);
  x = $("#mytmpdiv").html();
  $("#mytmpdiv").remove();
  return x;
}


function isURL(url){

    if (url.indexOf(".") > 0){
        if (url.lastIndexOf(".") != url.length-1){
            return 1;
        }
    }
    return null;
}

function isIP(ip){
    octs = ip.split('\.');
    if ((octs.length-1) == 3){
        for(var oct in octs){
            if (parseInt(octs[oct]) != octs[oct]){
                return null;
            }
        }
        return 1;
    }
    return null;
}

function makeCleanUsername(dest)
{
    if (dest == "http://" || dest == "http:")
        return "";
    
    //console.log(dest);
    
	if (dest.match(/\//g))
	{
		var splitup = dest.split('/');
		return splitup[0];
	} else {
		return dest;
	}
}

function changeMembername(host, membername, namespace){
    $("#" +host+ " .hmnamestatic").hide();
    $("#" +host+ " .hmnameinput").show();
    $("#" +host+ " form").find(".dest").text("");
    $("#" +host+ " form").find("input[name='subdir']").val("");
    $("#" +host+ " .s_tripod_namespace").show();

    checkName(host,membername,namespace);
}

function checkName(host, membername, namespace){
    var checktype = mysubdomains[host].type;
    var namespace_dropdown_value = $("#"+host+" select[name='tripod_namespace']").val();
    if(namespace == 'uk' && checktype == 'tripod') {
	checktype = 'tripod_uk';
    }

    //if (checktype in alias && membername.toLowerCase() == alias[checktype].toLowerCase() && namespace == namespace_dropdown_value){
    //    $("#" +host+ " .pass").hide();
    //} else {
        $("#" +host+ " .pass").show();
		//}
    $("#" +host+ " .assignmenthost").html(makeDest(mysubdomains[host].type,membername,namespace_dropdown_value)); 
}

function Hash()
{
        this.length = 0;
        this.items = new Array();
        for (var i = 0; i < arguments.length; i += 2) {
                if (typeof(arguments[i + 1]) != 'undefined') {
                        this.items[arguments[i]] = arguments[i + 1];
                        this.length++;
                }
        }
        this.hasItem = function(in_key){
            return typeof(this.items[in_key]) != 'undefined';
        }

        this.hiddenFields = function(){
            var fields = "";
            for (x in this.items) {
                fields +="<input type='hidden' name='"+x+"' value='"+this.items[x]+"'/>" ;
            }
            return fields;
        };
}
                
function infoTable(){
    this.rows = new Array();
    this.header = null;
    this.specialcol = null;
    this.addRow = function(rowclass,field,info,hidden){
        var row = new infoTableRow(rowclass,field,info,hidden);
        this.rows.push(row);
    };
    this.addHeader = function(rowclass,field,info,hidden){
        this.header = new infoTableHeader(rowclass,field,info,hidden);
    };

    this.HTML = function(){
        var html = "<table border='0' cellspacing='0' class='outline'>";
	if(this.header) html += this.header.HTML(this.specialcol);
        for (x in this.rows){
            html += this.rows[x].HTML(this.specialcol);
            if (this.specialcol) { this.specialcol = " "; }
        }
        html += "</table>";
        return html;
    };

}

function infoTableRow(rowclass, field, info, hidden){
    this.rowclass= rowclass;
    this.field = field;
    this.info = info;
    this.hidden = hidden;
    this.HTML = function(special){
        var html = "<tr class='"+rowclass+"' "+(this.hidden==1?"style='display:none;'":"")+">";
        html += "<td class='labels bk-okdark rightoutline'>"+field+":</td>";
        if (special) {
            if (special != " "){
                html += "<td class='info bk-blank' rowspan='100'>"+special+"</td>";
            }
        } else {
            html += "<td class='info bk-blank'>"+info+"</td>";
        }
        html += "</tr>";
        return html;
    };
}

function infoTableHeader(rowclass, field, info, hidden){
    this.rowclass= rowclass;
    this.field = field;
    this.info = info;
    this.hidden = hidden;
    this.HTML = function(special){
        var html = "<tr class='"+rowclass+"' "+(this.hidden==1?"style='display:none;'":"")+">";
        html += "<th class='labels bk-okdark rightoutline'>"+field+":</td>";
        if (special) {
            if (special != " "){
                html += "<th class='info bk-blank' rowspan='100'>"+special+"</td>";
            }
        } else {
            html += "<th class='info bk-blank'>"+info+"</td>";
        }
        html += "</tr>";
        return html;
    };
}

function expertTable() {
    this.rows = new Array();

    this.addRow = function(field,info,ttl,hidden) {
        var row = new expertTableRow(field,info,ttl,hidden);
        this.rows.push(row);
    };

    this.deleteRow = function(deleterownum) {
	this.rows.splice(deleterownum, 1);
        /*var newrows = new Array();
        for (x in this.rows) {
            if(this.rows[x].rowid != deleterowid) {
		this.rows[x].rowid = x;
		newrows.push(this.rows[x]);
	    }
        }

	this.rows = newrows;*/
    };

    this.HTML = function() {
        var html = "<form id='expert' onsubmit='saveExpert(this); return false;'><input type=hidden id='hiddentest' value=test><table border='0' cellspacing='0' class='outline'>";
	html += "<tr class='title'><td class='labels bk-okdark rightoutline' style='width:150px;'>Record Type</td><td class='info bk-blank style='width:400px;'>Record Data</td><td class='info bk-blank' style='width:100px;'>TTL</td><td class='info bk-blank' style='width:75px;'>Actions</td></tr>";
	var rownum = 0;
        for (x in this.rows) {
            html += this.rows[x].HTML(rownum);
	    rownum++;
        }
	html += "<tr class='addnew'><td class='labels bk-okdark rightoutline'>"+
	this.__makeExpertTypeDrop__(rownum) +
	"</td><td class='info bk-blank'><input type='text' size='40' name='rdata"+rownum+"' id='rdata"+rownum+"'/></td>"+
	"<td class='info bk-blank'><input type='text' name='rttl"+rownum+"' id='rttl"+rownum+"'/></td>"+
	"<td class='info bk-blank'><input type='button' value='Add' onclick='expertTableAddNewRow("+rownum+",this);'/></td></tr>"+
        "</table><div class='button_box'><input type='submit' value='Save'/>&nbsp;&nbsp;<input type='button' value='Cancel'/></div></form>";
        return html;
    };

    this.__makeExpertTypeDrop__ = function(rownum) {
	var types = new Hash('A','A','AAAA','AAAA','MX','MX','TXT','TXT','SRV','SRV','CNAME','CNAME','NS','NS','SOA','SOA');
	var editdrop = '<select class="expert_type" name="rtype'+rownum+'" id="rtype'+rownum+'" onchange="changeExpertType(this.value)">';

	for (var item in types.items) {
	    editdrop += "<option value='" + item + "'>"+types.items[item]+"</option>";
	}
    
        editdrop += '</select>';
        return editdrop;
    };

}

function expertTableRow(field, info, ttl, hidden){
    this.field = field;
    this.info = info;
    this.ttl = ttl;
    this.hidden = hidden;
    this.HTML = function(rownum){
        var html = "<tr class='crecord"+rownum+"'>";
        html += "<td class='crtype"+rownum+" labels bk-okdark rightoutline'>"+field+"<input type='hidden' name='rtype"+rownum+"' value='"+field+"'/></td>";
	html += "<td class='crdata"+rownum+" info bk-blank'>"+info+"<input type='hidden' name='rdata"+rownum+"' value='"+info+"'/></td>";
	html += "<td class='crttl"+rownum+" info bk-blank'>"+ttl+"<input type='hidden' name='rttl"+rownum+"' value='"+ttl+"'/></td>";
	html += "<td class='craction"+rownum+" info bk-blank'><input type='button' value='Edit' onclick='expertTableEditRow(\""+rownum+"\");' />&nbsp;&nbsp;<input type='button' value='Delete' onclick='expertTableDeleteRow(\""+rownum+"\");' /></td>";
        html += "</tr>";
        return html;
    };
}

function expertTableAddNewRow(rownum, table) {
    expert_table.addRow($("#rtype"+rownum).val(),$("#rdata"+rownum).val(),$("#rttl"+rownum).val());
    $("#sect_expert").html(expert_table.HTML());
}

function expertTableDeleteRow(rownum, table) {
    expert_table.deleteRow(rownum);
    //$("#"+rownum).remove();
    $("#sect_expert").html(expert_table.HTML());
}

function changeExpertType() {
}


subdomain.prototype.clone = function() {
  var newObj = (this instanceof Array) ? [] : {};
  for (i in this) {
    if (i == 'clone') continue;
    if (this[i] && typeof this[i] == "object") {
      newObj[i] = this[i].clone();
    } else newObj[i] = this[i]
  } return newObj;
};

emailobj.prototype.clone = function() {
  var newObj = (this instanceof Array) ? [] : {};
  for (i in this) {
    if (i == 'clone') continue;
    if (this[i] && typeof this[i] == "object") {
      newObj[i] = this[i].clone();
    } else newObj[i] = this[i]
  } return newObj;
};

