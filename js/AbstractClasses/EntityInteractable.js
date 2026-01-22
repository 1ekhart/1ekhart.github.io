// modification to the entity class to have an interactable item that does something 

export default class EntityInteractable {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.toggleState = false;
    }

    update() {
        
    }

    toggleEntity() {

    }

    unToggleEntity() {

    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {import('/js/GameEngine.js').default} engine
     */
    draw(ctx, engine) {
        // draw *something* if a subclass doesn't correctly draw anything
        ctx.fillStyle = "#ff00ff"
        ctx.fillRect(this.x, this.y, 32, 32);
    }
}