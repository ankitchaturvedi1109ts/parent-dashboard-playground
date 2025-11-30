/**
 * Convert a sheet's tabular data into an array of objects using the first row as headers.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - Sheet to read.
 * @returns {Object[]} Array of row objects where keys are header names and values are cell contents.
 */
function sheetToObjects(sheet) {
  // Read the entire data range of the sheet (including headers) into a 2D array.
  var values = sheet.getDataRange().getValues();

  // If the sheet is empty, return an empty array to avoid errors.
  if (!values || values.length === 0) {
    return [];
  }

  // The first row contains the column headers (e.g., "StudentID", "StudentName", etc.).
  var headers = values[0];

  // Convert each subsequent row into an object keyed by the corresponding header.
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var rowValues = values[i];

    // Skip completely blank rows to keep the results tidy.
    if (rowValues.join('') === '') {
      continue;
    }

    var rowObject = {};
    for (var j = 0; j < headers.length; j++) {
      rowObject[headers[j]] = rowValues[j];
    }
    rows.push(rowObject);
  }

  return rows;
}

/**
 * Gather ticket data and student details into a dashboard-friendly structure.
 *
 * Returns an object that contains:
 *  - cards: each ticket paired with its student's name, class, and TMName
 *  - stageCounts: how many tickets exist for each stage
 *
 * This function is designed to be called from the web app front-end via google.script.run.
 * @returns {{cards: Object[], stageCounts: Object<string, number>}}
 */
function getDashboardData() {
  // Open the spreadsheet this script is bound to ("Codex Demo Dashboard").
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Read the Students and Tickets sheets as arrays of objects.
  var studentsSheet = ss.getSheetByName('Students');
  var ticketsSheet = ss.getSheetByName('Tickets');

  var studentRows = sheetToObjects(studentsSheet);
  var ticketRows = sheetToObjects(ticketsSheet);

  // Build a quick lookup table for students keyed by StudentID for easy merging.
  var studentIndex = {};
  studentRows.forEach(function(student) {
    studentIndex[student.StudentID] = student;
  });

  var cards = [];
  var stageCounts = {};

  // Combine ticket data with the matching student information.
  ticketRows.forEach(function(ticket) {
    var student = studentIndex[ticket.StudentID] || {};

    var card = {
      TicketID: ticket.TicketID,
      StudentID: ticket.StudentID,
      StudentName: student.StudentName || '',
      Class: student.Class || '',
      TMName: student.TMName || '',
      Stage: ticket.Stage,
      Severity: ticket.Severity,
      Note: ticket.Note
    };

    cards.push(card);

    // Count how many tickets belong to each stage for the summary.
    var stage = ticket.Stage || 'Unspecified';
    stageCounts[stage] = (stageCounts[stage] || 0) + 1;
  });

  // Return everything the front-end needs to render cards and summary counts.
  return {
    cards: cards,
    stageCounts: stageCounts
  };
}

/**
 * Entry point for the web app deployment.
 *
 * Returns a simple HTML file (index.html) that can call google.script.run.getDashboardData().
 * @param {GoogleAppsScript.Events.DoGet} e - Web request event (unused but included for completeness).
 * @returns {GoogleAppsScript.HTML.HtmlOutput}
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Demo Ticket Dashboard');
}
