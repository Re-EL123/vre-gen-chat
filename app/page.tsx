"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, ImageIcon, Sparkles, Download, Trash2, Send, User, Bot } from "lucide-react"

interface Message {
  role: "user" | "bot"
  content: string
  timestamp: Date
}

export default function AIGenerator() {
  const [mode, setMode] = useState<"chat" | "image">("chat")
  const [username, setUsername] = useState("")
  const [temperature, setTemperature] = useState("1")
  const [messages, setMessages] = useState<Message[]>([])
  const [chatText, setChatText] = useState("")
  const [loading, setLoading] = useState(false)
  const [imgPrompt, setImgPrompt] = useState("")
  const [imgUrl, setImgUrl] = useState("")
  const [imgLoading, setImgLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const queryChat = async (message: string) => {
    try {
      const response = await fetch("https://intellichat-ai-chatbot.p.rapidapi.com/chat", {
        method: "POST",
        headers: {
          "x-rapidapi-key": "82ae10db11mshb41ccacdd991130p108a22jsnf3ae22b94bbd",
          "x-rapidapi-host": "intellichat-ai-chatbot.p.rapidapi.com",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          message: message,
          temperature: temperature,
        }),
      })
      const result = await response.text()
      return result
    } catch (err) {
      console.error(err)
      return "Sorry, I could not generate a response."
    }
  }

  const sendChat = async () => {
    if (!chatText.trim() || loading) return

    const userMessage: Message = {
      role: "user",
      content: chatText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const payload = chatText
    setChatText("")
    setLoading(true)

    const botReply = await queryChat(payload)

    const botMessage: Message = {
      role: "bot",
      content: botReply,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, botMessage])
    setLoading(false)
  }

  const quickUplift = () => {
    const upliftMessage: Message = {
      role: "bot",
      content: "🌟 You are capable of amazing things. Keep going! Your potential is limitless.",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, upliftMessage])
  }

  const generateImage = async () => {
    if (!imgPrompt.trim()) return
    setImgLoading(true)

    try {
      // Mock image generation - replace with actual Hugging Face Flux API
      setTimeout(() => {
        setImgUrl(`/placeholder.svg?height=512&width=512&query=${encodeURIComponent(imgPrompt)}`)
        setImgLoading(false)
      }, 2000)
    } catch (error) {
      console.error("Image generation failed:", error)
      setImgLoading(false)
    }
  }

  const clearAll = () => {
    setMessages([])
    setChatText("")
  }

  const clearImage = () => {
    setImgPrompt("")
    setImgUrl("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 h-[calc(100vh-2rem)]">
          {/* Sidebar */}
          <Card className="glass border-border/50 shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Re-Gen AI
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Chat & Image Generator</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <Tabs value={mode} onValueChange={(value) => setMode(value as "chat" | "image")}>
                <TabsList className="grid w-full grid-cols-2 glass">
                  <TabsTrigger value="chat" className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="image" className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Image
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="text-sm font-medium mb-2 block">
                    Your Name (Optional)
                  </label>
                  <Input
                    id="username"
                    placeholder="Enter your name..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="glass border-border/50"
                  />
                </div>

                <div>
                  <label htmlFor="temperature" className="text-sm font-medium mb-2 block">
                    Creativity Level
                  </label>
                  <Select value={temperature} onValueChange={setTemperature}>
                    <SelectTrigger className="glass border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.2">🎯 Focused (0.2)</SelectItem>
                      <SelectItem value="0.5">⚖️ Balanced (0.5)</SelectItem>
                      <SelectItem value="1">🚀 Creative (1.0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-xs text-muted-foreground">
                    <strong>Note:</strong> Now powered by IntelliChat AI for enhanced conversations.
                  </p>
                </div>

                <Button
                  onClick={clearAll}
                  variant="outline"
                  className="w-full glass border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all duration-200 bg-transparent"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Conversation
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <Card className="glass border-border/50 shadow-2xl flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {mode === "chat" ? "AI Chat Assistant" : "AI Image Generator"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {mode === "chat" ? "Powered by IntelliChat AI" : "Create images with AI (Flux Demo)"}
                  </p>
                </div>
                <Button onClick={quickUplift} variant="secondary" className="glass">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Quick Inspiration
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              {mode === "chat" ? (
                <>
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-auto p-4 space-y-4 glass rounded-lg border border-border/50 mb-4">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Start a conversation with the AI assistant</p>
                        </div>
                      </div>
                    ) : (
                      messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex items-start gap-3 animate-slide-up ${
                            message.role === "user" ? "flex-row-reverse" : ""
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </div>
                          <div className={`max-w-[70%] ${message.role === "user" ? "text-right" : ""}`}>
                            <div
                              className={`p-3 rounded-lg ${
                                message.role === "user"
                                  ? "bg-primary text-primary-foreground ml-auto"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {message.content}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Chat Input */}
                  <div className="flex gap-3">
                    <Input
                      placeholder="Type your message..."
                      value={chatText}
                      onChange={(e) => setChatText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendChat()}
                      className="glass border-border/50"
                      disabled={loading}
                    />
                    <Button onClick={sendChat} disabled={!chatText.trim() || loading} className="px-6">
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Image Generation */}
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Input
                        placeholder="Describe the image you want to generate..."
                        value={imgPrompt}
                        onChange={(e) => setImgPrompt(e.target.value)}
                        className="glass border-border/50"
                      />
                      <Button onClick={generateImage} disabled={!imgPrompt.trim() || imgLoading} className="px-6">
                        {imgLoading ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ImageIcon className="w-4 h-4" />
                        )}
                      </Button>
                      <Button onClick={clearImage} variant="outline" className="glass border-border/50 bg-transparent">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {imgUrl ? (
                      <div className="glass rounded-lg p-4 border border-border/50 animate-fade-in">
                        <img
                          src={imgUrl || "/placeholder.svg"}
                          alt="Generated"
                          className="w-full rounded-lg shadow-lg"
                        />
                        <div className="flex justify-between items-center mt-4">
                          <Badge variant="secondary" className="glass">
                            Generated Image
                          </Badge>
                          <Button asChild variant="outline" size="sm" className="glass bg-transparent">
                            <a href={imgUrl} download="generated-image.png">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 glass rounded-lg border border-border/50 border-dashed">
                        <div className="text-center text-muted-foreground">
                          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Generated images will appear here</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
