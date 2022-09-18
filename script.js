class Army {
    constructor(uuid) {
        this.uuid = uuid;
        this.infantry = 0;
        this.cavalry = 0;
        this.artillery = 0;
        this.offense = 0;
        this.defense = 0;
        this.aggressive = 0;
        this.advantage = 0;
    }

    getStats() {
        this.infantry = Number.parseInt(document.getElementById("infantryInput_" + this.uuid).value);
        this.cavalry = Number.parseInt(document.getElementById("cavalryInput_" + this.uuid).value);
        this.artillery = Number.parseInt(document.getElementById("artilleryInput_" + this.uuid).value);
        this.offense = Number.parseInt(document.getElementById("offenseInput_" + this.uuid).value);
        this.defense = Number.parseInt(document.getElementById("defenseInput_" + this.uuid).value);
        this.aggressive = Number.parseInt(document.getElementById("aggressiveInput_" + this.uuid).value);
        this.advantage = Number.parseInt(document.getElementById("advantageInput_" + this.uuid).value);

        this.infantry = isNaN(this.infantry) ? 0 : this.infantry;
        this.cavalry = isNaN(this.cavalry) ? 0 : this.cavalry;
        this.artillery = isNaN(this.artillery) ? 0 : this.artillery;
        this.offense = isNaN(this.offense) ? 0 : this.offense;
        this.defense = isNaN(this.defense) ? 0 : this.defense;
        this.aggressive = isNaN(this.aggressive) ? 0 : this.aggressive;
        this.advantage = isNaN(this.advantage) ? 0 : this.advantage;
    }

    returnValues() {
        return {
            uuid: this.uuid,
            infantry: this.infantry,
            cavalry: this.cavalry,
            artillery: this.artillery,
            offense: this.offense,
            defense: this.defense,
            aggressive: this.aggressive,
            advantage: this.advantage
        }
    }
}

let blueArmyList = document.getElementById("blueArmyList");
let redArmyList = document.getElementById("redArmyList");

let blueArmies = {};
let redArmies = {};

function createBlueArmy() {
    let uuid = randomUUID();
    blueArmies[uuid] = new Army(uuid);

    let armyhtml = generateHtmlForArmy(uuid, "Blue");
    blueArmyList.insertAdjacentHTML('beforeend', armyhtml)
}

function deleteBlueArmy(uuid) {
    delete blueArmies[uuid];

    let deleting = document.getElementById("army_" + uuid);
    deleting.remove();
}

function createRedArmy() {
    let uuid = randomUUID();
    redArmies[uuid] = new Army(uuid);

    let armyhtml = generateHtmlForArmy(uuid, "Red");
    redArmyList.insertAdjacentHTML('beforeend', armyhtml)
}

function deleteRedArmy(uuid) {
    delete redArmies[uuid];

    let deleting = document.getElementById("army_" + uuid);
    deleting.remove();
}

function generateHtmlForArmy(uuid, color) {
    return `<div class="army" id="army_${uuid}"><p>Troops</p><p><input type="number" value="1000" min="0" id="infantryInput_${uuid}"> <label for="infantryInput_${uuid}">Infantry</label></p><p><input type="number" value="200" min="0" id="cavalryInput_${uuid}"> <label for="cavalryInput_${uuid}">Cavalry</label></p><p><input type="number" value="0" min="0" id="artilleryInput_${uuid}"> <label for="artilleryInput_${uuid}">Artillery</label></p><p>General</p><p><input type="number" value="50" min="0" id="offenseInput_${uuid}"> <label for="offenseInput_${uuid}">Offense</label></p><p><input type="number" value="50" min="0" id="defenseInput_${uuid}"> <label for="defenseInput_${uuid}">Defense</label></p><p><input type="number" value="50" min="0" id="aggressiveInput_${uuid}"> <label for="aggressiveInput_${uuid}">Aggressiveness</label></p><p>Other</p><p><input type="number" value="0" min="0" id="advantageInput_${uuid}"> <label for="advantageInput_${uuid}">Other Advantages</label></p><div class="deleteButton" onclick="delete${color}Army('${uuid}')">+</div>`;
}

function simulateBattle() {
    let blue = [];
    let red = [];

    Object.keys(blueArmies).forEach(function (key) {
        blueArmies[key].getStats();
        blue.push(blueArmies[key].returnValues());
    });

    Object.keys(redArmies).forEach(function (key) {
        redArmies[key].getStats();
        red.push(redArmies[key].returnValues());
    });

    let blueToCompare = JSON.parse(JSON.stringify(blue));
    let redToCompare = JSON.parse(JSON.stringify(red));

    fighting = true;

    let redVictories = 0;
    let blueVictories = 0;
    let draws = 0;

    let redIndex = 0;
    let blueIndex = 0;

    while (fighting) {
        for (i = 0; i < blue.length || i < red.length; i++) {
            if (blueIndex == blue.length) {
                blueIndex = 0;
            }

            if (redIndex == red.length) {
                redIndex = 0;
            }

            let blueArmy = JSON.parse(JSON.stringify(blue[blueIndex]));
            let redArmy = JSON.parse(JSON.stringify(red[redIndex]));
            let originalBlueArmy = JSON.parse(JSON.stringify(blueArmy));
            let originalRedArmy = JSON.parse(JSON.stringify(redArmy));

            console.log(blueArmy.uuid + " VS " + redArmy.uuid);
            console.log("Blue - " + blueArmy.infantry + ", " + blueArmy.cavalry + ", " + blueArmy.artillery);
            console.log("Red - " + redArmy.infantry + ", " + redArmy.cavalry + ", " + redArmy.artillery);

            let blueRoll = roll(50) + blueArmy.advantage;
            console.log("Blue Army " + blueArmy.uuid + " rolled a(n) " + blueRoll);
            let redRoll = roll(50) + redArmy.advantage;
            console.log("Red Army " + redArmy.uuid + " rolled a(n) " + redRoll);
            let difference = blueRoll - redRoll;

            if (difference > 0) {
                // Higher Blue Roll
                difference = Math.abs(difference);
                console.log("Difference is " + difference + ", in favor of Blue. Blue will attack first.");

                let allCasualtyMultiplier = 1;
                allCasualtyMultiplier += 0.01 * blueArmy.aggressive;
                allCasualtyMultiplier += 0.005 * redArmy.aggressive;

                let blueCasualtyMultiplier = 1;
                blueCasualtyMultiplier -= 0.01 * blueArmy.offense;
                blueCasualtyMultiplier += 0.0125 * redArmy.defense;
                blueCasualtyMultiplier -= 0.015 * difference;
                blueCasualtyMultiplier *= allCasualtyMultiplier;
                blueCasualtyMultiplier = blueCasualtyMultiplier < 0.1 ? 0.1 : blueCasualtyMultiplier;
                console.log("Blue casualty multiplier (attacking) - " + blueCasualtyMultiplier);

                let redCasualtyMultiplier = 1;
                redCasualtyMultiplier -= 0.0125 * redArmy.defense;
                redCasualtyMultiplier += 0.01 * blueArmy.offense;
                redCasualtyMultiplier += 0.0075 * difference;
                redCasualtyMultiplier *= allCasualtyMultiplier;
                redCasualtyMultiplier = redCasualtyMultiplier < 0.1 ? 0.1 : redCasualtyMultiplier;
                console.log("Red casualty multiplier (defending) - " + redCasualtyMultiplier);

                let blueCasualties = (0.1 * redArmy.infantry) + (0.3 * redArmy.cavalry) + (1.6 * redArmy.artillery);
                blueCasualties *= blueCasualtyMultiplier;
                blueCasualties = Math.round(blueCasualties);
                console.log("Blue suffered " + blueCasualties + " casualties while attacking.");

                let redCasualties = (0.1 * blueArmy.infantry) + (0.5 * blueArmy.cavalry) + (1.6 * blueArmy.artillery);
                redCasualties = Math.round(redCasualties);
                console.log("Red suffered " + redCasualties + " casualties while defending.");

                // Decrease army sizes with casualties
                let blueRatio = blueCasualties / (blueArmy.infantry + (blueArmy.cavalry * 4) + (blueArmy.artillery * 16));
                let redRatio = redCasualties / (redArmy.infantry + (redArmy.cavalry * 4) + (redArmy.artillery * 16));
                blueRatio = blueRatio > 1 ? 1 : blueRatio
                redRatio = redRatio > 1 ? 1 : redRatio
                console.log("RATIO: " + blueRatio + ", " + redRatio);

                blueArmy.infantry -= Math.round(blueArmy.infantry * blueRatio);
                blueArmy.cavalry -= Math.round(blueArmy.cavalry * blueRatio);
                blueArmy.artillery -= Math.round(blueArmy.artillery * blueRatio);

                redArmy.infantry -= Math.round(redArmy.infantry * redRatio);
                redArmy.cavalry -= Math.round(redArmy.cavalry * redRatio);
                redArmy.artillery -= Math.round(redArmy.artillery * redRatio);

                blueArmy.infantry = blueArmy.infantry < 0 ? 0 : blueArmy.infantry
                blueArmy.cavalry = blueArmy.cavalry < 0 ? 0 : blueArmy.cavalry
                blueArmy.artillery = blueArmy.artillery < 0 ? 0 : blueArmy.artillery

                redArmy.infantry = redArmy.infantry < 0 ? 0 : redArmy.infantry
                redArmy.cavalry = redArmy.cavalry < 0 ? 0 : redArmy.cavalry
                redArmy.artillery = redArmy.artillery < 0 ? 0 : redArmy.artillery

                // Red counterattack
                console.log("Red will now counterattack.");


                allCasualtyMultiplier = 1;

                allCasualtyMultiplier += 0.01 * redArmy.aggressive;
                allCasualtyMultiplier += 0.005 * blueArmy.aggressive;

                redCasualtyMultiplier = 1;

                redCasualtyMultiplier -= 0.01 * redArmy.offense;
                redCasualtyMultiplier += 0.0125 * blueArmy.defense;
                redCasualtyMultiplier += 0.015 * difference;
                redCasualtyMultiplier *= allCasualtyMultiplier;
                redCasualtyMultiplier = redCasualtyMultiplier < 0.1 ? 0.1 : redCasualtyMultiplier;
                console.log("Red casualty multiplier (attacking) - " + redCasualtyMultiplier);

                blueCasualtyMultiplier = 1;

                blueCasualtyMultiplier -= 0.0125 * blueArmy.defense;
                blueCasualtyMultiplier += 0.01 * redArmy.offense;
                blueCasualtyMultiplier -= 0.0075 * difference;
                blueCasualtyMultiplier *= allCasualtyMultiplier;
                blueCasualtyMultiplier = blueCasualtyMultiplier < 0.1 ? 0.1 : blueCasualtyMultiplier;
                console.log("Blue casualty multiplier (defending) - " + blueCasualtyMultiplier);

                redCasualties = (0.1 * blueArmy.infantry) + (0.3 * blueArmy.cavalry) + (1.6 * blueArmy.artillery);

                redCasualties *= redCasualtyMultiplier;
                redCasualties = Math.round(redCasualties);
                console.log("Red suffered " + redCasualties + " casualties while attacking.");

                blueCasualties = (0.1 * redArmy.infantry) + (0.5 * redArmy.cavalry) + (1.6 * redArmy.artillery);

                blueCasualties = Math.round(blueCasualties);
                console.log("Blue suffered " + blueCasualties + " casualties while defending.");

                // Decrease army sizes with casualties
                blueRatio = blueCasualties / (blueArmy.infantry + (blueArmy.cavalry * 4) + (blueArmy.artillery * 16));
                redRatio = redCasualties / (redArmy.infantry + (redArmy.cavalry * 4) + (redArmy.artillery * 16));
                blueRatio = blueRatio > 1 ? 1 : blueRatio
                redRatio = redRatio > 1 ? 1 : redRatio
                console.log("RATIO: " + blueRatio + ", " + redRatio);

                blueArmy.infantry -= Math.round(blueArmy.infantry * blueRatio);
                blueArmy.cavalry -= Math.round(blueArmy.cavalry * blueRatio);
                blueArmy.artillery -= Math.round(blueArmy.artillery * blueRatio);

                redArmy.infantry -= Math.round(redArmy.infantry * redRatio);
                redArmy.cavalry -= Math.round(redArmy.cavalry * redRatio);
                redArmy.artillery -= Math.round(redArmy.artillery * redRatio);

                blueArmy.infantry = blueArmy.infantry < 0 ? 0 : blueArmy.infantry
                blueArmy.cavalry = blueArmy.cavalry < 0 ? 0 : blueArmy.cavalry
                blueArmy.artillery = blueArmy.artillery < 0 ? 0 : blueArmy.artillery

                redArmy.infantry = redArmy.infantry < 0 ? 0 : redArmy.infantry
                redArmy.cavalry = redArmy.cavalry < 0 ? 0 : redArmy.cavalry
                redArmy.artillery = redArmy.artillery < 0 ? 0 : redArmy.artillery

                console.log("Recalculating casualties based on inputted values (splitting among infantry, cavalry, and artillery)");
                console.log("Blue lost infantry: " + (originalBlueArmy.infantry - blueArmy.infantry));
                console.log("Blue lost cavalry: " + (originalBlueArmy.cavalry - blueArmy.cavalry));
                console.log("Blue lost artillery: " + (originalBlueArmy.artillery - blueArmy.artillery));
                console.log("------------------");
                console.log("Red lost infantry: " + (originalRedArmy.infantry - redArmy.infantry));
                console.log("Red lost cavalry: " + (originalRedArmy.cavalry - redArmy.cavalry));
                console.log("Red lost artillery: " + (originalRedArmy.artillery - redArmy.artillery));

                let blueTotalLostRatio = (originalBlueArmy.infantry - blueArmy.infantry) / originalBlueArmy.infantry
                let redTotalLostRatio = (originalRedArmy.infantry - redArmy.infantry) / originalRedArmy.infantry

                if (blueTotalLostRatio < redTotalLostRatio) {
                    console.log("Blue wins this engagement.")
                    blueVictories += 1;
                } else if (blueTotalLostRatio > redTotalLostRatio) {
                    console.log("Red wins this engagement.");
                    redVictories += 1;
                } else {
                    console.log("This engagement was a draw.");
                    draws += 1;
                }
            } else if (difference < 0) {
                // Higher Red Roll
                difference = Math.abs(difference);
                console.log("Difference is " + difference + ", in favor of Red. Red will attack first.");

                let allCasualtyMultiplier = 1;
                allCasualtyMultiplier += 0.01 * redArmy.aggressive;
                allCasualtyMultiplier += 0.005 * blueArmy.aggressive;

                let redCasualtyMultiplier = 1;
                redCasualtyMultiplier -= 0.01 * redArmy.offense;
                redCasualtyMultiplier += 0.0125 * blueArmy.defense;
                redCasualtyMultiplier -= 0.015 * difference;
                redCasualtyMultiplier *= allCasualtyMultiplier;
                redCasualtyMultiplier = redCasualtyMultiplier < 0.1 ? 0.1 : redCasualtyMultiplier;
                console.log("Red casualty multiplier (attacking) - " + redCasualtyMultiplier);

                let blueCasualtyMultiplier = 1;
                blueCasualtyMultiplier -= 0.0125 * blueArmy.defense;
                blueCasualtyMultiplier += 0.01 * redArmy.offense;
                blueCasualtyMultiplier += 0.0075 * difference;
                blueCasualtyMultiplier *= allCasualtyMultiplier;
                blueCasualtyMultiplier = blueCasualtyMultiplier < 0.1 ? 0.1 : blueCasualtyMultiplier;
                console.log("Blue casualty multiplier (defending) - " + blueCasualtyMultiplier);

                let redCasualties = (0.1 * blueArmy.infantry) + (0.3 * blueArmy.cavalry) + (1.6 * blueArmy.artillery);
                redCasualties *= redCasualtyMultiplier;
                redCasualties = Math.round(redCasualties);
                console.log("Red suffered " + redCasualties + " casualties while attacking.");

                let blueCasualties = (0.1 * redArmy.infantry) + (0.5 * redArmy.cavalry) + (1.6 * redArmy.artillery);
                blueCasualties = Math.round(blueCasualties);
                console.log("Blue suffered " + blueCasualties + " casualties while defending.");

                // Decrease army sizes with casualties
                let redRatio = redCasualties / (redArmy.infantry + (redArmy.cavalry * 4) + (redArmy.artillery * 16));
                let blueRatio = blueCasualties / (blueArmy.infantry + (blueArmy.cavalry * 4) + (blueArmy.artillery * 16));
                redRatio = redRatio > 1 ? 1 : redRatio
                blueRatio = blueRatio > 1 ? 1 : blueRatio
                console.log("RATIO: " + redRatio + ", " + blueRatio);

                redArmy.infantry -= Math.round(redArmy.infantry * redRatio);
                redArmy.cavalry -= Math.round(redArmy.cavalry * redRatio);
                redArmy.artillery -= Math.round(redArmy.artillery * redRatio);

                blueArmy.infantry -= Math.round(blueArmy.infantry * blueRatio);
                blueArmy.cavalry -= Math.round(blueArmy.cavalry * blueRatio);
                blueArmy.artillery -= Math.round(blueArmy.artillery * blueRatio);

                blueArmy.infantry = blueArmy.infantry < 0 ? 0 : blueArmy.infantry
                blueArmy.cavalry = blueArmy.cavalry < 0 ? 0 : blueArmy.cavalry
                blueArmy.artillery = blueArmy.artillery < 0 ? 0 : blueArmy.artillery

                redArmy.infantry = redArmy.infantry < 0 ? 0 : redArmy.infantry
                redArmy.cavalry = redArmy.cavalry < 0 ? 0 : redArmy.cavalry
                redArmy.artillery = redArmy.artillery < 0 ? 0 : redArmy.artillery

                // Blue counterattack
                console.log("Blue will now counterattack.");


                allCasualtyMultiplier = 1;

                allCasualtyMultiplier += 0.01 * blueArmy.aggressive;
                allCasualtyMultiplier += 0.005 * redArmy.aggressive;

                blueCasualtyMultiplier = 1;

                blueCasualtyMultiplier -= 0.01 * blueArmy.offense;
                blueCasualtyMultiplier += 0.0125 * redArmy.defense;
                blueCasualtyMultiplier += 0.015 * difference;
                blueCasualtyMultiplier *= allCasualtyMultiplier;
                blueCasualtyMultiplier = blueCasualtyMultiplier < 0.1 ? 0.1 : blueCasualtyMultiplier;
                console.log("Blue casualty multiplier (attacking) - " + blueCasualtyMultiplier);

                redCasualtyMultiplier = 1;

                redCasualtyMultiplier -= 0.0125 * redArmy.defense;
                redCasualtyMultiplier += 0.01 * blueArmy.offense;
                redCasualtyMultiplier -= 0.0075 * difference;
                redCasualtyMultiplier *= allCasualtyMultiplier;
                redCasualtyMultiplier = redCasualtyMultiplier < 0.1 ? 0.1 : redCasualtyMultiplier;
                console.log("Red casualty multiplier (defending) - " + redCasualtyMultiplier);

                blueCasualties = (0.1 * redArmy.infantry) + (0.3 * redArmy.cavalry) + (1.6 * redArmy.artillery);

                blueCasualties *= blueCasualtyMultiplier;
                blueCasualties = Math.round(blueCasualties);
                console.log("Blue suffered " + blueCasualties + " casualties while attacking.");

                redCasualties = (0.1 * blueArmy.infantry) + (0.5 * blueArmy.cavalry) + (1.6 * blueArmy.artillery);

                redCasualties = Math.round(redCasualties);
                console.log("Red suffered " + redCasualties + " casualties while defending.");

                // Decrease army sizes with casualties
                redRatio = redCasualties / (redArmy.infantry + (redArmy.cavalry * 4) + (redArmy.artillery * 16));
                blueRatio = blueCasualties / (blueArmy.infantry + (blueArmy.cavalry * 4) + (blueArmy.artillery * 16));
                redRatio = redRatio > 1 ? 1 : redRatio
                blueRatio = blueRatio > 1 ? 1 : blueRatio
                console.log("RATIO: " + redRatio + ", " + blueRatio);

                redArmy.infantry -= Math.round(redArmy.infantry * redRatio);
                redArmy.cavalry -= Math.round(redArmy.cavalry * redRatio);
                redArmy.artillery -= Math.round(redArmy.artillery * redRatio);

                blueArmy.infantry -= Math.round(blueArmy.infantry * blueRatio);
                blueArmy.cavalry -= Math.round(blueArmy.cavalry * blueRatio);
                blueArmy.artillery -= Math.round(blueArmy.artillery * blueRatio);

                blueArmy.infantry = blueArmy.infantry < 0 ? 0 : blueArmy.infantry
                blueArmy.cavalry = blueArmy.cavalry < 0 ? 0 : blueArmy.cavalry
                blueArmy.artillery = blueArmy.artillery < 0 ? 0 : blueArmy.artillery

                redArmy.infantry = redArmy.infantry < 0 ? 0 : redArmy.infantry
                redArmy.cavalry = redArmy.cavalry < 0 ? 0 : redArmy.cavalry
                redArmy.artillery = redArmy.artillery < 0 ? 0 : redArmy.artillery

                console.log("Recalculating casualties based on inputted values (splitting among infantry, cavalry, and artillery)");
                console.log("Red lost infantry: " + (originalRedArmy.infantry - redArmy.infantry));
                console.log("Red lost cavalry: " + (originalRedArmy.cavalry - redArmy.cavalry));
                console.log("Red lost artillery: " + (originalRedArmy.artillery - redArmy.artillery));
                console.log("------------------");
                console.log("Blue lost infantry: " + (originalBlueArmy.infantry - blueArmy.infantry));
                console.log("Blue lost cavalry: " + (originalBlueArmy.cavalry - blueArmy.cavalry));
                console.log("Blue lost artillery: " + (originalBlueArmy.artillery - blueArmy.artillery));

                let blueTotalLostRatio = (originalBlueArmy.infantry - blueArmy.infantry) / originalBlueArmy.infantry
                let redTotalLostRatio = (originalRedArmy.infantry - redArmy.infantry) / originalRedArmy.infantry

                if (blueTotalLostRatio < redTotalLostRatio) {
                    console.log("Blue wins this engagement.")
                    blueVictories += 1;
                } else if (blueTotalLostRatio > redTotalLostRatio) {
                    console.log("Red wins this engagement.");
                    redVictories += 1;
                } else {
                    console.log("This engagement was a draw.");
                    draws += 1;
                }
            } else {
                // Same Roll
                console.log("Roll is the same. The generals decided not to fight due to cautiousness. This engagement is a draw.");
                draws += 1;
            }

            blue[blueIndex] = JSON.parse(JSON.stringify(blueArmy));
            red[redIndex] = JSON.parse(JSON.stringify(redArmy));
            console.log("----------------------------------------");
        }

        console.log("Blue won " + blueVictories);
        console.log("Red won " + redVictories);
        console.log("Draws: " + draws);
        fighting = false;

        let totalBlueInfantryCasualties = 0;
        let totalBlueCavalryCasualties = 0;
        let totalBlueArtilleryCasualties = 0;

        let totalRedInfantryCasualties = 0;
        let totalRedCavalryCasualties = 0;
        let totalRedArtilleryCasualties = 0;

        let blueInfantryLeft = 0;
        let blueCavalryLeft = 0;
        let blueArtilleryLeft = 0;

        let redInfantryLeft = 0;
        let redCavalryLeft = 0;
        let redArtilleryLeft = 0;

        for (i in blueToCompare) {
            totalBlueInfantryCasualties += (blueToCompare[i].infantry - blue[i].infantry);
            blueInfantryLeft += (blueToCompare[i].infantry - (blueToCompare[i].infantry - blue[i].infantry));
            totalBlueCavalryCasualties += (blueToCompare[i].cavalry - blue[i].cavalry);
            blueCavalryLeft += (blueToCompare[i].cavalry - (blueToCompare[i].cavalry - blue[i].cavalry));
            totalBlueArtilleryCasualties += (blueToCompare[i].artillery - blue[i].artillery);
            blueArtilleryLeft += (blueToCompare[i].artillery - (blueToCompare[i].artillery - blue[i].artillery));
        }

        for (i in redToCompare) {
            totalRedInfantryCasualties += (redToCompare[i].infantry - red[i].infantry);
            redInfantryLeft += (redToCompare[i].infantry - (redToCompare[i].infantry - red[i].infantry));
            totalRedCavalryCasualties += (redToCompare[i].cavalry - red[i].cavalry);
            redCavalryLeft += (redToCompare[i].cavalry - (redToCompare[i].cavalry - red[i].cavalry));
            totalRedArtilleryCasualties += (redToCompare[i].artillery - red[i].artillery);
            redArtilleryLeft += (redToCompare[i].artillery - (redToCompare[i].artillery - red[i].artillery));
        }

        let resultDiv = document.getElementById("results");
        resultDiv.innerHTML = "<p>RESULTS:</p>";

        if (blueVictories > redVictories) {
            resultDiv.innerHTML += `<p>Winner: <span class="blueText">Blue</span></p>`;
        } else if (redVictories > blueVictories) {
            resultDiv.innerHTML += `<p>Winner: <span class="redText">Red</span></p>`;
        } else {
            resultDiv.innerHTML += `<p>Winner: <span class="grayText">Inconclusive</span></p>`;
        }

        resultDiv.innerHTML += `<p>Engagements: <span class="blueText">${blueVictories}</span> - <span class="redText">${redVictories}</span>${draws > 0 ? ` (Draws: <span class="grayText">${draws}</span>)` : ``}</p>`;
        resultDiv.innerHTML += `<br><p>Casualties:</p>`
        resultDiv.innerHTML += `<p>Infantry: <span class="blueText">${totalBlueInfantryCasualties}</span> - <span class="redText">${totalRedInfantryCasualties}</span></p>`;
        resultDiv.innerHTML += `<p>Cavalry: <span class="blueText">${totalBlueCavalryCasualties}</span> - <span class="redText">${totalRedCavalryCasualties}</span></p>`;
        resultDiv.innerHTML += `<p>Artillery: <span class="blueText">${totalBlueArtilleryCasualties}</span> - <span class="redText">${totalRedArtilleryCasualties}</span></p>`;
        resultDiv.innerHTML += `<br><p>Remaining:</p>`
        resultDiv.innerHTML += `<p>Infantry: <span class="blueText">${blueInfantryLeft}</span> - <span class="redText">${redInfantryLeft}</span></p>`;
        resultDiv.innerHTML += `<p>Cavalry: <span class="blueText">${blueCavalryLeft}</span> - <span class="redText">${redCavalryLeft}</span></p>`;
        resultDiv.innerHTML += `<p>Artillery: <span class="blueText">${blueArtilleryLeft}</span> - <span class="redText">${redArtilleryLeft}</span></p>`;
    }
}

function roll(highest) {
    return Math.ceil(Math.random() * highest);
}

function randomUUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}