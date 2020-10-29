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
      return {
        ...state, 
        restArr: [...action.payload],
        filteredRestArr: [...action.payload],
        displayRestArr: [...action.payload].slice(0, countPerPage),
      };
    }

    case 'FILTER_BY_DELIVERY': {
      
    }

    case 'FILTER_BY_LOCATION' : {
      
    }

    default: {
      return state;
    }
  }
}

export default cartReducer;
