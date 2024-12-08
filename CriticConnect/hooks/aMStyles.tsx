import { StyleSheet } from 'react-native';
import { useWindowDimensions } from 'react-native';

const styles = StyleSheet.create({
    navContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    navItem: {
      padding: 10,
    },
    navItemActive: {
      borderBottomWidth: 2,
      borderBottomColor: '#000',
      padding: 10,
    },
    navText: {
      fontSize: 16,
      color: '#000',
    },
    navTextActive: {
      fontSize: 16,
      color: '#000',
      fontWeight: 'bold',
    },
    formContainer: {
      backgroundColor: '#f9f9f9',
      padding: 20,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    formGroup: {
      marginBottom: 15,
    },
    label: {
      fontSize: 14,
      color: '#333',
      marginBottom: 5,
    },
    input: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      backgroundColor: '#fff',
    },
    checkboxGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    checkbox: {
      marginRight: 10,
    },
    checkboxLabel: {
      fontSize: 14,
      color: '#333',
    },
    submitButton: {
      backgroundColor: '#000',
      paddingVertical: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    link: {
      marginTop: 20,
      alignItems: 'center',
    },
    linkText: {
      color: '#000',
      textDecorationLine: 'underline',
    },
    googleContainer:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    googleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'black', 
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 30,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    googleLogo: {
      width: 24, 
      height: 24, 
      marginRight: 10
    },
    googleButtonText: {
      color: '#fff',
      fontFamily: 'LexendDeca',
      fontStyle: 'normal',
    },
  });
export default styles;