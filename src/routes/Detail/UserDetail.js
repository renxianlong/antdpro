import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Divider,
  Icon,
  Button,
  Dropdown,
  List,
  Menu,
  message,
  Badge,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from 'components/DescriptionList';
import styles from './style.less';

@connect(({ user, loading }) => ({
  data: user.data,
  loading: loading.models.user,
}))
@Form.create()
export default class UserDetail extends PureComponent {
  render() {
    const { Description } = DescriptionList;
    const { form, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { data } = this.props.location.state;
    console.log(data.sex);

    //设置性别
    let sex;
    switch (data.sex) {
      case 0:
        sex = '男';
        break;
      case 1:
        sex = '女';
        break;
      default:
        sex = 'bug';
    }

    //设置状态
    let status;
    switch (data.status) {
      case 1:
        status = '正常';
        break;
      case 2:
        status = '冻结';
        break;
      default:
        status = 'bug';
    }

    return (
      <Card title="用户详情">
        <DescriptionList size="large" style={{ marginBottom: 20 }}>
          <Description term="ID">{data.id}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 20 }} />
        <DescriptionList size="large" style={{ marginBottom: 20 }}>
          <Description term="昵称">{data.nickname}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 20 }} />
        <DescriptionList size="large" style={{ marginBottom: 20 }}>
          <Description term="性别">{sex}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 20 }} />
        <DescriptionList size="large" style={{ marginBottom: 20 }}>
          <Description term="手机号">{data.mobile}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 20 }} />
        <DescriptionList size="large" style={{ marginBottom: 20 }}>
          <Description term="状态">{status}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 20 }} />
        <DescriptionList size="large" style={{ marginBottom: 20 }}>
          <Description term="地区">{data.city}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 20 }} />
        <DescriptionList size="large" style={{ marginBottom: 20 }}>
          <Description term="学校">{data.school}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 20 }} />
        <DescriptionList size="large" style={{ marginBottom: 20 }}>
          <Description term="工作单位">{data.compony}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 20 }} />
        <DescriptionList size="large" style={{ marginBottom: 20 }}>
          <Description term="职位">{data.job}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 20 }} />
        <DescriptionList size="large" style={{ marginBottom: 20 }}>
          <Description term="加V">{data.verfyDesc}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 20 }} />
      </Card>
    );
  }
}
