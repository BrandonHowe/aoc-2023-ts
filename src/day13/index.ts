import * as path from "path";
import readInput, { InputMode } from "../helpers/readInput";
import { displayGridFuncConfig } from "../helpers/displayGrid";

const arrEqual = <T>(a: T[], b: T[]) => a.length === b.length && a.every((l, idx) => l === b[idx]);

const findReflections = (grid: string[][], oldRow?: number, oldCol?: number) => {
    let sum = 0;
    for (let i = 0; i < grid.length - 1; i++) {
        let passed = true;
        let rad = 0;
        while (i + 1 + rad < grid.length && i - rad >= 0) {
            if (!arrEqual(grid[i - rad], grid[i + 1 + rad])) passed = false;
            rad++;
        }
        if (passed && i !== oldRow) {
            sum += 100 * (i + 1);
        }
    }
    for (let i = 0; i < grid[0].length - 1; i++) {
        let passed = true;
        let rad = 0;
        while (i + 1 + rad < grid[0].length && i - rad >= 0) {
            if (!arrEqual(grid.map(l => l[i - rad]), grid.map(l => l[i + 1 + rad]))) passed = false;
            rad++;
        }
        if (passed && i !== oldCol) {
            sum += (i + 1);
        }
    }
    return sum;
}

const part1 = (input: string[][][]) => {
    return input.reduce((acc, cur) => acc + findReflections(cur), 0);
};

const part2 = (input: string[][][]) => {
    let sum = 0;
    for (const grid of input) {
        const score = findReflections(grid);
        mainLoop: for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                const clonedGrid = [...grid].map(l => [...l]);
                clonedGrid[i][j] = clonedGrid[i][j] === "#" ? "." : "#";
                const newScore = findReflections(clonedGrid, Math.floor(score / 100) - 1, score % 100 - 1);
                if (score !== newScore && newScore > 0) {
                    grid[i][j] = clonedGrid[i][j];
                    sum += Math.abs(newScore);
                    break mainLoop;
                }
            }
        }
    }
    return sum;
};

const main = async () => {
    const input = (await readInput(path.join(__dirname, "./input.txt"), InputMode.Raw)).trim();
    const split = input.split("\n\n");
    const grids = split.map(l => l.split("\n").map(j => j.split("")));

    console.time("part1");

    console.log(part1(grids));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(grids));

    console.timeEnd("part2");
};

main();
