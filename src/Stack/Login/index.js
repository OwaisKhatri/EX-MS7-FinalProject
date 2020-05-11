import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Login from '../../Screens/Login';
import LoginWithEmail from '../../Screens/LoginWithEmail';
import Registration from '../../Screens/Registration';

function loginStack() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#C8D4F1",
                },
                headerTintColor: "#5285F6"
            }}>
            <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="Login with Email"
                component={LoginWithEmail}
                options={{
                    headerShown: true
                }} />
            <Stack.Screen
                name="Create Account"
                component={Registration}
                options={{
                    headerShown: true
                }} />
        </Stack.Navigator>
    )
}

export {
    loginStack
}