import React from 'react';

const FormContext = React.createContext({
    value: {},
    validate: {
        isValidate: false,
        errors: {}
    }
})

export default FormContext;



