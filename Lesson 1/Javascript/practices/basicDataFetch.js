const apiUrl = 'https://api.sampleapis.com/coffee/hot';
fetch(apiUrl).then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
  .then(data => {
    // Display data in an HTML element
    //console.log(JSON.stringify(data, null, 2));
    const names = data.map(({title}) => title);
    console.log(names.slice(0,10).join(" "));
  })
  .catch(error => {
    console.error('Error:', error);
  });
