export class Command {
    public constructor(name: string, execute: Function) {

        this.name = name;
        this.execute = execute;
    }
    name: string;
    execute: Function;
}
