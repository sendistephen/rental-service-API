import { Route, Switch } from 'react-router';
import Login from './pages/Login';
import Register from './pages/Register';
import RentalDetail from './pages/RentalDetail';
import RentalHome from './pages/RentalHome';

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={RentalHome} />

      <Route path="/register" component={Register} />

      <Route exact path="/rentals/:id" component={RentalDetail} />

      <Route path="/login" component={Login} />
    </Switch>
  );
};
export default Routes;
