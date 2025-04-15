'use client'

import { useTheme } from 'next-themes'
import { IoMoonOutline, IoSunnyOutline } from 'react-icons/io5'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export const ToogleDarkMode = () => {
  const { setTheme } = useTheme()

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <IoSunnyOutline className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <IoMoonOutline className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => { setTheme('light') }}>
            Claro
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setTheme('dark') }}>
            Oscuro
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setTheme('system') }}>
            Sistema
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
