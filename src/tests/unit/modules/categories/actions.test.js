import assert from 'assert-diff'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { normalize } from 'normalizr'
import sinon from 'sinon'

import * as actions from '../../../../modules/categories/actions'
import * as constants from '../../../../modules/categories/constants'
import * as entityConstants from '../../../../modules/entities/constants'
import * as services from '../../../../modules/categories/services'
import { categoriesSchema } from '../../../../modules/entities/schema'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('categories - actions', () => {
    let sandbox
    let store

    beforeAll(() => {
        store = mockStore()
    })

    beforeEach(() => {
        sandbox = sinon.sandbox.create()
    })

    afterEach(() => {
        sandbox.restore()
        store.clearActions()
    })

    describe('getCategories', () => {
        it('gets categories succesfully', async () => {
            const categories = [
                {
                    id: 1,
                    name: 'Test 1',
                },
                {
                    id: 2,
                    name: 'Test 2',
                },
            ]
            const { result, entities } = normalize(categories, categoriesSchema)

            sandbox.stub(services, 'getCategories').callsFake(() => Promise.resolve(categories))

            await store.dispatch(actions.getCategories(true))

            const expectedActions = [
                {
                    type: constants.GET_CATEGORIES_REQUEST,
                },
                {
                    type: entityConstants.UPDATE_ENTITIES,
                    payload: {
                        entities,
                    },
                },
                {
                    type: constants.GET_CATEGORIES_SUCCESS,
                    payload: {
                        categories: result,
                    },
                },
            ]
            assert.deepEqual(store.getActions(), expectedActions)
        })

        it('responds to errors', async () => {
            sandbox.stub(services, 'getCategories').callsFake(() => Promise.reject(new Error('Error')))

            await store.dispatch(actions.getCategories(true))

            const expectedActions = [
                {
                    type: constants.GET_CATEGORIES_REQUEST,
                },
                {
                    type: constants.GET_CATEGORIES_FAILURE,
                    error: true,
                    payload: {},
                },
            ]
            assert.deepEqual(store.getActions(), expectedActions)
        })
    })
})
