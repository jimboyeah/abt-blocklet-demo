import { render, screen } from '@testing-library/react';
import App, { formatBTC, Pager} from './Explorer';
import '@testing-library/jest-dom/extend-expect'

test('renders loading text', () => {
  render(<App />);
  const linkElement = screen.getByText(/Loading.../i);
  expect(linkElement).toBeInTheDocument();
});

test('renders pager text', () => {
  render(<Pager count={100} />);
  const linkElement = screen.getByText(/\[10\]/i);
  expect(linkElement).toBeInTheDocument();
});

// test('test to fetch block rawdata', () => {
//   const fakeUserResponse = {token: 'fake_user_token'}
//   jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
//     return Promise.resolve({
//       json: () => Promise.resolve(fakeUserResponse),
//     })
//   });
//   loadBlock('b15bb075d22c8a276bd7b8a29f60229702119acfe995905835dc26c0107d0424')
//   .then(json => {
//     expect(json.token).toBe(fakeUserResponse.token);
//   });
// });

test('test formatBTC', () => {
  let btc = formatBTC(80000);
  expect(btc).toBe("0.00080000");
  let btc1 = formatBTC(100000000);
  expect(btc1).toBe("1.00000000");
});

// this is just a little hack to silence a warning that we'll get until we
// upgrade to 16.9. See also: https://github.com/facebook/react/pull/14853
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
