const path = require("path");
//loads node.js path manipulation utilities
//assigned to constant path, used in writeFile() for directory path extraction

const fs = require("fs");
//loads node.js file system operations module
//contains all file/directory manipulation functions

//writeFile function declaration
//overwrites any existing file parameters
//filepath is the target file location, data is js data to save (replace all existing content)
//no backup, no merge, complete replacement
function writeFile(filePath, data) {
  const dataDir = path.dirname(filePath);
  //extracts directory portion from full file path
  //path.dirname() used to extract the directory name of a given file path
  //filepath is the variable that holds the full path to a file for which you want to find the containing directory
// this method takes the filepath as an arguemnt and returns directory portion of that path. it effectively removes the filename and any trailing directory separator


//checks if target directory exists on file system
if (!fs.existsSync(dataDir)) {//checks if directory specified by dataDir does not exist. function that returns true if path exists and false otherwise
    fs.mkdirSync(dataDir, { recursive: true });
    //if the directory does not exist, mkdirSync is called to create it. dataDir is path to directory to be created
  //recursive: true ensures that any necessary parent directories are also created if they dont exist.
  //prevents from throwing an error if the dataDir already exists
}

//fs is file system
//writeFileSync synchronously writes the provided data to the specified file. If the file at filePath does not exist, it will be created. If it already exists, its content will be overwritten with the new data. Being synchronous, it blocks the execution of further code until the file writing operation is complete.
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
//overwrites the exisiting file content, filepath represents the path to the file where data will be written,
//converts js object or array (Data) into JSON formatted string
//data: The JavaScript object or array that needs to be converted to a JSON string.
//null: This is the replacer argument. When null is provided, all properties of the data object are included in the JSON string. If a function were provided, it could filter or transform the values.
//2: This is the space argument. It specifies the number of white spaces to use for indentation when formatting the JSON string. In this case, it will "pretty-print" the JSON with a 2-space indentation, making it more human-readable.

}


//safely reads and parses json files 
function readFile(filePath) {
    try {

        //synchronously reads the content of the file at filePath as a UTF-8 string
        //fs.readFileSync is a synchronous operation, meaning it blocks the event loop
        //until the file has been fully read
        //reads the file and turns it into JavaScript data

        
       // Read file: Load entire file content as UTF-8 string
 // Parse JSON: Convert JSON string to JavaScript object
        //This line reads the file, converts the file content into a text string, then parses that JSON text string into a JavaScript object or array, and immediately returns that parsed data structure back to the calling function.
        return JSON.parse /* takes the text string, turns it into javascript object or array*/(fs.readFileSync(filePath, "utf8") /*reads everything inside the file, gets text as a string */);
      } catch (error) {
        //catches any error from file reading/parsing
        console.log("No users file found, starting with empty array");
        return [];
      }
}


//permanantely deletes files parameter filePath
function deleteFile(filePath) {
    //checks if the file exists
  if (fs.existsSync(filePath)) {
    //if it does, delete it permanently
    fs.unlinkSync(filePath);
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


//function that takes milliseconds as input
function sleep(ms) {
    //record the time when we started
  const start = Date.now();
  //keep looping as long as the elapsed time is less than the target milliseconds
  while (Date.now() - start < ms) {} //empty means do nothing in the loop, just keep checking the time
}


module.exports = { writeFile, readFile, deleteFile, addId, sleep };
//make all functions available to other files
