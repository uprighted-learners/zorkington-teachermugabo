const { assert } = require("chai");
const {
  isItem,
  isProduce,
  getItem,
  getItemName,
  getItemDescription,
  isItemTakeable,
} = require("../items"); // import Items & interface

describe("few tests for Items class", () => {
  // declare & define cart, an instance of Item
  let cart = getItem("cart");

  it("Can add items to Item's contents", () => {
    cart.add("tomatoes");
    cart.add("peppers");

    assert(cart.has("tomatoes"), "cart should contain tomatoes");
    assert(cart.has("peppers"), "cart should contain peppers");
    assert(!cart.has("grains"), "cart should not have grains");
  });

  it("Can remove items from Item's contents", () => {
    assert.strictEqual(
      cart.removeFromContents("grains"),
      false,
      "remove non existing items returns false"
    );
    assert.strictEqual(
      cart.removeFromContents("tomatoes"),
      true,
      "remove non existing items returns false"
    );
    assert.strictEqual(
      cart.has("tomatoes"),
      false,
      "cart should no longer contain tomatoes"
    );
  });
});
