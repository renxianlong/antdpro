import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import {
  Modal,
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

const CreateForm = Form.create()(props => {
  const { roleList, modalVisible, form, handleAdd, handleModalVisible } = props;
  console.log(roleList);
  const optionList = [];
  for (let role of roleList) {
    optionList.push(<Select.Option key={role.id}>{role.name}</Select.Option>);
  }

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="新增管理员"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="账号">
        {form.getFieldDecorator('username', {
          rules: [{ required: true, message: '请输入账号' }],
        })(<Input placeholder="请输入" />)}
      </Form.Item>
      <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
        {form.getFieldDecorator('password', {
          rules: [{ required: true, message: '请输入密码' }],
        })(<Input placeholder="请输入" />)}
      </Form.Item>
      <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
        {form.getFieldDecorator('nickname', {
          rules: [{ required: true, message: '请输入姓名' }],
        })(<Input placeholder="请输入" />)}
      </Form.Item>
      <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号">
        {form.getFieldDecorator('mobile', {
          rules: [{ required: true, message: '请输入手机号' }],
        })(<Input placeholder="请输入" />)}
      </Form.Item>
      <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色">
        {form.getFieldDecorator('roleIdList', {
          rules: [{ required: true, message: '请选择角色' }],
        })(
          <Select
            showSearch
            optionFilterProp="children"
            mode="multiple"
            placeholder="请选择"
            style={{ width: '100%' }}
          >
            {optionList}
          </Select>
        )}
      </Form.Item>
    </Modal>
  );
});

@connect(({ role, admin, loading }) => ({
  roleList: role.roleList,
  data: admin.data,
  loading: loading.models.admin,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/list',
    });
    dispatch({
      type: 'admin/search',
    });
  }

  handleStandardTableChange = (pagination, filters, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      p: pagination.current,
      l: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    dispatch({
      type: 'admin/search',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'admin/search',
      payload: {},
    });
  };

  handleEditClick = record => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/admin/detail',
        state: {
          data: record,
        },
      })
    );
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
        type: 'admin/search',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    this.props.dispatch({
      type: 'admin/add',
      payload: fields,
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });

    this.props.dispatch({
      type: 'admin/search',
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={12}>
            <Form.Item label="姓名">
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
                  <Option value="1">正常</Option>
                  <Option value="2">停用</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col md={4} sm={12}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { roleList, data, loading } = this.props;
    const { modalVisible } = this.state;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '账号',
        dataIndex: 'username',
      },
      {
        title: '姓名',
        dataIndex: 'nickname',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render(val) {
          switch (val) {
            case 1:
              return '正常';
              break;
            case 2:
              return '停用';
              break;
            default:
              return 'bug';
          }
        },
      },
      {
        title: '最近登录时间',
        dataIndex: 'lastLoginTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '角色',
        dataIndex: 'roleList',
        render: val => {
          let roleList = '';
          if (!(val === undefined)) {
            for (let i = 0; i < val.length; i++) {
              roleList = roleList + val[i].name;
              console.log(val.length);
              if (!(i === val.length - 1)) {
                roleList = roleList + '、';
              }
            }
          }
          return roleList;
        },
      },
    ];

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div>
            <StandardTable
              loading={loading}
              data={data}
              columns={columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} roleList={roleList} />
      </PageHeaderLayout>
    );
  }
}
