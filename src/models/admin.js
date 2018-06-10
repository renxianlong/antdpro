import { AdminSearch, AdminUpdate, AdminAdd, AdminCurrent, RoleSearch } from '../services/api';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'admin',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *current({ payload }, { call, put }) {
      const response = yield call(AdminCurrent, payload);
      yield put({
        type: 'saveCurrent',
        payload: response,
      });
    },
    *search({ payload }, { call, put }) {
      const request = { orderBy: 'id', ...payload };
      const response = yield call(AdminSearch, request);
      yield put({
        type: 'saveSearch',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(AdminAdd, payload);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(AdminUpdate, payload);
    },
  },

  reducers: {
    saveCurrent(state, action) {
      return {
        ...state,
        currentUser: action.payload.d,
      };
    },
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
