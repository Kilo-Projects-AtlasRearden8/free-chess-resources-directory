(function () {
  "use strict";

  const searchInput = document.getElementById("search");
  const grid = document.getElementById("grid");
  const empty = document.getElementById("empty");
  const countEl = document.getElementById("count");
  const filterBtns = document.querySelectorAll(".filter-btn");

  let resources = [];
  let activeFilter = "all";

  // Embedded mirror of resources.json so the page works standalone
  // (e.g. opened directly as a file) without needing a server or CORS.
  const EMBEDDED_RESOURCES = [
    {
      "id": "lichess",
      "name": "Lichess",
      "category": "Play",
      "cost": "Free",
      "platform": "Web, iOS, Android",
      "steps": "1. Go to https://lichess.org\n2. Play instantly without an account, or sign up for free to save games\n3. Choose a time control (bullet, blitz, rapid, classical) and start a game\n4. Use the Learn menu for puzzles, tactics trainer, and studies",
      "link": "https://lichess.org"
    },
    {
      "id": "chess-com-free",
      "name": "Chess.com (free tier)",
      "category": "Play",
      "cost": "Free tier",
      "platform": "Web, iOS, Android",
      "steps": "1. Go to https://www.chess.com\n2. Create a free account\n3. Play daily games and puzzles within the free daily limits\n4. Explore the free Learn lessons and puzzle rush",
      "link": "https://www.chess.com"
    },
    {
      "id": "lichess-puzzles",
      "name": "Lichess Puzzles",
      "category": "Puzzles",
      "cost": "Free",
      "platform": "Web, iOS, Android",
      "steps": "1. Go to https://lichess.org/puzzle\n2. Solve the tactic shown on the board\n3. Adjust difficulty with the rating filter or try Puzzle Storm for timed practice",
      "link": "https://lichess.org/puzzle"
    },
    {
      "id": "chess-com-puzzles",
      "name": "Chess.com Puzzles",
      "category": "Puzzles",
      "cost": "Free tier",
      "platform": "Web, iOS, Android",
      "steps": "1. Go to https://www.chess.com/puzzles\n2. Solve the daily puzzle and tactic themes\n3. Use free daily puzzle allowance; premium puzzles are optional",
      "link": "https://www.chess.com/puzzles"
    },
    {
      "id": "lichess-tactics",
      "name": "Lichess Tactics Trainer",
      "category": "Tactics trainer",
      "cost": "Free",
      "platform": "Web, iOS, Android",
      "steps": "1. Go to https://lichess.org/training\n2. Select Tactics Trainer\n3. Solve positions adapted to your rating; track progress over time",
      "link": "https://lichess.org/training"
    },
    {
      "id": "lichess-explorer",
      "name": "Lichess Opening Explorer",
      "category": "Opening database",
      "cost": "Free",
      "platform": "Web",
      "steps": "1. Go to https://lichess.org/explorer\n2. Browse openings by move or ECO code\n3. See statistics from millions of Lichess games for each line",
      "link": "https://lichess.org/explorer"
    },
    {
      "id": "365chess-openings",
      "name": "365Chess.com Opening Database",
      "category": "Opening database",
      "cost": "Free",
      "platform": "Web",
      "steps": "1. Go to https://www.365chess.com/opening.php\n2. Search openings by name or ECO code\n3. Browse annotated games and transpose into lines",
      "link": "https://www.365chess.com/opening.php"
    },
    {
      "id": "lichess-studies",
      "name": "Lichess Studies (endgame studies)",
      "category": "Endgame studies",
      "cost": "Free",
      "platform": "Web, iOS, Android",
      "steps": "1. Go to https://lichess.org/study\n2. Browse community-created studies, including endgame studies\n3. Play through positions move by move to learn endgame technique",
      "link": "https://lichess.org/study"
    },
    {
      "id": "lichess-endgame",
      "name": "Lichess Endgame Training",
      "category": "Endgame studies",
      "cost": "Free",
      "platform": "Web",
      "steps": "1. Go to https://lichess.org/practice/endgame\n2. Practice essential endgames (king and pawn, rook endgames, etc.)\n3. Play against the computer from each starting position",
      "link": "https://lichess.org/practice/endgame"
    }
  ];

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
    // Prefer the standalone embedded copy so the page works without a server.
    // If resources.json is served (e.g. over HTTP), use it as the source of truth.
    resources = EMBEDDED_RESOURCES.slice();
    filterAndRender();

    fetch("resources.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Server copy unavailable");
        }
        return response.json();
      })
      .then(function (data) {
        resources = data;
        filterAndRender();
      })
      .catch(function () {
        // Keep using the embedded copy; no server required.
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadResources);
  } else {
    loadResources();
  }
})();
