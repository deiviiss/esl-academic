import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUserSessionServer } from '@/actions/auth/getUserSessionServer'
import { getUserById } from '@/actions/users/get-user-by-id'
import { ProfileClient } from '@/components/platform/ProfileClient'

export const metadata: Metadata = {
  title: "Profile - Ms. Kelly ESL Academy",
  description: "Manage your profile and subscription settings for Ms. Kelly ESL Academy.",
}

const ProfilePage = async () => {
  const userSession = await getUserSessionServer()

  if (!userSession) {
    redirect('/')
  }

  const { user } = await getUserById(String(userSession.id))

  if (!user) {
    redirect('/')
  }

  return (
    <ProfileClient user={user} />

    // <div className='w-full'>
    //   <Card className='max-w-sm mx-auto'>
    //     <CardHeader className='text-center'>
    //       <h1 className={`${titleFont.className} text-2xl mb-3`}>Profile</h1>
    //     </CardHeader>

    //     <CardContent className='flex justify-center'>
    //       <Avatar className="bg-gray-200 text-gray-600 h-28 w-28 rounded-full">
    //         <AvatarImage src={userImage} />
    //         <AvatarFallback>Avatar</AvatarFallback>
    //       </Avatar>
    //     </CardContent>

    //     <CardContent >
    //       <div className='flex justify-end'>
    //         <Button asChild variant='outline' size='sm' className='gap-1'>
    //           <Link href={`/platform/profile/${user.id}?redirectTo=profile`} className='text-[10px]'>
    //             <IoPencil />
    //             <span className='hidden sm:flex'>Edit</span>
    //           </Link>
    //         </Button>
    //       </div>
    //     </CardContent>

    //     <CardContent >
    //       <p><span className='font-semibold'>Name:</span> {userName}</p>
    //       <p><span className='font-semibold'>E-mail:</span> {userMail}</p>
    //       <p><span className='font-semibold'>Phone number:</span> {userPhoneNumber}</p>
    //     </CardContent>

    //     <CardFooter className='space-y-2 flex-col'>
    //       <div className='flex flex-col gap-4 justify-center mt-10 w-full'>
    //         <Button>
    //           Algún otro botón
    //         </Button>
    //       </div>
    //       <ButtonLogout className='w-full' />
    //     </CardFooter>

    //   </Card>
    // </div>
  )
}

export default ProfilePage
