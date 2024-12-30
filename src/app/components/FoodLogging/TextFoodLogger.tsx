'use client';

import { useState, useEffect } from 'react';
import { MicrophoneIcon } from '@heroicons/react/24/outline';
import { analyzeTextDescription } from '@/app/lib/gemini';
import type { FoodAnalysisResult as FoodAnalysisResultType } from '@/app/lib/gemini';
import FoodAnalysisResultView from './FoodAnalysisResult';

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
    length: number;
    item(index: number): { [key: number]: { transcript: string } };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

export default function TextFoodLogger() {
  const [foodDescription, setFoodDescription] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResultType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let recognition: SpeechRecognition | null = null;

    if (voiceMode && 'webkitSpeechRecognition' in window) {
      // @ts-expect-error - webkitSpeechRecognition is not in the TypeScript types
      recognition = new webkitSpeechRecognition();
      if (!recognition) return;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        setFoodDescription(transcript.trim());
        setAnalysisResult(null);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setVoiceMode(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (voiceMode && recognition) {
          recognition.start();
        }
      };

      try {
        recognition.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        setVoiceMode(false);
      }
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (error) {
          console.error('Failed to stop speech recognition:', error);
        }
      }
    };
  }, [voiceMode]);

  const handleVoiceModeToggle = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser');
      return;
    }
    setVoiceMode(!voiceMode);
  };

  const handleAnalyze = async () => {
    if (!foodDescription.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeTextDescription(foodDescription);
      setAnalysisResult(result);
    } catch (err) {
      setError('Failed to analyze the description. Please try rephrasing or using image input instead.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={foodDescription}
          onChange={(e) => {
            setFoodDescription(e.target.value);
            setAnalysisResult(null);
          }}
          placeholder={voiceMode ? 'Start speaking...' : "Describe your meal (e.g., 'a grilled chicken sandwich with lettuce and tomato')"}
          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          readOnly={voiceMode}
        />
        <button
          onClick={handleVoiceModeToggle}
          className={`absolute bottom-3 right-3 p-2 rounded-full ${
            isListening ? 'bg-red-500' : voiceMode ? 'bg-indigo-500' : 'bg-gray-200'
          } hover:bg-opacity-80 transition-colors`}
          title={voiceMode ? 'Stop voice mode' : 'Start voice mode'}
        >
          <MicrophoneIcon className={`h-5 w-5 ${isListening || voiceMode ? 'text-white' : 'text-gray-600'}`} />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {foodDescription && !analysisResult && (
        <button
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Description'}
        </button>
      )}

      {analysisResult && (
        <FoodAnalysisResultView result={analysisResult} isLoading={isAnalyzing} />
      )}
    </div>
  );
} 