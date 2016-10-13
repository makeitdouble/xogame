var curtain = document.getElementById("menu-container");
var startMenu = document.getElementById("start-menu");
var endDialog = document.getElementById("end-game");
var select = document.getElementById("select-size");
var toggleXO = localStorage.getItem("toggleXO") ? +localStorage.getItem("toggleXO") : 0;
var currentElem = null;
var winStreak = 3;
var winState;
var winShift = winStreak-1;
var tableSize;
var body = document.body;
var table;
var XOcounter = localStorage.getItem("XOcounter") ? +localStorage.getItem("XOcounter") : 0;
var canvas = document.createElement("canvas");
var canvasTest;
var c = canvas.getContext("2d");
canvas.getContext("2d") ? canvasTest = 0 : canvasTest = 0;
document.addEventListener("keydown",showPanel);
setup();
//test

function setup(state)
{
	if(state == 'new')
	{
		wipeData();
		table.parentNode.removeChild(table);
		XOcounter = toggleXO = winState = 0;
		startMenu.style.display = "inline-block";
		endDialog.style.display = "none";
		//setup();
	}else if(state == 'continue')
	{
		var temp = tableSize;
		table.parentNode.removeChild(table);
		wipeData();
		localStorage.setItem("tableSize", temp);
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
		}
	};

	if (localStorage.getItem("tableSize"))
	{
		tableSize = +localStorage.getItem("tableSize");
		toggleXO = +localStorage.getItem("toggleXO");
		curtain.style.display = "none";
		createTable();
		return;
	}
	if (state == 'begin')
	{
		tableSize = +select.value;
		localStorage.setItem("tableSize", tableSize);
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
	localStorage.clear();
	console.log("CLEAR___________________");
}

function saveElement(e)
{
	var row = e.target.parentNode.rowIndex;
	var cell = e.target.cellIndex;
	var value = e.target.className;
	localStorage.setItem(row+'class'+cell, value);
}


function showXOelem(e)

{
	var target = e.target;
	if (target == this) return;
	while (target != this) {
		if (target.tagName == 'TD') break;
		target = target.parentNode;
	}
	if (target.className || target.innerHTML) return;

	currentElem = target;

	var xoElem = document.createElement("span");
	xoElem.className = "xoElem";
	if (toggleXO)
	{
		xoElem.classList.add("O");
		xoElem.innerHTML="O";
	}else{
		xoElem.classList.add("X");
		xoElem.innerHTML="X";
	}
	target.appendChild(xoElem);

}

function hideXOelem(e)
{

	var target = e.target;
	var relatedTarget = e.relatedTarget;
	if (target == this) return;

	if (relatedTarget) {
		while (relatedTarget) {
			if (relatedTarget == currentElem)
			{

				return;
			}
			relatedTarget = relatedTarget.parentNode;
		}
	}

	while (target != this) {
		if (target.tagName == 'TD') break;
		target = target.parentNode;
	}

	if (!target.className)	currentElem.innerHTML = "";

}


function clearTd(e)
{
	var target = e.target;
	while (target != this) {
		if (target.tagName == 'TD') break;
		target = target.parentNode;
	}
	if (target.className) return;
	target.innerHTML = "";
}

function createTable()
{
	table = document.createElement("table");
	table.className = "XOtable";
	body.appendChild(table);
	table.addEventListener("mouseup", addXOelem);
	table.addEventListener("mousedown", clearTd);
	table.addEventListener("mouseover", showXOelem);
	table.addEventListener("mouseout", hideXOelem);
	for ( var i = 0; i < tableSize; i++)
	{
		var tr = document.createElement("tr");

		for ( var j = 0; j < tableSize; j++)
		{
			var td = document.createElement("td");
			tr.appendChild(td);

			if (localStorage.getItem(i+'class'+j))
			{
				var xoElem = document.createElement("span");
				xoElem.className = "xoElem";
				xoElem.className = td.className = localStorage.getItem(i+'class'+j);
				if (canvasTest)
				{
					td.className = localStorage.getItem(i+'class'+j);
				}else{
					xoElem.innerHTML = localStorage.getItem(i+'class'+j);
					td.appendChild(xoElem);
				}
			}
		}
		table.appendChild(tr);
	}

	if ( canvasTest )
	{
		table.style.width =  25 * tableSize + "px";
		table.style.height = 25 * tableSize + "px";
		canvasDrawTable(table);
		getElementsForCanvas();
	}else{
		table.style.width = 25 * tableSize + (tableSize+3) + "px";
		table.style.height = 25 * tableSize + (tableSize+3) + "px";
		canvasOFF();
	}
}



function canvasOFF()
{
	var cells = document.getElementsByTagName("td");
	table.style.borderWidth = "2px";
	table.style.borderColor = "white";
	for ( var i = 0; i < cells.length; i++)
	{
		cells[i].style.borderWidth = "1px";
	}
}

function addXOelem(e)
{

	e.currentTarget.ondragstart = function(){return false};
	var target = e.target;

	console.log("xotarget: " + e.target);

	if(target == e.currentTarget || !!target.className ) return;
	target.innerHTML = "";
	var xoElem = document.createElement("span");
	xoElem.className = "xoElem";

	if ( toggleXO )
	{
		xoElem.classList.add("O");
		target.className = "O";
		if (canvasTest)
		{
			canvasDrawO(e);
		}else{
			xoElem.innerHTML="O";
		}
		info.innerHTML = "X move";
		saveElement(e);
		toggleXO = 0;
		localStorage.setItem("toggleXO", toggleXO);
	}else{
		xoElem.classList.add("X");
		target.className = "X";
		info.innerHTML = "O move";
		if (canvasTest)
		{
			canvasDrawX(e);
		}else{
			xoElem.innerHTML="X";
		}
		saveElement(e);
		toggleXO = 1;
		localStorage.setItem("toggleXO", toggleXO);
	}
	target.appendChild(xoElem);
	checkWin(e);
	XOcounter++;
	localStorage.setItem("XOcounter", XOcounter);
	console.log("xo counter: " + XOcounter);
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
	endMessage.innerHTML = value +": win";
	endDialog.appendChild(endMessage);
	info.innerHTML = value +": win";
	wipeData();
	XOcounter = toggleXO = winState = 0;
/*
	setTimeout(function(){
		var temp = tableSize;
		wipeData();
		localStorage.setItem("tableSize", temp);
		table.parentNode.removeChild(table);
		setup();
		info.innerHTML = "";
		toggleXO = winState = 0;
	},2500);
*/
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
			if (table.rows[i].cells[j].className == "O")
			{
				canvasDrawO(e);
			}else if(table.rows[i].cells[j].className == "X"){
				canvasDrawX(e);
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
	coords.left = coords.left - tableCoords.left + lineLength - 3;
	coords.top = coords.top - tableCoords.top + lineLength - 3;
	c.strokeStyle = "#2EB821";
	c.lineWidth = 0;

	var step = 0;
	var interval = setInterval(function(){
		step += 0.1;
		c.beginPath();
		c.arc( coords.left, coords.top, lineLength/2, 0, Math.PI*step, false);
		c.stroke();
		if (step > 2)
		{
			step = 0;
			clearInterval(interval);
		}

	}, 3)
}

function canvasDrawX(e)
{
	var coords = getCoords(e.target);
	var tableCoords = getCoords(e.currentTarget);
	var lineLength = e.target.offsetWidth - 10;
	coords.left = coords.left - tableCoords.left + 5;
	coords.top = coords.top - tableCoords.top + 5;
	c.strokeStyle = "#F56607";
	c.lineWidth = 3;
	var step = 0;
	var step2 = lineLength;

	var xObject = {};
	xObject.firstLine = function()
	{
		var interval = setInterval(function(){
			step++;
			c.beginPath();
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





























/*




 function addXOelem(e)
 {


 e.currentTarget.ondragstart = function(){return false;}


 if(e.target == e.currentTarget || !!e.target.className ) return;
 e.target.innerHTML = "";
 var xoElem = document.createElement("span");
 xoElem.className = "xoElem";

 if ( toggleXO )
 {
 xoElem.classList.add("O");
 e.target.className = "O";
 if (canvasTest)
 {
 canvasDrawO(e);
 }else{
 xoElem.innerHTML="O";
 }
 info.innerHTML = "X move";
 saveElement(e);
 toggleXO = 0;
 localStorage.setItem("toggleXO", toggleXO);
 }else{
 xoElem.classList.add("X");
 e.target.className = "X";
 info.innerHTML = "O move";
 if (canvasTest)
 {
 canvasDrawX(e);
 }else{
 xoElem.innerHTML="X";
 }
 saveElement(e);
 toggleXO = 1;
 localStorage.setItem("toggleXO", toggleXO);
 }
 e.target.appendChild(xoElem);
 checkWin(e);
 XOcounter++;
 localStorage.setItem("XOcounter", XOcounter);
 console.log(XOcounter);
 if (XOcounter == tableSize*tableSize)
 {
 XOcounter = 0;
 wipeData();
 showWin('draw');
 }
 }



 */