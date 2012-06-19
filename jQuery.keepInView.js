(function($) {

	// Do the scroll
	$.fn.scrollIntoView = function(options, secondaryCallback) {
		var defaults = {
			topLimit: 0,
			scrollSpeed: 500,
			scrollType: "swing"
		}
		options = $.extend(defaults,options)

		scrollTop = this.offset().top - options.topLimit

		// This should fire the secondaryCallback. It should only happen once
		var doCallback = function() {
			if (typeof(secondaryCallback) === 'function') {
				secondaryCallback()
			}
		}

		if ($('html, body').scrollTop() !== scrollTop) {
			$('html, body').animate({'scrollTop': scrollTop}, options.scrollSpeed, options.scrollType, doCallback)
		}

		// Make this chainable
		return this
	}
	$.fn.keepInView = function(options) {
		var docHeightTimer,
			defaults = {
				scrollSpeed: 0
			},
			docHeight = $(document).height(),
			$el = this

		options = $.extend(defaults,options)

		var scrollWithoutBind = function() {
			window.jQueryScrolling = true
			$el.scrollIntoView(options, function() {
				window.setTimeout(function() {
					window.jQueryScrolling = false
				}, 50)
				
			})
		}

		var domModifiedWatch = function() {
			if (docHeightTimer) {
				window.clearTimeout(docHeightTimer)
			}
			docHeightTimer = window.setTimeout(function() {
				var newHeight = $(document).height()
				if (newHeight != docHeight) {
					docHeight = newHeight
					scrollWithoutBind()
				}
			}, 500)
		}

		var cancelDomModified = function() {
			if (! window.jQueryScrolling) {
				$(document).off('DOMSubtreeModified', domModifiedWatch)
				$(window).off('scroll', cancelDomModified)
			}
		}

		// If there is a scroll event, we want to cancel the anchor watch
		$(window).on('scroll', cancelDomModified)

		// If the document changes size, we want to...
		$(document).on('DOMSubtreeModified', domModifiedWatch)
		scrollWithoutBind()

		// Make this chainable
		return this
	}
})(jQuery);