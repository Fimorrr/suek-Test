sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/SimpleType",
	'sap/ui/model/ValidateException'
], function (Controller, SimpleType, ValidateException) {
	"use strict";

	return Controller.extend("example.ui.test.controller.Form", {
		
		onInit: function() {
			this.education = 0;
			
			const oView = this.getView();
			const aInputs = this.getAllItems(oView.byId("SimpleFormToolbar"), "sap.m.Input");
			
			aInputs.forEach((oInput) => {
				sap.ui.getCore().getMessageManager().registerObject(oInput, true);
				oInput.attachChange(this.handleInputChange.bind(this));
			});
		},
		
		handleBirthdayChange: function(oEvent) {
			const oModel = this.getOwnerComponent().getModel("values");
			const oDatePicker = oEvent.getSource();
			
			const oDateValue = oDatePicker.getDateValue();
			const oDateNow = new Date();
			
			const fDiff = oDateNow - oDateValue;
			
			if (fDiff < 0) {
				oModel.setProperty("/age", "");
			} 
			else {
				const iYearsBetween = Math.abs(new Date(fDiff).getUTCFullYear() - 1970);
				oModel.setProperty("/age", iYearsBetween);
			}
			
			this._validateDatePicker(oDatePicker);
		},
		
		handleDateChange: function(oEvent) {
			const oDatePicker = oEvent.getSource();
			
			this._validateDatePicker(oDatePicker);
		},
		
		handleInputChange: function(oEvent) {
			const oInput = oEvent.getSource();
			
			this._validateInput(oInput);
		},
		
		handleAddEducationItem: function(oEvent) {
			const oView = this.getView();
			const oForm = oView.byId("SimpleFormToolbar");
			
			const aItem = sap.ui.xmlfragment(oView.getId(), "example.ui.test.fragment.educationItem", this);
			
			aItem.forEach((oItem) => {
				oItem.setFieldGroupIds("education" + this.education);
				oView.addDependent(oItem);
				oForm.addContent(oItem);
			});
			
			this.education += 1;
		},	
		
		handleRemoveEducationItem: function(oEvent) {
			if (this.education == 0) {
				return;
			}
			
			const oView = this.getView();
			const oForm = oView.byId("SimpleFormToolbar");

			this.education -= 1;
			
			const aControl = oForm.getControlsByFieldGroupId("education" + this.education);
			
			aControl.forEach((oControl) => {
				oForm.removeContent(oControl);
			});
		},

		handleContinue : function () {
			const oView = this.getView();
			const aInput = this.getAllItems(oView.byId("SimpleFormToolbar"), "sap.m.Input");
			const aDatePicker = this.getAllItems(oView.byId("SimpleFormToolbar"), "sap.m.DatePicker");
			let bValidationError = false;

			aInput.forEach((oInput) => {
				bValidationError = this._validateInput(oInput) || bValidationError;
			});
			
			aDatePicker.forEach((oDatePicker) => {
				bValidationError = this._validateDatePicker(oDatePicker) || bValidationError;
			});
			
			if (!bValidationError) {
				this.fillValues.call(this);
				this.getOwnerComponent().getRouter().navTo("table");
			}
		},
		
		fillValues: function() {
			const oView = this.getView();
			const oForm = oView.byId("SimpleFormToolbar");
			
			const aItem = this.getAllItems(oForm, "all");
			let aValue = [];
			
			let sTitle = "";
			
			aItem.forEach((oItem) => {
				let sName = oItem.getMetadata().getName();
				
				switch(sName) {
					case "sap.m.Toolbar":
						sTitle = oItem.getContent()[0].getText();
						break;
					case "sap.m.Label":
						aValue = [...aValue, {}];
						aValue[aValue.length - 1].category = sTitle;
						aValue[aValue.length - 1].name = oItem.getText();
						aValue[aValue.length - 1].value = "";
						break;
					case "sap.m.Input":
					case "sap.m.DatePicker":
						aValue[aValue.length - 1].value += oItem.getValue();
						break;
					case "sap.m.Select":
						aValue[aValue.length - 1].value += oItem.getSelectedItem().getText();
						break;
				}
			});
			
			const oModel = oView.getModel("values");
			oModel.setProperty("/items", aValue);
		},
		
		getAllItems: function(oView, sName) {
			const aContent = oView.getContent();
			let aItem = [];
			
			aContent.forEach((oItem) => {
				if (oItem.getVisible() && (oItem.getMetadata().getName() === sName || sName === "all")) {
					aItem = [...aItem, oItem];
				}
			});
			
			return aItem;
		}, 
		
		_validateInput: function(oInput) {
			const oBinding = oInput.getBinding("value");
			let sValueState = "None";
			let bValidationError = false;

			if (oBinding == null) {
				if (oInput.getValue() == "") {
					sValueState = "Error";
					bValidationError = true;
				}
			}
			else {
				try {
					oBinding.getType().validateValue(oInput.getValue());
				} catch (oException) {
					sValueState = "Error";
					bValidationError = true;
				}
			}

			oInput.setValueState(sValueState);

			return bValidationError;
		},
		
		_validateDatePicker: function(oDatePicker) {
			const oDateValue = oDatePicker.getDateValue();
			let sValueState = "None";
			let bValidationError = false;
			
			if (oDateValue == null) {
				sValueState = "Error";
				bValidationError = true;
			}
			else {
				const oDateNow = new Date();
				
				const fDiff = oDateNow - oDateValue;
				
				if (fDiff < 0) {
					sValueState = "Error";
					bValidationError = true;
				} 
			}
			
			oDatePicker.setValueState(sValueState);
			return bValidationError;
		},

		nameType : SimpleType.extend("Text", {
			formatValue: function (oValue) {
				return oValue;
			},
			parseValue: function (oValue) {
				return oValue;
			},
			validateValue: function (oValue) {
				const regex = /^[a-zA-Zа-яА-Я ]+$/;
				if (!oValue.match(regex)) {
					throw new ValidateException();
				}
			}
		}),
		ageType : SimpleType.extend("Text", {
			formatValue: function (oValue) {
				return oValue;
			},
			parseValue: function (oValue) {
				return oValue;
			},
			validateValue: function (oValue) {
				if (oValue < 0 || oValue > 150) {
					throw new ValidateException();
				}
			}
		}),
		
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