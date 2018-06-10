import { RoleSearch, RoleAdd } from '../services/api';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'role',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    roleList: [],
  },

  effects: {
    *list({ payload }, { call, put }) {
      const request = { l: '100000' };
      const response = yield call(RoleSearch, request);
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *search({ payload }, { call, put }) {
      const request = { orderBy: 'id', ...payload };
      const response = yield call(RoleSearch, request);
      yield put({
        type: 'saveSearch',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(RoleAdd, payload);
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
    saveList(state, action) {
      return {
        ...state,
        roleList: action.payload.d.list,
      };
    },
  },
};
