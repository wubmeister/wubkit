var Toolkit = {

	/**
	 * Registers a plugin
	 *
	 * Allows for calls like:
	 * 	 $(...).myPlugin({ option: value })  // Initialize the plugin
	 * 	 $(...).myPlugin('perform action', parameter, ...)  // perform an action on the linked plugin
	 *
	 * @param String name The name of the plugin
	 * @param Function func The actual plugin function
	 * @param Object defaults OPTIONAL; The default options
	 */
	registerPlugin: function(name, func, defaults) {
		var prop = 'toolkit' + name[0].toUpperCase() + name.substr(1);

		$.fn[name] = function jqWrapper() {
			var result = this,
				behavior,
				argv,
				argOptions,
				options;

			// Check for behaviour call
			if (arguments.length > 0 && (typeof arguments[0] == 'string')) {
				behavior = arguments[0].replace(/\s([a-z])/g, function (m, p1) { return p1.toUpperCase(); });
				argv = Array.prototype.slice.call(arguments, 1);

				this.each(function () {
					var obj = (prop in this) ? this[prop] : null,
						res;

					if (obj && (behavior in obj)) {
						res = obj[behavior].apply(obj, argv);
						if (typeof res != 'undefined') {
							result = res;
						}
					} else {
						console.error('No object or behavior \'' + behavior + '\' not set on object');
					}
				});

			// If no behaviour call, initialize the plugin
			} else {
				argOptions = arguments.length > 0 ? arguments[0] : {};
				options = $.extend({}, defaults, argOptions);

				this.each(function () {
					var myOptions;

					if (!(prop in this)) {
						myOptions = $.extend({}, options, $(this).data());
						this[prop] = func(this, myOptions);
					}
				});
			}

			return result;
		}
	},

	/**
	 * Get the current transition info on a DOM element
	 *
	 * @return Object { property: { delay: milliseconds, duration: milliseconds, timingFunction: 'cubic-bezier(...)' }}
	 */
	getTransitions: function (element) {
		var style, props, delays, durations, timingFunctions, transition = { totalTime: 0 };

		if (!('getComputedStyle' in window)) {
			return {};
		}

		style = getComputedStyle(element);
		if (!('transitionProperty' in style)) {
			return {};
		}

		props = style.transitionProperty.split(',').map(function (item) { return item.replace(/^\s+/, ''); }),
		delays = style.transitionDelay.split(',').map(function (item) { return item.replace(/^\s+/, ''); }),
		durations = style.transitionDuration.split(',').map(function (item) { return item.replace(/^\s+/, ''); }),
		timingFunctions = style.transitionTimingFunction.match(/[a-z\-]+(\([^\)]+\))?/g);

		function getMilliseconds(secondString) {
			// Assume the secondString is in de format 'n.nns' (e.g. 1.3s);
			return Math.round(parseFloat(secondString.substr(0, secondString.length - 1)) * 1000);
		}

		props.forEach(function (prop, index) {
			transition[prop] = {
				delay: getMilliseconds(delays[index]),
				duration: getMilliseconds(durations[index]),
				timingFunction: timingFunctions[index]
			};
			transition.totalTime += transition[prop].delay + transition[prop].duration;
		});

		return transition;
	}

};