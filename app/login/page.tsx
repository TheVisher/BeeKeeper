'use client'

import { signIn, getSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Loader2, Mail, CheckCircle, AlertCircle } from 'lucide-react'

type MessageType = 'success' | 'error' | 'info'

interface MessageState {
  text: string
  type: MessageType
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<MessageState | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    getSession().then((session) => {
      if (session) {
        router.push('/')
      }
    })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔐 [LOGIN] ==========================================')
    console.log('🔐 [LOGIN] STEP 1: Login form submitted')
    console.log('🔐 [LOGIN] Email:', email)
    console.log('🔐 [LOGIN] ==========================================')
    
    setIsLoading(true)
    setMessage(null)
    setEmailSent(false)

    try {
      console.log('🔐 [LOGIN] STEP 2: Calling signIn with email provider...')
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: '/',
      })

      console.log('🔐 [LOGIN] STEP 3: signIn result received:', {
        error: result?.error,
        ok: result?.ok,
        status: result?.status,
        url: result?.url
      })

      if (result?.error) {
        console.error('❌ [LOGIN] STEP 4: SignIn error occurred:', result.error)
        setMessage({
          text: getErrorMessage(result.error),
          type: 'error'
        })
      } else {
        console.log('✅ [LOGIN] STEP 4: SignIn successful - email should be sent')
        setMessage({
          text: 'Magic link sent! Check your email and click the link to sign in.',
          type: 'success'
        })
        setEmailSent(true)
      }
    } catch (error) {
      console.error('❌ [LOGIN] STEP 5: Unexpected error occurred:', error)
      setMessage({
        text: 'An unexpected error occurred. Please try again.',
        type: 'error'
      })
    } finally {
      console.log('🔐 [LOGIN] STEP 6: Login process completed')
      console.log('🔐 [LOGIN] ==========================================')
      setIsLoading(false)
    }
  }

  const getErrorMessage = (error: string): string => {
    switch (error) {
      case 'Configuration':
        return 'Email service is not configured properly. Please contact support.'
      case 'AccessDenied':
        return 'Access denied. Please check your email address.'
      case 'Verification':
        return 'Email verification failed. Please try again.'
      case 'Default':
        return 'Failed to send magic link. Please check your email address and try again.'
      default:
        return 'Error sending magic link. Please try again.'
    }
  }

  const handleResendEmail = () => {
    setEmailSent(false)
    setMessage(null)
    handleSubmit({ preventDefault: () => {} } as React.FormEvent)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Welcome to BeeKeeper</h1>
          <p className="text-muted-foreground mt-2">
            Sign in with your email to get started
          </p>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Magic Link
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold">Check your email</h3>
              <p className="text-muted-foreground mt-2">
                We've sent a magic link to <strong>{email}</strong>
              </p>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={handleResendEmail}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend Email'
                )}
              </Button>
              
              <Button 
                onClick={() => {
                  setEmailSent(false)
                  setMessage(null)
                  setEmail('')
                }}
                variant="ghost"
                className="w-full"
              >
                Use Different Email
              </Button>
            </div>
          </div>
        )}

        {message && (
          <div className={`mt-4 p-4 rounded-md text-sm flex items-start gap-2 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : message.type === 'error'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {message.type === 'error' ? (
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            ) : (
              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {!emailSent && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              We'll send you a magic link to sign in - no password required!
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
