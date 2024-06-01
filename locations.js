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

  lookAround() {
    return this.getDescription();
  }

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

const mainEntrace = new Location(
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
const cartRoom = new Location(
  "carts room",
  `  See the big carts on your right and small carts to your left.
  Next to our table with new hire forms, you'll find your shopping list.
  Once you have what you need, go on to the front produce area and
  start shopping.`,
  ["front produce", "main entrance"],
  ["big cart", "small cart", "shopping list"]
);
const frontProduce = new Location(
  "front produce",
  `  You're inside the store. Yay! In front of you are some local tomatoes,
  and local strawberries. Yum! To your right are some green stuff you
  can't quite make out. And to your right is a smorgasbord of fruit.
  This was damn place is a smorgasbord!`,
  ["carts room", "back produce", "left produce", "right produce"],
  ["strawberries", "tomatoes"]
);
const backProduce = new Location(
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

const leftProduce = new Location(
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

const rightProduce = new Location(
  "right produce",
  `  You're in the right produce are -- we have bell peppers and corn here.
  From here, you can see some some avos and potatoes in the back, along
  with other cooking must-haves. There may be more things, worth checking
  it out. Of course you can always go back where you were. I hope you find
  all that you are looking for...`,
  ["back produce", "front produce"],
  ["corn", "green bell peppers", "yellow bell peppers", "red bell peppers"]
);

const checkout = new Location(
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

// TODO: I suppose we can skip the friendly and directly map
// names to their objects
const locationInstancesLookUpTable = {
  "main entrance": mainEntrace,
  "carts room": cartRoom,
  "front produce": frontProduce,
  "back produce": backProduce,
  "left produce": leftProduce,
  "right produce": rightProduce,
  checkout: checkout,
};

const friendlyLocationNamesMappingTable = {
  // checkpoints
  "main entrance": "main entrance",
  entrance: "main entrance",
  checkout: "checkout",
  // carts
  "carts room": "carts room",
  "cart room": "carts room",
  cartroom: "carts room",
  carts: "carts room",
  cart: "carts room",
  // produce
  "front produce": "front produce",
  front: "front produce",
  "back produce": "back produce",
  back: "back produce",
  "left produce": "left produce",
  left: "left produce",
  "right produce": "right produce",
  right: "right produce",
};

const produceInventory = frontProduce.inventory
  .concat(backProduce.inventory)
  .concat(leftProduce.inventory)
  .concat(rightProduce.inventory);

const isValidLocation = (location) =>
  Object.keys(friendlyLocationNamesMappingTable).includes(location);

const isValidNextLocation = (current, next) =>
  locationInstancesLookUpTable[current].canGo(next);

const getOfficialLocationName = (target) =>
  isValidLocation(target) ? friendlyLocationNamesMappingTable[target] : null;

const getLocationDescription = (location) =>
  locationInstancesLookUpTable[location].lookAround();

const getLocationInfo = (location) => locationInstancesLookUpTable[location];

const isItemHere = (location, item) => getLocationInfo(location).has(item);

module.exports = {
  produceInventory,
  isValidLocation,
  isValidNextLocation,
  getOfficialLocationName,
  getLocationDescription,
  getLocation: getLocationInfo,
  isItemHere,
};
