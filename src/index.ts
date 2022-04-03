import Client from "./Client"
import { token, prefix } from "./Config"
const client = new Client({ token, prefix })
client.start()