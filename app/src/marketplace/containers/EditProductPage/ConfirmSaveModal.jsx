// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'

import useModal from '$shared/hooks/useModal'

import ConfirmSaveDialog from '$shared/components/ConfirmSaveDialog'

export default () => {
    const { api, isOpen } = useModal('confirmSave')

    if (!isOpen) {
        return null
    }

    return (
        <ConfirmSaveDialog
            onSave={() => api.close({
                save: true,
                redirect: true,
            })}
            onContinue={() => api.close({
                save: false,
                redirect: true,
            })}
            onClose={() => api.close({
                save: false,
                redirect: false,
            })}
        >
            <Translate
                value="modal.confirmSave.product.message"
                tag="p"
                dangerousHTML
            />
        </ConfirmSaveDialog>
    )
}
