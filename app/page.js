'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/vectorize', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setResult(url);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'An error occurred');
        setResult(null);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while processing the image');
      setResult(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Raster to Vector Converter</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setFile(e.target.files[0])} 
          className="mb-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Convert</button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {result && (
        <div>
          <h2 className="text-xl font-bold mb-2">Result:</h2>
          <img src={result} alt="Vectorized image" className="max-w-full h-auto" />
        </div>
      )}
    </div>
  );
}
