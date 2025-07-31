import React, { useState, useEffect, useCallback } from 'react';
import { ChatMessage, UserPresence } from '@/entities/all';
import { InvokeLLM } from '@/integrations/Core';
import JoinForm from '../components/chat/JoinForm';
import UserList from '../components/chat/UserList';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import { Button } from "@/components/ui/button";
import { LogOut, Wifi, WifiOff } from "lucide-react";

export default function Chat() {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Polling interval for real-time updates
  const POLL_INTERVAL = 2000;

  const updateUserPresence = useCallback(async (userData, isOnline = true) => {
    if (!userData) return;

    try {
      // Find existing presence record
      const existingPresence = await UserPresence?.list();
      const userPresence = existingPresence?.find(
        p => p.user_name === userData.userName && p.group_name === userData.groupName
      );

      const presenceData = {
        group_name: userData.groupName,
        user_name: userData.userName,
        language: userData.language,
        last_seen: new Date().toISOString(),
        is_online: isOnline
      };

      if (userPresence) {
        await UserPresence.update(userPresence.id, presenceData);
      } else {
        await UserPresence.create(presenceData);
      }
    } catch (error) {
      console.error('Error updating user presence:', error);
    }
  }, []);

  const loadMessages = useCallback(async (groupName) => {
    if (!groupName) return;
    
    try {
      const fetchedMessages = await ChatMessage.filter(
        { group_name: groupName },
        '-timestamp',
        100
      );
      setMessages(fetchedMessages.reverse());
      setIsConnected(true);
    } catch (error) {
      console.error('Error loading messages:', error);
      setIsConnected(false);
    }
  }, []);

  const loadUsers = useCallback(async (groupName) => {
    if (!groupName) return;

    try {
      // Clean up old presence records (older than 30 seconds)
      const cutoffTime = new Date(Date.now() - 30000).toISOString();
      const allPresence = await UserPresence.filter(
        { group_name: groupName },
        '-last_seen'
      );

      // Update offline status for old records
      for (const presence of allPresence) {
        if (presence.last_seen < cutoffTime && presence.is_online) {
          await UserPresence.update(presence.id, { is_online: false });
        }
      }

      // Fetch updated user list
      const activeUsers = await UserPresence.filter(
        { group_name: groupName, is_online: true },
        '-last_seen'
      );
      
      setUsers(activeUsers);
      setIsConnected(true);
    } catch (error) {
      console.error('Error loading users:', error);
      setIsConnected(false);
    }
  }, []);

  const translateMessage = async (message, targetLanguages) => {
    if (targetLanguages.length === 0) return {};

    try {
      const prompt = `Translate the following message into the specified languages. Handle informal language, romanized text, and slang appropriately.

Message: "${message}"

Translate into:
${targetLanguages.map(lang => `- ${lang}: (provide translation)`).join('\n')}

Return ONLY a JSON object with language codes as keys and translations as values. Example: {"es": "translated text", "fr": "translated text"}`;

      const result = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          additionalProperties: {
            type: "string"
          }
        }
      });

      return result || {};
    } catch (error) {
      console.error('Translation error:', error);
      return {};
    }
  };

  const handleJoin = async (userData) => {
    setCurrentUser(userData);
    await updateUserPresence(userData, true);
    await loadMessages(userData.groupName);
    await loadUsers(userData.groupName);
  };

  const handleSendMessage = async (messageText) => {
    if (!currentUser || !messageText.trim()) return;

    setIsLoading(true);
    
    try {
      // Get all unique languages from current users
      const activeUsers = await UserPresence.filter(
        { group_name: currentUser.groupName, is_online: true },
        '-last_seen'
      );
      
      const targetLanguages = [...new Set(
        activeUsers
          .map(user => user.language)
          .filter(lang => lang !== currentUser.language)
      )];

      // Translate message to all needed languages
      const translations = await translateMessage(messageText, targetLanguages);

      // Create message with translations
      const messageData = {
        group_name: currentUser.groupName,
        sender_name: currentUser.userName,
        sender_language: currentUser.language,
        original_message: messageText,
        translations,
        timestamp: new Date().toISOString()
      };

      await ChatMessage.create(messageData);
      await updateUserPresence(currentUser, true);
      await loadMessages(currentUser.groupName);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsConnected(false);
    }
    
    setIsLoading(false);
  };

  const handleLeave = async () => {
    if (currentUser) {
      await updateUserPresence(currentUser, false);
    }
    setCurrentUser(null);
    setMessages([]);
    setUsers([]);
  };

  // Set up polling for real-time updates
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(async () => {
      await updateUserPresence(currentUser, true);
      await loadMessages(currentUser.groupName);
      await loadUsers(currentUser.groupName);
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [currentUser, loadMessages, loadUsers, updateUserPresence]);

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentUser) {
        updateUserPresence(currentUser, false);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentUser, updateUserPresence]);

  if (!currentUser) {
    return <JoinForm onJoin={handleJoin} />;
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-gray-800">{currentUser.groupName}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {isConnected ? (
                <>
                  <Wifi className="w-4 h-4 text-green-500" />
                  <span>Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-500" />
                  <span>Disconnected</span>
                </>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLeave}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Leave
          </Button>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block w-80 bg-white/30 backdrop-blur-sm border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold gradient-text">Whisper Bridge</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLeave}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Leave
            </Button>
          </div>
          <div className="bg-white/50 rounded-lg p-3">
            <p className="font-medium text-gray-800">Group: {currentUser.groupName}</p>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              {isConnected ? (
                <>
                  <Wifi className="w-4 h-4 text-green-500" />
                  <span>Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-500" />
                  <span>Reconnecting...</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="p-6">
          <UserList users={users} currentUser={currentUser} />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-white">
        <MessageList messages={messages} currentUser={currentUser} />
        <MessageInput 
          onSendMessage={handleSendMessage} 
          disabled={!isConnected || isLoading}
        />
      </div>

      {/* Mobile Users List */}
      <div className="lg:hidden p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <UserList users={users} currentUser={currentUser} />
      </div>
    </div>
  );
}