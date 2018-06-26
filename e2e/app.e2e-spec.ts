import { AppPage } from './app.po';

describe('site App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('Connect', () => {
    expect(true).toBeTruthy();
  });
});
