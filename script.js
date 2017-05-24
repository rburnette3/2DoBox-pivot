// var titleInput = $('#title-input').val();
// var bodyInput = $('#body-input').val();
var searchInput = $('#search-input').val();

var ideaList = [];

function setInLocalStorage() {
  var stringIdeaList = JSON.stringify(ideaList);
  localStorage.setItem('ideas', stringIdeaList);
  console.log('string idea list', stringIdeaList)
}
function getFromLocalStorage() {
  var parseIdeaList = JSON.parse(localStorage.getItem('ideas'));
  return parseIdeaList
}


function loadIdeasFromStorage() {
  if (localStorage.getItem('ideas')) {
    ideaList = getFromLocalStorage();
    console.log('ideaList', ideaList)
    console.log('idea list after assigning parse', ideaList)
    ideaList.forEach(function(idea) {
      $('.article-container').prepend(`<article id='${idea.id}'>
        <div class="description-container">
          <h2>${idea.title}</h2>
          <button class="icons" id="delete-btn"></button>
          <p class="description">${idea.body}</p>
        </div>
        <div class="voting-container">
          <button class="icons" id="upvote-btn"></button>
          <button class="icons" id="downvote-btn"></button>
          <p class="quality">quality: <span class="default swill">swill</span></p>
        </div>
      </article>`)
    });
  } else {
    console.log('no ideas!!!')
  }
}

$('#submit-btn').on('click', function(e) {
  e.preventDefault();
  var titleInput = $('#title-input').val();
  var bodyInput = $('#body-input').val();
  var titleId = Date.now();
  var newIdea = new ideaObject(titleInput, bodyInput, titleId)

  ideaList.push(newIdea);
  console.log('idea list after add', ideaList)
  console.log('new Idea object', newIdea)
  $('.article-container').prepend(`<article id='${titleId}'>
    <div class="description-container">
      <h2>${titleInput}</h2>
      <button class="icons" id="delete-btn"></button>
      <p class="description">${bodyInput}</p>
    </div>
    <div class="voting-container">
      <button class="icons" id="upvote-btn"></button>
      <button class="icons" id="downvote-btn"></button>
      <p class="quality">quality: <span class="default swill">swill</span></p>
    </div>
  </article>`);
  // $('').prop('disabled', true);
  setInLocalStorage();
  console.log('idea list array', ideaList)
  clearInputs();
});



loadIdeasFromStorage();

$(window).on('keyup', function(e) {
  if(e.keyCode === 13) {
    $('#submit-btn').trigger('submit');
    console.log('submit-click');
  }
});

function ideaObject(title, body, id) {
  this.title = title;
  this.body = body;
  this.id = id;
}




$('.article-container').on('click', '#upvote-btn', function() {
  if($(this).parent().find('.default').hasClass('swill')) {
    $(this).parent().find('.default').addClass('plausible');
    $(this).parent().find('.default').removeClass('swill');
    $(this).parent().find('.default').text('plausible');
    $('this #downvote-btn').prop('disabled', false);
  } else if ($(this).parent().find('.default').hasClass('plausible')) {
    $(this).parent().find('.default').addClass('genius');
    $(this).parent().find('.default').removeClass('plausible');
    $(this).parent().find('.default').text('genius');
    $('this #upvote-btn').prop('disabled', true);
  }
});

$('.article-container').on('click', '#downvote-btn', function() {
  console.log('upvote-click');
  console.log(this);
  console.log($(this).parent().find('.default'));
  if($(this).parent().find('.default').hasClass('plausible')) {
    $(this).parent().find('.default').addClass('swill');
    $(this).parent().find('.default').removeClass('plausible');
    $(this).parent().find('.default').text('swill');
    $('this #downvote-btn').prop('disabled', true);
    console.log('swill');
  } else if ($(this).parent().find('.default').hasClass('genius')) {
    $(this).parent().find('.default').addClass('plausible');
    $(this).parent().find('.default').removeClass('genius');
    $(this).parent().find('.default').text('plausible');
    $('this #upvote-btn').prop('disabled', false);
    console.log('plausible');
  }
});

function clearInputs() {
  $('#title-input').val('');
  $('#body-input').val('');
  $('#title-input').focus();
}


$('.article-container').on('click', '#delete-btn', function() {
  $(this).parents('article').remove();
  console.log(this);
  console.log('click');
});

$('.article-container').on('click', '.description', function() {
  $(this).get(0).contentEditable = "true";
  $(this).focus();
})

$('.article-container').on('focusout', '.description', function(e) {
  $(this).hideFocus = true
  var editedObject = findIndexIdeaList($(e.target).parent().parent().prop('id'));
  editedObject.body = $(this).text()
  ideaList.splice(indexOfOriginalObject, 1, editedObject)
  localStorage.clear();
  setInLocalStorage();
})

//keydown and focusOut and blur()
$('.article-container').on('click', 'h2', function(e) {
  $(this).get(0).contentEditable = "true";
  $(this).focus();

})

$('.article-container').on('focusout', 'h2', function(e) {
  $(this).hideFocus = true
  var editedObject = findIndexIdeaList($(e.target).parent().parent().prop('id'));
  editedObject.title = $(this).text()
  ideaList.splice(indexOfOriginalObject, 1, editedObject)
  localStorage.clear();
  setInLocalStorage();
})

var indexOfOriginalObject;


function findIndexIdeaList(id) {
  var list = getFromLocalStorage();
  var mapIdea = list.map(function(idea) {
    return idea.id;
  })

  var specificID = mapIdea.filter(function(number) {
    if (parseInt(id) === number) {
      return number
    }
  })
  var idAsNumber = specificID[0];

  var foundObject;
  list.forEach(function(object, index) {
    if (parseInt(object.id) === idAsNumber) {
      foundObject = object;
      indexOfOriginalObject = index;
      return object
    }
  })


  return foundObject
}

//return the object with that id
// re-assign text values for keys of title and body of object
//save to local storage
