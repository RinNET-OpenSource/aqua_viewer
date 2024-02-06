import { ToDatePipe } from './to-date.pipe';

describe('ToLocaleDateStringPipe', () => {
  it('create an instance', () => {
    const pipe = new ToDatePipe();
    expect(pipe).toBeTruthy();
  });
});
