/*!
 * Input Prefix plugin for jQuery, by Grégoire Fruleux
 * Copyright 2016 Salto Consulting
 * Licensed under https://opensource.org/licenses/GPL-3.0
 * Source https://github.com/gfruleux/jquery-plugin-input-prefix
 */

+function ($) {
	'use strict';
	
	// INPUTPREFIX CLASS DEFINITION
	// ============================
	var Inputprefix = function (element) {
		this.$element = $(element);
		
		this.prefix          = undefined;
		this.prefixLen       = undefined;
		this.cursorStart     = undefined;
		this.cursorEnd       = undefined;
		this.currentValue    = undefined;
		this.currentValueLen = undefined;
		
		this.setCurrentInfos(this.$element);
		this.$element.val(this.prefix);
		
		this.$element.on("keydown", $.proxy(this.preInputDataPrefixKeydown, this));
		this.$element.on("input", $.proxy(this.inputDataPrefixChange, this));
	}
	
	Inputprefix.version = "0.0.1";
	
	// INPUTPREFIX TARGET FUNCTIONS
	// ============================
	
	Inputprefix.prototype.setCurrentInfos = function ($target) {
		this.prefix = $target.data("prefix");
		this.prefixLen = this.prefix.length;
		this.cursorStart = $target.get(0).selectionStart;
		this.cursorEnd = $target.get(0).selectionEnd;
		this.currentValue = $target.val();
		this.currentValueLen = this.currentValue.length;
	}
	
	Inputprefix.prototype.setTargetSelection = function ($target, value) {
		$target[0].selectionStart = $target[0].selectionEnd = value; 
	}
	
	// INPUTPREFIX KEYDOWN PREPROCESSOR-FUNCTION
	// =========================================
	
	Inputprefix.prototype.preInputDataPrefixKeydown = function (event) {
		var keyCode = event.which;
		if (keyCode === 8 || keyCode === 46) {
			event.preventDefault();
			this.inputDataPrefixKeydown(event);
		}
	};
	
	// INPUTPREFIX KEYDOWN FUNCTION
	// ============================
	
	Inputprefix.prototype.inputDataPrefixKeydown = function (event) {
		var self = this;
		var keyCode = event.which;
		
		self.setCurrentInfos(self.$element);
			
		if (keyCode === 8) {
			if (self.cursorEnd <= self.prefixLen)
				return;
			self.cursorStart <= self.prefixLen ?self.cursorStart = self.prefixLen+1 :self.cursorStart = self.cursorStart;
			self.$element.val(self.currentValue.substr(0, self.cursorStart-1) + self.currentValue.substr(self.cursorEnd, self.currentValueLen));
			self.setTargetSelection(self.$element, self.cursorStart-1);
		}
		if (keyCode === 46) {
			if (self.cursorEnd < self.prefixLen)
				return;
			self.cursorStart < self.prefixLen ?self.cursorStart = self.prefixLen :self.cursorStart = self.cursorStart;
			self.$element.val(self.currentValue.substr(0, self.cursorStart) + self.currentValue.substr(self.cursorEnd+1, self.currentValueLen));
			self.setTargetSelection(self.$element, self.cursorEnd);
		}
	}

	// INPUTPREFIX CHANGE FUNCTION
	// ===========================
	
	Inputprefix.prototype.inputDataPrefixChange = function (event) {
		var self = this;
		var keyCode = event.which;
		
		self.setCurrentInfos(self.$element);
		
		if (self.currentValue === undefined || self.currentValue < self.prefixLen || self.currentValue.slice(0, self.prefixLen) !== self.prefix) {
			self.$element.val(self.prefix);
		}
	}
	
	// INPUTPREFIX PLUGIN DEFINITION
	// ===========================
	
	function Plugin () {
		return this.each(function() {
			new Inputprefix(this);
		});
	};
	
	var old = $.fn.inputprefix;
	
	$.fn.inputprefix             = Plugin;
	$.fn.inputprefix.Constructor = Inputprefix;
	
	// INPUTPREFIX NO CONFLICT
	// =====================

	$.fn.inputprefix.noConflict = function () {
		$.fn.inputprefix = old;
		return this;
	}
  
	
	// INPUTPREFIX DATA-API
	// ====================
	
	$(document).ready(function (){
		$("input[data-prefix]").each(function () {
			var $input = $(this);	
			Plugin.call($input);
		});
	});
	
}(jQuery);