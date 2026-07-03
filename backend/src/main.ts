import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as cookieParserImport from 'cookie-parser';
const cookieParser = (cookieParserImport as any).default || cookieParserImport;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port_number') || 3000;
  const rawOrigins = configService.get<string>('origins') || '';

  // Parse CORS origins from .env
  // Format: [localhost:5173,localhost:5174] -> ["http://localhost:5173", "http://localhost:5174"]
  let parsedOrigins: string[] = [];
  if (rawOrigins) {
    const cleaned = rawOrigins.replace(/[\[\]]/g, '').trim();
    if (cleaned) {
      parsedOrigins = cleaned.split(',').map((origin) => {
        const trimmed = origin.trim();
        if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
          return `http://${trimmed}`;
        }
        return trimmed;
      });
    }
  }

  // Fallback origins if parsing failed or was empty
  if (parsedOrigins.length === 0) {
    parsedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
  }

  console.log('[Bootstrap] Enabling CORS with origins:', parsedOrigins);

  app.enableCors({
    origin: parsedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Apply custom HTTP exception filter globally
  app.useGlobalFilters(new HttpExceptionFilter());

  // Use cookie parser
  app.use(cookieParser());

  await app.listen(port);
  console.log(`[Bootstrap] Backend application successfully running on port ${port}`);
}
bootstrap();
