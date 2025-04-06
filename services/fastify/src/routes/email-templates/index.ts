import { FastifyPluginAsync } from 'fastify';
import { Type } from '@sinclair/typebox';
import { EmailTemplateService } from '../../services/email-template.service';
import { Prisma } from '@prisma/client';

const emailTemplateRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  const emailTemplateService = new EmailTemplateService(fastify);

  // 获取所有邮件模板
  fastify.get('/', {
    schema: {
      response: {
        200: Type.Array(
          Type.Object({
            id: Type.String(),
            name: Type.String(),
            subject: Type.String(),
            body: Type.String(),
            variables: Type.Optional(Type.Any()),
            createdAt: Type.String({ format: 'date-time' }),
            updatedAt: Type.String({ format: 'date-time' }),
          })
        ),
      },
    },
    handler: async () => {
      return await emailTemplateService.findAll();
    },
  });

  // 获取单个邮件模板
  fastify.get('/:id', {
    schema: {
      params: Type.Object({
        id: Type.String(),
      }),
      response: {
        200: Type.Object({
          id: Type.String(),
          name: Type.String(),
          subject: Type.String(),
          body: Type.String(),
          variables: Type.Optional(Type.Any()),
          createdAt: Type.String({ format: 'date-time' }),
          updatedAt: Type.String({ format: 'date-time' }),
        }),
        404: Type.Object({
          message: Type.String(),
        }),
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: string };
      const template = await emailTemplateService.findById(id);
      
      if (!template) {
        return reply.code(404).send({ message: '邮件模板未找到' });
      }
      
      return template;
    },
  });

  // 创建邮件模板
  fastify.post('/', {
    schema: {
      body: Type.Object({
        name: Type.String(),
        subject: Type.String(),
        body: Type.String(),
        variables: Type.Optional(Type.Any()),
      }),
      response: {
        201: Type.Object({
          id: Type.String(),
          name: Type.String(),
          subject: Type.String(),
          body: Type.String(),
          variables: Type.Optional(Type.Any()),
          createdAt: Type.String({ format: 'date-time' }),
          updatedAt: Type.String({ format: 'date-time' }),
        }),
      },
    },
    handler: async (request, reply) => {
      const data = request.body as any;
      const template = await emailTemplateService.create(data);
      return reply.code(201).send(template);
    },
  });

  // 更新邮件模板
  fastify.put('/:id', {
    schema: {
      params: Type.Object({
        id: Type.String(),
      }),
      body: Type.Object({
        name: Type.Optional(Type.String()),
        subject: Type.Optional(Type.String()),
        body: Type.Optional(Type.String()),
        variables: Type.Optional(Type.Any()),
      }),
      response: {
        200: Type.Object({
          id: Type.String(),
          name: Type.String(),
          subject: Type.String(),
          body: Type.String(),
          variables: Type.Optional(Type.Any()),
          createdAt: Type.String({ format: 'date-time' }),
          updatedAt: Type.String({ format: 'date-time' }),
        }),
        404: Type.Object({
          message: Type.String(),
        }),
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: string };
      const data = request.body as any;
      
      try {
        const template = await emailTemplateService.update(id, {
          ...data,
          updatedAt: new Date(),
        });
        return template;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
          return reply.code(404).send({ message: '邮件模板未找到' });
        }
        throw error;
      }
    },
  });

  // 删除邮件模板
  fastify.delete('/:id', {
    schema: {
      params: Type.Object({
        id: Type.String(),
      }),
      response: {
        200: Type.Object({
          id: Type.String(),
          name: Type.String(),
          subject: Type.String(),
          body: Type.String(),
          variables: Type.Optional(Type.Any()),
          createdAt: Type.String({ format: 'date-time' }),
          updatedAt: Type.String({ format: 'date-time' }),
        }),
        404: Type.Object({
          message: Type.String(),
        }),
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: string };
      
      try {
        const template = await emailTemplateService.delete(id);
        return template;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
          return reply.code(404).send({ message: '邮件模板未找到' });
        }
        throw error;
      }
    },
  });
};

export default emailTemplateRoutes;
