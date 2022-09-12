import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Contact } from '../contacts/entities/contact.entity';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}
    async sendUserConfirmation(contact: Contact) {
        await this.mailerService.sendMail({
        to: contact.email,
        from: "maxximize4103@gmail.com",
        subject: 'Welcome to Nice App! Confirm your Email',
        template: './mail', // `.hbs` extension is appended automatically
        context: {
            // ✏️ filling curly brackets with content
            name: contact.email,
        },
        });
    }
}
