(function(){

  if (typeof Snake === "undefined") {
    window.Snake = {};
  }

  var Snake = window.Snake = function (board) {
    this.dir = 'S';
    this.board = board;
    this.segments = [new Coord([19, 19])];
    this.growing = 0;
    this.score = 0;
  }

  var Coord = Snake.Coord = function (pos) {
    this.x = pos[0];
    this.y = pos[1];
  }

  Coord.prototype.plus = function(otherCoord){
    var newX = this.x + otherCoord.x;
    var newY = this.y + otherCoord.y;
    return new Coord([newX, newY]);
  }

  Coord.prototype.isEqual = function (coordArr) {
    return !!((this.x === coordArr[0]) && (this.y === coordArr[1]));
  };

  Coord.prototype.isEqualCoord = function (coord) {
    return !!((this.x === coord.x) && (this.y === coord.y));
  };

  Coord.prototype.isOutOfBounds = function(){
    return (this.x < 0 || this.x > 39 || this.y < 0 || this.y > 39);
  };

  Coord.prototype.isOpposite = function(otherCoord){
    return (this.x === (-1 * otherCoord.x)) && (this.y === (-1 * otherCoord.y))
  }

  var DIRS = {
    "N": new Coord([0, -1]),
    "S": new Coord([0, 1]),
    "E": new Coord([1, 0]),
    "W": new Coord([-1, 0])
  }

  Snake.prototype.move = function () {
    var currentHead = this.segments[0];
    var newHead = currentHead.plus(DIRS[this.dir]);

    if (newHead.isOutOfBounds() || this.includes([newHead.x, newHead.y])) {
      return false;
    }

    this.eatApple(newHead);

    if (this.growing > 0) {
      this.growing -= 1;
    } else {
      this.segments.pop();
    }

    this.segments.unshift(newHead);
    return true;
  }

  Snake.prototype.eatApple = function (newHead) {
    if (newHead.isEqualCoord(this.board.apple)) {
      this.board.addApple();
      this.growing += 2;
      this.score += 10;
    }
  };

  Snake.prototype.turn = function (dir) {
    if (!DIRS[this.dir].isOpposite(DIRS[dir])){
      this.dir = dir;
    }
  }

  Snake.prototype.includes = function (pos) {
    var flag = false;
    this.segments.forEach(function (coor) {
      if (coor.isEqual(pos)) {
        flag = true;
      };
    })
    return flag;
  };

  var Board = window.Board = function () {
    this.snake = new Snake(this);
    this.apple = null;
    this.grid = new Array(40);
    for (var i = 0; i < 40; i++) {
      this.grid[i] = new Array(40);
    }
    this.addApple();
  };

  Board.prototype.render = function ($el) {
    $el.empty();
    for (var i = 0; i < 40; i++) {
      var $row = $("<div class='row'>");
      for (var j = 0; j < 40; j++) {
        if (this.snake.includes([j,i])) {
          $row.append($("<div class='snake'>"));
        } else if (this.apple.isEqual([j,i])) {
          $row.append($("<div class='apple'>"));
        } else {
          $row.append($("<div class='cell'>"));
        }
      }
      $el.append($row);
    }
  };

  Board.prototype.randomPos = function () {
    return [Math.floor(Math.random() * 40), Math.floor(Math.random() * 40)];
  }

  Board.prototype.isEmpty = function(pos) {
    return (!this.snake.includes(pos));
  }

  Board.prototype.addApple = function() {
    var newPos = this.randomPos()
    while (!this.isEmpty(newPos)) {
      newPos = this.randomPos();
    }
    this.apple = new Coord(newPos);
  };

})();
