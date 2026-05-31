import React from 'react'
import ReactMarkdown from "react-markdown"
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { useEffect } from 'react'
import { useState } from 'react'

const Dashboard = () => {
  const chat = useChat()

  const [chatInput, setChatInput] = useState("")

  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  const handleSubmitMessage = (e) => {
    e.preventDefault()

    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) {
      return
    }

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    setChatInput("")
  }

  const openChat = (chatId) => {
    chat.handleOpenchat(chatId)
  }


  return (
    <div
      className="flex h-screen w-full bg-[#0a0a0a] text-[#e8e6e0] overflow-hidden"
      style={{ fontFamily: "'Sora', sans-serif" }}
    >
      {/* ── Sidebar ── */}
      <aside className="w-70 shrink-0 flex flex-col bg-[#111111] border-r border-[#2a2a2a]">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-[18px] border-b border-[#2a2a2a]">
          <span className="text-[15px] font-semibold tracking-tight">Perplexity</span>
          <div className="w-[30px] h-[30px] rounded-full bg-[#d4a853] flex items-center justify-center text-[12px] font-semibold text-[#1a1200] select-none">
            A
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {Object.values(chats).map((chat, i) => (
            <button key={i} onClick={() => { openChat(chat.id) }} type="button"
              className={`w-full text-left rounded-[10px] px-3 py-2 cursor-pointer text-[12.5px] truncate border ${i === 0
                ? "bg-[#1a1a1a] border-[#2a2a2a] text-[#e8e6e0]"
                : "bg-transparent border-transparent text-[#666]"
                }`}>
              {chat.title}
            </button>
          ))}
        </div>

        {/* New chat */}
        <div className="px-2 py-3 border-t border-[#2a2a2a]">
          <div className="w-full flex items-center gap-2 rounded-[10px] px-3 py-[9px] text-[12px] text-[#666] border border-[#2a2a2a]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New chat
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex flex-col flex-1 min-w-0 bg-[#0a0a0a]">

        {/* Top bar */}
        <div className="flex items-center gap-3 px-5 py-[20px] border-b border-[#2a2a2a] bg-[#111111] shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="text-[13.5px] font-medium truncate">What is quantum computing</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-55 py-6 space-y-6">

          <div className='messages flex-1 space-y-3 overflow-y-auto pr-1 pb-30'>
            {chats[currentChatId]?.messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[82%] w-fit rounded-2xl px-4 py-3 text-sm md:text-base ${message.role === 'user'
                  ? 'ml-auto rounded-br-none bg-white/12 text-white'
                  : 'mr-auto border border-white/25 bg-[#0f1626] text-white/90'
                  }`}
              >
                {message.role === 'user' ? (
                  <p>{message.content}</p>
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className='mb-2 last:mb-0'>{children}</p>,
                      ul: ({ children }) => <ul className='mb-2 list-disc pl-5'>{children}</ul>,
                      ol: ({ children }) => <ol className='mb-2 list-decimal pl-5'>{children}</ol>,
                      code: ({ children }) => <code className='rounded bg-white/10 px-1 py-0.5'>{children}</code>,
                      pre: ({ children }) => <pre className='mb-2 overflow-x-auto rounded-xl bg-black/30 p-3'>{children}</pre>
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}              </div>
            ))}
          </div>
          {/* User message */}
          {/* <div className="flex justify-end">
            <div className="max-w-[68%] bg-[#1e1e1e] border border-[#2a2a2a] rounded-[14px] rounded-br-[4px] px-4 py-[10px]">
              <p className="text-[13.5px] text-[#e8e6e0] leading-[1.55]">What is quantum computing and how does it differ from classical computing?</p>
            </div>
          </div>

          ai message
          <div className="flex justify-start gap-[10px] items-start">
            <div className="w-[26px] h-[26px] min-w-[26px] rounded-full bg-[#d4a853] flex items-center justify-center mt-[2px]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1200" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" />
              </svg>
            </div>
            <div className="max-w-[72%] bg-[#151515] border border-[#2a2a2a] rounded-[4px] rounded-tr-[14px] rounded-br-[14px] rounded-bl-[14px] px-4 py-[10px]">
              <p className="text-[13.5px] text-[#e8e6e0] leading-[1.6]">Quantum computing uses quantum bits (qubits) that can exist in superposition — simultaneously 0 and 1 — unlike classical bits. This allows quantum computers to process many possibilities at once.</p>
            </div>
          </div> */}

        </div>

        {/* Input bar */}
        <div className="px-55 pb-1 pt-3 border-t border-[#2a2a2a] bg-[#111111] shrink-0">
          <form className='flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-[6px]' onSubmit={handleSubmitMessage}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent border-none outline-none text-[13.5px] text-[#e8e6e0] placeholder-[#444] py-[6px]"
              style={{ fontFamily: "inherit" }}
            />
            <button
              type='submit'
              disabled={!chatInput.trim()}
              className="w-9 h-9 rounded-lg bg-[#d4a853] flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1200" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </form>
          <p className="text-[11px] text-[#3a3a3a] text-center mt-2">
            Perplexity can make mistakes. Always verify important information.
          </p>
        </div>

      </main>
    </div>
  )

}

export default Dashboard

