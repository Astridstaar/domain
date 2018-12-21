function makelogin(){
    $("#login").html("\
        <form action='/bin/ajax/login' >\
            <table cellpadding='0'>\
              <tr>\
                <td><input id='username' class='text' type='text' name='username'/></td>\
                <td> </td>\
              </tr>\
              <tr>\
                <td><input id='password' class='text' type='password' name='password'/></td>\
                <td><input type='image' name='submit' value='Login' style='margin-right:0px;padding:5px 0 5px 5px; position:relative; top:-16px;' src='/images/btn_login.png'></td>\
              </tr>\
            </table>\
        </form>");

    $("#username").makeidletext("username");
    $("#password").makeidletext("password");
}

