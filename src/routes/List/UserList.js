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
  Icon,
  Button,
  Dropdown,
  Menu,
  message,
  Badge,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './List.less';

@connect(({ user, loading }) => ({
  data: user.data,
  loading: loading.models.user,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  //页面加载完后请求数据
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/search',
    });
  }

  //分页、排序、筛选变化时触发
  handleStandardTableChange = (pagination, filters, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      p: pagination.current,
      l: pagination.pageSize,
      ...formValues,
    };

    dispatch({
      type: 'user/search',
      payload: params,
    });
  };

  //点击
  onClickId = value => {
    console.log(value);
    const { dispatch } = this.props;
    dispatch({
      type: 'user/detail',
      payload: {
        id: value,
      },
    });
  };

  //重置查询条件
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'user/search',
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) {
        console.log('fuck');
        return;
      }
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'user/search',
        payload: values,
      });
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={12}>
            <Form.Item label="昵称">
              {getFieldDecorator('nickname')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col md={4} sm={12}>
            <Form.Item label="手机号">
              {getFieldDecorator('mobile')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col md={4} sm={12}>
            <Form.Item label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Select.Option value="1">正常</Select.Option>
                  <Select.Option value="2">停用</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { data, loading } = this.props;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        render: value => <a onClick={() => this.onClickId(value)}> {value} </a>,
      },
      {
        title: '昵称',
        dataIndex: 'nickname',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
      },
      {
        title: '好友数量',
        dataIndex: 'friendCount',
      },
      {
        title: '发局数量',
        dataIndex: 'juCreateCount',
      },
      {
        title: '参与局数量',
        dataIndex: 'juJoinCount',
      },
      {
        title: '最后登录城市',
        dataIndex: 'lastLoginCity',
      },
      {
        title: '加V信息',
        dataIndex: 'verficationDesc',
      },
      {
        title: '注册时间',
        dataIndex: 'createTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '状态',
        dataIndex: 'status',
        render(value) {
          switch (value) {
            case 1:
              return '正常';
              break;
            case 2:
              return '冻结';
              break;
            default:
              return 'bug';
          }
        },
      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              loading={loading}
              data={data}
              columns={columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
