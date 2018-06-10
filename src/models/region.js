import { RegionList } from '../services/api';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'region',

  state: {
    data: {
      cityList: [],
      cityMap: {},
    },
  },

  effects: {
    *cityList({ payload }, { call, put }) {
      const request = { level: 3 };
      const response = yield call(RegionList, request);
      yield put({
        type: 'saveCityList',
        payload: response,
      });
    },
  },

  reducers: {
    saveCityList(state, action) {
      let regionList = action.payload.d.l;
      let regionListMap = new Map();
      if (!(regionList === undefined || regionList.length === 0)) {
        for (let region of regionList) {
          regionListMap.set(region.code, region);
        }
      }
      return {
        ...state,
        data: {
          cityList: regionList,
          cityMap: regionListMap,
        },
      };
    },
  },
};
