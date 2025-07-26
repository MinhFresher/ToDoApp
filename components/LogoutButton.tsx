import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { router } from 'expo-router';

export default function Logout(){
    const handleLogout = async () => {
        try {
        await signOut(auth);
        router.replace('/auth/login'); 
        } catch (err) {
        console.error('Logout error:', err);
        }
    };
    return(
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}> Log Out</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    logoutButton: {
        width: '100%',
        backgroundColor: '#9677f0',
        borderWidth: 1,
        borderRadius: 5
    },
    logoutText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        paddingVertical: 10

    }
})