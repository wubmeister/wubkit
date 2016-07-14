(function(Toolkit){

	function MyPlugin(element, options) {

		var public = {};

		// Sandboxed code here

		function publicFunction() {
			// Function body here
		}

		// Public methods
		public.publicFunction = publicFunction;

		return public;

	}

	Toolkit.registerPlugin('myPlugin', MyPlugin);

})(Toolkit);