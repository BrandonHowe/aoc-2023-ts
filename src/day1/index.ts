import * as path from "path";
import readInput, { InputMode } from "../helpers/readInput";

const part1 = (input: string[]) => {
    return input.reduce((acc, cur) => {
        const splitStr = cur.split("");
        const first = splitStr.find(l => Number(l).toString() === l)!;
        splitStr.reverse();
        const last = splitStr.find(l => Number(l).toString() === l)!;
        return acc + Number(first + last);
    }, 0);
};

const nums = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

const part2 = (input: string[]) => {
    return input.reduce((acc, cur) => {
        const matchMap = nums.flatMap(l => [...cur.matchAll(l as unknown as RegExp)]).filter(Boolean);
        const minMatch = Math.min(...matchMap.map(l => l!.index!));
        const maxMatch = Math.max(...matchMap.map(l => l!.index!));
        const splitStr = cur.split("");
        const firstIdx = splitStr.findIndex(l => Number(l).toString() === l)!;
        splitStr.reverse();
        const lastIdx = splitStr.length - splitStr.findIndex(l => Number(l).toString() === l)! - 1;
        let res = "";
        if (firstIdx < minMatch && firstIdx !== -1) {
            res += cur[firstIdx];
        } else {
            const match = matchMap.find(l => l!.index === minMatch)!;
            res += nums.indexOf(match[0]) + 1;
        }
        if (lastIdx > maxMatch && lastIdx !== splitStr.length) {
            res += cur[lastIdx];
        } else {
            const match = matchMap.find(l => l!.index === maxMatch)!;
            res += nums.indexOf(match[0]) + 1;
        }
        return acc + Number(res);
    }, 0);
};

const main = async () => {
    const input = await readInput(path.join(__dirname, "./input.txt"), InputMode.Split);

    input.pop();

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
