'use client'

import { useState, useEffect, useTransition } from 'react'
import { Eye, UserX, UserCheck, Search, Loader2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toggleUserStatus } from '@/actions/users/toggle-user-status'
import { noticeSuccess, noticeFailure } from '@/components/toast-notifications/ToastNotifications'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  phoneNumber: string
  isActive: boolean
  childrenCount: number
}

interface UserListProps {
  users: User[]
}

type SortField = 'name' | 'status' | 'childrenCount' | null
type SortOrder = 'asc' | 'desc'

export default function UserList({ users }: UserListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const initialSearch = searchParams.get('q') || ''
  const [searchTerm, setSearchTerm] = useState(initialSearch)

  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const handleSortSelectChange = (value: string) => {
    const [field, order] = value.split('-') as [SortField, SortOrder]
    setSortField(field)
    setSortOrder(order)
  }

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortField) return 0

    if (sortField === 'status') {
      const aVal = a.isActive ? 1 : 0
      const bVal = b.isActive ? 1 : 0
      return sortOrder === 'asc' ? bVal - aVal : aVal - bVal
    }

    if (sortField === 'childrenCount') {
      return sortOrder === 'asc' ? a.childrenCount - b.childrenCount : b.childrenCount - a.childrenCount
    }

    if (sortField === 'name') {
      const aVal = a.name.toLowerCase()
      const bVal = b.name.toLowerCase()
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }

    return 0
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (searchTerm) {
        params.set('q', searchTerm)
      } else {
        params.delete('q')
      }

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      })
    }, 400)

    return () => clearTimeout(timer)
  }, [searchTerm, pathname, router, searchParams])

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const { ok, message } = await toggleUserStatus({ id, status: currentStatus })
    if (ok) {
      noticeSuccess(message)
      router.refresh()
    } else {
      noticeFailure(message)
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b bg-muted/20 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-stretch sm:items-center">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {isPending ? (
                <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
              ) : (
                <Search className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <Input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-xs"
            />
          </div>

          <Select
            value={`${sortField}-${sortOrder}`}
            onValueChange={handleSortSelectChange}
          >
            <SelectTrigger className="w-full sm:w-[180px] text-xs h-9">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name: A-Z</SelectItem>
              <SelectItem value="name-desc">Name: Z-A</SelectItem>
              <SelectItem value="status-asc">Status: Active first</SelectItem>
              <SelectItem value="status-desc">Status: Inactive first</SelectItem>
              <SelectItem value="childrenCount-desc">Children: Most first</SelectItem>
              <SelectItem value="childrenCount-asc">Children: Least first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile view with cards */}
      <div className="md:hidden divide-y">
        {sortedUsers.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground italic">No users found.</div>
        ) : (
          sortedUsers.map((user) => (
            <div key={user.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-foreground">{user.name}</h3>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <Badge variant={user.isActive ? "default" : "destructive"}>
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-semibold block">Phone</span>
                  {user.phoneNumber}
                </div>
                <div>
                  <span className="font-semibold block">Children</span>
                  {user.childrenCount}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href={`/platform/admin/users/${user.id}`}>
                    <Eye className="h-4 w-4 mr-2" /> View
                  </Link>
                </Button>
                <Button
                  onClick={() => handleToggleStatus(user.id, user.isActive)}
                  variant={user.isActive ? "outline" : "default"}
                  size="sm"
                  className="flex-1"
                >
                  {user.isActive ? (
                    <><UserX className="h-4 w-4 mr-2" /> Deactivate</>
                  ) : (
                    <><UserCheck className="h-4 w-4 mr-2" /> Activate</>
                  )}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop view with table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr className="select-none">
              <th
                className="px-6 py-4 font-medium cursor-pointer hover:text-foreground transition-colors group min-w-60"
                onClick={() => handleSort('name')}
                title="Sort by name"
              >
                <div className="flex items-center gap-1.5">
                  <span>Name</span>
                  {sortField === 'name' ? (
                    sortOrder === 'asc' ? <ArrowUp className="h-3.5 w-3.5 text-primary" /> : <ArrowDown className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-muted-foreground" />
                  )}
                </div>
              </th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Phone</th>
              <th
                className="px-6 py-4 font-medium text-center cursor-pointer hover:text-foreground transition-colors group"
                onClick={() => handleSort('childrenCount')}
                title="Sort by number of children"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Children</span>
                  {sortField === 'childrenCount' ? (
                    sortOrder === 'asc' ? <ArrowUp className="h-3.5 w-3.5 text-primary" /> : <ArrowDown className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-muted-foreground" />
                  )}
                </div>
              </th>
              <th
                className="px-6 py-4 font-medium text-center cursor-pointer hover:text-foreground transition-colors group"
                onClick={() => handleSort('status')}
                title="Sort by user status"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Status</span>
                  {sortField === 'status' ? (
                    sortOrder === 'asc' ? <ArrowUp className="h-3.5 w-3.5 text-primary" /> : <ArrowDown className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-muted-foreground" />
                  )}
                </div>
              </th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sortedUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic">
                  No users found.
                </td>
              </tr>
            ) : (
              sortedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{user.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                  <td className="px-6 py-4 text-muted-foreground">{user.phoneNumber}</td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant="secondary" className="font-medium">
                      {user.childrenCount} {user.childrenCount === 1 ? 'child' : 'children'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={user.isActive ? "default" : "destructive"} className="uppercase text-[10px]">
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="ghost" size="sm" className="h-8 p-2" title="View Detail">
                        <Link href={`/platform/admin/users/${user.id}`}>
                          <Eye className="h-4 w-4 text-blue-600" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button
                        onClick={() => handleToggleStatus(user.id, user.isActive)}
                        variant="ghost"
                        size="sm"
                        className="h-8 p-2"
                        title={user.isActive ? "Deactivate" : "Activate"}
                      >
                        {user.isActive ? (
                          <UserX className="h-4 w-4 text-destructive" />
                        ) : (
                          <UserCheck className="h-4 w-4 text-green-600" />
                        )}
                        <span className="sr-only">{user.isActive ? "Deactivate" : "Activate"}</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
