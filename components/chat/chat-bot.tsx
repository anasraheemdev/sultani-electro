"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Sun, Sparkles, Minimize2 } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const WELCOME_MESSAGE = `👋 **Welcome to Electro Sultani!**

I'm your AI assistant, here to help you with:

- ☀️ **Solar Panels** - Premium quality from top brands
- 🔋 **Inverters & Batteries** - Complete energy solutions
- 💡 **Installation** - Professional services across Pakistan
- 💰 **Pricing & Quotes** - Get the best deals

How can I assist you today?`;

const QUICK_QUESTIONS = [
    "What solar panels do you offer?",
    "How much can I save with solar?",
    "What's the price of a 5kW system?",
    "Do you provide installation?",
];

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: WELCOME_MESSAGE,
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPulse, setShowPulse] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Check for mobile screen size
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && !isMinimized) {
            inputRef.current?.focus();
        }
    }, [isOpen, isMinimized]);

    // Hide pulse after first open
    useEffect(() => {
        if (isOpen) {
            setShowPulse(false);
        }
    }, [isOpen]);

    const sendMessage = async (content: string) => {
        if (!content.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: content.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            // Build conversation history for context
            const conversationHistory = messages
                .filter((m) => m.id !== "welcome")
                .map((m) => ({
                    role: m.role,
                    content: m.content,
                }));

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: content,
                    conversationHistory,
                }),
            });

            const data = await response.json();

            if (data.success && data.message) {
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: data.message,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, assistantMessage]);
            } else {
                throw new Error(data.error || "Failed to get response");
            }
        } catch (error) {
            console.error("Chat Error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I apologize, but I'm having trouble connecting right now. Please try again or contact us directly at **0322 7858264**.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(inputValue);
    };

    const handleQuickQuestion = (question: string) => {
        sendMessage(question);
    };

    return (
        <>
            {/* Chat Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-primary to-cyan-500 rounded-full shadow-2xl flex items-center justify-center group"
                    >
                        {/* Pulse Animation */}
                        {showPulse && (
                            <>
                                <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30" />
                                <span className="absolute inset-0 rounded-full bg-primary animate-pulse opacity-20" />
                            </>
                        )}
                        <MessageCircle className="h-7 w-7 text-white" />

                        {/* Tooltip */}
                        <div className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Chat with us! 💬
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            height: isMinimized ? "auto" : (isMobile ? "520px" : "600px")
                        }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[320px] max-w-[calc(100vw-32px)] sm:w-[380px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200"
                        style={{ maxHeight: isMinimized ? "auto" : "85vh" }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary to-cyan-500 p-3 sm:p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <Image
                                        src="/logo.png"
                                        alt="Electro Sultani"
                                        width={28}
                                        height={28}
                                        className="h-5 w-auto sm:h-6 object-contain brightness-0 invert"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-sm sm:text-base leading-tight">Electro Sultani</h3>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-300 rounded-full animate-pulse" />
                                        <span className="text-white/80 text-[10px] sm:text-xs">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <button
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                                >
                                    <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                                >
                                    <X className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4 bg-gray-50">
                                    {messages.map((message) => (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                                        >
                                            {/* Avatar */}
                                            <div
                                                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${message.role === "user"
                                                    ? "bg-primary text-white"
                                                    : "bg-gradient-to-br from-primary/20 to-cyan-500/20"
                                                    }`}
                                            >
                                                {message.role === "user" ? (
                                                    <User className="h-4 w-4" />
                                                ) : (
                                                    <Bot className="h-4 w-4 text-primary" />
                                                )}
                                            </div>

                                            {/* Message Bubble */}
                                            <div
                                                className={`max-w-[75%] rounded-2xl px-4 py-3 ${message.role === "user"
                                                    ? "bg-primary text-white rounded-tr-sm"
                                                    : "bg-white shadow-sm border border-gray-100 rounded-tl-sm"
                                                    }`}
                                            >
                                                <div className={`text-sm prose prose-sm max-w-none break-words ${message.role === "user" ? "prose-invert" : ""
                                                    }`}>
                                                    <ReactMarkdown
                                                        components={{
                                                            p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                                                            ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                                                            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                                                            li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
                                                            strong: ({ children }) => <strong className="font-bold text-current">{children}</strong>,
                                                            h1: ({ children }) => <h4 className="font-bold text-lg mb-3 mt-4 first:mt-0">{children}</h4>,
                                                            h2: ({ children }) => <h4 className="font-bold text-base mb-2 mt-3 first:mt-0">{children}</h4>,
                                                            h3: ({ children }) => <h4 className="font-semibold text-sm mb-1 mt-2 first:mt-0">{children}</h4>,
                                                        }}
                                                    >
                                                        {message.content}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Loading Indicator */}
                                    {isLoading && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex gap-3"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center">
                                                <Bot className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                                                    <span className="text-sm text-gray-500">Typing...</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Quick Questions */}
                                <div className="px-3 py-2 border-t border-gray-100 bg-white">
                                    <div
                                        className="flex flex-nowrap gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1"
                                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                    >
                                        {QUICK_QUESTIONS.map((question, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleQuickQuestion(question)}
                                                className="flex-shrink-0 whitespace-nowrap px-2.5 py-1 bg-gray-50 hover:bg-primary/10 text-gray-700 hover:text-primary text-[10px] font-medium rounded-full transition-all border border-gray-100"
                                            >
                                                {question}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Input */}
                                <form onSubmit={handleSubmit} className="p-2 sm:p-4 border-t border-gray-100 bg-white">
                                    <div className="flex items-center gap-2">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder="Message..."
                                            disabled={isLoading}
                                            className="flex-1 px-3 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/20"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!inputValue.trim() || isLoading}
                                            className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-primary to-cyan-500 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-50"
                                        >
                                            <Send className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="mt-2 text-center">
                                        <a
                                            href="https://www.obrixlabs.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[8px] sm:text-[10px] text-gray-400 uppercase tracking-widest hover:text-primary transition-colors font-medium"
                                        >
                                            Powered by <span className="font-bold border-b border-primary/20">ObrixLabs</span>
                                        </a>
                                    </div>
                                </form>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
