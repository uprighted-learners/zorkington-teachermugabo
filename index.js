const _ = require("underscore");
const ask = require("./scripts/ask");
const { locationLookUpTable, produceInventory } = require("./locations");

// TODO add items
// items - these will simply be shopping list, cart (could extend to cash register)
// TODO - what items will be untakable?
class Item {
  constructor(
    name,
    description = "",
    contents = [],
    available = false,
    takeable = false
  ) {
    this.name = name;
    this.contents = contents;
    this.available = available;
    this.takeable = takeable;
  }
}

// TODO next
//  create items (use locations descriptions & pictures)
//  decide on properties of the items -- takeable and such

/**
 * Helper method to create a random shopping list from inventory
 * @param {Array} inventory
 * @param {Number} listLength
 * @returns shopping list of requested length
 */
let createShoppingList = (inventory, listLength) =>
  _.take(_.shuffle(inventory), listLength);

// create random 5 item list from our inventory
let shoppingList = createShoppingList(produceInventory, 5);
// console.log(shoppingList) -> five random items to shop for.

// create player with allowable actions, and cart
let player = {
  // set player's current location
  name: "Bob",
  currentLocation: "main entrance",
  // allowed actions
  // possible future extension: forward, back, left, right
  actions: ["go", "go to", "take", "return", "pay", "leave", "look"],
  cart: [],
  hasReceipt: false,
};

// ================== HELPER METHODS & GAME FUNCTIONALITY =================

const processUserInput = (input) => {
  let action = "",
    target = ""; // init variables

  // TODO replace this logic with user input lookupTable
  action = input[0]; // first word
  // add ability to process "go to" as well as just "go"
  if (action === "go" && input[1] === "to") {
    action = "go to";
    target = input.slice(2).join(" "); // the rest
  }
  // if action is not "go to", expect single word for command
  else {
    target = input.slice(1).join(" "); // the rest
  }

  return { action, target };
};

/**
 * start()
 * =======
 * Main game loop - recursively called to loop. Exits with 'leave'
 */
async function start() {
  // user prompt
  const prompt = "\n\nWhat to do next? >_";
  let answer = await ask(prompt);

  // quick & dirty sanitizing
  let inputArray = answer.trim().toLowerCase().split(" ");

  // extract desired action and object of the action from input
  let { action, target } = processUserInput(inputArray);

  // execute user's wishes
  // if action isn't known, let user know
  if (!player.actions.includes(action)) {
    console.log(
      "Dear Shopper. You're limited to a few commands. \n" +
        "You can go to [place], take [item], drop [item], etc... Plz, try again."
    );
  }
  // if action is known, let user know as well
  else {
    console.log(`Ah, so you want want to ${action} ${target}.`);

    // if look - assume "look around" - get current place's location & look out!
    if (action === "look") {
      // TODO explore using text wrapping - currently using `` and formatting as desired.
      // https://stackoverflow.com/questions/14484787/wrap-text-in-javascript
      console.log(locationLookUpTable[player.currentLocation].lookAround());
    }
    // ===     logic to move b/t locations ===== //
    // if "go", expect/check target is location,
    else if (action === "go to" || action === "go") {
      // check/handle if valid location
      if (Object.keys(locationLookUpTable).includes(target)) {
        // TODO exract this tof goTo(target)
        // check/handle if allowed transition
        // TODO story -- when leaving main entrance to cart room, main entrance locks!
        //               can't leave w/o the shopping list fully checked off!
        // TODO story -- when shopper returns to main entrance w/ everything, unlock it!

        // valid location
        if (locationLookUpTable[player.currentLocation].canGo(target)) {
          console.log(
            `Good guess! You left ${player.currentLocation} and are now in ${target}`
          );
          player.currentLocation = target;
        }
        // invalid location
        else {
          console.log(
            `Can't go from ${player.currentLocation} to ${target}. Clues, shopper, clues.`
          );
        }
      } else {
        // wrong location -- help user with location
        console.log(
          `Hmmm, don't know ${target}. Look around! Clues, shopper, clues.`
        );
      }
    }
    // examine shopping list & cart
    else if (action == "examine") {
      // TODO extract to examineItem(target)
      // examine produce (examine tomato)
      // non-produce items  -- shopping list, cart, inventory
      if (target === "shopping list") {
        console.log(`Awesome! Here's what you need to get: `, shoppingList);
      } else if (target == "cart") {
        console.log(`Here's what you got in your cart: `, player.cart);
      }
    }
    // TODO #3 implement "take" actions, expect take [item]
    else if (action == "take") {
      // TODO extract to take(target)
      // take produce item (.e.g tomatoes, raspberry) -- simply add these to player's cart
      // potential issue: what if they type 'raspberry' instead of raspberries? or 2 apples?

      // take non-produce items (e.g. shopping list, cart, inventory
      // some of these will be same as examine...
      if (target === "shopping list") {
        console.log(`Awesome! Here's what you need to get: `, shoppingList);
      } else if (target == "cart") {
        console.log(`You got yourself a cart -- now let's get shopping!`);
      }
      // TODO #3b add take inventory (as item) => list what user has
      else if (target == "inventory") {
        console.log(`Here's what you got so far:`, player.cart);
      } else {
      }

      // taking a produce item
    }
    // TODO #4 if "drop" expect target = [item], check
    else if (action === "drop") {
      // TODO implement drop(target)
    }
    // TODO #5 if "pay", say thanks - you're all set
    else if (action === "pay")
      console.log(
        `
      Thanks for the cashless exchange! You're all set.
      You can leave now. You remember where you came from, don't you?`
      );
    // if "leave" say bye
    else if (action === "leave") {
      // TODO - Have they opened the main entrance?
      //        If not, give them a hard time and then release them.

      console.log("bye");
      process.exit(0);
    }
  }

  start();
}

// ======================= STARTING THE GAME ==============================

// Set up game -- describe current location for the user
console.log(locationLookUpTable[player.currentLocation].getDescription());

// let the games begin!
start();
