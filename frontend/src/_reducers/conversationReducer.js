const initialConvState = {
  convArr: [],
};

const conversationReducer = (state = initialConvState, action) => {
  switch (action.type) {
    case 'LOAD_DATA': {
      console.log('action: ', action);
      let newState = { ...state };
      newState.convArr = JSON.parse(JSON.stringify(action.payload))
      newState.convArr = newState.convArr.sort((a, b) => a.latest < b.latest ? 1 : -1);
      /*
      return {
        ...state,
        convArr: JSON.parse(JSON.stringify(action.payload)),
      };
      */
      return newState;
    }

    case 'ADDMESSAGE': {
      const newState = JSON.parse(JSON.stringify(state));
      console.log('new state: ', newState);
      return state;
    }

    default: {
      return state;
    }
  }
};

export default conversationReducer;
