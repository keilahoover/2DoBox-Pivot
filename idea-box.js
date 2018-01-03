window.onload = function() {
  loadCard();
  $('#input-title').focus();
  $('#submit-btn').prop('disabled', true);
}

/*Event Listeners*/

//Input fields keyup
$('.input-fields').on('keyup', toggleButtonDisabled);

//Submit button click
$('#submit-btn').on('click', submitBtn); 

//Search input keyup
$('#search').on('keyup', searchBar);

// editTitle
$('.prependCard').on('keyup', '.card-input-title', editTitle);

// editBody
$('.prependCard').on('keyup', '.card-input-body', editBody);

//Delete button click
$('.prependCard').on('click', '.delete-btn', deleteBtn);

//Down vote click
$('.prependCard').on('click', '.downvote-btn', downvoteBtn);

// upvote button
$('.prependCard').on('click', '.upvote-btn', upvoteBtn);

function submitBtn(event) {
  event.preventDefault();
  var newCard = new Card($('#input-title').val(), $('#input-body').val());
  prependCard(newCard);
  addToStorage(newCard);
  console.log(newCard)
  $('.input-fields').val('');
};

function searchBar() {
 var searchRequest = $('#search').val();
 $('.newArticle').each(function() {
   var searchResult = $(this).text().indexOf(searchRequest);
   this.style.display = searchResult > -1 ? "" : "none";
 })
};

function editTitle (e) {
  var itemId = $(this).parent('.newArticle').attr('id');
  var parsedContent = JSON.parse(localStorage.getItem(itemId));
  parsedContent['title'] = $(this).text();
  addToStorage(parsedContent);
}

function editBody (e) {
  var itemId = $(this).parent('.newArticle').attr('id');
  var parsedContent = JSON.parse(localStorage.getItem(itemId));
  parsedContent['body'] = $(this).text();
  addToStorage(parsedContent);
} 

  function deleteBtn() {
  $(this).parent('.newArticle').remove();
  console.log(34)
  var key = $(this).parent().attr('id');
  localStorage.removeItem(key);
}

  function upvoteBtn() {
  var qualityArray = ['swill', 'plausible', 'genius'];
  var key = $(this).parent().attr('id');
  var upQuality = localStorage.getItem(key);
  var upQualityParse = JSON.parse(upQuality);
  if ($(this).siblings('.quality-value').text() === 'swill')  {
    $(this).siblings('.quality-value').text(qualityArray[1]);
    upQualityParse.qualityNumber = 1;
  } else if ($(this).siblings('.quality-value').text() === 'plausible') {
    $(this).siblings('.quality-value').text(qualityArray[2])
    upQualityParse.qualityNumber = 2;
  }
  addToStorage(upQualityParse);
};

  function downvoteBtn() {
  var qualityArray = ['swill', 'plausible', 'genius'];
  var key = $(this).parent().attr('id');
  var downQuality = localStorage.getItem(key);
  var downQualityParse = JSON.parse(downQuality);
  if ($(this).siblings('.quality-value').text() === 'genius') {
    $(this).siblings('.quality-value').text(qualityArray[1]);
    downQualityParse.qualityNumber = 1;
  } else if ($(this).siblings('.quality-value').text() === 'plausible') {
    $(this).siblings('.quality-value').text(qualityArray[0]);
    downQualityParse.qualityNumber = 0;
  }
  addToStorage(downQualityParse);
}

/*Functions*/

function Card (title, body) {
  this.title = title;
  this.body = body;
  this.uniqueId = $.now();
  this.quality = ['swill', 'plausible', 'genius'];
  this.qualityNumber = 0;
};

function prependCard (Card) {
  $('.prependCard').prepend(`
    <article class="newArticle" id=${Card.uniqueId}>
    <h2 class="card-input-title" contenteditable="true">${Card.title}</h2>
    <input type="image" src="images/delete.svg" class="delete-btn" value="X">
    <p class="card-input-body" contenteditable="true">${Card.body}</p>
    <input type="image" src="images/upvote.svg" class="upvote-btn" alt="upvote-button">
    <input type="image" src="images/downvote.svg" class="downvote-btn" alt="downvote-button">
    <p class="quality-title">quality:</p>
    <p class="quality-value">${Card.quality[Card.qualityNumber]}</p>
    <button class="completed-task">Completed Task</button>
    <hr>
    </article>`)
  $('#input-title').focus();
};

$('.prependCard').on('click', '.completed-task', completedTask);
function completedTask() {
  $(this).parent().addClass('strike-through');
  addToStorage(completedTask);
}

function addToStorage(object) {
  var stringObj = JSON.stringify(object);
  localStorage.setItem(object.uniqueId, stringObj);
};

function loadCard() {
  for (i=0; i < localStorage.length; i++) {
    var getObject = localStorage.getItem(localStorage.key(i));
    var loadObject = JSON.parse(getObject);
    prependCard(loadObject);
  }
}

function toggleButtonDisabled() {
  if($('#input-title').val() && $('#input-body').val()) {
    $('#submit-btn').prop('disabled', false);
  } else {
    $('#submit-btn').prop('disabled', true);
  }
};