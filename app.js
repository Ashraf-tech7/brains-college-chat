function loadPage(page) {
  fetch(page)
    .then(res => res.text())
    .then(html => {
      document.getElementById("content").innerHTML = html;
    })
    .catch(err => {
      document.getElementById("content").innerHTML = "<p>Page not found.</p>";
    });
}
