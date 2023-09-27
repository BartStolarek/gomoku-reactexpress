import 'dotenv/config'
import connect from './connectDB'

import UserModel from '../model/user.model'
import users from '../data/user.json'


const run = async () => {
  try {
    await connect()

    await UserModel.deleteMany()
    await UserModel.insertMany(users)

    process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

run()
