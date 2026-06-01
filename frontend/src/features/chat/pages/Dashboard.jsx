import React from 'react'
import ReactMarkdown from "react-markdown"
import { useDispatch, useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { useEffect } from 'react'
import { useState } from 'react'
import { setCurrentChatId } from '../chat.slice'
import remarkGfm from "remark-gfm"

// component ke andar

const Dashboard = () => {
  const chat = useChat()
  const { handleDeleteChat } = useChat()
  const dispatch = useDispatch()


  const [chatInput, setChatInput] = useState("")
  const [highlightChat, setHighlightChat] = useState(null)

  const chats = useSelector((state) => state.chat.chats)
  const user = useSelector((state) => state.auth.user.username)
  const userEmail = useSelector((state) => state.auth.user.email)
  const isLoading = useSelector((state) => state.chat.isLoading)

  const firstLetterOfUser = userEmail.charAt(0).toUpperCase()
  const newUser = user.charAt(0).toUpperCase() + user.slice(1)

  const currentChatId = useSelector((state) => state.chat.currentChatId)


  useEffect(() => {
    async function init() {
      chat.initializeSocketConnection()
      await chat.handleGetChats()          // pehle chats load karo
      if (currentChatId) {
        await chat.handleOpenchat(currentChatId)  // phir messages
      }
    }
    init()
  }, [])  // currentChatId ko dependency mein mat daalo — sirf mount pe chalega

  useEffect(() => {
    setHighlightChat(currentChatId)
    openChat(currentChatId)
  }, [currentChatId])

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
    chat.handleOpenchat(chatId, chats)
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
            {firstLetterOfUser}
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">

          {/* New chat */}
          <div className="px-0 py-3">
            <button
              type="button"
              onClick={() => {
                dispatch(setCurrentChatId(null))
                setHighlightChat(null)
              }}
              className='w-full'>
              <div className="w-full flex items-center cursor-pointer gap-2 rounded-[10px] px-3 py-[9px] text-[12px] text-[#666] border border-[#2a2a2a]">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New chat
              </div>
            </button>
          </div>



          <p className='ml-2 text-xs text-gray-400 my-1 mb-3'>Chat history</p>
          {Object.values(chats).reverse().map((chat, i) => (
            <button key={i} onClick={() => {
              openChat(chat.id)
              setHighlightChat(chat.id)
            }} type="button"
              className={`w-full text-left rounded-[10px] px-3 py-2 cursor-pointer flex justify-between text-[12.5px] truncate border ${highlightChat === chat.id
                ? "bg-[#1a1a1a] border-[#2a2a2a] text-[#e8e6e0]"
                : "bg-transparent border-transparent text-[#666]"
                }`}>
              {chat.title}
              <i
                onClick={() => handleDeleteChat(chat.id)}
                className="ri-delete-bin-line hover:text-gray-300 cursor-pointer"></i>
            </button>
          ))}
        </div>

        {/* {user}  */}
        <div className="px-2 py-3 border-t border-[#2a2a2a]">
          <button className='w-full flex '>
            <div className="w-full flex items-center gap-3 rounded-[10px] px-3 text-[12px] text-[#666]">
              <div className="w-[20px] h-[20px] rounded-full bg-[#d4a853] flex items-center justify-center text-[12px] font-semibold text-[#1a1200] select-none">
                {firstLetterOfUser}
              </div>
              <p className='text-sm'>{newUser}</p>
            </div>
            <i
            onClick={()=>console.log("clicked")}
             className="ri-shut-down-line px-2 cursor-pointer hover:text-gray-300 text-gray-500"></i>
          </button>
        </div>

      </aside>

      {/* ── Main ── */}
      <main className="flex flex-col flex-1 min-w-0 bg-[#0a0a0a]">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden px-55 py-6 space-y-6">

          <div className='messages flex-1 space-y-3 overflow-y-auto pr-1 pb-30'>

            {!currentChatId && (
              <div className="flex items-center justify-center text-center mt-50">
                <div className='flex flex-col gap-2'>
                  <i className="ri-perplexity-line text-5xl font-thin"></i>
                  <p className="text-3xl font-medium text-[#e8e6e0]">What do you want to know?</p>
                  <p className="text-1xl text-[#555]">Ask anything — I'll find the answer.</p>
                </div>
              </div>
            )}

            {chats[currentChatId]?.messages.map((message, i) => (
              <div
                key={i}
                className={`max-w-[82%] w-fit rounded-2xl px-4 py-3 text-sm md:text-base ${message.role === 'user'
                  ? 'ml-auto rounded-br-none bg-white/12 text-white'
                  : 'mr-auto text-white/90'
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
                    remarkPlugins={[remarkGfm]}
                  >
                    {message.content}
                  </ReactMarkdown>)}
              </div>
            ))}


            {/* AI thinking animation */}
            {isLoading && (
              <div className="mr-auto max-w-[82%] w-fit">
                <div className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-transparent">

                  {/* Animated orb */}
                  <div className="relative w-7 h-7 shrink-0">
                    <div className="absolute inset-0 rounded-full bg-[#d4a853] opacity-20 animate-ping" />
                    <div className="absolute inset-1 rounded-full bg-[#d4a853] opacity-60 animate-pulse" />
                    <div className="absolute inset-2 rounded-full bg-[#d4a853]" />
                  </div>

                  {/* Thinking text with typewriter dots */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-[13px] text-[#888]">
                      <span>Thinking</span>
                      <span className="flex gap-[3px] ml-1">
                        <span className="w-[5px] h-[5px] rounded-full bg-[#d4a853] animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-[5px] h-[5px] rounded-full bg-[#d4a853] animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-[5px] h-[5px] rounded-full bg-[#d4a853] animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    </div>

                    {/* Shimmer bar */}
                    <div className="w-48 h-[6px] rounded-full bg-[#1e1e1e] overflow-hidden">
                      <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-transparent via-[#d4a853] to-transparent animate-[shimmer_1.5s_ease-in-out_infinite]" />
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
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
              className="w-9 h-9 rounded-lg cursor-pointer bg-[#d4a853] flex items-center justify-center shrink-0">
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

