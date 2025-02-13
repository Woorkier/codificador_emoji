"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { decode, encode } from "./encoding"
import { EmojiSelector } from "@/components/emoji-selector"
import { ALPHABET_LIST, EMOJI_LIST } from "./emoji"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export function Base64EncoderDecoderContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Read mode from URL parameters, other state stored locally
  const mode = searchParams.get("mode") || "encode"
  const [inputText, setInputText] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState("😀")
  const [outputText, setOutputText] = useState("")
  const [errorText, setErrorText] = useState("")

  // Update URL when mode changes
  const updateMode = (newMode: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("mode", newMode)
    router.replace(`?${params.toString()}`)
  }

  // Convert input whenever it changes
  useEffect(() => {
    try {
      const isEncoding = mode === "encode"
      const output = isEncoding ? encode(selectedEmoji, inputText) : decode(inputText)
      setOutputText(output)
      setErrorText("")
    } catch (e) {
      setOutputText("")
      setErrorText(`Ops! ${mode === "encode" ? "encoding" : "decoding"}: Verifique o que foi digitado e tenta novamente 😅`)
    }
  }, [mode, selectedEmoji, inputText])

  const handleModeToggle = (checked: boolean) => {
    updateMode(checked ? "encode" : "decode")
    setInputText("") // Clear input text when mode changes
  }

  // Handle initial URL state
  useEffect(() => {
    if (!searchParams.has("mode")) {
      updateMode("encode")
    }
  }, [searchParams, updateMode])

  const isEncoding = mode === "encode"

  return (
    <CardContent className="space-y-4">

      <div className="flex items-center justify-center space-x-2">
        <Label htmlFor="mode-toggle">Descobrir</Label>
        <Switch id="mode-toggle" checked={isEncoding} onCheckedChange={handleModeToggle} color="blue"  />
        <Label htmlFor="mode-toggle">Esconder</Label>
      </div>

      <Textarea
        placeholder={isEncoding ? "Digite o texto que deseja esconder no emoji" : "Cole o emoji para ver a mensagem escondida"}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="min-h-[100px]"
      />

      <div className="font-bold text-sm">Selecione um emoji</div>
      <ScrollArea className="h-[200px] rounded-md border p-4">
        <EmojiSelector
          onEmojiSelect={setSelectedEmoji}
          selectedEmoji={selectedEmoji}
          emojiList={EMOJI_LIST}
          disabled={!isEncoding}
        />
      </ScrollArea>

      <Textarea
        placeholder={isEncoding ? "Emoji com mensagem escondida" : "Mensagem escondida"}
        value={outputText}
        readOnly
        className="min-h-[100px]"
      />
            <div className="text-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link" className="text-sm">
              Como usar esta ferramenta? 🤔
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-center">Como usar esta ferramenta</h2>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-600">Para esconder uma mensagem:</h3>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Selecione "Codificar" no botão abaixo</li>
                  <li>Digite sua mensagem secreta na caixa de texto</li>
                  <li>Escolha um emoji ou letra para esconder sua mensagem</li>
                  <li>Copie o emoji/letra gerado e compartilhe onde quiser</li>
                </ol>
              </div>
        
              <div className="space-y-2">
                <h3 className="font-semibold text-green-600">Para ler uma mensagem escondida:</h3>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Selecione "Decodificar" no botão abaixo</li>
                  <li>Cole o emoji/letra recebido na caixa de texto</li>
                  <li>A mensagem escondida aparecerá automaticamente</li>
                </ol>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {errorText && <div className="text-red-500 text-center">{errorText}</div>}
    </CardContent>
  )
}
