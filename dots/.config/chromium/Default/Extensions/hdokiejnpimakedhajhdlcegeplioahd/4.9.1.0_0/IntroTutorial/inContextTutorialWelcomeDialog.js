var InContextTutorialWelcomeDialog=function(e){Dialog.call(this,e,{closeButtonEnabled:!1,maximizeButtonEnabled:!1,dynamicHeight:!1,hideHeader:!0,hideButtons:!0,confirmOnClose:!1})};InContextTutorialWelcomeDialog.prototype=Object.create(Dialog.prototype),InContextTutorialWelcomeDialog.prototype.constructor=InContextTutorialWelcomeDialog,function(e){function t(e,t,o,n){var i=new lpTile({id:o,name:n.displayName,tileClass:"tile-sm",iconSrc:IntroTutorialImages.getImage(n.displayName.toLowerCase(),"square"),clickHandler:function(t){bg.removeModalOverlay(),t.preventDefault(),e.close(!0),bg.sendLpImprove("onboardingtour::selected",{action:n.getDomainCode(),version:"incontext"}),bg.IntroTutorial.setState({enabled:!0,domain:n.domain,name:n.displayName,tile:n.getDomainCode(),isInContext:!0,firstLogin:!0,inContextOnboardingStep:"add_first_site",isAllSet:!1}),n.goToLogin()}});t.append(i.$tileEl)}InContextTutorialWelcomeDialog.prototype.initialize=function(e){Dialog.prototype.initialize.apply(this,arguments);for(var o=this,n=e.find("#tileContainer"),i=LPSiteService.getSites(),a=0;a<i.length;a++)t(o,n,"#tile"+(a+1),i[a]);function r(e){e.preventDefault(),bg.sendLpImprove("onboardingtour::selected",{action:"nothanks",version:"incontext"}),LPProxy.setPreferences("showIntroTutorial",!1),bg.IntroTutorial.completeTutorial({textChoice:"skipped"}),o.close(!0)}var l=!0,s=LPProxy.getPreference("ShowIntroTutorialLater",null);s&&Date.now()>=new Date(s)&&(l=!1);var c=e.find("#showLater"),d=e.find("#noThanks");l?(d.hide(),c.show(),c.bind("click",function(e){e.preventDefault(),bg.sendLpImprove("onboardingtour::selected",{action:"later",version:"incontext"});var t=new Date;t.setDate(t.getDate()+3),LPProxy.setPreferences("ShowIntroTutorialLater",t.toString()),bg.IntroTutorial.completeTutorial({textChoice:"skipped"}),o.close(!0)})):(c.hide(),d.show(),d.bind("click",r)),e.find("#btnClose").bind("click",r),bg.sendLpImprove("onboardingtour::seen",{version:"incontext"})},InContextTutorialWelcomeDialog.prototype.getSize=function(){return{"max-height":"100%","max-width":"100%"}},InContextTutorialWelcomeDialog.prototype.open=function(e){Dialog.prototype.open.apply(this,arguments),bg.get_selected_tab(null,function(e){(/\/how-it-works\/?/.test(e.url)||/\/thanksinstall\/?/.test(e.url))&&bg.showModalOverlay()})}}(jQuery);
//# sourceMappingURL=sourcemaps/IntroTutorial/inContextTutorialWelcomeDialog.js.map
