const readline = require('readline');
const { createBrotliCompress } = require('zlib');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

// template for locations 
// TODO change them to departments
class Location {
  constructor(name, description = '', adjacent = [], inventory = []) {
    this.name = name
    this.description = description
    this.adjacent = adjacent
    this.inventory = inventory
  }

  // returns description of location - convenience function
  lookAround() { return this.getDescription() }

  // returns description of location
  getDescription() { return this.description }

  canGo(location) {
    return this.adjacent.includes(location)
  }
}

// create locations with mapped allowable transitions
let mainEntrace = new Location(
  'main entrance',
  `
  Welcome to Hannaford! You are at the main entrance.
  In front of you are the doors to Hannafords.
  Next up is the cart room. You'll need one.
  If you need help along the way, remember to just look around.`,
  ['cart room'])
let cartRoom = new Location(
  'cart room',
  `
  See the large carts on your right and small carts to your left.
  We're also hiring! Baskets are by the front produce`,
  ['front produce'],
  ['big carts','small carts','hiring'])
let frontProduce = new Location(
  'front produce',
  `
  You're inside the store. Yay! In front of you are some local tomatoes,
  and local strawberries. Yum! To your right are some green stuff you 
  can't quite make out. And to your right is a smorgasbord of fruit. 
  This was damn place is a smorgasbord!`,
  ['cart room','back produce', 'left produce', 'right produce'],
  ['strawberries','tomatoes'])
let backProduce = new Location(
  'back produce',
  `You're in the back produce -- looking at heaps of avocadoes, and potatoes`,
  ['front produce','right produce','left produce'])

  // TODO add description
  let leftProduce = new Location(
  'left produce',
  `
  You're in the left produce -- tons of fruit!
  The usual suspects are here including some funky ones.
  Yes, hidden behind the passion fruit, are the mangoes and plums.`,
  ['checkout','back produce','front produce'])

  // TODO add description
  let rightProduce = new Location(
  'right produce',
  `You're in the right produce -- we have bell peppers and corn here.`,
  ['back produce','front produce'])
  
  // TODO add description
  let checkout = new Location(
  'checkout',
  `So you're ready to check out. Go everything on your list?`,
  ['left produce'])

// locations & location instance lookupTable
// TODO implementation of "forgiving" location names that doesn't
//      require adding all these possibilities into the Location 
//      class instance's adjacent array.
const locationLookUp = {
  "main entrance" : mainEntrace,
  "cart room" : cartRoom,
  //"carts": cartRoom,
  "front produce" : frontProduce,
  //"front" : frontProduce,
  "back produce" : backProduce,
  //"back" : backProduce,
  "left produce" : leftProduce,
  //"left" : leftProduce,
  //"left side" : leftProduce,
  "right produce" : rightProduce,
  //"right" : rightProduce,
  //"right side" : rightProduce,
  "checkout" : checkout
}

// TODO add items
// items
class Item {
  constructor(name, description = '', takeable = true, available = true, fresh = false) {
    this.name = name
  }

  examine() {

  }
}


// TODO define actions
// actions 
// TODO this will be simpler -- though
/* 
return [item]
take [item]
go to [location]
pay
leave / exit

// Possible future extensions
move forward
move back
move left
move right
take [object]
*/

let player = {
  // set player's current location
  name: "Bob",
  currentLocation: "main entrance",
  shoppingList: [],
  cart: []
}
// logic to move b/t locations


// print out current place's description
console.log(locationLookUp[player.currentLocation].getDescription())


start();

async function start() {

  // user prompt
  const prompt = 
`
Where to next?

>_`

  let answer = await ask(prompt);

  // if there was an input, clean it up
  if(answer) answer = answer.trim().toLowerCase()

  // TODO organize my user input process -- require action/target format
  // pull from wk2/escaperoom.js -- workshop with Olivia

  // allow user leave
  if(answer === 'leave' || answer === 'exit') {
    console.log('bye')
    process.exit(0)
  } 
  // user can look around :-) 
  // TODO this will turn into action=look, target=around -- maybe
  else if (answer == 'look around') {
    console.log(locationLookUp[player.currentLocation].getDescription())
  }
  // takes next location
  else if (locationLookUp[player.currentLocation].canGo(answer)) {
    console.log(`Good guess! You left ${player.currentLocation} and are now in ${answer}`)
    player.currentLocation = answer

    // TODO implement can't go from here to there -- if we got a valid location
  } 
  // catch invalid input
  else {
    console.log(`Don't know how to do that. Study the clues closer, keep it simple & try again`)
  }

  start()
  // process.exit(); -- not sure why this exits!
}
