sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("example.ui.test.controller.Table", {
		
		onInit: function() {
			const oComponent = this.getOwnerComponent();
			const oModel = oComponent.getModel("values");
			
			const aItem = oModel.getProperty("/items");
			
			if (aItem.length === 0) {
				oComponent.getRouter().navTo("form");
			}
		},
		
		handleNavButton: function() {
			this.getOwnerComponent().getRouter().navTo("form");
		},
		
		handleDownload: function() {
			
		}
	});
});