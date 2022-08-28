import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsModule } from '../contacts/contacts.module';
import { Contact } from '../contacts/entities/contact.entity';
import { Organisation } from '../organisations/entities/organisation.entity';
import { OrganisationsModule } from '../organisations/organisations.module';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: 'test',
      entities: [
        User,
        Contact,
        Organisation,
      ],
      synchronize: true, // shouldn't be set to 'true' in production
    }),
    UsersModule,
    ContactsModule,
    OrganisationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
