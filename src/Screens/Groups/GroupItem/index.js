import React, { Component } from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'
import { Icon } from 'native-base'

import AsyncStorage from '@react-native-community/async-storage'

import { selectedGroup } from '../../../Utilities/Constants'

export default class GroupItem extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const { groupItem, user, selectedGroup, selectGroupClick } = this.props
        return (
            <View style={styles.itemContainer}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ color: "#5285F6", fontWeight: "bold", fontSize: 17 }}>{groupItem.name}</Text>
                    {
                        groupItem.members.map((member, index) => {
                            if (member.userId === user.id) {
                                return member.isAdmin &&
                                    <View key={index} style={{ alignItems: "center" }}>
                                        <Icon name="adduser" type="AntDesign" style={{ color: '#5285F6', marginEnd: 15 }} />
                                        <Text style={{ color: "#5285F6" }}>Invite Friends</Text>
                                    </View>
                            }
                        })
                    }
                </View>
                {
                    !(groupItem.id === selectedGroup.id) &&
                    <View style={{ marginTop: 20, marginStart: 30, marginEnd: 30 }}>
                        <Button
                            title="Select Group for Danger Time"
                            color="#5285F6"
                            onPress={() => selectGroupClick(groupItem)} />
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        borderColor: "#5285F6",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        padding: 10
    }
})