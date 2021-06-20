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
//      ISSUE: currently, adding locations here isn't enough, I need
//      to update locations in each Location class instance as well.
//      seems like a bad/poor pattern! 
const locationLookUp = {
  "main entrance" : mainEntrace,
  "cart room" : cartRoom,
  //"cartroom" : cartRoom,
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


// Possible future extensions
// 
/*
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
  // allowed actions
  actions: [ "go", "go to","take","return","pay","leave","look"],
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
What to do next? >_`

  // prompt user
  let answer = await ask(prompt);
  // console.log(answer, 'line 174');

  // quick & dirty sanitizing
  let inputArray = answer.trim().toLowerCase().split(' ')

  let action = ''
  let target = ''

  // process action
  // + ability to process "go to"
  // TODO replace this logic with user input lookupTable 
  action = inputArray[0] // first word
  if ( action === "go" && inputArray[1] === "to") {
    action = "go to"
    target = inputArray.slice(2).join(' ') // the rest
  } 
  // if action is not "go to", expect single word for command
  else {
    target = inputArray.slice(1).join(' ') // the rest
  }

  // execute user's wishes
  // if action isn't known, let user know
  if(!player.actions.includes(action)) {
    console.log(
    `Dear Shopper. You're limited to a few commands. 
      You can go, take, return, etc..stuff
      Plz, try again.`)
  } 
  // if action is known, let user know as well
  else {
    console.log(`Ah, so you want want to ${action} ${target}.`)

    // if look - assume "look around" - get current place's location & look out! 
    if ( action === 'look') {
      console.log(locationLookUp[player.currentLocation].lookAround())
    }
    // if "go", expect/check target is location, 
    else if( action === "go to" || action === "go") {
      // check/handle if valid location
      if(Object.keys(locationLookUp).includes(target)) {
        // check/handle if allowed transition
        if (locationLookUp[player.currentLocation].canGo(target)) {
          console.log(`Good guess! You left ${player.currentLocation} and are now in ${target}`)
          player.currentLocation = target
        } else {
          // TODO implement can't go from here to there -- if we got a valid location
          console.log(`Can't go from ${player.currentLocation} to ${target}. Clues, shopper, clues.`)
        }
      } else {
        // wrong location -- help user with location
        console.log(`Hmmm, don't know ${target}. Look around!`)
      }   
    }
    // if "take", expect take [item]
    // if "return" expect target = [item], check
    // if "pay", say thanks - you're all say
    else if (action === 'pay') console.log("Thanks! You're all set. You can leave now.")
    // if "leave" say bye
    else if (action === 'leave') { 
      console.log("bye")
      process.exit(0)
    }

  }

  start()
  // process.exit(); -- TODO understand how/when this line executes
}
