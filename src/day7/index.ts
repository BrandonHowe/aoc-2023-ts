import * as path from "path";
import readInput, { InputMode } from "../helpers/readInput";

interface Play {
    hand: number[];
    bid: number;
}

enum HandType {
    FiveOfAKind = 1,
    FourOfAKind = 2,
    FullHouse = 3,
    ThreeOfAKind = 4,
    TwoPair = 5,
    OnePair = 6,
    HighCard = 7,
}

const getHandType = (hand: number[]) => {
    const first = hand[0];
    const second = hand[1];
    const uniqueCards = new Set(hand);
    if (uniqueCards.size === 5) return HandType.HighCard;
    if (uniqueCards.size === 4) return HandType.OnePair;
    if (hand.every(l => l === first)) return HandType.FiveOfAKind;
    if (hand.filter(l => l === first).length === 4 || hand.filter(l => l === second).length === 4) return HandType.FourOfAKind;
    if (uniqueCards.size === 2) return HandType.FullHouse;
    if (uniqueCards.size === 3 && [...uniqueCards].some(l => hand.filter(j => j === l).length === 3)) return HandType.ThreeOfAKind;
    if (uniqueCards.size === 3 && [...uniqueCards].filter(l => hand.filter(j => j === l).length === 2).length === 2) return HandType.TwoPair;
    throw "Hand type failed";
}

const getHandType2 = (hand: number[]) => {
    let maxOption = 0;
    let maxOptionVal = Infinity;

    for (let i = 1; i <= 14; i++) {
        if (i === 11) continue;
        const score = getHandType(hand.map(l => l === 11 ? i : l));
        if (score < maxOptionVal) {
            maxOptionVal = score;
            maxOption = i;
        }
    }

    return maxOptionVal;
}

const part1 = (input: Play[]) => {
    const sorted = input.sort((a, b) => {
        const aType = getHandType(a.hand);
        const bType = getHandType(b.hand);
        if (aType === bType) {
            for (let i = 0; i < a.hand.length; i++) {
                if (a.hand[i] > b.hand[i]) return -1;
                if (b.hand[i] > a.hand[i]) return 1;
            }
            return 0;
        } else {
            return aType - bType;
        }
    });

    sorted.reverse();

    let sum = 0;
    for (let i = 0; i < sorted.length; i++) {
        sum += sorted[i].bid * (i + 1);
    }

    return sum;
};

const part2 = (input: Play[]) => {
    const sorted = input.sort((a, b) => {
        const aType = getHandType2(a.hand);
        const bType = getHandType2(b.hand);
        const modifiedHandA = a.hand.map(l => l === 11 ? -1 : l);
        const modifiedHandB = b.hand.map(l => l === 11 ? -1 : l);
        if (aType === bType) {
            for (let i = 0; i < a.hand.length; i++) {
                if (modifiedHandA[i] > modifiedHandB[i]) return -1;
                if (modifiedHandB[i] > modifiedHandA[i]) return 1;
            }
            return 0;
        } else {
            return aType - bType;
        }
    });

    sorted.reverse();

    let sum = 0;
    for (let i = 0; i < sorted.length; i++) {
        sum += sorted[i].bid * (i + 1);
    }

    return sum;
};

const faceCardObj: Record<string, number> = {
    T: 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14
}

const main = async () => {
    const input = await readInput(path.join(__dirname, "./input.txt"), InputMode.Split);
    const parsed = input.map(l => {
        const split = l.split(" ");
        const hand = split[0].split("").map(j => faceCardObj[j] || Number(j));
        const bid = Number(split[1]);
        return { hand, bid };
    });

    console.time("part1");

    console.log(part1(parsed));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(parsed));

    console.timeEnd("part2");
};

main();
