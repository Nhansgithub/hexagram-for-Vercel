import React, { useState } from 'react';
   import InputForm from './components/InputForm';
   import ResultDisplay from './components/ResultDisplay';

   function App() {
     const [result, setResult] = useState('');
     const [preliminaryResult, setPreliminaryResult] = useState('');
     const handleSubmit = async (data) => {
      try {
        const response = await fetch('/api/fortune', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        setResult(result.fortune);
        setPreliminaryResult(result.preliminaryResult);
      } catch (error) {
        console.error('Error:', error);
        setResult('An error occurred. Please try again.');
        setPreliminaryResult('');
      }
    };

     return (
       <div className="App">
         <h1>Hexagram Fortune Teller</h1>
         <InputForm onSubmit={handleSubmit} />
         <ResultDisplay result={result} preliminaryResult={preliminaryResult} />
       </div>
     );
   }

   export default App;