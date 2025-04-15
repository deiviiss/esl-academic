'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function NewslettersPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className='max-w-sm mx-auto'>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Newsletters</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Latest updates and news</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center p-6">
          <h2 className="text-lg font-semibold">Welcome to the Newsletters section!</h2>
          <p className="text-sm text-muted-foreground">Here you can find all the latest newsletters and updates.</p>
          <p className="text-sm text-muted-foreground">Please check your email for the latest updates.</p>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center p-6">
          <p className="text-sm text-muted-foreground">Stay tuned for more updates!</p>
          <p className="text-sm text-muted-foreground">We appreciate your support!</p>
          <p className="text-sm text-muted-foreground">Best wishes,</p>
          <p className="text-sm text-muted-foreground">The Ms. Kelly ESL Academy Team</p>
        </CardFooter>

      </Card>
    </motion.div>
  );
}