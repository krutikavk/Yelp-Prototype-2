const initialRestState = {
  restArr: [],
  filteredRestArr: [],
  displayRestArr: [],
  // add currently applied filters here--use in case of radio buttons for multiple filters
  appliedRestFilters: [],
  countPerPage: 2,
  currentPage: 0,
  filterDeliveryMethod: '',
  filterLatitude: '',
  filterLongitude: '',
};

const cartReducer = (state = initialRestState, action) => {
  switch (action.type) {
    case 'LOAD_DATA': {
      console.log('action: ', action);
      return {
        ...state,
        restArr: [...action.payload],
        filteredRestArr: [...action.payload],
        displayRestArr: [...action.payload].slice(0, action.countPerPage),
      };
    }

    case 'FILTER_BY_DELIVERY': {
      // eslint-disable-next-line no-unused-vars, prefer-const
      let newState = { ...state };
      console.log('action: ', action);
      let filtered = newState.filteredRestArr;
      if (action.payload !== 'All') {
        filtered = filtered.filter((item) => item.rdelivery === action.payload);
        newState.displayRestArr = [...filtered].slice(0, action.countPerPage);
      } else {
        filtered = [...newState.restArr];
        newState.displayRestArr = [...newState.restArr];
      }
      return newState;
    }

    case 'FILTER_BY_LOCATION': {
      return state;
    }

    default: {
      return state;
    }
  }
};

export default cartReducer;
