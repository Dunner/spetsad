

(function(){

  var 
      nameEntryButtonEl = document.getElementById('name-entry-button'),
      nameEntryInsideEl = document.getElementById('name-entry-inside'),
      nameEntryEl = document.getElementById('name-entry'),

      messagesEl = document.getElementById('messages'),
      messageEl = document.getElementById('message'),
      myNameEl = document.getElementById('myName'),
      usersEl = document.getElementById('users'),
      chatEl = document.getElementById('chat');


  var players = [], messages = [], i;
  
  socket.on('connect', function () {
    setName();
  });
  
  socket.on('kill', function (data) {
    var byName = findPlayer(data.by).name;
    var victimName = findPlayer(data.victim).name;
  });

  socket.on('message', function (msg) {
    messages.push(msg);
    
    var messageWrapper = document.createElement('div');
    messageWrapper.id = 'outsidediv';

    var messageName = document.createElement('span');
    messageName.className = 'name';
    messageName.appendChild( document.createTextNode( msg.name + ': ') );

    var messageMessage = document.createElement('span');
    messageMessage.className = 'message';
    messageMessage.appendChild( document.createTextNode( msg.text) );

    messageWrapper.appendChild(messageName);
    messageWrapper.appendChild(messageMessage);
    messagesEl.appendChild(messageWrapper);
  });
  
  socket.on('roster', function (players) {
    while(usersEl.firstChild){
      usersEl.removeChild(usersEl.firstChild);
    }
    for(i=0; i<players.length; i++) {
      var rosterName = document.createElement('li');
      rosterName.className = 'user';
      rosterName.appendChild( document.createTextNode( players[i].name + ' - kills: ' + players[i].kills + '. deaths: ' + players[i].deaths) );
      usersEl.appendChild(rosterName);
    }
    players = players;
  });
  

  chatEl.onsubmit = function(event){
    event.preventDefault();
    var message = messageEl.value;
    socket.emit('message', message);
    messageEl.value = '';
  };  
  
  function setName() {
    var name = myNameEl.value;
    socket.emit('identify', name);
  }


  nameEntryButtonEl.onclick = function(){
    nameEntryEl.className = 'animate-disperse';
    setName();
  };

})();