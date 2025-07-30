import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';

const LANGUAGE_FLAGS = {
  'en': '🇺🇸', 'es': '🇪🇸', 'fr': '🇫🇷', 'de': '🇩🇪', 'it': '🇮🇹',
  'pt': '🇧🇷', 'ru': '🇷🇺', 'ja': '🇯🇵', 'ko': '🇰🇷', 'zh': '🇨🇳',
  'ar': '🇸🇦', 'hi': '🇮🇳', 'ur': '🇵🇰', 'tr': '🇹🇷', 'nl': '🇳🇱',
  'sv': '🇸🇪', 'da': '🇩🇰', 'no': '🇳🇴'
};

export default function MessageList({ messages, currentUser }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getMessageForUser = (message, userLanguage) => {
    if (message.sender_language === userLanguage) {
      return message.original_message;
    }
    return message.translations?.[userLanguage] || message.original_message;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <p className="text-lg font-medium mb-2">Welcome to the chat!</p>
          <p className="text-sm text-center">Start a conversation and watch it translate in real-time</p>
        </div>
      ) : (
        messages.map((message) => {
          const isOwnMessage = message.sender_name === currentUser?.userName;
          const displayMessage = getMessageForUser(message, currentUser?.language);
          const isTranslated = message.sender_language !== currentUser?.language;

          return (
            <div
              key={message.id}
              className={`message-enter flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md message-bubble rounded-2xl px-4 py-3 ${
                  isOwnMessage
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white ml-12'
                    : 'bg-white mr-12'
                }`}
              >
                {!isOwnMessage && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs font-medium">
                      {message.sender_name[0].toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-800 text-sm">
                      {message.sender_name}
                    </span>
                    <span className="text-sm">
                      {LANGUAGE_FLAGS[message.sender_language] || '🌐'}
                    </span>
                  </div>
                )}
                
                <p className={`text-sm leading-relaxed ${isOwnMessage ? 'text-white' : 'text-gray-800'}`}>
                  {displayMessage}
                </p>
                
                <div className={`flex items-center justify-between mt-2 text-xs ${
                  isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  <span>{format(new Date(message.timestamp), 'HH:mm')}</span>
                  {isTranslated && (
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      isOwnMessage ? 'bg-blue-400/20 text-blue-100' : 'bg-blue-50 text-blue-600'
                    }`}>
                      Translated
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}