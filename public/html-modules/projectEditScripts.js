function addTask(elem,elemtoadd,taskJson,addTaskButton){
	
	var tasksWrap	=	elemtoadd;
	if(elem!=""){
		elem.parentElement.remove();
	}

	var task	=	document.createElement("DIV");
	task.setAttribute("class","task");
	
	//Title
	var itemWrap	=	document.createElement("DIV");
	itemWrap.setAttribute("class","itemWrap");
	
		var itemTitle	=	document.createElement("DIV");
		itemTitle.setAttribute("class","itemTitle");
		itemTitle.innerHTML	=	"Task Title:";
		itemWrap.appendChild(itemTitle);
	
		var itemInputWrap	=	document.createElement("DIV");
		itemInputWrap.setAttribute("class","itemInputWrap");
	
			var input	=	document.createElement("INPUT");
			input.setAttribute("class","taskName");
			input.setAttribute("type","text");
			if(taskJson && taskJson.title){
				input.setAttribute("value",taskJson.title);
			}
			itemInputWrap.appendChild(input);

		itemWrap.appendChild(itemInputWrap);
	
	
		var itemNote	=	document.createElement("DIV");
		itemNote.setAttribute("class","itemNote");
		itemWrap.appendChild(itemNote);
	
	task.appendChild(itemWrap);
	//End Title
	
	//Deadline
	var itemWrap	=	document.createElement("DIV");
	itemWrap.setAttribute("class","itemWrap");
	
		var itemTitle	=	document.createElement("DIV");
		itemTitle.setAttribute("class","itemTitle");
		itemTitle.innerHTML	=	"Task Deadline:";
		itemWrap.appendChild(itemTitle);
	
		var itemInputWrap	=	document.createElement("DIV");
		itemInputWrap.setAttribute("class","itemInputWrap");
	
			var div 	=	document.createElement("DIV");
			if(taskJson && taskJson.useprojectdeadline){
				generateCheckboxList(div,"class:taskdeadlinecheckbox",[{"name":"Use project deadline.","value":"","default":1}],"setDateOfTask(this)");
			}else{
				generateCheckboxList(div,"class:taskdeadlinecheckbox",[{"name":"Use project deadline.","value":"","default":0}],"setDateOfTask(this)");
			}
			itemInputWrap.appendChild(div);

			var div		=	document.createElement("DIV");
				var input	=	document.createElement("INPUT");
				input.setAttribute("type","date");
				input.setAttribute("class","taskDeadline");
				if(taskJson && Number(taskJson.useprojectdeadline)==1){
					input.style.display	=	"none";
					setDateOfInput(input,new Date(document.getElementsByClassName("projectDeadline")[0].value).getTime());
				}else if(taskJson && Number(taskJson.useprojectdeadline)==0){
					if(taskJson.deadline){
						setDateOfInput(input,taskJson.deadline);
					}else{
						setDateOfInput(input,new Date().getTime());
					}
				}else{
					setDateOfInput(input,new Date().getTime());
				}
				div.appendChild(input);

			itemInputWrap.appendChild(div);
	
	itemWrap.appendChild(itemInputWrap);
	
	task.appendChild(itemWrap);
	//End Deadline
	
	//Budgeted Hours
	var itemWrap	=	document.createElement("DIV");
	itemWrap.setAttribute("class","itemWrap");
	
		var itemTitle	=	document.createElement("DIV");
		itemTitle.setAttribute("class","itemTitle");
		itemTitle.innerHTML	=	"Budgeted hours:";
		itemWrap.appendChild(itemTitle);
	
		var itemInputWrap	=	document.createElement("DIV");
		itemInputWrap.setAttribute("class","itemInputWrap");
		
			var input	=	document.createElement("INPUT");
			input.setAttribute("class","taskBudgetedHours");
			input.setAttribute("type","number");
			if(taskJson && taskJson.budgetedhours){
				input.setAttribute("value",Number(taskJson.budgetedhours));
			}
			itemInputWrap.appendChild(input);
		itemWrap.appendChild(itemInputWrap);
	
		var itemNote	=	document.createElement("DIV");
		itemNote.setAttribute("class","itemNote");
		itemNote.innerHTML="hours";
		itemWrap.appendChild(itemNote);
	
	task.appendChild(itemWrap);
	//End Budgeted Hours
	
	//Team
	/*var itemWrap	=	document.createElement("DIV");
	itemWrap.setAttribute("class","itemWrap");
	
		var itemTitle	=	document.createElement("DIV");
		itemTitle.setAttribute("class","itemTitle");
		itemTitle.setAttribute("style","vertical-align:top");
		itemTitle.innerHTML	=	"Team:";
		itemWrap.appendChild(itemTitle);
	
		var itemInputWrap	=	document.createElement("DIV");
		itemInputWrap.setAttribute("class","itemInputWrap");
		
		var team	=	[];
		for(var i=0;i<infoForPage.team.length;i++){
			var teamElem	=	{};
			teamElem.name	=	infoForPage.team[i].name.toString();
			teamElem.value	=	infoForPage.team[i].code.toString();
			team.push(teamElem);
		}
		
		if(taskJson && taskJson.team){
			for(var i=0;i<taskJson.team.length;i++){
				for(var j=0;j<team.length;j++){
					if(taskJson.team[i]==team[j].value){
						team[j].default=1
					}
				}
			}
		}
		generateCheckboxList(itemInputWrap,"class:team",team);
		itemWrap.appendChild(itemInputWrap);
	
		var itemNote	=	document.createElement("DIV");
		itemNote.setAttribute("class","itemNote");
		itemWrap.appendChild(itemNote);
	
	task.appendChild(itemWrap);*/
	//End Team
	
	
	//Description
	var itemWrap	=	document.createElement("DIV");
	itemWrap.setAttribute("class","itemWrap");
	
		var itemTitle	=	document.createElement("DIV");
		itemTitle.setAttribute("class","itemTitle");
		itemTitle.innerHTML	=	"Description:";
		itemWrap.appendChild(itemTitle);
	
		var itemInputWrap	=	document.createElement("DIV");
		itemInputWrap.setAttribute("class","itemInputWrap");
		
			var textarea	=	document.createElement("TEXTAREA");
			textarea.setAttribute("class","taskDescription");
			if(taskJson && taskJson.description){
				textarea.innerHTML=taskJson.description;
			}
			itemInputWrap.appendChild(textarea);

		itemWrap.appendChild(itemInputWrap);
		
		var itemNote	=	document.createElement("DIV");
		itemNote.setAttribute("class","itemNote");
		itemWrap.appendChild(itemNote);
	
	task.appendChild(itemWrap);
	//End Description
	
	//Subtasks
	var itemWrap	=	document.createElement("DIV");
	itemWrap.setAttribute("class","itemWrap");
	
		var itemTitle	=	document.createElement("DIV");
		itemTitle.setAttribute("class","itemTitle");
		itemTitle.setAttribute("style","vertical-align:top");
		itemTitle.innerHTML	=	"SubTasks:";
		itemWrap.appendChild(itemTitle);
	
		var itemInputWrap	=	document.createElement("DIV");
		itemInputWrap.setAttribute("class","itemInputWrap subTasks");
		
			if(taskJson && taskJson.subTasks){
				for(var i=0;i<taskJson.subTasks.length;i++){
					addSubTask("",itemInputWrap,taskJson.subTasks[i])
				}
			}
			
			var subTaskButtonWrap	=	document.createElement("DIV");
			subTaskButtonWrap.setAttribute("class","singleButtonWrap")
			
			var subTaskButton	=	document.createElement("DIV");
			subTaskButton.setAttribute("class","clickableButton");
			subTaskButton.setAttribute("onclick","addSubTask(this,this.parentElement.parentElement,{})");
			subTaskButton.innerHTML="Add SubTask";
			subTaskButtonWrap.appendChild(subTaskButton)
			itemInputWrap.appendChild(subTaskButtonWrap);
		
		itemWrap.appendChild(itemInputWrap);
		
		var itemNote	=	document.createElement("DIV");
		itemNote.setAttribute("class","itemNote");
		itemWrap.appendChild(itemNote);
	
	task.appendChild(itemWrap);
	//End Subtasks
	
	tasksWrap.appendChild(task);
	
	var singleButtonWrap	=	document.createElement("DIV");
	singleButtonWrap.setAttribute("class","singleButtonWrap");
	
	if(addTaskButton){
		var button	=	document.createElement("DIV");
		button.setAttribute("class","clickableButton");
		button.innerHTML="Add Task";
		button.setAttribute("onclick","addTask(this,this.parentElement.parentElement,{},true)");
		
		singleButtonWrap.appendChild(button);
		tasksWrap.appendChild(singleButtonWrap);
	}
}


function addSubTask(elem,elemtoadd,subTaskJson){
	
	var subTasksWrap	=	elemtoadd;
	if(elem!=""){
		elem.parentElement.remove();
	}
	
	
	var subTask	=	document.createElement("DIV");
	subTask.setAttribute("class","subTask");
	
	//Title
	var itemWrap	=	document.createElement("DIV");
	itemWrap.setAttribute("class","itemWrap");
		
		var itemTitle	=	document.createElement("DIV");
		itemTitle.setAttribute("class","itemTitle");
		itemTitle.innerHTML	=	"SubTask Title:";
		itemWrap.appendChild(itemTitle);
		
		var itemInputWrap	=	document.createElement("DIV");
		itemInputWrap.setAttribute("class","itemInputWrap");
		
			var input	=	document.createElement("INPUT");
			input.setAttribute("class","subTaskName");
			input.setAttribute("type","text");
			if(subTaskJson && subTaskJson.title){
				input.setAttribute("value",subTaskJson.title);
			}
			itemInputWrap.appendChild(input);
		itemWrap.appendChild(itemInputWrap);
		
		
		var itemNote	=	document.createElement("DIV");
		itemNote.setAttribute("class","itemNote");
		itemWrap.appendChild(itemNote);
	
	subTask.appendChild(itemWrap);
	//End Title
	
	//Deadline
	var itemWrap	=	document.createElement("DIV");
	itemWrap.setAttribute("class","itemWrap");
		
		var itemTitle	=	document.createElement("DIV");
		itemTitle.setAttribute("class","itemTitle");
		itemTitle.innerHTML	=	"SubTask Deadline:";
		itemWrap.appendChild(itemTitle);
		
		var itemInputWrap	=	document.createElement("DIV");
		itemInputWrap.setAttribute("class","itemInputWrap");

		var div 	=	document.createElement("DIV");
			if(subTaskJson && subTaskJson.usetaskdeadline){
				generateCheckboxList(div,"class:subtaskdeadinecheckbox",[{"name":"Use task deadline.","value":"","default":1}],"setDateOfTask(this)");
			}else{
				generateCheckboxList(div,"class:subtaskdeadinecheckbox",[{"name":"Use task deadline.","value":"","default":0}],"setDateOfTask(this)");
			}

			itemInputWrap.appendChild(div);

			var div		=	document.createElement("DIV");

				var input	=	document.createElement("INPUT");
				input.setAttribute("type","date");
				input.setAttribute("class","subTaskDeadline");

				if(subTaskJson && Number(subTaskJson.usetaskdeadline)==1){
					input.style.display	=	"none";
					setDateOfInput(input,new Date(document.getElementsByClassName("projectDeadline")[0].value).getTime());
				}else if(subTaskJson && Number(subTaskJson.usetaskdeadline)==0){
					if(subTaskJson.deadline){
						setDateOfInput(input,subTaskJson.deadline);
					}else{
						setDateOfInput(input,new Date().getTime());
					}
				}else{
					setDateOfInput(input,new Date().getTime());
				}

				div.appendChild(input);

			itemInputWrap.appendChild(div);
		
		itemWrap.appendChild(itemInputWrap);
	
	subTask.appendChild(itemWrap);
	//End Deadline
	
	//Budgeted Hours
	var itemWrap	=	document.createElement("DIV");
	itemWrap.setAttribute("class","itemWrap");
	
		var itemTitle	=	document.createElement("DIV");
		itemTitle.setAttribute("class","itemTitle");
		itemTitle.innerHTML	=	"Budgeted hours:";
		itemWrap.appendChild(itemTitle);
		
		var itemInputWrap	=	document.createElement("DIV");
		itemInputWrap.setAttribute("class","itemInputWrap");
		
			var input	=	document.createElement("INPUT");
			input.setAttribute("class","subTaskBudgetedHours");
			input.setAttribute("type","number");
			if(subTaskJson && subTaskJson.budgetedhours){
				input.setAttribute("value",Number(subTaskJson.budgetedhours));
			}
			itemInputWrap.appendChild(input);
		itemWrap.appendChild(itemInputWrap);
		
		var itemNote	=	document.createElement("DIV");
		itemNote.setAttribute("class","itemNote");
		itemNote.innerHTML="hours";
		itemWrap.appendChild(itemNote);
	
	subTask.appendChild(itemWrap);
	//End Budgeted Hours
	
	//Team
	/*var itemWrap	=	document.createElement("DIV");
	itemWrap.setAttribute("class","itemWrap");
		
		var itemTitle	=	document.createElement("DIV");
		itemTitle.setAttribute("class","itemTitle");
		itemTitle.setAttribute("style","vertical-align:top");
		itemTitle.innerHTML	=	"Team:";
		itemWrap.appendChild(itemTitle);
		
		var itemInputWrap	=	document.createElement("DIV");
		itemInputWrap.setAttribute("class","itemInputWrap");
		
		var team	=	[];
		for(var i=0;i<infoForPage.team.length;i++){
			var teamElem	=	{};
			teamElem.name	=	infoForPage.team[i].name.toString();
			teamElem.value	=	infoForPage.team[i].code.toString();
			team.push(teamElem);
		}
		
		if(subTaskJson && subTaskJson.team){
			for(var i=0;i<subTaskJson.team.length;i++){
				for(var j=0;j<team.length;j++){
					if(subTaskJson.team[i]==team[j].value){
						team[j].default=1
					}
				}
			}
		}
		generateCheckboxList(itemInputWrap,"class:team",team);
		itemWrap.appendChild(itemInputWrap);
		
		var itemNote	=	document.createElement("DIV");
		itemNote.setAttribute("class","itemNote");
		itemWrap.appendChild(itemNote);
	
	subTask.appendChild(itemWrap);*/
	//End Team
	
	
	//Description
	var itemWrap	=	document.createElement("DIV");
	itemWrap.setAttribute("class","itemWrap");
		
		var itemTitle	=	document.createElement("DIV");
		itemTitle.setAttribute("class","itemTitle");
		itemTitle.innerHTML	=	"Description:";
		itemWrap.appendChild(itemTitle);
		
		var itemInputWrap	=	document.createElement("DIV");
		itemInputWrap.setAttribute("class","itemInputWrap");
		
			var textarea	=	document.createElement("TEXTAREA");
			textarea.setAttribute("class","subTaskDescription");
			if(subTaskJson && subTaskJson.description){
				textarea.innerHTML=subTaskJson.description;
			}
			itemInputWrap.appendChild(textarea);
		itemWrap.appendChild(itemInputWrap);
		
		var itemNote	=	document.createElement("DIV");
		itemNote.setAttribute("class","itemNote");
		itemWrap.appendChild(itemNote);
	
	subTask.appendChild(itemWrap);
	//End Description
	
	
	subTasksWrap.appendChild(subTask);
	
	if(elem!=""){
		var singleButtonWrap	=	document.createElement("DIV");
		singleButtonWrap.setAttribute("class","singleButtonWrap");
		
		var button	=	document.createElement("DIV");
		button.setAttribute("class","clickableButton");
		button.innerHTML="Add SubTask";
		button.setAttribute("onclick","addSubTask(this,this.parentElement.parentElement,{})");
		
		singleButtonWrap.appendChild(button);
		subTasksWrap.appendChild(singleButtonWrap);
	}
}


function addExtraButton(buttonJson){
	if(buttonJson){
		var tr	=	document.createElement("TR");
			var td	=	document.createElement("TD");
			td.innerHTML="<input type='text' class='extraButtonNameInput' value='"+buttonJson.caption+"'>"
			tr.appendChild(td);
			
			var td	=	document.createElement("TD");
			td.innerHTML="<input type='text' class='extraButtonUrlInput' value='"+buttonJson.url+"'>"
			tr.appendChild(td);
		document.getElementsByClassName("extraButtonsTable")[0].appendChild(tr);
	}else{
		var tr	=	document.createElement("TR");
			var td	=	document.createElement("TD");
			td.innerHTML="<input type='text' class='extraButtonNameInput'>"
			tr.appendChild(td);
			
			var td	=	document.createElement("TD");
			td.innerHTML="<input type='text' class='extraButtonUrlInput'>"
			tr.appendChild(td);
		document.getElementsByClassName("extraButtonsTable")[0].appendChild(tr);
	}
}


function submitProject(){
	
	var wrap	=	document.getElementById("project-edit");
	
	if(wrap.querySelectorAll(".projectName")[0].value==""){
		openLightbox("No project Name provided",[],"document.getElementById('project-edit').querySelectorAll('.projectName')[0].scrollIntoView({behavior: 'smooth'})");
	}else{
		var projectJson				=	{};
		projectJson.code			=	wrap.dataset.code;
		//Company
		projectJson.company			=	wrap.querySelectorAll(".projectCompany")[0].value;
		//Filetype
		projectJson.filetype		=	"projectinfo";
		//Name
		projectJson.dispname		=	wrap.querySelectorAll(".projectName")[0].value;
		//Created Date
		projectJson.createddate		=	new Date().getTime();
		//Team
		/*projectJson.team	=	[];
		for(var i=0;i<wrap.querySelectorAll(".team")[0].querySelectorAll(".checkbox").length;i++){
			if(Number(wrap.querySelectorAll(".team")[0].querySelectorAll(".checkbox")[i].dataset.active)==1){
				projectJson.team.push(wrap.querySelectorAll(".team")[0].querySelectorAll(".checkbox")[i].dataset.value)
			}
		}*/
		//Start date
		projectJson.startdate	=	Number(new Date(wrap.querySelectorAll(".projectStart")[0].value).getTime());
		
		//Deadline
		projectJson.deadline	=	Number(new Date(wrap.querySelectorAll(".projectDeadline")[0].value).getTime());
		
		//Finished
		projectJson.finished			=	Number(wrap.querySelectorAll(".finished")[0].querySelectorAll(".checkbox")[0].dataset.active)
		
		//Finished Date
		if(projectJson.finished==1){
			projectJson.finisheddate	=	Number(new Date(wrap.querySelectorAll(".projectFinishedDate")[0].value).getTime());
		}

		//Hidden
		projectJson.hidden				=	Number(wrap.querySelectorAll(".hidden")[0].querySelectorAll(".checkbox")[0].dataset.active);
		
		//Budgeted Hours
		projectJson.budgetedhours		=	wrap.querySelectorAll(".budgetedHours")[0].value;
		
		//Description
		projectJson.description			=	wrap.querySelectorAll(".projectDescription")[0].value;
		
		//Extra Buttons
		projectJson.extrabuttons	=	[];
		for(var i=0;i<document.getElementsByClassName("extraButtonUrlInput").length;i++){
			if(document.getElementsByClassName("extraButtonUrlInput")[i].value){
				var buttonObject	=	{};
				buttonObject.caption	=	document.getElementsByClassName("extraButtonNameInput")[i].value;
				buttonObject.url		=	document.getElementsByClassName("extraButtonUrlInput")[i].value;
				projectJson.extrabuttons.push(buttonObject);
			}
		}
		
		//Tasks
		projectJson.tasks	=	[];
		var tasksElem	=	wrap.querySelectorAll(".tasks")[0];
		for(var i=0;i<tasksElem.querySelectorAll(".task").length;i++){
			var taskElem	=	tasksElem.querySelectorAll(".task")[i];
			var taskJson	=	{};
			//Task Name
			if(taskElem.querySelectorAll(".taskName")[0].value==""){
				continue;
			}else{
				taskJson.title	=	taskElem.querySelectorAll(".taskName")[0].value;
			}
			
			//Task Deadline
			taskJson.useprojectdeadline	=	Number(taskElem.querySelectorAll(".taskdeadlinecheckbox")[0].querySelectorAll(".checkbox")[0].dataset.active);
			taskJson.deadline			=	Number(new Date(taskElem.querySelectorAll(".taskDeadline")[0].value).getTime());
			
			//Task Budgeted Hours
			taskJson.budgetedhours	=	taskElem.querySelectorAll(".taskBudgetedHours")[0].value;
			
			//Team
			/*taskJson.team	=	[];
			for(var j=0;j<taskElem.querySelectorAll(".team")[0].querySelectorAll(".checkbox").length;j++){
				
				if(Number(taskElem.querySelectorAll(".team")[0].querySelectorAll(".checkbox")[j].dataset.active)==1){
					taskJson.team.push(taskElem.querySelectorAll(".team")[0].querySelectorAll(".checkbox")[j].dataset.value)
				}
			}*/
			
			//Description
			taskJson.description	=	taskElem.querySelectorAll(".taskDescription")[0].value;
			
			//Subtasks
			var subTasksElem		=	taskElem.querySelectorAll(".subTasks")[0];
			taskJson.subTasks		=	[];
			for(var j=0;j<subTasksElem.querySelectorAll(".subTask").length;j++){
				var subTaskElem		=	subTasksElem.querySelectorAll(".subTask")[j];
				var subTaskJson		=	{};
				//SubTask Name
				if(subTaskElem.querySelectorAll(".subTaskName")[0].value==""){
					continue;
				}else{
					subTaskJson.title		=	subTaskElem.querySelectorAll(".subTaskName")[0].value;
				}
				
				//SubTask Deadline
				subTaskJson.usetaskdeadline	=	Number(subTaskElem.querySelectorAll(".subtaskdeadinecheckbox")[0].querySelectorAll(".checkbox")[0].dataset.active);
				subTaskJson.deadline		=	Number(new Date(subTaskElem.querySelectorAll(".subTaskDeadline")[0].value).getTime());
			
				//Task Budgeted Hours
				subTaskJson.budgetedhours	=	subTaskElem.querySelectorAll(".subTaskBudgetedHours")[0].value;
				
				//Team
				/*subTaskJson.team			=	[];
				for(var k=0;k<subTaskElem.querySelectorAll(".team")[0].querySelectorAll(".checkbox").length;k++){
					if(Number(subTaskElem.querySelectorAll(".team")[0].querySelectorAll(".checkbox")[k].dataset.active)==1){
						subTaskJson.team.push(subTaskElem.querySelectorAll(".team")[0].querySelectorAll(".checkbox")[k].dataset.value)
					}
				}*/
				
				//Description
				subTaskJson.description		=	subTaskElem.querySelectorAll(".subTaskDescription")[0].value;
				
				taskJson.subTasks.push(subTaskJson);
			}
			projectJson.tasks.push(taskJson);
		}
	}

	document.getElementById("project-input-form").value	=	JSON.stringify(projectJson);
	urlObject.projectscroll	=	Number(document.getElementById("projects").scrollTop);
	var keys				=	Object.keys(urlObject);
	var queryString			=	"?";
	for(var i=0;i<keys.length;i++){
		queryString 		+=	keys[i] + "=" + urlObject[keys[i]] + "&";
	}
	queryString			=	queryString.substring(0,queryString.length-1);
	document.getElementById("url-query").value	=	queryString;
	document.getElementById("post-project-form").submit();
}

function duplicateProject(){
	var wrap	=	document.getElementById("project-edit");
	var projectJson				=	{};
	projectJson.code			=	wrap.dataset.code+"-"+generateId(4);
	//Company
	projectJson.company			=	wrap.querySelectorAll(".projectCompany")[0].value;
	//Filetype
	projectJson.filetype		=	"projectinfo";
	//Name
	projectJson.dispname		=	wrap.querySelectorAll(".projectName")[0].value+"-Copy";
	//Created Date
	projectJson.createddate		=	new Date().getTime();
	//Team
	/*projectJson.team	=	[];
	for(var i=0;i<wrap.querySelectorAll(".team")[0].querySelectorAll(".checkbox").length;i++){
		if(Number(wrap.querySelectorAll(".team")[0].querySelectorAll(".checkbox")[i].dataset.active)==1){
			projectJson.team.push(wrap.querySelectorAll(".team")[0].querySelectorAll(".checkbox")[i].dataset.value)
		}
	}*/
	//Start date
	projectJson.startdate	=	Number(new Date(wrap.querySelectorAll(".projectStart")[0].value).getTime());
	
	//Deadline
	projectJson.deadline	=	Number(new Date(wrap.querySelectorAll(".projectDeadline")[0].value).getTime());
	
	//Finished
	projectJson.finished			=	Number(wrap.querySelectorAll(".finished")[0].querySelectorAll(".checkbox")[0].dataset.active)
	
	//Finished Date
	if(projectJson.finished==1){
		projectJson.finisheddate	=	Number(new Date(wrap.querySelectorAll(".projectFinishedDate")[0].value).getTime());
	}

	//Hidden
	projectJson.hidden				=	Number(wrap.querySelectorAll(".hidden")[0].querySelectorAll(".checkbox")[0].dataset.active);
	
	//Budgeted Hours
	projectJson.budgetedhours		=	wrap.querySelectorAll(".budgetedHours")[0].value;
	
	//Description
	projectJson.description			=	wrap.querySelectorAll(".projectDescription")[0].value;
	
	//Extra Buttons
	projectJson.extrabuttons	=	[];
	for(var i=0;i<document.getElementsByClassName("extraButtonUrlInput").length;i++){
		if(document.getElementsByClassName("extraButtonUrlInput")[i].value){
			var buttonObject	=	{};
			buttonObject.caption	=	document.getElementsByClassName("extraButtonNameInput")[i].value;
			buttonObject.url		=	document.getElementsByClassName("extraButtonUrlInput")[i].value;
			projectJson.extrabuttons.push(buttonObject);
		}
	}
	
	//Tasks
	projectJson.tasks	=	[];
	var tasksElem	=	wrap.querySelectorAll(".tasks")[0];
	for(var i=0;i<tasksElem.querySelectorAll(".task").length;i++){
		var taskElem	=	tasksElem.querySelectorAll(".task")[i];
		var taskJson	=	{};
		//Task Name
		if(taskElem.querySelectorAll(".taskName")[0].value==""){
			continue;
		}else{
			taskJson.title	=	taskElem.querySelectorAll(".taskName")[0].value;
		}
		
		//Task Deadline
		taskJson.useprojectdeadline	=	Number(taskElem.querySelectorAll(".taskdeadlinecheckbox")[0].querySelectorAll(".checkbox")[0].dataset.active);
		taskJson.deadline			=	Number(new Date(taskElem.querySelectorAll(".taskDeadline")[0].value).getTime());
		
		//Task Budgeted Hours
		taskJson.budgetedhours	=	taskElem.querySelectorAll(".taskBudgetedHours")[0].value;
		
		//Team
		/*taskJson.team	=	[];
		for(var j=0;j<taskElem.querySelectorAll(".team")[0].querySelectorAll(".checkbox").length;j++){
			
			if(Number(taskElem.querySelectorAll(".team")[0].querySelectorAll(".checkbox")[j].dataset.active)==1){
				taskJson.team.push(taskElem.querySelectorAll(".team")[0].querySelectorAll(".checkbox")[j].dataset.value)
			}
		}*/
		
		//Description
		taskJson.description	=	taskElem.querySelectorAll(".taskDescription")[0].value;
		
		//Subtasks
		var subTasksElem		=	taskElem.querySelectorAll(".subTasks")[0];
		taskJson.subTasks		=	[];
		for(var j=0;j<subTasksElem.querySelectorAll(".subTask").length;j++){
			var subTaskElem		=	subTasksElem.querySelectorAll(".subTask")[j];
			var subTaskJson		=	{};
			//SubTask Name
			if(subTaskElem.querySelectorAll(".subTaskName")[0].value==""){
				continue;
			}else{
				subTaskJson.title		=	subTaskElem.querySelectorAll(".subTaskName")[0].value;
			}
			
			//SubTask Deadline
			subTaskJson.usetaskdeadline	=	Number(subTaskElem.querySelectorAll(".subtaskdeadinecheckbox")[0].querySelectorAll(".checkbox")[0].dataset.active);
			subTaskJson.deadline		=	Number(new Date(subTaskElem.querySelectorAll(".subTaskDeadline")[0].value).getTime());
		
			//Task Budgeted Hours
			subTaskJson.budgetedhours	=	subTaskElem.querySelectorAll(".subTaskBudgetedHours")[0].value;
			
			//Team
			/*subTaskJson.team			=	[];
			for(var k=0;k<subTaskElem.querySelectorAll(".team")[0].querySelectorAll(".checkbox").length;k++){
				if(Number(subTaskElem.querySelectorAll(".team")[0].querySelectorAll(".checkbox")[k].dataset.active)==1){
					subTaskJson.team.push(subTaskElem.querySelectorAll(".team")[0].querySelectorAll(".checkbox")[k].dataset.value)
				}
			}*/
			
			//Description
			subTaskJson.description		=	subTaskElem.querySelectorAll(".subTaskDescription")[0].value;
			
			taskJson.subTasks.push(subTaskJson);
		}
		projectJson.tasks.push(taskJson);
	}
	document.getElementById("project-duplicate-form").value	=	JSON.stringify(projectJson);
	urlObject.projectscroll	=	Number(document.getElementById("projects").scrollTop);
	urlObject.lastproject	=	projectJson.code;
	var keys				=	Object.keys(urlObject);
	var queryString			=	"?";
	for(var i=0;i<keys.length;i++){
		queryString 		+=	keys[i] + "=" + urlObject[keys[i]] + "&";
	}
	queryString			=	queryString.substring(0,queryString.length-1);
	document.getElementById("url-query-dup").value	=	queryString;
	document.getElementById("duplicate-project-form").submit();
	
}

function setDateOfTask(elem){
	var dateinput 			=	elem.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelectorAll('input[type="date"]')[0];
	if(Number(elem.dataset.active)==1){
		//Use the date of project start
		dateinput.style.display	=	"none";

	}else{
		dateinput.style.display	=	"block";	
	}
	
}

function showProject(projectCode){
	var project			=	false;
	for(var i=0;i<infoForPage.projects.length;i++){
		if(projectCode==infoForPage.projects[i].code){
			project		=	JSON.parse(JSON.stringify(infoForPage.projects[i]));
			break;
		}
	}
	if(project){
		document.getElementById("project-edit").dataset.code			=	project.code;
		document.getElementsByClassName("pageSubtitle")[0].innerHTML	=	project.dispname;
		for(var i=0;i<document.getElementById("projects").getElementsByClassName("whiteButton").length;i++){
			if(project.code==document.getElementById("projects").getElementsByClassName("whiteButton")[i].dataset.projectcode){
				document.getElementById("projects").getElementsByClassName("whiteButton")[i].classList.add("whiteButtonActive")
			}
		}

		document.getElementsByClassName("projectCompany")[0].value		=	project.company;
		document.getElementById("project-edit").getElementsByClassName("projectName")[0].value			=	project.dispname;
		/*var team	=	[];
		for(var i=0;i<infoForPage.team.length;i++){
			var teamElem	=	{};
			teamElem.name	=	infoForPage.team[i].name.toString();
			teamElem.value	=	infoForPage.team[i].code.toString();
			team.push(teamElem);
		}
		for(var i=0;i<project.team.length;i++){
			for(var j=0;j<team.length;j++){
				if(project.team[i]==team[j].value){
					team[j].default=1
				}
			}
		}	
		generateCheckboxList(document.getElementsByClassName("projectTeamWrap")[0],"class:team",team);*/
		setDateOfInput(document.getElementsByClassName("projectStart")[0],project.startdate);
		setDateOfInput(document.getElementsByClassName("projectDeadline")[0],project.deadline);
		generateCheckboxList(document.getElementsByClassName("projectFinishedWrap")[0],"class:finished",[{"name":"","value":1,"default":project.finished}],"markFinished(this)");
		if(project.finisheddate){
			setDateOfInput(document.getElementsByClassName("projectFinishedDate")[0],project.finisheddate);
		}else{
			setDateOfInput(document.getElementsByClassName("projectFinishedDate")[0],project.deadline);
		}
		if(Number(project.finished)==1){
			document.getElementById("finished-date").style.display="block";
		}else{
			document.getElementById("finished-date").style.display="none";
		}
		
		generateCheckboxList(document.getElementsByClassName("projectHiddenWrap")[0],"class:hidden",[{"name":"","value":1,"default":project.hidden}]);
		document.getElementsByClassName("budgetedHours")[0].value			=	project.budgetedhours;
		document.getElementsByClassName("projectDescription")[0].value		=	project.description;

		document.getElementsByClassName("extraButtonsTable")[0].innerHTML	=	"";
		var tr	=	document.createElement("TR");
			var th 	=	document.createElement("TH");
			th.innerHTML	=	"Caption";
			tr.appendChild(th);

			var th 	=	document.createElement("TH");
			th.innerHTML	=	"URL";
			tr.appendChild(th);
		document.getElementsByClassName("extraButtonsTable")[0].appendChild(tr);
		if(project.extrabuttons){
			for(var i=0;i<project.extrabuttons.length;i++){
				addExtraButton(project.extrabuttons[i]);
			}
		}

		document.getElementsByClassName("tasks")[0].innerHTML			=	"";
		if(project.tasks.length==0){
			addTask("",document.getElementsByClassName("tasks")[0],"",true);
		}
		for(var i=0;i<project.tasks.length;i++){
			if(i!=project.tasks.length-1){
				addTask("",document.getElementsByClassName("tasks")[0],project.tasks[i],false);
			}else{
				addTask("",document.getElementsByClassName("tasks")[0],project.tasks[i],true);
			}
		}
	}else{
		document.getElementById("project-edit").dataset.code			=	0;
		document.getElementsByClassName("pageSubtitle")[0].innerHTML	=	"Adding a new project";
		for(var i=0;i<document.getElementById("projects").getElementsByClassName("whiteButton").length;i++){
			document.getElementById("projects").getElementsByClassName("whiteButton")[i].classList.remove("whiteButtonActive")
		}

		document.getElementsByClassName("projectCompany")[0].value		=	"";
		document.getElementById("project-edit").getElementsByClassName("projectName")[0].value			=	"";
		/*var team	=	[];
		for(var i=0;i<infoForPage.team.length;i++){
			var teamElem	=	{};
			teamElem.name	=	infoForPage.team[i].name.toString();
			teamElem.value	=	infoForPage.team[i].code.toString();
			team.push(teamElem);
		}
		generateCheckboxList(document.getElementsByClassName("projectTeamWrap")[0],"class:team",team);*/
		setDateOfInput(document.getElementsByClassName("projectStart")[0],new Date().getTime());
		setDateOfInput(document.getElementsByClassName("projectDeadline")[0],new Date().getTime());
		generateCheckboxList(document.getElementsByClassName("projectFinishedWrap")[0],"class:finished",[{"name":"","value":1,"default":0}]);
		generateCheckboxList(document.getElementsByClassName("projectHiddenWrap")[0],"class:hidden",[{"name":"","value":1,"default":0}]);
		document.getElementsByClassName("budgetedHours")[0].value		=	0;
		document.getElementsByClassName("projectDescription")[0].value	=	"";

		document.getElementsByClassName("extraButtonsTable")[0].innerHTML	=	"";
		var tr	=	document.createElement("TR");
			var th 	=	document.createElement("TH");
			th.innerHTML	=	"Caption";
			tr.appendChild(th);

			var th 	=	document.createElement("TH");
			th.innerHTML	=	"URL";
			tr.appendChild(th);
		document.getElementsByClassName("extraButtonsTable")[0].appendChild(tr);
		addExtraButton();

		document.getElementsByClassName("tasks")[0].innerHTML	=	"";
		addTask("",document.getElementsByClassName("tasks")[0],"",true);
	}
	console.log(project)
}

function markFinished(elem){
	if(Number(elem.dataset.active)==1){
		document.getElementById("finished-date").style.display="block";
	}else if(Number(elem.dataset.active==0)){
		document.getElementById("finished-date").style.display="none";
	}
}
