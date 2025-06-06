"use client"
import { MatchmakerChat } from "@/components/web/AIMatchmaking/MatchmakerChat"
import { BestMatches, BestMatchesDrawer } from "@/components/web/AIMatchmaking/BestMatches"
import { useState, useEffect } from "react"

export default function AiMatchMakingToolClient() {
  const [userSelections, setUserSelections] = useState<any>({})
  const [matches, setMatches] = useState<any[]>([])

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [])

  const handleSelectionsChange = (selections: any) => {
    setUserSelections(selections)
  }

  const handleMatchesReceived = (newMatches: any[]) => {
    setMatches(newMatches)
  }

  return (
    <div className="h-[80svh] bg-[#0c1012] text-white flex overflow-hidden flex-col lg:flex-row relative">
      {/* Main Content - Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <div className="flex-1 px-3 py-6 lg:p-6 rounded-lg overflow-hidden flex flex-col">
          <MatchmakerChat 
            onSelectionsChange={handleSelectionsChange}
            onMatchesReceived={handleMatchesReceived}
          />
        </div>
      </div>

      {/* Right Sidebar - Full Height (desktop only) */}
      <div className="hidden lg:block w-full lg:w-96 bg-[#101518] border-l border-[#333638] flex-shrink-0 h-full overflow-hidden relative">
        <BestMatches 
          userSelections={userSelections}
          matches={matches}
        />
      </div>
      {/* Drawer za mobilne uređaje */}
      {matches.length > 0 && (
        <div className="block lg:hidden">
          <BestMatchesDrawer userSelections={userSelections} matches={matches} />
        </div>
      )}
    </div>
  )
}