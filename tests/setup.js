import { afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';

afterAll(async () => {
  const test_data_dir = path.join(__dirname, 'data');
  
  try {
    if (fs.existsSync(test_data_dir)) {
      await fs.promises.rm(test_data_dir, { recursive: true, force: true });
      console.log('Global cleanup: All test data removed');
    }
  } catch (err) {
    console.warn('Global cleanup error:', err.message);
  }
});