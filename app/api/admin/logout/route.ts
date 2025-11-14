import { NextResponse } from 'next/server'
import { deleteAdminSession } from '@/lib/admin-auth'

export async function POST() {
  try {
    // Clear server-side session
    deleteAdminSession()
    
    // Create response
    const response = NextResponse.json({ success: true })
    
    // Clear authentication cookies
    response.cookies.delete('adminAuth')
    response.cookies.delete('admin-session')
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}