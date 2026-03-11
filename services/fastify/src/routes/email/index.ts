import { FastifyPluginAsync } from 'fastify';
import { Prisma } from '../../../generated/client/index.js';
import {
  EmailSendBodyType,
  EmailSendSchema,
  EmailTemplateCreateBodyType,
  EmailTemplateCreateSchema,
  EmailTemplateDeleteSchema,
  EmailTemplateDetailSchema,
  EmailTemplateIdParamsType,
  EmailTemplateListSchema,
  EmailTemplateUpdateBodyType,
  EmailTemplateUpdateSchema,
} from '@/schema/email/index.js';
import { EmailTemplateService } from '../../services/email/email-template.service.js';
import { EmailSendService } from '../../services/email/email-send.service.js';

const emailTemplateRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  const emailTemplateService = new EmailTemplateService(fastify);
  const emailSendService = new EmailSendService(fastify);

  // 获取所有邮件模板
  fastify.get('/', {
    schema: EmailTemplateListSchema,
    handler: async () => {
      return await emailTemplateService.findAll();
    },
  });

  // 获取单个邮件模板
  fastify.get('/:id', {
    schema: EmailTemplateDetailSchema,
    handler: async (request, reply) => {
      const { id } = request.params as EmailTemplateIdParamsType;
      const template = await emailTemplateService.findById(id);

      if (!template) {
        return reply.code(404).send({ message: '邮件模板未找到' });
      }

      return template;
    },
  });

  // 创建邮件模板
  fastify.post('/', {
    schema: EmailTemplateCreateSchema,
    handler: async (request, reply) => {
      const data = request.body as EmailTemplateCreateBodyType;
      const template = await emailTemplateService.create(data);
      return reply.code(201).send(template);
    },
  });

  // 更新邮件模板
  fastify.put('/:id', {
    schema: EmailTemplateUpdateSchema,
    handler: async (request, reply) => {
      const { id } = request.params as EmailTemplateIdParamsType;
      const data = request.body as EmailTemplateUpdateBodyType;

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
    schema: EmailTemplateDeleteSchema,
    handler: async (request, reply) => {
      const { id } = request.params as EmailTemplateIdParamsType;

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
    schema: EmailSendSchema,
    handler: async (request, reply) => {
      const { email, templateName, variables } = request.body as EmailSendBodyType;
      const resolvedTemplateName = templateName || 'register-confirmation';

      try {
        const template = await emailTemplateService.findByName(resolvedTemplateName);
        if (!template) {
          return reply.code(404).send({ message: '邮件模板未找到' });
        }
        // 发送邮件
        const log = await emailSendService.sendWithTemplate(email, resolvedTemplateName, variables);

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
