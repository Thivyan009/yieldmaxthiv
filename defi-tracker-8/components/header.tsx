'use client'

import { Logo } from './logo'
import { UserMenu } from './user-menu'
import { ThemeSwitcher } from './theme-switcher'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Star, LogIn } from 'lucide-react'

export function Header() {
  const router = useRouter()
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Add search or other controls here */}
          </div>
          <nav className="flex items-center space-x-2">
            <ThemeSwitcher />
            {user ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/watchlist')}
              >
                <Star className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/signin')}
              >
                <LogIn className="h-5 w-5" />
              </Button>
            )}
            <UserMenu />
          </nav>
        </div>
      </div>
    </header>
  )
} 