sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("example.ui.test.controller.Form", {
		
		handleAddEducationItem(oEvent) {
			let oView = this.getView();
			let oButton = oEvent.getSource();
			let oForm = oButton.getParent().getParent();
			
			let aItem = sap.ui.xmlfragment(oView.getId(), "example.ui.test.fragment.educationItem", this);
			
			aItem.forEach((oItem) => {
				oView.addDependent(oItem);
				oForm.insertFormElement(oItem);
			});
			//oView.addDependent(oItem);
			
			//debugger;
			
			console.log(aItem);
			
		},	
		
		passportFormatter: function(sValue) {
			if (sValue === "passport") {
				return true;
			}
			return false;
		},
		driverlicenseFormatter: function(sValue) {
			if (sValue === "driverlicense") {
				return true;
			}
			return false;
		},	
		militaryidFormatter: function(sValue) {
			if (sValue === "militaryid") {
				return true;
			}
			return false;
		}
	});
});