loadIdeasFromStorage();
var searchInput = $('#search-input').val();
var ideaList = getFromLocalStorage() || [];

function setInLocalStorage() {
  var stringIdeaList = JSON.stringify(ideaList);
  localStorage.setItem('ideas', stringIdeaList);
}
function getFromLocalStorage() {
  var parseIdeaList = JSON.parse(localStorage.getItem('ideas'));
  return parseIdeaList
}

function loadIdeasFromStorage() {
  if (localStorage.getItem('ideas')) {
    ideaList = getFromLocalStorage();
    ideaList.forEach(function(idea) {
      $('.article-container').prepend(`<article id='${idea.id}'>
        <div class="description-container">
          <h2 contentEditable = 'true'>${idea.title}</h2>
          <button class="icons" id="delete-btn"></button>
          <p class="description" contentEditable = 'true'>${idea.body}</p>
        </div>
        <div class="voting-container">
          <button class="icons" id="upvote-btn"></button>
          <button class="icons" id="downvote-btn"></button>
          <p class="quality">quality: <span class="quality-level">${idea.quality}</span></p>
        </div>
      </article>`)
    });
  } else {
    console.log('no ideas!!!')
  }
}

$('#submit-btn').on('click', function(e) {
  e.preventDefault();
  console.log('submit clicked')
  // toggleSaveDisable();
  var titleInput = $('#title-input').val();
  var bodyInput = $('#body-input').val();
  var quality = 'swill';
  var titleId = Date.now();
  var newIdea = new ideaObject(titleInput, bodyInput, titleId, quality)
  ideaList.push(newIdea);
  $('.article-container').prepend(`<article id='${titleId}'>
    <div class="description-container">
      <h2 contentEditable = 'true'>${titleInput}</h2>
      <button class="icons" id="delete-btn"></button>
      <p class="description" contentEditable = 'true'>${bodyInput}</p>
    </div>
    <div class="voting-container">
      <button class="icons" id="upvote-btn"></button>
      <button class="icons" id="downvote-btn"></button>
      <p class="quality">quality: <span class="quality-level">${newIdea.quality}</span></p>
    </div>
  </article>`);
  setInLocalStorage();
  clearInputs();
});


function ideaObject(title, body, id, quality) {
  this.title = title;
  this.body = body;
  this.id = id;
  this.quality = quality;
}

$('.article-container').on('click', '#upvote-btn', changeUpvoteQuality);
$('.article-container').on('click', '#downvote-btn', changeDownvoteQuality);

function clearInputs() {
  $('#title-input').val('');
  $('#body-input').val('');
  $('#title-input').focus();
  toggleSaveDisable();
}

$('.article-container').on('click', '#delete-btn', function(e) {
  var editedObject = findIndexIdeaList($(e.target).parent().parent().prop('id'));
  ideaList.splice(indexOfOriginalObject, 1)
  localStorage.clear();
  setInLocalStorage();
  $(this).parents('article').remove();
});

$('.article-container').on('focusout', 'h2', replaceEditedTitle);
$('.article-container').on('focusout', '.description', replaceEditedDescription);

function replaceEditedTitle(e) {
  var editedObject = findIndexIdeaList($(e.target).parent().parent().prop('id'));
  localStorage.clear();
  editedObject.title = $(this).text()
  ideaList.splice(indexOfOriginalObject, 1, editedObject)
  setInLocalStorage();
}

function replaceEditedDescription(e) {
  var editedObject = findIndexIdeaList($(e.target).parent().parent().prop('id'));
  localStorage.clear();
  editedObject.body = $(this).text()
  ideaList.splice(indexOfOriginalObject, 1, editedObject)
  setInLocalStorage();
}

function changeUpvoteQuality(e) {
  var editedObject = findIndexIdeaList($(e.target).parent().parent().prop('id'));
  localStorage.clear();
  switch (editedObject.quality) {
    case 'swill':
      editedObject.quality = 'plausible'
      $(this).parent().find('.quality-level').text('plausible')
      break;
    case 'plausible':
      editedObject.quality = 'genius'
      $(this).parent().find('.quality-level').text('genius')
      break;
    default:
      break;
  }
  ideaList.splice(indexOfOriginalObject, 1, editedObject)
  setInLocalStorage();
  // loadIdeasFromStorage();
}

function changeDownvoteQuality(e) {
  var editedObject = findIndexIdeaList($(e.target).parent().parent().prop('id'));
  localStorage.clear();
  switch (editedObject.quality) {
    case 'genius':
      editedObject.quality = 'plausible'
      $(this).parent().find('.quality-level').text('plausible')
      break;
    case 'plausible':
      editedObject.quality = 'swill'
      $(this).parent().find('.quality-level').text('swill')
      break;
    default:
      break;
  }
  ideaList.splice(indexOfOriginalObject, 1, editedObject)
  setInLocalStorage();
  // loadIdeasFromStorage();
}

$('.article-container').on('keydown', 'h2', function(e) {
  if(e.keyCode === 13) {
    $(this).parent().find('.description').focus();
  }
})

$('.article-container').on('keydown', '.description', function(e) {
  if(e.keyCode === 13) {
    e.preventDefault();
    // $('body').focus();
    // some way to focus out of the body paragraph
  }
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
      console.log('indexOfOriginal Object: ' + indexOfOriginalObject, 'index: ' + index)
      return object
    }
  })
  return foundObject
}

$(window).on('load', function() {
  $('#title-input').focus();
})

$(window).on('keyup', function(e) {
  if(e.keyCode === 13 && ($('#title-input').val() !== '') && ($('#body-input').val() !== '')){
    toggleSaveDisable();
  }
});

$('#title-input').on('input', function() {
  toggleSaveDisable();
})

$('#body-input').on('input', function() {
  toggleSaveDisable();
})

function toggleSaveDisable() {
  var title = $('#title-input').val();
  var body = $('#body-input').val();
  if ((title.length === 0) || (body.length === 0)) {
    $('#submit-btn').prop('disabled', true);
  } else {
    $('#submit-btn').prop('disabled', false);
  }
}
