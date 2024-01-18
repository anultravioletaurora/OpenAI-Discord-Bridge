import { Client, ClientOptions, Collection } from "discord.js";

export class CommandClient extends Client<true> {
    public constructor(options: ClientOptions) {

        super(options);
    }
    commands: Collection<string, object> = new Collection();
}
