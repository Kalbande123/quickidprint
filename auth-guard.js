// ==============================================================================
// 🚀 UNIVERSAL COMPATIBLE AUTH-GUARD (Zero Breaking Change - Works Instantly)
// ==============================================================================

(function () {
  // १. जुनी सिस्टिम किंवा नवीन सिस्टिम - दोन्हीतून युजर शोधणे
  var currentUser = localStorage.getItem("sevaspot_user") || 
                    localStorage.getItem("username") || 
                    localStorage.getItem("loggedInUser") ||
                    sessionStorage.getItem("sevaspot_user") ||
                    sessionStorage.getItem("username") ||
                    sessionStorage.getItem("loggedInUser");

  var userExpiryStr = localStorage.getItem("sevaspot_expiry") || 
                      localStorage.getItem("expireDate") || 
                      sessionStorage.getItem("sevaspot_expiry") ||
                      sessionStorage.getItem("expireDate");

  var userStatus = localStorage.getItem("sevaspot_status") || 
                    localStorage.getItem("status") || 
                    sessionStorage.getItem("sevaspot_status") || "Active";

  // जर युजर लॉगिनच नसेल, तरच लॉगिन पेजवर पाठवा
  if (!currentUser) {
    // सध्याचे पेज आधीच लॉगिन पेज असेल तर रिडायरेक्ट करू नका
    var currentPath = window.location.pathname.toLowerCase();
    if (!currentPath.endsWith("login.html") && !currentPath.endsWith("index.html") && currentPath !== "/") {
      window.location.href = "login.html";
    }
    return;
  }

  // २. ॲडमिन बायपास (Lifetime Access)
  var cleanUser = String(currentUser).trim().toLowerCase();
  var isAdmin = (cleanUser === "admin" || cleanUser === "admin123" || userExpiryStr === "Lifetime");

  if (isAdmin) {
    updateNavbar(currentUser, "Lifetime");
    return;
  }

  // ३. ब्लॉक केलेला युजर असेल तर अडवा
  if (userStatus === "Blocked" || userStatus === "Inactive") {
    alert("तुमचे अकाउंट ब्लॉक (Inactive) करण्यात आले आहे. कृपया ॲडमिनशी संपर्क साधा.");
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "login.html";
    return;
  }

  // ४. उर्वरित दिवस तपासणे (जर एक्सपायरी तारीख उपलब्ध असेल तर)
  if (userExpiryStr && userExpiryStr !== "-") {
    var daysRemaining = calculateLiveDaysLeft(userExpiryStr);

    if (daysRemaining <= 0) {
      alert("तुमच्या प्लॅनची मुदत संपली आहे. कृपया सेवा सुरू ठेवण्यासाठी रिचार्ज करा.");
      window.location.href = "recharge.html";
      return;
    }
    updateNavbar(currentUser, daysRemaining + " दिवस बाकी");
  } else {
    // जर जुनी सिस्टिम असेल तर नॉर्मल नाव दाखवा
    updateNavbar(currentUser, "Active");
  }

  // --- Helper Functions ---
  function calculateLiveDaysLeft(dateStr) {
    if (!dateStr || dateStr === "-") return 9999;
    var clean = String(dateStr).replace(/'/g, "").trim();
    var p = clean.split("/");
    if (p.length !== 3) return 9999;
    
    var expDate = new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0]));
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var diffTime = expDate.getTime() - today.getTime();
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  function updateNavbar(name, daysText) {
    function applyDOM() {
      var nameEl = document.getElementById("navUserName") || 
                   document.getElementById("userNameDisplay") || 
                   document.getElementById("userDisplay") ||
                   document.getElementById("profileName");
                   
      var daysEl = document.getElementById("navRemainingDays") || 
                   document.getElementById("daysLeftDisplay") || 
                   document.getElementById("remainingDaysBadge") ||
                   document.getElementById("planDays");

      if (nameEl) nameEl.innerText = name;
      if (daysEl) daysEl.innerText = daysText;
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", applyDOM);
    } else {
      applyDOM();
    }
  }
})();
