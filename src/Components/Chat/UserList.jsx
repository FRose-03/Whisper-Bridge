import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Circle } from "lucide-react";

const LANGUAGE_FLAGS = {
  'en': '🇺🇸', 'es': '🇪🇸', 'fr': '🇫🇷', 'de': '🇩🇪', 'it': '🇮🇹',
  'pt': '🇧🇷', 'ru': '🇷🇺', 'ja': '🇯🇵', 'ko': '🇰🇷', 'zh': '🇨🇳',
  'ar': '🇸🇦', 'hi': '🇮🇳', 'ur': '🇵🇰', 'tr': '🇹🇷', 'nl': '🇳🇱',
  'sv': '🇸🇪', 'da': '🇩🇰', 'no': '🇳🇴'
};

export default function UserList({ users, currentUser }) {
  const onlineUsers = users.filter(user => user.is_online);
  
  return (
    <Card className="glass-effect border-0 shadow-soft h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Online ({onlineUsers.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {onlineUsers.map((user) => (
            <div
              key={`${user.user_name}-${user.language}`}
              className="flex items-center gap-3 p-2 rounded-lg bg-white/50 transition-all duration-200 hover:bg-white/70"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-white text-sm font-medium">
                  {user.user_name[0].toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 online-indicator rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-800 truncate">
                    {user.user_name}
                    {user.user_name === currentUser?.userName && (
                      <span className="text-xs text-blue-600 ml-1">(you)</span>
                    )}
                  </p>
                  <span className="text-lg">
                    {LANGUAGE_FLAGS[user.language] || '🌐'}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {onlineUsers.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <Circle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No users online</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}