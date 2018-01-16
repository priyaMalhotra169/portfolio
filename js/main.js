(function(){	
	"use strict";

	/* document ready stuff */



				/************
					DECLARING VARIABLES : on the outer scope to use them everywhere inside this scope
				*************/


	// variables for hardcoded numbers for animation timings (that are done in css) and for other things
	var currentSlideNumber, prevSlideNumber,
	slideTotalAnimationTime = 1000,
	waitTimeBetweenRequestingPens = 2000,
	waitTimeForGridItemLoaderSwapOut = 3000,
	animTimeForGridItemLoaderSwapOut = 500 / 1000,
	totalTimeForIntroCssAnims = 1500,
	loadingInitalized = false,
	filterDefault = '*',
	filterChanged = false,
	timeOutForLoading = slideTotalAnimationTime; // timeOutForLoading used in case the slide is not the 1st one to maintain the timing balance for slideIn time

	

	// declare all variables for animation containers or other related elements
	var body,
		gsap, typingAnimation,typingAnimationLetters, fadeInUpAnimation,
		workPage, workGrid,workGridItem, workFilters, workFilterButtons, codepen__wrappers,
		codepenLength,
		skillsPage, skillTiles, moreSkills, moreSkillsContainer, closeMoreSkillsBtn, moreSkillTiles,
		hirePage, contactForm, cSubmit,
		fadeInLeftAnimation, fadeInUpAfterTyping,heart , fadeInUpBeforeTyping,
		sidebarAnimations,fadeInDownSidebar, fadeInUpSidebar,
		footerAnimations,fadeInUpFooter,
		footerName,
		allAnimationsHappening = [],
		codepensHtml = [],
		popup, popupTitle, popupText,
		loader;

	// getting templates out of script tags
	var htmlForWorkGridLoader = $('#gridItemLoaderTemplate').html();


	// grab the elements from the dom ( which we have hide or process upon)
	grabElements();

	// remove all the codepen__wrappers
	removeCodepens();

	// workSortAndFilter for filtering work tiles
	workSortAndFilter();

	// split text up to letters (inside separate div containers) for performing typing or letter based animation
	splitTextUpforTyping();

	//  run do common things with param1(runningOnLoad) set to true
	doCommonThings(true);
	
	


					/************		
						Event Detection
					*************/

	// event detector for load and hashchange event as our navigation depends on hashlinks
	$(window).on('load hashchange',function(e){
		if (e.type == 'load') {
			// run loadHandler on load
			loadHandler();
		}else if(e.type == "hashchange"){

			// if event type is hashchange then run the function event hashChangeHandler
		    hashChangeHandler();

		}
	});

	// event detector for more skills toggle
	moreSkills.click(moreSkillsClickHandler);

	// event detector for more skills toggle
	// cSubmit.click(cSubmitHandler);








			/************
				Event Handling
			*************/

			/* Codepen's Event Handler*/

	// codepen's inbuilt function method (which they add to the global window object) which fires after each codepen iframe is added to the page..
	window.__CodePenIFrameAddedToPage = function(){
		// if check to see if the user has changed the filters manually
		if (!filterChanged) {
			 // if not then as soon as another codepen's been added filter them again to the default filter
			 workGrid.isotope({ filter: filterDefault }); 
		}

	};


	// load event handler
	function loadHandler(){

		// triggering the windowLoaded event (which we have already subscribed for) which will fire the animations for fading out loader and all other things
	    $(window).trigger("windowLoaded");

	    // timeout before addingBack codepens as there will be too much work all of a sudden when the windowLoaded event fires cause of all the animations including the loader
	    setTimeout(function(){
	    	addBackCodepens();
	    },500);
		
	}

	// hashchange event Handler
	function hashChangeHandler(){
		// run some functions that are common to both ready and hashchange event with
		// the running on load paramater set to undefined/false
		doCommonThings();
	}


	function doCommonThings(runningOnLoad){
		// setTweens to elements (like fade them out or any other settings)
		setTweens(runningOnLoad);

		// grabbing the slide number that we are on, to get the animations up and running for that particular slide
		workForEachSlideAnims(runningOnLoad);
	}


	// moreSkills click event handler
	var moreSkillsOpened = false;
	function moreSkillsClickHandler(){
		if (!moreSkillsOpened) {
			console.log('open');
			moreSkillsOpened = true;
			openMoreSkills();
			closeMoreSkillsBtn.click(closeMoreSkills);
		}else{
			console.log('close');
			moreSkillsOpened = false;
			closeMoreSkills();
		}
	}

	function openMoreSkills(){
		var tlMax = new TimelineMax();

		tlMax.to(moreSkillsContainer,.3,{
			autoAlpha:1,
			rotationX:0
		})
		.staggerTo(moreSkillTiles,.2,{
			autoAlpha:1,
			y:0,
			ease: Back.easeOut.config(3)
		},.1);
	}

	function closeMoreSkills(){

		var tlMax = new TimelineMax();

		tlMax.to(moreSkillsContainer,.25,{
			autoAlpha:0,
			rotationX: 50
		}).set(moreSkillTiles, { autoAlpha:0, y:30 });
	}



	/*
		Parsley form validator link: http://parsleyjs.org , DOCS: http://parsleyjs.org/doc/index.html 
	*/

	// contact form submit button click event handler with parsley.js
	var parsley = contactForm.parsley().on('field:validated', function() {
		// if there are validated fields with errors then the flow will go from here like an if block

		// finding the errors container classes in the form to see if there are any error messages
		var errors = $('.parsley-error').length != 0;

			// using jQuery toggleClass to show / hide messages and design certain things while they are showing error 
		$('#contactForm').toggleClass('errors', errors);
		$('#invalidContactForm').toggleClass('vanish', !errors);

	})
	.on('form:submit', function() {
		// if there are no  validated fields with errors then the flow will go from here like an else block and we will 

  		var c_name=$('#c-name').val();
		var c_mail=$('#c-mail').val();
		var c_purpose=$('#c-purpose').val();
		var c_msg=$('#c-msg').val();

		// submit the data with ajax to a php file
		$.post("form.php",{name:c_name,mail:c_mail,purpose:c_purpose,msg:c_msg},function(data){
							// changing the classes if submitted
						popupTitle.text('Success');
						popupTitle.addClass('success');
						popupText.html('Thanks for sending me the query. <br> I will get back as quickly as possible!');
						
						// animating in the popup on success or failure to show the message

						var tl = new TimelineLite();
						tl.to(popup,.5,{
							y:0,
							display:'block',
							autoAlpha:1
						}).to(popup,1,{
							y:20,
							autoAlpha:0
						},'+=3').set(popup,{
							display: 'none'
						});
						
						// reset the contactForm element saved in jQuery (we do the array notation [] with the index number to jump)
						// out to the DOM node from the normal jQuery object wrapped element
						contactForm[0].reset();
		});
	


		

		return false; // Don't submit form as normal ( similar to preventDefault() )

	});




			/************
			
				Animation Handlers

			*************/

			/* =grabElements */
		// Function grabElements to cache all elements
	function grabElements(){
		body = $('#body');
		loader = $('#loader');

		// variables from work slide 
		workPage = body.find(".page.work");
		workGrid = workPage.find(".work__grid");
		workGridItem = workGrid.find('.grid-item > .wrapper');
		workFilters = workPage.find(".filters");
		workFilterButtons = workFilters.find('.button');
		codepen__wrappers = workGrid.find(".codepen__wrapper");

		// vars from skills page
		skillsPage = body.find(".page.skills");
		skillTiles = skillsPage.find(".skillsContainer > .skill");
		moreSkills = skillsPage.find('.moreSkills');
		moreSkillsContainer = skillsPage.find('.moreSkillsContainer');
		moreSkillTiles = moreSkillsContainer.find('.skill');
		closeMoreSkillsBtn = moreSkillsContainer.find('.close');

		// vars from hire page
		hirePage = body.find('.page.hire');
		contactForm = $('#contactForm');
		cSubmit = $('#c-submit');

		// vars for common animation containers
		gsap = body.find(".gsap");
		fadeInUpAnimation = gsap.filter(".fadeInUpAnimation");
		typingAnimation = gsap.filter(".typingAnimation");
		fadeInLeftAnimation = gsap.filter(".fadeInLeftAnimation");
		fadeInUpAfterTyping = gsap.filter(".fadeInUpAfterTyping");
		heart = fadeInUpAfterTyping.filter(".heart");
		fadeInUpBeforeTyping = gsap.filter(".fadeInUpBeforeTyping");
				
		// vars for sidebar's common animation containers 
		sidebarAnimations = gsap.filter(".sidebarAnimations");
		fadeInDownSidebar = sidebarAnimations.filter(".fadeInDownSidebar"); 
		fadeInUpSidebar = sidebarAnimations.filter(".fadeInUpSidebar");

		// vars for footer's common animation containers 
		footerAnimations = gsap.filter(".footerAnimations");
		fadeInUpFooter = footerAnimations.filter(".fadeInUpFooter");
		footerName = $("footer").find(".name");

		// popup for showing messages
		popup = $('#popup');
		popupTitle = popup.find('.title');
		popupText = popup.find('moreText');
		
	}/* /grabElements */


			/* =splitTextUpforTyping */
		// Function loadHandler func to hide and split text up into letters
	function splitTextUpforTyping(){

		// running loop on each typingAnimation containers to  split their text
		typingAnimation.each(function(i,el){
			var elem = $(el);

				// using SplitText plugin to split the text inside this (or say, el) typingAnimation container
			var mySplitText = new SplitText(elem, {type:"chars,words"});
				// adding class '.letters' to the characters to grab them later on
			$(mySplitText.chars).addClass('letters');

				// old split text technique to split text performed in raw js

			/*var typingAnimationText = $.trim(elem.text());
			elem.html("<span class='letters'>"+typingAnimationText.split("").join("</span><span class='letters'>"));
			*/
			
		});

		// recording each letter to the variable typingAnimationLetters (of the outer-scope) for animating later
		typingAnimationLetters = typingAnimation.find(".letters");
			
	}/* /splitTextUpforTyping */


			/* =setTweens */
		// Function setTweens to set css props the grabbed elements for animating later
	function setTweens(runningOnLoad){
		// elements that fades in upwards
		TweenLite.set(fadeInUpAnimation,{autoAlpha:0,y:20});
		// elements that fades in from left
		TweenLite.set(fadeInLeftAnimation,{autoAlpha:0,x:-50});
		// codepen__wrappers elements
		TweenLite.set(codepen__wrappers,{autoAlpha:0,scale:0.7});
		// skill tiles elements on skills slide
		TweenLite.set(skillTiles,{autoAlpha:0,rotationX:-70,perspective:500});
		// typing animation letter elements
		TweenLite.set(typingAnimationLetters,{
			"display":"inline-block",
			autoAlpha:0,
			x:40

		});
		// elements that fade in up after typing animation happens
		TweenLite.set(fadeInUpAfterTyping,{
			autoAlpha:0,
			scale:.1,
			y:15,
		});
		/* removing class name pound from 1st slide's heart container*/
		TweenLite.set(heart,{className:"-=pound"});


		// css props that need to be set only once on first load
		if (runningOnLoad) {

			TweenLite.set(body, { perspective:500 });

			TweenLite.set(fadeInUpBeforeTyping, { autoAlpha:0, scale:.4, });

			TweenLite.set(fadeInDownSidebar, { y:-50, autoAlpha:0 });

			TweenLite.set(fadeInUpFooter, { y:20, autoAlpha:0 });

			TweenLite.set(moreSkillsContainer, { autoAlpha:0, rotationX:50,transformOrigin:"50% 0%" });

			TweenLite.set(moreSkillTiles, { autoAlpha:0, y:30 });

			TweenLite.set(popup, { autoAlpha:0, display:"none" , y:20});
		}
			
	}/* /setTweens */


			/*  =workForEachSlideAnims */	
		// Function workForEachSlideAnims for all the extra work:to find out when to run animations and for which slide to run the animations
		// NOTE: This function also includes the code that fades out the loader or in other words loads the page for the user
	function workForEachSlideAnims(runningOnLoad){
		currentSlideNumber = detectTheSlideNumber();


			// This IF Block Executes When:
				// 	1. If there is no prevSlideNumber which basically means its running on load 
				//  		OR
				//  2. There is prevSlideNumber recorded but the prevSlideNumber is 
				// 	   not equal to the currentSLideNumber (which the user is clicking on)
				// 	   which basically means the user is changing the slides and triggering the hashchange event
		if (!prevSlideNumber || prevSlideNumber!=currentSlideNumber) {
			/* if check to see if there are previous animations running that need to be stopped from another slide*/
			if (allAnimationsHappening.length) {

				$.each(allAnimationsHappening,function(i,element){

					console.log(element);

					// https://greensock.com/forums/topic/8917-all-the-methods-to-kill-a-tween/
					if (element.kill){
						console.log('kill method available');
						element.kill(); // gsap method to kill an animation (https://greensock.com/docs/TweenLite/kill)
						
					}else if(element.killAll){
						console.log('killAll method available');
						element.killAll(); // gsap method to killALl animations of a stagger (https://greensock.com/forums/topic/8917-all-the-methods-to-kill-a-tween/ & https://greensock.com/docs/TweenLite/kill)
					}else{
						console.log('no methods available');
					}

				});
				allAnimationsHappening = [];
			}

				// recording the currentSlideNumber to prevSlideNumber to use it the next time user changes the slide
			prevSlideNumber = currentSlideNumber;

				// searching the dom for the element #p1, #p2, #p3, etc... as the currentSlideNumber changes
			var currentSlide = $("#p"+currentSlideNumber);


			// If running on load, then hook on to the custom event "windowLoaded" (which we will trigger on window load event),
			if (runningOnLoad) {
				
				$(window).on("windowLoaded",function(){

					if(!loadingInitalized){	
						loadingInitalized = true;
						console.log("windowLoaded");
						/* fadeOut loader : at this point the the site will be loaded from users point of view
											as the loader just starts to fadeOut
						*/
						if (currentSlideNumber==1) {
							timeOutForLoading = 0;
						}

						setTimeout(function(){
							var tl = new TimelineLite({onComplete: loaderFadedOut});
							tl.to(loader,.5,{
								autoAlpha:0,
								ease: Power2.easeOut
							})
							.set(currentSlide,{
								className:"+=loaded"
							},'-=.5');// adding loaded class to the slide as soon as the loader starts fading out

							// callback function after the above tl completes
							function loaderFadedOut(){
								// run animations now
								runAnimsForSlide(currentSlide,currentSlideNumber,runningOnLoad);
							}

						},timeOutForLoading);

					}	
				});
			}
			else{
			// else we run them after a timeout of slideTotalAnimationTime 

				//we are using this new variable which is assigned the value of the slideTotalAnimationTime to avoid overriding the original value
				var newSlideTotalAnimationTime = slideTotalAnimationTime;
				
				if (currentSlideNumber==1) {
					// if the current slide number is 1 we need to halve the wait time as you can analyze in the website
					newSlideTotalAnimationTime = slideTotalAnimationTime / 2;

				}

				setTimeout(function(){
					// running the animations after whatever the evaluated timeout value above is
					runAnimsForSlide(currentSlide,currentSlideNumber);
				},newSlideTotalAnimationTime);
			}

		}else{
			// if user have reached here, it means that user is trying to access the same slide again and we dont need to do anything now
			console.log("------ same slide ------");
		}
	
	}/*  /workForEachSlideAnims */



		/*  =runAnimsForSlide */
	// this function runs all the animations for a slide when called with a currentSlideElement,slideNumber and optionally runningOnLoad
	function runAnimsForSlide(currentSlideElement,slideNumber,runningOnLoad){
		// if the function is called without the param slideNumber then we just return right away alerting some message
		// making the function more robust -- slideNumber
		if (!currentSlideElement.length || !slideNumber) {
			alert('runAnimsForSlide called without a Slide DOM Element or a slide number, contact the developer for this issue and report the same');
			return ;
		}

		var $slide = currentSlideElement;
		var content = $slide.find(".content");

		// focus on the current page' content
		content.focus();
		
		// if runningOnLoad is true then perform the animations that are needed only once
		if (runningOnLoad) {
			var tlsidebar = new TimelineLite();

			tlsidebar.staggerTo(fadeInDownSidebar,1,{
				autoAlpha:1,
				y:0,
				ease: Back.easeOut.config(3)
			},.2)
			.set(footerName,{
				className:"+=signature"
			})
			.staggerTo(fadeInUpFooter,.5,{
				y:0,
				autoAlpha:1,
				ease: Power4.easeOut
			},.15,"+=1");

			/* will not kill these tweens as these are for footer*/		
		}

		// if slide number is between 0 and 7 (because we have 6 slides) then we do further work or else 
		// we assume that the user has typed on wrong slide number (or they are having fun)
		if (slideNumber>0 && slideNumber < 7) {
			// finding the animation elements inside this slide in order to animate only those
			var gsap = $slide.find(".gsap");
			var fadeInUpAnimation = gsap.filter(".fadeInUpAnimation");
			var fadeInLeftAnimation = gsap.filter(".fadeInLeftAnimation");
			
				/* =skills slide animations*/
			if (slideNumber == 2) {
				// alert('skill');
				
				var tMaxSkills = TweenMax.staggerTo(skillTiles,1.5,{
					autoAlpha:1,
					rotationX:0,
					ease: Back.easeOut.config(3)
				},.2);

				allAnimationsHappening.push(tMaxSkills); // call me
			
			}/* =skills slide animations*/


				/* =work slide animations*/
			if (slideNumber==3) {
				
				// if there are any fadeInUp animations in the work slide then sequence it to fadein the 
				// work tiles after them 
				// If not then just fade in the work tiles directly with TweenMax in the else statement
				if (fadeInUpAnimation.length) {
					
					var tmFadeInUpAndWork = new TimelineLite();

					tmFadeInUpAndWork.staggerTo(fadeInUpAnimation,.3,{
							autoAlpha:1,
							y:0
						},.15)
						.staggerTo(codepen__wrappers,.6,{
							autoAlpha:1,
							scale:1,
							ease: Back.easeOut.config(2)
						},.2);
					
					allAnimationsHappening.push(tmFadeInUpAndWork); // call me
					

				}else{
					
					var tmaxWorkTiles = TweenMax.staggerTo(codepen__wrappers,.6,{
						autoAlpha:1,
						scale:1,
						ease: Back.easeOut.config(2)
					},.2);

					allAnimationsHappening.push(tmaxWorkTiles); // call me
					

				}
				

			}/* =work slide animations*/

				

			// if statements for letter based animations
			var typingAnimation = gsap.filter(".typingAnimation");
			if (typingAnimation.length) {

				var tmTyping;

				if (slideNumber ==1 && runningOnLoad) {
					// adding a custom delay recorded earlier in the variable totalTimeForIntroCssAnims (in ms)
				   // to start this animation after the previous animations run in intro slide 
				   // (which are the 4 text lines which animate only onLoad)
				  tmTyping = new TimelineMax({delay:(totalTimeForIntroCssAnims/1000)});

				}
				else{
				  tmTyping = new TimelineMax({delay:0});
					
				}
				
				tmTyping.staggerTo(fadeInUpBeforeTyping,1.2,{
					autoAlpha:1,
					scale:1,
					ease: Elastic.easeOut.config(2)
				},.2)
					.staggerTo(typingAnimationLetters,.03,{
					autoAlpha:1,
					x:0,
					y:0,
					ease: Back.easeOut.config(4)
				},.05,"-=.5")
					.staggerTo(fadeInUpAfterTyping,.7,{
					autoAlpha:1,
					scale:1,
					y:0,
					ease: Back.easeOut.config(2)
				},.5).set(heart,{className:"+=pound"},"-=.5");
				

				allAnimationsHappening.push(tmTyping); // call me	
							
			}// else{ no typing Animations here }


			if (gsap.length) {
				
				// if statements for normal fadeIn animations
				
					// if both fadeInUpAnimation and fadeInLeftAnimation are present
				if (fadeInUpAnimation.length && fadeInLeftAnimation.length) {
					var tlFadeInUpDown = new TimelineLite();

					tlFadeInUpDown.staggerTo(fadeInUpAnimation,.7,{
						autoAlpha:1,
						y:0
					},.3).staggerTo(fadeInLeftAnimation,1,{
						autoAlpha:1,
						x:0
					},.5,"-=.5");

					allAnimationsHappening.push(tlFadeInUpDown); // call me					

				}else if (fadeInUpAnimation.length) {

					var tmaxFadeInUpOnly = TweenMax.staggerTo(fadeInUpAnimation,.7,{
						autoAlpha:1,
						y:0
					},.3);

					allAnimationsHappening.push(tmaxFadeInUpOnly); // call me
					
				}else if(fadeInLeftAnimation.length){

					var tmaxFadeInLeftOnly = TweenMax.staggerTo(fadeInLeftAnimation,1,{
						autoAlpha:1,
						x:0
					},.5);

					allAnimationsHappening.push(tmax); // call me
				
				}

			}else{console.log("there are no gsap elements in the slide number: " + slideNumber );}
		
		}else{
			// we reset the hash to null (which equals to  the address pmalhotra.com) in the else block / statement
			location.hash="";
		}
	}/* /runAnimsForSlide */





			/************
			
				Utility Functions

			*************/


			/* =workSortAndFilter */
		// Function workSortAndFilter to initiate isotope plugin for filtering the work tiles and attaching handler to the filter buttons
	function workSortAndFilter(){
		
		// initiate/instantiate isotope plugin ( read the docs here: https://isotope.metafizzy.co/#getting-started )
		workGrid.isotope({
		  itemSelector: '.grid-item',
		  layoutMode: 'fitRows'
		});

		workGrid.isotope({ filter: filterDefault });
			
		// event handler for work filters container and buttons inside it (by delegating the event to them)
		// search the meaning of the word delegation
		workFilters.on('click','.button',function(){
			filterChanged = true;
			// 'this' inside this handler refers to the button that was clicked on or 
			// the element in the event.target (which also gives the same result)

			var $this = $(this); // wrapping this in jQuery by doing '$()' around the element to use jQuery methods on it

			// using the method data to get the data-filter attribute from the buttons that is clicked
			var dataFilter = $this.data('filter');

			// remove active class from all the buttons (workFilterButtons recorded all of the buttons earlier)
			workFilterButtons.removeClass("active");
			// add active class to the button that is clicked ($this)
			$this.addClass("active");

			// filtering for the buttons dataFilter which is given in the html and recorded up above using the isotope filter api
			// ( for using the filter api read the docs here: https://isotope.metafizzy.co/filtering.html )
			workGrid.isotope({ filter: dataFilter });
		
		});
	}/* /workSortAndFilter */

			/* =detectTheSlideNumber */
		// Function detectTheSlideNumber to get the current slide number that the user has clicked on
	function detectTheSlideNumber(){
		var slideNumber,hash,filterLinkNumberPattern;
		// storing the hash value 
		hash = location.hash;

		filterLinkNumberPattern = /^\#link\d+((?=\/)|(?![\S]))/g; // pattern for testing if it is in the pattern link1#

		// testing with the pattern above (filterLinkNumberPattern) to test if its true otherwise setting the slide number
		// to 1 by returning 1 in the else statement
		if (filterLinkNumberPattern.test(hash)) {
			return slideNumber =  String(/\d{1,5}((?=\/)|(?![\S]))/.exec(hash)).replace(/[^0-9]/g,"");
		}else{
			return 1;
		}
	
	}/* /detectTheSlideNumber */

		/* =removeCodepens */
	// function to remove all codepens at once when the dom is ready to be manipulated
	function removeCodepens(){
		// looping over codepen__wrappers
		codepen__wrappers.each(function(i,elem){
			var $this = $(this);
			// removing each one of the codepen__wrappers
			$this.remove();
			// storing the whole outerHTML into the array codepensHtml
			codepensHtml.push($this[0].outerHTML);
			// while we have removed the codepens inside we add the html for workGrid loading spinner animation to show the loading status
			workGridItem.eq(i).html(htmlForWorkGridLoader);
		});
		console.log('total number of pens in html are: ' + codepensHtml.length);
	}/* /removeCodepens */


		/* =addBackCodepens */
	// function to add codepens back to page one by one
	function addBackCodepens(){
		// array to save each `.grid-item` to get them by indexes
		var indexedGridItems = [];
		// looping over each `.grid-item`
		workGridItem.each(function(i){
			indexedGridItems.push(this);
		});

		// index variable to use as counter inside rAF
		var i = 0;
		// call rAF with addPen function
		requestAnimationFrame(addPen);
		function addPen(){
			// get the grid item to add to html
			var gridItemToUse = $(indexedGridItems[i]);
			if (!gridItemToUse.length) {
				// return if there are no more containers means every pens been loaded
				return;
			}

			// timeout between requesting a pen
			setTimeout(function(){

				// adding the pen back and also the html for loader so that the laoding status still remains
				gridItemToUse.html(codepensHtml[i] + htmlForWorkGridLoader);

				// timeout before swapping out the loader above the work-grid
				setTimeout(function(){
					// getting the loader element sitting on top of the grid item
					var gridItemLoader = gridItemToUse.find('.gridItemLoader');
					TweenLite.to(gridItemLoader,animTimeForGridItemLoaderSwapOut,{
						autoAlpha:0,
						y: "-80%"
					});
				},waitTimeForGridItemLoaderSwapOut);

				i++; // increment to get the next pen stored in the array (and thus adding the pen to the next `.grid-item`)
				
				// calling addPen again from rAF
				requestAnimationFrame(addPen);

			},waitTimeBetweenRequestingPens);
		}

	}/* /addBackCodepens */

	

}());/* iife/siaf closure ends*/