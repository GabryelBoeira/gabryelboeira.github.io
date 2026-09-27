document.addEventListener("DOMContentLoaded", function () {
  var repoList = document.querySelector(".repo-list");
  if (!repoList) return;

  var LANG_COLORS = {
    Java: "#b07219",
    Kotlin: "#A97BFF",
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    Dockerfile: "#384d54",
    Shell: "#89e051",
    HTML: "#e34c26",
    CSS: "#563d7c",
    "C#": "#178600",
    Go: "#00ADD8",
  };

  var SVG_STAR =
    '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';

  var SVG_FORK =
    '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 01-9 9"/></svg>';

  fetchRepos()
    .then(function (repos) {
      if (!repos.length) {
        repoList.innerHTML =
          '<p style="color:var(--text-3);text-align:center">Não foi possível carregar os repositórios.</p>';
        return;
      }

      repos.forEach(function (repo) {
        repoList.appendChild(createCard(repo));
      });
    })
    .catch(function () {
      repoList.innerHTML =
        '<p style="color:var(--text-3);text-align:center">Erro ao carregar repositórios do GitHub.</p>';
    });

  function fetchRepos() {
    return fetch(
      "https://api.github.com/users/gabryelboeira/repos?sort=pushed&direction=desc&per_page=24"
    ).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    });
  }

  function createCard(repo) {
    var lang = repo.language || "N/A";
    var langColor = LANG_COLORS[lang] || "#888";
    var desc = repo.description || "";
    if (desc.length > 120) desc = desc.substring(0, 120) + "…";

    var now = Date.now();
    var updated = new Date(repo.updated_at).getTime();
    var daysAgo = Math.floor((now - updated) / 86400000);
    var timeLabel = formatTimeAgo(daysAgo);
    var isRecent = daysAgo <= 30;

    var card = document.createElement("a");
    card.href = repo.html_url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.className = "repo-card";

    var accent = document.createElement("div");
    accent.className = "repo-card-accent";
    accent.style.background = langColor;

    var body = document.createElement("div");
    body.className = "repo-card-body";

    var top = document.createElement("div");
    top.className = "repo-top";

    var name = document.createElement("p");
    name.className = "repo-name";
    name.textContent = repo.name;
    top.appendChild(name);

    if (isRecent) {
      var badge = document.createElement("span");
      badge.className = "repo-fresh";
      badge.textContent = "Recente";
      top.appendChild(badge);
    }

    var descEl = document.createElement("p");
    descEl.className = "repo-desc";
    descEl.textContent = desc || "Sem descrição disponível.";

    var footer = document.createElement("div");
    footer.className = "repo-footer";

    var langEl = document.createElement("span");
    langEl.className = "repo-lang";
    langEl.innerHTML =
      '<span class="lang-dot" style="background:' +
      langColor +
      '"></span> ' +
      lang;

    var starEl = document.createElement("span");
    starEl.className = "repo-metric";
    starEl.innerHTML = SVG_STAR + " " + repo.stargazers_count;

    var forkEl = document.createElement("span");
    forkEl.className = "repo-metric";
    forkEl.innerHTML = SVG_FORK + " " + repo.forks_count;

    var timeEl = document.createElement("span");
    timeEl.style.marginLeft = "auto";
    timeEl.textContent = timeLabel;

    footer.appendChild(langEl);
    footer.appendChild(starEl);
    footer.appendChild(forkEl);
    footer.appendChild(timeEl);

    body.appendChild(top);
    body.appendChild(descEl);
    body.appendChild(footer);

    card.appendChild(accent);
    card.appendChild(body);

    return card;
  }

  function formatTimeAgo(days) {
    if (days === 0) return "hoje";
    if (days === 1) return "ontem";
    if (days < 7) return "há " + days + " dias";
    if (days < 30) {
      var weeks = Math.floor(days / 7);
      return "há " + weeks + (weeks === 1 ? " semana" : " semanas");
    }
    if (days < 365) {
      var months = Math.floor(days / 30);
      return "há " + months + (months === 1 ? " mês" : " meses");
    }
    var years = Math.floor(days / 365);
    return "há " + years + (years === 1 ? " ano" : " anos");
  }
});
