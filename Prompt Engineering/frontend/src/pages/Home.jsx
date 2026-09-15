import React from 'react';
import { useChat } from '../context/ChatContext';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import SettingsModal from '../components/SettingsModal';

export default function Home() {
  const { isSettingsOpen, setIsSettingsOpen } = useChat();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <ChatWindow />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
