/*
 * 
 */

module.exports = function (tabList) {

  "use strict";

	//create module instance
	var self = Ti.UI.createTabGroup();
	
	var idx, max;
	
	for (idx = 0, max = tabList.length; idx < max; idx += 1) {

    var tabInfo = tabList[idx];

		var label = L(tabInfo.name);

		var win = new tabInfo.window(label);

		var tab = Ti.UI.createTab({
			title: label,
			icon: tabInfo.icon,
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
