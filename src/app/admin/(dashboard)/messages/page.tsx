"use client";

import { useState, useEffect } from "react";

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState<Message | null>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages);
        }
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleReadStatus = async (msg: Message) => {
    try {
      const res = await fetch("/api/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: msg.id, isRead: !msg.isRead }),
      });

      if (res.ok) {
        fetchMessages();
        if (activeMessage && activeMessage.id === msg.id) {
          setActiveMessage({ ...activeMessage, isRead: !msg.isRead });
        }
      }
    } catch (err) {
      console.error("Failed to toggle read status:", err);
    }
  };

  const handleDelete = async (deleteId: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`/api/messages?id=${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchMessages();
        if (activeMessage && activeMessage.id === deleteId) {
          setActiveMessage(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const selectMessage = (msg: Message) => {
    setActiveMessage(msg);
    if (!msg.isRead) {
      toggleReadStatus(msg);
    }
  };

  return (
    <div className="space-y-8 font-mono h-[calc(100vh-140px)] flex flex-col">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Messages Inbox</h1>
        <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">
          Read transmissions received from the contact form
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
        {/* Messages List */}
        <div className="lg:col-span-1 border border-white/5 bg-white/[0.01] rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-bg-card font-bold text-xs uppercase text-accent-cyan flex justify-between items-center">
            <span>Inbox Items</span>
            <span className="text-[10px] bg-accent-cyan/15 px-2 py-0.5 rounded text-accent-cyan">
              {messages.filter(m => !m.isRead).length} unread
            </span>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6 text-center italic text-xs text-text-muted">
              Inbox is empty.
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto divide-y divide-white/5">
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => selectMessage(msg)}
                  className={`w-full text-left p-4 transition-all hover:bg-white/[0.03] flex flex-col gap-1.5 ${
                    activeMessage?.id === msg.id
                      ? "bg-accent-cyan/5 border-l-2 border-accent-cyan"
                      : !msg.isRead
                      ? "bg-accent-cyan/[0.02] font-semibold"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className={`text-xs ${!msg.isRead ? "text-text-primary" : "text-text-secondary"}`}>
                      {msg.name}
                    </span>
                    <span className="text-[8px] text-text-muted">
                      {new Date(msg.createdAt).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <span className="text-[9px] text-text-muted truncate w-full">{msg.email}</span>
                  <p className="text-[10px] text-text-secondary truncate w-full font-sans mt-1">
                    {msg.message}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail View */}
        <div className="lg:col-span-2 border border-white/5 bg-white/[0.01] rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-bg-card font-bold text-xs uppercase text-accent-purple">
            Message details
          </div>

          {activeMessage ? (
            <div className="flex-1 flex flex-col justify-between p-6">
              <div className="space-y-6">
                {/* Meta details */}
                <div className="flex justify-between items-start gap-4 border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-100">{activeMessage.name}</h3>
                    <p className="text-xs text-accent-cyan">
                      Email: <a href={`mailto:${activeMessage.email}`} className="hover:underline">{activeMessage.email}</a>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-text-muted block">
                      {new Date(activeMessage.createdAt).toLocaleString("id-ID")}
                    </span>
                    <button
                      onClick={() => toggleReadStatus(activeMessage)}
                      className="mt-2 text-[8px] font-bold uppercase tracking-wider text-text-muted hover:text-accent-cyan border border-white/10 px-2 py-0.5 rounded"
                    >
                      Mark as {activeMessage.isRead ? "Unread" : "Read"}
                    </button>
                  </div>
                </div>

                {/* Content Message */}
                <div className="p-4 rounded-lg bg-bg-secondary border border-white/5 min-h-[150px] font-sans text-sm text-text-secondary leading-relaxed break-words whitespace-pre-wrap">
                  {activeMessage.message}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                <a
                  href={`mailto:${activeMessage.email}?subject=Re: CYBER.DEV Portfolio Message`}
                  className="px-4 py-2 bg-accent-cyan text-bg-primary text-xs font-bold rounded-lg btn-glow-cyan hover:scale-[1.02] transition-all"
                >
                  Reply via Email
                </a>
                <button
                  onClick={() => handleDelete(activeMessage.id)}
                  className="px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-bold rounded-lg transition-all"
                >
                  Delete Message
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-text-muted italic">
              Select a message from the list to view its contents.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
