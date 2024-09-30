'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you'll add the logic to send the file to your API
    console.log('File submitted:', file);
  };

  return (
    <div>
      <h1>Raster to Vector Converter</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setFile(e.target.files[0])} 
        />
        <button type="submit">Convert</button>
      </form>
    </div>
  );
}
