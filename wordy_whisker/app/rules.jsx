import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions } from 'react-native';
import cat from '@/assets/images/cat.jpg';

function RulesScreen() {
    return (
        <ImageBackground source={cat} style={styles.backgroundImage}>
            <View style={styles.container}>
                <View style={styles.rulesPage}>
                <Text style={styles.title}>RULES</Text>
                <View style={styles.rulesList}>
                    <Text style={styles.rule}>
                        1. You will be given three random words (pronoun, verb, and a noun).
                    </Text>
                    <Text style={styles.rule}>2. Form a sentence using those three words.</Text>
                    <Text style={styles.rule}>
                        3. Feel free to add extra words like nouns if you think it is necessary.
                    </Text>
                    <Text style={styles.rule}>
                        4. Remember to conjugate verbs or pay attention to pronouns based on subject or
                        object (he, his).
                    </Text>
                    <Text style={styles.rule}>
                        5. Your sentence will be graded by AI and the more similar your answer is the
                        more points you will get.
                    </Text>
                    <Text style={styles.rule}>
                        6. Pay attention to punctuation marks like dot, comma, and so on.
                    </Text>
                </View>
                <Text style={styles.goodLuck}>Good Luck!</Text>
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
    rulesPage: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'black', 
        borderRadius: 10,
        backgroundColor: 'skyblue',
        padding: 20,
        fontFamily: 'Press Start 2P', 
        width: Dimensions.get('window').width * 0.8, 
        maxHeight: Dimensions.get('window').height * 0.8,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Press2P',
        marginBottom: 20,
        textAlign: 'center',
        
    },
    rulesList: {
        width: '80%',
    },
    rule: {
        fontSize: 10,
        fontFamily: 'Press2P',
        color: 'white',
        marginVertical: 5,
    },
    goodLuck: {
        fontSize: 16,
        marginTop: 20,
        fontFamily: 'Press2P',
        textAlign: 'center',
    },
});

export default RulesScreen;