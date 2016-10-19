var curtain = document.getElementById("menu-container");
var startMenu = document.getElementById("start-menu");
var endDialog = document.getElementById("end-game");
var select = document.getElementById("select-size");
var toggleXO = sessionStorage.getItem("toggleXO") ? +sessionStorage.getItem("toggleXO") : 0;
var winStreak = sessionStorage.getItem("winStreak") ? sessionStorage.getItem("winStreak") : 3;
var winState;
var winShift = winStreak-1;
var tableSize;
var body = document.body;
var table;
var XOcounter = sessionStorage.getItem("XOcounter") ? +sessionStorage.getItem("XOcounter") : 0;

var compEnable = 0;

//__________________________
var canvas = document.createElement("canvas");
var canvasEnabled;
var c = canvas.getContext("2d");
canvas.getContext("2d") ? canvasEnabled = 0 : canvasEnabled = 0;
//__________________________

document.addEventListener("keydown",showPanel);
setup();
var compMove = 0;
var fMove;
var compRow;
var compCell;
function computer(compTarget, firstMove)
{
	compMove = 0;
	var c = {};
	//e.target = table.rows[compTarget.row].cells[compTarget.cell];
	c.currentTarget = table;

	if (firstMove == 0)
	{
		do{c.target = table.rows[randomField()].cells[randomField()];}
		while(c.target.className)
		fMove = c.target;
		compRow = fMove.parentNode.rowIndex;
		compCell = fMove.cellIndex;
	}

	console.log("row + cell comp: " + compRow + " " + compCell);

	compCell++;
	c.target = table.rows[compRow].cells[compCell];
	console.log("compTarget" + c.target);
	addXOelem(c);
}



function randomField()
{
	var min = 0;
	var max = tableSize - 1;
	return min + Math.floor(Math.random() * (max + 1 - min));
}

/*
function getCompMove(c)
{
	
}
*/



function setup(state)
{
	if(state == 'new')
	{
		wipeData();
		table.parentNode.removeChild(table);
		XOcounter = toggleXO = winState = 0;
		startMenu.style.display = "inline-block";
		endDialog.style.display = "none";
	}else if(state == 'continue')
	{
		var temp = tableSize;
		table.parentNode.removeChild(table);
		wipeData();
		sessionStorage.setItem("tableSize", temp);
		XOcounter = toggleXO = winState = 0;
	}

	curtain.style.display = "block";
	document.getElementsByClassName('winStreak')[0].onclick = function(e) {
		if(e.target.value)
		{
			if (e.target.value == winStreak) return;
			if (e.target.value == 5)
			{
				select.options[0] = null;
			}else{
				var option = new Option("3 x 3", "3");
				select.insertBefore(option, select.options[0]);
			}
			winStreak = e.target.value;
			sessionStorage.setItem("winStreak", winStreak);
		}
	};

	if (sessionStorage.getItem("tableSize"))
	{
		tableSize = +sessionStorage.getItem("tableSize");
		toggleXO = +sessionStorage.getItem("toggleXO");
		curtain.style.display = "none";
		createTable();
		return;
	}
	if (state == 'begin')
	{
		tableSize = +select.value;
		sessionStorage.setItem("tableSize", tableSize);
		curtain.style.display = "none";
		createTable();
	}
}

function showPanel(e)
{
	if (e.ctrlKey)
	{
		var panel = document.getElementById("panel");
		if(panel.style.top == "0px")
		{
			panel.style.top = "-50px";
		}else{
			panel.style.top = "0px";
		}
	}

}
function wipeData()
{
	sessionStorage.clear();
	console.log("___________________ALL CLEAR, sir!___________________");
}

function saveElement(e)
{
	var row = e.target.parentNode.rowIndex;
	var cell = e.target.cellIndex;
	var value = e.target.className;
	sessionStorage.setItem(row+'class'+cell, value);
}



function createTable()
{
	table = document.createElement("table");
	table.className = "XOtable";
	table.classList = sessionStorage.getItem("tableClassList") ? sessionStorage.getItem("tableClassList") : table.classList;
	document.getElementById("field-container").appendChild(table);
	table.addEventListener("mousedown", addXOelem);
	table.ondragstart = function(){return false};
	table.style.borderCollapse = "collapse";

	for ( var i = 0; i < tableSize; i++)
	{
		var tr = document.createElement("tr");

		for ( var j = 0; j < tableSize; j++)
		{
			var td = document.createElement("td");
			tr.appendChild(td);

			if (sessionStorage.getItem(i+'class'+j))
			{
				var xoElem = document.createElement("span");
				xoElem.className = "xoElem";
				xoElem.className = td.className = sessionStorage.getItem(i+'class'+j);
				if (canvasEnabled)
				{
					td.className = sessionStorage.getItem(i+'class'+j);
				}else{
					xoElem.innerHTML = sessionStorage.getItem(i+'class'+j);
					td.appendChild(xoElem);
				}
			}
		}
		table.appendChild(tr);
	}

	if ( canvasEnabled )
	{
		table.style.width =  25 * tableSize + "px";
		table.style.height = 25 * tableSize + "px";

		canvasDrawTable(table);
		getElementsForCanvas();

	}else{
		table.style.width = 25 * tableSize + (tableSize+1) + "px";
		table.style.height = 25 * tableSize + (tableSize+1) + "px";
		canvasOFF();
	}
}



function canvasOFF()
{
	var cells = document.getElementsByTagName("td");
	for ( var i = 0; i < cells.length; i++)
	{
		cells[i].style.borderWidth = "1px";
	}
}

function addXOelem(e)
{
	if(e.button == 2)
	{
		return false;
	}

	var target = e.target;

	//console.log("xotarget: " + e.target);

	if(target == e.currentTarget || !!target.className ) return;
	target.innerHTML = "";
	var xoElem = document.createElement("span");
	xoElem.className = "xoElem";

	if ( toggleXO )
	{
		xoElem.classList.add("O");
		target.className = "O";
		if (canvasEnabled)
		{
			canvasDrawO(e);
		}else{
			xoElem.innerHTML="O";
		}
		saveElement(e);
		toggleXO = 0;
		sessionStorage.setItem("toggleXO", toggleXO);
		table.classList.toggle('showO');
	}else{
		xoElem.classList.add("X");
		target.className = "X";
		if (canvasEnabled)
		{
			canvasDrawX(e);
		}else{
			xoElem.innerHTML="X";
		}
		saveElement(e);
		toggleXO = 1;
		sessionStorage.setItem("toggleXO", toggleXO);
		table.classList.toggle('showO');
		if (compEnable)	compMove = 1;
	}
	target.appendChild(xoElem);
	checkWin(e);
	XOcounter++;
	sessionStorage.setItem("XOcounter", XOcounter);
	sessionStorage.setItem("tableClassList", table.classList);
	console.log("Moves counter: " + XOcounter);
	if (XOcounter == tableSize*tableSize)
	{
		XOcounter = 0;
		wipeData();
		showWin('draw');
	}
}

function showWin(value)
{
	var endMessage = document.getElementById("end-message");
	startMenu.style.display = "none";
	curtain.style.display = "block";
	endDialog.style.display = "inline-block";
	endMessage.className = value +"win";
	endDialog.appendChild(endMessage);
	wipeData();
	XOcounter = toggleXO = winState = 0;
}

function getCoords(elem) {
	var box = elem.getBoundingClientRect();
	return {
		top: box.top + pageYOffset,
		left: box.left + pageXOffset
	};
}


function checkWin(e)
{
	if (winState) return;
	var row = e.target.parentNode.rowIndex;
	var cell = e.target.cellIndex;
	var value = e.target.className;
	var rows = e.currentTarget.rows.length-1;
	var cells = e.currentTarget.rows[0].cells.length-1;
	var winRoute = winStreak*2-2;
	var winArr=[];
	var coordsTop = getCoordsTopLeft(row, cell, winShift);
	var coordsBottom = getCoordsBottomLeft(row, cell, winShift);

	checkCross(row, cell, value);
	checkTopLeft(value, coordsTop);
	checkBottomLeft(value, coordsBottom);

	function getCoordsTopLeft(row, cell, n)
	{

		if (row-1 < 0 || cell-1 < 0 || n==0) {
			return  {row: row, cell: cell};
		}else{
			var result = getCoordsTopLeft(row-1, cell-1, n-1);
		}
		return result;

	}
	function getCoordsBottomLeft(row, cell, n)
	{
		if (row+1 > rows || cell-1 < 0 || n==0) {
			return  {row: row, cell: cell};
		}else{
			var result = getCoordsBottomLeft(row+1, cell-1, n-1);
		}
		return result;

	}

	function checkTopLeft(value, coordsTop)
	{
		if ( winArr.length == winStreak ) return;

		for (var i = 0; i <= winRoute; i++) {
			if ( coordsTop.row > rows || coordsTop.cell > cells ) break;

			if (e.currentTarget.rows[coordsTop.row++].cells[coordsTop.cell++].className == value)
			{
				winArr.push("test");
			}else{
				winArr = [];
			}
			if ( winArr.length == winStreak )
			{
				showWin(value);
				return;
			}

		}
		winArr = [];
	}

	function checkBottomLeft(value, coordsBottom)
	{
		if ( winArr.length == winStreak ) return;

		for (var i = 0; i <= winRoute; i++) {

			if ( coordsBottom.row < 0 || coordsBottom.cell > cells ) break;

			if (e.currentTarget.rows[coordsBottom.row--].cells[coordsBottom.cell++].className == value)
			{
				winArr.push("test");
			}else{
				winArr = [];
			}
			if ( winArr.length == winStreak )
			{
				showWin(value);
				return;
			}

		}
		winArr = [];
	}

	function checkCross(row, cell, value, how)
	{

		if (how){
			var rowStart =  row-4 < 0 ? 0 : row-4;
			var rowEnd = row+4 > rows ? rows : row+4;
			var cellStart = cellEnd = cell;
		}else{
			cellStart = cell-4 < 0 ? 0 : cell-4;
			var cellEnd = cell+4 > cells ? cells : cell+4;
			rowStart = rowEnd = row;
		}

		for ( var i = rowStart; i <= rowEnd; i++)
		{
			for ( var j = cellStart; j <= cellEnd; j++ )
			{
				if ( e.currentTarget.rows[i].cells[j].className == value )
				{
					winArr.push("test");
				}else{
					winArr = [];
				}
				if ( winArr.length == winStreak )
				{
					showWin(value);
					return;
				}
			}
		}
		winArr = [];
		if (!how) checkCross(row, cell, value, "vertical");
	}



	if (compMove && winArr.length < winStreak)
	{
		var compTarget = {};
		compTarget.row = row;
		compTarget.cell = ++cell;
		computer(compTarget, XOcounter);
	}

}



//___________________________________________________________
//_________________________CANVAS____________________________
//___________________________________________________________



function getElementsForCanvas()
{
	for ( var i = 0; i < tableSize; i++)
	{
		for (var j = 0; j < tableSize; j++)
		{
			var e = {};
			e.target = table.rows[i].cells[j];
			e.currentTarget = table;
			if (table.rows[i].cells[j].className == "X")
			{
				canvasDrawX(e);
			}else if(table.rows[i].cells[j].className == "O"){
				canvasDrawO(e);
			}
		}
	}
}

function canvasDrawTable(table)
{
	body.appendChild(canvas);
	canvas.id = "canvasXOtable";
	var cells = document.getElementsByTagName("td");

	for ( var i = 0; i < tableSize; i++)
	{
		cells[i].style.borderWidth = "0px";
	}

	var tableW = tableSize * 25;
	var tableH = tableSize * 25;
	var tableCoords = getCoords(table);
	canvas.width = tableW;
	canvas.height = tableH;
	canvas.style.top = tableCoords.top + "px";
	canvas.style.left = tableCoords.left + "px";
	c.fillStyle = "#FAFAFA";
	c.fillRect(0,0,tableW,tableH);

	c.strokeStyle = "lightgrey";

	for ( i = 25; i < tableW; i+=25)
	{
		c.beginPath();
		c.moveTo(i,0);
		c.lineTo(i,tableH);
		c.stroke();
	}

	for ( i = 25; i < tableH; i+=25)
	{
		c.beginPath();
		c.moveTo(0,i);
		c.lineTo(tableW,i);
		c.stroke();
	}
}


function canvasDrawO(e)
{
	var coords = getCoords(e.target);
	var tableCoords = getCoords(e.currentTarget);
	var lineLength = e.target.offsetWidth - 10;
	coords.left = coords.left - tableCoords.left + lineLength - 2;
	coords.top = coords.top - tableCoords.top + lineLength - 2;
	c.lineWidth = 3;

	//without animation
	//_________________
	/*
	 c.beginPath();
	 c.arc( coords.left, coords.top, lineLength/2, 0, Math.PI*2, false);
	 c.stroke();
	*/

	//with animation
	//_________________

	var step = 6;
	var interval = setInterval(function(){
		step--;
		c.beginPath();
		c.strokeStyle = "#2EB821";
		c.arc( coords.left, coords.top, lineLength/2, step, Math.PI*2, false);
		c.stroke();
		if (!step)
		{
			clearInterval(interval);
		}

	}, 30)
}

function canvasDrawX(e)
{
	var coords = getCoords(e.target);
	var tableCoords = getCoords(e.currentTarget);
	var lineLength = e.target.offsetWidth - 10;
	coords.left = coords.left - tableCoords.left + 5;
	coords.top = coords.top - tableCoords.top + 5;

	c.lineWidth = 3;
	var step = 0;
	var step2 = lineLength;

	//without animation
	//________________
	/*
	 c.beginPath();
	 c.moveTo(coords.left,coords.top);
	 c.lineTo(lineLength+coords.left,lineLength+coords.top);
	 c.stroke();
	 c.beginPath();
	 c.moveTo(lineLength+coords.left,coords.top);
	 c.lineTo(coords.left,coords.top+lineLength);
	 c.stroke();
	*/


	//with animation
	//________________

	var xObject = {};
	xObject.firstLine = function()
	{
		var interval = setInterval(function(){
			step++;
			c.beginPath();
			c.strokeStyle = "#F56607";
			c.moveTo(coords.left,coords.top);
			c.lineTo(step+coords.left,step+coords.top);
			c.stroke();

			if (step == lineLength)
			{
				step = 0;
				xObject.secondLine();
				clearInterval(interval);
			}

		}, 3)
	};

	xObject.secondLine = function()
	{
		var interval = setInterval(function(){
			step++;
			step2--;
			c.beginPath();
			c.strokeStyle = "#F56607";
			c.moveTo(lineLength+coords.left,coords.top);
			c.lineTo(step2+coords.left,step+coords.top);
			c.stroke();

			if (step == lineLength)
			{
				step = 0;
				clearInterval(interval);
			}
		}, 3)
	};
	xObject.firstLine();
}