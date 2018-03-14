// @flow

import React, { Component, type Node } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from '@streamr/streamr-layout'
import FilterDropdownItem from './../FilterDropdownItem'
import classNames from 'classnames'
import styles from './filterDropdown.pcss'

import type { AnyFilter } from '../../../flowtype/product-types'

type Props = {
    title: Node,
    children: Node,
    className?: string,
    onClear: (filter: ?AnyFilter) => void,
}

type State = {
    open: boolean,
}

export default class FilterDropdown extends Component<Props, State> {
    state = {
        open: false
    }

    toggle = () => {
        this.setState({
            open: !this.state.open
        })
    }

    render() {
        const { title, children, className } = this.props

        return (
            <Dropdown toggle={this.toggle} isOpen={this.state.open} className={classNames(className, styles.categoryDropdown)}>
                <DropdownToggle href="#" tag="a">
                    {title}
                </DropdownToggle>
                <DropdownMenu>
                    {children}
                    <DropdownItem divider />
                    <FilterDropdownItem
                        value={null}
                        selected={false}
                        onSelect={this.props.onClear}
                    >
                        Clear
                    </FilterDropdownItem>
                </DropdownMenu>
            </Dropdown>
        )
    }
}
