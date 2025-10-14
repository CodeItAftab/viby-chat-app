import { AppInitialState } from "@/constants/store";
import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "app",
  initialState: AppInitialState,
  reducers: {
    setSelectedChatId(state, action) {
      state.selectedChatId = action.payload;
    },
    setSelectedChat(state, action) {
      const { _id, name, avatar, online, friendId } = action.payload;
      state.selectedChatId = _id;
      state.selectedChat = {
        _id,
        name,
        avatar,
        online,
        friendId,
      };
    },
    setIsTyping(state, action) {
      state.isTyping = action.payload;
    },
  },
});

export const { setSelectedChatId, setSelectedChat, setIsTyping } =
  slice.actions;
export default slice.reducer;
