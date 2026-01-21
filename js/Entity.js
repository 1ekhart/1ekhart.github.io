// base entity class containing common useful behavior
// (you don't have to inherit from this; Level doesn't)

export default class Entity {
    constructor() {
        this.x = 0;
        this.y = 0;
    }

    update() {

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
