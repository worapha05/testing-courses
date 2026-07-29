export function createNotifier({ sendEmail, logger = console }) {
  return {
    async notify(user, message) {
      if (!user?.email) {
        throw new Error('email is required');
      }
      const result = await sendEmail(user.email, message);
      logger.info(`notified ${user.email}`);
      return result;
    },
  };
}
