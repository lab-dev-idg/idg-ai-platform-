import { create } from 'zustand';
import { useSettingsStore } from './settingsStore';
import { useAuthStore } from './authStore';

export interface ChatMessage {
  id?: string;
  role: 'user' | 'model';
  text: string;
  action?: 'DISPLAY_MESSAGE' | 'EXECUTE_TOOL' | 'REQUIRE_INPUT';
  payload?: unknown;
  confidence?: number;
  metadata?: unknown;
  citations?: string[];
  timestamp?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface ChatState {
  messages: ChatMessage[];
  chats: ChatSession[];
  activeChatId: string | null;
  input: string;
  isLoading: boolean;
  selectedMessage: ChatMessage | null;
  
  // Actions
  setInput: (input: string) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSelectedMessage: (message: ChatMessage | null) => void;
  createNewChat: () => void;
  loadChats: () => Promise<void>;
  selectChat: (chatId: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  handleSend: (text?: string) => Promise<void>;
}

// Helper to get default greeting based on active language
const getDefaultGreeting = (): string => {
  const lang = useSettingsStore.getState().lang || 'ku';
  if (lang === 'ar') {
    return 'مرحباً بك في بوابة العراق الرقمية (IDG Gateway). كيف يمكنني مساعدتك في شؤون الجمارك والخدمات اللوجستية الوطنية اليوم؟';
  } else if (lang === 'en') {
    return 'Welcome to the Iraq Digital Gateway (IDG Gateway). How can I assist you with national customs and logistics operations today?';
  }
  return 'بەخێربێیت بۆ بوابة العراق الرقمية (IDG Gateway). چۆن دەتوانم یارمەتیت بدەم لە کاروباری گومرگ و دەروازە نیشتمانییەکاندا؟';
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [
    {
      role: 'model',
      text: getDefaultGreeting(),
    },
  ],
  chats: [],
  activeChatId: null,
  input: '',
  isLoading: false,
  selectedMessage: null,

  setInput: (input) => set({ input }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setSelectedMessage: (message) => set({ selectedMessage: message }),

  /**
   * Resets the active chat session to start a brand new conversation
   */
  createNewChat: () => {
    set({
      activeChatId: null,
      messages: [
        {
          role: 'model',
          text: getDefaultGreeting(),
        },
      ],
      input: '',
    });
  },

  /**
   * Loads all historical chats belonging to the active user
   */
  loadChats: async () => {
    try {
      const userId = useAuthStore.getState().user?.uid || 'guest_user';
      const response = await fetch(`/api/chats?userId=${userId}`);
      if (response.ok) {
        const chatsList = await response.json();
        set({ chats: chatsList });
      }
    } catch (err) {
      console.error("Zustand chatStore loadChats failure:", err);
    }
  },

  /**
   * Selects an existing chat and populates the feed with loaded messages
   */
  selectChat: async (chatId: string) => {
    set({ isLoading: true, activeChatId: chatId });
    try {
      const response = await fetch(`/api/chat/${chatId}`);
      if (response.ok) {
        const detail = await response.json();
        const activeMessages: ChatMessage[] = detail.messages || [];
        
        // If there are no messages, fall back to default greeting
        if (activeMessages.length === 0) {
          set({
            messages: [{ role: 'model', text: getDefaultGreeting() }]
          });
        } else {
          set({
            messages: activeMessages.map(m => ({
              role: m.role,
              text: m.text,
              timestamp: m.timestamp
            }))
          });
        }
      } else {
        console.warn(`Failed to resolve details for chat ${chatId}`);
      }
    } catch (err) {
      console.error("Zustand selectChat error:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Deletes a chat session
   */
  deleteChat: async (chatId: string) => {
    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        // Refresh local listings
        await get().loadChats();
        
        // If we deleted the actively opened chat, reset back to new state
        if (get().activeChatId === chatId) {
          get().createNewChat();
        }
      }
    } catch (err) {
      console.error("Zustand deleteChat error:", err);
    }
  },

  /**
   * Sends user prompt. Unified for single source of truth: Title and Chat Session are both generated backend.
   */
  handleSend: async (text?: string) => {
    const { input, isLoading, activeChatId, addMessage, setInput, setIsLoading, loadChats } = get();
    
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    // 1. Instantly append user's prompt to UI state for responsive tactile feedback
    const userMessage: ChatMessage = { role: 'user', text: messageText };
    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const lang = useSettingsStore.getState().lang || 'ku';
      const isCustomsMode = typeof window !== 'undefined' && window.location.pathname === '/customs';
      const currentModule = isCustomsMode ? 'Customs & Tariff Central Hub' : 'Unified Logistics Dashboard (Main)';
      const customsWorkflowState = isCustomsMode 
        ? 'Active Customs Workspace (Calculations and Border Gateway Regulation)' 
        : 'General Logistics Inquiries';

      const userId = useAuthStore.getState().user?.uid || 'guest_user';

      const activeContext = {
        userId,
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

      // 2. Perform REST API invocation to single orchestrator entry-point
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageText,
          chatId: activeChatId || undefined,
          context: activeContext
        }),
      });

      if (!response.ok) {
        throw new Error('Sovereign node returned error response status.');
      }

      const rawData = await response.json();
      
      // Target response format: { chatId, title, response, createdAt }
      const newChatId = rawData.chatId;
      const modelText = rawData.response;

      // 3. Update the active chatId dynamically (frontend never generates titles or IDs)
      set({ activeChatId: newChatId });

      // 4. Append model response to UI feed
      addMessage({
        role: 'model',
        text: modelText,
        confidence: 0.98,
        action: 'DISPLAY_MESSAGE'
      });

      // 5. Trigger instant silent background refresh of lists to show new/renamed sessions instantly
      await loadChats();
    } catch (error) {
      console.error('Unified handleSend error:', error);
      addMessage({ 
        role: 'model', 
        text: lang === 'ar' 
          ? 'عذراً، حدث خطأ أثناء محاولة الاتصال بالخادم المركزي.' 
          : 'ببوورە دووچاری کێشەیەک بووم لە کاتی پەیوەندی کردن بە سێرڤەری سەرەکی.' 
      });
    } finally {
      setIsLoading(false);
    }
  }
}));
