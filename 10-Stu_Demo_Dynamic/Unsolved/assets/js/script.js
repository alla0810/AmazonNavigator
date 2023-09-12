var userContainer = document.getElementById('users');
var fetchButton = document.getElementById('fetch-button');

function getApi() {
  var requestUrl = 'https://api.github.com/users?per_page=5';

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Use the console to examine the response
      console.log(data);
      // TODO: Loop through the data and generate your HTML

      for (var i=0; i<data.length; i++)
      {
        var login = document.createElement('h3');
        var urlAddr = document.createElement('p');
        var usrImage = document.createElement("img");

        login.textContent = data[i].login;
        urlAddr.textContent = data[i].url;
        urlAddr.setAttribute("href", data[i].url);
        usrImage.setAttribute("src", data[i].avatar_url);

        userContainer.append(login);
        userContainer.append(urlAddr);
        userContainer.append(usrImage);
      }
    });
}
fetchButton.addEventListener('click', getApi);
