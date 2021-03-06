// @flow

import { useMemo, useCallback, useContext } from 'react'
import BN from 'bignumber.js'

import { Context as UndoContext } from '$shared/contexts/Undo'
import { Context as ValidationContext } from './ValidationContextProvider'

import useEditableProductUpdater from '../ProductController/useEditableProductUpdater'
import { pricePerSecondFromTimeUnit } from '$mp/utils/price'
import { timeUnits } from '$shared/utils/constants'

import type { Product, ContactDetails } from '$mp/flowtype/product-types'
import type { StreamIdList } from '$shared/flowtype/stream-types'

const getPricePerSecond = (isFree, price, timeUnit) => (
    isFree ? BN(0) : pricePerSecondFromTimeUnit(BN(price || 0), timeUnit || timeUnits.hour)
)

type SocialLinks = {
    social1?: string,
    social2?: string,
    social3?: string,
    social4?: string,
}

export function useEditableProductActions() {
    const { updateProduct: commit } = useEditableProductUpdater()
    const { undo } = useContext(UndoContext)
    const { touch } = useContext(ValidationContext)

    const updateProduct = useCallback((product: Object, msg: string = 'Update product') => {
        commit(msg, (p) => ({
            ...p,
            ...product,
        }))
    }, [commit])
    const updateName = useCallback((name: $ElementType<Product, 'name'>) => {
        commit('Update name', (p) => ({
            ...p,
            name,
        }))
        touch('name')
    }, [commit, touch])
    const updateDescription = useCallback((description: $ElementType<Product, 'description'>) => {
        commit('Update description', (p) => ({
            ...p,
            description,
        }))
        touch('description')
    }, [commit, touch])
    const updateImageUrl = useCallback((image: $ElementType<Product, 'imageUrl'>) => {
        commit('Update image url', (p) => ({
            ...p,
            imageUrl: image,
        }))
        touch('imageUrl')
    }, [commit, touch])
    const updateImageFile = useCallback((image: File) => {
        commit('Update image file', ({ imageUrl, ...p }) => ({
            ...p,
            newImageToUpload: image,
        }))
        touch('imageUrl')
    }, [commit, touch])
    const updateStreams = useCallback((streams: StreamIdList) => {
        commit('Update streams', (p) => ({
            ...p,
            streams,
        }))
        touch('streams')
    }, [commit, touch])
    const updateCategory = useCallback((category: $ElementType<Product, 'category'>) => {
        commit('Update category', (p) => ({
            ...p,
            category,
        }))
        touch('category')
        touch('details')
    }, [commit, touch])
    const updateAdminFee = useCallback((adminFee: number) => {
        commit('Update admin fee', (p) => ({
            ...p,
            adminFee,
        }))
        touch('adminFee')
        touch('details')
    }, [commit, touch])
    const updateRequiresWhitelist = useCallback((requiresWhitelist: boolean) => {
        commit('Update whitelist enabled', (p) => ({
            ...p,
            requiresWhitelist,
        }))
        touch('requiresWhitelist')
    }, [commit, touch])
    const updateIsFree = useCallback((isFree: $ElementType<Product, 'isFree'>) => {
        commit('Update is free', (p) => {
            // Switching product from free to paid also changes its price from 0 (only
            // if it's 0) to 1. We're doing it to avoid premature validation errors.
            const price = p.isFree && !isFree && BN(p.price).isZero() ? new BN(1) : p.price

            return {
                ...p,
                isFree,
                price,
                pricePerSecond: getPricePerSecond(isFree, price, p.timeUnit),
            }
        })
        touch('pricePerSecond')
    }, [commit, touch])
    const updatePrice = useCallback((
        price: $ElementType<Product, 'price'>,
        priceCurrency: $ElementType<Product, 'priceCurrency'>,
        timeUnit: $ElementType<Product, 'timeUnit'>,
    ) => {
        commit('Update price', (p) => ({
            ...p,
            price,
            priceCurrency,
            pricePerSecond: getPricePerSecond(p.isFree, price, timeUnit),
            timeUnit,
        }))
        touch('pricePerSecond')
    }, [commit, touch])
    const updateBeneficiaryAddress = useCallback((beneficiaryAddress: $ElementType<Product, 'beneficiaryAddress'>) => {
        commit('Update beneficiary address', (p) => ({
            ...p,
            beneficiaryAddress,
        }))
        touch('beneficiaryAddress')
    }, [commit, touch])
    const updateType = useCallback((type: $ElementType<Product, 'type'>) => {
        commit('Update type', (p) => ({
            ...p,
            type,
        }))
        touch('type')
    }, [commit, touch])
    const updateTermsOfUse = useCallback((termsOfUse: $ElementType<Product, 'termsOfUse'>) => {
        commit('Update terms of use', (p) => ({
            ...p,
            termsOfUse,
        }))
        touch('termsOfUse')
    }, [commit, touch])
    const updateContactUrl = useCallback((url: $ElementType<ContactDetails, 'url'>) => {
        commit('Update contact url', (p) => ({
            ...p,
            contact: {
                ...p.contact || {},
                url,
            },
        }))
        touch('url')
    }, [commit, touch])
    const updateContactEmail = useCallback((email: $ElementType<ContactDetails, 'email'>) => {
        commit('Update contact email', (p) => ({
            ...p,
            contact: {
                ...p.contact || {},
                email,
            },
        }))
        touch('email')
    }, [commit, touch])
    const updateSocialLinks = useCallback(({ social1, social2, social3, social4 }: SocialLinks) => {
        commit('Update social links', (p) => ({
            ...p,
            contact: {
                ...p.contact || {},
                // $FlowFixMe: "Computing object literal may lead to an exponentially large number of cases to reason about because inferred union"
                ...(social1 != null && {
                    social1,
                }),
                ...(social2 != null && {
                    social2,
                }),
                ...(social3 != null && {
                    social3,
                }),
                ...(social4 != null && {
                    social4,
                }),
            },
        }))
        touch('socialLinks')
    }, [commit, touch])

    return useMemo(() => ({
        undo,
        updateProduct,
        updateName,
        updateDescription,
        updateImageUrl,
        updateImageFile,
        updateStreams,
        updateCategory,
        updateAdminFee,
        updateRequiresWhitelist,
        updateIsFree,
        updatePrice,
        updateBeneficiaryAddress,
        updateType,
        updateTermsOfUse,
        updateContactUrl,
        updateContactEmail,
        updateSocialLinks,
    }), [
        undo,
        updateProduct,
        updateName,
        updateDescription,
        updateImageUrl,
        updateImageFile,
        updateStreams,
        updateCategory,
        updateAdminFee,
        updateRequiresWhitelist,
        updateIsFree,
        updatePrice,
        updateBeneficiaryAddress,
        updateType,
        updateTermsOfUse,
        updateContactUrl,
        updateContactEmail,
        updateSocialLinks,
    ])
}

export default useEditableProductActions
