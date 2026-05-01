import { INestApplication } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import {
  configureE2eApp,
  createE2eTestingModule,
} from './create-e2e-app';

function extractAccessToken(res: { body: unknown; text: string }): string {
  if (typeof res.body === 'string' && res.body.length > 0) {
    return res.body;
  }
  if (
    res.body &&
    typeof res.body === 'object' &&
    'accessToken' in res.body &&
    typeof (res.body as { accessToken: unknown }).accessToken === 'string'
  ) {
    return (res.body as { accessToken: string }).accessToken;
  }
  const t = res.text.trim();
  try {
    const parsed: unknown = JSON.parse(t);
    if (typeof parsed === 'string') {
      return parsed;
    }
  } catch {
    /* response may be raw token */
  }
  if (t.length > 10 && !t.startsWith('{')) {
    return t;
  }
  throw new Error(`Unexpected auth response body: ${t}`);
}

const dbIt = process.env.DATABASE_URL ? it : it.skip;

describe('App (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    const moduleFixture = await createE2eTestingModule();
    app = moduleFixture.createNestApplication();
    configureE2eApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  dbIt('auth register, promote to admin, protected GET /user/users', async () => {
    const email = `e2e-${Date.now()}@test.local`;
    const password = 'password123';

    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'E2E User',
        email,
        password,
      })
      .expect(201);

    const accessToken = extractAccessToken(registerRes);
    expect(accessToken.length).toBeGreaterThan(10);

    await prisma.user.update({
      where: { email },
      data: { role: Role.ADMIN },
    });

    await request(app.getHttpServer())
      .get('/user/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);

    const loginToken = extractAccessToken(loginRes);
    expect(loginToken.length).toBeGreaterThan(10);
  });
});
