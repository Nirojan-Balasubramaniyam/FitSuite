import { RequestFilterPipe } from './request-filter.pipe';

describe('RequestFilterPipe', () => {
  it('create an instance', () => {
    const pipe = new RequestFilterPipe();
    expect(pipe).toBeTruthy();
  });
});
