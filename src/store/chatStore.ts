import { create } from 'zustand';
import { useSettingsStore } from './settingsStore';

export interface ChatMessage {
  id?: string;
  role: 'user' | 'model';
  text: string;
  action?: 'DISPLAY_MESSAGE' | 'EXECUTE_TOOL' | 'REQUIRE_INPUT';
  payload?: unknown;
  confidence?: number;
  metadata?: unknown;
  citations?: string[];
}

interface ChatState {
  messages: ChatMessage[];
  input: string;
  isLoading: boolean;
  selectedMessage: ChatMessage | null;
  
  // Actions
  setInput: (input: string) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSelectedMessage: (message: ChatMessage | null) => void;
  handleSend: (text?: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [
    {
      role: 'model',
      text: 'بەخێربێیت بۆ IDG Gateway',
    },
  ],
  input: '',
  isLoading: false,
  selectedMessage: null,

  setInput: (input) => set({ input }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setSelectedMessage: (message) => set({ selectedMessage: message }),

  handleSend: async (text?: string) => {
    const { input, messages, isLoading, addMessage, setInput, setIsLoading } = get();
    
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: messageText };
    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const lang = useSettingsStore.getState().lang || 'ku';
      const isCustomsMode = typeof window !== 'undefined' && window.location.pathname === '/customs';
      const currentModule = isCustomsMode ? 'Customs & Tariff Central Hub' : 'Unified Logistics Dashboard (Main)';
      const customsWorkflowState = isCustomsMode 
        ? 'Active Customs Workspace (Calculations and Border Gateway Regulation)' 
        : 'General Logistics Inquiries';

      const activeContext = {
        language: lang,
        currentModule,
        customsWorkflowState,
        operationalState: {
          realtimeConnectivity: "CONNECTED",
          aiAvailability: "HIGH",
          gatewayHealth: "OPTIMAL",
          customsWorkflow: isCustomsMode ? "ACTIVE_WORKFLOW" : "IDLE"
        }
      };

      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageText,
          history: chatHistory,
          context: activeContext
        }),
      });

      if (!response.ok || !response.body) throw new Error('Failed to get response');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let fullText = '';
      
      // Add empty model message first
      const streamMessageId = Date.now().toString();
      addMessage({ role: 'model', text: '', id: streamMessageId });
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        
        let displayString = fullText;
        try {
          // If it's done or perfectly formed JSON, parse it
          const parsed = JSON.parse(fullText);
          displayString = parsed.payload?.text || fullText;
        } catch {
          // Try to extract payload.text while streaming
          const match = fullText.match(/"text"\s*:\s*"([^]*)/);
          if (match && match[1]) {
            // Remove trailing quotes and slashes added during escape
            let extracted = match[1];
            // Roughly find end of string if it exists
            const endIdx = extracted.lastIndexOf('"');
            if (endIdx > 0) extracted = extracted.substring(0, endIdx);
            
            // Unescape basic newlines for display
            displayString = extracted.replace(/\\n/g, '\n').replace(/\\"/g, '"');
          }
        }
        
        // Update the last message in store (which is our streaming model message)
        set((state) => {
          const newMessages = [...state.messages];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg && lastMsg.role === 'model') {
            lastMsg.text = displayString;
          }
          return { messages: newMessages };
        });
      }

      // Final post-stream parse to capture the structured AI action model fields
      try {
        const parsed = JSON.parse(fullText);
        set((state) => {
          const newMessages = [...state.messages];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg && lastMsg.role === 'model') {
            lastMsg.text = parsed.payload?.text || parsed.text || lastMsg.text;
            lastMsg.action = parsed.action || 'DISPLAY_MESSAGE';
            lastMsg.payload = parsed.payload;
            lastMsg.confidence = parsed.confidence || 0.95;
            lastMsg.metadata = parsed.metadata || {};
            lastMsg.citations = parsed.citations || [];
          }
          return { messages: newMessages };
        });
      } catch (jsonErr) {
        console.warn("Done streaming, but content was not valid JSON. Keeping text-fallback.", jsonErr);
        
        // Attempt manual regex extraction of structure as fallback
        set((state) => {
          const newMessages = [...state.messages];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg && lastMsg.role === 'model' && !lastMsg.action) {
            lastMsg.action = 'DISPLAY_MESSAGE';
            lastMsg.confidence = 0.90;
            lastMsg.metadata = { parsedViaFallback: true };
          }
          return { messages: newMessages };
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({ role: 'model', text: 'ببوورە دووچاری کێشەیەک بووم لە کاتی پەیوەندی کردن بە سێرڤەر.' });
    } finally {
      setIsLoading(false);
    }
  }
}));
