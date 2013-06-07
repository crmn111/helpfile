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
 * Location: https://github.com/dirkjan111/helpfile
 * Version: 0.3
 * Date: 03-11-2011
 */

/*jshint camelcase:true, curly:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, noarg:true, noempty:true, nonew:true, undef:true, unused:true, strict:true, trailing:true, browser:true, jquery:true */

(function($) {

    "use strict";

    $.fn.setSelection = function(selectionStart, selectionEnd) {
        if(this.length == 0) return this;
        var input = this[0];

        if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selectionEnd);
            range.moveStart('character', selectionStart);
            range.select();
        } else if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(selectionStart, selectionEnd);
        }
        return this;
    };

    $.fn.setCursorPosition = function(position){
        if(this.length == 0) return this;
        return $(this).setSelection(position, position);
    };

    $.fn.focusEnd = function(e){
        this.setCursorPosition(this.val().length);
        return this;
    };

    try {
        var version = window.location.search.substring(1);
        var version = version.split("version=");

        var appName = 'Appname';
        var appVersion = version[1] || '2.0';
        var appTitle = appName + ' ' + appVersion;
        var topPanel = '142';
    } catch(e) {}


    var goToByScroll = function(id, callback){
        function m(tr) {
            return Math.round(tr);
        }
        try {
            var callback = (callback) ? callback : $.noop;
            var header = $('#start').height() + $('div.bar').height();
            var realtop = (id === '#start') ? 0 : $(id).offset().top;
            var scrolltop = (id === '#start') ? 0 : $("div.col-2 div.head").scrollTop();
            var xtop = m(scrolltop + realtop)-2;

            if($('body').hasClass('noir')) {
                $(id).parent("div.section").effect("highlight", { 'color' : '#0924ED' }, 3000);
            } else {
                $(id).parent("div.section").effect("highlight", {}, 3000);
            }

            $('div.col-2 div.head').animate({scrollTop: (xtop-header-5)},250, callback);
        } catch(e) {}
    };

    var checkWidth = function() {
        var windowWidth = $(window).width();
        var dl = $("div.bar dl");
        (windowWidth < 1250) ? dl.hide() : dl.show();
    };

    var resizeSplitter = function() {
        var height = $(window).height()-2;
        var width = $(window).width();
        var splitterElement = $("#splitter"),
        splitterObject = splitterElement.data("kendoSplitter");
        splitterElement.css({width: width + 'px', height: height + 'px' });
        splitterObject.trigger("resize");
    };

    var toggleHighLightArea = function(type) {
        /* if highlight area is hidden, then ease in */
        var marginRight = (type==='show') ? 67 : 0;
        var base = $('div.hlight');

        $('.col-2 div.contents').animate({
            marginRight : marginRight + 'px'
        },200);
    };

    var drawMarkers = function() {
        /* draw the markers in the highlight area */

        /* height of the header: */
        var header = 118;

        /* remove the highlights */
        $('div.hlight a').remove();

        toggleHighLightArea('show');

        var proceed = function() {
            var base = $('.col-2 div.contents > div');
            var scrolltop =$('.col-2 div.contents');


            /* see how big are the canvases */
            var heightFixed = $('div.hlight').height();
            var heightFlex = base.height();

            /* fill the array with size objects */
            var arrayOfHighlightsRatios = [];

            $('span.highlight').each(function(k,v){
                var topPos = Math.floor($(this).offset().top) - header;
                var obj = {
                    flex: topPos,
                    fix: Math.floor(topPos/heightFlex*heightFixed),
                    text: $(this).text()
                };
                $(this).attr('rel','m'+k);
                arrayOfHighlightsRatios.push(obj);
            });

            /* add and animate the highlights */
            $.each(arrayOfHighlightsRatios, function(k,v) {
                $('div.hlight').append('<a href="#" id="m'+k+'" class="marker" title="'+ v.text+'" style="top:'+ v.fix+'px" rel="'+ v.flex+'"></a>');
                $('div.hlight m'+k).hide().delay(200).fadeIn('medium');
            });

            $(document).off('click','div.hlight a.marker').on('click','div.hlight a.marker', function() {
                var rel = $(this).attr('rel');
                var id = $(this).attr('id');
                $('*').removeClass('focus');
                $(this).addClass('focus');
                $('.col-2 div.contents span.highlight[rel="'+id+'"]').addClass('focus');
                $('div.col-2 div.head').animate({scrollTop: rel},250);
                return false;
            });
        }

        /* scroll to top */
        goToByScroll('#start', proceed);
    };


    $(window).resize(function () {
        checkWidth();
        resizeSplitter();
        drawMarkers();
    });

    $(document).ready(function () {

        $("#splitter").kendoSplitter({
            orientation: "horizontal",
            panes: [
                { collapsible: true, resizable:true, min:'300px', max:'500px', size:'19%' },
                { collapsible: false }
            ]
        });

        checkWidth();
        resizeSplitter();

        //focus the widget
        $(document).on("keydown.examples", function(e) {
            if (e.altKey && e.keyCode === 87 /* w */) {
                $("#splitter").find(".k-splitbar:first").focus();
            }
        });

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
                            '<option value="noir">Noir</option>'+
                        '</select>'+
                    '</div>';

        $(".col-2 .bar").append(combo);

        $(document).on('click','.style-switcher label',function(){
            $(this).next().effect("highlight", {}, 3000);
        });

        self.target = $('option:selected', 'select#target').val();

        $(document).on('change','.style-switcher select',function() {
            $("body").removeClass('fresh formal basic noir').addClass($('option:selected', $(this)).val().toLowerCase());
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
            setTimeout(function() {
                drawMarkers();
            },1000);

        });

        var manageZindex = function() {
            var zindex = ($.trim($("div.highlight input").val()).length > 0) ? '999' : '-1';
            $("a.reset").css({'z-index' : zindex});
        };

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
            $('div.hlight a').remove();
            toggleHighLightArea('clear');
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


        $('ul.filetree a').on('click', function() {
            $('ul.filetree a').removeClass('active');
            $(this).addClass('active').focus();
        });

        /* wire up keyboard shortcuts : */


        $(document).jkey('h',false,function(sKey,oEvent){
            var et = oEvent.target.nodeName.toLowerCase() || null;
            if (et !== 'input' && et !== 'textarea' && et !== 'select') {
                switch(sKey){
                    case 'h' :
                            $('input#highlight').focusEnd();
                    break;
                }
            }
        });

        $(document).jkey('esc,right,left,end,home',true,function(sKey,oEvent){
            var et = oEvent.target.nodeName.toLowerCase() || null;
            var base = $('ul.filetree a.active');
            var nrInTree = $('ul.filetree a').length;

            var hlBase = $('div.hlight');
            var nrFocus = hlBase.find('a.focus').length;
            var nrHighlights = hlBase.find('a').length;

            base.removeClass('active').blur();

            if(sKey == 'escape') {
                $("div.window_panel", window.parent.document).hide();
                $("button.help", window.parent.document).removeClass('active');
            }

            switch(sKey){
                case 'right' :
                    if (oEvent.ctrlKey) {
                        if(nrFocus === 0 || hlBase.find('a.focus').index()+1 === nrHighlights) {
                            hlBase.find('a:first').trigger('click');
                        } else {
                            hlBase.find('a.focus').next().trigger('click');
                        }
                        return;
                    }

                    if (!oEvent.ctrlKey && !oEvent.altKey) {
                        if(base.length === 0 || base.index() === nrInTree) {
                            return $('ul.filetree a:first').trigger('click');
                        }

                        var basenext = (base.closest('li').find('ul').length) ? base.closest('li').find('ul li:first') : (base.closest('li').next().length) ? base.closest('li').next() : base.parents('ul.filetree > li').next();
                        if(basenext.hasClass('expandable')) { basenext.find('.hitarea').trigger('click'); }
                        if(base.parents('ul.filetree > li').hasClass('expandable')) { base.parents('ul.filetree > li').find('.hitarea').trigger('click'); }
                        basenext.find('a').filter(':first').trigger('click');
                    }
                break;
                case 'left' :
                    if (oEvent.ctrlKey) {
                        if(nrFocus === 0 || hlBase.find('a.focus').index() === 0) {
                            hlBase.find('a:last').trigger('click');
                        } else {
                            hlBase.find('a.focus').prev().trigger('click');
                        }
                        return;
                    }

                    if (!oEvent.ctrlKey && !oEvent.altKey) {
                        /*if(base.index() === 0) {
                            return $('ul.filetree a:last').trigger('click');
                        }*/

                        var baseprev = (base.closest('li').prev().length) ? (base.closest('li').prev().find('ul').length) ? base.closest('li').prev().find('ul li:last') : base.closest('li').prev() : (base.parents('ul.filetree > li').find('span.folder').length) ? base.closest('ul').prev('span.folder') : base.parents('ul.filetree > li').prev();
                        base.closest('li').find('span.folder');
                        if(baseprev.hasClass('expandable')) { baseprev.find('.hitarea').trigger('click'); }
                        if(base.closest('li').hasClass('collapsable') && base.parents('span.folder').length) { base.closest('li').find('.hitarea').trigger('click'); }
                        baseprev.find('a').filter(':first').trigger('click');
                    }

                    break;
                case 'home' :
                    $('ul.filetree a:first').trigger('click');
                break;
                case 'end' :
                    $('ul.filetree a:last').trigger('click');
                break;
            }


        });

    });

}(jQuery));