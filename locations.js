// template for locations
class Location {
  constructor(
    name,
    description = "",
    adjacent = [],
    inventory = [],
    locked = false
  ) {
    this.name = name;
    this.description = description;
    this.adjacent = adjacent;
    this.inventory = inventory;
    this.locked = locked;
  }

  // returns description of location - convenience function
  lookAround() {
    return this.getDescription();
  }

  // returns description of location
  getDescription() {
    return this.description;
  }

  canGo(location) {
    return this.adjacent.includes(friendlyLocationNamesMappingTable[location]);
  }

  has(target) {
    return this.inventory.includes(target);
  }
}

// create locations with mapped allowable transitions
let mainEntrace = new Location(
  "main entrance",
  `

  Hello Shopper! In case you've forgotten, you've been hired as a shopper
  for our dear dear customers at Hannafords. In the carts room, you'll find the
  your shopping list on the hiring stand. You are currently at the main entrance.
  In front of you are the doors to Hannafords.  Next up is the carts room.
  You'll need one. If you need help along the way, remember to just look around.`,
  ["carts room"],
  ["main entrance doors"]
);
let cartRoom = new Location(
  "carts room",
  `  See the big carts on your right and small carts to your left.
  Next to our table with new hire forms, you'll find your shopping list.
  Once you have what you need, go on to the front produce area and
  start shopping.`,
  ["front produce", "main entrance"],
  ["big cart", "small cart", "shopping list"]
);
let frontProduce = new Location(
  "front produce",
  `  You're inside the store. Yay! In front of you are some local tomatoes,
  and local strawberries. Yum! To your right are some green stuff you
  can't quite make out. And to your right is a smorgasbord of fruit.
  This was damn place is a smorgasbord!`,
  ["carts room", "back produce", "left produce", "right produce"],
  ["strawberries", "tomatoes"]
);
let backProduce = new Location(
  "back produce",
  `  You're in the back produce -- looking at heaps of single avocadoes, and potatoes.
  There's also big juicy tomatoes, and peppers. There are also bags of onions and
  avocadoes as well. Once you are done, from here you can access the front
  area, as well as the right side of the produce section.`,
  ["front produce", "right produce"],
  [
    "avodaoes",
    "potatoes",
    "big juicy tomatoes",
    "peppers",
    "onions",
    "bag of onions",
    "bag of avocadoes",
  ]
);

let leftProduce = new Location(
  "left produce",
  `  You're in the left produce -- tons of fruit!
  The usual suspects are here including some funky ones.
  Yes, hidden behind the passion fruit, are the mangoes and plums.
  There are also a bunch of different berries! Take your pick!

  And if you have everything, the checkout is around the corner.`,
  ["checkout", "front produce"],
  [
    "passion fruit",
    "mangoes",
    "plums",
    "blackberries",
    "blueberries",
    "strawberries",
  ]
);

let rightProduce = new Location(
  "right produce",
  `  You're in the right produce are -- we have bell peppers and corn here.
  From here, you can see some some avos and potatoes in the back, along
  with other cooking must-haves. There may be more things, worth checking
  it out. Of course you can always go back where you were. I hope you find
  all that you are looking for...`,
  ["back produce", "front produce"],
  ["corn", "green bell peppers", "yellow bell peppers", "red bell peppers"]
);

let checkout = new Location(
  "checkout",
  `  So you're ready to check out. You have arrived at the register.
  Got everything on your list? If you do, then go ahead and pay. We
  have the customer's account and credit card info on file. If you
  don't have everything, then I'm afraid you'll be stuck in
  this store until you find all the things. Of course you can always quit if
  you don't need this job.`,
  ["left produce"],
  ["receipt", "cash register"]
);

// locations & location instance lookupTable
const locationInstancesLookUpTable = {
  "main entrance": mainEntrace,
  "carts room": cartRoom,
  "front produce": frontProduce,
  "back produce": backProduce,
  "left produce": leftProduce,
  "right produce": rightProduce,
  checkout: checkout,

  // * potential improvement - add "forgiving" location names
  // e.g. carts and cartroom for "carts room", front for "front product", etc...
  // ISSUE (are for refactoring):
  // Currently, adding locations here isn't enough, I need
  // to update locations in each Location class instance as well.
  // seems like a bad/poor pattern!
};

const friendlyLocationNamesMappingTable = {
  // main entrance names
  "main entrance": "main entrance",
  entrance: "main entrance",
  // carts room names
  "carts room": "carts room",
  "cart room": "carts room",
  cartroom: "carts room",
  carts: "carts room",
  cart: "carts room",
  // front produce names
  "front produce": "front produce",
  front: "front produce",
  // back produce names
  "back produce": "back produce",
  back: "back produce",
  // left produce names
  "left produce": "left produce",
  left: "left produce",
  // right produce names
  "right produce": "right produce",
  right: "right produce",
  // checkout names (default will do)
  checkout: "checkout",
};

// create inventory by aggregating all locations' inventories
const produceInventory = frontProduce.inventory
  .concat(backProduce.inventory)
  .concat(leftProduce.inventory)
  .concat(rightProduce.inventory);

// ==================== LOCATION HELPER METHODS ==============

/**
 * isValidLocation - helper predicate to verify that a target location
 * is in fact a valid location in our game.
 *
 * @param {String} location
 * @returns {Boolean} true/false
 */
const isValidLocation = (location) =>
  Object.keys(friendlyLocationNamesMappingTable).includes(location);

/**
 * isValidNextLocation - helper predicate to verify that a given target
 * location is a valid NEXT location from the CURRENT location.
 *
 * @param {String} location
 * @returns {Boolean} true/false
 */
const isValidNextLocation = (current, next) =>
  locationInstancesLookUpTable[current].canGo(next);

/**
 * getOfficialLocationName - helper method to return the internal
 * location name.
 *
 * @param {String} target
 * @returns {String | null} official location, if it exists (null otherwise)
 */
const getOfficialLocationName = (target) =>
  isValidLocation(target) ? friendlyLocationNamesMappingTable[target] : null;

/**
 * getLocationDescription -- given name of location, returns description.
 *
 * @param {String} location
 * @returns {String}
 */
const getLocationDescription = (location) =>
  locationInstancesLookUpTable[location].lookAround();

/**
 * getLocation - given name of location, returns the location object.
 *
 * @param {String} location
 * @returns {Location}
 */
const getLocation = (location) => locationInstancesLookUpTable[location];

/**
 * isItemHere -- given location and an item, this method searches
 * in the location's inventory and returns a boolean.
 *
 * @param {String} location
 * @param {String} item
 * @returns {Boolean}
 */
const isItemHere = (location, item) => getLocation(location).has(item);

module.exports = {
  produceInventory,
  isValidLocation,
  isValidNextLocation,
  getOfficialLocationName,
  getLocationDescription,
  getLocation,
  isItemHere,
};
