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
  getLocation,
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

class Item {
  constructor(name, description = "", contents = [], takeable = false) {
    this.name = name;
    this.contents = contents;
    this.takeable = takeable;
  }
}

// this will be the cart the user takes & uses to shop
let smallCart = new Item(
  "small cart",
  "This is your shopping cart - good side for what we need",
  [],
  true
);
let bigCart = new Item(
  "big cart",
  "This is a jumbo shopping cart. Seems to be tied & locked with the rest.",
  [],
  false
);

// shopping list with user's items to buy before they can leave :-)
let shoppingList = new Item(
  "shopping list",
  "This is your shopping list - chop! chop!",
  // creates random 5 item list from our product inventory
  createShoppingList(produceInventory, 5),
  true
);

// cash register at checkout -- there's money here
let cashRegister = new Item(
  "cash register",
  "Storage for Hannaford's $$$$",
  [1, 1, 5, 5, 5, 5, 50, 50, 100, 100, 500, 500, 2000],
  false
);

// Items lookup table
const itemsLookupTable = {
  "small cart": smallCart,
  cart: smallCart,
  "big cart": bigCart,
  "shopping list": shoppingList,
  list: shoppingList,
  "cash register": cashRegister,
  register: cashRegister,
};

// Items Interace -- helper methods to work with items of the game
// * refactor opportunity: extract to & export from items.js
const isItem = (target) => Object.keys(itemsLookupTable).includes(target);
const throwNotItemError = () => {
  throw `${target} is not an instance of class Item`;
};

const getItem = (target) =>
  isItem(target) ? itemsLookupTable[target] : throwNotItemError();

const getItemName = (target) =>
  isItem(target) ? itemsLookupTable[target].name : throwNotItemError();

const getItemDescription = (target) =>
  isItem(target) ? itemsLookupTable[target].description : throwNotItemError();

const isItemAvailable = (location, item) => getLocation(location).has(item);

const isItemTakeable = (target) =>
  isItem(target) ? itemsLookupTable[target].takeable : throwNotItemError();

const isProduce = (target) => produceInventory.includes(target);

// create player with allowable actions, and cart
let player = {
  // set player's current location
  name: "Bob",
  currentLocation: "main entrance",
  // allowed actions
  // * possible future extension: forward, back, left, right
  actions: ["go", "go to", "take", "examine", "return", "pay", "leave", "look"],
  shoppingList: null,
  cart: null,
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
  // examine an item (non-produce) item
  if (isItem(target)) console.log(getItemDescription(target));
  else if (isProduce(target))
    console.log(`That vegetable looks fine. Or is it a fruit? Who cares.`);
  else console.log(`Hmmm...not much there really. Keep it moving.`);
};

/**
 * take - game logic method - encapsulates user interaction with
 * their environment. In particular, taking items.
 *
 * @param {String} target
 */
const take = (target) => {
  // is this a non-produce item in the game?
  if (isItem(target)) {
    // ! delete:
    console.debug(`!Yes, ${target} is an item`);

    // special cases: carts and shopping list, once you have them, they travel
    if (
      getItemName(target) === "shopping list" &&
      player.shoppingList != null
    ) {
      // show what's here
      console.log(
        `Here's what you need to get: `,
        player.shoppingList.contents
      );
      return;
    }

    // special case: same as shopping list -- cart travels once gotten.
    if (getItemName(target) === "small cart" && player.cart != null) {
      // show what's in the cart
      console.log(`Here's what you got in your cart`, player.cart.contents);
      return;
    }

    //  make sure the item available in current location
    if (!isItemAvailable(player.currentLocation, getItemName(target))) {
      // !delete
      console.debug(
        `!Nope, there is no ${target} here at ${player.currentLocation}`
      );
      console.log(`Sorry shopper, ${target} isn't available here.`);
      return;
    }
    // make sure is is also 'takeable'
    if (!isItemTakeable(target)) {
      console.debug(`!No, ${target} is not a takeable them`);
      console.log(
        `Hmm, unfortunately ${target} is not for sale. Go get yee some produce!`
      );
      return;
    }

    // players gets the shopping list
    if (getItemName(target) === "shopping list") {
      player.shoppingList = getItem(target);
      console.log(
        `Awesome!  Here's what you need to get: `,
        player.shoppingList.contents
      );
      return;
    }

    // player gets cart
    if (getItemName(target) == "small cart") {
      player.cart = getItem(target);
      console.log(`You got yourself a small cart -- now let's get shopping!`);
      return;
    }
  }
  // is it a produce item?
  else if (isProduce(target)) {
    console.debug(`!Yes, ${target} is a produce item.`);
    // check that we have a cart first - send them to get it if they dont.
    if (!player.cart) {
      console.log(`Nope. Gotta go get a cart first.`);
      return;
    }
    // make sure the item is present here - in current location
    else if (!isItemAvailable(player.currentLocation, target)) {
      console.log(
        `Not sure we have ${target} here. Don't be discouraged though. It's a big store!`
      );
      return;
    }
    // Yay! now add produce to cart
    else {
      console.log(`Good call! ${target} now in your cart.`);
      player.cart.contents.push(target);
    }
  }
  // is the user simply taking inventory?
  else if (target == "inventory") {
    console.log(`Here's what you got so far:`, player.cart.contents);
    // ? is this same as examine("cart")
  }
  // nothing else is takeable
  else {
    console.debug(`!No known item matched '${target}'`);
    console.log(
      `Hmmm, look closer. Where do you see ${target} in this ${player.currentLocation}?`
    );
  }
};

/**
 * drop - game logic method - allow user to drop an item.
 *
 * @param {String} item
 */
const drop = (item) => {
  // TODO implement drop(target)
  // TODO #4 if "drop" expect target = [item], check
  console.log(
    `Shopper, you're playing the basic version. I'm afraid you're stuck with ${item}.`
  );
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
        "You can go to [place], take [item], examine [item], drop [item], etc... Plz, try again."
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
