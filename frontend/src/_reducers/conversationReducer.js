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
      newState.convArr.forEach((item, index) => {
        // select conversation
        if (item._id === action.convid) {
          item.messages.push(action.message);
        }
        console.log(item, index);
      });
      console.log('new state: ', newState);
      return newState;
    }

    case 'UPDATECONV': {
      const newState = JSON.parse(JSON.stringify(state));
      const newConv = JSON.parse(JSON.stringify(action.payload));
      newState.convArr.forEach((item, index) => {
        // select conversation
        // eslint-disable-next-line no-underscore-dangle
        if (item._id === newConv._id) {
          console.log('matched conversation');
          item.messages = [...newConv.messages];
        }
        console.log(item, index);
      });
      console.log('incoming conv: ', newConv);
      console.log('new state: ', newState);
      return newState;
    }

    default: {
      return state;
    }
  }
};

export default conversationReducer;
