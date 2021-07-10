function closeLightbox(){
	document.getElementById("lightbox").style.display="none";
	document.getElementById("lightbox-info").innerHTML="";
	document.getElementById("lightbox-buttons").innerHTML="";
}

function openLightbox(text,buttonJson,extraFun){
	document.getElementById("lightbox-info").innerHTML=text;
	if(buttonJson.length>0){
		
	}else{
		//Create Ok button
		var button	=	document.createElement("DIV");
		button.setAttribute("class","clickableButton2");
		if(extraFun){
			button.setAttribute("onclick",extraFun+";closeLightbox()")
		}else{
			button.setAttribute("onclick","closeLightbox()")
		}
		
		button.innerHTML="Ok";
		document.getElementById("lightbox-buttons").appendChild(button);
	}
	
	if(extraFun){
		document.getElementById("lightbox").setAttribute("onclick",extraFun+";closeLightbox()")
		document.getElementById("lightbox-close").setAttribute("onclick",extraFun+";closeLightbox()")
	}
	document.getElementById("lightbox").style.display="block";
}