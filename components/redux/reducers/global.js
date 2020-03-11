const global = function(state = {}, action) {
	
	state = Object.assign({}, state, {
		lastAction: action.type
	})

	switch (action.type) {

		case "FROM_COOKIES" : {

      state = Object.assign({}, state, {
        cookies: action.cookies
      });

			break;
    }
  }

  return state;
}

export default global;