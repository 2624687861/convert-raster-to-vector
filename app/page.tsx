'use client';

import { useState } from 'react';

export default function Home() {
  // ... (keep your existing state and handleSubmit function)

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Raster to Vector Converter</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
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
            className="w-full py-2 px-4 bg-[#F1B241] hover:bg-[#1D1D1D] text-[#1D1D1D] hover:text-[#F1B241] font-medium rounded-lg text-sm transition-colors duration-300"
          >
            Convert
          </button>
        </form>
        {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
        {result && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Result:</h2>
            <img src={result} alt="Vectorized image" className="max-w-full h-auto rounded-lg shadow-lg" />
          </div>
        )}
      </div>
    </div>
  );
}
