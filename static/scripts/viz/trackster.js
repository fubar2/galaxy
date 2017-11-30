define("viz/trackster",["exports","libs/underscore","viz/trackster/tracks","viz/visualization","mvc/ui/icon-button","utils/query-string-parsing","mvc/grid/grid-view","utils/utils","libs/jquery/jquery.event.drag","libs/jquery/jquery.event.hover","libs/jquery/jquery.mousewheel","libs/jquery/jquery-ui","libs/jquery/select2","libs/farbtastic","libs/jquery/jquery.form","libs/jquery/jquery.rating","ui/editable-text"],function(e,t,a,i,o,n,r,s){"use strict";function l(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(e,"__esModule",{value:!0});var d=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}(t),c=l(a),u=l(i),f=l(o),v=l(n),_=l(r),h=l(s),w=null,b=null,p=function(){this.initialize&&this.initialize.apply(this,arguments)};p.extend=Backbone.Model.extend;var y=p.extend({initialize:function(e){h.default.cssLoadFile("static/style/jquery.rating.css"),h.default.cssLoadFile("static/style/autocomplete_tagging.css"),h.default.cssLoadFile("static/style/jquery-ui/smoothness/jquery-ui.css"),h.default.cssLoadFile("static/style/library.css"),h.default.cssLoadFile("static/style/trackster.css"),this.baseURL=e},save_viz:function(){Galaxy.modal.show({title:"Saving...",body:"progress"});var e=[];$(".bookmark").each(function(){e.push({position:$(this).children(".position").text(),annotation:$(this).children(".annotation").text()})});var t=b.overview_drawable?b.overview_drawable.config.get_value("name"):null,a={view:b.to_dict(),viewport:{chrom:b.chrom,start:b.low,end:b.high,overview:t},bookmarks:e};return $.ajax({url:Galaxy.root+"visualization/save",type:"POST",dataType:"json",data:{id:b.vis_id,title:b.config.get_value("name"),dbkey:b.dbkey,type:"trackster",vis_json:JSON.stringify(a)}}).success(function(e){Galaxy.modal.hide(),b.vis_id=e.vis_id,b.has_changes=!1,window.history.pushState({},"",e.url+window.location.hash)}).error(function(){Galaxy.modal.show({title:"Could Not Save",body:"Could not save visualization. Please try again later.",buttons:{Cancel:function(){Galaxy.modal.hide()}}})})},createButtonMenu:function(){var e=this,t=f.default.create_icon_buttons_menu([{icon_class:"plus-button",title:"Add tracks",on_click:function(){u.default.select_datasets({dbkey:b.dbkey},function(e){d.each(e,function(e){b.add_drawable(c.default.object_from_template(e,b,b))})})}},{icon_class:"block--plus",title:"Add group",on_click:function(){b.add_drawable(new c.default.DrawableGroup(b,b,{name:"New Group"}))}},{icon_class:"bookmarks",title:"Bookmarks",on_click:function(){force_right_panel("0px"==$("div#right").css("right")?"hide":"show")}},{icon_class:"globe",title:"Circster",on_click:function(){window.location=e.baseURL+"visualization/circster?id="+b.vis_id}},{icon_class:"disk--arrow",title:"Save",on_click:function(){e.save_viz()}},{icon_class:"cross-circle",title:"Close",on_click:function(){e.handle_unsaved_changes(b)}}],{tooltip_config:{placement:"bottom"}});return this.buttonMenu=t,t},add_bookmark:function(e,t,a){var i=$("#right .unified-panel-body"),o=$("<div/>").addClass("bookmark").appendTo(i),n=$("<div/>").addClass("position").appendTo(o),r=($("<a href=''/>").text(e).appendTo(n).click(function(){return b.go_to(e),!1}),$("<div/>").text(t).appendTo(o));if(a){var s=$("<div/>").addClass("delete-icon-container").prependTo(o).click(function(){return o.slideUp("fast"),o.remove(),b.has_changes=!0,!1});$("<a href=''/>").addClass("icon-button delete").appendTo(s);r.make_text_editable({num_rows:3,use_textarea:!0,help_text:"Edit bookmark note"}).addClass("annotation")}return b.has_changes=!0,o},create_visualization:function(e,t,a,i,o){var n=this,r=new c.default.TracksterView(d.extend(e,{header:!1}));return r.editor=!0,$.when(r.load_chroms_deferred).then(function(e){if(t){var s=t.chrom,l=t.start,d=t.end,u=t.overview;s&&void 0!==l&&d?r.change_chrom(s,l,d):r.change_chrom(e[0].chrom)}else r.change_chrom(e[0].chrom);if(a)for(v=0;v<a.length;v++)r.add_drawable(c.default.object_from_template(a[v],r,r));for(v=0;v<r.drawables.length;v++)if(r.drawables[v].config.get_value("name")===u){r.set_overview(r.drawables[v]);break}if(i)for(var f,v=0;v<i.length;v++)f=i[v],n.add_bookmark(f.position,f.annotation,o);r.has_changes=!1}),this.set_up_router({view:r}),r},set_up_router:function(e){new u.default.TrackBrowserRouter(e),Backbone.history.start()},init_keyboard_nav:function(e){$(document).keyup(function(t){if(!$(t.srcElement).is(":input"))switch(t.which){case 37:e.move_fraction(.25);break;case 38:Math.round(e.viewport_container.height()/15);e.viewport_container.scrollTop(e.viewport_container.scrollTop()-20);break;case 39:e.move_fraction(-.25);break;case 40:Math.round(e.viewport_container.height()/15);e.viewport_container.scrollTop(e.viewport_container.scrollTop()+20)}})},handle_unsaved_changes:function(e){if(e.has_changes){var t=this;Galaxy.modal.show({title:"Close visualization",body:"There are unsaved changes to your visualization which will be lost if you do not save them.",buttons:{Cancel:function(){Galaxy.modal.hide()},"Leave without Saving":function(){$(window).off("beforeunload"),window.location=Galaxy.root+"visualization"},Save:function(){$.when(t.save_viz()).then(function(){window.location=Galaxy.root+"visualization"})}}})}else window.location=Galaxy.root+"visualization"}}),g=Backbone.View.extend({initialize:function(){(w=new y(Galaxy.root)).createButtonMenu(),w.buttonMenu.$el.attr("style","float: right"),$("#center .unified-panel-header-inner").append(w.buttonMenu.$el),$("#right .unified-panel-title").append("Bookmarks"),$("#right .unified-panel-icons").append("<a id='add-bookmark-button' class='icon-button menu-button plus-button' href='javascript:void(0);' title='Add bookmark'></a>"),$("#right-border").click(function(){b.resize_window()}),force_right_panel("hide"),galaxy_config.app.id?this.view_existing():v.default.get("dataset_id")?this.choose_existing_or_new():this.view_new()},choose_existing_or_new:function(){var e=this,t=v.default.get("dbkey"),a={},i={dbkey:t,dataset_id:v.default.get("dataset_id"),hda_ldda:v.default.get("hda_ldda"),gene_region:v.default.get("gene_region")};t&&(a["f-dbkey"]=t),Galaxy.modal.show({title:"View Data in a New or Saved Visualization?",body:"<p><ul style='list-style: disc inside none'>You can add this dataset as:<li>a new track to one of your existing, saved Trackster sessions if they share the genome build: <b>"+(t||"Not available.")+"</b></li><li>or create a new session with this dataset as the only track</li></ul></p>",buttons:{Cancel:function(){window.location=Galaxy.root+"visualizations/list"},"View in saved visualization":function(){e.view_in_saved(i)},"View in new visualization":function(){e.view_new()}}})},view_in_saved:function(e){var t=new _.default({url_base:Galaxy.root+"visualization/list_tracks",dict_format:!0,embedded:!0});Galaxy.modal.show({title:"Add Data to Saved Visualization",body:t.$el,buttons:{Cancel:function(){window.location=Galaxy.root+"visualizations/list"},"Add to visualization":function(){$(parent.document).find("input[name=id]:checked").each(function(){e.id=$(this).val(),window.location=Galaxy.root+"visualization/trackster?"+$.param(e)})}}})},view_existing:function(){var e=galaxy_config.app.viz_config;b=w.create_visualization({container:$("#center .unified-panel-body"),name:e.title,vis_id:e.vis_id,dbkey:e.dbkey},e.viewport,e.tracks,e.bookmarks,!0),this.init_editor()},view_new:function(){var e=this;$.ajax({url:Galaxy.root+"api/genomes?chrom_info=True",data:{},error:function(){alert("Couldn't create new browser.")},success:function(t){Galaxy.modal.show({title:"New Visualization",body:e.template_view_new(t),buttons:{Cancel:function(){window.location=Galaxy.root+"visualizations/list"},Create:function(){e.create_browser($("#new-title").val(),$("#new-dbkey").val()),Galaxy.modal.hide()}}});var a=t.map(function(e){return e[1]});galaxy_config.app.default_dbkey&&d.contains(a,galaxy_config.app.default_dbkey)&&$("#new-dbkey").val(galaxy_config.app.default_dbkey),$("#new-title").focus(),$("select[name='dbkey']").select2(),$("#overlay").css("overflow","auto")}})},template_view_new:function(e){for(var t='<form id="new-browser-form" action="javascript:void(0);" method="post" onsubmit="return false;"><div class="form-row"><label for="new-title">Browser name:</label><div class="form-row-input"><input type="text" name="title" id="new-title" value="Unnamed"></input></div><div style="clear: both;"></div></div><div class="form-row"><label for="new-dbkey">Reference genome build (dbkey): </label><div class="form-row-input"><select name="dbkey" id="new-dbkey">',a=0;a<e.length;a++)t+='<option value="'+e[a][1]+'">'+e[a][0]+"</option>";return t+='</select></div><div style="clear: both;"></div></div><div class="form-row">Is the build not listed here? <a href="'+Galaxy.root+'custom_builds">Add a Custom Build</a></div></form>'},create_browser:function(e,t){$(document).trigger("convert_to_values"),b=w.create_visualization({container:$("#center .unified-panel-body"),name:e,dbkey:t},galaxy_config.app.gene_region),this.init_editor(),b.editor=!0},init_editor:function(){$("#center .unified-panel-title").text(b.config.get_value("name")+" ("+b.dbkey+")"),galaxy_config.app.add_dataset&&$.ajax({url:Galaxy.root+"api/datasets/"+galaxy_config.app.add_dataset,data:{hda_ldda:"hda",data_type:"track_config"},dataType:"json",success:function(e){b.add_drawable(c.default.object_from_template(e,b,b))}}),$("#add-bookmark-button").click(function(){var e=b.chrom+":"+b.low+"-"+b.high;return w.add_bookmark(e,"Bookmark description",!0)}),w.init_keyboard_nav(b),$(window).on("beforeunload",function(){if(b.has_changes)return"There are unsaved changes to your visualization that will be lost if you leave this page."})}});e.default={TracksterUI:y,GalaxyApp:g}});