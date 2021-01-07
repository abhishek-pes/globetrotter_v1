import './App.css';
import Navbar from './Components/Navbar';
import Landing from './Screens/Landing';
import { BrowserRouter, Route } from 'react-router-dom'
import Signup from './Screens/Signup';
import Signin from './Screens/Signin';

function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Navbar />
        <Route exact path='/' component={Landing}></Route>
        <Route exact path='/signup' component={Signup}></Route>
        <Route exact path='/signin' component={Signin}></Route>
      </BrowserRouter>
    </div>
  );
}

export default App;
