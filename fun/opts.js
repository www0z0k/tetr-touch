function createSettingsTableStr(caption, index, img){
  return `<span>${caption}<img data-id="${index}" class="file-target icon" src="${img}"</img></span><br>`;
}

function updatePics(){
  let tb = getByID('settings-table');
  tb.innerHTML = '';
  
  tb.innerHTML += createSettingsTableStr('team 1', 't1Pic', config['t1Pic']);
  tb.innerHTML += createSettingsTableStr('team 2', 't2Pic', config['t2Pic']);
  tb.innerHTML += createSettingsTableStr('рубашка', 'qPic', config['qPic']);
  

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
        setPics[id] = event.target.result;
        console.log(event.target.result);
        updatePics();
      };
      reader.readAsDataURL(file);
      return false;
    };
  });
}

updatePics();

var state = getByID('status');

if (typeof window.FileReader === 'undefined') {
  // state.className = 'fail';
} else {
  // state.className = 'success';
  state.innerHTML = 'Перетащите фотки в квадраты';
}
