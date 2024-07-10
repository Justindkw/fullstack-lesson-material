const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function mockFetch() {
  await sleep(100)
  return {
    uid: 100,
    name: "John Smith",
    email: "smith@email.com"
  }
}

async function printName() {
  let data = await mockFetch();
  console.log(data.name);
}

printName();

mockFetch().then((data) => {
  console.log(data.email);
})


