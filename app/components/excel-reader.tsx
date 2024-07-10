// src/components/ExcelReader.js
import axios from "axios";
import React, { useState } from "react";
import * as XLSX from "xlsx";

const ExcelReader = () => {
  const [data, setData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headers = jsonData[0];
      const requiredColumns = [
        "Name of Staff",
        "Staff Name (Non-Office 365)",
        "Staff ID",
        "Phone",
        "Approved By",
        "Approval Status",
        "Department",
      ];

      const columnIndices = requiredColumns.map((col) => headers.indexOf(col));

      const filteredData = jsonData.slice(1).map((row) => {
        const newRow = columnIndices.map((index) => row[index]);

        // Replace empty cells with 'N/A'
        const processedRow = newRow.map((cell) => (cell ? cell : "N/A"));

        // Handle the Name of Staff and Staff Name (Non-Office 365) logic
        if (processedRow[0] === "N/A" && processedRow[1] !== "N/A") {
          processedRow[0] = processedRow[1];
        } else if (processedRow[1] === "N/A" && processedRow[0] !== "N/A") {
          processedRow[1] = processedRow[0];
        }

        return processedRow;
      });

      // Convert the processed data into an array of objects with firstName and lastName
      const arrayOfObjects = filteredData.map((row) => {
        const obj = {};
        requiredColumns.forEach((col, index) => {
          if (
            col === "Name of Staff" ||
            col === "Staff Name (Non-Office 365)"
          ) {
            const name = row[index];
            const nameParts = name.split(" ");
            const firstName = nameParts.shift();
            const lastName = nameParts.join(" ");
            obj["firstName"] = firstName;
            obj["lastName"] = lastName;
          } else {
            obj[col] = row[index];
          }
        });
        return obj;
      });

      setData(arrayOfObjects);

      arrayOfObjects.forEach(async (element) => {
        const formData = new FormData();
        formData.append("lastName", element["lastName"]);
        formData.append("firstName", element["firstName"]);
        formData.append("staffId", element["Staff ID"]);
        formData.append("phone", element["Phone"]);
        formData.append("rowDepartment", element["Department"]);
        formData.append("rowApprovedBy", element["Approved By"]);

        try {
          await axios.post("/api/import-users", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } catch (error) {
          console.error("Error importing user:", error);
        }
      });
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      {data.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(data[0]).map((col, index) => (
                <th key={index}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(row).map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExcelReader;
