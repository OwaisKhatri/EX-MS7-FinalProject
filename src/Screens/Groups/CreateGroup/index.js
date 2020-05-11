import React, { Component } from 'react'
import { View, Text, StyleSheet, Button } from 'react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage'

import firestore from '@react-native-firebase/firestore'

import CustomTextInput from '../../../Components/CustomTextInput';

import { groupsCollection, storeUserKey } from '../../../Utilities/Constants'
import { generateGroupID } from '../../../Utilities/Utils'
import { showLoader } from '../../../Utilities/Loader'

export default class CreateGroup extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,
            user: '',
            groupName: ''
        }

        this.onCreateClicked = this.onCreateClicked.bind(this)
        this.onCancelClicked = this.onCancelClicked.bind(this)
        this.setLoading = this.setLoading.bind(this)

    }

    async componentDidMount() {
        const userData = await AsyncStorage.getItem(storeUserKey)
        const user = JSON.parse(userData)
        this.setState({
            user
        })
    }

    setLoading(isLoading) {
        this.setState({
            isLoading
        })
    }

    onGroupNameChange(text) {
        this.setState({
            groupName: text
        })
    }
    async onCreateClicked() {
        this.setLoading(true)
        const { groupName, user } = this.state
        const { hideModal } = this.props

        if (groupName === '') {
            this.setLoading(false)
            alert('Kindly provide group name to proceed')
        } else {
            const groupMembers = [{
                userId: user.id,
                isAdmin: true
            }]
            const groupData = {
                id: generateGroupID(),
                name: groupName,
                members: groupMembers
            }
            await firestore()
                .collection(groupsCollection)
                .doc(groupData.id)
                .set(groupData)
            this.setLoading(false)
            hideModal()
        }
    }
    onCancelClicked() {
        const { hideModal } = this.props
        hideModal()
    }

    render() {
        const { isLoading, groupName } = this.state
        const { modalVisibility } = this.props
        return (
            <View>
                <Modal isVisible={modalVisibility}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 30, color: "#5285F6" }}>CREATE GROUP</Text>
                        <CustomTextInput
                            style={styles.createGroupInput}
                            placeholder="Group Name"
                            placeholderTextColor="#5285F6"
                            onChangeText={(text) => this.onGroupNameChange(text)}
                            value={groupName} />

                        <View style={{ flexDirection: "row", marginTop: 20 }}>
                            <View style={{ flex: 1 }}>
                                <Button
                                    color="#799FF4"
                                    title="Create"
                                    onPress={this.onCreateClicked} />
                            </View>

                            <View style={{ flex: 1, marginStart: 10 }}>
                                <Button
                                    color="#799FF4"
                                    title="Cancel"
                                    onPress={this.onCancelClicked} />
                            </View>
                        </View>

                    </View>
                </Modal>
                {showLoader(isLoading)}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    createGroupInput: {
        width: 300,
        borderColor: '#5285F6',
        borderWidth: 1,
        borderRadius: 5,
        color: '#5285F6',
        backgroundColor: "#d5dff5",
        marginTop: 25,
        marginStart: 30,
        marginEnd: 30,
        padding: 10,
    },
    createGroupModalBtn: {
        flex: 1,
        backgroundColor: '#799FF4',
        borderRadius: 5,
        borderColor: 'white',
        borderWidth: 1,
    }
})