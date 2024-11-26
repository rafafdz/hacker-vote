'use client'

import * as React from 'react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import { HiChevronDown } from 'react-icons/hi2'

const Navbar = () => {
  const [user, setUser] = useState<any>(null)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const supabase = createBrowserClient()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (!(event.target as HTMLElement).closest('.dropdown')) {
      setDropdownVisible(false)
    }
  }

  useEffect(() => {
    if (dropdownVisible) {
      document.addEventListener('click', handleClickOutside)
    } else {
      document.removeEventListener('click', handleClickOutside)
    }
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [dropdownVisible])

  return (
    <nav className="p-4">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div
          className="text-lg font-bold"
          style={{ fontFamily: 'var(--font-oxanium)' }}
        >
          <Link
            href="/"
            className="text-white transition-colors hover:text-gray-300"
          >
            <span className="font-light text-white">platanus hack</span>{' '}
            <span className="text-white">| voting</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="dropdown relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 rounded-lg border border-white px-4 py-1 text-white transition-colors hover:bg-white/10 focus:outline-none"
              >
                {user.user_metadata.full_name}
                <HiChevronDown className="h-4 w-4" />
              </button>
              {dropdownVisible && (
                <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg">
                  <button
                    onClick={handleSignOut}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="text-white">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
