import '@testing-library/jest-dom/extend-expect'
import { render, screen, fireEvent, getByText } from '@testing-library/react';
import Explorer, { SAT2BTC, Pager} from './Explorer';
import App from './App'

test('renders loading text', () => {
  render(<Explorer />);
  const linkElement = screen.getByText(/Loading.../i);
  expect(linkElement).toBeInTheDocument();
});

test('renders pager text', () => {
  render(<Pager count={100} />);
  const linkElement = screen.getByText(/\[10\]/i);
  expect(linkElement).toBeInTheDocument();
});

test('click test', () => {
  const fakeUserResponse = {token: 'fake_user_token'}
  let fetch = window.fetch;

  render(<App />);
  let input = screen.getByPlaceholderText(/Type Block Hash Here/i);

  jest.spyOn(window, 'fetch').mockImplementationOnce((url, ...args) => {
    let hash = url.indexOf(input.value)>-1;
    // console.log("fetch args", hash, input.value)
    expect(hash).toBe(true);
    return fetch(args)
  });
  
  fireEvent.keyDown( input, { key: 'Enter', code: 'Enter' } )
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

test('test SAT2BTC', () => {
  let btc = SAT2BTC(80000);
  expect(btc).toBe("0.00080000");
  let btc1 = SAT2BTC(100000000);
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
