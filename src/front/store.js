export const initialStore = () => {
  return {
    avatar: "/avatars/1.PNG",
    message: null,
    auth: {
      token: null,
      user_id: null,
    },
    userData: null,

    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "set_avatar":
      return {
        ...store,
        avatar: action.payload,
      };

    case "set_user_data":
      return {
        ...store,
        userData: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;

      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };

    case "login":
      return {
        ...store,
        message: action.payload,
      };

    case "SET_AUTH":
      return {
        ...store,
        auth: {
          token: action.payload.token,
          user_id: action.payload.user_id,
        },
      };

    case "logout":
      localStorage.clear();
      return initialStore();

    default:
      throw Error("Unknown action.");
  }
}
