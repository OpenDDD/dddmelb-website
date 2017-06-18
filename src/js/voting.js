$(document).ready(function() {
  var totalVotes = 10;
  var votes = [];
  var addVoteClass = 'add-vote';
  var removeVoteClass = 'remove-vote';
  var submitVotes = $('#submit-votes');

  if(submitVotes.length > 0) {
    var submitVotesTopOffset = submitVotes.offset().top;

    submitVotes.affix({
      offset: {
        top: submitVotesTopOffset
      }
    });

    $('.vote-for-session').on('click', function(e) {
      var voteBtn = $(this);
      if(voteBtn.hasClass(addVoteClass)) {
        if(votes.length >= totalVotes) { return; }
        addVote(voteBtn.data('session-id'));
        voteBtn.removeClass(addVoteClass)
          .addClass(removeVoteClass);
      } else {
        removeVote(voteBtn.data('session-id'));
        voteBtn.removeClass(removeVoteClass)
          .addClass(addVoteClass);
      }

      submitVotes.find('.remaining-votes').text(totalVotes - votes.length);
    });

    submitVotes.find('form').on('submit', function(e) {
      e.preventDefault();

      if(votes.length !== totalVotes) {
        alert('You must use all ' + totalVotes + ' votes');
        return;
      }

      var submitVotesForm = $(this);
      var orderNumber = submitVotesForm.find('#OrderNumber').val();
      var orderEmail = submitVotesForm.find('#OrderEmail').val();

      if(!orderNumber || !orderEmail) {
        alert('You must enter an order number and email');
        return;
      }

      submitVotesForm.find('input[type="submit"]').attr('disabled', true);

      $.ajax({
        type: 'POST',
        url: 'https://dddmelb.azurewebsites.net/Voting/SubmitVote',
        data: JSON.stringify({
          sessionIds: votes,
          orderNumber: orderNumber,
          orderEmail: orderEmail
        }),
        contentType: 'application/json; charset=utf-8',
        success: function() { window.location = '/vote/success/'; },
        error: function() { window.location = '/vote/failure/'; }
      });
    });
  }

  $('.session-title h3').on('click', function() {
    var sessionTitle = $(this);
    sessionTitle.closest('.submitted-session')
      .toggleClass('open');
  });

  function addVote(sessionId) {
    votes.push(sessionId);
  }

  function removeVote(sessionId) {
    var sessionVoteIndex = votes.indexOf(sessionId);
    if (sessionVoteIndex > -1) {
      votes.splice(sessionVoteIndex, 1);
    }
  }
});
