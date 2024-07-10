const int: number = 5;

function sortList(list: number[], reverse:boolean=false): number[] {
  list.sort((a: number, b: number) => a - b) // do it without sort fn then show lambda fm
  return reverse ? list.reverse() : list;
}

interface Obj {
  one: number,
  two: string,
  nested: {
    inside: string
  }
}

const obj : Obj = {
  one: 1,
  two: "20",
  nested: {
    inside: "inside"
  }
};

const missingObj = {one: 1, two: "21"} as Obj
console.log(missingObj.nested)


const fetchedData = {
    artist: "Daft Punk",
    title: "Homework",
    release_year: 1997,
    formats: [
      "CD",
      "Cassette",
      "LP"
    ],
    gold: true
  };

interface MusicData {
  artist: string
  title: string
}

const music = fetchedData as MusicData;

