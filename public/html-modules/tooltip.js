function showTooltip(html){
	if(html){
		document.getElementById("tooltip").style.display="block";
		document.getElementById("tooltip").innerHTML=html;
		document.getElementById("tooltip").style.top=event.clientY+"px";
		document.getElementById("tooltip").style.left=event.clientX+"px";
	}
	
}

function hideTooltip(){
	document.getElementById("tooltip").style.display="none";
	document.getElementById("tooltip").innerHTML="";
	document.getElementById("tooltip").style.top="0px";
	document.getElementById("tooltip").style.left="0px";
}