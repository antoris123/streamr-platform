// @flow

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import cx from 'classnames'
import { Translate, I18n } from 'react-redux-i18n'

import Popover from '$shared/components/Popover'
import { truncate } from '$shared/utils/text'
import KeyFieldEditor, { type LabelType } from './KeyFieldEditor'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import useIsMounted from '$shared/hooks/useIsMounted'
import useCopy from '$shared/hooks/useCopy'
import Label from '$ui/Label'
import WithInputActions from '$shared/components/WithInputActions'
import Text from '$ui/Text'
import StatusIcon from '$shared/components/StatusIcon'

import styles from './keyField.pcss'

type Props = {
    keyName: string,
    value?: string,
    hideValue?: boolean,
    className?: string,
    allowEdit?: boolean,
    onSave?: (?string, ?string) => Promise<void>,
    allowDelete?: boolean,
    disableDelete?: boolean,
    onDelete?: () => Promise<void>,
    labelType: LabelType,
    onToggleEditor?: (boolean) => void,
    labelComponent?: any,
    active?: boolean,
}

const includeIf = (condition: boolean, elements: Array<any>) => (condition ? elements : [])

const KeyField = ({
    keyName,
    value,
    hideValue,
    className,
    allowEdit,
    onSave: onSaveProp,
    allowDelete,
    disableDelete,
    onDelete: onDeleteProp,
    labelType,
    onToggleEditor: onToggleEditorProp,
    labelComponent,
    active,
}: Props) => {
    const [waiting, setWaiting] = useState(false)
    const [hidden, setHidden] = useState(!!hideValue)
    const [editing, setEditing] = useState(false)
    const [error, setError] = useState(undefined)

    const isMounted = useIsMounted()
    const { copy } = useCopy()

    const toggleHidden = useCallback(() => {
        setHidden((wasHidden) => !wasHidden)
    }, [])

    useEffect(() => {
        if (onToggleEditorProp) {
            onToggleEditorProp(editing)
        }
    }, [editing, onToggleEditorProp])

    const notify = useCallback(() => {
        Notification.push({
            title: I18n.t('notifications.valueCopied', {
                value: I18n.t(`userpages.keyFieldEditor.keyValue.${labelType}`),
            }),
            icon: NotificationIcon.CHECKMARK,
        })
    }, [labelType])

    const onCopy = useCallback(() => {
        copy(value || '')
        notify()
    }, [copy, value, notify])

    const onCancel = useCallback(() => {
        setEditing(false)
    }, [])

    const onSave = useCallback(async (keyName: ?string, value: ?string) => {
        if (allowEdit) {
            setError(undefined)

            if (onSaveProp) {
                setWaiting(true)

                try {
                    await onSaveProp(keyName, value)

                    if (isMounted()) {
                        setEditing(false)
                        setError(undefined)
                    }
                } catch (e) {
                    if (isMounted()) {
                        setError(undefined)
                    }
                } finally {
                    setWaiting(false)
                }
            } else {
                setEditing(false)
            }
        }
    }, [allowEdit, onSaveProp, isMounted])

    const onDelete = useCallback(() => {
        if (allowDelete && onDeleteProp) {
            onDeleteProp()
        }
    }, [allowDelete, onDeleteProp])

    const onEdit = useCallback(() => {
        setEditing(true)
    }, [])

    const revealAction = useMemo(() => (
        <Popover.Item key="reveal" onClick={toggleHidden}>
            <Translate value={`userpages.keyField.${hidden ? 'reveal' : 'conceal'}`} />
        </Popover.Item>
    ), [toggleHidden, hidden])

    const editAction = useMemo(() => (
        <Popover.Item key="edit" onClick={onEdit}>
            <Translate value="userpages.keyField.edit" />
        </Popover.Item>
    ), [onEdit])

    const deleteAction = useMemo(() => (
        <Popover.Item key="delete" onClick={onDelete} disabled={disableDelete}>
            <Translate value="userpages.keyField.delete" />
        </Popover.Item>
    ), [onDelete, disableDelete])

    const inputActions = useMemo(() => ([
        ...includeIf(!!hideValue, [revealAction]),
        <Popover.Item key="copy" onClick={onCopy}>
            <Translate value="userpages.keyField.copy" />
        </Popover.Item>,
        ...includeIf(!!allowEdit, [editAction]),
        ...includeIf(!!allowDelete, [deleteAction]),
    ]), [hideValue, revealAction, onCopy, allowEdit, editAction, allowDelete, deleteAction])

    return (
        <div className={cx(styles.root, styles.KeyField, className)}>
            {!editing ? (
                <div className={styles.keyFieldContainer}>
                    <div className={styles.labelWrapper}>
                        {!!active && (
                            <StatusIcon status={StatusIcon.OK} className={styles.status} />
                        )}
                        <Label htmlFor="keyName" className={styles.label}>
                            &zwnj;
                            <div className={styles.keyNameHolder}>
                                {keyName}
                            </div>
                        </Label>
                        <div>
                            {labelComponent}
                        </div>
                    </div>
                    <WithInputActions actions={inputActions}>
                        <Text
                            value={value && truncate(value)}
                            readOnly
                            type={hidden ? 'password' : 'text'}
                        />
                    </WithInputActions>
                </div>
            ) : (
                <KeyFieldEditor
                    keyName={keyName}
                    value={value}
                    onCancel={onCancel}
                    onSave={onSave}
                    waiting={waiting}
                    error={error}
                    labelType={labelType}
                />
            )}
        </div>
    )
}

KeyField.defaultProps = {
    labelType: 'apiKey',
}

export default KeyField
