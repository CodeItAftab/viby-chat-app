const AuthInitialState = {
  user: {
    _id: "",
    name: "",
    username: "",
    email: "",
    avatar: "",
  },
  isLoggedIn: false,
  isLoading: false,
};

const AppInitialState = {
  selectedChatId: "",
  selectedChat: {
    _id: "",
    name: "",
    avatar: "",
    online: false,
    friendId: "",
  },
  isTyping: false,
};

export { AuthInitialState, AppInitialState };
