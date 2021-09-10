/** FILE ORGANIZATION
 *  0) IMPORTS
 *  1) HELPER METHODS
 *  2) GAME SETUP
 *  3) GAME LOGIC
 *  4) EXECUTION (calls game logic)
 */

const _ = require("underscore");
const ask = require("./scripts/ask");
const {
  produceInventory,
  isValidLocation,
  isValidNextLocation,
  getOfficialLocationName,
  getLocationDescription,
} = require("./locations");

/** ======================== HELPER METHODS ========================== */

/**
 * Helper method to create a random shopping list from inventory
 * @param {Array} inventory
 * @param {Number} listLength
 * @returns shopping list of requested length
 */
let createShoppingList = (inventory, listLength) =>
  _.take(_.shuffle(inventory), listLength);

/**
 * Name: preprocessUserInput
 *
 * Does initial cleaning of user input (user request).
 * Particularly helping with accomodating "go" and "go to"
 * when the general user request pattern is "[action] [target]"
 * where both action and target are atomic.
 *
 * @param {String} input
 * @returns {{String, String}} action and target object
 */
const preprocessUserInput = (rawInput) => {
  let action = "",
    target = ""; // init variables

  // quick & dirty sanitizing
  let inputArray = rawInput.trim().toLowerCase().split(" ");

  // ? Refactoring opportunity: replace this logic with user input lookupTable

  // grab action (first work)
  action = inputArray[0];

  // add ability to process "go to"
  if (action === "go" && inputArray[1] === "to") {
    action = "go to";
    target = inputArray.slice(2).join(" "); // the rest
  }
  // if action is not "go to", expect single word for command
  else {
    // if action is simply "go", mapping it to "go to"
    if (action === "go") action = "go to";

    // with a single word for action, the rest = target/object
    target = inputArray.slice(1).join(" ");
  }

  return { action, target };
};

/**
 * lookAround - helper method to encapsulate examining a location.
 * Simply prints out to console.
 *
 * @param {String} location
 */
const lookAround = (location) => {
  console.log(getLocationDescription(player.currentLocation));
};

/** ======================== GAME SETUP ========================== */

// TODO add items
// items - these will simply be shopping list, cart, cash register

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

// this will be the cart the user takes & uses to shop
let cart = new Item("cart", "This is your shopping cart", [], true, true);

// shopping list with user's items to buy before they can leave :-)
let shoppingList = new Item(
  "shopping list",
  "This is your shopping list - chop! chop!",
  // creates random 5 item list from our product inventory
  createShoppingList(produceInventory, 5),
  true,
  true
);

// cash available to user at the entrance with the shopping list
let cash = new Item(
  "cash money",
  "This is the amount you have to purchase produce for your client",
  // made contents $$ bills :-)
  [5, 5, 10],
  true,
  true
);

// create player with allowable actions, and cart
let player = {
  // set player's current location
  name: "Bob",
  currentLocation: "main entrance",
  // allowed actions
  // possible future extension: forward, back, left, right
  actions: ["go", "go to", "take", "return", "pay", "leave", "look"],
  shoppingList: null,
  cart: cartItem,
  hasReceipt: false,
};

/** ======================== GAME LOGIC ========================== */

/**
 * isValidPlayerAction - predicate  method that validates user actions
 *
 * @param {String} action
 * @returns {Boolean}
 */
const isValidPlayerAction = (action) => player.actions.includes(action);

/**
 * goTo - game logic method - handles movements in the game.
 *
 * @param {String} target - next location
 */
const goTo = (target) => {
  // check #1 - is this target a valid location
  // check/handle if valid location - use friendly map to allow
  // for many names for the same location :-)
  if (isValidLocation(target)) {
    // check/handle if allowed transition
    // TODO story -- when leaving main entrance to cart room, main entrance locks!
    //               can't leave w/o the shopping list fully checked off!
    // TODO story -- when shopper returns to main entrance w/ everything, unlock it!

    // check #2 - is this target a valid next location? Is it adjacent to current location?
    // valid location
    if (isValidNextLocation(player.currentLocation, target)) {
      // rename target to use our internal name for that location
      target = getOfficialLocationName(target);

      // let user know where they are -- they just changed locations
      console.log(
        `Good guess! You left ${player.currentLocation} and are now in ${target}`
      );

      // set current location to the new place
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
};

/**
 * examine - game logic method - encapsulates user exploration
 * of items in their environment.
 *
 * @param {String} target
 */
const examine = (target) => {
  // examine produce (examine tomato)
  // non-produce items  -- shopping list, cart, inventory
  // what else might they try to examine?
  if (target === "shopping list") {
    console.log(`Awesome! Here's what you need to get: `, shoppingList);
  } else if (target == "cart") {
    console.log(`Here's what you got in your cart: `, player.cart);
  }
};

/**
 * take - game logic method - encapsulates user interaction with
 * their environment. In particular, taking items.
 *
 * @param {String} item
 */
const take = (item) => {
  // TODO #3 implement "take" actions, expect take [item]
  // take produce item (.e.g tomatoes, raspberry) -- simply add these to player's cart
  // potential issue: what if they type 'raspberry' instead of raspberries? or 2 apples?

  // take non-produce items (e.g. shopping list, cart, inventory
  // some of these will be same as examine...
  if (item === "shopping list") {
    console.log(`Awesome! Here's what you need to get: `, shoppingList);
  } else if (item == "cart") {
    console.log(`You got yourself a cart -- now let's get shopping!`);
  }
  // TODO #3b add take inventory (as item) => list what user has
  else if (item == "inventory") {
    console.log(`Here's what you got so far:`, player.cart);
  } else {
  }

  // taking a produce item
  // what should happen there? what to do?!
  // take tomatoes
  // take tomato
  // take grapes
  // if in inventory -- we can say, hey, lookie here, produce!
};

/**
 * drop - game logic method - allow user to drop an item.
 *
 * @param {String} item
 */
const drop = (item) => {
  // TODO implement drop(target)
  // TODO #4 if "drop" expect target = [item], check
};

/**
 * pay - user logic method - allow user to pay and guide
 * them back to the exit (with a few clues)
 * ? what variables must we set to mark payment
 * ? is there anything we need to check? Like shopping list?
 * ? Is this where we set a flag to mark that they've gotten everything?
 */
const pay = () => {
  console.log(
    `
      Thanks for the cashless exchange! You're all set.
      You can leave now. You remember where you came from, don't you?`
  );
};

/**
 * start()
 * =======
 * Main game loop (recursive) that encompass all game logic
 * Exits with 'leave'
 */
async function start() {
  // prompt user
  let answer = await ask("\n\nWhat to do next? >_");

  // extract desired action and object of the action from input
  let { action, target } = preprocessUserInput(answer);

  // execute user's wishes
  // if action isn't known, let user know
  if (!isValidPlayerAction(action)) {
    console.log(
      "Dear Shopper. You're limited to a few commands. \n" +
        "You can go to [place], take [item], drop [item], etc... Plz, try again."
    );
  }
  // if action is known, let user know as well & try to accomodate their request
  else {
    console.log(`Ah, so you want want to ${action} ${target}.`);

    // =============== CORE GAME LOGIC =================
    // user looks around (from current location)
    if (action === "look") lookAround(player.currentLocation);
    // user attempts to move to neighboring location
    else if (action === "go to") goTo(target);
    // user examines an object
    else if (action == "examine") examine(target);
    // user takes an item
    else if (action == "take") take(target);
    // user drops an item from their inventory (i.e. cart)
    else if (action === "drop") drop(target);
    // user wants to pay!
    else if (action === "pay") pay();
    // user wants to exit - say thanks & bye
    else if (action === "leave") {
      // TODO - Have they opened the main entrance?
      //        If not, give them a hard time and then release them.

      console.log("Thanks for playing! Bye for now <3");
      process.exit(0);
    }
  }

  // loop -- till game is a success and/or user leaves
  await start();
}

// ======================= START THE GAME ==============================

// To start the game, describe current location for the user
console.log(getLocationDescription(player.currentLocation));

// let the games begin!
start();
