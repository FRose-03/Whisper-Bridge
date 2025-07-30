import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Globe, Users } from "lucide-react";

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴' }
];

export default function JoinForm({ onJoin }) {
  const [formData, setFormData] = useState({
    userName: '',
    groupName: '',
    language: ''
  });
  const [isJoining, setIsJoining] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userName || !formData.groupName || !formData.language) return;
    
    setIsJoining(true);
    await onJoin(formData);
    setIsJoining(false);
  };

  const getLanguageFlag = (code) => {
    const lang = LANGUAGES.find(l => l.code === code);
    return lang ? lang.flag : '🌐';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Whisper Bridge</h1>
          <p className="text-gray-600">Connect across languages in real-time</p>
        </div>

        <Card className="glass-effect shadow-soft border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-800">Join a Group Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userName" className="text-sm font-medium text-gray-700">
                  Your Name
                </Label>
                <Input
                  id="userName"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.userName}
                  onChange={(e) => setFormData({...formData, userName: e.target.value})}
                  className="bg-white/70 border-gray-200 focus:border-blue-400 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="groupName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Group Name
                </Label>
                <Input
                  id="groupName"
                  type="text"
                  placeholder="Enter group name"
                  value={formData.groupName}
                  onChange={(e) => setFormData({...formData, groupName: e.target.value})}
                  className="bg-white/70 border-gray-200 focus:border-blue-400 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Your Language
                </Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData({...formData, language: value})}
                >
                  <SelectTrigger className="bg-white/70 border-gray-200 focus:border-blue-400">
                    <SelectValue placeholder="Select your language">
                      {formData.language && (
                        <div className="flex items-center gap-2">
                          <span>{getLanguageFlag(formData.language)}</span>
                          <span>{LANGUAGES.find(l => l.code === formData.language)?.name}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={!formData.userName || !formData.groupName || !formData.language || isJoining}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
              >
                {isJoining ? 'Joining...' : 'Join Chat'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}