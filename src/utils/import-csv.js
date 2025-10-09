import fs from "node:fs";
import { parse } from "csv-parse";

const csvPath = new URL("../../tasks.csv", import.meta.url);

export const processCsv = async () => {
    const parser = fs.createReadStream(csvPath).pipe(parse());

    for await (const record of parser) {
        if (record[0] !== 'title' && record[1] !== 'description') {
            const [title, description] = record

            fetch('http://localhost:3333/tasks', {
                method: 'POST',
                body: JSON.stringify({
                    title,
                    description
                }),
            }).catch(data => {
                console.log(data)
            })
        }
    }
};

(async () => {
    await processCsv()
})();
