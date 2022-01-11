// This Google Script searchs on your Gmail account, and store the results on a Google Sheet file

var AVOID_REPEATED_ADDRESS = true; // gets each email address just once on sheet if set to true

// Main function, the one that you must select before run

function saveDates() {

  // Select active spreadsheet
  // console.log("Clearing sheet...");
  /*
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[1];
  */

  var sheet = SpreadsheetApp.openById("1lJcR4k8ljdOugj_gB881zte1o0LQmmPOr-7e2fJZz04").getSheetByName("recontacting(new)");

  // Add Sheet header columns ✏️ i.e. adds 'Date' column to right of 'email' column
  sheet.insertColumnAfter(4);
  var newcol = sheet.getRange("E1");
  var lastRow = sheet.getLastRow();
  newcol.setValue("Contact_Date");
  var SEARCH_QUERY = sheet.getRange(2, 4, lastRow-1).getValues(); 
    
  for (let i = 0; i < SEARCH_QUERY.length; i++) {
    var email = SEARCH_QUERY[i]; 

    console.log(`Searching for: "${email}"`);
    var start = 0;
    var max = 500;
    
    var threads = GmailApp.search(email, start, max);
    if (threads!=null){
      console.log("Threads found 🎉");
      console.log("Collecting last date contacted...");
    } else {
      console.warn("No emails found within search criteria 😢");
      return;
    }
    
    var totalEmails = 0;
    var contact_date = [];
    var addresses = [];

    var thread = threads[0];
    var data = thread.getLastMessageDate(); //this may be redundant, check
    var msgs = threads[0].getMessages(); // formerely var msgs = threads[0].getMessages();
    var msg = msgs[0]

    // Values to get and store ✏️
    var data = msg.getDate();          
    var to = msg.getTo();
    var last_date_contacted = [data]; // formerely said: var dataLine = [data,from,to];

    // Add values to array --> may be redundant also, check
    if (!AVOID_REPEATED_ADDRESS || (AVOID_REPEATED_ADDRESS && !addresses.includes(to))){
      contact_date.push(last_date_contacted);
      addresses.push(to);
    }
      
        // Add Dates to sheet
    var row = i + 2
    var destination_col = sheet.getRange(row, 5);
    destination_col.setValues(contact_date);

    }
    
    //fix this: not doing anything at the moment
    totalEmails = totalEmails + SEARCH_QUERY.length;
    console.info(totalEmails + " dates added to sheet 🎉");
  
  
}

// Original: https://github.com/TiagoGouvea/gmail-to-google-sheets-script/

