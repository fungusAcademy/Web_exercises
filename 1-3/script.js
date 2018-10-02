/***************************************/
function CalculateSquare() 
{
	var Source = document.getElementById('form');
	var a = Number(Source.a.value);
	var b = Number(Source.b.value);
	var h = Number(Source.h.value);
    
    if(a == 0 || b == 0 || h == 0)
    {
        alert("Wrong number(s)");
    }
    else
    {
        Source.Result.value = 0.5 * (a+b)*h;
    }
}
/***************************************/
/***************************************/
/***************************************/
function FindNums() 
{
    var i = -800;
    var counter = 0;
    var res = "";
    
    while(i <= 800)
    {
        if (i % 31 == 0)
        {
            res += String(i) + " ";
            counter++;
            i += 31;
        }
        else
        {
            i++;
        }
    }
    
	document.getElementById('Result').innerHTML =res + "<br>Total number: " + String(counter);
}
/***************************************/
/***************************************/
/*******************************************************/
function GetRandomInt(min, max) 
{
	return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

function GenMatrix() 
{
	var max = document.getElementById('MaxNumber').value;
	var min = document.getElementById('MinNumber').value;
    
	if ( max < min) 
	{
		alert("max < min");
		return;
	}
    
	var div = document.getElementsByClassName('Matrix')[0];
	var table = document.createElement('table');
    var info = document.createElement('tableInfo');
	table.className = 'SortedTable';
	table.id = 'Delete1';
    info.id = 'Delete2';
	var trow = document.createElement('tr');
	var tableArr = new Array(7);
    var maxAbsNum = 0;
    var maxI = -1;
    var maxJ = -1;
    
	for (var i = 0; i < 7; i++) 
	{
        tableArr[i] = new Array(9);
        
		for (var j = 0; j < 9; j++) 
		{
			tableArr[i][j] = GetRandomInt(min, max);
            if (Math.abs(Number(tableArr[i][j])) > Math.abs(maxAbsNum))
            {
                maxAbsNum = tableArr[i][j];
                maxI = i;
                maxJ = j;
            }
		}
	}
    
    var temp = tableArr[0][0];
    tableArr[0][0] = tableArr[maxI][maxJ];
    tableArr[maxI][maxJ] = temp;
    
    for (var i = 0; i < 7; i++) 
	{
		for (var j = 0; j < 9; j++) 
		{
			var td = document.createElement('td');
			td.innerHTML = parseInt(tableArr[i][j]);
			trow.appendChild(td);
		}
        
		table.appendChild(trow);
		trow = document.createElement('tr');
	}
    
	var tmp1 = document.getElementById('Delete1');
    var tmp2 = document.getElementById('Delete2');
    
	if (tmp1 != null) div.removeChild(tmp1);
    if (tmp2 != null) div.removeChild(tmp2);

    info.innerHTML = "<br/>[" + parseInt(maxI) + "][" + parseInt(maxJ) + "] <-> [0][0]";
	div.appendChild(table);
    div.appendChild(info);
}
/***************************************/
/***************************************/
/*****************************************************/
function GetArray(n, min, max) 
{
	var A=[];
	for (var i = 0; i < n; i++) 
	{
		A[i]=[];
		for (var j = 0; j < n; j++) 
		{
			A[i][j] = GetRandomInt(min, max);
		}
	}
	return A;
}

function GetRusultArray(a) 
{
	var Buf=[];
    
	for (var i = 0; i < a.length; i++) 
	{
		for (var j = 0; j < a.length; j++) 
		{
			Buf.push(a[i][j]);
		}
	}
    
	Buf.sort(function cmp(a,b) {return(a-b);});
	var iter=0;
    
	for (var k = 0; k < a.length; k++) 
	{
		if(k%2 == 1)
        {
			for (var j = 0; j < a.length; j++) 
			{
				a[j][k]=Buf[iter++]
			}
		}
        else
        {
			for (var j = a.length-1; j >= 0; j--) 
			{
				a[j][k]=Buf[iter++];
			}
		}
	}
    
	return a;
}

function FillSnake() 
{
	var min=document.getElementById('MinNum').value;
	var max=document.getElementById('MaxNum').value;
	var n=document.getElementById('Size').value;
    
	if(min > max || n == 0)
	{ 
		alert("Введите циферки плез");
		return;
	}
    
	var Arr=GetRusultArray(GetArray(n, min, max));
	var div = document.getElementsByClassName('FillSnakeDiv')[0];
	var table = document.createElement('table');
	table.className = 'SortedTable';
	table.id = 'DeleteIt'
	var trow = document.createElement('tr');
	var iter=0;
    
	for (var i = 0; i < Arr.length; i++) 
	{
		for (var j = 0; j < Arr.length; j++) 
		{
			var td = document.createElement('td');
			td.innerHTML = parseInt(Arr[i][j]);
			trow.appendChild(td);
		}
        
		table.appendChild(trow);
		trow = document.createElement('tr');
	}
    
	var tmp = document.getElementById('DeleteIt');
    
	if (tmp != null) 
	{
		div.removeChild(tmp);
	}
    
	div.appendChild(table);
}
