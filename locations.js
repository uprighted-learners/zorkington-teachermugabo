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
    return this.adjacent.includes(location);
  }
}

// create locations with mapped allowable transitions
let mainEntrace = new Location(
  "main entrance",
  `Hello Shopper! In case you've forgotten, you've been hired as a shopper
  for our dear dear customers at Hannafords. In the cart room, you'll find the
  your shopping list on the hiring stand. You are currently at the main entrance.
  In front of you are the doors to Hannafords.  Next up is the cart room.
  You'll need one. If you need help along the way, remember to just look around.`,
  ["cart room"]
);
let cartRoom = new Location(
  "cart room",
  `See the large carts on your right and small carts to your left.
  We're also hiring! Baskets are by the front produce`,
  ["front produce"],
  ["big carts", "small carts", "shopping list"]
);
let frontProduce = new Location(
  "front produce",
  `You're inside the store. Yay! In front of you are some local tomatoes,
  and local strawberries. Yum! To your right are some green stuff you
  can't quite make out. And to your right is a smorgasbord of fruit.
  This was damn place is a smorgasbord!`,
  ["cart room", "back produce", "left produce", "right produce"],
  ["strawberries", "tomatoes"]
);
let backProduce = new Location(
  "back produce",
  `You're in the back produce -- looking at heaps of single avocadoes, and potatoes.
  There's also big juicy tomatoes, and peppers. There are also bags of onions and
  avocadoes as well.`,
  ["front produce", "right produce", "left produce"],
  [
    "avodaoes",
    " potatoes",
    "big juicy tomatoes",
    "peppers",
    "onions",
    "bag of onions",
    "bag of avocadoes",
  ]
);

// TODO add description
let leftProduce = new Location(
  "left produce",
  `You're in the left produce -- tons of fruit!
  The usual suspects are here including some funky ones.
  Yes, hidden behind the passion fruit, are the mangoes and plums.
  There are also a bunch of different berries! Take your pick!`,
  ["checkout", "back produce", "front produce"],
  [
    "passion fruit",
    "mangoes",
    "plums",
    "blackberries",
    "blueberries",
    "strawberries",
  ]
);

// TODO add description
let rightProduce = new Location(
  "right produce",
  `You're in the right produce -- we have bell peppers and corn here.`,
  ["back produce", "front produce"],
  ["corn", "green bell peppers", "yellow bell peppers", "red bell peppers"]
);

// TODO add description
let checkout = new Location(
  "checkout",
  `So you're ready to check out. Got everything on your list?`,
  ["left produce"],
  ["receipt"]
);

// locations & location instance lookupTable
const locationLookUpTable = {
  "main entrance": mainEntrace,
  "cart room": cartRoom,
  "front produce": frontProduce,
  "back produce": backProduce,
  "left produce": leftProduce,
  "right produce": rightProduce,
  checkout: checkout,

  // * potential improvement - add "forgiving" location names
  // e.g. carts and cartroom for "cart room", front for "front product", etc...
  // ISSUE (are for refactoring):
  // Currently, adding locations here isn't enough, I need
  // to update locations in each Location class instance as well.
  // seems like a bad/poor pattern!
};

// create inventory by aggregating all locations' inventories
const produceInventory = frontProduce.inventory
  .concat(backProduce.inventory)
  .concat(leftProduce.inventory)
  .concat(rightProduce.inventory);

module.exports = { locationLookUpTable, produceInventory };