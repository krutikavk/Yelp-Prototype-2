const initialOrderState = {
  dishArr: [],
  displayDishArr: [],
  countPerPage: 0,
  currentPage: 0,
};

const DishDisplayReducer = (state = initialOrderState, action) => {
  switch (action.type) {
    case 'LOAD_DATA': {
      return {
        ...state,
        dishArr: [...action.payload],
        displayDishArr: [...action.payload].slice(0, action.countPerPage),
        countPerPage: action.countPerPage,
        currentPage: 1,
        // displayRestArr: [...action.payload],
      };
    }
    case 'ADD_DISH': {
      let newState = { ...state };
      newState.dishArr.push(action.payload);
      newState.displayOrderArr = [...newState.dishArr].slice(0, state.countPerPage);
      newState.currentPage = 1;
      return newState;
    }

    case 'LOAD_NEW_PAGE': {
      if (state.currentPage + action.payload.page < 1 ||
        state.currentPage + action.payload.page > Math.ceil(state.filteredOrderArr.length / state.countPerPage)) {
        return state;
      }
      console.log('action.payload.page: ', action.payload.page);
      let newState = { ...state };
      newState.currentPage += (+action.payload.page);
      const upperBound = newState.currentPage * newState.countPerPage;
      const lowerBound = upperBound - newState.countPerPage;
      newState.displayDishArr = [...newState.dishArr].slice(lowerBound, upperBound);
      return newState;
    }

    case 'LOAD_EXACT_PAGE': {
      let newState = { ...state };
      newState.currentPage = action.payload;
      const upperBound = newState.currentPage * newState.countPerPage;
      const lowerBound = upperBound - newState.countPerPage;
      newState.displayDishArr = [...newState.dishArr].slice(lowerBound, upperBound);
      return newState;
    }

    default: {
      return state;
    }
  }
}

export default DishDisplayReducer;
