import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomePage from './WelcomePage';
import CameraComponent from './camera';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={WelcomePage} />
         <Stack.Screen name="CameraComponent" component={CameraComponent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
