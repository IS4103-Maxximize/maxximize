import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Contact } from '../contacts/entities/contact.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}
    async sendUserConfirmation(contact: Contact, organisation: string, user: User, password: string) {
        await this.mailerService.sendMail({
        to: contact.email,
        from: process.env.MAIL_FROM,
        subject: "Account details",
        template: './mail', 
        context: {
            organisation: organisation,
            name: user.firstName + " " + user.lastName,
            username: user.username,
            password: password
        },
        });
    }
}