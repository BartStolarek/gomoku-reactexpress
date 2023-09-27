# Gomoku 
**Board** - Traditionally played on a 15 x 15 or 19 x 19 Go board, each cell is unoccupied to start with. 

**Players** - Two players, one with Black Stones (black goes first), another with White Stones.

**Objective** - Form an unbroken chain of fives same coloured stones. This can be done in a horizontal, vertical or diagonal direction. 

**Gameplay** - Players take turns placing a single stone on any unoccupied intersection. 


# Web Pages

**Home** - Home page is where a user can set the custom board size and start a game. 

**Login** - A page to allow a user to login with a username and password

**Sign Up** - A page to allow a user to register new login credentials

**Game** - (Must be logged in) This is where two players can play a game of Gomoku, and save games that have ended

**Games** - (Must be logged in) A list of saved games that have ended

**Game-log** - (Must be logged in) A recreation of the saved game, showing which piece was played in which order.

## Tech Stack

This application was developed using:
- TypeScript
- React (bootstrapped with [Create React App](https://github.com/facebook/create-react-app))
- Express Server
- MongoDB Database

## Pre-configurations

### Server Environment Variables
PORT=8080/
mongodbdemousername=demouser\
mongodbdemopassword=YhqwZ5M1HPyETa00\
dbURI=mongodb+srv://demouser:YhqwZ5M1HPyETa00@gomoku-reactexpress.xvqpzuo.mongodb.net/\
JWT_SECRET=my_super_secret_key

### Front End
login: test\
password: test

## Available Scripts

From the root project directory:

### Starting docker

#### `docker-compose up`

### Starting the Express backend Server

#### `cd gomoku-reactexpress-express`
#### `yarn run dev`

Runs the app in the development mode.\
Open [http://localhost8080](http://localhost8080) to view it in the browser.

### Starting the React frontend Server

#### `cd gomoku-reactexpress-react`
#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
