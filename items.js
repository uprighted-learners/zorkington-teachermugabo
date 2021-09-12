const _ = require("underscore");
const { produceInventory } = require("./locations");

// =================== Other Helper Methods  ====================
/**
 * Helper method to create a random shopping list from inventory
 * @param {Array} inventory
 * @param {Number} listLength
 * @returns shopping list of requested length
 */
let createShoppingList = (inventory, listLength) =>
  _.take(_.shuffle(inventory), listLength);

// =============== Item Class & Interface methods Definition ===========
class Item {
  constructor(name, description = "", contents = [], takeable = false) {
    this.name = name;
    this.description = description;
    this.contents = contents;
    this.takeable = takeable;
  }
}

// main entrance doors
let doors = new Item(
  "main entrance doors",
  "Welcome to hannafords! These are our doors. Please leave them where they are.",
  [],
  false
);

// this will be the cart the user takes & uses to shop
let smallCart = new Item(
  "small cart",
  "This is your shopping cart - good side for what you need",
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
  "This is your shopping list.",
  // creates random 5 item list from our product inventory
  createShoppingList(produceInventory, 5),
  true
);

// cash register at checkout -- there's money here
let cashRegister = new Item(
  "cash register",
  "Storage for Hannaford's $$$$. It's not for you.",
  [1, 1, 5, 5, 5, 5, 50, 50, 100, 100, 500, 500, 2000],
  false
);

// Items lookup table - populated with ALL items in the environment
// that users to interact with.
const itemsLookupTable = {
  doors: doors,
  "main entrance doors": doors,
  "big doors": doors,
  "small cart": smallCart,
  "large cart": bigCart,
  "big cart": bigCart,
  cart: smallCart,
  "shopping list": shoppingList,
  list: shoppingList,
  "cash register": cashRegister,
  register: cashRegister,
};

// ===============   Items Interace Methods    ==================
// -- these are helper methods to work with items of the game ---

const isItem = (target) => Object.keys(itemsLookupTable).includes(target);
const isProduce = (target) => produceInventory.includes(target);

const throwNotItemError = () => {
  throw `${target} is not an instance of class Item`;
};

const getItem = (target) =>
  isItem(target) ? itemsLookupTable[target] : throwNotItemError();

const getItemName = (target) =>
  isItem(target) ? itemsLookupTable[target].name : throwNotItemError();

// ? Implement getItemsContent so that cart and shopping list display theirs.
const getItemDescription = (target) =>
  isItem(target) ? itemsLookupTable[target].description : throwNotItemError();

const isItemTakeable = (target) =>
  isItem(target) ? itemsLookupTable[target].takeable : throwNotItemError();

module.exports = {
  isItem,
  isProduce,
  getItem,
  getItemName,
  getItemDescription,
  isItemTakeable,
};
