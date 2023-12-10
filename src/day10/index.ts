import * as path from "path";
import readInput, { InputMode } from "../helpers/readInput";
import { displayGridFuncConfig } from "../helpers/displayGrid";

const getDistances = (input: string[][]) => {
    const distances: Record<string, number> = {};
    let queue: string[] = [];

    const startingRow = input.findIndex(l => l.includes("S"));
    const startingCol = input[startingRow].indexOf("S");

    distances[`${startingRow}|${startingCol}`] = 0;

    if (startingRow > 0 && ["|", "F", "7"].includes(input[startingRow - 1][startingCol])) {
        queue.push(`${startingRow - 1}|${startingCol}`);
    }
    if (["|", "J", "L"].includes(input[startingRow + 1][startingCol])) {
        queue.push(`${startingRow + 1}|${startingCol}`);
    }
    if (startingCol > 0 && ["-", "F", "L"].includes(input[startingRow][startingCol - 1])) {
        queue.push(`${startingRow}|${startingCol - 1}`);
    }
    if (["-", "J", "7"].includes(input[startingRow][startingCol + 1])) {
        queue.push(`${startingRow}|${startingCol + 1}`);
    }

    let dist = 0;
    while (queue.length) {
        dist++;
        let newQueue = [];
        for (const raw of queue) {
            distances[raw] = dist;

            const pos = raw.split("|").map(Number) as [number, number];
            const loc = input[pos[0]][pos[1]];

            const adj = [];
            switch (loc) {
                case "|":
                    adj.push([pos[0] - 1, pos[1]]);
                    adj.push([pos[0] + 1, pos[1]]);
                    break;
                case "-":
                    adj.push([pos[0], pos[1] - 1]);
                    adj.push([pos[0], pos[1] + 1]);
                    break;
                case "L":
                    adj.push([pos[0] - 1, pos[1]]);
                    adj.push([pos[0], pos[1] + 1]);
                    break;
                case "J":
                    adj.push([pos[0] - 1, pos[1]]);
                    adj.push([pos[0], pos[1] - 1]);
                    break;
                case "7":
                    adj.push([pos[0] + 1, pos[1]]);
                    adj.push([pos[0], pos[1] - 1]);
                    break;
                case "F":
                    adj.push([pos[0] + 1, pos[1]]);
                    adj.push([pos[0], pos[1] + 1]);
                    break;
                case "S":
                    break;
            }
            const filtered = adj.filter(l => !(`${l[0]}|${l[1]}` in distances));

            newQueue.push(...filtered.map(l => `${l[0]}|${l[1]}`));
        }
        queue = newQueue;
    }

    return distances;
}

const part1 = (input: string[][]) => {
    const distances = getDistances(input);

    return Math.max(...Object.values(distances));
};

const part2 = (input: string[][]) => {
    const distances = getDistances(input);

    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            if (!(`${i}|${j}` in distances)) {
                input[i][j] = ".";
            }
        }
    }

    const scaledUpInput = Array(input.length * 2).fill([]).map(() => Array(input[0].length * 2).fill(".").map(() => "."));

    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            const char = input[i][j];
            scaledUpInput[i * 2][j * 2] = char;

            if (["-", "F", "L"].includes(char)) {
                if (["-", "7", "J"].includes(input[i][j + 1])) {
                    scaledUpInput[i * 2][j * 2 + 1] = "-";
                }
            }
            if (["-", "7", "J"].includes(char)) {
                if (["-", "L", "F"].includes(input[i][j - 1])) {
                    scaledUpInput[i * 2][j * 2 - 1] = "-";
                }
            }
            if ("|JL".includes(char)  && i > 0) {
                if (["|", "7", "F"].includes(input[i - 1][j])) {
                    scaledUpInput[i * 2 - 1][j * 2] = "|";
                }
            }
            if ("|7F".includes(char) && i < input.length - 1) {
                if (["|", "L", "J"].includes(input[i + 1][j])) {
                    scaledUpInput[i * 2 + 1][j * 2] = "|";
                }
            }
        }
    }

    const startingRow = input.findIndex(l => l.includes("S")) * 2;
    const startingCol = input[startingRow / 2].indexOf("S") * 2;

    if (startingRow > 1 && ["|", "F", "7"].includes(scaledUpInput[startingRow - 2][startingCol])) {
        scaledUpInput[startingRow - 1][startingCol] = "|";
    }
    if (["|", "J", "L"].includes(scaledUpInput[startingRow + 2][startingCol])) {
        scaledUpInput[startingRow + 1][startingCol] = "|";
    }
    if (startingCol > 1 && ["-", "F", "L"].includes(scaledUpInput[startingRow][startingCol - 2])) {
        scaledUpInput[startingRow][startingCol - 1] = "-";
    }
    if (["-", "J", "7"].includes(scaledUpInput[startingRow][startingCol + 2])) {
        scaledUpInput[startingRow][startingCol + 1] = "-";
    }

    let filled = new Set<string>();
    let queue = new Set<string>();

    for (let i = 0; i < scaledUpInput.length; i++) {
        if (scaledUpInput[i][0] === ".") {
            queue.add(`${i}|${0}`);
        }
        if (scaledUpInput[i][scaledUpInput[i].length - 1] === ".") {
            queue.add(`${i}|${scaledUpInput[i].length - 1}`);
        }
    }

    for (let i = 0; i < scaledUpInput[0].length; i++) {
        if (scaledUpInput[0][i] === ".") {
            queue.add(`${0}|${i}`);
        }
        if (scaledUpInput[scaledUpInput.length - 1][i] === ".") {
            queue.add(`${scaledUpInput.length - 1}|${i}`);
        }
    }

    while (queue.size) {
        const newQueue = new Set<string>();

        for (const item of queue) {
            const split = item.split("|").map(Number) as [number, number];
            if (split[0] > 0) {
                newQueue.add(`${split[0] - 1}|${split[1]}`);
            }
            if (split[1] > 0) {
                newQueue.add(`${split[0]}|${split[1] - 1}`);
            }
            if (split[0] < scaledUpInput.length - 1) {
                newQueue.add(`${split[0] + 1}|${split[1]}`);
            }
            if (split[1] < scaledUpInput[0].length - 1) {
                newQueue.add(`${split[0]}|${split[1] + 1}`);
            }
        }

        const filteredQueue = [...newQueue].filter(l => !filled.has(l)).filter(l => {
            const split = l.split("|").map(Number);
            return scaledUpInput[split[0]][split[1]] === ".";
        });
        for (const val of queue) {
            filled.add(val);
        }
        queue = new Set(filteredQueue);
    }

    for (const thing of filled) {
        const split = thing.split("|").map(Number);
        scaledUpInput[split[0]][split[1]] = "0";
    }

    let empty = 0;

    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            if (scaledUpInput[i * 2][j * 2] === ".") {
                empty++;
                input[i][j] = "0";
            }
        }
    }

    return empty;
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
