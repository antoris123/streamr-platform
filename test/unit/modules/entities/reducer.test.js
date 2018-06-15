import assert from 'assert-diff'
import { normalize } from 'normalizr'

import reducer, { initialState } from '../../../../src/modules/entities/reducer'
import * as constants from '../../../../src/modules/entities/constants'
import * as schemas from '../../../../src/modules/entities/schema'

describe('entities - reducer', () => {
    it('has initial state', () => {
        assert.deepEqual(reducer(undefined, {}), initialState)
    })

    it('handles entities', () => {
        const categories = [
            {
                id: 1,
                name: 'Category 1',
            },
            {
                id: 2,
                name: 'Category 2',
            },
        ]
        const products = [
            {
                id: '123456789',
                title: 'Product 1',
            },
            {
                id: '1011121314',
                title: 'Product 2',
            },
        ]
        const { entities: categoryEntities } = normalize(categories, schemas.categoriesSchema)
        const { entities: productEntities } = normalize(products, schemas.productsSchema)

        const expectedState = {
            categories: categories.reduce((result, value) => ({
                ...result,
                [value.id]: value,
            }), {}),
            products: products.reduce((result, value) => ({
                ...result,
                [value.id]: value,
            }), {}),
            contractProducts: {},
            streams: {},
            relatedProducts: {},
            subscriptions: {},
        }

        let state = reducer(undefined, {
            type: constants.UPDATE_ENTITIES,
            payload: {
                entities: categoryEntities,
            },
        })
        state = reducer(state, {
            type: constants.UPDATE_ENTITIES,
            payload: {
                entities: productEntities,
            },
        })

        assert.deepEqual(state, expectedState)
    })

    it('handles subscriptions', () => {
        const products = [
            {
                id: '123456789',
                title: 'Product 1',
            },
            {
                id: '1011121314',
                title: 'Product 2',
            },
        ]
        const subscriptions = [
            {
                endsAt: Date(),
                product: {
                    ...products[0],
                },
            },
            {
                endsAt: Date(),
                product: {
                    ...products[1],
                },
            },
        ]

        const { entities } = normalize(subscriptions, schemas.subscriptionsSchema)

        const expectedState = {
            categories: {},
            products: products.reduce((result, value) => ({
                ...result,
                [value.id]: value,
            }), {}),
            contractProducts: {},
            streams: {},
            relatedProducts: {},
            subscriptions: subscriptions.reduce((result, value) => ({
                ...result,
                [value.product.id]: {
                    endsAt: value.endsAt,
                    product: value.product.id,
                },
            }), {}),
        }

        assert.deepEqual(reducer(undefined, {
            type: constants.UPDATE_ENTITIES,
            payload: {
                entities,
            },
        }), expectedState)
    })
})