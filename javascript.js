$(document).ready(function(){
	$(".textinput:first").focus();
	$("textarea").autoResize().change();
	$("#thingswedo").masonry();
	$(".tag").click(function() {
		$("#thingswedo li.li_"+$(this).html()).animate({opacity:"1"},250);
		$("#thingswedo li").not(".li_"+$(this).html()).animate({opacity:".25"},250);
		$("#p_tags a.selected").removeClass("selected");
		$("#p_tags").find("a:contains('"+$(this).html()+"')").addClass("selected");
		return false;
	});
	$("#a_reset").click(function() {
		$("#p_tags a.selected").removeClass("selected");
		$("#thingswedo li").animate({opacity:"1"},250); //removeClass("ghost");
		return false;
	});
	$("body").click(function() {
		$("#p_tags a.selected").removeClass("selected");
		$("#thingswedo li").animate({opacity:"1"},250); //removeClass("ghost");
	});
	$("#veil").click(function(){
		$("#veil").fadeOut("slow");
		$(".panel").fadeOut("slow");
		return false;
	})
	$(".a_edit").click(function(){
		$("#edit_id").val($(this).attr("rel"));
		$("#edit_title").val($(this).parent().find(".span_title").html());
		$("#edit_description").val($(this).parent().find(".span_description").html());
		$("#edit_tags").val($(this).parent().find(".span_tags").html());
		$("#veil").fadeIn("slow");
		$("#panel_edit").fadeIn("slow");
		return false;
	})
	$("#a_new").click(function(){
		$("#veil").fadeIn("slow");
		$("#panel_new").fadeIn("slow");
		return false;
	})
	$(window).bind("keydown", function (e) {
		key = e.which;
		whichpanel = $(".selected").attr("rel");
		if (whichpanel == undefined) { whichpanel = 0; }
		if (key == 37) {
			whichpanel--;
			if (whichpanel < 0) {
				whichpanel = $("#p_tags a").size()-1;
			}
			$("#p_tags a:eq("+whichpanel+")").click();
			return false;
		}
		if (key == 39) {
			whichpanel++;
			if (whichpanel > $("#p_tags a").size()-1) {
				whichpanel = 0;
			}
			$("#p_tags a:eq("+whichpanel+")").click();
			return false;
		}
	});

});

// http://james.padolsey.com/javascript/jquery-plugin-autoresize/
(function(a){a.fn.autoResize=function(j){var b=a.extend({onResize:function(){},animate:true,animateDuration:150,animateCallback:function(){},extraSpace:20,limit:1000},j);this.filter('textarea').each(function(){var c=a(this).css({resize:'none','overflow-y':'hidden'}),k=c.height(),f=(function(){var l=['height','width','lineHeight','textDecoration','letterSpacing'],h={};a.each(l,function(d,e){h[e]=c.css(e)});return c.clone().removeAttr('id').removeAttr('name').css({position:'absolute',top:0,left:-9999}).css(h).attr('tabIndex','-1').insertBefore(c)})(),i=null,g=function(){f.height(0).val(a(this).val()).scrollTop(10000);var d=Math.max(f.scrollTop(),k)+b.extraSpace,e=a(this).add(f);if(i===d){return}i=d;if(d>=b.limit){a(this).css('overflow-y','');return}b.onResize.call(this);b.animate&&c.css('display')==='block'?e.stop().animate({height:d},b.animateDuration,b.animateCallback):e.height(d)};c.unbind('.dynSiz').bind('keyup.dynSiz',g).bind('keydown.dynSiz',g).bind('change.dynSiz',g)});return this}})(jQuery);

/*************************************************
**  jQuery Masonry version 1.0.1
**  copyright David DeSandro, licensed GPL & MIT
**  http://desandro.com/resources/jquery-masonry
**************************************************/
;(function($){$.fn.masonry=function(options,callback){function placeBrick($brick,setCount,setY,setSpan,props){var shortCol=0;for(i=0;i<setCount;i++){if(setY[i]<setY[shortCol])shortCol=i}$brick.css({top:setY[shortCol],left:props.colW*shortCol+props.posLeft});for(i=0;i<setSpan;i++){props.colY[shortCol+i]=setY[shortCol]+$brick.outerHeight(true)}}function masonrySetup($wall,opts,props){props.$bricks=opts.itemSelector==undefined?opts.$brickParent.children():opts.$brickParent.find(opts.itemSelector);if(opts.columnWidth==undefined){props.colW=props.masoned?$wall.data('masonry').colW:props.$bricks.outerWidth(true)}else{props.colW=opts.columnWidth}props.colCount=Math.floor($wall.width()/props.colW);props.colCount=Math.max(props.colCount,1)}function masonryArrange($wall,opts,props){if(!props.masoned)$wall.css('position','relative');if(!props.masoned||opts.appendedContent!=undefined){props.$bricks.css('position','absolute')}var cursor=$('<div />');$wall.prepend(cursor);props.posTop=Math.round(cursor.position().top);props.posLeft=Math.round(cursor.position().left);cursor.remove();if(props.masoned&&opts.appendedContent!=undefined){props.colY=$wall.data('masonry').colY;for(i=$wall.data('masonry').colCount;i<props.colCount;i++){props.colY[i]=props.posTop}}else{props.colY=[];for(i=0;i<props.colCount;i++){props.colY[i]=props.posTop}}if(opts.singleMode){props.$bricks.each(function(){var $brick=$(this);placeBrick($brick,props.colCount,props.colY,1,props)})}else{props.$bricks.each(function(){var $brick=$(this);var colSpan=Math.ceil($brick.outerWidth(true)/props.colW);colSpan=Math.min(colSpan,props.colCount);if(colSpan==1){placeBrick($brick,props.colCount,props.colY,1,props)}else{var groupCount=props.colCount+1-colSpan;var groupY=[0];for(i=0;i<groupCount;i++){groupY[i]=0;for(j=0;j<colSpan;j++){groupY[i]=Math.max(groupY[i],props.colY[i+j])}}placeBrick($brick,groupCount,groupY,colSpan,props)}})}props.wallH=0;for(i=0;i<props.colCount;i++){props.wallH=Math.max(props.wallH,props.colY[i])}$wall.height(props.wallH-props.posTop);callback.call(props.$bricks);$wall.data('masonry',props)}function masonryResize($wall,opts,props){var prevColCount=$wall.data('masonry').colCount;masonrySetup($wall,opts,props);if(props.colCount!=prevColCount)masonryArrange($wall,opts,props)}return this.each(function(){var $wall=$(this);var props=$.extend({},$.masonry);props.masoned=$wall.data('masonry')!=undefined;var previousOptions=props.masoned?$wall.data('masonry').options:{};var opts=$.extend({},props.defaults,previousOptions,options);props.options=opts.saveOptions?opts:previousOptions;callback=callback||function(){};if(props.masoned&&opts.appendedContent!=undefined){opts.$brickParent=opts.appendedContent}else{opts.$brickParent=$wall}if(opts.$brickParent.children().length>0){masonrySetup($wall,opts,props);masonryArrange($wall,opts,props);var resizeOn=previousOptions.resizeable;if(!resizeOn&&opts.resizeable){$(window).bind('resize.masonry',function(){masonryResize($wall,opts,props)})}if(resizeOn&&!opts.resizeable)$(window).unbind('resize.masonry')}else{return this}})};$.masonry={defaults:{singleMode:false,columnWidth:undefined,itemSelector:undefined,appendedContent:undefined,saveOptions:true,resizeable:true},colW:undefined,colCount:undefined,colY:undefined,wallH:undefined,masoned:undefined,posTop:0,posLeft:0,options:undefined,$bricks:undefined,$brickParent:undefined}})(jQuery);

// http://remysharp.com/wp-content/uploads/2007/12/tagging.php
(function($){var globalTags=[];window.setGlobalTags=function(tags){globalTags=getTags(tags)};function getTags(tags){var tag,i,goodTags=[];for(i=0;i<tags.length;i++){tag=tags[i];if(typeof tags[i]=='object'){tag=tags[i].tag}goodTags.push(tag.toLowerCase())}return goodTags}$.fn.tagSuggest=function(options){var defaults={'matchClass':'tagMatches','tagContainer':'span','tagWrap':'span','sort':true,'tags':null,'url':null,'delay':0,'separator':' '};var i,tag,userTags=[],settings=$.extend({},defaults,options);if(settings.tags){userTags=getTags(settings.tags)}else{userTags=globalTags}return this.each(function(){var tagsElm=$(this);var elm=this;var matches,fromTab=false;var suggestionsShow=false;var workingTags=[];var currentTag={"position":0,tag:""};var tagMatches=document.createElement(settings.tagContainer);function showSuggestionsDelayed(el,key){if(settings.delay){if(elm.timer)clearTimeout(elm.timer);elm.timer=setTimeout(function(){showSuggestions(el,key)},settings.delay)}else{showSuggestions(el,key)}}function showSuggestions(el,key){workingTags=el.value.split(settings.separator);matches=[];var i,html='',chosenTags={},tagSelected=false;currentTag={position:currentTags.length-1,tag:''};for(i=0;i<currentTags.length&&i<workingTags.length;i++){if(!tagSelected&&currentTags[i].toLowerCase()!=workingTags[i].toLowerCase()){currentTag={position:i,tag:workingTags[i].toLowerCase()};tagSelected=true}chosenTags[currentTags[i].toLowerCase()]=true}if(currentTag.tag){if(settings.url){$.ajax({'url':settings.url,'dataType':'json','data':{'tag':currentTag.tag},'async':false,'success':function(m){matches=m}})}else{for(i=0;i<userTags.length;i++){if(userTags[i].indexOf(currentTag.tag)===0){matches.push(userTags[i])}}}matches=$.grep(matches,function(v,i){return!chosenTags[v.toLowerCase()]});if(settings.sort){matches=matches.sort()}for(i=0;i<matches.length;i++){html+='<'+settings.tagWrap+' class="_tag_suggestion">'+matches[i]+'</'+settings.tagWrap+'>'}tagMatches.html(html);suggestionsShow=!!(matches.length)}else{hideSuggestions()}}function hideSuggestions(){tagMatches.empty();matches=[];suggestionsShow=false}function setSelection(){var v=tagsElm.val();if(v==tagsElm.attr('title')&&tagsElm.is('.hint'))v='';currentTags=v.split(settings.separator);hideSuggestions()}function chooseTag(tag){var i,index;for(i=0;i<currentTags.length;i++){if(currentTags[i].toLowerCase()!=workingTags[i].toLowerCase()){index=i;break}}if(index==workingTags.length-1)tag=tag+settings.separator;workingTags[i]=tag;tagsElm.val(workingTags.join(settings.separator));tagsElm.blur().focus();setSelection()}function handleKeys(ev){fromTab=false;var type=ev.type;var resetSelection=false;switch(ev.keyCode){case 37:case 38:case 39:case 40:{hideSuggestions();return true}case 224:case 17:case 16:case 18:{return true}case 8:{if(this.value==''){hideSuggestions();setSelection();return true}else{type='keyup';resetSelection=true;showSuggestionsDelayed(this)}break}case 9:case 13:{if(suggestionsShow){chooseTag(matches[0]);fromTab=true;return false}else{return true}}case 27:{hideSuggestions();setSelection();return true}case 32:{setSelection();return true}}if(type=='keyup'){switch(ev.charCode){case 9:case 13:{return true}}if(resetSelection){setSelection()}showSuggestionsDelayed(this,ev.charCode)}}tagsElm.after(tagMatches).keypress(handleKeys).keyup(handleKeys).blur(function(){if(fromTab==true||suggestionsShow){fromTab=false;tagsElm.focus()}});tagMatches=$(tagMatches).click(function(ev){if(ev.target.nodeName==settings.tagWrap.toUpperCase()&&$(ev.target).is('._tag_suggestion')){chooseTag(ev.target.innerHTML)}}).addClass(settings.matchClass);setSelection()})}})(jQuery);
