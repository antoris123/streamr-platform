// @flow

import React from 'react'
import { Translate } from 'streamr-layout/dist/bundle'
import links from '../../../links'
import type { User } from '../../../flowtype/user-types'
import type { AccountPageTab } from '../../../containers/AccountPage/index'
import Tab from './AccountTab/index'
import CreateProductButton from './CreateProductButton/index'

import styles from './accountPageHero.pcss'

type Props = {
    user: ?User,
    tab: AccountPageTab,
}

const AccountPageHero = ({ user, tab }: Props) => (
    <div className={styles.accountPageHero}>
        <h1 className={styles.title}>
            {user && user.name}
        </h1>
        <div className={styles.tabBar}>
            <Tab selected={tab} name="purchases" to={links.myPurchases}>
                <Translate value="general.purchases" />
            </Tab>
            <Tab selected={tab} name="products" to={links.myProducts}>
                <Translate value="general.products" />
            </Tab>
        </div>
        <CreateProductButton
            className={styles.createProductButton}
            to={links.createProduct}
        />
    </div>
)

export default AccountPageHero