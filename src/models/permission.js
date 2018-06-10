import { PermissionSearch, PermissionAdd } from '../services/api';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'permission',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *search({ payload }, { call, put }) {
      const request = { orderBy: 'id', ...payload };
      const response = yield call(PermissionSearch, request);
      yield put({
        type: 'saveSearch',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(PermissionAdd, payload);
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
