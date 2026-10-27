export const COMPONENTS = {
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  Application: Symbol.for('Application'),

  DatabaseClient: Symbol.for('DatabaseClient'),

  UserModel: Symbol.for('UserModel'),
  OfferModel: Symbol.for('OfferModel'),

  UserService: Symbol.for('UserService'),
  OfferService: Symbol.for('OfferService'),
} as const;
