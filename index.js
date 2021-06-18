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

  lookAround() { return this.getDescription() }

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
  `See the large carts on your right and small carts to your left.
  We're also hiring! Baskets are by the front produce`,
  ['front produce'],
  ['big carts','small carts','hiring'])
let frontProduce = new Location(
  'front produce',
  `You're inside the store. Yay! In front of you are some local tomatoes,
  and local strawberries.Yum!
  To your right are some green stuff you can't quite make out.
  And to your right is a smorgasbord of berries. This was damn place is a smorgasbord!`,
  ['cart room','back produce', 'left produce', 'right produce'],
  ['strawberries','tomatoes'])
let backProduce = new Location(
  'back produce',
  '',
  ['front produce','right produce','left produce'])
let leftProduce = new Location(
  'left produce',
  '',
  ['checkout','back produce','front produce'])
let rightProduce = new Location(
  'right produce',
  '',
  ['back produce','front produce'])
let checkout = new Location(
  'checkout',
  '',
  ['left produce'])

// locations & location instance lookupTable
const locationLookUp = {
  "main entrance" : mainEntrace,
  "cart room" : cartRoom,
  "front produce" : frontProduce,
  "back produce" : backProduce,
  "left produce" : leftProduce,
  "right produce" : rightProduce,
  "checkout" : checkout
}

// actions
/*
move forward
move back
move left
move right
take [object]
*/

// set current location
let currentLocation = "main entrance"

// logic to move b/t locations


// print out current place's description
console.log(locationLookUp[currentLocation].getDescription())


start();

async function start() {

  // user prompt
  const prompt = 
`
Where to next?

>_`

  let answer = await ask(prompt);

  // if answer is an action -> take action
  // else if answer is an item

  if(answer == 'leave') {
    console.log('bye')
    process.exit(0)
  } else if (answer == 'look around') {
    console.log(locationLookUp[currentLocation].getDescription())
  } else if (locationLookUp[currentLocation].canGo(answer)) {
    console.log(`Good guess! You left ${currentLocation} and are now in ${answer}`)
    currentLocation = answer
  } else {
    console.log('Nope! Try again.')
  }

  start()
  // process.exit(); -- not sure why this exists!
}
