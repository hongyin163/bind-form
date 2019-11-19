import { fieldPropName, rulesPropName } from './constants';

export function getFieldName(dom) {
    return dom.props[`data-${fieldPropName}`] || dom.props[fieldPropName];
}

export function getFeildRules(dom) {
    return dom.props[`data-${rulesPropName}`] || dom.props[rulesPropName];
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
