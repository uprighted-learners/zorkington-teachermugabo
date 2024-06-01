const ask = require("./scripts/ask");
const {
  isValidLocation,
  isValidNextLocation,
  getOfficialLocationName,
  getLocationDescription,
  isItemHere,
} = require("./locations");

const {
  isItem,
  isProduce,
  getItem,
  getItemName,
  getItemDescription,
  isItemTakeable,
} = require("./items");

let player = require("./player");

/**
 * Does initial cleaning of user input (user request).
 * Particularly helping with accomodating "go" and "go to"
 * when the general user request pattern is "[action] [target]"
 * where both action and target are atomic.
 */
const preprocessUserInput = (rawInput) => {
  let action = "", target = "";

  let inputArray = rawInput.trim().toLowerCase().split(" ");
  action = inputArray[0];

  if (action === "i") {
    action = "take";
    target = "inventory";
  } else if (action === "q") {
    action = "quit";
  } else if (action === "go" && inputArray[1] === "to") {
    action = "go to";
    target = inputArray.slice(2).join(" "); // the rest
  } else {
    if (action === "go") action = "go to";
    target = inputArray.slice(1).join(" ");
  }

  return { action, target };
};

const lookAround = (location) => {
  console.log(getLocationDescription(player.currentLocation));
};


/** ======================== GAME LOGIC ========================== */

const isValidPlayerAction = (action) => player.actions.includes(action);

/** handles movements in the game. */
const goTo = (target) => {
  if (isValidLocation(target)) {
    if (isValidNextLocation(player.currentLocation, target)) {
      target = getOfficialLocationName(target);
      console.log(
        `You've left ${player.currentLocation} and are now in ${target}`
      );
      player.currentLocation = target;
    } else {
      console.log(
        `Can't go from ${player.currentLocation} to ${target}. Clues, shopper, clues.`
      );
    }
  } else {
    console.log(
      `Hmmm, don't know ${target}. Look around! Clues, shopper, clues.`
    );
  }
};

/** examine - game logic method - encapsulates user
 * exploration of items in their environment. */
const examine = (target) => {
  if (isItem(target)) {
    if (getItemName(target) === "small cart") {
      if (player.hasCart()) {
        console.log(`Here's what you got in your cart:`, player.cart.contents);
      }
      else {
        console.log(`Hey, you'll need to get a ${target} first.`);
      }
    }
    else if (getItemName(target) == "shopping list") {
      if (player.hasList()) {
        console.log(
          `Here's what you need to get: `,
          player.shoppingList.contents
        );
      }
      else {
        console.log(`Hey, you'll need a ${target} first.`);
      }
    }
    else {
      if (isItemHere(player.currentLocation, target)) {
        console.log(getItemDescription(target));
      }
      else {
        console.log(
          `Where are you seeing this ${target}? Not here! Clues, shopper, clues!`
        );
      }
    }
  }
  else if (isProduce(target)) {
    console.log(`That vegetable looks fine. Or is it a fruit? Who cares.`);
  }
  else {
    console.log(`Hmmm...not much there really. Keep it moving.`);
  }
};

/** game logic method - encapsulates user interaction with
 * their environment. In particular, taking items. */
const take = (target) => {
  if (isItem(target)) {
    if (getItemName(target) === "shopping list" && player.hasList()) {
      examine(target);
      return;
    }

    if (getItemName(target) === "small cart" && player.hasCart()) {
      // show what's in the cart
      examine(target);
      return;
    }


    if (!isItemHere(player.currentLocation, getItemName(target))) {
      console.log(`Sorry shopper, ${target} isn't available here.`);
      return;
    }
    if (!isItemTakeable(target)) {
      // console.debug(`!No, ${target} is not a takeable them`);
      console.log(getItemDescription(target));
      return;
    }

    if (getItemName(target) === "shopping list") {
      player.shoppingList = getItem(target);
      console.log(
        `Awesome!  Here's what you need to get: `,
        player.shoppingList.contents
      );
      return;
    }

    if (getItemName(target) == "small cart") {
      player.cart = getItem(target);
      console.log(`You got yourself a small cart -- now let's get shopping!`);
      return;
    }
  }

  else if (isProduce(target)) {
    // console.debug(`!Yes, ${target} is a produce item.`);
    if (!player.cart) {
      console.log(`Nope. Gotta go get a cart first.`);
      return;
    }
    else if (!isItemHere(player.currentLocation, target)) {
      console.log(
        `Not sure we have ${target} here. Don't be discouraged though. It's a big store!`
      );
      return;
    }
    else {
      console.log(`Good call! ${target} now in your cart.`);
      player.cart.add(target);
    }
  }
  else if (target == "inventory") {
    console.log(`Here's what you got so far:`, player.cart.contents);
  }
  else {
    // console.debug(`!No known item matched '${target}'`);
    console.log(
      `Hmmm, look closer. Where do you see ${target} in this ${player.currentLocation}?`
    );
  }
};

/** game logic method - allow user to drop an item. */
const drop = (target) => {
  try {
    if (
      isItem(target) &&
      getItemName(target) === "shopping list" &&
      player.hasList()
    ) {
      delete player.shoppingList;
      console.log(`Dropping your ${target}...`);
    }
    else if (
      isItem(target) &&
      getItemName(target) === "small cart" &&
      player.hasCart()
    ) {
      delete player.cart;
      console.log(`Dropping your ${target}...`);
    }
    else if (isProduce(target) & player.cart.has(target)) {
      let result = player.cart.removeFromContents(target);
      if (result === false) {
        console.log(`Strange, not finding ${target}...`);
      }
    }
    else {
      console.log(`Can't drop what you don't have, Shopper. Keep it moving.`);
    }
  } catch (err) {
    console.log(`Our systems is having issues. Couldn't do what you asked.`);
    console.log(`Call helpdesk with this error: ${err}.`);
  }
};

/**
 * user logic method - allow user to pay and guide
 * them back to the exit (with a few clues)
 * ? what variables must we set to mark payment
 * ? is there anything we need to check? Like shopping list?
 * ? Is this where we set a flag to mark that they've gotten everything?
 */
const pay = () => {
  // player must be at checkout
  if (player.currentLocation != "checkout") {
    console.log(
      `Gonna first have to make your way to checkout. Look around...`
    );
  }
  // must have a cart and a shopping list
  else if (!player.hasCart() || !player.hasList()) {
    console.log(`You're not ready...`);
  }
  // alright, let's see if the player is actually done
  else {
    // make sure shopping list is fully checked off
    let missingItems = player.shoppingList.contents.filter(
      (item) => !player.cart.has(item)
    );
    if (missingItems.length != 0) {
      console.log(`Looks like you still missing: ${missingItems}`);
    }
    // success!
    else {
      // this is the player's ticket out!
      player.hasReceipt = true;

      // thank player
      console.log(
        `
          Thanks for the cashless exchange! You're all set.
          Looks like you found all items on your shopping list.
          You can leave now. You'll need to trace your way back to
          the main entrance. You remember how you got here, don't you?`
      );
    }
  }
};

/** Main game loop (recursive) that encompass
 * all game logic. Exits with 'leave' */
async function start() {
  let answer = await ask("\n\nWhat to do next? (q to quit)>_");
  let { action, target } = preprocessUserInput(answer);

  if (!isValidPlayerAction(action)) {
    console.log(
      "Dear Shopper. You're limited to a few commands. \n" +
        "You can go to [place], take [item], examine [item], drop [item], etc... Plz, try again."
    );
  }
  else {
    if (action === "look") lookAround(player.currentLocation);
    else if (action === "go to") goTo(target);
    else if (action === "examine") examine(target);
    else if (action === "take") take(target);
    else if (action === "get") take(target);
    else if (action === "drop") drop(target);
    else if (action === "pay") pay();
    else if (action === "quit") {
      console.log(
        `So you're just gonna quit? Just like that? Too bad. Better luck next time. `
      );
      process.exit(0);
    }
    else if (action === "leave") {
      if (player.currentLocation != "main entrance") {
        console.log(
          `You're gonna have to first make your way to the main entrance. Hint: follow the way you came.`
        );
      }
      else if (!player.hasReceipt) {
        console.log(`You'll need a receipt to leave. Did you pay at checkout?`);
      }
      else {
        console.log("Thank you for all you do! Bye for now <3");
        process.exit(0);
      }
    }
  }
  await start();
}

// Kick off the game
(() => {
  console.log(getLocationDescription(player.currentLocation));
  start();
})()
