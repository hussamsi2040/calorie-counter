'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CameraIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { analyzeImageContent } from '@/app/lib/gemini';
import type { FoodAnalysisResult as FoodAnalysisResultType } from '@/app/lib/gemini';
import FoodAnalysisResultView from './FoodAnalysisResult';

export default function ImageFoodLogger() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResultType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setAnalysisResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const buffer = await selectedImage.arrayBuffer();
      const result = await analyzeImageContent(buffer);
      setAnalysisResult(result);
    } catch (err) {
      setError('Failed to analyze the image. Please try again or use text input instead.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="flex flex-col items-center">
          {previewUrl ? (
            <div className="relative w-full max-w-md">
              <Image
                src={previewUrl}
                alt="Selected food"
                className="w-full h-auto rounded-lg"
                width={400}
                height={300}
                style={{ width: '100%', height: 'auto' }}
              />
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setPreviewUrl(null);
                  setAnalysisResult(null);
                  setError(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : (
            <>
              <div className="flex space-x-4">
                <label className="cursor-pointer bg-white px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 flex items-center space-x-2">
                  <CameraIcon className="h-5 w-5 text-gray-400" />
                  <span>Take Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>
                <label className="cursor-pointer bg-white px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 flex items-center space-x-2">
                  <PhotoIcon className="h-5 w-5 text-gray-400" />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Take a photo or upload an image of your meal
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {selectedImage && !analysisResult && (
        <button
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Food'}
        </button>
      )}

      {analysisResult && (
        <FoodAnalysisResultView result={analysisResult} isLoading={isAnalyzing} />
      )}
    </div>
  );
} 