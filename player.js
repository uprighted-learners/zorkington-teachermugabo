// create player with allowable actions, and cart
let player = {
  // set player's current location
  name: "Bob",
  currentLocation: "main entrance",
  // allowed actions
  // * possible future extension: forward, back, left, right
  actions: [
    "go",
    "go to",
    "get",
    "take",
    "examine",
    "drop",
    "pay",
    "leave",
    "look",
  ],
  shoppingList: null,
  cart: null,
  hasReceipt: false,
  hasList: function () {
    return this.shoppingList != null;
  },
  hasCart: function () {
    return this.cart != null;
  },
};

module.exports = player;
