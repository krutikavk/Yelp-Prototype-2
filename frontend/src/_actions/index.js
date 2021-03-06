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
  type: 'LOAD_REST_DATA',
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
  type: 'LOAD_NEW_REST_PAGE',
  payload,
});

export const loadExactPage = (payload) => ({
  type: 'LOAD_EXACT_REST_PAGE',
  payload,
});

export const loadCustomers = (countPerPage, payload) => ({
  type: 'LOAD_CUST_DATA',
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
  type: 'LOAD_NEW_CUST_PAGE',
  payload,
});

export const loadExactCustPage = (payload) => ({
  type: 'LOAD_EXACT_CUST_PAGE',
  payload,
});

export const loadEvents = (countPerPage, payload) => ({
  type: 'LOAD_EVENT_DATA',
  countPerPage,
  payload,
});

export const addEvent = (countPerPage, payload) => ({
  type: 'ADD_EVENT',
  countPerPage,
  payload,
});

export const sortEventsAsc = () => ({
  type: 'SORTASC',
});

export const sortEventsDesc = () => ({
  type: 'SORTDESC',
});

export const loadNewEventPage = (payload) => ({
  type: 'LOAD_NEW_EVENT_PAGE',
  payload,
});

export const loadExactEventPage = (payload) => ({
  type: 'LOAD_EXACT_EVENT_PAGE',
  payload,
});

export const loadConversations = (payload) => ({
  type: 'LOAD_CONV_DATA',
  payload,
});

// May not need this
export const addMessage = (convid, message) => ({
  type: 'ADDMESSAGE',
  convid,
  message,
});

// Payload has a conversation that needs to be updated
export const updateConversation = (payload) => ({
  type: 'UPDATECONV',
  payload,
});

export const addFollower = (followercid, followingcid) => ({
  type: 'ADD_FOLLOWER',
  followercid,
  followingcid,
});

export const loadOrders = (countPerPage, payload) => ({
  type: 'LOAD_ORDER_DATA',
  countPerPage,
  payload,
});

export const addOrder = (countPerPage, payload) => ({
  type: 'ADD_ORDER',
  countPerPage,
  payload,
});

export const filterOrdersByOption = (payload) => ({
  type: 'FILTER_BY_OOPTION',
  payload,
});

export const filterOrdersByType = (payload) => ({
  type: 'FILTER_BY_OTYPE',
  payload,
});

export const filterOrdersByStatus = (payload) => ({
  type: 'FILTER_BY_OSTATUS',
  payload,
});

export const loadNewOrderPage = (payload) => ({
  type: 'LOAD_NEW_ORDER_PAGE',
  payload,
});

export const loadExactOrderPage = (payload) => ({
  type: 'LOAD_EXACT_ORDER_PAGE',
  payload,
});

export const loadDishes = (countPerPage, payload) => ({
  type: 'LOAD_DISH_DATA',
  countPerPage,
  payload,
});

export const addDish = (countPerPage, payload) => ({
  type: 'ADD_DISH',
  countPerPage,
  payload,
});

export const loadNewDishPage = (payload) => ({
  type: 'LOAD_NEW_DISH_PAGE',
  payload,
});

export const loadExactDishPage = (payload) => ({
  type: 'LOAD_EXACT_DISH_PAGE',
  payload,
});
