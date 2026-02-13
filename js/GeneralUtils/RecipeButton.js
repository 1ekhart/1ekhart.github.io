import Entity from "/js/AbstractClasses/Entity.js";

export default class RecipeButton extends Button { // like button but with some added features 
    constructor(parent, recipeID) {
        super(parent.x, parent.y, parent.height);
        this.isVisible = false;
    }

    setVisible() {
        this.isVisible = true;
    }

    update() {

    }

    draw() {

    }
}