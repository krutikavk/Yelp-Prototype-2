const initialEventState = {
  eventArr: [],
  filteredEventArr: [],
  displayEventArr: [],
  countPerPage: 0,
  currentPage: 0,
  sortAsc: '',
  sortDesc: '',
};

const eventDisplayReducer = (state = initialEventState, action) => {
  switch (action.type) {
    case 'LOAD_DATA': {
      console.log('action: ', action);
      return {
        ...state,
        eventArr: [...action.payload],
        filteredEventArr: [...action.payload],
        displayEventArr: [...action.payload].slice(0, action.countPerPage),
        countPerPage: action.countPerPage,
        currentPage: 1,
        // displayEventArr: [...action.payload],
      };
    }

    case 'SORTASC': {
      let newState = { ...state };
      console.log('action: ', action);
      let filtered = newState.filteredEventArr;
      console.log('filtered before', filtered);
      // eslint-disable-next-line no-confusing-arrow
      filtered = filtered.sort((a, b) => a.eDate < b.eDate ? -1 : 1);
      newState.currentPage = 1;
      newState.countPerPage = action.countPerPage;
      newState.displayEventArr = [...filtered].slice(0, newState.countPerPage);
      // newState.displayEventArr = [...filtered];
      return newState;
    }

    case 'SORTDESC': {
      let newState = { ...state };
      console.log('action: ', action);
      let filtered = newState.filteredEventArr;
      console.log('filtered before', filtered);
      // eslint-disable-next-line no-confusing-arrow
      filtered = filtered.sort((a, b) => a.eDate < b.eDate ? 1 : -1);
      newState.currentPage = 1;
      newState.countPerPage = action.countPerPage;
      newState.displayEventArr = [...filtered].slice(0, newState.countPerPage);
      // newState.displayEventArr = [...filtered];
      return newState;
    }

    case 'LOAD_NEW_PAGE': {
      if (state.currentPage + action.payload.page < 1 ||
        state.currentPage + action.payload.page > Math.ceil(state.filteredEventArr.length / state.countPerPage)) {
        return state;
      }
      console.log('action.payload.page: ', action.payload.page);
      let newState = { ...state };
      newState.currentPage += (+action.payload.page);
      const upperBound = newState.currentPage * newState.countPerPage;
      const lowerBound = upperBound - newState.countPerPage;
      newState.displayEventArr = [...newState.filteredEventArr].slice(lowerBound, upperBound);

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
      let newState = { ...state };
      newState.currentPage = action.payload;
      const upperBound = newState.currentPage * newState.countPerPage;
      const lowerBound = upperBound - newState.countPerPage;
      newState.displayEventArr = [...newState.filteredEventArr].slice(lowerBound, upperBound);
      return newState;
    }

    default: {
      return state;
    }
  }
};

export default eventDisplayReducer;
