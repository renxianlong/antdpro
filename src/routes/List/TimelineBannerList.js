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

@connect(({ region, timelineBanner, loading }) => ({
  cityMap: region.data.cityMap,
  cityList: region.data.cityList,
  data: timelineBanner.data,
  loading: loading.models.timelineBanner,
}))
@Form.create()
export default class TimelineBannerList extends PureComponent {
  state = {
    formValues: {},
  };

  //页面加载前请求数据
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'region/cityList',
    });
  }

  //页面加载完后请求数据
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'timelineBanner/search',
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
      type: 'timelineBanner/search',
      payload: params,
    });
  };

  //点击
  onClickId = value => {
    console.log(value);
    const { dispatch } = this.props;
    dispatch({
      type: 'timelineBanner/detail',
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
      type: 'timelineBanner/search',
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

      dispatch({
        type: 'timelineBanner/search',
        payload: values,
      });
    });
  };

  renderForm() {
    const { cityList } = this.props;
    const { getFieldDecorator } = this.props.form;
    let cityOptionList = [];
    for (let city of cityList) {
      cityOptionList.push(<Select.Option value={city.code}>{city.name}</Select.Option>);
    }
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={15}>
            <Form.Item label="活动注释">
              {getFieldDecorator('desc')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col md={5} sm={15}>
            <Form.Item label="显示范围">
              {getFieldDecorator('city')(
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择"
                  style={{ width: '100%' }}
                >
                  <Select.Option value="all">全国</Select.Option>
                  {cityOptionList}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col md={5} sm={15}>
            <Form.Item label="落地页类型">
              {getFieldDecorator('type')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Select.Option value="1">局</Select.Option>
                  <Select.Option value="2">H5链接</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={15}>
            <Form.Item label="状态">
              {getFieldDecorator('activity')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Select.Option value="false">停用</Select.Option>
                  <Select.Option value="true">启用</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col md={5} sm={15}>
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
    const { cityMap, data, loading, totalCount } = this.props;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        render: value => <a onClick={() => this.onClickId(value)}> {value} </a>,
      },
      {
        title: '活动注释',
        dataIndex: 'desc',
      },
      {
        title: '显示范围',
        dataIndex: 'cities',
        render(value) {
          if (value === undefined || value.length === 0) {
            return 'bug';
          } else {
            if (value.length === 1 && value[0] === 'all') {
              return '全国';
            } else {
              let cityList = '';
              for (let i = 0; i < value.length; i++) {
                let region = cityMap.get(value[i]);
                cityList = cityList + region.name;
                if (!(i === value.length - 1)) {
                  cityList = cityList + '、';
                }
              }
              return cityList;
            }
          }
        },
      },
      {
        title: '开始时间',
        dataIndex: 'openTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '结束时间',
        dataIndex: 'closeTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '优先级',
        dataIndex: 'priority',
      },
      {
        title: '落地页类型',
        dataIndex: 'type',
        render(value) {
          switch (value) {
            case 1:
              return '局';
              break;
            case 2:
              return 'H5链接';
              break;
            default:
              return 'bug';
          }
        },
      },
      {
        title: '落地页',
        render(record) {
          const { type, sourceId, url } = record;
          switch (type) {
            case 1:
              return sourceId;
              break;
            case 2:
              return <a href={url}>{url}</a>;
              break;
            default:
              return 'bug';
          }
        },
      },
      {
        title: '状态',
        dataIndex: 'activity',
        render(value) {
          if (value) {
            return '启用';
          } else {
            return '停用';
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
