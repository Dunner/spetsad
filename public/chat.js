

var socket = io.connect();

$(function() {
  
  var players = [], messages = [], i;
  
  socket.on('connect', function () {
    setName();
  });
  
  socket.on('message', function (msg) {
    messages.push(msg);
    
    $('<div>', { 
        id: 'outsidediv'
    }).append( $('<span>', { 
        class: 'name',
        text: msg.name
    })).append( $('<span>', { 
        class: 'message',
        text: msg.text
    })).appendTo('#messages');

  });
  
  socket.on('roster', function (names) {
    for(i=0; i<names.length; i++) {
      $('<li>', { 
          class: 'user',
          text: names[i]
      }).appendTo('#users');
    }
    players = names;
  });
  
  function setName() {
    var name = $( '#myName' ).val();
    socket.emit('identify', name);
  }

  $( '#chat' ).submit(function(event) {
    event.preventDefault();
    var message = $('#message').val();
    socket.emit('message', message);
    $('#message').val('');
  });  
  
  $( '#myName' ).change(function() {
    setName();
  });
  
  $.get('/dreams', function(dreams) {
    dreams.forEach(function(dream) {
      $('<li></li>').text(dream).appendTo('ul#dreams');
    });
  });

});
