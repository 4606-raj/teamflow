import { PrismaService } from '@/common/prisma/prisma.service';

const technologies = [
  {
    name: 'Laravel',
    MetaData: {
      category: 'backend',
      type: 'framework',
      languages: ['PHP'],
      platforms: ['web', 'api'],
      devices: ['server'],
      supports: ['REST API', 'server-rendered applications', 'authentication'],
    },
  },
  {
    name: 'ReactJs',
    MetaData: {
      category: 'frontend',
      type: 'library',
      languages: ['JavaScript', 'TypeScript'],
      platforms: ['web'],
      devices: ['desktop', 'tablet', 'mobile'],
      supports: ['single-page applications', 'server-side rendering'],
    },
  },
  {
    name: 'ReactNative',
    MetaData: {
      category: 'mobile',
      type: 'framework',
      languages: ['JavaScript', 'TypeScript'],
      platforms: ['ios', 'android'],
      devices: ['phone', 'tablet'],
      supports: ['cross-platform mobile applications'],
    },
  },
  {
    name: 'NestJs',
    MetaData: {
      category: 'backend',
      type: 'framework',
      languages: ['TypeScript', 'JavaScript'],
      platforms: ['web', 'api'],
      devices: ['server'],
      supports: ['REST API', 'GraphQL', 'microservices', 'WebSockets'],
    },
  },
  {
    name: 'NodeJs',
    MetaData: {
      category: 'backend',
      type: 'runtime',
      languages: ['JavaScript', 'TypeScript'],
      platforms: ['web', 'api', 'cli'],
      devices: ['server'],
      supports: ['REST API', 'real-time applications', 'microservices'],
    },
  },
  {
    name: 'ExpressJs',
    MetaData: {
      category: 'backend',
      type: 'framework',
      languages: ['JavaScript', 'TypeScript'],
      platforms: ['web', 'api'],
      devices: ['server'],
      supports: ['REST API', 'server-rendered applications', 'middleware'],
    },
  },
  {
    name: 'NextJs',
    MetaData: {
      category: 'fullstack',
      type: 'framework',
      languages: ['JavaScript', 'TypeScript'],
      platforms: ['web', 'api'],
      devices: ['desktop', 'tablet', 'mobile', 'server'],
      supports: ['server-side rendering', 'static generation', 'REST API', 'full-stack applications'],
    },
  },
  {
    name: 'VueJs',
    MetaData: {
      category: 'frontend',
      type: 'framework',
      languages: ['JavaScript', 'TypeScript'],
      platforms: ['web'],
      devices: ['desktop', 'tablet', 'mobile'],
      supports: ['single-page applications', 'progressive web applications'],
    },
  },
  {
    name: 'Angular',
    MetaData: {
      category: 'frontend',
      type: 'framework',
      languages: ['TypeScript'],
      platforms: ['web'],
      devices: ['desktop', 'tablet', 'mobile'],
      supports: ['single-page applications', 'enterprise applications'],
    },
  },
  {
    name: 'Flutter',
    MetaData: {
      category: 'mobile',
      type: 'framework',
      languages: ['Dart'],
      platforms: ['ios', 'android', 'web', 'desktop'],
      devices: ['phone', 'tablet', 'desktop'],
      supports: ['cross-platform applications'],
    },
  },
  {
    name: 'Django',
    MetaData: {
      category: 'backend',
      type: 'framework',
      languages: ['Python'],
      platforms: ['web', 'api'],
      devices: ['server'],
      supports: ['REST API', 'server-rendered applications', 'authentication'],
    },
  },
  {
    name: 'SpringBoot',
    MetaData: {
      category: 'backend',
      type: 'framework',
      languages: ['Java', 'Kotlin'],
      platforms: ['web', 'api'],
      devices: ['server'],
      supports: ['REST API', 'microservices', 'enterprise applications'],
    },
  },
  {
    name: 'MySQL',
    MetaData: {
      category: 'database',
      type: 'relational',
      languages: ['SQL'],
      platforms: ['server'],
      devices: ['server'],
      supports: ['relational data', 'transactions', 'structured queries'],
    },
  },
  {
    name: 'PostgreSQL',
    MetaData: {
      category: 'database',
      type: 'relational',
      languages: ['SQL'],
      platforms: ['server'],
      devices: ['server'],
      supports: ['relational data', 'transactions', 'JSON data'],
    },
  },
  {
    name: 'MongoDB',
    MetaData: {
      category: 'database',
      type: 'document',
      languages: ['JavaScript', 'TypeScript'],
      platforms: ['server'],
      devices: ['server'],
      supports: ['document data', 'flexible schemas', 'horizontal scaling'],
    },
  },
  {
    name: 'Docker',
    MetaData: {
      category: 'devops',
      type: 'containerization',
      languages: [],
      platforms: ['server', 'local development', 'cloud'],
      devices: ['server', 'desktop'],
      supports: ['containerized applications', 'reproducible environments', 'service orchestration'],
    },
  },
];

export async function seedTechnologies(prisma: PrismaService) {
  for (const technology of technologies) {
    await prisma.technology.upsert({
      where: { name: technology.name },
      update: { MetaData: technology.MetaData },
      create: technology,
    });
  }

  console.log('Technologies seeded successfully');
}
