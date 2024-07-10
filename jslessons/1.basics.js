//npm install -D ts-node typescript
//Add Node.js as complie option, include this file and the parameter:  --require ts-node/register


// const vs let vs var


const five = 5;
// five = 6
// const must be initialized with value. The value is read-only can not be changed like final in java

function letScoping() {
  if (true) {
    let ye = 2;
    var ze = 2
  }
  //console.log(ye, ze)
}
// var's scope is the entire function, while let's scope is in the if function
// let > var generally as let has clearer scoping

letScoping();

// Similar to java

//for loop
for (let i = 0; i < 9; i++) {
  console.log(i)
}

//if else
let a = false;
if (a) {

} else if (a) {

} else {

}

//try catch, used when you expect possible exceptions that you want to resolve instead of exiting immediately
try {

} catch(e) {

} finally {

}

// ternary operator, value is dependent on value of a. This can be written as an if else, but is much easier to write
const value = a ? "one" : "two";

// string template, allows variables in the string
console.log(`The value is: ${value}`)



