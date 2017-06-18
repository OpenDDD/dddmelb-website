$(document).ready(function() {
  $('#agenda-modal').on('show.bs.modal', function(e) {
    var agendaItem = $(e.relatedTarget);

    var speaker = agendaItem.find('.speaker').text() || '';
    var room = agendaItem.find('.area').text() || '';
    var sessionTitle = agendaItem.find('.info').text() || '';
    var sessionAbstract = agendaItem.find('.abstract').html() || '';
    var modal = $(this);

    modal.find('.modal-title').text(room + ": " + sessionTitle);
    modal.find('.speaker').text(speaker);
    modal.find('.modal-body').html(sessionAbstract);
  });
});
