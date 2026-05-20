import React from "react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Bot, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { ChatMessage } from "@/store/chatStore";

export function MessageItem({ msg, onClick }: { msg: ChatMessage; onClick?: () => void }) {
  const isUser = msg.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-start" : "justify-end"}`}
    >
      <div className={`flex gap-3 max-w-[85%] ${isUser ? "flex-row" : "flex-row-reverse"}`}>
        <Avatar className={`w-8 h-8 mt-1 border shadow-sm ${isUser ? "bg-slate-200" : "bg-[#0066ff]"}`}>
          <AvatarFallback className={isUser ? "bg-slate-200 text-slate-700" : "bg-[#0066ff] text-white"}>
            {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </AvatarFallback>
        </Avatar>

        <div
          onClick={onClick}
          className={`group relative p-4 rounded-2xl shadow-sm cursor-pointer ${
            !isUser ? 'ai-bubble' : 'bg-slate-100 text-slate-800'
          }`}
        >
          <div className="prose prose-sm max-w-none break-words">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
               {msg.text || (msg.role === 'model' ? "..." : "")}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
