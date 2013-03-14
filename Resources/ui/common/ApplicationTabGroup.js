/*
 * 
 */

module.exports = function (tabList) {

  "use strict";

	//create module instance
	var self = Ti.UI.createTabGroup();
	
	var i;
	for (i=0; i < tabList.length; i=i+1) {
		
		var label = L(tabList[i].name);

		var win = new tabList[i].window(label);

		var tab = Ti.UI.createTab({
			title: label,
			icon: tabList[i].icon,
			window: win
		});

		win.containingTab = tab;
		self.addTab(tab);
	}

  // close the tab group on logout
  Ti.App.addEventListener("authentication:logout", function (e) {
    self.close();
  });

	return self;
}
