export const login = () => ({
  type: 'SIGN_IN',
});

export const logout = () => ({
  type: 'SIGN_OUT',
});

export const customerLogin = () => ({
  type: 'CUSTOMER',
});

export const restaurantLogin = () => ({
  type: 'RESTAURANT',
});

// incoming field, data ==> infield, payload
export const update = (infield, payload) => ({
  type: 'UPDATE',
  field: infield,
  payload,
});

export const updateCart = (infield, payload) => ({
  type: 'UPDATECART',
  field: infield,
  payload,
});

export const loadRestaurants = (countPerPage, payload) => ({
  type: 'LOAD_DATA',
  countPerPage,
  payload,
});

export const filterRestaurantByDelivery = (payload) => ({
  type: 'FILTER_BY_DELIVERY',
  payload,
});

export const filterRestaurantByLocation = (nbrLatitude, nbrLongitude) => ({
  type: 'FILTER_BY_LOCATION',
  nbrLatitude,
  nbrLongitude,
});

export const loadNewPage = (payload) => ({
  type: 'LOAD_NEW_PAGE',
  payload,
});

export const loadExactPage = (payload) => ({
  type: 'LOAD_EXACT_PAGE',
  payload,
});

export const loadCustomers = (countPerPage, payload) => ({
  type: 'LOAD_DATA',
  countPerPage,
  payload,
});

// payload: All, Followers, Following
export const filterCustByFollow = (payload, custProfile) => ({
  type: 'FILTER_BY_FOLLOW',
  payload,
  custProfile,
});

// sort by followers
export const sortCustByFollowers = () => ({
  type: 'SORT_BY_FOLLOWERS',
});

export const filterCustomerByLocation = (nbrLatitude, nbrLongitude) => ({
  type: 'FILTER_CUST_BY_LOCATION',
  nbrLatitude,
  nbrLongitude,
});

export const loadNewCustPage = (payload) => ({
  type: 'LOAD_NEW_PAGE',
  payload,
});

export const loadExactCustPage = (payload) => ({
  type: 'LOAD_EXACT_PAGE',
  payload,
});

export const loadEvents = (countPerPage, payload) => ({
  type: 'LOAD_DATA',
  payload,
});

export const sortEventsAsc = () => ({
  type: 'SORTASC',
});

export const sortEventsDesc = () => ({
  type: 'SORTDESC',
});

export const loadNewEventPage = (payload) => ({
  type: 'LOAD_NEW_PAGE',
  payload,
});

export const loadExactEventPage = (payload) => ({
  type: 'LOAD_EXACT_PAGE',
  payload,
});
