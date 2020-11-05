const initialCustProfile = {
  cid: '',
  cemail: '',
  cpassword: '',
  cname: '',
  cphone: '',
  cabout: '',
  cjoined: '',
  cphoto: '',
  cfavrest: '',
  cfavcuisine: '',
  cfollowers: [],
  cfollowing: [],
  clatitude: '',
  clongitude: '',
  caddress: '',
};

const custReducer = (state = initialCustProfile, action) => {
  switch (action.type) {
    case 'UPDATE': {
      switch (action.field) {
        case 'CID': {
          return {
            cid: action.payload,
            cemail: state.cemail,
            cpassword: state.cpassword,
            cname: state.cname,
            cphone: state.cphone,
            cabout: state.cabout,
            cjoined: state.cjoined,
            cphoto: state.cphoto,
            cfavrest: state.cfavrest,
            cfavcuisine: state.cfavcuisine,
            cfollowers: [...state.cfollowers],
            cfollowing: [...state.cfollowing],
            clatitude: state.clatitude,
            clongitude: state.clongitude,
            caddress: state.caddress,
          };
        }

        case 'CEMAIL': {
          return {
            cid: state.cid,
            cemail: action.payload,
            cpassword: state.cpassword,
            cname: state.cname,
            cphone: state.cphone,
            cabout: state.cabout,
            cjoined: state.cjoined,
            cphoto: state.cphoto,
            cfavrest: state.cfavrest,
            cfavcuisine: state.cfavcuisine,
            cfollowers: [...state.cfollowers],
            cfollowing: [...state.cfollowing],
            clatitude: state.clatitude,
            clongitude: state.clongitude,
            caddress: state.caddress,
          };
        }

        case 'CPASSWORD': {
          return {
            cid: state.cid,
            cemail: state.cemail,
            cpassword: action.payload,
            cname: state.cname,
            cphone: state.cphone,
            cabout: state.cabout,
            cjoined: state.cjoined,
            cphoto: state.cphoto,
            cfavrest: state.cfavrest,
            cfavcuisine: state.cfavcuisine,
            cfollowers: [...state.cfollowers],
            cfollowing: [...state.cfollowing],
            clatitude: state.clatitude,
            clongitude: state.clongitude,
            caddress: state.caddress,
          };
        }

        case 'CNAME': {
          return {
            cid: state.cid,
            cemail: state.cemail,
            cpassword: state.cpassword,
            cname: action.payload,
            cphone: state.cphone,
            cabout: state.cabout,
            cjoined: state.cjoined,
            cphoto: state.cphoto,
            cfavrest: state.cfavrest,
            cfavcuisine: state.cfavcuisine,
            cfollowers: [...state.cfollowers],
            cfollowing: [...state.cfollowing],
            clatitude: state.clatitude,
            clongitude: state.clongitude,
            caddress: state.caddress,
          };
        }

        case 'CPHONE': {
          return {
            cid: state.cid,
            cemail: state.cemail,
            cpassword: state.cpassword,
            cname: state.cname,
            cphone: action.payload,
            cabout: state.cabout,
            cjoined: state.cjoined,
            cphoto: state.cphoto,
            cfavrest: state.cfavrest,
            cfavcuisine: state.cfavcuisine,
            cfollowers: [...state.cfollowers],
            cfollowing: [...state.cfollowing],
            clatitude: state.clatitude,
            clongitude: state.clongitude,
            caddress: state.caddress,
          };
        }

        case 'CJOINED': {
          return {
            cid: state.cid,
            cemail: state.cemail,
            cpassword: state.cpassword,
            cname: state.cname,
            cphone: state.cphone,
            cabout: state.cabout,
            cjoined: action.payload,
            cphoto: state.cphoto,
            cfavrest: state.cfavrest,
            cfavcuisine: state.cfavcuisine,
            cfollowers: [...state.cfollowers],
            cfollowing: [...state.cfollowing],
            clatitude: state.clatitude,
            clongitude: state.clongitude,
            caddress: state.caddress,
          };
        }

        case 'CABOUT': {
          return {
            cid: state.cid,
            cemail: state.cemail,
            cpassword: state.cpassword,
            cname: state.cname,
            cphone: state.cphone,
            cabout: action.payload,
            cjoined: state.cjoined,
            cphoto: state.cphoto,
            cfavrest: state.cfavrest,
            cfavcuisine: state.cfavcuisine,
            cfollowers: [...state.cfollowers],
            cfollowing: [...state.cfollowing],
            clatitude: state.clatitude,
            clongitude: state.clongitude,
            caddress: state.caddress,
          };
        }

        case 'CPHOTO': {
          return {
            cid: state.cid,
            cemail: state.cemail,
            cpassword: state.cpassword,
            cname: state.cname,
            cphone: state.cphone,
            cabout: state.cabout,
            cjoined: state.cjoined,
            cphoto: action.payload,
            cfavrest: state.cfavrest,
            cfavcuisine: state.cfavcuisine,
            cfollowers: [...state.cfollowers],
            cfollowing: [...state.cfollowing],
            clatitude: state.clatitude,
            clongitude: state.clongitude,
            caddress: state.caddress,
          };
        }

        case 'CFAVREST': {
          return {
            cid: state.cid,
            cemail: state.cemail,
            cpassword: state.cpassword,
            cname: state.cname,
            cphone: state.cphone,
            cabout: state.cabout,
            cjoined: state.cjoined,
            cphoto: state.cphoto,
            cfavrest: action.payload,
            cfavcuisine: state.cfavcuisine,
            cfollowers: [...state.cfollowers],
            cfollowing: [...state.cfollowing],
            clatitude: state.clatitude,
            clongitude: state.clongitude,
            caddress: state.caddress,
          };
        }

        case 'CFAVCUISINE': {
          return {
            cid: state.cid,
            cemail: state.cemail,
            cpassword: state.cpassword,
            cname: state.cname,
            cphone: state.cphone,
            cabout: state.cabout,
            cjoined: state.cjoined,
            cphoto: state.cphoto,
            cfavrest: state.cfavrest,
            cfavcuisine: action.payload,
            cfollowers: [...state.cfollowers],
            cfollowing: [...state.cfollowing],
            clatitude: state.clatitude,
            clongitude: state.clongitude,
            caddress: state.caddress,
          };
        }

        case 'CFOLLOWERS': {
          return {
            cid: state.cid,
            cemail: state.cemail,
            cpassword: state.cpassword,
            cname: state.cname,
            cphone: state.cphone,
            cabout: state.cabout,
            cjoined: state.cjoined,
            cphoto: state.cphoto,
            cfavrest: state.cfavrest,
            cfavcuisine: state.cfavcuisine,
            cfollowers: [...action.payload],
            cfollowing: [...state.cfollowing],
            clatitude: state.clatitude,
            clongitude: state.clongitude,
            caddress: state.caddress,
          };
        }

        case 'CFOLLOWING': {
          return {
            cid: state.cid,
            cemail: state.cemail,
            cpassword: state.cpassword,
            cname: state.cname,
            cphone: state.cphone,
            cabout: state.cabout,
            cjoined: state.cjoined,
            cphoto: state.cphoto,
            cfavrest: state.cfavrest,
            cfavcuisine: state.cfavcuisine,
            cfollowers: [...state.cfollowers],
            cfollowing: [...action.payload],
            clatitude: state.clatitude,
            clongitude: state.clongitude,
            caddress: state.caddress,
          };
        }

        case 'CLATITUDE': {
          return {
            cid: state.cid,
            cemail: state.cemail,
            cpassword: state.cpassword,
            cname: state.cname,
            cphone: state.cphone,
            cabout: state.cabout,
            cjoined: state.cjoined,
            cphoto: state.cphoto,
            cfavrest: state.cfavrest,
            cfavcuisine: state.cfavcuisine,
            cfollowers: [...state.cfollowers],
            cfollowing: [...state.cfollowing],
            clatitude: action.payload,
            clongitude: state.clongitude,
            caddress: state.caddress,
          };
        }

        case 'CLONGITUDE': {
          return {
            cid: state.cid,
            cemail: state.cemail,
            cpassword: state.cpassword,
            cname: state.cname,
            cphone: state.cphone,
            cabout: state.cabout,
            cjoined: state.cjoined,
            cphoto: state.cphoto,
            cfavrest: state.cfavrest,
            cfavcuisine: state.cfavcuisine,
            cfollowers: [...state.cfollowers],
            cfollowing: [...state.cfollowing],
            clatitude: state.clatitude,
            clongitude: action.payload,
            caddress: state.caddress,
          };
        }

        case 'CADDRESS': {
          return {
            cid: state.cid,
            cemail: state.cemail,
            cpassword: state.cpassword,
            cname: state.cname,
            cphone: state.cphone,
            cabout: state.cabout,
            cjoined: state.cjoined,
            cphoto: state.cphoto,
            cfavrest: state.cfavrest,
            cfavcuisine: state.cfavcuisine,
            cfollowers: [...state.cfollowers],
            cfollowing: [...state.cfollowing],
            clatitude: state.clatitude,
            clongitude: state.clongitude,
            caddress: action.payload,
          };
        }

        default: {
          return state;
        }
      }
    }

    case 'ADD': {
      switch (action.field) {
        case 'CFOLLOWERS': {
          let newcfollower = [...state.cphoto];
          newcfollower.push(action.payload);
          return {
            cid: state.cid,
            cemail: state.cemail,
            cpassword: state.cpassword,
            cname: state.cname,
            cphone: state.cphone,
            cabout: state.cabout,
            cjoined: state.cjoined,
            cphoto: state.cphoto,
            cfavrest: state.cfavrest,
            cfavcuisine: state.cfavcuisine,
            cfollowers: [...newcfollower],
            cfollowing: [...state.cfollowing],
            clatitude: state.clatitude,
            clongitude: state.clongitude,
            caddress: state.caddress,
          };
        }

        case 'CFOLLOWING': {
          let newcfollowing = [...state.cphoto];
          newcfollowing.push(action.payload);
          return {
            cid: state.cid,
            cemail: state.cemail,
            cpassword: state.cpassword,
            cname: state.cname,
            cphone: state.cphone,
            cabout: state.cabout,
            cjoined: state.cjoined,
            cphoto: state.cphoto,
            cfavrest: state.cfavrest,
            cfavcuisine: state.cfavcuisine,
            cfollowers: [...state.cfollower],
            cfollowing: [...newcfollowing],
            clatitude: state.clatitude,
            clongitude: state.clongitude,
            caddress: state.caddress,
          };
        }

        default: {
          return state;
        }
      }
    }

    default:
      return state;
  }
};

export default custReducer;
