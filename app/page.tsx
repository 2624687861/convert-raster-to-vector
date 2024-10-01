'use client';

import { useState } from 'react';
import Image from 'next/image';

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

  const resetConverter = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start p-8">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Raster to Vector Converter</h1>
        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">
                    Max image size: 3 megapixels, 30MB file size
                  </p>
                </div>
                <input 
                  id="file-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                  className="hidden" 
                />
              </label>
            </div>
            <button 
              type="submit" 
              className="w-full py-2 px-4 bg-[#F1B241] hover:bg-[#e0a53e] text-white font-medium rounded-lg text-sm transition-colors duration-300"
            >
              Convert
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="relative w-full h-96 bg-white rounded-lg shadow-md">
              <Image 
                src={result} 
                alt="Vectorized image" 
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
            <button 
              onClick={resetConverter}
              className="w-full py-2 px-4 bg-[#F1B241] hover:bg-[#e0a53e] text-white font-medium rounded-lg text-sm transition-colors duration-300"
            >
              Convert Another
            </button>
          </div>
        )}
        {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
