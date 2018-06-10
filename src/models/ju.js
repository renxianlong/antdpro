import { JuSearch, JuDetail } from '../services/api';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'ju',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *search({ payload }, { call, put }) {
      //设置默认的page和limit
      if (payload === undefined) {
        payload = {
          p: 1,
          l: 10,
        };
      } else {
        if (!('p' in payload)) {
          payload = { ...payload, p: 1 };
        }
        if (!('l' in payload)) {
          payload = { ...payload, l: 10 };
        }
      }

      const response = yield call(JuSearch, payload);
      yield put({
        type: 'saveSearch',
        payload: response,
      });
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
