function createEditableSpan(text, id, cls, index){
  return `<span class="${cls}" id="${id}" data-text="${text}" data-index="${index || -1}">${text}</span>`;
}

function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function createSettingsTableStr(index, img, name, nameID){
  return `<td>${name ? createEditableSpan(name, nameID, 'editable') : ''}</td><td><img data-id="${index}" class="file-target icon" src="${img}"</img></td>`;
}

function fillQuestionsForm(arr, tb){
  for (let i = 0; i < arr.length; i++) {
    // str += `<tr><td>${createEditableSpan(arr[i].text, 'text-' + i, 'task', i)}</td><td>bomb<input type="checkbox" data-index="${i}" checked="${arr[i].bomb}"></input></td></tr>`;
    let row = document.createElement('tr');
    row.innerHTML = `<td>${createEditableSpan(arr[i].text, 'text-' + i, 'task', i)}</td>`;
    let td = document.createElement('td');
    td.innerHTML = 'bomb';
    let input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('data-index', i);
    input.checked = arr[i].bomb;

    td.appendChild(input);
    row.appendChild(td);
    tb.appendChild(row);
  }
}

function updatePics(){
  let tb = getByID('settings-table');
  tb.innerHTML = '';
  
  tb.innerHTML += '<tr><td>team 1 :</td></tr>';
  tb.innerHTML += '<tr>' + createSettingsTableStr('t1Pic', config['t1Pic'], config['team1'], 'team1') + '</tr>';
  tb.innerHTML += '<tr><td>team 2 :</td></tr>';
  tb.innerHTML += '<tr>' + createSettingsTableStr('t2Pic', config['t2Pic'], config['team2'], 'team2') + '</tr>';
  tb.innerHTML += '<tr><td>рубашка  :</td></tr>';
  tb.innerHTML += '<tr>' + createSettingsTableStr('qPic', config['qPic']) + '</tr>';
  tb.innerHTML += '<tr><td>в процессе  :</td></tr>';
  tb.innerHTML += '<tr>' + createSettingsTableStr('pending', config['pending']) + '</tr>';
  tb.innerHTML += '<tr><td>бомба  :</td></tr>';
  tb.innerHTML += '<tr>' + createSettingsTableStr('bomb', config['bomb']) + '</tr>';
  tb.innerHTML += '<tr><td>успех  :</td></tr>';
  tb.innerHTML += '<tr>' + createSettingsTableStr('ok', config['ok']) + '</tr>';
  tb.innerHTML += '<tr><td>провал  :</td></tr>';
  tb.innerHTML += '<tr>' + createSettingsTableStr('no', config['no']) + '</tr>';
  
  tb.innerHTML += '<tr><td>задания  :</td></tr>';
  // tb.innerHTML += fillQuestionsForm(config.questions);
  fillQuestionsForm(config.questions, tb);
  

  getQueryArray('.editable').forEach((span) => {
    makeEditableSpan(span);
  });

  getQueryArray('.task').forEach((span) => {
    makeEditableTask(span);
  });

  getQueryArray('checkbox').forEach((box) => {
    box.onclick = function(e){
      config.questions[this.getAttribute('data-index')].bomb = this.checked;
    }
  });

  getQueryArray('.file-target').forEach((holder) => {
    holder.ondragover = function () { /*this.className = 'hover'*/; return false; };
    holder.ondragend = function () { /*this.className = ''*/; return false; };
    holder.ondrop = function (e) {
      this.className = '';
      e.stopPropagation();
      e.preventDefault();

      let id = this.getAttribute('data-id');

      var file = e.dataTransfer.files[0],
          reader = new FileReader();
      reader.onload = function (event) {
        config[id] = event.target.result;
        console.log(event.target.result);
        updatePics();
      };
      reader.readAsDataURL(file);
      return false;
    };
  });
}

function makeEditableSpan(span){
  span.onclick = function(evt){
    if(this.innerHTML == this.getAttribute('data-text')){
      let inp = document.createElement('input');
      inp.value = this.getAttribute('data-text');
      let prev = this.getAttribute('data-text');
      this.innerHTML = '';
      this.appendChild(inp);
      evt.stopImmediatePropagation();

      document.onclick = function(){
        document.onclick = null;
        config[inp.parentNode.getAttribute('id')] = inp.value || prev;
        updatePics();
      }//.bind(this);

      inp.onclick = function(e){
        e.stopImmediatePropagation();
      }
      inp.onkeyup = function(e){
        if(e.keyCode == 13){
          config[this.parentNode.getAttribute('id')] = this.value || prev;
          updatePics();
        }
      }
    }
  }
}

function makeEditableTask(span){
  span.onclick = function(evt){
    if(this.innerHTML == this.getAttribute('data-text')){
      let inp = document.createElement('input');
      inp.value = this.getAttribute('data-text');
      let prev = this.getAttribute('data-text');
      let index = this.getAttribute('data-index');
      this.innerHTML = '';
      this.appendChild(inp);
      evt.stopImmediatePropagation();

      document.onclick = function(){
        document.onclick = null;
        config.questions[index].text = inp.value || prev;
        updatePics();
      }//.bind(this);

      inp.onclick = function(e){
        e.stopImmediatePropagation();
      }
      inp.onkeyup = function(e){
        if(e.keyCode == 13){
          config.questions[index].text = this.value || prev;
          updatePics();
        }
      }
    }
  }
}




updatePics();

var state = getByID('status');

if (typeof window.FileReader === 'undefined') {
  // state.className = 'fail';
} else {
  // state.className = 'success';
  state.innerHTML = 'Перетащите фотки в квадраты';
}


getByID('save-pics').onclick = function(){
  download(tpl.split('%JSON%').join(JSON.stringify(config)), 'Game_' + Date.now() + '.html', '.html');
}

var tpl = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset=utf-8 />
<meta name="viewport" content="width=620" />
<title>Веселые Фанты</title>
</head>
<body>
<header>
      <h3>Имя заказчика</h3>
</header>
<style>
   .icon {
    width: calc(100vh * 0.08); 
    height: calc(100vh * 0.08);  
  }
  .pic {
    width: calc(100vh * 0.15);
    height: calc(100vh * 0.15); 
  }
  #field {
    width: calc(100vh * 0.7);
    height: calc(100vh * 0.7); 
  }
  tr, td{
    border: 1px solid black;
  }
  
  .file-target { 
    border: 3px dashed #ccc;
  }
  #team1, #team2{
    display: inline;
  }
  
  #holder.hover { border: 10px dashed #333; }
</style>

<div id="start">
  <h4 id="status">Этот браузер сломался, откройте меня лучше в хроме</h4>
  <h5 id="team1"></h5>
  <h5 id="team2"></h5><br>
  <button id="changeState">play</button>
  <table id="outer-table">
    <tr>
      <td><table id="field"></table></td>
      <td>
        <div id="questionData"></div>
        <div id="buttons"><button id="passed">Смогли</button><button id="failed">Провалили</button></div>
      </td>
    </tr>
  </table>
</div>
<scri` + `pt type="text/javascript">
  //settings go here
  var settings = '%JSON%';
</scr` + `ipt>

<scr` + `ipt type="text/javascript">
  //commons
Array.prototype.randIndex = function(){
  return Math.floor(Math.random() * this.length);
}
Array.prototype.shuffle = function(){
  var copy = this.slice();
  this.splice(0);
  while (copy.length) {
    var ind = copy.randIndex();
    this.push(copy[ind]);
    copy.splice(ind, 1);
  }
}
var config = JSON.parse(settings);

function getByID(id, pNode){
  return document.getElementById(id);
}
function getQuery(qs, pNode){
  pNode = pNode || document;
  return pNode.querySelectorAll(qs);
}

function getQueryArray(qs, pNode){
  return Array.prototype.slice.call(getQuery(qs, pNode));
}

HTMLElement.prototype.show = function(isInline){
  this.style.display = isInline ? 'inline' : 'block';
}
HTMLElement.prototype.hide = function(){
  this.style.display = 'none';
}

</scr` + `ipt>

<scr` + `ipt type="text/javascript">
  //logic
  var state = 'intro';
  var statusStr = getByID('status');
  var changeState = getByID('changeState');
  var field = getByID('field');
  var questionData = getByID('questionData');
  
  var pending = [];
  var turnOwner = 1;
  var current = null;
  var played = 0;

  var team1Score = 0;
  var team2Score = 0;
  
  function updateScores(d1, d2){
    team1Score += d1 || 0;
    team2Score += d2 || 0;
    getByID('team1').innerHTML = \`\${config.team1} - \${team1Score}\`;
    getByID('team2').innerHTML = \`\${config.team2} - \${team2Score}\`;
  }

  function applyScoreAndPassTurn(score, success, isBomb){
    let ds1 = turnOwner == 1 ? (success ? (isBomb ? 0 : score) : (isBomb ? -score : 0)) : 0;
    let ds2 = turnOwner == 2 ? (success ? (isBomb ? 0 : score) : (isBomb ? -score : 0)) : 0;
    updateScores(ds1, ds2);
    
    getByID('img-' + current.index).setAttribute('src', success ? config.ok : config.no);
    current = null;
    turnOwner = turnOwner == 1 ? 2 : 1;
    statusStr.innerHTML = 'GO, team ' + (turnOwner == 1 ? config.team1 : config.team2);
    getByID('buttons').hide();
  }

  function fillGameField(){
    field.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      let tr = document.createElement('tr');
      for (let j = 0; j < 5; j++) {
        tr.innerHTML += \`<td class="table-entry" data-state="closed" data-index="\${i * 5 + j}"><img class="icon" id="img-\${i * 5 + j}" src="\${config.qPic}"></td>\`;
      }
      field.appendChild(tr);
    }
    getQueryArray('.table-entry').forEach((item) => {
      item.onclick = function(e){
        if(this.getAttribute('data-state') == 'closed' && !current){
          let index = this.getAttribute('data-index');
          current = pending[index];
          current.index = index;
          this.setAttribute('data-state', 'opened');
          getByID('img-' + index).setAttribute('src', current.bomb ? config.bomb : config.pending);
          questionData.innerHTML = 'Задание:<br>' + current.text + ', награда ' + current.score;
          ++played;
          getByID('buttons').show();
        }
      }
    });
  }
  
  function changeStateHandler(){
    if(state == 'intro'){//to game
      state = 'game';
      pending = config.questions.slice();
      getByID('outer-table').show();
      getByID('buttons').hide();
      pending.shuffle();
      played = 0;
      updateScores(-team1Score, -team2Score);
      changeState.innerHTML = 'reset';
      statusStr.innerHTML = 'GO, team ' + (turnOwner == 1 ? config.team1 : config.team2);
      fillGameField();
    }else if(state == 'game' && pending.length == played){//reset
      state = 'intro';
      changeState.innerHTML = 'play';
      statusStr.innerHTML = 'Welcome!';
      questionData.innerHTML = '';
      getByID('outer-table').hide();
      current = null;
      played = 0;
    }else if(state == 'game'){//restart
      state = 'intro';
      changeState.innerHTML = 'play';
      statusStr.innerHTML = 'Welcome!';
      questionData.innerHTML = '';
      getByID('outer-table').hide();
      current = null;
      played = 0;
      

    }
  }

  changeState.addEventListener('click', changeStateHandler);
  getByID('passed').addEventListener('click', function(){
    if(current && state == 'game'){
      applyScoreAndPassTurn(current.score, true, current.bomb);
    }
  });
  getByID('failed').addEventListener('click', function(){
    if(current && state == 'game'){
      applyScoreAndPassTurn(current.score, false, current.bomb);
    }
  });
  
  statusStr.innerHTML = 'Welcome!';
  getByID('outer-table').hide();
  getByID('buttons').hide();
  updateScores();
</scr` + `ipt>

</body>
</html>`;