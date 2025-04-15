import { initialData } from './seed'
import { countries } from './seed-countries'
import prisma from '../lib/prisma'

const main = async () => {
  // delete all data
  await prisma.userAddress.deleteMany()
  await prisma.country.deleteMany()
  await prisma.user.deleteMany()

  // seed categories
  const { users } = initialData

  // users
  await prisma.user.createMany({
    data: users
  })

  // countries
  await prisma.country.createMany({
    data: countries
  })


  console.log('Seed executed successfully')
}

(() => {
  if (process.env.NODE_ENV === 'production') return

  main()
}
)()
