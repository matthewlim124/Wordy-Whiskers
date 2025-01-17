import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import cat from '@/assets/images/cat.jpg';
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
  try{
    const value = await AsyncStorage.getItem(key);
    return value;
  }catch(e) {
    console.log("Error getting data from key");
  }
};

let token = '';
let username = '';


function GameScreen() {
    const navigation = useNavigation();
    const [answer, setAnswer] = useState('');
    const [words, setWords] = useState([]);
    const [playerName, setPlayerName] = useState('');
    const [playerId, setPlayerId] = useState('');
    const [playerScore, setPlayerScore] = useState('0');
    const [correctAnswers, setCorrectAnswers] = useState('0');

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        
        loadPlayerData();
      });
      
        
      generateSentence();
      return unsubscribe;

    }, [navigation]);

    const loadPlayerData = async () => {
        try {
            token = await getItemFromAsyncStorage('token');
            username = await getItemFromAsyncStorage('usr');

            const response = await fetch('https://silent-oxide-441601-r2.et.r.appspot.com/api/player/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.length == 0) {
                    await createPlayer(username, token);
                    return;
                }
                setPlayerName(data[0].playername);
                setPlayerScore(data[0].score);
                setPlayerId(data[0].player_id);
                setCorrectAnswers(data[0].correct_ans);
            } else {
                handleError('Failed to load player data');
            }
        } catch (err) {
            handleError('Error loading player data', err);
        }
    };

    const createPlayer = async (username, token) => {
        try {
            token = await getItemFromAsyncStorage('token');
            username = await getItemFromAsyncStorage('usr');
            const response = await fetch('https://silent-oxide-441601-r2.et.r.appspot.com/api/player/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ playername: username }),
            });

            if (!response.ok) {
                handleError('Failed to create player');
            }
        } catch (err) {
            handleError('Error creating player', err);
        }
    };

    const generateSentence = () => {
        const newWords = [];
        newWords.push(getRandomWord(pronoun));
        newWords.push(getRandomWord(verb));
        newWords.push(getRandomWord(noun));
        setWords(newWords);
    };

    const getRandomWord = (wordList) => {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        return wordList[randomIndex];
    };

    const handleCheckAnswer = async () => {
        if (!answer) {
            Alert.alert('Please enter your answer.');
            return;
        }

        try {
            token = await getItemFromAsyncStorage('token');
            username = await getItemFromAsyncStorage('usr');
            const response = await fetch('https://silent-oxide-441601-r2.et.r.appspot.com/api/player/checkGrammar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ text: answer }),
            });

            if (response.ok) {
                const data = await response.json();
                Alert.alert(`Sentence graded! Answer: ${data}`);
                await updateScore(answer, data);
                generateSentence();
                setAnswer('');
            } else {
                handleError('Failed to check answer');
            }
        } catch (err) {
            handleError('Error checking answer', err);
        }
    };

    const handleNextQuestion = () => {
        generateSentence();
        setAnswer('');
    };

    const updateScore = async (sentence, aiChecked) => {
        
        const words = sentence.toLowerCase().split(' ');
        const correctWords = aiChecked.toLowerCase().split(' ');
        let newScore = playerScore;
        let newCorrectAnswers = correctAnswers;
        let currentPlayerId = playerId;

        words.forEach((word, index) => {
            if (word === correctWords[index]) {
                newScore++;
            }
        });

        if (newScore >= playerScore + correctWords.length - 1) {
            newCorrectAnswers++;
        }

        try {
            token = await getItemFromAsyncStorage('token');
            username = await getItemFromAsyncStorage('usr');
            
            const response = await fetch(`https://silent-oxide-441601-r2.et.r.appspot.com/api/player/${currentPlayerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    playername: playerName,
                    score: newScore.toString(),
                    correct_ans: newCorrectAnswers.toString(),
                }),
            });

            if (response.ok) {
                setPlayerScore(newScore);
                setCorrectAnswers(newCorrectAnswers);
            } else {
                handleError('Failed to update score');
            }
        } catch (err) {
            handleError('Error updating score', err);
        }
    };

    const handleError = async (message, err = null) => {
        console.error(message, err);
        Alert.alert(message);
        await refreshToken();
    };

    const refreshToken = async () => {
        try {
            username = await getItemFromAsyncStorage('usr');
            const response = await fetch('https://silent-oxide-441601-r2.et.r.appspot.com/api/user/refresh', {
                method: 'POST',
                credentials: 'include',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });

            if (response.ok) {
                const data = await response.json();
                await setItemToAsyncStorage('token', data.accessToken);
                Alert.alert('Token refreshed successfully, please try again!');
            } else {
                handleError('Failed to refresh token');
            }
        } catch (err) {
            handleError('Error refreshing token', err);
        }
    };

    return (
        <ImageBackground source={cat} style={styles.backgroundImage}>
            <View style={styles.container}>
                <View style={styles.playerInfoContainer}>
                    <Text style={styles.playerInfo}>Player Name: {playerName}</Text>
                    <Text style={styles.playerInfo}>Score: {playerScore}</Text>
                    <Text style={styles.playerInfo}>Correct Answers: {correctAnswers}</Text>
                </View>
                <Text style={styles.title}>Form a coherent sentence!</Text>
                <View style={styles.sentenceBox}>
                    {words.map((word, index) => (
                        <Text key={index} style={styles.word}>
                            {word}
                        </Text>
                    ))}
                </View>
                <Text style={styles.prompt}>Type your answer</Text>
                <TextInput
                    style={styles.answerInput}
                    value={answer}
                    onChangeText={setAnswer}
                    placeholder="Enter your answer here"
                    placeholderTextColor="#696969"
                />
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleCheckAnswer}>
                        <Text style={styles.buttonText}>Check Answer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleNextQuestion}>
                        <Text style={styles.buttonText}>Next Question</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.navigationButtonsContainer}>
                    <TouchableOpacity
                        style={styles.navigationButton}
                        onPress={() => navigation.navigate('rules')}
                    >
                        <Text style={styles.navigationButtonText}>Rules</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 16,
        fontFamily: 'Press2P',
        marginBottom: 20,
        textAlign: 'center',
    },
    sentenceBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        
    },
    word: {
        fontSize: 13,
        fontFamily: 'Press2P',
        marginHorizontal: 5,
        marginVertical: 5,
    },
    prompt: {
        fontSize: 15,
        fontFamily: 'Press2P',
        marginBottom: 10,
    },
    answerInput: {
        borderWidth: 2,
        borderColor: '#555555',
        padding: 10,
        borderRadius: 5,
        fontSize: 10,
        fontFamily: 'Press2P',
        width: '80%',
        marginBottom: 20,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
        marginBottom: 20,
    },
    button: {
        backgroundColor: 'skyblue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 8,
        fontFamily: 'Press2P',
    },
    playerInfoContainer: {
        marginBottom: 30,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
        color: 'white',
        padding: 10,
        borderRadius: 5,
        fontSize: 18,
        zIndex: 1000, 
    },
    playerInfo: {
        fontSize: 13,
        color: 'white',
        fontFamily: 'Press2P', 
        marginBottom: 5,

    },
    navigationButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
        marginTop: 20,
    },
    navigationButton: {
        backgroundColor: 'green',
        
        justifyContent: 'center',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    navigationButtonText: {
        color: '#fff',
        fontSize: 10,
        fontFamily: 'Press2P',
    },
});

const pronoun = ['he', 'she', 'it', 'they', 'we', 'you', 'i'];
const noun = [
    'apple',
    'banana',
    'car',
    'dog',
    'elephant',
    'flower',
    'guitar',
    'house',
    'island',
    'jacket',
    'kite',
    'lamp',
    'mountain',
    'notebook',
    'ocean',
    'pencil',
    'queen',
    'river',
    'sun',
    'tree',
    'umbrella',
    'vase',
    'whale',
    'xylophone',
    'yacht',
    'zebra',
    'book',
    'chair',
    'desk',
    'engine',
    'forest',
    'glass',
    'hat',
    'ice',
    'jungle',
    'key',
    'lion',
    'moon',
    'necklace',
    'orange',
    'phone',
    'quilt',
    'road',
    'sand',
    'turtle',
    'violin',
    'window',
    'yarn',
    'zoo',
    'bottle',
    'coin',
    'sun',
    'ocean',
    'mountain',
    'tree',
    'computer',
    'school',
    'house',
    'movie',
    'garden',
    'flower',
    'music',
    'phone',
    'table',
    'teacher',
    'country',
    'bread',
    'family',
    'city',
    'road',
    'river',
    'lake',
];
const verb = [
    'open',
    'close',
    'read',
    'sit',
    'move',
    'start',
    'climb',
    'break',
    'build',
    'draw',
    'carry',
    'see',
    'find',
    'lift',
    'watch',
    'throw',
    'catch',
    'ride',
    'shine',
    'cover',
    'fill',
    'shake',
    'hold',
    'touch',
    'drop',
    'take',
];

export default GameScreen;