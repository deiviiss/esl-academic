'use client'

import { IoLogOutOutline } from 'react-icons/io5'
import { logout } from '@/actions/auth/logout'
import { Button } from '@/components/ui/button'

interface Props {
  name?: string
  className?: string
  icon?: React.JSX.Element
}

export const ButtonLogout = ({ className, icon, name }: Props) => {
  return (
    <Button
      variant={'outline'}
      onClick={async () => {
        await logout()
        window.location.replace('/')
      }}
      className={className}
    >
      {icon || <IoLogOutOutline />}
      <span className='hidden min-[500px]:block' >{name ? name : "Sign Out"}</span>
    </Button>
  )
}
