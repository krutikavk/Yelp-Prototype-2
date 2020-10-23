const initialRestProfile = {
  rid: '',
  remail: '',
  rpassword: '',
  rname: '',
  rphone: '',
  rabout: '',
  rphoto: ['abc', 'def', 'efg'],
  rlatitude: '',
  rlongitude: '',
  raddress: '',
  rcuisine: '',
  rdelivery: '',
  rdish: [],
  rhours: {},
  rrating: '',
  revents: [],
};

const restReducer = (state = initialRestProfile, action) => {
  switch (action.type) {
    case 'UPDATE': {
      switch (action.field) {
        case 'RID': {
          return {
            /*
            rid: action.payload,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: state.rphoto,
            rlocation: state.rlocation,
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            */
            rid: action.payload,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: [...state.rphoto],
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            rdish: [...state.rdish],
            rhours: { ...state.rhours },
            rrating: state.rrating,
            revents: [...state.revents],
          };
        }

        case 'REMAIL': {
          return {
            /*
            rid: state.rid,
            remail: action.payload,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: state.rphoto,
            rlocation: state.rlocation,
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            */

            rid: state.rid,
            remail: action.payload,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: [...state.rphoto],
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            rdish: [...state.rdish],
            rhours: { ...state.rhours },
            rrating: state.rrating,
            revents: [...state.revents],
          };
        }

        case 'RPASSWORD': {
          return {
            /*
            rid: state.rid,
            remail: state.remail,
            rpassword: action.payload,
            rname: state.rname,
            rphone: state.rphone,
            rphoto: state.rphoto,
            rabout: state.rabout,
            rlocation: state.rlocation,
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            */
            rid: state.rid,
            remail: state.remail,
            rpassword: action.payload,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: [...state.rphoto],
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            rdish: [...state.rdish],
            rhours: { ...state.rhours },
            rrating: state.rrating,
            revents: [...state.revents],
          };
        }

        case 'RNAME': {
          return {
            /*
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: action.payload,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: state.rphoto,
            rlocation: state.rlocation,
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            */
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: action.payload,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: [...state.rphoto],
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            rdish: [...state.rdish],
            rhours: { ...state.rhours },
            rrating: state.rrating,
            revents: [...state.revents],
          };
        }

        case 'RPHONE': {
          return {
            /*
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: action.payload,
            rabout: state.rabout,
            rphoto: state.rphoto,
            rlocation: state.rlocation,
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            */
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: action.payload,
            rabout: state.rabout,
            rphoto: [...state.rphoto],
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            rdish: [...state.rdish],
            rhours: { ...state.rhours },
            rrating: state.rrating,
            revents: [...state.revents],
          };
        }

        case 'RABOUT': {
          return {
            /*
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: action.payload,
            rphoto: state.rphoto,
            rlocation: state.rlocation,
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            */
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: action.payload,
            rphoto: [...state.rphoto],
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            rdish: [...state.rdish],
            rhours: { ...state.rhours },
            rrating: state.rrating,
            revents: [...state.revents],
          };
        }

        case 'RPHOTO': {
          // eslint-disable-next-line prefer-const
          return {
            /*
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: action.payload,
            rlocation: state.rlocation,
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            */
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: [...action.payload],
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            rdish: [...state.rdish],
            rhours: { ...state.rhours },
            rrating: state.rrating,
            revents: [...state.revents],
          };
        }
        // Do not need anymore
        case 'RLOCATION': {
          return {
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: state.rphoto,
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
          };
        }

        case 'RLATITUDE': {
          return {
            /*
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: state.rphoto,
            rlocation: state.rlocation,
            rlatitude: action.payload,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            */
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: [...state.rphoto],
            rlatitude: action.payload,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            rdish: [...state.rdish],
            rhours: { ...state.rhours },
            rrating: state.rrating,
            revents: [...state.revents],
          };
        }

        case 'RLONGITUDE': {
          return {
            /*
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: state.rphoto,
            rlocation: state.rlocation,
            rlatitude: state.rlatitude,
            rlongitude: action.payload,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            */
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: [...state.rphoto],
            rlatitude: state.rlatitude,
            rlongitude: action.payload,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            rdish: [...state.rdish],
            rhours: { ...state.rhours },
            rrating: state.rrating,
            revents: [...state.revents],
          };
        }

        case 'RADDRESS': {
          return {
            /*
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: state.rphoto,
            rlocation: state.rlocation,
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: action.payload,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            */
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: [...state.rphoto],
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: action.payload,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            rdish: [...state.rdish],
            rhours: { ...state.rhours },
            rrating: state.rrating,
            revents: [...state.revents],
          };
        }

        case 'RCUISINE': {
          return {
            /*
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: state.rphoto,
            rlocation: state.rlocation,
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: action.payload,
            rdelivery: state.rdelivery,
            */
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: [...state.rphoto],
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: action.payload,
            rdelivery: state.rdelivery,
            rdish: [...state.rdish],
            rhours: { ...state.rhours },
            rrating: state.rrating,
            revents: [...state.revents],
          };
        }

        case 'RDELIVERY': {
          return {
            /*
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: state.rphoto,
            rlocation: state.rlocation,
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: action.payload,
            */
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: [...state.rphoto],
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: action.payload,
            rdish: [...state.rdish],
            rhours: { ...state.rhours },
            rrating: state.rrating,
            revents: [...state.revents],
          };
        }

        case 'RDISH': {
          return {
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: [...state.rphoto],
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            rdish: [...action.payload],
            rhours: { ...state.rhours },
            rrating: state.rrating,
            revents: [...state.revents],
          };
        }

        case 'RHOURS': {
          return {
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: [...state.rphoto],
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            rdish: [...state.rdish],
            rhours: { ...action.payload },
            rrating: state.rrating,
            revents: [...state.revents],
          };
        }

        case 'RRATING': {
          return {
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: [...state.rphoto],
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            rdish: [...state.rdish],
            rhours: { ...state.rhours },
            rrating: action.payload,
            revents: [...state.revents],
          };
        }

        case 'REVENTS': {
          return {
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: [...state.rphoto],
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            rdish: [...state.rdish],
            rhours: { ...state.rhours },
            rrating: state.rrating,
            revents: [...action.payload],
          };
        }

        default: {
          return state;
        }
      }
    }
    case 'ADD': {
      switch (action.field) {
        case 'RPHOTO': {
          // eslint-disable-next-line prefer-const
          let newrphoto = [...state.rphoto];
          newrphoto.push(action.payload);
          return {
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: [...newrphoto],
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            rdish: [...state.rdish],
            rhours: { ...state.rhours },
            rrating: state.rrating,
            revents: [...state.revents],
          };
        }

        case 'RDISH': {
          // eslint-disable-next-line prefer-const
          let newrdish = [...state.rdish];
          newrdish.push(action.payload);
          return {
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: [...state.rphoto],
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            rdish: [...newrdish],
            rhours: { ...state.rhours },
            rrating: state.rrating,
            revents: [...state.revents],
          };
        }

        case 'REVENTS': {
          // eslint-disable-next-line prefer-const
          let newrevents = [...state.revents];
          newrevents.push(action.payload);
          return {
            rid: state.rid,
            remail: state.remail,
            rpassword: state.rpassword,
            rname: state.rname,
            rphone: state.rphone,
            rabout: state.rabout,
            rphoto: [...state.rphoto],
            rlatitude: state.rlatitude,
            rlongitude: state.rlongitude,
            raddress: state.raddress,
            rcuisine: state.rcuisine,
            rdelivery: state.rdelivery,
            rdish: [...state.rdish],
            rhours: { ...state.rhours },
            rrating: state.rrating,
            revents: [...newrevents],
          };
        }

        default: {
          return state;
        }
      }
    }

    default: {
      return state;
    }
  }
};

export default restReducer;
