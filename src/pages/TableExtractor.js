import React from "react";

// Install the `xlsx` package before running this code:
// npm install xlsx

import * as XLSX from "xlsx";

export function extractAndDownloadTables(file) {
  // Step 1: Read the Excel file
  const reader = new FileReader();

  reader.onload = (event) => {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // Step 2: Select the first sheet (or specify the sheet name if necessary)
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Step 3: Convert the sheet to JSON for easier manipulation
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // header: 1 returns an array of arrays

    // Step 4: Define column mappings for each table
    const table1Columns = [3, 4, 2, 7, 10, 11, 14, 8, 9, 15];
    const table2Columns = [16, 17, 20, 23, 21, 22, 18, 19, 24];
    const table3Columns = [25, 26, 27, 28, 29];

    // Step 5: Helper function to extract columns
    function extractColumns(data, columnIndices) {
      return data.map(
        (row) => columnIndices.map((index) => row[index - 1]) // -1 because arrays are 0-based
      );
    }

    // Step 6: Extract data for each table
    const table1 = extractColumns(jsonData, table1Columns);
    const table2 = extractColumns(jsonData, table2Columns);
    const table3 = extractColumns(jsonData, table3Columns);

    // Step 7: Create a new workbook with the extracted tables
    const newWorkbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      newWorkbook,
      XLSX.utils.aoa_to_sheet(table1),
      "Table 1"
    );
    XLSX.utils.book_append_sheet(
      newWorkbook,
      XLSX.utils.aoa_to_sheet(table2),
      "Table 2"
    );
    XLSX.utils.book_append_sheet(
      newWorkbook,
      XLSX.utils.aoa_to_sheet(table3),
      "Table 3"
    );

    // Step 8: Trigger a download of the new Excel file
    const excelBuffer = XLSX.write(newWorkbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Extracted_Tables.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  reader.readAsArrayBuffer(file);
}

// React Component Example

function TableExtractor() {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      extractAndDownloadTables(file);
    }
  };

  return (
    <div>
      <h1>Excel Table Extractor</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
    </div>
  );
}

export default TableExtractor;
