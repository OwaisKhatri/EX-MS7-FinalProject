import React, { Component } from 'react'
import { View, Text, StyleSheet, Button } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage'

import firestore from '@react-native-firebase/firestore'

import CustomTouchableOpacity from '../../Components/CustomTouableOpacity'

import CreateGroupModal from './CreateGroup'
import JoinGroup from './JoinGroup'
import GroupItem from './GroupItem'

import { groupsCollection, storeUserKey, selectedGroup } from '../../Utilities/Constants'
import { showLoader } from '../../Utilities/Loader'

export default class Groups extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,
            createGroupModal: false,
            joinGroupModal: false,
            user: '',
            selectedGroup: '',
            groups: []
        }

        this.onCreateGroupBtn = this.onCreateGroupBtn.bind(this)
        this.onJoinGroupBtn = this.onJoinGroupBtn.bind(this)
        this.hideModal = this.hideModal.bind(this)
        this.setLoading = this.setLoading.bind(this)

        this.selectGroupClick = this.selectGroupClick.bind(this)

    }

    async componentDidMount() {
        this.setLoading(true)
        const userData = await AsyncStorage.getItem(storeUserKey)
        const user = JSON.parse(userData)
        this.setState({
            user
        })
        await this.getAllGroups()
        const group = await AsyncStorage.getItem(selectedGroup)
        this.setState({
            selectedGroup: JSON.parse(group)
        })
    }

    setLoading(isLoading) {
        this.setState({
            isLoading
        })
    }

    //CreateGroupClickListeners Functions
    onCreateGroupBtn() {
        this.setState({
            createGroupModal: true
        })
    }
    createGroupModal() {
        const { createGroupModal } = this.state
        return <CreateGroupModal modalVisibility={createGroupModal} hideModal={this.hideModal} />
    }

    //JoinGroupClickListeners Functions
    onJoinGroupBtn() {
        this.setState({
            joinGroupModal: true
        })
    }
    joinGroupModal() {
        const { joinGroupModal, user } = this.state
        return <JoinGroup modalVisibility={joinGroupModal} hideModal={this.hideModal} user={user}/>
    }

    async hideModal() {
        this.setState({
            createGroupModal: false,
            joinGroupModal: false
        })
        await this.getAllGroups()
    }

    async getAllGroups() {
        const { groups, user } = this.state
        groups.length = 0
        const firebaseGroups = await firestore()
            .collection(groupsCollection)
            .get()
        firebaseGroups.forEach(groupItem => {
            const group = groupItem.data()
            group.members.forEach(memberItem => {
                if (memberItem.userId === user.id) {
                    groups.push(group)
                }
            })
        })

        this.setState({
            groups
        })
        this.setLoading(false)
    }

    async selectGroupClick(groupItem) {
        await AsyncStorage.removeItem(selectedGroup)
        await AsyncStorage.setItem(selectedGroup, JSON.stringify(groupItem))
        this.setState({
            selectedGroup: groupItem
        })
    }
    render() {
        const { isLoading, groups, user, selectedGroup } = this.state
        return (
            <View style={styles.mainContainer}>
                <View style={styles.buttonsContainer}>
                    <CustomTouchableOpacity
                        touchableViewStyle={styles.touchableView}
                        text="Create Group"
                        onPress={this.onCreateGroupBtn}
                    />
                    <CustomTouchableOpacity
                        touchableViewStyle={styles.touchableView}
                        text="Join Group"
                        onPress={this.onJoinGroupBtn}
                    />
                </View>

                <View style={styles.listView}>
                    {groups.length > 0 ?
                        <FlatList
                            data={groups}
                            renderItem={({ item }) =>
                                <GroupItem
                                    user={user}
                                    groupItem={item}
                                    selectedGroup={selectedGroup ? selectedGroup : ''} 
                                    selectGroupClick={this.selectGroupClick}/>
                            }
                            extraData={this.state}
                            keyExtractor={group => group.id} />
                        :
                        <Text style={{ color: "red", fontSize: 20, margin: 20, justifyContent: "center" }}>
                            Not in any group. Create your own group and invite friends.
                        </Text>}
                </View>

                {this.createGroupModal()}
                {this.joinGroupModal()}

                {showLoader(isLoading)}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#d5dff5',
    },
    buttonsContainer: {
        flexDirection: 'row',
        margin: 10
    },
    listView: {
        flex: 9,
        margin: 10,
        justifyContent: "center",
    },
    touchableView: {
        flex: 1,
        backgroundColor: '#799FF4',
        borderRadius: 5,
        borderColor: 'white',
        borderWidth: 1,
        paddingStart: 10
    },
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