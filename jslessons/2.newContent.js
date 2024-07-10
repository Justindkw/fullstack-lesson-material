// Destructuring assignment


const obj = {
  one: 1,
  two: "20",
  nested: {
    inside: "inside"
  }
};

console.log(obj.one);

const {one: notOne, two, nested: {inside}} = obj;
console.log(notOne, inside);

const list = [10,11,12,13,14,15,16,17,18,19];
const [first, second] = list;
console.log(first, second);


// arrow functions

const increment = x => x + 1;
const append = (a, b) => {
  return a + " " + b;
};

const switchPair = ({one,two}) => ({one: two, two: one});

const pair = {one: 3, two:5};
console.log(increment(5), append("the", "text"), switchPair(pair));


// default parameter


function sortList(list, reverse=false) {
  list.sort((a, b) => a - b) // do it without sort fn then show lambda fm
  return reverse ? list.reverse() : list;
}
const unsortedList = [29,5,95,1,465,2,34];
console.log(sortList(unsortedList).toString(), "   ", sortList(unsortedList, true).toString());


// list fn

console.log(unsortedList.map((e, i) => e*10+i).toString());
unsortedList.forEach(e => console.log(e))


// Dealing with Null

let a = null;

let b = a ?? "default"; // talk alt ||

let c;
c = {
  one: 1
}

console.log(b)

console.log(c?.one)
console.log(c?.two)

//interesting || && usage

console.log(null && "five")
console.log("five" || null)
