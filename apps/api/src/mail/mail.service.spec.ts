import { MailerService } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import MailMessage from 'nodemailer/lib/mailer/mail-message';
import { MailService } from './mail.service';

describe('MailService', () => {
  let service: MailService;
  let mailerService: MailerService;

  const user: any = {
    firstName: "test",
    lastName: "testing",
    username: "testusername"
  }
  function spyOnSmtpSend(onMail: (mail: MailMessage) => void) {
    return jest
      .spyOn(SMTPTransport.prototype, 'send')
      .mockImplementation(function (
        mail: MailMessage,
        callback: (
          err: Error | null,
          info: SMTPTransport.SentMessageInfo,
        ) => void,
      ): void {
        onMail(mail);
        callback(null, {
          envelope: {
            from: mail.data.from as string,
            to: [mail.data.to as string],
          },
          messageId: 'ABCD',
          accepted: [],
          rejected: [],
          pending: [],
          response: 'ok',
        });
      });
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{
        provide: MailService,
        useValue: {
          sendPasswordEmail: jest.fn(),
          sendForgotPasswordEmail: jest.fn(),
          sendSalesInquiryEmail: jest.fn(),
          sendPurchaseOrderEmail: jest.fn(),
          sendRejectedApplicationEmail: jest.fn()
        }
      }, {
        provide: MailerService,
        useValue: {
          sendMail: jest.fn()
        }
      }

    ],
    }).compile();

    service = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('send password email', () => {
      expect(service.sendPasswordEmail("maxximizetest@gmail.com", "test org", user, "password", 2)).toStrictEqual(undefined);
    });

    const testUser: any = {
      firstName: "test",
      lastName: "testing",
    }

    it('should throw an error', async () => {
      jest.spyOn(service, 'sendPasswordEmail').mockResolvedValue(new Error());
      expect(service.sendPasswordEmail("maxximizetest@gmail.com", "test org", testUser, "password", 2)).reject(new Error());
    })

  });

});
