import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private logger: Logger;

  constructor() {
    super();

    this.logger = new Logger();
  }

  async onModuleInit() {
    await this.$connect().catch((reason: any) => this.logger.log(reason));
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on("beforeExit", async () => {
      await app.close();
    });
  }
}
