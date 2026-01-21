export default class CollisionTester {
    update() { }
    draw(ctx, engine) {
        if(engine.mouse) {
            const SIZE = 36;
            if(engine.getLevel().checkIfBoxCollides(engine.mouse.x, engine.mouse.y, SIZE, SIZE)) {
                ctx.strokeStyle = "#00ff00"
            } else {
                ctx.strokeStyle = "#0000ff"
            }
            ctx.strokeRect(engine.mouse.x, engine.mouse.y, SIZE, SIZE)
        }
    }
}
