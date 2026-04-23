import { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import logo from '../../imports/Landbase-removebg-preview.png';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to Landbase Human Resources. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue.toLowerCase());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const getBotResponse = (message: string): string => {
    if (message.includes('job') || message.includes('work') || message.includes('employment')) {
      return 'We have various job opportunities available! You can browse our job portal or I can help you find specific positions. What type of work are you looking for?';
    }
    if (message.includes('apply') || message.includes('application')) {
      return 'To apply for a job, you can click on any job listing and submit your application. Would you like help creating a resume using our Resume Builder?';
    }
    if (message.includes('resume') || message.includes('cv')) {
      return 'Our Resume Builder can help you create a professional resume! Click on "Resume Builder" in the navigation menu to get started.';
    }
    if (message.includes('requirements') || message.includes('document')) {
      return 'Common requirements include: Valid passport, NBI clearance, Medical certificate, Birth certificate, and Educational documents. Specific requirements vary by job and country.';
    }
    if (message.includes('contact') || message.includes('office') || message.includes('location')) {
      return 'You can reach us through our contact form or visit our office. Would you like our contact information?';
    }
    if (message.includes('salary') || message.includes('pay')) {
      return 'Salaries vary by position, location, and employer. You can see salary ranges in our job listings. Would you like to browse available positions?';
    }
    if (message.includes('thank')) {
      return "You're welcome! Is there anything else I can help you with?";
    }
    if (message.includes('hello') || message.includes('hi')) {
      return 'Hello! How can I assist you with your job search or recruitment needs today?';
    }
    return 'Thank you for your question. For specific inquiries, please contact our office or browse our website for more information. Is there anything else I can help you with?';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const quickQuestions = [
    'How do I apply for a job?',
    'What are the requirements?',
    'Tell me about available jobs',
    'How can I contact you?',
  ];

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#17960b] hover:bg-[#17960b]/90 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-50"
        >
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-0 right-0 left-0 sm:bottom-4 sm:right-4 sm:left-auto sm:w-96 h-[85vh] sm:h-[600px] sm:rounded-lg shadow-2xl flex flex-col z-50 border-[#17960b]/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#17960b] to-[#0d5e06] text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Landbase" className="w-8 h-8" />
              <div>
                <h3 className="text-white">Landbase Support</h3>
                <p className="text-white/80 text-xs">We're here to help!</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-[#17960b] text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <p className="break-words text-sm sm:text-base">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="space-y-2 pt-2">
                <p className="text-gray-600 text-sm">Quick questions:</p>
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputValue(question);
                      setTimeout(() => handleSend(), 100);
                    }}
                    className="block w-full text-left text-xs sm:text-sm p-2 rounded-lg border border-[#17960b]/30 text-[#17960b] hover:bg-[#17960b]/5 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 text-sm sm:text-base"
              />
              <Button
                onClick={handleSend}
                className="bg-[#17960b] hover:bg-[#17960b]/90 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
