//overview is where the profile info will appear
const overview = document.querySelector(".overview");
const username = "noorainfatema";
const repoList = document.querySelector(".repo-list");
const allRepoInfo = document.querySelector(".repos");
const repoData = document.querySelector(".repo-data");
const backButton = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");

const githubInfo = async function () {
    const userInfo = await fetch(`https://api.github.com/users/${username}`);
    const data = await userInfo.json();
    displayUserInfo(data);
};

githubInfo();

const displayUserInfo = function (data) {
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = `
    <figure>
        <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Bio:</strong> ${data.bio}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div> 
    `;
    overview.append(div);
    gitRepos();
};

const gitRepos = async function () {
    const listOfRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoListInfo = await listOfRepos.json();
    displayRepos(repoListInfo);
};

const displayRepos = function (repos) {
    filterInput.classList.remove("hide");
    for (const repo of repos) {
        const repoItem = document.createElement("li");
        repoItem.classList.add("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(repoItem);
    }
};

repoList.addEventListener("click", function (e) {
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
        specificRepoInfo(repoName);
    }
});

const specificRepoInfo = async function (repoName) {
    const specificInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await specificInfo.json();
    const fetchLanguages = await fetch(repoInfo.languages_url);
    const languageData = await fetchLanguages.json();
    const languages = [];
        for (const language in languageData) {
            languages.push(language);
        } 

    //console.log(repoInfo);
    //console.log(languageData);
    //console.log(languages);
    displayRepoInfo(repoInfo, languages);
};

const displayRepoInfo = function (repoInfo, languages) {
    repoData.innerHTML = "";
    backButton.classList.remove("hide");
    repoData.classList.remove("hide");
    allRepoInfo.classList.add("hide");
    const div = document.createElement("div");
    div.classList.add("repoName");
    div.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
        <p>Description: ${repoInfo.description}</p>
        <p>Default Branch: ${repoInfo.default_branch}</p>
        <p>Languages: ${languages.join(", ")}</p>
        <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `;
    repoData.append(div);
};

backButton.addEventListener("click", function () {
    allRepoInfo.classList.remove("hide");
    backButton.classList.add("hide");
    repoData.classList.add("hide");
});

filterInput.addEventListener("input", function (e) {
    const searchBox = e.target.value;
    const repos = document.querySelectorAll(".repo");
    const searchLowerCase = searchBox.toLowerCase();
    for (const repo of repos) {
        const repoLowerCase = repo.innerText.toLowerCase();
        if (repoLowerCase.includes(searchLowerCase)) {
            repo.classList.remove("hide");
        } else {
            repo.classList.add("hide");
        }
    }
});