const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function mockFetch() {
  await sleep(100)
  return {
    uid: 100,
    name: "John Smith",
    email: "smith@email.com"
  }
}

// For value that is not immediately available, we might not want to freeze the process waiting for it


const valuePromise = mockFetch();
// Instead of returning an object, we return a "Promise" that the object to come

valuePromise.then((data) => {
  console.log(data.email);
});
// we can use .then to attach a callback function: "once the value is here, this is the function I will call"
// may look weird since an arrow function is used instead of the (function callback()...) but does the same job
valuePromise.then((data) => {
  return mockFetch();
}).then((data) => {
  return mockFetch();
}).catch((err => {
  console.log(err);
}))
// p.s. if your .then returns a promise, you are able to chain them
// the .catch on the very end will catch all .then promise errors that may occur

Promise.all([
  mockFetch(),
  mockFetch(),
  mockFetch(),
  mockFetch()
]).catch(values => {
  console.log(values.map(({name}) => name).join(", "));
});
// in the case we want to fetch a bunch of async data in parallel, we can use Promise.all
// it'll return a list of the promises only once all the promises are complete

async function printName() {
  let data = await mockFetch();
  console.log(data.name);
  return data.name
}
// alternatively, we can write our code like there's asynchronous code.
// This async function returns a Promise, but now we can wait until the promise is resolved before the next line using await
// inside of this function everything is synchronous, the function itself is the asynchronous code
printName();


