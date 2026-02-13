import Entity from "/js/AbstractClasses/Entity.js";

export default class ScrollingPanel extends Entity{
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.color = idleColor;
        this.elements = [];
    }

    addElements(Element) {
        
    }

    destroy() {
        this.removeFromWorld = true;
        this.elements.forEach(function (entity) {
            entity.removeFromWorld = true;
        })
    }
}