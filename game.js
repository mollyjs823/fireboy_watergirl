function topWall(obj) {
    return obj.y;
}
function bottomWall(obj) {
    return obj.y + obj.height;
}
function leftWall(obj) {
    return obj.x;
}
function rightWall(obj) {
    return obj.x + obj.width;
}

function Box (points, type = 'rect') {
    this.points = points;
    this.type = type;
}
Box.prototype.draw = function(context) {
    if (this.type == 'triangle') {
        context.moveTo(this.points.x1, this.points.y1);
        context.lineTo(this.points.x2, this.points.y2);
        context.lineTo(this.points.x3, this.points.y3);
        context.lineTo(this.points.x1, this.points.y1);
        context.stroke();
    } else {
        context.strokeRect(this.points.leftX, this.points.topY, this.points.rightX - this.points.leftX, this.points.bottomY - this.points.topY);
    }
}
// Box.prototype.checkCollisions = function(player) {
//     if (player.x <= this.x1) {
//         if (point.y >= this.tip) {
//             if (point.y <= this.y) {
//                 if (point.x >= this.x2) {
//                     this.basey = point.y-this.tip
//                     this.basex = point.x - this.x
//                     if (this.basex == 0) {
//                         return true
//                     }
//                     this.slope = this.basey/this.basex
//                     if (this.slope >= this.accept1) {
//                         return true
//                     } else if (this.slope <= this.accept2) {
//                         return true
//                     }
//                 }
//             }
//         }
//     }
//     return false;
// }

// PLAYER
function Player (x, y, player) {
    this.name = document.getElementById(`${player}`);
    this.width = 30;
    this.height = 50;
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.gravity = 0.2;
    this.friction = 0.08;
    this.vy = 0;
    this.onFloor = false;
}
Player.prototype.draw = function(context) {
    context.drawImage(this.name, this.x, this.y, this.width, this.height);
};
Player.prototype.jump = function() {
    this.vy = -6;
}
Player.prototype.moveRight = function() {
    this.x += this.speed;
}
Player.prototype.moveLeft = function() {
    this.x -= this.speed;
}
Player.prototype.update = function(width, height) {
    if (!this.onFloor) {
        this.vy += this.gravity;
        this.y += this.vy;
    }
    if (this.y <= 0) {
        this.y = 0;
        this.vy = 0;
    } else if (this.y >= height - this.height) {
        this.y = height - this.height;
        this.vy = 0;
    }
    if (this.x <= 0) {
        this.x = 0;
    } else if (this.x >= width) {
        this.x = width;
    }
};

// GAME
function Game () {
    var canvas = document.getElementById("canvas");
    this.context = canvas.getContext("2d");
    this.context.canvas.width = 936;
    this.context.canvas.height = 700;
    this.width = canvas.width;
    this.height = canvas.height;
    this.bounds = [
        new Box({
            topY: this.height - 25,
            bottomY: this.height,
            leftX: 0,
            rightX: this.width
        }),
        new Box({
            topY: this.height - 122,
            bottomY: this.height - 103,
            leftX: 0,
            rightX: 315
        }),
        new Box({
            topY: this.height - 70,
            bottomY: this.height,
            leftX: this.width - 95,
            rightX: this.width
        }),
        new Box({
            topY: this.height - 98,
            bottomY: this.height - 70,
            leftX: this.width - 65,
            rightX: this.width
        }),
        // new Box({
        //     x1: this.width - 65,
        //     y1: this.height - 98,
        //     x2: this.width - 65,
        //     y2: this.height - 70,
        //     x3: this.width - 95,
        //     y3: this.height - 70
        // }, 'triangle')
    ];
    this.runSpeed = 1;
    this.paused = false;
    
    document.spacePressed = false;
    document.leftPressed = false;
    document.rightPressed = false;

    this.player = new Player(this.width / 1.5, this.height, 'fireboy');

    document.addEventListener("keydown", function(e) {
        if (e.key === " " || e.key === "ArrowUp") document.spacePressed = true;
        if (e.key === "ArrowLeft") document.leftPressed = true;
        if (e.key === "ArrowRight") document.rightPressed = true;
    });
    document.addEventListener("keyup", function(e) {
        if (e.key === " " || e.key === "ArrowUp") {
            document.spacePressed = false;
            canJump = true;
        }
        if (e.key === "ArrowLeft") document.leftPressed = false;
        if (e.key === "ArrowRight") document.rightPressed = false;
    });
}
Game.prototype.update = function () {
    if (this.paused){
        return;
    }
    if ((document.spacePressed) && topWall(this.player) > 0 && canJump) {
        document.spacePressed = false;
        canJump = false;
        this.onFloor = false;
        this.player.jump();
    }
    if (document.leftPressed && leftWall(this.player) > 0) {
        this.player.moveLeft();
    }
    else if (document.rightPressed && rightWall(this.player) < this.width) {
        this.player.moveRight();
    }

    for (block of this.bounds) {
        if (
            bottomWall(this.player) + this.player.vy >= block.points.topY && 
            topWall(this.player) + this.player.vy <= block.points.topY && 
            leftWall(this.player) <= block.points.rightX && 
            rightWall(this.player) >= block.points.leftX
        ) {
            console.log("on floor", block.points)
            this.player.y = block.points.topY - this.player.height;
            this.player.onFloor = true;
        }
        else if (
            topWall(this.player) + this.player.vy <= block.points.bottomY && 
            bottomWall(this.player) + this.player.vy >= block.points.bottomY && 
            leftWall(this.player) <= block.points.rightX && 
            rightWall(this.player) >= block.points.leftX
        ) {
            this.player.y = block.points.bottomY;
            this.player.vy = 0;
        }
        // console.log(block.points.leftX - leftWall(this.player));
        // if (
        //     rightWall(this.player) > block.points.leftX &&
        //     block.points.leftX - rightWall(this.player) <= 5  
        // ) {
        //     console.log("hit left wall");
        //     // this.player.x = this.player.x - this.player.width / 2;
        // }
    }
    this.player.update(this.width, this.height);
};
Game.prototype.draw = function () {
    this.context.clearRect(0, 0, this.width, this.height);
    this.player.draw(this.context);
    this.context.strokeStyle = 'lightblue';
    for (bound of this.bounds) {
        bound.draw(this.context);
    }
};

var canJump = true;
var game;
function playGame(game) {
    // game.bgMusic.volume = 0.1;
    // game.bgMusic.loop = true;
    // game.bgMusic.play();
    function main (timeStamp) {
        game.update();
        game.draw();
        window.requestAnimationFrame(main);
    }
    window.requestAnimationFrame(main);
}

document.addEventListener("DOMContentLoaded", function(event) {
    game = new Game();
    playGame(game);
});
