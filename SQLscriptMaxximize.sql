INSERT INTO maxximize.organisation (id, name, isActive, type, uen) VALUES (2, 'manufacturing1', 'true', 'manufacturer', 124233122);
INSERT INTO maxximize.organisation (id, name, isActive, type, uen) VALUES (3, 'retailer1', 'true', 'retailer', 612763873);


INSERT INTO maxximize.contact (id, phoneNumber, email, address, postalCode, organisationId) VALUES (3, '94893849', 'm1@gmail.com', 'ManuAddress1', '723123', 2);
INSERT INTO maxximize.contact (id, phoneNumber, email, address, postalCode, organisationId) VALUES (4, '93492348', 'r1@gmail.com', 'RetailAddress1', '371839', 3);
INSERT INTO maxximize.contact (id, phoneNumber, email, address, postalCode) VALUES (5, '93894938', 'mc1@gmail.com', 'ManuCusAddress1', '423423');
INSERT INTO maxximize.contact (id, phoneNumber, email, address, postalCode) VALUES (6, '92390489', 'rc1@gmail.com', 'RetailCusAddress1', '534523');
INSERT INTO maxximize.contact (id, phoneNumber, email, address, postalCode) VALUES (7, '82949238', 'maxxiuser@gmail.com', 'maxximiseAddress', '839849');

INSERT INTO maxximize.user (id, firstName, lastName, username, password, isActive, salt, passwordChanged, role, organisationId, contactId) VALUES (2, 'manuUser1', 'lee', 'manuSuperAdmin', '$2b$10$f6h95DOKlOa4967NYpF4y.ef5vkNYh9zJkl7LajmU7mFP86FU0k5K', 'true', '$2b$10$f6h95DOKlOa4967NYpF4y.', FALSE, 'superadmin', 2, 5);
INSERT INTO maxximize.user (id, firstName, lastName, username, password, isActive, salt, passwordChanged, role, organisationId, contactId) VALUES (3, 'retailUser1', 'tan', 'retailAdmin', '$2b$10$f6h95DOKlOa4967NYpF4y.ef5vkNYh9zJkl7LajmU7mFP86FU0k5K', 'true', '$2b$10$f6h95DOKlOa4967NYpF4y.', FALSE, 'admin', 3, 6);
INSERT INTO maxximize.user (id, firstName, lastName, username, password, isActive, salt, passwordChanged, role, organisationId, contactId) VALUES (4, 'adminUser1', 'lim', 'maxximizeAdmin', '$2b$10$f6h95DOKlOa4967NYpF4y.ef5vkNYh9zJkl7LajmU7mFP86FU0k5K', 'true', '$2b$10$f6h95DOKlOa4967NYpF4y.', FALSE, 'admin', 1, 7);

