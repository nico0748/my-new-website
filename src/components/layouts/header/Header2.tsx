"use client"
import type {HeaderProps2} from "../../../types/index"

const Header2 = ({ activeSection, scrollToSection }: HeaderProps2) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#f1e6d1]/95 backdrop-blur-sm border-b border-[#d4c4a8]">
      <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
        <div className="text-xl sm:text-2xl font-bold text-[#333]">NICOLABO</div>
        <nav className="flex gap-4 sm:gap-6">
          <a href="#projects" className="text-sm sm:text-base text-[#666] hover:text-[#333] transition-colors">
            Projects
          </a>
          <a href="#skills" className="text-sm sm:text-base text-[#666] hover:text-[#333] transition-colors">
            Skills
          </a>
          <a href="#timeline" className="text-sm sm:text-base text-[#666] hover:text-[#333] transition-colors">
            Timeline
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Header2