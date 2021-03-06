import React from 'react'
import styled from 'styled-components'
import SharedCheckbox from '$shared/components/Checkbox'

const UnstyledCheckbox = ({ className, label, id, ...props }) => (
    <div className={className}>
        <SharedCheckbox id={id} {...props} />
        <label htmlFor={id}>
            {label}
        </label>
    </div>
)

const Checkbox = styled(UnstyledCheckbox)`
    align-items: center;
    display: flex;

    input {
        display: block;
        margin-right: 0;
    }

    label {
        flex-grow: 1;
        line-height: normal;
        margin: 0 0 0 16px;
    }
`

const List = styled.div`
    display: grid;
    grid-row-gap: 16px;
    grid-template-columns: 1fr 1fr;
`

Object.assign(Checkbox, {
    List,
})

export default Checkbox
