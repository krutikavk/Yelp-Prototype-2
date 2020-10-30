const initialRestState = {
  restArr: [],
  filteredRestArr: [],
  displayRestArr: [],
  // add currently applied filters here--use in case of radio buttons for multiple filters
  //appliedRestFilters: [],
  countPerPage: 0,
  currentPage: 0,
  filterDeliveryMethod: '',
  filterLatitude: '',
  filterLongitude: '',
};

const restaurantDisplayReducer = (state = initialRestState, action) => {
  switch (action.type) {
    case 'LOAD_DATA': {
      console.log('action: ', action);
      return {
        ...state,
        restArr: [...action.payload],
        filteredRestArr: [...action.payload],
        displayRestArr: [...action.payload].slice(0, action.countPerPage),
        // displayRestArr: [...action.payload],
      };
    }

    case 'FILTER_BY_DELIVERY': {
      // eslint-disable-next-line no-unused-vars, prefer-const
      let newState = { ...state };
      console.log('action: ', action);
      let filtered = newState.filteredRestArr;
      if (action.payload !== 'All') {
        filtered = filtered.filter((item) => item.rdelivery === action.payload);
        newState.displayRestArr = [...filtered].slice(0, newState.countPerPage);
      } else {
        filtered = [...newState.restArr];
        newState.currentPage = 1;
        newState.countPerPage = action.countPerPage;
        newState.displayRestArr = [...filtered].slice(0, newState.countPerPage);
      }
      return newState;
    }

    case 'FILTER_BY_LOCATION': {
      // eslint-disable-next-line prefer-const
      let newState = { ...state };
      console.log('action: ', action);
      let filtered = newState.filteredRestArr;

      console.log('filtered before', filtered);

      // eslint-disable-next-line no-confusing-arrow
      filtered = filtered.sort((a, b) => Math.sqrt(
        ((a.rlatitude - action.nbrLatitude) * (a.rlatitude - action.nbrLatitude))
        +
        ((a.rlongitude - action.nbrLongitude) * (a.rlongitude - action.nbrLongitude))
      )
      <
        Math.sqrt(
          ((b.rlatitude - action.nbrLatitude) * (b.rlatitude - action.nbrLatitude)) +
          ((b.rlongitude - action.nbrLongitude) * (b.rlongitude - action.nbrLongitude))
        ) ? -1 : 1);
      newState.currentPage = 1;
      newState.countPerPage = action.countPerPage;
      newState.displayRestArr = [...filtered].slice(0, newState.countPerPage);
      // newState.displayRestArr = [...filtered];
      return newState;
    }

    case 'LOAD_NEW_PAGE': {
      if (state.currentPage + action.payload.page < 1 ||
        state.currentPage + action.payload.page > Math.ceil(state.filteredArray.length/state.countPerPage)) {
        return state;
      }

      let newState = { ...state };
      newState.currentPage += action.payload.page;
      const upperBound = newState.currentPage * newState.countPerPage;
      const lowerBound = upperBound - newState.countPerPage;
      newState.displayRestArr = [...newState.filtered].slice(lowerBound, upperBound);

      /*
      let newState = { ...state };
      newState.currentPage = action.payload;
      const upperBound = newState.currentPage * newState.countPerPage;
      const lowerBound = upperBound - newState.countPerPage;
      newState.displayRestArr = [...newState.filtered].slice(lowerBound, upperBound);
      */
      return newState;
      
    }

    case 'LOAD_EXACT_PAGE': {
      return state;
    }

    default: {
      return state;
    }
  }
};

export default restaurantDisplayReducer;
