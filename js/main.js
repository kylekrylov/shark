$(document).ready(function() {
	// Показать модальное окно
	$('.start-page__btn').click(function() {
		id_modal = $('#modal-message');
		id_modal.addClass('show');
		$('.modal-overlay').addClass('show');
		$('.modal-wrapper').attr('data-show', 1);
	})


	function close_modal() {
		id_modal = $('#modal-message');
		id_modal.removeClass('show');

		$('modal-owerlay').removeClass('show');
		$('modal-owerlay').addClass('hide');
		$('.modal-wrapper').attr('data-show', 0);
	}
	// Скрыть модальное окно
	$('.modal .close').click(function() {
		close_modal();
	});

	// закрыть модальное окно при нажатии вне области

	$(document).mouseup(function(e) {
		if (!$(".modal__content").is(e.target) && $(".modal__content").has(e.target).length === 0) {
			close_modal();
		}
	});

	// открытие мобильного меню
	$('.hamburger').on('click', function() {
		$('.mobile-menu, body').toggleClass("active");
		$(this).toggleClass('is-active');

		$('.hamburger-inner').toggleClass('is-active');

    });
    

    $('[data-content]').mouseover(function() {
        var text = $(this).attr('data-content');
        $(this).parent().prepend('<div class="range-line__tooltip"><div class="range-line__tooltip-inner">' + text + '</div></div>');

        remove_tooltip();
    });


    function remove_tooltip() {
    	$('.range-line .range-line__tooltip').mouseout(function() {
	        $('.range-line__tooltip').remove();
	    });
    }

	// ---------
	// Functions
	// ---------

	var canvas = document.querySelector('canvas');
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	var ctx = canvas.getContext('2d');
	var count = canvas.height;
	var bubbles = [];
	var bubbleCount = 20;
	var bubbleSpeed = 2;
	var popLines = 6;
	var popDistance = 5;
	var mouseOffset = {
		x: 0,
		y: 0
	}


	// --------------
	// Animation Loop
	// --------------

	function animate() {

		// ------------
		// Clear Canvas
		// ------------

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// ------------
		// Draw Bubbles
		// ------------

		ctx.beginPath();
		for (var i = 0; i < bubbles.length; i++) {
			// first num = distance between waves
			// second num = wave height
			// third num = move the center of the wave away from the edge
			bubbles[i].position.x = Math.sin(bubbles[i].count / bubbles[i].distanceBetweenWaves) * 50 + bubbles[i].xOff;
			bubbles[i].position.y = bubbles[i].count;
			bubbles[i].render();

			if (bubbles[i].count < 0 - bubbles[i].radius) {
				bubbles[i].count = canvas.height + bubbles[i].yOff;
			} else {
				bubbles[i].count -= bubbleSpeed;
			}
		}

		// ---------------
		// On Bubble Hover
		// ---------------
		for (var i = 0; i < bubbles.length; i++) {
			if (mouseOffset.x > bubbles[i].position.x - bubbles[i].radius && mouseOffset.x < bubbles[i].position.x + bubbles[i].radius) {
				if (mouseOffset.y > bubbles[i].position.y - bubbles[i].radius && mouseOffset.y < bubbles[i].position.y + bubbles[i].radius) {
					for (var a = 0; a < bubbles[i].lines.length; a++) {
						popDistance = bubbles[i].radius * 0.5;
						bubbles[i].lines[a].popping = true;
						bubbles[i].popping = true;
					}
				}
			}
		}

		window.requestAnimationFrame(animate);
	}

	window.requestAnimationFrame(animate);



	// ------------------
	// Bubble Constructor
	// ------------------

	var createBubble = function() {
		this.position = {
			x: 0,
			y: 0
		};
		this.radius = 8 + Math.random() * 6;
		this.xOff = Math.random() * canvas.width - this.radius;
		this.yOff = Math.random() * canvas.height;
		this.distanceBetweenWaves = 50 + Math.random() * 90;
		this.count = canvas.height + this.yOff;
		this.color = '#7be1e1';
		this.lines = [];
		this.popping = false;
		this.maxRotation = 85;
		this.rotation = Math.floor(Math.random() * (this.maxRotation - (this.maxRotation * -1))) + (this.maxRotation * -1);
		this.rotationDirection = 'forward';

		this.resetPosition = function() {
			this.position = {
				x: 0,
				y: 0
			};
			this.radius = 8 + Math.random() * 6;
			this.xOff = Math.random() * canvas.width - this.radius;
			this.yOff = Math.random() * canvas.height;
			this.distanceBetweenWaves = 50 + Math.random() * 90;
			this.count = canvas.height + this.yOff;
			this.popping = false;
		}

		// Render the circles
		this.render = function() {
			if (this.rotationDirection === 'forward') {
				if (this.rotation < this.maxRotation) {
					this.rotation++;
				} else {
					this.rotationDirection = 'backward';
				}
			} else {
				if (this.rotation > this.maxRotation * -1) {
					this.rotation--;
				} else {
					this.rotationDirection = 'forward';
				}
			}

			ctx.save();
			ctx.translate(this.position.x, this.position.y);
			ctx.rotate(this.rotation * Math.PI / 180);

			if (!this.popping) {
				ctx.beginPath();
				ctx.strokeStyle = '#8bc9ee';
				ctx.lineWidth = 2;
				ctx.stroke();

				ctx.beginPath();
				ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
				ctx.stroke();
			}

			ctx.restore();

			// Draw the lines
			for (var a = 0; a < this.lines.length; a++) {
				if (this.lines[a].popping) {
					if (this.lines[a].lineLength < popDistance && !this.lines[a].inversePop) {
						this.lines[a].popDistance += 0.06;
					} else {
						if (this.lines[a].popDistance >= 0) {
							this.lines[a].inversePop = true;
							this.lines[a].popDistanceReturn += 1;
							this.lines[a].popDistance -= 0.03;
						} else {
							this.lines[a].resetValues();
							this.resetPosition();
						}
					}

					this.lines[a].updateValues();
					this.lines[a].render();
				}
			}
		}
	}



	// ----------------
	// Populate Bubbles
	// ----------------

	for (var i = 0; i < bubbleCount; i++) {
		var tempBubble = new createBubble();

		bubbles.push(tempBubble);
	}


	// ---------------
	// Event Listeners
	// ---------------

	canvas.addEventListener('mousemove', mouseMove);

	function mouseMove(e) {
		mouseOffset.x = e.offsetX;
		mouseOffset.y = e.offsetY;
	}

	window.addEventListener('resize', function() {
		canvas.width = document.body.clientWidth;
		canvas.height = document.body.clientHeight;
	});
});