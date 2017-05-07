$(document).ready(function() {


	mobileNav = function() {
		var $navPull = $('nav.main .pull');
		var $mainNav = $('nav.main ul');

		$navPull.unbind().bind('click', function(){
			$mainNav.toggleClass('active');
			$(this).toggleClass('active');
		});

	}();


	targetBlank = function() {
			$('a.targetBlank').click(function() {
				window.open(this.href);
				return false;
			});
			$('.targetBlank a').click(function() {
				window.open(this.href);
				return false;
			});
    }();


	accordion = function() {
		$('.toggleAccordion').click(function(e) {
			e.preventDefault();
			var $this = $(this);

			if ($this.next().hasClass('show')) {
				$this.next().removeClass('show');
				$this.removeClass('active');
			}
			else {
				$this.parent().parent().find('.inner').removeClass('show');
				$('.toggleAccordion').removeClass('active');
				$this.next().addClass('show');
				$this.addClass('active');
			}
		});

		// Open first accordion on load
		$('.toggleAccordion').eq(0).addClass('active');
		$('.toggleAccordion').eq(0).next().addClass('show');


	}();



});
