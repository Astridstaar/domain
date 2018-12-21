$(document).ready(function() {
	// login box
	$('#loginLink').click(function() {
        // Allow everyone but IE6 to display the faded-in login box
        if ($.browser.version != '6.0') {
            $(".loginBOX").fadeIn(250);
            $("#username", ".loginBOX").focus();
            return false;
        }
    });
	
	$('.logclose-btn').click(function() {
        $(".loginBOX").fadeOut(250);
        return false;
    });
	
	// run drop down menus
	$('.dropDown').click(function(){
		$(this).parent().children('.ddMenu').toggle();
		return false;
	});
	
	// close drop downs
	$(document).click(function(ev){
		if (!$(ev.target).hasClass("dropDown")) {
			$('.ddMenu').hide();
			$('#topBar a').removeClass('selected');
		}
	});
	
	// tld lightbox
	$(".tlds li a").click(function(ev){
		$.get($(this).attr('href'), function(data) 
		{ 
			var startPosition = $(".tlds").offset();
			
			$("#tld-pop").html(data);
			$("#tld-pop .call").css({top: startPosition.top});
			
			$("#tld-pop").show();
			
		});
		return false;
	});
	

	
	
	$("body").click(function(ev) {
		if ($(ev.target).closest("#tld-pop .bluebox").length == 0) $("#tld-pop").empty().hide();  
		$(".showInfo").hide();
	});
	
    // hide show help
    $('.callInfo').click(function() {
        var i = parseInt(this.id.replace("call", ""));
        $(".showInfo").hide();
        $("#show" + i).show();
        return false;
    });
    $(".hideInfo").click(function() {
    	$(".showInfo").hide();
    	return false;
    });

    $(function(){
        $('input').keydown(function(e){
            if (e.keyCode == 13) {
                $(this).parents('form').submit();
                return false;
            }
        });
    });
		
});

function prefillTld(tld)
{
   $("#tld-pop").hide().empty(); 
   $("#searchArea").val('.'+tld);
   var searchArea = document.getElementById("searchArea");
   if (searchArea.setSelectionRange) {
	   searchArea.setSelectionRange(0,0);
   } else if (searchArea.createTextRange) {
      var range = searchArea.createTextRange();
      range.collapse(true);
      range.moveEnd('character', 0);
      if (range.moveat)     range.moveat('character', 0);
      range.select();
   };
   $(window).scrollTop(0);
   $("#searchArea").focus();
   return false;	
}