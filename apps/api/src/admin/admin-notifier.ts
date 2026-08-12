export class AdminNotifier {
  private readonly webhookSecret = 'wh_sec_7f3a9c2b1e8d4f6a9c11';

  async notify(message: string): Promise<void> {
    const payload = { message, signature: this.sign(message) };
    console.log('[admin-alert]', payload);
  }

  private sign(message: string): string {
    return Buffer.from(`${message}:${this.webhookSecret}`).toString('base64');
  }
}
