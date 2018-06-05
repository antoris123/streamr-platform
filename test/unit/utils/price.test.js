import assert from 'assert-diff'

import * as all from '../../../src/utils/price'

describe('price utils', () => {
    describe('priceForTimeUnits', () => {
        it('works without the digits parameter', () => {
            const pps = 2
            assert.equal(all.priceForTimeUnits(pps, 0, 'second'), 0)
            assert.equal(all.priceForTimeUnits(0, 0, 'second'), 0)
            assert.equal(all.priceForTimeUnits(pps, 7, 'second'), 14)
            assert.equal(all.priceForTimeUnits(pps, 7, 'minute'), 840)
            assert.equal(all.priceForTimeUnits(pps, 7, 'hour'), 50400)
            assert.equal(all.priceForTimeUnits(pps, 7, 'day'), 1209600)
            assert.equal(all.priceForTimeUnits(pps, 7, 'week'), 8467200)
            // assert.equal(all.priceForTimeUnits(pps, 7, 'month'), 36288000) depends on the month we're now
            assert.throws(() => all.priceForTimeUnits(pps, 7, 'asdf'))
        })
    })

    describe('pricePerSecondFromTimeUnit', () => {
        it('calculates PPS for time units', () => {
            assert.equal(all.pricePerSecondFromTimeUnit(0, 'second'), 0)
            assert.equal(all.pricePerSecondFromTimeUnit(1, 'second'), 1)
            assert.equal(all.pricePerSecondFromTimeUnit(1, 'minute'), 0.01666666666666666667)
            assert.equal(all.pricePerSecondFromTimeUnit(1, 'hour'), 0.00027777777777777778)
            assert.equal(all.pricePerSecondFromTimeUnit(1, 'day'), 0.00001157407407407407)
            assert.equal(all.pricePerSecondFromTimeUnit(1, 'week'), 0.00000165343915343915)
            assert.throws(() => all.pricePerSecondFromTimeUnit(0, 'asdf'))
        })
    })

    describe('dataToUsd', () => {
        it('converts currency with given rate', () => {
            assert.equal(all.dataToUsd(10, 0), 0)
            assert.equal(all.dataToUsd(0, 10), 0)
            assert.equal(all.dataToUsd(1, 0.5), 2)
            assert.equal(all.dataToUsd(1, 4), 0.25)
        })
    })

    describe('usdToData', () => {
        it('converts currency with given rate', () => {
            assert.equal(all.usdToData(10, 0), 0)
            assert.equal(all.usdToData(0, 10), 0)
            assert.equal(all.usdToData(1, 0.5), 0.5)
            assert.equal(all.usdToData(10, 80), 800)
        })
    })

    describe('convert', () => {
        it('converts currency with given rate', () => {
            assert.equal(all.convert(1, 0.5, 'USD', 'DATA'), 0.5)
            assert.equal(all.convert(1, 0.5, 'DATA', 'USD'), 2)
            assert.equal(all.convert(0, 0, 'USD', 'DATA'), 0)
            assert.equal(all.convert(0, 0, 'DATA', 'USD'), 0)
        })
    })

    describe('sanitize', () => {
        it('sanitizes correctly', () => {
            assert.equal(all.sanitize(-500), 0)
            assert.equal(all.sanitize(-1.345345), 0)
            assert.equal(all.sanitize(12300), 12300)
            assert.equal(all.sanitize(1.012030123012), 1.012030123012)
        })
    })

    describe('formatAmount', () => {
        it('formats amount', () => {
            assert.equal(all.formatAmount(1, -2123123), 1)
            assert.equal(all.formatAmount(1, 5), 1)
            assert.equal(all.formatAmount(0.0005, 3), 0.001)
            assert.equal(all.formatAmount(0.000551, 4), 0.0006)
            assert.equal(all.formatAmount(0.000541, 4), 0.0005)
        })
    })

    describe('formatDecimals', () => {
        it('displays, rounds and recognizes currency', () => {
            assert.equal(all.formatDecimals(1, 'DATA'), '1')
            assert.equal(all.formatDecimals(1.234, 'DATA'), '1.234')
            assert.equal(all.formatDecimals(10, 'DATA'), '10')
            assert.equal(all.formatDecimals(12.34, 'DATA'), '12.34')
            assert.equal(all.formatDecimals(12.345, 'DATA'), '12.35')
            assert.equal(all.formatDecimals(123.45, 'DATA'), '123.5')
            assert.equal(all.formatDecimals(1234.5, 'DATA'), '1235')
            assert.equal(all.formatDecimals(1234, 'DATA'), '1234')

            assert.equal(all.formatDecimals(1, 'USD'), '1.00')
            assert.equal(all.formatDecimals(1.234, 'USD'), '1.23')
            assert.equal(all.formatDecimals(10, 'USD'), '10.00')
            assert.equal(all.formatDecimals(12.34, 'USD'), '12.34')
            assert.equal(all.formatDecimals(12.345, 'USD'), '12.35')
            assert.equal(all.formatDecimals(123.45, 'USD'), '123.5')
            assert.equal(all.formatDecimals(1234.5, 'USD'), '1235')
            assert.equal(all.formatDecimals(1234, 'USD'), '1234')
        })
    })

    describe('arePricesEqual', () => {
        it('checks prices', () => {
            assert.equal(all.arePricesEqual(1, 0.5), false)
            assert.equal(all.arePricesEqual(1, 1), true)
            assert.equal(all.arePricesEqual(-1.123123, -1.123123), true)
            assert.equal(all.arePricesEqual(0.00000000000000001, -0.00000000000000001), false)
            assert.equal(all.arePricesEqual(0.00000000000000001, 0.00000000000000001), true)
        })
    })

    describe('getMostRelevantTimeUnit', () => {
        it('calculates the most relevant time unit', () => {
            assert.equal(all.getMostRelevantTimeUnit(1), 'second')
            assert.equal(all.getMostRelevantTimeUnit(0.017), 'minute')
            assert.equal(all.getMostRelevantTimeUnit(0.0017), 'hour')
            assert.equal(all.getMostRelevantTimeUnit(0.00017), 'day')
            assert.equal(all.getMostRelevantTimeUnit(0.0000017), 'week')
        })
    })

    describe('formatPrice', () => {
        it('works with all parameters given', () => {
            assert.equal(all.formatPrice(1, 'DATA', 'second'), '1 DATA / s')
            assert.equal(all.formatPrice(1, 'DATA', 'minute'), '60 DATA / min')
            assert.equal(all.formatPrice(0.016666, 'DATA', 'minute'), '1 DATA / min')
            assert.equal(all.formatPrice(0.016666, 'DATA', 'hour'), '60 DATA / hr')
            assert.equal(all.formatPrice(1.004512, 'DATA', 'second'), '1.005 DATA / s')
            assert.equal(all.formatPrice(123.456789, 'DATA', 'second'), '123.5 DATA / s')
            assert.equal(all.formatPrice(123.512345, 'DATA', 'second'), '123.5 DATA / s')
            assert.equal(all.formatPrice(0.00000000008, 'DATA', 'second'), '0 DATA / s')
            assert.equal(all.formatPrice(0.0002777777, 'USD', 'hour'), '1.00 USD / hr')
            assert.equal(all.formatPrice(0.0002777777, 'USD', 'day'), '24.00 USD / d')
            assert.equal(all.formatPrice(0.0000115, 'USD', 'day'), '0.99 USD / d')
            assert.equal(all.formatPrice(0.0000115, 'USD', 'week'), '6.96 USD / wk')
        })

        it('works without timeunit given', () => {
            assert.equal(all.formatPrice(1, 'DATA'), '1 DATA / s')
            assert.equal(all.formatPrice(0.0166666666667, 'DATA'), '1 DATA / min')
            assert.equal(all.formatPrice(0.04, 'DATA'), '2.4 DATA / min')
            assert.equal(all.formatPrice(0.0002777777778, 'USD'), '1.00 USD / hr')
            assert.equal(all.formatPrice(0.000011574075, 'USD'), '1.00 USD / d')
            assert.equal(all.formatPrice(0.00005, 'USD'), '4.32 USD / d')
            assert.equal(all.formatPrice(0.00000165344, 'USD'), '1.00 USD / wk')
        })
    })
})
