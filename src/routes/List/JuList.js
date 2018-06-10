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
  DatePicker,
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

@connect(({ category, ju, loading }) => ({
  categoryList: category.data.list,
  data: ju.data,
  loading: loading.models.ju,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    formValues: {},
  };

  //页面加载完后请求数据
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'category/all',
    });
  }

  //页面加载完后请求数据
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ju/search',
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
      type: 'ju/search',
      payload: params,
    });
  };

  //点击
  onClickId = value => {
    console.log(value);
    const { dispatch } = this.props;
    dispatch({
      type: 'ju/detail',
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
      type: 'ju/search',
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      if (!(values.categories === undefined)) {
        values.categories = [values.categories];
      }
      dispatch({
        type: 'ju/search',
        payload: values,
      });
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { categoryList } = this.props;
    let parentCategoryOptionList = [];
    let childCategoryOptionList = [];
    let parentCategoryMap = new Map();
    if (!(categoryList === undefined)) {
      for (let paparentCategory of categoryList) {
        parentCategoryMap.set(paparentCategory.id, paparentCategory);
        parentCategoryOptionList.push(
          <Select.Option key={paparentCategory.id}>{paparentCategory.name}</Select.Option>
        );
        for (let childCategory of paparentCategory.categories) {
          childCategoryOptionList.push(
            <Select.Option key={childCategory.id}>{childCategory.name}</Select.Option>
          );
        }
      }
    }

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={12}>
            <Form.Item label="标题">
              {getFieldDecorator('title')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col md={4} sm={12}>
            <Form.Item label="局类型">
              {getFieldDecorator('type')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Select.Option value="1">公开局</Select.Option>
                  <Select.Option value="2">好友局</Select.Option>
                  <Select.Option value="3">私密局</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col md={4} sm={12}>
            <Form.Item label="大类">
              {getFieldDecorator('parentCategory')(
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择"
                  style={{ width: '100%' }}
                  // onChange={
                  //   (value) => {
                  //     let paparentCategory = parentCategoryMap.get(parseInt(value));
                  //     console.log(paparentCategory);
                  //     for (let childCategory of paparentCategory.categories) {
                  //       childCategoryOptionList = [];
                  //       childCategoryOptionList.push(<Select.Option key={childCategory.id}>{childCategory.name}</Select.Option>);
                  //     }
                  //   }
                  // }
                >
                  {parentCategoryOptionList}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col md={4} sm={12}>
            <Form.Item label="小类">
              {getFieldDecorator('categories')(
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择"
                  style={{ width: '100%' }}
                >
                  {childCategoryOptionList}
                </Select>
              )}
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
        </Row>

        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ padding: 0 }}>
          <Col md={5} sm={15}>
            <Form.Item>
              {getFieldDecorator('beginTimeRange')(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="开始时间最小值"
                  defaultValue={moment()}
                />
              )}
            </Form.Item>
          </Col>
          <Col md={5} sm={15}>
            <Form.Item>
              {getFieldDecorator('beginTimeRange')(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="开始时间最大值"
                  defaultValue={moment()}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { data, loading, totalCount } = this.props;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        render: value => <a onClick={() => this.onClickId(value)}> {value} </a>,
      },
      {
        title: '标题',
        dataIndex: 'title',
      },
      {
        title: '局主昵称',
        dataIndex: 'owner.nickname',
      },
      {
        title: '局类型',
        dataIndex: 'type',
        render(value) {
          switch (value) {
            case 1:
              return '公开局';
              break;
            case 2:
              return '好友局';
              break;
            case 3:
              return '私密局';
              break;
            default:
              return 'bug';
          }
        },
      },
      {
        title: '大类',
        dataIndex: 'categoryVO.parent.name',
      },
      {
        title: '小类',
        dataIndex: 'categoryVO.name',
      },
      {
        title: '城市',
        dataIndex: 'city.name',
      },
      {
        title: '人数要求',
        render(record) {
          const { minLeaguerNum, maxLeaguerNum } = record;
          if (maxLeaguerNum == -1 || maxLeaguerNum == 0) {
            return minLeaguerNum;
          } else {
            return minLeaguerNum + ' - ' + maxLeaguerNum;
          }
        },
      },
      {
        title: '已报名人数',
        dataIndex: 'enrollNum',
      },
      {
        title: '参与人数',
        dataIndex: 'leaguerNum',
      },
      {
        title: '报名状态',
        render(record) {
          const { enrollNum, minLeaguerNum, maxLeaguerNum } = record;
          if (enrollNum < minLeaguerNum) {
            return '未成局';
          } else {
            if (maxLeaguerNum != -1 && maxLeaguerNum != 0 && enrollNum >= maxLeaguerNum) {
              return '已报满';
            } else {
              return '已成局';
            }
          }
        },
      },
      {
        title: '局流程',
        render(record) {
          const { status, enrollEndTim, minLeaguerNum, maxLeaguerNum, beginTime } = record;
          switch (status) {
            case 2:
              var now = new Date().valueOf();
              if (enrollEndTim <= 0) {
                enrollEndTim = beginTime;
              }
              if (enrollEndTim >= now) {
                return '报名已截止';
              } else {
                return '报名中';
              }
              break;
            case 4:
              return '已结束';
              break;
            case 5:
              return '已解散';
              break;
            default:
              return 'bug';
          }
        },
      },
      {
        title: '封停状态',
        dataIndex: 'riskStatus',
        render(value) {
          switch (value) {
            case 1:
              return '正常';
              break;
            case 2:
              return '冻结';
              break;
            case 3:
              return '解散';
              break;
            default:
              return 'bug';
          }
        },
      },
      {
        title: '开始时间',
        dataIndex: 'beginTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
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
              customSetting={{ scroll: { x: '130%' } }}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
