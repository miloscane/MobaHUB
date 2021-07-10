var monthNames	=	["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var dayNames	=	["MON","TUE","WED","THU","FRI","SAT","SUN"];
var today		=	new Date();

function displayMonth(month,year,onclick){
	document.getElementById("current-month").dataset.month=month;
	document.getElementById("current-month").dataset.year=year;
	document.getElementById("current-month").innerHTML=monthNames[month]+" - "+year;
	document.getElementById("calendar").innerHTML="";
	
	var table	=	document.createElement("TABLE");
	//Create weekdays
	var tr		=	document.createElement("TR");
	for(var i=0;i<dayNames.length;i++){
		var td	=	document.createElement("TD");
		var div	=	document.createElement("DIV");
		div.innerHTML	=	dayNames[i];
		td.appendChild(div);
		tr.appendChild(td);
	}
	table.appendChild(tr);
	
	//Check at which weekday does the month start
	var startDay	=	new Date(year,month,0).getDay();
	var daysInMonth	=	new Date(year,month+1,0).getDate();
	
	var rows	=	Math.ceil((daysInMonth+startDay)/dayNames.length);
	
	var addedDays=1;//has to start at 1 because this var is used to write out the dates in boxes
	
	for(var i=0;i<rows;i++){
		var tr	=	document.createElement("TR");
		if(i==0){
			//Starting Empty days
			for(var j=0;j<startDay;j++){
				var td	=	document.createElement("TD");
				td.setAttribute("class","inactive");
				var div	=	document.createElement("DIV");
				td.appendChild(div);
				tr.appendChild(td);
			}
			for(var j=0;j<eval(dayNames.length-startDay);j++){
				var td	=	document.createElement("TD");
				td.setAttribute("class","calendarDate");
				var div	=	document.createElement("DIV");
				//Check if date is in the future
				if(today.getFullYear()==year && today.getMonth()==month && addedDays>today.getDate()){
					//it is today
					div.classList.add("futureDate");
				}else{
					div.setAttribute("onclick",onclick);
				}
				div.dataset.date	=	addedDays;
				div.innerHTML	=	addedDays;
				//Check if date is today
				if(today.getFullYear()==year && today.getMonth()==month && today.getDate()==addedDays){
					//it is today
					div.classList.add("todaysDate");
				}
				
				addedDays++;
				td.appendChild(div);
				tr.appendChild(td);	
			}
		}else if(i==eval(rows-1)){
			//Last Row
			var leftOverDays	=	daysInMonth-addedDays+1;
			for(var j=0;j<leftOverDays;j++){
				var td	=	document.createElement("TD");
				var div	=	document.createElement("DIV");
				//Check if date is in the future
				if(today.getFullYear()==year && today.getMonth()==month && addedDays>today.getDate()){
					//it is today
					div.classList.add("futureDate");
				}else{
					div.setAttribute("onclick",onclick);
					td.setAttribute("class","calendarDate");
				}
				div.dataset.date	=	addedDays;
				//Check if date is today
				if(today.getFullYear()==year && today.getMonth()==month && today.getDate()==addedDays){
					//it is today
					div.classList.add("todaysDate");
				}
				div.innerHTML	=	addedDays;
				addedDays++;
				td.appendChild(div);
				tr.appendChild(td);
			}
		}else{
			for(var j=0;j<dayNames.length;j++){
				var td	=	document.createElement("TD");
				var div	=	document.createElement("DIV");
				//Check if date is in the future
				if(today.getFullYear()==year && today.getMonth()==month && addedDays>today.getDate()){
					//it is today
					div.classList.add("futureDate");
				}else{
					div.setAttribute("onclick",onclick);
					td.setAttribute("class","calendarDate");
				}
				div.dataset.date	=	addedDays;
				div.innerHTML	=	addedDays;
				//Check if date is today
				if(today.getFullYear()==year && today.getMonth()==month && today.getDate()==addedDays){
					//it is today
					div.classList.add("todaysDate");
				}
				addedDays++;
				td.appendChild(div);
				tr.appendChild(td);	
			}
		}
		table.appendChild(tr);
	}
	
	document.getElementById("calendar").appendChild(table);
	
	//Disable next button if month is in the future
	if(month+1>11){
		var futureMonth=0;
		var futureYear=year+1;
	}else{
		var futureMonth=month+1
		var futureYear=year;
	}
	
	var futureDate	=	new Date(futureYear,futureMonth,0);
	if(futureDate.getTime()>today.getTime()){
		document.getElementById("next-month-button").classList.add("inactiveMonthNavigationButton");
		document.getElementById("next-month-button").setAttribute("onclick","")
	}else{
		document.getElementById("next-month-button").classList.remove("inactiveMonthNavigationButton");
		if(document.getElementById("next-month-button").dataset.extrafun){
			document.getElementById("next-month-button").setAttribute("onclick","displayNextMonth('"+onclick+"');"+document.getElementById('next-month-button').dataset.extrafun)
		}else{
			document.getElementById("next-month-button").setAttribute("onclick","displayNextMonth('"+onclick+"')")
		}
		
	}
}

function displayPreviousMonth(clickFunction){
	var currentMonth	=	Number(document.getElementById("current-month").dataset.month);
	var currentYear		=	Number(document.getElementById("current-month").dataset.year);
	if(currentMonth==0){
		var newMonth	=	11;
		var newYear		=	currentYear-1;
	}else{
		var newMonth	=	currentMonth-1;
		var newYear		=	currentYear;
	}
	displayMonth(newMonth,newYear,clickFunction);
}

function displayNextMonth(clickFunction){
	var currentMonth	=	Number(document.getElementById("current-month").dataset.month);
	var currentYear		=	Number(document.getElementById("current-month").dataset.year);
	if(currentMonth==11){
		var newMonth	=	0;
		var newYear		=	currentYear+1;
	}else{
		var newMonth	=	currentMonth+1;
		var newYear		=	currentYear;
	}
	displayMonth(newMonth,newYear,clickFunction);
	
}

Date.prototype.getWeekNumber = function(){
  var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  var dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
};

function getMonday(d) {
	d = new Date(d);
	var day = d.getDay(),
		diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
	
	var monday	=	new Date(d.setDate(diff));
	return new Date(monday.getFullYear(),monday.getMonth(),monday.getDate());
	//return new Date(d.setDate(diff));
}

function getDateFromWeekNumber(w, y) {
    var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week

    return new Date(y, 0, d);
}

function datetimeToDate(datetime){
	if(!isNaN(Number(datetime))){
		var date			=	new Date(Number(datetime));
		var readableDate	=	date.getDate()+"-"+eval(date.getMonth()+1)+"-"+date.getFullYear();
		return readableDate
	}else{
		return "Not Set"
	}
	
}

function isSameDate(datetime1,datetime2){
	var date1	=	new Date(Number(datetime1));
	var date2	=	new Date(Number(datetime2));
	
	if(date1.getFullYear()==date2.getFullYear() && date1.getMonth()==date2.getMonth() && date1.getDate()==date2.getDate()){
		return true
	}else{
		return false
	}
}

function setDateOfInput(elem,datetime){
	var	date		=	new Date(Number(datetime));
	var year		=	date.getFullYear();
	var month		=	eval(date.getMonth()+1).toString();
	month			=	(month.toString().length==1) ? "0"+ month : month;
	var day			=	date.getDate();
	day				=	(day.toString().length==1) ? "0"+ day : day;
	var valueString	=	year+"-"+month+"-"+day;
	elem.value		=	valueString;
	if(elem.value!=valueString){
		console.log("Failed to set date")
	}
}