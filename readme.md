# 基于React实现高度简洁的Form表单方案

最近项目里在做我们自己的组件库，关于表单这块，如何实现一个更简单的表单方案，是我们一直在讨论的问题，之前项目里习惯用 `ant-design` 的 Form 表单，也觉得蛮好用的，我们希望能做出更简洁的方案。

下面列出了表单相关的解决方案，`React` 社区的轮子真是多到无法想象：

- [飞冰表单解决方案 - Ice FormBinder](https://zhuanlan.zhihu.com/p/51748223)
- [React 实现高度简洁的 Form 组件](https://zhuanlan.zhihu.com/p/57820186)
- [NoForm - 一个更好的表单解决方案](https://zhuanlan.zhihu.com/p/44120143)
- [面向复杂场景的高性能表单解决方案 - UForm](https://zhuanlan.zhihu.com/p/62927004)
- [redux-form](https://redux-form.com/7.0.3/)
- [final-form](https://github.com/final-form/final-form)
- [Form 表单组件设计之路 - 高易用性 - Fusion Form](https://zhuanlan.zhihu.com/p/56280821)
- ......


以上的表单方案主要聚焦在一下几点：

1. 更方便地做数据收集，不手写 `value` 和 `onChange`，有的表单是增加函数（`ant-design`）或容器（`FormBinder`，`Fusion`等），为子组件注册 `value`，`onChange`，有的是自定义 `Feild` 组件（`UForm`），内部处理相关逻辑
2. 更高效的渲染，比如字段状态分布式管理
3. 简单，降低学习成本
4. 动态表单渲染

## 关于数据收集与渲染

关于表单数据收集，可以参考双向数据绑定，下面是双向数据绑定的讨论：

- [react不实现双向绑定的原因是什么呢，提高用户动手能力？](https://www.zhihu.com/question/300849926/answer/523836011)

以及关于实现双向数据绑定的文章：
- [使用 Babel plugin 实现 React 双向绑定糖](https://zhuanlan.zhihu.com/p/29622485)
- [手把手教你为 React 添加双向数据绑定（一）](https://zhuanlan.zhihu.com/p/30486833)
- [手把手教你为 React 添加双向数据绑定（二）](https://zhuanlan.zhihu.com/p/30521576)


一个是数据收集，一个是渲染，也就是所谓的双向数据绑定，总结起来有三个途径：
1. 可以在编译期进行代码转换，注入赋值语句和组件数据监听方法，这个看起来高大上，需要自己写 `Babel` 插件
2. 运行时修改虚拟DOM，比如 `ant-design`、`ice` 等等，确实也都蛮好用的，上面列出的文章都可以研读一下，很有意义
3. 手写 `value` 和 `onChange`，除非你的系统里只有一个表单。。。

## 先立个目标

看了大佬们的实现，我们也想造个轮子，希望还可以更简洁，让表单写起来更开心，当系统里有很多表单，都要手绑 `value` 和 `onChange` 肯定是不行的，即便 `ant-design`、`ice` 等，还要加额外的函数或容器，所以目标就是下面这样:

```
import {Form,Input} form 'form';

export default class FormDemo extends Component {
     state = {
        value: {
            name: '',
            school: '',
        },
    }
    onFormChange = (value) => {
        this.setState({
            value,
        });
    }
    onFormSubmit = () => {
        // console.log('submit')
    }
    render(){
        const me=this;
        const {
            value,
        } = me.state;
        return (
            <Form 
                value={value}
                onChange={me.onFormChange} 
                onSubmit={me.onFormSubmit}
            >
                <input 
                    name="name"
                    rules={[ {max: 3,message: '最大长度3',}]} 
                    type="text" 
                />
                <Input 
                    name="age"
                    rules={[{max: 3,message: '最大长度3',}]} 
                    type="text" 
                />
            </Form>
        )
    }
}

```

1. 简洁，贴近原生，学习成本低
2. 组件兼容所有实现 `value`、`onChange` 的组件，比如 `ant-design` 的表单组件
3. 表单验证，沿用 `ant-design` 设计，使用 `async-validator` 库来做

看得出来，我们是 `ant-design` 的粉丝了，坦白说，大佬们的方案已经足够简洁了，`ant-design` 是先驱，后继者 `Ice` , `Fusion` 等多对标 `ant-design` ，力图更给出更简洁的方案，他们也确实很简洁，特别是 `Fusion` 的 `Field` 组件，眼前一亮的感觉，`UForm` 使用类似 `JSON Schema(JSchema)` 的语法写表单，`Uform` 和`final-form` 强调字段的分布式管理，高性能，不过，这两个方案有一定的学习成本，实现方案自然是复杂的。

不过，当我说出我们的实现，大家估计要吐槽，因为我们的实现太简单（捂脸），简单到怀疑人生。

## 实现

要想实现上面的目标，显然文章开头文章列表已经有人实践了，编译期注入代码，不过你要新加个 `Babel` 插件，不知道你喜不喜欢。

我们的实现是采用`运行时修改虚拟DOM`的，不在编译期做，也就是运行时来做了，不过，不会在组件外加额外的函数或容器，只是利用`Form`容器来实现，大家一定想到了，那样是不是要遍历所有子节点？这样会不会有额外的性能开销？

那就先实现，再优化。

首先，需要遍历所有子 `dom` 节点，深度优先，判断节点是否有 `name` 属性，如果有，为该组件附加 `value` 和 `onChange` 属性，像 checkbox, radio, select 等组件，特殊处理。

也可以使用 `data-name`，因为 `data-` 开头的属性，再原生 html 组件或者 React 组件都可以书写，而不会被 `typescript` 提示未定义的属性。

绑定value和onChange核心代码（有删减）如下：
```
public bindEvent(value, childList) {
    const me = this;
    if (!childList || React.Children.count(childList) === 0) {
        return;
    }
    React.Children.forEach(childList, (child) => {
        if (!child.props) {
            return;
        }
        const { children, onChange } = child.props;
        const bind = child.props['data-name'];
        const rules = child.props['data-rules'];
        // 分析节点类型，获取对应的属性名是value,还是checked等
        const valuePropName = me.getValuePropName(child);
        if (bind) {
            child.props[valuePropName] = value[bind];
            if (!onChange) {                
                child.props.onChange = me.onFieldChange.bind(me, bind, valuePropName);
            }
        }
        me.bindEvent(value, children);
    });
}
```

onFieldChange的代码：
```
public onFieldChange(fieldName, valuePropName, e) {
    const me = this;
    const {
        onChange = () => null,
        onFieldChange = () => null,
    } = me.props;
    let value;
    if (e.target) {
        value = e.target[valuePropName];
    } else {
        value = e;
    }
    me.updateValue(fieldName, value, () => {
        onFieldChange(e);
        const allValues = me.state.formData.value;
        onChange(allValues);
    })
}
```

上面代码即便实现了我们的目标，不用手绑 `value` 和 `onChange` 了，接下来是实现表单验证，表单验证，还是沿用了 `ant-design` 的实现，使用`async-validator`这个库来做，配置方式和 `ant-design` 是一样的。为了显示验证的错误信息，加入了 FormItem 容器，使用方式也贴近 `ant-design`。

`FormItem` 的实现使用 React 的 Context API，具体可以查看实现源码，因为不是本文重点，就不说了。

和 `ant-design` 一样，只要是实现 `value` 、`onChange` 接口的组件，都可以在这里使用，不限于原生的 HTML 组件。

## 此处需要使用Gif图演示效果

## 关于性能的疑虑

通过上面的代码实现我们想要的目标，不过，还是有疑问的地方：这个每次渲染都深度遍历子节点，会不会有性能问题？

答案是：影响微乎其微

通过测试，1000 以内的表单控件感受不到差别。1000 个子组件对 React 来说，diff算法开销也很大的。

不过，为了提升性能，我们还是做了优化，加入了`虚拟 DOM 缓存`。

假如我们在首次渲染后，将创建的虚拟 DOM 缓存下来，第二次渲染就不需要需要重新创建了，也不需要深度遍历节点添加 `value` 和 `onChange` 了，但是为了更新 `value`，需要获取具有 `data-name` 节点的引用，将组件以 `data-name` 值为 `key` 放到对象里，更新的时候通过 `data-name` 值获取这个组件，直接更新这个组件的虚拟 `DOM` 属性就可以了，直接获取 `DOM` 引用更新 `DOM`，这看起来很 `JQuery` 吧？

通过上面的优化，性能能提升一倍。

不过，`如果表单内组件有动态显示、隐藏的话，就不能用虚拟DOM缓存`了，所以，我们提供了一个属性 `enableDomCache` ,它可以是布尔值，也可以是一个函数，参数是之前的表单值，由用户对当前值和前值比较，来确定下次渲染是否使用缓存。不过，只有遇到性能问题的时候可以考虑用它，多数时候没有性能问题，这个 `enableDomCache` 默认设置为 `false`，

示例：
```
import {Form} form 'form';

export default class FormDemo extends Component<any, any> {
    state = {
        value: {
            name: '',
            school: '',
        },
    }
    onFormChange = (value) => {
        this.setState({
            value,
        });
    }
    onFormSubmit = () => {
        // console.log('submit')
    }
    enableDomCache=(preValue)=>{
        const me=this;
        const {
            value,
        } = me.state;

        if(preValue.showSchool!==value.showSchool){
            return false;
        }

        return true;
    }
    render(){
        const me=this;
        const {
            value,
        } = me.state;
        return (
            <Form 
                value={value}
                enableDomCache={me.enableDomCache}
                onChange={me.onFormChange} 
                onSubmit={me.onFormSubmit}
            >
                <input 
                    data-name={`name`} 
                    data-rules={[ { max: 3, message: '最大长度3', } ]} 
                    type="text" 
                />
                {
                    value.showSchool&&(
                        <input 
                            data-name={`school`} 
                            data-rules={[ { max: 3, message: '最大长度3', } ]} 
                            type="text" 
                        />
                    )
                }
            </Form>
        )
    }
}

```

## 关于字段的分布式管理思考

如果每次表单的字段修改，都会导致整个表单重新渲染，确实不够完美，所以会有字段分布式管理的想法。

不过，大多数时候，即使重新渲染，用户也体会不到其中的差别，`ant-design` 就是重新渲染，这里说的重新渲染，是重新 `render` 创建虚拟 `DOM`，其实 `React` 进行 `diff` 后，真是的DOM并未全部渲染。

当然，为了追求完美，避免 `React` 进行 `diff`，那就是最好了，所以对于表单内的重型组件，考虑利用 `shouldComponentUpdate` 进行更新控制。

还有一点，受控组件和非受控组件的影响，如果表单本身是受控组件，那么它的属性改变，肯定导致本身的重新渲染计算，所以要想更好的性能，最好是使用非受控组件模式，这个还是要看具体需要，因为目前多数时候，状态都会选择全局状态，非受控组件不会因为外部状态改变而更新，所以可能会有UI状态和全局状态不一致的可能，如果表单数据的修改只有表单本身来控制，那就可以放心使用非受控模式了。

补充，不论是受控和非受控，都可以利用 `shouldComponentUpdate` 进行组件本身的优化。

## 关于表单嵌套

在之前的文章讨论中，看到用户对表单嵌套的需求，这个想起来不难，只要表单本身符合 `value` `onChange` 接口,那么表单也可以嵌套表单了，就像下面这样：

```
import {Form,Input} form 'form';

export default class FormDemo extends Component {
    render(){
        const me=this;
        const {
            value,
        } = me.state;
        return (
            <Form value={value} onChange={me.onFormChange} onSubmit={me.onFormSubmit} >
                <input name="name" type="text" />
                <Input name="age" type="text" />
                <Form name="children1">
                    <input name="name" type="text" />
                    <Input name="age" type="text" />
                    <Form name="children2">
                        <input name="name" type="text" />
                        <Input name="age" type="text" />
                        <Form name="children3">
                            <input name="name" type="text" />
                            <Input name="age" type="text" />
                        </Form>
                         <Form name="children4">
                            <input name="name" type="text" />
                            <Input name="age" type="text" />
                        </Form>
                    </Form>
                </Form>
            </Form>
        )
    }
}
```

// 此处需要git图演示嵌套表单

虽然实现了表单嵌套，但是这个实现是有问题的，子表单的数据变更，会沿着 `onChange` 方法逐级向上传递，当数据量大，嵌套层级深的时候，可能会有性能问题。

最好类似于字段的分布式管理一样，每个表单只负责自己的渲染，不会导致其他表单重新渲染，为了提升性能，我们进行了优化，提供了 `FormGroup` 容器，这个容器可以遍历 `Form` 节点，构建 `Form` 节点的引用关系，为每个 `Form` 生成一个唯一 `ID`，将所有 `Form` 的状态统一由 `FormGroup` 的 state 管理，相当于进行了扁平化，而不是像原来一样，子级 `Form` 的 `Value` 由父级的来管理。

状态偏平化后，每个表单的变更只会导致自身重新渲染，不影响其他表单。

但是，上面的优化仅限于非受控状态下，因为受控状态下，还是要由外部属性传入 `value` 给 `FormGroup`，而内部 `value` 的和属性传入的 `value` 结构不一致，一个是扁平的结构，一个树形结构，这里一句半句说不明白，后续再完善吧。

总之，简单的树形结构可以不使用 `FormGroup` 。复杂的可以考虑使用 `FormGroup` ，并且设置 `defaultValue` 而不是 `value`，来使用非受控的模式。

## 最后

本文尝试构建了一个更简洁的表单方案，利用`深度遍历子节点`的方法为子组件赋值 `value` 以及注册 `onChange` 事件，表单的书写上更加贴近原生，更加简洁，也利用`缓存虚拟DOM`的方法对深度遍历子节点这种方式进行了性能优化，尝试实现表单嵌套，并且利用 `FormGroup` 容器进行数据更新扁平化，不知道你有没有收获。

## 最后的最后

这看起来很像 `Vue` 是吧？，这么做让学 `React` 的同学有没有很尴尬？会不会误导正在犹豫要学 `React` 还是 `Vue` 的同学？希望评论区不要再评论哪个框架更优秀了。。。