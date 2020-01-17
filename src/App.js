import React, { Fragment, lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import 'react-input-range/lib/css/index.css';
import "react-toastify/dist/ReactToastify.css";
import 'react-table/react-table.css';
// import NavbarComponent from './components/Navbar';
// import Dashboard from './components/Dashboard';
// import Inventory from './components/Inventory';
// import SetupProduct from './components/SetupProduct';
// import Billing from './components/Billing';
// import Customization from './components/Customization';
// import Login from './components/Login';
// import SalesPage from './components/SalesPage';

const NavbarComponent = lazy(() => import("./components/Navbar"));
const Inventory = lazy(() => import("./components/Inventory"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const SetupProduct = lazy(() => import("./components/SetupProduct"));
const Billing = lazy(() => import("./components/Billing"));
const Customization = lazy(() => import("./components/Customization"));
const Login = lazy(() => import("./components/Login"));
const SalesPage = lazy(() => import("./components/SalesPage"));
const BillingPanel = lazy(() => import("./components/BillingPanel"));


function App() {

  return (
    <React.Fragment>
      <ToastContainer autoClose={2000} />
      <Suspense fallback={<div>Loading bApp...</div>}>
        <Switch>
          <Route exact path="/login" component={Login}></Route>
          <Fragment>
            <NavbarComponent />
            <Route path="/dashboard" component={Dashboard}></Route>
            <Route path="/set-up" component={SetupProduct}></Route>
            <Route exact path="/" component={SetupProduct}></Route>
            <Route path="/billing" component={Billing}></Route>
            <Route path="/inventory" component={Inventory}></Route>
            <Route path="/customization" component={Customization}></Route>
            <Route path="/bill/:handle" component={BillingPanel}></Route>
            <Route path="/more-on-sales" component={SalesPage}></Route>
          </Fragment>
          {/* <Route component={Default}></Route> */}
        </Switch>
      </Suspense>
    </React.Fragment>
  );
}

export default App;
