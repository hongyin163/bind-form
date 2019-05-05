import { fieldPropName, rulesPropName } from './constants';

export function getFieldName(dom) {
    return dom.props[`data-${fieldPropName}`] || dom.props[fieldPropName];
}

export function getFeildRules(dom) {
    return dom.props[`data-${rulesPropName}`] || dom.props[rulesPropName];
}
