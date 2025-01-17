import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ImageBackground } from 'react-native';
import cat from "@/assets/images/cat.jpg";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const setItemToAsyncStorage = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        console.error('Error saving data to AsyncStorage', e);
    }
};

const getItemFromAsyncStorage = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch (e) {
        console.error("Error getting data from AsyncStorage", e);
    }
};

function LeaderboardScreen() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const navigation = useNavigation();
    
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
        
            fetchLeaderboardData()
          });
        return unsubscribe;
    }, []);

    const fetchLeaderboardData = async () => {
        try {
            const token = await getItemFromAsyncStorage('token');

            const response = await fetch('https://silent-oxide-441601-r2.et.r.appspot.com/api/player/allplayer', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const sortedData = data.sort((a, b) => b.score - a.score);
                setLeaderboardData(sortedData);
            } else {
                console.error('Failed to load player data');
            }
        } catch (error) {
            console.error('Error fetching leaderboard data:', error);
        }
    };

    const renderHeader = () => (
        <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { flex: 1 }]}>Rank</Text>
            <Text style={[styles.headerCell, { flex: 2 }]}>Username</Text>
            <Text style={[styles.headerCell, { flex: 2 }]}>Playername</Text>
            <Text style={[styles.headerCell, { flex: 1 }]}>Score</Text>
        </View>
    );

    const renderItem = ({ item, index }) => (
        <View style={styles.tableRow}>
            <Text style={[styles.cell, { flex: 1 }]}>{index + 1}</Text>
            <Text style={[styles.cell, { flex: 2 }]}>{item.user.username}</Text>
            <Text style={[styles.cell, { flex: 2 }]}>{item.playername}</Text>
            <Text style={[styles.cell, { flex: 1 }]}>{item.score}</Text>
        </View>
    );

    return (
        <ImageBackground source={cat} style={styles.backgroundImage}>
            <View style={styles.container}>
                <Text style={styles.title}>Leaderboard</Text>
                <FlatList
                    data={leaderboardData}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.list}
                    ListHeaderComponent={renderHeader}
                />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        marginTop: 20,
        fontFamily: 'Press2P',
        color: 'white',
    },
    list: {
        width: '100%',
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headerCell: {
        color: 'white',
        fontSize: 8,
        fontFamily: 'Press2P',
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    cell: {
        color: 'white',
        fontSize: 13,
        fontFamily: 'Press2P',
        textAlign: 'center',
    },
});

export default LeaderboardScreen;
