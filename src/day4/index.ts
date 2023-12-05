import * as path from "path";
import readInput, { InputMode } from "../helpers/readInput";

type Card = {
    winning: number[];
    numbers: number[];
}

const part1 = (input: string[]) => {
    const nums = input.map(l => l.split(": ")[1]);
    const parsed = nums.map(l => {
        const res: Card = {
            winning: [],
            numbers: []
        };
        const split = l.split(" | ");
        res.winning = split[0].split(" ").filter(Boolean).map(Number);
        res.numbers = split[1].split(" ").filter(Boolean).map(Number);
        return res;
    });

    let sum = 0;

    for (const card of parsed) {
        let miniSum = 0;
        for (const num of card.numbers) {
            if (card.winning.includes(num)) {
                if (miniSum) { miniSum *= 2 } else { miniSum = 1; }
            }
        }
        sum += miniSum;
    }

    return sum;
};

const getCardWinArr = (cards: Card[], card: Card, cardIdx: number) => {
    let wins = 0;
    for (const num of card.numbers) {
        if (card.winning.includes(num)) {
            wins++;
        }
    }

    let res: Record<number, number> = {};

    for (let i = 0; i < wins; i++) {
        res[cardIdx + i + 1] = 1;
    }

    for (let i = 0; i < wins; i++) {
        const winArr = getCardWinArr(cards, cards[cardIdx + i + 1], cardIdx + i + 1);
        for (const i in winArr) {
            if (i in res) {
                res[i] += winArr[i];
            } else {
                res[i] = winArr[i];
            }
        }
    }

    return res;
}

const part2 = (input: string[]) => {
    const nums = input.map(l => l.split(": ")[1]);
    const cards = nums.map(l => {
        const res: Card = {
            winning: [],
            numbers: []
        };
        const split = l.split(" | ");
        res.winning = split[0].split(" ").filter(Boolean).map(Number);
        res.numbers = split[1].split(" ").filter(Boolean).map(Number);
        return res;
    });

    const res: Record<number, number> = {};
    for (let i = 0; i < cards.length; i++) {
        const arr = getCardWinArr(cards, cards[i], i);
        for (const j in arr) {
            if (j in res) { res[j] += arr[j] } else { res[j] = arr[j]; }
        }
        if (i in res) { res[i] += 1 } else { res[i] = 1; }
    }

    return Object.values(res).reduce((acc, cur) => acc + cur);
};

const main = async () => {
    const input = await readInput(path.join(__dirname, "./input.txt"), InputMode.Split);

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
