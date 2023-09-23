import {spawn} from 'child_process';

let thread = null;
const gitExec = command => (
    new Promise((resolve, reject) => {
        thread = spawn('git', command, { stdio: ['inherit', 'pipe', 'pipe'], shell: false, });
        const stdOut = [];
        const stdErr = [];

        thread.stdout.on('data', (data) => {
            stdOut.push(data.toString('utf8'));
        });

        thread.stderr.on('data', (data) => {
            stdErr.push(data.toString('utf8'));
        });

        thread.on('close', () => {
            if (stdErr.length) {
                reject(stdErr.join(''));
                return;
            }
            resolve(stdOut.join());
        });
    })
);

const getTroughGroup = async (pathes: string[], authors: string[]) => {
    const result = {}
    for (const project of pathes) {
        for (const author of authors) {
            if (!result[author]){
                result[author] = {
                    global: {
                        added: 0,
                        removed: 0,
                        total: 0
                    }
                }
            }
           const logInfo =  await gitExec(
                ['-C', project, "log" ,"--author", author,  "--numstat"  ]
            )
                const enum Groups {
                    ADDED = 1,
                    REMOVED = 2,
                    WHERE = 3
                }
                const data = {author, added: 0, removed: 0}
                const regex = /(\d+)\s+(\d+)\s+([a-zA-Z\/\.\-\{\}_]+)/gm;
                let m;

                while ((m = regex.exec(<string>logInfo)) !== null) {
                    // This is necessary to avoid infinite loops with zero-width matches
                    if (m.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }

                    // The result can be accessed through the `m`-variable.
                    m.forEach((match, groupIndex) => {
                        switch (groupIndex) {
                            case Groups.ADDED:
                                data.added += parseInt(match)
                                break;
                            case Groups.REMOVED:
                                data.removed += parseInt(match)
                        }
                    });
                }

                result[author][project] = {
                    added: data.added,
                    removed: data.removed,
                    total: data.added+ data.removed
                }
                result[author].global = {
                    added: result[author].global.added + data.added,
                    removed: result[author].global.removed + data.removed,
                    total: result[author].global.total + data.added + data.removed
                }
        }
    }
    console.log(result)
}

getTroughGroup(
        process.argv[2].split(',').filter((el)=>el.length),
        process.argv[3].split(',').filter((el)=>el.length)
)

