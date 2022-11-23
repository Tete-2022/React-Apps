import initialState from './initialState';

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'APPS.THEME':
      return {
        ...state,
        apps: {
          ...state.apps,
          theme: global.theme,
        },
      };
    case 'APPS.NOTIFICATIONCOUNT':
      return {
        ...state,
        apps: {
          ...state.apps,
          notificationCount: global.notification_count,
        },
      };




    default:
      return state;
  }
}
