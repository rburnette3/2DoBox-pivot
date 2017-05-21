var titleInput = $('#title-input').val();
var bodyInput = $('#body-input').val();
var searchInput = $('#search-input').val();

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
      <p class="quality">quality: <span>swill</span></p>
    </div>
  </article>`);
  clearInputs();
});

function clearInputs() {
  $('#title-input').val('');
  $('#body-input').val('');
  $('#title-input').focus();
}


$('.article-container').on('click', '#delete-btn', function() {
  $(this).closest('article').remove();
  console.log(this);
  console.log('click');
});
