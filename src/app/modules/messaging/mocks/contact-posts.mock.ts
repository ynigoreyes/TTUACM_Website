export interface ContactPosts {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export const FakeMessage: ContactPosts = {
  name: 'Big Hero 6',
  email: 'Big6@gmail.com',
  topic: 'Heroes!!',
  message: 'I just want to check in on my heroes!'
};
