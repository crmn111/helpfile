/*!
 *
 * Helpfile
 *
 * A usable helpfile component with a fresh layout, that should look and feel good, cross-application, keyboard accessible
 *
 * Pass the version number through the url
 *
 * Dependencies: jQuery
 *
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Author: dirkjan@degroot.in
 * Version: 0.2
 * Date: 03-11-2011
 */


var version = window.location.search.substring(1);
var version = version.split("version=");

var appName = 'Appname';
var appVersion = version[1] || '2.0';
var appTitle = appName + ' ' + appVersion;

function goToByScroll(id){
	function m(tr) {
		return Math.round(tr);
	}
    try {
        var header = $('#start').height() + $('div.bar').height();
        var realtop = (id === '#start') ? 0 : $(id).offset().top;
        var scrolltop = (id === '#start') ? 0 : $("div.col-2 div.head").scrollTop();
        var xtop = m(scrolltop + realtop)-2;
        $(id).parent("div.section").effect("highlight", {}, 3000);
        $('div.col-2 div.head').animate({scrollTop: (xtop-header-5)},250);
    } catch(e) {}
}

$(document).ready(function(){
	document.title = appTitle;	
	$("span.appname").each(function(){
		$(this).html(appName);
	});
		
	$(".col-2 h1").html(appName + ' help');
	$("#version").html(appVersion);	
	$("#name").html(appName);	
	
	var d = new Date();
	var curr_date = d.getDate();
	var curr_month = d.getMonth() + 1; //months are zero based
	var curr_year = d.getFullYear();
	
	$("#date").html(curr_date + "-" + curr_month + "-" + curr_year);
	
	$(".filetree").treeview({
		animated: "fast",
		collapsed: true,
		persist: "cookie"
	});
	
	$(".filetree a").on('click', function(){
		var href = $(this).attr('href');
		goToByScroll(href);
		return false;
	});
	
	$(".col-2 > div > div.section").each(function(){
		$(this).append('<a href="#" class="up">Scroll Up</a>');
	});
	
	$(".up").on('click',function(e) {
		e.preventDefault();
		goToByScroll('#start');
	});
	
	var combo = '<div class="style-switcher">'+
                    '<label for="style">Style Switcher</label>'+
                    '<select id="style">'+
                        '<option value="basic">Basic</option>'+
                        '<option value="fresh">Fresh</option>'+
                        '<option value="formal">Formal</option>'+
                    '</select>'+
                '</div>';
	
	$(".col-2 .bar").append(combo);

	$(document).on('click','.style-switcher label',function(){
		$(this).next().effect("highlight", {}, 3000);
	});
	
	self.target = $('option:selected', 'select#target').val();
	
	$(document).on('change','.style-switcher select',function() {
		$("body").removeClass('fresh formal basic').addClass($('option:selected', $(this)).val().toLowerCase());
        $.cookie('help_style', $(this).val());
	});

    $("a.print").on('click',function() {
        window.print();
        return false;
    });

    /* wire up highlight plugin */

    $(document).on('click','div.highlight button',function() {
        var v = $(this).siblings('input').val();
        if($.trim(v) === '') {
            $('.col-2').removeHighlight();
        }
        if($.trim(v).length > 2) {
            $('.col-2').highlight(v);
            $.cookie('help_highlight', v);
        }
    });

    function manageZindex() {
        var zindex = ($.trim($("div.highlight input").val()).length > 0) ? '999' : '-1';
        $("a.reset").css({'z-index' : zindex});
    }

    $(document).on('keyup','div.highlight input',function(e) {
        switch(e.type) {
            case 'keyup' :
                manageZindex();

                var key = (e.keyCode ? e.keyCode : e.which);
                if (key == $.ui.keyCode.ENTER) { //Enter keycode
                   $('div.highlight button').trigger('click');
                }
            break;
        }
    });

    $(document).on('click', 'a.reset', function() {
        $(this).siblings('input').val('');
        $(this).css({'z-index' : '-1'});
        $.cookie('help_highlight', null);
        return false;
    });

    $('div.head').scroll( $.throttle( 2000, function() {
            $.cookie('help_scrollpos', $(this).scrollTop());
        }
    ));

    if($.cookie('help_scrollpos')) {
        $('div.head').scrollTop($.cookie('help_scrollpos'));
    }

    if($.cookie('help_highlight')) {
        $('div.highlight input').val($.cookie('help_highlight'));
        $('div.highlight button').trigger('click');
    }

    if($.cookie('help_style')) {
        $('.style-switcher select option[value="'+$.cookie('help_style')+'"]').attr('selected', true);
        $('.style-switcher select').trigger('change');
    }

    if($.cookie('help_resize')) {
        $('body').removeClass('normal larger largest').addClass($.cookie('help_resize'));
    }

    $('a.clear').on('click', function() {
        $('.col-2').removeHighlight();
        $.cookie('help_highlight', null);
        return false;
    });

    manageZindex();

    /* add font resize: */
    $('div.col-2 div.bar').append('<div class="resize"><span>Font size:</span> <a href="#normal" class="normal" title="Make font default sized">A</a> | <a href="#larger" class="larger" title="Make font larger">A</a> | <a href="#largest" class="largest" title="Make font largest">A</a></div>');

    $(document).on('click', 'div.resize a', function() {
        $('body').removeClass('normal larger largest').addClass($(this).attr('class'));
        $.cookie('help_resize', $(this).attr('class'));
        return false;
    });

    /* add toggles: */
    $('div.col-1 div.bar').after('<div class="toggles"><a href="#collapse" class="collapse">Collapse all</a> | <a href="#expand" class="expand">Expand all</a></div>');

    $(document).on('click', 'div.toggles a.collapse', function() {
        $('ul.filetree li.collapsable .hitarea').trigger('click');
        return false;
    });

    $(document).on('click', 'div.toggles a.expand', function() {
        $('ul.filetree li.expandable .hitarea').trigger('click');
        return false;
    });

    /* wire up keyboard shortcuts : */

    $('ul.filetree a').on('click', function() {
        $('ul.filetree a').removeClass('active');
        $(this).addClass('active').focus();
    });

    $(document).jkey('esc,right,left,end,home',true,function(sKey,oEvent){
        var et = oEvent.target.nodeName.toLowerCase() || null;
        var base = $('ul.filetree a.active');
        base.removeClass('active').blur();
        if (et !== 'input' && et !== 'textarea') {

            if(sKey == 'escape') {
                $("div.window_panel", window.parent.document).hide();
                $("button.help", window.parent.document).removeClass('active');
            }

            if(base.length) {
                switch(sKey){
                    case 'right' :
                        var basenext = (base.closest('li').find('ul').length) ? base.closest('li').find('ul li:first') : (base.closest('li').next().length) ? base.closest('li').next() : base.parents('ul.filetree > li').next();
                        if(basenext.hasClass('expandable')) { basenext.find('.hitarea').trigger('click'); }
                        if(base.parents('ul.filetree > li').hasClass('expandable')) { base.parents('ul.filetree > li').find('.hitarea').trigger('click'); }
                        basenext.find('a').filter(':first').trigger('click');
                    break;
                    case 'left' :
                        var baseprev = (base.closest('li').prev().length) ? (base.closest('li').prev().find('ul').length) ? base.closest('li').prev().find('ul li:last') : base.closest('li').prev() : (base.parents('ul.filetree > li').find('span.folder').length) ? base.closest('ul').prev('span.folder') : base.parents('ul.filetree > li').prev();
                        base.closest('li').find('span.folder');
                        if(baseprev.hasClass('expandable')) { baseprev.find('.hitarea').trigger('click'); }
                        if(base.closest('li').hasClass('collapsable') && base.parents('span.folder').length) { base.closest('li').find('.hitarea').trigger('click'); }
                        baseprev.find('a').filter(':first').trigger('click');
                    break;
                    case 'home' :
                        $('ul.filetree a:first').trigger('click');
                    break;
                    case 'end' :
                        $('ul.filetree a:last').trigger('click');
                    break;
                    /*case 'm' :
                        if(oEvent.altKey) {
                            $('a.print').trigger('click');
                        }
                        return false;
                    break;*/
                }
            } else {
                $('ul.filetree a:first').trigger('click');
            }
        }
    });

});