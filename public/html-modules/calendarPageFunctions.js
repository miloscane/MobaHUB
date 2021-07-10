function constructCalendar(){
	var month	=	Number(document.getElementById("month-select").value);
	var year	=	Number(document.getElementById("year-input").value);
	
	//Clear out table first
	var tableRows		= 	document.getElementById("calendar-table").querySelectorAll("TR");
	for(var i=1;i<tableRows.length;i++){
		var calendarElems	=	tableRows[i].querySelectorAll(".calendarElement");
		for(var j=0;j<calendarElems.length;j++){
			calendarElems[j].parentNode.removeChild(calendarElems[j])
		}
	}

	date				=	new Date(year,month,1);
	var daysInMonth		=	new Date(year,month+1,0).getDate();
	var weekDay			=	(date.getDay()==0) ? 7:date.getDay();//Return week day as 1-7
	for(var i=1;i<=daysInMonth;i++){
		var tempDate			=	new Date(year,month,i);
		var calendarElement		=	document.createElement("DIV");
		calendarElement.setAttribute("class","calendarElement");
		calendarElement.setAttribute("data-date",tempDate.getTime());
		calendarElement.setAttribute("onclick","showDailyInfo(this)")

			var dateTitle		=	document.createElement("DIV");
			dateTitle.innerHTML	=	i;
			dateTitle.setAttribute("class","calendarDateTitle");
			calendarElement.appendChild(dateTitle);
		if(i==1){
			document.getElementById("calendar-table").querySelectorAll("TR")[1].querySelectorAll("TD")[weekDay-1].appendChild(calendarElement);
		}else{
			var elementPlaced	=	false;
			for(var j=1;j<tableRows.length;j++){
				if(elementPlaced){
					break;
				}
				var rowTds	=	tableRows[j].querySelectorAll("TD");
				var k		=	(j==1) ? weekDay-1:0;
				for(k;k<rowTds.length;k++){
					if(!rowTds[k].querySelectorAll(".calendarElement")[0]){
						rowTds[k].appendChild(calendarElement);
						elementPlaced	=	true;
						break;
					}
				}
			}
		}
	}
	//Mark today
	var todaysDate			=	new Date().getTime();
	var calendarElements	=	document.getElementById("calendar-table").querySelectorAll(".calendarElement");
	for(var i=0;i<calendarElements.length;i++){
		if(isSameDate(todaysDate,calendarElements[i].dataset.date)){
			calendarElements[i].classList.add("calendarElementToday");
			break;
		}
	}

}

function populateCalendar(){
	var elements	=	document.getElementById("calendar-table").getElementsByClassName("calendarElement");
	for(var i=0;i<elements.length;i++){
		var element		=	elements[i];
		var dateTemp	=	Number(element.dataset.date);

		//Project Starts
		for(var j=0;j<infoForPage.projects.length;j++){
			if(isSameDate(dateTemp,infoForPage.projects[j].startdate)){
				var itemInDate			=	document.createElement("DIV");
				itemInDate.setAttribute("data-info","Project "+fullProjectNameFromCode(infoForPage.projects[j].code)+" has started.")
				itemInDate.setAttribute("class","itemInDate projectStart");
				element.appendChild(itemInDate);
			}
		}
		//Project Deadlines
		for(var j=0;j<infoForPage.projects.length;j++){
			if(isSameDate(dateTemp,infoForPage.projects[j].deadline)){
				var itemInDate			=	document.createElement("DIV");
				itemInDate.setAttribute("data-info","Project "+fullProjectNameFromCode(infoForPage.projects[j].code)+" deadline.")
				itemInDate.setAttribute("class","itemInDate projectDeadline");
				element.appendChild(itemInDate);
			}
		}

		//Project Finished dates
		for(var j=0;j<infoForPage.projects.length;j++){
			if(isSameDate(dateTemp,infoForPage.projects[j].finisheddate)){
				var itemInDate			=	document.createElement("DIV");
				itemInDate.setAttribute("class","itemInDate projectFinished");
				itemInDate.setAttribute("data-info","Project "+fullProjectNameFromCode(infoForPage.projects[j].code)+" has finished.")
				element.appendChild(itemInDate);
			}
		}

		//Project Hours
		for(var j=0;j<infoForPage.hours.length;j++){
			if(isSameDate(dateTemp,infoForPage.hours[j].date)){
				if(Number(infoForPage.hours[j].hours)>0){
					if(infoForPage.hours[j].pcode=="Vacation"){
						var itemInDate			=	document.createElement("DIV");
						itemInDate.setAttribute("class","itemInDate vacation");
						itemInDate.setAttribute("data-info",getUserNameFromCode(infoForPage.hours[j].engcode) + " booked "+infoForPage.hours[j].hours+" hours of vacation.")
						itemInDate.setAttribute("data-url","/weekly-input?lastproject="+infoForPage.hours[j].pcode+"&date="+infoForPage.hours[j].date+"&eng="+infoForPage.hours[j].engcode);
						itemInDate.setAttribute("data-urltag","Edit Hours");
						element.appendChild(itemInDate);
					}else{
						var itemInDate			=	document.createElement("DIV");
						itemInDate.setAttribute("class","itemInDate projectHours");
						itemInDate.setAttribute("data-info",getUserNameFromCode(infoForPage.hours[j].engcode) + " spent "+infoForPage.hours[j].hours+" hours on "+fullProjectNameFromCode(infoForPage.hours[j].pcode)+".")
						itemInDate.setAttribute("data-url","/weekly-input?lastproject="+infoForPage.hours[j].pcode+"&date="+infoForPage.hours[j].date+"&eng="+infoForPage.hours[j].engcode);
						itemInDate.setAttribute("data-urltag","Edit Hours");
						element.appendChild(itemInDate);
					}
					
				}
			}
		}

		//Holidays
		for(var j=0;j<infoForPage.calendar.length;j++){
			var calendarItem	=	JSON.parse(JSON.stringify(infoForPage.calendar[j]));
			if(calendarItem.filetype=="holiday"){
				if(calendarItem.day==new Date(dateTemp).getDate() && calendarItem.month==new Date(dateTemp).getMonth()+1){
					var itemInDate			=	document.createElement("DIV");
					itemInDate.setAttribute("class","itemInDate holiday");
					itemInDate.setAttribute("data-info",calendarItem.country + " holiday: "+calendarItem.name);
					element.appendChild(itemInDate);
				}
			}
		}

		//Birthday
		for(var j=0;j<infoForPage.calendar.length;j++){
			var calendarItem	=	JSON.parse(JSON.stringify(infoForPage.calendar[j]));
			if(calendarItem.filetype=="birthday"){
				if(calendarItem.day==new Date(dateTemp).getDate() && calendarItem.month==new Date(dateTemp).getMonth()+1){
					var itemInDate			=	document.createElement("DIV");
					itemInDate.setAttribute("class","itemInDate birthday");
					itemInDate.setAttribute("data-info","Birthday for: " + getUserNameFromCode(calendarItem.eng));
					element.appendChild(itemInDate);
				}
			}
		}
	}
}

function refreshCalendar(){
	var month	=	Number(document.getElementById("month-select").value);
	var year	=	Number(document.getElementById("year-input").value);
	if(month>=0 && month<=11 && year.toString().length==4){
		constructCalendar()
		populateCalendar()
		document.getElementById("daily-info").innerHTML="*Click on a date to show information";
	}
}

function showDailyInfo(elem){
	document.getElementById("daily-info").innerHTML	=	"";
	var calendarElements	=	document.getElementById("calendar-table").querySelectorAll(".calendarElement");
	for(var i=0;i<calendarElements.length;i++){
		calendarElements[i].classList.remove("calendarElementActive")
	}
	elem.classList.add("calendarElementActive");
	var items	=	elem.querySelectorAll(".itemInDate");
	if(items.length>0){
		for(var i=0;i<items.length;i++){
			var item				=	items[i];
			var displayItem			=	document.createElement("DIV");
			displayItem.setAttribute("class","displayItem");
				var box	=	document.createElement("DIV");
				box.setAttribute("class","indicator "+item.classList[1]);
				displayItem.appendChild(box);

				var note		=	document.createElement("DIV");
				note.innerHTML	=	item.dataset.info;
				note.setAttribute("class","note");
				displayItem.appendChild(note);

				if(item.dataset.url){
					var button	=	document.createElement("DIV");
					button.innerHTML	=	item.dataset.urltag ? item.dataset.urltag : "Link";
					button.setAttribute("class","whiteButton calendarLinkButton");
					button.setAttribute("onclick","redirectWithQuery('"+item.dataset.url+"')");
					displayItem.appendChild(button)
				}

			document.getElementById("daily-info").appendChild(displayItem)
		}
	}else{
		document.getElementById("daily-info").innerHTML="*No information for selected date"
	}
	
}

function monthNav(increment){
	var currentMonth	=	Number(document.getElementById("month-select").value);
	var year			=	Number(document.getElementById("year-input").value);
	var nextMonth		=	eval(currentMonth+increment);
	if(nextMonth>11){
		nextMonth	=	0;
		year++;
	}else if(nextMonth<0){
		nextMonth	=	11;
		year--;
	}
	document.getElementById("month-select").value	=	nextMonth;
	document.getElementById("year-input").value		=	year;
	refreshCalendar();
}


var touchstartX = 0;
var touchstartY = 0;
var touchendX = 0;
var touchendY = 0;
var touchSensitivity	=	50;

function handleGesure() {
    var swiped = 'swiped: ';
    if (touchendX < touchstartX && Math.abs(touchendX-touchstartX)>touchSensitivity) {
        //console.log(swiped + 'left!');
        monthNav(1);
    }
    if (touchendX > touchstartX && Math.abs(touchendX-touchstartX)>touchSensitivity) {
        //console.log(swiped + 'right!');
        monthNav(-1);
    }
    if (touchendY < touchstartY) {
        //console.log(swiped + 'down!');
    }
    if (touchendY > touchstartY) {
        //console.log(swiped + 'up!');
    }
    if (touchendY == touchstartY) {
        //console.log('tap!');
    }
    //console.log(touchstartX+" vs "+touchendX)
}






