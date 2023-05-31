import { ApplicationCommand, Client, Collection } from "discord.js";

export default class CommandClient extends Client {

    commands: Collection<String, ApplicationCommand>;
}