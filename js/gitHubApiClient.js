var divRepositoriosDeck = $("#repoCardDeck");
var str = "";

function createRepoCard(repoUpdated_at, repoName, repoDesc, repoUrl, repoForks, repoStars, repoWatchers, repoLanguage, repoHomepage) {
    str +=

        "<div class='col-sm-4 d-flex p-2 bd-highlight'>"
        + "  <div class='card text-center'>"

        + "      <div class='card-header'>"
        + repoName
        + "      </div>"

        + "      <div class='card-body'>"
        + "          <p style='font-size: 12px'>"
        + repoDesc
        + "          </p>"
        + "          <small class='text-muted' style='center'>"
        + "              Linguagem: "
        + repoLanguage
        + "          </small>"
        + "      </div>"

        + "      <div class='card-footer text-muted'>"
        + "          <small class='text-muted' style='center'>"
        + "              <span class='fa fa-1x fa-star mb-3 sr-icons' style='margin:5px;'>"
        + "                  <span style='margin:3px;'>"
        + repoStars
        + "                  </span>"
        + "              </span>"
        + "              <span class='fa fa-1x fa-eye mb-3 sr-icons' style='margin:5px;'>"
        + "                  <span style='margin:3px;'>"
        + repoWatchers
        + "                  </span>"
        + "              </span>"
        + "              <span class='fa fa-1x fa-code-fork mb-3 sr-icons' style='margin:5px;'>"
        + "                  <span style='margin:3px;'>"
        + repoForks
        + "                  </span>"
        + "              </span>"
        + "          </small>"

        + "          <div>"
        + "              <p style='font-size: 12px'>"
        + "                  Atualização: "
        + repoUpdated_at
        + "              </p>"
        + "          </div>"

        + "          <div>"
        + "              <a href='" + repoUrl + "'>Acessar Repositório</a>"
        + "          </div>"
        + "      </div>"

        + "  </div>"
        + "</div>";
}


$(document).ready(function () {
    $.get("https://api.github.com/users/marcelocezario/repos", function (data) {

        console.log(data);

        //Criando os cartoes dos repositorios
        var i = 1;
        str += "<div class='row'>";

        data.sort(function (a, b) {
            return (a.updated_at < b.updated_at) ? 1 : ((b.updated_at < a.updated_at) ? -1 : 0);
        });

        data.forEach(repo => {


            var update = new Date(repo.updated_at)
            var options = { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric" };
            repo.updated_at = update.toLocaleTimeString("pt-BR", options)

            if (i < 10) {
                if (i % 3 == 0) {
                    createRepoCard(repo.updated_at, repo.name, repo.description, repo.html_url, repo.forks_count, repo.stargazers_count, repo.watchers_count, repo.language, repo.homepage);
                    str += "</div>";
                    str += "</p>";
                    str += "<div class='row'>";
                }
                else {
                    createRepoCard(repo.updated_at, repo.name, repo.description, repo.html_url, repo.forks_count, repo.stargazers_count, repo.watchers_count, repo.language, repo.homepage);
                }
            }
            i++
        });
        str += "</div>";
        divRepositoriosDeck.append(str);
    });
});


//<relative-time datetime="2018-07-25T00:10:00Z" title="24 de jul de 2018 21:10 BRT">26 minutes ago</relative-time>