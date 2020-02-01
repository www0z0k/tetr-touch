function createSettingsTableStr(index, img){
  return `<span>Фото ${index + 1}<img data-id="${index}" class="file-target icon" src="${img}"</img></span><br>`;
}

function updatePics(){
  let tb = getByID('settings-table');
  tb.innerHTML = '';
  for (var i = 0; i < setPics.length; i++) {
    tb.innerHTML += createSettingsTableStr(i, setPics[i]);
  }
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
