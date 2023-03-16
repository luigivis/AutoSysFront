import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import { login, logout } from "src/service/api";
import { LOGIN } from "src/service/endpoints";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...// if payload (user) is provided, then is authenticated
      (user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    var isAuthenticated = false;

    try {
      isAuthenticated = localStorage.getItem("authenticated");
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {
      const userStorage = JSON.parse(localStorage.getItem("userStorage"));
      const user = userStorage;

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user,
      });
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE,
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const signIn = async (email, password) => {
    const response = await login(LOGIN.login, email, password, {
      "Content-Type": "application/json",
    });
    if (response.status != 200) {
      throw new Error("Please check your email and password");
    }
    try {
      localStorage.setItem("authenticated", "true");
      localStorage.setItem("rowsPerPage", "5");
    } catch (err) {
      console.error(err);
    }

    const user = {
      id: `${response.headers}`,
      avatar: "/assets/avatars/avatar-anika-visser.png",
      name: `${response.response.status.description}`,
      email: "anika.visser@devias.io",
    };
    localStorage.setItem("userStorage", JSON.stringify(user));

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user,
    });
  };

  const signUp = async (email, name, password) => {
    throw new Error("Sign up is not implemented");
  };

  const signOut = async (token) => {
    var response = await logout(LOGIN.logout, {
      "Content-Type": "application/json",
      jwt: `${token}`,
    });
    localStorage.removeItem("userStorage");
    localStorage.removeItem("rowsPerPage");
    try {
      localStorage.setItem("authenticated", "false");
    } catch (err) {
      console.error(err);
    }
    dispatch({
      type: HANDLERS.SIGN_OUT,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
