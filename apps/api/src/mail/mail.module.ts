import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';

const notEqualsOne = (id: number) => {
  if (id != 1) {
    return `<p>Login here: http://localhost:4200/login/${id}</p>`;
  } else {
    return "<p>Login here: http://localhost:4200/login";
  }
};
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      template: {
        dir: join(__dirname, '/assets'),
        adapter: new HandlebarsAdapter({
          'notEqualsOne': notEqualsOne
        }),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
