/**
 * Speech Recognition utility wrapper for Web Speech API
 */
export function isSpeechSupported() {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

export function createSpeechRecognizer({ onResult, onError, onEnd }) {
  if (!isSpeechSupported()) {
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognizer = new SpeechRecognition();

  recognizer.continuous = false;
  recognizer.interimResults = true;
  recognizer.lang = 'en-US';

  recognizer.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    if (onResult) onResult(transcript, event.results[0].isFinal);
  };

  recognizer.onerror = (event) => {
    console.warn('Speech recognition error:', event.error);
    if (onError) onError(event.error);
  };

  recognizer.onend = () => {
    if (onEnd) onEnd();
  };

  return recognizer;
}
