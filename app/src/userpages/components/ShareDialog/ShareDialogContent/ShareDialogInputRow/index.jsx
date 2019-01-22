// @flow

import React, { Component } from 'react'

import SvgIcon from '$shared/components/SvgIcon'

import styles from './shareDialogInputRow.pcss'

type Props = {
    onAdd: (email: string) => void,
}

type State = {
    email: string,
}

export class ShareDialogInputRow extends Component<Props, State> {
    state = {
        email: '',
    }

    onChange = (e: SyntheticInputEvent<EventTarget>) => {
        this.setState({
            email: e.target.value,
        })
    }

    onAdd = () => {
        this.setState((prevState) => {
            this.props.onAdd(prevState.email)

            return {
                email: '',
            }
        })
    }

    render() {
        const { email } = this.state
        return (
            <div className={styles.container}>
                <input
                    className={styles.input}
                    type="email"
                    placeholder="Enter email address"
                    name="email"
                    value={email}
                    onChange={this.onChange}
                />
                <button
                    type="button"
                    className={styles.button}
                    onClick={this.onAdd}
                    disabled={!email}
                >
                    <SvgIcon name="plus" className={styles.plusIcon} />
                </button>
            </div>
        )
    }
}

export default ShareDialogInputRow
