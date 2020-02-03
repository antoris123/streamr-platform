// @flow

import React, { type Node, useState, useCallback, useMemo } from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import cx from 'classnames'
import { Label, FormGroup } from 'reactstrap'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import Buttons from '$shared/components/Buttons'
import Checkbox from '$shared/components/Checkbox'
import Tile from '$shared/components/Tile'
import FallbackImage from '$shared/components/FallbackImage'
import { type Product } from '$mp/flowtype/product-types'

import dataUnionStats from '$mp/assets/deploy-modal-stats.png'

import styles from './guidedDeployDataUnionDialog.pcss'

type ChildrenProps = {
    children?: Node,
}

type ProductCardProps = {
    name: string,
    image: string,
    className?: string,
}

const PreviewContainer = ({ children }: ChildrenProps) => (
    <div className={styles.previewContainer}>
        {children}
        <div className={styles.previewBackground} />
    </div>
)

const TextContainer = ({ children }: ChildrenProps) => (
    <div className={styles.textContainer}>
        {children}
    </div>
)

const ProductCard = ({ name, image, className }: ProductCardProps) => (
    <div className={cx(styles.productCard, className)}>
        <Tile
            className={styles.productTile}
            imageUrl={image}
            labels={{
                dataUnion: true,
            }}
            badges={{
                members: 15,
            }}
        >
            <Tile.Title>{name}</Tile.Title>
            <Tile.Description>
                <Translate value="modal.deployDataUnion.guide.preview.updated" />
            </Tile.Description>
            <Tile.Status className={styles.status}>
                <Translate value="modal.deployDataUnion.guide.preview.status" />
            </Tile.Status>
        </Tile>
    </div>
)

export type Props = {
    product: Product,
    onClose: () => void,
    onContinue: (boolean) => Promise<void>,
    dontShowAgain?: boolean,
}

const GuidedDeployDataUnionDialog = ({ product, onClose, onContinue: onContinueProp, dontShowAgain }: Props) => {
    const [skipHelp, setSkipHelp] = useState(!!dontShowAgain)
    const [step, setStep] = useState(0)
    const [waitingOnContinue, setWaitingOnContinue] = useState(false)

    const isLastStep = step === 3
    const { name } = product
    // $FlowFixMe property `preview` is missing in  `File`.
    const image = String((product.newImageToUpload && product.newImageToUpload.preview) || product.imageUrl)

    const onContinue = useCallback(async () => {
        if (isLastStep) {
            setWaitingOnContinue(true)
            await onContinueProp(skipHelp)
        } else {
            setStep((prev) => prev + 1)
        }
    }, [onContinueProp, isLastStep, skipHelp])

    const setSkipped = useCallback((checked) => {
        setSkipHelp(checked)
    }, [setSkipHelp])

    const helpContent = useMemo(() => (
        <div className={styles.tabContent}>
            {step === 0 && (
                <React.Fragment>
                    <div className={styles.previewImageWrapper}>
                        <FallbackImage src={image} alt={name} className={styles.previewImage} />
                    </div>
                    <TextContainer>
                        <Translate value="modal.deployDataUnion.guide.step1" dangerousHTML />
                    </TextContainer>
                </React.Fragment>
            )}
            {step === 1 && (
                <React.Fragment>
                    <PreviewContainer>
                        <ProductCard
                            name={name}
                            image={image}
                            className={styles.highlightStatus}
                        />
                    </PreviewContainer>
                    <TextContainer>
                        <Translate value="modal.deployDataUnion.guide.step2" dangerousHTML />
                    </TextContainer>
                </React.Fragment>
            )}
            {step === 2 && (
                <React.Fragment>
                    <PreviewContainer>
                        <ProductCard
                            name={name}
                            image={image}
                            className={styles.highlightMembers}
                        />
                    </PreviewContainer>
                    <TextContainer>
                        <Translate value="modal.deployDataUnion.guide.step3" dangerousHTML />
                    </TextContainer>
                </React.Fragment>
            )}
            {step === 3 && (
                <React.Fragment>
                    <PreviewContainer>
                        <img src={dataUnionStats} alt="" className={styles.highlightStats} />
                    </PreviewContainer>
                    <TextContainer>
                        <Translate value="modal.deployDataUnion.guide.step4" dangerousHTML />
                    </TextContainer>
                </React.Fragment>
            )}
        </div>
    ), [step, name, image])

    return (
        <ModalPortal>
            <Dialog
                className={cx(styles.root, styles.GuidedDeployDataUnionDialog)}
                title={I18n.t('modal.deployDataUnion.guide.title', {
                    name: product.name,
                })}
                onClose={onClose}
                contentClassName={styles.content}
                containerClassname={styles.dialogContainer}
                renderActions={() => (
                    <div className={styles.footer}>
                        <div className={styles.footerText}>
                            <FormGroup check className={styles.formGroup}>
                                <Label check className={styles.label}>
                                    <Checkbox
                                        value={skipHelp}
                                        onChange={(e) => {
                                            setSkipped(e.target.checked)
                                        }}
                                    />
                                    <Translate value="modal.deployDataUnion.guide.dontShowAgain" />
                                </Label>
                            </FormGroup>
                        </div>
                        <Buttons
                            actions={{
                                cancel: {
                                    title: I18n.t('modal.common.cancel'),
                                    onClick: onClose,
                                    kind: 'link',
                                    disabled: waitingOnContinue,
                                },
                                continue: isLastStep ? {
                                    title: I18n.t('modal.common.deploy'),
                                    kind: 'primary',
                                    onClick: onContinue,
                                    spinner: waitingOnContinue,
                                    disabled: waitingOnContinue,
                                } : {
                                    title: I18n.t('modal.common.next'),
                                    outline: true,
                                    onClick: onContinue,
                                },
                            }}
                        />
                    </div>
                )}
            >
                {helpContent}
                <div className={styles.tabs}>
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={styles.tab}
                        >
                            <button
                                type="button"
                                onClick={() => setStep(i)}
                                className={styles.tabButton}
                            >
                                <div className={cx(styles.tabLine, {
                                    [styles.activeTab]: i === step,
                                })}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </Dialog>
        </ModalPortal>
    )
}

export default GuidedDeployDataUnionDialog
