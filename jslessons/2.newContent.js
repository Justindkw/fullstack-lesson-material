// Destructuring assignment


const obj = {
  one: 1,
  two: "20",
  nested: {
    inside: "inside"
  }
};
// objects in javascript is much easier than java, this is much more like c's struct
// you can also interpret it as a json object

console.log(obj.one);
// . operator to access fields

const {one: notOne, two, nested: {inside}} = obj;
// we can also destruct the entire object in this format, even nested ones
// in the case we need to rename the destructed field (maybe it's already in use), we can do it directly inside
// one: notOne -> fieldName: newName
console.log(notOne, inside);

const list = [10,11,12,13,14,15,16,17,18,19];
const [first, second] = list;
// destructing works with lists too, it pulls elements starting from the head
console.log(first, second);


// arrow functions


const increment = x => x + 1;
// shorthand way to create a function, is useful for creating anonymous functions (lambda)
const append = (a, b) => {
  return a + " " + b;
};
// you can extend the fields and lines by using brackets

const switchPair = ({one,two}) => ({one: two, two: one});
// incorporating destructing object directly in the function parameter
const pair = {one: 3, two:5};
console.log(increment(5), append("the", "text"), switchPair(pair));
// see how I only passed the pair object, but got {one, two}? You'll see this in React.js


// default parameter


function sortList(list, reverse=false) {
  list.sort((a, b) => a - b) // do it without sort fn then show lambda fm
  return reverse ? list.reverse() : list;
}
// we can set a default value for the parameter, this means if we don't pass that value, it'll be default false
// see how I used the (a, b) => a - b to directly pass a comparison function? JS sort sorts by ASCII code so this is needed
const unsortedList = [29,5,95,1,465,2,34];
console.log(sortList(unsortedList).toString(), "   ", sortList(unsortedList, true).toString());
// example of how I don't have to pass a second parameter


// list fn

console.log(unsortedList.map((e, i) => e*10+i).toString());
// map function, like CPSC 110, each element of the list is mapped to a new value given this arrow function
unsortedList.forEach(e => console.log(e));
// forEach doesn't map, it just calls the arrow function for each element. It returns nothing
console.log(unsortedList.join("-"));
// nice function to make a list a string
console.log(unsortedList.slice(2,5));
// makes a new sublist based on old list given start and end


// Dealing with Null

let a = null;

let b = a ?? "default"; // talk alt ||
// the nullish coalescing operator. Basically, if the left value is null/undefined, we default to the value on the right
// sometimes you may see || instead, this is less strict. 0, [], "" would all be considered a falsey value and default to the right
// falsey is null, 0, [], "", {}, truthy is everything else, java has this functionality too
let c;
c = {
  one: 1
}

console.log(b)

console.log(c?.one)
console.log(c?.two)
// optional chaining operator, sometimes the object field may be null, but we don't want to cause a crash accessing it
// we can then use ?. to attempt accessing the field. If it doesn't exist, it just returns null instead of an exception


// interesting || && usage

console.log(null && "five")
// returns the first falsey value it finds. This case it's the null
console.log("five" || null)
// returns the first truthy value. This is why sometimes you see it replacing ??
