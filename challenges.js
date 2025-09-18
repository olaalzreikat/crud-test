// 30-Minute CRUD Practice Challenge Solutions
// Based on the fileHelpers.js and crudHandlers.js we analyzed

const { readFile, writeFile } = require("./fileHelpers");
const groceriesDBpath = "./data/groceriesDB.json";

// =============================================================================
// FIND CHALLENGES (5 minutes)
// =============================================================================

// Challenge 1: Expand the findOne switch cases
function findOne(filePath, type) {
  // Load entire JSON database into memory as JavaScript array
  const data = readFile(filePath);
  
  // Check which type of search to perform
  switch (type) {
    case "firstExpensive":
      // Find first item where price > 5, returns item object or undefined
      return data.find((item) => item.price > 5);
      
    case "lastExpensive":
      // Find last item where price > 5, searches from end backwards
      return data.findLast((item) => item.price > 5);
      
    case "firstOrganicIndex":
      // Find position number (0,1,2...) of first organic item, returns -1 if none
      return data.findIndex((item) => item.organic);
      
    case "lastOrganicIndex":
      // Find position number of last organic item, searches backwards
      return data.findLastIndex((item) => item.organic);
      
    // NEW CASES:
    case "firstBakery":
      // Find first item in Bakery category, returns item object or undefined
      return data.find((item) => item.category === "Bakery");
      
    case "heaviestQuantity":
      // Compare each item's quantity, keep the one with highest quantity
      // reduce() goes through array, comparing current vs accumulator
      return data.reduce((heaviest, item) => 
        item.quantity > heaviest.quantity ? item : heaviest
      );
      
    case "cheapest":
      // Compare each item's price, keep the one with lowest price
      // Ternary operator: condition ? valueIfTrue : valueIfFalse
      return data.reduce((cheapest, item) => 
        item.price < cheapest.price ? item : cheapest
      );
      
    case "mostExpensive":
      // Compare each item's price, keep the one with highest price
      return data.reduce((expensive, item) => 
        item.price > expensive.price ? item : expensive
      );
      
    case "organicProduce":
      // Filter returns NEW array with items that pass BOTH conditions
      // && means both conditions must be true
      return data.filter((item) => item.organic && item.category === "Produce");
      
    case "dairyUnder5":
      // Filter for items that are Dairy AND under $5
      return data.filter((item) => item.category === "Dairy" && item.price < 5);
      
    case "meatInventory":
      // Filter returns all items in Meat category
      return data.filter((item) => item.category === "Meat");
      
    case "cheapestByCategory":
      // Step 1: Get unique category names using Set to remove duplicates
      const categories = [...new Set(data.map(item => item.category))];
      // Step 2: For each category, find the cheapest item in that category
      return categories.map(category => {
        // Filter to get only items from this category
        const categoryItems = data.filter(item => item.category === category);
        // Find cheapest item within this category
        return categoryItems.reduce((cheapest, item) => 
          item.price < cheapest.price ? item : cheapest
        );
      });
  }
}

// Challenge 2: Custom find functions
function findByCategory(category) {
  // Load current database into memory
  const data = readFile(groceriesDBpath);
  // Find first item where category matches the parameter
  // Returns item object or undefined if no match
  return data.find((item) => item.category === category);
}

function findItemsOver(price) {
  // Load current database into memory
  const data = readFile(groceriesDBpath);
  // Filter returns NEW array containing ALL items over the price
  // Unlike find(), filter() gets all matches, not just first one
  return data.filter((item) => item.price > price);
}

// =============================================================================
// DELETE CHALLENGES (8 minutes)
// =============================================================================

function deleteAll(filePath, constraintFn) {
  // Step 1: Load current data from JSON file
  const data = readFile(filePath);
  
  // Step 2: Filter to keep items that DON'T match constraint
  // !constraintFn(item) flips true to false - keep items constraint says to delete
  const remainingItems = data.filter((item) => !constraintFn(item));
  
  // Step 3: OVERWRITE entire file with remaining items (deleted items are gone)
  writeFile(filePath, remainingItems);
  
  // Step 4: Calculate how many items were deleted
  const deletedCount = data.length - remainingItems.length;
  
  // Step 5: Return confirmation message with count
  return `Deleted ${deletedCount} items`;
}

// Challenge 3: Category cleanup
function deleteExpensiveItems() {
  // Call deleteAll with constraint that finds items over $5
  // Constraint returns true for expensive items (which get deleted)
  return deleteAll(groceriesDBpath, (item) => item.price > 5);
}

function deleteLowStock() {
  // Call deleteAll with constraint for low quantity items
  // Items with quantity < 2 get deleted
  return deleteAll(groceriesDBpath, (item) => item.quantity < 2);
}

function deleteNonOrganic() {
  // !item.organic means "not organic" - deletes non-organic items
  // organic=false becomes !false=true (delete), organic=true becomes !true=false (keep)
  return deleteAll(groceriesDBpath, (item) => !item.organic);
}

// Challenge 4: Smart deletion
function deleteByUnit(unit) {
  // Delete all items where unit property exactly matches parameter
  // Example: deleteByUnit("ounces") removes all items sold by ounces
  return deleteAll(groceriesDBpath, (item) => item.unit === unit);
}

function deleteCheapProduce() {
  // COMBINE two conditions with && (both must be true to delete)
  // Delete items that are BOTH Produce category AND under $3
  return deleteAll(groceriesDBpath, (item) => 
    item.category === "Produce" && item.price < 3
  );
}

// =============================================================================
// PATCH CHALLENGES (8 minutes)
// =============================================================================

function patchItem(filePath, constraintFn, updates) {
  // Step 1: Load all data from JSON file
  const data = readFile(filePath);
  
  // Step 2: Find position of item that matches constraint
  // Returns index number (0,1,2...) or -1 if not found
  const itemIndex = data.findIndex(constraintFn);
  
  // Step 3: Handle case where no matching item exists
  if (itemIndex === -1) {
    return "item not found";
  }
  
  // Step 4: MERGE updates with existing item (PATCH operation)
  // ...data[itemIndex] spreads existing properties
  // ...updates spreads new properties (overwrites matching ones)
  data[itemIndex] = { ...data[itemIndex], ...updates };
  
  // Step 5: Save entire array back to file (OVERWRITES file)
  writeFile(filePath, data);
  
  // Step 6: Return confirmation with updated item
  return `Item patched: ${JSON.stringify(data[itemIndex])}`;
}

// Challenge 5: Price adjustments
function applyInflation() {
  // Step 1: Load all current data
  const data = readFile(groceriesDBpath);
  
  // Step 2: Transform EVERY item using map()
  // map() creates NEW array with transformed items
  const inflatedData = data.map((item) => ({
    // Spread all existing properties unchanged
    ...item,
    // Override price with inflated version (multiply by 1.1 = 110%)
    // Math.round() * 100 / 100 rounds to 2 decimal places
    price: Math.round((item.price * 1.1) * 100) / 100
  }));
  
  // Step 3: Replace entire database with inflated prices
  writeFile(groceriesDBpath, inflatedData);
  return "Applied 10% inflation to all items";
}

function putOnSale(itemName) {
  // Use patchItem to add onSale property to specific item
  // Constraint finds item by name, updates adds onSale: true
  return patchItem(groceriesDBpath, 
    (item) => item.name === itemName,  // Find item with this name
    { onSale: true }                   // Add this property
  );
}

function updateQuantity(itemName, newQuantity) {
  // Use patchItem to update only the quantity field
  // All other properties remain unchanged
  return patchItem(groceriesDBpath,
    (item) => item.name === itemName,  // Find item by name
    { quantity: newQuantity }          // Update only quantity
  );
}

// Challenge 6: Bulk updates
function markOrganicProduce() {
  // Step 1: Load all current data
  const data = readFile(groceriesDBpath);
  
  // Step 2: Transform each item - check if it needs updating
  const updatedData = data.map((item) => {
    // Check if item meets BOTH conditions (organic AND produce)
    if (item.organic && item.category === "Produce") {
      // If yes, add certified property while keeping all existing properties
      return { ...item, certified: true };
    }
    // If no, return item unchanged
    return item;
  });
  
  // Step 3: Save the updated array back to file
  writeFile(groceriesDBpath, updatedData);
  return "Marked all organic produce as certified";
}

function adjustMeatPrices() {
  // Step 1: Load all data
  const data = readFile(groceriesDBpath);
  
  // Step 2: Update each item conditionally
  const updatedData = data.map((item) => {
    // Check if item is in Meat category
    if (item.category === "Meat") {
      // Reduce price by $1, but don't go below $0 using Math.max
      return { ...item, price: Math.max(0, item.price - 1) };
    }
    // Non-meat items remain unchanged
    return item;
  });
  
  // Step 3: Save changes to file
  writeFile(groceriesDBpath, updatedData);
  return "Reduced all meat prices by $1.00";
}

// =============================================================================
// PUT CHALLENGES (5 minutes)
// =============================================================================

function putItem(filePath, constraintFn, newItemData) {
  // Step 1: Load current data
  const data = readFile(filePath);
  
  // Step 2: Find item to replace
  const itemIndex = data.findIndex(constraintFn);
  
  // Step 3: Handle item not found
  if (itemIndex === -1) {
    return "Item not found";
  }
  
  // Step 4: Save the original ID (we want to preserve this)
  const originalId = data[itemIndex].id;
  
  // Step 5: COMPLETE REPLACEMENT (PUT operation)
  // Replace entire item with newItemData, but keep original ID
  // This DESTROYS all old properties except ID
  data[itemIndex] = { ...newItemData, id: originalId };
  
  // Step 6: Save changes to file
  writeFile(filePath, data);
  return `Item updated: ${JSON.stringify(data[itemIndex])}`;
}

// Challenge 7: Complete replacements
function replaceItem(oldName, newItemData) {
  // Use putItem to completely replace item (except ID)
  // Constraint finds item by old name
  // newItemData completely replaces all properties
  return putItem(groceriesDBpath, 
    (item) => item.name === oldName,  // Find item with this name
    newItemData                       // Replace with this data
  );
}

function upgradeToOrganic(itemName) {
  // Step 1: Load data to get current item info
  const data = readFile(groceriesDBpath);
  
  // Step 2: Find the item we want to upgrade
  const item = data.find((item) => item.name === itemName);
  if (!item) return "Item not found";
  
  // Step 3: Create organic version with same info but organic=true and higher price
  const organicVersion = {
    name: item.name,           // Keep same name
    category: item.category,   // Keep same category
    price: item.price + 1,     // Increase price by $1
    quantity: item.quantity,   // Keep same quantity
    unit: item.unit,          // Keep same unit
    organic: true             // Make it organic
  };
  
  // Step 4: Use putItem to completely replace with organic version
  return putItem(groceriesDBpath, 
    (item) => item.name === itemName,
    organicVersion
  );
}

// =============================================================================
// ADVANCED CHALLENGES (4 minutes)
// =============================================================================

// Challenge 8: Shopping report function
function generateShoppingReport() {
  // Load all data for analysis
  const data = readFile(groceriesDBpath);
  
  // Count total number of items (array length)
  const totalItems = data.length;
  
  // Calculate total value: sum of (price × quantity) for each item
  // reduce() accumulates a running total starting from 0
  const totalValue = data.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Get unique category names: map gets all categories, Set removes duplicates, [...] converts back to array
  const categories = [...new Set(data.map(item => item.category))];
  
  // Calculate weighted average price: total value ÷ total quantity
  // First get total quantity across all items
  const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);
  const averagePrice = totalValue / totalQuantity;
  
  // Count organic items: filter gets organic items, .length counts them
  const organicCount = data.filter(item => item.organic).length;
  
  // Return object with all calculated statistics
  return {
    totalItems,
    totalValue: Math.round(totalValue * 100) / 100,     // Round to 2 decimal places
    categories,
    averagePrice: Math.round(averagePrice * 100) / 100,  // Round to 2 decimal places
    organicCount
  };
}

// Challenge 10: Inventory management
function lowStockAlert() {
  // Return all items with quantity <= 2, add needsRestock property
  const data = readFile(groceriesDBpath);
  const updatedData = data.map((item) => {
    if (item.quantity <= 2) {
      return { ...item, needsRestock: true };
    }
    return item;
  });
  writeFile(groceriesDBpath, updatedData);
  
  return data.filter(item => item.quantity <= 2);
}

function expensiveItemsReport() {
  // Find all items over $4, group them by category
  const data = readFile(groceriesDBpath);
  const expensiveItems = data.filter(item => item.price > 4);
  
  const groupedByCategory = {};
  expensiveItems.forEach(item => {
    if (!groupedByCategory[item.category]) {
      groupedByCategory[item.category] = [];
    }
    groupedByCategory[item.category].push(item);
  });
  
  return groupedByCategory;
}

// =============================================================================
// BONUS CHALLENGES
// =============================================================================

// Challenge 11: Search function
function searchItems(searchTerm) {
  // Find all items whose name contains the search term (case-insensitive)
  const data = readFile(groceriesDBpath);
  return data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

function filterByMultipleConditions(minPrice, maxPrice, category) {
  // Return items that match ALL conditions
  const data = readFile(groceriesDBpath);
  return data.filter(item => 
    item.price >= minPrice && 
    item.price <= maxPrice && 
    item.category === category
  );
}

// =============================================================================
// TESTING FUNCTIONS
// =============================================================================

function testChallenge(challengeName, testFunction) {
  console.log(`\n=== Testing ${challengeName} ===`);
  console.log("Before:");
  console.log(readFile(groceriesDBpath).slice(0, 2)); // Show first 2 items
  
  const result = testFunction();
  console.log("Result:", result);
  
  console.log("After:");
  console.log(readFile(groceriesDBpath).slice(0, 2)); // Show first 2 items
}

// Usage examples:
// testChallenge("Delete Expensive Items", deleteExpensiveItems);
// testChallenge("Apply Inflation", applyInflation);
// console.log("Shopping Report:", generateShoppingReport());
// console.log("Search 'ch':", searchItems("ch"));

module.exports = {
  // Find functions
  findOne,
  findByCategory,
  findItemsOver,
  
  // Delete functions  
  deleteExpensiveItems,
  deleteLowStock,
  deleteNonOrganic,
  deleteByUnit,
  deleteCheapProduce,
  
  // Patch functions
  applyInflation,
  putOnSale,
  updateQuantity,
  markOrganicProduce,
  adjustMeatPrices,
  
  // Put functions
  replaceItem,
  upgradeToOrganic,
  
  // Advanced functions
  generateShoppingReport,
  lowStockAlert,
  expensiveItemsReport,
  
  // Bonus functions
  searchItems,
  filterByMultipleConditions,
  
  // Testing
  testChallenge
};
