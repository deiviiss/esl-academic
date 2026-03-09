import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, ArrowLeft } from 'lucide-react'

export default function NoAccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Dynamic background element for premium feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 -z-10" />

      <Card className="w-full max-w-md backdrop-blur-sm bg-card/80 border-primary/10 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-500/10 p-5 rounded-full ring-8 ring-red-500/5">
              <Lock className="h-12 w-12 text-red-500 animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Access Restricted
          </CardTitle>
          <CardDescription className="text-base mt-2">
            You don&apos;t have access to this page yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            To access this section, you need to purchase the Academy product.
            Please contact administration or visit your profile for more information.
          </p>
          <div className="flex flex-col gap-3 pt-2">
            <Button asChild className="w-full h-11 text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Link href="/platform/profile">
                Go to Profile
              </Link>
            </Button>
            <Button variant="ghost" asChild className="w-full h-11 text-base hover:bg-primary/5 transition-all">
              <Link href="/platform">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}