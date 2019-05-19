sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/SimpleType",
	'sap/ui/model/ValidateException'
], function (Controller, SimpleType, ValidateException) {
	"use strict";

	return Controller.extend("example.ui.test.controller.Form", {
		
		onInit: function() {
			this.education = 0;
			
			var oView = this.getView();
			var aInputs = this.getAllItems(oView.byId("SimpleFormToolbar"), "sap.m.Input");
			
			aInputs.forEach((oInput) => {
				sap.ui.getCore().getMessageManager().registerObject(oInput, true);
				oInput.attachChange(this.handleInputChange.bind(this));
			});
		},
		
		handleBirthdayChange: function(oEvent) {
			let oModel = this.getOwnerComponent().getModel("values");
			let oDatePicker = oEvent.getSource();
			
			let oDateValue = oDatePicker.getDateValue();
			let oDateNow = new Date();
			
			let fDiff = oDateNow - oDateValue;
			
			if (fDiff < 0) {
				oModel.setProperty("/age", "");
			} 
			else {
				let iYearsBetween = Math.abs(new Date(fDiff).getUTCFullYear() - 1970);
				oModel.setProperty("/age", iYearsBetween);
			}
			
			this._validateDatePicker(oDatePicker);
		},
		
		handleDateChange: function(oEvent) {
			let oDatePicker = oEvent.getSource();
			
			this._validateDatePicker(oDatePicker);
		},
		
		handleInputChange: function(oEvent) {
			let oInput = oEvent.getSource();
			
			this._validateInput(oInput);
		},
		
		handleAddEducationItem: function(oEvent) {
			let oView = this.getView();
			let oForm = oView.byId("SimpleFormToolbar");
			
			let aItem = sap.ui.xmlfragment(oView.getId(), "example.ui.test.fragment.educationItem", this);
			
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
			
			let oView = this.getView();
			let oForm = oView.byId("SimpleFormToolbar");

			this.education -= 1;
			
			let aControl = oForm.getControlsByFieldGroupId("education" + this.education);
			
			aControl.forEach((oControl) => {
				oForm.removeContent(oControl);
			});
		},

		handleContinue : function () {
			let that = this;
			let oView = this.getView();
			let aInput = this.getAllItems(oView.byId("SimpleFormToolbar"), "sap.m.Input");
			let aDatePicker = this.getAllItems(oView.byId("SimpleFormToolbar"), "sap.m.DatePicker");
			let bValidationError = false;

			aInput.forEach((oInput) => {
				bValidationError = this._validateInput(oInput) || bValidationError;
			});
			
			aDatePicker.forEach((oDatePicker) => {
				bValidationError = this._validateDatePicker(oDatePicker) || bValidationError;
			});
			
			if (!bValidationError) {
				
			}
		},
		
		getAllItems : function (oView, sName) {
			let aContent = oView.getContent();
			let aItem = [];
			
			aContent.forEach((oItem) => {
				if (oItem.getVisible() && oItem.getMetadata().getName() === sName) {
					aItem = [...aItem, oItem];
				}
			});
			
			return aItem;
		}, 
		
		_validateInput: function(oInput) {
			let oBinding = oInput.getBinding("value");
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
			let oDateValue = oDatePicker.getDateValue();
			let sValueState = "None";
			let bValidationError = false;
			
			if (oDateValue == null) {
				sValueState = "Error";
				bValidationError = true;
			}
			else {
				let oDateNow = new Date();
				
				let fDiff = oDateNow - oDateValue;
				
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
				var regex = /^[a-zA-Zа-яА-Я ]+$/;
				if (!oValue.match(regex)) {
					throw new ValidateException("Неверные данные");
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
					throw new ValidateException("Неверные данные");
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