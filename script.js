const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const statusBox = document.getElementById("status");
const resultsContainer = document.getElementById("results");
const resultCount = document.getElementById("result-count");
const resultsHeading = document.getElementById("results-heading");

const API_URL = "https://commons.wikimedia.org/w/api.php";

function showStatus(message, type = "idle") {
  statusBox.className = `status ${type}`;
  statusBox.replaceChildren();

  const symbol = document.createElement("span");
  symbol.className = "status-symbol";
  symbol.setAttribute("aria-hidden", "true");

  if (type === "loading") {
    const spinner = document.createElement("span");
    spinner.className = "spinner";
    statusBox.appendChild(spinner);
  } else {
    symbol.textContent = type === "error" ? "!" : type === "empty" ? "⌕" : "✧";
    statusBox.appendChild(symbol);
  }

  const text = document.createElement("span");
  text.textContent = message;
  statusBox.appendChild(text);
}

function clearResults() {
  resultsContainer.replaceChildren();
  resultCount.textContent = "";
}

function makeImageCard(item, index) {
  const card = document.createElement("article");
  card.className = "image-card";
  card.style.animationDelay = `${Math.min(index * 45, 300)}ms`;

  const link = document.createElement("a");
  link.href = item.pageUrl || item.imageUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `Open image source: ${item.title}`);

  const img = document.createElement("img");
  img.src = item.thumbnail;
  img.alt = item.title;
  img.loading = "lazy";
  img.referrerPolicy = "no-referrer";
  img.addEventListener("error", () => {
    card.remove();
    const remaining = resultsContainer.children.length;
    resultCount.textContent = remaining ? `Showing ${remaining} images` : "";
    if (remaining === 0) {
      showStatus("These images could not be loaded. Please try another search.", "error");
    }
  }, { once: true });

  const caption = document.createElement("div");
  caption.className = "image-caption";

  const title = document.createElement("p");
  title.className = "image-title";
  title.textContent = item.title;

  const source = document.createElement("p");
  source.className = "image-source";
  source.textContent = "View on Wikimedia Commons ↗";

  caption.append(title, source);
  link.append(img, caption);
  card.appendChild(link);
  return card;
}

async function searchImages(query) {
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    showStatus("Please type a topic to search for.", "empty");
    return;
  }

  clearResults();
  resultsHeading.textContent = `Results for “${cleanQuery}”`;
  searchButton.disabled = true;
  input.disabled = true;
  showStatus("Searching for images…", "loading");

  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: cleanQuery,
    gsrnamespace: "6",
    gsrlimit: "24",
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: "640",
    format: "json",
    origin: "*"
  });

  try {
    const response = await fetch(`${API_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const pages = Object.values(data.query?.pages || {});

    const items = pages
      .map((page) => {
        const info = page.imageinfo && page.imageinfo[0];
        if (!info) return null;

        const imageUrl = info.thumburl || info.url;
        if (!imageUrl) return null;

        return {
          title: (page.title || "Untitled image").replace(/^File:/, "").replace(/_/g, " "),
          thumbnail: imageUrl,
          imageUrl: info.url || imageUrl,
          pageUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title || "").replace(/%3A/g, ":")}`
        };
      })
      .filter(Boolean);

    if (items.length === 0) {
      showStatus(`No results for “${cleanQuery}”. Try another search.`, "empty");
      return;
    }

    const fragment = document.createDocumentFragment();
    items.forEach((item, index) => fragment.appendChild(makeImageCard(item, index)));
    resultsContainer.appendChild(fragment);
    statusBox.replaceChildren();
    statusBox.className = "status";
    resultCount.textContent = `Showing ${items.length} images`;
  } catch (error) {
    console.error("Image search failed:", error);
    showStatus("Something went wrong. Check your internet connection and try again.", "error");
  } finally {
    searchButton.disabled = false;
    input.disabled = false;
    input.focus();
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  searchImages(input.value);
});

document.querySelectorAll(".suggestion").forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.dataset.query;
    searchImages(input.value);
  });
});
