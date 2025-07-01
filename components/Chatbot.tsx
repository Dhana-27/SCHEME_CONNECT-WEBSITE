import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Sparkles } from 'lucide-react';
import { ChatMessage, Scheme, UserProfile } from '../types';

interface ChatbotProps {
  schemes: Scheme[];
  userProfile: UserProfile;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ schemes, userProfile, onUpdateProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your personal scheme advisor. I can help you find the perfect grants and loans based on your profile. What would you like to know?',
      timestamp: new Date(),
      suggestions: ['Find schemes for me', 'Check eligibility', 'Update my profile', 'How to apply?']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): ChatMessage => {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let suggestions: string[] = [];

    if (lowerMessage.includes('find') || lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
      const relevantSchemes = schemes.filter(scheme => {
        if (userProfile.category && scheme.targetAudience.toLowerCase().includes(userProfile.category.toLowerCase())) {
          return true;
        }
        if (userProfile.interests.some(interest => 
          scheme.title.toLowerCase().includes(interest.toLowerCase()) ||
          scheme.description.toLowerCase().includes(interest.toLowerCase())
        )) {
          return true;
        }
        return scheme.featured;
      }).slice(0, 3);

      if (relevantSchemes.length > 0) {
        response = `Based on your profile, I found ${relevantSchemes.length} schemes that might interest you:\n\n`;
        relevantSchemes.forEach((scheme, index) => {
          response += `${index + 1}. **${scheme.title}**\n   Amount: ${scheme.amount}\n   Category: ${scheme.category}\n   Success Rate: ${scheme.successRate}%\n\n`;
        });
        suggestions = ['Tell me more about these', 'Check eligibility', 'How to apply?', 'Find more schemes'];
      } else {
        response = 'I couldn\'t find specific schemes matching your profile. Let me help you update your profile to get better recommendations.';
        suggestions = ['Update profile', 'Browse all schemes', 'What information do you need?'];
      }
    } else if (lowerMessage.includes('eligibility') || lowerMessage.includes('eligible')) {
      response = 'To check eligibility, I need some information about you. ';
      if (!userProfile.age) response += 'What\'s your age? ';
      if (!userProfile.income) response += 'What\'s your annual income range? ';
      if (!userProfile.category) response += 'What category do you belong to (Student/Business/Farmer/etc.)? ';
      
      if (userProfile.age && userProfile.income && userProfile.category) {
        const eligibleSchemes = schemes.filter(scheme => {
          return scheme.eligibility.some(criteria => 
            criteria.toLowerCase().includes(userProfile.category!.toLowerCase())
          );
        });
        response = `Based on your profile, you're eligible for ${eligibleSchemes.length} schemes. Would you like me to show them?`;
        suggestions = ['Show eligible schemes', 'Update profile', 'How to apply?'];
      } else {
        suggestions = ['I\'m a student', 'I\'m a business owner', 'I\'m a farmer', 'Update full profile'];
      }
    } else if (lowerMessage.includes('apply') || lowerMessage.includes('application')) {
      response = 'Here\'s the general application process:\n\n1. **Choose a Scheme** - Select the scheme that fits your needs\n2. **Check Eligibility** - Verify you meet all criteria\n3. **Gather Documents** - Prepare required documentation\n4. **Submit Application** - Fill out the online form\n5. **Track Status** - Monitor your application progress\n\nWould you like help with any specific step?';
      suggestions = ['Help me choose', 'What documents needed?', 'Track my application', 'Contact support'];
    } else if (lowerMessage.includes('profile') || lowerMessage.includes('update')) {
      response = 'I can help you update your profile for better recommendations. What would you like to update?';
      suggestions = ['Age and income', 'Education level', 'Business type', 'Location', 'Interests'];
    } else if (lowerMessage.includes('student')) {
      onUpdateProfile({ category: 'Student', interests: [...userProfile.interests, 'Education'] });
      response = 'Great! I\'ve updated your profile as a Student. This will help me recommend education-related schemes and scholarships.';
      suggestions = ['Find education schemes', 'Check scholarship eligibility', 'Update more details'];
    } else if (lowerMessage.includes('business')) {
      onUpdateProfile({ category: 'Business', interests: [...userProfile.interests, 'Business', 'Entrepreneurship'] });
      response = 'Perfect! I\'ve marked you as a Business owner. I can now recommend startup loans, business grants, and entrepreneurship schemes.';
      suggestions = ['Find business loans', 'Startup schemes', 'MSME benefits'];
    } else if (lowerMessage.includes('farmer') || lowerMessage.includes('agriculture')) {
      onUpdateProfile({ category: 'Farmer', interests: [...userProfile.interests, 'Agriculture'] });
      response = 'Excellent! I\'ve updated your profile as a Farmer. I can help you find agricultural loans, crop insurance, and farming subsidies.';
      suggestions = ['Agricultural loans', 'Crop insurance', 'Farming subsidies'];
    } else {
      response = 'I understand you\'re looking for information. I can help you with:\n\n• Finding suitable schemes and grants\n• Checking eligibility criteria\n• Application process guidance\n• Updating your profile for better matches\n\nWhat would you like to explore?';
      suggestions = ['Find schemes for me', 'Check eligibility', 'How to apply?', 'Update profile'];
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: response,
      timestamp: new Date(),
      suggestions
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${isOpen ? 'hidden' : 'flex'} items-center space-x-2`}
      >
        <MessageCircle className="h-6 w-6" />
        <Sparkles className="h-4 w-4 animate-pulse" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Scheme Advisor</h3>
                <p className="text-xs text-purple-100">AI-Powered Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'} rounded-2xl p-3 shadow-sm`}>
                  <div className="flex items-start space-x-2">
                    {message.type === 'bot' && (
                      <Bot className="h-4 w-4 mt-1 text-purple-600 flex-shrink-0" />
                    )}
                    {message.type === 'user' && (
                      <User className="h-4 w-4 mt-1 text-blue-100 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      {message.suggestions && (
                        <div className="mt-3 space-y-1">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="block w-full text-left text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-lg hover:bg-purple-100 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl p-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-purple-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about schemes..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-full hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};