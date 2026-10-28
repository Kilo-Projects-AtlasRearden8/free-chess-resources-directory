(function () {
  "use strict";

  const searchInput = document.getElementById("search");
  const grid = document.getElementById("grid");
  const empty = document.getElementById("empty");
  const countEl = document.getElementById("count");
  const filterBtns = document.querySelectorAll(".filter-btn");

  let resources = [];
  let activeFilter = "all";

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function render(resourcesToShow) {
    grid.innerHTML = "";
    let shown = 0;

    resourcesToShow.forEach(function (res) {
      const card = document.createElement("article");
      card.className = "card";
      card.setAttribute("role", "listitem");

      const metaHtml =
        '<span class="chip">' + escapeHtml(res.cost) + "</span>" +
        '<span class="chip">' + escapeHtml(res.platform) + "</span>";

      card.innerHTML =
        '<h3>' + escapeHtml(res.name) + "</h3>" +
        '<div class="card-meta">' + metaHtml + "</div>" +
        '<p class="category"><strong>Category:</strong> ' + escapeHtml(res.category) + "</p>" +
        '<p class="steps"><strong>Steps:</strong> ' + escapeHtml(res.steps).replace(/\n/g, "<br>") + "</p>" +
        '<a href="' + escapeHtml(res.link) + '" target="_blank" rel="noopener noreferrer">Official link &rarr;</a>';

      grid.appendChild(card);
      shown++;
    });

    countEl.textContent = shown + " resource" + (shown !== 1 ? "s" : "") + " shown";
    empty.classList.toggle("hidden", shown > 0);
  }

  function filterAndRender() {
    const term = searchInput.value.toLowerCase().trim();

    const filtered = resources.filter(function (res) {
      const matchesFilter =
        activeFilter === "all" || res.category === activeFilter;

      const matchesSearch =
        term === "" ||
        res.name.toLowerCase().includes(term) ||
        res.category.toLowerCase().includes(term) ||
        res.platform.toLowerCase().includes(term) ||
        res.cost.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });

    render(filtered);
  }

  function loadResources() {
    return fetch("resources.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to load resources.json");
        }
        return response.json();
      })
      .then(function (data) {
        resources = data;
        filterAndRender();
      })
      .catch(function (error) {
        grid.innerHTML = '<p class="error">Unable to load resources: ' + escapeHtml(error.message) + "</p>";
        console.error(error);
      });
  }

  searchInput.addEventListener("input", filterAndRender);

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      activeFilter = btn.getAttribute("data-filter");
      filterAndRender();
    });
  });

  if ("loading" in HTMLImageElement.prototype) {
    loadResources();
  } else {
    document.addEventListener("DOMContentLoaded", loadResources);
  }
})();
