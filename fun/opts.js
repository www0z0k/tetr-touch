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
  download(tpl.split('%JSON%').join(JSON.stringify(config)), Date.now() + '.html', '.html');
}

