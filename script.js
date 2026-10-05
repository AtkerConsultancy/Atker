// Atker Consultancy Services - shared behaviour
// Plain var/function syntax throughout for mobile browser compatibility.

function initNavToggle() {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (!toggle || !nav) { return; }
  toggle.addEventListener("click", function () {
    nav.classList.toggle("open");
  });
}

// Builds a mailto: link from a form's fields and opens it, so enquiries
// reach the inbox with no backend or third-party form service required.
function initMailtoForm(formId, recipient, subjectPrefix) {
  var form = document.getElementById(formId);
  if (!form) { return; }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var fields = form.querySelectorAll("[data-field]");
    var lines = [];
    var serviceLabel = "";

    for (var i = 0; i < fields.length; i++) {
      var field = fields[i];
      var label = field.getAttribute("data-label") || field.name;
      var value = field.value;
      if (!value) { continue; }
      if (field.tagName === "SELECT") {
        var selected = field.options[field.selectedIndex];
        value = selected ? selected.text : value;
      }
      if (field.getAttribute("data-subject") === "true") {
        serviceLabel = value;
      }
      lines.push(label + ": " + value);
    }

    var subject = subjectPrefix + (serviceLabel ? " - " + serviceLabel : "");
    var body = lines.join("\n");

    var mailto = "mailto:" + recipient +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    var status = form.querySelector(".form-status");
    if (status) {
      status.textContent = "Opening your email client to send this to " + recipient + " ...";
      status.classList.add("show");
    }

    window.location.href = mailto;
  });
}

// Buttons marked data-link="name" take their address from ATKER_LINKS (links.js).
// If no address has been added yet, the button shows as "coming soon" and does nothing.
function initLinks() {
  if (typeof ATKER_LINKS === "undefined") { return; }
  var items = document.querySelectorAll("[data-link]");
  for (var i = 0; i < items.length; i++) {
    var el = items[i];
    var url = ATKER_LINKS[el.getAttribute("data-link")];
    if (url) {
      el.setAttribute("href", url);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", el.getAttribute("data-affiliate") ? "noopener sponsored" : "noopener");
    } else {
      el.removeAttribute("href");
      el.classList.add("pending");
      el.setAttribute("aria-disabled", "true");
      var label = el.getAttribute("data-pending-label");
      if (label) {
        el.textContent = label;
      } else if (el.textContent.indexOf("coming soon") === -1) {
        el.textContent = el.textContent + " (coming soon)";
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initNavToggle();
  initLinks();
});
