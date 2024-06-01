const _ = require("underscore");
const { produceInventory } = require("./locations");

const createRandomShoppingList = (inventory, listLength) =>
  _.take(_.shuffle(inventory), listLength);

class Item {
  constructor(name, description = "", contents = [], takeable = false) {
    this.name = name;
    this.description = description;
    this.contents = contents;
    this.takeable = takeable;
  }

  add(target) {
    this.contents.push(target);
  }

  remove(target) {
    const index = this.contents.indexOf(target);
    if (index === -1) {
      return false;
    }

    const dropped = this.contents.splice(index, 1);
    console.debug(`Dropping ${dropped} from ${this.name}`);
    return true;
  }
}

const mainEntranceDoors = new Item(
  "main entrance doors",
  "Welcome to hannafords! These are our doors. Please leave them where they are.",
  [],
  false
);
const smallCart = new Item(
  "small cart",
  "This is your shopping cart - good side for what you need",
  [],
  true
);
const bigCart = new Item(
  "big cart",
  "This is a jumbo shopping cart. Seems to be tied & locked with the rest.",
  [],
  false
);
const shoppingList = new Item(
  "shopping list",
  "This is your shopping list.",
  createRandomShoppingList(produceInventory, 5),
  true
);

const cashRegister = new Item(
  "cash register",
  "Storage for Hannaford's $$$$. It's not for you.",
  [1, 1, 5, 5, 5, 5, 50, 50, 100, 100, 500, 500, 2000],
  false
);

const itemsLookupTable = {
  doors: mainEntranceDoors,
  "main entrance doors": mainEntranceDoors,
  "big doors": mainEntranceDoors,
  "small cart": smallCart,
  "large cart": bigCart,
  "big cart": bigCart,
  cart: smallCart,
  "shopping list": shoppingList,
  list: shoppingList,
  "cash register": cashRegister,
  register: cashRegister,
};

const isProduceItem = (target) => produceInventory.includes(target);

const isGameItem = (target) => Object.keys(itemsLookupTable).includes(target);

const throwNotItemError = (target) => {
  throw `${target} is not an instance of class Item`;
};

const getGameItem = (target) =>
  isGameItem(target) ? itemsLookupTable[target] : throwNotItemError(target);

const getGameItemName = (target) =>
  isGameItem(target) ? itemsLookupTable[target].name : throwNotItemError(target);

const getItemDescription = (target) =>
  isGameItem(target)
    ? itemsLookupTable[target].description
    : throwNotItemError(target);

const isItemTakeable = (target) =>
  isGameItem(target)
    ? itemsLookupTable[target].takeable
    : throwNotItemError(target);

module.exports = {
  isItem: isGameItem,
  isProduce: isProduceItem,
  getItem: getGameItem,
  getItemName: getGameItemName,
  getItemDescription,
  isItemTakeable,
};
