import React, { useState } from 'react';
import data from '../data/grouped_ifsc_with_account_length.json';

function Validator() {
  const [ifsc, setIfsc] = useState('');
  const [account, setAccount] = useState('');
  const [result, setResult] = useState('');

  const validate = () => {
    const bankCode = ifsc.slice(0, 4).toUpperCase();
    const bank = data.find(b => b.code === bankCode);
    if (!bank) return setResult('❌ Bank code not found');

    const branch = bank.branches.find(b => b.ifsc === ifsc.toUpperCase());
    if (!branch) return setResult('❌ IFSC code not found');

    if (account.length === branch.account_number_length) {
      setResult('✅ Account number is valid for this IFSC');
    } else {
      setResult(`❌ Expected ${branch.account_number_length} digits, got ${account.length}`);
    }
  };

  return (
    <div className="container">
      <h1>Manual Validator</h1>
      <input type="text" placeholder="Enter IFSC code" value={ifsc} onChange={e => setIfsc(e.target.value)} />
      <input type="text" placeholder="Enter Account Number" value={account} onChange={e => setAccount(e.target.value)} />
      <button onClick={validate}>Validate</button>
      <div className="result">{result}</div>
    </div>
  );
}

export default Validator;
