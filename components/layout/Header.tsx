import { ArrowLeft } from "lucide-react"
import { env } from "@/lib/env"

interface HeaderProps {
  showBackButton?: boolean
  onBackClick?: () => void
}

export function Header({ showBackButton = false, onBackClick }: HeaderProps) {
  return (
    <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50 shadow-lg shadow-black/5">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {showBackButton ? (
          <button
            onClick={onBackClick}
            className="font-serif text-xl text-foreground hover:text-primary transition-all duration-300 flex items-center gap-2 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            {env.APP_NAME}
          </button>
        ) : (
          <div className="font-serif text-xl text-foreground">
            <div>{env.APP_NAME}</div>
            <div className="text-xs text-muted-foreground font-sans tracking-wider">
              {env.APP_DESCRIPTION}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}