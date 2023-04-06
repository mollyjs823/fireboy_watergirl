var gameObjects = [];
var currentId = 0;
function GameObject(position, scale, color) {
    let gameObject = {
        id: currentId,
        position: position,
        velocity: Vector2D(0, 0),
        scale: scale,
        color: color,
        solid: true,
        onUpdate: deltaTime => { },
        onCollision: other => { },
        g: 0.004,
        grounded: false
    };
    currentId++;
    gameObjects.push(gameObject);
    return gameObject;
}

function Player(position) {
    let player = GameObject(position, Vector2D(50, 50), "blue");
    player.walkSpeed = 0.5;
    player.jumpSpeed = 1.2;
    player.maxJumpTime = 1000;
    player.jumpTime = 0;
    player.startJumpG = player.g;
    player.endJumpG = player.g * 2;
    player.onUpdate = deltaTime => {
        if (player.grounded) {
            player.jumpTime = 0;
            player.g = player.startJumpG;
        }
        player.velocity.x = 0;
        if (controls.left.pressed) {
            player.velocity.x -= player.walkSpeed;
        }
        if (controls.right.pressed) {
            player.velocity.x += player.walkSpeed;
        }
        if (controls.up.pressed && player.jumpTime < player.maxJumpTime) {
            if (player.grounded) {
                player.velocity.y = -player.jumpSpeed;
            }
            player.jumpTime += deltaTime;
        } else {
            player.jumpTime = player.maxJumpTime;
            player.g = player.endJumpG;
        }
    };

    player.onCollision = other => {
        if (other.damage) {
            player.destroy = true;
        }
    };

    return player;
}

function Block(position, scale) {
    let block = GameObject(position, scale, "black");
    block.g = 0;
    return block;
}