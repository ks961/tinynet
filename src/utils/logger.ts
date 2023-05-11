
function enum_aux() {
    let count: number = 0;
    
    function reset_aux(): number {
        count = 0;
        return count++;
    }

    return (reset=false) => {
        return reset ? reset_aux() : count++;
    }
}

const enum_ = enum_aux();

const INFO: number = enum_(true);
const LOW: number = enum_(true);
const MEDIUM: number = enum_();
const HIGH: number = enum_();

interface ISeverityLevel {
    [key: number]: string,
}

// export class Severity {
//     #levels: ISeverityLevel = {
//         LOW: 
//     };
//     // #info: string;
//     constructor() {
//         this.#level = LOW;
//         this.#info  = 
//     }
// }

//#dcbdef

export default class Logger {
    // #level: number = 
    constructor() {

    }
};