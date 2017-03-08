const initialState = []

const toastsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_TOAST':
      return [...state, {
        _id: Date.now(),
        type: 'notice',
        message: action.message,
        timeout: 5000
      }]

    case 'SHOW_ERROR_TOAST':
      return [...state, {
        _id: Date.now(),
        type: 'error',
        message: action.message,
        timeout: 5000
      }]

    case 'SHOW_POLL_TOAST':
      return [...state, {
        _id: action.poll,
        type: 'poll',
        message: action.message
      }]

    case 'REMOVE_POLL_TOAST':
      action.toast = action.poll

    case 'REMOVE_TOAST':
      const i = state.findIndex((t) => t._id === action.toast)
      
      return i === -1 ? state : [
        ...state.slice(0, i),
        ...state.slice(i + 1)
      ]

    case 'CLEAR_TIMED_TOASTS':
      return state.filter((t) => !t.timeout)
      

    default:
      return state
  }
}

export default toastsReducer
