import * as path from "path";
import readInput, { InputMode } from "../helpers/readInput";

type Color = "blue" | "red" | "green";

type Round = Record<Color, number>;

type Game = {
    num: number;
    rounds: Round[];
}

const parseGame = (str: string) => {
    const split1 = str.split(": ");
    const roundNum = Number(split1[0].split(" ")[1]);

    const game: Game = {
        num: roundNum,
        rounds: []
    }

    const roundStrs = split1[1].split("; ").map(l => l.split(", "));

    for (const round of roundStrs) {
        const newRound: Round = { red: 0, green: 0, blue: 0 };
        game.rounds.push(newRound);
        for (const subset of round) {
            const spl = subset.split(" ");
            newRound[spl[1] as Color] = Number(spl[0]);
        }
    }

    return game;
}

const part1 = (input: string[]) => {
    const games = input.map(parseGame);

    const gamePossible = (game: Game) => {
        for (const round of game.rounds) {
            if (round.red > 12 || round.green > 13 || round.blue > 14) return false;
        }
        return true;
    }

    return games.map(gamePossible).map((l, idx) => l ? games[idx].num : 0).reduce((acc, cur) => acc + cur);
};

const part2 = (input: string[]) => {
    const games = input.map(parseGame);

    const power = (game: Game) => {
        const maxRed = game.rounds.reduce((acc, cur) => Math.max(acc, cur.red), 0);
        const maxGreen = game.rounds.reduce((acc, cur) => Math.max(acc, cur.green), 0);
        const maxBlue = game.rounds.reduce((acc, cur) => Math.max(acc, cur.blue), 0);
        return maxRed * maxGreen * maxBlue;
    }

    return games.reduce((acc, cur) => acc + power(cur), 0);
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
