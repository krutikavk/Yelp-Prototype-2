const initialCustState = {
  custArr: [],
  filteredCustArr: [],
  displayCustArr: [],
  countPerPage: 0,
  currentPage: 0,
  filterFollowers: '',
  filterFollowing: '',
};

const customerDisplayReducer = (state = initialCustState, action) => {
  switch (action.type) {
    case 'LOAD_CUST_DATA': {
      console.log('action: ', action);
      return {
        ...state,
        custArr: [...action.payload],
        filteredCustArr: [...action.payload],
        displayCustArr: [...action.payload].slice(0, action.countPerPage),
        countPerPage: action.countPerPage,
        currentPage: 1,
        // displayCustArr: [...action.payload],
      };
    }

    case 'FILTER_BY_FOLLOW': {
      // eslint-disable-next-line no-unused-vars, prefer-const
      /*
      let newState = { ...state };
      console.log('action: ', action);
      let filtered = newState.filteredCustArr;
      if (action.payload !== 'All') {
        filtered = filtered.filter((item) => item.rdelivery === action.payload);
        newState.displayCustArr = [...filtered].slice(0, newState.countPerPage);
      } else {
        filtered = [...newState.custArr];
        newState.currentPage = 1;
        newState.countPerPage = action.countPerPage;
        newState.displayCustArr = [...filtered].slice(0, newState.countPerPage);
      }
      return newState;
      */
      return state;
    }

    case 'SORT_BY_FOLLOWERS': {
      // eslint-disable-next-line prefer-const
      let newState = { ...state };
      console.log('action: ', action);
      let filtered = newState.filteredCustArr;

      console.log('filtered before', filtered);

      // eslint-disable-next-line no-confusing-arrow
      filtered = filtered.sort((a, b) => a.cfollowers.length < b.cfollowers.length ? 1 : -1);

      newState.currentPage = 1;
      // newState.countPerPage = action.countPerPage;
      newState.displayCustArr = [...filtered].slice(0, newState.countPerPage);
      return newState;
    }

    case 'FILTER_CUST_BY_LOCATION': {
      // eslint-disable-next-line prefer-const
      let newState = { ...state };
      console.log('action: ', action);
      let filtered = newState.filteredCustArr;

      console.log('filtered before', filtered);

      // eslint-disable-next-line no-confusing-arrow
      filtered = filtered.sort((a, b) => Math.sqrt(
        ((a.clatitude - action.nbrLatitude) * (a.clatitude - action.nbrLatitude))
        +
        ((a.clongitude - action.nbrLongitude) * (a.clongitude - action.nbrLongitude))
      )
      <
        Math.sqrt(
          ((b.clatitude - action.nbrLatitude) * (b.clatitude - action.nbrLatitude)) +
          ((b.clongitude - action.nbrLongitude) * (b.clongitude - action.nbrLongitude))
        ) ? -1 : 1);
      newState.currentPage = 1;
      // newState.countPerPage = action.countPerPage;
      newState.displayCustArr = [...filtered].slice(0, newState.countPerPage);
      // newState.displayCustArr = [...filtered];
      return newState;
    }

    case 'LOAD_NEW_CUST_PAGE': {
      if (state.currentPage + action.payload.page < 1 ||
        state.currentPage + action.payload.page > Math.ceil(state.filteredCustArr.length / state.countPerPage)) {
        return state;
      }
      console.log('action.payload.page: ', action.payload.page);
      let newState = { ...state };
      newState.currentPage += (+action.payload.page);
      const upperBound = newState.currentPage * newState.countPerPage;
      const lowerBound = upperBound - newState.countPerPage;
      newState.displayCustArr = [...newState.filteredCustArr].slice(lowerBound, upperBound);
      return newState;
    }

    case 'LOAD_EXACT_CUST_PAGE': {
      let newState = { ...state };
      newState.currentPage = +action.payload;
      const upperBound = newState.currentPage * newState.countPerPage;
      const lowerBound = upperBound - newState.countPerPage;
      newState.displayCustArr = [...newState.filteredCustArr].slice(lowerBound, upperBound);
      return newState;
    }

    case 'ADD_FOLLOWER': {
      let newState = JSON.parse(JSON.stringify(state));
      console.log('action: ', action);
      console.log('old state: ', newState);
      newState.custArr.forEach((item, index) => {
        // select conversation
        if (item._id === action.followercid) {
          item.cfollowing.push(action.followingcid);
        }
        if (item._id === action.followingcid) {
          item.cfollower.push(action.followercid);
        }
      });
      return newState;
      console.log('new state: ', newState);
      newState.filteredCustArr = [...newState.custArr];
      newState.displayCustArr = [...newState.custArr].slice(0, newState.countPerPage);
      newState.currentPage = 1;
      console.log('newState: ', newState);

    }

    default: {
      return state;
    }
  }
};

export default customerDisplayReducer;
