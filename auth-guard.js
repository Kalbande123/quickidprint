// auth-guard.js - Advanced Session Guard (Back Button Protection)

function checkSecurity() {
    // युजर खरोखर लॉगइन आहे का ते sessionStorage मधून तपासणे
    const loggedUser = sessionStorage.getItem('username') || sessionStorage.getItem('userFullName') || sessionStorage.getItem('mobile');
    
    // जर युजर लॉगइन नसेल
    if (!loggedUser) {
        // href ऐवजी 'replace' वापरले आहे, जेणेकरून युजर Back करून पुन्हा आत येऊ शकणार नाही
        window.location.replace("index.htm"); 
    }
}

// १. जेव्हा पेज नेहमीप्रमाणे लोड होते
window.addEventListener('DOMContentLoaded', checkSecurity);

// २. जेव्हा युजर 'Back' किंवा 'Forward' बटण दाबून जुन्या पेजवर येतो (Browser Cache)
window.addEventListener('pageshow', function(event) {
    checkSecurity();
});
