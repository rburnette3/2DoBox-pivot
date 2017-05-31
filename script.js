
var filteredIdeas = [];
var completedIdeas = [];
var ideaList = getFromLocalStorage() || [];
var indexOfOriginalObject;
loadIdeasFromStorage();

$('.article-container').on('click', '#delete-btn', removeIdea);
$('.article-container').on('click', '#downvote-btn', changeDownvoteQuality);
$('.article-container').on('click', '#upvote-btn', changeUpvoteQuality);
$('.article-container').on('focusout', '.description', replaceEditedDescription);
$('.article-container').on('focusout', 'h2', replaceEditedTitle);
// $('.article-container').on('click', '.show-completed', toggleCompleted);

$('.article-container').on('input keydown', '.description', function(e) {
  if (e.keyCode === 13) {
      // replaceEditedDescription(e) - gets error below
      // Uncaught DOMException: Failed to execute 'removeChild' on 'Node': The node to be removed is no longer a child of this node. Perhaps it was moved in a 'blur' event handler?
    $(e.target).prop('contenteditable', false);
  }
})

$('.article-container').on('input keydown', 'h2', function(e) {
  if (e.keyCode === 13) {
    $(e.target).prop('contenteditable', false);
  }
})

$('#body-input').on('input', function() {
  toggleSaveDisable();
});

$('#body-input').on('input keydown', function(e) {
  if(e.keyCode === 13) {
    e.preventDefault();
  }
});

$('#search-input').on('input', filterIdeas);
$('#submit-btn').on('click', submitNewIdea);


function removePlaceholder() {
    $('.section-placeholder').toggle()
}

$('#title-input').on('input', function() {
  toggleSaveDisable();
});

$(window).on('keyup', function(e) {
  if(e.keyCode === 13 && ($('#title-input').val() !== '') && ($('#body-input').val() !== '')){
    toggleSaveDisable();
    $('#submit-btn').trigger('click');
  }
});

$(window).on('load', function() {
  $('#title-input').focus();
  removePlaceholder();
});

function changeDownvoteQuality(e) {
  var editedObject = findIndexIdeaList($(e.target).parent().parent().prop('id'));
  localStorage.clear();
  switchDownvote(editedObject);
  ideaList.splice(indexOfOriginalObject, 1, editedObject);
  setInLocalStorage();
  filterIdeas();
}

function changeUpvoteQuality(e) {
  var editedObject = findIndexIdeaList($(e.target).parent().parent().prop('id'));
  localStorage.clear();
  switchUpvote(editedObject);
  ideaList.splice(indexOfOriginalObject, 1, editedObject);
  setInLocalStorage();
  filterIdeas();
}

function clearInputs() {
  $('#title-input').val('');
  $('#body-input').val('');
  $('#title-input').focus();
  toggleSaveDisable();
}

function displayFilteredList() {
  $('.article-container').children().remove();
  filteredIdeas.forEach(function(idea) {
    prependExistingIdeas(idea);
  });
}

// function toggleCompleted() {
// //grab surrounding inputs and strikethrough
//   $(this).sibling()
// //grab overlay and toggle CSS class
// }

function displayCompletedList() {
  completedIdeas.forEach(function(idea) {
    prependExistingIdeas(idea);
  });
}

function findIndexIdeaList(id) {
  var list = getFromLocalStorage();
  var mapIdea = list.map(function(idea) {
    return idea.id;
  })
  var specificID = mapIdea.filter(function(number) {
    if (parseInt(id) === number) {
      return number;
    }
  })
  var idAsNumber = specificID[0];
  var foundObject;
  list.forEach(function(object, index) {
    if (parseInt(object.id) === idAsNumber) {
      foundObject = object;
      indexOfOriginalObject = index;
      return object;
    }
  })
  return foundObject;
}

function filterIdeas() {
  var searchInput = $('#search-input').val().toUpperCase();
  ideaList = getFromLocalStorage() || [];
  if(searchInput === '') {
    filteredIdeas = [];
    displayFilteredList();
    loadIdeasFromStorage();
  } else {
      filteredIdeas = ideaList.filter(function(ideaObject) {
      return ((ideaObject.title.toUpperCase().indexOf(searchInput) > -1) || (ideaObject.body.toUpperCase().indexOf(searchInput) > -1) || (ideaObject.quality.toUpperCase().indexOf(searchInput) > -1))
    })
    displayFilteredList();
  }
}

function completedIdeas() {
  ideaList = getFromLocalStorage() || [];
      completedIdeas = ideaList.filter(function(ideaObject) {
         if(ideaObject.completed) {
           return ideaObject;
         }
       })
    displayCompletedList();
  }

function getFromLocalStorage() {
  var parseIdeaList = JSON.parse(localStorage.getItem('ideas'));
  return parseIdeaList;
}

function ideaObject(title, body, id, quality) {
  this.title = title;
  this.body = body;
  this.id = id;
  this.quality = quality;
  this.completed = false;
}

function loadIdeasFromStorage() {
  if (localStorage.getItem('ideas')) {
    ideaList = getFromLocalStorage();
    ideaList.forEach(function(idea) {
      prependExistingIdeas(idea);
    });
  } else {
  }
}

function prependExistingIdeas(idea) {
  $('.article-container').prepend(`<div class='overlay'>
  <article id='${idea.id}'>
  <div class="description-container">
  <h2 contentEditable = 'true'>${idea.title}</h2>
  <div class="top-btn-container">
  <button class="complete-btn" id="complete-btn"></button>
  <button class="icons" id="delete-btn"></button>
  </div>

  <p class="description" contentEditable = 'true'>${idea.body}</p>
  </div>
  <div class="voting-container">
  <button class="icons" id="upvote-btn"></button>
  <button class="icons" id="downvote-btn"></button>
  <p class="quality">quality: <span class="quality-level">${idea.quality}</span></p>
  </div>
  </article>
  </div>`)
}

function prependNewIdea(titleId, titleInput, bodyInput, newIdea) {
  $('.article-container').prepend(`<div class='overlay'>
  <article id='${titleId}'>
  <div class="description-container">
  <h2 contentEditable = 'true'>${titleInput}</h2>
  <div class="top-btn-container">
  <button class="complete-btn" id="complete-btn"></button>
  <button class="icons" id="delete-btn"></button>
  </div>

  <p class="description" contentEditable = 'true'>${bodyInput}</p>
  </div>
  <div class="voting-container">
  <button class="icons" id="upvote-btn"></button>
  <button class="icons" id="downvote-btn"></button>
  <p class="quality">quality: <span class="quality-level">${newIdea.quality}</span></p>
  </div>
  </article>
  </div>`);
}

function removeIdea(e) {
  var editedObject = findIndexIdeaList($(e.target).parent().parent().prop('id'));
  ideaList.splice(indexOfOriginalObject, 1);
  localStorage.clear();
  setInLocalStorage();
  $(this).parents('article').remove();
  removePlaceholder();
}

function replaceEditedDescription(e) {
    var editedObject = findIndexIdeaList($(e.target).parent().parent().prop('id'));
    editedObject.body = $(this).text();
    replaceIdeaInLocalStorage(editedObject);
}

function replaceEditedTitle(e) {
  var editedObject = findIndexIdeaList($(e.target).parent().parent().prop('id'));
  editedObject.title = $(this).text();
  replaceIdeaInLocalStorage(editedObject);
}

function replaceIdeaInLocalStorage(editedObject) {
  localStorage.clear();
  ideaList.splice(indexOfOriginalObject, 1, editedObject);
  setInLocalStorage();
  filterIdeas();
}

function setInLocalStorage() {
  var stringIdeaList = JSON.stringify(ideaList);
  localStorage.setItem('ideas', stringIdeaList);
}

function submitNewIdea(e) {
  e.preventDefault();
  var titleInput = $('#title-input').val();
  var bodyInput = $('#body-input').val();
  var quality = 'Normal';
  var titleId = Date.now();
  var newIdea = new ideaObject(titleInput, bodyInput, titleId, quality);
  ideaList.push(newIdea);
  prependNewIdea(titleId, titleInput, bodyInput, newIdea);
  setInLocalStorage();
  clearInputs();
  filterIdeas();
  if (localStorage.length === 0) {
    removePlaceholder();
  }
}

// function switchDownvote(editedObject) {
//   switch (editedObject.quality) {
//     case 'genius':
//       editedObject.quality = 'plausible'
//       $(this).parent().find('.quality-level').text('plausible')
//       break;
//     case 'plausible':
//       editedObject.quality = 'swill'
//       $(this).parent().find('.quality-level').text('swill')
//       break;
//     default:
//       break;
//   }
// }


///New Function?///
function switchDownvote(editedObject) {

  switch (editedObject.quality){
    case 'Critical':
      editedObject.quality = 'High'
      $(this).parent().find('.quality-level').text('High')
      break;
    case 'High':
      editedObject.quality = 'Normal'
      $(this).parent().find('.quality-level').text('Normal')
      break;
    case 'Normal':
      editedObject.quality = 'low'
      $(this).parent().find('.quality-level').text('low')
      break;
    case 'low':
      editedObject.quality = 'none'
      $(this).parent().find('.quality-level').text('none')
      break;
    default:
      break;
  }
}


// function switchUpvote(editedObject) {
//   switch (editedObject.quality) {
//     case 'swill':
//       editedObject.quality = 'plausible'
//       $(this).parent().find('.quality-level').text('plausible')
//       break;
//     case 'plausible':
//       editedObject.quality = 'genius'
//       $(this).parent().find('.quality-level').text('genius')
//       break;
//     default:
//       break;
//   }
// }


///new function///
function switchUpvote(editedObject) {

  switch (editedObject.quality){
    case 'None':
      editedObject.quality = 'Low'
      $(this).parent().find('.quality-level').text('Low')
      break;
    case 'Low':
      editedObject.quality = 'Normal'
      $(this).parent().find('.quality-level').text('Normal')
      break;
    case 'Normal':
      editedObject.quality = 'High'
      $(this).parent().find('.quality-level').text('High')
      break;
    case 'High':
      editedObject.quality = 'Critical'
      $(this).parent().find('.quality-level').text('Critical')
      break;
    default:
      break;
  }
}

function toggleSaveDisable() {
  var title = $('#title-input').val();
  var body = $('#body-input').val();
  if ((title === '') || (body === '')) {
    $('#submit-btn').prop('disabled', true);
  } else {
    $('#submit-btn').prop('disabled', false);
  }
}
