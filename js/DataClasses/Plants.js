const Potato = {
    itemID: 3,
    name: "Potato",
    width: 16,
    height: 32,
    regrows: false,
    growTime: 2,
    scale: 2,
    assetName: "/Assets/WorldItems/PotatoPlant-Sheet.png"
}

const plantList = {
    3: Potato
}

export const getPlantData = (plantID) => {
    return plantList[plantID];
}

// plants should have 4 states for just planted, grown, and ready for Harvest
export const drawPlant = (ctx, plantID, x, y, growthStage) => {
    return plantList[plantID]
}
