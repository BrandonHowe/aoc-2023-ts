import * as path from "path";
import readInput, { InputMode } from "../helpers/readInput";

interface Conversion {
    dest: number;
    source: number;
    length: number;
}

interface PlantMap {
    from: string;
    to: string;
    conversions: Conversion[];
}

interface Range {
    start: number;
    end: number;
}

const convertVal = (num: number, conversion: Conversion) => {
    if (num >= conversion.source && num < conversion.source + conversion.length) {
        const offset = num - conversion.source;
        return conversion.dest + offset;
    }
    return num;
}

const convertRange = (range: Range, conversion: Conversion): Range[][] => {
    if (conversion.source > range.end) return [[], [range]];
    if (conversion.source + conversion.length - 1 < range.start) return [[], [range]];

    const offset = conversion.dest - conversion.source;

    const start = Math.max(range.start, conversion.source);
    const end = Math.min(range.end, conversion.source + conversion.length - 1);

    const r = (end < range.end) ? [{ start: end + 1, end: range.end }] : [];
    const l = (start > range.start) ? [{ start: range.start, end: start - 1 }] : [];

    return [[{ start: start + offset, end: end + offset }], [...l, ...r]];
}

const convertValThroughMap = (num: number, map: PlantMap) => {
    let n = num;
    for (const conv of map.conversions) {
        const v = convertVal(n, conv);
        if (n !== v) {
            n = v;
            break;
        }
    }
    return n;
}

const convertRangesThroughMap = (r: Range[], map: PlantMap) => {
    let ranges = r;
    let mapped: Range[] = [];
    for (const conv of map.conversions) {
        let notMapped: Range[] = [];
        for (const range of ranges) {
            const [inMap, outMap] = convertRange(range, conv);
            mapped.push(...inMap);
            notMapped.push(...outMap);
        }
        ranges = notMapped;
    }
    ranges = [...ranges, ...mapped];
    return ranges;
}

const part1 = (input: string) => {
    const sections = input.split("\n\n");

    const seeds = sections[0].split(": ")[1].split(" ").map(Number);

    const sectionsToParse = sections.slice(1);
    const maps: PlantMap[] = [];

    for (const section of sectionsToParse) {
        const split = section.split("\n");
        const map: PlantMap = { from: split[0].split(" map:")[0].split("-")[0], to: split[0].split(" map:")[0].split("-")[2], conversions: [] };
        const rest = split.slice(1);
        for (const line of rest) {
            const parsedLine = line.split(" ").map(Number);
            map.conversions.push({ dest: parsedLine[0], source: parsedLine[1], length: parsedLine[2] });
        }
        maps.push(map);
    }

    for (const map of maps) {
        for (let i = 0; i < seeds.length; i++) {
            seeds[i] = convertValThroughMap(seeds[i], map);
        }
    }

    return Math.min(...seeds);
};

const part2 = (input: string) => {
    const sections = input.split("\n\n");

    const seedsRaw = sections[0].split(": ")[1].split(" ").map(Number);
    let ranges: Range[] = [];

    for (let j = 0; j < seedsRaw.length / 2; j++) {
        ranges.push({ start: seedsRaw[j * 2], end: seedsRaw[j * 2] + seedsRaw[j * 2 + 1] - 1 });
    }

    const sectionsToParse = sections.slice(1);
    const maps: PlantMap[] = [];

    for (const section of sectionsToParse) {
        const split = section.split("\n");
        const map: PlantMap = { from: split[0].split(" map:")[0].split("-")[0], to: split[0].split(" map:")[0].split("-")[2], conversions: [] };
        const rest = split.slice(1);
        for (const line of rest) {
            const parsedLine = line.split(" ").map(Number);
            map.conversions.push({ dest: parsedLine[0], source: parsedLine[1], length: parsedLine[2] });
        }
        maps.push(map);
    }

    for (const map of maps) {
        ranges = convertRangesThroughMap(ranges, map);
    }

    return Math.min(...ranges.map(l => l.start));
};

const main = async () => {
    const input = (await readInput(path.join(__dirname, "./input.txt"), InputMode.Raw)).trim();

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
