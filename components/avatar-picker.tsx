"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// 12 pre-selected DiceBear avatars — consistent style, diverse seeds
const BASE = "https://api.dicebear.com/9.x/avataaars/svg"
const PRESETS = [
  { id: "a1", url: `${BASE}?seed=Arjun&backgroundColor=b6e3f4&clothingColor=3c4f5c` },
  { id: "a2", url: `${BASE}?seed=Priya&backgroundColor=ffd5dc&clothingColor=929598` },
  { id: "a3", url: `${BASE}?seed=Ravi&backgroundColor=d1f0c2&clothingColor=262e33` },
  { id: "a4", url: `${BASE}?seed=Sneha&backgroundColor=ffe4b5&clothingColor=5199e4` },
  { id: "a5", url: `${BASE}?seed=Kiran&backgroundColor=c9e8ff&clothingColor=3c4f5c` },
  { id: "a6", url: `${BASE}?seed=Divya&backgroundColor=e8d5ff&clothingColor=929598` },
  { id: "a7", url: `${BASE}?seed=Arun&backgroundColor=fff3cd&clothingColor=262e33` },
  { id: "a8", url: `${BASE}?seed=Meena&backgroundColor=d4f1e4&clothingColor=5199e4` },
  { id: "a9", url: `${BASE}?seed=Vikram&backgroundColor=ffe0e0&clothingColor=3c4f5c` },
  { id: "a10", url: `${BASE}?seed=Lakshmi&backgroundColor=e0eaff&clothingColor=929598` },
  { id: "a11", url: `${BASE}?seed=Suresh&backgroundColor=fce4ff&clothingColor=262e33` },
  { id: "a12", url: `${BASE}?seed=Ananya&backgroundColor=e4fff4&clothingColor=5199e4` },
]

interface AvatarPickerProps {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
  current?: string
}

export function AvatarPicker({ open, onClose, onSelect, current }: AvatarPickerProps) {
  const [selected, setSelected] = useState<string>(current || "")

  const handleConfirm = () => {
    if (selected) onSelect(selected)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="bg-popover border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-foreground">Choose your avatar</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-3 py-2">
          {PRESETS.map((a) => {
            const isSelected = selected === a.url
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => setSelected(a.url)}
                className={cn(
                  "relative rounded-full overflow-hidden border-2 transition-all hover:scale-105 aspect-square bg-secondary/40",
                  isSelected
                    ? "border-primary ring-2 ring-primary/40 scale-105"
                    : "border-transparent hover:border-primary/40"
                )}
              >
                <img
                  src={a.url}
                  alt="avatar option"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            className="flex-1 border-border text-muted-foreground"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-primary text-primary-foreground hover:brightness-110"
            disabled={!selected}
            onClick={handleConfirm}
          >
            Use this avatar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
