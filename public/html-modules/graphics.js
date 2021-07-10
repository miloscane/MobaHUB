function flashRed(elem){
	elem.style.border="2px solid rgba(255,0,0,1)";
	elem.style.backgroundColor="rgba(255,0,0,1)";
	setTimeout(function(){
		elem.style.border="";
		elem.style.backgroundColor="";
	},200);
	setTimeout(function(){
		elem.style.border="2px solid rgba(255,0,0,1)";
		elem.style.backgroundColor="rgba(255,0,0,1)";
	},400);
	setTimeout(function(){
		elem.style.border="";
		elem.style.backgroundColor="";
	},600);
	
}

function flashGreen(elem){
	elem.style.border="2px solid rgba(0,255,0,1)";
	elem.style.backgroundColor="rgba(0,255,0,1)";
	setTimeout(function(){
		elem.style.border="";
		elem.style.backgroundColor="";
	},200);
	setTimeout(function(){
		elem.style.border="2px solid rgba(0,255,0,1)";
		elem.style.backgroundColor="rgba(0,255,0,1)";
	},400);
	setTimeout(function(){
		elem.style.border="";
		elem.style.backgroundColor="";
	},600);
	
}