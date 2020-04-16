# bind-form 表单

> 贴近原生、简洁高效的 React 表单方案

## 安装

```
npm install bind-form --save
```

## 使用示例

```js
import Form from 'bind-form'

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
    onSubmit = () => {
        const me = this;
        (me.refs.form as Form).validateFields(async (err, values) => {
            console.log(err, values)
        })
    }
    onChange = (value) => {
        this.setState({
            value,
        })
    }
    render(){
        const me=this;
        const {
            value
        }=me.state;
        return (
            <Form   ref="form"
                    value={value}
                    onChange={me.onChange}
                    onSubmit={me.onSubmit}
            >
                <input 
                    data-name="name" 
                    data-rules={[
                        {
                            required:true,
                            message:'不能为空'
                        }
                    ]}
                >
                 <button type="primary" htmlType="submit">提交</button>
            </Form>
        )
    }

}

```

## 
