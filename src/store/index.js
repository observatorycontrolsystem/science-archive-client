import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    messages: []
  },
  mutations: {
    clearAllMessages(state) {
      /* Clear all messages */
      state.messages = [];
    },
    addMessage(state, newMessage) {
      /* Add a message.

      A message is a object with the following fields:
        `text`: The text of the message
        `variant`: The bootstrap variant used when displaying the message e.g. 'danger', 'success', etc.
      */
      let messageAlreadyInList = false;
      for (let message of state.messages) {
        if (message.text === newMessage.text) {
          messageAlreadyInList = true;
          break;
        }
      }
      if (!messageAlreadyInList) {
        state.messages.push(newMessage);
      }
    },
    deleteMessage(state, messageText) {
      /* Delete a single message with the given text. */
      state.messages = state.messages.filter(function(value) {
        return value.text !== messageText;
      });
    }
  },
  actions: {},
  modules: {}
});
