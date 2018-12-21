
var SPEED = 400;

$(document).ready(function() {
    $(".regSignUpLink").click(function() {
        $("<div></div>").attr("id", "backdrop").appendTo("body").fadeIn(SPEED);
        var $w = $("<div></div>").attr("id", "windowbox-wrapper").appendTo("body").fadeIn(SPEED);
        var $c = $("<div></div>").attr("id", "windowbox-outer").appendTo($w);
        var $a = $("<a></a>").addClass("close-btn").appendTo($c).html("close").attr("href", "#");
        var $i = $("<iframe></iframe>").attr("id", "windowbox-content").attr("scrollbars","no").attr("seamless","seamless").attr("resizable","no").appendTo($c);
		var url = this.href.replace(/\/$/, "") + "&view=iframe";
        $i.attr("src", url);
        $a.click(function() {
            $("#windowbox-wrapper").add("#backdrop").fadeOut(SPEED, function() { $(this).remove(); });
        });

        return false;
    });
	if (top.location!= self.location) {
          top.location = self.location.href;}
});