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
  }

  canGo(location) {
    return this.adjacent.includes(location)
  }
}

// create locations with mapped allowable transitions
let mainEntrace = new Location(
  'main entrance',
  'In front of you are the doors to Hannafords. Grab a cart from the cart room',
  ['cart room'])
let cartRoom = new Location(
  'cart room',
  'See the large carts on your right and small carts to your left. We\'re also hiring! Baskets are by the front produce',
  ['front produce'])
let frontProduce = new Location(
  'front produce',
  '',
  ['cart room','back produce', 'left produce', 'right produce'])
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


const welcomeMessage = 
`Welcome to Hannaford! You are at the main entrance. 
Now, navigate blindly! Just type in the locations...
Good luck!
`
console.log(welcomeMessage)


start();

async function start() {
  const prompt = 
`
>_`

  let answer = await ask(prompt);

  if(answer == 'leave') {
    process.exit(0)
  } else if(locationLookUp[currentLocation].canGo(answer)) {
    console.log(`Good guess! You left ${currentLocation} and are now in ${answer}`)
    currentLocation = answer
  } else {
    console.log('Nope! Try again.')
  }

  start()
  // process.exit();
}
