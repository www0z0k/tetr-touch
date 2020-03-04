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

var state = 'start';
var allStates = ['start', 'settings', 'play'];

function setState(val){
  if(allStates.indexOf(val) == -1) return;
  state = val;
  for (var i = 0; i < allStates.length; i++) {
    getByID(allStates[i]).style.display = allStates[i] == state ? 'block' : 'none';
  }
}

for (var i = 0; i < allStates.length; i++) {
  getQueryArray('.to-' + allStates[i]).forEach((el) => {
    let st = allStates[i];
    el.addEventListener('click', () => { setState(st); });
  });
}

setState('start');