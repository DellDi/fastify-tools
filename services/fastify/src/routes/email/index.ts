import { FastifyPluginAsync } from 'fastify';
import { Type } from '@sinclair/typebox';
import { Prisma } from '../../../generated/client/index.js';
import { EmailTemplateService } from '../../services/email/email-template.service.js';
import { EmailSendService } from '../../services/email/email-send.service.js';

const emailTemplateRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  const emailTemplateService = new EmailTemplateService(fastify);
  const emailSendService = new EmailSendService(fastify);

  // 获取所有邮件模板
  fastify.get('/', {
    schema: {
      tags: ['email'],
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
      tags: ['email'],
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
      tags: ['email'],
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
      tags: ['email'],
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
      tags: ['email'],
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


  // 发送邮件
  fastify.post('/send', {
    schema: {
      tags: ['email'],
      body: Type.Object({
        email: Type.String({ format: 'email' }),
        templateName: Type.Optional(Type.String({ default: 'register-confirmation' })),
        variables: Type.Optional(Type.Any()),
      }),
      response: {
        200: Type.Object({
          log: Type.Object({
            id: Type.String(),
            templateId: Type.String(),
            toEmail: Type.String(),
            variables: Type.Optional(Type.Any()),
            status: Type.String(),
            createdAt: Type.String({ format: 'date-time' }),
          }),
          message: Type.String(),
        }),
        404: Type.Object({
          message: Type.String(),
        }),
      },
    },
    handler: async (request, reply) => {
      const { email, templateName, variables } = request.body as { email: string; templateName: string; variables?: any };

      try {
        const template = await emailTemplateService.findByName(templateName);
        if (!template) {
          return reply.code(404).send({ message: '邮件模板未找到' });
        }
        // 发送邮件
        const log = await emailSendService.sendWithTemplate(email, templateName, variables);

        return reply.code(200).send({ message: '邮件发送成功', log });
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
