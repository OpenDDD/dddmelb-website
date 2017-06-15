$(document).ready(function() {
  var totalVotes = 4;
  var votes = [];

  $('.vote').on('click', function(e) {
    e.preventDefault();
    var voteBtn = $(this);
    if(voteBtn.text() === '+') {
      if(votes.length >= totalVotes) { return; }
      addVote(voteBtn.data('session-id'));
      voteBtn.text('-');
    } else {
      removeVote(voteBtn.data('session-id'));
      voteBtn.text('+');
    }

    $('#submit-votes .remaining-votes').text(totalVotes - votes.length);
  });

  $('#submit-votes input[type="submit"]').on('click', function() {
    $.ajax({
      type: "POST",
      url: 'https://dddmelb.azurewebsites.net/Voting/SubmitVote',
      data: {
        sessionIds: votes,
        orderNumber: '',
        orderEmail: ''
      },
      success: function() {},
      dataType: 'json'
    });
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
