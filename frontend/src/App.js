import './App.css';
import { useContext, useReducer, createContext, useEffect } from 'react'
import Navbar from './Components/Navbar';
import Landing from './Screens/Landing';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import Signup from './Screens/Signup';
import Signin from './Screens/Signin';
import Home from './Screens/Home';
import { reducer, initialState } from './Reducer/UserReducer'
import PostDestination from './Screens/PostDestination';

export const UserContext = createContext();

function Routes() {

  const history = useHistory()
  const { dispatch } = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      dispatch({ type: 'USER', payload: user })
    }
    else {
      history.push('/')
    }
  }, [])

  return (
    <Switch>
      <Route exact path='/' component={Landing}></Route>
      <Route exact path='/signup' component={Signup}></Route>
      <Route exact path='/signin' component={Signin}></Route>
      <Route exact path='/home' component={Home}></Route>
      <Route exact path='/postdestination' component={PostDestination}></Route>
    </Switch>
  )
}

function App() {

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div className="">
      <UserContext.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          <Navbar />
          <Routes />
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
