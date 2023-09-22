var userFormEl = document.querySelector('#user-form');
var languageButtonsEl = document.querySelector('#language-buttons');
var usrInputEl = document.querySelector('#SearchBar');
var AmazonContainerEl = document.querySelector('#Amazon-container');
var AmazonSearchTerm = document.querySelector('#Amazon-search-term');
var reviewContainerEl = document.querySelector('#reviewContainer');

var apiKey = '52de1c4d26msh3e7a0f57d6695f0p19417djsn97cd6110728d';

var asinNum = [];
//var reviewButtonEl = [];

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
    console.log("displayAmazonResponse Fail!");    
  }

  AmazonSearchTerm.textContent = searchTerm;

  var productList = data.data.products;

  for (var i = 0; i < productList.length; i++) {
    var productContainer = document.createElement('div');
    productContainer.classList = 'list-item flex-row justify-space-between align-center';

    var productName = productList[i].product_title;

    var titleEl = document.createElement('span');
    titleEl.textContent = productName;
    titleEl.innerHTML += '<br>';

    var productPrice = "Price: " + productList[i].product_price;
    titleEl.innerHTML += productPrice;

    titleEl.innerHTML += '<br>';    
    titleEl.innerHTML += '<br>'; 
    productContainer.appendChild(titleEl);

    var productImg = new Image(100);
    productImg.src = productList[i].product_photo;

    var anchorEl = document.createElement('a');
    anchorEl.setAttribute('href', productList[i].product_url);
    anchorEl.appendChild(productImg);
    productContainer.appendChild(anchorEl);

    devEl = document.createElement("div");
    asinNum[i] = productList[i].asin;
    console.log("asinNum: ", asinNum[i]);

    var reviewButtonEl = document.createElement('button');
    reviewButtonEl.classList = 'review-btn';
    reviewButtonEl.innerText = "Reviews";
    reviewButtonEl.value = i;
    reviewButtonEl.id = productList[i].asin;
//    reviewButtonEl.type = "submit";
    reviewButtonEl.addEventListener("click", function(event) {
      event.preventDefault();      
      console.log("event: ", event);
      console.log("id: ", event.target.id);      

      getAmazonReviewApi(event.target.id, event.target.parentElement);  
    });
    devEl.appendChild(reviewButtonEl);
    productContainer.appendChild(devEl);

    AmazonContainerEl.appendChild(productContainer);
  }

}

function getAmazonReviewApi(asin, insertElement)
{
  console.log("getAmazonReviewApi");
  console.log(asin);  

//  const amazonApiUrl = 'https://real-time-amazon-data.p.rapidapi.com/product-reviews?asin=B07ZPKN6YR&country=US&verified_purchases_only=false&images_or_videos_only=false&page=1&page_size=10';
  const amazonApiUrl = 'https://real-time-amazon-data.p.rapidapi.com/product-reviews?asin=' + asin + '&country=US&verified_purchases_only=false&images_or_videos_only=false&page=1&page_size=10';
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
      displayAmazonReviews(data, asin, insertElement);
    })
    .catch(error => console.error("Error", error));

}


function displayAmazonReviews(data, asinNum, insertElement)
{
  console.log("displayAmazonReviews, asinNum: ", asinNum);
  console.log(data);

  if (data.status != "OK")
  {
    console.log("displayAmazonReviews Fail!");    
  }

  
  reviewContainerEl.innerHTML = "";

  var reviewList = data.data.reviews;  
  if (reviewList.length === 0)
  {
    var cardEl = document.createElement("div");
    cardEl.classList = 'card';
    cardEl.textContent = 'No Review Found';
    reviewContainerEl.appendChild(cardEl);
  }
  else
  {

  var bigCardElement = document.createElement("div");
    bigCardElement.classList = "card bigCard";
   for (var i = 0; i < reviewList.length; i++) {
      var cardEl = document.createElement("div");
      cardEl.classList = 'review-card';
      cardEl.textContent = reviewList[i].review_comment;
      bigCardElement.appendChild(cardEl);
    }
  }
reviewContainerEl.appendChild(bigCardElement);
}



userFormEl.addEventListener('submit', formSubmitHandler);
