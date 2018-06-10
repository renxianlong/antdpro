import { CategoryAll } from '../services/api';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'category',

  state: {
    data: {
      list: [],
    },
  },

  effects: {
    *all({ payload }, { call, put }) {
      const response = yield call(CategoryAll, payload);
      yield put({
        type: 'saveAll',
        payload: response,
      });
    },
  },

  reducers: {
    saveAll(state, action) {
      console.log(action);
      return {
        ...state,
        data: {
          list: action.payload.d.l,
        },
      };
    },
  },
};
