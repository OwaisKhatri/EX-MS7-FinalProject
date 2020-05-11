import React from 'react'
import Modal from 'react-native-modal'
import { ActivityIndicator } from 'react-native'

function showLoader(show) {
    return (
        <Modal isVisible={show}>
            <ActivityIndicator
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                animating={show}
                size="large"
                color="#1B4CB5" />
        </Modal>
    )
}

export {
    showLoader
}