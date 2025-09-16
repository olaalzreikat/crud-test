//import file system module
const fs = require("fs"); //imports node.js built-in file system module
//node.js looks for built in "fs" module
//loads all file system functions (readFileSync, writeFileSync)
//assigns the module object to constant variable fs, memory: creates fs variable pointing to file system module object
//this import is not used in this file, its redundant since fileHelpers.js already uses fs


//import path module
const path = require("path"); //imports node.js built-in path manipulation module
//node.js loads the "path" module
//module contains functions like join(), dirname(), basename()
//assigns module to constant variable path 
//memory: creates path variables containing path manipulation functions
//usage: used in path.join()

//define database filename
const fileName = "./groceriesDB.json";
//creates string literal "./groceriesDB.json"
//"./" means current directory
//assigns to constant variable fileName
//memory: fileName now contains the string
//type: string primitive
//variable decalaration in js that assigns the string './groceriesDB.json' to the constant fileName
//doesnt load or parse the JSON file, it simply stores the path to the file as a reusable and immutable value

//create full file path
const filePath = path.join(__dirname, "data", fileName);
//const filePath declares a constant variable named filePath to store resulting file path string
/*path.join() method from node.js built-in path module. it takes multiple path segments as arguments and joins them together
to create a single correctly formatted path string. it handles platform-specific path separators, making code platform compatible
*/
// __dirname is a global variable in node.js that holds the absolute path to the directory containing the current executing script file. 
// absolute path of the directory where the current script resides
//"data" is a string literaly represenbting a directory name, it indicates that the fileName is expected to be located within a subdirectory named 'data' relative to the current script's directory
//fileName is a variable that holds the name of the specific file you want to access.
//Starting with the absolute path of the directory where the current script resides (__dirname).
//Then, it appends a directory named "data" to that path.
//Finally, it appends the fileName to the "data" directory, resulting in the full path to the target file.
//Combines: __dirname + "data" + fileName
//Memory: filePath contains full absolute path string

//import users data
const usersJS = require("./users.js");
//used to import code from another file, and it's part of the commonJS module system, defaukt for node.js
//looks for users.js in current directory, executes users.js file, users.js exports an array of the user objects, then that exported array is assigned to usersJS.

//import groceries data
const groceriesJS = require("./groceries.js"); //loads data from external file
//node.js finds and executes groceries.js
//groceries.js exports array of 10 grocery objects
//exported array assigned to groceriesJS

//import file helper functions
const {
  writeFile,
  readFile,
  addId,
  deleteFile,
  sleep,
} = require("./fileHelpers.js");
//imports specific functions using destructing assignment//node.js exectutes the fileHelpers.js
//fileHelpers.js exports an object {writeFile: function, readFile: function}
//desctructing extracts 5 specific functions from that object
//creates 5 separate variables: writeFile, readFile, addId, deleteFile, sleep
//each variable points to its respective function 

//import search helper functions
const { findItem, deleteItem } = require("./searchHelpers.js");
//imports search functions using destructuring
//loads searchHelpers.js module
//extracts findItem and deleteItem functions
//creates two variables pointing to these functions 
//memory: findItem and deleteItem variable now contain function references


// console.log(users);
//commented debug line, would print undefined since users doesnt exist, should be usersJS


// console.log("stringify", JSON.stringify(users, null, 2));
//Would try to call JSON.stringify(users, null, 2)
//Would fail because users is undefined
//JSON.stringify(data, null, 2) formats JSON with 2-space indentation


//delete existing database file
deleteFile(filePath);
//clean slate-remove any existing database file 
//calls the deleteFile() function from fileHelpers.js
//inside deleteFile()
//if file exists, it gets deleted, if it doesn't nothing happens (no error), ensures we start with clean database

//sleep (pause) function call
// sleep(0000);
//demonstrates sleep function
//calls sleep() function with parameter 0
//Since 0ms, loop doesn't execute
//Result: No actual delay, just function call overhead
//Teaching point: Shows how to use sleep function for timing
//you create a custom sleep function using setTimeout and Promise to pause execution without blocking the entire event loop. This function, often combined with async/await, creates a non-blocking delay, allowing other operations to continue while waiting for the specified time before the code resumes. 


// const usersWithId = addId(usersJS);
//users processing
//creates new array with users having unique ID fields

//add IDs to groceries
const groceriesWithId = addId(groceriesJS);
//The line const groceriesWithId = addIs(groceriesJS); is JavaScript code that calls a function named addIs() on an array of grocery items, and it is likely intended to add a unique id to each item. Since addIs() is a custom function and not part of the standard JavaScript library, you must first define it to make the code work. 
//calls addId() function, passing groceries array
//Memory: groceriesWithId contains new array with 10 objects, each having unique ID
//ID format: String representation of timestamp + index


//save data to file
writeFile(filePath, groceriesWithId);
//persists grocery data to JSON database file
//calls writeFile() function with path and data
//creates data directory if it doesn't exist, converts js array to formatted JSON string
//writes string to groceriesDB.json file
// if directry in parent specified in filePath does not already exist, the write operation will fail and throw an error.
//For example, if you try to write to a path like data/groceries.json and the data directory does not exist, the fs.writeFile() function will throw a "no such file or directory" error. 


//search for expensive item
const expensiveItem = findItem((item) => item.price > 5, readFile, filePath);
//find first grocery item costing more than 5
//calls the findItem() with three parameters: 
//readFile function reference for reading files
//filepath is the path to database file
//inside finfItem(): readFile () loads JSON file and parses it back to javascript array
//data.find() iterates through array, testing each item with price > 5
//returns first item where condition is true
//expensiveItem contains the found object or undefined if none found

//display results
console.log(expensiveItem);
//output the search result to console


//CRUD: create(writeFile, Read(findItem), Update, delete operations)

//require('fs'): Imports the File System module to access its methods.