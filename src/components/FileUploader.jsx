import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import data from '../data/grouped_ifsc_with_account_length.json';

function FileUploader() {
  const [results, setResults] = useState([]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const workbook = XLSX.read(evt.target.result, { type: 'binary' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      const validated = rows.map((row, i) => {
        const ifsc = row['IFSC Code']?.toString().toUpperCase();
        const account = row['Account Number']?.toString();

        if (!ifsc || !account) {
          return { row: i + 2, ifsc, account, status: '❌ Missing Data' };
        }

        const bankCode = ifsc.slice(0, 4);
        const bank = data.find(b => b.code === bankCode);
        if (!bank) return { row: i + 2, ifsc, account, status: '❌ Bank Not Found' };

        const branch = bank.branches.find(b => b.ifsc === ifsc);
        if (!branch) return { row: i + 2, ifsc, account, status: '❌ IFSC Not Found' };

        const valid = account.length === branch.account_number_length;
        return {
          row: i + 2,
          ifsc,
          account,
          status: valid ? '✅ Valid' : `❌ Invalid (Expected ${branch.account_number_length})`
        };
      });

      setResults(validated);
    };

    reader.readAsBinaryString(file);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(results);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ValidationResults");
    XLSX.writeFile(workbook, "validated_accounts.xlsx");
  };

  return (
    <div className="container">
      <h1>Excel Validator</h1>
      <input type="file" accept=".xlsx" onChange={handleFile} />

      {results.length > 0 && (
        <>
          <button onClick={downloadExcel} style={{ margin: '15px 0', padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
            Download Validated Excel
          </button>

          <table className="table">
            <thead>
              <tr>
                <th>Row</th>
                <th>IFSC</th>
                <th>Account Number</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i}>
                  <td>{r.row}</td>
                  <td>{r.ifsc}</td>
                  <td>{r.account}</td>
                  <td style={{ color: r.status.startsWith('✅') ? 'green' : 'red' }}>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default FileUploader;
