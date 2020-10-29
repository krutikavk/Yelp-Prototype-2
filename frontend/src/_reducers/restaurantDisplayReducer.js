const initialRestState = {
  restArr: [],
  filteredRestArr: [],
  displayRestArr: [],
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
      return state;
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
