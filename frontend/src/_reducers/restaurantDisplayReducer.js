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

const restaurantDisplayReducer = (state = initialRestState, action) => {
  switch (action.type) {
    case 'LOAD_DATA': {
      console.log('action: ', action);
      return {
        ...state,
        restArr: [...action.payload],
        filteredRestArr: [...action.payload],
        //displayRestArr: [...action.payload].slice(0, action.countPerPage),
        displayRestArr: [...action.payload],
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
        newState.displayRestArr = [...filtered];
      }
      return newState;
    }

    case 'FILTER_BY_LOCATION': {
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
        ) ? -1 : 1
      );
      console.log('filtered after', filtered);
      //newState.displayRestArr = [...filtered].slice(0, action.countPerPage);
      newState.displayRestArr = [...filtered];
      return newState;
    }

    default: {
      return state;
    }
  }
};

export default restaurantDisplayReducer;
