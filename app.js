//Server
var server				=	require('express')();
var http				=	require('http').Server(server);
var net					=	require('net');
var io					=	require('socket.io')(http);
var express				=	require('express');
var fs					=	require('fs');
var bodyParser			=	require('body-parser');
var session				=	require('express-session');
var cookieParser		=	require('cookie-parser');
var crypto				=	require('crypto');
var mongo				=	require('mongodb');
var nodemailer			=	require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
var dripClient 			= 	require('drip-nodejs')(
  {
    token: process.env.driptoken,
    accountId: process.env.dripaccountid
    
  }
);
const campaignId = process.env.dripcampaign;

var mongoClient	=	mongo.MongoClient;
var url	=	process.env.mongourl;

server.set('view engine','ejs');
server.set('views', [__dirname + '/views',__dirname + '/views']);
server.use(express.static(__dirname + '/public'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(session({
	secret: process.env.sessionsecret,
    resave: true,
    saveUninitialized: true
}));

var transporter = nodemailer.createTransport({
	host: process.env.transporterhost,
	port: 465,
	secure: true,
	auth: {
		user: process.env.transporteruser,
		pass: process.env.transporterpass
	}
});


function generateId(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
		result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
	}
   return result.join('');
}

var mailOptions = {
	from: '"Mobatec License Server" <do_not_reply@mobatec.nl>',
	to: 'miloscane@gmail.com,milos@mobatec.nl',
	subject: 'test',
	html: 'test message'
};
	
/*transporter.sendMail(mailOptions, (error, info) => {
	if (error) {
		return console.log(error);
	}
	console.log('Message sent: %s', info.messageId);
	console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
});*/

//Check what emails to set up
mongoClient.connect(url,{useUnifiedTopology: true},function(err,client){
	if(err){
		console.log(err)
	}else{
		var collection	=	client.db('MobaHub').collection('Calendar');
		collection.find({}).toArray(function(err,calendarItems){
			if(err){
				console.log(err) 
			}else{
				var today				=	new Date();
				var collection2			=	client.db('MobaHub').collection('Emails');
				var	emailsToConstruct	=	[];
				collection2.find({}).toArray(function(err,emailItems){
					for(var i=0;i<calendarItems.length;i++){
						var calendarItem				=	JSON.parse(JSON.stringify(calendarItems[i]));
						var calendarItemDate			=	new Date(today.getFullYear(),calendarItem.month-1,calendarItem.day);
						if( eval(calendarItemDate.getTime()-today.getTime()) < 1.21e+9 && eval(calendarItemDate.getTime()-today.getTime())>0){
							var emailConstructor		=	{};
							emailConstructor.filetype	=	"email";
							switch(calendarItem.filetype) {
								case "holiday":
									emailConstructor.subject		=	"MobaHUB: Holiday approaching";
									emailConstructor.text			=	"Hello,<br>"+
																		calendarItem.country+" holiday is on "+ calendarItemDate.getDate()+"-"+
																		eval(calendarItemDate.getMonth()+1)+"-"+calendarItemDate.getFullYear()+".<br>"+
																		"&nbsp;<br> Happy holiday :)<br>&nbsp;<br>"+
																		"Kind regards,<br>MobaHUB System message";
									emailConstructor.senddate		=	new Date(calendarItemDate.getTime()-6.048e+8).getTime()
									emailConstructor.sendshowdate	=	new Date(emailConstructor.senddate).getDate()+"-"+
																		(new Date(emailConstructor.senddate).getMonth()+1)+"-"+
																		new Date(emailConstructor.senddate).getFullYear();
									emailConstructor.sent			=	false;
									emailConstructor.type			=	calendarItem.filetype;
									emailConstructor.actualdate		=	calendarItemDate.getTime();
									emailConstructor.showactualdate	=	calendarItemDate.getDate()+"-"+eval(calendarItemDate.getMonth()+1)+
																		"-"+calendarItemDate.getFullYear();
									emailConstructor.id				=	calendarItem.filetype+"-"+calendarItem.name //Use this to identify if email notification already exists
									break;
							}
							var emailExists		=	false;
							for(var j=0;j<emailItems.length;j++){
								if(emailItems[j].id==emailConstructor.id){
									emailExists	=	true;
									break;
								}
							}
							if(!emailExists){
								emailsToConstruct.push(emailConstructor);
							}
						}

					}
					if(emailsToConstruct.length>0){
						collection2.insertMany(emailsToConstruct,function(err,archived){
							if(err){
								console.log(err)
							}else{
								client.close();
							}
						});
					}else{
						client.close();
					}
					
				});
			}
		});
	}
});

//Clean up sent emails

//see what emails to send












http.listen(process.env.PORT , function(){
  console.log('Server Started');
});

require('events').EventEmitter.prototype._maxListeners = 0;

function hashString(string){
	var hash	=	crypto.createHash('md5').update(string).digest('hex')
	return hash
}

server.get('/login',function(req,res){
	if(req.session.user){
		res.redirect('/');
	}else{
		if(req.query.url){
			res.render('login',{
				url:	decodeURIComponent(req.query.url)
			});
		}else{
			res.render('login',{});
		}
		
	}
});


server.post('/login',function(req,res){
	var email		=	req.body.username.toLowerCase();
	var password	=	hashString(req.body.password);
	mongoClient.connect(url,{useUnifiedTopology: true},function(err,client){
		if(err){
			console.log(err)
		}else{
			var collection	=	client.db('MobaHub').collection('Users');
			collection.find({emails:email}).toArray(function(err,result){
				if(err){
					console.log(err)
				}else{
					if(result.length>0){
						if(password==result[0].password){
							var sessionObject	=	JSON.parse(JSON.stringify(result[0]));
							delete sessionObject.password;
							req.session.user	=	sessionObject;
							if(req.body.url){
								res.redirect(req.body.url);
							}else{
								res.redirect('/home');
							}
						}else{
							res.redirect('/failed-login');
						}
					}else{
						res.redirect('/failed-login');
					}
					client.close();
				}
			});
		}
	});
});

server.get('/failed-login',function(req,res){
	res.render('message',{
		message: "Log IN failed<br><div class='clickableButton2'><a href='/login'>Try Again</a></div>"
	});
});

server.get('/android-failed-login',function(req,res){
	res.render('message',{
		message: "Log IN failed<br>Close the app and reopen it to try again.</div>"
	});
});

server.get('/android-login/:deviceId/:deviceName',function(req,res){
	if(req.session.user){
		delete req.session.user;
	}
	var deviceId	=	req.params.deviceId.toString();
	var deviceName	=	decodeURIComponent(req.params.deviceName);
	mongoClient.connect(url,{useUnifiedTopology: true},function(err,client){
		if(err){
			console.log(err)
		}else{
			var collection	=	client.db('MobaHub').collection('Users');
			collection.find({devices: {$elemMatch: {id:deviceId} }}).toArray(function(err,result){
				if(err){
					console.log(err)
				}else{
					if(result.length>0){
						//Log in the user
						var sessionObject	=	JSON.parse(JSON.stringify(result[0]));
						delete sessionObject.password;
						req.session.user	=	sessionObject;
						res.redirect('/home');
					}else{
						res.render('android-login',{
							deviceId: deviceId, 
							deviceName: deviceName 
						});
					}
					client.close();
				}
			});
		}
	});	
});


server.post('/android-login',function(req,res){
	var email		=	req.body.email.toLowerCase();
	var password	=	hashString(req.body.password);
	mongoClient.connect(url,{useUnifiedTopology: true},function(err,client){
		if(err){
			console.log(err)
		}else{
			var collection	=	client.db('MobaHub').collection('Users');
			collection.find({emails:email}).toArray(function(err,result){
				if(err){
					console.log(err)
				}else{
					if(result.length>0){
						if(password==result[0].password){
							var sessionObject	=	JSON.parse(JSON.stringify(result[0]));
							delete sessionObject.password;
							req.session.user	=	sessionObject;

							if(req.body.devicename!=""){
								var collection2	=	client.db('MobaHub').collection('Users');
								var deviceArray	=	JSON.parse(JSON.stringify(result[0].devices));
								var deviceObj	=	{};
								deviceObj.id	=	req.body.deviceid;
								deviceObj.name	=	req.body.devicename;
								deviceArray.push(deviceObj);
								
								var setObj	=	{ $addToSet: {devices:deviceObj}};
								collection2.updateOne({emails:email},setObj, (err , collection) => {
									if(err){
										console.log(err)
									}else{
										res.redirect('/home');
									}
									client.close();
								});
							}else{
								res.redirect('/home');
							}
							
						}else{
							res.redirect('/android-failed-login');
						}
					}else{
						res.redirect('/android-failed-login');
					}
				}
			});
		}
	});
});

server.get('/not-logged-in',function(req,res){
	var query	=	encodeURIComponent(req.query.url);
	if(req.session.user){
		res.redirect('/home');
	}else{
		res.render('message',{
			message: "You are not logged in. <br><div class='clickableButton2'><a href='/login?url="+query+"'>Log IN</a></div>"
		});
	}
});

server.get('/weekly-input',function(req,res){
	if(req.session.user){

		mongoClient.connect(url,{useUnifiedTopology: true},function(err,client){
			if(err){
				console.log(err)
			}else{
				var users	=	client.db('MobaHub').collection('Users');
				users.find({filetype:"userinfo"}).toArray(function(err,result){
					if(err){
						console.log(err)
					}else{
						var infoForPage			=	{};
						infoForPage.user		=	req.session.user.code;
						infoForPage.team		=	[];
						infoForPage.projects	=	[];
						infoForPage.settings 	=	JSON.parse(JSON.stringify(req.session.user.settings));
						for(var i=0;i<result.length;i++){
							var teamJson		=	{};
							teamJson.name		=	result[i].name;
							teamJson.code		=	result[i].code;
							teamJson.role		=	result[i].role;
							teamJson.abrv		=	result[i].abrv;
							teamJson.emails		=	JSON.parse(JSON.stringify(result[i].emails));
							infoForPage.team.push(teamJson);
						}
						var projects	=	client.db('MobaHub').collection('Projects');
						projects.find({filetype:"projectinfo"}).toArray(function(err,projectsInfo){
							for(var i=0;i<projectsInfo.length;i++){
								infoForPage.projects.push(projectsInfo[i]);
							}
							var projectHours	=	client.db('MobaHub').collection('Hours');
							projectHours.find({}).toArray(function(err,hours){
								for(var i=0;i<infoForPage.projects.length;i++){
									infoForPage.projects[i].spenthours	=	0;
									for(var j=0;j<hours.length;j++){
										if(infoForPage.projects[i].code==hours[j].pcode){
											infoForPage.projects[i].spenthours	+=	Number(hours[j].hours);
										}
									}

									for(var j=0;j<infoForPage.projects[i].tasks.length;j++){
										infoForPage.projects[i].tasks[j].spenthours	=	0;
										for(var k=0;k<hours.length;k++){
											if(infoForPage.projects[i].tasks[j].title==hours[k].task && infoForPage.projects[i].code==hours[k].pcode){
												infoForPage.projects[i].tasks[j].spenthours	+=	Number(hours[k].hours);
											}
										}
										for(var k=0;k<infoForPage.projects[i].tasks[j].subTasks.length;k++){
											infoForPage.projects[i].tasks[j].subTasks[k].spenthours	=	0;
											for(var l=0;l<hours.length;l++){
												if(infoForPage.projects[i].tasks[j].title==hours[l].task && infoForPage.projects[i].tasks[j].subTasks[k].title==hours[l].subtask && infoForPage.projects[i].code==hours[l].pcode){
													infoForPage.projects[i].tasks[j].subTasks[k].spenthours	+=	Number(hours[l].hours);
												}
											}
										}
									}
								}
								client.close();
								res.render('weekly-input',{
									infoForPage:	infoForPage,
									hours:			hours
								});

							})
						});

					}
				});
			}
		});
	}else{
		res.redirect('/not-logged-in?url='+encodeURIComponent(req.url));
	}
});

server.post('/postHours',function(req,res){
	if(req.session.user){
		var hoursToPost			=	JSON.parse(req.body.hours);
		var urlQuery			=	req.body.urlquery;
		var filterArray			=	[];
		for(var i=0;i<hoursToPost.length;i++){
			var filterObject		=	{};
			filterObject.showdate	=	hoursToPost[i].showdate;
			filterObject.engcode	=	hoursToPost[i].engcode;
			filterObject.pcode		=	hoursToPost[i].pcode;
			filterObject.task		=	hoursToPost[i].task;
			filterObject.subtask	=	hoursToPost[i].subtask;
			filterObject.filetype	=	"hours";
			filterArray.push(filterObject);
		}
		req.session.tempData	=	JSON.parse(JSON.stringify(hoursToPost));
		mongoClient.connect(url,{useUnifiedTopology: true},function(err,client){
			if(err){
				console.log(err)
			}else{
				var users	=	client.db('MobaHub').collection('Users');
				users.find({filetype:"userinfo"}).toArray(function(err,result){
					if(err){
						console.log(err)
					}else{
						var infoForPage			=	{};
						infoForPage.user		=	req.session.user.code;
						infoForPage.team		=	[];
						infoForPage.projects	=	[];
						infoForPage.settings 	=	JSON.parse(JSON.stringify(req.session.user.settings));
						for(var i=0;i<result.length;i++){
							var teamJson		=	{};
							teamJson.name		=	result[i].name;
							teamJson.code		=	result[i].code;
							teamJson.role		=	result[i].role;
							teamJson.abrv		=	result[i].abrv;
							teamJson.emails		=	JSON.parse(JSON.stringify(result[i].emails));
							infoForPage.team.push(teamJson);
						}
						var projects	=	client.db('MobaHub').collection('Projects');
						projects.find({filetype:"projectinfo"}).toArray(function(err,projectsInfo){
							for(var i=0;i<projectsInfo.length;i++){
								infoForPage.projects.push(projectsInfo[i]);
							}
							var hoursToFind		=	client.db('MobaHub').collection('Hours');
							hoursToFind.find({$or:filterArray}).toArray(function(err,foundHours){
								if(err){
									console.log(err);
								}else{
									var idsToDelete	=	[];
									for(var i=0;i<foundHours.length;i++){
										var idToDelete 	=	{};
										idToDelete._id	=	foundHours[i]._id;
										idsToDelete.push(idToDelete);
									}
									for(var i=0;i<hoursToPost.length;i++){
										if(Number(hoursToPost[i].hours)==0){
											hoursToPost.splice(i,1);
										}
									}
									var archive	=	client.db('MobaHub').collection('Archive');
									archive.insertMany(foundHours,function(err,archived){
										if(hoursToPost.length>0){
											var collection2	=	client.db('MobaHub').collection('Hours');
											collection2.insertMany(hoursToPost,function(err,res2){
												if(err){
													console.log(err)
												}else{
													var collection3	=	client.db('MobaHub').collection('Hours');
													collection3.deleteMany({$or:idsToDelete},function(err,res3){
														client.close()
														res.redirect('/hoursSubmited'+urlQuery);
													});
												}
											});
										}else{
											var collection3	=	client.db('MobaHub').collection('Hours');
											collection3.deleteMany({$or:idsToDelete},function(err,res3){
												client.close()
												res.redirect('/hoursSubmited'+urlQuery);
											});
										}
									});
									
								}
							});
						});

					}
				});
			}
		});
	}else{
		res.redirect('/not-logged-in');
	}
});

server.get('/hoursSubmited',function(req,res){
	if(req.session.user){
		var hours				=	req.session.tempData;
		req.session.tempData	=	null;
		mongoClient.connect(url,{useUnifiedTopology: true},function(err,client){
			if(err){
				console.log(err)
			}else{
				var users		=	client.db('MobaHub').collection('Users');
				users.find({filetype:"userinfo"}).toArray(function(err,result){
					if(err){
						console.log(err)
					}else{
						var infoForPage			=	{};
						infoForPage.user		=	req.session.user.code;
						infoForPage.team		=	[];
						infoForPage.projects	=	[];
						infoForPage.settings 	=	JSON.parse(JSON.stringify(req.session.user.settings));
						for(var i=0;i<result.length;i++){
							var teamJson		=	{};
							teamJson.name		=	result[i].name;
							teamJson.code		=	result[i].code;
							teamJson.role		=	result[i].role;
							teamJson.abrv		=	result[i].abrv;
							teamJson.emails		=	JSON.parse(JSON.stringify(result[i].emails));
							infoForPage.team.push(teamJson);
						}
						var projects	=	client.db('MobaHub').collection('Projects');
						projects.find({filetype:"projectinfo"}).toArray(function(err,projectsInfo){
							for(var i=0;i<projectsInfo.length;i++){
								infoForPage.projects.push(projectsInfo[i]);
							}
							client.close();
							res.render('hours-submited',{
								infoForPage:	infoForPage,
								hours: 			hours 
							});
						});

					}
				});
			}
		});
	}else{
		res.redirect('/not-logged-in');
	}
});


server.get('/project-view',function(req,res){
	if(req.session.user){
		mongoClient.connect(url,{useUnifiedTopology: true},function(err,client){
			if(err){
				console.log(err)
			}else{
				var users	=	client.db('MobaHub').collection('Users');
				users.find({filetype:"userinfo"}).toArray(function(err,result){
					if(err){
						console.log(err)
					}else{
						var infoForPage			=	{};
						infoForPage.user		=	req.session.user.code;
						infoForPage.team		=	[];
						infoForPage.projects	=	[];
						infoForPage.settings 	=	JSON.parse(JSON.stringify(req.session.user.settings));
						for(var i=0;i<result.length;i++){
							var teamJson		=	{};
							teamJson.name		=	result[i].name;
							teamJson.code		=	result[i].code;
							teamJson.role		=	result[i].role;
							teamJson.abrv		=	result[i].abrv;
							teamJson.emails		=	JSON.parse(JSON.stringify(result[i].emails));
							infoForPage.team.push(teamJson);
						}
						var projects	=	client.db('MobaHub').collection('Projects');
						projects.find({filetype:"projectinfo"}).toArray(function(err,projectsInfo){
							for(var i=0;i<projectsInfo.length;i++){
								infoForPage.projects.push(projectsInfo[i]);
							}
							client.close();
							res.render('project-view-pick',{
								infoForPage:	infoForPage
							});
						});

					}
				});
			}
		});
	}else{
		res.redirect('/not-logged-in?url='+encodeURIComponent(req.url));
	}
});

server.get('/project-view/:projectcode',function(req,res){
	if(req.session.user){
		var projectCode	=	req.params.projectcode;
		mongoClient.connect(url,{useUnifiedTopology: true},function(err,client){
			if(err){
				console.log(err)
			}else{
				var users	=	client.db('MobaHub').collection('Users');
				users.find({filetype:"userinfo"}).toArray(function(err,result){
					if(err){
						console.log(err)
					}else{
						var infoForPage			=	{};
						infoForPage.user		=	req.session.user.code;
						infoForPage.team		=	[];
						infoForPage.projects	=	[];
						infoForPage.settings 	=	JSON.parse(JSON.stringify(req.session.user.settings));
						for(var i=0;i<result.length;i++){
							var teamJson		=	{};
							teamJson.name		=	result[i].name;
							teamJson.code		=	result[i].code;
							teamJson.role		=	result[i].role;
							teamJson.abrv		=	result[i].abrv;
							teamJson.emails		=	JSON.parse(JSON.stringify(result[i].emails));
							infoForPage.team.push(teamJson);
						}
						var projects	=	client.db('MobaHub').collection('Projects');
						projects.find({filetype:"projectinfo"}).toArray(function(err,projectsInfo){
							for(var i=0;i<projectsInfo.length;i++){
								infoForPage.projects.push(projectsInfo[i]);
							}
							var projectHours	=	client.db('MobaHub').collection('Hours');
							projectHours.find({pcode:projectCode}).toArray(function(err,hours){
								client.close();
								res.render('project-view',{
									infoForPage:	infoForPage,
									projectHours: 	hours,
									projectCode: 	projectCode
								});

							})
						});

					}
				});
			}
		});
		
	}else{
		res.redirect('/not-logged-in?url='+encodeURIComponent(req.url));
	}
});

server.get('/home',function(req,res){
	if(req.session.user){
		res.redirect('/all-projects');
	}else{
		res.redirect('/not-logged-in?url='+encodeURIComponent(req.url));
	}
});

server.get('/logout',function(req,res){
	req.session.destroy(function(){});
	res.render('message',{
		message: "You are logged out. <br><div class='clickableButton2'><a href='/login'>Log IN</a></div>"
	});
});

server.get('/project-edit',function(req,res){
	if(req.session.user){
		mongoClient.connect(url,{useUnifiedTopology: true},function(err,client){
			if(err){
				console.log(err)
			}else{
				var users	=	client.db('MobaHub').collection('Users');
				users.find({filetype:"userinfo"}).toArray(function(err,result){
					if(err){
						console.log(err)
					}else{
						var infoForPage			=	{};
						infoForPage.user		=	req.session.user.code;
						infoForPage.team		=	[];
						infoForPage.projects	=	[];
						infoForPage.settings 	=	JSON.parse(JSON.stringify(req.session.user.settings));
						for(var i=0;i<result.length;i++){
							var teamJson		=	{};
							teamJson.name		=	result[i].name;
							teamJson.code		=	result[i].code;
							teamJson.role		=	result[i].role;
							teamJson.abrv		=	result[i].abrv;
							teamJson.emails		=	JSON.parse(JSON.stringify(result[i].emails));
							infoForPage.team.push(teamJson);
						}
						var projects	=	client.db('MobaHub').collection('Projects');
						projects.find({filetype:"projectinfo"}).toArray(function(err,projectsInfo){
							for(var i=0;i<projectsInfo.length;i++){
								infoForPage.projects.push(projectsInfo[i]);
							}
							client.close();
							res.render('project-edit',{
								infoForPage:	infoForPage
							});
						});

					}
				});
			}
		});
	}else{
		res.redirect('/not-logged-in?url='+encodeURIComponent(req.url));
	}
});

/*server.get('/project-edit/:projectcode',function(req,res){
	if(req.session.user){
		mongoClient.connect(url,{useUnifiedTopology: true},function(err,client){
			if(err){
				console.log(err)
			}else{
				var users	=	client.db('MobaHub').collection('Users');
				users.find({filetype:"userinfo"}).toArray(function(err,result){
					if(err){
						console.log(err)
					}else{
						var infoForPage			=	{};
						infoForPage.user		=	req.session.user.code;
						infoForPage.team		=	[];
						infoForPage.projects	=	[];
						infoForPage.settings 	=	JSON.parse(JSON.stringify(req.session.user.settings));
						for(var i=0;i<result.length;i++){
							var teamJson		=	{};
							teamJson.name		=	result[i].name;
							teamJson.code		=	result[i].code;
							teamJson.role		=	result[i].role;
							teamJson.abrv		=	result[i].abrv;
							teamJson.emails		=	JSON.parse(JSON.stringify(result[i].emails));
							infoForPage.team.push(teamJson);
						}
						var projects	=	client.db('MobaHub').collection('Projects');
						projects.find({filetype:"projectinfo"}).toArray(function(err,projectsInfo){
							for(var i=0;i<projectsInfo.length;i++){
								infoForPage.projects.push(projectsInfo[i]);
							}
							client.close();					
							if(req.params.projectcode=="new"){
								res.render('project-add',{
									infoForPage:	infoForPage
								});
							}else{
								res.render('project-edit',{
									infoForPage:	infoForPage,
									projectCode:	req.params.projectcode
								});
							}
						});

					}
				});
			}
		});

	}else{
		res.redirect('/not-logged-in?url='+encodeURIComponent(req.url));
	}
});*/

server.get('/projectEdited',function(req,res){
	if(req.session.user){
		var projectForResponse	=	req.session.tempData;
		req.session.tempData	=	null;
		mongoClient.connect(url,{useUnifiedTopology: true},function(err,client){
			if(err){
				console.log(err)
			}else{
				var users		=	client.db('MobaHub').collection('Users');
				users.find({filetype:"userinfo"}).toArray(function(err,result){
					if(err){
						console.log(err)
					}else{
						var infoForPage			=	{};
						infoForPage.user		=	req.session.user.code;
						infoForPage.team		=	[];
						infoForPage.projects	=	[];
						infoForPage.settings 	=	JSON.parse(JSON.stringify(req.session.user.settings));
						for(var i=0;i<result.length;i++){
							var teamJson		=	{};
							teamJson.name		=	result[i].name;
							teamJson.code		=	result[i].code;
							teamJson.role		=	result[i].role;
							teamJson.abrv		=	result[i].abrv;
							teamJson.emails		=	JSON.parse(JSON.stringify(result[i].emails));
							infoForPage.team.push(teamJson);
						}
						var projects	=	client.db('MobaHub').collection('Projects');
						projects.find({filetype:"projectinfo"}).toArray(function(err,projectsInfo){
							for(var i=0;i<projectsInfo.length;i++){
								infoForPage.projects.push(projectsInfo[i]);
							}
							client.close();
							res.render('project-edited',{
								infoForPage:	infoForPage,
								project: 		projectForResponse 
							});
						});

					}
				});
			}
		});
	}else{
		res.redirect('/not-logged-in');
	}
});

server.post('/postProject',function(req,res){
	if(req.session.user){
		var projectJson			=	JSON.parse(req.body.projectjson);
		var urlQuery			=	req.body.urlquery;
		mongoClient.connect(url,{useUnifiedTopology: true},function(err,client){
			if(err){
				console.log(err)
			}else{
				var users	=	client.db('MobaHub').collection('Users');
				users.find({filetype:"userinfo"}).toArray(function(err,result){
					if(err){
						console.log(err)
					}else{
						var infoForPage			=	{};
						infoForPage.user		=	req.session.user.code;
						infoForPage.team		=	[];
						infoForPage.projects	=	[];
						infoForPage.settings 	=	JSON.parse(JSON.stringify(req.session.user.settings));
						for(var i=0;i<result.length;i++){
							var teamJson		=	{};
							teamJson.name		=	result[i].name;
							teamJson.code		=	result[i].code;
							teamJson.role		=	result[i].role;
							teamJson.abrv		=	result[i].abrv;
							teamJson.emails		=	JSON.parse(JSON.stringify(result[i].emails));
							infoForPage.team.push(teamJson);
						}
						var projects	=	client.db('MobaHub').collection('Projects');
						projects.find({filetype:"projectinfo"}).toArray(function(err,projectsInfo){
							var existingCodes	=	[];
							for(var i=0;i<projectsInfo.length;i++){
								infoForPage.projects.push(projectsInfo[i]);
								existingCodes.push(projectsInfo[i].code);
							}
							if(Number(projectJson.code)==0){
								//New Project
								//Create project Code
								var projectCode				=	projectJson.company.replace(/[\W_]+/g,"") +"-"+ projectJson.dispname.replace(/[\W_]+/g,"");
								projectJson.createddate		=	new Date().getTime();
								
								var projectCodeTaken		=	true;
								var loopCounter				=	1;
								while(loopCounter<1000){
									if(existingCodes.indexOf(projectCode)<0){
										projectCodeTaken	=	false;
										break;
									}else{
										projectCode			=	projectCode + loopCounter;
									}
									loopCounter++;
								}
								
								if(!projectCodeTaken){
									projectJson.code	=	projectCode;
									var projectsAdd		=	client.db('MobaHub').collection('Projects');
									projectsAdd.insertOne(projectJson,function(err,addedResult){
										client.close();
										req.session.tempData		=	projectJson;
										req.session.tempData.new	=	true;
										res.redirect('/projectEdited'+urlQuery);
									});
								}else{
									console.log("PROJECT ADD FAILED!<br>Couldn't generate a unique project code.");
								}
							}else{
								//Edit Project
								if(existingCodes.indexOf(projectJson.code)>=0){
									var projectsToFind			=	client.db('MobaHub').collection('Projects');
									projectsToFind.find({code:projectJson.code}).toArray(function(err,projectJsonFromDb){
										var inputProject		=	client.db('MobaHub').collection('Projects');
										inputProject.insertOne(projectJson,function(err,addedResult){
											var deleteProject	=	client.db('MobaHub').collection('Projects');
											deleteProject.deleteOne({_id:projectJsonFromDb[0]._id},function(err,deletionResult){
												var archive		=	client.db('MobaHub').collection('Archive');
												delete projectJsonFromDb[0]["_id"];
												archive.insertOne(projectJsonFromDb[0],function(err,archivedResult){
													client.close();
													req.session.tempData	=	projectJson;
													res.redirect('/projectEdited'+urlQuery);
												});
												
											});
										});
									});

								}else{
									console.log("PROJECT EDIT FAILED!<br>Couldn't find the project with selected code.");
								}
							}
						});

					}
				});
			}
		});
	}else{
		res.redirect('/not-logged-in');
	}
});


server.post('/duplicateProject',function(req,res){
	if(req.session.user){
		var projectJson			=	JSON.parse(req.body.projectjson);
		var urlQuery				=	req.body.urlquery;
		mongoClient.connect(url,{useUnifiedTopology: true},function(err,client){
			if(err){
				console.log(err)
			}else{
				var projects	=	client.db('MobaHub').collection('Projects');
				projects.find({code:projectJson.code}).toArray(function(err,result){
					if(result.length>0){
						//Code already taken, add another random string
						projectJson.code	=	projectJson.code+"-"+generateId(4);
					}
					projects.insertOne(projectJson,function(err,addedResult){
						client.close();
						res.redirect('/project-edit'+urlQuery);//ERROR HERE WHEN CODE WAS ALREADY TAKEN!!! You have to regenerate urlQuery, do this when you have time :)
					});
				});
			}
		});
	}else{
		res.redirect('/not-logged-in');
	}
});
	
server.get('/all-projects',function(req,res){
	if(req.session.user){
		mongoClient.connect(url,{useUnifiedTopology: true},function(err,client){
			if(err){
				console.log(err)
			}else{
				var users	=	client.db('MobaHub').collection('Users');
				users.find({filetype:"userinfo"}).toArray(function(err,result){
					if(err){
						console.log(err)
					}else{
						var infoForPage			=	{};
						infoForPage.user		=	req.session.user.code;
						infoForPage.team		=	[];
						infoForPage.projects	=	[];
						infoForPage.settings 	=	JSON.parse(JSON.stringify(req.session.user.settings));
						for(var i=0;i<result.length;i++){
							var teamJson		=	{};
							teamJson.name		=	result[i].name;
							teamJson.code		=	result[i].code;
							teamJson.role		=	result[i].role;
							teamJson.abrv		=	result[i].abrv;
							teamJson.emails		=	JSON.parse(JSON.stringify(result[i].emails));
							infoForPage.team.push(teamJson);
						}
						var projects	=	client.db('MobaHub').collection('Projects');
						projects.find({filetype:"projectinfo"}).toArray(function(err,projectsInfo){
							for(var i=0;i<projectsInfo.length;i++){
								infoForPage.projects.push(projectsInfo[i]);
							}
							var projectHours	=	client.db('MobaHub').collection('Hours');
							projectHours.find({}).toArray(function(err,hours){
								for(var i=0;i<infoForPage.projects.length;i++){
									infoForPage.projects[i].spenthours	=	0;
									for(var j=0;j<hours.length;j++){
										if(infoForPage.projects[i].code==hours[j].pcode){
											infoForPage.projects[i].spenthours	+=	Number(hours[j].hours);
										}
									}
								}
								client.close();
								res.render('all-projects',{
									infoForPage:	infoForPage
								});

							})
						});

					}
				});
			}
		});
		
	}else{
		res.redirect('/not-logged-in?url='+encodeURIComponent(req.url));
	}
});

server.get('/user-settings',function(req,res){
	if(req.session.user){
		mongoClient.connect(url,{useUnifiedTopology: true},function(err,client){
			if(err){
				console.log(err)
			}else{
				var users	=	client.db('MobaHub').collection('Users');
				users.find({filetype:"userinfo"}).toArray(function(err,result){
					if(err){
						console.log(err)
					}else{
						var infoForPage			=	{};
						infoForPage.user		=	req.session.user.code;
						infoForPage.team		=	[];
						infoForPage.projects	=	[];
						infoForPage.settings 	=	JSON.parse(JSON.stringify(req.session.user.settings));
						infoForPage.devices		=	JSON.parse(JSON.stringify(req.session.user.devices));
						for(var i=0;i<result.length;i++){
							var teamJson		=	{};
							teamJson.name		=	result[i].name;
							teamJson.code		=	result[i].code;
							teamJson.role		=	result[i].role;
							teamJson.abrv		=	result[i].abrv;
							teamJson.emails		=	JSON.parse(JSON.stringify(result[i].emails));
							infoForPage.team.push(teamJson);
						}
						var projects	=	client.db('MobaHub').collection('Projects');
						projects.find({filetype:"projectinfo"}).toArray(function(err,projectsInfo){
							for(var i=0;i<projectsInfo.length;i++){
								infoForPage.projects.push(projectsInfo[i]);
							}
							client.close();
							res.render('user-settings',{
								infoForPage:	infoForPage
							});
						});
					}
				});
			}
		});
	}else{
		res.redirect('/not-logged-in?url='+encodeURIComponent(req.url));
	}
});

server.post('/user-settings',function(req,res){
	if(req.session.user){
		mongoClient.connect(url,{useUnifiedTopology: true},function(err,client){
			if(err){
				console.log(err)
			}else{
				var updateObj	=	JSON.parse(req.body.settings);

				var users		=	client.db('MobaHub').collection('Users');
				var setObj	=	{ $set: {settings:{menuSort:updateObj.menuSort,customprojectsort:updateObj.customprojectsort}}, $pull: {devices:{id:{$in:updateObj.devices}}}};
				users.updateOne({code:req.session.user.code},setObj, function(err,result){
					if(err){
						console.log(err)
					}else{
						req.session.user.settings.menuSort			=	updateObj.menuSort;
						req.session.user.settings.customprojectsort	=	updateObj.customprojectsort;
						req.session.user.settings.hideprojectmenu	=	updateObj.hideprojectmenu;
						var indexesToRemove	=	[];
						for(var i=0;i<req.session.user.devices.length;i++){
							if(updateObj.devices.indexOf(req.session.user.devices[i].id)>=0){
								indexesToRemove.push(i)
								
							}
						}

						for(var i=0;i<indexesToRemove.length;i++){
							req.session.user.devices.splice(indexesToRemove[i],1);
						}
						client.close();
						res.redirect('/user-settings');
					}
				})
				
			}
		});
	}else{
		res.redirect('/not-logged-in');
	}
});

server.get('/calendar',function(req,res){
	if(req.session.user){
		mongoClient.connect(url,{useUnifiedTopology: true},function(err,client){
			if(err){
				console.log(err)
			}else{
				var users	=	client.db('MobaHub').collection('Users');
				users.find({filetype:"userinfo"}).toArray(function(err,result){
					if(err){
						console.log(err)
					}else{
						var infoForPage			=	{};
						infoForPage.user		=	req.session.user.code;
						infoForPage.team		=	[];
						infoForPage.projects	=	[];
						infoForPage.settings 	=	JSON.parse(JSON.stringify(req.session.user.settings));
						for(var i=0;i<result.length;i++){
							var teamJson		=	{};
							teamJson.name		=	result[i].name;
							teamJson.code		=	result[i].code;
							teamJson.role		=	result[i].role;
							teamJson.abrv		=	result[i].abrv;
							teamJson.emails		=	JSON.parse(JSON.stringify(result[i].emails));
							infoForPage.team.push(teamJson);
						}
						var projects	=	client.db('MobaHub').collection('Projects');
						projects.find({filetype:"projectinfo"}).toArray(function(err,projectsInfo){
							for(var i=0;i<projectsInfo.length;i++){
								infoForPage.projects.push(projectsInfo[i]);
							}
							var projectHours	=	client.db('MobaHub').collection('Hours');
							projectHours.find({}).toArray(function(err,hours){
								for(var i=0;i<infoForPage.projects.length;i++){
									infoForPage.projects[i].spenthours	=	0;
									for(var j=0;j<hours.length;j++){
										if(infoForPage.projects[i].code==hours[j].pcode){
											infoForPage.projects[i].spenthours	+=	Number(hours[j].hours);
										}
									}
								}
								var calendar	=	client.db('MobaHub').collection('Calendar');
								calendar.find({}).toArray(function(err,calendarItems){
									infoForPage.calendar	=	calendarItems;
									var hours	=	client.db('MobaHub').collection('Hours');
									hours.find({}).toArray(function(err,hourItems){
										infoForPage.hours	=	hourItems;
										client.close();
										res.render('calendar',{
											infoForPage:	infoForPage
										});
									});
								});

							})
						});

					}
				});
			}
		});
		
	}else{
		res.redirect('/not-logged-in?url='+encodeURIComponent(req.url));
	}
});

server.get('/whitepaper',function(req,res){
	if(req.session.user){
		mongoClient.connect(url,{useUnifiedTopology: true},function(err,client){
			if(err){
				console.log(err)
			}else{
				var users	=	client.db('MobaHub').collection('Users');
				users.find({filetype:"userinfo"}).toArray(function(err,result){
					if(err){
						console.log(err)
					}else{
						var infoForPage			=	{};
						infoForPage.user		=	req.session.user.code;
						infoForPage.team		=	[];
						infoForPage.projects	=	[];
						infoForPage.settings 	=	JSON.parse(JSON.stringify(req.session.user.settings));
						for(var i=0;i<result.length;i++){
							var teamJson		=	{};
							teamJson.name		=	result[i].name;
							teamJson.code		=	result[i].code;
							teamJson.role		=	result[i].role;
							teamJson.abrv		=	result[i].abrv;
							teamJson.emails		=	JSON.parse(JSON.stringify(result[i].emails));
							infoForPage.team.push(teamJson);
						}
						var projects	=	client.db('MobaHub').collection('Projects');
						projects.find({filetype:"projectinfo"}).toArray(function(err,projectsInfo){
							for(var i=0;i<projectsInfo.length;i++){
								infoForPage.projects.push(projectsInfo[i]);
							}
							client.close();
							var dripOptions = { per_page: 1000 , status:"active"};

							dripClient.listAllSubscribesToCampaign(campaignId,dripOptions)
								.then((response) => {
									// Handle `response.body`
									var subscribers	=	JSON.parse(JSON.stringify(response.body.subscribers));
									for(var i=0;i<subscribers.length;i++){
										subscribers[i].custom_fields.hubstatus	=	"active";
									}
									dripOptions.status	=	"unsubscribed";
									dripClient.listAllSubscribesToCampaign(campaignId,dripOptions)
										.then((response) => {
											for(var i=0;i<response.body.subscribers.length;i++){
												response.body.subscribers[i].custom_fields.hubstatus	=	"unsubscribed";
												subscribers.push(response.body.subscribers[i]);
											}
											res.render('whitepaper',{
												infoForPage:	infoForPage,
												subscribers: 	subscribers
											});

										})
										.catch((error) => {
											// Handle errors
											res.send("Bad")
										});
									
								})
								.catch((error) => {
									// Handle errors
									res.send("Bad")
								});
								/*dripClient.listSubscribers(dripOptions)
										  .then((response) => {
										    // Handle `response.body`
										    var subscribers	=	JSON.parse(JSON.stringify(response.body.subscribers));
										    if(subscribers.length==1000){
										    	dripOptions.page 	=	2;
										    	dripClient.listSubscribers(dripOptions)
										    		.then((response) => {
										    			for(var i=0;i<response.body.subscribers.length;i++){
										    				subscribers.push(response.body.subscribers[i])
										    			}
										    			client.close();
														res.render('whitepaper',{
															infoForPage:	infoForPage,
															subscribers: 	subscribers
														});
										    		})
										    		.catch((error) => {
													    // Handle errors
													    res.send("Bad")
														client.close();
													  });
										    }else{
										    	client.close();
												res.render('whitepaper',{
													infoForPage:	infoForPage,
													subscribers: 	subscribers
												});
										    }
										    
										  })
										  .catch((error) => {
										    // Handle errors
										    res.send("Bad")
											client.close();
										  });


							/*var subscribersDb	=	client.db('MobaHub').collection('Whitepaper');
							subscribersDb.find({}).toArray(function(err,subscribers){
								client.close();
								res.render('whitepaper',{
									infoForPage:	infoForPage,
									subscribers: 	subscribers 
								});
							});*/
						});

					}
				});
			}

		});

		
	}else{
		res.redirect('/not-logged-in?url='+encodeURIComponent(req.url));
	}
});

server.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");
});

server.get('*',function(req,res){
	res.redirect('/not-logged-in');
})