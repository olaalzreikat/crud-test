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