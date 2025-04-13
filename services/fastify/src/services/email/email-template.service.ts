import { FastifyInstance } from 'fastify';
import { EmailTemplate, Prisma } from '../../../generated/client/index.js'
/**
 * 邮件模板服务
 * 提供邮件模板的增删改查功能
 */
export class EmailTemplateService {
  constructor(private fastify: FastifyInstance) {}

  /**
   * 获取所有邮件模板
   */
  async findAll(): Promise<EmailTemplate[]> {
    return this.fastify.prisma.emailTemplate.findMany();
  }

  /**
   * 根据ID获取邮件模板
   */
  async findById(id: string): Promise<EmailTemplate | null> {
    return this.fastify.prisma.emailTemplate.findUnique({
      where: { id },
    });
  }

  /**
   * 根据名称获取邮件模板
   */
  async findByName(name: string): Promise<EmailTemplate | null> {
    return this.fastify.prisma.emailTemplate.findFirst({
      where: { name },
    });
  }

  /**
   * 创建邮件模板
   */
  async create(data: Prisma.EmailTemplateCreateInput): Promise<EmailTemplate> {
    return this.fastify.prisma.emailTemplate.create({
      data,
    });
  }

  /**
   * 更新邮件模板
   */
  async update(id: string, data: Prisma.EmailTemplateUpdateInput): Promise<EmailTemplate> {
    return this.fastify.prisma.emailTemplate.update({
      where: { id },
      data,
    });
  }

  /**
   * 删除邮件模板
   */
  async delete(id: string): Promise<EmailTemplate> {
    return this.fastify.prisma.emailTemplate.delete({
      where: { id },
    });
  }
}
