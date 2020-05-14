const global = function(state, action) {

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

    case "CUR_PAGE" : {

      state = Object.assign({}, state, {
        page: action.page
      });

			break;
    }

    case "WP_INFO" : {
      
      state = Object.assign({}, state, {
        WPInfo: action.WPInfo
      });

			break;
    }
  }

  return state;
}

export default global;