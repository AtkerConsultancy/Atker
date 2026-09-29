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

document.addEventListener("DOMContentLoaded", function () {
  initNavToggle();
});
