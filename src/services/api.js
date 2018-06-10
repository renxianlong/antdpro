import { stringify } from 'qs';
import request from '../utils/request';

//管理员登陆
export async function AdminLogin(params) {
  return request('/admin/login', {
    method: 'POST',
    body: params,
  });
}

//管理员列表
export async function AdminSearch(params) {
  return request('/admin/search', {
    method: 'POST',
    body: params,
  });
}

//添加管理员
export async function AdminAdd(params) {
  return request('/admin/add', {
    method: 'POST',
    body: params,
  });
}

//更新管理员
export async function AdminUpdate(params) {
  return request('/admin/update', {
    method: 'POST',
    body: params,
  });
}

//管理员列表
export async function AdminCurrent(params) {
  return request('/admin/current', {
    method: 'POST',
    body: params,
  });
}

//角色列表
export async function RoleSearch(params) {
  return request('/role/search', {
    method: 'POST',
    body: params,
  });
}

//添加角色
export async function RoleAdd(params) {
  return request('/role/add', {
    method: 'POST',
    body: params,
  });
}

//角色列表
export async function PermissionSearch(params) {
  return request('/permission/search', {
    method: 'POST',
    body: params,
  });
}

//添加角色
export async function PermissionAdd(params) {
  return request('/permission/add', {
    method: 'POST',
    body: params,
  });
}

//角色列表
export async function UserSearch(params) {
  return request('/user/search', {
    method: 'POST',
    body: params,
  });
}

//角色列表
export async function UserDetail(params) {
  return request('/user/detail', {
    method: 'POST',
    body: params,
  });
}

//添加角色
export async function UserUpdate(params) {
  return request('/user/update', {
    method: 'POST',
    body: params,
  });
}

//局列表
export async function JuSearch(params) {
  return request('/ju/admin/search', {
    method: 'POST',
    body: params,
  });
}

//角色列表
export async function JuDetail(params) {
  return request('/ju/admin/detail', {
    method: 'POST',
    body: params,
  });
}

//局列表
export async function CategoryAll(params) {
  return request('/category/all', {
    method: 'POST',
    body: params,
  });
}

//首页活动列表
export async function TimelineBannerSearch(params) {
  return request('/timeline/banner/search', {
    method: 'POST',
    body: params,
  });
}

//局列表
export async function RegionList(params) {
  return request('/address/region/list', {
    method: 'POST',
    body: params,
  });
}
