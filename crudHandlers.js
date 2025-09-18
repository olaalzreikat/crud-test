const { readFile, writeFile } = require("./fileHelpers");
//import only the two functions we need from fileHelpers.js using destructuring
//readFile for loading data from JSON file
//writeFile for saving data back to JSON files (overwrites entire file)


//argument filePath which is file path to database, argument type which is string specifying what kind of search to perform
function findOne(filePath, type) {
    //reads JSON file and converts it to JS data, loads data JSOn file
  const data = readFile(filePath);

  //check the type parameter and run different searches
  switch (type) {
    case "firstExpensive":
        //first item where condition is true
      return data.find((item) => item.price > 5);
      break;
    case "lastExpensive":
        //last item where condition is true
      return data.findLast((item) => item.price > 5);
      break;
    case "firstOrganicIndex":
        //index where first condition is true
      return data.findIndex((item) => item.organic);
      break;
    case "lastOrganicIndex":
        //index where last condition is true
      return data.findLastIndex((item) => item.organic);
      break;
  }
}

//adds unique ID fields to array objects
//data is the array of objects needing IDs
function addId(data) {
    //create new array with copied objects
    //data.map() goes through each item in the original array and transforms it
    //(item) => ({...item}) for each item, create a brand new object with all the same properties
    // ...item spreads(copies) all properties from the original object into the new object
  const copy = data.map((item) => ({ ...item })); 

  //go through each object in the array, give me the object and it's position number
  copy.forEach((item, index) => {
    // if this object doesnt have an id property  
    if (!item.id) {
        //add an id property to this object item["id"] that takes the current timestamp and adding the positon number/index, then convert it to text
      item["id"] = (Date.now() + index).toString();
    }
  });
  return copy;
  //return new array
}

//delete the first item that matches a condition, database file location (filePath)
//function that returns true for items to delete (constraintFn)
// constraint tests each item one by one, returns true or false based if the item meets the condition, stops at the first item that returns true
//first true item gets deleted
function deleteFirstItem(filePath, constraintFn) {
    //gets all data from file so we can work with it
    const data = readFile(filePath);
    //looks through the data and gives us the index of the first item that matches the test/condition
  const dataIndex = data.findIndex(constraintFn);
  //if something is found to delete, 
  if (dataIndex !== -1) {
    //remove 1 item at the index
    //data is array to modify
    //dataIndex is index where to start, 1 is how many to remove
    data.splice(dataIndex, 1); //splice modifies original array
    //overwrite the json Database with array containing items from json (data)
   //filePath is the location where the file is located, data is the grocery items and their information
    writeFile(filePath, data);
    return "item deleted";
  }
  return "Item not found";
}


//delete all items that match a condition
function deleteAll(filePath, constraintFn) {

        //gets all data from file so we can work with it
  const data = readFile(filePath);

  //create new array with items that dont match the constraint,
  //data.filter goes through each item in array and tests each, creates a new array with items that pass the test
  //constraintFn tests if item should be deleted but it keeps the items that dont match
  const remainingItems = data.filter((item) => !constraintFn(item));
  writeFile(filePath, remainingItems);

  //calculates how many items were deleted. 
  //data.length is original count,
// remainingitems is whats left
  const deletedCount = data.length - remainingItems.length;
  //returns how many were deleted
  return `Deleted ${deletedCount} items`;
}


//filepath, database file, constriant, function to find which item to replace, newitemdata, new data to replace with
function putItem(filePath, constraintFn, newItemData) {
      //load data
  const data = readFile(filePath);
  //find item 
  const itemIndex = data.findIndex(constraintFn);

  //if it doesnt match item returns that
  if (itemIndex === -1) {
    return "Item not found";
  }

  //saves original id, gets data index then gets its id
  const originalId = data[itemIndex].id;

  //updates object at an index wihtin an array but keeps the original id
  //item completely replaced except id 
  data[itemIndex] = { ...newItemData, id: originalId };
  //write updated array to file
  writeFile(filePath, data);
  //return the updated item
  return `item updated: ${data[itemIndex]}`;
}


//patch means updating or fixing a small part of something
//constraint, function to find item to update, updates - object with only the fields to change
function patchItem(filePath, constraintFn, updates) {
  const data = readFile(filePath);
  //find item
  const itemIndex = data.findIndex(constraintFn);
  //handle not foundcase
  if (itemIndex === -1) {
    return "item not found";
  }

  //data[itemIndex] is just a specific item at an index
  //spread existing item, then spread/expand updates on top, unpacks object into individual properties
  //...updates - overwriting properties with the same name
  data[itemIndex] = { ...data[itemIndex], ...updates };
  //overwrites, like updates array to file
  writeFile(filePath, data);
  //return confimation of item
  return `Item patched ${data[itemIndex]}`;
}

module.exports = {
  findOne,
  deleteFirstItem,
  deleteAll,
  addId,
  putItem,
  patchItem
};

//module exports just makes the functions available to other files
