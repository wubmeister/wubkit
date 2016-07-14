(function(Toolkit){

	function Sticky(element, options) {

		var public = {};

		// Sandboxed code here

		function publicFunction() {
			// Function body here
		}

		// Public methods
		public.publicFunction = publicFunction;

		return public;

	}

	Toolkit.registerPlugin('sticky', Sticky);

})(Toolkit);