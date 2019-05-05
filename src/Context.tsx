import React from 'react';

const FormContext = React.createContext({
    fieldNameProp: 'name',
    rulesProp: 'rules',
    value: {},
    validate: {
        isValidate: false,
        errors: {},
    },
})

export default FormContext;

export const FormGroupContext = React.createContext({
    value: {},
})
