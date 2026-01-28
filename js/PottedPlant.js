import EntityInteractable from "/js/AbstractClasses/EntityInteractable.js";
import OnScreenTextSystem from "/js/GeneralUtils/OnScreenText.js";
import Item from "/js/Item.js";
import Player from "/js/Player.js";
import { CONSTANTS, randomInt, randomIntRange } from "/js/Util.js";

const potFill = "#6b583c";
const plantGrowing = "#476b3c"
const plantGrown = "#7cbc69"
export default class PottedPlant extends EntityInteractable {
    constructor(engine, x, y, width, height, plantID, growDate) {
        super();
        this.engine = engine;
        this.width = width * 2;
        this.height = height * 2;
        this.x = x - (width / 2);
        this.y = y - (height / 2);
        this.daysLeft = growDate / engine.getClock().dayCount;
        this.plantID = plantID;
        this.growDate = growDate;

        this.renderX = x;
        this.renderY = y;
        this.renderWidth = width;
        this.renderHeight = height;
        this.prompt = new OnScreenTextSystem(this,
                    x + (width / 4), y - (height) - (height/4), `Farmable in day ${growDate}`, false);
                engine.addEntity(this.prompt);
    }

    update(engine) {
        for (const entity of engine.entities) {
            if (entity instanceof Player) {
                if (this.isCollidingWith(entity)) {
                    this.prompt.showText();
                } else {
                    this.prompt.hideText();
                }
            }
        }
    }



    /** @param {Player} player */
    interact(player) {
        if (this.growDate <= this.engine.getClock().dayCount) {
            this.growDate = this.engine.getClock().dayCount + 2;
            this.engine.addEntity(
                new Item(this.plantID, 
                    this.renderX + (this.width / 4), this.renderY - (this.height / 2), 
                    randomIntRange(10, -10), -5, 
                    randomInt(5))
            )
        }
    }

    draw(ctx, engine) {
        ctx.fillStyle = potFill;
        ctx.fillRect(this.renderX - engine.camera.x, this.renderY - engine.camera.y,
        this.renderWidth, this.renderHeight);

        // calculate the plant growth size;
        const timePassed = engine.getClock().dayCount / this.growDate;

        var plantHeight, plantWidth;
        if (timePassed < 1) {
            plantWidth = (timePassed) * (this.width / 2);
            plantHeight = (timePassed) * (this.width / 2);
            ctx.fillStyle = plantGrowing;
        } else {
            plantWidth = this.width / 2;
            plantHeight = this.height / 2;
            ctx.fillStyle = plantGrown
        }

        
        ctx.fillRect((this.renderX + this.renderWidth - (this.renderWidth + plantWidth)/2) - engine.camera.x, (this.renderY - plantHeight) - engine.camera.y,
        plantWidth, plantHeight);
        
        if (CONSTANTS.DEBUG == true) {
            ctx.strokeStyle = "#aa0000";
            ctx.strokeRect(Math.floor(this.x - engine.camera.x), Math.floor(this.y - engine.camera.y), this.width, this.height);
        }
    }
}
