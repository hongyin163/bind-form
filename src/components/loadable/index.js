import Loadable from 'react-loadable';
import Loading from '@/common/loading-page';

export default function (component) {
    return Loadable({
        loader: component,
        loading: Loading,
        delay: 0
    });
}