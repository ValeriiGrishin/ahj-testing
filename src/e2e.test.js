const puppeteer = require('puppeteer');

jest.setTimeout(30000);

describe('Credit Card Validator E2E', () => {
  let browser = null;
  let page = null;
  const baseUrl = 'http://localhost:9000';

  beforeAll(async () => {
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ],
      headless: true,
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  beforeEach(async () => {
    await page.goto(baseUrl);
  });

  describe('UI tests', () => {
    test('should have label element for card input', async () => {
      const label = await page.$('label[for="card-input"]');
      expect(label).not.toBeNull();

      const labelText = await page.$eval(
        'label[for="card-input"]',
        (el) => el.textContent
      );
      expect(labelText).toBe('Номер карты');
    });

    test('should have all form labels', async () => {
      const labels = await page.$$('label');
      expect(labels.length).toBeGreaterThan(0);

      const labelFor = await page.$eval('label', (el) => el.getAttribute('for'));
      expect(labelFor).toBe('card-input');
    });

    test('should display label text correctly', async () => {
      const isLabelVisible = await page.$eval('label[for="card-input"]', (el) => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
      expect(isLabelVisible).toBe(true);
    });
  });

  describe('Validation tests', () => {
    test('валидный номер карты Visa', async () => {
      await page.type('#card-input', '4111111111111111');
      await page.click('button');
      
      await page.waitForSelector('#result');
      const resultText = await page.$eval('#result', el => el.textContent);
      
      expect(resultText).toContain('действительна');
      expect(resultText).toContain('Visa');
    });

    test('валидный номер MasterCard', async () => {
      await page.type('#card-input', '5555555555554444');
      await page.click('button');
      
      await page.waitForSelector('#result');
      const resultText = await page.$eval('#result', el => el.textContent);
      
      expect(resultText).toContain('действительна');
      expect(resultText).toContain('MasterCard');
    });

    test('валидный номер МИР', async () => {
      await page.type('#card-input', '2201382000000013');
      await page.click('button');
      
      await page.waitForSelector('#result');
      const resultText = await page.$eval('#result', el => el.textContent);
      
      expect(resultText).toContain('действительна');
      expect(resultText).toContain('МИР');
    });

    test('невалидный номер карты', async () => {
      await page.type('#card-input', '1234567890123456');
      await page.click('button');
      
      await page.waitForSelector('#result');
      const resultText = await page.$eval('#result', el => el.textContent);
      
      expect(resultText).toContain('Недействительный');
    });

    test('пустой ввод', async () => {
      await page.click('button');
      
      await page.waitForSelector('#result');
      const resultText = await page.$eval('#result', el => el.textContent);
      
      expect(resultText).toContain('Введите номер карты');
    });

    test('номер с пробелами', async () => {
      await page.type('#card-input', '4111 1111 1111 1111');
      await page.click('button');
      
      await page.waitForSelector('#result');
      const resultText = await page.$eval('#result', el => el.textContent);
      
      expect(resultText).toContain('действительна');
    });
  });
});