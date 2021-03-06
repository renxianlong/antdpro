import { UserDetail, UserSearch, UserUpdate } from '../services/api';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'user',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *detail({ payload }, { call, put }) {
      const response = yield call(UserDetail, payload);
      yield put(
        routerRedux.push({
          pathname: '/user-management/detail',
          state: {
            data: response.d,
          },
        })
      );
    },
    *search({ payload }, { call, put }) {
      const response = yield call(UserSearch, payload);
      yield put({
        type: 'saveSearch',
        payload: response,
      });
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(UserUpdate, payload);
    },
  },

  reducers: {
    saveSearch(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.d.list,
          pagination: {
            total: action.payload.d.t,
            pageSize: action.payload.d.l,
            current: action.payload.d.p,
          },
        },
      };
    },
  },
};
