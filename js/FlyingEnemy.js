/** @import GameEngine from "/js/GameEngine.js" */
import WorldEntity from "/js/AbstractClasses/WorldEntity.js";
import { CONSTANTS, secondsToTicks } from '/js/Util.js';

const MAX_HEALTH = 30;

const EVADE_DISTANCE = Math.pow(CONSTANTS.TILESIZE * 3, 2) // 3 tiles radius
const ACTIVE_DISTANCE = Math.pow(CONSTANTS.TILESIZE * 10, 2) // 10 tiles radius

const REGEN_COOLDOWN_DELAY = secondsToTicks(8); // 8 seconds before regen starts
const REGEN_COOLDOWN_REGENERATING = secondsToTicks(0.5); // 0.5 seconds between HP increase
const INVINCIBILITY_PERIOD = secondsToTicks(0.6);

/** moves `num` towards zero by `delta` without overshooting zero.
 * @param {number} value the value to change
 * @param {number} delta the distance to move the value
 * @returns the modified value, or 0 if it was less than delta away from zero
 */
export function decreaseToZero(value, delta) {
    if (value > 0) {
        return Math.max(value - delta, 0);
    } else {
        return Math.min(value + delta, 0);
    }
}

export default class FlyingEnemy extends WorldEntity {
    /** @param {GameEngine} engine */
    constructor(engine, x, y) {
        super();
        this.engine = engine;
        this.x = x;
        this.y = y;
        this.health = MAX_HEALTH;
        this.invincibilityTicks = 0;
        this.regenTimer = 0;

        // idle: before player gets close
        // evading: when player gets too close
        // active: while in combat
        // swooping: flying at the player
        // cooldown: after swooping at the player
        this.state = "idle"; // idle, evading, active, swooping, cooldown
        this.stateTicks = 0; // time until state change
    }

    changeState(state) {
        this.state = state;
        this.stateTicks = 0;
    }

    /** @param {GameEngine} engine */
    update(engine) {
        const player = engine.getPlayer()

        // avoid the player while idle or active
        // go idle if too far away
        if(this.state === "idle" || this.state === "active") {
            const squaredDistFromPlayer = Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2);
            if(squaredDistFromPlayer < EVADE_DISTANCE) {
                this.changeState("evading");
                this.xVelocity = this.x > player.x ? 24 : -24; // move away from the player
            }
            if(squaredDistFromPlayer > ACTIVE_DISTANCE) {
                this.changeState("idle")
                this.xVelocity = 0;
                this.yVelocity = 0;
            }
        }
        // evading: slow down, switch to active after
        if(this.state === "evading") {
            if(this.xVelocity !== 0) {
                this.xVelocity = decreaseToZero(this.xVelocity, 2);
            } else {
                this.changeState("active");
            }
        }
        // active: wait for 2 secs, then swoop at the player
        if(this.state === "active") {
            this.stateTicks += 1;
            if(this.stateTicks > 120) {
                this.changeState("swooping")
            }
        }
        // swoop down towards the player, then go into cooldown
        if(this.state === "swooping") {
            if(this.stateTicks < 20) {
                this.yVelocity += 0.25;
                this.xVelocity += 0.25;
            } else {
                this.yVelocity -= 0.75;
                this.xVelocity -= 0.25;
            }

            this.stateTicks += 1;
            if(this.stateTicks > 40) {
                this.changeState("cooldown")
                this.yVelocity = 0;
                this.xVelocity = 0;
            }
        }
        // after swooping, stay still for 2 secs to allow the player to attack, then switch back to active
        if(this.state === "cooldown") {
            this.stateTicks += 1;
            if(this.stateTicks > 120) {
                this.changeState("active")
            }
        }

        this.moveColliding(this.engine)

        if(this.health < MAX_HEALTH) {
            if(this.regenTimer <= 0) {
                this.health += 1;
                this.regenTimer = REGEN_COOLDOWN_REGENERATING;
            }
            this.regenTimer -= 1;
        }
        this.invincibilityTicks -= 1;
    }

    /** @param {Player} player */
    onAttack() {
        if (this.invincibilityTicks > 0) {return;}
        this.invincibilityTicks = INVINCIBILITY_PERIOD;
        this.health -= 8;
        this.regenTimer = REGEN_COOLDOWN_DELAY;

        if(this.health <= 0) {
            this.remove()
            this.engine.addEntity(new Item(
                8, // TODO: different item
                this.x + 20, this.y,
                0, -4,
                4
            ))
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {GameEngine} engine
     * @param {number} deltaTime
     */
    draw(ctx, engine, deltaTime) {
        ctx.fillStyle = "#ffaa00";
        ctx.fillRect(this.x - engine.camera.x, this.y - engine.camera.y, this.width, this.height);
        ctx.fillText(`HP: ${this.health}/${MAX_HEALTH}`, this.x - engine.camera.x, this.y - 14 - engine.camera.y);

        if(CONSTANTS.DEBUG) {
            ctx.fillText(this.state, this.x - engine.camera.x, this.y - 32 - engine.camera.y);
        }
    }
}
