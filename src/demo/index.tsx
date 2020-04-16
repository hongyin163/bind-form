import {
    Button,
    Cascader,
    Form,
    Input,
    InputTag,
    Radio,
    SelectList,
} from 'biz-ux'
import React, { Component } from 'react';
import './index.less';

const FormItem = Form.Item;
const options = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
            {
                value: 'hangzhou',
                label: 'Hangzhou',
                children: [
                    {
                        value: 'xihu',
                        label: 'West Lake',
                    },
                ],
            },
        ],
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
            {
                value: 'nanjing',
                label: 'Nanjing',
                children: [
                    {
                        value: 'zhonghuamen',
                        label: 'Zhong Hua Men',
                    },
                ],
            },
        ],
    },
];
const educationData = [
    { key: '20', value: '专科' },
    { key: '25', value: '专科及以上' },
    { key: '30', value: '本科' },
    { key: '35', value: '本科及以上' },
    { key: '40', value: '双学位' },
    { key: '50', value: '硕士研究生' },
    { key: '60', value: 'MBA' },
    { key: '70', value: '博士研究生' },
    { key: '75', value: '博士及以上' },
    { key: '80', value: '博士后及以上' },
    { key: '85', value: '其他' },
    { key: '90', value: '无' },
];

class Demo extends Component<any, any> {
    constructor(props, context) {
        super(props, context);
        const me = this;
        me.state = {
            value: {
                name: '',
            },
        };
    }
    public onChange = (value) => {
        this.setState({
            value,
        })
    }
    public onSubmit = () => {
        const me = this;
        (me.refs.form as Form).validateFields(async (err, values) => {
            // console.log(err, values)
        })
    }
    public onTagChange = (value) => {
        const me = this;
        me.setState({
            tag: value,
        })
    }
    public clear = () => {
        this.setState({
            value: {},
        })
    }
    public render() {
        const me = this;
        const {
            value,
        } = me.state;
        const formItemLayout = {
            labelCol: 8,
            wrapperCol: 16,
        };
        return (
            <div>

                <Form ref="form" className="form-demo"
                    layout="horizontal"
                    style={{ width: 500 }}
                    value={value}
                    onChange={me.onChange}
                    onSubmit={me.onSubmit}
                >
                    <FormItem {...formItemLayout} label="姓名：" required={true} >
                        <Input placeholder="请输入姓名" type="text"
                            data-name="name"
                            data-rules={[
                                {
                                    required: true,
                                    message: '姓名不能为空',
                                },
                            ]}
                        />
                    </FormItem>
                    <FormItem {...formItemLayout} label="性别：" required={true}>
                        <Radio.Group data-name="gender"  >
                            <Radio value={1}>男</Radio><Radio value={0}>女</Radio>
                        </Radio.Group>
                    </FormItem>
                    <FormItem {...formItemLayout} label="年龄：" required={true}>
                        <Input data-name="age" type="number" />
                    </FormItem>
                    <FormItem {...formItemLayout} label="学校：" required={true}>
                        <Input data-name="school" type="text"
                            data-rules={[
                                {
                                    required: true,
                                    message: '学校不能为空',
                                },
                            ]}
                        />
                    </FormItem>
                    <FormItem {...formItemLayout} label="专业：" required={true}>
                        <SelectList data-name="major">
                            {
                                educationData.map((item) => {
                                    return (
                                        <SelectList.Option value={item.key}>{item.value}</SelectList.Option>
                                    )
                                })
                            }
                        </SelectList>
                    </FormItem>
                    <FormItem {...formItemLayout} label="标签：" required={true}>
                        <InputTag data-name="tag" />
                    </FormItem>
                    <FormItem {...formItemLayout} label="所在城市：" required={true}>
                        <Cascader data-name="city" options={options} valueField="value" textField="label" childrenField="children" />
                    </FormItem>
                    <FormItem {...formItemLayout} label=" ">
                        <Button type="primary" htmlType="submit">提交</Button>
                        <Button type="primary" htmlType="button" onClick={me.clear}>清空</Button>
                    </FormItem>
                </Form>
                <pre>
                    <code>
                        {JSON.stringify(value, null, 4)}
                    </code>
                </pre>
            </div>
        )
    }
}

export default Demo;
