import React from "react";
import { Send } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

interface ChatInputAreaProps {
  input: string;
  setInput: (val: string) => void;
  isLoading: boolean;
  handleSend: (text?: string) => Promise<void>;
  placeholder: string;
}

export function ChatInputArea({ input, setInput, isLoading, handleSend, placeholder }: ChatInputAreaProps) {
  return (
    <div className="p-3 md:p-4 border-t">
      <div className="relative flex items-center gap-2 md:gap-3 max-w-4xl mx-auto">
        <Input
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="h-12 md:h-14 rounded-xl md:rounded-2xl chat-input text-sm md:text-base border-2 focus-visible:ring-0"
        />
        <Button
          onClick={() => handleSend()}
          disabled={isLoading}
          className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-[#0066FF] shrink-0 shadow-lg shadow-blue-500/30 hover:bg-[#005ce6] transition-all"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
