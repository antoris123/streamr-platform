/* eslint-disable react/no-unused-state, no-unused-vars */
import React from 'react'
import cx from 'classnames'

import UseState from '$shared/components/UseState'
import EditableText from '$shared/components/EditableText'
import ColorPicker from '$editor/shared/components/ColorPicker'
import StreamSelector from '$editor/shared/components/StreamSelector'

import { RunStates } from '../state'
import Port from './Ports/Port'
import styles from './Ports.pcss'

/**
 * Icons
 */

function MinusIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="2" {...props}>
            <g fill="none" fillRule="evenodd">
                <path stroke="currentColor" strokeLinecap="round" d="M7.2 1H.8" />
            </g>
        </svg>
    )
}

function PlusIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" {...props}>
            <g fill="none" fillRule="evenodd">
                <g stroke="currentColor" strokeLinecap="round">
                    <path d="M4 .8v6.4M7.2 4H.8" />
                </g>
            </g>
        </svg>
    )
}

/**
 * Map-type key/value parameter
 */

class MapParam extends React.Component {
    state = {
        values: undefined,
    }

    buttonRefs = []
    keyRefs = []

    static getDerivedStateFromProps(props, state) {
        if (state.values) {
            return null
        }
        return {
            values: Object.entries(props.value),
        }
    }

    getOnChange = (type, index) => (event, done) => {
        const { value } = event.target
        return this.onChange(type, index, value, done)
    }

    onChange = (type, index, value, done) => {
        this.setState(({ values }) => {
            const newValues = values.slice()
            const prev = newValues[index] || ['', '']
            newValues[index] = type === 'key' ? [value, prev[1]] : [prev[0], value]
            return {
                values: newValues,
            }
        }, () => {
            if (typeof done === 'function') {
                done()
            }
            this.props.onChange(this.getValue())
        })
    }

    getValue = () => (
        // convert values k/v array to an Object
        this.state.values.filter(([key = '']) => (
            key.trim() // remove any rows with an empty key
        )).reduce((o, [key, value = '']) => Object.assign(o, {
            [key.trim()]: value.trim(),
        }), {})
    )

    getOnFocus = (type, index) => (event) => {
        if (event.target.select) {
            event.target.select() // select all input text on focus
        }
        // set field to single space to trigger new empty row
        // user will not see the space
        const kv = this.state.values[index] || ['', '']
        this.props.onFocus(event)
        this.onChange(type, index, kv[type === 'key' ? 0 : 1])
    }

    getRemoveRow = (index) => () => {
        // removes key and value at index
        this.setState(({ values }) => {
            const newValues = values.slice()
            newValues[index] = false
            return {
                values: newValues.filter(Boolean),
            }
        }, () => {
            this.props.onChange(this.getValue(), () => {
                this.props.onBlur() // ensures committed to canvas :/
            })
        })
    }

    getAddRow = (index) => () => {
        // doesn't actually add a row, just focus row
        const el = this.keyRefs[index]
        if (el) { el.focus() }
    }

    getButtonRef = (index) => (el) => {
        this.buttonRefs[index] = el
    }

    getKeyRef = (index) => (el) => {
        this.keyRefs[index] = el
    }

    render() {
        const { values } = this.state
        const rows = values.slice()

        const lastRow = values[values.length - 1]
        // only add a empty row if last row is not empty.
        if (!lastRow || (lastRow[0].trim() || lastRow[1].trim())) {
            rows.push(['', ''])
        }

        const lastIndex = rows.length - 1

        return (
            /* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */
            <div
                className={cx(styles.mapParam)}
                onMouseOut={this.props.onMouseOut}
                onMouseOver={this.props.onMouseOver}
            >
                {rows.map(([key, value], index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <React.Fragment key={index}>
                        {/* Key Input */}
                        <input
                            className={cx(styles.mapParamKey, styles.portValue)}
                            placeholder="key"
                            value={key}
                            onChange={this.getOnChange('key', index)}
                            onFocus={this.getOnFocus('key', index)}
                            onBlur={this.props.onBlur}
                            ref={this.getKeyRef(index)}
                        />
                        {/* Value Input */}
                        <input
                            className={cx(styles.mapParamValue, styles.portValue)}
                            placeholder="value"
                            value={value}
                            onChange={this.getOnChange('value', index)}
                            onFocus={this.getOnFocus('value', index)}
                            onBlur={this.props.onBlur}
                        />
                        {/* Add/Remove Button */}
                        {(index !== lastIndex) ? (
                            <button
                                type="button"
                                onClick={this.getRemoveRow(index)}
                                ref={this.getButtonRef(index)}
                                onFocus={this.props.onFocus}
                                onBlur={this.props.onBlur}
                            >
                                <MinusIcon />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={this.getAddRow(index)}
                                ref={this.getButtonRef(index)}
                                onFocus={this.props.onFocus}
                                onBlur={this.props.onBlur}
                            >
                                <PlusIcon />
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </div>
        )
    }
}

/**
 * Render appropriate control based on port.type
 */

class PortValue extends React.Component {
    state = {
        hasFocus: false,
        value: undefined,
    }

    static getDerivedStateFromProps({ port }, { hasFocus }) {
        if (hasFocus) { return null }
        const isParam = 'defaultValue' in port
        const value = isParam ? (port.value || port.defaultValue) : port.initialValue
        return { value }
    }

    onChange = (value, done) => {
        this.setState({ value }, done)

        // If select, fire onChange immediately
        if (this.props.port.possibleValues) {
            this.triggerChange(value)
        }
    }

    triggerChange = (value) => {
        this.props.onChange(this.props.port.id, value)
    }

    onFocus = (event) => {
        if (event.target.select) {
            event.target.select() // select all input text on focus
        }

        this.setState({
            hasFocus: true,
        })
    }

    onBlur = () => {
        let { value } = this.state
        if (value === '') { value = null }

        // For select, value has been sent already
        if (!this.props.port.possibleValues) {
            this.triggerChange(value)
        }

        this.setState({
            hasFocus: false,
        })
    }

    onChangeEvent = (event) => {
        const { value } = event.target
        this.onChange(value)
    }

    render() {
        const {
            canvas,
            port,
            onChange,
            adjustMinPortSize,
            ...props
        } = this.props

        const isRunning = canvas.state === RunStates.Running
        const disabled = !!(
            isRunning ||
            // enable input whether connected or not if port.canHaveInitialValue
            (!port.canHaveInitialValue && port.connected)
        )

        let { value } = this.state
        if (value == null) {
            value = '' // prevent uncontrolled/controlled switching
        }

        if (port.type === 'Map') {
            return (
                <MapParam
                    {...{
                        port,
                        value,
                        ...props,
                    }}
                    disabled={disabled}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}
                />
            )
        }

        if (port.type === 'Color') {
            return (
                <ColorPicker
                    {...props}
                    value={value}
                    disabled={disabled}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}
                />
            )
        }

        /* Select */
        if (port.possibleValues) {
            return (
                <select
                    {...props}
                    value={value}
                    disabled={disabled}
                    onChange={this.onChangeEvent}
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}
                >
                    {port.possibleValues.map(({ name, value }) => (
                        <option key={value} value={value}>{name}</option>
                    ))}
                </select>
            )
        }

        /* Stream */
        if (port.type === 'Stream') {
            return (
                <StreamSelector
                    {...props}
                    value={value}
                    disabled={disabled}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}
                />
            )
        }

        return (
            <UseState initialValue={false}>
                {(editing, setEditing) => (
                    <EditableText
                        {...props}
                        className={null}
                        disabled={disabled}
                        editing={editing}
                        editOnFocus
                        /* EditableText calls its onChange on blur. This allows
                           us to trigger changes directly using `triggerChange`. */
                        onChange={this.triggerChange}
                        placeholder={port.displayName || port.name}
                        setEditing={setEditing}
                    >
                        {value}
                    </EditableText>
                )}
            </UseState>
        )
    }
}

const Ports = ({
    api,
    module,
    canvas,
    onPort,
    onValueChange,
    className,
}) => {
    const { outputs } = module
    const inputs = module.params.concat(module.inputs)

    return !!(inputs.length || outputs.length) && (
        <div className={cx(className, styles.ports)}>
            <div className={styles.inputs}>
                {inputs.map((port, index) => (
                    <Port
                        api={api}
                        canvas={canvas}
                        /* eslint-disable react/no-array-index-key */
                        key={port.id + index}
                        onValueChange={onValueChange}
                        onPort={onPort}
                        port={port}
                        setOptions={api.port.setPortOptions}
                    />
                ))}
            </div>
            <div className={styles.outputs}>
                {outputs.map((port, index) => (
                    <Port
                        api={api}
                        canvas={canvas}
                        /* eslint-disable react/no-array-index-key */
                        key={port.id + index}
                        onValueChange={onValueChange}
                        onPort={onPort}
                        port={port}
                        setOptions={api.port.setPortOptions}
                    />
                ))}
            </div>
        </div>
    )
}

export default Ports
