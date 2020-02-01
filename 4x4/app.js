var field = getByID('field');

var shuffle = getByID('shuffle');
var hide = getByID('hide');
var reset = getByID('reset');

var items = [];
var hidden = false;
var clickedSrc = '';
var clickedID = '';

function restart(){
	hidden = false;
	shuffle.style.display = 'inline';
	hide.style.display = 'inline';

	clickedID = clicked = '';

	drawTable();
}

function drawTable(){
	items = setPics.slice().concat(setPics.slice());
	items.shuffle();
	field.innerHTML = '';
	for(var i = 0; i < 4; i++){
		var elstr = '<tr>';
		for(var j = 0; j < 4; j++){
			elstr += `<td><img class="pic" src="${items[i * 4 + j]}" id="${i}-${j}" data-id="${items[i * 4 + j]}" onclick="picClicked(this);"></td>`;
		}	
		elstr += '</tr>';
		field.innerHTML += elstr;
	}	
}

function picClicked(el){
	if(!hidden)return;

	var src = el.getAttribute('data-id');
	var index = el.getAttribute('id');

	if(!clickedSrc){//new one - reveal
		el.setAttribute('src', src);
		clickedSrc = src;
		clickedID = index;
	}else{
		if(src == clickedSrc){
			if(index != clickedID){//guessed
				clickedSrc = '';
				clickedID = '';
				el.setAttribute('src', src);
			}else{//same pic

			}
		}else{//wrong pic
			let other = getByID(clickedID);

			clickedSrc = '';
			clickedID = '';
			
			el.setAttribute('src', error);
			other.setAttribute('src', error);
			window.setTimeout(() => {
				el.setAttribute('src', question);
				other.setAttribute('src', question);
			}, 220);
		}
	}
}



reset.addEventListener('click', () => { restart(); });

getQueryArray('.to-play').forEach((el) => {
  el.addEventListener('click', () => { restart(); });
});

shuffle.addEventListener('click', () => {
	if(hidden)return;
	drawTable();
});

hide.addEventListener('click', () => {
	hidden = true;
	shuffle.style.display = 'none';
	hide.style.display = 'none';

	getQueryArray('.pic', field).forEach((el) => {
		el.setAttribute('src', question);
	});
});