import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";

export default function MessageInput({ onSendMessage, disabled }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    setSending(true);
    await onSendMessage(message.trim());
    setMessage('');
    setSending(false);
  };

  return (
    <div className="p-4 bg-white/50 backdrop-blur-sm border-t border-gray-200">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <Input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled || sending}
          className="flex-1 bg-white border-gray-200 focus:border-blue-400 transition-colors"
        />
        <Button
          type="submit"
          disabled={!message.trim() || disabled || sending}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
        >
          {sending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </div>
  );
}