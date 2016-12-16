


  var 
      myNameEl = document.getElementById('myName'),
      nameEntryButtonEl = document.getElementById('name-entry-button'),

      gamesListButtonCreateEl = document.getElementById('games-list-create-button'),

      gameLobbyButtonLeaveEl = document.getElementById('game-lobby-leave-button'),
      gameLobbyButtonStartEl = document.getElementById('game-lobby-start-button'),

      lobbiesEl = document.getElementById('lobbies'),


      usersEl = document.getElementById('users'),

      messagesEl = document.getElementById('messages'),
      messageEl = document.getElementById('message'),
      chatEl = document.getElementById('chat');


  var sockets = [], messages = [], lobby = {}, i;


  //Step 1
  function setName() {
    var name = myNameEl.value;
    socket.emit('setName', name);
  }

  var logic= {
    currentStage: 'nameEntry',
    stages: {
      nameEntry: {
        element: document.getElementById('name-entry'),
        show: function() {}
      },
      gamesList: {
        element: document.getElementById('games-list'),
        show: function() {
          socket.emit('getLobbies');
        }
      },
      gameLobby: {
        element: document.getElementById('game-lobby'),
        show: function(lobby) {
          printLobby(lobby);
        }
      },
      game: {
        element: null,
        show: function() {
          startGame();
          chatEl.style.visibility = 'visible';
        }
      }
    }
  }

  function stageChange(stageName, data) {
    for(var stage in logic.stages) {
      if (logic.stages[stageName] && stageName == stage) {
        if (logic.stages[stage].element) {
          logic.stages[stage].element.className = 'ui-overlay';
        }
        logic.stages[stage].show(data);
        logic.currentStage = stageName;
      } else {
        if (logic.stages[stage].element) {
          logic.stages[stage].element.className = 'ui-overlay animate-disperse';
        }
      }
      if (stage != 'game') {
        chatEl.style.visibility = 'hidden';
      }
    }
  }

  function printLobby(data) {
    lobby = data;
    var teams = ['blue', 'red'];
    var teamElements = {
      blue: document.getElementById('blue-team'),
      red: document.getElementById('red-team')
    }
    teamElements['blue'].innerHTML = teamElements['red'].innerHTML = '';

    for(var team in teams) {
      team = teams[team];
      for (var i = 0; i < 3; i++) {
        var playerid = lobby.teams[team][i];

        var listElWrapper = document.createElement('li');
            listElWrapper.className = 'outsidediv';
        var listElName = document.createElement('div');
            listElName.className = 'lobby-element';

        if (playerid !== 'empty') {
          var host = '';
          if (playerid == lobby.host) {
            host = ' [host]';
          }

          listElName.setAttribute('player-id', playerid);
          listElName.appendChild( document.createTextNode(
            findSocket(playerid).name + host
          ));
        } else {
          listElName.setAttribute('lobby-id', lobby.id);
          listElName.setAttribute('team', team);
          listElName.setAttribute('slot', i);
          listElName.appendChild( 
            document.createTextNode( 
              i+1 + ' Click to take this spot' 
          ));
          listElName.onclick = function(e) {
            socket.emit('lobbyTakeSpot',
              e.target.getAttribute('lobby-id'),
              e.target.getAttribute('team'),
              e.target.getAttribute('slot'));
          }
        }
        if (lobby.host == mySocketID) {
          gameLobbyButtonStartEl.style.visibility = 'visible';
        } else {
          gameLobbyButtonStartEl.style.visibility = 'hidden';
        }

        listElWrapper.appendChild(listElName);
        teamElements[team].appendChild(listElWrapper);

      }
    }  

  }

  function printLobbies(lobbies) {
    
    lobbiesEl.innerHTML = '';

    for (var i = lobbies.length - 1; i >= 0; i--) {
      var lobby = lobbies[i];

      var listElWrapper = document.createElement('li');
          listElWrapper.className = 'outsidediv';
      var listElName = document.createElement('div');
          listElName.className = 'lobby-element';
          listElName.setAttribute('lobby-id', lobby.id);
          listElName.appendChild( document.createTextNode(lobby.name) );

      listElWrapper.appendChild(listElName);
      lobbiesEl.appendChild(listElWrapper);

      listElName.onclick = function(e) {
        socket.emit('joinLobby', e.target.getAttribute('lobby-id'));
      }
    }
  }

  nameEntryButtonEl.onclick = function(){
    setName(); //stage change backend
  };

  gamesListButtonCreateEl.onclick = function(){
    socket.emit('createLobby');
  };

  gameLobbyButtonLeaveEl.onclick = function(){
    //leaveLobby();
    socket.emit('lobbyLeave');
  };

  gameLobbyButtonStartEl.onclick = function(){
    socket.emit('startGame');
  };




  
  socket.on('kill', function (data) {
    var byName = findPlayer(data.by).name;
    var victimName = findPlayer(data.victim).name;

    //TODO MESSAGE BLABLA KILLED WAWA WITH EE
  });

  socket.on('roster', function (tempPlayers) {
    while(usersEl.firstChild){
      usersEl.removeChild(usersEl.firstChild);
    }
    for(i=0; i<tempPlayers.length; i++) {
      var rosterName = document.createElement('li');
      rosterName.className = 'user';
      rosterName.appendChild( document.createTextNode( tempPlayers[i].name + ' - kills: ' + tempPlayers[i].kills + '. deaths: ' + tempPlayers[i].deaths) );
      usersEl.appendChild(rosterName);
    }
    sockets = tempPlayers;
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
  
  chatEl.onsubmit = function(event){
    event.preventDefault();
    var message = messageEl.value;
    socket.emit('message', message);
    messageEl.value = '';
  };  
  

