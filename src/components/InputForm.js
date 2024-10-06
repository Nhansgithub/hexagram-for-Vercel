   import React, { useState } from 'react';
   

   function InputForm({ onSubmit }) {
     const [date, setDate] = useState('');
     const [time, setTime] = useState('');
     const [question, setQuestion] = useState('');

     const handleSubmit = (e) => {
       e.preventDefault();
       const dateObj = new Date(date);
       const day = String(dateObj.getDate()).padStart(2, '0');
       const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // tháng bắt đầu từ 0
       const year = dateObj.getFullYear();
       const formattedDate = `${day}/${month}/${year}`;
       onSubmit({ date: formattedDate, time, question });
     };

     return (
       <form onSubmit={handleSubmit}>
         <input
           type="date"
           value={date}
           onChange={(e) => setDate(e.target.value)}
           required
         />
         <input
           type="time"
           value={time}
           onChange={(e) => setTime(e.target.value)}
           required
         />
         <textarea
           value={question}
           onChange={(e) => setQuestion(e.target.value)}
           placeholder="Enter your question"
           required
         />
         <button type="submit">Get Fortune</button>
       </form>
     );
   }

   export default InputForm;