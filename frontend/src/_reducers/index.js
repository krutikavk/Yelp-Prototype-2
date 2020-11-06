import { combineReducers } from 'redux';
import loggedReducer from './isLogged';
import custReducer from './custProfile';
import restReducer from './restProfile';
import whoIsLoggedReducer from './whoislogged';
import cartReducer from './cartReducer';
import restaurantDisplayReducer from './restaurantDisplayReducer';
import customerDisplayReducer from './customerDisplayReducer';
import eventDisplayReducer from './eventDisplayReducer';

const allReducer = combineReducers({
  // equivalent: counterReducer: counterReducer
  // JS6 shorthand: counterReducer
  isLogged: loggedReducer,
  custProfile: custReducer,
  restProfile: restReducer,
  whoIsLogged: whoIsLoggedReducer,
  cart: cartReducer,
  restDisplay: restaurantDisplayReducer,
  custDisplay: customerDisplayReducer,
  eventDisplay: eventDisplayReducer,
});

export default allReducer;
