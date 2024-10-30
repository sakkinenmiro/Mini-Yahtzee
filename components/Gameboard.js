import React, { useState, useEffect } from "react";
import { Text, View, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from '../style/style';
import Header from './Header';
import Footer from './Footer';

import {
    NBR_OF_DICES,
    NBR_OF_THROWS,
    MIN_SPOT,
    MAX_SPOT,
    BONUS_POINTS_LIMIT,
    BONUS_POINTS} from '../constants/Game';


let board = [];
let nbrSum = [0, 0, 0, 0, 0, 0];
let nbrSelectPossible = false;
let diceSelectPossible = false;
let throwPossible = true;
let getBonus = false;
let gameOver = false;

const BONUS = 35;

export default function Gameboard() {

    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [sum, setSum] = useState(0);
    const [status, setStatus] = useState('Throw dices');
    const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));
    const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0));


    const row = [];
    for (let i = 0; i < NBR_OF_DICES; i++) {
        row.push(
            <Pressable
                key={"row" + i}
                onPress={() => selectDice(i)}
            >
                <MaterialCommunityIcons
                    name={board[i]}
                    key={"row" + i}
                    size={50}
                    color={selectedDices[i] ? "black" : "steelblue"}
                />
            </Pressable>
        );
    }

    function selectDice(i) {
        if (diceSelectPossible) {
            let dices = [...selectedDices];
            dices[i] = selectedDices[i] ? false : true;
            setSelectedDices(dices);
        } else (
            setStatus("You have to throw dices first.")
        )
    }

    function throwDices() {
        if (throwPossible && !gameOver) {
            for (let i = 0; i < NBR_OF_DICES; i++) {
                if (!selectedDices[i]) {
                    let randomNumber = Math.floor(Math.random() * 6 + 1);
                    board[i] = 'dice-' + randomNumber;
                }
            }
            setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
        } else if (gameOver) {
            newGame();
        }
    }

    const nbrRow = [];
    for (let i = 0; i < 6; i++) {
        nbrRow.push(
            <View style={styles.numbers} key={"nbrRow" + i}>
                <Text style={styles.nbrSum}>{nbrSum[i]}</Text>
                <Pressable
                    key={"nbrRow" + i}
                    onPress={() => useNbr(i)}
                >
                    <MaterialCommunityIcons
                        name={'numeric-' + (i + 1) + '-circle'}
                        key={"nbrRow" + i}
                        size={50}
                        color={diceSpots[i] ? "black" : "steelblue"}
                    />
                </Pressable>
            </View>
        );
    }

    function useNbr(i) {
        let nbrs = [...diceSpots];
        if (nbrSelectPossible && !nbrs[i]) {
            nbrs[i] = true;
            setDiceSpots(nbrs);
            var tempSum = 0;
            for (let x = 0; x < row.length; x++) {
                var diceVal = parseInt(board[x].match(/(\d+)/)[0]);
                if (diceVal - 1 == i) {
                    tempSum += diceVal;
                }
            }
            nbrSum[i] = tempSum;
            setSum(sum + parseInt(tempSum));
            setSelectedDices(new Array(NBR_OF_DICES).fill(false));
            setNbrOfThrowsLeft(3);
        } else if (nbrs[i]) {
            setStatus("You already selected points for " + (i + 1));
        }
    }

    useEffect(() => {
        if (nbrOfThrowsLeft === 0) {
            setStatus('Select a number.');
            throwPossible = false;
            nbrSelectPossible = true;
        } else if (nbrOfThrowsLeft < NBR_OF_THROWS) {
            setStatus('Throw again or select a number');
            throwPossible = true;
            nbrSelectPossible = true;
            diceSelectPossible = true;
        } else if (nbrOfThrowsLeft === NBR_OF_THROWS && !diceSpots.every(x => x === true)) {
            setStatus('Throw the dices.');
            throwPossible = true;
            nbrSelectPossible = false;
            diceSelectPossible = false;
        } else if (nbrOfThrowsLeft === NBR_OF_THROWS && diceSpots.every(x => x === true)) {
            setStatus('Game over! All points selected.');
            throwPossible = false;
            diceSelectPossible = false;
            nbrSelectPossible = false;
            gameOver = true;
        }
    }, [nbrOfThrowsLeft]);

    function checkBonus() {
        if (sum >= BONUS_POINTS_LIMIT) {
            getBonus = true;
            return ("You got the Bonus!")
        } else {
            return ("You are " + (BONUS_POINTS_LIMIT - sum) + " points away from bonus.");
        }
    }

    function newGame() {
        gameOver = false;
        setSum(0);
        setDiceSpots(new Array(6).fill(false));
        nbrSum = [0, 0, 0, 0, 0, 0];
        setNbrOfThrowsLeft(3);
        nbrSelectPossible = true;
        diceSelectPossible = true;
        throwPossible = true;
        getBonus = false;
        throwDices();
    }

    return(
        <>
        <Header />
        <View style={styles.gameboard}>
            <View style={[styles.flex, styles.dropShadow]}>{row}</View>
            <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
            <Text style={styles.gameinfo}>{status}</Text>
            <Pressable style={[styles.button, styles.dropShadow]}
                onPress={() => throwDices()}>
                <Text style={styles.buttonText}>
                    {gameOver ? 'New Game' : 'Throw dices'}
                </Text>
            </Pressable>
            <Text style={[styles.gameinfo, styles.gamevalue]}>Total: {getBonus ? (sum + BONUS_POINTS) : sum }</Text>
            <Text style={styles.gameinfo}>{checkBonus()}</Text>
            <View style={[styles.flex, styles.dropShadow]}>{nbrRow}</View>
        </View>
        <Footer />
        </>
    )
};