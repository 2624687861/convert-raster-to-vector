'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setIsConverting(true);
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
    } finally {
      setIsConverting(false);
    }
  };

  const resetConverter = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  const handleDownload = () => {
    if (result) {
      const link = document.createElement('a');
      link.href = result;
      link.download = 'vectorized_image.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start p-8">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Raster to Vector Converter</h1>
        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div 
              className={`flex items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
              }`}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 cursor-pointer">
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
                  onChange={handleFileChange}
                  className="hidden" 
                />
              </label>
            </div>
            {file && <p className="text-sm text-green-600">File selected: {file.name}</p>}
            <button 
              type="submit" 
              className="w-full py-2 px-4 bg-[#F1B241] hover:bg-[#e0a53e] text-white font-medium rounded-lg text-sm transition-colors duration-300"
              disabled={isConverting}
            >
              {isConverting ? 'Conversion in progress...' : 'Convert'}
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
              onClick={handleDownload}
              className="w-full py-2 px-4 bg-[#4CAF50] hover:bg-[#45a049] text-white font-medium rounded-lg text-sm transition-colors duration-300 mb-2"
            >
              Download
            </button>
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
