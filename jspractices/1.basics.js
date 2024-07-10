//npm install -D ts-node typescript
//Add Node.js as complie option, include this file and the parameter:  --require ts-node/register


// const vs let vs var


const five = 5;
// five = 6
//must be initialized, like final in java
function letScoping() {
  if (true) {
    let ye = 2;
    var ze = 2
  }
  //console.log(ye, ze)
}

//let > var generally as let has clearer scoping

letScoping();

// Similar to java


for (let i = 0; i < 9; i++) {
  console.log(i)
}
let a = false;
if (a) {

} else if (a) {

} else {

}

try {

} catch(e) {

} finally {

}

const value = a ? "one" : "two";

// string template

console.log(`The value is: ${value}`)




