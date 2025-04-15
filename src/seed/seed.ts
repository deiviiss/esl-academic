import bcrypt from 'bcryptjs'

interface SeedUser {
  email: string
  name: string
  phoneNumber: string
  password: string
  role: 'admin' | 'user'
}

interface SeedData {
  users: SeedUser[]
}

export const initialData: SeedData = {
  users: [
    {
      email: 'david.hilera@hotmail.com',
      name: 'David',
      password: bcrypt.hashSync('userseed'),
      role: 'admin',
      phoneNumber: '+521981250049'
    }
  ]

}
