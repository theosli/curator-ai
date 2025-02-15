"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Message = {
  sender: "user" | "system"
  content: string
}

export default function EmailSimulator() {
  const [userMessage, setUserMessage] = useState("")
  const [conversation, setConversation] = useState<Message[]>([])

  const A = (message: string): string => {
    // This is a simple response generation. You can make it more complex as needed.
    if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
      return "Hello! How can I assist you today?"
    } else if (message.toLowerCase().includes("help")) {
      return "I'd be happy to help. What do you need assistance with?"
    } else if (message.toLowerCase().includes("bye") || message.toLowerCase().includes("goodbye")) {
      return "Goodbye! Have a great day!"
    } else {
      return `Thank you for your message: "${message}". How else can I help you?`
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userMessage.trim() === "") return

    // Add user message to conversation
    setConversation((prev) => [...prev, { sender: "user", content: userMessage }])

    // Generate and add system response
    const systemResponse = A(userMessage)
    setConversation((prev) => [...prev, { sender: "system", content: systemResponse }])

    setUserMessage("")
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Email Simulator</h1>
      <div className="bg-gray-100 p-4 rounded-lg mb-4 h-96 overflow-y-auto">
        {conversation.map((message, index) => (
          <div key={index} className={`mb-2 ${message.sender === "user" ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block p-2 rounded-lg ${message.sender === "user" ? "bg-blue-500 text-white" : "bg-white"}`}
            >
              {message.content}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type your message here"
          className="flex-grow"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  )
}

