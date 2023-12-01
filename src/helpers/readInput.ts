import * as fs from "fs";
import { promisify } from "util";

const readFile = promisify(fs.readFile);

export const readInputRaw = (filepath: string): Promise<string> =>
    readFile(filepath, "utf-8");

export const readInputSplit = async (filepath: string): Promise<string[]> =>
    (await readFile(filepath, "utf-8")).split("\n");

export const readInputSplitNum = async (filepath: string): Promise<number[]> =>
    (await readFile(filepath, "utf-8")).split("\n").map(Number);

export const readInputGrid = async (filepath: string): Promise<string[][]> =>
    (await readFile(filepath, "utf-8")).split("\n").map(l => l.split(""));

export enum InputMode {
    Raw,
    Split,
    SplitNum,
    Grid
}

function readInput(filepath: string, mode: InputMode.Raw): Promise<string>;
function readInput(filepath: string, mode: InputMode.Split): Promise<string[]>;
function readInput(filepath: string, mode: InputMode.SplitNum): Promise<number[]>;
function readInput(filepath: string, mode: InputMode.Grid): Promise<string[][]>;
function readInput(filepath: string, mode: InputMode) {
    switch (mode) {
        case InputMode.Raw:
            return readInputRaw(filepath);
        case InputMode.Split:
            return readInputSplit(filepath);
        case InputMode.SplitNum:
            return readInputSplitNum(filepath);
        case InputMode.Grid:
            return readInputGrid(filepath);
    }
}

export default readInput;
