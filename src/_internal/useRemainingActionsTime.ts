import * as React from 'react'

import { useInterval } from './useInterval'

export enum ActionTypes {
  setActionsCount,
  actionDone,
  onInitLoad,
  retrieveRemainingTime,
  onError,
}
type Actions =
  | { type: ActionTypes.setActionsCount; value: number }
  | { type: ActionTypes.actionDone }
  | { type: ActionTypes.onInitLoad }
  | { type: ActionTypes.onError }
  | { type: ActionTypes.retrieveRemainingTime; value: number | null }

type State = {
  loading: boolean
  total: number
  done: number

  startTime: number | undefined
  remainingTime: number | undefined | null
}
export const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case ActionTypes.actionDone: {
      const done = state.done + 1
      const newRemainingTime =
        ((new Date().getTime() - (state.startTime ?? 0)) / done) *
        (state.total - done)
      return {
        ...state,
        done,
        loading: done < state.total,
        remainingTime: newRemainingTime,
      }
    }
    case ActionTypes.setActionsCount:
      return {
        ...state,
        total: action.value,
      }
    case ActionTypes.onError: {
      return {
        ...state,
        loading: false,
        total: 0,
        done: 0,
        startTime: undefined,
        remainingTime: 0,
      }
    }
    case ActionTypes.retrieveRemainingTime:
      const remainingTime =
        state.remainingTime && action.value
          ? state.remainingTime - action.value
          : 0
      return {
        ...state,
        remainingTime: remainingTime > 0 ? remainingTime : 0,
      }
    case ActionTypes.onInitLoad: {
      return {
        ...state,
        startTime: new Date().getTime(),
        done: 0,
        loading: true,
        lastDoneTime: null,
        deltaTimes: [],
        remainingTime: undefined,
      }
    }
  }
}

const INITIAL_STATE: State = {
  loading: false,
  total: 0,
  done: 0,

  startTime: undefined,
  remainingTime: undefined,
}

export const useRemainingActionsTime = () => {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE)

  const intervalTime = state.loading ? 1000 : null

  useInterval(
    () =>
      dispatch({
        type: ActionTypes.retrieveRemainingTime,
        value: intervalTime,
      }),
    intervalTime
  )

  const onActionDone = React.useCallback(
    () => dispatch({ type: ActionTypes.actionDone }),
    []
  )
  const setActionsCount = React.useCallback(
    (value: number) => dispatch({ type: ActionTypes.setActionsCount, value }),
    []
  )
  const initLoading = React.useCallback(
    () => dispatch({ type: ActionTypes.onInitLoad }),
    []
  )
  const onError = React.useCallback(
    () => dispatch({ type: ActionTypes.onError }),
    []
  )
  return [
    state,
    {
      onError,
      onActionDone,
      setActionsCount,
      initLoading,
    },
  ] as const
}
