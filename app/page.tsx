'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 text-center">Raster to Vector Converter</h1>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="file-upload" className="sr-only">Choose file</label>
              <input 
                id="file-upload"
                name="file-upload"
                type="file" 
                accept="image/*" 
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} 
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Convert
            </button>
          </div>
        </form>
        {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
        {result && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Result:</h2>
            <img src={result} alt="Vectorized image" className="max-w-full h-auto rounded-lg shadow-lg" />
          </div>
        )}
      </div>
    </div>
  );
}
