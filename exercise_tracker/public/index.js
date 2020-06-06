$(document).ready(function() {
  fetch("https://kyawthiha-exercise-tracker.glitch.me/api/exercise/users")
    .then(response => response.json())
    .then(data => {
      $("#users").jsonViewer(data, { collapsed: true });
    });
});
