happn.Utils = {
	xlat : function(el, x, y) {
	    el.style.mozTransform =
	    el.style.msTransform =
	    el.style.webkitTransform =
	    el.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0px)';
	},

  	scale : function(el, val) {
	    el.style.mozTransform =
	    el.style.msTransform =
	    el.style.webkitTransform =
	    el.style.transform = 'scale3d(' + val + ', ' + val + ', 1)';
	},

	createSpring : function (springSystem, friction, tension, rawValues) {
	    var spring = springSystem.createSpring();
	    var springConfig;
	    
	    if (rawValues) {
	      springConfig = new SpringConfig(friction, tension);
	    } else {
	      springConfig = SpringConfig.fromQcTensionAndFriction(friction, tension);
	    }

	    spring.setSpringConfig(springConfig);
	    spring.setCurrentValue(0);
	    
	    return spring;
	},

	mapValueFromRangeToRange : function(value, fromLow, fromHigh, toLow, toHigh) {
	    fromRangeSize = fromHigh - fromLow;
	    toRangeSize = toHigh - toLow;
	    valueScale = (value - fromLow) / fromRangeSize;

	    return toLow + (valueScale * toRangeSize);
	}
}