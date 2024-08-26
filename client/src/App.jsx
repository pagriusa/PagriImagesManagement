import './App.css';
import Login from './screens/Login';
import Home from './screens/userpanel/Home';
import List from './screens/userpanel/List';
import User from './screens/userpanel/User';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    // <InvoiceProvider>
      <Router>
        <div>
          <Routes>
            <Route exact path='/' element={<Login/>} />
            <Route exact path='/userpanel/Home' element={<Home/>} />
            <Route exact path='/userpanel/List' element={<List/>} />
            <Route exact path='/userpanel/User' element={<User/>} />
            
          </Routes>
        </div>
      </Router>
    // {/* </InvoiceProvider> */}
  );
}

export default App;
