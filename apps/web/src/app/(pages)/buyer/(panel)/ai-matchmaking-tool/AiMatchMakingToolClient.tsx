"use client"
import { MatchmakerChat } from "@/components/web/AIMatchmaking/MatchmakerChat"
import { BestMatches } from "@/components/web/AIMatchmaking/BestMatches"
import { useState } from "react"


export default function AiMatchMakingToolClient() {
  const [userSelections, setUserSelections] = useState<any>({})

  const handleSelectionsChange = (selections: any) => {
    setUserSelections(selections)
  }

  return (
    <div className="h-screen bg-[#0c1012] text-white flex overflow-hidden">
      {/* Main Content - Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-6 overflow-hidden">
          <MatchmakerChat onSelectionsChange={handleSelectionsChange} />
        </div>
      </div>

      {/* Right Sidebar - Full Height */}
      <div className="w-96 bg-[#101518] border-l border-[#333638] flex-shrink-0">
        <BestMatches userSelections={userSelections} />
      </div>
    </div>
  )
}
