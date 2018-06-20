$(document).ready(function() {
  var totalVotes = 10;
  var votes = [];
  var addVoteClass = 'add-vote';
  var removeVoteClass = 'remove-vote';
  var submitVotes = $('#submit-votes');

  $('.submitted-session').on('click', '.vote-for-session, .session-title h3', function(e) {
    var target = $(this);
    if(target.hasClass('vote-for-session')) {
      toggleSessionVote(target);
    } else if(target.prop("tagName") === "H3") {
      toggleSessionDetails(target);
    }
  });

  $('#toggle-visability').click(function(e) {
    var target = $(this);
    if(target.hasClass('showAll')) {
      target.removeClass('showAll');
      target.val('Show All');
      $('.submitted-session').removeClass('open');
    } else {
      target.addClass('showAll');
      target.val('Hide All');
      $('.submitted-session').addClass('open');
    }
  });

  if(submitVotes.length > 0) {
    var submitVotesTopOffset = submitVotes.offset().top;

    submitVotes.affix({
      offset: {
        top: submitVotesTopOffset
      }
    });

    var orderNumber = getUrlParameter('order');
    if(orderNumber) {
      submitVotes.find('#OrderNumber').val(orderNumber);
    }
    var orderEmail = getUrlParameter('email');
    if(orderEmail) {
      submitVotes.find('#OrderEmail').val(orderEmail);
    }

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
        alert('You must enter an order reference and email');
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

  function toggleSessionVote(voteBtn) {
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
  }

  function toggleSessionDetails(sessionTitle) {
    sessionTitle.closest('.submitted-session')
      .toggleClass('open');
  }

  function addVote(sessionId) {
    votes.push(sessionId);
  }

  function removeVote(sessionId) {
    var sessionVoteIndex = votes.indexOf(sessionId);
    if (sessionVoteIndex > -1) {
      votes.splice(sessionVoteIndex, 1);
    }
  }

  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };
});
