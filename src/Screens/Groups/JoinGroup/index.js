import React, { Component } from 'react'
import { View, Text, StyleSheet, Button } from 'react-native';
import Modal from 'react-native-modal';

import firestore from '@react-native-firebase/firestore'

import CustomTextInput from '../../../Components/CustomTextInput'

import { groupsCollection } from '../../../Utilities/Constants'
import { showLoader } from '../../../Utilities/Loader'

export default class JoinGroup extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,
            groupIdText: ''
        }

        this.onJoinClicked = this.onJoinClicked.bind(this)
        this.onCancelClicked = this.onCancelClicked.bind(this)
        this.onGroupIdTextChange = this.onGroupIdTextChange.bind(this)
        this.setLoading = this.setLoading.bind(this)

    }

    setLoading(isLoading) {
        this.setState({
            isLoading
        })
    }

    componentDidMount() {

    }

    async onJoinClicked() {
        this.setLoading(true)
        const { hideModal, user } = this.props
        const { groupIdText } = this.state

        if (groupIdText.length === 0) {
            this.setLoading(false)
            alert('Provide group id to proceed.')
            return
        }
        if (!groupIdText.includes('TB_GR_')) {
            this.setLoading(false)
            alert('Incorrect group id. Please use correct id to join group.')
            return
        }

        const newMemberData = {
            isAdmin: false,
            userId: user.id
        }

        const groupDataFirebase = await firestore()
            .collection(groupsCollection)
            .where('id', '==', groupIdText)
            .limit(1)
            .get()

        let isAlreadyMember = false
        if (groupDataFirebase.size > 0) {
            groupDataFirebase.forEach(async group => {
                const groupMembers = group.data().members
                groupMembers.forEach(member => {
                    if (member.userId === user.id) {
                        isAlreadyMember = true
                    }
                })
                if (isAlreadyMember) {
                    alert('You are already a member of this group.')
                } else {
                    groupMembers.push(newMemberData)
                    await firestore()
                        .collection(groupsCollection)
                        .doc(groupIdText)
                        .update({
                            members: groupMembers
                        })
                }
            })
        } else {
            alert('No Group Found with this ID.')
        }
        this.setLoading(false)
        hideModal()
    }
    onCancelClicked() {
        const { hideModal } = this.props
        hideModal()
    }

    onGroupIdTextChange(text) {
        this.setState({
            groupIdText: text
        })
    }

    render() {
        const { modalVisibility } = this.props
        const { isLoading, groupIdText } = this.state
        return (
            <>
                <Modal isVisible={modalVisibility}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={{ fontSize: 30, color: "#5285F6", textAlign: "center" }}>JOIN GROUP</Text>
                        <Text style={{ marginTop: 25, marginStart: 15, color: "#5285F6" }}>Enter Group Code</Text>
                        <CustomTextInput
                            style={styles.createGroupInput}
                            placeholder="TB_GR_XXXXXXXX_XXXXXX"
                            placeholderTextColor="#5285F6"
                            onChangeText={this.onGroupIdTextChange}
                            value={groupIdText} />

                        <View style={{ flexDirection: "row", marginTop: 20, justifyContent: "center", alignItems: "center" }}>
                            <View style={{ flex: 1 }}>
                                <Button
                                    color="#799FF4"
                                    title="Join"
                                    onPress={this.onJoinClicked} />
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
            </>
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
        marginTop: 5,
        padding: 10,
        alignSelf: "center"
    },
    createGroupModalBtn: {
        flex: 1,
        backgroundColor: '#799FF4',
        borderRadius: 5,
        borderColor: 'white',
        borderWidth: 1,
    }
})