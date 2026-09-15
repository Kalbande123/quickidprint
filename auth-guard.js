// ==============================================================================
// 🚀 SEVASPOT CENTER - HIGH-SPEED & SECURE AUTH-GUARD (100% COMPLETE)
// ==============================================================================

(function () {
  var currentUser = localStorage.getItem("sevaspot_user");
  var userExpiryStr = localStorage.getItem("sevaspot_expiry");
  var userStatus = localStorage.getItem("sevaspot_status") || "Active";
  var storedDays = localStorage.getItem("sevaspot_days");

  // १. युजर लॉगिन नसेल तर थेट लॉगिन पेजवर पाठवा
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  // २. ॲडमिन बायपास (Lifetime Access / 9999 Days)
  var cleanUser = currentUser.trim().toLowerCase();
  var isAdmin = (cleanUser === "admin" || cleanUser === "admin123" || userExpiryStr === "Lifetime");

  if (isAdmin) {
    updateNavbar(localStorage.getItem("sevaspot_name") || currentUser, "Lifetime");
    return;
  }

  // ३. ब्लॉक केलेला युजर असेल तर अडवा
  if (userStatus === "Blocked" || userStatus === "Inactive") {
    alert("तुमचे अकाउंट ब्लॉक (Inactive) करण्यात आले आहे. कृपया ॲडमिनशी संपर्क साधा.");
    localStorage.clear();
    window.location.href = "login.html";
    return;
  }

  // ४. आजच्या तारखेशी Live Expiry तारीख तपासा
  var daysRemaining = calculateLiveDaysLeft(userExpiryStr);

  if (daysRemaining <= 0) {
    alert("तुमच्या प्लॅनची मुदत संपली आहे. कृपया सेवा सुरू ठेवण्यासाठी रिचार्ज करा.");
    window.location.href = "recharge.html";
    return;
  }

  // लोकल स्टोरेज अपडेट करा
  localStorage.setItem("sevaspot_days", String(daysRemaining));

  // ५. उर्वरित दिवस स्क्रीनवर दाखवा
  var displayName = localStorage.getItem("sevaspot_name") || currentUser;
  updateNavbar(displayName, daysRemaining + " दिवस बाकी");

  // --- Helper Functions ---
  function calculateLiveDaysLeft(dateStr) {
    if (!dateStr || dateStr === "-") return 0;
    var clean = String(dateStr).replace(/'/g, "").trim();
    var p = clean.split("/");
    if (p.length !== 3) return 0;
    
    // Day, Month (0-indexed), Year
    var expDate = new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0]));
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var diffTime = expDate.getTime() - today.getTime();
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  function updateNavbar(name, daysText) {
    function applyDOM() {
      // पोर्टलवरील विविध संभाव्य आयडी सपोर्ट
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
