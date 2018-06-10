import { isUrl } from '../utils/utils';
import { AdminLogin } from '../services/api';

const menuData = [
  {
    name: '账号权限',
    path: 'adminAndPermission',
    children: [
      {
        name: '管理员列表',
        path: 'adminList',
      },
      {
        name: '角色列表',
        path: 'roleList',
      },
      {
        name: '权限列表',
        path: 'permissionList',
      },
    ],
  },
  {
    name: '用户管理',
    path: 'user-management',
    children: [
      {
        name: '用户列表',
        path: 'list',
      },
    ],
  },
  {
    name: '局管理',
    path: 'ju-management',
    children: [
      {
        name: '局列表',
        path: 'list',
      },
    ],
  },
  {
    name: '风控模块',
    path: 'risk',
    children: [
      {
        name: '敏感词列表',
        path: 'sensitiveWordList',
      },
      {
        name: '局审核列表',
        path: 'juCheckList',
      },
    ],
  },
  {
    name: '运营管理',
    path: 'business-management',
    children: [
      {
        name: '广告位列表',
        path: 'timelineBannerList',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
