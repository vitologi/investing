import {OpenexchangeratesProvider} from "../openexchangerates.provider";

jest.mock("../../utils/parse-to-timestamp", () => ({
  __esModule: true,
  parseToTimestamp: (input: number) => input.toString()
}))

describe('OpenexchangeratesProvider', () => {
  let provider: OpenexchangeratesProvider;

  beforeEach(() => {
    provider = new OpenexchangeratesProvider();
  })

  test('getExchangeRates (should produce error if token was not set)', async () => {
    await expect(provider.getExchangeRates()).rejects.toThrowError("Token hasn't been set");
  });

  test('getExchangeRates (should return proper value)', async () => {
    const date = new Date('2023-04-30');
    const spy = jest.spyOn(global, 'fetch')
      .mockResolvedValue(new Response(
        JSON.stringify({
          disclaimer: 'disclaimer',
          license: 'license',
          timestamp: date.getTime() / 1000, // 1682876102,
          base: 'USD',
          rates: {'EUR': 0.9,}
        }),
        {
          status: 200,
          statusText: "success",
        })
      );

    provider.setSecureToken('TOKEN');

    await expect(provider.getExchangeRates(date)).resolves.toEqual({
      "_id": date.getTime().toString(),
      "base": "USD",
      "rates": {"EUR": 0.9},
      "timestamp": date.getTime().toString(),
    });

    expect(spy).toHaveBeenCalledWith(
      "https://openexchangerates.org/api/historical/2023-04-30.json?app_id=TOKEN&show_alternative=false&prettyprint=false"
    );
  });

  test('getExchangeRates (should return error if api is not available)', async () => {
    jest.spyOn(global, 'fetch')
      .mockResolvedValue(new Response(null, {status: 500, statusText: "Error text"}));

    provider.setSecureToken('TOKEN');

    await expect(provider.getExchangeRates()).rejects.toThrowError("Error text");
  });

  test('getExchangeRates (should use current date if nothing have been provided)', async () => {
    const spy = jest.spyOn(global, 'fetch')
      .mockResolvedValue(new Response(null, {status: 400, statusText: "Error text"}));

    provider.setSecureToken('TOKEN');

    try {
      await provider.getExchangeRates();
    }catch (_){
      //
    }

    expect(spy).toHaveBeenCalledWith(
      `https://openexchangerates.org/api/historical/${
        new Date().toISOString().split('T')[0]
      }.json?app_id=TOKEN&show_alternative=false&prettyprint=false`
    );
  });


});

// export class OpenexchangeratesProvider implements ICurrencyRatesProvider {
//   private url = 'https://openexchangerates.org/api/historical/DATE_VAR.json?app_id=TOKEN_VAR&show_alternative=false&prettyprint=false'
//   private token: string | null = null;
//
//   setSecureToken(token: string): void {
//     this.token = token;
//   }
//
//   getExchangeRates(date: Date = new Date()): Promise<ICurrencyRateDto | null> {
//     if (!this.token) {
//       throw new Error(`Token hasn't been set`);
//     }
//
//     const url = this.url.replace(/\b(?:DATE_VAR|TOKEN_VAR)\b/gi, matched => ({
//       DATE_VAR: date.toISOString().split('T')[0],
//       TOKEN_VAR: this.token
//     })[matched] || '');
//
//     return fetch(url)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(response.statusText)
//         }
//
//         return response.json() as Promise<IOpenexchangeratesDto>;
//       })
//       .then(this.parseResponse);
//   }
//
//   private parseResponse(data: IOpenexchangeratesDto): ICurrencyRateDto {
//     const {timestamp: responseTimestamp, base, rates} = data;
//     const timestamp = parseToTimestamp(responseTimestamp * 1000);
//     return {
//       _id: timestamp.toString(),
//       timestamp,
//       base,
//       rates,
//     };
//   }
//
// }
