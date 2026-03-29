import { create } from 'zustand';

export const useStore = create((set) => ({
  resumeSummary: null,
  isAnalyzing: false,
  error: null,
  
  // Interview state
  isInterviewActive: false,
  currentQuestion: "",
  currentAudioUrl: null,
  chatHistory: [],
  isRecording: false,

  setSummary: (summary) => set({ resumeSummary: summary }),
  setIsAnalyzing: (status) => set({ isAnalyzing: status }),
  setError: (error) => set({ error }),

  startInterview: () => set({ isInterviewActive: true, error: null }),
  setQuestionPhase: (text, audioUrl) => set((state) => ({ 
    currentQuestion: text, 
    currentAudioUrl: audioUrl,
    chatHistory: [...state.chatHistory, { role: 'interviewer', text }]
  })),
  
  addUserResponse: (text) => set((state) => ({
      chatHistory: [...state.chatHistory, { role: 'candidate', text }]
  })),

  setIsRecording: (isRecording) => set({ isRecording })
}));
