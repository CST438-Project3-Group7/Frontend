import { Tabs } from "expo-router";
export default ()=> {
    return (
        <Tabs>
        <Tabs.Screen name="home" />
        <Tabs.Screen name="login"/>
        <Tabs.Screen name="signUp"/>
        <Tabs.Screen name="cmovies" />
        <Tabs.Screen name="cgames"/>
        <Tabs.Screen name="cmusic"/>
        <Tabs.Screen name="feed"/>
        </Tabs>
    );
}