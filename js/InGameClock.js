import Entity from "./AbstractClasses/Entity.js";
import GameEngine from "/js/GameEngine.js";

// how many seconds each day will last. Each day is 24 hours, so the hour length will be DAY_LENGTH / 24 and minutes  will be 60/hour length
const DAY_LENGTH = 60; // 200 day length means each minute will be rough 0.14 seconds
const HOUR_LENGTH = DAY_LENGTH / 24;
const MINUTE_LENGTH = HOUR_LENGTH / 60;

// consts for time settings, what is the start and end of each day, etc.
const STARTING_HOUR = 6;
const FINAL_HOUR = 24; // fall asleep at midnight
const MODE_SWITCH_HOUR = 15; // game switches from gathering to cooking at this hour

export default class InGameClock extends Entity {
    constructor() {
        super();
        this.x = 150;
        this.y = 16;
        this.dayTime = HOUR_LENGTH * STARTING_HOUR; // seconds elapsed in the day
        this.dayCount = 0;
        this.loadSavedTime();
    }

    loadSavedTime() { // for when we work with persisting data. Loads the current day, etc.

    }

    getGameHour() {
        return Math.floor(this.dayTime / HOUR_LENGTH);
    }

    getGameMinute() {
        return Math.floor(this.dayTime % HOUR_LENGTH / MINUTE_LENGTH);
    }


    /**
     * @param {import('/js/GameEngine.js').default} engine
     */
    update(engine) {
        // this.dayTime += 1 * engine.deltaTime;
        this.dayTime += engine.getTickSpeed();


        if (this.dayTime >= DAY_LENGTH) {
            this.dayTime = HOUR_LENGTH * STARTING_HOUR;
            this.dayCount += 1;
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {import('/js/GameEngine.js').default} engine
     */
    draw(ctx, engine) {
        // draw *something* if a subclass doesn't correctly draw anything
        ctx.fillStyle = "#000000"
        // ctx.fillRect(this.x, this.y, 32, 32);
        ctx.fillText(
            `Day ${this.dayCount} at (${this.getGameHour()} : ${this.getGameMinute()})
            Game Time: ${this.dayTime}
            `, this.x, this.y);
    }
}