'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { titleFont } from '@/config/fonts'
import { motion } from 'framer-motion'

export default function PlatformPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className='max-w-sm mx-auto'>
        <CardHeader className='text-center'>
          <h1 className={`${titleFont.className} text-2xl mb-3`}>Platform</h1>
        </CardHeader>

        <CardContent className='flex flex-col items-center justify-center'>
          <h2 className='text-lg'>Welcome to the platform!</h2>
          <p className='text-sm text-muted-foreground'>Here you can find all the news and updates.</p>
          <p className='text-sm text-muted-foreground'>Please check your email for the latest updates.</p>
        </CardContent>

        <CardFooter className='flex flex-col items-center justify-center'>
          <p className='text-sm text-muted-foreground'>If you have any questions, please contact us.</p>
          <p className='text-sm text-muted-foreground'>Thank you for being part of our community!</p>
          <p className='text-sm text-muted-foreground'>We hope you enjoy the platform!</p>
          <p className='text-sm text-muted-foreground'>Best regards,</p>
          <p className='text-sm text-muted-foreground'>Ms. Kelly ESL Academy</p>
        </CardFooter>

      </Card>
    </motion.div>
  )
}
