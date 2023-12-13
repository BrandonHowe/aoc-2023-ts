import { memoize } from "lodash";
import * as path from "path";
import readInput, { InputMode } from "../helpers/readInput";

interface Condition {
    springs: string[];
    sizes: number[];
}

const countPossibilitiesBase = (condition: Condition): number => {
    if (condition.sizes.length === 0) {
        return Number(condition.springs.indexOf("#") === -1);
    } else if (condition.springs.length === 0) {
        return 0;
    }

    if (condition.springs.length < condition.sizes.reduce((acc, cur) => acc + cur) + condition.sizes.length - 1) return 0;

    if (condition.springs[0] === "?") {
        return countDot(condition) + countHash(condition);
    } else {
        return condition.springs[0] === "." ? countDot(condition) : countHash(condition);
    }
}

const countPossibilities = memoize(countPossibilitiesBase, (c: Condition) => `${c.springs.join("")}:${c.sizes.join("|")}` );

const countDot = (condition: Condition) => {
    const newCondition = {
        springs: [...condition.springs].slice(1),
        sizes: [...condition.sizes]
    };
    return countPossibilities(newCondition);
}

const countHash = (condition: Condition) => {
    if (condition.springs.slice(0, condition.sizes[0]).includes(".")) return 0;
    if (condition.springs[condition.sizes[0]] === "#") return 0;
    const newCondition = {
        springs: [...condition.springs].slice(condition.sizes[0] + 1),
        sizes: [...condition.sizes].slice(1)
    }
    return countPossibilities(newCondition);
}

const part1 = (input: Condition[]) => {
    return input.reduce((acc, cur) => acc + countPossibilities(cur), 0);
};

const part2 = (input: Condition[]) => {
    for (const condition of input) {
        const baseSprings = [...condition.springs];
        const baseSizes = [...condition.sizes];
        for (let i = 0; i < 4; i++) {
            condition.springs.push("?", ...baseSprings);
            condition.sizes.push(...baseSizes);
        }
    }

    return input.reduce((acc, cur) => acc + countPossibilities(cur), 0);
};

const main = async () => {
    const input = await readInput(path.join(__dirname, "./input.txt"), InputMode.Split);
    const parsed = input.map(l => {
        const split = l.split(" ");
        return { springs: split[0].split(""), sizes: split[1].split(",").map(Number) };
    })

    console.time("part1");

    console.log(part1(parsed));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(parsed));

    console.timeEnd("part2");
};

main();
