import * as path from "path";
import readInput, { InputMode } from "../helpers/readInput";

const dist = (a: [number, number], b: [number, number]): number => {
    return Math.abs((b[0] - a[0])) + Math.abs((b[1] - a[1]));
}

const solve = (input: string[][], scale: number) => {
    const emptyRows = [];
    for (let i = 0; i < input.length; i++) {
        if (!input[i].includes("#")) {
            emptyRows.push(i);
        }
    }
    const emptyCols = [];
    for (let i = 0; i < input[0].length; i++) {
        if (!input.map(l => l[i]).includes("#")) {
            emptyCols.push(i);
        }
    }

    const galaxyPositions: [number, number][] = [];

    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[0].length; j++) {
            if (input[i][j] === "#") galaxyPositions.push([i, j]);
        }
    }

    for (let i = 0; i < emptyRows.length; i++) {
        for (const pos of galaxyPositions) {
            if (pos[0] > emptyRows[i]) {
                pos[0] += scale - 1;
            }
        }
        for (let j = i + 1; j < emptyRows.length; j++) {
            emptyRows[j] += scale - 1;
        }
    }

    for (let i = 0; i < emptyCols.length; i++) {
        for (const pos of galaxyPositions) {
            if (pos[1] > emptyCols[i]) {
                pos[1] += scale - 1;
            }
        }
        for (let j = i; j < emptyCols.length; j++) {
            emptyCols[j] += scale - 1;
        }
    }

    let sum = 0;

    for (let i = 0; i < galaxyPositions.length; i++) {
        for (let j = i + 1; j < galaxyPositions.length; j++) {
            sum += dist(galaxyPositions[i], galaxyPositions[j]);
        }
    }

    return sum;
}

const part1 = (input: string[][]) => {
    return solve(input, 2);
};

const part2 = (input: string[][]) => {
    return solve(input, 1_000_000);
};

const main = async () => {
    const input = await readInput(path.join(__dirname, "./input.txt"), InputMode.Grid);

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
