/*
    Takes an LTspice output .log file called fileName
    Converts this data into a table, and appends this table to the current google document.
    The columns are the conditions of the simulation such as input voltage and temperature.
    The rows are the measurements of the simulation such as output voltage and peak inductor current.

    Parameters
        fileName (string): the name of the file that we will read (including the extension like .txt)
*/
function appendTableCurrentSheet(fileName = "Buck 11_29 Updated Models and Verification DCMCCM boundary.txt") {
  var docContent = getFileText(fileName);
  var sheet = SpreadsheetApp.getActiveSheet();
  
  // Split up the content into sections by the delimiter "Measurement: "
  var measurementArray = docContent.split("Measurement: ");
  for (var mAindex = 1; mAindex < measurementArray.length; mAindex++) {
    // https://stackoverflow.com/questions/33293894/splitting-spreadsheet-strings-into-array-values
    var stepLines = measurementArray[mAindex].split("\n");

    // If this is the first measurement, print out the colum names
    if (mAindex == 1) {
      var columnNames = ['Measurement'];
      // Start at index 2, where the steps start
      for (var stepIndex = 2; stepIndex < stepLines.length; stepIndex++) {
        if (stepLines[stepIndex].length <= 1)
          break;
        var stepTabs = stepLines[stepIndex].split("\t");
        // stepTabs[0] is the step number
        // stepTabs[1] is the measurement value
        columnNames.push('Step' + stepTabs[0]);
      }
      sheet.appendRow(columnNames);
    }

    // Logger.log(stepLines);
    var title = stepLines[0];
    Logger.log("Title:" + title);
    var measurementRow = [title];

    // Cycle through the steps for this measurement, and add them
    for (var stepIndex = 2; stepIndex < stepLines.length; stepIndex++) {
      if (stepLines[stepIndex].length <= 1)
        break;
      var stepTabs = stepLines[stepIndex].split("\t");
      // stepTabs[0] is the step number
      // stepTabs[1] is the measurement value
      measurementRow.push(stepTabs[1]);
      Logger.log(stepTabs[1]);
    }
    sheet.appendRow(measurementRow);
  }
}

/*
    Takes a file called fileName, and returns its contents as a string.
    Parameters
        fileName (string): the name of the file that we will read (including the extension like .txt)
    Returns
        docContent (string): the file contents as a string
*/
function getFileText(fileName = "testFile.txt") {
  // https://yagisanatode.com/2018/10/05/google-apps-script-get-file-by-name-with-optional-parent-folder-crosscheck/
  var files = DriveApp.getFilesByName(fileName);

  var filecount = 0;
  
  while(files.hasNext()){
    var file = files.next();
    filecount++;
  };

  // logging (Logger saves afterwards) - https://developers.google.com/apps-script/guides/logging
  Logger.log("Filecount: " + filecount);

  if (filecount) {
    // https://stackoverflow.com/questions/18965508/google-apps-script-read-text-from-a-txt-file
    var docContent = file.getBlob().getDataAsString();
    // Logger.log(docContent);
    return docContent;
  }
  return "Couldn't find a file named: " + fileName;
}

/*
    Tests the getFileText function.
*/
function testGetFileText() {
  // "it1_maya_first.txt"
  // "Automated Verification Example.log"
  var docContent = getFileText("Automated Verification Example.log");
  Logger.log(docContent);
}

/*
    Additional Resources
*/
    // *google apps script edit sheet example
    // https://developers.google.com/apps-script/guides/sheets

    // Google Apps Script Table Datatype
    // https://developers.google.com/apps-script/advanced/tables

    // Google Apps Script Class Sheet
    // https://developers.google.com/apps-script/reference/spreadsheet/sheet
