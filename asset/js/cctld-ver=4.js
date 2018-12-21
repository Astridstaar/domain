var showlogiclist = [];

function logicActivateDivs(id, child) 
{
   	if (showlogiclist[id] != undefined)
	{
			if (showlogiclist[id][child] != undefined)
                        {
			        if (!(null !== showlogiclist[id][child] && 'object' == typeof(showlogiclist[id][child])))
				{
					if (showlogiclist[id][child].indexOf('|')==-1)
					{
 						//alert("activating "+showlogiclist[id][child]+"12345");
	       	                        	document.getElementById(showlogiclist[id][child]+"1").style.display = "block";
        	                       		document.getElementById(showlogiclist[id][child]+"2").style.display = "block";
               		                	document.getElementById(showlogiclist[id][child]+"3").style.display = "block";
                                		document.getElementById(showlogiclist[id][child]+"4").style.display = "block";
                                		document.getElementById(showlogiclist[id][child]+"5").style.display = "block";
					} else {
						var subchildids=showlogiclist[id][child].split("|");
		                                var part_num=0;
               	        		        while (part_num < subchildids.length)
                	                	{
	                                                //alert("activating group "+showlogiclist[id][child]+" 12345 " + subchildids[part_num]);
                                        		document.getElementById(subchildids[part_num]+"1").style.display = "block";
                                        		document.getElementById(subchildids[part_num]+"2").style.display = "block";
                                        		document.getElementById(subchildids[part_num]+"3").style.display = "block";
                                        		document.getElementById(subchildids[part_num]+"4").style.display = "block";
                                        		document.getElementById(subchildids[part_num]+"5").style.display = "block";
                                        		part_num+=1;
						}
					}
				}
			} else {
                                for (toDeactivate in showlogiclist[id])
                                {
					if (!(null !== showlogiclist[id][toDeactivate] && 'object' == typeof(showlogiclist[id][toDeactivate])))
					{
						if (showlogiclist[id][toDeactivate].indexOf('|')==-1)
                                        	{
	                                                //alert("deactivating "+showlogiclist[id][toDeactivate]+"12345");
                                        		document.getElementById(showlogiclist[id][toDeactivate]+"1").style.display = "none";
                                        		document.getElementById(showlogiclist[id][toDeactivate]+"2").style.display = "none";
                                        		document.getElementById(showlogiclist[id][toDeactivate]+"3").style.display = "none";
                                        		document.getElementById(showlogiclist[id][toDeactivate]+"4").style.display = "none";
                                        		document.getElementById(showlogiclist[id][toDeactivate]+"5").style.display = "none";
						} else {
							var subchildids2=showlogiclist[id][toDeactivate].split("|");
	                                                var part_num2=0;
       	                                        	while (part_num2 < subchildids2.length)
                                                	{
	                                                        //alert("deactivating group "+showlogiclist[id][toDeactivate]+" 12345 " + subchildids2[part_num2]);
                                                        	document.getElementById(subchildids2[part_num2]+"1").style.display = "none";
                                                        	document.getElementById(subchildids2[part_num2]+"2").style.display = "none";
                                                        	document.getElementById(subchildids2[part_num2]+"3").style.display = "none";
                                                        	document.getElementById(subchildids2[part_num2]+"4").style.display = "none";
                                                        	document.getElementById(subchildids2[part_num2]+"5").style.display = "none";
                                                        	part_num2+=1;
							}
						}
					}
				}
                        }
	}

/*
	if (showlogiclist[id][child] != undefined)
        {
   		for (subchild3 in showlogiclist[id][child])
   		{
   			if (subchild3 != undefined)
   			{	
				var subchildids3=subchild3.split("|");
				var part_num3=0;
				while (part_num3 < subchildids3.length)
 				{
					document.getElementById(subchildids3[part_num3]+"1").style.display = "block";
	                                document.getElementById(subchildids3[part_num3]+"2").style.display = "block";
	                                document.getElementById(subchildids3[part_num3]+"3").style.display = "block";
        	                        document.getElementById(subchildids3[part_num3]+"4").style.display = "block";
                	                document.getElementById(subchildids3[part_num3]+"5").style.display = "block";
  					part_num3+=1;
  				}
			}
		}
	} else {
		for (toDeactivate in showlogiclist[id])
                {
			for (subchild4 in showlogiclist[id][toDeactivate])
			{
				var subchildids4=subchild4.split("|");
                                var part_num4=0;
                                while (part_num4 < subchildids4.length)
                                {
                                        document.getElementById(subchildids4[part_num4]+"1").style.display = "none";
                                        document.getElementById(subchildids4[part_num4]+"2").style.display = "none";
                                        document.getElementById(subchildids4[part_num4]+"3").style.display = "none";
                                        document.getElementById(subchildids4[part_num4]+"4").style.display = "none";
                                        document.getElementById(subchildids4[part_num4]+"5").style.display = "none";
                                        part_num4+=1;
                                }
			}
		}
	}
*/
}


function sortByOrderID(a, b) {
   var x = a[orderID].value();
   var y = b[orderID].value();
   return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}


function showForm (domain, addtype) {
    $.getJSON("/bin/ajax/tldinfo" , { get:"requirementForm", domain: domain }, function(data){
    var div = $("<div class='tldform'>");
    div.append("<p><span class='h1'>" + _("search_js_cctld_additional_info") + "</span></p><br/>");
    div.append("<p>" + _("search_js_cctld_additional_info_para") + "</p><br/>");
    div.append("<div class='red bold'>" + _("search_js_cctld_additional_required") + "</div><br/><br/>");
    var form;
    if (addtype == "buynow"){
        form = $("<form onsubmit='buyInternationalNow(\""+ domain +"\", this); return false;'></form>");
    } else {
        form = $("<form onsubmit='addInternationalToCart(\""+ domain +"\", this); return false;'></form>");
    }


    // max number of fields to sort for is 20!
    // set sort order for form building based on perl module orderID value
    var sortedForm = new Object();
    for (var i=0; i<= 20; i++)
    {
    	for (req in data.requirementForm)
    	{
		if (req != 'logic')
		{
			if (data.requirementForm[req].orderID == i)
       	 		{
	   			sortedForm[req] = data.requirementForm[req];
        		} else if (!data.requirementForm[req].orderID)
			{
				sortedForm[req] = data.requirementForm[req];
			}
		}
    	}
    }

    data.requirementForm = sortedForm;

    for (req in data.requirementForm){
      if (req != 'logic' && req != 'autoregflag')    
      {
                if (data.requirementForm[req].logic)
                {
                        for (elementActivatingDiv in data.requirementForm[req].logic)
                        {
                                form.append("<input type='hidden' name='"+data.requirementForm[req].logic[elementActivatingDiv]+"|activation' value='"+elementActivatingDiv+"|"+req+"'/> <input type='hidden' name='"+data.requirementForm[req].logic[elementActivatingDiv]+"|notreq' value='true'/>" );
                        }
                }


	if (data.requirementForm[req].type == "hidden") {
		form.append("<input type='hidden' name='"+req+"' value='"+data.requirementForm[req].value+"'/>" );
        } else if (data.requirementForm[req].type == "none") {
        
	} else {
		var showelementblock = true;
		if (data.requirementForm[req].visible == "false")
		{
			showelementblock = false;
		}
		
		var showelementblockcss = "";
		var showreqbox = "reqbox";	
		if (!showelementblock)
		{
			showelementblockcss = "display:none;";
			showreqbox = "notreqbox";
		} else {
                        showelementblockcss = "";
		}

		if (data.requirementForm[req].logic) 
		{
			var elementLevelDiv = [];
			for (elementActivatingDiv in data.requirementForm[req].logic)
			{
				elementLevelDiv[elementActivatingDiv] = data.requirementForm[req].logic[elementActivatingDiv]; 
			}
			
			showlogiclist[req] = elementLevelDiv;
		}

		form.append("<div class='h2' style='float:left;"+showelementblockcss+"' id='"+req+"1'>" + data.requirementForm[req].name + ":</div>");
        	form.append("<div style='float:left;"+showelementblockcss+"' id='"+req+"2'> " + data.requirementForm[req].text + "</div>");
                form.append("<div style='display:none;' id='"+req+"5'></div>");
       		form.append("<br style='clear:both;"+showelementblockcss+"' id='"+req+"3' style='"+showelementblockcss+"' />");
        	var reqbox = $("<div class='bk-oklight outline ui-corner-all-wide "+showreqbox+" type_"+data.requirementForm[req].type+"' style='"+showelementblockcss+"' id='"+req+"4'>");
        	
		if (data.requirementForm[req].type == "dropdown"){
            		var select = $("<select name='"+req+"' onChange=\"logicActivateDivs('"+req+"', this[this.selectedIndex].value);\" >");

            		if (data.requirementForm[req].info != null){
                		$(select).change( function( objEvent ){
                		    $(objEvent.target).siblings(".extrainfo").html(data.requirementForm[$(objEvent.target).attr("name")].info[$(this).val()]).css("color","black").show();
                		});
            		}
            
           		var keys = [];
           		var inverse = [];

            		// get hash values so we can sort by values, not keys
            		for (possible in data.requirementForm[req].possible) {
                		inverse.push(data.requirementForm[req].possible[possible]);
	    		}

            		// sort by values
            		inverse.sort();

            		// find keys for each value
       		 	for (var i = 0; i < inverse.length; i++){
       		        	var inv = inverse[i];
                		for (possible in data.requirementForm[req].possible) {
                    			if (inv == data.requirementForm[req].possible[possible]) {
                       	 			keys.push(possible);
                	        		break;
    	                		}
       		         	}
        	    	}
	
            		for (var i = 0; i < keys.length; i++){
                		var possible = keys[i];
                		select.append("<option value='"+possible+"'>" +  data.requirementForm[req].possible[possible]  +  "</option>");
                		//extrainfo[req] = data.requirementForm[req].info[possible];
            		}
           
			reqbox.append(select);
            		reqbox.append("<div class='extrainfo bk-blank outline ui-corner-all' style='"+showelementblockcss+"' id='"+req+"2'></div>");

        	} else if (data.requirementForm[req].type == "frbirthplace"){

            		var country = $("<select name='"+req+"_country'  onchange='updateBirthplace(\""+req+"\")'>");
           	 	for (i in countries){
               			$(country).append("<option value='"+countries[i].code+"'>"+countries[i].name+"</option>");
            		}
            	
			reqbox.append(country);

            		reqbox.append("<div id='locality' class='hidden'><label for='"+req+"_postalcode'>Postal Code:</label> <input type='text' name='"+req+"_postalcode' onKeyUp='updateBirthplace(\""+req+"\")'  /><br/><label for='"+req+"_locality'>Locality Name:</label> <input type='text' name='"+req+"_locality' onKeyUp='updateBirthplace(\""+req+"\")'  /></div>");
            		reqbox.append("<input type='hidden' name='"+req+"' id='"+req+"' value='AF'/>" );

        	} else if (data.requirementForm[req].type == "caaddress"){

            		reqbox.append("<label for='admin.address.line1'>Line 1:</label> <input type='text' name='admin.address.line1'/>" );
            		reqbox.append("<br style='clear:both;'/>");
            		reqbox.append("<label for='admin.address.line2'>Line 2:</label> <input type='text' name='admin.address.line2'/>" );
            		reqbox.append("<br style='clear:both;'/>");
            		reqbox.append("<label for='admin.address.city'>City:</label> <input type='text' name='admin.address.city'/>" );
            		reqbox.append("<br style='clear:both;'/>");
            		reqbox.append("<label for='admin.address.stateprovince'>Province/Territory:</label> <input type='text' name='admin.address.stateprovince'/>" );
            		reqbox.append("<br style='clear:both;'/>");
            		reqbox.append("<label for='admin.address.postalcode'>Postal Code:</label> <input type='text' name='admin.address.postalcode'/>" );
            		reqbox.append("<br style='clear:both;'/>");
            		reqbox.children(".type_"+data.requirementForm[req].type+" label").css("float","left").css("padding","3px 4px").css("text-align","right").css("width","150px");


        	} else if (data.requirementForm[req].type == "fraddress"){

            		reqbox.append("<label for='admin.address.line1'>Line 1:</label> <input type='text' name='admin.address.line1'/>" );
            		reqbox.append("<br style='clear:both;'/>");
            		reqbox.append("<label for='admin.address.line2'>Line 2:</label> <input type='text' name='admin.address.line2'/>" );
            		reqbox.append("<br style='clear:both;'/>");
            		reqbox.append("<label for='admin.address.city'>City:</label> <input type='text' name='admin.address.city'/>" );
            		reqbox.append("<br style='clear:both;'/>");
            		reqbox.append("<label for='admin.address.stateprovince'>Province/Territory:</label> <input type='text' name='admin.address.stateprovince'/>" );
            		reqbox.append("<br style='clear:both;'/>");
            		reqbox.append("<label for='admin.address.postalcode'>Postal Code:</label> <input type='text' name='admin.address.postalcode'/>" );
            		reqbox.append("<br style='clear:both;'/>");
            		reqbox.children(".type_"+data.requirementForm[req].type+" label").css("float","left").css("padding","3px 4px").css("text-align","right").css("width","150px");

        	} else if (data.requirementForm[req].type == "datepicker"){



            		var day = $("<select name='"+req+"_day' onchange='updateDate(\""+req+"\")'  >");
            		$(day).append("<option value='DD'>DD</option>");
            		for (i=1; i <= 31; i++){
            		    if (i <= 9) { i = "0" + i; }
            		    $(day).append("<option value='"+i+"'>"+i+"</option>");
            		}
            		
			//reqbox.append("<label for='"+req+"_day'>Day:</label>");
            		reqbox.append(day);
            		reqbox.append("/");
            		//reqbox.append("<br/>");

            		var month = $("<select name='"+req+"_month'  onchange='updateDate(\""+req+"\")'>");
            		$(month).append("<option value='MM'>MM</option>");
            		for (i=1; i <= 12; i++){
               			if (i <= 9) { i = "0" + i; }
            		    	$(month).append("<option value='"+i+"'>"+i+"</option>");
            		}

		        //reqbox.append("<label for='"+req+"_month' >Month:</label>");
		        reqbox.append(month);
	            	reqbox.append("/");

       		 	    var year = $("<select name='"+req+"_year' onchange='updateDate(\""+req+"\")'>");
       			     var d = new Date();
       			     var curr_year = d.getFullYear();
      			      var minyear = curr_year - data.requirementForm[req].minage;
     			       $(year).append("<option value='YYYY'>YYYY</option>");
     			       for (i= minyear; i >= (curr_year - 100) ; i--){
  		     	         $(year).append("<option value='"+i+"'>"+i+"</option>");
   		    	     }
      		 	     //reqbox.append("<label for='"+req+"_year'>Year:</label>");
		       	     reqbox.append(year);

    		 	       reqbox.append("<input type='hidden' name='"+req+"' id='"+req+"' value='DD/MM/YYY'/>" );
       			     //if(data.requirementForm[req].validate){
       	 		    //    eval(data.requirementForm[req].validate);
   		         //    var inp = $("<input type='text' name='"+req+"' value='' style='margin-left:10px;'/>" );
    		        //    $(inp).KeyUp(validate);
    			        //    reqbox.append(inp);
     			       //} else {
       			     //    reqbox.append("<input type='text' name='"+req+"' value='' style='margin-left:10px;'/>" );
   			         //}

        	} else if (data.requirementForm[req].type == "textbox"){
        	    if(data.requirementForm[req].validate){
        	        eval(data.requirementForm[req].validate);
               		var inp = $("<input type='text' name='"+req+"' value='' style='margin-left:10px;'/>" );
                	$(inp).KeyUp(validate);
                	reqbox.append(inp);
            	     } else {
                	reqbox.append("<input type='text' name='"+req+"' value='' style='margin-left:10px;'/>" );
            	     }
        	} else if (data.requirementForm[req].type == "checkbox"){
            	     for (possible in data.requirementForm[req].possible){
                	reqbox.append("<input type='checkbox' name='"+req+"' value='"+possible+"'/><span> " + data.requirementForm[req].possible[possible] +"</span>" );
            	     }
        	} else if (data.requirementForm[req].type == "radiobox"){
            	     for (possible in data.requirementForm[req].possible){
                	reqbox.append("<div class='bk-okdark outline ui-corner-all-wide checkbox'><input type ='radio' value='"+possible+"' name='"+req+"'><div>" +  data.requirementForm[req].possible[possible] + "</div></div>");
            	     }
            	     reqbox.append(" <br style='clear:both'/> ");
                }
        
		form.append(reqbox);
    	}

     }
    }

    if (addtype == "buynow"){
        form.append("<input type='submit' value='Buy Now'>&nbsp;&nbsp;&nbsp;&nbsp;<input type='button' class='simplemodal-close' value='Cancel' onclick='$.modal.close()'/>");
    } else {
        form.append("<input type='submit' value='Add to cart'>&nbsp;&nbsp;&nbsp;&nbsp;<input type='button' class='simplemodal-close' value='Cancel' onclick='$.modal.close()'/>");
    }
    div.append(form);
    //div.modal(); //{autoPosition:false, autoResize:false, containerCss:{ top:150px, position:absolute } });
    $.modal(div,{autoResize:[false], autoPosition:[false] });
    $('.tldform').closest("#simplemodal-container").css("top","50px").css("position","absolute");
    $(window).unbind('resize.simplemodal'); // hack to disable simplemodal resizing
    if ($(window).width() >= 940){
        $('.tldform').closest("#simplemodal-container").css("left", (($(window).width() - 760)/2)).css("top","50px");
    } else {
        $('.tldform').closest("#simplemodal-container").css("left", "90px").css("top","50px");
    }

    $("#simplemodal-container").css("top","50px");
    //$("#simplemodal-container").css("position","absolute");
    });
}

function updateDate(req){
    $('input[name='+req+']').val(  $('select[name='+req+'_day]').val() + "/" +  $('select[name='+req+'_month]').val() + "/" + $('select[name='+req+'_year]').val() );
}

function updateBirthplace(req){
    if ($('select[name='+req+'_country]').val() == "FR"){
        $("#locality").show();
        $("#locality").removeClass("hidden");
        $('input[name='+req+']').val(  $('input[name='+req+'_postalcode]').val() + ", " +  $('input[name='+req+'_locality]').val() );
    } else {
        $("#locality").hide();
        $('input[name='+req+']').val(  $('select[name='+req+'_country]').val() );
    }
}



var countries = [{code: "AF", name: "Afghanistan"},{code: "AX", name: "Aland Islands"},{code: "AL", name: "Albania"},{code: "DZ", name: "Algeria"},{code: "AS", name: "American Samoa"},{code: "AD", name: "Andorra"},{code: "AO", name: "Angola"},{code: "AI", name: "Anguilla"},{code: "AQ", name: "Antarctica"},{code: "AG", name: "Antigua and Barbuda"},{code: "AR", name: "Argentina"},{code: "AM", name: "Armenia"},{code: "AW", name: "Aruba"},{code: "AU", name: "Australia"},{code: "AT", name: "Austria"},{code: "AZ", name: "Azerbaijan"},{code: "BS", name: "Bahamas"},{code: "BH", name: "Bahrain"},{code: "BD", name: "Bangladesh"},{code: "BB", name: "Barbados"},{code: "BY", name: "Belarus"},{code: "BE", name: "Belgium"},{code: "BZ", name: "Belize"},{code: "BJ", name: "Benin"},{code: "BM", name: "Bermuda"},{code: "BT", name: "Bhutan"},{code: "BO", name: "Bolivia, Plurinational State of"},{code: "BA", name: "Bosnia and Herzegovina"},{code: "BW", name: "Botswana"},{code: "BV", name: "Bouvet Island"},{code: "BR", name: "Brazil"},{code: "IO", name: "British Indian Ocean Territory"},{code: "BN", name: "Brunei Darussalam"},{code: "BG", name: "Bulgaria"},{code: "BF", name: "Burkina Faso"},{code: "BI", name: "Burundi"},{code: "KH", name: "Cambodia"},{code: "CM", name: "Cameroon"},{code: "CA", name: "Canada"},{code: "CV", name: "Cape Verde"},{code: "KY", name: "Cayman Islands"},{code: "CF", name: "Central African Republic"},{code: "TD", name: "Chad"},{code: "CL", name: "Chile"},{code: "CN", name: "China"},{code: "CX", name: "Christmas Island"},{code: "CC", name: "Cocos (Keeling) Islands"},{code: "CO", name: "Colombia"},{code: "KM", name: "Comoros"},{code: "CG", name: "Congo"},{code: "CD", name: "Congo, The Democratic Republic of the"},{code: "CK", name: "Cook Islands"},{code: "CR", name: "Costa Rica"},{code: "CI", name: "Cote d'Ivoire"},{code: "HR", name: "Croatia"},{code: "CU", name: "Cuba"},{code: "CY", name: "Cyprus"},{code: "CZ", name: "Czech Republic"},{code: "DK", name: "Denmark"},{code: "DJ", name: "Djibouti"},{code: "DM", name: "Dominica"},{code: "DO", name: "Dominican Republic"},{code: "EC", name: "Ecuador"},{code: "EG", name: "Egypt"},{code: "SV", name: "El Salvador"},{code: "GQ", name: "Equatorial Guinea"},{code: "ER", name: "Eritrea"},{code: "EE", name: "Estonia"},{code: "ET", name: "Ethiopia"},{code: "FK", name: "Falkland Islands (Malvinas)"},{code: "FO", name: "Faroe Islands"},{code: "FJ", name: "Fiji"},{code: "FI", name: "Finland"},{code: "FR", name: "France"},{code: "GF", name: "French Guiana"},{code: "PF", name: "French Polynesia"},{code: "TF", name: "French Southern Territories"},{code: "GA", name: "Gabon"},{code: "GM", name: "Gambia"},{code: "GE", name: "Georgia"},{code: "DE", name: "Germany"},{code: "GH", name: "Ghana"},{code: "GI", name: "Gibraltar"},{code: "GR", name: "Greece"},{code: "GL", name: "Greenland"},{code: "GD", name: "Grenada"},{code: "GP", name: "Guadeloupe"},{code: "GU", name: "Guam"},{code: "GT", name: "Guatemala"},{code: "GG", name: "Guernsey"},{code: "GN", name: "Guinea"},{code: "GW", name: "Guinea-Bissau"},{code: "GY", name: "Guyana"},{code: "HT", name: "Haiti"},{code: "HM", name: "Heard Island and McDonald Islands"},{code: "VA", name: "Holy See (Vatican City State)"},{code: "HN", name: "Honduras"},{code: "HK", name: "Hong Kong"},{code: "HU", name: "Hungary"},{code: "IS", name: "Iceland"},{code: "IN", name: "India"},{code: "ID", name: "Indonesia"},{code: "IR", name: "Iran, Islamic Republic of"},{code: "IQ", name: "Iraq"},{code: "IE", name: "Ireland"},{code: "IM", name: "Isle of Man"},{code: "IL", name: "Israel"},{code: "IT", name: "Italy"},{code: "JM", name: "Jamaica"},{code: "JP", name: "Japan"},{code: "JE", name: "Jersey"},{code: "JO", name: "Jordan"},{code: "KZ", name: "Kazakhstan"},{code: "KE", name: "Kenya"},{code: "KI", name: "Kiribati"},{code: "KP", name: "Korea, Democratic People's Republic of"},{code: "KR", name: "Korea, Republic of"},{code: "KW", name: "Kuwait"},{code: "KG", name: "Kyrgyzstan"},{code: "LA", name: "Lao People's Democratic Republic"},{code: "LV", name: "Latvia"},{code: "LB", name: "Lebanon"},{code: "LS", name: "Lesotho"},{code: "LR", name: "Liberia"},{code: "LY", name: "Libyan Arab Jamahiriya"},{code: "LI", name: "Liechtenstein"},{code: "LT", name: "Lithuania"},{code: "LU", name: "Luxembourg"},{code: "MO", name: "Macao"},{code: "MK", name: "Macedonia, The Former Yugoslav Republic of"},{code: "MG", name: "Madagascar"},{code: "MW", name: "Malawi"},{code: "MY", name: "Malaysia"},{code: "MV", name: "Maldives"},{code: "ML", name: "Mali"},{code: "MT", name: "Malta"},{code: "MH", name: "Marshall Islands"},{code: "MQ", name: "Martinique"},{code: "MR", name: "Mauritania"},{code: "MU", name: "Mauritius"},{code: "YT", name: "Mayotte"},{code: "MX", name: "Mexico"},{code: "FM", name: "Micronesia, Federated States of"},{code: "MD", name: "Moldova, Republic of"},{code: "MC", name: "Monaco"},{code: "MN", name: "Mongolia"},{code: "ME", name: "Montenegro"},{code: "MS", name: "Montserrat"},{code: "MA", name: "Morocco"},{code: "MZ", name: "Mozambique"},{code: "MM", name: "Myanmar"},{code: "NA", name: "Namibia"},{code: "NR", name: "Nauru"},{code: "NP", name: "Nepal"},{code: "NL", name: "Netherlands"},{code: "AN", name: "Netherlands Antilles"},{code: "NC", name: "New Caledonia"},{code: "NZ", name: "New Zealand"},{code: "NI", name: "Nicaragua"},{code: "NE", name: "Niger"},{code: "NG", name: "Nigeria"},{code: "NU", name: "Niue"},{code: "NF", name: "Norfolk Island"},{code: "MP", name: "Northern Mariana Islands"},{code: "NO", name: "Norway"},{code: "OM", name: "Oman"},{code: "PK", name: "Pakistan"},{code: "PW", name: "Palau"},{code: "PS", name: "Palestinian Territory, Occupied"},{code: "PA", name: "Panama"},{code: "PG", name: "Papua New Guinea"},{code: "PY", name: "Paraguay"},{code: "PE", name: "Peru"},{code: "PH", name: "Philippines"},{code: "PN", name: "Pitcairn"},{code: "PL", name: "Poland"},{code: "PT", name: "Portugal"},{code: "PR", name: "Puerto Rico"},{code: "QA", name: "Qatar"},{code: "RE", name: "Reunion"},{code: "RO", name: "Romania"},{code: "RU", name: "Russian Federation"},{code: "RW", name: "Rwanda"},{code: "BL", name: "Saint Barthelemy"},{code: "SH", name: "Saint Helena, Ascension and Tristan Da Cunha"},{code: "KN", name: "Tts and Nevis"},{code: "LC", name: "Saint Lucia"},{code: "MF", name: "Saint Martin"},{code: "PM", name: "Saint Pierre and Miquelon"},{code: "VC", name: "Saint Vincent and the Grenadines"},{code: "WS", name: "Samoa"},{code: "SM", name: "San Marino"},{code: "ST", name: "Sao Tome and Principe"},{code: "SA", name: "Saudi Arabia"},{code: "SN", name: "Senegal"},{code: "RS", name: "Serbia"},{code: "SC", name: "Seychelles"},{code: "SL", name: "Sierra Leone"},{code: "SG", name: "Singapore"},{code: "SK", name: "Slovakia"},{code: "SI", name: "Slovenia"},{code: "SB", name: "Solomon Islands"},{code: "SO", name: "Somalia"},{code: "ZA", name: "South Africa"},{code: "GS", name: "South Georgia and the South Sandwich Islands"},{code: "ES", name: "Spain"},{code: "LK", name: "Sri Lanka"},{code: "SD", name: "Sudan"},{code: "SR", name: "Suriname"},{code: "SJ", name: "Svalbard and Jan Mayen"},{code: "SZ", name: "Swaziland"},{code: "SE", name: "Sweden"},{code: "CH", name: "Switzerland"},{code: "SY", name: "Syrian Arab Republic"},{code: "TW", name: "Taiwan, Province of China"},{code: "TJ", name: "Tajikistan"},{code: "TZ", name: "Tanzania, United Republic of"},{code: "TH", name: "Thailand"},{code: "TL", name: "Timor-Leste"},{code: "TG", name: "Togo"},{code: "TK", name: "Tokelau"},{code: "TO", name: "Tonga"},{code: "TT", name: "Trinidad and Tobago"},{code: "TN", name: "Tunisia"},{code: "TR", name: "Turkey"},{code: "TM", name: "Turkmenistan"},{code: "TC", name: "Turks and Caicos Islands"},{code: "TV", name: "Tuvalu"},{code: "UG", name: "Uganda"},{code: "UA", name: "Ukraine"},{code: "AE", name: "United Arab Emirates"},{code: "GB", name: "United Kingdom"},{code: "US", name: "United States"},{code: "UM", name: "United States Minor Outlying Islands"},{code: "UY", name: "Uruguay"},{code: "UZ", name: "Uzbekistan"},{code: "VU", name: "Vanuatu"},{code: "VE", name: "Venezuela, Bolivarian Republic of"},{code: "VN", name: "Viet Nam"},{code: "VG", name: "Virgin Islands, British"},{code: "VI", name: "Virgin Islands, U.S."},{code: "WF", name: "Wallis and Futuna"},{code: "EH", name: "Western Sahara"},{code: "YE", name: "Yemen"},{code: "ZM", name: "Zambia"},{code: "ZW", name: "Zimbabwe"},];
