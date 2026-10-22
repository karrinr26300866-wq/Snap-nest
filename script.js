const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const searchStatus = document.querySelector("#searchStatus");
const clearButton = document.querySelector("#clearButton");
const emptyState = document.querySelector("#emptyState");
const results = document.querySelector("#results");
const chips = document.querySelectorAll(".chip");

function showSearchMessage(query) {
  if (!query) {
    searchStatus.textContent = "Enter a topic to get started.";
    return;
  }

  searchStatus.textContent =
    `Your search for "${query}" is ready for the next part of the project.`;
}

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const query = searchInput.value.trim();

  if (!query) {
    searchStatus.textContent = "Please enter a topic to search.";
    searchInput.focus();
    return;
  }

  showSearchMessage(query);
});

chips.forEach(function (chip) {
  chip.addEventListener("click", function () {
    searchInput.value = chip.dataset.query;
    showSearchMessage(chip.dataset.query);
    searchInput.focus();
  });
});

clearButton.addEventListener("click", function () {
  searchInput.value = "";
  searchStatus.textContent = "Your discoveries will appear here.";
  results.replaceChildren();
  emptyState.hidden = false;
  searchInput.focus();
});
