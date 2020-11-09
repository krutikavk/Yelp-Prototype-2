const initialOrderState = {
  orderArr: [],
  filteredOrderArr: [],
  displayOrderArr: [],
  countPerPage: 0,
  currentPage: 0,
  filterOoption: '',
  filterOtype: '',
  filterOstatus: '',
};

const OrderDisplayReducer = (state = initialOrderState, action) => {
  switch (action.type) {
    case 'LOAD_ORDER_DATA': {
      return {
        ...state,
        orderArr: [...action.payload],
        filteredOrderArr: [...action.payload],
        displayOrderArr: [...action.payload].slice(0, action.countPerPage),
        countPerPage: action.countPerPage,
        currentPage: 1,
        // displayRestArr: [...action.payload],
      };
    }
    case 'ADD_ORDER': {
      let newState = { ...state };
      newState.orderArr.push(action.payload);
      newState.filteredOrderArr = [...newState.orderArr];
      newState.displayOrderArr = [...newState.filteredOrderArr].slice(0, state.countPerPage);
      newState.currentPage = 1;
      return newState;
    }

    case 'LOAD_NEW_ORDER_PAGE': {
      if (state.currentPage + action.payload.page < 1 ||
        state.currentPage + action.payload.page > Math.ceil(state.filteredOrderArr.length / state.countPerPage)) {
        return state;
      }
      console.log('action.payload.page: ', action.payload.page);
      let newState = { ...state };
      newState.currentPage += (+action.payload.page);
      const upperBound = newState.currentPage * newState.countPerPage;
      const lowerBound = upperBound - newState.countPerPage;
      newState.displayOrderArr = [...newState.filteredOrderArr].slice(lowerBound, upperBound);
      return newState;
    }

    case 'LOAD_EXACT_ORDER_PAGE': {
      let newState = { ...state };
      newState.currentPage = action.payload;
      const upperBound = newState.currentPage * newState.countPerPage;
      const lowerBound = upperBound - newState.countPerPage;
      newState.displayOrderArr = [...newState.filteredOrderArr].slice(lowerBound, upperBound);
      return newState;
    }

    case 'FILTER_BY_OOPTION': {
      let newState = { ...state };
      console.log('action: ', action);
      let filtered = newState.filteredOrderArr;
      if (action.payload !== 'All') {
        filtered = filtered.filter((item) => item.ooption === action.payload);
        newState.displayOrderArr = [...filtered].slice(0, newState.countPerPage);
        newState.currentPage = 1;
      } else {
        filtered = [...newState.orderArr];
        newState.currentPage = 1;
        // newState.countPerPage = action.countPerPage;
        newState.displayOrderArr = [...filtered].slice(0, newState.countPerPage);
      }
      return newState;
    }
    case 'FILTER_BY_OTYPE': {
      let newState = { ...state };
      console.log('action: ', action);
      let filtered = newState.filteredOrderArr;
      if (action.payload !== 'All') {
        filtered = filtered.filter((item) => item.otype === action.payload);
        newState.displayOrderArr = [...filtered].slice(0, newState.countPerPage);
        newState.currentPage = 1;
      } else {
        filtered = [...newState.orderArr];
        newState.currentPage = 1;
        // newState.countPerPage = action.countPerPage;
        newState.displayOrderArr = [...filtered].slice(0, newState.countPerPage);
      }
      return newState;
    }
    case 'FILTER_BY_OSTATUS': {
      let newState = { ...state };
      console.log('action: ', action);
      let filtered = newState.filteredOrderArr;
      if (action.payload !== 'All') {
        filtered = filtered.filter((item) => item.ostatus === action.payload);
        newState.displayOrderArr = [...filtered].slice(0, newState.countPerPage);
        newState.currentPage = 1;
      } else {
        filtered = [...newState.orderArr];
        newState.currentPage = 1;
        // newState.countPerPage = action.countPerPage;
        newState.displayOrderArr = [...filtered].slice(0, newState.countPerPage);
      }
      return newState;
    }
    default: {
      return state;
    }
  }
};

export default OrderDisplayReducer;
