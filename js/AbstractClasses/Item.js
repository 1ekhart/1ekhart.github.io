import BoundingBox from '/js/GeneralUtils/BoundingBox.js';
import Entity from '/js/AbstractClasses/Entity.js';
import Player from '/js/Player.js';

const HITBOX_WIDTH = 16;
const HITBOX_HEIGHT = 16;
const PICKUP_COOLDOWN = 1; // the item can't be picked up for this amount of time;
const GRAVITY = 1;

export default class Item extends Entity {
    constructor(itemID, x, y, initVelocityX, initVelocityY, quantity) {
        super();
        this.x = x;
        this.y = y;
        this.itemID = itemID;
        this.BB = new BoundingBox(x, y, HITBOX_WIDTH, HITBOX_HEIGHT);
        this.pickable = false;
        this.elapsedTime = 0;
        if (!initVelocityX) {
            this.xVelocity = 0;
        } else {
        this.xVelocity = initVelocityX;
        }
        if (!initVelocityY) {
            this.yVelocity =  0;
        } else {
        this.yVelocity = initVelocityY;
        }
        if (!quantity) {
            this.quantity = 1;
        } else {
            this.quantity = quantity;
        }
        this.updateBB();
    }

    update(engine) {

        const level = engine.getLevel();
        // attempt to move, reducing velocity until no collision occurs (to touch the wall exactly)
        while (this.xVelocity > 0 && level.checkIfBoxCollides(this.x + this.xVelocity, this.y, HITBOX_WIDTH, HITBOX_HEIGHT)) {
            this.xVelocity -= GRAVITY;
        }
        while (this.xVelocity < 0 && level.checkIfBoxCollides(this.x + this.xVelocity, this.y, HITBOX_WIDTH, HITBOX_HEIGHT)) {
            this.xVelocity += GRAVITY;
        }

        this.x += this.xVelocity;
        this.onGround = false;

        while (this.yVelocity > 0 && level.checkIfBoxCollides(this.x, this.y + this.yVelocity, HITBOX_WIDTH, HITBOX_HEIGHT)) {
            this.yVelocity -= GRAVITY;
            this.onGround = true; // we collided with something while moving down
        }
        while (this.yVelocity < 0 && level.checkIfBoxCollides(this.x, this.y + this.yVelocity, HITBOX_WIDTH, HITBOX_HEIGHT)) {
            this.yVelocity += GRAVITY;
        }
        this.y += this.yVelocity;
        this.updateBB();

        // do the timer for when the item's able to be picked up.
        if (this.pickable == false) {
            this.elapsedTime += engine.getTickSpeed()
            if (this.elapsedTime >= PICKUP_COOLDOWN) {
                this.pickable = true;
            }
        }

        if (this.pickable == true) {
            var that = this;
            engine.entities.forEach(function (entity) {
                if (entity instanceof Player) {
                    if (entity.BB && that.BB.collide(entity.BB)) {
                        that.pickUpItem(entity);
                    }
                }
            })
        }
    }

    pickUpItem(player) {
        console.log("Player picked up item");
        this.removeFromWorld = true;
    }

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, HITBOX_WIDTH, HITBOX_HEIGHT);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {import('/js/GameEngine.js').default} engine
     */
    draw(ctx, engine) {
        // draw *something* if a subclass doesn't correctly draw anything
        if (this.pickable == false) {
        ctx.fillStyle = "#ff00ff45"
        } else {
        ctx.fillStyle = "#ff00ff"
        }
        ctx.fillRect(this.x, this.y, HITBOX_WIDTH, HITBOX_HEIGHT);
    }
}