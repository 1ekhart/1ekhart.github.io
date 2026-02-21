import EntityInteractable from "/js/AbstractClasses/EntityInteractable.js";
import { getItemData } from "/js/DataClasses/ItemList.js";
import { getRecipeData } from "/js/DataClasses/RecipeList.js";
import DialogueBox from "/js/GeneralUtils/DialogueBox.js";
import OnScreenTextSystem from "/js/GeneralUtils/OnScreenText.js";
import Player from "/js/Player.js";
import { CONSTANTS } from "/js/Util.js";

const interactionCooldown = 0.5;
export default class Customer extends EntityInteractable {
    constructor(x, y, width, height, order, engine) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.engine = engine;

        this.order = order;
        this.recipeID = order.recipeID;
        this.recipeItemID = getRecipeData(this.recipeID).itemID
        this.recipeName = getItemData(this.recipeItemID).name;
        this.ingredientID = order.specificIngredient;
        this.ingredientName = getItemData(this.ingredientID).name;
        this.orderTaken = false;
        this.orderCompleted = false;
        this.text = `Press E to take order: ${this.recipeName} with ${this.ingredientName}`;
        this.interactionCooldown = interactionCooldown;
        console.log(this.text);
        this.prompt = new OnScreenTextSystem(this, x + width/2, y - 10, `${this.text}`, false);
    }

    interact(player) {
        if(this.orderCompleted) return;
        if (this.interactionCooldown > 0) return;
        this.interactionCooldown = interactionCooldown;
        // if order not taken yet -> take it
        if (!this.orderTaken) {
            // const availableStation = this.engine.stationManager.getAvailableStation();
            // if (!availableStation) {
            //     console.log("No available cooking stations!");
            //     return;
            // }
            // availableStation.assignOrder(this.order);
            this.orderTaken = true;
            this.prompt.changeText(`Order taken! Bring: ${this.recipeName} with ${this.ingredientName}`);
            this.prompt.showText();
            // console.log(`Order taken! Order assigned to station ${availableStation.id}`);
            return;
        }

        // if order already takenaw -> try delivering
        if (this.orderTaken && !this.orderCompleted) {
            const equippedItem = player.inventory.getEquippedItem();
            const playerInventory = player.inventory;

            if (equippedItem == this.recipeItemID && playerInventory.slots[playerInventory.getEquippedSlot()].isDish) { // check if the idno matches then do an additional check if the ingredient is there
                if (!playerInventory.slots[playerInventory.getEquippedSlot()].ingredients.includes(this.ingredientID)) {
                    this.engine.addUIEntity(new DialogueBox(this.engine, "This is the right dish but with the wrong ingredients!", false, false))
                    return;
                }
                player.inventory.money += this.calculateMoney(player, playerInventory.getEquippedSlot());
                player.inventory.removeItem(player.inventory.equippedSlot);
                this.orderCompleted = true;

                // if (this.prompt) {
                //     this.prompt.removeFromWorld = true;
                //     this.prompt = null;
                // }


                this.removeFromWorld = true;

                if (this.onComplete) {
                    this.onComplete();
                }

                console.log("Order delivered!");
            } else {
                this.engine.addUIEntity(new DialogueBox(this.engine, "Wrong item given, select the correct dish in your inventory.", false, false))
                console.log("This is not my order!");
            }
        }
    }
    calculateMoney(player, equippedIndex) {
        const playerInventory = player.inventory;
        const itemSaleValue = getItemData(playerInventory.slots[equippedIndex].itemID).sellPrice;
        let totalCost = itemSaleValue;
        const ingredients = player.inventory.slots[equippedIndex].ingredients;
        for (let i = 0; i < ingredients.length; i++) {
            totalCost += getItemData(ingredients[i]).sellPrice;
        }
        return totalCost * 1.2;
    }

    update(engine) {
        this.interactionCooldown -= CONSTANTS.TICK_TIME;
        /**if (this.orderTaken) return;

        if (this.orderCompleted && this.prompt) {
            this.prompt.removeFromWorld = true;
            this.prompt = null;
        }

        for (const layer of engine.entities) {
            for (const entity of layer) {
                if (entity instanceof Player && this.isCollidingWith(entity)) {
                    this.prompt.showText();
                    return;
                }
            }
        }
        this.prompt.hideText();**/

        if (this.orderCompleted) {
            if (this.prompt) {
                this.prompt.removeFromWorld = true;
                this.prompt = null;
            }
            return;
        }

        // if (this.orderTaken) {
        //     this.prompt.changeText(`Order taken! Bring: ${this.order.id}`);
        // } else {
        //     this.prompt.changeText(`Press E to take order: ${this.recipeName} with ${this.ingredientName}`);
        // }

        let playerNearby = false;
        for (const layer of engine.entities) {
            for (const entity of layer) {
                if (entity instanceof Player && this.isCollidingWith(entity)) {
                    playerNearby = true;
                    break;
                }
            }
            if (playerNearby) break;
        }

        if (playerNearby) {
            this.prompt.showText();
        } else {
            this.prompt.hideText();
        }
    }

    draw(ctx, engine) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(this.x - engine.camera.x, this.y - engine.camera.y, this.width, this.height);
    }
}