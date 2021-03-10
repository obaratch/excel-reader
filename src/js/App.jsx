import React from "react";
import ExcelJS from "exceljs";

const FileTypes = {
  CSV: "text/csv",
  EXCEL: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};
const FileTypesRev = Object.entries(FileTypes).reduce((obj, [k, v]) => {
  obj[v] = k;
  return obj;
}, {});

const CsvParser = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const text = reader.result;
      const data = text.split("\n").map((line) =>
        line
          .trim()
          .split(",")
          .map((d) => d.trim())
      );
      resolve(data);
    };
  });
};

const ExcelParser = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    const workbook = new ExcelJS.Workbook();
    reader.onload = () => {
      const buffer = reader.result;
      let data = {};
      workbook.xlsx.load(buffer).then((wb) => {
        wb.eachSheet((sheet) => {
          console.log(sheet.name);
          data[sheet.name] = data[sheet.name] || [];
          sheet.eachRow((row) => {
            data[sheet.name] = data[sheet.name].concat([row.values]);
          });
        });
        resolve(data);
      });
    };
  });
};

const Parsers = {
  CSV: CsvParser,
  EXCEL: ExcelParser,
};

export default class App extends React.Component {
  onFileChange = async (event) => {
    const input = event.target;
    const file = input.files[0];
    const type = FileTypesRev[file.type];
    const data = await Parsers[type](file);
    console.log(data);
  };
  render() {
    return (
      <div className="main">
        <input
          type="file"
          accept={Object.values(FileTypes).join(", ")}
          onChange={this.onFileChange}
        />
      </div>
    );
  }
}
