import React, { useContext, useEffect } from 'react'
import * as RouterContext from '$editor/shared/components/RouterContext'
import LoadingIndicator from '$userpages/components/LoadingIndicator'

import * as CanvasState from '../../state'

import useCanvas from './useCanvas'
import useCanvasLoader from './useCanvasLoader'
import useCanvasCreate from './useCanvasCreate'
import usePending, { useAnyPending, Provider as PendingProvider } from './usePending'

import styles from './CanvasController.pcss'

function useCanvasLoadEffect() {
    const canvas = useCanvas()
    const load = useCanvasLoader()
    const { match } = useContext(RouterContext.Context)
    const { isPending } = usePending('LOAD')

    const { id: urlId } = match.params
    const currentCanvasRootId = canvas && CanvasState.getRootCanvasId(canvas)
    const canvasId = currentCanvasRootId || urlId

    useEffect(() => {
        if (!urlId) { return } // do nothing if no url id
        if (canvasId && currentCanvasRootId !== canvasId && !isPending) {
            // load canvas if needed and not already loading
            load(canvasId)
        }
    }, [urlId, canvasId, currentCanvasRootId, load, canvas, isPending])
}

function useCanvasCreateEffect() {
    const { match } = useContext(RouterContext.Context)

    const create = useCanvasCreate()
    const { id } = match.params

    useEffect(() => {
        if (id) { return }
        create()
    }, [id, create])
}

function CanvasEffects() {
    useCanvasCreateEffect()
    useCanvasLoadEffect()
    return null
}

function CanvasLoadingIndicator() {
    const isPending = useAnyPending()
    return (
        <LoadingIndicator className={styles.LoadingIndicator} loading={isPending} />
    )
}

const CanvasControllerProvider = ({ children }) => (
    <RouterContext.Provider>
        <PendingProvider>
            <CanvasLoadingIndicator />
            <CanvasEffects />
            {children || null}
        </PendingProvider>
    </RouterContext.Provider>
)

export { CanvasControllerProvider as Provider }
