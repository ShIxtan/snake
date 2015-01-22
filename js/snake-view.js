(function(){

  if (typeof Snake === "undefined") {
    window.Snake = {};
  }

  var View = Snake.View = function($el){
    this.board = new Board();
    this.$el = $el;
    var that = this;
    this.leaderboard = [];

    $(document).keydown(function (event) {
      that.handleKeyEvent(event);
    })

    this.interval = setInterval(that.step.bind(that), 200);
  }

  View.prototype.step = function() {
    var move = this.board.snake.move();
    if (!move) {
      this.gameOver();
    } else {
      this.render();
    }
  }

  View.prototype.gameOver = function(){
    var $button = $("<button class='btn'>Restart Game</button>")
    $button.on("click", this.restartGame.bind(this))
    clearInterval(this.interval);
    this.$el.append($button);

    var name = prompt("What's your name?");
    this.leaderboard.push([name, this.board.snake.score]);
    this.renderLeaderboard();
  }

  View.prototype.restartGame = function () {
    var that = this;
    that.board = new Board();
    that.interval = setInterval(that.step.bind(that), 200);
  };

  View.prototype.togglePause = function(){
    var that = this;

    if (!this.interval) {
      this.interval = setInterval(that.step.bind(that), 200)
      this.$el.removeClass("paused");
    } else {
      clearInterval(this.interval);
      this.interval = null;
      this.$el.addClass("paused");
    }
  }

  View.prototype.handleKeyEvent = function(event) {
    if (event.keyCode == 37) {
      this.board.snake.turn('W');
    } else if (event.keyCode == 38) {
      this.board.snake.turn('N');
    } else if (event.keyCode == 39) {
      this.board.snake.turn('E');
    } else if (event.keyCode == 40) {
      this.board.snake.turn('S');
    } else if (event.keyCode == 32){
      this.togglePause();
      console.log("Hi");
    }
  }

  View.prototype.render = function() {
    var score = this.board.snake.score
    $('div#score').html("SCORE:" + score);
    this.board.render(this.$el);
    this.renderLeaderboard();
  };

  View.prototype.renderLeaderboard = function () {
    $list = $('#leaderboard ul')
    $list.empty();
    var that = this;
    for (i in this.leaderboard.sort(function(a, b){return b[1]-a[1]})) {
      $entry = $("<li> name: " + this.leaderboard[i][0] +" score: " + this.leaderboard[i][1] + "</li>");
      $list.append($entry);
    }
  };
})();
