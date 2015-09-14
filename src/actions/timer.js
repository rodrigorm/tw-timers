export const ADD_TIMER = 'ADD_TIMER';
export const REMOVER_TIMER = 'REMOVER_TIMER';


export function add(id, description, date) {
  return {
    type: ADD_TIMER,
    id: id,
    description: description,
    date: date
  };
}


export function remove(id) {
  return {
    type: REMOVER_TIMER,
    id: id
  };
}

function request(url, callback) {
  var r = new XMLHttpRequest();
  r.open('GET', url, true);
  r.onreadystatechange = () => {
    if (r.readyState !== 4) {
      return;
    }

    if (r.status !== 200) {
      callback(new Error('Invalid response: (' + r.status + ') ' + r.responseText));
      return;
    }

    callback(null, r.responseText);
  };

  r.send('');
}

function parseDate(str) {
  var date = new Date();
  var match = /(hoje|amanhã|\d{2}\/\d{2})\s+às\s+(\d{2}:\d{2}(:\d{2})?)/.exec(str);

  if (!match) return null;

  switch (match[1]) {
  case 'hoje':
    break;

  case 'amanhã':
    date.setDate(date.getDate() + 1);
    break;

  default:
    var dateParts = match[1].split('/', 2);
    date.setDate(parseInt(dateParts[0], 10));
    date.setMonth(parseInt(dateParts[1], 10) - 1);
  }

  var timeParts = match[2].split(':', 3);
  date.setHours(parseInt(timeParts[0], 10));
  date.setMinutes(parseInt(timeParts[1], 10));
  date.setSeconds(timeParts[2] ? parseInt(timeParts[2], 10) : 0);

  return date;
}

function updateMain(dispatch) {
  request('https://br70.tribalwars.com.br/game.php?village=37400&screen=main', (err, responseText) => {
    if (err) return;

    var match = /BuildingMain\.buildings\s+=\s+({.*});/.exec(responseText);
    var buildings = eval('(' + match[1] + ')');

    var doc = document.implementation.createHTMLDocument('example');
    doc.documentElement.innerHTML = responseText;

    for (var i in buildings) {
      var building = buildings[i];

      var buildorderEls = doc.querySelectorAll('.buildorder_' + i);

      for (var j in [].slice.call(buildorderEls)) {
        var buildorderEl = buildorderEls[j];
        var itemEls = [].slice.call(buildorderEl.querySelectorAll('.lit-item'));
        var id = /id=(\d+)/.exec(itemEls[4].innerHTML)[1];
        var description = itemEls[0].innerText;
        var date = parseDate(itemEls[3].innerText);
        dispatch(add(id, description, date));
      }

      if (parseInt(building.level, 10) === building.max_level) continue;

      var id = i + '_next';
      var description = building.name + ' Nível ' + building.level_next;
      var date = building.error ? parseDate(building.error) : null;
      dispatch(add(id, description, date));
    }
  });
}

function updateEventAssault(dispatch) {
  request('https://br70.tribalwars.com.br/game.php?village=37400&screen=event_assault', (err, responseText) => {
    if (err) return;

    var match = /EventAssault\.init\(({.*})\);/.exec(responseText);
    var event = eval('([' + match[1] + '])');
    var descriptions = {
      assault: 'Assalto ao Castelo (Assalto)',
      catapult: 'Assalto ao Castelo (Bombardeamento)',
      naval: 'Assalto ao Castelo (Apoio Naval)'
    };

    var now = new Date();
    var energy = event[1].energy;
    var rawEnergy = Math.min(energy.max, energy.current + ((now.getTime() / 1000) - energy.last) / energy.interval);
    var nextEnergy = energy.interval * (1 - (rawEnergy % 1)) + 1;
    var dateEnergy = rawEnergy >= 1.0 ? null : new Date(now.getTime()  + (nextEnergy * 1000));

    for (var i in event[1].last_reinforce) {
      var time = event[1].last_reinforce[i];
      var cooldown = time + (event[0].areas[i].cooldown * 60);
      var date = new Date(cooldown * 1000);
      dispatch(add('event_assault_' + i, descriptions[i], date <= now ? dateEnergy : date));
    }
  });
}

export function update() {
  return dispatch => {
    updateMain(dispatch);
    updateEventAssault(dispatch);
  };
}