'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Send, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 打开时显示欢迎信息
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // 发送第一条消息请求，获取问候语
      sendFirstMessageGreeting();
    }
  }, [isOpen]);

  const sendFirstMessageGreeting = async () => {
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: '你好',
          isFirstMessage: true,
          // 不提供language参数，让API自动检测
        }),
      });

      const data = await response.json();

      if (data.greeting) {
        const greetingMessage: Message = {
          id: Date.now().toString(),
          type: 'bot',
          content: data.greeting,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, greetingMessage]);
      }
    } catch (error) {
      console.error('Error getting greeting:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userQuestion = inputValue;

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: userQuestion,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 调用 API - 不提供language参数，让API自动检测
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userQuestion,
          isFirstMessage: false,
          // 自动检测语言
        }),
      });

      const data = await response.json();

      // 添加机器人回复
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.answer || data.message || (data.detectedLanguage === 'it' 
          ? '抱歉，我无法处理您的问题。请联系我们的支持团队。'
          : 'I apologize, I cannot process your request. Please contact our support team.'),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling chatbot API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Si è verificato un errore di connessione. Riprova più tardi.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* 浮窗按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="打开客服"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <MessageCircle size={24} />
        )}
      </button>

      {/* 聊天窗口 */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 h-96 bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200 overflow-hidden">
          {/* 头部 */}
          <div className="bg-brand-600 text-white p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base">Assistente Afore Italia</h3>
              <p className="text-xs text-brand-100">🟢 Disponibile 24/7</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-brand-700 p-1 rounded transition-colors"
            >
              <ChevronDown size={20} />
            </button>
          </div>

          {/* 消息区域 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm text-center">
                <div>
                  <p className="text-lg mb-2">👋 Benvenuto!</p>
                  <p>Domanda qualcosa e farò del mio meglio per aiutarti.</p>
                </div>
              </div>
            ) : (
              <>
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        msg.type === 'user'
                          ? 'bg-brand-600 text-white rounded-br-none'
                          : 'bg-gray-200 text-gray-900 rounded-bl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString('it-IT', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-900 px-3 py-2 rounded-lg rounded-bl-none">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* 输入框 */}
          <div className="border-t border-gray-200 p-3 bg-white">
            <div className="flex items-end gap-2">
              <textarea
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Scrivi la tua domanda..."
                className="flex-1 resize-none border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white p-2 rounded transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 模糊背景（可选） */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 bottom-0 right-6"
          style={{
            width: 'auto',
            height: 'auto',
            bottom: '24px',
            right: 'auto',
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
