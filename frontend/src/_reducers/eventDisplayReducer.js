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
    case 'LOAD_EVENT_DATA': {
      console.log('action: ', action);

      let newState = { ...state };
      newState.eventArr = [...action.payload];
      newState.filteredEventArr = [...action.payload];
      newState.filteredEventArr = newState.filteredEventArr.sort((a, b) => a.edate < b.edate ? -1 : 1);
      newState.displayEventArr = [...action.payload].slice(0, action.countPerPage);
      newState.countPerPage = action.countPerPage;
      newState.currentPage = 1;
      return newState;
    }

    case 'ADD_EVENT': {
      let newState = { ...state };
      newState.eventArr.push(action.payload);
      newState.filteredEventArr = [...newState.eventArr];
      newState.countPerPage = action.countPerPage;
      newState.displayEventArr = [...newState.eventArr].slice(0, action.countPerPage);
      newState.currentPage = 1;
      return newState;
    }

    case 'SORTASC': {
      let newState = { ...state };
      console.log('action: ', action);
      console.log('filtered before', newState.filteredEventArr);
      // eslint-disable-next-line no-confusing-arrow
      newState.filteredEventArr = newState.filteredEventArr.sort((a, b) => new Date(b.edate) > new Date(a.edate) ? -1 : 1);
      let filtered = newState.filteredEventArr;
      console.log('filtered after', newState.filteredEventArr);
      newState.currentPage = 1;
      // newState.countPerPage = action.countPerPage;
      newState.displayEventArr = [...filtered].slice(0, newState.countPerPage);
      // newState.displayEventArr = [...filtered];
      return newState;
    }

    case 'SORTDESC': {
      let newState = { ...state };
      console.log('action: ', action);
      console.log('filtered before', newState.filteredEventArr);
      // eslint-disable-next-line no-confusing-arrow
      newState.filteredEventArr = newState.filteredEventArr.sort((a, b) => new Date(a.edate) > new Date(b.edate) ? -1 : 1);
      let filtered = newState.filteredEventArr;
      newState.currentPage = 1;
      // newState.countPerPage = action.countPerPage;
      newState.displayEventArr = [...filtered].slice(0, newState.countPerPage);
      // newState.displayEventArr = [...filtered];
      return newState;
    }

    case 'LOAD_NEW_EVENT_PAGE': {
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
      return newState;
    }

    case 'LOAD_EXACT_EVENT_PAGE': {
      let newState = { ...state };
      newState.currentPage = +action.payload;
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
