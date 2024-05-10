import {
  Client as DiscordClient,
  GatewayIntentBits,
  Message,
  TextChannel,
  Events,
} from 'discord.js';
import { BridgeService } from './Bridge';
import { Config } from '@/config';

export class DiscordService {
  private static instance: DiscordService;
  private discordClient: DiscordClient;
  private bridgeService = BridgeService.getInstance();

  private constructor() {
    this.discordClient = new DiscordClient({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildWebhooks,
      ],
    });
    this.setup();
  }

  /** @dev avoid multiple instances; allow one global, reusable instance */
  public static getInstance(): DiscordService {
    if (!DiscordService.instance) {
      DiscordService.instance = new DiscordService();
    }
    return DiscordService.instance;
  }

  private setup() {
    this.connectDiscord();
    this.addEventListeners();
  }

  private connectDiscord() {
    // Connect to Discord using the bot token
    this.discordClient.login(Config.discordBotToken);
    // Add 'one-time' event listeners
    this.discordClient.once('ready', () => {
      console.log(`Logged in as ${this.discordClient.user?.tag}`);
    });
  }

  private addEventListeners() {
    /** @dev read channel messages & reply */
    this.discordClient.on(Events.MessageCreate, this.handleMessage);
  }

  private handleMessage = async (message: Message) => {
    if (message.content.startsWith('pylon/')) {
      const [_, arg] = message.content.split('/');

      switch (arg) {
        case 'balance':
          await this.handleBalance(message);
          break;
        case 'help':
        default:
          await this.handleHelp(message);
          break;
      }
    }
  };

  private async handleBalance(message: Message) {
    try {
      const balance = await this.bridgeService.getPrefundedAccountBalance();
      await message.reply(
        `Your balance for ${balance.data[0].name} is ${
          balance.data[0].available_balance
        } ${balance.data[0].currency.toUpperCase()}`
      );
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }

  private async handleHelp(message: Message) {
    await message.reply(`
      Unknown command. Here are the available commands:
      - \`pylon/balance\`: Check your account balance
    `);
  }

  async send(channelId: string, content: string) {
    try {
      // Fetch the channel using the channel ID
      const channel = this.discordClient.channels.cache.get(channelId);
      if (!(channel instanceof TextChannel)) {
        throw new Error('Channel is not a text channel');
      }

      // Send the message to the channel
      const message = await channel.send(content);
      return message;
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  }
}
