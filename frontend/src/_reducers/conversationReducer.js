const initialConvState = {
  convArr: [],
};

const conversationReducer = (state = initialConvState, action) => {
  switch (action.type) {
    case 'LOAD_DATA': {
      alert('here');
      console.log('action: ', action);
      return {
        ...state,
        convArr: JSON.parse(JSON.stringify(action.payload)),
      };
    }

    default: {
      return state;
    }
  }
};

export default conversationReducer;
