// Atker - Google Analytics (GA4) with a cookie choice.
// Nothing is sent to Google until the visitor clicks Accept.
var ATKER_GA_ID = "G-MSZBH4CB1G";
var ATKER_CONSENT_KEY = "atker_cookie_choice";

function atkerGetChoice() {
  try { return window.localStorage.getItem(ATKER_CONSENT_KEY); } catch (e) { return null; }
}
function atkerSetChoice(value) {
  try {
    if (value) { window.localStorage.setItem(ATKER_CONSENT_KEY, value); }
    else { window.localStorage.removeItem(ATKER_CONSENT_KEY); }
  } catch (e) {}
}

function atkerLoadAnalytics() {
  if (window.atkerGaLoaded) { return; }
  window.atkerGaLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", ATKER_GA_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + ATKER_GA_ID;
  document.head.appendChild(s);
}

function atkerRemoveGaCookies() {
  var parts = document.cookie.split(";");
  for (var i = 0; i < parts.length; i++) {
    var name = parts[i].split("=")[0].replace(/^\s+/, "");
    if (name === "_ga" || name.indexOf("_ga_") === 0 || name === "_gid") {
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=." + location.hostname.replace(/^www\./, "");
    }
  }
}

function atkerHideBanner() {
  var b = document.getElementById("cookie-banner");
  if (b && b.parentNode) { b.parentNode.removeChild(b); }
}

function atkerShowBanner() {
  if (document.getElementById("cookie-banner")) { return; }
  var b = document.createElement("div");
  b.id = "cookie-banner";
  b.className = "cookie-banner";
  b.setAttribute("role", "dialog");
  b.setAttribute("aria-label", "Cookie choice");
  b.innerHTML =
    '<p>We use Google Analytics cookies to see which pages and links people use, so we can improve this site. ' +
    'Nothing is tracked unless you accept. <a href="privacy.html">Privacy and cookies</a></p>' +
    '<div class="cookie-actions">' +
    '<button type="button" class="btn" id="cookie-accept">Accept</button>' +
    '<button type="button" class="btn secondary" id="cookie-decline">Decline</button>' +
    '</div>';
  document.body.appendChild(b);
  document.getElementById("cookie-accept").addEventListener("click", function () {
    atkerSetChoice("accepted");
    atkerHideBanner();
    atkerLoadAnalytics();
  });
  document.getElementById("cookie-decline").addEventListener("click", function () {
    atkerSetChoice("declined");
    atkerRemoveGaCookies();
    atkerHideBanner();
  });
}

// Records which buy button was clicked (Kindle, hardback, download and so on).
function atkerTrackLinkClicks() {
  document.addEventListener("click", function (event) {
    var el = event.target;
    while (el && el !== document && !(el.getAttribute && el.getAttribute("data-link"))) { el = el.parentNode; }
    if (!el || el === document || !window.gtag || !window.atkerGaLoaded) { return; }
    window.gtag("event", "buy_click", {
      link_name: el.getAttribute("data-link"),
      link_url: el.getAttribute("href") || "",
      page_path: location.pathname
    });
  });
}

function atkerInitCookieLink() {
  var links = document.querySelectorAll("[data-cookie-settings]");
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function (event) {
      event.preventDefault();
      atkerSetChoice(null);
      atkerShowBanner();
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var choice = atkerGetChoice();
  if (choice === "accepted") { atkerLoadAnalytics(); }
  else if (choice !== "declined") { atkerShowBanner(); }
  atkerTrackLinkClicks();
  atkerInitCookieLink();
});
