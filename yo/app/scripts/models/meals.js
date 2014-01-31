var Meals = function ($log){
	$log.log ("new Instance of Model");

	return {
		getSampleData : function(){
			return "Hello World";
		}
	}
}

var meals = angular.module('Meals', [])
	.factory("Meals", Meals);
;