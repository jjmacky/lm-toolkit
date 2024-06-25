document.addEventListener("DOMContentLoaded", function () {
  var links = document.querySelectorAll("a[href^='http']");
  links.forEach(function (link) {
    if (link.hostname !== window.location.hostname) {
      link.setAttribute("target", "_blank");
    }
  });
});
