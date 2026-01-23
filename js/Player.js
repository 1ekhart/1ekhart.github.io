import Entity from "./AbstractClasses/Entity.js";
import BoundingBox from "./GeneralUtils/BoundingBox.js";
import Interactable from "./Interactable.js";
import Animator from "/js/GeneralUtils/Animator.js";
import { PARAMS } from "/js/Util.js";
const floor = Math.floor;

const HITBOX_WIDTH = 24;
const HITBOX_HEIGHT = 48;

const WALKING_SPEED = 6;

export default class Player extends Entity {
    constructor() {
        super();
        this.x = 16;
        this.y = 32;

        this.xVelocity = 0;
        this.yVelocity = 0;
        this.onGround = false;
        this.BB = new BoundingBox(this.x, this.y, HITBOX_WIDTH, HITBOX_HEIGHT);
        // this.BB = new BoundingBox(this.x, HI, this.x, this.y);
        this.updateBB();

        //stuff for animations
        this.animations = [];
        this.loadAnimations();
        this.animationState = "Idle"
        this.isRight = true;
    }

    loadAnimations() {
        this.animations = [];
        this.idle = new Animator(ASSET_MANAGER.getAsset("./js/Assets/Player/IdleRun-Sheet.png"), 0, 0, 32, 32, 2, 1, 0, false, true);
        this.animations["Idle"] = this.idle;

        this.run = new Animator(ASSET_MANAGER.getAsset("./js/Assets/Player/IdleRun-Sheet.png"), 0, 32, 32, 32, 6, .3, 0, false, true);
        this.animations["Run"] = this.run;

        this.idleAttack = new Animator(ASSET_MANAGER.getAsset("./js/Assets/Player/IdleRun-Sheet.png"), 0, 64, 32, 32, 6, .05, 0, false, false);
        this.animations["IdleAttack"] = this.idleAttack;
    }

    setAnimationState(state) {
        this.animationState = state;
    }

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, HITBOX_WIDTH, HITBOX_HEIGHT);
    }

    /**
     * @param {import('/js/GameEngine.js').default} engine
     */
    update(engine) {
        // movement
        // TODO: adjust acceleration & drag to 'feel' better, these are placeholder values
        if (engine.input.left && this.xVelocity > -WALKING_SPEED) {
            this.xVelocity -= 1; // acceleration
        } else if (engine.input.right && this.xVelocity < WALKING_SPEED) {
            this.xVelocity += 1;
        } else if (this.xVelocity > 0) {
            this.xVelocity -= 0.5; // drag
        } else if (this.xVelocity < 0) {
            this.xVelocity += 0.5;
        }
        if (this.onGround && engine.input.jump) {
            this.yVelocity = -11; // jump strength
        }

        if (engine.input.left) {
            this.setAnimationState("Run");
            this.isRight = false;
        } else if (engine.input.right) {
            this.setAnimationState("Run");
            this.isRight = true;
        } else if (engine.input.interact) {
            this.handleIteraction(engine);
        } else {
            this.setAnimationState("Idle");
        }
        

        // gravity
        if (engine.input.jump) {
            this.yVelocity += 0.5;
        } else {
            this.yVelocity += 1;
        }
        this.updateBB();


        // collision
        const level = engine.getLevel();

        // attempt to move, reducing velocity until no collision occurs (to touch the wall exactly)
        while (this.xVelocity > 0 && level.checkIfBoxCollides(this.x + this.xVelocity, this.y, HITBOX_WIDTH, HITBOX_HEIGHT)) {
            this.xVelocity -= 1;
        }
        while (this.xVelocity < 0 && level.checkIfBoxCollides(this.x + this.xVelocity, this.y, HITBOX_WIDTH, HITBOX_HEIGHT)) {
            this.xVelocity += 1;
        }
        this.x += this.xVelocity;

        this.onGround = false;
        while (this.yVelocity > 0 && level.checkIfBoxCollides(this.x, this.y + this.yVelocity, HITBOX_WIDTH, HITBOX_HEIGHT)) {
            this.yVelocity -= 1;
            this.onGround = true; // we collided with something while moving down
        }
        while (this.yVelocity < 0 && level.checkIfBoxCollides(this.x, this.y + this.yVelocity, HITBOX_WIDTH, HITBOX_HEIGHT)) {
            this.yVelocity += 1;
        }
        this.y += this.yVelocity;
        // this.updateBB();
    }

    handleIteraction(engine) {
        const that = this;
        engine.entities.forEach(function (entity) {
            if (entity instanceof Interactable) {
                if (entity.BB && that.BB.collide(entity.BB)) {
                    entity.handleInteraction();
                }
            }
        })
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {import('/js/GameEngine.js').default} engine
     */
    draw(ctx, engine) {
        // temporary box graphics :)
        this.animations[this.animationState].drawFrame(engine.getTickSpeed(), ctx, this.x - 17, floor(this.y) - HITBOX_HEIGHT + 32, !this.isRight)
        if (PARAMS.DEBUG == true) {
            ctx.strokeStyle = "#aa0000";
            ctx.strokeRect(floor(this.x), floor(this.y), HITBOX_WIDTH + 1, HITBOX_HEIGHT + 1);
        }
    }
}
