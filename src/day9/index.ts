import * as path from "path";
import readInput, { InputMode } from "../helpers/readInput";

const extrapolate = (input: number[]) => {
    const differences: number[][] = [input];
    while (true) {
        const lastRow = differences[differences.length - 1];
        const newDiffs = [];
        for (let i = 1; i < lastRow.length; i++) {
            newDiffs.push(lastRow[i] - lastRow[i - 1]);
        }
        differences.push(newDiffs);
        if (newDiffs.every(l => l === 0)) break;
    }

    const extrapolated = [0];
    for (let i = differences.length - 2; i >= 0; i--) {
        extrapolated.push(differences[i][differences[i].length - 1] + extrapolated[extrapolated.length - 1]);
    }

    return extrapolated[extrapolated.length - 1];
}

const extrapolateBeginning = (input: number[]) => {
    const differences: number[][] = [input];
    while (true) {
        const lastRow = differences[differences.length - 1];
        const newDiffs = [];
        for (let i = 1; i < lastRow.length; i++) {
            newDiffs.push(lastRow[i] - lastRow[i - 1]);
        }
        differences.push(newDiffs);
        if (newDiffs.every(l => l === 0)) break;
    }

    const extrapolated = [0];
    for (let i = differences.length - 2; i >= 0; i--) {
        extrapolated.push(differences[i][0] - extrapolated[extrapolated.length - 1]);
    }

    return extrapolated[extrapolated.length - 1];
}

const part1 = (input: number[][]) => {
    return input.reduce((acc, cur) => acc + extrapolate(cur), 0);
};

const part2 = (input: number[][]) => {
    return input.reduce((acc, cur) => acc + extrapolateBeginning(cur), 0);
};

const main = async () => {
    const input = await readInput(path.join(__dirname, "./input.txt"), InputMode.Split);
    const parsed = input.map(l => l.split(" ").map(Number));

    console.time("part1");

    console.log(part1(parsed));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(parsed));

    console.timeEnd("part2");
};

main();
