   import React from 'react';

   function ResultDisplay({ result, preliminaryResult }) {
     return (
       <div className="result">
         <h2>Your Fortune:</h2>
         <p>{result || 'Submit your question to see your fortune.'}</p>
         <h2>Preliminary Result:</h2>
      <p>{preliminaryResult || 'No preliminary result available.'}</p>
       </div>
     );
   }

   export default ResultDisplay;