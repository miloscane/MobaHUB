Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

function getProjectNameFromCode(pcode){
	var dispname="";
	for(var i=0;i<infoForPage.projects.length;i++){
		if(pcode==infoForPage.projects[i].code){
			dispname	=	infoForPage.projects[i].dispname
		}
	}
	return dispname
}

function fullProjectNameFromCode(pcode){
	var dispname="";
	for(var i=0;i<infoForPage.projects.length;i++){
		if(pcode==infoForPage.projects[i].code){
			if(infoForPage.projects[i].company){
				dispname	=	infoForPage.projects[i].company + "-" + infoForPage.projects[i].dispname	
			}else{
				dispname	=	infoForPage.projects[i].dispname
			}
			
		}
	}
	return dispname
}

function getProjectCompanyFromCode(pcode){
	var company="";
	for(var i=0;i<infoForPage.projects.length;i++){
		if(pcode==infoForPage.projects[i].code){
			company	=	infoForPage.projects[i].company
		}
	}
	return company
}

function getUserNameFromCode(usercode){
	var username="";
	for(var i=0;i<infoForPage.team.length;i++){
		if(usercode==infoForPage.team[i].code){
			username	=	infoForPage.team[i].name
		}
	}
	return username
}

function getUserColorFromCode(usercode){
	var color="";
	for(var i=0;i<infoForPage.team.length;i++){
		if(usercode==infoForPage.team[i].code){
			color	=	infoForPage.team[i].color
		}
	}
	return color
}

function getUserAbrvFromCode(usercode){
	var username="";
	for(var i=0;i<infoForPage.team.length;i++){
		if(usercode==infoForPage.team[i].code){
			username	=	infoForPage.team[i].abrv
		}
	}
	return username
}

function isSameTask(pcode1,task1,subtask1,pcode2,task2,subtask2){
	if(pcode1==pcode2 && task1==task2 && subtask1==subtask2){
		return true
	}else{
		return false
	}
}

function getUserRole(userCode){
	var role=0;
	for(var i=0;i<infoForPage.team.length;i++){
		if(userCode==infoForPage.team[i].code){
			role	=	Number(infoForPage.team[i].role)
			break;
		}
	}
	return role
}

function roundedHours(hours){
	return (hours % 1 == 0) ? hours.toFixed(0) : hours.toFixed(1)
}

function copyText(text){
	var tempText	=	document.createElement("TEXTAREA");
	tempText.value	=	text;
	
	document.body.appendChild(tempText);
	tempText.select();
	//elemToCopy.setSelectionRange(0, 99999); /*For mobile devices*/

	document.execCommand("copy");
	document.body.removeChild(tempText);
}

function toast(text,duration){
	var toastWrap	=	document.createElement("DIV");
	toastWrap.setAttribute("class","toastWrap");
	toastWrap.innerHTML=text;
	toastWrap.setAttribute("style","top:"+eval(event.pageY+20)+"px;left:"+event.pageX+"px");
	document.body.appendChild(toastWrap);
	setTimeout(function(){document.body.removeChild(toastWrap);},duration)
}

function responsiveMenuOpen(elem){
	var menuWrap	=	elem.parentElement;
	if(menuWrap.classList.contains("opened")){
		menuWrap.classList.remove("opened");
		elem.innerHTML	=	"< Menu";
	}else{
		menuWrap.classList.add("opened");
		elem.innerHTML	=	"x Menu";
	}
}

function collapseProjects(shouldCollapse){
	var projectsWrap	=	document.getElementById("projects");
	var container		=	document.getElementById("container2");
	var menuItem		=	document.getElementById("project-opener");
	if(shouldCollapse){
		//Hide Projects
		projectsWrap.style.display	=	"none";
		container.style.paddingLeft	=	"0%";
		menuItem.innerHTML			=	"Show >";
	}else{
		if(projectsWrap.style.display=="none"){
			//Hide projects
			projectsWrap.style.display	=	"block";
			container.style.paddingLeft	=	"30%";
			menuItem.innerHTML			=	"< Hide";
		}else{
			//Show projects
			projectsWrap.style.display	=	"none";
			container.style.paddingLeft	=	"0%";
			menuItem.innerHTML			=	"Show >";

		}
	}
	
}

function getProjectJsonFromCode(pcode){
	var projectJson 	=	{};
	for(var i=0;i<infoForPage.projects.length;i++){
		if(infoForPage.projects[i].code==pcode){
			projectJson	=	JSON.parse(JSON.stringify(infoForPage.projects[i]))
		}
	}
	return projectJson;
}

function generateId(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
		result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
	}
   return result.join('');
}

function getDateAsStringForInputObject(date){
	var yearString	=	date.getFullYear();
	var month		=	eval(date.getMonth()+1);
	var monthString	=	(month<10) ? "0" + month : month;
	var day			=	date.getDate();
	var dayString	=	(day<10) ? "0" + day : day;
	return	yearString+"-"+monthString+"-"+dayString;
}






