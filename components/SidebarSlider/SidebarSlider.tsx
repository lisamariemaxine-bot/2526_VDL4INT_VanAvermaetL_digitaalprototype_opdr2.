"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react" // For close icon
import { GiHamburgerMenu } from "react-icons/gi" // For hamburger icon

interface SidebarSliderProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function SidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <GiHamburgerMenu size={24} />
    </button>
  )
}

export default function SidebarSlider({ isOpen, onClose, children }: SidebarSliderProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Menu</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
                <X size={24} />
              </button>
            </div>
            <nav>{children}</nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
