/*
	main.asp
	작성일 : 2017.09.07
	작성자 : 우승민	
*/

( function( $ ) { 
	var EMPTY_FUNCTION = function () { }; 
	$.fn.chatinit = function( options ) {
		// 기본값을 설정
		var defaults = {
				EMP_ID : ""
		};
		// 옵션값이 있으면 사용
		var settings = $.extend( {}, defaults, options );
		// 엘리먼트 반복 (메서드 체이닝)
		// return this.each( function() {
			var options = settings;
			var obj = $( this );
			var result;
			initDS1119M();
			function initDS1119M() {
				getData();
			};
			function getData(){
			    var url = "http://swing.swmail.co.kr/websquare/DS1119M.asp";
			    var param = "?EMP_ID="+options.EMP_ID;
			    url = url + param;
			    $.ajax({
			      url: url,
			      dataType: 'jsonp',
			      jsonp: 'callback',
			      timeout: 300000,
			      crossDomain: true,
			      type: 'POST',
			      cache: false,
			      contentType: "application/x-www-form-urlencoded; charset=euc-kr",  
			      error: function(request,status,error) {
			        // alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
			      },
			      success: function (data) {
			        result = data;
			        if(result.length > 0){ 
					  makePanel();  
					  setEvent();
					  makeScroll();
			        }else {
			          return;
			        }
			      }
			    });
		  };
			  
		  function loadData(){
		    var url = "http://swing.swmail.co.kr/websquare/DS1119M.asp";
		    var param = "?EMP_ID="+options.EMP_ID;
		    url = url + param;
		    $.ajax({
		      url: url,
		      dataType: 'jsonp',
		      jsonp: 'callback',
		      timeout: 300000,
		      crossDomain: true,
		      type: 'POST',
		      cache: false,
		      contentType: "application/x-www-form-urlencoded; charset=euc-kr",  
		      error: function(request,status,error) {
		        // alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		      },
		      success: function (data) {
		        result = data;
		        if(result.length > 0){ 
		        	makeList();
		        }else {
		        	$("#jsPanel-wrap").empty();
		            return;
		        }
		      }
		    });
		  };
			  
		  function setEvent(){ 
			  	//scroll div 높이변경 
				/*$(document).on('click', ".jsPanel-btn-maximize", function () {
					$("#jsPanel .scrollbar-inner").slimScroll({
						height: $(".jsPanel-content").height() - 40 
					});
				});*/
			  	/*
				$(document).on('click', ".jsPanel-btn-normalize", function () {
					$("#jsPanel .scrollbar-inner").slimScroll({
						height: $(".jsPanel-content").height() - 40 
					});
				});*/

				$(document).on("resize","#jsPanel-1",function(){
					$("#jsPanel .scrollbar-inner").slimScroll({
						height: $(".jsPanel-content").height() - 40 
					});
				});
				
			   $(document).off("click", "#jsPanel-wrap .jsPanel-li").on("click", "#jsPanel-wrap .jsPanel-li", function (e) {
					var src = "/ui/za/ZA1001R.xml";//$(this).attr("src");
					var label;
					var value;
					label = "개인별결재문서조회";
					value = "ZA1001R";// + new Date();
					src += "&EMP_ID="+options.EMP_ID; 
					
					if(!common.isNull(label) && !common.isNull(value)  && !common.isNull(src)){		
						window.parent.addTabMenu(value, label, src);
						//$(".jsglyph-close").click(); 
						$("#jsPanel-1").css({"left":(window.innerWidth - 760)+ "px", "top":100 + "px"});
						$(".jsPanel-btn-smallify").click();
					}
				});
			   
			    
			    //펼치기 더블클릭시 숨김표시된 버튼 전부 활성화되는 오류 
			    $(document).off('click', ".jsPanel-btn-smallifyrev").on('click', ".jsPanel-btn-smallify", function () {
			    	$(".jsPanel-btn-smallifyrev").css('pointer-events','');
			    });
			   
			    //펼치기 클릭시 reload 
			    $(document).off('click', ".jsPanel-btn-smallifyrev").on('click', ".jsPanel-btn-smallifyrev", function () {
			    	$(".jsPanel-btn-smallifyrev").css('pointer-events','none');//hide();
			    	loadData(); 
			    });
			    
			    /*
			     * drag event
			     * jsPanel api 안쓸경우 
				/*
				var dragging = false;
				var iX, iY; 
				$(".jsPanel-headerbar").mousedown(function(e) {	//#jsPanel-1
					console.log(1);
					dragging = true;
					debugger;
					iX = e.clientX - this.offsetLeft;
					iY = e.clientY - this.offsetTop;
					this.setCapture && this.setCapture();
					return false;
				});
				
				document.onmousemove = function(e) {
					if (dragging) {
						var e = e || window.event;
						console.log((Number(iX) - Number(e.clientX)) + '/' + (Number(iY) - Number(e.clientY)) + ',' + e.clientX +'/' + e.clientY);
						var oX = Number(e.clientX);
						var oY = Number(e.clientY);
						console.log(oX + '/' + oY);
						$("#jsPanel-1").css({"left":oX + "px", "top":oY + "px"});
						return false;
					}
				};
				
				$(document).mouseup(function(e) {
					console.log(3);
					dragging = false;
					$("#jsPanel-1")[0].releaseCapture();
				})
				*/
			    
				/*$("iframe").contents().find("body").mousemove(function(e){
					
					console.log('test1');
					if (dragging) {
						var e = e || window.event;
						var oX = e.clientX;// - iX;
						var oY = e.clientY;// - iY;
						
						console.log('iframe/' + oX + '/' + oY);
						
						$("#jsPanel-1").css({"left":oX + "px", "top":oY + "px"});
						return false;
					}
			        //$("#console").html(cursor.pageX+":"+cursor.pageY);
			    });*/
			}; 
			
			
			  function dateToYYYYMMDD(date){
				var str = date.split(":");
				var returnDate = date != "" ? str[0] + "시" : ""; 
				//(몇시간 경과)
				return returnDate;
			  };

			  function makeScroll(){ 
			    $("#jsPanel-wrap").wrap( "<div class='scrollbar-inner'></div>" );
			    $("#jsPanel .scrollbar-inner").slimScroll({
			      height: $(".jsPanel-content").height() - 40 
			    });
			    
			    //$("#jsPanel .slimScrollBar").css('background', '').css('display', '');
			  };
				
			  function makeList(){
				$("#jsPanel-top").empty();      
			    $("#jsPanel-top").append("<ul id='jsPanel-top-ul'></ul>");
			    
			    var liHtml; 
			      liHtml = "<li id='jsPanel-header' class='jsPanel-li'><div class='block'><div class='block_content'>";
			      liHtml = liHtml + "<div class='byline'><div class='docu'><span class='bold'>문서ID</span></div><div class='file'><span class='bold'>FILE번호</span></div><div class='person'><span class='bold'>담당자</span></div><div class='date'><span class='bold'>사업부 결재일자</span></div><div class='dif'><span class='bold'>경과시간</span></div></div>"; 
			      liHtml = liHtml + "</div></div></li>"; 
			      
			      $("#jsPanel-top-ul").append(liHtml); 
				
				  $("#jsPanel-wrap").empty();      
			      $("#jsPanel-wrap").append("<ul id='jsPanel-ul'></ul>");

			    for(var i=0;i<result.length;i++){ 
				  var url = '"' + result[i].REPORT_URL + '"'; 
				  var dif = Math.round(result[i].DIF_HOUR/24) == 0 ? '' : Math.round(result[i].DIF_HOUR/24) + '일 '
				      dif += result[i].DIF_HOUR%24 + '시간';
			      var liContentHtml; 
			      liContentHtml = "<li class='jsPanel-li' src="+url+"><div class='block'><div class='block_content'>";
			      liContentHtml = liContentHtml + "<div class='byline'><div class='docu bold'><span>"+result[i].DOCU_ID+"</span></div><div class='file'><span>"+result[i].FILE_NO+"</span></div><div class='person'><span>"+result[i].ENTRY_PERSON_NM+"</span></div><div class='date'><span>"+dateToYYYYMMDD(result[i].RECENT_SIGN_DATE)+"</span></div><div class='dif'><span>"+dif+"</span></div></div>";
			      liContentHtml = liContentHtml + "</div></div></li>"; 

			      $("#jsPanel-ul").append(liContentHtml); 
			      /*$("#jsPanel-ul").append(liContentHtml); 
			      $("#jsPanel-ul").append(liContentHtml); 
			      $("#jsPanel-ul").append(liContentHtml); 
			      $("#jsPanel-ul").append(liContentHtml); 
			      $("#jsPanel-ul").append(liContentHtml); 
			      $("#jsPanel-ul").append(liContentHtml); 
			      $("#jsPanel-ul").append(liContentHtml); 
			      $("#jsPanel-ul").append(liContentHtml); 
			      $("#jsPanel-ul").append(liContentHtml); 
			      $("#jsPanel-ul").append(liContentHtml); 
			      $("#jsPanel-ul").append(liContentHtml); 
			      $("#jsPanel-ul").append(liContentHtml); 
			      $("#jsPanel-ul").append(liContentHtml); 
			      $("#jsPanel-ul").append(liContentHtml); 
			      $("#jsPanel-ul").append(liContentHtml); 
			      $("#jsPanel-ul").append(liContentHtml); 
			      $("#jsPanel-ul").append(liContentHtml); 
			      $("#jsPanel-ul").append(liContentHtml); 
			      $("#jsPanel-ul").append(liContentHtml); 
			      $("#jsPanel-ul").append(liContentHtml); 
			      $("#jsPanel-ul").append(liContentHtml); 
			      $("#jsPanel-ul").append(liContentHtml);*/ 
			    } 
			  };
			  
			function makePanel() { 
		        var myPanel = $.jsPanel({  
		        	headerControls: {
		                minimize: 'remove', 
		                maximize: 'remove'    
		            }, 
			      position:    {my: "center", at: "center"/*, offsetX: -20, offsetY: -50*/}, 
			      contentSize: {width: 600, height: 350}, 
			      show:        'animated slideInUp',  
			      //paneltype:   'hint',  //일정시간 뒤 close
			      /*maximizedMargin: {
			          top:    100,
			          right:  20,
			          bottom: 50,
			          left:   20
			      },*/
		            headerTitle: "공임합의 미결재 내역", 
		            theme: "primary", 
		            resizeit: {  
		                minWidth:  450,
		                minHeight: 100 
		                /*start: function (panel, size) { 
		        			$("#jsPanel .scrollbar-inner").slimScroll({ 
		        				height: size.height - 110 
		        			});
		                }, 
		        		stop: function (panel, size) {  
		        			$("#jsPanel .scrollbar-inner").slimScroll({
		        				height: size.height - 110 
		        			});
		                } */
		            }, 
		            draggable: {
		                disabled:  false
		            }, 
		            dragit: {
		                containment: 'window', 
		        		start: function (panel, position) {
		        			//this.content.empty().append('<p>dragging started at left ' + position.left + ' and top ' + position.top + '</p>');
		        		},
		        		stop: function (panel, position) {
		        			//this.content.empty().append('<p>dragging stopped at left ' + position.left + ' and top ' + position.top + '</p>');
		        		}, 
		                opacity:     0.8, 
		            }, 
		            content: "<div id='jsPanel'><div id='jsPanel-top'></div><div id='jsPanel-wrap'></div></div>", 
		            callback: function () { 
		                this.content.css("padding", "15px");  
		                makeList(); 
		            }
		        });
			}; 
	};
})(jQuery);
chatinit = function() { 
	var $ = new jQuery();
	$.chatinit({ EMP_ID : SS_userId}); 		
};