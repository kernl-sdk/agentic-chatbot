"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";

/* components */
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { MessageResponse } from "@/components/ai-elements/message";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatHeader } from "@/components/chat/chat-header";

const PROMPT_TEMPLATES = [
  "What are the latest trends in AI?",
  "How does machine learning work?",
  "Explain quantum computing",
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export interface ChatProps {
  id?: string;
  initialMessages?: UIMessage[];
  initialChatModel?: string;
}

export function Chat({
  id,
  initialMessages = [],
  initialChatModel,
}: ChatProps) {
  const router = useRouter();
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    id,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: `${API_BASE_URL}/v1/agents/jarvis/stream`,
      prepareSendMessagesRequest: ({ id, messages }) => {
        return {
          body: {
            tid: id,
            message: messages[messages.length - 1],
          },
        };
      },
    }),
  });

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleNewChat = () => {
    router.push("/");
    router.refresh();
  };

  const handleSubmit = (message: PromptInputMessage) => {
    if (message.text.trim()) {
      // on first message, update URL to /chat/:id
      if (messages.length === 0 && id) {
        window.history.replaceState(null, "", `/chat/${id}`);
      }

      sendMessage({ text: message.text });
      setInput("");
    }
  };

  return (
    <div className="relative h-screen">
      {/* fixed header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-background px-6 py-4 flex items-center">
        <div className="mx-auto w-full">
          <ChatHeader
            onNewChat={handleNewChat}
            initialModel={initialChatModel}
          />
        </div>
      </div>

      {/* main content with top padding for fixed header */}
      <div className="h-full pt-[72px] px-6 pb-6">
        {messages.length === 0 ? (
          // greeting mode: centered when no messages
          <div className="flex h-full items-center justify-center max-w-4xl mx-auto">
            <div className="w-full max-w-2xl space-y-4">
              {/* input */}
              <ChatInput
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
                status={status}
              />

              {/* prompt templates */}
              <div className="space-y-2">
                <Suggestions>
                  {PROMPT_TEMPLATES.map((prompt) => (
                    <Suggestion
                      key={prompt}
                      suggestion={prompt}
                      onClick={handleSuggestionClick}
                    />
                  ))}
                </Suggestions>
              </div>
            </div>
          </div>
        ) : (
          // full chat mode
          <div className="flex flex-col h-full max-w-4xl mx-auto">
            <Conversation>
              <ConversationContent>
                {messages.map((message) => (
                  <Message from={message.role} key={message.id}>
                    <MessageContent>
                      {message.parts.map((part, i) => {
                        switch (part.type) {
                          case "text":
                            return (
                              <MessageResponse key={`${message.id}-${i}`}>
                                {part.text}
                              </MessageResponse>
                            );
                          default:
                            return null;
                        }
                      })}
                    </MessageContent>
                  </Message>
                ))}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>

            {/* input */}
            <div className="mt-4 w-full max-w-2xl mx-auto">
              <ChatInput
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
                status={status}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
