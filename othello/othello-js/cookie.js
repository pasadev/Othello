


// keyboardOrMouse = keyboard || mouse
// voiceSynthesis = true || false


    var cookies = 
    document
    .cookie
    .split(";")
    .map(cookie => cookie.split('='))
    .reduce((accumulator, [key, value]) => 
    ({...accumulator, [key.trim()]: decodeURIComponent}));

//document.cookie = "keyboardOrMouse=keyboard;"
//document.cookie = "voiceSynthesis=true;"
    

    function deleteAllCookies(){
        var allCookies = document.cookie.split(';'); 
                
        // The "expire" attribute of every cookie is  
        // Set to "Thu, 01 Jan 1970 00:00:00 GMT" 
        for (var i = 0; i < allCookies.length; i++) 
            document.cookie = allCookies[i] + "=;expires=" 
            + new Date(0).toUTCString(); 
    }
    //deleteAllCookies();

    function getCookieValue(value) {
        var b = document.cookie.match('(^|;)\\s*' + value + '\\s*=\\s*([^;]+)');
        //console.log(b);
        return b ? b.pop() : '';
    }


function checkCookie() {
    
    // Get cookie using our custom function
    let keyboardOrMouse = cookies.keyboardOrMouse;
    let voiceSynthesis = cookies.voiceSynthesis;
    let ;
    getCookieValue("keyboard")

    if(keyboardOrMouse === "keyboard"){
        choosePlayMethod("", "keyboard")
        // first parameter is event when clicking on the button
        // second is for the cookie
    }
    else if (keyboardOrMouse === "mouse") {
        choosePlayMethod("", "mouse")
    };
    
    if (voiceSynthesis === "true") {
        useSpeech = true;
    }
    else if (voiceSynthesis === "false") {
        useSpeech = false;
    };


}

function setCookie(cookieName, cookieValue, nDays) {
    var today = new Date();
    var expire = new Date();

    if (!nDays) 
        nDays=1;

    expire.setTime(today.getTime() + 3600000*24*nDays);
    document.cookie = cookieName+"="+encodeURIComponent(cookieValue) + ";expires="+expire.toGMTString();
}