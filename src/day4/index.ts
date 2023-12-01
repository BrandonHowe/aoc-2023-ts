import * as path from "path";
import readInput, { InputMode } from "../helpers/readInput";

const part1 = (input: string) => {

};

const part2 = (input: string) => {

};

const main = async () => {
    const input = await readInput(path.join(__dirname, "./input.txt"), InputMode.Raw);

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
