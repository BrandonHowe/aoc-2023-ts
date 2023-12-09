import * as path from "path";
import readInput, { InputMode } from "../helpers/readInput";

type Node = {
    left: string;
    right: string;
}

const part1 = (route: string[], nodes: Record<string, Node>) => {
    let node = "AAA";
    let iters = 0;
    while (node !== "ZZZ") {
        for (const instr of route) {
            node = nodes[node][instr === "R" ? "right" : "left"];
            iters++;
            if (node === "ZZZ") break;
        }
    }
    return iters;
};

const gcd = (a: number, b: number): number => a ? gcd(b % a, a) : b;
const lcm = (a: number, b: number): number => a * b / gcd(a, b);

const part2 = (route: string[], nodes: Record<string, Node>) => {
    let iters = 0;
    const startings = Object.keys(nodes).filter(l => l[l.length - 1] === "A");
    const nodeLocs = [...startings];
    const cycleLengths: Record<string, number> = {};
    while (Object.values(cycleLengths).filter(Boolean).length < nodeLocs.length) {
        for (const instr of route) {
            for (let i = 0; i < nodeLocs.length; i++) {
                nodeLocs[i] = nodes[nodeLocs[i]][instr === "R" ? "right" : "left"];
            }
            iters++;
            for (const node of nodeLocs) {
                if (node[node.length - 1] === "Z") {
                    if (!(node in cycleLengths)) {
                        cycleLengths[node] = iters;
                    }
                }
            }
        }
    }
    return Object.values(cycleLengths).reduce(lcm);
};

const main = async () => {
    const input = (await readInput(path.join(__dirname, "./input.txt"), InputMode.Raw)).trim();
    const route = input.split("\n\n")[0].split("");
    const instrs = input.split("\n\n")[1].split("\n");
    const nodes: Record<string, Node> = {};

    for (const instr of instrs) {
        const split = instr.split(" = ");
        const superSplit = split[1].split(", ");
        nodes[split[0]] = {
            left: superSplit[0].slice(1),
            right: superSplit[1].slice(0, -1),
        }
    }

    console.time("part1");

    console.log(part1(route, nodes));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(route, nodes));

    console.timeEnd("part2");
};

main();
