// apple.js
document.addEventListener("DOMContentLoaded", () => {
  injectStyles();
  initializeLucideIcons();
  initializeRepoCards();
});

// Error card background
const errbg = "linear-gradient(135deg, #0c0a0a, #6c090a, #ff352f)";

function initializeLucideIcons() {
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  } else {
    console.error("Lucide Icons are not loaded. Please check the CDN link.");
  }
}

function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
      .repo-list {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(auto-fit, minmax(300px, auto));
      }
      
      .repo-list::-webkit-scrollbar {
          display: none;
      }
    
      .repo-card {
        min-width: auto;
        height: 100%;
        border-radius: 1rem;
        overflow: hidden;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: filter 0.3s, opacity 0.3s;
        filter: brightness(1);
        opacity: 1;
        color: white;
        text-decoration: none;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .repo-card:hover {
          filter: brightness(0.8);
          opacity: 0.9;
      }

      .repo-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
      }

      .repo-name {
          font-size: 1.9rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
      }

      .repo-lang {
          font-size: 1.125rem;
          font-weight: lighter;
          color: rgba(255, 255, 255, 0.9);
          margin: 0; /* Remove all margins */
      }

      .repo-description {
          font-size: 0.8125rem;
          color: rgba(255, 255, 255, 0.9);
          flex-grow: 1;
          margin: 0; /* Remove all margins */
      }

      .error-card {
          background: linear-gradient(135deg, #0c0a0a, #6c090a, #ff352f);
      }

      .repo-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .loader {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          margin: auto;
      }

      @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
      }
  `;
  document.head.appendChild(style);
}

// Initialize repository cards
function initializeRepoCards() {
  const repoList = document.querySelector(".repo-list");
  if (!repoList) {
    console.error(".repo-list element not found.");
    return;
  }

  // Background gradients array
  const cardbg = [
    "linear-gradient(135deg, #6d17d9, #9b7cf6, #bb6cf6)",
    "linear-gradient(135deg, #7cbc9a, #3e7659, #003017)",
    "linear-gradient(135deg, #fa3419, #f3e1b6, #7cbc9a)",
    "linear-gradient(135deg, #9ED5C5, #BCEAD5, #DEF5E5)",
    "linear-gradient(135deg, #5050cf, #3aafaf, #4fffcf)",
    "linear-gradient(135deg, #7cbc9a, #23998e, #1d5e69)",
    "linear-gradient(135deg, #333333, #888888, #CCCCCC)",
  ];

  fetchTop24Repos()
    .then((repos) => {
      repos.forEach((repoInfo, index) => {
        let card = null;
        if (repoInfo) {
          card = createRepoCard(
            {
              url: repoInfo.html_url,
              user: repoInfo.owner.login,
              repo: repoInfo.name,
              lang: repoInfo.language || "N/A",
              updated_at: repoInfo.updated_at,
              stars: repoInfo.stargazers_count,
              forks: repoInfo.forks_count,
              archived: repoInfo.archived,
              description: repoInfo.description || "No description available.",
            },
            index,
            cardbg
          );
        } else {
          card = createErrorCard(index, cardbg);
        }
        repoList.appendChild(card);
      });
    })
    .catch((error) => {
      console.warn("error: ", error);
    });
}

async function fetchTop24Repos() {
  const apiUrl = `https://api.github.com/users/gabryelboeira/repos?sort=pushed&direction=desc&per_page=24`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return [];
  }
}

function createRepoCard(repo, index, cardbg) {
  const div = document.createElement("div");

  const repoCard = document.createElement("a");
  repoCard.href = repo.url;
  repoCard.target = "_blank";
  repoCard.rel = "noopener noreferrer";
  repoCard.classList.add("repo-card");
  repoCard.style.background = cardbg[index % cardbg.length];

  const repoHeader = document.createElement("div");
  repoHeader.classList.add("repo-header");

  if (typeof lucide !== "undefined") {
    const repoIcon = document.createElement("i");
    repoIcon.setAttribute("data-lucide", "github");
    repoIcon.classList.add("social-icon");
    repoHeader.appendChild(repoIcon);
  } else {
    console.warn("Lucide Icons not available. Skipping icon.");
  }

  const repoUser = document.createElement("span");
  repoUser.textContent = repo.user;
  repoHeader.appendChild(repoUser);

  const repoDetails = document.createElement("div");
  const repoName = document.createElement("h3");
  repoName.classList.add("repo-name");
  repoName.textContent = repo.repo;
  repoDetails.appendChild(repoName);

  const repoLang = document.createElement("p");
  repoLang.classList.add("repo-lang");
  repoLang.textContent = repo.lang;
  repoDetails.appendChild(repoLang);

  const repoDesc = document.createElement("p");
  repoDesc.classList.add("repo-description");
  repoDesc.textContent = repo.description;
  repoDetails.appendChild(repoDesc);

  const repoFooter = document.createElement("div");
  repoFooter.classList.add("repo-footer");

  const item1 = document.createElement("div");
  item1.innerHTML =
    '<i class="fa fa-star"></i><span> ' + repo.stars + "</span>";

  const item2 = document.createElement("div");
  if (repo.archived === true) {
    item2.innerHTML =
      '<i class="fa fa-check-square"></i> <span>Concluido</span>';
  } else {
    item2.innerHTML =
      '<i class="	fa fa-exclamation"></i> <span>Em Andamento</span>';
  }

  const item3 = document.createElement("span");
  let date = new Date(repo.updated_at);
  let newdate =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  item3.textContent = "Atualização: " + newdate;

  repoFooter.appendChild(item1);
  repoFooter.appendChild(item2);
  repoFooter.appendChild(item3);

  repoCard.appendChild(repoHeader);
  repoCard.appendChild(repoDetails);
  repoCard.appendChild(repoFooter);

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
  div.appendChild(repoCard);
  return div;
}

// Create an error card when repository data cannot be fetched
function createErrorCard(index, cardbg, container) {
  const errorCard = document.createElement("div");
  errorCard.classList.add("repo-card", "error-card");
  errorCard.style.background = errbg;

  const errorHeader = document.createElement("div");
  errorHeader.classList.add("repo-header");

  if (typeof lucide !== "undefined") {
    const errorIcon = document.createElement("i");
    errorIcon.setAttribute("data-lucide", "alert-triangle");
    errorIcon.classList.add("social-icon");
    errorHeader.appendChild(errorIcon);
  } else {
    console.warn("Lucide Icons not available. Skipping error icon.");
  }

  const errorTitle = document.createElement("span");
  errorTitle.textContent = "Error";
  errorHeader.appendChild(errorTitle);

  const errorDetails = document.createElement("div");

  const errorMsg = document.createElement("p");
  errorMsg.classList.add("repo-description");
  errorMsg.textContent = "Failed to retrieve repository information.";
  errorDetails.appendChild(errorMsg);

  errorCard.appendChild(errorHeader);
  errorCard.appendChild(errorDetails);

  return errorCard;
}
