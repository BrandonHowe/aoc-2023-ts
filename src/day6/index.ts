import * as path from "path";
import readInput, { InputMode } from "../helpers/readInput";

interface Race {
    time: number;
    distance: number;
}

const part1 = (input: string[]) => {
    const times = input[0].split(": ")[1].split(" ").filter(Boolean).map(Number);
    const distances = input[1].split(": ")[1].split(" ").filter(Boolean).map(Number);
    const races: Race[] = [];
    for (let i = 0; i < times.length; i++) {
        races.push({ time: times[i], distance: distances[i] });
    }

    let score = 1;

    for (const race of races) {
        const options = Array(race.time).fill(0).map((_, idx) => idx).map(l => l + (race.time - l - 1) * l);
        score *= options.filter(l => l > race.distance).length;
    }

    return score;
};

const solveQuadratic = (a: number, b: number, c: number) => {
    return [
        (-b - Math.sqrt(Math.pow(b, 2) - (4 * a * c))) / (2 * a),
        (-b + Math.sqrt(Math.pow(b, 2) - (4 * a * c))) / (2 * a)
    ]
}

const part2 = (input: string[]) => {
    const time = Number(input[0].split(": ")[1].split(" ").filter(Boolean).join(""));
    const distance = Number(input[1].split(": ")[1].split(" ").filter(Boolean).join(""));
    const endPoints = solveQuadratic(-1, time, -distance);
    const smaller = Math.min(Math.abs(endPoints[0]), Math.abs(endPoints[1]));
    const larger = Math.max(Math.abs(endPoints[0]), Math.abs(endPoints[1]));
    return Math.floor(larger) - Math.ceil(smaller) + 1;
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
