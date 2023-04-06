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
    this.onFloor = true;
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
    // check if gravity applies and if jumping
    if (this.onFloor) {
        this.jumpTime = 0;
        this.g = 0.2;
    } else {
        this.vy += this.gravity;
        this.y += this.vy;
    }

    // check if hit top or bottom wall
    if (this.y <= 0) {
        this.y = 0;
        this.vy = 0;
    } else if (this.y >= height - this.height) {
        this.y = height - this.height;
        this.vy = 0;
    }

    // check if hit left or right wall
    if (this.x <= 0) {
        this.x = 0;
    } else if (this.x >= width) {
        this.x = width;
    }
};
Player.prototype.checkCollisions = function(boxes) {
    // check if player hit floor
    checkCollision(player, b){
        player.x <= b.position.x + b.scale.x &&
        player.x + a.scale.x >= b.position.x &&
        a.position.y <= b.position.y + b.scale.y &&
        a.position.y + a.scale.y >= b.position.y;
    }
    for (box of boxes) {
        if (checkCollision(this, box)) {
            blockGameObject(this, box);
        }
    }
    if (bottomWall(this) + this.vy > box.points.topY &&
        bottomWall(this) <= box.points.topY &&
        rightWall(this) > box.points.leftX &&
        leftWall(this) < box.points.rightX) {
        console.log("hit floor");
        this.vy = 0;
        this.onFloor = true;
        this.y = box.points.topY - this.height;
    }

    // check if player hit ceiling
    // check if player hit right wall
    // check if player hit left wall
}

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
        if ((this.player.y > block.points.bottomY && this.player.y > block.points.topY) || this.player.y < block.points.topY) {
            this.player.checkCollisions(block);
        }
        // else if (
        //     topWall(this.player) + this.player.vy <= block.points.bottomY && 
        //     bottomWall(this.player) + this.player.vy >= block.points.bottomY && 
        //     leftWall(this.player) <= block.points.rightX && 
        //     rightWall(this.player) >= block.points.leftX
        // ) {
        //     this.player.y = block.points.bottomY;
        //     this.player.vy = 0;
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
