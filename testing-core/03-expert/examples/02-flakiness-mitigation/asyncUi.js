/**
 * จำลอง UI ที่ข้อมูลมาแบบ async — บางครั้งช้ากว่า sleep คงที่
 */
export function createAsyncLabel({ delayMs = 30, text = 'Ready' } = {}) {
  let value = 'Loading';
  setTimeout(() => {
    value = text;
  }, delayMs);

  return {
    getText() {
      return value;
    },
    /**
     * Dynamic wait — รอเงื่อนไขแทนการ sleep ตายตัว
     */
    async waitForText(expected, { timeoutMs = 1000, pollMs = 10 } = {}) {
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        if (this.getText() === expected) return expected;
        await new Promise((r) => setTimeout(r, pollMs));
      }
      throw new Error(`Timed out waiting for "${expected}". Last value: "${this.getText()}"`);
    },
  };
}
