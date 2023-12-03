import * as path from "path";
import readInput, { InputMode } from "../helpers/readInput";

const symbols = ["*", "&", "@", "$", "+", "#", "-", "/", "=", "%", ]

const part1 = (input: string[][]) => {
    const joined = input.map(l => l.join("")).join("");

    const matches = [...joined.matchAll(/[0-9]+/g)];

    let sum = 0;

    for (const match of matches) {
        const y = Math.floor(match.index! / input.length);
        const x = match.index! % input[0].length;

        let worked = false;

        for (let i = Math.max(x - 1, 0); i <= Math.min(x + match[0].length, input[0].length - 1); i++) {
            for (let j = Math.max(y - 1, 0); j <= Math.min(y + 1, input.length - 1); j++) {
                if (symbols.includes(input[j][i])) {
                    worked = true;
                    break;
                }
            }
        }

        if (worked) sum += Number(match[0]);
    }

    return sum;
};

const part2 = (input: string[][]) => {
    const joined = input.map(l => l.join("")).join("");

    const matches = [...joined.matchAll(/[0-9]+/g)];

    const gearObj: Record<string, number[]> = {};

    for (const match of matches) {
        const y = Math.floor(match.index! / input.length);
        const x = match.index! % input[0].length;

        for (let i = Math.max(x - 1, 0); i <= Math.min(x + match[0].length, input[0].length - 1); i++) {
            for (let j = Math.max(y - 1, 0); j <= Math.min(y + 1, input.length - 1); j++) {
                if (input[j][i] === "*") {
                    const str = `${j}|${i}`;
                    if (str in gearObj) {
                        gearObj[str].push(Number(match[0]));
                    } else {
                        gearObj[str] = [Number(match[0])];
                    }
                }
            }
        }
    }

    return Object.values(gearObj).filter(l => l.length === 2).reduce((acc, cur) => acc + (cur[0] * cur[1]), 0);
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
