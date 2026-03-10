import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, Tenant, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { tenant: true },
    });
  }

  // Cria a Empresa (Tenant) e o primeiro Usuário Admin juntos.
  async registerTenantOwner(data: Prisma.UserCreateInput & { tenantName: string }): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.tenant.create({
      data: {
        name: data.tenantName,
        users: {
          create: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: Role.ADMIN,
          },
        },
      },
      include: {
        users: true,
      },
    }).then(tenant => tenant.users[0]);
  }
}
