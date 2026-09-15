import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, MapPin, Loader2 } from 'lucide-react';
import { isSpeechSupported, createSpeechRecognizer } from '../utils/speechRecognition';
import { fetchReverseGeocode } from '../services/weatherApi';
import Tooltip from './UI/Tooltip';

export default function ChatInput({ onSendMessage, isThinking }) {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const recognizerRef = useRef(null);

  useEffect(() => {
    if (isSpeechSupported()) {
      recognizerRef.current = createSpeechRecognizer({
        onResult: (transcript, isFinal) => {
          setInputText(transcript);
          if (isFinal) {
            setIsListening(false);
          }
        },
        onError: () => {
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        }
      });
    }
  }, []);

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isThinking) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMic = () => {
    if (!isSpeechSupported()) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognizerRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech error:', err);
      }
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const loc = await fetchReverseGeocode(latitude, longitude);
          const city = loc.name || 'Current Location';
          onSendMessage(`What is the weather in ${city}?`);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.warn('Geolocation denied/error:', error);
        alert('Could not retrieve your location. Please check your browser permissions.');
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="p-3 sm:p-4 bg-white/80 dark:bg-slate-900/80 border-t border-slate-200/80 dark:border-slate-800 backdrop-blur-md sticky bottom-0 z-30">
      <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-2">
        {/* Input container */}
        <div className="relative flex-1 flex items-center bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening... Speak your weather query..." : "Ask anything about the weather..."}
            disabled={isThinking}
            className="w-full py-3 pl-4 pr-24 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none disabled:opacity-60"
          />

          {/* Action buttons inside input */}
          <div className="absolute right-2 flex items-center gap-1">
            {/* Geolocation Button */}
            <Tooltip text="Use Current Location">
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={isLocating || isThinking}
                className="p-2 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 rounded-xl hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                {isLocating ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
              </button>
            </Tooltip>

            {/* Mic Voice Input Button */}
            <Tooltip text={isListening ? "Stop Listening" : "Voice Input"}>
              <button
                type="button"
                onClick={toggleMic}
                disabled={isThinking}
                className={`p-2 rounded-xl transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-slate-200/70 dark:hover:bg-slate-700'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim() || isThinking}
          className="p-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {isThinking ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
}
