var userFormEl = document.querySelector('#user-form');
var languageButtonsEl = document.querySelector('#language-buttons');
var usrInputEl = document.querySelector('#SearchBar');
var AmazonContainerEl = document.querySelector('#Amazon-container');
var AmazonSearchTerm = document.querySelector('#Amazon-search-term');
var apiKey = '52de1c4d26msh3e7a0f57d6695f0p19417djsn97cd6110728d';


  var getAmazonApi = function (keyword) {

    const amazonApiUrl = 'https://real-time-amazon-data.p.rapidapi.com/search?query=' + keyword + '&page=1&country=US&category_id=aps';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
      }
    };


    fetch(amazonApiUrl, options)
      .then(response => {
        if (!response.ok) {
          throw new Error("Response.status");
        }
        return response.json();
      })
      .then(data => {

        console.log("here!");
        console.log(data);
        displayAmazonResponse(data, keyword);
      })
      .catch(error => console.error("Error", error));

  };
  


var formSubmitHandler = function (event) {
  event.preventDefault();

  console.log("event = " + event);

  var userInput = usrInputEl.value.trim();

  if (userInput) {
    getAmazonApi(userInput);

    AmazonContainerEl.textContent = '';
    usrInputEl.value = '';
  } else {
    alert('Please enter a GitHub username');
  }
};

function displayAmazonResponse(data, searchTerm)
{
  console.log("displayAmazonResponse");
  console.log(data);

  if (data.status != "OK")
  {
    console.log("displayAmazonResponse");    
  }

  AmazonSearchTerm.textContent = searchTerm;

  var productList = data.data.products;

  for (var i = 0; i < productList.length; i++) {
    var productName = productList[i].product_title;

    var productEl = document.createElement('a');
    productEl.classList = 'list-item flex-row justify-space-between align-center';

    var productUrl = productList[i].product_url;
    productEl.setAttribute('href', productUrl);

    var titleEl = document.createElement('span');
    titleEl.textContent = productName;

    var productPrice = "Price: " + productList[i].product_price;

    titleEl.innerHTML += '<br>';
    titleEl.innerHTML += productPrice;

    productEl.appendChild(titleEl);

    AmazonContainerEl.appendChild(productEl);
  }



}




var buttonClickHandler = function (event) {
  var language = event.target.getAttribute('data-language');

  if (language) {
    getFeaturedRepos(language);

    repoContainerEl.textContent = '';
  }
};

var getUserRepos = function (user) {
  var apiUrl = 'https://api.github.com/users/' + user + '/repos';

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayRepos(data, user);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to GitHub');
    });
};

var getFeaturedRepos = function (language) {
  var apiUrl = 'https://api.github.com/search/repositories?q=' + language + '+is:featured&sort=help-wanted-issues';

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayRepos(data.items, language);
      });
    } else {
      alert('Error: ' + response.statusText);
    }
  });
};

var displayRepos = function (repos, searchTerm) {
  if (repos.length === 0) {
    repoContainerEl.textContent = 'No repositories found.';
    return;
  }

  repoSearchTerm.textContent = searchTerm;

  for (var i = 0; i < repos.length; i++) {
    var repoName = repos[i].owner.login + '/' + repos[i].name;

    var repoEl = document.createElement('a');
    repoEl.classList = 'list-item flex-row justify-space-between align-center';
    repoEl.setAttribute('href', './single-repo.html?repo=' + repoName);

    var titleEl = document.createElement('span');
    titleEl.textContent = repoName;

    repoEl.appendChild(titleEl);

    var statusEl = document.createElement('span');
    statusEl.classList = 'flex-row align-center';

    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    repoEl.appendChild(statusEl);

    repoContainerEl.appendChild(repoEl);
  }
};

userFormEl.addEventListener('submit', formSubmitHandler);
