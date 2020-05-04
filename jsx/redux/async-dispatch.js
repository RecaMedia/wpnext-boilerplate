const asyncDispatchMiddleware = store => next => action => {
  let syncActivityFinished = false;
  let actionQueue = [];

  function flushQueue() {
    actionQueue.map((a,i) => {
      // Action types to ignore
      if (a.type != "@@router/LOCATION_CHANGE") {
        store.dispatch(a);
      }
    });
    // Flush queue
    actionQueue = [];
  }

  function asyncDispatch(asyncAction) {
    if (asyncAction.constructor.toString().indexOf("Array") != -1) {
      actionQueue = actionQueue.concat(asyncAction);
    } else {
      actionQueue = actionQueue.concat([asyncAction]);
    }
    if (syncActivityFinished) {
      flushQueue();
    }
  }

  var new_action;
  if (action.type === undefined) {
    new_action = {
      type: "ASYNC",
      asyncDispatch
    }
  } else {
    new_action = {
      asyncDispatch
    }
  }

  const actionWithAsyncDispatch = Object.assign({}, action, new_action);

  next(actionWithAsyncDispatch);
  syncActivityFinished = true;
  flushQueue();
};

export default asyncDispatchMiddleware;