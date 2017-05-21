var titleInput = $('#title-input').val();
var bodyInput = $('#body-input').val();
var searchInput = $('#search-input').val();

$(window).on('keyup', function(e) {
  if(e.keyCode === 13) {
    $('#submit-btn').trigger('submit');
    console.log('submit-click');
  }
});

$('#submit-btn').on('click', function(e) {
  e.preventDefault();
  var titleInput = $('#title-input').val();
  var bodyInput = $('#body-input').val();
  console.log(titleInput);
  console.log(bodyInput);
  $('.article-container').prepend(`<article>
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
  clearInputs();
});

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
  $(this).siblings('article').remove();
  console.log(this);
  console.log('click');
});
