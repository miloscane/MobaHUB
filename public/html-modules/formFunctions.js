function showDropdown(elem){
	var selectWrap	=	elem.parentElement;
	if(Number(selectWrap.dataset.closed)==1){
		//Open the dropdown
		selectWrap.dataset.closed=0;
		selectWrap.querySelectorAll(".options")[0].style.height=selectWrap.querySelectorAll(".options")[0].dataset.height+"px";
		selectWrap.querySelectorAll(".options")[0].classList.add("optionsActive");
		selectWrap.querySelectorAll(".dropdown")[0].innerHTML=selectWrap.querySelectorAll(".dropdown")[0].dataset.up;
	}else if(Number(selectWrap.dataset.closed)==0){
		selectWrap.dataset.closed=1;
		selectWrap.querySelectorAll(".options")[0].style.height="0px";
		selectWrap.querySelectorAll(".options")[0].classList.remove("optionsActive");
		selectWrap.querySelectorAll(".dropdown")[0].innerHTML=selectWrap.querySelectorAll(".dropdown")[0].dataset.down;
	}else{
		console.log("Warning: Couldn't figure out if dropdown is opened or not");
	}
	
}

function dropdownPick(elem){
	var selectWrap	=	elem.parentElement.parentElement;
	selectWrap.querySelectorAll(".finalInput")[0].dataset.value=elem.dataset.value;
	selectWrap.querySelectorAll(".finalInput")[0].innerHTML=elem.innerHTML;
	selectWrap.querySelectorAll(".clicker")[0].click();
}

function generateSelectInput(elem,selectJson,extraFun){
	//selectJson [{name:name,value:value,default:default}]
	
	var selectInput	=	document.createElement("DIV");
	selectInput.setAttribute("class","selectInput");
	selectInput.setAttribute("data-closed",1);
	
	var clicker	=	document.createElement("DIV");
	clicker.setAttribute("class","clicker");
	clicker.setAttribute("onclick","showDropdown(this)");
	selectInput.appendChild(clicker);
	
	var finalInput	=	document.createElement("DIV");
	finalInput.setAttribute("class","finalInput");
	for(var i=0;i<selectJson.length;i++){
		if(Number(selectJson[i].default)==1){
			finalInput.setAttribute("data-value",selectJson[i].value);
			finalInput.innerHTML=selectJson[i].name;
			break;
		}
	}
	if(!finalInput.dataset.value){
		finalInput.setAttribute("data-value",selectJson[0].value);
		finalInput.innerHTML=selectJson[0].name;
	}
	clicker.appendChild(finalInput);
	
	var dropdown	=	document.createElement("DIV");
	dropdown.setAttribute("class","dropdown");
	dropdown.setAttribute("data-down","&#9660;");
	dropdown.setAttribute("data-up","&#9650;");
	dropdown.innerHTML="&#9660;"
	clicker.appendChild(dropdown);
	
	
	var options	=	document.createElement("DIV");
	options.setAttribute("class","options");
	options.setAttribute("data-height",eval(selectJson.length*47));
	if(eval(selectJson.length*47)>400){
		options.classList.add("bigOptions")
	}
	
	for(var i=0;i<selectJson.length;i++){
		var optionJson	=	selectJson[i];
		var option	=	document.createElement("DIV");
		option.setAttribute("class","option")
		option.setAttribute("data-value",optionJson.value);
		if(extraFun){
			option.setAttribute("onclick","dropdownPick(this);"+extraFun);
		}else{
			option.setAttribute("onclick","dropdownPick(this);");
		}
		
		option.innerHTML=optionJson.name;
		
		options.appendChild(option);
	}
	
	selectInput.appendChild(options);
	
	if(elem){
		elem.innerHTML="";
		elem.appendChild(selectInput);
	}else{
		console.log("Warning: Couldn't find element"+elem+". Select form (logged bellow) not appended to any element");
		console.log(selectInput)
	}
	
}

function generateCheckboxList(elem,elemidclass,checkboxJson,extraFun,aggregate){
	//checkboxJson [{name:name,value:value,default:default}]
	//elemidclass will be the id or class which will the final element have "id:engineersList" or "class:engineersList"
	if(!aggregate){
		elem.innerHTML	=	"";
	}
	
	var table	=	document.createElement("TABLE");
	if(elemidclass.split(":")[0]=="id"){
		table.setAttribute("id",elemidclass.split(":")[1]);
	}else if(elemidclass.split(":")[0]=="class"){
		table.setAttribute("class","checkboxTable "+elemidclass.split(":")[1]);
	}
	var tbody	=	document.createElement("TBODY");
	
	for(var i=0;i<checkboxJson.length;i++){
		var info	=	checkboxJson[i];
		var tr	=	document.createElement("TR");
		
		var td	=	document.createElement("TD");
		td.setAttribute("class","checkboxWrap");
		var div	=	document.createElement("DIV");
		div.setAttribute("class","checkbox");
		div.setAttribute("data-value",info.value);
		if(extraFun){
			div.setAttribute("onclick","pickCheckbox(this);"+ extraFun);
		}else{
			div.setAttribute("onclick","pickCheckbox(this);");
		}
		
		if(Number(info.default)==1){
			div.setAttribute("data-active","1");
			div.classList.add("active");
		}else{
			div.setAttribute("data-active","0");
		}
		td.appendChild(div);
		tr.appendChild(td);
		
		var td	=	document.createElement("TD");
		td.setAttribute("class","nameWrap");
		var div	=	document.createElement("DIV");
		div.setAttribute("class","name");
		if(extraFun){
			div.setAttribute("onclick","pickCheckbox(this);"+ extraFun);
		}else{
			div.setAttribute("onclick","pickCheckbox(this);");
		}
		div.innerHTML=info.name;
		if(Number(info.default)==1){
			div.classList.add("active");
		}
		td.appendChild(div);
		tr.appendChild(td);
		
		
		tbody.appendChild(tr);
	}
	
	table.appendChild(tbody);
	
	if(elem){
		elem.appendChild(table);
	}else{
		console.log("Warning: Couldn't find element:"+elem+". Checkbox list (logged bellow) not appended to any element");
		console.log(selectInput)
	}
}

function pickCheckbox(elem){
	var tableElem	=	elem.parentElement.parentElement.parentElement.parentElement;
	var checkBoxes	=	tableElem.querySelectorAll("."+elem.classList[0]);
	var checkBoxIndex	=	-1;
	for(var i=0;i<checkBoxes.length;i++){
		if(checkBoxes[i]==elem){
			checkBoxIndex=i
		}
	}
	if(checkBoxIndex>=0){
		if(Number(tableElem.querySelectorAll(".checkbox")[checkBoxIndex].dataset.active)==1){
			tableElem.querySelectorAll(".checkbox")[checkBoxIndex].dataset.active=0;
			tableElem.querySelectorAll(".checkbox")[checkBoxIndex].classList.remove("active");
			tableElem.querySelectorAll(".name")[checkBoxIndex].classList.remove("active");
		}else if(Number(tableElem.querySelectorAll(".checkbox")[checkBoxIndex].dataset.active)==0){
			tableElem.querySelectorAll(".checkbox")[checkBoxIndex].dataset.active=1;
			tableElem.querySelectorAll(".checkbox")[checkBoxIndex].classList.add("active");
			tableElem.querySelectorAll(".name")[checkBoxIndex].classList.add("active");
			
		}else{
			console.log("Warning: Couldn't figure out if checkbox is active or no");
		}
	}else{
		console.log("Warning: Couldn't find check box index");
	}
	
}

function generateDateInput(elem,elemidclass,dateLimits,extraFun){
	//elem is in which element is the date input generateDateInput
	//elemidclass will be the id or class which will the final element have "id:subTaskDeadline" or "class:projectStart"
	//dateLimits	=	[minTime,maxTime]
	
	
	var dateInputWrap	=	document.createElement("DIV");
	dateInputWrap.setAttribute("class","dateInputWrap");
	if(elemidclass.split(":")[0]=="id"){
		dateInputWrap.setAttribute("id",elemidclass.split(":")[1]);
	}else if(elemidclass.split(":")[0]=="class"){
		dateInputWrap.setAttribute("class",elemidclass.split(":")[1]);
	}
	dateInputWrap.dataset.mindate	=	dateLimits[0];
	dateInputWrap.dataset.maxdate	=	dateLimits[1];
	dateInputWrap.dataset.extrafun	=	extraFun;
	
	
	//DAY
	var dateItemInputWrap	=	document.createElement("DIV");
	dateItemInputWrap.setAttribute("class","dateItemInputWrap");
	var dayInput	=	document.createElement("DIV");
	dayInput.setAttribute("class","dayInput");
	var daysJson	=	[];
	/*if(preselectedDate){
		var days	=	new Date(preselectedDate.getFullYear(),preselectedDate.getMonth()+1,0).getDate();//month se dodaje jedan jer u ovom slucaju ne pocinje od nule
	}else{
		var days	=	new Date(today.getFullYear(),today.getMonth()+1,0).getDate();//month se dodaje jedan jer u ovom slucaju ne pocinje od nule
	}*/
	var minDate	=	new Date(dateLimits[0]);
	var days	=	new Date(minDate.getFullYear(),minDate.getMonth()+1,0).getDate();
	
	for(var i=1;i<=days;i++){
		var dayJson	=	{};
		dayJson.name	=	i;
		dayJson.value	=	i;
		daysJson.push(dayJson);
	}
	
	var generate	=	generateSelectInput(dayInput,daysJson,"datePicked(this);"+extraFun);
	
	dateItemInputWrap.appendChild(dayInput);
	dateInputWrap.appendChild(dateItemInputWrap);
	
	var dateInputSeparator	=	document.createElement("DIV");
	dateInputSeparator.setAttribute("class","dateInputSeparator");
	dateInputSeparator.innerHTML="-";
	dateInputWrap.appendChild(dateInputSeparator);
	
	//MONTH
	var dateItemInputWrap	=	document.createElement("DIV");
	dateItemInputWrap.setAttribute("class","dateItemInputWrap");
	var monthInput	=	document.createElement("DIV");
	monthInput.setAttribute("class","monthInput");
	var monthsJson	=	[];
	for(var i=0;i<monthNames.length;i++){
		var monthJson	=	{};
		monthJson.name	=	monthNames[i];
		monthJson.value	=	i;
		monthsJson.push(monthJson);
	}
	var generate	=	generateSelectInput(monthInput,monthsJson,"datePicked(this);"+extraFun);
	
	
	dateItemInputWrap.appendChild(monthInput);
	dateInputWrap.appendChild(dateItemInputWrap);
	
	
	var dateInputSeparator	=	document.createElement("DIV");
	dateInputSeparator.setAttribute("class","dateInputSeparator");
	dateInputSeparator.innerHTML="-";
	dateInputWrap.appendChild(dateInputSeparator);
	
	//YEAR
	var dateItemInputWrap	=	document.createElement("DIV");
	dateItemInputWrap.setAttribute("class","dateItemInputWrap");
	var yearInput	=	document.createElement("DIV");
	yearInput.setAttribute("class","yearInput");
	var minYear	=	new Date(Number(dateLimits[0])).getFullYear();
	var maxYear	=	new Date(Number(dateLimits[1])).getFullYear();
	var yearsJson	=	[];
	for(var i=minYear;i<=maxYear;i++){
		var yearJson	=	{};
		yearJson.name=i;
		yearJson.value=i;
		yearsJson.push(yearJson);
	}
	
	var generate	=	generateSelectInput(yearInput,yearsJson,"datePicked(this);"+extraFun);
	
	dateItemInputWrap.appendChild(yearInput);
	dateInputWrap.appendChild(dateItemInputWrap);
	
	
	elem.appendChild(dateInputWrap);
}

function dateError(elem){
	elem.style.border="2px solid rgba(255,0,0,1)";
	elem.style.backgroundColor="rgba(255,0,0,1)";
	setTimeout(function(){
		elem.style.border="2px solid rgba(255,0,0,0)";
		elem.style.backgroundColor="rgba(255,0,0,0)";
	},200);
	setTimeout(function(){
		elem.style.border="2px solid rgba(255,0,0,1)";
		elem.style.backgroundColor="rgba(255,0,0,1)";
	},400);
	setTimeout(function(){
		elem.style.border="2px solid rgba(255,0,0,0)";
		elem.style.backgroundColor="rgba(255,0,0,0)";
	},600);
	
}


function datePicked(elem){
	var dateElem	=	elem.parentElement.parentElement.parentElement.parentElement.parentElement;
	var maxDate	=	Number(getDateFromInput(dateElem).maxdate);
	var minDate	=	Number(getDateFromInput(dateElem).mindate);
	var pickedDate	=	Number(getDateFromInput(dateElem).date);
	if(pickedDate>=minDate && pickedDate<=maxDate){
		setDate(dateElem,pickedDate);
	}else if(pickedDate<minDate){
		setDate(dateElem,minDate);
		dateError(dateElem);
	}else if(pickedDate>maxDate){
		setDate(dateElem,maxDate);
		dateError(dateElem);
	}
	
	
}

/*function getDateFromInput(elem){
	var object	=	{};
	if(elem && elem.querySelectorAll(".yearInput")[0]){
		var year	=	Number(elem.querySelectorAll(".yearInput")[0].querySelectorAll(".finalInput")[0].dataset.value);
		var month	=	Number(elem.querySelectorAll(".monthInput")[0].querySelectorAll(".finalInput")[0].dataset.value);
		var day		=	Number(elem.querySelectorAll(".dayInput")[0].querySelectorAll(".finalInput")[0].dataset.value);
		
		
		object.date	=	new Date(year,month,day).getTime();
		object.maxdate	=	Number(elem.dataset.maxdate);
		object.mindate	=	Number(elem.dataset.mindate);
		
		
	}else{
		console.log("Couldn't extract date from:")
		console.log(elem)
	}
	return object;
	
}*/

function setDate(elem,datetime){
	var maxDate	=	Number(getDateFromInput(elem).maxdate);
	var minDate	=	Number(getDateFromInput(elem).mindate);
	if(Number(datetime)>=minDate && Number(datetime)<=maxDate){
		var date	=	new Date(Number(datetime));
		
		elem.querySelectorAll(".yearInput")[0].querySelectorAll(".finalInput")[0].dataset.value	=	date.getFullYear();
		elem.querySelectorAll(".yearInput")[0].querySelectorAll(".finalInput")[0].innerHTML		=	date.getFullYear();
		elem.querySelectorAll(".monthInput")[0].querySelectorAll(".finalInput")[0].dataset.value	=	date.getMonth();
		elem.querySelectorAll(".monthInput")[0].querySelectorAll(".finalInput")[0].innerHTML		=	monthNames[date.getMonth()];
		
		var days	=	new Date(date.getFullYear(),date.getMonth()+1,0).getDate();
		var daysJson	=	[]
		for(var i=1;i<=days;i++){
			var dayJson	=	{};
			dayJson.name	=	i;
			dayJson.value	=	i;
			daysJson.push(dayJson);
		}
		elem.querySelectorAll(".dayInput")[0].innerHTML="";
		
		var generate	=	generateSelectInput(elem.querySelectorAll(".dayInput")[0],daysJson,"datePicked(this);"+elem.dataset.extrafun);
		elem.querySelectorAll(".dayInput")[0].querySelectorAll(".finalInput")[0].dataset.value	=	date.getDate();
		elem.querySelectorAll(".dayInput")[0].querySelectorAll(".finalInput")[0].innerHTML		=	date.getDate();
	}else if(Number(datetime)<minDate){
		dateError(elem);
		//setDate(elem,minDate); NEVER UNCOMMENT THIS, maximum call stack ;)
		var date	=	new Date(minDate);
		
		elem.querySelectorAll(".yearInput")[0].querySelectorAll(".finalInput")[0].dataset.value	=	date.getFullYear();
		elem.querySelectorAll(".yearInput")[0].querySelectorAll(".finalInput")[0].innerHTML		=	date.getFullYear();
		elem.querySelectorAll(".monthInput")[0].querySelectorAll(".finalInput")[0].dataset.value	=	date.getMonth();
		elem.querySelectorAll(".monthInput")[0].querySelectorAll(".finalInput")[0].innerHTML		=	monthNames[date.getMonth()];
		
		var days	=	new Date(date.getFullYear(),date.getMonth()+1,0).getDate();
		var daysJson	=	[]
		for(var i=1;i<=days;i++){
			var dayJson	=	{};
			dayJson.name	=	i;
			dayJson.value	=	i;
			daysJson.push(dayJson);
		}
		elem.querySelectorAll(".dayInput")[0].innerHTML="";
		
		var generate	=	generateSelectInput(elem.querySelectorAll(".dayInput")[0],daysJson,"datePicked(this);"+elem.dataset.extrafun);
		elem.querySelectorAll(".dayInput")[0].querySelectorAll(".finalInput")[0].dataset.value	=	date.getDate();
		elem.querySelectorAll(".dayInput")[0].querySelectorAll(".finalInput")[0].innerHTML		=	date.getDate();
	}else if(Number(datetime)>maxDate){
		dateError(elem);
		//setDate(elem,maxDate); NEVER UNCOMMENT THIS, maximum call stack ;)
		var date	=	new Date(maxDate);
		
		elem.querySelectorAll(".yearInput")[0].querySelectorAll(".finalInput")[0].dataset.value	=	date.getFullYear();
		elem.querySelectorAll(".yearInput")[0].querySelectorAll(".finalInput")[0].innerHTML		=	date.getFullYear();
		elem.querySelectorAll(".monthInput")[0].querySelectorAll(".finalInput")[0].dataset.value	=	date.getMonth();
		elem.querySelectorAll(".monthInput")[0].querySelectorAll(".finalInput")[0].innerHTML		=	monthNames[date.getMonth()];
		
		var days	=	new Date(date.getFullYear(),date.getMonth()+1,0).getDate();
		var daysJson	=	[]
		for(var i=1;i<=days;i++){
			var dayJson	=	{};
			dayJson.name	=	i;
			dayJson.value	=	i;
			daysJson.push(dayJson);
		}
		elem.querySelectorAll(".dayInput")[0].innerHTML="";
		
		var generate	=	generateSelectInput(elem.querySelectorAll(".dayInput")[0],daysJson,"datePicked(this);"+elem.dataset.extrafun);
		elem.querySelectorAll(".dayInput")[0].querySelectorAll(".finalInput")[0].dataset.value	=	date.getDate();
		elem.querySelectorAll(".dayInput")[0].querySelectorAll(".finalInput")[0].innerHTML		=	date.getDate();
	}else{
		console.log("Something went wrong with set date")
	}
	
}

function generateDate(time){
	var date	=	new Date(time);
	var dateString	=	date.getDate()+"-"+monthNames[date.getMonth()]+"-"+date.getFullYear();
	
	return dateString;
}