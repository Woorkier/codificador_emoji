import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Base64EncoderDecoderContent } from "./encoder-decoder-content"

export default function EncoderDecoder() {
  return (
<div className="min-h-screen bg-gradient-to-br from-blue-400 via-teal-500 to-emerald-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Esconda mensagens em emojis</CardTitle>
        </CardHeader>
        <Suspense fallback={<CardContent>Carregando...</CardContent>}>
          <Base64EncoderDecoderContent />
        </Suspense>
      </Card>
    </div>
  )
}
