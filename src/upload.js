import fs from "node:fs";
import { parse } from "csv-parse";

const csvPath = new URL("../tasks.csv", import.meta.url);

export const processCsv = async () => {
    const records = [];

    const parser = fs.createReadStream(csvPath).pipe(parse());

    for await (const record of parser) {
        records.push(record);
    }

    return records;
};

