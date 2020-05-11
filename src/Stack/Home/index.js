import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import Home from '../../Screens/Home';
import Groups from '../../Screens/Groups';
import Profile from '../../Screens/Profile';

function HomeComponent() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#C8D4F1",
                },
                headerTintColor: "#5285F6"
            }}>
            <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
    )
}

function GroupsComponent() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#C8D4F1",
                },
                headerTintColor: "#5285F6"
            }}>
            <Stack.Screen name="Groups" component={Groups} />
        </Stack.Navigator>
    )
}

function ProfileComponent() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#C8D4F1",
                },
                headerTintColor: "#5285F6"
            }}>
            <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
    )
}

function mainStack() {
    const Tab = createMaterialBottomTabNavigator();
    return (
        <Tab.Navigator
            initialRouteName="Home"
            activeColor="#5285F6"
            inactiveColor="white"
            barStyle={{ backgroundColor: '#B7C6E8' }}>
            <Tab.Screen
                name="Home"
                component={HomeComponent}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="home" color={color} size={26} />
                    ),
                }} />
            <Tab.Screen
                name="Groups"
                component={GroupsComponent}
                options={{
                    tabBarLabel: 'Groups',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="account-group" color={color} size={26} />
                    ),
                }} />
            <Tab.Screen
                name="Profile"
                component={ProfileComponent}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="account" color={color} size={26} />
                    ),
                }} />
        </Tab.Navigator>
    )
}

export {
    mainStack
}